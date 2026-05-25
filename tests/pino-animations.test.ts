import { describe, expect, it } from "vitest";

import {
  PINO_ANIMATION_STATES,
  PINO_ANIMATIONS,
  PINO_TEXTURE_KEYS,
  selectPinoAnimationState,
} from "../src/data/characters/pino-animations";

describe("pino animations", () => {
  it("defines every placeholder animation expected for the player", () => {
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

    expect(
      PINO_ANIMATIONS.every(
        (animation) =>
          animation.isPlaceholder &&
          animation.frames.every(
            (frame) => frame.textureKey === PINO_TEXTURE_KEYS.IDLE,
          ),
      ),
    ).toBe(true);
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
