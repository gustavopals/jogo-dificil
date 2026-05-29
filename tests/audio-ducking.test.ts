import { describe, expect, it } from "vitest";

import { BOSS_AUDIO_IDS } from "../src/data/audio/boss-audio";
import { MUSIC_AUDIO_IDS } from "../src/data/audio/music-audio";
import {
  DEFAULT_MUSIC_DUCK_CONFIG,
  MUSIC_DUCK_VOLUME_MULTIPLIER,
  applyMusicDuckMultiplier,
  clampDuckMultiplier,
  resolveMusicDuckMultiplier,
  shouldDuckMusicForAudioId,
} from "../src/game/systems/audio-ducking";

describe("audio ducking helpers", () => {
  it("flags sting and boss entry as duck triggers", () => {
    expect(shouldDuckMusicForAudioId(MUSIC_AUDIO_IDS.LEVEL_COMPLETE_STING)).toBe(
      true,
    );
    expect(shouldDuckMusicForAudioId(BOSS_AUDIO_IDS.ENTRY)).toBe(true);
    expect(shouldDuckMusicForAudioId(MUSIC_AUDIO_IDS.MVP_LOOP)).toBe(false);
  });

  it("applies duck multiplier to base music volume", () => {
    expect(applyMusicDuckMultiplier(0.4, 0.55)).toBeCloseTo(0.22);
    expect(applyMusicDuckMultiplier(0, 0.55)).toBe(0);
  });

  it("resolves active duck window over time", () => {
    const nowMs = 10_000;
    const duckUntilMs = nowMs + DEFAULT_MUSIC_DUCK_CONFIG.durationMs;

    expect(
      resolveMusicDuckMultiplier(
        nowMs,
        duckUntilMs,
        MUSIC_DUCK_VOLUME_MULTIPLIER,
      ),
    ).toBe(MUSIC_DUCK_VOLUME_MULTIPLIER);
    expect(
      resolveMusicDuckMultiplier(
        duckUntilMs,
        duckUntilMs,
        MUSIC_DUCK_VOLUME_MULTIPLIER,
      ),
    ).toBe(1);
    expect(resolveMusicDuckMultiplier(nowMs, null, 0.5)).toBe(1);
  });

  it("clamps invalid duck multipliers", () => {
    expect(clampDuckMultiplier(Number.NaN)).toBe(1);
    expect(clampDuckMultiplier(1.5)).toBe(1);
    expect(clampDuckMultiplier(-0.2)).toBe(0);
  });
});
