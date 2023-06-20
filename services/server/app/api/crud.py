from typing import Union, List

from app.models.pydantic import SummaryPayloadSchema
from app.models.tortoise import TextSummary

# could write raw SQL queries here instead of this BS

async def get(id: int) -> Union[dict, None]:
    summary = await TextSummary.filter(id=id).first().values()
    if summary:
        return summary
    return None

async def get_all() -> List:
    summaries = await TextSummary.all().values()
    return summaries

async def post(payload: SummaryPayloadSchema) -> int:
    summary = TextSummary(
        url=payload.url,
        summary="dummy summary",
    )
    await summary.save()
    return summary.id