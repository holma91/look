from fastapi import APIRouter


router = APIRouter()


@router.get("/")
async def get_summaries() -> dict:
    response_object = {
        "id": 1,
        "url": ""
    }

    return response_object