import Phaser from "phaser";

import { GAME_RESOLUTION, PLAYER_SIZE, TILE_SIZE_PX } from "../config";
import { SCENE_KEYS } from "./scene-keys";

export class LevelScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.LEVEL);
  }

  public create(): void {
    this.scene.launch(SCENE_KEYS.HUD);

    const groundY = GAME_RESOLUTION.height - TILE_SIZE_PX * 3;

    this.add.rectangle(
      GAME_RESOLUTION.width / 2,
      groundY,
      GAME_RESOLUTION.width,
      TILE_SIZE_PX,
      0x314b57,
    );

    this.add.rectangle(
      TILE_SIZE_PX * 4,
      groundY - PLAYER_SIZE.visualHeight / 2,
      PLAYER_SIZE.visualWidth,
      PLAYER_SIZE.visualHeight,
      0xf25b5b,
    );

    this.add.text(16, 16, "LevelScene placeholder", {
      color: "#d5dae6",
      fontFamily: "monospace",
      fontSize: "10px",
    });

    this.input.keyboard?.on("keydown-ESC", () => {
      this.scene.pause();
      this.scene.launch(SCENE_KEYS.PAUSE);
    });
  }
}
