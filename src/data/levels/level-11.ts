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
const ENERGY_TARGET_SPRITE_ID = GAMEPLAY_SPRITE_KEYS.ENERGY_TARGET_ACTIVE;
const TRAP_SPIKES_SPRITE_ID = GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES;

export const LEVEL_11 = defineLevel({
  id: "level-11",
  name: "Circuito Relampago",
  order: 11,
  theme: "post-campaign-challenge",
  contentKind: "challenge",
  initialEnergy: 35,
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
    id: "level-11-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
  },
  checkpoints: [
    {
      id: "level-11-after-dash",
      initialEnergy: 20,
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
      id: "level-11-wall-left",
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
      id: "level-11-wall-right",
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
      id: "level-11-floor-start",
      kind: "solid",
      area: {
        x: 0,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 14,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-11-floor-mid",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 22,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 20,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-11-floor-exit",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 46,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 14,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-11-dash-pit",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 14,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 8,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-11-exit-pit",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 42,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
  ],
  traps: [
    {
      id: "level-11-landing-spike-pop",
      kind: "spike-pop",
      trigger: {
        kind: "area",
        area: {
          x: TILE_SIZE_PX * 33,
          y: FLOOR_Y - TILE_SIZE_PX * 3,
          width: TILE_SIZE_PX * 4,
          height: TILE_SIZE_PX * 3,
        },
      },
      area: {
        x: TILE_SIZE_PX * 35,
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
      id: "level-11-risk-token",
      kind: "optional",
      position: {
        x: TILE_SIZE_PX * 18,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
      },
      hitbox: {
        x: TILE_SIZE_PX * 18 - TILE_SIZE_PX / 2,
        y: FLOOR_Y - TILE_SIZE_PX * 2.5,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      persistsAfterDeath: true,
      assetId: OPTIONAL_TOKEN_SPRITE_ID,
    },
  ],
  interactiveObjects: [
    {
      id: "level-11-gate-door",
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
      id: "level-11-gate-switch",
      kind: "energy-switch",
      area: {
        x: TILE_SIZE_PX * 37,
        y: FLOOR_Y - (TILE_SIZE_PX * 3) / 2,
        width: TILE_SIZE_PX,
        height: (TILE_SIZE_PX * 3) / 2,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      activatesObjectId: "level-11-gate-door",
    },
  ],
  audio: {
    sounds: [],
  },
  difficulty: 11,
  mainChallenge:
    "Combinar dash preciso, spike-pop pos-checkpoint e uma porta ciano em sequencia curta.",
  progressReward:
    "Fechar o primeiro segmento pos-campanha sem reabrir a base de escala HD.",
  assets: {
    sprites: [
      OPTIONAL_TOKEN_SPRITE_ID,
      ENERGY_TARGET_SPRITE_ID,
      TRAP_SPIKES_SPRITE_ID,
    ],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [],
  },
});
