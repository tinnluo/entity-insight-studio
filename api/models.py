from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


class KPIRecord(BaseModel):
    recurringRevenueBillions: float
    trackedAssets: int
    controlledCapacityGw: float
    transitionScore: int
    portfolioIntensity: float
    yoyIntensityChangePct: int


class PeerComparisonPoint(BaseModel):
    label: str
    value: int


class EntityRecord(BaseModel):
    id: str
    slug: str
    name: str
    shortName: str
    sector: str
    region: str
    headquarters: str
    summary: str
    focus: str
    highlights: list[str]
    kpis: KPIRecord
    peerComparison: list[PeerComparisonPoint]


class AssetRecord(BaseModel):
    entityId: str
    assetId: str
    name: str
    country: str
    region: str
    technology: str
    status: str
    capacityMw: float
    emissionsIndex: float
    riskLevel: Literal["Low", "Moderate", "High"]


class OwnershipEdge(BaseModel):
    rootId: str
    sourceId: str
    targetId: str
    percentage: int
    category: Literal["owner", "subsidiary"]


class ScenarioPoint(BaseModel):
    entityId: str
    year: int
    actual: float
    committed: float
    accelerated: float
    benchmark15: float
    benchmark2: float
    capex: float


class FootprintRecord(BaseModel):
    region: str
    assets: int
    capacityMw: float


class OwnershipSummary(BaseModel):
    ownerCount: int
    subsidiaryCount: int
    concentrationPct: int


class OverviewPayload(BaseModel):
    entity: EntityRecord
    assets: list[AssetRecord]
    footprint: list[FootprintRecord]
    ownershipSummary: OwnershipSummary


class OwnershipPayload(BaseModel):
    data: list[OwnershipEdge]
    rawData: list[OwnershipEdge]
    totalRecords: int
    layerLimitation: str


class ScenarioPayload(BaseModel):
    entity: EntityRecord
    points: list[ScenarioPoint]

