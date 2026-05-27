import { describe, expect, it } from "vitest";

import {
  PINO_ANIMATION_STATES,
  PINO_ANIMATIONS,
  PINO_HITBOX_SIZE_PX,
  PINO_POWER_ANIMATION_MODES,
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
      PINO_ANIMATION_STATES.CYAN_CHARGE,
      PINO_ANIMATION_STATES.CYAN_SPARK,
      PINO_ANIMATION_STATES.CYAN_BURST_PREPARE,
      PINO_ANIMATION_STATES.CYAN_BURST_FIRE,
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
      PINO_ANIMATION_STATES.CYAN_CHARGE,
      PINO_ANIMATION_STATES.CYAN_SPARK,
      PINO_ANIMATION_STATES.CYAN_BURST_PREPARE,
      PINO_ANIMATION_STATES.CYAN_BURST_FIRE,
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

  it("registers Energia Ciano animation data with dedicated Pino frames", () => {
    const animationsByState = Object.fromEntries(
      PINO_ANIMATIONS.map((animation) => [animation.state, animation]),
    );

    expect(
      animationsByState[PINO_ANIMATION_STATES.CYAN_CHARGE]?.frames,
    ).toEqual([
      {
        textureKey: PINO_TEXTURE_KEYS.CHARGE_01,
      },
      {
        textureKey: PINO_TEXTURE_KEYS.CHARGE_02,
      },
    ]);
    expect(animationsByState[PINO_ANIMATION_STATES.CYAN_SPARK]?.frames).toEqual(
      [
        {
          textureKey: PINO_TEXTURE_KEYS.CYAN_SPARK_01,
        },
        {
          textureKey: PINO_TEXTURE_KEYS.CYAN_SPARK_02,
        },
      ],
    );
    expect(
      animationsByState[PINO_ANIMATION_STATES.CYAN_BURST_PREPARE]?.frames,
    ).toEqual([
      {
        textureKey: PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_01,
      },
      {
        textureKey: PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_02,
      },
    ]);
    expect(
      animationsByState[PINO_ANIMATION_STATES.CYAN_BURST_FIRE]?.frames,
    ).toEqual([
      {
        textureKey: PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_01,
      },
      {
        textureKey: PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_02,
      },
    ]);
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

  it("keeps all Pino animations on the 10x22 collision hitbox", () => {
    expect(PINO_HITBOX_SIZE_PX).toEqual({
      width: PLAYER_SIZE.hitboxWidth,
      height: PLAYER_SIZE.hitboxHeight,
    });

    PINO_ANIMATIONS.forEach((animation) => {
      expect(animation.hitboxPx).toEqual({
        width: 10,
        height: 22,
      });
    });
  });

  it("defines dedicated Carga Ciano sprite frames for Pino", () => {
    const chargeAssets = PINO_SPRITE_ASSETS.filter(
      (asset) =>
        asset.key === PINO_TEXTURE_KEYS.CHARGE_01 ||
        asset.key === PINO_TEXTURE_KEYS.CHARGE_02,
    );

    expect(chargeAssets.map((asset) => asset.path)).toEqual([
      "assets/sprites/player-pino-charge-01.png",
      "assets/sprites/player-pino-charge-02.png",
    ]);
    chargeAssets.forEach((asset) => {
      expect(asset.sizePx).toEqual(PINO_SPRITE_SIZE_PX);
      expect(asset.description).toContain("Carga Ciano");
    });
  });

  it("defines dedicated Centelha Ciano firing sprite frames for Pino", () => {
    const cyanSparkAssets = PINO_SPRITE_ASSETS.filter(
      (asset) =>
        asset.key === PINO_TEXTURE_KEYS.CYAN_SPARK_01 ||
        asset.key === PINO_TEXTURE_KEYS.CYAN_SPARK_02,
    );

    expect(cyanSparkAssets.map((asset) => asset.path)).toEqual([
      "assets/sprites/player-pino-cyan-spark-01.png",
      "assets/sprites/player-pino-cyan-spark-02.png",
    ]);
    cyanSparkAssets.forEach((asset) => {
      expect(asset.sizePx).toEqual(PINO_SPRITE_SIZE_PX);
      expect(asset.description).toContain("Centelha Ciano");
    });
  });

  it("defines dedicated Rajada Ciano preparation and firing sprite frames for Pino", () => {
    const cyanBurstAssets = PINO_SPRITE_ASSETS.filter(
      (asset) =>
        asset.key === PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_01 ||
        asset.key === PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_02 ||
        asset.key === PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_01 ||
        asset.key === PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_02,
    );

    expect(cyanBurstAssets.map((asset) => asset.path)).toEqual([
      "assets/sprites/player-pino-cyan-burst-prepare-01.png",
      "assets/sprites/player-pino-cyan-burst-prepare-02.png",
      "assets/sprites/player-pino-cyan-burst-fire-01.png",
      "assets/sprites/player-pino-cyan-burst-fire-02.png",
    ]);
    cyanBurstAssets.forEach((asset) => {
      expect(asset.sizePx).toEqual(PINO_SPRITE_SIZE_PX);
      expect(asset.description).toContain("Rajada Ciano");
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

  it("selects Energia Ciano animation states from power modes", () => {
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
        powerAnimationMode: PINO_POWER_ANIMATION_MODES.CYAN_CHARGE,
      }),
    ).toBe(PINO_ANIMATION_STATES.CYAN_CHARGE);

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
        powerAnimationMode: PINO_POWER_ANIMATION_MODES.CYAN_SPARK,
      }),
    ).toBe(PINO_ANIMATION_STATES.CYAN_SPARK);

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
        isUsingSecondaryAction: false,
        powerAnimationMode: PINO_POWER_ANIMATION_MODES.CYAN_BURST_PREPARE,
      }),
    ).toBe(PINO_ANIMATION_STATES.CYAN_BURST_PREPARE);

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
        isUsingSecondaryAction: false,
        powerAnimationMode: PINO_POWER_ANIMATION_MODES.CYAN_BURST_FIRE,
      }),
    ).toBe(PINO_ANIMATION_STATES.CYAN_BURST_FIRE);
  });

  it("keeps dash priority over non-special power animation modes", () => {
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
        isUsingSecondaryAction: false,
        powerAnimationMode: PINO_POWER_ANIMATION_MODES.CYAN_CHARGE,
      }),
    ).toBe(PINO_ANIMATION_STATES.PRIMARY_ACTION);
  });
});
