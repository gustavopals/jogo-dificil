import Phaser from "phaser";

import {
  GAME_BACKGROUND_COLOR,
  GAME_PARENT_ID,
  GAME_RESOLUTION,
  GAME_TITLE,
  PLAYER_MOVEMENT,
  TARGET_FPS,
} from "./constants";

export const SCALE_CONFIG = {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  zoom: Phaser.Scale.MAX_ZOOM,
  width: GAME_RESOLUTION.width,
  height: GAME_RESOLUTION.height,
  autoRound: true,
} satisfies Phaser.Types.Core.ScaleConfig;

export const RENDER_CONFIG = {
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  backgroundColor: GAME_BACKGROUND_COLOR,
} as const;

export const PHYSICS_CONFIG = {
  default: "arcade",
  arcade: {
    gravity: {
      x: 0,
      y: PLAYER_MOVEMENT.gravity,
    },
    debug: false,
  },
} satisfies Phaser.Types.Core.PhysicsConfig;

export function createGameConfig(
  scene: Phaser.Types.Scenes.SceneType[],
): Phaser.Types.Core.GameConfig {
  return {
    title: GAME_TITLE,
    type: Phaser.AUTO,
    parent: GAME_PARENT_ID,
    width: GAME_RESOLUTION.width,
    height: GAME_RESOLUTION.height,
    backgroundColor: GAME_BACKGROUND_COLOR,
    pixelArt: RENDER_CONFIG.pixelArt,
    roundPixels: RENDER_CONFIG.roundPixels,
    antialias: RENDER_CONFIG.antialias,
    fps: {
      target: TARGET_FPS,
    },
    scale: SCALE_CONFIG,
    physics: PHYSICS_CONFIG,
    scene,
  };
}
