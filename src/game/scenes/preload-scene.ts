import Phaser from "phaser";

import { IMAGE_ASSETS } from "../assets";
import { GAME_BACKGROUND_COLOR } from "../constants";
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
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.MENU);
  }
}
