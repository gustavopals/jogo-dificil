import { describe, expect, it } from "vitest";

import {
  calculateDashMovement,
  createInitialDashMovementState,
  resetDashMovementState,
  resolveKinematicCollisions,
  type KinematicBodyCollisionConfig,
} from "../src/game/physics";

const CONFIG = {
  speed: 420,
  durationMs: 150,
  cooldownMs: 300,
} as const;

const BODY = {
  visualWidth: 10,
  visualHeight: 10,
  pivot: {
    x: 0,
    y: 0,
  },
  hitbox: {
    x: 0,
    y: 0,
    width: 10,
    height: 10,
  },
} as const satisfies KinematicBodyCollisionConfig;

describe("dash movement", () => {
  it("starts a dash with input direction and a predictable velocity", () => {
    const result = calculateDashMovement({
      wasDashPressed: true,
      direction: 1,
      fallbackDirection: -1,
      deltaMs: 16,
      state: createInitialDashMovementState(),
      config: CONFIG,
    });

    expect(result.didStartDash).toBe(true);
    expect(result.isDashing).toBe(true);
    expect(result.velocityX).toBe(CONFIG.speed);
    expect(result.state).toEqual({
      activeRemainingMs: 134,
      cooldownRemainingMs: 0,
      direction: 1,
    });
  });

  it("uses facing fallback when no horizontal input is pressed", () => {
    const result = calculateDashMovement({
      wasDashPressed: true,
      direction: 0,
      fallbackDirection: -1,
      deltaMs: 16,
      state: createInitialDashMovementState(1),
      config: CONFIG,
    });

    expect(result.velocityX).toBe(-CONFIG.speed);
    expect(result.state.direction).toBe(-1);
  });

  it("keeps dash direction stable until duration ends", () => {
    const started = calculateDashMovement({
      wasDashPressed: true,
      direction: 1,
      fallbackDirection: 1,
      deltaMs: 16,
      state: createInitialDashMovementState(),
      config: CONFIG,
    });

    const continued = calculateDashMovement({
      wasDashPressed: false,
      direction: -1,
      fallbackDirection: -1,
      deltaMs: 50,
      state: started.state,
      config: CONFIG,
    });

    expect(continued.isDashing).toBe(true);
    expect(continued.velocityX).toBe(CONFIG.speed);
    expect(continued.state.direction).toBe(1);
  });

  it("starts cooldown after active duration and blocks spam", () => {
    const started = calculateDashMovement({
      wasDashPressed: true,
      direction: 1,
      fallbackDirection: 1,
      deltaMs: 0,
      state: createInitialDashMovementState(),
      config: CONFIG,
    });

    const ended = calculateDashMovement({
      wasDashPressed: false,
      direction: 1,
      fallbackDirection: 1,
      deltaMs: CONFIG.durationMs,
      state: started.state,
      config: CONFIG,
    });

    expect(ended.isDashing).toBe(true);
    expect(ended.state).toEqual({
      activeRemainingMs: 0,
      cooldownRemainingMs: CONFIG.cooldownMs,
      direction: 1,
    });

    const blocked = calculateDashMovement({
      wasDashPressed: true,
      direction: -1,
      fallbackDirection: -1,
      deltaMs: 100,
      state: ended.state,
      config: CONFIG,
    });

    expect(blocked.didStartDash).toBe(false);
    expect(blocked.isDashing).toBe(false);
    expect(blocked.velocityX).toBe(0);
    expect(blocked.state.cooldownRemainingMs).toBe(200);
  });

  it("allows a new dash after cooldown expires", () => {
    const result = calculateDashMovement({
      wasDashPressed: true,
      direction: -1,
      fallbackDirection: 1,
      deltaMs: 10,
      state: {
        activeRemainingMs: 0,
        cooldownRemainingMs: 10,
        direction: 1,
      },
      config: CONFIG,
    });

    expect(result.didStartDash).toBe(true);
    expect(result.velocityX).toBe(-CONFIG.speed);
    expect(result.state.direction).toBe(-1);
  });

  it("resets active dash and cooldown while keeping last direction", () => {
    expect(
      resetDashMovementState({
        activeRemainingMs: 90,
        cooldownRemainingMs: 0,
        direction: -1,
      }),
    ).toEqual({
      activeRemainingMs: 0,
      cooldownRemainingMs: 0,
      direction: -1,
    });
  });

  it("uses existing solid collision to avoid tunneling through walls", () => {
    const result = resolveKinematicCollisions({
      currentPosition: {
        x: 0,
        y: 0,
      },
      targetPosition: {
        x: CONFIG.speed * 0.2,
        y: 0,
      },
      velocity: {
        x: CONFIG.speed,
        y: 0,
      },
      body: BODY,
      solids: [
        {
          x: 32,
          y: 0,
          width: 16,
          height: 16,
        },
      ],
    });

    expect(result.position.x).toBe(22);
    expect(result.velocity.x).toBe(0);
    expect(result.blocked.right).toBe(true);
  });
});
