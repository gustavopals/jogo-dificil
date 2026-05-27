import {
  GAMEPLAY_SPRITE_KEYS,
  PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
  PLACEHOLDER_TILESET_ASSET_KEYS,
} from "../art";
import { defineLevel } from "./schema";

const TILE_SIZE_PX = 16;
const BASE_WIDTH_PX = 480;
const BASE_HEIGHT_PX = 270;
const LEVEL_WIDTH_PX = BASE_WIDTH_PX * 3;
const FLOOR_Y = BASE_HEIGHT_PX - TILE_SIZE_PX * 3;
const HIROLITO_ARENA_X = TILE_SIZE_PX * 66;
const HIROLITO_ARENA_WIDTH = TILE_SIZE_PX * 20;
const SOLID_TILESET_ID = PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK;
const OPTIONAL_TOKEN_SPRITE_ID = GAMEPLAY_SPRITE_KEYS.ITEM_OPTIONAL_TOKEN;
const HIROLITO_SPRITE_ID = GAMEPLAY_SPRITE_KEYS.BOSS_HIROLITO_NARGUILITO;
const HIROLITO_SMOKE_PROJECTILE_SPRITE_ID =
  GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_SMOKE_PUFF;
const HIROLITO_PATROL_SPEED_PX_PER_SECOND = 28;
const HIROLITO_RECOVER_MS = 1200;
const HIROLITO_ATTACK_COOLDOWN_MS = 1500;
const TOKEN_SFX_ID = "sfx-level-03-token";
const FALSE_FLOOR_SFX_ID = "sfx-level-03-false-floor";

export const LEVEL_03 = defineLevel({
  id: "level-03",
  name: "Quase Seguro",
  order: 3,
  theme: "memory-lab",
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
    id: "level-03-exit",
    area: {
      x: HIROLITO_ARENA_X + HIROLITO_ARENA_WIDTH - TILE_SIZE_PX,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
    nextLevelId: "level-04",
  },
  checkpoints: [
    {
      id: "level-03-before-cruel",
      position: {
        x: TILE_SIZE_PX * 34,
        y: FLOOR_Y,
      },
      area: {
        x: TILE_SIZE_PX * 33,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 3,
      },
    },
    {
      id: "level-03-before-hirolito",
      initialEnergy: 60,
      position: {
        x: TILE_SIZE_PX * 61,
        y: FLOOR_Y,
      },
      area: {
        x: TILE_SIZE_PX * 60,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 3,
      },
    },
  ],
  terrain: [
    {
      id: "level-03-wall-left",
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
      id: "level-03-wall-right",
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
      id: "level-03-floor-start",
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
      id: "level-03-floor-checkpoint",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 32,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 9,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-platform-precision-01",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 15,
        y: TILE_SIZE_PX * 11,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-platform-precision-02",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 21,
        y: TILE_SIZE_PX * 9,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-platform-precision-03",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 27,
        y: TILE_SIZE_PX * 11,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-platform-cruel-setup",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 43,
        y: TILE_SIZE_PX * 10,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-cruel-exit-platform",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 50,
        y: TILE_SIZE_PX * 12,
        width: TILE_SIZE_PX * 8,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-hirolito-approach-floor",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 58,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 8,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-hirolito-arena-floor",
      kind: "solid",
      area: {
        x: HIROLITO_ARENA_X,
        y: FLOOR_Y,
        width: HIROLITO_ARENA_WIDTH,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-03-hirolito-low-platform",
      kind: "solid",
      area: {
        x: HIROLITO_ARENA_X + TILE_SIZE_PX * 8,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-03-fall-sequence",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 12,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 20,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-03-fall-cruel-exit",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 40,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 26,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
  ],
  traps: [
    {
      id: "level-03-false-floor",
      kind: "false-block",
      trigger: {
        kind: "touch",
        area: {
          x: TILE_SIZE_PX * 52,
          y: TILE_SIZE_PX * 11,
          width: TILE_SIZE_PX * 3,
          height: TILE_SIZE_PX * 2,
        },
      },
      area: {
        x: TILE_SIZE_PX * 52,
        y: TILE_SIZE_PX * 12,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
    },
    {
      id: "level-03-breakable-platform",
      kind: "breakable-floor",
      trigger: {
        kind: "touch",
        area: {
          x: TILE_SIZE_PX * 21,
          y: TILE_SIZE_PX * 8,
          width: TILE_SIZE_PX * 3,
          height: TILE_SIZE_PX * 2,
        },
      },
      area: {
        x: TILE_SIZE_PX * 21,
        y: TILE_SIZE_PX * 9,
        width: TILE_SIZE_PX * 3,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
    },
  ],
  items: [
    {
      id: "level-03-risk-token",
      kind: "optional",
      position: {
        x: TILE_SIZE_PX * 22 + TILE_SIZE_PX / 2,
        y: TILE_SIZE_PX * 7,
      },
      hitbox: {
        x: TILE_SIZE_PX * 22,
        y: TILE_SIZE_PX * 7 - 8,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      persistsAfterDeath: true,
      assetId: OPTIONAL_TOKEN_SPRITE_ID,
    },
  ],
  interactiveObjects: [
    {
      id: "level-03-hirolito-entry-door",
      kind: "door",
      area: {
        x: HIROLITO_ARENA_X,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: true,
      resetOnRespawn: true,
    },
    {
      id: "level-03-hirolito-exit-door",
      kind: "door",
      area: {
        x: HIROLITO_ARENA_X + HIROLITO_ARENA_WIDTH - TILE_SIZE_PX * 2,
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
      id: "level-03-hirolito-crystal",
      kind: "boss-hurtbox",
      area: {
        x: HIROLITO_ARENA_X + TILE_SIZE_PX * 14 + 10,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: 14,
        height: 14,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 2,
      resetOnRespawn: true,
      hitGroupId: "boss-hirolito-narguilito",
    },
  ],
  bosses: [
    {
      id: "boss-hirolito-narguilito",
      levelId: "level-03",
      displayName: "Hirolito Narguilito",
      arena: {
        x: HIROLITO_ARENA_X,
        y: FLOOR_Y - TILE_SIZE_PX * 10,
        width: HIROLITO_ARENA_WIDTH,
        height: TILE_SIZE_PX * 11,
      },
      spawn: {
        x: HIROLITO_ARENA_X + TILE_SIZE_PX * 15,
        y: FLOOR_Y - 24,
      },
      initialFacing: "left",
      health: 2,
      hitbox: {
        x: HIROLITO_ARENA_X + TILE_SIZE_PX * 14,
        y: FLOOR_Y - 42,
        width: 34,
        height: 42,
      },
      weakPoint: {
        x: HIROLITO_ARENA_X + TILE_SIZE_PX * 14 + 10,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: 14,
        height: 14,
      },
      resetOnRespawn: true,
      movement: {
        kind: "patrol",
        speedPxPerSecond: HIROLITO_PATROL_SPEED_PX_PER_SECOND,
        anchors: [
          {
            x: HIROLITO_ARENA_X + TILE_SIZE_PX * 12,
            y: FLOOR_Y - 24,
          },
          {
            x: HIROLITO_ARENA_X + TILE_SIZE_PX * 16,
            y: FLOOR_Y - 24,
          },
        ],
      },
      attacks: [
        {
          id: "level-03-hirolito-smoke-puff",
          kind: "smoke-puff",
          windupMs: 550,
          activeMs: 620,
          recoverMs: HIROLITO_RECOVER_MS,
          cooldownMs: HIROLITO_ATTACK_COOLDOWN_MS,
          contactDamage: 0,
          tellArea: {
            x: HIROLITO_ARENA_X + TILE_SIZE_PX * 4,
            y: FLOOR_Y - 28,
            width: TILE_SIZE_PX * 11,
            height: 18,
          },
          projectile: {
            hitbox: {
              x: -8,
              y: -8,
              width: 16,
              height: 16,
            },
            velocity: {
              x: -58,
              y: 0,
            },
            maxActive: 1,
            maxRangePx: TILE_SIZE_PX * 14,
            isDestructibleBy: ["cyan-spark"],
          },
          opensVulnerabilityWindowId: "level-03-hirolito-recover",
        },
        {
          id: "level-03-hirolito-hose-snap",
          kind: "hose-snap",
          windupMs: 550,
          activeMs: 280,
          recoverMs: HIROLITO_RECOVER_MS,
          cooldownMs: HIROLITO_ATTACK_COOLDOWN_MS,
          contactDamage: 1,
          tellArea: {
            x: HIROLITO_ARENA_X + TILE_SIZE_PX * 3,
            y: FLOOR_Y - 20,
            width: TILE_SIZE_PX * 10,
            height: 18,
          },
          hitbox: {
            x: HIROLITO_ARENA_X + TILE_SIZE_PX * 3,
            y: FLOOR_Y - 20,
            width: TILE_SIZE_PX * 10,
            height: 18,
          },
          opensVulnerabilityWindowId: "level-03-hirolito-recover",
        },
      ],
      damageRules: [
        {
          power: "cyan-spark",
          damage: 1,
          validStates: ["recover"],
          requiresWeakPoint: true,
          oncePerAttack: false,
          consumesHit: true,
          effects: ["damage"],
        },
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
          id: "level-03-hirolito-recover",
          state: "recover",
          durationMs: HIROLITO_RECOVER_MS,
          weakPointActive: true,
          opensAfterAttackIds: [
            "level-03-hirolito-smoke-puff",
            "level-03-hirolito-hose-snap",
          ],
        },
      ],
      entryCheckpointId: "level-03-before-hirolito",
      entryDoorId: "level-03-hirolito-entry-door",
      defeatUnlocks: ["level-03-hirolito-exit-door"],
      assetId: HIROLITO_SPRITE_ID,
    },
  ],
  audio: {
    sounds: [
      {
        id: "level-03-token-sfx",
        category: "sfx",
        assetKey: TOKEN_SFX_ID,
        path: "assets/audio/sfx/level-03-token.ogg",
        volume: 0.55,
        loop: false,
      },
      {
        id: "level-03-false-floor-sfx",
        category: "sfx",
        assetKey: FALSE_FLOOR_SFX_ID,
        path: "assets/audio/sfx/level-03-false-floor.ogg",
        volume: 0.7,
        loop: false,
      },
    ],
  },
  difficulty: 3,
  mainChallenge: "Combinar precisao, memoria curta e desconfianca da saida.",
  progressReward: "Fechar o bloco inicial com uma armadilha memoravel.",
  assets: {
    sprites: [
      OPTIONAL_TOKEN_SPRITE_ID,
      HIROLITO_SPRITE_ID,
      HIROLITO_SMOKE_PROJECTILE_SPRITE_ID,
    ],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [TOKEN_SFX_ID, FALSE_FLOOR_SFX_ID],
  },
});
