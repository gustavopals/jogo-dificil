import { describe, expect, it } from "vitest";

import { LEVEL_01 } from "../src/data/levels";
import {
  getSolidTerrainAreas,
  getTerrainPlaceholderColor,
} from "../src/game/systems/level-terrain";

describe("level terrain", () => {
  it("derives solid collision rectangles from level terrain data", () => {
    expect(getSolidTerrainAreas(LEVEL_01)).toEqual(
      LEVEL_01.terrain.map((terrain) => terrain.area),
    );
  });

  it("returns placeholder colors by terrain kind", () => {
    expect(getTerrainPlaceholderColor(LEVEL_01.terrain[0]!)).toBe(0x314b57);
  });
});
