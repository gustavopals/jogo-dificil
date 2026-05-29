import Phaser from "phaser";

import { AUDIO_ASSETS, RUNTIME_IMAGE_ASSETS, SPRITESHEET_ASSETS } from "../assets";
import { GAME_BACKGROUND_COLOR } from "../constants";
import { SCENE_KEYS } from "./scene-keys";

export class PreloadScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  public preload(): void {
    this.cameras.main.setBackgroundColor(GAME_BACKGROUND_COLOR);

    RUNTIME_IMAGE_ASSETS.forEach((asset) => {
      this.load.image(asset.key, asset.url);
    });
    SPRITESHEET_ASSETS.forEach((asset) => {
      if (!asset.enabled) {
        return;
      }

      this.load.spritesheet(asset.key, asset.url, {
        frameWidth: asset.frameWidth,
        frameHeight: asset.frameHeight,
      });
    });
    AUDIO_ASSETS.forEach((asset) => {
      this.load.audio(asset.key, asset.url);
    });
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.MENU);
  }
}
