import { describe, expect, it } from "vitest";

import {
  MUSIC_AUDIO_DEFINITIONS,
  MUSIC_AUDIO_IDS,
  MVP_MUSIC_THEME,
} from "../src/data/audio";
import { AUDIO_ASSETS } from "../src/game/assets";

describe("MVP music data", () => {
  it("defines the initial music theme and completion sting", () => {
    expect(MVP_MUSIC_THEME).toMatchObject({
      id: "passos-tortos",
      loopAudioId: MUSIC_AUDIO_IDS.MVP_LOOP,
      tempoBpm: 92,
    });

    expect(MUSIC_AUDIO_DEFINITIONS.map((audio) => audio.id)).toEqual([
      MUSIC_AUDIO_IDS.MVP_LOOP,
      MUSIC_AUDIO_IDS.LEVEL_COMPLETE_STING,
    ]);
  });

  it("keeps the main theme looped and the completion sting short-lived", () => {
    const mainLoop = MUSIC_AUDIO_DEFINITIONS.find(
      (audio) => audio.id === MUSIC_AUDIO_IDS.MVP_LOOP,
    );
    const completeSting = MUSIC_AUDIO_DEFINITIONS.find(
      (audio) => audio.id === MUSIC_AUDIO_IDS.LEVEL_COMPLETE_STING,
    );

    expect(mainLoop).toMatchObject({
      category: "music",
      loop: true,
      path: "assets/audio/music/mvp-loop.wav",
    });
    expect(completeSting).toMatchObject({
      category: "music",
      loop: false,
      path: "assets/audio/music/mvp-level-complete-sting.wav",
    });
  });

  it("preloads every MVP music asset key", () => {
    const assetKeys = AUDIO_ASSETS.map((asset) => asset.key);

    MUSIC_AUDIO_DEFINITIONS.forEach((audio) => {
      expect(assetKeys).toContain(audio.assetKey);
    });
  });
});
