import { describe, expect, it } from "vitest";

import {
  PINO_ANIMATION_STATES,
  PINO_ANIMATIONS,
  PINO_SPRITE_ASSETS,
  PINO_SPRITE_SIZE_PX,
  PINO_TEXTURE_KEYS,
  selectPinoAnimationState,
} from "../src/data/characters/pino-animations";
import { PLAYER_SIZE } from "../src/game/constants";
import { IMAGE_ASSETS } from "../src/game/assets";

describe("pino animations", () => {
  it("defines every animation expected for the player", () => {
    expect(PINO_ANIMATIONS.map((animation) => animation.state)).toEqual([
      PINO_ANIMATION_STATES.IDLE,
      PINO_ANIMATION_STATES.RUN,
      PINO_ANIMATION_STATES.JUMP,
      PINO_ANIMATION_STATES.FALL,
      PINO_ANIMATION_STATES.DEATH,
      PINO_ANIMATION_STATES.RESPAWN,
      PINO_ANIMATION_STATES.PRIMARY_ACTION,
      PINO_ANIMATION_STATES.SECONDARY_ACTION,
    ]);
  });

  it("uses dedicated MVP sprite art for core movement states", () => {
    const animationsByState = Object.fromEntries(
      PINO_ANIMATIONS.map((animation) => [animation.state, animation]),
    );

    expect(animationsByState[PINO_ANIMATION_STATES.IDLE]?.frames).toEqual([
      {
        textureKey: PINO_TEXTURE_KEYS.IDLE,
      },
    ]);
    expect(animationsByState[PINO_ANIMATION_STATES.RUN]?.frames).toEqual([
      {
        textureKey: PINO_TEXTURE_KEYS.RUN_01,
      },
      {
        textureKey: PINO_TEXTURE_KEYS.RUN_02,
      },
      {
        textureKey: PINO_TEXTURE_KEYS.RUN_03,
      },
    ]);
    expect(animationsByState[PINO_ANIMATION_STATES.JUMP]?.frames).toEqual([
      {
        textureKey: PINO_TEXTURE_KEYS.JUMP,
      },
      {
        textureKey: PINO_TEXTURE_KEYS.JUMP_PEAK,
      },
    ]);
    expect(animationsByState[PINO_ANIMATION_STATES.FALL]?.frames).toEqual([
      {
        textureKey: PINO_TEXTURE_KEYS.JUMP_PEAK,
      },
      {
        textureKey: PINO_TEXTURE_KEYS.FALL,
      },
    ]);
    expect(animationsByState[PINO_ANIMATION_STATES.DEATH]?.frames).toEqual([
      {
        textureKey: PINO_TEXTURE_KEYS.DEATH_01,
      },
      {
        textureKey: PINO_TEXTURE_KEYS.DEATH_02,
      },
    ]);
    expect(animationsByState[PINO_ANIMATION_STATES.RESPAWN]?.frames).toEqual([
      {
        textureKey: PINO_TEXTURE_KEYS.RESPAWN_01,
      },
      {
        textureKey: PINO_TEXTURE_KEYS.RESPAWN_02,
      },
      {
        textureKey: PINO_TEXTURE_KEYS.IDLE,
      },
    ]);

    [
      PINO_ANIMATION_STATES.IDLE,
      PINO_ANIMATION_STATES.RUN,
      PINO_ANIMATION_STATES.JUMP,
      PINO_ANIMATION_STATES.FALL,
      PINO_ANIMATION_STATES.DEATH,
      PINO_ANIMATION_STATES.RESPAWN,
      PINO_ANIMATION_STATES.PRIMARY_ACTION,
    ].forEach((state) => {
      expect(animationsByState[state]?.isPlaceholder, state).toBe(false);
    });
    expect(
      animationsByState[PINO_ANIMATION_STATES.PRIMARY_ACTION]?.frames,
    ).toEqual([
      {
        textureKey: PINO_TEXTURE_KEYS.DASH,
      },
    ]);
    expect(
      animationsByState[PINO_ANIMATION_STATES.SECONDARY_ACTION]?.isPlaceholder,
    ).toBe(true);
  });

  it("registers every Pino sprite at the gameplay sprite size", () => {
    expect(PINO_SPRITE_SIZE_PX).toEqual({
      width: PLAYER_SIZE.visualWidth,
      height: PLAYER_SIZE.visualHeight,
    });
    expect(PINO_SPRITE_ASSETS.map((asset) => asset.key)).toEqual(
      Object.values(PINO_TEXTURE_KEYS),
    );

    PINO_SPRITE_ASSETS.forEach((asset) => {
      expect(asset.path).toMatch(/^assets\/sprites\/player-pino-.+\.png$/);
      expect(asset.sizePx).toEqual(PINO_SPRITE_SIZE_PX);
      expect(asset.origin).toBe("Gerado no projeto por script");
      expect(asset.license).toBe("Original do projeto");
      expect(asset.description.length).toBeGreaterThan(24);
    });
  });

  it("preloads every Pino sprite asset key", () => {
    const imageAssetKeys = IMAGE_ASSETS.map((asset) => asset.key);

    PINO_SPRITE_ASSETS.forEach((asset) => {
      expect(imageAssetKeys).toContain(asset.key);
    });
  });

  it("selects animation states from player movement and action flags", () => {
    expect(
      selectPinoAnimationState({
        isAlive: true,
        isRespawning: false,
        isGrounded: true,
        velocity: {
          x: 0,
          y: 0,
        },
        isUsingPrimaryAction: false,
        isUsingSecondaryAction: false,
      }),
    ).toBe(PINO_ANIMATION_STATES.IDLE);

    expect(
      selectPinoAnimationState({
        isAlive: true,
        isRespawning: false,
        isGrounded: true,
        velocity: {
          x: 80,
          y: 0,
        },
        isUsingPrimaryAction: false,
        isUsingSecondaryAction: false,
      }),
    ).toBe(PINO_ANIMATION_STATES.RUN);

    expect(
      selectPinoAnimationState({
        isAlive: true,
        isRespawning: false,
        isGrounded: false,
        velocity: {
          x: 0,
          y: -120,
        },
        isUsingPrimaryAction: false,
        isUsingSecondaryAction: false,
      }),
    ).toBe(PINO_ANIMATION_STATES.JUMP);

    expect(
      selectPinoAnimationState({
        isAlive: true,
        isRespawning: false,
        isGrounded: false,
        velocity: {
          x: 0,
          y: 120,
        },
        isUsingPrimaryAction: false,
        isUsingSecondaryAction: false,
      }),
    ).toBe(PINO_ANIMATION_STATES.FALL);
  });

  it("prioritizes respawn, death and explicit actions over locomotion", () => {
    expect(
      selectPinoAnimationState({
        isAlive: false,
        isRespawning: true,
        isGrounded: false,
        velocity: {
          x: 80,
          y: 120,
        },
        isUsingPrimaryAction: true,
        isUsingSecondaryAction: true,
      }),
    ).toBe(PINO_ANIMATION_STATES.RESPAWN);

    expect(
      selectPinoAnimationState({
        isAlive: false,
        isRespawning: false,
        isGrounded: true,
        velocity: {
          x: 80,
          y: 0,
        },
        isUsingPrimaryAction: true,
        isUsingSecondaryAction: true,
      }),
    ).toBe(PINO_ANIMATION_STATES.DEATH);

    expect(
      selectPinoAnimationState({
        isAlive: true,
        isRespawning: false,
        isGrounded: true,
        velocity: {
          x: 80,
          y: 0,
        },
        isUsingPrimaryAction: true,
        isUsingSecondaryAction: true,
      }),
    ).toBe(PINO_ANIMATION_STATES.PRIMARY_ACTION);

    expect(
      selectPinoAnimationState({
        isAlive: true,
        isRespawning: false,
        isGrounded: true,
        velocity: {
          x: 80,
          y: 0,
        },
        isUsingPrimaryAction: false,
        isUsingSecondaryAction: true,
      }),
    ).toBe(PINO_ANIMATION_STATES.SECONDARY_ACTION);
  });
});
