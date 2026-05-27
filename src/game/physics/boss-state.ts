import type {
  BossAttackId,
  BossDefinition,
  BossId,
  BossStateKind,
  BossVulnerabilityWindowId,
  FacingDirection,
  Vector2Like,
} from "../../shared";

export type BossRuntimeState = {
  readonly id: BossId;
  readonly health: number;
  readonly healthRemaining: number;
  readonly state: BossStateKind;
  readonly position: Vector2Like;
  readonly facing: FacingDirection;
  readonly stateElapsedMs: number;
  readonly stateRemainingMs: number;
  readonly attackCooldownRemainingMs: number;
  readonly invulnerabilityRemainingMs: number;
  readonly attackSequence: number;
  readonly activeAttackId?: BossAttackId;
  readonly activeVulnerabilityWindowId?: BossVulnerabilityWindowId;
  readonly damageHitLockKeys: readonly string[];
  readonly resetOnRespawn: boolean;
};

export type BossRuntimeTransitionInput = {
  readonly state: BossRuntimeState;
  readonly nextState: BossStateKind;
  readonly durationMs?: number;
  readonly attackCooldownMs?: number;
  readonly facing?: FacingDirection;
  readonly position?: Vector2Like;
  readonly attackSequence?: number;
  readonly activeAttackId?: BossAttackId;
  readonly activeVulnerabilityWindowId?: BossVulnerabilityWindowId;
};

export type BossRuntimeDamageInput = {
  readonly state: BossRuntimeState;
  readonly damage: number;
  readonly invulnerabilityMs: number;
  readonly stunMs?: number;
  readonly damageHitLockKey?: string;
};

export type BossRuntimeDamageResult = {
  readonly state: BossRuntimeState;
  readonly didApplyDamage: boolean;
  readonly didDefeat: boolean;
};

export function createInitialBossRuntimeState(
  boss: BossDefinition,
): BossRuntimeState {
  const health = Math.max(1, Math.floor(boss.health));

  return {
    id: boss.id,
    health,
    healthRemaining: health,
    state: "inactive",
    position: boss.spawn,
    facing: boss.initialFacing,
    stateElapsedMs: 0,
    stateRemainingMs: 0,
    attackCooldownRemainingMs: 0,
    invulnerabilityRemainingMs: 0,
    attackSequence: 0,
    damageHitLockKeys: [],
    resetOnRespawn: boss.resetOnRespawn,
  };
}

export function transitionBossRuntimeState(
  input: BossRuntimeTransitionInput,
): BossRuntimeState {
  return {
    ...input.state,
    state: input.nextState,
    position: input.position ?? input.state.position,
    facing: input.facing ?? input.state.facing,
    stateElapsedMs: 0,
    stateRemainingMs: normalizeTimer(input.durationMs ?? 0),
    attackCooldownRemainingMs: normalizeTimer(input.attackCooldownMs ?? 0),
    attackSequence: input.attackSequence ?? input.state.attackSequence,
    activeAttackId: input.activeAttackId,
    activeVulnerabilityWindowId: input.activeVulnerabilityWindowId,
  };
}

export function updateBossRuntimeTimers(
  state: BossRuntimeState,
  deltaMs: number,
): BossRuntimeState {
  const elapsedMs = normalizeTimer(deltaMs);

  if (elapsedMs <= 0) {
    return state;
  }

  return {
    ...state,
    stateElapsedMs: state.stateElapsedMs + elapsedMs,
    stateRemainingMs: reduceTimer(state.stateRemainingMs, elapsedMs),
    attackCooldownRemainingMs: reduceTimer(
      state.attackCooldownRemainingMs,
      elapsedMs,
    ),
    invulnerabilityRemainingMs: reduceTimer(
      state.invulnerabilityRemainingMs,
      elapsedMs,
    ),
  };
}

export function updateBossAnchorMovement(
  boss: BossDefinition,
  state: BossRuntimeState,
  deltaMs: number,
): BossRuntimeState {
  if (state.state !== "patrol") {
    return state;
  }

  const anchors = boss.movement.anchors ?? [];
  const speedPxPerSecond = boss.movement.speedPxPerSecond ?? 0;
  const deltaSeconds = normalizeTimer(deltaMs) / 1_000;

  if (
    deltaSeconds <= 0 ||
    speedPxPerSecond <= 0 ||
    anchors.length < 2 ||
    (boss.movement.kind !== "patrol" && boss.movement.kind !== "anchor-swap")
  ) {
    return state;
  }

  const target = selectBossMovementAnchor(boss, state);

  if (!target) {
    return state;
  }

  return moveBossTowardAnchor(state, target, speedPxPerSecond * deltaSeconds);
}

export function applyBossRuntimeDamage(
  input: BossRuntimeDamageInput,
): BossRuntimeDamageResult {
  const damage = Math.max(0, Math.floor(input.damage));

  if (
    damage <= 0 ||
    input.state.state === "defeated" ||
    input.state.invulnerabilityRemainingMs > 0
  ) {
    return {
      state: input.state,
      didApplyDamage: false,
      didDefeat: false,
    };
  }

  const healthRemaining = Math.max(0, input.state.healthRemaining - damage);
  const damageHitLockKeys = addDamageHitLockKey(
    input.state.damageHitLockKeys,
    input.damageHitLockKey,
  );

  if (healthRemaining <= 0) {
    return {
      state: {
        ...input.state,
        healthRemaining: 0,
        state: "defeated",
        stateElapsedMs: 0,
        stateRemainingMs: 0,
        attackCooldownRemainingMs: 0,
        invulnerabilityRemainingMs: 0,
        activeAttackId: undefined,
        activeVulnerabilityWindowId: undefined,
        damageHitLockKeys,
      },
      didApplyDamage: true,
      didDefeat: true,
    };
  }

  return {
    state: {
      ...input.state,
      healthRemaining,
      state: "stunned",
      stateElapsedMs: 0,
      stateRemainingMs: normalizeTimer(input.stunMs ?? 0),
      invulnerabilityRemainingMs: normalizeTimer(input.invulnerabilityMs),
      activeAttackId: undefined,
      activeVulnerabilityWindowId: undefined,
      damageHitLockKeys,
    },
    didApplyDamage: true,
    didDefeat: false,
  };
}

export function resetBossRuntimeState(boss: BossDefinition): BossRuntimeState {
  return createInitialBossRuntimeState(boss);
}

function reduceTimer(value: number, deltaMs: number): number {
  return Math.max(0, value - deltaMs);
}

function normalizeTimer(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

function addDamageHitLockKey(
  keys: readonly string[],
  key?: string,
): readonly string[] {
  if (!key || keys.includes(key)) {
    return keys;
  }

  return [...keys, key];
}

function selectBossMovementAnchor(
  boss: BossDefinition,
  state: BossRuntimeState,
): Vector2Like | undefined {
  const anchors = boss.movement.anchors ?? [];
  const currentIndex = anchors.findIndex((anchor) =>
    arePositionsClose(anchor, state.position),
  );

  if (currentIndex >= 0) {
    return boss.movement.kind === "anchor-swap"
      ? selectNextAnchorSwapTarget(anchors, currentIndex)
      : selectPatrolBounceTarget(anchors, currentIndex, state.facing);
  }

  return selectNearestAnchorInFacingDirection(anchors, state);
}

function selectNextAnchorSwapTarget(
  anchors: readonly Vector2Like[],
  currentIndex: number,
): Vector2Like | undefined {
  return anchors[(currentIndex + 1) % anchors.length];
}

function selectPatrolBounceTarget(
  anchors: readonly Vector2Like[],
  currentIndex: number,
  facing: FacingDirection,
): Vector2Like | undefined {
  const direction = facing === "right" ? 1 : -1;
  const nextIndex = currentIndex + direction;

  if (nextIndex >= 0 && nextIndex < anchors.length) {
    return anchors[nextIndex];
  }

  return anchors[currentIndex - direction];
}

function selectNearestAnchorInFacingDirection(
  anchors: readonly Vector2Like[],
  state: BossRuntimeState,
): Vector2Like | undefined {
  const direction = state.facing === "right" ? 1 : -1;
  const forwardAnchors = anchors
    .filter((anchor) =>
      direction > 0 ? anchor.x > state.position.x : anchor.x < state.position.x,
    )
    .sort(
      (a, b) =>
        distanceBetween(a, state.position) - distanceBetween(b, state.position),
    );

  return forwardAnchors[0] ?? selectClosestAnchor(anchors, state.position);
}

function selectClosestAnchor(
  anchors: readonly Vector2Like[],
  position: Vector2Like,
): Vector2Like | undefined {
  return [...anchors].sort(
    (a, b) => distanceBetween(a, position) - distanceBetween(b, position),
  )[0];
}

function moveBossTowardAnchor(
  state: BossRuntimeState,
  target: Vector2Like,
  maxDistance: number,
): BossRuntimeState {
  const deltaX = target.x - state.position.x;
  const deltaY = target.y - state.position.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance <= 0) {
    return state;
  }

  const facing = deltaX > 0 ? "right" : deltaX < 0 ? "left" : state.facing;

  if (distance <= maxDistance) {
    return {
      ...state,
      position: target,
      facing,
    };
  }

  const ratio = maxDistance / distance;

  return {
    ...state,
    position: {
      x: state.position.x + deltaX * ratio,
      y: state.position.y + deltaY * ratio,
    },
    facing,
  };
}

function distanceBetween(a: Vector2Like, b: Vector2Like): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function arePositionsClose(a: Vector2Like, b: Vector2Like): boolean {
  return Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1;
}
