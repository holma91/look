from celery import Celery
from project import create_app

app = create_app()


BROKER = "redis://127.0.0.1:6379/0"
BACKEND = "redis://127.0.0.1:6379/0"

celery = Celery(
    __name__,
    broker=BROKER,
    backend=BACKEND,
)


@celery.task
def divide(x, y):
    import time

    time.sleep(5)
    return x / y
