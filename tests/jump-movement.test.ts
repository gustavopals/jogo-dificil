import { describe, expect, it } from "vitest";

import {
  calculateJumpMovement,
  createInitialJumpMovementState,
} from "../src/game/physics";

const GROUND_Y = 222;

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
    expect(result.velocityY).toBe(-430);
    expect(result.isGrounded).toBe(false);
  });

  it("applies gravity while the player is airborne", () => {
    const result = calculateJumpMovement({
      currentPositionY: 180,
      currentVelocityY: -430,
      groundY: GROUND_Y,
      isGrounded: false,
      isJumpDown: true,
      wasJumpPressed: false,
      wasJumpReleased: false,
      deltaMs: 100,
      state: createInitialJumpMovementState(),
    });

    expect(result.velocityY).toBe(-310);
    expect(result.positionY).toBe(149);
  });

  it("cuts upward velocity when jump is released early", () => {
    const result = calculateJumpMovement({
      currentPositionY: 180,
      currentVelocityY: -300,
      groundY: GROUND_Y,
      isGrounded: false,
      isJumpDown: false,
      wasJumpPressed: false,
      wasJumpReleased: true,
      deltaMs: 0,
      state: createInitialJumpMovementState(),
    });

    expect(result.velocityY).toBe(-135);
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
    expect(coyoteResult.velocityY).toBe(-370);
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
    expect(expiredResult.velocityY).toBe(144);
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
    expect(landingResult.velocityY).toBe(-430);
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
