import { describe, expect, it } from "vitest";

import {
  getLevelDefinition,
  getRequiredLevelDefinition,
  LEVEL_DEFINITIONS,
  validateLevels,
} from "../src/data/levels";

describe("level registry", () => {
  it("exports valid level definitions", () => {
    expect(validateLevels(LEVEL_DEFINITIONS)).toEqual({
      isValid: true,
      issues: [],
    });
  });

  it("exports the initial levels in campaign order", () => {
    expect(
      LEVEL_DEFINITIONS.map((level) => ({
        id: level.id,
        order: level.order,
        nextLevelId:
          "nextLevelId" in level.exit ? level.exit.nextLevelId : undefined,
      })),
    ).toEqual([
      {
        id: "level-01",
        order: 1,
        nextLevelId: "level-02",
      },
      {
        id: "level-02",
        order: 2,
        nextLevelId: "level-03",
      },
      {
        id: "level-03",
        order: 3,
        nextLevelId: undefined,
      },
    ]);
  });

  it("returns the requested level definition", () => {
    expect(getLevelDefinition("level-01")?.id).toBe("level-01");
    expect(
      getRequiredLevelDefinition("level-01").terrain.length,
    ).toBeGreaterThan(0);
  });

  it("throws when a required level is missing", () => {
    expect(() => getRequiredLevelDefinition("missing-level")).toThrow(
      'Level definition "missing-level" was not found.',
    );
  });
});
