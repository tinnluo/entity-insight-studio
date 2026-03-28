from __future__ import annotations

from fastapi import APIRouter, Query

from api.models import OwnershipPayload
from api.repository import DEFAULT_ENTITY_ID, get_ownership


router = APIRouter(prefix="/api/v1/ownership", tags=["ownership"])


@router.get("", response_model=OwnershipPayload)
def get_ownership_graph(entity: str = Query(default=DEFAULT_ENTITY_ID)) -> OwnershipPayload:
    return get_ownership(entity)

