import { describe, expect, it } from "vitest";

import {
  GAMEPLAY_MUSIC_BLOCK_RANGES,
  getGameplayMusicBlockForOrder,
  resolveGameplayMusicAudioId,
  shouldRestartGameplayMusic,
} from "../src/data/audio/level-music-routing";
import { MUSIC_AUDIO_IDS } from "../src/data/audio/music-audio";
import { LEVEL_01, LEVEL_04, LEVEL_07, LEVEL_10 } from "../src/data/levels";

describe("level music routing", () => {
  it("maps campaign blocks to distinct gameplay loops", () => {
    expect(GAMEPLAY_MUSIC_BLOCK_RANGES).toHaveLength(3);
    expect(getGameplayMusicBlockForOrder(1).musicAudioId).toBe(
      MUSIC_AUDIO_IDS.MVP_LOOP,
    );
    expect(getGameplayMusicBlockForOrder(3).musicAudioId).toBe(
      MUSIC_AUDIO_IDS.MVP_LOOP,
    );
    expect(getGameplayMusicBlockForOrder(4).musicAudioId).toBe(
      MUSIC_AUDIO_IDS.BLOCK_2_DASH_LOOP,
    );
    expect(getGameplayMusicBlockForOrder(6).musicAudioId).toBe(
      MUSIC_AUDIO_IDS.BLOCK_2_DASH_LOOP,
    );
    expect(getGameplayMusicBlockForOrder(7).musicAudioId).toBe(
      MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
    );
    expect(getGameplayMusicBlockForOrder(10).musicAudioId).toBe(
      MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
    );
    expect(getGameplayMusicBlockForOrder(11).musicAudioId).toBe(
      MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
    );
  });

  it("resolves gameplay music from level order by default", () => {
    expect(resolveGameplayMusicAudioId(LEVEL_01)).toBe(MUSIC_AUDIO_IDS.MVP_LOOP);
    expect(resolveGameplayMusicAudioId(LEVEL_04)).toBe(
      MUSIC_AUDIO_IDS.BLOCK_2_DASH_LOOP,
    );
    expect(resolveGameplayMusicAudioId(LEVEL_07)).toBe(
      MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
    );
    expect(resolveGameplayMusicAudioId(LEVEL_10)).toBe(
      MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
    );
  });

  it("honors explicit level audio overrides when present", () => {
    const overrideLevel = {
      ...LEVEL_01,
      audio: {
        ...LEVEL_01.audio,
        musicId: "music-block-3-energy-loop",
      },
    };

    expect(resolveGameplayMusicAudioId(overrideLevel)).toBe(
      MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
    );
  });

  it("detects when a transition should swap gameplay music", () => {
    expect(shouldRestartGameplayMusic(3, 4)).toBe(true);
    expect(shouldRestartGameplayMusic(6, 7)).toBe(true);
    expect(shouldRestartGameplayMusic(4, 5)).toBe(false);
    expect(shouldRestartGameplayMusic(7, 10)).toBe(false);
    expect(shouldRestartGameplayMusic(10, 11)).toBe(false);
  });
});
