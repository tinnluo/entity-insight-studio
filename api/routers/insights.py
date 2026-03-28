from __future__ import annotations

from fastapi import APIRouter, Query

from api.models import OverviewPayload
from api.repository import DEFAULT_ENTITY_ID, get_overview


router = APIRouter(prefix="/api/v1/insights", tags=["insights"])


@router.get("", response_model=OverviewPayload)
def get_insights(entity: str = Query(default=DEFAULT_ENTITY_ID)) -> OverviewPayload:
    return get_overview(entity)

