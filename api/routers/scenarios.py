from __future__ import annotations

from fastapi import APIRouter, Query

from api.models import ScenarioPayload
from api.repository import DEFAULT_ENTITY_ID, get_scenarios


router = APIRouter(prefix="/api/v1/scenarios", tags=["scenarios"])


@router.get("", response_model=ScenarioPayload)
def get_scenario_series(entity: str = Query(default=DEFAULT_ENTITY_ID)) -> ScenarioPayload:
    return get_scenarios(entity)

