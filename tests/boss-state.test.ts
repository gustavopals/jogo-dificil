import { describe, expect, it } from "vitest";

import type { BossDefinition } from "../src/data/levels/schema";
import {
  applyBossRuntimeDamage,
  createInitialBossRuntimeState,
  resetBossRuntimeState,
  transitionBossRuntimeState,
  updateBossAnchorMovement,
  updateBossRuntimeTimers,
} from "../src/game/physics";

const BOSS = {
  id: "boss-state-test",
  levelId: "level-boss-state-test",
  displayName: "Boss State Test",
  arena: {
    x: 160,
    y: 110,
    width: 180,
    height: 128,
  },
  spawn: {
    x: 240,
    y: 190,
  },
  initialFacing: "left",
  health: 3,
  hitbox: {
    x: 224,
    y: 160,
    width: 34,
    height: 62,
  },
  weakPoint: {
    x: 232,
    y: 174,
    width: 16,
    height: 16,
  },
  resetOnRespawn: true,
  movement: {
    kind: "patrol",
    speedPxPerSecond: 40,
    anchors: [
      {
        x: 192,
        y: 190,
      },
      {
        x: 304,
        y: 190,
      },
    ],
  },
  attacks: [
    {
      id: "boss-state-smoke",
      kind: "smoke-puff",
      windupMs: 500,
      activeMs: 600,
      recoverMs: 800,
      cooldownMs: 900,
      contactDamage: 1,
      opensVulnerabilityWindowId: "boss-state-recover",
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
  ],
  vulnerabilityWindows: [
    {
      id: "boss-state-recover",
      state: "recover",
      durationMs: 800,
      weakPointActive: true,
      opensAfterAttackIds: ["boss-state-smoke"],
    },
  ],
  entryCheckpointId: "boss-state-entry-checkpoint",
  defeatUnlocks: ["boss-state-exit-door"],
  assetId: "boss-state-sprite",
} satisfies BossDefinition;

const THREE_ANCHOR_BOSS = {
  ...BOSS,
  id: "boss-three-anchor-state-test",
  spawn: {
    x: 192,
    y: 190,
  },
  initialFacing: "right",
  movement: {
    kind: "anchor-swap",
    speedPxPerSecond: 48,
    anchors: [
      {
        x: 192,
        y: 190,
      },
      {
        x: 240,
        y: 190,
      },
      {
        x: 288,
        y: 190,
      },
    ],
  },
} satisfies BossDefinition;

describe("boss state", () => {
  it("creates the initial runtime state from a boss definition", () => {
    expect(createInitialBossRuntimeState(BOSS)).toEqual({
      id: "boss-state-test",
      health: 3,
      healthRemaining: 3,
      state: "inactive",
      position: {
        x: 240,
        y: 190,
      },
      facing: "left",
      stateElapsedMs: 0,
      stateRemainingMs: 0,
      attackCooldownRemainingMs: 0,
      invulnerabilityRemainingMs: 0,
      attackSequence: 0,
      damageHitLockKeys: [],
      resetOnRespawn: true,
    });
  });

  it("transitions state while setting timers, facing and active ids", () => {
    const transitioned = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(BOSS),
      nextState: "attack",
      durationMs: 600,
      attackCooldownMs: 900,
      facing: "right",
      activeAttackId: "boss-state-smoke",
    });

    expect(transitioned).toMatchObject({
      state: "attack",
      facing: "right",
      stateElapsedMs: 0,
      stateRemainingMs: 600,
      attackCooldownRemainingMs: 900,
      activeAttackId: "boss-state-smoke",
    });
  });

  it("ticks timers without going below zero", () => {
    const state = {
      ...transitionBossRuntimeState({
        state: createInitialBossRuntimeState(BOSS),
        nextState: "recover",
        durationMs: 800,
        attackCooldownMs: 300,
        activeVulnerabilityWindowId: "boss-state-recover",
      }),
      invulnerabilityRemainingMs: 650,
    };
    const ticking = updateBossRuntimeTimers(state, 500);
    const ended = updateBossRuntimeTimers(ticking, 500);

    expect(ticking).toMatchObject({
      stateElapsedMs: 500,
      stateRemainingMs: 300,
      attackCooldownRemainingMs: 0,
      invulnerabilityRemainingMs: 150,
      activeVulnerabilityWindowId: "boss-state-recover",
    });
    expect(ended).toMatchObject({
      stateElapsedMs: 1_000,
      stateRemainingMs: 0,
      attackCooldownRemainingMs: 0,
      invulnerabilityRemainingMs: 0,
    });
  });

  it("moves patrolling bosses toward anchors using declared speed", () => {
    const state = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(BOSS),
      nextState: "patrol",
    });
    const moved = updateBossAnchorMovement(BOSS, state, 500);

    expect(moved).toMatchObject({
      state: "patrol",
      position: {
        x: 220,
        y: 190,
      },
      facing: "left",
    });
  });

  it("cycles anchor-swap movement through three anchors", () => {
    const state = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(THREE_ANCHOR_BOSS),
      nextState: "patrol",
    });
    const movedToMiddle = updateBossAnchorMovement(
      THREE_ANCHOR_BOSS,
      state,
      1_000,
    );
    const movedToRight = updateBossAnchorMovement(
      THREE_ANCHOR_BOSS,
      movedToMiddle,
      1_000,
    );
    const wrappedToLeft = updateBossAnchorMovement(
      THREE_ANCHOR_BOSS,
      movedToRight,
      2_000,
    );

    expect(movedToMiddle.position).toEqual({
      x: 240,
      y: 190,
    });
    expect(movedToRight.position).toEqual({
      x: 288,
      y: 190,
    });
    expect(wrappedToLeft.position).toEqual({
      x: 192,
      y: 190,
    });
  });

  it("applies damage, starts stun and blocks repeated hits during invulnerability", () => {
    const damaged = applyBossRuntimeDamage({
      state: transitionBossRuntimeState({
        state: createInitialBossRuntimeState(BOSS),
        nextState: "recover",
        durationMs: 800,
        activeVulnerabilityWindowId: "boss-state-recover",
      }),
      damage: 1,
      invulnerabilityMs: 650,
      stunMs: 250,
      damageHitLockKey: "cyan-burst:test-shot",
    });
    const blocked = applyBossRuntimeDamage({
      state: damaged.state,
      damage: 1,
      invulnerabilityMs: 650,
    });

    expect(damaged).toEqual({
      state: {
        ...damaged.state,
        healthRemaining: 2,
        state: "stunned",
        stateElapsedMs: 0,
        stateRemainingMs: 250,
        invulnerabilityRemainingMs: 650,
        activeAttackId: undefined,
        activeVulnerabilityWindowId: undefined,
        damageHitLockKeys: ["cyan-burst:test-shot"],
      },
      didApplyDamage: true,
      didDefeat: false,
    });
    expect(blocked).toEqual({
      state: damaged.state,
      didApplyDamage: false,
      didDefeat: false,
    });
  });

  it("enters defeated state when health reaches zero", () => {
    const defeated = applyBossRuntimeDamage({
      state: {
        ...createInitialBossRuntimeState(BOSS),
        healthRemaining: 1,
        state: "recover",
        stateRemainingMs: 300,
        activeAttackId: "boss-state-smoke",
        activeVulnerabilityWindowId: "boss-state-recover",
      },
      damage: 2,
      invulnerabilityMs: 650,
      stunMs: 250,
    });

    expect(defeated).toEqual({
      state: {
        ...defeated.state,
        healthRemaining: 0,
        state: "defeated",
        stateElapsedMs: 0,
        stateRemainingMs: 0,
        attackCooldownRemainingMs: 0,
        invulnerabilityRemainingMs: 0,
        activeAttackId: undefined,
        activeVulnerabilityWindowId: undefined,
      },
      didApplyDamage: true,
      didDefeat: true,
    });
  });

  it("resets the runtime state from the boss definition", () => {
    expect(resetBossRuntimeState(BOSS)).toEqual(
      createInitialBossRuntimeState(BOSS),
    );
  });
});
