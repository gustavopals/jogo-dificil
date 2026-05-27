import { describe, expect, it } from "vitest";

import { LEVEL_03, validateLevel } from "../src/data/levels";
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
const FLOOR_Y = 222;
const HIROLITO_ARENA_X = TILE_SIZE_PX * 66;
const HIROLITO_ARENA_WIDTH = TILE_SIZE_PX * 20;

describe("level 03 content", () => {
  it("defines point A, checkpoints and block transition point B in order", () => {
    const cruelCheckpoint = LEVEL_03.checkpoints.find(
      (checkpoint) => checkpoint.id === "level-03-before-cruel",
    )!;
    const bossCheckpoint = LEVEL_03.checkpoints.find(
      (checkpoint) => checkpoint.id === "level-03-before-hirolito",
    )!;

    expect(LEVEL_03.spawn).toEqual({
      x: TILE_SIZE_PX * 4,
      y: FLOOR_Y,
    });
    expect(cruelCheckpoint.position.x).toBeGreaterThan(LEVEL_03.spawn.x);
    expect(bossCheckpoint.position.x).toBeGreaterThan(
      cruelCheckpoint.position.x,
    );
    expect(LEVEL_03.exit.area.x).toBeGreaterThan(bossCheckpoint.position.x);
    expect(LEVEL_03.exit.nextLevelId).toBe("level-04");
  });

  it("creates a short precise jump sequence before the checkpoint", () => {
    const precisionPlatforms = [
      "level-03-platform-precision-01",
      "level-03-platform-precision-02",
      "level-03-platform-precision-03",
    ].map((id) => LEVEL_03.terrain.find((terrain) => terrain.id === id)!);
    const checkpoint = LEVEL_03.checkpoints.find(
      (candidate) => candidate.id === "level-03-before-cruel",
    )!;

    expect(precisionPlatforms.map((platform) => platform.area.width)).toEqual([
      TILE_SIZE_PX * 3,
      TILE_SIZE_PX * 3,
      TILE_SIZE_PX * 3,
    ]);
    precisionPlatforms.forEach((platform, index) => {
      expect(platform.area.x).toBeGreaterThan(LEVEL_03.spawn.x);
      expect(platform.area.x).toBeLessThan(checkpoint.position.x);

      if (index > 0) {
        expect(platform.area.x).toBeGreaterThan(
          precisionPlatforms[index - 1]!.area.x,
        );
      }
    });
  });

  it("uses a breakable platform as the risky optional reward route", () => {
    const breakablePlatform = LEVEL_03.traps.find(
      (trap) => trap.id === "level-03-breakable-platform",
    )!;
    const matchingTerrain = LEVEL_03.terrain.find(
      (terrain) => terrain.id === "level-03-platform-precision-02",
    )!;
    const token = LEVEL_03.items.find(
      (item) => item.id === "level-03-risk-token",
    )!;

    expect(breakablePlatform.kind).toBe("breakable-floor");
    expect(breakablePlatform.area).toEqual(matchingTerrain.area);
    expect(breakablePlatform.resetOnRespawn).toBe(true);
    expect(token.kind).toBe("optional");
    expect(token.persistsAfterDeath).toBe(true);
    expect(token.hitbox.x).toBeGreaterThanOrEqual(matchingTerrain.area.x);
    expect(token.hitbox.x + token.hitbox.width).toBeLessThanOrEqual(
      matchingTerrain.area.x + matchingTerrain.area.width,
    );
    expect(token.hitbox.y + token.hitbox.height).toBeLessThan(
      matchingTerrain.area.y,
    );
  });

  it("places the checkpoint before the cruel exit memory test", () => {
    const checkpoint = LEVEL_03.checkpoints.find(
      (candidate) => candidate.id === "level-03-before-cruel",
    )!;
    const falseFloor = LEVEL_03.traps.find(
      (trap) => trap.id === "level-03-false-floor",
    )!;
    const cruelPlatform = LEVEL_03.terrain.find(
      (terrain) => terrain.id === "level-03-cruel-exit-platform",
    )!;

    expect(falseFloor.kind).toBe("false-block");
    expect(falseFloor.resetOnRespawn).toBe(true);
    expect(falseFloor.area?.x).toBeGreaterThan(checkpoint.position.x);
    expect(falseFloor.trigger.area.x).toBeLessThan(LEVEL_03.exit.area.x);
    expect(falseFloor.area?.y).toBe(cruelPlatform.area.y);
    expect(falseFloor.area?.x).toBeGreaterThan(cruelPlatform.area.x);
    expect(falseFloor.area!.x + falseFloor.area!.width).toBeLessThan(
      cruelPlatform.area.x + cruelPlatform.area.width,
    );
  });

  it("creates the final Hirolito arena after the cruel exit trick", () => {
    const checkpoint = LEVEL_03.checkpoints.find(
      (candidate) => candidate.id === "level-03-before-hirolito",
    )!;
    const approachFloor = LEVEL_03.terrain.find(
      (terrain) => terrain.id === "level-03-hirolito-approach-floor",
    )!;
    const arenaFloor = LEVEL_03.terrain.find(
      (terrain) => terrain.id === "level-03-hirolito-arena-floor",
    )!;
    const lowPlatform = LEVEL_03.terrain.find(
      (terrain) => terrain.id === "level-03-hirolito-low-platform",
    )!;
    const entryDoor = LEVEL_03.interactiveObjects.find(
      (object) => object.id === "level-03-hirolito-entry-door",
    )!;
    const exitDoor = LEVEL_03.interactiveObjects.find(
      (object) => object.id === "level-03-hirolito-exit-door",
    )!;

    expect(LEVEL_03.bounds.width).toBe(TILE_SIZE_PX * 90);
    expect(checkpoint.initialEnergy).toBe(60);
    expect(HIROLITO_ARENA_X - (checkpoint.area.x + checkpoint.area.width)).toBe(
      TILE_SIZE_PX * 4,
    );
    expect(approachFloor.area.x + approachFloor.area.width).toBe(
      arenaFloor.area.x,
    );
    expect(arenaFloor.area).toEqual({
      x: HIROLITO_ARENA_X,
      y: FLOOR_Y,
      width: HIROLITO_ARENA_WIDTH,
      height: TILE_SIZE_PX,
    });
    expect(lowPlatform.area.x).toBe(HIROLITO_ARENA_X + TILE_SIZE_PX * 8);
    expect(lowPlatform.area.y).toBe(FLOOR_Y - TILE_SIZE_PX * 3);
    expect(lowPlatform.area.width).toBe(TILE_SIZE_PX * 4);
    expect(entryDoor).toMatchObject({
      kind: "door",
      area: {
        x: HIROLITO_ARENA_X,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: true,
    });
    expect(exitDoor).toMatchObject({
      kind: "door",
      area: {
        x: HIROLITO_ARENA_X + HIROLITO_ARENA_WIDTH - TILE_SIZE_PX * 2,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: false,
    });
  });

  it("declares Hirolito with smoke-puff and hose-snap in the final arena", () => {
    const boss = (LEVEL_03.bosses ?? []).find(
      (candidate) => candidate.id === "boss-hirolito-narguilito",
    )!;
    const crystal = (LEVEL_03.energyTargets ?? []).find(
      (target) => target.id === "level-03-hirolito-crystal",
    )!;

    expect(boss).toMatchObject({
      levelId: "level-03",
      displayName: "Hirolito Narguilito",
      health: 2,
      arena: {
        x: HIROLITO_ARENA_X,
        y: FLOOR_Y - TILE_SIZE_PX * 10,
        width: HIROLITO_ARENA_WIDTH,
        height: TILE_SIZE_PX * 11,
      },
      entryCheckpointId: "level-03-before-hirolito",
      entryDoorId: "level-03-hirolito-entry-door",
      defeatUnlocks: ["level-03-hirolito-exit-door"],
    });
    expect(boss.assetId).toBe("boss-hirolito-narguilito");
    expect(boss.movement).toMatchObject({
      kind: "patrol",
      speedPxPerSecond: 28,
    });
    expect(boss.attacks.map((attack) => attack.kind)).toEqual([
      "smoke-puff",
      "hose-snap",
    ]);
    expect(boss.attacks[0]).toMatchObject({
      id: "level-03-hirolito-smoke-puff",
      windupMs: 550,
      recoverMs: 1200,
      cooldownMs: 1500,
      contactDamage: 0,
      projectile: {
        velocity: {
          x: -58,
          y: 0,
        },
        maxActive: 1,
        isDestructibleBy: ["cyan-spark"],
      },
      opensVulnerabilityWindowId: "level-03-hirolito-recover",
    });
    expect(boss.attacks[1]).toMatchObject({
      id: "level-03-hirolito-hose-snap",
      windupMs: 550,
      activeMs: 280,
      recoverMs: 1200,
      cooldownMs: 1500,
      contactDamage: 1,
      opensVulnerabilityWindowId: "level-03-hirolito-recover",
    });
    expect(boss.attacks[1]!.hitbox).toEqual(boss.attacks[1]!.tellArea);
    expect(boss.vulnerabilityWindows).toEqual([
      {
        id: "level-03-hirolito-recover",
        state: "recover",
        durationMs: 1200,
        weakPointActive: true,
        opensAfterAttackIds: [
          "level-03-hirolito-smoke-puff",
          "level-03-hirolito-hose-snap",
        ],
      },
    ]);
    expect(crystal).toMatchObject({
      kind: "boss-hurtbox",
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitGroupId: "boss-hirolito-narguilito",
    });
    expect(crystal.area).toEqual(boss.weakPoint);
  });

  it("keeps Hirolito content references wired to schema, assets and arena lock", () => {
    const boss = (LEVEL_03.bosses ?? []).find(
      (candidate) => candidate.id === "boss-hirolito-narguilito",
    )!;
    const entryDoor = LEVEL_03.interactiveObjects.find(
      (object) => object.id === boss.entryDoorId,
    )!;
    const exitDoor = LEVEL_03.interactiveObjects.find(
      (object) => object.id === boss.defeatUnlocks[0],
    )!;
    const hurtbox = (LEVEL_03.energyTargets ?? []).find(
      (target) => target.hitGroupId === boss.id,
    )!;
    const projectileAttack = boss.attacks.find(
      (attack) => attack.kind === "smoke-puff",
    )!;

    expect(validateLevel(LEVEL_03)).toEqual({
      isValid: true,
      issues: [],
    });
    expect(LEVEL_03.bosses).toHaveLength(1);
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
    expect(hurtbox).toMatchObject({
      kind: "boss-hurtbox",
      hitPoints: boss.health,
      resetOnRespawn: true,
      hitGroupId: boss.id,
    });
    expect(boss.damageRules.map((rule) => rule.power)).toEqual([
      "cyan-spark",
      "cyan-burst",
    ]);
    expect(
      boss.vulnerabilityWindows[0]!.opensAfterAttackIds?.every((attackId) =>
        boss.attacks.some((attack) => attack.id === attackId),
      ),
    ).toBe(true);
    expect(LEVEL_03.assets.sprites).toEqual(
      expect.arrayContaining([boss.assetId, "boss-projectile-smoke-puff"]),
    );
    expect(projectileAttack.projectile?.maxRangePx).toBeLessThanOrEqual(
      HIROLITO_ARENA_WIDTH,
    );
  });

  it("keeps Hirolito balanced as a first boss", () => {
    const boss = (LEVEL_03.bosses ?? []).find(
      (candidate) => candidate.id === "boss-hirolito-narguilito",
    )!;
    const recoverWindow = boss.vulnerabilityWindows.find(
      (window) => window.id === "level-03-hirolito-recover",
    )!;

    expect(boss.health).toBe(2);
    expect(boss.movement.speedPxPerSecond).toBeLessThanOrEqual(30);
    expect(boss.attacks.every((attack) => attack.recoverMs >= 1200)).toBe(true);
    expect(
      boss.attacks.every((attack) => attack.cooldownMs > attack.recoverMs),
    ).toBe(true);
    expect(recoverWindow.durationMs).toBeGreaterThanOrEqual(1200);
  });

  it("keeps fall hazards under both punishment sections", () => {
    expect(
      LEVEL_03.hazards
        .filter((hazard) => hazard.kind === "fall")
        .map((hazard) => hazard.id),
    ).toEqual(["level-03-fall-sequence", "level-03-fall-cruel-exit"]);
  });

  it("declares minimal sound hooks for reward and exit trick feedback", () => {
    expect(LEVEL_03.audio.sounds.map((sound) => sound.id)).toEqual([
      "level-03-token-sfx",
      "level-03-false-floor-sfx",
    ]);
    expect(LEVEL_03.assets.audio).toEqual([
      "sfx-level-03-token",
      "sfx-level-03-false-floor",
    ]);
  });

  it("has an exit contact area that can complete the phase", () => {
    expect(isTouchingExit(LEVEL_03.exit.area, LEVEL_03)).toBe(true);

    const exitPlatform = LEVEL_03.terrain.find(
      (terrain) => terrain.id === "level-03-hirolito-arena-floor",
    )!;

    expect(LEVEL_03.exit.area.x).toBeGreaterThanOrEqual(exitPlatform.area.x);
    expect(LEVEL_03.exit.area.x + LEVEL_03.exit.area.width).toBeLessThanOrEqual(
      exitPlatform.area.x + exitPlatform.area.width,
    );
    expect(LEVEL_03.exit.area.y + LEVEL_03.exit.area.height).toBe(
      exitPlatform.area.y,
    );
  });

  it("chains level 03 to level 04 only after Hirolito is defeated", () => {
    const roomState = createInitialRoomState(LEVEL_03);
    const boss = (LEVEL_03.bosses ?? []).find(
      (candidate) => candidate.id === "boss-hirolito-narguilito",
    )!;
    const exitDoor = LEVEL_03.interactiveObjects.find(
      (object) => object.id === "level-03-hirolito-exit-door",
    )!;

    expect(LEVEL_03.exit.nextLevelId).toBe("level-04");
    expect(isLevelExitBlockedByLivingBosses(LEVEL_03.bosses, roomState)).toBe(
      true,
    );
    expect(roomState.interactiveObjects[exitDoor.id]).toMatchObject({
      isActive: false,
    });
    expect(
      getInteractiveObjectSolidAreas(LEVEL_03.interactiveObjects, roomState),
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
      LEVEL_03.bosses,
    );

    expect(
      isLevelExitBlockedByLivingBosses(LEVEL_03.bosses, unlockedState),
    ).toBe(false);
    expect(unlockedState.interactiveObjects[exitDoor.id]).toMatchObject({
      isActive: true,
    });
    expect(
      getInteractiveObjectSolidAreas(
        LEVEL_03.interactiveObjects,
        unlockedState,
      ),
    ).not.toContainEqual(exitDoor.area);
  });
});
