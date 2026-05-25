import Phaser from "phaser";

import { gameStateStore } from "../systems/game-state";
import { SCENE_KEYS } from "./scene-keys";

export class BootScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.BOOT);
  }

  public create(): void {
    gameStateStore.resetRun();
    this.scene.start(SCENE_KEYS.PRELOAD);
  }
}
