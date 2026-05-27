import { describe, expect, it } from "vitest";

import { LEVEL_01 } from "../src/data/levels";
import type { LevelDefinition } from "../src/data/levels/schema";
import {
  createActiveCheckpointFromDefinition,
  createLevelStartCheckpoint,
  findTouchedCheckpoint,
  isTouchingExit,
  rectsOverlap,
  resolveCheckpointInitialEnergy,
  resolveLevelInitialEnergy,
} from "../src/game/systems/level-progress";
import { DEFAULT_PLAYER_INITIAL_ENERGY } from "../src/shared";

describe("level progress", () => {
  it("creates a start checkpoint from level spawn data", () => {
    expect(createLevelStartCheckpoint(LEVEL_01)).toEqual({
      id: "level-01-start",
      levelId: "level-01",
      x: LEVEL_01.spawn.x,
      y: LEVEL_01.spawn.y,
      initialEnergy: DEFAULT_PLAYER_INITIAL_ENERGY,
    });
  });

  it("resolves initial energy from level defaults and checkpoint overrides", () => {
    const level = {
      ...LEVEL_01,
      initialEnergy: 55,
      checkpoints: [
        {
          ...LEVEL_01.checkpoints[0]!,
          initialEnergy: 85,
        },
      ],
    } satisfies LevelDefinition;
    const checkpoint = level.checkpoints[0]!;

    expect(resolveLevelInitialEnergy(level)).toBe(55);
    expect(resolveCheckpointInitialEnergy(level, checkpoint)).toBe(85);
    expect(createLevelStartCheckpoint(level).initialEnergy).toBe(55);
    expect(createActiveCheckpointFromDefinition(level, checkpoint)).toEqual({
      id: checkpoint.id,
      levelId: level.id,
      x: checkpoint.position.x,
      y: checkpoint.position.y,
      initialEnergy: 85,
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
