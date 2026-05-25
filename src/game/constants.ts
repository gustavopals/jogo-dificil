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
  hitboxWidth: 10,
  hitboxHeight: 22,
  spriteMargin: {
    left: 1,
    right: 1,
    top: 1,
    bottom: 1,
  },
  pivot: {
    x: 0.5,
    y: 1,
  },
  tileScale: {
    visualWidth: 12 / TILE_SIZE_PX,
    visualHeight: 24 / TILE_SIZE_PX,
    hitboxWidth: 10 / TILE_SIZE_PX,
    hitboxHeight: 22 / TILE_SIZE_PX,
  },
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
