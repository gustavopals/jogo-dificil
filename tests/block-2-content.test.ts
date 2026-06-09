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
import {
  BOSS_HD_VISUAL_PROFILES,
  BOSS_SPRITESHEET_KEYS,
} from "../src/data/characters/boss-spritesheet-registry";
import { getBossVisualDisplaySize } from "../src/game/systems/level-bosses";
import { getHdCampaignLevel } from "./helpers/hd-campaign";
import { applyBossRuntimeDamage } from "../src/game/physics";
import { getInteractiveObjectSolidAreas } from "../src/game/systems/level-interactive-objects";
import {
  isLevelExitBlockedByLivingBosses,
  unlockDefeatedBossObjects,
} from "../src/game/systems/level-bosses";
import { isTouchingExit } from "../src/game/systems/level-progress";
import {
  createInitialRoomState,
  setRoomBossRuntimeState,
} from "../src/game/systems/room-state";

const TILE_SIZE_PX = 16;
const BASE_HEIGHT_PX = 270;
const FLOOR_Y = BASE_HEIGHT_PX - TILE_SIZE_PX * 3;
const LEVEL_06_DR_IMPORTS_ARENA_X = TILE_SIZE_PX * 66;
const LEVEL_06_DR_IMPORTS_ARENA_WIDTH = TILE_SIZE_PX * 22;
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

      expect(level.checkpoints.length, level.id).toBeGreaterThanOrEqual(1);
      expect(level.checkpoints, level.id).toHaveLength(
        level.id === LEVEL_06.id ? 2 : 1,
      );
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
    expect(fallingPlatform.config?.fallDelayMs).toBe(300);
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

  it("adds the Dr. Imports arena after level 06 memory corridor", () => {
    const memoryCheckpoint = LEVEL_06.checkpoints.find(
      (checkpoint) => checkpoint.id === "level-06-before-memory-lock",
    )!;
    const bossCheckpoint = LEVEL_06.checkpoints.find(
      (checkpoint) => checkpoint.id === "level-06-before-dr-imports",
    )!;
    const approachFloor = findTerrain(
      LEVEL_06,
      "level-06-dr-imports-approach-floor",
    );
    const arenaFloor = findTerrain(LEVEL_06, "level-06-dr-imports-arena-floor");
    const leftPlatform = findTerrain(
      LEVEL_06,
      "level-06-dr-imports-left-platform",
    );
    const rightPlatform = findTerrain(
      LEVEL_06,
      "level-06-dr-imports-right-platform",
    );
    const entryDoor = findInteractiveObject(
      LEVEL_06,
      "level-06-dr-imports-entry-door",
    );
    const exitDoor = findInteractiveObject(
      LEVEL_06,
      "level-06-dr-imports-exit-door",
    );

    expect(LEVEL_06.bounds.width).toBe(TILE_SIZE_PX * 90);
    expect(memoryCheckpoint.position.x).toBeLessThan(bossCheckpoint.position.x);
    expect(bossCheckpoint.initialEnergy).toBe(80);
    expect(bossCheckpoint.position.x).toBeLessThan(entryDoor.area.x);
    expect(entryDoor.area.x - bossCheckpoint.position.x).toBe(TILE_SIZE_PX * 4);
    expect(approachFloor.area).toEqual({
      x: TILE_SIZE_PX * 60,
      y: FLOOR_Y,
      width: TILE_SIZE_PX * 6,
      height: TILE_SIZE_PX,
    });
    expect(arenaFloor.area).toEqual({
      x: LEVEL_06_DR_IMPORTS_ARENA_X,
      y: FLOOR_Y,
      width: LEVEL_06_DR_IMPORTS_ARENA_WIDTH,
      height: TILE_SIZE_PX,
    });
    expect(leftPlatform.area.x).toBeGreaterThan(arenaFloor.area.x);
    expect(rightPlatform.area.x + rightPlatform.area.width).toBeLessThan(
      arenaFloor.area.x + arenaFloor.area.width,
    );
    expect(entryDoor).toMatchObject({
      kind: "door",
      startsActive: true,
    });
    expect(exitDoor).toMatchObject({
      kind: "door",
      startsActive: false,
    });
    expect(exitDoor.area.x).toBe(
      arenaFloor.area.x + arenaFloor.area.width - TILE_SIZE_PX * 2,
    );
    expect(LEVEL_06.exit.area.x).toBe(
      arenaFloor.area.x + arenaFloor.area.width - TILE_SIZE_PX,
    );
    expect(isTouchingExit(LEVEL_06.exit.area, LEVEL_06)).toBe(true);
    expect(
      LEVEL_06.hazards.every(
        (hazard) => hazard.area.x + hazard.area.width <= arenaFloor.area.x,
      ),
    ).toBe(true);
  });

  it("declares Dr. Imports attacks in the level 06 arena", () => {
    const boss = (LEVEL_06.bosses ?? []).find(
      (candidate) => candidate.id === "boss-dr-imports",
    )!;
    const weakPoint = (LEVEL_06.energyTargets ?? []).find(
      (target) => target.id === "level-06-dr-imports-weak-point",
    )!;

    expect(boss).toMatchObject({
      levelId: "level-06",
      displayName: "Dr. Imports",
      health: 3,
      arena: {
        x: LEVEL_06_DR_IMPORTS_ARENA_X,
        y: FLOOR_Y - TILE_SIZE_PX * 11,
        width: LEVEL_06_DR_IMPORTS_ARENA_WIDTH,
        height: TILE_SIZE_PX * 12,
      },
      entryCheckpointId: "level-06-before-dr-imports",
      entryDoorId: "level-06-dr-imports-entry-door",
      defeatUnlocks: ["level-06-dr-imports-exit-door"],
    });
    expect(boss.assetId).toBe("boss-dr-imports-sheet-1024");
    expect(getBossVisualDisplaySize(boss)).toEqual(
      BOSS_HD_VISUAL_PROFILES.DR_IMPORTS.displaySize,
    );
    expect(getBossVisualDisplaySize(boss)).toEqual({
      width: 56,
      height: 80,
    });
    const hdBoss = getHdCampaignLevel("level-06").bosses!.find(
      (candidate) => candidate.id === "boss-dr-imports",
    )!;
    expect(hdBoss.hitbox).toEqual({
      x: boss.hitbox.x * 2,
      y: boss.hitbox.y * 2,
      width: 56,
      height: 96,
    });
    expect(hdBoss.weakPoint).toEqual({
      x: boss.weakPoint.x * 2,
      y: boss.weakPoint.y * 2,
      width: 36,
      height: 48,
    });
    expect(boss.movement).toMatchObject({
      kind: "anchor-swap",
      speedPxPerSecond: 36,
      anchors: [
        {
          x: LEVEL_06_DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 5,
          y: FLOOR_Y - 24,
        },
        {
          x: LEVEL_06_DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 11,
          y: FLOOR_Y - 24,
        },
        {
          x: LEVEL_06_DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 17,
          y: FLOOR_Y - 24,
        },
      ],
    });
    expect(boss.attacks.map((attack) => attack.kind)).toEqual([
      "import-bottle",
      "paper-wall",
      "smoke-swap",
    ]);
    expect(boss.attacks[0]).toMatchObject({
      id: "level-06-dr-imports-import-bottle",
      windupMs: 500,
      recoverMs: 800,
      projectile: {
        velocity: {
          x: -112,
          y: 0,
        },
        maxActive: 2,
        isDestructibleBy: ["cyan-spark"],
      },
      opensVulnerabilityWindowId: "level-06-dr-imports-recover",
    });
    expect(boss.attacks[1]).toMatchObject({
      id: "level-06-dr-imports-paper-wall",
      activeMs: 520,
      contactDamage: 0,
      opensVulnerabilityWindowId: "level-06-dr-imports-recover",
    });
    expect(boss.attacks[1]!.hitbox).toEqual(boss.attacks[1]!.tellArea);
    expect(boss.attacks[2]).toMatchObject({
      id: "level-06-dr-imports-smoke-swap",
      activeMs: 220,
      contactDamage: 0,
      opensVulnerabilityWindowId: "level-06-dr-imports-recover",
    });
    expect(boss.vulnerabilityWindows).toEqual([
      {
        id: "level-06-dr-imports-recover",
        state: "recover",
        durationMs: 800,
        weakPointActive: true,
        opensAfterAttackIds: [
          "level-06-dr-imports-import-bottle",
          "level-06-dr-imports-paper-wall",
          "level-06-dr-imports-smoke-swap",
        ],
      },
    ]);
    expect(weakPoint).toMatchObject({
      kind: "boss-hurtbox",
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitGroupId: "boss-dr-imports",
    });
    expect(weakPoint.area).toEqual(boss.weakPoint);
    expect(LEVEL_06.assets.sprites).toEqual(
      expect.arrayContaining([
        BOSS_SPRITESHEET_KEYS.DR_IMPORTS_1024,
        "boss-projectile-import-bottle",
      ]),
    );
  });

  it("keeps Dr. Imports content references wired to boss data and assets", () => {
    const boss = (LEVEL_06.bosses ?? []).find(
      (candidate) => candidate.id === "boss-dr-imports",
    )!;
    const entryDoor = findInteractiveObject(LEVEL_06, boss.entryDoorId!);
    const exitDoor = findInteractiveObject(LEVEL_06, boss.defeatUnlocks[0]!);
    const weakPoint = (LEVEL_06.energyTargets ?? []).find(
      (target) => target.hitGroupId === boss.id,
    )!;
    const bottle = boss.attacks.find(
      (attack) => attack.kind === "import-bottle",
    )!;
    const anchors = boss.movement.anchors ?? [];

    expect(LEVEL_06.bosses).toHaveLength(1);
    expect(entryDoor).toMatchObject({
      kind: "door",
      startsActive: true,
    });
    expect(exitDoor).toMatchObject({
      kind: "door",
      startsActive: false,
    });
    expect(entryDoor.area.x).toBe(boss.arena.x);
    expect(exitDoor.area.x).toBe(
      boss.arena.x + boss.arena.width - TILE_SIZE_PX * 2,
    );
    expect(weakPoint).toMatchObject({
      kind: "boss-hurtbox",
      hitPoints: boss.health,
      resetOnRespawn: true,
      hitGroupId: boss.id,
    });
    expect(boss.damageRules.map((rule) => rule.power)).toEqual([
      "cyan-spark",
      "cyan-burst",
    ]);
    expect(boss.vulnerabilityWindows[0]!.opensAfterAttackIds).toEqual(
      boss.attacks.map((attack) => attack.id),
    );
    expect(anchors).toHaveLength(3);
    anchors.forEach((anchor) => {
      expect(anchor.x).toBeGreaterThan(entryDoor.area.x);
      expect(anchor.x).toBeLessThan(exitDoor.area.x);
      expect(anchor.y).toBeLessThan(FLOOR_Y);
    });
    expect(bottle.projectile?.maxActive).toBe(2);
    expect(bottle.projectile?.maxRangePx).toBeLessThanOrEqual(
      LEVEL_06_DR_IMPORTS_ARENA_WIDTH,
    );
    expect(LEVEL_06.assets.sprites).toEqual(
      expect.arrayContaining([boss.assetId, "boss-projectile-import-bottle"]),
    );
  });

  it("keeps Dr. Imports balanced as the second boss", () => {
    const boss = (LEVEL_06.bosses ?? []).find(
      (candidate) => candidate.id === "boss-dr-imports",
    )!;
    const projectileAttacks = boss.attacks.filter(
      (attack) => "projectile" in attack && attack.projectile !== undefined,
    );

    expect(boss.health).toBe(3);
    expect(projectileAttacks).toHaveLength(1);
    expect(
      projectileAttacks.every(
        (attack) =>
          "projectile" in attack && (attack.projectile?.maxActive ?? 0) <= 2,
      ),
    ).toBe(true);
    expect(
      boss.attacks.find((attack) => attack.kind === "import-bottle"),
    ).toMatchObject({
      projectile: {
        maxActive: 2,
      },
    });
  });

  it("chains level 06 to level 07 only after Dr. Imports is defeated", () => {
    const roomState = createInitialRoomState(LEVEL_06);
    const boss = (LEVEL_06.bosses ?? []).find(
      (candidate) => candidate.id === "boss-dr-imports",
    )!;
    const exitDoor = findInteractiveObject(
      LEVEL_06,
      "level-06-dr-imports-exit-door",
    );

    expect(LEVEL_06.exit.nextLevelId).toBe("level-07");
    expect(isLevelExitBlockedByLivingBosses(LEVEL_06.bosses, roomState)).toBe(
      true,
    );
    expect(roomState.interactiveObjects[exitDoor.id]).toMatchObject({
      isActive: false,
    });
    expect(
      getInteractiveObjectSolidAreas(LEVEL_06.interactiveObjects, roomState),
    ).toContainEqual(exitDoor.area);

    const defeatedBoss = applyBossRuntimeDamage({
      state: {
        ...roomState.bosses[boss.id]!,
        state: "recover",
        healthRemaining: 1,
      },
      damage: 1,
      invulnerabilityMs: 650,
    }).state;
    const defeatedState = setRoomBossRuntimeState(roomState, defeatedBoss);
    const unlockedState = unlockDefeatedBossObjects(
      defeatedState,
      LEVEL_06.bosses,
    );

    expect(
      isLevelExitBlockedByLivingBosses(LEVEL_06.bosses, unlockedState),
    ).toBe(false);
    expect(unlockedState.interactiveObjects[exitDoor.id]).toMatchObject({
      isActive: true,
    });
    expect(
      getInteractiveObjectSolidAreas(
        LEVEL_06.interactiveObjects,
        unlockedState,
      ),
    ).not.toContainEqual(exitDoor.area);
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
