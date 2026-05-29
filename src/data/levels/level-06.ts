import {
  GAMEPLAY_SPRITE_KEYS,
  PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
  PLACEHOLDER_TILESET_ASSET_KEYS,
} from "../art";
import { BOSS_SPRITESHEET_KEYS } from "../characters/boss-spritesheet-registry";
import { defineLevel } from "./schema";

const TILE_SIZE_PX = 16;
const BASE_WIDTH_PX = 480;
const BASE_HEIGHT_PX = 270;
const LEVEL_WIDTH_PX = BASE_WIDTH_PX * 3;
const FLOOR_Y = BASE_HEIGHT_PX - TILE_SIZE_PX * 3;
const DR_IMPORTS_ARENA_X = TILE_SIZE_PX * 66;
const DR_IMPORTS_ARENA_WIDTH = TILE_SIZE_PX * 22;
const DR_IMPORTS_HEALTH = 3;
const DR_IMPORTS_MAX_ACTIVE_PROJECTILES = 2;
const DR_IMPORTS_SPRITE_ID = BOSS_SPRITESHEET_KEYS.DR_IMPORTS_512;
const DR_IMPORTS_BOTTLE_PROJECTILE_SPRITE_ID =
  GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_IMPORT_BOTTLE;
const SOLID_TILESET_ID = PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK;
const MECHANISM_KEY_SPRITE_ID = GAMEPLAY_SPRITE_KEYS.ITEM_MECHANISM_KEY;

export const LEVEL_06 = defineLevel({
  id: "level-06",
  name: "Memoria Em Movimento",
  order: 6,
  theme: "dash-memory-lab",
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
    id: "level-06-exit",
    area: {
      x: DR_IMPORTS_ARENA_X + DR_IMPORTS_ARENA_WIDTH - TILE_SIZE_PX,
      y: FLOOR_Y - TILE_SIZE_PX * 3,
      width: TILE_SIZE_PX,
      height: TILE_SIZE_PX * 3,
    },
    nextLevelId: "level-07",
  },
  checkpoints: [
    {
      id: "level-06-before-memory-lock",
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
    {
      id: "level-06-before-dr-imports",
      initialEnergy: 80,
      position: {
        x: TILE_SIZE_PX * 62,
        y: FLOOR_Y,
      },
      area: {
        x: TILE_SIZE_PX * 61,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX * 3,
      },
    },
  ],
  terrain: [
    {
      id: "level-06-wall-left",
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
      id: "level-06-wall-right",
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
      id: "level-06-floor-start",
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
      id: "level-06-platform-key",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 16,
        y: TILE_SIZE_PX * 10,
        width: TILE_SIZE_PX * 5,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-06-floor-mid",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 24,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 16,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-06-floor-door",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 44,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 16,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-06-dr-imports-approach-floor",
      kind: "solid",
      area: {
        x: TILE_SIZE_PX * 60,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 6,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-06-dr-imports-arena-floor",
      kind: "solid",
      area: {
        x: DR_IMPORTS_ARENA_X,
        y: FLOOR_Y,
        width: DR_IMPORTS_ARENA_WIDTH,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-06-dr-imports-left-platform",
      kind: "solid",
      area: {
        x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 3,
        y: FLOOR_Y - TILE_SIZE_PX * 4,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
    {
      id: "level-06-dr-imports-right-platform",
      kind: "solid",
      area: {
        x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 15,
        y: FLOOR_Y - TILE_SIZE_PX * 4,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX,
      },
      assetId: SOLID_TILESET_ID,
    },
  ],
  hazards: [
    {
      id: "level-06-fall-key-route",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 13,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 11,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-06-fall-door-gap",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 40,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 4,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
    {
      id: "level-06-fall-memory-floor",
      kind: "fall",
      area: {
        x: TILE_SIZE_PX * 50,
        y: FLOOR_Y + TILE_SIZE_PX,
        width: TILE_SIZE_PX * 9,
        height: TILE_SIZE_PX * 2,
      },
      isInstantDeath: true,
    },
  ],
  traps: [
    {
      id: "level-06-door-gap-projectile",
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
        x: TILE_SIZE_PX * 43,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX / 2,
        height: TILE_SIZE_PX / 2,
      },
      resetOnRespawn: true,
      config: {
        velocityX: -160,
      },
    },
    {
      id: "level-06-final-false-floor",
      kind: "false-block",
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
        x: TILE_SIZE_PX * 53,
        y: FLOOR_Y,
        width: TILE_SIZE_PX * 2,
        height: TILE_SIZE_PX,
      },
      resetOnRespawn: true,
    },
  ],
  items: [
    {
      id: "level-06-memory-key",
      kind: "key",
      position: {
        x: TILE_SIZE_PX * 18 + TILE_SIZE_PX / 2,
        y: TILE_SIZE_PX * 9,
      },
      hitbox: {
        x: TILE_SIZE_PX * 18,
        y: TILE_SIZE_PX * 9 - TILE_SIZE_PX / 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX,
      },
      persistsAfterDeath: false,
      activatesObjectId: "level-06-key-memory",
      assetId: MECHANISM_KEY_SPRITE_ID,
    },
  ],
  interactiveObjects: [
    {
      id: "level-06-exit-door",
      kind: "door",
      area: {
        x: TILE_SIZE_PX * 48,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-06-key-memory",
      kind: "mechanism",
      area: {
        x: TILE_SIZE_PX * 31,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 2,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "level-06-memory-lever",
      kind: "lever",
      area: {
        x: TILE_SIZE_PX * 37,
        y: FLOOR_Y - TILE_SIZE_PX * 2,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 2,
      },
      startsActive: false,
      resetOnRespawn: true,
      action: "secondary",
      targetObjectId: "level-06-exit-door",
    },
    {
      id: "level-06-dr-imports-entry-door",
      kind: "door",
      area: {
        x: DR_IMPORTS_ARENA_X,
        y: FLOOR_Y - TILE_SIZE_PX * 3,
        width: TILE_SIZE_PX,
        height: TILE_SIZE_PX * 3,
      },
      startsActive: true,
      resetOnRespawn: true,
    },
    {
      id: "level-06-dr-imports-exit-door",
      kind: "door",
      area: {
        x: DR_IMPORTS_ARENA_X + DR_IMPORTS_ARENA_WIDTH - TILE_SIZE_PX * 2,
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
      id: "level-06-dr-imports-weak-point",
      kind: "boss-hurtbox",
      area: {
        x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 10 + 7,
        y: FLOOR_Y - 38,
        width: 18,
        height: 24,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 3,
      resetOnRespawn: true,
      hitGroupId: "boss-dr-imports",
    },
  ],
  bosses: [
    {
      id: "boss-dr-imports",
      levelId: "level-06",
      displayName: "Dr. Imports",
      arena: {
        x: DR_IMPORTS_ARENA_X,
        y: FLOOR_Y - TILE_SIZE_PX * 11,
        width: DR_IMPORTS_ARENA_WIDTH,
        height: TILE_SIZE_PX * 12,
      },
      spawn: {
        x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 11,
        y: FLOOR_Y - 24,
      },
      initialFacing: "left",
      health: DR_IMPORTS_HEALTH,
      hitbox: {
        x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 10 + 2,
        y: FLOOR_Y - 48,
        width: 28,
        height: 48,
      },
      weakPoint: {
        x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 10 + 7,
        y: FLOOR_Y - 38,
        width: 18,
        height: 24,
      },
      resetOnRespawn: true,
      movement: {
        kind: "anchor-swap",
        speedPxPerSecond: 36,
        anchors: [
          {
            x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 5,
            y: FLOOR_Y - 24,
          },
          {
            x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 11,
            y: FLOOR_Y - 24,
          },
          {
            x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 17,
            y: FLOOR_Y - 24,
          },
        ],
      },
      attacks: [
        {
          id: "level-06-dr-imports-import-bottle",
          kind: "import-bottle",
          windupMs: 500,
          activeMs: 420,
          recoverMs: 800,
          cooldownMs: 900,
          contactDamage: 0,
          tellArea: {
            x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 2,
            y: FLOOR_Y - 40,
            width: TILE_SIZE_PX * 18,
            height: 28,
          },
          projectile: {
            hitbox: {
              x: -8,
              y: -8,
              width: 16,
              height: 16,
            },
            velocity: {
              x: -112,
              y: 0,
            },
            maxActive: DR_IMPORTS_MAX_ACTIVE_PROJECTILES,
            maxRangePx: TILE_SIZE_PX * 18,
            isDestructibleBy: ["cyan-spark"],
          },
          opensVulnerabilityWindowId: "level-06-dr-imports-recover",
        },
        {
          id: "level-06-dr-imports-paper-wall",
          kind: "paper-wall",
          windupMs: 500,
          activeMs: 520,
          recoverMs: 800,
          cooldownMs: 900,
          contactDamage: 0,
          tellArea: {
            x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 10,
            y: FLOOR_Y - TILE_SIZE_PX * 7,
            width: TILE_SIZE_PX,
            height: TILE_SIZE_PX * 5,
          },
          hitbox: {
            x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 10,
            y: FLOOR_Y - TILE_SIZE_PX * 7,
            width: TILE_SIZE_PX,
            height: TILE_SIZE_PX * 5,
          },
          opensVulnerabilityWindowId: "level-06-dr-imports-recover",
        },
        {
          id: "level-06-dr-imports-smoke-swap",
          kind: "smoke-swap",
          windupMs: 500,
          activeMs: 220,
          recoverMs: 800,
          cooldownMs: 900,
          contactDamage: 0,
          tellArea: {
            x: DR_IMPORTS_ARENA_X + TILE_SIZE_PX * 2,
            y: FLOOR_Y - TILE_SIZE_PX * 7,
            width: TILE_SIZE_PX * 18,
            height: TILE_SIZE_PX * 5,
          },
          opensVulnerabilityWindowId: "level-06-dr-imports-recover",
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
          id: "level-06-dr-imports-recover",
          state: "recover",
          durationMs: 800,
          weakPointActive: true,
          opensAfterAttackIds: [
            "level-06-dr-imports-import-bottle",
            "level-06-dr-imports-paper-wall",
            "level-06-dr-imports-smoke-swap",
          ],
        },
      ],
      entryCheckpointId: "level-06-before-dr-imports",
      entryDoorId: "level-06-dr-imports-entry-door",
      defeatUnlocks: ["level-06-dr-imports-exit-door"],
      assetId: DR_IMPORTS_SPRITE_ID,
    },
  ],
  audio: {
    sounds: [],
  },
  difficulty: 6,
  mainChallenge:
    "Combinar dash, chave, alavanca e memoria curta antes da arena do Dr. Imports.",
  progressReward:
    "Fechar o segundo bloco preparando a primeira luta de reposicionamento.",
  assets: {
    sprites: [
      MECHANISM_KEY_SPRITE_ID,
      DR_IMPORTS_SPRITE_ID,
      DR_IMPORTS_BOTTLE_PROJECTILE_SPRITE_ID,
    ],
    tilesets: PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
    audio: [],
  },
});
