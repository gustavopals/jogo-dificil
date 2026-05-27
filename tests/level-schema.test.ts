import { describe, expect, it } from "vitest";

import {
  defineLevel,
  type EnergyPowerKind,
  type EnergyTargetDefinition,
  type EnergyTargetKind,
  type LevelDefinition,
} from "../src/data/levels/schema";

const SAMPLE_LEVEL = defineLevel({
  id: "level-schema-test",
  name: "Sala de Schema",
  order: 99,
  theme: "test-lab",
  initialEnergy: 55,
  bounds: {
    x: 0,
    y: 0,
    width: 960,
    height: 270,
  },
  spawn: {
    x: 64,
    y: 222,
  },
  exit: {
    id: "level-schema-test-exit",
    area: {
      x: 900,
      y: 176,
      width: 24,
      height: 48,
    },
  },
  checkpoints: [
    {
      id: "level-schema-test-start",
      initialEnergy: 80,
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
  ],
  terrain: [
    {
      id: "floor-main",
      kind: "solid",
      area: {
        x: 0,
        y: 222,
        width: 960,
        height: 16,
      },
      assetId: "tileset-test-solid",
    },
  ],
  hazards: [
    {
      id: "pit-test",
      kind: "fall",
      area: {
        x: 320,
        y: 238,
        width: 96,
        height: 32,
      },
      isInstantDeath: true,
    },
  ],
  traps: [
    {
      id: "spike-pop-test",
      kind: "spike-pop",
      trigger: {
        kind: "area",
        area: {
          x: 192,
          y: 176,
          width: 48,
          height: 48,
        },
      },
      area: {
        x: 224,
        y: 206,
        width: 16,
        height: 16,
      },
      resetOnRespawn: true,
      config: {
        delayMs: 150,
      },
    },
  ],
  items: [
    {
      id: "optional-token-test",
      kind: "optional",
      position: {
        x: 544,
        y: 176,
      },
      hitbox: {
        x: 536,
        y: 168,
        width: 16,
        height: 16,
      },
      persistsAfterDeath: true,
      activatesObjectId: "lever-test",
      assetId: "item-test-token",
    },
  ],
  interactiveObjects: [
    {
      id: "lever-test",
      kind: "lever",
      area: {
        x: 704,
        y: 198,
        width: 16,
        height: 24,
      },
      startsActive: false,
      resetOnRespawn: true,
    },
  ],
  energyTargets: [
    {
      id: "switch-test",
      kind: "energy-switch",
      area: {
        x: 736,
        y: 198,
        width: 16,
        height: 24,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      activatesObjectId: "lever-test",
    },
    {
      id: "cracked-block-test",
      kind: "energy-cracked-block",
      area: {
        x: 760,
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
      id: "relay-test",
      kind: "energy-relay",
      area: {
        x: 800,
        y: 198,
        width: 16,
        height: 24,
      },
      acceptedPowers: ["cyan-spark"],
      hitPoints: 3,
      resetOnRespawn: true,
      activatesObjectId: "lever-test",
      relayWindowMs: 900,
    },
    {
      id: "absorber-test",
      kind: "energy-absorber",
      area: {
        x: 832,
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
      id: "core-test",
      kind: "energy-core",
      area: {
        x: 864,
        y: 174,
        width: 24,
        height: 48,
      },
      acceptedPowers: ["cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      activatesObjectId: "lever-test",
      activationDurationMs: 1400,
    },
    {
      id: "boss-hurtbox-test",
      kind: "boss-hurtbox",
      area: {
        x: 704,
        y: 164,
        width: 24,
        height: 58,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 4,
      resetOnRespawn: false,
      hitGroupId: "boss-test",
    },
  ],
  audio: {
    musicId: "music-test-loop",
    sounds: [
      {
        id: "checkpoint-test",
        category: "sfx",
        assetKey: "checkpoint-test",
        path: "assets/audio/sfx/checkpoint-test.ogg",
        volume: 0.7,
        loop: false,
      },
    ],
  },
  difficulty: 1,
  mainChallenge: "Validar autocomplete e campos obrigatorios do schema.",
  progressReward: "Schema pronto para escrever fases declarativas.",
  assets: {
    sprites: ["item-test-token"],
    tilesets: ["tileset-test-solid"],
    audio: ["checkpoint-test", "music-test-loop"],
  },
} satisfies LevelDefinition);

describe("level schema", () => {
  it("accepts a complete declarative level definition", () => {
    expect(SAMPLE_LEVEL).toMatchObject({
      id: "level-schema-test",
      initialEnergy: 55,
      checkpoints: [
        {
          initialEnergy: 80,
        },
      ],
      terrain: [
        {
          id: "floor-main",
          kind: "solid",
        },
      ],
      traps: [
        {
          id: "spike-pop-test",
          kind: "spike-pop",
        },
      ],
      energyTargets: expect.arrayContaining([
        expect.objectContaining({
          id: "switch-test",
          kind: "energy-switch",
          acceptedPowers: ["cyan-spark", "cyan-burst"],
          activatesObjectId: "lever-test",
        }),
        expect.objectContaining({
          id: "cracked-block-test",
          kind: "energy-cracked-block",
          acceptedPowers: ["cyan-burst"],
        }),
        expect.objectContaining({
          id: "relay-test",
          kind: "energy-relay",
          acceptedPowers: ["cyan-spark"],
          relayWindowMs: 900,
        }),
        expect.objectContaining({
          id: "absorber-test",
          kind: "energy-absorber",
          absorbsEnergy: true,
        }),
        expect.objectContaining({
          id: "core-test",
          kind: "energy-core",
          activationDurationMs: 1400,
        }),
        expect.objectContaining({
          id: "boss-hurtbox-test",
          kind: "boss-hurtbox",
          hitGroupId: "boss-test",
        }),
      ]),
    });
  });

  it("exports the declarative energy target schema for every target kind", () => {
    const energyTargets =
      SAMPLE_LEVEL.energyTargets satisfies readonly EnergyTargetDefinition[];
    const targetKinds: readonly EnergyTargetKind[] = energyTargets.map(
      (target) => target.kind,
    );
    const acceptedPowers: readonly (readonly EnergyPowerKind[])[] =
      energyTargets.map((target) => target.acceptedPowers);

    expect(targetKinds).toEqual([
      "energy-switch",
      "energy-cracked-block",
      "energy-relay",
      "energy-absorber",
      "energy-core",
      "boss-hurtbox",
    ]);
    expect(acceptedPowers).toEqual([
      ["cyan-spark", "cyan-burst"],
      ["cyan-burst"],
      ["cyan-spark"],
      ["cyan-spark", "cyan-burst"],
      ["cyan-burst"],
      ["cyan-spark", "cyan-burst"],
    ]);
  });
});
