import Phaser from "phaser";

import { SCENE_KEYS } from "./scene-keys";

export class BootScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.BOOT);
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.PRELOAD);
  }
}
