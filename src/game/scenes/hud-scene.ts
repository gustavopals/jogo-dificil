import Phaser from "phaser";

import { GAME_RESOLUTION } from "../config";
import { SCENE_KEYS } from "./scene-keys";

export class HudScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.HUD);
  }

  public create(): void {
    this.add.text(8, 6, "Mortes: 0", {
      color: "#f5f7fb",
      fontFamily: "monospace",
      fontSize: "10px",
    });

    this.add
      .text(GAME_RESOLUTION.width - 8, 6, "Fase 1", {
        color: "#f5f7fb",
        fontFamily: "monospace",
        fontSize: "10px",
      })
      .setOrigin(1, 0);
  }
}
