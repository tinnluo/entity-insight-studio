import { getEntityOptions } from "@/lib/server-data";

export async function GET() {
  const options = await getEntityOptions();
  return Response.json(options);
}
