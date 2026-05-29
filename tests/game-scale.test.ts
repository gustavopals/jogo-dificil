import { describe, expect, it } from "vitest";

import { GAME_RESOLUTION, TILE_SIZE_PX } from "../src/game/constants";
import {
  LEGACY_GAME_RESOLUTION,
  LEGACY_TILE_SIZE_PX,
  getResolutionScale,
  getTileScaleFactor,
  scaleLegacyFontPx,
  scaleLegacyPx,
  scaleLegacyX,
  scaleLegacyY,
} from "../src/game/scale";

describe("game scale helpers", () => {
  it("keeps legacy baseline constants stable for migration math", () => {
    expect(LEGACY_GAME_RESOLUTION).toEqual({
      width: 480,
      height: 270,
    });
    expect(LEGACY_TILE_SIZE_PX).toBe(16);
  });

  it("derives resolution and tile scale factors from current constants", () => {
    expect(GAME_RESOLUTION).toEqual({
      width: 960,
      height: 540,
    });
    expect(TILE_SIZE_PX).toBe(32);
    expect(getResolutionScale()).toEqual({
      x: 2,
      y: 2,
      uniform: 2,
    });
    expect(getTileScaleFactor()).toBe(2);
  });

  it("scales legacy pixel values deterministically for runtime layout", () => {
    expect(scaleLegacyX(6)).toBe(12);
    expect(scaleLegacyY(5)).toBe(10);
    expect(scaleLegacyPx(18)).toBe(36);
    expect(scaleLegacyFontPx(10)).toBe("20px");
  });

  it("guards against non-finite values in conversion helpers", () => {
    expect(scaleLegacyX(Number.NaN)).toBe(0);
    expect(scaleLegacyY(Number.POSITIVE_INFINITY)).toBe(0);
    expect(scaleLegacyPx(Number.NEGATIVE_INFINITY)).toBe(0);
    expect(scaleLegacyFontPx(Number.NaN)).toBe("0px");
  });
});
