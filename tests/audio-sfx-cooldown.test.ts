import { describe, expect, it } from "vitest";

import { BOSS_AUDIO_IDS } from "../src/data/audio/boss-audio";
import { PLAYER_AUDIO_IDS } from "../src/data/audio/player-audio";
import {
  getSfxCooldownMs,
  shouldAllowSfxPlayback,
} from "../src/game/systems/audio-sfx-cooldown";

describe("audio sfx cooldown", () => {
  it("exposes cooldowns for death and boss hit", () => {
    expect(getSfxCooldownMs(PLAYER_AUDIO_IDS.DEATH_01)).toBeGreaterThan(0);
    expect(getSfxCooldownMs(BOSS_AUDIO_IDS.HIT)).toBeGreaterThan(0);
    expect(getSfxCooldownMs(PLAYER_AUDIO_IDS.RESPAWN)).toBe(0);
  });

  it("blocks identical sfx inside cooldown window", () => {
    const lastPlayedAt = new Map<string, number>([
      [PLAYER_AUDIO_IDS.JUMP, 1_000],
    ]);

    expect(shouldAllowSfxPlayback(PLAYER_AUDIO_IDS.JUMP, 1_040, lastPlayedAt)).toBe(
      false,
    );
    expect(shouldAllowSfxPlayback(PLAYER_AUDIO_IDS.JUMP, 1_080, lastPlayedAt)).toBe(
      true,
    );
  });
});
