import Phaser from "phaser";

import { GAME_RESOLUTION } from "../config";
import { SCENE_KEYS } from "./scene-keys";

export class PauseScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.PAUSE);
  }

  public create(): void {
    this.add.rectangle(
      GAME_RESOLUTION.width / 2,
      GAME_RESOLUTION.height / 2,
      GAME_RESOLUTION.width,
      GAME_RESOLUTION.height,
      0x050608,
      0.78,
    );

    this.add
      .text(
        GAME_RESOLUTION.width / 2,
        GAME_RESOLUTION.height / 2 - 8,
        "Pausado",
        {
          color: "#f5f7fb",
          fontFamily: "monospace",
          fontSize: "18px",
        },
      )
      .setOrigin(0.5);

    this.add
      .text(
        GAME_RESOLUTION.width / 2,
        GAME_RESOLUTION.height / 2 + 20,
        "Esc para voltar",
        {
          color: "#80d7c2",
          fontFamily: "monospace",
          fontSize: "10px",
        },
      )
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-ESC", () => {
      this.scene.stop();
      this.scene.resume(SCENE_KEYS.LEVEL);
    });
  }
}
