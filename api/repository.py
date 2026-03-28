from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from fastapi import HTTPException
from pydantic import TypeAdapter

from api.config import get_fixtures_dir
from api.models import (
    AssetRecord,
    EntityRecord,
    FootprintRecord,
    OverviewPayload,
    OwnershipEdge,
    OwnershipPayload,
    OwnershipSummary,
    ScenarioPayload,
    ScenarioPoint,
)


DEFAULT_ENTITY_ID = "aster-grid-holdings"


@dataclass(frozen=True)
class Dataset:
    entities: list[EntityRecord]
    assets: list[AssetRecord]
    ownership: list[OwnershipEdge]
    scenarios: list[ScenarioPoint]


def _read_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def _validate_dataset(dataset: Dataset) -> None:
    entity_ids = {entity.id for entity in dataset.entities}

    if DEFAULT_ENTITY_ID not in entity_ids:
        raise RuntimeError(f'Default entity "{DEFAULT_ENTITY_ID}" is missing')

    for asset in dataset.assets:
        if asset.entityId not in entity_ids:
            raise RuntimeError(f'Asset "{asset.assetId}" references an unknown entity')

    for edge in dataset.ownership:
        if (
            edge.rootId not in entity_ids
            or edge.sourceId not in entity_ids
            or edge.targetId not in entity_ids
        ):
            raise RuntimeError("Ownership data references an unknown entity")

    for point in dataset.scenarios:
        if point.entityId not in entity_ids:
            raise RuntimeError(
                f"Scenario row for year {point.year} references an unknown entity"
            )


@lru_cache(maxsize=1)
def load_dataset() -> Dataset:
    fixtures_dir = get_fixtures_dir()
    if not fixtures_dir.exists():
        raise RuntimeError(f"Fixtures directory does not exist: {fixtures_dir}")

    dataset = Dataset(
        entities=TypeAdapter(list[EntityRecord]).validate_python(
            _read_json(fixtures_dir / "entities.json")
        ),
        assets=TypeAdapter(list[AssetRecord]).validate_python(
            _read_json(fixtures_dir / "assets.json")
        ),
        ownership=TypeAdapter(list[OwnershipEdge]).validate_python(
            _read_json(fixtures_dir / "ownership.json")
        ),
        scenarios=TypeAdapter(list[ScenarioPoint]).validate_python(
            _read_json(fixtures_dir / "scenarios.json")
        ),
    )
    _validate_dataset(dataset)
    return dataset


def list_entities() -> list[EntityRecord]:
    return load_dataset().entities


def get_entity(entity_id: str) -> EntityRecord:
    for entity in load_dataset().entities:
        if entity.id == entity_id:
            return entity

    raise HTTPException(status_code=404, detail=f'Unknown entity "{entity_id}"')


def get_overview(entity_id: str) -> OverviewPayload:
    dataset = load_dataset()
    entity = get_entity(entity_id)
    entity_assets = [asset for asset in dataset.assets if asset.entityId == entity.id]

    footprint_map: dict[str, FootprintRecord] = {}
    for asset in entity_assets:
        current = footprint_map.get(
            asset.region,
            FootprintRecord(region=asset.region, assets=0, capacityMw=0),
        )
        footprint_map[asset.region] = FootprintRecord(
            region=current.region,
            assets=current.assets + 1,
            capacityMw=current.capacityMw + asset.capacityMw,
        )

    related_edges = [edge for edge in dataset.ownership if edge.rootId == entity.id]
    owner_edges = [edge for edge in related_edges if edge.category == "owner"]
    concentration_pct = sum(
        sorted((edge.percentage for edge in owner_edges), reverse=True)[:2]
    )

    return OverviewPayload(
        entity=entity,
        assets=entity_assets,
        footprint=sorted(
            footprint_map.values(),
            key=lambda item: item.capacityMw,
            reverse=True,
        ),
        ownershipSummary=OwnershipSummary(
            ownerCount=len(owner_edges),
            subsidiaryCount=len(
                [edge for edge in related_edges if edge.category == "subsidiary"]
            ),
            concentrationPct=concentration_pct,
        ),
    )


def get_ownership(entity_id: str) -> OwnershipPayload:
    entity = get_entity(entity_id)
    data = [edge for edge in load_dataset().ownership if edge.rootId == entity.id]

    return OwnershipPayload(
        data=data,
        rawData=data,
        totalRecords=len(data),
        layerLimitation="Fixture-backed direct owners and controlled entities retained for the demo graph.",
    )


def get_scenarios(entity_id: str) -> ScenarioPayload:
    entity = get_entity(entity_id)
    points = sorted(
        [point for point in load_dataset().scenarios if point.entityId == entity.id],
        key=lambda point: point.year,
    )

    return ScenarioPayload(entity=entity, points=points)

