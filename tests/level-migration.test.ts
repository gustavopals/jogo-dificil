import { describe, expect, it } from "vitest";

import { LEVEL_01 } from "../src/data/levels/level-01";
import {
  LEVEL_DEFINITIONS,
  migrateLegacyLevelDefinition,
  validateLevels,
} from "../src/data/levels";

describe("level migration to HD runtime", () => {
  it("scales level-01 pilot from legacy map to 2x coordinates", () => {
    const migrated = migrateLegacyLevelDefinition(LEVEL_01);

    expect(migrated.bounds.width).toBe(LEVEL_01.bounds.width * 2);
    expect(migrated.bounds.height).toBe(LEVEL_01.bounds.height * 2);
    expect(migrated.spawn).toEqual({
      x: LEVEL_01.spawn.x * 2,
      y: LEVEL_01.spawn.y * 2,
    });
    expect(migrated.exit.area).toEqual({
      x: LEVEL_01.exit.area.x * 2,
      y: LEVEL_01.exit.area.y * 2,
      width: LEVEL_01.exit.area.width * 2,
      height: LEVEL_01.exit.area.height * 2,
    });
    expect(migrated.checkpoints[0]?.area).toEqual({
      x: LEVEL_01.checkpoints[0]!.area.x * 2,
      y: LEVEL_01.checkpoints[0]!.area.y * 2,
      width: LEVEL_01.checkpoints[0]!.area.width * 2,
      height: LEVEL_01.checkpoints[0]!.area.height * 2,
    });
    expect(migrated.terrain[0]?.area).toEqual({
      x: LEVEL_01.terrain[0]!.area.x * 2,
      y: LEVEL_01.terrain[0]!.area.y * 2,
      width: LEVEL_01.terrain[0]!.area.width * 2,
      height: LEVEL_01.terrain[0]!.area.height * 2,
    });
  });

  it("migrates all campaign levels to 960x540 baseline with tile-aligned bounds", () => {
    LEVEL_DEFINITIONS.forEach((level) => {
      expect(level.bounds.height).toBe(540);
      expect(level.bounds.width % 32, level.id).toBe(0);
      expect(level.spawn.y, level.id).toBeLessThanOrEqual(level.bounds.height);
    });
  });

  it("keeps level progression chain intact after migration", () => {
    const byId = Object.fromEntries(LEVEL_DEFINITIONS.map((level) => [level.id, level]));

    expect(byId["level-01"]?.exit.nextLevelId).toBe("level-02");
    expect(byId["level-02"]?.exit.nextLevelId).toBe("level-03");
    expect(byId["level-03"]?.exit.nextLevelId).toBe("level-04");
    expect(byId["level-04"]?.exit.nextLevelId).toBe("level-05");
    expect(byId["level-05"]?.exit.nextLevelId).toBe("level-06");
    expect(byId["level-06"]?.exit.nextLevelId).toBe("level-07");
    expect(byId["level-07"]?.exit.nextLevelId).toBe("level-08");
    expect(byId["level-08"]?.exit.nextLevelId).toBe("level-09");
    expect(byId["level-09"]?.exit.nextLevelId).toBe("level-10");
    expect(byId["level-10"]?.exit.nextLevelId).toBe("level-11");
    expect(byId["level-11"]?.exit.nextLevelId).toBeUndefined();
  });

  it("keeps migrated levels valid by schema and references", () => {
    expect(validateLevels(LEVEL_DEFINITIONS)).toEqual({
      isValid: true,
      issues: [],
    });
  });
});
