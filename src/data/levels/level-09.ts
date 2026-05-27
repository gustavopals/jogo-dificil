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

export const LEVEL_09 = defineLevel({
  id: "level-09",
  name: "Carga Em Movimento",
  order: 9,
  theme: "cyan-energy-combo-lab",
  initialEnergy: 60,
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
    id: "level-09-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
  },
  checkpoints: [
    {
      id: "level-09-before-core",
      initialEnergy: 70,
      position: {
        x: TILE_SIZE_PX * 41,
        y: FLOOR_Y,
      },
      area: {
        x: TILE_SIZE_PX * 40,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 3,
      },
    },
  ],
  terrain: [
    {
      id: "level-09-wall-left",
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
      id: "level-09-wall-right",
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
      id: "level-09-floor-start",
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
      id: "level-09-floor-relay",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 20,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 18,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-09-floor-core",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 40,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 8,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-09-floor-exit",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 51,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 9,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-09-dash-opening-fall",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 12,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 8,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-09-core-window-fall",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 48,
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
      id: "level-09-relay-door",
      kind: "door",
      area: {
        x: TILE_SIZE_PX * 34,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-09-core-door",
      kind: "door",
      area: {
        x: TILE_SIZE_PX * 47,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-09-exit-door",
      kind: "door",
      area: {
        x: TILE_SIZE_PX * 55,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-09-final-lever",
      kind: "lever",
      area: {
        x: TILE_SIZE_PX * 53,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 2,
      },
      startsActive: false,
      resetOnRespawn: true,
      action: "secondary",
      targetObjectId: "level-09-exit-door",
    },
  ],
  energyTargets: [
    {
      id: "level-09-spark-relay",
      kind: "energy-relay",
      area: {
        x: TILE_SIZE_PX * 26,
        y: FLOOR_Y - (TILE_SIZE_PX * 3) / 2,
        width: TILE_SIZE_PX,
        height: (TILE_SIZE_PX * 3) / 2,
      },
      acceptedPowers: ["cyan-spark"],
      hitPoints: 3,
      resetOnRespawn: true,
      activatesObjectId: "level-09-relay-door",
      relayWindowMs: 900,
    },
    {
      id: "level-09-temporary-core",
      kind: "energy-core",
      area: {
        x: TILE_SIZE_PX * 44,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      acceptedPowers: ["cyan-burst"],
      hitPoints: 2,
      resetOnRespawn: true,
      activatesObjectId: "level-09-core-door",
      activationDurationMs: 2400,
    },
  ],
  audio: {
    sounds: [],
  },
  difficulty: 9,
  mainChallenge:
    "Combinar dash, sequencia de Centelha Ciano, carga para Rajada Ciano e alavanca final.",
  progressReward:
    "Fechar o Bloco 3 provando que movimento, tiros, especial e interacao usam prioridades claras.",
  assets: {
    sprites: [
      GAMEPLAY_SPRITE_KEYS.ENERGY_TARGET_ACTIVE,
      GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_SPARK_PROJECTILE,
      GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_BURST_BEAM,
    ],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [],
  },
});
