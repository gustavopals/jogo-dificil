import Phaser from "phaser";

import { PINO_TEXTURE_KEYS } from "../../data/characters/pino-animations";
import { getRequiredLevelDefinition } from "../../data/levels";
import { GAME_BACKGROUND_COLOR, TILE_SIZE_PX } from "../constants";
import { gameStateStore } from "../systems/game-state";
import {
  START_SCREEN_COPY,
  START_SCREEN_LAYOUT,
  START_SCREEN_LEVEL_ID,
} from "../ui/start-screen";
import { SCENE_KEYS } from "./scene-keys";

export class MenuScene extends Phaser.Scene {
  private hasStarted = false;

  public constructor() {
    super(SCENE_KEYS.MENU);
  }

  public create(): void {
    this.hasStarted = false;
    gameStateStore.enterMenu();
    this.cameras.main.setBackgroundColor(GAME_BACKGROUND_COLOR);

    this.drawBackdrop();
    this.drawStartScreen();
    this.bindStartInput();
  }

  private drawBackdrop(): void {
    const { width, height, groundY } = START_SCREEN_LAYOUT;

    this.add.rectangle(0, 0, width, height, 0x111217).setOrigin(0);

    const skyline = this.add.graphics();
    skyline.fillStyle(0x171923, 1);
    skyline.fillRect(0, groundY - TILE_SIZE_PX * 3, width, TILE_SIZE_PX * 3);
    skyline.fillStyle(0x20232d, 1);

    for (let x = 0; x < width; x += TILE_SIZE_PX * 2) {
      const heightOffset = x % (TILE_SIZE_PX * 4) === 0 ? 18 : 8;

      skyline.fillRect(
        x,
        groundY - TILE_SIZE_PX * 3 - heightOffset,
        TILE_SIZE_PX,
        heightOffset,
      );
    }

    this.add.rectangle(width / 2, groundY + 16, width, 32, 0x242630);
    this.add.rectangle(width / 2, groundY, width, 2, 0x80d7c2).setAlpha(0.45);

    const hazards = this.add.graphics();
    hazards.fillStyle(0xe35d6a, 1);

    for (let x = width - 158; x < width - 90; x += 12) {
      hazards.fillTriangle(x, groundY, x + 6, groundY - 14, x + 12, groundY);
    }
  }

  private drawStartScreen(): void {
    const { width, titleY, commandY, groundY, playerX, exitX } =
      START_SCREEN_LAYOUT;

    this.add
      .text(width / 2, titleY, START_SCREEN_COPY.title, {
        color: "#f5f7fb",
        fontFamily: "monospace",
        fontSize: "34px",
      })
      .setOrigin(0.5)
      .setShadow(0, 3, "#05060a", 2);

    const startCommand = this.add
      .text(width / 2, commandY, START_SCREEN_COPY.startCommand, {
        color: "#80d7c2",
        fontFamily: "monospace",
        fontSize: "12px",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: startCommand,
      alpha: 0.48,
      duration: 740,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.add
      .rectangle(exitX, groundY - 25, 28, 50, 0x80d7c2)
      .setAlpha(0.18)
      .setStrokeStyle(2, 0x80d7c2, 0.85);
    this.add.rectangle(exitX, groundY - 4, 12, 4, 0xf5f7fb).setAlpha(0.75);

    const player = this.add
      .image(playerX, groundY, PINO_TEXTURE_KEYS.IDLE)
      .setOrigin(0.5, 1)
      .setScale(2)
      .setAlpha(0.95);

    this.tweens.add({
      targets: player,
      y: player.y - 3,
      duration: 920,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private bindStartInput(): void {
    this.input.keyboard?.once("keydown-ENTER", this.startLevel, this);
    this.input.keyboard?.once("keydown-SPACE", this.startLevel, this);
    this.input.once("pointerdown", this.startLevel, this);
  }

  private startLevel(): void {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;

    const initialLevel = getRequiredLevelDefinition(START_SCREEN_LEVEL_ID);

    gameStateStore.startLevel(initialLevel.id, initialLevel.spawn);
    this.scene.start(SCENE_KEYS.LEVEL);
  }
}
