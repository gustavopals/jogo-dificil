import { describe, expect, it } from "vitest";

import {
  defineLevel,
  LEVEL_02,
  type BossDefinition,
  type LevelDefinition,
} from "../src/data/levels";
import {
  applyBossRuntimeDamage,
  createBossProjectile,
  transitionBossRuntimeState,
} from "../src/game/physics";
import { getInteractiveObjectSolidAreas } from "../src/game/systems/level-interactive-objects";
import {
  applyBossEnergyHit,
  BOSS_ENERGY_HIT_INVULNERABILITY_MS,
  BOSS_ENERGY_HIT_STUN_MS,
  findBossEntryCheckpoint,
  findEnteredBossArenas,
  findEnteredBossArenaCheckpoints,
  getBossBodyHealthIndicator,
  getBossEnergyBlockingHitboxes,
  getBossTextureKey,
  getBossWeakPointCrystalFeedback,
  findTouchedBossThreat,
  isBossAlive,
  isLevelExitBlockedByLivingBosses,
  lockEnteredBossArenas,
  updateBossAttackRuntime,
  unlockDefeatedBossObjects,
} from "../src/game/systems/level-bosses";
import {
  createInitialRoomState,
  setRoomBossRuntimeState,
  spawnRoomBossProjectile,
} from "../src/game/systems/room-state";
import { VISUAL_READABILITY_SEMANTIC_COLORS } from "../src/game/systems/visual-readability";

const ENTRY_DOOR = {
  id: "test-boss-entry-door",
  kind: "door",
  area: {
    x: 224,
    y: 174,
    width: 16,
    height: 48,
  },
  startsActive: true,
  resetOnRespawn: true,
} as const;

const ENTRY_CHECKPOINT = {
  id: "test-boss-entry-checkpoint",
  position: {
    x: 224,
    y: 222,
  },
  area: {
    x: 208,
    y: 174,
    width: 32,
    height: 48,
  },
} as const;

const BOSS = {
  id: "test-arena-boss",
  levelId: "level-02",
  displayName: "Boss De Arena",
  arena: {
    x: 240,
    y: 126,
    width: 176,
    height: 112,
  },
  spawn: {
    x: 352,
    y: 190,
  },
  initialFacing: "left",
  health: 3,
  hitbox: {
    x: 336,
    y: 160,
    width: 34,
    height: 62,
  },
  weakPoint: {
    x: 344,
    y: 176,
    width: 16,
    height: 16,
  },
  resetOnRespawn: true,
  movement: {
    kind: "patrol",
    speedPxPerSecond: 40,
    anchors: [
      {
        x: 304,
        y: 190,
      },
      {
        x: 400,
        y: 190,
      },
    ],
  },
  attacks: [
    {
      id: "test-arena-boss-smoke",
      kind: "smoke-puff",
      windupMs: 500,
      activeMs: 600,
      recoverMs: 800,
      cooldownMs: 900,
      contactDamage: 1,
      tellArea: {
        x: 288,
        y: 190,
        width: 80,
        height: 20,
      },
      hitbox: {
        x: 296,
        y: 184,
        width: 64,
        height: 28,
      },
      projectile: {
        hitbox: {
          x: -7,
          y: -7,
          width: 14,
          height: 14,
        },
        velocity: {
          x: -80,
          y: 0,
        },
        maxActive: 1,
        maxRangePx: 96,
        isDestructibleBy: ["cyan-spark"],
      },
      opensVulnerabilityWindowId: "test-arena-boss-recover",
    },
  ],
  damageRules: [
    {
      power: "cyan-spark",
      damage: 1,
      validStates: ["recover"],
      requiresWeakPoint: true,
      oncePerAttack: false,
      consumesHit: true,
      effects: ["damage"],
    },
    {
      power: "cyan-burst",
      damage: 1,
      validStates: ["recover"],
      requiresWeakPoint: true,
      oncePerAttack: true,
      consumesHit: true,
      effects: ["damage"],
    },
  ],
  vulnerabilityWindows: [
    {
      id: "test-arena-boss-recover",
      state: "recover",
      durationMs: 800,
      weakPointActive: true,
      opensAfterAttackIds: ["test-arena-boss-smoke"],
    },
  ],
  entryCheckpointId: "test-boss-entry-checkpoint",
  entryDoorId: "test-boss-entry-door",
  defeatUnlocks: ["level-02-exit-door"],
} satisfies BossDefinition;

const LEVEL_WITH_BOSS = defineLevel({
  ...LEVEL_02,
  checkpoints: [...LEVEL_02.checkpoints, ENTRY_CHECKPOINT],
  interactiveObjects: [...LEVEL_02.interactiveObjects, ENTRY_DOOR],
  bosses: [BOSS],
} satisfies LevelDefinition);
const EXIT_DOOR = LEVEL_WITH_BOSS.interactiveObjects.find(
  (interactiveObject) => interactiveObject.id === "level-02-exit-door",
)!;

describe("level bosses", () => {
  it("finds inactive bosses when the player enters their arena", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);

    expect(
      findEnteredBossArenas(
        {
          x: 260,
          y: 180,
          width: 10,
          height: 22,
        },
        LEVEL_WITH_BOSS.bosses,
        roomState,
      ),
    ).toEqual([
      {
        boss: BOSS,
        state: roomState.bosses["test-arena-boss"],
      },
    ]);
  });

  it("finds the entry checkpoint for a newly entered boss arena", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const playerHitbox = {
      x: 260,
      y: 180,
      width: 10,
      height: 22,
    };

    expect(findBossEntryCheckpoint(BOSS, LEVEL_WITH_BOSS.checkpoints)).toEqual(
      ENTRY_CHECKPOINT,
    );
    expect(
      findEnteredBossArenaCheckpoints(
        playerHitbox,
        LEVEL_WITH_BOSS.bosses,
        roomState,
        LEVEL_WITH_BOSS.checkpoints,
        "level-02-mid",
      ),
    ).toEqual([
      {
        boss: BOSS,
        checkpoint: ENTRY_CHECKPOINT,
      },
    ]);
  });

  it("does not request entry checkpoint activation when it is already active", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);

    expect(
      findEnteredBossArenaCheckpoints(
        BOSS.arena,
        LEVEL_WITH_BOSS.bosses,
        roomState,
        LEVEL_WITH_BOSS.checkpoints,
        ENTRY_CHECKPOINT.id,
      ),
    ).toEqual([]);
  });

  it("closes the entry door and starts the boss intro when the player enters", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const lockedState = lockEnteredBossArenas(
      roomState,
      LEVEL_WITH_BOSS.bosses,
      {
        x: 260,
        y: 180,
        width: 10,
        height: 22,
      },
    );

    expect(roomState.interactiveObjects["test-boss-entry-door"]).toMatchObject({
      isActive: true,
    });
    expect(
      lockedState.interactiveObjects["test-boss-entry-door"],
    ).toMatchObject({
      isActive: false,
    });
    expect(lockedState.bosses["test-arena-boss"]).toMatchObject({
      state: "intro",
      stateElapsedMs: 0,
      stateRemainingMs: 0,
    });
    expect(
      getInteractiveObjectSolidAreas(
        LEVEL_WITH_BOSS.interactiveObjects,
        lockedState,
      ),
    ).toContainEqual(ENTRY_DOOR.area);
  });

  it("does not relock an arena that has already started", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const lockedState = lockEnteredBossArenas(
      roomState,
      LEVEL_WITH_BOSS.bosses,
      BOSS.arena,
    );
    const repeatedState = lockEnteredBossArenas(
      lockedState,
      LEVEL_WITH_BOSS.bosses,
      BOSS.arena,
    );

    expect(repeatedState).toBe(lockedState);
  });

  it("creates body-mounted boss health pips for active fights", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const inactiveBossState = roomState.bosses["test-arena-boss"]!;
    const activeBossState = {
      ...inactiveBossState,
      state: "recover",
      healthRemaining: 1,
      invulnerabilityRemainingMs: 120,
    } as const;
    const defeatedBossState = {
      ...activeBossState,
      state: "defeated",
      healthRemaining: 0,
    } as const;

    expect(getBossTextureKey(BOSS)).toBe("boss-hirolito-sheet-1024");
    expect(
      getBossTextureKey({
        ...BOSS,
        assetId: "custom-boss-sprite",
      }),
    ).toBe("custom-boss-sprite");
    expect(getBossBodyHealthIndicator(BOSS, inactiveBossState)).toMatchObject({
      visible: false,
    });
    expect(getBossBodyHealthIndicator(BOSS, defeatedBossState)).toMatchObject({
      visible: false,
    });
    expect(getBossBodyHealthIndicator(BOSS, activeBossState)).toMatchObject({
      visible: true,
      frame: {
        x: 340,
        y: 162,
        width: 26,
        height: 7,
      },
      pips: [
        {
          area: {
            x: 342,
            y: 164,
            width: 6,
            height: 3,
          },
          isFilled: true,
          fillColor: 0xe76f51,
        },
        {
          area: {
            x: 350,
            y: 164,
            width: 6,
            height: 3,
          },
          isFilled: false,
          fillColor: 0x3f4958,
        },
        {
          area: {
            x: 358,
            y: 164,
            width: 6,
            height: 3,
          },
          isFilled: false,
          fillColor: 0x3f4958,
        },
      ],
    });
  });

  it("exposes crystal weak point feedback only during active boss fights", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const inactiveBossState = roomState.bosses["test-arena-boss"]!;
    const closedCrystalState = {
      ...inactiveBossState,
      state: "patrol",
    } as const;
    const openCrystalState = {
      ...inactiveBossState,
      state: "recover",
      activeVulnerabilityWindowId: "test-arena-boss-recover",
    } as const;
    const defeatedBossState = {
      ...openCrystalState,
      state: "defeated",
      healthRemaining: 0,
    } as const;

    expect(
      getBossWeakPointCrystalFeedback(BOSS, inactiveBossState),
    ).toMatchObject({
      visible: false,
      isOpen: false,
      area: BOSS.weakPoint,
    });
    expect(
      getBossWeakPointCrystalFeedback(BOSS, closedCrystalState),
    ).toMatchObject({
      visible: true,
      isOpen: false,
      fillColor: VISUAL_READABILITY_SEMANTIC_COLORS.boss.healthEmpty,
      pulseAlpha: 0,
    });
    expect(
      getBossWeakPointCrystalFeedback(BOSS, openCrystalState),
    ).toMatchObject({
      visible: true,
      isOpen: true,
      fillColor: VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary,
      strokeColor: VISUAL_READABILITY_SEMANTIC_COLORS.energy.charged,
    });
    expect(
      getBossWeakPointCrystalFeedback(BOSS, openCrystalState).fillAlpha,
    ).toBeGreaterThan(
      getBossWeakPointCrystalFeedback(BOSS, closedCrystalState).fillAlpha,
    );
    expect(
      getBossWeakPointCrystalFeedback(BOSS, openCrystalState).pulseAlpha,
    ).toBeGreaterThan(0);
    expect(
      getBossWeakPointCrystalFeedback(BOSS, defeatedBossState),
    ).toMatchObject({
      visible: false,
    });
  });

  it("advances boss attacks through tell, attack and recover using boss projectiles", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const windupState = setRoomBossRuntimeState(
      roomState,
      transitionBossRuntimeState({
        state: roomState.bosses["test-arena-boss"]!,
        nextState: "windup",
        durationMs: 500,
        activeAttackId: "test-arena-boss-smoke",
      }),
    );
    const attackUpdate = updateBossAttackRuntime(
      windupState,
      LEVEL_WITH_BOSS.bosses,
      500,
      LEVEL_WITH_BOSS.bounds,
    );
    const recoverUpdate = updateBossAttackRuntime(
      attackUpdate.state,
      LEVEL_WITH_BOSS.bosses,
      600,
      LEVEL_WITH_BOSS.bounds,
    );

    expect(attackUpdate.state.bosses["test-arena-boss"]).toMatchObject({
      state: "attack",
      stateRemainingMs: 600,
      activeAttackId: "test-arena-boss-smoke",
    });
    expect(attackUpdate.state.projectiles).toEqual([]);
    expect(attackUpdate.state.bossProjectiles).toHaveLength(1);
    expect(attackUpdate.state.bossProjectiles[0]).toMatchObject({
      id: "test-arena-boss-test-arena-boss-smoke-0",
      bossId: "test-arena-boss",
      attackId: "test-arena-boss-smoke",
    });
    expect(attackUpdate.events).toEqual([
      {
        kind: "attack-started",
        bossId: "test-arena-boss",
        attackId: "test-arena-boss-smoke",
      },
    ]);
    expect(recoverUpdate.state.bosses["test-arena-boss"]).toMatchObject({
      state: "recover",
      stateRemainingMs: 800,
      attackCooldownRemainingMs: 900,
      activeAttackId: "test-arena-boss-smoke",
      activeVulnerabilityWindowId: "test-arena-boss-recover",
    });
    expect(recoverUpdate.events).toEqual([
      {
        kind: "recover-started",
        bossId: "test-arena-boss",
        attackId: "test-arena-boss-smoke",
      },
    ]);
  });

  it("exposes paper-wall active hitboxes as temporary energy blockers", () => {
    const paperWallAttack = {
      id: "test-arena-boss-paper-wall",
      kind: "paper-wall",
      windupMs: 500,
      activeMs: 520,
      recoverMs: 800,
      cooldownMs: 900,
      contactDamage: 0,
      tellArea: {
        x: 320,
        y: 150,
        width: 16,
        height: 72,
      },
      hitbox: {
        x: 320,
        y: 150,
        width: 16,
        height: 72,
      },
      opensVulnerabilityWindowId: "test-arena-boss-recover",
    } satisfies BossDefinition["attacks"][number];
    const paperWallBoss = {
      ...BOSS,
      attacks: [...BOSS.attacks, paperWallAttack],
    } satisfies BossDefinition;
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const attackState = setRoomBossRuntimeState(
      roomState,
      transitionBossRuntimeState({
        state: roomState.bosses["test-arena-boss"]!,
        nextState: "attack",
        durationMs: 520,
        activeAttackId: "test-arena-boss-paper-wall",
      }),
    );

    expect(getBossEnergyBlockingHitboxes([paperWallBoss], attackState)).toEqual(
      [paperWallAttack.hitbox],
    );
    expect(getBossEnergyBlockingHitboxes([paperWallBoss], roomState)).toEqual(
      [],
    );
  });

  it("removes active boss projectiles through room collision solids", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const windupState = setRoomBossRuntimeState(
      roomState,
      transitionBossRuntimeState({
        state: roomState.bosses["test-arena-boss"]!,
        nextState: "windup",
        durationMs: 500,
        activeAttackId: "test-arena-boss-smoke",
      }),
    );
    const attackUpdate = updateBossAttackRuntime(
      windupState,
      LEVEL_WITH_BOSS.bosses,
      500,
      LEVEL_WITH_BOSS.bounds,
    );
    const solidUpdate = updateBossAttackRuntime(
      attackUpdate.state,
      LEVEL_WITH_BOSS.bosses,
      16,
      LEVEL_WITH_BOSS.bounds,
      [
        {
          x: 340,
          y: 180,
          width: 24,
          height: 24,
        },
      ],
    );

    expect(attackUpdate.state.bossProjectiles).toHaveLength(1);
    expect(solidUpdate.state.bossProjectiles).toEqual([]);
  });

  it("applies Centelha Ciano boss damage only during a weak point vulnerability window", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const vulnerableState = setRoomBossRuntimeState(roomState, {
      ...roomState.bosses["test-arena-boss"]!,
      state: "recover",
      activeVulnerabilityWindowId: "test-arena-boss-recover",
    });
    const missedState = applyBossEnergyHit(
      vulnerableState,
      LEVEL_WITH_BOSS.bosses,
      {
        bossId: "test-arena-boss",
        power: "cyan-spark",
        didHitWeakPoint: false,
      },
    );
    const damagedState = applyBossEnergyHit(
      vulnerableState,
      LEVEL_WITH_BOSS.bosses,
      {
        bossId: "test-arena-boss",
        power: "cyan-spark",
        didHitWeakPoint: true,
      },
    );

    expect(missedState.didApplyDamage).toBe(false);
    expect(missedState.state).toBe(vulnerableState);
    expect(damagedState).toMatchObject({
      didApplyDamage: true,
      didDefeat: false,
      didConsumeHit: true,
      damage: 1,
      bossId: "test-arena-boss",
    });
    expect(damagedState.state.bosses["test-arena-boss"]).toMatchObject({
      healthRemaining: 2,
      state: "stunned",
      stateRemainingMs: BOSS_ENERGY_HIT_STUN_MS,
      invulnerabilityRemainingMs: BOSS_ENERGY_HIT_INVULNERABILITY_MS,
    });
  });

  it("ignores energy boss damage outside declared damage rule states", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const patrollingState = setRoomBossRuntimeState(roomState, {
      ...roomState.bosses["test-arena-boss"]!,
      state: "patrol",
    });
    const result = applyBossEnergyHit(patrollingState, LEVEL_WITH_BOSS.bosses, {
      bossId: "test-arena-boss",
      power: "cyan-spark",
      didHitWeakPoint: true,
    });

    expect(result.didApplyDamage).toBe(false);
    expect(result.damage).toBe(0);
    expect(result.state).toBe(patrollingState);
  });

  it("requires an active vulnerability window for weak point boss damage", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const recoverWithoutWindowState = setRoomBossRuntimeState(roomState, {
      ...roomState.bosses["test-arena-boss"]!,
      state: "recover",
    });
    const result = applyBossEnergyHit(
      recoverWithoutWindowState,
      LEVEL_WITH_BOSS.bosses,
      {
        bossId: "test-arena-boss",
        power: "cyan-spark",
        didHitWeakPoint: true,
      },
    );

    expect(result.didApplyDamage).toBe(false);
    expect(result.state).toBe(recoverWithoutWindowState);
  });

  it("applies Rajada Ciano boss damage through boss damage rules", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const vulnerableState = setRoomBossRuntimeState(roomState, {
      ...roomState.bosses["test-arena-boss"]!,
      state: "recover",
      healthRemaining: 1,
      activeVulnerabilityWindowId: "test-arena-boss-recover",
    });
    const result = applyBossEnergyHit(vulnerableState, LEVEL_WITH_BOSS.bosses, {
      bossId: "test-arena-boss",
      power: "cyan-burst",
      didHitWeakPoint: true,
      sourceAttackId: "cyan-burst-01",
    });

    expect(result).toMatchObject({
      didApplyDamage: true,
      didDefeat: true,
      didConsumeHit: true,
      damage: 1,
      bossId: "test-arena-boss",
    });
    expect(result.state.bosses["test-arena-boss"]).toMatchObject({
      healthRemaining: 0,
      state: "defeated",
      damageHitLockKeys: ["cyan-burst:cyan-burst-01"],
    });
  });

  it("limits once-per-attack boss damage to one hit from the same source attack", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const vulnerableState = setRoomBossRuntimeState(roomState, {
      ...roomState.bosses["test-arena-boss"]!,
      state: "recover",
      activeVulnerabilityWindowId: "test-arena-boss-recover",
    });
    const firstHit = applyBossEnergyHit(
      vulnerableState,
      LEVEL_WITH_BOSS.bosses,
      {
        bossId: "test-arena-boss",
        power: "cyan-burst",
        didHitWeakPoint: true,
        sourceAttackId: "cyan-burst-repeat",
      },
    );
    const stillVulnerableState = setRoomBossRuntimeState(firstHit.state, {
      ...firstHit.state.bosses["test-arena-boss"]!,
      state: "recover",
      activeVulnerabilityWindowId: "test-arena-boss-recover",
      invulnerabilityRemainingMs: 0,
    });
    const repeatedHit = applyBossEnergyHit(
      stillVulnerableState,
      LEVEL_WITH_BOSS.bosses,
      {
        bossId: "test-arena-boss",
        power: "cyan-burst",
        didHitWeakPoint: true,
        sourceAttackId: "cyan-burst-repeat",
      },
    );
    const nextAttackHit = applyBossEnergyHit(
      stillVulnerableState,
      LEVEL_WITH_BOSS.bosses,
      {
        bossId: "test-arena-boss",
        power: "cyan-burst",
        didHitWeakPoint: true,
        sourceAttackId: "cyan-burst-next",
      },
    );

    expect(firstHit.didApplyDamage).toBe(true);
    expect(repeatedHit.didApplyDamage).toBe(false);
    expect(repeatedHit.state).toBe(stillVulnerableState);
    expect(nextAttackHit.didApplyDamage).toBe(true);
    expect(nextAttackHit.state.bosses["test-arena-boss"]).toMatchObject({
      healthRemaining: 1,
      damageHitLockKeys: [
        "cyan-burst:cyan-burst-repeat",
        "cyan-burst:cyan-burst-next",
      ],
    });
  });

  it("requires source attack identity for once-per-attack boss damage rules", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const vulnerableState = setRoomBossRuntimeState(roomState, {
      ...roomState.bosses["test-arena-boss"]!,
      state: "recover",
      activeVulnerabilityWindowId: "test-arena-boss-recover",
    });
    const result = applyBossEnergyHit(vulnerableState, LEVEL_WITH_BOSS.bosses, {
      bossId: "test-arena-boss",
      power: "cyan-burst",
      didHitWeakPoint: true,
    });

    expect(result.didApplyDamage).toBe(false);
    expect(result.state).toBe(vulnerableState);
  });

  it("detects boss projectile contact as a projectile death threat", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const attackState = transitionBossRuntimeState({
      state: roomState.bosses["test-arena-boss"]!,
      nextState: "attack",
      activeAttackId: "test-arena-boss-smoke",
    });
    const projectile = createBossProjectile({
      id: "test-boss-projectile-hit",
      boss: attackState,
      attack: BOSS.attacks[0]!,
    })!;
    const stateWithProjectile = spawnRoomBossProjectile(
      setRoomBossRuntimeState(roomState, attackState),
      projectile,
    );

    expect(
      findTouchedBossThreat(
        {
          x: 340,
          y: 180,
          width: 24,
          height: 24,
        },
        LEVEL_WITH_BOSS.bosses,
        stateWithProjectile,
      ),
    ).toMatchObject({
      kind: "projectile",
      cause: "projectile",
      sourceId: "test-boss-projectile-hit",
      boss: BOSS,
    });
  });

  it("detects active boss attack hitboxes as boss death threats", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const attackState = setRoomBossRuntimeState(
      roomState,
      transitionBossRuntimeState({
        state: roomState.bosses["test-arena-boss"]!,
        nextState: "attack",
        activeAttackId: "test-arena-boss-smoke",
      }),
    );

    expect(
      findTouchedBossThreat(
        {
          x: 300,
          y: 188,
          width: 10,
          height: 10,
        },
        LEVEL_WITH_BOSS.bosses,
        attackState,
      ),
    ).toMatchObject({
      kind: "attack",
      cause: "boss",
      sourceId: "test-arena-boss:test-arena-boss-smoke",
      boss: BOSS,
    });
  });

  it("detects active boss body contact and ignores inactive or defeated bodies", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const playerHitbox = {
      x: 344,
      y: 176,
      width: 10,
      height: 22,
    };
    const patrolState = setRoomBossRuntimeState(
      roomState,
      transitionBossRuntimeState({
        state: roomState.bosses["test-arena-boss"]!,
        nextState: "patrol",
      }),
    );
    const defeatedState = setRoomBossRuntimeState(patrolState, {
      ...patrolState.bosses["test-arena-boss"]!,
      state: "defeated",
      healthRemaining: 0,
    });

    expect(
      findTouchedBossThreat(playerHitbox, LEVEL_WITH_BOSS.bosses, roomState),
    ).toBeUndefined();
    expect(
      findTouchedBossThreat(playerHitbox, LEVEL_WITH_BOSS.bosses, patrolState),
    ).toMatchObject({
      kind: "body",
      cause: "boss",
      sourceId: "test-arena-boss",
      boss: BOSS,
    });
    expect(
      findTouchedBossThreat(
        playerHitbox,
        LEVEL_WITH_BOSS.bosses,
        defeatedState,
      ),
    ).toBeUndefined();
  });

  it("blocks level exit while any declared boss is alive", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);

    expect(
      isLevelExitBlockedByLivingBosses(LEVEL_WITH_BOSS.bosses, roomState),
    ).toBe(true);
    expect(isBossAlive(roomState.bosses["test-arena-boss"]!)).toBe(true);
  });

  it("allows level exit after all declared bosses are defeated", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const defeatedBoss = applyBossRuntimeDamage({
      state: {
        ...roomState.bosses["test-arena-boss"]!,
        state: "recover",
        healthRemaining: 1,
      },
      damage: 1,
      invulnerabilityMs: 650,
    }).state;
    const defeatedState = setRoomBossRuntimeState(roomState, defeatedBoss);

    expect(isBossAlive(defeatedBoss)).toBe(false);
    expect(
      isLevelExitBlockedByLivingBosses(LEVEL_WITH_BOSS.bosses, defeatedState),
    ).toBe(false);
  });

  it("keeps defeat unlock objects locked while the boss is alive", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const unchangedState = unlockDefeatedBossObjects(
      roomState,
      LEVEL_WITH_BOSS.bosses,
    );

    expect(unchangedState).toBe(roomState);
    expect(
      unchangedState.interactiveObjects["level-02-exit-door"],
    ).toMatchObject({
      isActive: false,
    });
  });

  it("opens defeat unlock objects after the boss is defeated", () => {
    const roomState = createInitialRoomState(LEVEL_WITH_BOSS);
    const defeatedBoss = applyBossRuntimeDamage({
      state: {
        ...roomState.bosses["test-arena-boss"]!,
        state: "recover",
        healthRemaining: 1,
      },
      damage: 1,
      invulnerabilityMs: 650,
    }).state;
    const defeatedState = setRoomBossRuntimeState(roomState, defeatedBoss);
    const unlockedState = unlockDefeatedBossObjects(
      defeatedState,
      LEVEL_WITH_BOSS.bosses,
    );

    expect(
      unlockedState.interactiveObjects["level-02-exit-door"],
    ).toMatchObject({
      isActive: true,
    });
    expect(
      getInteractiveObjectSolidAreas(
        LEVEL_WITH_BOSS.interactiveObjects,
        unlockedState,
      ),
    ).not.toContainEqual(EXIT_DOOR.area);
    expect(
      unlockDefeatedBossObjects(unlockedState, LEVEL_WITH_BOSS.bosses),
    ).toBe(unlockedState);
  });

  it("does not block level exit when the level has no bosses", () => {
    expect(
      isLevelExitBlockedByLivingBosses(
        undefined,
        createInitialRoomState(LEVEL_02),
      ),
    ).toBe(false);
  });
});
