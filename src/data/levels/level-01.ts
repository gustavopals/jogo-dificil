import {
  GAMEPLAY_SPRITE_KEYS,
  PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
  PLACEHOLDER_TILESET_ASSET_KEYS,
} from "../art";
import { defineLevel } from "./schema";

// Coordenadas legadas (16px tile, 480×270).  O registry aplica migração 2× para HD.
const T = 16; // tamanho do tile legado
const W = 480 * 2; // largura total = 960
const H = 270; // altura total
const FY = H - T * 3; // FLOOR_Y = 222
const SOLID = PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK;
const CHIP = GAMEPLAY_SPRITE_KEYS.ITEM_REQUIRED_CHIP;
const SFX_CP = "sfx-level-01-checkpoint";
const SFX_POP = "sfx-level-01-trap-pop";

// ── Seção 1: ANDAR ──────────────────────────────────────────── x=0-224
// ── Seção 2: PULAR ──────────────────────────────────────────── x=256-448
//   (obstáculo 2 tiles no meio força o pulo)
// ── Seção 3: CHECKPOINT + HABILIDADES ───────────────────────── x=496-704
//   (spike-pop cruel logo depois das dicas de disparar)
// ── Seção 4: SALTO FINAL ─────────────────────────────────────── x=736-880
//   (salto em corrida para plataforma elevada)
// ── Seção 5: SAÍDA ───────────────────────────────────────────── x=880-960

export const LEVEL_01 = defineLevel({
  id: "level-01",
  name: "Bem-vindo, Pino!",
  order: 1,
  theme: "warning-lab",
  bounds: { x: 0, y: 0, width: W, height: H },
  spawn: { x: T * 4, y: FY },
  exit: {
    id: "level-01-exit",
    area: { x: W - T * 4, y: FY - T * 2, width: T * 2, height: T * 2 },
    nextLevelId: "level-02",
  },
  checkpoints: [
    {
      id: "level-01-mid",
      position: { x: T * 34, y: FY },
      area: { x: T * 33, y: FY - T * 2, width: T * 2, height: T * 2 },
    },
  ],
  terrain: [
    // Paredes externas
    { id: "l01-wall-left",  kind: "solid", area: { x: 0,      y: 0, width: T,    height: H }, assetId: SOLID },
    { id: "l01-wall-right", kind: "solid", area: { x: W - T,  y: 0, width: T,    height: H }, assetId: SOLID },

    // Seção 1: chão corrida (14 tiles)
    { id: "l01-floor-1", kind: "solid", area: { x: 0,   y: FY, width: T * 14, height: T }, assetId: SOLID },

    // Seção 2: chão antes do obstáculo (5 tiles) + obstáculo a saltar + chão depois (5 tiles)
    { id: "l01-floor-2a",    kind: "solid", area: { x: T * 16, y: FY,       width: T * 5,  height: T }, assetId: SOLID },
    { id: "l01-obstacle",    kind: "solid", area: { x: T * 21, y: FY - T*2, width: T * 2,  height: T * 2 }, assetId: SOLID },
    { id: "l01-floor-2b",    kind: "solid", area: { x: T * 23, y: FY,       width: T * 5,  height: T }, assetId: SOLID },

    // Seção 3: chão principal (13 tiles: x=496-704)
    { id: "l01-floor-3",     kind: "solid", area: { x: T * 31, y: FY, width: T * 13, height: T }, assetId: SOLID },

    // Seção 4: trampolim antes do salto (2 tiles) + plataforma elevada (4 tiles)
    { id: "l01-floor-4a",    kind: "solid", area: { x: T * 46, y: FY,       width: T * 2,  height: T }, assetId: SOLID },
    { id: "l01-platform-hi", kind: "solid", area: { x: T * 51, y: FY - T,   width: T * 4,  height: T }, assetId: SOLID },

    // Seção 5: chão de saída (4 tiles)
    { id: "l01-floor-5",     kind: "solid", area: { x: T * 55, y: FY, width: T * 4,  height: T }, assetId: SOLID },
  ],
  hazards: [
    // Buracos de queda
    { id: "l01-pit-1", kind: "fall", area: { x: T * 14, y: FY + T, width: T * 2,  height: T * 2 }, isInstantDeath: true },
    { id: "l01-pit-2", kind: "fall", area: { x: T * 28, y: FY + T, width: T * 3,  height: T * 2 }, isInstantDeath: true },
    { id: "l01-pit-3", kind: "fall", area: { x: T * 44, y: FY + T, width: T * 2,  height: T * 2 }, isInstantDeath: true },
    { id: "l01-pit-4", kind: "fall", area: { x: T * 48, y: FY + T, width: T * 3,  height: T * 2 }, isInstantDeath: true },
  ],
  traps: [
    // Spike-pop surpresa logo depois das dicas de disparar — "você estava se sentindo confortável?"
    {
      id: "level-01-spike-pop",
      kind: "spike-pop",
      trigger: {
        kind: "area",
        area: { x: T * 41, y: FY - T * 3, width: T * 3, height: T * 3 },
      },
      area: { x: T * 42 + T / 2, y: FY - T, width: T, height: T },
      resetOnRespawn: true,
      config: { delayMs: 100 },
    },
  ],
  items: [
    {
      id: "level-01-required-chip",
      kind: "required",
      position: { x: T * 8,           y: FY - T },
      hitbox:   { x: T * 8 - T / 2,   y: FY - T * 2, width: T, height: T },
      persistsAfterDeath: false,
      assetId: CHIP,
    },
  ],
  interactiveObjects: [],
  hints: [
    // Seção 1
    {
      id: "hint-andar",
      position: { x: T * 7, y: FY - T * 4 },
      lines: ["← A   D →", "andar"],
    },
    // Seção 2 — antes do obstáculo
    {
      id: "hint-pular",
      position: { x: T * 18, y: FY - T * 5 },
      lines: ["ESPAÇO / W", "pular"],
    },
    // Seção 3 — após checkpoint
    {
      id: "hint-atacar",
      position: { x: T * 33, y: FY - T * 4 },
      lines: ["J / Z", "atacar"],
    },
    {
      id: "hint-energia",
      position: { x: T * 37, y: FY - T * 4 },
      lines: ["segure C / L", "energia + dash"],
    },
    {
      id: "hint-disparar",
      position: { x: T * 41, y: FY - T * 4 },
      lines: ["K / X", "disparar energia"],
    },
    // Após o buraco 3 — dica de reiniciar
    {
      id: "hint-reiniciar",
      position: { x: T * 45, y: FY - T * 3 },
      lines: ["R", "voltar ao checkpoint"],
    },
  ],
  audio: {
    sounds: [
      {
        id: "level-01-checkpoint-sfx",
        category: "sfx",
        assetKey: SFX_CP,
        path: "assets/audio/sfx/level-01-checkpoint.ogg",
        volume: 0.65,
        loop: false,
      },
      {
        id: "level-01-trap-pop-sfx",
        category: "sfx",
        assetKey: SFX_POP,
        path: "assets/audio/sfx/level-01-trap-pop.ogg",
        volume: 0.7,
        loop: false,
      },
    ],
  },
  difficulty: 1,
  mainChallenge: "Tutorial de controles: andar, pular, habilidades e primeira armadilha.",
  progressReward: "Chegar ao checkpoint e entender o fluxo de tentativa-e-erro.",
  assets: {
    sprites: [CHIP],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [SFX_CP, SFX_POP],
  },
});

