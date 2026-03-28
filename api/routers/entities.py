from __future__ import annotations

from fastapi import APIRouter

from api.models import EntityRecord
from api.repository import get_entity, list_entities


router = APIRouter(prefix="/api/v1/entities", tags=["entities"])


@router.get("", response_model=list[EntityRecord])
def list_entity_records() -> list[EntityRecord]:
    return list_entities()


@router.get("/{entity_id}", response_model=EntityRecord)
def get_entity_record(entity_id: str) -> EntityRecord:
    return get_entity(entity_id)

