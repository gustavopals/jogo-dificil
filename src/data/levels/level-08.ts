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

export const LEVEL_08 = defineLevel({
  id: "level-08",
  name: "O Alvo Mente",
  order: 8,
  theme: "cyan-energy-trick-lab",
  initialEnergy: 40,
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
    id: "level-08-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
    nextLevelId: "level-09",
  },
  checkpoints: [
    {
      id: "level-08-before-cracked-block",
      initialEnergy: 40,
      position: {
        x: TILE_SIZE_PX * 33,
        y: FLOOR_Y,
      },
      area: {
        x: TILE_SIZE_PX * 32,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 3,
      },
    },
  ],
  terrain: [
    {
      id: "level-08-wall-left",
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
      id: "level-08-wall-right",
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
      id: "level-08-floor-fake-target",
      kind: "solid",
      area: {
        x: 0,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 29,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-08-floor-charge",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 31,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 13,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-08-floor-exit",
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
      id: "level-08-before-charge-fall",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 29,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-08-after-cracked-block-fall",
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
  traps: [
    {
      id: "level-08-reader-spike-pop",
      kind: "spike-pop",
      trigger: {
        kind: "area",
        area: {
          x: TILE_SIZE_PX * 14,
          y: FLOOR_Y - TILE_SIZE_PX * 3,
          width: TILE_SIZE_PX * 4,
          height: TILE_SIZE_PX * 3,
        },
      },
      area: {
        x: TILE_SIZE_PX * 17,
        y: FLOOR_Y - TILE_SIZE_PX,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
      config: {
        delayMs: 110,
      },
    },
  ],
  items: [],
  interactiveObjects: [
    {
      id: "level-08-switch-door",
      kind: "door",
      area: {
        x: TILE_SIZE_PX * 25,
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
      id: "level-08-fake-absorber",
      kind: "energy-absorber",
      area: {
        x: TILE_SIZE_PX * 10,
        y: FLOOR_Y - (TILE_SIZE_PX * 3) / 2,
        width: TILE_SIZE_PX,
        height: (TILE_SIZE_PX * 3) / 2,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      absorbsEnergy: true,
    },
    {
      id: "level-08-truth-switch",
      kind: "energy-switch",
      area: {
        x: TILE_SIZE_PX * 20,
        y: FLOOR_Y - (TILE_SIZE_PX * 3) / 2,
        width: TILE_SIZE_PX,
        height: (TILE_SIZE_PX * 3) / 2,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      activatesObjectId: "level-08-switch-door",
    },
    {
      id: "level-08-cracked-block",
      kind: "energy-cracked-block",
      area: {
        x: TILE_SIZE_PX * 43,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      acceptedPowers: ["cyan-burst"],
      hitPoints: 2,
      resetOnRespawn: true,
      startsBroken: false,
      blocksMovement: true,
    },
  ],
  audio: {
    sounds: [],
  },
  difficulty: 8,
  mainChallenge:
    "Distorcer a leitura dos alvos de energia com absorvedor falso, spike-pop conhecido e bloco rachado.",
  progressReward:
    "Aprender que nem todo alvo recompensa tiro simples e que bloco rachado pede Rajada Ciano carregada.",
  assets: {
    sprites: [
      GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES,
      GAMEPLAY_SPRITE_KEYS.ENERGY_TARGET_ACTIVE,
      GAMEPLAY_SPRITE_KEYS.ENERGY_CRACKED_BLOCK_BROKEN,
      GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_SPARK_PROJECTILE,
      GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_BURST_BEAM,
    ],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [],
  },
});
