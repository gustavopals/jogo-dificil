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

export const LEVEL_07 = defineLevel({
  id: "level-07",
  name: "Faisca De Treino",
  order: 7,
  theme: "cyan-energy-training-lab",
  initialEnergy: 20,
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
    id: "level-07-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
    nextLevelId: "level-08",
  },
  checkpoints: [
    {
      id: "level-07-recharge-checkpoint",
      initialEnergy: 0,
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
      id: "level-07-wall-left",
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
      id: "level-07-wall-right",
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
      id: "level-07-floor-training",
      kind: "solid",
      area: {
        x: 0,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 44,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-07-floor-exit",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 47,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 13,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-07-final-hop-fall",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 44,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
  ],
  traps: [],
  items: [],
  interactiveObjects: [
    {
      id: "level-07-training-door",
      kind: "door",
      area: {
        x: TILE_SIZE_PX * 15,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-07-second-door",
      kind: "door",
      area: {
        x: TILE_SIZE_PX * 27,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-07-exit-door",
      kind: "door",
      area: {
        x: TILE_SIZE_PX * 40,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
  ],
  energyTargets: [
    {
      id: "level-07-first-spark-switch",
      kind: "energy-switch",
      area: {
        x: TILE_SIZE_PX * 11,
        y: FLOOR_Y - (TILE_SIZE_PX * 3) / 2,
        width: TILE_SIZE_PX,
        height: (TILE_SIZE_PX * 3) / 2,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      activatesObjectId: "level-07-training-door",
    },
    {
      id: "level-07-second-spark-switch",
      kind: "energy-switch",
      area: {
        x: TILE_SIZE_PX * 22,
        y: FLOOR_Y - (TILE_SIZE_PX * 3) / 2,
        width: TILE_SIZE_PX,
        height: (TILE_SIZE_PX * 3) / 2,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      activatesObjectId: "level-07-second-door",
    },
    {
      id: "level-07-recharge-switch",
      kind: "energy-switch",
      area: {
        x: TILE_SIZE_PX * 35,
        y: FLOOR_Y - (TILE_SIZE_PX * 3) / 2,
        width: TILE_SIZE_PX,
        height: (TILE_SIZE_PX * 3) / 2,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      activatesObjectId: "level-07-exit-door",
    },
  ],
  audio: {
    sounds: [],
  },
  difficulty: 7,
  mainChallenge:
    "Ensinar Centelha Ciano em tres alvos seguros, forçando recarga antes da saida.",
  progressReward:
    "Aprender que dois tiros resolvem alvos leves, mas o ritmo pede Carga Ciano no chao.",
  assets: {
    sprites: [
      GAMEPLAY_SPRITE_KEYS.ENERGY_TARGET_ACTIVE,
      GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_SPARK_PROJECTILE,
    ],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [],
  },
});
