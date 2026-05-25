import Phaser from "phaser";

import {
  PINO_ANIMATIONS,
  PINO_TEXTURE_KEYS,
  selectPinoAnimationDefinition,
} from "../../data/characters/pino-animations";
import { GAME_RESOLUTION, PLAYER_SIZE, TILE_SIZE_PX } from "../constants";
import { gameStateStore } from "../systems/game-state";
import { SCENE_KEYS } from "./scene-keys";

export class LevelScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.LEVEL);
  }

  public create(): void {
    this.scene.launch(SCENE_KEYS.HUD);
    gameStateStore.setPaused(false);
    this.registerPlayerAnimations();

    const { activeCheckpoint } = gameStateStore.getSnapshot();
    const groundY = GAME_RESOLUTION.height - TILE_SIZE_PX * 3;

    this.add.rectangle(
      GAME_RESOLUTION.width / 2,
      groundY,
      GAME_RESOLUTION.width,
      TILE_SIZE_PX,
      0x314b57,
    );

    const playerAnimation = selectPinoAnimationDefinition({
      isAlive: true,
      isRespawning: false,
      isGrounded: true,
      velocity: {
        x: 0,
        y: 0,
      },
      isUsingPrimaryAction: false,
      isUsingSecondaryAction: false,
    });
    const playerTextureKey =
      playerAnimation.frames[0]?.textureKey ?? PINO_TEXTURE_KEYS.IDLE;

    this.add
      .sprite(activeCheckpoint.x, activeCheckpoint.y, playerTextureKey)
      .setOrigin(PLAYER_SIZE.pivot.x, PLAYER_SIZE.pivot.y)
      .play(playerAnimation.key);

    this.add.text(16, 16, "LevelScene placeholder", {
      color: "#d5dae6",
      fontFamily: "monospace",
      fontSize: "10px",
    });

    this.input.keyboard?.on("keydown-ESC", this.pauseLevel, this);
    this.input.keyboard?.on("keydown-M", this.toggleMute, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  private registerPlayerAnimations(): void {
    PINO_ANIMATIONS.forEach((animation) => {
      if (this.anims.exists(animation.key)) {
        return;
      }

      const frames = animation.frames.map((frame) => {
        if (frame.frame === undefined) {
          return {
            key: frame.textureKey,
          };
        }

        return {
          key: frame.textureKey,
          frame: frame.frame,
        };
      });

      this.anims.create({
        key: animation.key,
        frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      });
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
    this.input.keyboard?.off("keydown-ESC", this.pauseLevel, this);
    this.input.keyboard?.off("keydown-M", this.toggleMute, this);
    this.scene.stop(SCENE_KEYS.HUD);
  }
}
