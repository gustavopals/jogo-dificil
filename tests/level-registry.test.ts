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

  it("exports campaign levels in order", () => {
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
        nextLevelId: "level-04",
      },
      {
        id: "level-04",
        order: 4,
        nextLevelId: "level-05",
      },
      {
        id: "level-05",
        order: 5,
        nextLevelId: "level-06",
      },
      {
        id: "level-06",
        order: 6,
        nextLevelId: "level-07",
      },
      {
        id: "level-07",
        order: 7,
        nextLevelId: "level-08",
      },
      {
        id: "level-08",
        order: 8,
        nextLevelId: "level-09",
      },
      {
        id: "level-09",
        order: 9,
        nextLevelId: "level-10",
      },
      {
        id: "level-10",
        order: 10,
        nextLevelId: "level-11",
      },
      {
        id: "level-11",
        order: 11,
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
