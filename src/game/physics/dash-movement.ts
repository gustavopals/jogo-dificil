import { PLAYER_MOVEMENT } from "../constants";
import type { HorizontalDirection } from "./horizontal-movement";

export type DashDirection = -1 | 1;

export type DashMovementConfig = {
  readonly speed: number;
  readonly durationMs: number;
  readonly cooldownMs: number;
};

export type DashMovementState = {
  readonly activeRemainingMs: number;
  readonly cooldownRemainingMs: number;
  readonly direction: DashDirection;
};

export type DashMovementInput = {
  readonly wasDashPressed: boolean;
  readonly direction: HorizontalDirection;
  readonly fallbackDirection: DashDirection;
  readonly deltaMs: number;
  readonly state: DashMovementState;
  readonly config?: DashMovementConfig;
};

export type DashMovementResult = {
  readonly velocityX: number;
  readonly isDashing: boolean;
  readonly didStartDash: boolean;
  readonly state: DashMovementState;
};

export const DEFAULT_DASH_MOVEMENT_CONFIG = {
  speed: PLAYER_MOVEMENT.dashSpeed,
  durationMs: PLAYER_MOVEMENT.dashDurationMs,
  cooldownMs: PLAYER_MOVEMENT.dashCooldownMs,
} as const satisfies DashMovementConfig;

export function createInitialDashMovementState(
  direction: DashDirection = 1,
): DashMovementState {
  return {
    activeRemainingMs: 0,
    cooldownRemainingMs: 0,
    direction,
  };
}

export function calculateDashMovement(
  input: DashMovementInput,
): DashMovementResult {
  const config = input.config ?? DEFAULT_DASH_MOVEMENT_CONFIG;
  const deltaMs = Math.max(0, input.deltaMs);

  let state =
    input.state.activeRemainingMs > 0
      ? input.state
      : {
          ...input.state,
          cooldownRemainingMs: reduceTimer(
            input.state.cooldownRemainingMs,
            deltaMs,
          ),
        };
  let didStartDash = false;

  if (
    input.wasDashPressed &&
    state.activeRemainingMs <= 0 &&
    state.cooldownRemainingMs <= 0
  ) {
    state = {
      activeRemainingMs: config.durationMs,
      cooldownRemainingMs: 0,
      direction: resolveDashDirection(input.direction, input.fallbackDirection),
    };
    didStartDash = true;
  }

  const isDashing = state.activeRemainingMs > 0;
  const velocityX = isDashing ? state.direction * config.speed : 0;
  const nextState = isDashing
    ? consumeActiveDashTime(state, deltaMs, config)
    : state;

  return {
    velocityX,
    isDashing,
    didStartDash,
    state: nextState,
  };
}

export function resetDashMovementState(
  state: DashMovementState,
): DashMovementState {
  return createInitialDashMovementState(state.direction);
}

function resolveDashDirection(
  direction: HorizontalDirection,
  fallbackDirection: DashDirection,
): DashDirection {
  return direction === 0 ? fallbackDirection : direction;
}

function consumeActiveDashTime(
  state: DashMovementState,
  deltaMs: number,
  config: DashMovementConfig,
): DashMovementState {
  const activeRemainingMs = reduceTimer(state.activeRemainingMs, deltaMs);

  if (activeRemainingMs > 0) {
    return {
      ...state,
      activeRemainingMs,
      cooldownRemainingMs: 0,
    };
  }

  const overflowMs = Math.max(0, deltaMs - state.activeRemainingMs);

  return {
    ...state,
    activeRemainingMs: 0,
    cooldownRemainingMs: reduceTimer(config.cooldownMs, overflowMs),
  };
}

function reduceTimer(value: number, deltaMs: number): number {
  return Math.max(0, value - deltaMs);
}
