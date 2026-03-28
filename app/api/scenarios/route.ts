import { getScenarioPayload } from "@/lib/server-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("entity") ?? undefined;
  const scenarios = await getScenarioPayload(slug);
  return Response.json(scenarios);
}
