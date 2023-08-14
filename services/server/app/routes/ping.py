from fastapi import APIRouter, Depends

from app.config import Settings, load_config

router = APIRouter()

@router.get("/ping")
async def pong(settings: Settings = Depends(load_config)):
    return {
        "ping": "pong!",
        "environment": settings.APP_ENVIRONMENT,
        "testing": settings.TESTING,
    }