import { describe, expect, it } from "vitest";

import {
  BLOCK_2_DASH_MUSIC_THEME,
  BLOCK_3_ENERGY_MUSIC_THEME,
  MENU_MUSIC_THEME,
  MUSIC_AUDIO_DEFINITIONS,
  MUSIC_AUDIO_IDS,
  MVP_MUSIC_THEME,
} from "../src/data/audio";
import { AUDIO_ASSETS } from "../src/game/assets";

describe("MVP music data", () => {
  it("defines menu, block gameplay loops and the completion sting", () => {
    expect(MENU_MUSIC_THEME).toMatchObject({
      id: "entrada-pulante",
      loopAudioId: MUSIC_AUDIO_IDS.MENU_LOOP,
      tempoBpm: 120,
    });
    expect(MVP_MUSIC_THEME).toMatchObject({
      id: "pulos-de-azar",
      loopAudioId: MUSIC_AUDIO_IDS.MVP_LOOP,
      tempoBpm: 96,
    });
    expect(BLOCK_2_DASH_MUSIC_THEME).toMatchObject({
      id: "dash-sob-suspeita",
      loopAudioId: MUSIC_AUDIO_IDS.BLOCK_2_DASH_LOOP,
      tempoBpm: 108,
    });
    expect(BLOCK_3_ENERGY_MUSIC_THEME).toMatchObject({
      id: "nucleo-ciano",
      loopAudioId: MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
      tempoBpm: 88,
    });

    expect(MUSIC_AUDIO_DEFINITIONS.map((audio) => audio.id)).toEqual([
      MUSIC_AUDIO_IDS.MENU_LOOP,
      MUSIC_AUDIO_IDS.MVP_LOOP,
      MUSIC_AUDIO_IDS.BLOCK_2_DASH_LOOP,
      MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
      MUSIC_AUDIO_IDS.LEVEL_COMPLETE_STING,
    ]);
  });

  it("keeps menu and gameplay themes looped and the completion sting short-lived", () => {
    const menuLoop = MUSIC_AUDIO_DEFINITIONS.find(
      (audio) => audio.id === MUSIC_AUDIO_IDS.MENU_LOOP,
    );
    const mainLoop = MUSIC_AUDIO_DEFINITIONS.find(
      (audio) => audio.id === MUSIC_AUDIO_IDS.MVP_LOOP,
    );
    const block2Loop = MUSIC_AUDIO_DEFINITIONS.find(
      (audio) => audio.id === MUSIC_AUDIO_IDS.BLOCK_2_DASH_LOOP,
    );
    const block3Loop = MUSIC_AUDIO_DEFINITIONS.find(
      (audio) => audio.id === MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
    );
    const completeSting = MUSIC_AUDIO_DEFINITIONS.find(
      (audio) => audio.id === MUSIC_AUDIO_IDS.LEVEL_COMPLETE_STING,
    );

    expect(menuLoop).toMatchObject({
      category: "music",
      loop: true,
      path: "assets/audio/music/menu-loop.wav",
    });
    expect(mainLoop).toMatchObject({
      category: "music",
      loop: true,
      path: "assets/audio/music/mvp-loop.wav",
    });
    expect(block2Loop).toMatchObject({
      category: "music",
      loop: true,
      path: "assets/audio/music/block-2-dash-loop.wav",
    });
    expect(block3Loop).toMatchObject({
      category: "music",
      loop: true,
      path: "assets/audio/music/block-3-energy-loop.wav",
    });
    expect(completeSting).toMatchObject({
      category: "music",
      loop: false,
      path: "assets/audio/music/mvp-level-complete-sting.wav",
    });
  });

  it("preloads every music asset key", () => {
    const assetKeys = AUDIO_ASSETS.map((asset) => asset.key);

    MUSIC_AUDIO_DEFINITIONS.forEach((audio) => {
      expect(assetKeys).toContain(audio.assetKey);
    });
  });
});
