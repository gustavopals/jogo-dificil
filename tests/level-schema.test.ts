import { describe, expect, it } from "vitest";

import { defineLevel, type LevelDefinition } from "../src/data/levels/schema";

const SAMPLE_LEVEL = defineLevel({
  id: "level-schema-test",
  name: "Sala de Schema",
  order: 99,
  theme: "test-lab",
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
    });
  });
});
