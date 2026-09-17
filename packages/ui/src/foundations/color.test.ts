import { describe, expect, it } from "vitest";
import { normalizeHexColor } from "./color.js";

describe("normalizeHexColor", () => {
  it.each([
    ["#1d4ed8", "#1d4ed8"],
    ["#1D4ED8", "#1d4ed8"],
    ["1d4ed8", "#1d4ed8"],
    ["  #abcdef  ", "#abcdef"],
  ])("accepts %j as %j", (input, expected) => {
    expect(normalizeHexColor(input)).toBe(expected);
  });

  it.each(["", "#", "#fff", "#1d4ed", "#1d4ed8ff", "#gggggg", "red", "rgb(0, 0, 0)"])(
    "rejects %j",
    (input) => {
      expect(normalizeHexColor(input)).toBeNull();
    },
  );
});
