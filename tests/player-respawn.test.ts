import { describe, expect, it } from "vitest";

import {
  AUTO_RESPAWN_DELAY_MS,
  isAutoRespawnDelayInReadyRange,
  MANUAL_RESTART_COUNTS_AS_DEATH,
  RESPAWN_RECOVERY_MS,
} from "../src/game/systems/player-respawn";

describe("player respawn", () => {
  it("uses an automatic respawn delay inside the ready range", () => {
    expect(isAutoRespawnDelayInReadyRange(AUTO_RESPAWN_DELAY_MS)).toBe(true);
    expect(isAutoRespawnDelayInReadyRange(299)).toBe(false);
    expect(isAutoRespawnDelayInReadyRange(601)).toBe(false);
  });

  it("keeps the visual recovery shorter than the automatic respawn wait", () => {
    expect(RESPAWN_RECOVERY_MS).toBeGreaterThanOrEqual(0);
    expect(RESPAWN_RECOVERY_MS).toBeLessThan(AUTO_RESPAWN_DELAY_MS);
  });

  it("does not count manual restart as a death", () => {
    expect(MANUAL_RESTART_COUNTS_AS_DEATH).toBe(false);
  });
});
