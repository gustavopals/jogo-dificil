import { describe, expect, it } from "vitest";

import {
  calculateJumpMovement,
  createInitialJumpMovementState,
  DEFAULT_JUMP_MOVEMENT_CONFIG,
} from "../src/game/physics";

const GROUND_Y = 444;
const {
  jumpVelocity: JUMP_VELOCITY,
  gravity: GRAVITY,
  jumpCutMultiplier: JUMP_CUT_MULTIPLIER,
} = DEFAULT_JUMP_MOVEMENT_CONFIG;

describe("jump movement", () => {
  it("starts a jump with the configured initial velocity", () => {
    const result = calculateJumpMovement({
      currentPositionY: GROUND_Y,
      currentVelocityY: 0,
      groundY: GROUND_Y,
      isGrounded: true,
      isJumpDown: true,
      wasJumpPressed: true,
      wasJumpReleased: false,
      deltaMs: 0,
      state: createInitialJumpMovementState(),
    });

    expect(result.didJump).toBe(true);
    expect(result.velocityY).toBe(JUMP_VELOCITY);
    expect(result.isGrounded).toBe(false);
  });

  it("applies gravity while the player is airborne", () => {
    const startPositionY = 180;
    const result = calculateJumpMovement({
      currentPositionY: startPositionY,
      currentVelocityY: JUMP_VELOCITY,
      groundY: GROUND_Y,
      isGrounded: false,
      isJumpDown: true,
      wasJumpPressed: false,
      wasJumpReleased: false,
      deltaMs: 100,
      state: createInitialJumpMovementState(),
    });
    const expectedVelocityY = JUMP_VELOCITY + GRAVITY * 0.1;

    expect(result.velocityY).toBe(expectedVelocityY);
    expect(result.positionY).toBe(startPositionY + expectedVelocityY * 0.1);
  });

  it("cuts upward velocity when jump is released early", () => {
    const startVelocityY = -300;
    const result = calculateJumpMovement({
      currentPositionY: 180,
      currentVelocityY: startVelocityY,
      groundY: GROUND_Y,
      isGrounded: false,
      isJumpDown: false,
      wasJumpPressed: false,
      wasJumpReleased: true,
      deltaMs: 0,
      state: createInitialJumpMovementState(),
    });

    expect(result.velocityY).toBe(startVelocityY * JUMP_CUT_MULTIPLIER);
  });

  it("allows a jump shortly after leaving the ground", () => {
    const groundedResult = calculateJumpMovement({
      currentPositionY: GROUND_Y,
      currentVelocityY: 0,
      groundY: GROUND_Y,
      isGrounded: true,
      isJumpDown: false,
      wasJumpPressed: false,
      wasJumpReleased: false,
      deltaMs: 0,
      state: createInitialJumpMovementState(),
    });

    const coyoteResult = calculateJumpMovement({
      currentPositionY: GROUND_Y - 4,
      currentVelocityY: 0,
      groundY: GROUND_Y,
      isGrounded: false,
      isJumpDown: true,
      wasJumpPressed: true,
      wasJumpReleased: false,
      deltaMs: 50,
      state: groundedResult.state,
    });

    expect(coyoteResult.didJump).toBe(true);
    expect(coyoteResult.velocityY).toBe(JUMP_VELOCITY + GRAVITY * 0.05);
  });

  it("does not allow a coyote jump after the grace window expires", () => {
    const groundedResult = calculateJumpMovement({
      currentPositionY: GROUND_Y,
      currentVelocityY: 0,
      isGrounded: true,
      isJumpDown: false,
      wasJumpPressed: false,
      wasJumpReleased: false,
      deltaMs: 0,
      state: createInitialJumpMovementState(),
    });

    const expiredResult = calculateJumpMovement({
      currentPositionY: GROUND_Y - 12,
      currentVelocityY: 0,
      isGrounded: false,
      isJumpDown: true,
      wasJumpPressed: true,
      wasJumpReleased: false,
      deltaMs: 120,
      state: groundedResult.state,
    });

    expect(expiredResult.didJump).toBe(false);
    expect(expiredResult.velocityY).toBe(GRAVITY * 0.12);
  });

  it("uses isolated coyote and jump buffer timers from the supplied state", () => {
    const config = {
      jumpVelocity: -200,
      gravity: 1000,
      jumpCutMultiplier: 0.5,
      coyoteTimeMs: 70,
      jumpBufferMs: 80,
    };

    const bufferedResult = calculateJumpMovement({
      currentPositionY: 100,
      currentVelocityY: 0,
      isGrounded: false,
      isJumpDown: true,
      wasJumpPressed: true,
      wasJumpReleased: false,
      deltaMs: 25,
      state: createInitialJumpMovementState(),
      config,
    });

    expect(bufferedResult.didJump).toBe(false);
    expect(bufferedResult.state.jumpBufferRemainingMs).toBe(80);

    const coyoteResult = calculateJumpMovement({
      currentPositionY: bufferedResult.positionY,
      currentVelocityY: 0,
      isGrounded: false,
      isJumpDown: true,
      wasJumpPressed: false,
      wasJumpReleased: false,
      deltaMs: 30,
      state: {
        coyoteTimeRemainingMs: 70,
        jumpBufferRemainingMs: bufferedResult.state.jumpBufferRemainingMs,
      },
      config,
    });

    expect(coyoteResult.didJump).toBe(true);
    expect(coyoteResult.velocityY).toBe(-170);
    expect(coyoteResult.state).toEqual({
      coyoteTimeRemainingMs: 0,
      jumpBufferRemainingMs: 0,
    });
  });

  it("buffers jump input shortly before landing", () => {
    const bufferedResult = calculateJumpMovement({
      currentPositionY: 160,
      currentVelocityY: 120,
      groundY: GROUND_Y,
      isGrounded: false,
      isJumpDown: true,
      wasJumpPressed: true,
      wasJumpReleased: false,
      deltaMs: 50,
      state: createInitialJumpMovementState(),
    });

    expect(bufferedResult.didJump).toBe(false);
    expect(bufferedResult.state.jumpBufferRemainingMs).toBe(100);

    const landingResult = calculateJumpMovement({
      currentPositionY: GROUND_Y,
      currentVelocityY: 0,
      groundY: GROUND_Y,
      isGrounded: true,
      isJumpDown: true,
      wasJumpPressed: false,
      wasJumpReleased: false,
      deltaMs: 0,
      state: bufferedResult.state,
    });

    expect(landingResult.didJump).toBe(true);
    expect(landingResult.velocityY).toBe(JUMP_VELOCITY);
  });

  it("expires buffered jump input before a late landing", () => {
    const bufferedResult = calculateJumpMovement({
      currentPositionY: 160,
      currentVelocityY: 120,
      isGrounded: false,
      isJumpDown: true,
      wasJumpPressed: true,
      wasJumpReleased: false,
      deltaMs: 16,
      state: createInitialJumpMovementState(),
    });

    expect(bufferedResult.didJump).toBe(false);
    expect(bufferedResult.state.jumpBufferRemainingMs).toBe(100);

    const landingResult = calculateJumpMovement({
      currentPositionY: GROUND_Y,
      currentVelocityY: 0,
      isGrounded: true,
      isJumpDown: true,
      wasJumpPressed: false,
      wasJumpReleased: false,
      deltaMs: 120,
      state: bufferedResult.state,
    });

    expect(landingResult.didJump).toBe(false);
    expect(landingResult.state.jumpBufferRemainingMs).toBe(0);
  });

  it("clamps to an explicit ground limit when provided", () => {
    const result = calculateJumpMovement({
      currentPositionY: GROUND_Y - 2,
      currentVelocityY: 200,
      groundY: GROUND_Y,
      isGrounded: false,
      isJumpDown: false,
      wasJumpPressed: false,
      wasJumpReleased: false,
      deltaMs: 100,
      state: createInitialJumpMovementState(),
    });

    expect(result.positionY).toBe(GROUND_Y);
    expect(result.velocityY).toBe(0);
    expect(result.isGrounded).toBe(true);
  });
});
