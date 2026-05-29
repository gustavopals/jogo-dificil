import { describe, expect, it } from "vitest";

import {
  calculateHorizontalVelocity,
  DEFAULT_HORIZONTAL_MOVEMENT_CONFIG,
  getHorizontalDirection,
} from "../src/game/physics";

const {
  maxHorizontalSpeed: MAX_SPEED,
  acceleration: ACCELERATION,
  groundDeceleration: GROUND_DECELERATION,
  airDeceleration: AIR_DECELERATION,
} = DEFAULT_HORIZONTAL_MOVEMENT_CONFIG;

describe("horizontal movement", () => {
  it("resolves horizontal direction from left and right actions", () => {
    expect(
      getHorizontalDirection({
        isMovingLeft: true,
        isMovingRight: false,
      }),
    ).toBe(-1);
    expect(
      getHorizontalDirection({
        isMovingLeft: false,
        isMovingRight: true,
      }),
    ).toBe(1);
    expect(
      getHorizontalDirection({
        isMovingLeft: false,
        isMovingRight: false,
      }),
    ).toBe(0);
    expect(
      getHorizontalDirection({
        isMovingLeft: true,
        isMovingRight: true,
      }),
    ).toBe(0);
  });

  it("accelerates toward the configured max speed without overshooting", () => {
    const firstStep = calculateHorizontalVelocity({
      currentVelocityX: 0,
      direction: 1,
      isGrounded: true,
      deltaMs: 100,
    });

    expect(firstStep).toBe(Math.min(ACCELERATION * 0.1, MAX_SPEED));

    expect(
      calculateHorizontalVelocity({
        currentVelocityX: firstStep,
        direction: 1,
        isGrounded: true,
        deltaMs: 100,
      }),
    ).toBe(MAX_SPEED);
  });

  it("decelerates faster on the ground than in the air", () => {
    expect(
      calculateHorizontalVelocity({
        currentVelocityX: MAX_SPEED,
        direction: 0,
        isGrounded: true,
        deltaMs: 50,
      }),
    ).toBe(MAX_SPEED - GROUND_DECELERATION * 0.05);

    expect(
      calculateHorizontalVelocity({
        currentVelocityX: MAX_SPEED,
        direction: 0,
        isGrounded: false,
        deltaMs: 50,
      }),
    ).toBe(MAX_SPEED - AIR_DECELERATION * 0.05);
  });

  it("changes direction quickly when input reverses", () => {
    expect(
      calculateHorizontalVelocity({
        currentVelocityX: MAX_SPEED,
        direction: -1,
        isGrounded: true,
        deltaMs: 50,
      }),
    ).toBe(MAX_SPEED - (ACCELERATION + GROUND_DECELERATION) * 0.05);
  });

  it("clamps existing velocity when delta is not positive", () => {
    expect(
      calculateHorizontalVelocity({
        currentVelocityX: MAX_SPEED + 70,
        direction: 1,
        isGrounded: true,
        deltaMs: 0,
      }),
    ).toBe(MAX_SPEED);
  });
});
