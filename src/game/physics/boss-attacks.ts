import type {
  BossAttackDefinition,
  BossAttackId,
  BossDefinition,
  RectLike,
} from "../../shared";
import {
  transitionBossRuntimeState,
  updateBossAnchorMovement,
  updateBossRuntimeTimers,
  type BossRuntimeState,
} from "./boss-state";

export type BossAttackCycleEventKind =
  | "tell-started"
  | "attack-started"
  | "recover-started"
  | "recover-ended";

export type BossAttackCycleEvent = {
  readonly kind: BossAttackCycleEventKind;
  readonly bossId: BossRuntimeState["id"];
  readonly attackId?: BossAttackId;
};

export type BossAttackCycleUpdateInput = {
  readonly boss: BossDefinition;
  readonly state: BossRuntimeState;
  readonly deltaMs: number;
  readonly selectAttack?: BossAttackSelector;
};

export type BossAttackCycleUpdateResult = {
  readonly state: BossRuntimeState;
  readonly events: readonly BossAttackCycleEvent[];
};

export type BossAttackSelector = (
  boss: BossDefinition,
  state: BossRuntimeState,
) => BossAttackDefinition | undefined;

export function updateBossAttackCycle(
  input: BossAttackCycleUpdateInput,
): BossAttackCycleUpdateResult {
  const timedState = updateBossRuntimeTimers(input.state, input.deltaMs);

  switch (timedState.state) {
    case "inactive":
    case "defeated":
      return withoutEvents(timedState);
    case "intro":
      return updateIntroState(timedState);
    case "patrol":
      return updatePatrolState(
        input.boss,
        timedState,
        input.deltaMs,
        input.selectAttack ?? selectFirstBossAttack,
      );
    case "windup":
      return updateWindupState(input.boss, timedState);
    case "attack":
      return updateAttackState(input.boss, timedState);
    case "recover":
      return updateRecoverState(timedState);
    case "stunned":
      return updateStunnedState(timedState);
  }
}

export function getBossActiveAttack(
  boss: BossDefinition,
  state: BossRuntimeState,
): BossAttackDefinition | undefined {
  if (!state.activeAttackId) {
    return undefined;
  }

  return boss.attacks.find((attack) => attack.id === state.activeAttackId);
}

export function getBossAttackTellArea(
  boss: BossDefinition,
  state: BossRuntimeState,
): RectLike | undefined {
  if (state.state !== "windup") {
    return undefined;
  }

  return getBossActiveAttack(boss, state)?.tellArea;
}

export function getBossActiveAttackHitbox(
  boss: BossDefinition,
  state: BossRuntimeState,
): RectLike | undefined {
  if (state.state !== "attack") {
    return undefined;
  }

  return getBossActiveAttack(boss, state)?.hitbox;
}

function updateIntroState(
  state: BossRuntimeState,
): BossAttackCycleUpdateResult {
  if (state.stateRemainingMs > 0) {
    return withoutEvents(state);
  }

  return withoutEvents(
    transitionBossRuntimeState({
      state,
      nextState: "patrol",
      attackCooldownMs: state.attackCooldownRemainingMs,
    }),
  );
}

function updatePatrolState(
  boss: BossDefinition,
  state: BossRuntimeState,
  deltaMs: number,
  selectAttack: BossAttackSelector,
): BossAttackCycleUpdateResult {
  const movedState = updateBossAnchorMovement(boss, state, deltaMs);

  if (movedState.attackCooldownRemainingMs > 0) {
    return withoutEvents(movedState);
  }

  const attack = selectAttack(boss, movedState);

  if (!attack) {
    return withoutEvents(movedState);
  }

  return {
    state: transitionBossRuntimeState({
      state: movedState,
      nextState: "windup",
      durationMs: attack.windupMs,
      attackCooldownMs: movedState.attackCooldownRemainingMs,
      attackSequence: movedState.attackSequence + 1,
      activeAttackId: attack.id,
    }),
    events: [
      {
        kind: "tell-started",
        bossId: movedState.id,
        attackId: attack.id,
      },
    ],
  };
}

function updateWindupState(
  boss: BossDefinition,
  state: BossRuntimeState,
): BossAttackCycleUpdateResult {
  if (state.stateRemainingMs > 0) {
    return withoutEvents(state);
  }

  const attack = getBossActiveAttack(boss, state);

  if (!attack) {
    return withoutEvents(
      transitionBossRuntimeState({
        state,
        nextState: "patrol",
        attackCooldownMs: state.attackCooldownRemainingMs,
      }),
    );
  }

  return {
    state: transitionBossRuntimeState({
      state,
      nextState: "attack",
      durationMs: attack.activeMs,
      attackCooldownMs: state.attackCooldownRemainingMs,
      ...(resolveAttackStartMotion(boss, state, attack) ?? {}),
      activeAttackId: attack.id,
    }),
    events: [
      {
        kind: "attack-started",
        bossId: state.id,
        attackId: attack.id,
      },
    ],
  };
}

function updateAttackState(
  boss: BossDefinition,
  state: BossRuntimeState,
): BossAttackCycleUpdateResult {
  if (state.stateRemainingMs > 0) {
    return withoutEvents(state);
  }

  const attack = getBossActiveAttack(boss, state);

  if (!attack) {
    return withoutEvents(
      transitionBossRuntimeState({
        state,
        nextState: "patrol",
        attackCooldownMs: state.attackCooldownRemainingMs,
      }),
    );
  }

  return {
    state: transitionBossRuntimeState({
      state,
      nextState: "recover",
      durationMs: attack.recoverMs,
      attackCooldownMs: attack.cooldownMs,
      activeAttackId: attack.id,
      activeVulnerabilityWindowId: attack.opensVulnerabilityWindowId,
    }),
    events: [
      {
        kind: "recover-started",
        bossId: state.id,
        attackId: attack.id,
      },
    ],
  };
}

function updateRecoverState(
  state: BossRuntimeState,
): BossAttackCycleUpdateResult {
  if (state.stateRemainingMs > 0) {
    return withoutEvents(state);
  }

  return {
    state: transitionBossRuntimeState({
      state,
      nextState: "patrol",
      attackCooldownMs: state.attackCooldownRemainingMs,
    }),
    events: [
      {
        kind: "recover-ended",
        bossId: state.id,
        attackId: state.activeAttackId,
      },
    ],
  };
}

function updateStunnedState(
  state: BossRuntimeState,
): BossAttackCycleUpdateResult {
  if (state.stateRemainingMs > 0) {
    return withoutEvents(state);
  }

  return withoutEvents(
    transitionBossRuntimeState({
      state,
      nextState: "patrol",
      attackCooldownMs: state.attackCooldownRemainingMs,
    }),
  );
}

function selectFirstBossAttack(
  boss: BossDefinition,
  state: BossRuntimeState,
): BossAttackDefinition | undefined {
  if (boss.attacks.length === 0) {
    return undefined;
  }

  return boss.attacks[state.attackSequence % boss.attacks.length];
}

function resolveAttackStartMotion(
  boss: BossDefinition,
  state: BossRuntimeState,
  attack: BossAttackDefinition,
): Pick<BossRuntimeState, "position" | "facing"> | undefined {
  if (attack.kind !== "smoke-swap") {
    return undefined;
  }

  const destination = selectNextBossAnchor(boss, state);

  if (!destination) {
    return undefined;
  }

  return {
    position: destination,
    facing:
      destination.x < boss.arena.x + boss.arena.width / 2 ? "right" : "left",
  };
}

function selectNextBossAnchor(
  boss: BossDefinition,
  state: BossRuntimeState,
): BossRuntimeState["position"] | undefined {
  const anchors = boss.movement.anchors ?? [];

  if (anchors.length === 0) {
    return undefined;
  }

  const currentIndex = anchors.findIndex((anchor) =>
    arePositionsClose(anchor, state.position),
  );
  const startIndex =
    currentIndex >= 0 ? currentIndex + 1 : state.attackSequence;

  for (let offset = 0; offset < anchors.length; offset += 1) {
    const anchor = anchors[(startIndex + offset) % anchors.length]!;

    if (!arePositionsClose(anchor, state.position)) {
      return anchor;
    }
  }

  return undefined;
}

function arePositionsClose(
  a: BossRuntimeState["position"],
  b: BossRuntimeState["position"],
): boolean {
  return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1;
}

function withoutEvents(state: BossRuntimeState): BossAttackCycleUpdateResult {
  return {
    state,
    events: [],
  };
}
