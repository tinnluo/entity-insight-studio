import "server-only";

import { cache } from "react";
import {
  DEFAULT_ENTITY_SLUG,
  getEntities as getFixtureEntities,
  getOverviewPayload as getFixtureOverviewPayload,
  getOwnershipPayload as getFixtureOwnershipPayload,
  getScenarioPayload as getFixtureScenarioPayload,
} from "@/lib/demo-data";
import type {
  EntityOption,
  EntityRecord,
  OverviewPayload,
  OwnershipPayload,
  ScenarioPayload,
} from "@/types/demo";

function isApiModeEnabled() {
  const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;
  return process.env.USE_API === "true" && Boolean(apiBaseUrl);
}

function getApiBaseUrl() {
  const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("API mode is enabled but no backend base URL is configured.");
  }

  return apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`;
}

async function fetchFromApi<T>(pathname: string, searchParams?: URLSearchParams) {
  const url = new URL(pathname.replace(/^\//, ""), getApiBaseUrl());

  if (searchParams) {
    url.search = searchParams.toString();
  }

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`FastAPI request failed for ${url.pathname}: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const getEntities = cache(async (): Promise<EntityRecord[]> => {
  if (!isApiModeEnabled()) {
    return getFixtureEntities();
  }

  return fetchFromApi<EntityRecord[]>("/api/v1/entities");
});

const resolveEntitySlug = cache(async (slug?: string) => {
  const entities = await getEntities();
  const requested = entities.find((entity) => entity.slug === slug);

  return requested?.slug ?? DEFAULT_ENTITY_SLUG;
});

export const getEntityOptions = cache(async (): Promise<EntityOption[]> => {
  const entities = await getEntities();

  return entities.map((entity) => ({
    id: entity.id,
    label: entity.name,
    value: entity.slug,
  }));
});

export const getEntityBySlug = cache(async (slug?: string) => {
  const resolvedSlug = await resolveEntitySlug(slug);
  const entities = await getEntities();
  return entities.find((entity) => entity.slug === resolvedSlug)!;
});

export const getOverviewPayload = cache(
  async (slug?: string): Promise<OverviewPayload> => {
    if (!isApiModeEnabled()) {
      return getFixtureOverviewPayload(slug);
    }

    const resolvedSlug = await resolveEntitySlug(slug);
    const searchParams = new URLSearchParams({ entity: resolvedSlug });
    return fetchFromApi<OverviewPayload>("/api/v1/insights", searchParams);
  },
);

export const getOwnershipPayload = cache(
  async (slug?: string): Promise<OwnershipPayload> => {
    if (!isApiModeEnabled()) {
      return getFixtureOwnershipPayload(slug);
    }

    const resolvedSlug = await resolveEntitySlug(slug);
    const searchParams = new URLSearchParams({ entity: resolvedSlug });
    return fetchFromApi<OwnershipPayload>("/api/v1/ownership", searchParams);
  },
);

export const getScenarioPayload = cache(
  async (slug?: string): Promise<ScenarioPayload> => {
    if (!isApiModeEnabled()) {
      return getFixtureScenarioPayload(slug);
    }

    const resolvedSlug = await resolveEntitySlug(slug);
    const searchParams = new URLSearchParams({ entity: resolvedSlug });
    return fetchFromApi<ScenarioPayload>("/api/v1/scenarios", searchParams);
  },
);

export { DEFAULT_ENTITY_SLUG };
