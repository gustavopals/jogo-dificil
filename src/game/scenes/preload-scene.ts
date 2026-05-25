import Phaser from "phaser";

import { GAME_BACKGROUND_COLOR } from "../config";
import { SCENE_KEYS } from "./scene-keys";

export class PreloadScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  public preload(): void {
    this.cameras.main.setBackgroundColor(GAME_BACKGROUND_COLOR);
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.MENU);
  }
}
