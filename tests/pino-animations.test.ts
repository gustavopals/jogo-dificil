import { describe, expect, it } from "vitest";

import {
  ACTIVE_PINO_FRAME_SOURCE_MODE,
  PINO_ANIMATION_STATES,
  PINO_ANIMATIONS,
  PINO_FRAME_SOURCE_MODES,
  PINO_HITBOX_SIZE_PX,
  PINO_POWER_ANIMATION_MODES,
  PINO_SPRITE_ASSETS,
  PINO_SPRITE_SIZE_PX,
  PINO_TEXTURE_KEYS,
  resolveInitialPinoSpriteFrame,
  resolvePinoSpriteFrame,
  getPinoVisualDisplaySize,
  selectPinoAnimationState,
} from "../src/data/characters/pino-animations";
import {
  PINO_ANIMATION_FRAME_REGISTRY,
  PINO_FRAME_IDS,
  PINO_SPRITESHEET_FRAME_REGISTRY,
} from "../src/data/characters/pino-spritesheet-registry";
import { PLAYER_SIZE, TILE_SIZE_PX } from "../src/game/constants";
import { IMAGE_ASSETS } from "../src/game/assets";

function getExpectedAnimationFrames(
  frameIds: readonly (typeof PINO_FRAME_IDS)[keyof typeof PINO_FRAME_IDS][],
) {
  if (ACTIVE_PINO_FRAME_SOURCE_MODE === PINO_FRAME_SOURCE_MODES.SPRITESHEETS) {
    return frameIds.map((frameId) => {
      const frame = PINO_SPRITESHEET_FRAME_REGISTRY[frameId];

      return {
        textureKey: frame.textureKey,
        frame: frame.frame,
      };
    });
  }

  const legacyMap = {
    [PINO_FRAME_IDS.IDLE]: PINO_TEXTURE_KEYS.IDLE,
    [PINO_FRAME_IDS.RUN_01]: PINO_TEXTURE_KEYS.RUN_01,
    [PINO_FRAME_IDS.RUN_02]: PINO_TEXTURE_KEYS.RUN_02,
    [PINO_FRAME_IDS.RUN_03]: PINO_TEXTURE_KEYS.RUN_03,
    [PINO_FRAME_IDS.JUMP]: PINO_TEXTURE_KEYS.JUMP,
    [PINO_FRAME_IDS.JUMP_PEAK]: PINO_TEXTURE_KEYS.JUMP_PEAK,
    [PINO_FRAME_IDS.FALL]: PINO_TEXTURE_KEYS.FALL,
    [PINO_FRAME_IDS.DASH]: PINO_TEXTURE_KEYS.DASH,
    [PINO_FRAME_IDS.CHARGE_01]: PINO_TEXTURE_KEYS.CHARGE_01,
    [PINO_FRAME_IDS.CHARGE_02]: PINO_TEXTURE_KEYS.CHARGE_02,
    [PINO_FRAME_IDS.CYAN_SPARK_01]: PINO_TEXTURE_KEYS.CYAN_SPARK_01,
    [PINO_FRAME_IDS.CYAN_SPARK_02]: PINO_TEXTURE_KEYS.CYAN_SPARK_02,
    [PINO_FRAME_IDS.CYAN_BURST_PREPARE_01]: PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_01,
    [PINO_FRAME_IDS.CYAN_BURST_PREPARE_02]: PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_02,
    [PINO_FRAME_IDS.CYAN_BURST_FIRE_01]: PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_01,
    [PINO_FRAME_IDS.CYAN_BURST_FIRE_02]: PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_02,
    [PINO_FRAME_IDS.DEATH_01]: PINO_TEXTURE_KEYS.DEATH_01,
    [PINO_FRAME_IDS.DEATH_02]: PINO_TEXTURE_KEYS.DEATH_02,
    [PINO_FRAME_IDS.RESPAWN_01]: PINO_TEXTURE_KEYS.RESPAWN_01,
    [PINO_FRAME_IDS.RESPAWN_02]: PINO_TEXTURE_KEYS.RESPAWN_02,
  } as const;

  return frameIds.map((frameId) => ({
    textureKey: legacyMap[frameId],
  }));
}

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

    expect(animationsByState[PINO_ANIMATION_STATES.IDLE]?.frames).toEqual(
      getExpectedAnimationFrames(PINO_ANIMATION_FRAME_REGISTRY.idle),
    );
    expect(animationsByState[PINO_ANIMATION_STATES.RUN]?.frames).toEqual(
      getExpectedAnimationFrames(PINO_ANIMATION_FRAME_REGISTRY.run),
    );
    expect(animationsByState[PINO_ANIMATION_STATES.JUMP]?.frames).toEqual(
      getExpectedAnimationFrames(PINO_ANIMATION_FRAME_REGISTRY.jump),
    );
    expect(animationsByState[PINO_ANIMATION_STATES.FALL]?.frames).toEqual(
      getExpectedAnimationFrames(PINO_ANIMATION_FRAME_REGISTRY.fall),
    );
    expect(animationsByState[PINO_ANIMATION_STATES.DEATH]?.frames).toEqual(
      getExpectedAnimationFrames(PINO_ANIMATION_FRAME_REGISTRY.death),
    );
    expect(animationsByState[PINO_ANIMATION_STATES.RESPAWN]?.frames).toEqual(
      getExpectedAnimationFrames(PINO_ANIMATION_FRAME_REGISTRY.respawn),
    );

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
    ).toEqual(
      getExpectedAnimationFrames(PINO_ANIMATION_FRAME_REGISTRY["primary-action"]),
    );
    expect(
      animationsByState[PINO_ANIMATION_STATES.SECONDARY_ACTION]?.isPlaceholder,
    ).toBe(true);
  });

  it("resolves menu and player sprite frames from the active Pino source mode", () => {
    const idleFrame = resolvePinoSpriteFrame(PINO_FRAME_IDS.IDLE);
    const initialFrame = resolveInitialPinoSpriteFrame();

    expect(initialFrame).toEqual(idleFrame);

    if (ACTIVE_PINO_FRAME_SOURCE_MODE === PINO_FRAME_SOURCE_MODES.SPRITESHEETS) {
      expect(idleFrame.textureKey).toBe(
        PINO_SPRITESHEET_FRAME_REGISTRY[PINO_FRAME_IDS.IDLE].textureKey,
      );
      expect(idleFrame.frame).toBe(
        PINO_SPRITESHEET_FRAME_REGISTRY[PINO_FRAME_IDS.IDLE].frame,
      );
      expect(idleFrame.textureKey).not.toBe(PINO_TEXTURE_KEYS.IDLE);
    } else {
      expect(idleFrame).toEqual({
        textureKey: PINO_TEXTURE_KEYS.IDLE,
      });
    }
  });

  it("maps spritesheet frames to the official HD runtime display size", () => {
    expect(getPinoVisualDisplaySize()).toEqual({
      width: PLAYER_SIZE.visualWidth,
      height: PLAYER_SIZE.visualHeight,
    });
  });

  it("registers Energia Ciano animation data with dedicated Pino frames", () => {
    const animationsByState = Object.fromEntries(
      PINO_ANIMATIONS.map((animation) => [animation.state, animation]),
    );

    expect(
      animationsByState[PINO_ANIMATION_STATES.CYAN_CHARGE]?.frames,
    ).toEqual(getExpectedAnimationFrames(PINO_ANIMATION_FRAME_REGISTRY["cyan-charge"]));
    expect(animationsByState[PINO_ANIMATION_STATES.CYAN_SPARK]?.frames).toEqual(
      getExpectedAnimationFrames(PINO_ANIMATION_FRAME_REGISTRY["cyan-spark"]),
    );
    expect(
      animationsByState[PINO_ANIMATION_STATES.CYAN_BURST_PREPARE]?.frames,
    ).toEqual(
      getExpectedAnimationFrames(
        PINO_ANIMATION_FRAME_REGISTRY["cyan-burst-prepare"],
      ),
    );
    expect(
      animationsByState[PINO_ANIMATION_STATES.CYAN_BURST_FIRE]?.frames,
    ).toEqual(
      getExpectedAnimationFrames(PINO_ANIMATION_FRAME_REGISTRY["cyan-burst-fire"]),
    );
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
      expect(asset.path).toMatch(/^assets\/legacy\/pino\/player-pino-.+\.png$/);
      expect(asset.sizePx).toEqual(PINO_SPRITE_SIZE_PX);
      expect(asset.origin).toBe("Gerado no projeto por script");
      expect(asset.license).toBe("Original do projeto");
      expect(asset.description.length).toBeGreaterThan(24);
    });
  });

  it("keeps all Pino animations on the configured runtime collision hitbox", () => {
    expect(PINO_HITBOX_SIZE_PX).toEqual({
      width: PLAYER_SIZE.hitboxWidth,
      height: PLAYER_SIZE.hitboxHeight,
    });

    PINO_ANIMATIONS.forEach((animation) => {
      expect(animation.hitboxPx).toEqual({
        width: PLAYER_SIZE.hitboxWidth,
        height: PLAYER_SIZE.hitboxHeight,
      });
    });
  });

  it("keeps Pino readable at HD 1x with Stardew-inspired tile ratio", () => {
    expect(PLAYER_SIZE.visualWidth).toBeGreaterThanOrEqual(28);
    expect(PLAYER_SIZE.visualWidth).toBeLessThanOrEqual(36);
    expect(PLAYER_SIZE.visualHeight).toBeGreaterThanOrEqual(44);
    expect(PLAYER_SIZE.visualHeight).toBeLessThanOrEqual(64);
    expect(PLAYER_SIZE.hitboxWidth).toBeLessThan(PLAYER_SIZE.visualWidth);
    expect(PLAYER_SIZE.hitboxHeight).toBeLessThan(PLAYER_SIZE.visualHeight);
    expect(PLAYER_SIZE.visualWidth / TILE_SIZE_PX).toBeCloseTo(1, 5);
    expect(PLAYER_SIZE.visualHeight / TILE_SIZE_PX).toBeCloseTo(1.5, 5);
  });

  it("defines dedicated Carga Ciano sprite frames for Pino", () => {
    const chargeAssets = PINO_SPRITE_ASSETS.filter(
      (asset) =>
        asset.key === PINO_TEXTURE_KEYS.CHARGE_01 ||
        asset.key === PINO_TEXTURE_KEYS.CHARGE_02,
    );

    expect(chargeAssets.map((asset) => asset.path)).toEqual([
      "assets/legacy/pino/player-pino-charge-01.png",
      "assets/legacy/pino/player-pino-charge-02.png",
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
      "assets/legacy/pino/player-pino-cyan-spark-01.png",
      "assets/legacy/pino/player-pino-cyan-spark-02.png",
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
      "assets/legacy/pino/player-pino-cyan-burst-prepare-01.png",
      "assets/legacy/pino/player-pino-cyan-burst-prepare-02.png",
      "assets/legacy/pino/player-pino-cyan-burst-fire-01.png",
      "assets/legacy/pino/player-pino-cyan-burst-fire-02.png",
    ]);
    cyanBurstAssets.forEach((asset) => {
      expect(asset.sizePx).toEqual(PINO_SPRITE_SIZE_PX);
      expect(asset.description).toContain("Rajada Ciano");
    });
  });

  it("does not preload legacy Pino PNGs in the production runtime registry", () => {
    const imageAssetKeys = IMAGE_ASSETS.map((asset) => asset.key);

    PINO_SPRITE_ASSETS.forEach((asset) => {
      expect(imageAssetKeys).not.toContain(asset.key);
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
