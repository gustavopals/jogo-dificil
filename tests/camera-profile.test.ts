import { describe, expect, it } from "vitest";

import { getLevelCameraProfile, resolveCameraLookAhead } from "../src/game/systems/camera-profile";

describe("camera profile", () => {
  it("uses tighter camera follow for harder levels", () => {
    const easy = getLevelCameraProfile({
      bounds: { x: 0, y: 0, width: 1920, height: 540 },
      difficulty: 1,
      bosses: [],
    });
    const hard = getLevelCameraProfile({
      bounds: { x: 0, y: 0, width: 1920, height: 540 },
      difficulty: 10,
      bosses: [],
    });

    expect(hard.deadzoneWidth).toBeLessThan(easy.deadzoneWidth);
    expect(hard.deadzoneHeight).toBeLessThan(easy.deadzoneHeight);
    expect(hard.followLerpX).toBeGreaterThan(easy.followLerpX);
    expect(hard.followLerpY).toBeGreaterThan(easy.followLerpY);
  });

  it("increases look-ahead budget for boss arenas", () => {
    const normal = getLevelCameraProfile({
      bounds: { x: 0, y: 0, width: 1920, height: 540 },
      difficulty: 6,
      bosses: [],
    });
    const bossArena = getLevelCameraProfile({
      bounds: { x: 0, y: 0, width: 1920, height: 540 },
      difficulty: 6,
      bosses: [{} as never],
    });

    expect(bossArena.lookAheadMaxX).toBeGreaterThan(normal.lookAheadMaxX);
    expect(bossArena.lookAheadMaxY).toBeGreaterThanOrEqual(normal.lookAheadMaxY);
  });

  it("converts velocity into bounded look-ahead offsets", () => {
    const profile = getLevelCameraProfile({
      bounds: { x: 0, y: 0, width: 1920, height: 540 },
      difficulty: 8,
      bosses: [],
    });

    const right = resolveCameraLookAhead({ x: 220, y: 0 }, profile);
    const leftDown = resolveCameraLookAhead({ x: -300, y: 520 }, profile);

    expect(right.x).toBeGreaterThan(0);
    expect(right.y).toBe(0);
    expect(Math.abs(leftDown.x)).toBeLessThanOrEqual(profile.lookAheadMaxX);
    expect(Math.abs(leftDown.y)).toBeLessThanOrEqual(profile.lookAheadMaxY);
  });
});
