import Phaser from "phaser";

import { GAME_RESOLUTION, TILE_SIZE_PX } from "../constants";
import { Player } from "../entities";
import { ActionInput } from "../input";
import {
  calculateHorizontalVelocity,
  getHorizontalDirection,
} from "../physics";
import { gameStateStore } from "../systems/game-state";
import { SCENE_KEYS } from "./scene-keys";

export class LevelScene extends Phaser.Scene {
  private player?: Player;
  private actionInput?: ActionInput;

  public constructor() {
    super(SCENE_KEYS.LEVEL);
  }

  public create(): void {
    this.scene.launch(SCENE_KEYS.HUD);
    gameStateStore.setPaused(false);
    Player.registerAnimations(this);
    this.actionInput = new ActionInput(this);

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

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  public override update(_time: number, delta: number): void {
    if (this.actionInput?.wasPressed("pause")) {
      this.pauseLevel();
    }

    if (this.actionInput?.wasPressed("mute")) {
      this.toggleMute();
    }

    this.updatePlayerMovement(delta);
  }

  private updatePlayerMovement(delta: number): void {
    if (!this.player || !this.actionInput) {
      return;
    }

    const { velocity } = this.player.getPhysicsState();
    const direction = getHorizontalDirection({
      isMovingLeft: this.actionInput.isDown("move-left"),
      isMovingRight: this.actionInput.isDown("move-right"),
    });
    const horizontalVelocity = calculateHorizontalVelocity({
      currentVelocityX: velocity.x,
      direction,
      isGrounded: true,
      deltaMs: delta,
    });

    this.player.updateMovement({
      velocity: {
        x: horizontalVelocity,
        y: 0,
      },
      ...(direction !== 0
        ? { facing: direction === -1 ? "left" : "right" }
        : {}),
      isGrounded: true,
    });
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
    this.actionInput?.destroy();
    this.actionInput = undefined;
    this.player?.destroy();
    this.player = undefined;
    this.scene.stop(SCENE_KEYS.HUD);
  }
}
