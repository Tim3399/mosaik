import { buildInfo } from "../../../build-info";

// Readiness probe for the local launcher and tests. The launch id proves that the response
// comes from the process that was just started, not from another server on the same port.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    service: "mosaik-showcase",
    launchId: process.env.MOSAIK_LAUNCH_ID ?? null,
    ...buildInfo,
  });
}
