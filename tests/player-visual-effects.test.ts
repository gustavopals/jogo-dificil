import { describe, expect, it } from "vitest";

import {
  PLAYER_DASH_TRAIL_INTERVAL_MS,
  PLAYER_RUN_SPARK_INTERVAL_MS,
  createJumpBurstParticles,
  createLandingBurstParticles,
  createRunSparkParticle,
  getDashGhostOffset,
  getPlayerAuraConfig,
  resolvePlayerEnergyMode,
  shouldEmitTimedEffect,
} from "../src/game/systems/player-visual-effects";

describe("player visual effects", () => {
  it("resolves aura mode from the current player movement", () => {
    expect(
      resolvePlayerEnergyMode({
        isAlive: true,
        isRespawning: false,
        isGrounded: true,
        isDashing: false,
        velocity: { x: 0, y: 0 },
      }),
    ).toBe("idle");
    expect(
      resolvePlayerEnergyMode({
        isAlive: true,
        isRespawning: false,
        isGrounded: false,
        isDashing: false,
        velocity: { x: 0, y: -140 },
      }),
    ).toBe("jump");
    expect(
      resolvePlayerEnergyMode({
        isAlive: true,
        isRespawning: false,
        isGrounded: true,
        isDashing: true,
        velocity: { x: 420, y: 0 },
      }),
    ).toBe("dash");
  });

  it("keeps stronger aura sizing for dash and respawn effects", () => {
    const idleAura = getPlayerAuraConfig({ x: 100, y: 120 }, "idle");
    const dashAura = getPlayerAuraConfig({ x: 100, y: 120 }, "dash");
    const respawnAura = getPlayerAuraConfig({ x: 100, y: 120 }, "respawn");

    expect(dashAura.width).toBeGreaterThan(idleAura.width);
    expect(dashAura.alpha).toBeGreaterThan(idleAura.alpha);
    expect(respawnAura.height).toBeGreaterThan(idleAura.height);
  });

  it("builds deterministic burst particles and timed effect gates", () => {
    expect(createJumpBurstParticles({ x: 40, y: 80 })).toHaveLength(3);
    expect(createLandingBurstParticles({ x: 40, y: 80 })).toHaveLength(3);
    expect(
      createRunSparkParticle({ x: 40, y: 80 }, "right").offsetX,
    ).toBeLessThan(0);
    expect(getDashGhostOffset("right").x).toBeLessThan(0);
    expect(getDashGhostOffset("left").x).toBeGreaterThan(0);
    expect(
      shouldEmitTimedEffect({
        nowMs: PLAYER_DASH_TRAIL_INTERVAL_MS,
        lastEmitMs: 0,
        intervalMs: PLAYER_DASH_TRAIL_INTERVAL_MS,
      }),
    ).toBe(true);
    expect(
      shouldEmitTimedEffect({
        nowMs: PLAYER_RUN_SPARK_INTERVAL_MS - 1,
        lastEmitMs: 0,
        intervalMs: PLAYER_RUN_SPARK_INTERVAL_MS,
      }),
    ).toBe(false);
  });
});
