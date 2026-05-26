import {
  GAMEPLAY_SPRITE_KEYS,
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
const MECHANISM_KEY_SPRITE_ID = GAMEPLAY_SPRITE_KEYS.ITEM_MECHANISM_KEY;

export const LEVEL_06 = defineLevel({
  id: "level-06",
  name: "Memoria Em Movimento",
  order: 6,
  theme: "dash-memory-lab",
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
    id: "level-06-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
  },
  checkpoints: [
    {
      id: "level-06-before-memory-lock",
      position: {
        x: TILE_SIZE_PX * 30,
        y: FLOOR_Y,
      },
      area: {
        x: TILE_SIZE_PX * 29,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 3,
      },
    },
  ],
  terrain: [
    {
      id: "level-06-wall-left",
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
      id: "level-06-wall-right",
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
      id: "level-06-floor-start",
      kind: "solid",
      area: {
        x: 0,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 13,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-06-platform-key",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 16,
        y: TILE_SIZE_PX * 10,
        width: TILE_SIZE_PX * 5,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-06-floor-mid",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 24,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 16,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-06-floor-door",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 44,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 16,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-06-fall-key-route",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 13,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 11,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-06-fall-door-gap",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 40,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-06-fall-memory-floor",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 50,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 9,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
  ],
  traps: [
    {
      id: "level-06-door-gap-projectile",
      kind: "projectile",
      trigger: {
        kind: "area",
        area: {
          x: TILE_SIZE_PX * 34,
          y: FLOOR_Y - TILE_SIZE_PX * 3,
          width: TILE_SIZE_PX * 4,
          height: TILE_SIZE_PX * 3,
        },
      },
      area: {
        x: TILE_SIZE_PX * 43,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX / 2,
        height: TILE_SIZE_PX / 2,
      },
      resetOnRespawn: true,
      config: {
        velocityX: -160,
      },
    },
    {
      id: "level-06-final-false-floor",
      kind: "false-block",
      trigger: {
        kind: "area",
        area: {
          x: TILE_SIZE_PX * 51,
          y: FLOOR_Y - TILE_SIZE_PX * 3,
          width: TILE_SIZE_PX * 4,
          height: TILE_SIZE_PX * 3,
        },
      },
      area: {
        x: TILE_SIZE_PX * 53,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
    },
  ],
  items: [
    {
      id: "level-06-memory-key",
      kind: "key",
      position: {
        x: TILE_SIZE_PX * 18 + TILE_SIZE_PX / 2,
        y: TILE_SIZE_PX * 9,
      },
      hitbox: {
        x: TILE_SIZE_PX * 18,
        y: TILE_SIZE_PX * 9 - TILE_SIZE_PX / 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      persistsAfterDeath: false,
      activatesObjectId: "level-06-key-memory",
      assetId: MECHANISM_KEY_SPRITE_ID,
    },
  ],
  interactiveObjects: [
    {
      id: "level-06-exit-door",
      kind: "door",
      area: {
        x: TILE_SIZE_PX * 48,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-06-key-memory",
      kind: "mechanism",
      area: {
        x: TILE_SIZE_PX * 31,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 2,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-06-memory-lever",
      kind: "lever",
      area: {
        x: TILE_SIZE_PX * 37,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 2,
      },
      startsActive: false,
      resetOnRespawn: true,
      action: "secondary",
      targetObjectId: "level-06-exit-door",
    },
  ],
  audio: {
    sounds: [],
  },
  difficulty: 6,
  mainChallenge:
    "Combinar dash, chave, alavanca e memoria curta no ultimo corredor.",
  progressReward:
    "Fechar o segundo bloco provando que impulso, leitura e interacao convivem.",
  assets: {
    sprites: [MECHANISM_KEY_SPRITE_ID],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [],
  },
});
