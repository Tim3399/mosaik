const HEX_COLOR = /^#?([0-9a-f]{6})$/i;

/**
 * Normalizes an opaque hex color to lowercase `#rrggbb`. Accepts the value with or without the
 * leading `#` and surrounding whitespace. Returns `null` for anything else, including shorthand
 * `#rgb` and colors with alpha, which v1 deliberately does not accept.
 */
export function normalizeHexColor(input: string): string | null {
  const match = HEX_COLOR.exec(input.trim());
  return match ? `#${match[1]?.toLowerCase()}` : null;
}
