import { PLAYER_MOVEMENT } from "../constants";

export type JumpMovementConfig = {
  readonly jumpVelocity: number;
  readonly gravity: number;
  readonly jumpCutMultiplier: number;
  readonly coyoteTimeMs: number;
  readonly jumpBufferMs: number;
};

export type JumpMovementState = {
  readonly coyoteTimeRemainingMs: number;
  readonly jumpBufferRemainingMs: number;
};

export type JumpMovementInput = {
  readonly currentPositionY: number;
  readonly currentVelocityY: number;
  readonly groundY?: number;
  readonly isGrounded: boolean;
  readonly isJumpDown: boolean;
  readonly wasJumpPressed: boolean;
  readonly wasJumpReleased: boolean;
  readonly deltaMs: number;
  readonly state: JumpMovementState;
  readonly config?: JumpMovementConfig;
};

export type JumpMovementResult = {
  readonly positionY: number;
  readonly velocityY: number;
  readonly isGrounded: boolean;
  readonly didJump: boolean;
  readonly state: JumpMovementState;
};

export const DEFAULT_JUMP_MOVEMENT_CONFIG = {
  jumpVelocity: PLAYER_MOVEMENT.jumpVelocity,
  gravity: PLAYER_MOVEMENT.gravity,
  jumpCutMultiplier: PLAYER_MOVEMENT.jumpCutMultiplier,
  coyoteTimeMs: PLAYER_MOVEMENT.coyoteTimeMs,
  jumpBufferMs: PLAYER_MOVEMENT.jumpBufferMs,
} as const satisfies JumpMovementConfig;

export function createInitialJumpMovementState(): JumpMovementState {
  return {
    coyoteTimeRemainingMs: 0,
    jumpBufferRemainingMs: 0,
  };
}

export function calculateJumpMovement(
  input: JumpMovementInput,
): JumpMovementResult {
  const config = input.config ?? DEFAULT_JUMP_MOVEMENT_CONFIG;
  const deltaMs = Math.max(0, input.deltaMs);
  const deltaSeconds = deltaMs / 1000;

  let coyoteTimeRemainingMs = input.isGrounded
    ? config.coyoteTimeMs
    : reduceTimer(input.state.coyoteTimeRemainingMs, deltaMs);
  let jumpBufferRemainingMs = input.wasJumpPressed
    ? config.jumpBufferMs
    : reduceTimer(input.state.jumpBufferRemainingMs, deltaMs);
  let velocityY = input.currentVelocityY;
  let isGrounded = input.isGrounded;
  let didJump = false;

  if (jumpBufferRemainingMs > 0 && coyoteTimeRemainingMs > 0) {
    velocityY = config.jumpVelocity;
    isGrounded = false;
    didJump = true;
    coyoteTimeRemainingMs = 0;
    jumpBufferRemainingMs = 0;
  }

  if (!input.isJumpDown && input.wasJumpReleased && velocityY < 0) {
    velocityY *= config.jumpCutMultiplier;
  }

  if (!isGrounded || velocityY < 0) {
    velocityY += config.gravity * deltaSeconds;
  }

  let positionY = input.currentPositionY + velocityY * deltaSeconds;

  if (input.groundY !== undefined) {
    if (positionY >= input.groundY && velocityY >= 0) {
      positionY = input.groundY;
      velocityY = 0;
      isGrounded = true;
      coyoteTimeRemainingMs = config.coyoteTimeMs;
    } else {
      isGrounded = false;
    }
  }

  return {
    positionY,
    velocityY,
    isGrounded,
    didJump,
    state: {
      coyoteTimeRemainingMs,
      jumpBufferRemainingMs,
    },
  };
}

function reduceTimer(value: number, deltaMs: number): number {
  return Math.max(0, value - deltaMs);
}
