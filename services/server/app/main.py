import logging
import shutil
from pathlib import Path

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse

from app.routes import ping, companies, products

log = logging.getLogger("uvicorn")


def create_application() -> FastAPI:
    application = FastAPI()

    application.include_router(ping.router)
    application.include_router(products.router, prefix="/products", tags=["products"])
    application.include_router(
        companies.router, prefix="/companies", tags=["companies"]
    )

    return application


app = create_application()


@app.get("/")
def read_root():
    raise HTTPException(
        status_code=302,
        headers={"Location": "/docs"},
    )


@app.post("/upload/")
async def upload_image(image: UploadFile = File(...)):
    image_path = Path(f"uploaded_images/{image.filename}")
    with image_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return JSONResponse(
        content={"message": "Image uploaded successfully!", "filename": image.filename}
    )


@app.on_event("startup")
async def startup_event():
    log.info("Starting up...")


@app.on_event("shutdown")
async def shutdown_event():
    log.info("Shutting down...")
