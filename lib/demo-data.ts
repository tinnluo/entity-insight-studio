import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  AssetRecord,
  EntityOption,
  EntityRecord,
  OverviewPayload,
  OwnershipEdge,
  OwnershipPayload,
  ScenarioPayload,
  ScenarioPoint,
} from "@/types/demo";

export const DEFAULT_ENTITY_SLUG = "aster-grid-holdings";

type Dataset = {
  entities: EntityRecord[];
  assets: AssetRecord[];
  ownership: OwnershipEdge[];
  scenarios: ScenarioPoint[];
};

let datasetPromise: Promise<Dataset> | null = null;

async function readFixtureFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(process.cwd(), "public", "demo-data", fileName);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

function validateDataset(dataset: Dataset) {
  const entityIds = new Set(dataset.entities.map((entity) => entity.id));

  if (!entityIds.has(DEFAULT_ENTITY_SLUG)) {
    throw new Error(`Default entity "${DEFAULT_ENTITY_SLUG}" is missing`);
  }

  for (const asset of dataset.assets) {
    if (!entityIds.has(asset.entityId)) {
      throw new Error(`Asset "${asset.assetId}" references unknown entity`);
    }
  }

  for (const edge of dataset.ownership) {
    if (
      !entityIds.has(edge.rootId) ||
      !entityIds.has(edge.sourceId) ||
      !entityIds.has(edge.targetId)
    ) {
      throw new Error("Ownership data references an unknown entity");
    }
  }

  for (const point of dataset.scenarios) {
    if (!entityIds.has(point.entityId)) {
      throw new Error(`Scenario row for year ${point.year} has unknown entity`);
    }
  }
}

async function loadDataset(): Promise<Dataset> {
  if (!datasetPromise) {
    datasetPromise = Promise.all([
      readFixtureFile<EntityRecord[]>("entities.json"),
      readFixtureFile<AssetRecord[]>("assets.json"),
      readFixtureFile<OwnershipEdge[]>("ownership.json"),
      readFixtureFile<ScenarioPoint[]>("scenarios.json"),
    ]).then(([entities, assets, ownership, scenarios]) => {
      const dataset = { entities, assets, ownership, scenarios };
      validateDataset(dataset);
      return dataset;
    });
  }

  return datasetPromise;
}

export async function getEntities(): Promise<EntityRecord[]> {
  const { entities } = await loadDataset();
  return entities;
}

export async function getEntityOptions(): Promise<EntityOption[]> {
  const entities = await getEntities();

  return entities.map((entity) => ({
    id: entity.id,
    label: entity.name,
    value: entity.slug,
  }));
}

export async function getEntityBySlug(slug?: string) {
  const { entities } = await loadDataset();
  return (
    entities.find((entity) => entity.slug === slug) ||
    entities.find((entity) => entity.slug === DEFAULT_ENTITY_SLUG)!
  );
}

export async function getOverviewPayload(slug?: string): Promise<OverviewPayload> {
  const { assets, ownership } = await loadDataset();
  const entity = await getEntityBySlug(slug);
  const entityAssets = assets.filter((asset) => asset.entityId === entity.id);
  const footprintMap = new Map<string, { region: string; assets: number; capacityMw: number }>();

  for (const asset of entityAssets) {
    const current = footprintMap.get(asset.region) ?? {
      region: asset.region,
      assets: 0,
      capacityMw: 0,
    };

    current.assets += 1;
    current.capacityMw += asset.capacityMw;
    footprintMap.set(asset.region, current);
  }

  const relatedEdges = ownership.filter((edge) => edge.rootId === entity.id);
  const ownerEdges = relatedEdges.filter((edge) => edge.category === "owner");
  const concentrationPct = ownerEdges
    .map((edge) => edge.percentage)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((sum, value) => sum + value, 0);

  return {
    entity,
    assets: entityAssets,
    footprint: Array.from(footprintMap.values()).sort(
      (left, right) => right.capacityMw - left.capacityMw,
    ),
    ownershipSummary: {
      ownerCount: ownerEdges.length,
      subsidiaryCount: relatedEdges.filter((edge) => edge.category === "subsidiary")
        .length,
      concentrationPct,
    },
  };
}

export async function getOwnershipPayload(
  slug?: string,
): Promise<OwnershipPayload> {
  const { ownership } = await loadDataset();
  const entity = await getEntityBySlug(slug);
  const data = ownership.filter((edge) => edge.rootId === entity.id);

  return {
    data,
    rawData: data,
    totalRecords: data.length,
    layerLimitation:
      "Fixture-backed direct owners and controlled entities retained for the demo graph.",
  };
}

export async function getScenarioPayload(slug?: string): Promise<ScenarioPayload> {
  const { scenarios } = await loadDataset();
  const entity = await getEntityBySlug(slug);
  const points = scenarios
    .filter((point) => point.entityId === entity.id)
    .sort((left, right) => left.year - right.year);

  return { entity, points };
}
