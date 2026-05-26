import { describe, expect, it } from "vitest";

import {
  LEVEL_01,
  LEVEL_02,
  LEVEL_03,
  LEVEL_DEFINITIONS,
  type HazardDefinition,
  type InteractiveObjectDefinition,
  type LevelDefinition,
  type TerrainDefinition,
  type TrapDefinition,
} from "../src/data/levels";

const TILE_SIZE_PX = 16;
const MAX_INTRO_WALK_TO_FIRST_CHALLENGE_PX = TILE_SIZE_PX * 14;
const MAX_POST_CHECKPOINT_WALK_TO_CHALLENGE_PX = TILE_SIZE_PX * 12;
const INITIAL_LEVELS = [LEVEL_01, LEVEL_02, LEVEL_03] as const;

describe("initial curve balance", () => {
  it("keeps the first three levels ordered by campaign and difficulty", () => {
    const initialRegistryLevels = LEVEL_DEFINITIONS.slice(
      0,
      INITIAL_LEVELS.length,
    );

    expect(initialRegistryLevels.map((level) => level.id)).toEqual([
      "level-01",
      "level-02",
      "level-03",
    ]);
    expect(initialRegistryLevels.map((level) => level.difficulty)).toEqual([
      1, 2, 3,
    ]);
    expect(LEVEL_01.exit.nextLevelId).toBe(LEVEL_02.id);
    expect(LEVEL_02.exit.nextLevelId).toBe(LEVEL_03.id);
    expect("nextLevelId" in LEVEL_03.exit).toBe(false);
  });

  it("keeps level 01 difficult but introductory", () => {
    const fallHazards = LEVEL_01.hazards.filter(
      (hazard) => hazard.kind === "fall",
    );

    expect(LEVEL_01.interactiveObjects).toEqual([]);
    expect(LEVEL_01.items.some((item) => item.kind === "required")).toBe(true);
    expect(LEVEL_01.traps.map((trap) => trap.kind)).toEqual(["spike-pop"]);
    expect(fallHazards).toHaveLength(3);
    fallHazards.forEach((hazard) => {
      expect(hazard.area.width).toBeLessThanOrEqual(TILE_SIZE_PX * 3);
    });
  });

  it("keeps level 02 focused on timing and interaction", () => {
    const fallingPlatform = findTrap(LEVEL_02, "level-02-falling-platform");
    const lever = findInteractiveObject(LEVEL_02, "level-02-lever-exit");
    const door = findInteractiveObject(LEVEL_02, "level-02-exit-door");

    expect(fallingPlatform.kind).toBe("falling-platform");
    expect(fallingPlatform.trigger.kind).toBe("touch");
    expect(LEVEL_02.traps.some((trap) => trap.kind === "projectile")).toBe(
      true,
    );
    expect(door.kind).toBe("door");
    expect(door.startsActive).toBe(false);
    expect(lever.kind).toBe("lever");
    expect(lever.action).toBe("secondary");
    expect(lever.targetObjectId).toBe(door.id);
    expect(LEVEL_02.items.some((item) => item.kind === "key")).toBe(true);
  });

  it("keeps level 03 focused on reading, short memory and precision", () => {
    const precisionPlatforms = LEVEL_03.terrain.filter((terrain) =>
      terrain.id.startsWith("level-03-platform-precision-"),
    );
    const falseFloor = findTrap(LEVEL_03, "level-03-false-floor");
    const breakablePlatform = findTrap(LEVEL_03, "level-03-breakable-platform");
    const checkpoint = LEVEL_03.checkpoints[0]!;
    const optionalToken = LEVEL_03.items.find(
      (item) => item.id === "level-03-risk-token",
    )!;

    expect(precisionPlatforms).toHaveLength(3);
    expect(
      precisionPlatforms.every(
        (platform) => platform.area.width === TILE_SIZE_PX * 3,
      ),
    ).toBe(true);
    expect(breakablePlatform.kind).toBe("breakable-floor");
    expect(falseFloor.kind).toBe("false-block");
    expect(falseFloor.area!.x).toBeGreaterThan(checkpoint.position.x);
    expect(optionalToken.kind).toBe("optional");
    expect(optionalToken.persistsAfterDeath).toBe(true);
  });

  it("avoids repeating the same trap joke in the initial trio", () => {
    const trapKindOwners = new Map<string, string>();

    INITIAL_LEVELS.forEach((level) => {
      level.traps.forEach((trap) => {
        expect(
          trapKindOwners.has(trap.kind),
          `${trap.kind} already appears in ${trapKindOwners.get(trap.kind)}`,
        ).toBe(false);
        trapKindOwners.set(trap.kind, level.id);
      });
    });

    expect([...trapKindOwners.keys()]).toEqual([
      "spike-pop",
      "falling-platform",
      "projectile",
      "false-block",
      "breakable-floor",
    ]);
  });

  it("avoids long walks before the next meaningful challenge", () => {
    const firstChallenges = [
      {
        level: LEVEL_01,
        x: findHazard(LEVEL_01, "level-01-pit-first").area.x,
      },
      {
        level: LEVEL_02,
        x: findTrap(LEVEL_02, "level-02-falling-platform").trigger.area.x,
      },
      {
        level: LEVEL_03,
        x: findTerrain(LEVEL_03, "level-03-platform-precision-01").area.x,
      },
    ];
    const postCheckpointChallenges = [
      {
        level: LEVEL_01,
        x: findHazard(LEVEL_01, "level-01-pit-final").area.x,
      },
      {
        level: LEVEL_02,
        x: findTrap(LEVEL_02, "level-02-side-projectile").trigger.area.x,
      },
      {
        level: LEVEL_03,
        x: findTerrain(LEVEL_03, "level-03-platform-cruel-setup").area.x,
      },
    ];

    firstChallenges.forEach(({ level, x }) => {
      expect(x - level.spawn.x, level.id).toBeLessThanOrEqual(
        MAX_INTRO_WALK_TO_FIRST_CHALLENGE_PX,
      );
    });
    postCheckpointChallenges.forEach(({ level, x }) => {
      expect(
        x - level.checkpoints[0]!.position.x,
        level.id,
      ).toBeLessThanOrEqual(MAX_POST_CHECKPOINT_WALK_TO_CHALLENGE_PX);
    });
  });
});

function findHazard(level: LevelDefinition, id: string): HazardDefinition {
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
