import { describe, expect, it } from "vitest";

import {
  LEVEL_03,
  LEVEL_04,
  LEVEL_05,
  LEVEL_06,
  LEVEL_DEFINITIONS,
  type InteractiveObjectDefinition,
  type ItemDefinition,
  type LevelDefinition,
  type TerrainDefinition,
  type TrapDefinition,
  validateLevels,
} from "../src/data/levels";
import { isTouchingExit } from "../src/game/systems/level-progress";

const TILE_SIZE_PX = 16;
const BLOCK_2_LEVELS = [LEVEL_04, LEVEL_05, LEVEL_06] as const;

describe("block 2 content", () => {
  it("chains the campaign linearly from level 03 through level 06", () => {
    expect(LEVEL_DEFINITIONS.slice(0, 6).map((level) => level.id)).toEqual([
      "level-01",
      "level-02",
      "level-03",
      "level-04",
      "level-05",
      "level-06",
    ]);
    expect(
      LEVEL_DEFINITIONS.slice(0, 6).map((level) => level.difficulty),
    ).toEqual([1, 2, 3, 4, 5, 6]);
    expect(LEVEL_03.exit.nextLevelId).toBe(LEVEL_04.id);
    expect(LEVEL_04.exit.nextLevelId).toBe(LEVEL_05.id);
    expect(LEVEL_05.exit.nextLevelId).toBe(LEVEL_06.id);
    expect(LEVEL_06.exit.nextLevelId).toBe("level-07");
  });

  it("keeps every block 2 level valid, checkpointed and completable", () => {
    expect(validateLevels(BLOCK_2_LEVELS)).toEqual({
      isValid: true,
      issues: [],
    });

    BLOCK_2_LEVELS.forEach((level) => {
      const checkpoint = level.checkpoints[0]!;

      expect(level.checkpoints, level.id).toHaveLength(1);
      expect(checkpoint.position.x, level.id).toBeGreaterThan(level.spawn.x);
      expect(level.exit.area.x, level.id).toBeGreaterThan(
        checkpoint.position.x,
      );
      expect(isTouchingExit(level.exit.area, level), level.id).toBe(true);
    });
  });

  it("introduces dash safely in level 04 with long readable gaps and no traps", () => {
    const trainingPit = findHazard(LEVEL_04, "level-04-dash-training-pit");
    const confirmationPit = findHazard(
      LEVEL_04,
      "level-04-dash-confirmation-pit",
    );
    const token = findItem(LEVEL_04, "level-04-dash-token");

    expect(LEVEL_04.mainChallenge.toLowerCase()).toContain("dash");
    expect(LEVEL_04.traps).toEqual([]);
    expect(trainingPit.area.width).toBeGreaterThan(TILE_SIZE_PX * 6);
    expect(confirmationPit.area.width).toBeGreaterThan(TILE_SIZE_PX * 5);
    expect(token.kind).toBe("optional");
    expect(token.hitbox.x).toBeGreaterThanOrEqual(trainingPit.area.x);
    expect(token.hitbox.x + token.hitbox.width).toBeLessThanOrEqual(
      trainingPit.area.x + trainingPit.area.width,
    );
  });

  it("distorts dash in level 05 with known traps around the checkpoint", () => {
    const checkpoint = LEVEL_05.checkpoints[0]!;
    const fallingPlatform = findTrap(
      LEVEL_05,
      "level-05-falling-platform-doubt",
    );
    const matchingTerrain = findTerrain(LEVEL_05, "level-05-platform-doubt");
    const projectile = findTrap(LEVEL_05, "level-05-counter-projectile");
    const spikePop = findTrap(LEVEL_05, "level-05-landing-spike-pop");
    const token = findItem(LEVEL_05, "level-05-risk-token");

    expect(LEVEL_05.traps.map((trap) => trap.kind)).toEqual([
      "falling-platform",
      "projectile",
      "spike-pop",
    ]);
    expect(fallingPlatform.area).toEqual(matchingTerrain.area);
    expect(fallingPlatform.trigger.area.x).toBeLessThan(checkpoint.position.x);
    expect(projectile.trigger.area.x).toBeGreaterThan(checkpoint.position.x);
    expect(projectile.config?.velocityX).toBeLessThan(0);
    expect(spikePop.area?.x).toBeGreaterThan(projectile.trigger.area.x);
    expect(token.kind).toBe("optional");
    expect(token.persistsAfterDeath).toBe(true);
  });

  it("combines dash, interaction and short memory in level 06", () => {
    const checkpoint = LEVEL_06.checkpoints[0]!;
    const key = findItem(LEVEL_06, "level-06-memory-key");
    const mechanism = findInteractiveObject(LEVEL_06, "level-06-key-memory");
    const lever = findInteractiveObject(LEVEL_06, "level-06-memory-lever");
    const door = findInteractiveObject(LEVEL_06, "level-06-exit-door");
    const projectile = findTrap(LEVEL_06, "level-06-door-gap-projectile");
    const falseFloor = findTrap(LEVEL_06, "level-06-final-false-floor");

    expect(LEVEL_06.mainChallenge.toLowerCase()).toContain("dash");
    expect(key.kind).toBe("key");
    expect(key.activatesObjectId).toBe(mechanism.id);
    expect(mechanism.kind).toBe("mechanism");
    expect(door.kind).toBe("door");
    expect(door.startsActive).toBe(false);
    expect(lever.kind).toBe("lever");
    expect(lever.action).toBe("secondary");
    expect(lever.targetObjectId).toBe(door.id);
    expect(projectile.trigger.area.x).toBeGreaterThan(checkpoint.position.x);
    expect(projectile.config?.velocityX).toBeLessThan(0);
    expect(falseFloor.kind).toBe("false-block");
    expect(falseFloor.area?.x).toBeGreaterThan(door.area.x);
    expect(falseFloor.trigger.area.x).toBeLessThan(LEVEL_06.exit.area.x);
  });
});

function findHazard(
  level: LevelDefinition,
  id: string,
): LevelDefinition["hazards"][number] {
  const hazard = level.hazards.find((candidate) => candidate.id === id);

  expect(hazard, `${level.id}:${id}`).toBeDefined();

  return hazard!;
}

function findInteractiveObject(
  level: LevelDefinition,
  id: string,
): InteractiveObjectDefinition {
  const object = level.interactiveObjects.find(
    (candidate) => candidate.id === id,
  );

  expect(object, `${level.id}:${id}`).toBeDefined();

  return object!;
}

function findItem(level: LevelDefinition, id: string): ItemDefinition {
  const item = level.items.find((candidate) => candidate.id === id);

  expect(item, `${level.id}:${id}`).toBeDefined();

  return item!;
}

function findTerrain(level: LevelDefinition, id: string): TerrainDefinition {
  const terrain = level.terrain.find((candidate) => candidate.id === id);

  expect(terrain, `${level.id}:${id}`).toBeDefined();

  return terrain!;
}

function findTrap(level: LevelDefinition, id: string): TrapDefinition {
  const trap = level.traps.find((candidate) => candidate.id === id);

  expect(trap, `${level.id}:${id}`).toBeDefined();

  return trap!;
}
