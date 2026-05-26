import { defineLevel } from "./schema";

const TILE_SIZE_PX = 16;
const BASE_WIDTH_PX = 480;
const BASE_HEIGHT_PX = 270;
const LEVEL_WIDTH_PX = BASE_WIDTH_PX * 2;
const FLOOR_Y = BASE_HEIGHT_PX - TILE_SIZE_PX * 3;
const SOLID_TILESET_ID = "tileset-prototype-solid";
const MECHANISM_KEY_SPRITE_ID = "sprite-mechanism-key";
const LEVER_SFX_ID = "sfx-level-02-lever";
const PROJECTILE_SFX_ID = "sfx-level-02-projectile";

export const LEVEL_02 = defineLevel({
  id: "level-02",
  name: "O Caminho Nao Confia Em Voce",
  order: 2,
  theme: "timing-lab",
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
    id: "level-02-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: FLOOR_Y - TILE_SIZE_PX * 4,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 4,
    },
    nextLevelId: "level-03",
  },
  checkpoints: [
    {
      id: "level-02-mid",
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
      id: "level-02-wall-left",
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
      id: "level-02-wall-right",
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
      id: "level-02-floor-start",
      kind: "solid",
      area: {
        x: 0,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 21,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-02-floor-mid",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 26,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 17,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-02-floor-end",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 48,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 12,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-02-step-timing",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 15,
        y: TILE_SIZE_PX * 10,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-02-platform-exit",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 51,
        y: TILE_SIZE_PX * 9,
        width: TILE_SIZE_PX * 5,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-02-fall-gap",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 21,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 5,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-02-fall-exit-gap",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 43,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 5,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
  ],
  traps: [
    {
      id: "level-02-falling-platform",
      kind: "falling-platform",
      trigger: {
        kind: "touch",
        area: {
          x: TILE_SIZE_PX * 15,
          y: TILE_SIZE_PX * 9,
          width: TILE_SIZE_PX * 4,
          height: TILE_SIZE_PX * 2,
        },
      },
      area: {
        x: TILE_SIZE_PX * 15,
        y: TILE_SIZE_PX * 10,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
      config: {
        fallDelayMs: 220,
      },
    },
    {
      id: "level-02-side-projectile",
      kind: "projectile",
      trigger: {
        kind: "area",
        area: {
          x: TILE_SIZE_PX * 38,
          y: FLOOR_Y - TILE_SIZE_PX * 3,
          width: TILE_SIZE_PX * 3,
          height: TILE_SIZE_PX * 3,
        },
      },
      area: {
        x: TILE_SIZE_PX * 46,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX / 2,
        height: TILE_SIZE_PX / 2,
      },
      resetOnRespawn: true,
      config: {
        velocityX: -150,
      },
    },
  ],
  items: [
    {
      id: "level-02-mechanism-key",
      kind: "key",
      position: {
        x: TILE_SIZE_PX * 33,
        y: FLOOR_Y - TILE_SIZE_PX,
      },
      hitbox: {
        x: TILE_SIZE_PX * 33 - TILE_SIZE_PX / 2,
        y: FLOOR_Y - TILE_SIZE_PX * 1.5,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      persistsAfterDeath: false,
      activatesObjectId: "level-02-key-mechanism",
      assetId: MECHANISM_KEY_SPRITE_ID,
    },
  ],
  interactiveObjects: [
    {
      id: "level-02-exit-door",
      kind: "door",
      area: {
        x: TILE_SIZE_PX * 49,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-02-key-mechanism",
      kind: "mechanism",
      area: {
        x: TILE_SIZE_PX * 35,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 2,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-02-lever-exit",
      kind: "lever",
      area: {
        x: TILE_SIZE_PX * 34,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 2,
      },
      startsActive: false,
      resetOnRespawn: true,
      action: "secondary",
      targetObjectId: "level-02-exit-door",
    },
  ],
  audio: {
    sounds: [
      {
        id: "level-02-lever-sfx",
        category: "sfx",
        assetKey: LEVER_SFX_ID,
        path: "assets/audio/sfx/level-02-lever.ogg",
        volume: 0.65,
        loop: false,
      },
      {
        id: "level-02-projectile-sfx",
        category: "sfx",
        assetKey: PROJECTILE_SFX_ID,
        path: "assets/audio/sfx/level-02-projectile.ogg",
        volume: 0.7,
        loop: false,
      },
    ],
  },
  difficulty: 2,
  mainChallenge: "Introduzir timing, interacao secundaria e ameaca de saida.",
  progressReward:
    "Abrir a porta final apos dominar a plataforma ativa e ler a pegadinha.",
  assets: {
    sprites: [MECHANISM_KEY_SPRITE_ID],
    tilesets: [SOLID_TILESET_ID],
    audio: [LEVER_SFX_ID, PROJECTILE_SFX_ID],
  },
});
