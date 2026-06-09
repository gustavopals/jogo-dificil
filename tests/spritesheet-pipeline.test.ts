import { describe, expect, it } from "vitest";

import {
  SPRITESHEET_ALLOWED_SHEET_SIZES_PX,
  SPRITESHEET_CELL_SIZE_PX,
  SPRITESHEET_GRID_BY_SIZE,
  isValidSpritesheetFrameSize,
} from "../src/data/art";
import {
  BOSS_ANIMATION_FRAMES,
  BOSS_HD_VISUAL_PROFILES,
  BOSS_SPRITESHEET_ASSETS,
  BOSS_SPRITESHEET_KEYS,
  BOSS_STATE_FRAME_IDS,
  resolveBossAnimationFrameIndex,
} from "../src/data/characters/boss-spritesheet-registry";
import {
  PINO_ANIMATION_FRAME_REGISTRY,
  PINO_FRAME_IDS,
  PINO_SPRITESHEET_ASSETS,
  PINO_SPRITESHEET_FRAME_REGISTRY,
  PINO_SPRITESHEET_KEYS,
} from "../src/data/characters/pino-spritesheet-registry";
import {
  ACTIVE_PINO_FRAME_SOURCE_MODE,
  PINO_ANIMATION_STATES,
  PINO_ANIMATIONS,
  PINO_FRAME_SOURCE_MODES,
} from "../src/data/characters/pino-animations";
import { SPRITESHEET_ASSETS } from "../src/game/assets";

describe("spritesheet pipeline", () => {
  it("defines official spritesheet conventions for migration", () => {
    expect(SPRITESHEET_CELL_SIZE_PX).toBe(256);
    expect(SPRITESHEET_ALLOWED_SHEET_SIZES_PX).toEqual([1024, 2048]);
    expect(SPRITESHEET_GRID_BY_SIZE[1024]).toEqual({
      columns: 4,
      rows: 4,
      maxFrames: 16,
    });
    expect(SPRITESHEET_GRID_BY_SIZE[2048]).toEqual({
      columns: 8,
      rows: 8,
      maxFrames: 64,
    });
    expect(isValidSpritesheetFrameSize(256, 256)).toBe(true);
    expect(isValidSpritesheetFrameSize(128, 256)).toBe(false);
  });

  it("registers declarative Pino frame ids for each animation state", () => {
    expect(PINO_ANIMATION_FRAME_REGISTRY.idle).toEqual([PINO_FRAME_IDS.IDLE]);
    expect(PINO_ANIMATION_FRAME_REGISTRY.run).toEqual([
      PINO_FRAME_IDS.RUN_01,
      PINO_FRAME_IDS.RUN_02,
      PINO_FRAME_IDS.RUN_03,
    ]);
    expect(PINO_ANIMATION_FRAME_REGISTRY.jump).toEqual([
      PINO_FRAME_IDS.JUMP,
      PINO_FRAME_IDS.JUMP_PEAK,
    ]);
    expect(PINO_ANIMATION_FRAME_REGISTRY.fall).toEqual([
      PINO_FRAME_IDS.JUMP_PEAK,
      PINO_FRAME_IDS.FALL,
    ]);
    expect(PINO_ANIMATION_FRAME_REGISTRY["primary-action"]).toEqual([
      PINO_FRAME_IDS.DASH,
    ]);
    expect(PINO_ANIMATION_FRAME_REGISTRY["cyan-burst-fire"]).toEqual([
      PINO_FRAME_IDS.CYAN_BURST_FIRE_01,
      PINO_FRAME_IDS.CYAN_BURST_FIRE_02,
    ]);
  });

  it("maps every Pino frame id to a spritesheet key and frame index", () => {
    expect(PINO_SPRITESHEET_FRAME_REGISTRY[PINO_FRAME_IDS.IDLE]).toEqual({
      textureKey: PINO_SPRITESHEET_KEYS.CORE_1024,
      frame: 0,
    });
    expect(
      PINO_SPRITESHEET_FRAME_REGISTRY[PINO_FRAME_IDS.CYAN_BURST_FIRE_02],
    ).toEqual({
      textureKey: PINO_SPRITESHEET_KEYS.ENERGY_1024,
      frame: 7,
    });
  });

  it("keeps spritesheet assets enabled with valid 256x256 cells", () => {
    expect(PINO_SPRITESHEET_ASSETS.map((asset) => asset.key)).toEqual([
      PINO_SPRITESHEET_KEYS.CORE_1024,
      PINO_SPRITESHEET_KEYS.ENERGY_1024,
    ]);
    expect(PINO_SPRITESHEET_ASSETS.every((asset) => asset.frameWidth === 256)).toBe(
      true,
    );
    expect(
      PINO_SPRITESHEET_ASSETS.every((asset) => asset.frameHeight === 256),
    ).toBe(true);
    expect(PINO_SPRITESHEET_ASSETS.every((asset) => asset.enabled === true)).toBe(
      true,
    );
    expect(SPRITESHEET_ASSETS.every((asset) => asset.enabled === true)).toBe(
      true,
    );
  });

  it("registers dedicated HD spritesheets and state frames for bosses", () => {
    expect(BOSS_SPRITESHEET_ASSETS.map((asset) => asset.key)).toEqual([
      BOSS_SPRITESHEET_KEYS.HIROLITO_1024,
      BOSS_SPRITESHEET_KEYS.DR_IMPORTS_1024,
      BOSS_SPRITESHEET_KEYS.GIGA_FABIO_1024,
    ]);
    expect(BOSS_SPRITESHEET_ASSETS.every((asset) => asset.frameWidth === 256)).toBe(
      true,
    );
    expect(
      BOSS_SPRITESHEET_ASSETS.every((asset) => asset.frameHeight === 256),
    ).toBe(true);
    expect(BOSS_SPRITESHEET_ASSETS.every((asset) => asset.enabled)).toBe(true);
    expect(BOSS_HD_VISUAL_PROFILES.HIROLITO_NARGUILITO.displaySize).toEqual({
      width: 56,
      height: 72,
    });
    expect(BOSS_HD_VISUAL_PROFILES.DR_IMPORTS.displaySize).toEqual({
      width: 56,
      height: 80,
    });
    expect(BOSS_HD_VISUAL_PROFILES.GIGA_FABIO.displaySize).toEqual({
      width: 72,
      height: 88,
    });
    expect(BOSS_STATE_FRAME_IDS.ATTACK).toBe(2);
    expect(BOSS_STATE_FRAME_IDS.DEFEATED).toBe(4);
  });

  it("maps Hirolito animation states to reference sheet row indices", () => {
    expect(BOSS_ANIMATION_FRAMES.HIROLITO_NARGUILITO).toEqual({
      inactive: [0],
      intro: [3],
      patrol: [0, 1, 2],
      windup: [4, 5, 6, 7],
      attack: [8, 9],
      recover: [14, 15],
      stunned: [12],
      defeated: [13],
    });
  });

  it("cycles boss animation frames from the reference sheet layout", () => {
    expect(
      resolveBossAnimationFrameIndex("boss-hirolito-narguilito", "patrol", 0),
    ).toBe(0);
    expect(
      resolveBossAnimationFrameIndex("boss-hirolito-narguilito", "patrol", 200),
    ).toBe(1);
    expect(
      resolveBossAnimationFrameIndex("boss-hirolito-narguilito", "patrol", 400),
    ).toBe(2);
    expect(
      resolveBossAnimationFrameIndex("boss-hirolito-narguilito", "windup", 480),
    ).toBe(7);
    expect(
      resolveBossAnimationFrameIndex("boss-hirolito-narguilito", "attack", 0),
    ).toBe(8);
    expect(
      resolveBossAnimationFrameIndex("boss-hirolito-narguilito", "stunned", 0),
    ).toBe(12);
    expect(
      resolveBossAnimationFrameIndex("boss-hirolito-narguilito", "defeated", 0),
    ).toBe(13);
    expect(
      resolveBossAnimationFrameIndex("boss-dr-imports", "attack", 320),
    ).toBe(6);
    expect(
      resolveBossAnimationFrameIndex("boss-giga-fabio", "defeated", 0),
    ).toBe(15);
  });

  it("maps Dr Imports animation states to the boss-2 reference sheet", () => {
    expect(BOSS_ANIMATION_FRAMES.DR_IMPORTS).toEqual({
      inactive: [0],
      intro: [2],
      patrol: [0, 2],
      windup: [14, 2],
      attack: [6, 7],
      recover: [0, 2],
      stunned: [12],
      defeated: [13],
    });
    expect(
      resolveBossAnimationFrameIndex("boss-dr-imports", "patrol", 0),
    ).toBe(0);
    expect(
      resolveBossAnimationFrameIndex("boss-dr-imports", "patrol", 200),
    ).toBe(2);
    expect(
      resolveBossAnimationFrameIndex("boss-dr-imports", "windup", 0),
    ).toBe(14);
    expect(
      resolveBossAnimationFrameIndex("boss-dr-imports", "windup", 200),
    ).toBe(2);
    expect(
      resolveBossAnimationFrameIndex("boss-dr-imports", "attack", 160),
    ).toBe(7);
    expect(
      resolveBossAnimationFrameIndex("boss-dr-imports", "stunned", 0),
    ).toBe(12);
    expect(
      resolveBossAnimationFrameIndex("boss-dr-imports", "defeated", 0),
    ).toBe(13);
  });

  it("maps Giga Fabio animation states to the boss-3 reference sheet", () => {
    expect(BOSS_ANIMATION_FRAMES.GIGA_FABIO).toEqual({
      inactive: [0],
      intro: [2],
      patrol: [0, 1, 2],
      windup: [4, 5, 6],
      attack: [7, 10],
      recover: [11],
      stunned: [14],
      defeated: [15],
    });
    expect(
      resolveBossAnimationFrameIndex("boss-giga-fabio", "patrol", 0),
    ).toBe(0);
    expect(
      resolveBossAnimationFrameIndex("boss-giga-fabio", "patrol", 200),
    ).toBe(1);
    expect(
      resolveBossAnimationFrameIndex("boss-giga-fabio", "windup", 320),
    ).toBe(6);
    expect(
      resolveBossAnimationFrameIndex("boss-giga-fabio", "attack", 0),
    ).toBe(7);
    expect(
      resolveBossAnimationFrameIndex("boss-giga-fabio", "attack", 200),
    ).toBe(10);
    expect(
      resolveBossAnimationFrameIndex("boss-giga-fabio", "stunned", 0),
    ).toBe(14);
    expect(BOSS_HD_VISUAL_PROFILES.GIGA_FABIO.bottomOffsetY).toBe(0);
  });

  it("uses spritesheet-driven animation textures for runtime", () => {
    expect(ACTIVE_PINO_FRAME_SOURCE_MODE).toBe(
      PINO_FRAME_SOURCE_MODES.SPRITESHEETS,
    );

    const animationByState = Object.fromEntries(
      PINO_ANIMATIONS.map((animation) => [animation.state, animation]),
    );
    expect(animationByState[PINO_ANIMATION_STATES.IDLE]?.frames).toEqual([
      { textureKey: PINO_SPRITESHEET_KEYS.CORE_1024, frame: 0 },
    ]);
    expect(animationByState[PINO_ANIMATION_STATES.RUN]?.frames).toEqual([
      { textureKey: PINO_SPRITESHEET_KEYS.CORE_1024, frame: 1 },
      { textureKey: PINO_SPRITESHEET_KEYS.CORE_1024, frame: 2 },
      { textureKey: PINO_SPRITESHEET_KEYS.CORE_1024, frame: 3 },
    ]);
  });
});
