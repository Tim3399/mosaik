// Single source for local ports and URLs. The launcher, the production preview and the browser
// tests all read these values, so an override reaches every consumer.
export const HOST = "127.0.0.1";
const DEFAULT_SHOWCASE_PORT = 3310;

function readPort(variable, fallback) {
  const raw = process.env[variable];
  if (raw === undefined || raw === "") return fallback;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${variable} must be an integer between 1 and 65535, got "${raw}"`);
  }
  return port;
}

/** Resolves the showcase address; throws a readable error for an invalid override. */
export function loadShowcaseConfig() {
  const port = readPort("MOSAIK_SHOWCASE_PORT", DEFAULT_SHOWCASE_PORT);
  return { host: HOST, port, url: `http://${HOST}:${port}` };
}
