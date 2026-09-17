/** Identity of this showcase build, embedded by next.config.ts. */
export const buildInfo = {
  version: process.env.MOSAIK_BUILD_VERSION ?? "unknown",
  revision: process.env.MOSAIK_BUILD_REVISION ?? "unknown",
  dirty: process.env.MOSAIK_BUILD_DIRTY === "true",
  mode: process.env.MOSAIK_BUILD_MODE ?? "unknown",
};
