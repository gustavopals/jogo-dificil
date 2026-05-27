import { describe, expect, it } from "vitest";

import type { BossDefinition } from "../src/data/levels/schema";
import {
  createInitialBossRuntimeState,
  getBossActiveAttackHitbox,
  getBossAttackTellArea,
  transitionBossRuntimeState,
  updateBossAttackCycle,
} from "../src/game/physics";

const BOSS = {
  id: "boss-attack-test",
  levelId: "level-boss-attack-test",
  displayName: "Boss Attack Test",
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
      id: "boss-attack-smoke",
      kind: "smoke-puff",
      windupMs: 500,
      activeMs: 600,
      recoverMs: 800,
      cooldownMs: 900,
      contactDamage: 1,
      tellArea: {
        x: 196,
        y: 190,
        width: 88,
        height: 20,
      },
      hitbox: {
        x: 200,
        y: 184,
        width: 80,
        height: 28,
      },
      opensVulnerabilityWindowId: "boss-attack-recover",
    },
    {
      id: "boss-attack-hose",
      kind: "hose-snap",
      windupMs: 520,
      activeMs: 260,
      recoverMs: 850,
      cooldownMs: 900,
      contactDamage: 1,
      tellArea: {
        x: 184,
        y: 202,
        width: 112,
        height: 16,
      },
      hitbox: {
        x: 184,
        y: 198,
        width: 112,
        height: 24,
      },
      opensVulnerabilityWindowId: "boss-attack-recover",
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
      id: "boss-attack-recover",
      state: "recover",
      durationMs: 800,
      weakPointActive: true,
      opensAfterAttackIds: ["boss-attack-smoke", "boss-attack-hose"],
    },
  ],
  entryCheckpointId: "boss-attack-entry-checkpoint",
  defeatUnlocks: ["boss-attack-exit-door"],
} satisfies BossDefinition;

const SMOKE_SWAP_BOSS = {
  ...BOSS,
  id: "boss-smoke-swap-test",
  movement: {
    kind: "anchor-swap",
    speedPxPerSecond: 36,
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
        x: 304,
        y: 190,
      },
    ],
  },
  spawn: {
    x: 240,
    y: 190,
  },
  attacks: [
    {
      id: "boss-smoke-swap",
      kind: "smoke-swap",
      windupMs: 500,
      activeMs: 220,
      recoverMs: 800,
      cooldownMs: 900,
      contactDamage: 0,
      tellArea: {
        x: 184,
        y: 154,
        width: 128,
        height: 72,
      },
      opensVulnerabilityWindowId: "boss-attack-recover",
    },
  ],
} satisfies BossDefinition;

describe("boss attacks", () => {
  it("starts windup from patrol and exposes the attack tell area", () => {
    const patrolState = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(BOSS),
      nextState: "patrol",
    });
    const result = updateBossAttackCycle({
      boss: BOSS,
      state: patrolState,
      deltaMs: 16,
    });

    expect(result.state).toMatchObject({
      state: "windup",
      stateElapsedMs: 0,
      stateRemainingMs: 500,
      attackSequence: 1,
      activeAttackId: "boss-attack-smoke",
    });
    expect(result.events).toEqual([
      {
        kind: "tell-started",
        bossId: "boss-attack-test",
        attackId: "boss-attack-smoke",
      },
    ]);
    expect(getBossAttackTellArea(BOSS, result.state)).toEqual(
      BOSS.attacks[0]!.tellArea,
    );
    expect(getBossActiveAttackHitbox(BOSS, result.state)).toBeUndefined();
  });

  it("cycles through declared attacks deterministically", () => {
    const firstPatrolState = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(BOSS),
      nextState: "patrol",
    });
    const firstTell = updateBossAttackCycle({
      boss: BOSS,
      state: firstPatrolState,
      deltaMs: 16,
    });
    const secondPatrolState = transitionBossRuntimeState({
      state: firstTell.state,
      nextState: "patrol",
    });
    const secondTell = updateBossAttackCycle({
      boss: BOSS,
      state: secondPatrolState,
      deltaMs: 16,
    });

    expect(firstTell.state).toMatchObject({
      activeAttackId: "boss-attack-smoke",
      attackSequence: 1,
    });
    expect(secondTell.state).toMatchObject({
      activeAttackId: "boss-attack-hose",
      attackSequence: 2,
      stateRemainingMs: 520,
    });
    expect(getBossAttackTellArea(BOSS, secondTell.state)).toEqual(
      BOSS.attacks[1]!.tellArea,
    );
  });

  it("transitions from windup to active attack and exposes the attack hitbox", () => {
    const windupState = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(BOSS),
      nextState: "windup",
      durationMs: 500,
      activeAttackId: "boss-attack-smoke",
    });
    const result = updateBossAttackCycle({
      boss: BOSS,
      state: windupState,
      deltaMs: 500,
    });

    expect(result.state).toMatchObject({
      state: "attack",
      stateElapsedMs: 0,
      stateRemainingMs: 600,
      activeAttackId: "boss-attack-smoke",
    });
    expect(result.events).toEqual([
      {
        kind: "attack-started",
        bossId: "boss-attack-test",
        attackId: "boss-attack-smoke",
      },
    ]);
    expect(getBossAttackTellArea(BOSS, result.state)).toBeUndefined();
    expect(getBossActiveAttackHitbox(BOSS, result.state)).toEqual(
      BOSS.attacks[0]!.hitbox,
    );
  });

  it("moves smoke-swap to the next declared anchor when the attack starts", () => {
    const windupState = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(SMOKE_SWAP_BOSS),
      nextState: "windup",
      durationMs: 500,
      attackSequence: 2,
      activeAttackId: "boss-smoke-swap",
    });
    const result = updateBossAttackCycle({
      boss: SMOKE_SWAP_BOSS,
      state: windupState,
      deltaMs: 500,
    });

    expect(result.state).toMatchObject({
      state: "attack",
      stateRemainingMs: 220,
      position: {
        x: 304,
        y: 190,
      },
      facing: "left",
      activeAttackId: "boss-smoke-swap",
    });
  });

  it("opens recover after active attack and returns to patrol after recover", () => {
    const attackState = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(BOSS),
      nextState: "attack",
      durationMs: 600,
      activeAttackId: "boss-attack-smoke",
    });
    const recoverResult = updateBossAttackCycle({
      boss: BOSS,
      state: attackState,
      deltaMs: 600,
    });
    const patrolResult = updateBossAttackCycle({
      boss: BOSS,
      state: recoverResult.state,
      deltaMs: 800,
    });

    expect(recoverResult.state).toMatchObject({
      state: "recover",
      stateElapsedMs: 0,
      stateRemainingMs: 800,
      attackCooldownRemainingMs: 900,
      activeAttackId: "boss-attack-smoke",
      activeVulnerabilityWindowId: "boss-attack-recover",
    });
    expect(recoverResult.events).toEqual([
      {
        kind: "recover-started",
        bossId: "boss-attack-test",
        attackId: "boss-attack-smoke",
      },
    ]);
    expect(patrolResult.state).toMatchObject({
      state: "patrol",
      stateElapsedMs: 0,
      stateRemainingMs: 0,
      attackCooldownRemainingMs: 100,
    });
    expect(patrolResult.state.activeAttackId).toBeUndefined();
    expect(patrolResult.state.activeVulnerabilityWindowId).toBeUndefined();
    expect(patrolResult.events).toEqual([
      {
        kind: "recover-ended",
        bossId: "boss-attack-test",
        attackId: "boss-attack-smoke",
      },
    ]);
  });

  it("supports a custom attack selector and keeps patrol when no attack is available", () => {
    const patrolState = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(BOSS),
      nextState: "patrol",
    });
    const noAttackResult = updateBossAttackCycle({
      boss: BOSS,
      state: patrolState,
      deltaMs: 16,
      selectAttack: () => undefined,
    });
    const selectedAttackResult = updateBossAttackCycle({
      boss: BOSS,
      state: patrolState,
      deltaMs: 16,
      selectAttack: (boss) => boss.attacks[1],
    });

    expect(noAttackResult.state).toMatchObject({
      state: "patrol",
      attackSequence: 0,
    });
    expect(noAttackResult.state.activeAttackId).toBeUndefined();
    expect(noAttackResult.events).toEqual([]);
    expect(selectedAttackResult.state).toMatchObject({
      state: "windup",
      stateRemainingMs: 520,
      attackSequence: 1,
      activeAttackId: "boss-attack-hose",
    });
    expect(selectedAttackResult.events).toEqual([
      {
        kind: "tell-started",
        bossId: "boss-attack-test",
        attackId: "boss-attack-hose",
      },
    ]);
  });

  it("waits through intro and stun states before returning to patrol", () => {
    const introState = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(BOSS),
      nextState: "intro",
      durationMs: 300,
      attackCooldownMs: 200,
    });
    const waitingIntroResult = updateBossAttackCycle({
      boss: BOSS,
      state: introState,
      deltaMs: 120,
    });
    const patrolAfterIntroResult = updateBossAttackCycle({
      boss: BOSS,
      state: waitingIntroResult.state,
      deltaMs: 180,
    });
    const stunnedState = transitionBossRuntimeState({
      state: patrolAfterIntroResult.state,
      nextState: "stunned",
      durationMs: 200,
      attackCooldownMs: 300,
      activeAttackId: "boss-attack-smoke",
      activeVulnerabilityWindowId: "boss-attack-recover",
    });
    const waitingStunResult = updateBossAttackCycle({
      boss: BOSS,
      state: stunnedState,
      deltaMs: 199,
    });
    const patrolAfterStunResult = updateBossAttackCycle({
      boss: BOSS,
      state: waitingStunResult.state,
      deltaMs: 1,
    });

    expect(waitingIntroResult.state).toMatchObject({
      state: "intro",
      stateElapsedMs: 120,
      stateRemainingMs: 180,
      attackCooldownRemainingMs: 80,
    });
    expect(waitingIntroResult.events).toEqual([]);
    expect(patrolAfterIntroResult.state).toMatchObject({
      state: "patrol",
      stateElapsedMs: 0,
      stateRemainingMs: 0,
      attackCooldownRemainingMs: 0,
    });
    expect(patrolAfterIntroResult.events).toEqual([]);
    expect(waitingStunResult.state).toMatchObject({
      state: "stunned",
      stateElapsedMs: 199,
      stateRemainingMs: 1,
      attackCooldownRemainingMs: 101,
      activeAttackId: "boss-attack-smoke",
      activeVulnerabilityWindowId: "boss-attack-recover",
    });
    expect(waitingStunResult.events).toEqual([]);
    expect(patrolAfterStunResult.state).toMatchObject({
      state: "patrol",
      stateElapsedMs: 0,
      stateRemainingMs: 0,
      attackCooldownRemainingMs: 100,
    });
    expect(patrolAfterStunResult.state.activeAttackId).toBeUndefined();
    expect(
      patrolAfterStunResult.state.activeVulnerabilityWindowId,
    ).toBeUndefined();
    expect(patrolAfterStunResult.events).toEqual([]);
  });

  it("does not start a new tell while attack cooldown is active", () => {
    const patrolState = transitionBossRuntimeState({
      state: createInitialBossRuntimeState(BOSS),
      nextState: "patrol",
      attackCooldownMs: 120,
    });
    const result = updateBossAttackCycle({
      boss: BOSS,
      state: patrolState,
      deltaMs: 60,
    });

    expect(result.state).toMatchObject({
      state: "patrol",
      attackCooldownRemainingMs: 60,
    });
    expect(result.events).toEqual([]);
  });
});
