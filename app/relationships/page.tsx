import { OwnershipGraph } from "@/components/ownership-graph";
import { StudioShell } from "@/components/studio-shell";
import {
  getEntityBySlug,
  getEntities,
  getEntityOptions,
  getOwnershipPayload,
} from "@/lib/server-data";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RelationshipsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const requestedEntity =
    typeof params.entity === "string" ? params.entity : undefined;
  const [entities, options, entity, ownership] = await Promise.all([
    getEntities(),
    getEntityOptions(),
    getEntityBySlug(requestedEntity),
    getOwnershipPayload(requestedEntity),
  ]);

  const relatedEntityIds = new Set<string>([
    entity.id,
    ...ownership.data.flatMap((edge) => [edge.sourceId, edge.targetId]),
  ]);
  const relatedEntities = entities.filter((item) => relatedEntityIds.has(item.id));

  return (
    <StudioShell
      currentPath="/relationships"
      currentSlug={entity.slug}
      options={options}
    >
      <OwnershipGraph
        entity={entity}
        entities={relatedEntities}
        edges={ownership.data}
      />
    </StudioShell>
  );
}
