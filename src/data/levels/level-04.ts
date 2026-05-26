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

export const LEVEL_04 = defineLevel({
  id: "level-04",
  name: "Impulso Medido",
  order: 4,
  theme: "dash-training-lab",
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
    id: "level-04-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
    nextLevelId: "level-05",
  },
  checkpoints: [
    {
      id: "level-04-after-first-dash",
      position: {
        x: TILE_SIZE_PX * 32,
        y: FLOOR_Y,
      },
      area: {
        x: TILE_SIZE_PX * 31,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 3,
      },
    },
  ],
  terrain: [
    {
      id: "level-04-wall-left",
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
      id: "level-04-wall-right",
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
      id: "level-04-floor-start",
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
      id: "level-04-floor-after-dash",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 22,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 16,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-04-floor-finish",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 45,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 15,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-04-dash-training-pit",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 12,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 10,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-04-dash-confirmation-pit",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 38,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 7,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
  ],
  traps: [],
  items: [
    {
      id: "level-04-dash-token",
      kind: "optional",
      position: {
        x: TILE_SIZE_PX * 17,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
      },
      hitbox: {
        x: TILE_SIZE_PX * 17 - TILE_SIZE_PX / 2,
        y: FLOOR_Y - TILE_SIZE_PX * 2.5,
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
  difficulty: 4,
  mainChallenge:
    "Ensinar dash horizontal com gaps largos, pouco ruido e margem clara.",
  progressReward:
    "Chegar ao checkpoint depois do primeiro dash e repetir a ideia sem surpresa nova.",
  assets: {
    sprites: [OPTIONAL_TOKEN_SPRITE_ID],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [],
  },
});
