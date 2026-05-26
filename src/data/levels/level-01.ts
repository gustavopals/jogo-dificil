import { defineLevel } from "./schema";

const TILE_SIZE_PX = 16;
const BASE_WIDTH_PX = 480;
const BASE_HEIGHT_PX = 270;
const LEVEL_WIDTH_PX = BASE_WIDTH_PX * 2;
const FLOOR_Y = BASE_HEIGHT_PX - TILE_SIZE_PX * 3;
const SOLID_TILESET_ID = "tileset-prototype-solid";
const REQUIRED_CHIP_SPRITE_ID = "sprite-required-chip";
const CHECKPOINT_SFX_ID = "sfx-level-01-checkpoint";
const TRAP_POP_SFX_ID = "sfx-level-01-trap-pop";

export const LEVEL_01 = defineLevel({
  id: "level-01",
  name: "Entrada Cruel",
  order: 1,
  theme: "warning-lab",
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
    id: "level-01-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
    nextLevelId: "level-02",
  },
  checkpoints: [
    {
      id: "level-01-mid",
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
      id: "level-01-wall-left",
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
      id: "level-01-wall-right",
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
      id: "level-01-floor-start",
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
      id: "level-01-floor-after-first-gap",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 15,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 11,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-01-floor-checkpoint",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 29,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 10,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-01-floor-finish",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 42,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 17,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-01-fixed-spikes",
      kind: "spikes",
      area: {
        x: TILE_SIZE_PX * 18,
        y: FLOOR_Y - TILE_SIZE_PX / 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX / 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-01-pit-first",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 13,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-01-pit-after-surprise",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 26,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-01-pit-final",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 39,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
  ],
  traps: [
    {
      id: "level-01-spike-pop",
      kind: "spike-pop",
      trigger: {
        kind: "area",
        area: {
          x: TILE_SIZE_PX * 21,
          y: FLOOR_Y - TILE_SIZE_PX * 3,
          width: TILE_SIZE_PX * 3,
          height: TILE_SIZE_PX * 3,
        },
      },
      area: {
        x: TILE_SIZE_PX * 23,
        y: FLOOR_Y - TILE_SIZE_PX,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
      config: {
        delayMs: 120,
      },
    },
  ],
  items: [
    {
      id: "level-01-required-chip",
      kind: "required",
      position: {
        x: TILE_SIZE_PX * 8,
        y: FLOOR_Y - TILE_SIZE_PX,
      },
      hitbox: {
        x: TILE_SIZE_PX * 8 - TILE_SIZE_PX / 2,
        y: FLOOR_Y - TILE_SIZE_PX * 1.5,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      persistsAfterDeath: false,
      assetId: REQUIRED_CHIP_SPRITE_ID,
    },
  ],
  interactiveObjects: [],
  audio: {
    sounds: [
      {
        id: "level-01-checkpoint-sfx",
        category: "sfx",
        assetKey: CHECKPOINT_SFX_ID,
        path: "assets/audio/sfx/level-01-checkpoint.ogg",
        volume: 0.65,
        loop: false,
      },
      {
        id: "level-01-trap-pop-sfx",
        category: "sfx",
        assetKey: TRAP_POP_SFX_ID,
        path: "assets/audio/sfx/level-01-trap-pop.ogg",
        volume: 0.7,
        loop: false,
      },
    ],
  },
  difficulty: 1,
  mainChallenge: "Ensinar andar, pular, colisao e primeira surpresa simples.",
  progressReward:
    "Chegar ao primeiro checkpoint e entender o ritmo de tentativa.",
  assets: {
    sprites: [REQUIRED_CHIP_SPRITE_ID],
    tilesets: [SOLID_TILESET_ID],
    audio: [CHECKPOINT_SFX_ID, TRAP_POP_SFX_ID],
  },
});
