import { describe, expect, it } from "vitest";

import {
  LEVEL_09,
  LEVEL_10,
  LEVEL_11,
  LEVEL_DEFINITIONS,
  type LevelDefinition,
  type TerrainDefinition,
  validateLevel,
} from "../src/data/levels";
import { GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import {
  BOSS_HD_VISUAL_PROFILES,
  BOSS_SPRITESHEET_KEYS,
} from "../src/data/characters/boss-spritesheet-registry";
import { getHdCampaignLevel } from "./helpers/hd-campaign";
import {
  applyBossRuntimeDamage,
  transitionBossRuntimeState,
} from "../src/game/physics";
import { DEFAULT_PLAYER_ENERGY_CONFIG } from "../src/game/physics/player-energy";
import {
  createInitialRoomState,
  setRoomBossRuntimeState,
} from "../src/game/systems/room-state";
import {
  applyBossEnergyHit,
  isLevelExitBlockedByLivingBosses,
  unlockDefeatedBossObjects,
} from "../src/game/systems/level-bosses";
import { getInteractiveObjectSolidAreas } from "../src/game/systems/level-interactive-objects";
import { isTouchingExit } from "../src/game/systems/level-progress";

const TILE_SIZE_PX = 16;
const BASE_HEIGHT_PX = 270;
const FLOOR_Y = BASE_HEIGHT_PX - TILE_SIZE_PX * 3;
const GIGA_FABIO_ARENA_X = TILE_SIZE_PX * 8;
const GIGA_FABIO_ARENA_WIDTH = TILE_SIZE_PX * 26;

describe("level 10 final arena content", () => {
  it("registers level 10 as the final campaign phase", () => {
    const levelIds = LEVEL_DEFINITIONS.map((level) => level.id);

    expect(levelIds).toContain("level-10");
    expect(validateLevel(LEVEL_10)).toEqual({
      isValid: true,
      issues: [],
    });
    expect(levelIds.slice(-2)).toEqual(["level-10", "level-11"]);
    expect(LEVEL_DEFINITIONS.at(-1)?.id).toBe(LEVEL_11.id);
    expect(LEVEL_09.exit.nextLevelId).toBe(LEVEL_10.id);
    expect(LEVEL_10).toMatchObject({
      id: "level-10",
      name: "O Ultimo Nucleo",
      order: 10,
      theme: "giga-fabio-final-arena",
      difficulty: 10,
      initialEnergy: 100,
    });
    expect(LEVEL_10.exit.nextLevelId).toBe("level-11");
    expect(isTouchingExit(LEVEL_10.exit.area, LEVEL_10)).toBe(true);
  });

  it("creates a dedicated Giga Fabio arena shell", () => {
    const checkpoint = LEVEL_10.checkpoints.find(
      (candidate) => candidate.id === "level-10-before-giga-fabio",
    )!;
    const approachFloor = findTerrain(LEVEL_10, "level-10-approach-floor");
    const arenaFloor = findTerrain(LEVEL_10, "level-10-giga-fabio-arena-floor");
    const exitFloor = findTerrain(LEVEL_10, "level-10-exit-floor");
    const leftPlatform = findTerrain(
      LEVEL_10,
      "level-10-left-recharge-platform",
    );
    const rightPlatform = findTerrain(
      LEVEL_10,
      "level-10-right-recharge-platform",
    );

    expect(checkpoint.initialEnergy).toBe(100);
    expect(checkpoint.position.x).toBeLessThan(arenaFloor.area.x);
    expect(arenaFloor.area).toEqual({
      x: GIGA_FABIO_ARENA_X,
      y: FLOOR_Y,
      width: GIGA_FABIO_ARENA_WIDTH,
      height: TILE_SIZE_PX,
    });
    expect(approachFloor.area.x + approachFloor.area.width).toBe(
      arenaFloor.area.x,
    );
    expect(exitFloor.area.x).toBe(arenaFloor.area.x + arenaFloor.area.width);
    expect(leftPlatform.area.x).toBeGreaterThan(arenaFloor.area.x);
    expect(rightPlatform.area.x + rightPlatform.area.width).toBeLessThan(
      arenaFloor.area.x + arenaFloor.area.width,
    );
    expect(LEVEL_10.hazards).toEqual([]);
    expect(LEVEL_10.traps).toEqual([]);
  });

  it("adds two grounded recharge points inside the final arena", () => {
    const boss = (LEVEL_10.bosses ?? []).find(
      (candidate) => candidate.id === "boss-giga-fabio",
    )!;
    const checkpoint = LEVEL_10.checkpoints.find(
      (candidate) => candidate.id === "level-10-before-giga-fabio",
    )!;
    const leftRecharge = findTerrain(
      LEVEL_10,
      "level-10-left-recharge-platform",
    );
    const rightRecharge = findTerrain(
      LEVEL_10,
      "level-10-right-recharge-platform",
    );
    const rechargePlatforms = [leftRecharge, rightRecharge];

    expect(checkpoint.initialEnergy).toBe(
      DEFAULT_PLAYER_ENERGY_CONFIG.burstCost,
    );
    rechargePlatforms.forEach((platform) => {
      expect(platform.area.width, platform.id).toBeGreaterThanOrEqual(
        TILE_SIZE_PX * 5,
      );
      expect(platform.area.y, platform.id).toBe(FLOOR_Y - TILE_SIZE_PX * 5);
      expect(platform.area.x, platform.id).toBeGreaterThan(boss.arena.x);
      expect(platform.area.x + platform.area.width, platform.id).toBeLessThan(
        boss.arena.x + boss.arena.width,
      );
    });
    expect(leftRecharge.area.x).toBeLessThan(boss.spawn.x);
    expect(rightRecharge.area.x).toBeGreaterThan(boss.spawn.x);
  });

  it("declares Giga Fabio with floor slam, boulder toss and shoulder charge", () => {
    const boss = (LEVEL_10.bosses ?? []).find(
      (candidate) => candidate.id === "boss-giga-fabio",
    )!;
    const weakPoint = (LEVEL_10.energyTargets ?? []).find(
      (target) => target.id === "level-10-giga-fabio-weak-point",
    )!;
    const floorSlam = boss.attacks.find(
      (attack) => attack.kind === "floor-slam",
    )!;
    const boulderToss = boss.attacks.find(
      (attack) => attack.kind === "boulder-toss",
    )!;
    const shoulderCharge = boss.attacks.find(
      (attack) => attack.kind === "shoulder-charge",
    )!;

    expect(boss).toMatchObject({
      levelId: "level-10",
      displayName: "Giga Fabio",
      health: 4,
      entryCheckpointId: "level-10-before-giga-fabio",
      entryDoorId: "level-10-giga-fabio-entry-door",
      defeatUnlocks: ["level-10-giga-fabio-exit-door"],
      assetId: BOSS_SPRITESHEET_KEYS.GIGA_FABIO_512,
      movement: {
        kind: "patrol",
        speedPxPerSecond: 38,
      },
    });
    expect(boss.attacks.map((attack) => attack.kind)).toEqual([
      "floor-slam",
      "boulder-toss",
      "shoulder-charge",
    ]);
    expect(floorSlam).toMatchObject({
      windupMs: 800,
      activeMs: 320,
      recoverMs: 950,
      contactDamage: 1,
      opensVulnerabilityWindowId: "level-10-giga-fabio-recover",
    });
    expect(boulderToss).toMatchObject({
      windupMs: 650,
      activeMs: 260,
      contactDamage: 0,
      projectile: {
        velocity: {
          x: -104,
          y: 0,
        },
        maxActive: 1,
        maxRangePx: TILE_SIZE_PX * 22,
        isDestructibleBy: ["cyan-spark", "cyan-burst"],
      },
    });
    expect("opensVulnerabilityWindowId" in boulderToss).toBe(false);
    expect(shoulderCharge).toMatchObject({
      windupMs: 700,
      activeMs: 360,
      recoverMs: 950,
      contactDamage: 1,
      opensVulnerabilityWindowId: "level-10-giga-fabio-recover",
    });
    expect(boss.vulnerabilityWindows).toEqual([
      {
        id: "level-10-giga-fabio-recover",
        state: "recover",
        durationMs: 950,
        weakPointActive: true,
        opensAfterAttackIds: [
          "level-10-giga-fabio-floor-slam",
          "level-10-giga-fabio-shoulder-charge",
        ],
      },
    ]);
    expect(boss.damageRules).toEqual([
      {
        power: "cyan-burst",
        damage: 1,
        validStates: ["recover"],
        requiresWeakPoint: true,
        oncePerAttack: true,
        consumesHit: true,
        effects: ["damage"],
      },
    ]);
    expect(weakPoint).toMatchObject({
      kind: "boss-hurtbox",
      acceptedPowers: ["cyan-burst"],
      hitPoints: 4,
      hitGroupId: "boss-giga-fabio",
    });
    expect(weakPoint.area).toEqual(boss.weakPoint);
  });

  it("keeps the final exit blocked while Giga Fabio is alive", () => {
    const state = createInitialRoomState(LEVEL_10);

    expect(isLevelExitBlockedByLivingBosses(LEVEL_10.bosses, state)).toBe(true);
    expect(state.interactiveObjects["level-10-giga-fabio-entry-door"]).toEqual(
      expect.objectContaining({
        isActive: true,
      }),
    );
    expect(state.interactiveObjects["level-10-giga-fabio-exit-door"]).toEqual(
      expect.objectContaining({
        isActive: false,
      }),
    );
  });

  it("keeps Giga Fabio content references wired to final victory flow", () => {
    const boss = (LEVEL_10.bosses ?? []).find(
      (candidate) => candidate.id === "boss-giga-fabio",
    )!;
    const entryDoor = LEVEL_10.interactiveObjects.find(
      (object) => object.id === boss.entryDoorId,
    )!;
    const exitDoor = LEVEL_10.interactiveObjects.find(
      (object) => object.id === boss.defeatUnlocks[0],
    )!;
    const weakPoint = (LEVEL_10.energyTargets ?? []).find(
      (target) => target.hitGroupId === boss.id,
    )!;
    const initialState = createInitialRoomState(LEVEL_10);
    const defeatedBoss = applyBossRuntimeDamage({
      state: {
        ...initialState.bosses[boss.id]!,
        state: "recover",
        healthRemaining: 1,
      },
      damage: 1,
      invulnerabilityMs: 650,
    }).state;
    const unlockedState = unlockDefeatedBossObjects(
      setRoomBossRuntimeState(initialState, defeatedBoss),
      LEVEL_10.bosses,
    );

    expect(LEVEL_10.bosses).toHaveLength(1);
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
      acceptedPowers: ["cyan-burst"],
      resetOnRespawn: true,
      hitGroupId: boss.id,
    });
    expect(
      getInteractiveObjectSolidAreas(LEVEL_10.interactiveObjects, initialState),
    ).toContainEqual(exitDoor.area);
    expect(
      getInteractiveObjectSolidAreas(
        LEVEL_10.interactiveObjects,
        unlockedState,
      ),
    ).not.toContainEqual(exitDoor.area);
    expect(
      isLevelExitBlockedByLivingBosses(LEVEL_10.bosses, unlockedState),
    ).toBe(false);
  });

  it("requires Rajada Ciano for real damage against Giga Fabio", () => {
    const boss = (LEVEL_10.bosses ?? []).find(
      (candidate) => candidate.id === "boss-giga-fabio",
    )!;
    const initialState = createInitialRoomState(LEVEL_10);
    const recoverState = setRoomBossRuntimeState(
      initialState,
      transitionBossRuntimeState({
        state: initialState.bosses[boss.id]!,
        nextState: "recover",
        durationMs: 950,
        activeAttackId: "level-10-giga-fabio-floor-slam",
        activeVulnerabilityWindowId: "level-10-giga-fabio-recover",
      }),
    );

    const sparkHit = applyBossEnergyHit(recoverState, LEVEL_10.bosses, {
      bossId: boss.id,
      power: "cyan-spark",
      didHitWeakPoint: true,
      sourceAttackId: "spark-test",
    });
    const burstHit = applyBossEnergyHit(recoverState, LEVEL_10.bosses, {
      bossId: boss.id,
      power: "cyan-burst",
      didHitWeakPoint: true,
      sourceAttackId: "burst-test",
    });

    expect(sparkHit).toMatchObject({
      didApplyDamage: false,
      didConsumeHit: false,
      damage: 0,
      bossId: boss.id,
    });
    expect(sparkHit.state.bosses[boss.id]).toMatchObject({
      healthRemaining: 4,
      state: "recover",
    });
    expect(burstHit).toMatchObject({
      didApplyDamage: true,
      didConsumeHit: true,
      damage: 1,
      bossId: boss.id,
    });
    expect(burstHit.state.bosses[boss.id]).toMatchObject({
      healthRemaining: 3,
      state: "stunned",
    });
  });

  it("anchors migrated Giga Fabio hitbox feet to the arena floor at 72x88", () => {
    const migrated = getHdCampaignLevel("level-10");
    const boss = migrated.bosses!.find(
      (candidate) => candidate.id === "boss-giga-fabio",
    )!;
    const arenaFloor = migrated.terrain.find(
      (terrain) => terrain.id === "level-10-giga-fabio-arena-floor",
    )!;

    expect(BOSS_HD_VISUAL_PROFILES.GIGA_FABIO).toEqual({
      textureKey: BOSS_SPRITESHEET_KEYS.GIGA_FABIO_512,
      displaySize: { width: 72, height: 88 },
      bottomOffsetY: 0,
    });
    expect(boss.hitbox.y + boss.hitbox.height).toBe(arenaFloor.area.y);
    expect(boss.weakPoint.y).toBeGreaterThan(boss.hitbox.y);
    expect(boss.weakPoint.y + boss.weakPoint.height).toBeLessThanOrEqual(
      boss.hitbox.y + boss.hitbox.height,
    );
  });

  it("preloads the final boss placeholder assets for the future fight", () => {
    expect(LEVEL_10.assets.sprites).toEqual(
      expect.arrayContaining([
        BOSS_SPRITESHEET_KEYS.GIGA_FABIO_512,
        GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_BOULDER,
        GAMEPLAY_SPRITE_KEYS.BOSS_IMPACT_BURST,
        GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_BURST_BEAM,
      ]),
    );
  });
});

function findTerrain(level: LevelDefinition, id: string): TerrainDefinition {
  const terrain = level.terrain.find((candidate) => candidate.id === id);

  expect(terrain, `${level.id}:${id}`).toBeDefined();

  return terrain!;
}
