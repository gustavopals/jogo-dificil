import { describe, expect, it } from "vitest";

import { LEVEL_01 } from "../src/data/levels";
import {
  createLevelStartCheckpoint,
  findTouchedCheckpoint,
  isTouchingExit,
  rectsOverlap,
} from "../src/game/systems/level-progress";

describe("level progress", () => {
  it("creates a start checkpoint from level spawn data", () => {
    expect(createLevelStartCheckpoint(LEVEL_01)).toEqual({
      id: "level-01-start",
      levelId: "level-01",
      x: LEVEL_01.spawn.x,
      y: LEVEL_01.spawn.y,
    });
  });

  it("finds a touched checkpoint that is not already active", () => {
    const checkpoint = LEVEL_01.checkpoints[0]!;

    expect(
      findTouchedCheckpoint(
        {
          x: checkpoint.area.x + 4,
          y: checkpoint.area.y + 4,
          width: 8,
          height: 8,
        },
        LEVEL_01.checkpoints,
        "level-01-start",
      )?.id,
    ).toBe(checkpoint.id);

    expect(
      findTouchedCheckpoint(
        checkpoint.area,
        LEVEL_01.checkpoints,
        checkpoint.id,
      ),
    ).toBeUndefined();
  });

  it("detects exit contact", () => {
    expect(isTouchingExit(LEVEL_01.exit.area, LEVEL_01)).toBe(true);
    expect(
      isTouchingExit(
        {
          x: 0,
          y: 0,
          width: 8,
          height: 8,
        },
        LEVEL_01,
      ),
    ).toBe(false);
  });

  it("checks rectangle overlap", () => {
    expect(
      rectsOverlap(
        {
          x: 0,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          x: 8,
          y: 8,
          width: 16,
          height: 16,
        },
      ),
    ).toBe(true);
    expect(
      rectsOverlap(
        {
          x: 0,
          y: 0,
          width: 16,
          height: 16,
        },
        {
          x: 16,
          y: 0,
          width: 16,
          height: 16,
        },
      ),
    ).toBe(false);
  });
});
