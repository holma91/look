from fastapi import APIRouter, Depends

from app.config import DevelopmentConfig, load_config

router = APIRouter()


@router.get("/ping")
async def pong(config: DevelopmentConfig = Depends(load_config)):
    return {
        "ping": "pong!",
        "environment": config.APP_ENVIRONMENT,
        "testing": config.TESTING,
    }
