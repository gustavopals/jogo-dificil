import {
  PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
  PLACEHOLDER_TILESET_ASSET_KEYS,
} from "../art";
import { defineLevel } from "./schema";

const TILE_SIZE_PX = 16;
const BASE_WIDTH_PX = 480;
const BASE_HEIGHT_PX = 270;
const LEVEL_WIDTH_PX = BASE_WIDTH_PX * 2;
const FLOOR_Y = BASE_HEIGHT_PX - TILE_SIZE_PX * 3;
const SOLID_TILESET_ID = PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK;
const OPTIONAL_TOKEN_SPRITE_ID = "sprite-optional-token";
const TOKEN_SFX_ID = "sfx-level-03-token";
const FALSE_FLOOR_SFX_ID = "sfx-level-03-false-floor";

export const LEVEL_03 = defineLevel({
  id: "level-03",
  name: "Quase Seguro",
  order: 3,
  theme: "memory-lab",
  bounds: {
    x: 0,
    y: 0,
    width: LEVEL_WIDTH_PX,
    height: BASE_HEIGHT_PX,
  },
  spawn: {
    x: TILE_SIZE_PX * 4,
    y: FLOOR_Y,
  },
  exit: {
    id: "level-03-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: TILE_SIZE_PX * 8,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 4,
    },
  },
  checkpoints: [
    {
      id: "level-03-before-cruel",
      position: {
        x: TILE_SIZE_PX * 34,
        y: FLOOR_Y,
      },
      area: {
        x: TILE_SIZE_PX * 33,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 3,
      },
    },
  ],
  terrain: [
    {
      id: "level-03-wall-left",
      kind: "solid",
      area: {
        x: 0,
        y: 0,
        width: TILE_SIZE_PX,
        height: BASE_HEIGHT_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-wall-right",
      kind: "solid",
      area: {
        x: LEVEL_WIDTH_PX - TILE_SIZE_PX,
        y: 0,
        width: TILE_SIZE_PX,
        height: BASE_HEIGHT_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-floor-start",
      kind: "solid",
      area: {
        x: 0,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 12,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-floor-checkpoint",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 32,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 9,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-platform-precision-01",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 15,
        y: TILE_SIZE_PX * 11,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-platform-precision-02",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 21,
        y: TILE_SIZE_PX * 9,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-platform-precision-03",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 27,
        y: TILE_SIZE_PX * 11,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-platform-cruel-setup",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 43,
        y: TILE_SIZE_PX * 10,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-exit-platform",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 50,
        y: TILE_SIZE_PX * 12,
        width: TILE_SIZE_PX * 8,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-03-fall-sequence",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 12,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 20,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-03-fall-cruel-exit",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 40,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 20,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
  ],
  traps: [
    {
      id: "level-03-false-floor",
      kind: "false-block",
      trigger: {
        kind: "touch",
        area: {
          x: TILE_SIZE_PX * 52,
          y: TILE_SIZE_PX * 11,
          width: TILE_SIZE_PX * 3,
          height: TILE_SIZE_PX * 2,
        },
      },
      area: {
        x: TILE_SIZE_PX * 52,
        y: TILE_SIZE_PX * 12,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
    },
    {
      id: "level-03-breakable-platform",
      kind: "breakable-floor",
      trigger: {
        kind: "touch",
        area: {
          x: TILE_SIZE_PX * 21,
          y: TILE_SIZE_PX * 8,
          width: TILE_SIZE_PX * 3,
          height: TILE_SIZE_PX * 2,
        },
      },
      area: {
        x: TILE_SIZE_PX * 21,
        y: TILE_SIZE_PX * 9,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
    },
  ],
  items: [
    {
      id: "level-03-risk-token",
      kind: "optional",
      position: {
        x: TILE_SIZE_PX * 22 + TILE_SIZE_PX / 2,
        y: TILE_SIZE_PX * 7,
      },
      hitbox: {
        x: TILE_SIZE_PX * 22,
        y: TILE_SIZE_PX * 7 - 8,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      persistsAfterDeath: true,
      assetId: OPTIONAL_TOKEN_SPRITE_ID,
    },
  ],
  interactiveObjects: [],
  audio: {
    sounds: [
      {
        id: "level-03-token-sfx",
        category: "sfx",
        assetKey: TOKEN_SFX_ID,
        path: "assets/audio/sfx/level-03-token.ogg",
        volume: 0.55,
        loop: false,
      },
      {
        id: "level-03-false-floor-sfx",
        category: "sfx",
        assetKey: FALSE_FLOOR_SFX_ID,
        path: "assets/audio/sfx/level-03-false-floor.ogg",
        volume: 0.7,
        loop: false,
      },
    ],
  },
  difficulty: 3,
  mainChallenge: "Combinar precisao, memoria curta e desconfianca da saida.",
  progressReward: "Fechar o bloco inicial com uma armadilha memoravel.",
  assets: {
    sprites: [OPTIONAL_TOKEN_SPRITE_ID],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [TOKEN_SFX_ID, FALSE_FLOOR_SFX_ID],
  },
});
