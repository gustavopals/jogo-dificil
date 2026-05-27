import { describe, expect, it } from "vitest";

import {
  defineLevel,
  type BossDefinition,
  type LevelDefinition,
} from "../src/data/levels/schema";
import { validateLevel, validateLevels } from "../src/data/levels/validation";

const BASE_LEVEL = defineLevel({
  id: "level-validation-test",
  name: "Sala de Validacao",
  order: 1,
  theme: "test-lab",
  bounds: {
    x: 0,
    y: 0,
    width: 480,
    height: 270,
  },
  spawn: {
    x: 64,
    y: 222,
  },
  exit: {
    id: "exit-validation-test",
    area: {
      x: 432,
      y: 176,
      width: 24,
      height: 48,
    },
  },
  checkpoints: [
    {
      id: "checkpoint-start",
      position: {
        x: 64,
        y: 222,
      },
      area: {
        x: 48,
        y: 184,
        width: 32,
        height: 40,
      },
    },
    {
      id: "checkpoint-before-boss",
      position: {
        x: 256,
        y: 222,
      },
      area: {
        x: 240,
        y: 184,
        width: 32,
        height: 40,
      },
    },
  ],
  terrain: [
    {
      id: "floor-main",
      kind: "solid",
      area: {
        x: 0,
        y: 222,
        width: 480,
        height: 16,
      },
      assetId: "tileset-test-solid",
    },
  ],
  hazards: [
    {
      id: "fall-zone",
      kind: "fall",
      area: {
        x: 256,
        y: 238,
        width: 96,
        height: 32,
      },
      isInstantDeath: true,
    },
  ],
  traps: [
    {
      id: "trap-spike-pop",
      kind: "spike-pop",
      trigger: {
        kind: "area",
        area: {
          x: 128,
          y: 176,
          width: 48,
          height: 48,
        },
      },
      area: {
        x: 160,
        y: 206,
        width: 16,
        height: 16,
      },
      resetOnRespawn: true,
    },
  ],
  items: [
    {
      id: "item-optional-token",
      kind: "optional",
      position: {
        x: 224,
        y: 176,
      },
      hitbox: {
        x: 216,
        y: 168,
        width: 16,
        height: 16,
      },
      persistsAfterDeath: true,
      assetId: "sprite-test-token",
    },
  ],
  interactiveObjects: [
    {
      id: "lever-main",
      kind: "lever",
      area: {
        x: 384,
        y: 198,
        width: 16,
        height: 24,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
    {
      id: "door-main",
      kind: "door",
      area: {
        x: 416,
        y: 174,
        width: 16,
        height: 48,
      },
      startsActive: true,
      resetOnRespawn: true,
    },
  ],
  audio: {
    musicId: "music-test-loop",
    sounds: [
      {
        id: "checkpoint-test",
        category: "sfx",
        assetKey: "sfx-checkpoint-test",
        path: "assets/audio/sfx/checkpoint-test.ogg",
        volume: 0.7,
        loop: false,
      },
    ],
  },
  difficulty: 1,
  mainChallenge: "Validar regras simples antes de carregar uma fase.",
  progressReward: "Erros de dados aparecem antes do jogo rodar.",
  assets: {
    sprites: ["sprite-test-token"],
    tilesets: ["tileset-test-solid"],
    audio: ["music-test-loop", "sfx-checkpoint-test"],
  },
} satisfies LevelDefinition);

const VALID_BOSS = {
  id: "boss-validation",
  levelId: "level-validation-test",
  displayName: "Boss De Validacao",
  arena: {
    x: 288,
    y: 126,
    width: 144,
    height: 112,
  },
  spawn: {
    x: 376,
    y: 198,
  },
  initialFacing: "left",
  health: 3,
  hitbox: {
    x: 360,
    y: 160,
    width: 32,
    height: 62,
  },
  weakPoint: {
    x: 368,
    y: 176,
    width: 16,
    height: 16,
  },
  resetOnRespawn: true,
  movement: {
    kind: "patrol",
    speedPxPerSecond: 40,
    anchors: [
      {
        x: 320,
        y: 198,
      },
      {
        x: 408,
        y: 198,
      },
    ],
  },
  attacks: [
    {
      id: "boss-validation-smoke",
      kind: "smoke-puff",
      windupMs: 500,
      activeMs: 600,
      recoverMs: 800,
      cooldownMs: 900,
      contactDamage: 1,
      tellArea: {
        x: 320,
        y: 204,
        width: 80,
        height: 16,
      },
      projectile: {
        hitbox: {
          x: 0,
          y: 0,
          width: 14,
          height: 14,
        },
        velocity: {
          x: -52,
          y: 0,
        },
        maxActive: 1,
        maxRangePx: 128,
        isDestructibleBy: ["cyan-spark"],
      },
      opensVulnerabilityWindowId: "boss-validation-recover",
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
      id: "boss-validation-recover",
      state: "recover",
      durationMs: 800,
      weakPointActive: true,
      opensAfterAttackIds: ["boss-validation-smoke"],
    },
  ],
  entryCheckpointId: "checkpoint-before-boss",
  entryDoorId: "door-main",
  defeatUnlocks: ["lever-main"],
  assetId: "boss-validation-sprite",
} satisfies BossDefinition;

describe("level validation", () => {
  it("accepts a valid level", () => {
    expect(validateLevel(BASE_LEVEL)).toEqual({
      isValid: true,
      issues: [],
    });
  });

  it("validates duplicate ids inside a level and across a level list", () => {
    const duplicateEntityIdLevel = defineLevel({
      ...BASE_LEVEL,
      assets: {
        ...BASE_LEVEL.assets,
        sprites: [...BASE_LEVEL.assets.sprites, "boss-validation-sprite"],
      },
      energyTargets: [
        {
          id: BASE_LEVEL.terrain[0]!.id,
          kind: "energy-cracked-block",
          area: {
            x: 192,
            y: 190,
            width: 24,
            height: 32,
          },
          acceptedPowers: ["cyan-burst"],
          hitPoints: 2,
          resetOnRespawn: true,
        },
      ],
      items: [
        {
          ...BASE_LEVEL.items[0]!,
          id: BASE_LEVEL.terrain[0]!.id,
        },
      ],
      bosses: [
        {
          ...VALID_BOSS,
          id: BASE_LEVEL.terrain[0]!.id,
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(duplicateEntityIdLevel).issues).toContainEqual(
      expect.objectContaining({
        code: "duplicate-id",
        path: "items[0].id",
      }),
    );
    expect(validateLevel(duplicateEntityIdLevel).issues).toContainEqual(
      expect.objectContaining({
        code: "duplicate-id",
        path: "energyTargets[0].id",
      }),
    );
    expect(validateLevel(duplicateEntityIdLevel).issues).toContainEqual(
      expect.objectContaining({
        code: "duplicate-id",
        path: "bosses[0].id",
      }),
    );

    expect(validateLevels([BASE_LEVEL, BASE_LEVEL]).issues).toContainEqual(
      expect.objectContaining({
        code: "duplicate-id",
        path: "levels[1].id",
      }),
    );
  });

  it("validates spawn, exit and checkpoints against bounds", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      spawn: {
        x: -1,
        y: 222,
      },
      exit: {
        ...BASE_LEVEL.exit,
        area: {
          x: 470,
          y: 176,
          width: 24,
          height: 48,
        },
      },
      checkpoints: [
        {
          ...BASE_LEVEL.checkpoints[0]!,
          position: {
            x: 64,
            y: 280,
          },
          area: {
            x: 48,
            y: 260,
            width: 32,
            height: 40,
          },
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "out-of-bounds",
          path: "spawn",
        }),
        expect.objectContaining({
          code: "out-of-bounds",
          path: "exit.area",
        }),
        expect.objectContaining({
          code: "out-of-bounds",
          path: "checkpoints[0].position",
        }),
        expect.objectContaining({
          code: "out-of-bounds",
          path: "checkpoints[0].area",
        }),
      ]),
    );
  });

  it("validates initial energy values for level and checkpoints", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      initialEnergy: -1,
      checkpoints: [
        {
          ...BASE_LEVEL.checkpoints[0]!,
          initialEnergy: 101,
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-energy",
          path: "initialEnergy",
        }),
        expect.objectContaining({
          code: "invalid-energy",
          path: "checkpoints[0].initialEnergy",
        }),
      ]),
    );
  });

  it("validates terrain rectangles", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      terrain: [
        {
          ...BASE_LEVEL.terrain[0]!,
          area: {
            x: 0,
            y: 222,
            width: 0,
            height: 16,
          },
        },
        {
          id: "terrain-out-of-bounds",
          kind: "solid",
          area: {
            x: 460,
            y: 222,
            width: 40,
            height: 16,
          },
          assetId: "tileset-test-solid",
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-rect",
          path: "terrain[0].area",
        }),
        expect.objectContaining({
          code: "out-of-bounds",
          path: "terrain[1].area",
        }),
      ]),
    );
  });

  it("validates hazards, traps, items and interactive object geometry", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      hazards: [
        {
          ...BASE_LEVEL.hazards[0]!,
          area: {
            x: 470,
            y: 238,
            width: 16,
            height: 32,
          },
        },
      ],
      traps: [
        {
          ...BASE_LEVEL.traps[0]!,
          trigger: {
            ...BASE_LEVEL.traps[0]!.trigger,
            area: {
              x: 128,
              y: 176,
              width: -1,
              height: 48,
            },
          },
          area: {
            x: 476,
            y: 206,
            width: 16,
            height: 16,
          },
        },
      ],
      items: [
        {
          ...BASE_LEVEL.items[0]!,
          position: {
            x: 490,
            y: 176,
          },
          hitbox: {
            x: 216,
            y: 168,
            width: 0,
            height: 16,
          },
        },
      ],
      interactiveObjects: [
        {
          ...BASE_LEVEL.interactiveObjects[0]!,
          area: {
            x: 470,
            y: 198,
            width: 24,
            height: 24,
          },
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "out-of-bounds",
          path: "hazards[0].area",
        }),
        expect.objectContaining({
          code: "invalid-rect",
          path: "traps[0].trigger.area",
        }),
        expect.objectContaining({
          code: "out-of-bounds",
          path: "traps[0].area",
        }),
        expect.objectContaining({
          code: "out-of-bounds",
          path: "items[0].position",
        }),
        expect.objectContaining({
          code: "invalid-rect",
          path: "items[0].hitbox",
        }),
        expect.objectContaining({
          code: "out-of-bounds",
          path: "interactiveObjects[0].area",
        }),
      ]),
    );
  });

  it("validates energy target geometry and hit points", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      energyTargets: [
        {
          id: "energy-target-invalid-rect",
          kind: "energy-cracked-block",
          area: {
            x: 470,
            y: 190,
            width: 24,
            height: 32,
          },
          acceptedPowers: ["cyan-burst"],
          hitPoints: 2,
          resetOnRespawn: true,
        },
        {
          id: "energy-target-invalid-hp",
          kind: "boss-hurtbox",
          area: {
            x: 320,
            y: 160,
            width: 32,
            height: 48,
          },
          acceptedPowers: ["cyan-spark", "cyan-burst"],
          hitPoints: 0,
          resetOnRespawn: false,
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "out-of-bounds",
          path: "energyTargets[0].area",
        }),
        expect.objectContaining({
          code: "invalid-energy-target",
          path: "energyTargets[1].hitPoints",
        }),
      ]),
    );
  });

  it("accepts valid declarative energy target rules for every target kind", () => {
    const validLevel = defineLevel({
      ...BASE_LEVEL,
      energyTargets: [
        {
          id: "valid-energy-switch",
          kind: "energy-switch",
          area: {
            x: 176,
            y: 198,
            width: 16,
            height: 24,
          },
          acceptedPowers: ["cyan-spark", "cyan-burst"],
          hitPoints: 1,
          resetOnRespawn: true,
          activatesObjectId: "lever-main",
        },
        {
          id: "valid-cracked-block",
          kind: "energy-cracked-block",
          area: {
            x: 208,
            y: 190,
            width: 24,
            height: 32,
          },
          acceptedPowers: ["cyan-burst"],
          hitPoints: 2,
          resetOnRespawn: true,
          startsBroken: false,
          blocksMovement: true,
        },
        {
          id: "valid-energy-relay",
          kind: "energy-relay",
          area: {
            x: 240,
            y: 198,
            width: 16,
            height: 24,
          },
          acceptedPowers: ["cyan-spark"],
          hitPoints: 3,
          resetOnRespawn: true,
          activatesObjectId: "lever-main",
          relayWindowMs: 900,
        },
        {
          id: "valid-energy-absorber",
          kind: "energy-absorber",
          area: {
            x: 272,
            y: 198,
            width: 16,
            height: 24,
          },
          acceptedPowers: ["cyan-spark", "cyan-burst"],
          hitPoints: 1,
          resetOnRespawn: true,
          absorbsEnergy: true,
        },
        {
          id: "valid-energy-core",
          kind: "energy-core",
          area: {
            x: 304,
            y: 174,
            width: 24,
            height: 48,
          },
          acceptedPowers: ["cyan-burst"],
          hitPoints: 2,
          resetOnRespawn: true,
          activatesObjectId: "lever-main",
          activationDurationMs: 1400,
        },
        {
          id: "valid-boss-hurtbox",
          kind: "boss-hurtbox",
          area: {
            x: 344,
            y: 158,
            width: 32,
            height: 64,
          },
          acceptedPowers: ["cyan-spark", "cyan-burst"],
          hitPoints: 4,
          resetOnRespawn: false,
          hitGroupId: "boss-validation",
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(validLevel)).toEqual({
      isValid: true,
      issues: [],
    });
  });

  it("validates declarative energy target rules and references", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      energyTargets: [
        {
          id: "invalid-empty-powers",
          kind: "energy-switch",
          area: {
            x: 192,
            y: 190,
            width: 16,
            height: 24,
          },
          acceptedPowers: [],
          hitPoints: 1,
          resetOnRespawn: true,
        },
        {
          id: "invalid-cracked-block-powers",
          kind: "energy-cracked-block",
          area: {
            x: 224,
            y: 190,
            width: 24,
            height: 32,
          },
          acceptedPowers: ["cyan-spark", "cyan-burst"],
          hitPoints: 2,
          resetOnRespawn: true,
        },
        {
          id: "invalid-relay",
          kind: "energy-relay",
          area: {
            x: 264,
            y: 198,
            width: 16,
            height: 24,
          },
          acceptedPowers: ["cyan-spark"],
          hitPoints: 3,
          resetOnRespawn: true,
        },
        {
          id: "invalid-core-duration",
          kind: "energy-core",
          area: {
            x: 296,
            y: 174,
            width: 24,
            height: 48,
          },
          acceptedPowers: ["cyan-spark", "cyan-burst"],
          hitPoints: 1,
          resetOnRespawn: true,
          activatesObjectId: "missing-energy-door",
          activationDurationMs: 0,
        },
        {
          id: "invalid-absorber-benefit",
          kind: "energy-absorber",
          area: {
            x: 336,
            y: 198,
            width: 16,
            height: 24,
          },
          acceptedPowers: ["cyan-spark", "cyan-burst"],
          hitPoints: 1,
          resetOnRespawn: true,
          absorbsEnergy: false,
          activatesObjectId: "lever-main",
        },
        {
          id: "invalid-relay-window",
          kind: "energy-relay",
          area: {
            x: 368,
            y: 198,
            width: 16,
            height: 24,
          },
          acceptedPowers: ["cyan-spark"],
          hitPoints: 3,
          resetOnRespawn: true,
          relayWindowMs: 0,
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-energy-target",
          path: "energyTargets[0].acceptedPowers",
        }),
        expect.objectContaining({
          code: "invalid-energy-target",
          path: "energyTargets[1].acceptedPowers",
        }),
        expect.objectContaining({
          code: "invalid-energy-target",
          path: "energyTargets[2].acceptedPowers",
        }),
        expect.objectContaining({
          code: "invalid-energy-target",
          path: "energyTargets[3].activationDurationMs",
        }),
        expect.objectContaining({
          code: "invalid-energy-target",
          path: "energyTargets[3].acceptedPowers",
        }),
        expect.objectContaining({
          code: "missing-reference",
          path: "energyTargets[3].activatesObjectId",
        }),
        expect.objectContaining({
          code: "invalid-energy-target",
          path: "energyTargets[4].absorbsEnergy",
        }),
        expect.objectContaining({
          code: "invalid-energy-target",
          path: "energyTargets[4].activatesObjectId",
        }),
        expect.objectContaining({
          code: "invalid-energy-target",
          path: "energyTargets[5].relayWindowMs",
        }),
      ]),
    );
  });

  it("accepts valid declarative boss rules", () => {
    const validLevel = defineLevel({
      ...BASE_LEVEL,
      bosses: [VALID_BOSS],
      assets: {
        ...BASE_LEVEL.assets,
        sprites: [...BASE_LEVEL.assets.sprites, "boss-validation-sprite"],
      },
    } satisfies LevelDefinition);

    expect(validateLevel(validLevel)).toEqual({
      isValid: true,
      issues: [],
    });
  });

  it("validates boss arena entry checkpoint references and placement", () => {
    const missingCheckpointLevel = defineLevel({
      ...BASE_LEVEL,
      bosses: [
        {
          ...VALID_BOSS,
          entryCheckpointId: "missing-checkpoint",
        },
      ],
    } satisfies LevelDefinition);
    const distantCheckpointLevel = defineLevel({
      ...BASE_LEVEL,
      bosses: [
        {
          ...VALID_BOSS,
          entryCheckpointId: "checkpoint-start",
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(missingCheckpointLevel).issues).toContainEqual(
      expect.objectContaining({
        code: "missing-reference",
        path: "bosses[0].entryCheckpointId",
      }),
    );
    expect(validateLevel(distantCheckpointLevel).issues).toContainEqual(
      expect.objectContaining({
        code: "invalid-boss",
        path: "bosses[0].entryCheckpointId",
      }),
    );
  });

  it("validates boss required schema collections and scoped ids", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      bosses: [
        {
          ...VALID_BOSS,
          attacks: [],
          damageRules: [],
          vulnerabilityWindows: [],
          defeatUnlocks: [],
        },
        {
          ...VALID_BOSS,
          id: "boss-validation-duplicate-scoped-ids",
          attacks: [
            VALID_BOSS.attacks[0]!,
            {
              ...VALID_BOSS.attacks[0]!,
            },
          ],
          vulnerabilityWindows: [
            VALID_BOSS.vulnerabilityWindows[0]!,
            {
              ...VALID_BOSS.vulnerabilityWindows[0]!,
            },
          ],
        },
      ],
      assets: {
        ...BASE_LEVEL.assets,
        sprites: [...BASE_LEVEL.assets.sprites, "boss-validation-sprite"],
      },
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].attacks",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].damageRules",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].vulnerabilityWindows",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].defeatUnlocks",
        }),
        expect.objectContaining({
          code: "duplicate-id",
          path: "bosses[1].attacks[1].id",
        }),
        expect.objectContaining({
          code: "duplicate-id",
          path: "bosses[1].vulnerabilityWindows[1].id",
        }),
      ]),
    );
  });

  it("validates boss projectile, damage rule and arena lock schema details", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      bosses: [
        {
          ...VALID_BOSS,
          entryDoorId: "missing-entry-door",
          attacks: [
            {
              ...VALID_BOSS.attacks[0]!,
              projectile: {
                ...VALID_BOSS.attacks[0]!.projectile!,
                maxRangePx: 0,
                isDestructibleBy: [],
              },
            },
          ],
          damageRules: [
            {
              ...VALID_BOSS.damageRules[0]!,
              damage: -1,
            },
            {
              ...VALID_BOSS.damageRules[1]!,
              damage: 1,
              effects: ["block"],
            },
            {
              ...VALID_BOSS.damageRules[1]!,
              damage: 0,
              effects: [],
            },
          ],
        },
      ],
      assets: {
        ...BASE_LEVEL.assets,
        sprites: [...BASE_LEVEL.assets.sprites, "boss-validation-sprite"],
      },
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].attacks[0].projectile.maxRangePx",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].attacks[0].projectile.isDestructibleBy",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].damageRules[0].damage",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].damageRules[1].effects",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].damageRules[2].effects",
        }),
        expect.objectContaining({
          code: "missing-reference",
          path: "bosses[0].entryDoorId",
        }),
      ]),
    );
  });

  it("validates boss geometry, attacks, damage rules and unlocks", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      bosses: [
        {
          ...VALID_BOSS,
          levelId: "wrong-level",
          arena: {
            x: 400,
            y: 126,
            width: 120,
            height: 112,
          },
          spawn: {
            x: 64,
            y: 222,
          },
          health: 0,
          weakPoint: {
            x: 360,
            y: 176,
            width: 16,
            height: 16,
          },
          movement: {
            kind: "patrol",
            speedPxPerSecond: -1,
            anchors: [
              {
                x: 64,
                y: 222,
              },
            ],
          },
          attacks: [
            {
              ...VALID_BOSS.attacks[0]!,
              id: "invalid-boss-attack",
              windupMs: 0,
              activeMs: -1,
              recoverMs: 0,
              cooldownMs: 0,
              contactDamage: -1,
              tellArea: {
                x: 64,
                y: 204,
                width: 80,
                height: 16,
              },
              hitbox: {
                x: 408,
                y: 160,
                width: 0,
                height: 16,
              },
              projectile: {
                hitbox: {
                  x: 0,
                  y: 0,
                  width: 0,
                  height: 14,
                },
                velocity: {
                  x: 0,
                  y: 0,
                },
                maxActive: 0,
                maxRangePx: 0,
                isDestructibleBy: [],
              },
              opensVulnerabilityWindowId: "missing-window",
            },
          ],
          damageRules: [
            {
              power: "cyan-spark",
              damage: -1,
              validStates: [],
              requiresWeakPoint: true,
              oncePerAttack: false,
              consumesHit: true,
              effects: [],
            },
          ],
          vulnerabilityWindows: [
            {
              id: "invalid-window",
              state: "recover",
              durationMs: 0,
              weakPointActive: true,
              opensAfterAttackIds: ["missing-attack"],
            },
          ],
          entryDoorId: "lever-main",
          defeatUnlocks: ["missing-door"],
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].levelId",
        }),
        expect.objectContaining({
          code: "out-of-bounds",
          path: "bosses[0].arena",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].spawn",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].health",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].weakPoint",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].movement.speedPxPerSecond",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].movement",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].attacks[0].windupMs",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].attacks[0].contactDamage",
        }),
        expect.objectContaining({
          code: "invalid-rect",
          path: "bosses[0].attacks[0].hitbox",
        }),
        expect.objectContaining({
          code: "invalid-rect",
          path: "bosses[0].attacks[0].projectile.hitbox",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].attacks[0].projectile.velocity",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].attacks[0].projectile.maxActive",
        }),
        expect.objectContaining({
          code: "missing-reference",
          path: "bosses[0].attacks[0].opensVulnerabilityWindowId",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].damageRules[0].validStates",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].vulnerabilityWindows[0].durationMs",
        }),
        expect.objectContaining({
          code: "missing-reference",
          path: "bosses[0].vulnerabilityWindows[0].opensAfterAttackIds[0]",
        }),
        expect.objectContaining({
          code: "invalid-boss",
          path: "bosses[0].entryDoorId",
        }),
        expect.objectContaining({
          code: "missing-reference",
          path: "bosses[0].defeatUnlocks[0]",
        }),
      ]),
    );
  });

  it("validates referenced assets", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      bosses: [VALID_BOSS],
      assets: {
        sprites: [],
        tilesets: [],
        audio: [],
      },
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "missing-asset",
          path: "terrain[0].assetId",
        }),
        expect.objectContaining({
          code: "missing-asset",
          path: "items[0].assetId",
        }),
        expect.objectContaining({
          code: "missing-asset",
          path: "bosses[0].assetId",
        }),
        expect.objectContaining({
          code: "missing-asset",
          path: "audio.musicId",
        }),
        expect.objectContaining({
          code: "missing-asset",
          path: "audio.sounds[0].assetKey",
        }),
      ]),
    );
  });

  it("validates item activation references", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      items: [
        {
          ...BASE_LEVEL.items[0]!,
          activatesObjectId: "missing-mechanism",
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toContainEqual(
      expect.objectContaining({
        code: "missing-reference",
        path: "items[0].activatesObjectId",
      }),
    );
  });

  it("validates interactive object target references", () => {
    const invalidLevel = defineLevel({
      ...BASE_LEVEL,
      interactiveObjects: [
        {
          ...BASE_LEVEL.interactiveObjects[0]!,
          targetObjectId: "missing-door",
        },
      ],
    } satisfies LevelDefinition);

    expect(validateLevel(invalidLevel).issues).toContainEqual(
      expect.objectContaining({
        code: "missing-reference",
        path: "interactiveObjects[0].targetObjectId",
      }),
    );
  });
});
