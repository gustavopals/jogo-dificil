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
