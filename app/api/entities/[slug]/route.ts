import { getOverviewPayload } from "@/lib/server-data";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const overview = await getOverviewPayload(slug);
  return Response.json(overview);
}
