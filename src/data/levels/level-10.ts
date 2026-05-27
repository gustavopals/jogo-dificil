import {
  GAMEPLAY_SPRITE_KEYS,
  PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
  PLACEHOLDER_TILESET_ASSET_KEYS,
} from "../art";
import { defineLevel } from "./schema";

const TILE_SIZE_PX = 16;
const BASE_HEIGHT_PX = 270;
const LEVEL_WIDTH_PX = TILE_SIZE_PX * 48;
const FLOOR_Y = BASE_HEIGHT_PX - TILE_SIZE_PX * 3;
const GIGA_FABIO_ARENA_X = TILE_SIZE_PX * 8;
const GIGA_FABIO_ARENA_Y = FLOOR_Y - TILE_SIZE_PX * 11;
const GIGA_FABIO_ARENA_WIDTH = TILE_SIZE_PX * 26;
const GIGA_FABIO_ARENA_HEIGHT = TILE_SIZE_PX * 12;
const GIGA_FABIO_SPAWN_X = GIGA_FABIO_ARENA_X + TILE_SIZE_PX * 13;
const GIGA_FABIO_SPAWN_Y = FLOOR_Y - 31;
const GIGA_FABIO_HEALTH = 4;
const GIGA_FABIO_RECOVER_MS = 950;
const SOLID_TILESET_ID = PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK;
const GIGA_FABIO_SPRITE_ID = GAMEPLAY_SPRITE_KEYS.BOSS_GIGA_FABIO;
const GIGA_FABIO_BOULDER_PROJECTILE_SPRITE_ID =
  GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_BOULDER;
const GIGA_FABIO_IMPACT_SPRITE_ID = GAMEPLAY_SPRITE_KEYS.BOSS_IMPACT_BURST;

export const LEVEL_10 = defineLevel({
  id: "level-10",
  name: "O Ultimo Nucleo",
  order: 10,
  theme: "giga-fabio-final-arena",
  initialEnergy: 100,
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
    id: "level-10-exit",
    area: {
      x: LEVEL_WIDTH_PX - TILE_SIZE_PX * 4,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
  },
  checkpoints: [
    {
      id: "level-10-before-giga-fabio",
      initialEnergy: 100,
      position: {
        x: TILE_SIZE_PX * 6,
        y: FLOOR_Y,
      },
      area: {
        x: TILE_SIZE_PX * 5,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 3,
      },
    },
  ],
  terrain: [
    {
      id: "level-10-wall-left",
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
      id: "level-10-wall-right",
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
      id: "level-10-approach-floor",
      kind: "solid",
      area: {
        x: 0,
        y: FLOOR_Y,
        width: GIGA_FABIO_ARENA_X,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-10-giga-fabio-arena-floor",
      kind: "solid",
      area: {
        x: GIGA_FABIO_ARENA_X,
        y: FLOOR_Y,
        width: GIGA_FABIO_ARENA_WIDTH,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-10-exit-floor",
      kind: "solid",
      area: {
        x: GIGA_FABIO_ARENA_X + GIGA_FABIO_ARENA_WIDTH,
        y: FLOOR_Y,
        width: LEVEL_WIDTH_PX - (GIGA_FABIO_ARENA_X + GIGA_FABIO_ARENA_WIDTH),
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-10-left-recharge-platform",
      kind: "solid",
      area: {
        x: GIGA_FABIO_ARENA_X + TILE_SIZE_PX * 4,
        y: FLOOR_Y - TILE_SIZE_PX * 5,
        width: TILE_SIZE_PX * 5,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-10-right-recharge-platform",
      kind: "solid",
      area: {
        x: GIGA_FABIO_ARENA_X + TILE_SIZE_PX * 19,
        y: FLOOR_Y - TILE_SIZE_PX * 5,
        width: TILE_SIZE_PX * 5,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [],
  traps: [],
  items: [],
  interactiveObjects: [
    {
      id: "level-10-giga-fabio-entry-door",
      kind: "door",
      area: {
        x: GIGA_FABIO_ARENA_X,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: true,
      resetOnRespawn: true,
    },
    {
      id: "level-10-giga-fabio-exit-door",
      kind: "door",
      area: {
        x: GIGA_FABIO_ARENA_X + GIGA_FABIO_ARENA_WIDTH - TILE_SIZE_PX * 2,
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
      id: "level-10-giga-fabio-weak-point",
      kind: "boss-hurtbox",
      area: {
        x: GIGA_FABIO_SPAWN_X - 11,
        y: FLOOR_Y - 44,
        width: 22,
        height: 20,
      },
      acceptedPowers: ["cyan-burst"],
      hitPoints: GIGA_FABIO_HEALTH,
      resetOnRespawn: true,
      hitGroupId: "boss-giga-fabio",
    },
  ],
  bosses: [
    {
      id: "boss-giga-fabio",
      levelId: "level-10",
      displayName: "Giga Fabio",
      arena: {
        x: GIGA_FABIO_ARENA_X,
        y: GIGA_FABIO_ARENA_Y,
        width: GIGA_FABIO_ARENA_WIDTH,
        height: GIGA_FABIO_ARENA_HEIGHT,
      },
      spawn: {
        x: GIGA_FABIO_SPAWN_X,
        y: GIGA_FABIO_SPAWN_Y,
      },
      initialFacing: "left",
      health: GIGA_FABIO_HEALTH,
      hitbox: {
        x: GIGA_FABIO_SPAWN_X - 23,
        y: FLOOR_Y - 62,
        width: 46,
        height: 62,
      },
      weakPoint: {
        x: GIGA_FABIO_SPAWN_X - 11,
        y: FLOOR_Y - 44,
        width: 22,
        height: 20,
      },
      resetOnRespawn: true,
      movement: {
        kind: "patrol",
        speedPxPerSecond: 38,
        anchors: [
          {
            x: GIGA_FABIO_ARENA_X + TILE_SIZE_PX * 9,
            y: GIGA_FABIO_SPAWN_Y,
          },
          {
            x: GIGA_FABIO_ARENA_X + TILE_SIZE_PX * 17,
            y: GIGA_FABIO_SPAWN_Y,
          },
        ],
      },
      attacks: [
        {
          id: "level-10-giga-fabio-floor-slam",
          kind: "floor-slam",
          windupMs: 800,
          activeMs: 320,
          recoverMs: GIGA_FABIO_RECOVER_MS,
          cooldownMs: 1100,
          contactDamage: 1,
          tellArea: {
            x: GIGA_FABIO_ARENA_X + TILE_SIZE_PX * 2,
            y: FLOOR_Y - TILE_SIZE_PX,
            width: GIGA_FABIO_ARENA_WIDTH - TILE_SIZE_PX * 4,
            height: TILE_SIZE_PX,
          },
          hitbox: {
            x: GIGA_FABIO_ARENA_X + TILE_SIZE_PX,
            y: FLOOR_Y - TILE_SIZE_PX,
            width: GIGA_FABIO_ARENA_WIDTH - TILE_SIZE_PX * 2,
            height: TILE_SIZE_PX,
          },
          opensVulnerabilityWindowId: "level-10-giga-fabio-recover",
        },
        {
          id: "level-10-giga-fabio-boulder-toss",
          kind: "boulder-toss",
          windupMs: 650,
          activeMs: 260,
          recoverMs: 700,
          cooldownMs: 1000,
          contactDamage: 0,
          tellArea: {
            x: GIGA_FABIO_ARENA_X + TILE_SIZE_PX * 2,
            y: FLOOR_Y - TILE_SIZE_PX * 5,
            width: GIGA_FABIO_ARENA_WIDTH - TILE_SIZE_PX * 4,
            height: TILE_SIZE_PX * 3,
          },
          projectile: {
            hitbox: {
              x: -12,
              y: -8,
              width: 24,
              height: 24,
            },
            velocity: {
              x: -104,
              y: 0,
            },
            maxActive: 1,
            maxRangePx: TILE_SIZE_PX * 22,
            isDestructibleBy: ["cyan-spark", "cyan-burst"],
          },
        },
        {
          id: "level-10-giga-fabio-shoulder-charge",
          kind: "shoulder-charge",
          windupMs: 700,
          activeMs: 360,
          recoverMs: GIGA_FABIO_RECOVER_MS,
          cooldownMs: 1200,
          contactDamage: 1,
          tellArea: {
            x: GIGA_FABIO_ARENA_X + TILE_SIZE_PX * 2,
            y: FLOOR_Y - TILE_SIZE_PX * 4,
            width: GIGA_FABIO_ARENA_WIDTH - TILE_SIZE_PX * 4,
            height: TILE_SIZE_PX * 3,
          },
          hitbox: {
            x: GIGA_FABIO_ARENA_X + TILE_SIZE_PX * 2,
            y: FLOOR_Y - TILE_SIZE_PX * 3,
            width: GIGA_FABIO_ARENA_WIDTH - TILE_SIZE_PX * 4,
            height: TILE_SIZE_PX * 3,
          },
          opensVulnerabilityWindowId: "level-10-giga-fabio-recover",
        },
      ],
      damageRules: [
        {
          power: "cyan-burst",
          damage: 1,
          validStates: ["recover"],
          requiresWeakPoint: true,
          oncePerAttack: true,
          consumesHit: true,
          effects: ["damage"],
        },
      ],
      vulnerabilityWindows: [
        {
          id: "level-10-giga-fabio-recover",
          state: "recover",
          durationMs: GIGA_FABIO_RECOVER_MS,
          weakPointActive: true,
          opensAfterAttackIds: [
            "level-10-giga-fabio-floor-slam",
            "level-10-giga-fabio-shoulder-charge",
          ],
        },
      ],
      entryCheckpointId: "level-10-before-giga-fabio",
      entryDoorId: "level-10-giga-fabio-entry-door",
      defeatUnlocks: ["level-10-giga-fabio-exit-door"],
      assetId: GIGA_FABIO_SPRITE_ID,
    },
  ],
  audio: {
    sounds: [],
  },
  difficulty: 10,
  mainChallenge:
    "Enfrentar Giga Fabio lendo floor-slam, boulder-toss e shoulder-charge, recarregando nas plataformas laterais e punindo o recover com Rajada Ciano.",
  progressReward:
    "Encerrar a campanha com uma luta final curta baseada em dash, recarga lateral e janela vulneravel clara.",
  assets: {
    sprites: [
      GIGA_FABIO_SPRITE_ID,
      GIGA_FABIO_BOULDER_PROJECTILE_SPRITE_ID,
      GIGA_FABIO_IMPACT_SPRITE_ID,
      GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_BURST_BEAM,
    ],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [],
  },
});
