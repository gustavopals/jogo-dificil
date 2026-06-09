import { describe, expect, it } from "vitest";

import {
  getWorldHitbox,
  resolveKinematicCollisions,
  type KinematicBodyCollisionConfig,
} from "../src/game/physics";

const BODY = {
  visualWidth: 12,
  visualHeight: 24,
  pivot: {
    x: 0.5,
    y: 1,
  },
  hitbox: {
    x: 1,
    y: 1,
    width: 10,
    height: 22,
  },
} as const satisfies KinematicBodyCollisionConfig;

describe("solid collision", () => {
  it("calculates world hitbox from bottom-center pivot", () => {
    expect(
      getWorldHitbox(
        {
          x: 64,
          y: 222,
        },
        BODY,
      ),
    ).toEqual({
      x: 59,
      y: 199,
      width: 10,
      height: 22,
    });
  });

  it("lands on solid ground", () => {
    const result = resolveKinematicCollisions({
      currentPosition: {
        x: 64,
        y: 200,
      },
      targetPosition: {
        x: 64,
        y: 226,
      },
      velocity: {
        x: 0,
        y: 260,
      },
      body: BODY,
      solids: [
        {
          x: 0,
          y: 222,
          width: 480,
          height: 16,
        },
      ],
    });

    expect(result.position.y).toBe(223);
    expect(result.velocity.y).toBe(0);
    expect(result.isGrounded).toBe(true);
    expect(result.blocked.down).toBe(true);
  });

  it("snaps out of shallow ground penetration while falling", () => {
    // Spawns/checkpoints declarados poucos px dentro do chão devem aterrissar.
    const result = resolveKinematicCollisions({
      currentPosition: {
        x: 64,
        y: 225,
      },
      targetPosition: {
        x: 64,
        y: 226,
      },
      velocity: {
        x: 0,
        y: 50,
      },
      body: BODY,
      solids: [
        {
          x: 0,
          y: 222,
          width: 480,
          height: 16,
        },
      ],
    });

    expect(result.position.y).toBe(223);
    expect(result.velocity.y).toBe(0);
    expect(result.isGrounded).toBe(true);
    expect(result.blocked.down).toBe(true);
  });

  it("does not eject the body from deep solid overlap", () => {
    const result = resolveKinematicCollisions({
      currentPosition: {
        x: 64,
        y: 240,
      },
      targetPosition: {
        x: 64,
        y: 241,
      },
      velocity: {
        x: 0,
        y: 50,
      },
      body: BODY,
      solids: [
        {
          x: 0,
          y: 222,
          width: 480,
          height: 16,
        },
      ],
    });

    expect(result.position.y).toBe(241);
    expect(result.blocked.down).toBe(false);
  });

  it("does not tunnel through ground on a large vertical step", () => {
    const result = resolveKinematicCollisions({
      currentPosition: {
        x: 64,
        y: 180,
      },
      targetPosition: {
        x: 64,
        y: 300,
      },
      velocity: {
        x: 0,
        y: 900,
      },
      body: BODY,
      solids: [
        {
          x: 0,
          y: 222,
          width: 480,
          height: 16,
        },
      ],
    });

    expect(result.position.y).toBe(223);
    expect(result.velocity.y).toBe(0);
    expect(result.blocked.down).toBe(true);
  });

  it("blocks left and right walls", () => {
    const leftResult = resolveKinematicCollisions({
      currentPosition: {
        x: 24,
        y: 222,
      },
      targetPosition: {
        x: 10,
        y: 222,
      },
      velocity: {
        x: -190,
        y: 0,
      },
      body: BODY,
      solids: [
        {
          x: 0,
          y: 0,
          width: 16,
          height: 270,
        },
      ],
    });

    expect(leftResult.position.x).toBe(21);
    expect(leftResult.velocity.x).toBe(0);
    expect(leftResult.blocked.left).toBe(true);

    const rightResult = resolveKinematicCollisions({
      currentPosition: {
        x: 456,
        y: 222,
      },
      targetPosition: {
        x: 470,
        y: 222,
      },
      velocity: {
        x: 190,
        y: 0,
      },
      body: BODY,
      solids: [
        {
          x: 464,
          y: 0,
          width: 16,
          height: 270,
        },
      ],
    });

    expect(rightResult.position.x).toBe(459);
    expect(rightResult.velocity.x).toBe(0);
    expect(rightResult.blocked.right).toBe(true);
  });

  it("does not tunnel through walls on a large horizontal step", () => {
    const result = resolveKinematicCollisions({
      currentPosition: {
        x: 430,
        y: 222,
      },
      targetPosition: {
        x: 500,
        y: 222,
      },
      velocity: {
        x: 900,
        y: 0,
      },
      body: BODY,
      solids: [
        {
          x: 464,
          y: 0,
          width: 16,
          height: 270,
        },
      ],
    });

    expect(result.position.x).toBe(459);
    expect(result.velocity.x).toBe(0);
    expect(result.blocked.right).toBe(true);
  });

  it("blocks the underside of a solid platform", () => {
    const result = resolveKinematicCollisions({
      currentPosition: {
        x: 64,
        y: 170,
      },
      targetPosition: {
        x: 64,
        y: 140,
      },
      velocity: {
        x: 0,
        y: -430,
      },
      body: BODY,
      solids: [
        {
          x: 32,
          y: 120,
          width: 80,
          height: 16,
        },
      ],
    });

    expect(result.position.y).toBe(159);
    expect(result.velocity.y).toBe(0);
    expect(result.blocked.up).toBe(true);
  });

  it("resolves a simple corner without leaving overlap", () => {
    const solids = [
      {
        x: 0,
        y: 222,
        width: 480,
        height: 16,
      },
      {
        x: 464,
        y: 0,
        width: 16,
        height: 270,
      },
    ];

    const result = resolveKinematicCollisions({
      currentPosition: {
        x: 456,
        y: 210,
      },
      targetPosition: {
        x: 470,
        y: 230,
      },
      velocity: {
        x: 190,
        y: 260,
      },
      body: BODY,
      solids,
    });

    expect(result.position).toEqual({
      x: 459,
      y: 223,
    });
    expect(result.velocity).toEqual({
      x: 0,
      y: 0,
    });
    expect(result.blocked.right).toBe(true);
    expect(result.blocked.down).toBe(true);
  });
});
