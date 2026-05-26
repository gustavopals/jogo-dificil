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
const OPTIONAL_TOKEN_SPRITE_ID = GAMEPLAY_SPRITE_KEYS.ITEM_OPTIONAL_TOKEN;

export const LEVEL_05 = defineLevel({
  id: "level-05",
  name: "O Impulso Mente",
  order: 5,
  theme: "dash-trick-lab",
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
    id: "level-05-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
    nextLevelId: "level-06",
  },
  checkpoints: [
    {
      id: "level-05-before-trap-dash",
      position: {
        x: TILE_SIZE_PX * 31,
        y: FLOOR_Y,
      },
      area: {
        x: TILE_SIZE_PX * 30,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 3,
      },
    },
  ],
  terrain: [
    {
      id: "level-05-wall-left",
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
      id: "level-05-wall-right",
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
      id: "level-05-floor-start",
      kind: "solid",
      area: {
        x: 0,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 15,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-05-platform-doubt",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 18,
        y: TILE_SIZE_PX * 10,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-05-floor-mid",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 28,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 12,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-05-platform-exit-bait",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 43,
        y: TILE_SIZE_PX * 12,
        width: TILE_SIZE_PX * 5,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-05-floor-end",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 50,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 10,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-05-fall-doubt",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 15,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 13,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-05-fall-exit",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 40,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 10,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
  ],
  traps: [
    {
      id: "level-05-falling-platform-doubt",
      kind: "falling-platform",
      trigger: {
        kind: "touch",
        area: {
          x: TILE_SIZE_PX * 18,
          y: TILE_SIZE_PX * 9,
          width: TILE_SIZE_PX * 4,
          height: TILE_SIZE_PX * 2,
        },
      },
      area: {
        x: TILE_SIZE_PX * 18,
        y: TILE_SIZE_PX * 10,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
      config: {
        fallDelayMs: 180,
      },
    },
    {
      id: "level-05-counter-projectile",
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
        x: TILE_SIZE_PX * 49,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX / 2,
        height: TILE_SIZE_PX / 2,
      },
      resetOnRespawn: true,
      config: {
        velocityX: -170,
      },
    },
    {
      id: "level-05-landing-spike-pop",
      kind: "spike-pop",
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
        x: TILE_SIZE_PX * 54,
        y: FLOOR_Y - TILE_SIZE_PX,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
      config: {
        delayMs: 90,
      },
    },
  ],
  items: [
    {
      id: "level-05-risk-token",
      kind: "optional",
      position: {
        x: TILE_SIZE_PX * 20 + TILE_SIZE_PX / 2,
        y: TILE_SIZE_PX * 8,
      },
      hitbox: {
        x: TILE_SIZE_PX * 20,
        y: TILE_SIZE_PX * 8 - TILE_SIZE_PX / 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      persistsAfterDeath: true,
      assetId: OPTIONAL_TOKEN_SPRITE_ID,
    },
  ],
  interactiveObjects: [],
  audio: {
    sounds: [],
  },
  difficulty: 5,
  mainChallenge:
    "Distorcer o dash com plataforma que cai, projetil contra o impulso e pouso falso.",
  progressReward:
    "Aprender que dash resolve distancia, mas nao substitui leitura de trap.",
  assets: {
    sprites: [OPTIONAL_TOKEN_SPRITE_ID],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [],
  },
});
