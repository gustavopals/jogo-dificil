import { describe, expect, it } from "vitest";

import {
  getPlayerDeathAudioId,
  PLAYER_AUDIO_DEFINITIONS,
  PLAYER_AUDIO_IDS,
  PLAYER_DEATH_AUDIO_IDS,
} from "../src/data/audio";
import { AUDIO_ASSETS } from "../src/game/assets";

describe("player audio data", () => {
  it("defines short sfx hooks for every required player action", () => {
    expect(PLAYER_AUDIO_DEFINITIONS.map((audio) => audio.id)).toEqual([
      PLAYER_AUDIO_IDS.JUMP,
      PLAYER_AUDIO_IDS.LAND,
      PLAYER_AUDIO_IDS.DEATH_01,
      PLAYER_AUDIO_IDS.DEATH_02,
      PLAYER_AUDIO_IDS.DEATH_03,
      PLAYER_AUDIO_IDS.RESPAWN,
      PLAYER_AUDIO_IDS.PRIMARY_ACTION,
      PLAYER_AUDIO_IDS.SECONDARY_ACTION,
    ]);

    PLAYER_AUDIO_DEFINITIONS.forEach((audio) => {
      expect(audio.category, audio.id).toBe("sfx");
      expect(audio.loop, audio.id).toBe(false);
      expect(audio.volume, audio.id).toBeGreaterThan(0);
      expect(audio.volume, audio.id).toBeLessThanOrEqual(1);
      expect(audio.path, audio.id).toMatch(/^assets\/audio\/sfx\/.+\.wav$/);
    });
  });

  it("cycles death sound variations by death count", () => {
    expect(PLAYER_DEATH_AUDIO_IDS).toHaveLength(3);
    expect(getPlayerDeathAudioId(1)).toBe(PLAYER_AUDIO_IDS.DEATH_01);
    expect(getPlayerDeathAudioId(2)).toBe(PLAYER_AUDIO_IDS.DEATH_02);
    expect(getPlayerDeathAudioId(3)).toBe(PLAYER_AUDIO_IDS.DEATH_03);
    expect(getPlayerDeathAudioId(4)).toBe(PLAYER_AUDIO_IDS.DEATH_01);
    expect(getPlayerDeathAudioId(0)).toBe(PLAYER_AUDIO_IDS.DEATH_01);
  });

  it("preloads every player audio asset key", () => {
    const assetKeys = AUDIO_ASSETS.map((asset) => asset.key);

    PLAYER_AUDIO_DEFINITIONS.forEach((audio) => {
      expect(assetKeys).toContain(audio.assetKey);
    });
  });
});
