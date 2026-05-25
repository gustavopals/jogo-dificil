import Phaser from "phaser";

import { GAME_RESOLUTION, TILE_SIZE_PX } from "../constants";
import { Player } from "../entities";
import { gameStateStore } from "../systems/game-state";
import { SCENE_KEYS } from "./scene-keys";

export class LevelScene extends Phaser.Scene {
  private player?: Player;

  public constructor() {
    super(SCENE_KEYS.LEVEL);
  }

  public create(): void {
    this.scene.launch(SCENE_KEYS.HUD);
    gameStateStore.setPaused(false);
    Player.registerAnimations(this);

    const { activeCheckpoint } = gameStateStore.getSnapshot();
    const groundY = GAME_RESOLUTION.height - TILE_SIZE_PX * 3;

    this.add.rectangle(
      GAME_RESOLUTION.width / 2,
      groundY,
      GAME_RESOLUTION.width,
      TILE_SIZE_PX,
      0x314b57,
    );

    this.player = new Player(this, {
      id: "player-pino",
      position: activeCheckpoint,
      facing: "right",
    });

    this.add.text(16, 16, "LevelScene placeholder", {
      color: "#d5dae6",
      fontFamily: "monospace",
      fontSize: "10px",
    });

    this.input.keyboard?.on("keydown-ESC", this.pauseLevel, this);
    this.input.keyboard?.on("keydown-M", this.toggleMute, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  public override update(): void {
    this.player?.updateMovement();
  }

  private pauseLevel(): void {
    if (gameStateStore.getSnapshot().isPaused) {
      return;
    }

    gameStateStore.setPaused(true);
    this.scene.pause();
    this.scene.launch(SCENE_KEYS.PAUSE);
  }

  private toggleMute(): void {
    gameStateStore.toggleMuted();
  }

  private cleanup(): void {
    this.input.keyboard?.off("keydown-ESC", this.pauseLevel, this);
    this.input.keyboard?.off("keydown-M", this.toggleMute, this);
    this.player?.destroy();
    this.player = undefined;
    this.scene.stop(SCENE_KEYS.HUD);
  }
}
