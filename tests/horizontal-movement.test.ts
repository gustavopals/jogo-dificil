import { describe, expect, it } from "vitest";

import {
  calculateHorizontalVelocity,
  getHorizontalDirection,
} from "../src/game/physics";

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
    expect(
      calculateHorizontalVelocity({
        currentVelocityX: 0,
        direction: 1,
        isGrounded: true,
        deltaMs: 100,
      }),
    ).toBe(180);

    expect(
      calculateHorizontalVelocity({
        currentVelocityX: 180,
        direction: 1,
        isGrounded: true,
        deltaMs: 100,
      }),
    ).toBe(190);
  });

  it("decelerates faster on the ground than in the air", () => {
    expect(
      calculateHorizontalVelocity({
        currentVelocityX: 190,
        direction: 0,
        isGrounded: true,
        deltaMs: 50,
      }),
    ).toBe(80);

    expect(
      calculateHorizontalVelocity({
        currentVelocityX: 190,
        direction: 0,
        isGrounded: false,
        deltaMs: 50,
      }),
    ).toBe(145);
  });

  it("changes direction quickly when input reverses", () => {
    expect(
      calculateHorizontalVelocity({
        currentVelocityX: 190,
        direction: -1,
        isGrounded: true,
        deltaMs: 50,
      }),
    ).toBe(-10);
  });

  it("clamps existing velocity when delta is not positive", () => {
    expect(
      calculateHorizontalVelocity({
        currentVelocityX: 250,
        direction: 1,
        isGrounded: true,
        deltaMs: 0,
      }),
    ).toBe(190);
  });
});
