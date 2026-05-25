import type { CharacterAnimationDefinition, Vector2Like } from "../../shared";

export const PINO_TEXTURE_KEYS = {
  IDLE: "player-pino-idle",
} as const;

export const PINO_ANIMATION_STATES = {
  IDLE: "idle",
  RUN: "run",
  JUMP: "jump",
  FALL: "fall",
  DEATH: "death",
  RESPAWN: "respawn",
  PRIMARY_ACTION: "primary-action",
  SECONDARY_ACTION: "secondary-action",
} as const;

export type PinoAnimationState =
  (typeof PINO_ANIMATION_STATES)[keyof typeof PINO_ANIMATION_STATES];

export const PINO_ANIMATION_KEYS = {
  IDLE: "pino:idle",
  RUN: "pino:run",
  JUMP: "pino:jump",
  FALL: "pino:fall",
  DEATH: "pino:death",
  RESPAWN: "pino:respawn",
  PRIMARY_ACTION: "pino:primary-action",
  SECONDARY_ACTION: "pino:secondary-action",
} as const;

export type PinoAnimationKey =
  (typeof PINO_ANIMATION_KEYS)[keyof typeof PINO_ANIMATION_KEYS];

export type PinoAnimationDefinition =
  CharacterAnimationDefinition<PinoAnimationState>;

export type PinoAnimationSelectorInput = {
  readonly isAlive: boolean;
  readonly isRespawning: boolean;
  readonly isGrounded: boolean;
  readonly velocity: Vector2Like;
  readonly isUsingPrimaryAction: boolean;
  readonly isUsingSecondaryAction: boolean;
};

const MOVEMENT_EPSILON = 1;

function createPlaceholderAnimation(
  key: PinoAnimationKey,
  state: PinoAnimationState,
  frameRate: number,
  repeat: number,
): PinoAnimationDefinition {
  return {
    key,
    state,
    playback: repeat === -1 ? "loop" : "once",
    frameRate,
    repeat,
    frames: [
      {
        textureKey: PINO_TEXTURE_KEYS.IDLE,
      },
    ],
    isPlaceholder: true,
  };
}

const pinoIdleAnimation = createPlaceholderAnimation(
  PINO_ANIMATION_KEYS.IDLE,
  PINO_ANIMATION_STATES.IDLE,
  1,
  -1,
);
const pinoRunAnimation = createPlaceholderAnimation(
  PINO_ANIMATION_KEYS.RUN,
  PINO_ANIMATION_STATES.RUN,
  8,
  -1,
);
const pinoJumpAnimation = createPlaceholderAnimation(
  PINO_ANIMATION_KEYS.JUMP,
  PINO_ANIMATION_STATES.JUMP,
  1,
  0,
);
const pinoFallAnimation = createPlaceholderAnimation(
  PINO_ANIMATION_KEYS.FALL,
  PINO_ANIMATION_STATES.FALL,
  1,
  0,
);
const pinoDeathAnimation = createPlaceholderAnimation(
  PINO_ANIMATION_KEYS.DEATH,
  PINO_ANIMATION_STATES.DEATH,
  12,
  0,
);
const pinoRespawnAnimation = createPlaceholderAnimation(
  PINO_ANIMATION_KEYS.RESPAWN,
  PINO_ANIMATION_STATES.RESPAWN,
  12,
  0,
);
const pinoPrimaryActionAnimation = createPlaceholderAnimation(
  PINO_ANIMATION_KEYS.PRIMARY_ACTION,
  PINO_ANIMATION_STATES.PRIMARY_ACTION,
  16,
  0,
);
const pinoSecondaryActionAnimation = createPlaceholderAnimation(
  PINO_ANIMATION_KEYS.SECONDARY_ACTION,
  PINO_ANIMATION_STATES.SECONDARY_ACTION,
  8,
  0,
);

export const PINO_ANIMATIONS = [
  pinoIdleAnimation,
  pinoRunAnimation,
  pinoJumpAnimation,
  pinoFallAnimation,
  pinoDeathAnimation,
  pinoRespawnAnimation,
  pinoPrimaryActionAnimation,
  pinoSecondaryActionAnimation,
] as const satisfies readonly PinoAnimationDefinition[];

export const PINO_ANIMATION_BY_STATE = {
  [PINO_ANIMATION_STATES.IDLE]: pinoIdleAnimation,
  [PINO_ANIMATION_STATES.RUN]: pinoRunAnimation,
  [PINO_ANIMATION_STATES.JUMP]: pinoJumpAnimation,
  [PINO_ANIMATION_STATES.FALL]: pinoFallAnimation,
  [PINO_ANIMATION_STATES.DEATH]: pinoDeathAnimation,
  [PINO_ANIMATION_STATES.RESPAWN]: pinoRespawnAnimation,
  [PINO_ANIMATION_STATES.PRIMARY_ACTION]: pinoPrimaryActionAnimation,
  [PINO_ANIMATION_STATES.SECONDARY_ACTION]: pinoSecondaryActionAnimation,
} as const satisfies Record<PinoAnimationState, PinoAnimationDefinition>;

export function selectPinoAnimationState(
  input: PinoAnimationSelectorInput,
): PinoAnimationState {
  if (input.isRespawning) {
    return PINO_ANIMATION_STATES.RESPAWN;
  }

  if (!input.isAlive) {
    return PINO_ANIMATION_STATES.DEATH;
  }

  if (input.isUsingPrimaryAction) {
    return PINO_ANIMATION_STATES.PRIMARY_ACTION;
  }

  if (input.isUsingSecondaryAction) {
    return PINO_ANIMATION_STATES.SECONDARY_ACTION;
  }

  if (!input.isGrounded) {
    return input.velocity.y < 0
      ? PINO_ANIMATION_STATES.JUMP
      : PINO_ANIMATION_STATES.FALL;
  }

  if (Math.abs(input.velocity.x) > MOVEMENT_EPSILON) {
    return PINO_ANIMATION_STATES.RUN;
  }

  return PINO_ANIMATION_STATES.IDLE;
}

export function selectPinoAnimationDefinition(
  input: PinoAnimationSelectorInput,
): PinoAnimationDefinition {
  return PINO_ANIMATION_BY_STATE[selectPinoAnimationState(input)];
}
