import { ScenarioExplorer } from "@/components/scenario-explorer";
import { StudioShell } from "@/components/studio-shell";
import {
  getEntityOptions,
  getScenarioPayload,
} from "@/lib/server-data";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ScenariosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedEntity =
    typeof params.entity === "string" ? params.entity : undefined;
  const [options, scenario] = await Promise.all([
    getEntityOptions(),
    getScenarioPayload(requestedEntity),
  ]);

  return (
    <StudioShell
      currentPath="/scenarios"
      currentSlug={scenario.entity.slug}
      options={options}
    >
      <ScenarioExplorer entityName={scenario.entity.name} points={scenario.points} />
    </StudioShell>
  );
}
