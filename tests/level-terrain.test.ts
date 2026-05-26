import { describe, expect, it } from "vitest";

import { PLACEHOLDER_TILESET_ASSET_KEYS } from "../src/data/art";
import { LEVEL_01 } from "../src/data/levels";
import {
  getSolidTerrainAreas,
  getTerrainPlaceholderColor,
  getTerrainPlaceholderTextureKey,
} from "../src/game/systems/level-terrain";

describe("level terrain", () => {
  it("derives solid collision rectangles from level terrain data", () => {
    expect(getSolidTerrainAreas(LEVEL_01)).toEqual(
      LEVEL_01.terrain.map((terrain) => terrain.area),
    );
  });

  it("returns placeholder colors by terrain kind", () => {
    expect(getTerrainPlaceholderColor(LEVEL_01.terrain[0]!)).toBe(0x3f4958);
  });

  it("uses solid blocks for walls and platform tiles for thin floors", () => {
    expect(getTerrainPlaceholderTextureKey(LEVEL_01.terrain[0]!)).toBe(
      PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK,
    );
    expect(getTerrainPlaceholderTextureKey(LEVEL_01.terrain[2]!)).toBe(
      PLACEHOLDER_TILESET_ASSET_KEYS.PLATFORM,
    );
  });
});
