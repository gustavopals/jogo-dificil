import { PLAYER_MOVEMENT } from "../constants";

export type HorizontalDirection = -1 | 0 | 1;

export type HorizontalInputState = {
  readonly isMovingLeft: boolean;
  readonly isMovingRight: boolean;
};

export type HorizontalMovementConfig = {
  readonly maxHorizontalSpeed: number;
  readonly acceleration: number;
  readonly groundDeceleration: number;
  readonly airDeceleration: number;
};

export type HorizontalMovementInput = {
  readonly currentVelocityX: number;
  readonly direction: HorizontalDirection;
  readonly isGrounded: boolean;
  readonly deltaMs: number;
  readonly config?: HorizontalMovementConfig;
};

export const DEFAULT_HORIZONTAL_MOVEMENT_CONFIG = {
  maxHorizontalSpeed: PLAYER_MOVEMENT.maxHorizontalSpeed,
  acceleration: PLAYER_MOVEMENT.acceleration,
  groundDeceleration: PLAYER_MOVEMENT.groundDeceleration,
  airDeceleration: PLAYER_MOVEMENT.airDeceleration,
} as const satisfies HorizontalMovementConfig;

export function getHorizontalDirection(
  input: HorizontalInputState,
): HorizontalDirection {
  if (input.isMovingLeft === input.isMovingRight) {
    return 0;
  }

  return input.isMovingLeft ? -1 : 1;
}

export function calculateHorizontalVelocity(
  input: HorizontalMovementInput,
): number {
  const config = input.config ?? DEFAULT_HORIZONTAL_MOVEMENT_CONFIG;
  const targetVelocity = input.direction * config.maxHorizontalSpeed;
  const deltaSeconds = input.deltaMs / 1000;

  if (deltaSeconds <= 0) {
    return clampHorizontalVelocity(input.currentVelocityX, config);
  }

  const deceleration = input.isGrounded
    ? config.groundDeceleration
    : config.airDeceleration;
  const isChangingDirection =
    input.direction !== 0 &&
    Math.sign(input.currentVelocityX) !== 0 &&
    Math.sign(input.currentVelocityX) !== input.direction;
  const acceleration =
    input.direction === 0
      ? deceleration
      : config.acceleration + (isChangingDirection ? deceleration : 0);

  return moveToward(
    input.currentVelocityX,
    targetVelocity,
    acceleration * deltaSeconds,
  );
}

function clampHorizontalVelocity(
  velocity: number,
  config: HorizontalMovementConfig,
): number {
  return Math.max(
    -config.maxHorizontalSpeed,
    Math.min(config.maxHorizontalSpeed, velocity),
  );
}

function moveToward(current: number, target: number, maxDelta: number): number {
  if (Math.abs(target - current) <= maxDelta) {
    return target;
  }

  return current + Math.sign(target - current) * maxDelta;
}
