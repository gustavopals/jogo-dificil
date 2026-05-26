import Phaser from "phaser";

import { MUSIC_AUDIO_IDS } from "../../data/audio";
import { AUDIO_ASSETS, IMAGE_ASSETS } from "../assets";
import { GAME_BACKGROUND_COLOR } from "../constants";
import { emitGameEvent, GAME_EVENTS } from "../systems/game-events";
import { SCENE_KEYS } from "./scene-keys";

export class PreloadScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  public preload(): void {
    this.cameras.main.setBackgroundColor(GAME_BACKGROUND_COLOR);

    IMAGE_ASSETS.forEach((asset) => {
      this.load.image(asset.key, asset.url);
    });
    AUDIO_ASSETS.forEach((asset) => {
      this.load.audio(asset.key, asset.url);
    });
  }

  public create(): void {
    emitGameEvent(GAME_EVENTS.AUDIO_PLAY_REQUESTED, {
      audioId: MUSIC_AUDIO_IDS.MVP_LOOP,
      category: "music",
    });
    this.scene.start(SCENE_KEYS.MENU);
  }
}
