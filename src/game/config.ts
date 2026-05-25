import Phaser from "phaser";

export const GAME_TITLE = "Jogo Difícil";
export const GAME_PARENT_ID = "app";

export const GAME_RESOLUTION = {
  width: 480,
  height: 270,
} as const;

export const TILE_SIZE_PX = 16;
export const GAME_BACKGROUND_COLOR = "#111217";
export const TARGET_FPS = 60;

export const PLAYER_SIZE = {
  visualWidth: 12,
  visualHeight: 24,
} as const;

export const PLAYER_MOVEMENT = {
  maxHorizontalSpeed: 190,
  acceleration: 1800,
  groundDeceleration: 2200,
  airDeceleration: 900,
  jumpVelocity: -430,
  gravity: 1200,
  jumpCutMultiplier: 0.45,
  coyoteTimeMs: 90,
  jumpBufferMs: 100,
  dashDurationMs: 150,
  dashCooldownMs: 300,
} as const;

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
