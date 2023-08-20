@router.post("/{user_id}/likes", status_code=201, response_model=POSTResponse)
async def add_like(user_id: str, product: LikeProduct) -> POSTResponse:
    product = await crud.add_like(user_id, product.product_url)
    if product is None:
        raise HTTPException(status_code=404, detail="User or Product not found!")

    return SUCCESSFUL_POST_RESPONSE


@router.delete("/{user_id}/likes", status_code=204)
async def delete_like(user_id: str, product: LikeProduct):
    result = await crud.un_like(user_id, product.product_url)
    if result is None:
        raise HTTPException(status_code=404, detail="User or Product not found!")


async def add_like(user_id: str, product_url: str) -> Optional[str]:
    async with get_db_connection() as conn:
        query = """
        update user_product set liked = TRUE where user_id = $1 and product_url = $2;
        """
        await conn.execute_query_dict(query, [user_id, product_url])

    return product_url


async def un_like(user_id: str, product_url: str) -> Optional[str]:
    async with get_db_connection() as conn:
        query = """
        update user_product set liked = FALSE where user_id = $1 and product_url = $2;
        """

        await conn.execute_query_dict(query, [user_id, product_url])

    return product_url


### CLERK WEBHOOK ROUTES ###

WEBHOOK_SECRET = os.environ.get("CLERK_WEBHOOK_SECRET")


@router.post("/")
async def handle_user(request: Request) -> dict:
    """
    Handles a user webhook from Clerk
    """
    # verify webhook signature
    headers = request.headers
    payload = await request.body()

    try:
        wh = Webhook(WEBHOOK_SECRET)
        msg = wh.verify(payload, headers)
    except WebhookVerificationError as e:
        log.info("Invalid webhook signature: %s", e)
        raise HTTPException(status_code=400, detail="Invalid payload type")

    body = await request.json()
    user_id = body["data"]["id"]

    if body["type"] == "user.created":
        await crud.create(user_id)
    elif body["type"] == "user.updated":
        await crud.update(user_id)
    elif body["type"] == "user.deleted":
        await crud.delete(user_id)
    else:
        log.info("Invalid payload type: %s", body["type"])
        raise HTTPException(status_code=400, detail="Invalid payload type")

    return {"message": "User with id {user_id} updated"}


TORTOISE_ORM = {
    "connections": {"default": os.environ.get("DATABASE_URL")},
    "apps": {
        "models": {
            "models": ["aerich.models"],
            "default_connection": "default",
        },
    },
}


def init_db(app: FastAPI) -> None:
    register_tortoise(
        app,
        db_url=os.environ.get("DATABASE_URL"),
        modules={"models": []},
        generate_schemas=False,
        add_exception_handlers=True,
    )


@asynccontextmanager
async def get_db_connection():
    conn = Tortoise.get_connection("default")
    try:
        yield conn
    finally:
        pass
        # await conn.close(), apparently this is done by Tortoise?


async def generate_schema() -> None:
    log.info("Initializing Tortoise...")

    await Tortoise.init(
        db_url=os.environ.get("DATABASE_URL"),
        # modules={"models": ["models.tortoise"]},
    )
    log.info("Generating database schema via Tortoise...")
    await Tortoise.generate_schemas()
    await Tortoise.close_connections()


# if we run this file directly, then we want to generate the schema
# maybe this is what we do in production?
if __name__ == "__main__":
    run_async(generate_schema())


class Settings(BaseSettings):
    environment: str = "dev"
    testing: bool = 0
    database_url: AnyUrl = None


@lru_cache()
def get_settings() -> BaseSettings:
    log.info("Loading config settings from the environment...")
    return Settings()
