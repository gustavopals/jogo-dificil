export const GAME_TITLE = "Pals Adventure 1";
export const GAME_PARENT_ID = "app";

export const GAME_RESOLUTION = {
  width: 960,
  height: 540,
} as const;

export const TILE_SIZE_PX = 32;
export const GAME_BACKGROUND_COLOR = "#111217";
export const TARGET_FPS = 60;

// Proporcao inspirada em Stardew Valley: personagem ~1 tile largo x 1,5 tile alto
// (SDV usa 16x32 em tiles de 16px; aqui 32x48 em tiles de 32px).
export const PLAYER_SIZE = {
  visualWidth: 32,
  visualHeight: 48,
  hitboxWidth: 20,
  hitboxHeight: 36,
  spriteMargin: {
    left: 6,
    right: 6,
    top: 8,
    bottom: 4,
  },
  pivot: {
    x: 0.5,
    y: 1,
  },
  tileScale: {
    visualWidth: 32 / TILE_SIZE_PX,
    visualHeight: 48 / TILE_SIZE_PX,
    hitboxWidth: 20 / TILE_SIZE_PX,
    hitboxHeight: 36 / TILE_SIZE_PX,
  },
} as const;

// Fase 18: o mundo migrou de 480x270 (tile 16) para 960x540 (tile 32), um
// fator espacial de 2x. As quantidades de fisica medidas em pixels (px/s e
// px/s^2) escalam junto com o mundo para preservar a sensacao de movimento em
// unidades de tile (mesma altura de pulo, mesma velocidade e mesma distancia de
// dash em tiles). Janelas de tempo (ms) e proporcoes nao mudam com a escala
// visual. Ver docs/phase-18-hd-migration-plan.md (secao 5.1).
const LEGACY_RESOLUTION_WIDTH = 480;
export const WORLD_PHYSICS_SCALE = GAME_RESOLUTION.width / LEGACY_RESOLUTION_WIDTH;

export const PLAYER_MOVEMENT = {
  maxHorizontalSpeed: 190 * WORLD_PHYSICS_SCALE,
  acceleration: 1800 * WORLD_PHYSICS_SCALE,
  groundDeceleration: 2200 * WORLD_PHYSICS_SCALE,
  airDeceleration: 900 * WORLD_PHYSICS_SCALE,
  jumpVelocity: -430 * WORLD_PHYSICS_SCALE,
  gravity: 1200 * WORLD_PHYSICS_SCALE,
  jumpCutMultiplier: 0.45,
  coyoteTimeMs: 90,
  jumpBufferMs: 100,
  dashSpeed: 420 * WORLD_PHYSICS_SCALE,
  dashDurationMs: 150,
  dashCooldownMs: 300,
  // Física v2 do arco de pulo: o ápice ganha uma janela de gravidade reduzida
  // (mais controle no topo) e a descida fica mais pesada que a subida, com
  // velocidade terminal para leitura da queda. A altura máxima do pulo não
  // muda (subida usa gravidade normal), então as fases continuam solváveis.
  apexSpeedThreshold: 70 * WORLD_PHYSICS_SCALE,
  apexGravityMultiplier: 0.58,
  // 1.15 mantém a queda mais firme sem encurtar de forma perceptível o
  // alcance horizontal de saltos descendentes das fases existentes (o hang
  // de ápice compensa o tempo perdido na descida).
  fallGravityMultiplier: 1.15,
  maxFallSpeed: 520 * WORLD_PHYSICS_SCALE,
} as const;
