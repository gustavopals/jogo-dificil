import Phaser from "phaser";

import { GAME_RESOLUTION, GAME_TITLE } from "../constants";
import { gameStateStore, INITIAL_LEVEL_ID } from "../systems/game-state";
import { SCENE_KEYS } from "./scene-keys";

export class MenuScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.MENU);
  }

  public create(): void {
    gameStateStore.enterMenu();

    const centerX = GAME_RESOLUTION.width / 2;
    const centerY = GAME_RESOLUTION.height / 2;

    this.add
      .text(centerX, centerY - 34, GAME_TITLE, {
        color: "#f5f7fb",
        fontFamily: "monospace",
        fontSize: "28px",
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY + 14, "Pressione Enter ou Espaço", {
        color: "#80d7c2",
        fontFamily: "monospace",
        fontSize: "12px",
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-ENTER", this.startLevel, this);
    this.input.keyboard?.once("keydown-SPACE", this.startLevel, this);
    this.input.once("pointerdown", this.startLevel, this);
  }

  private startLevel(): void {
    gameStateStore.startLevel(INITIAL_LEVEL_ID);
    this.scene.start(SCENE_KEYS.LEVEL);
  }
}
