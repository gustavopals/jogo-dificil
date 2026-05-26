import type { CharacterAnimationDefinition, Vector2Like } from "../../shared";

export const PINO_TEXTURE_KEYS = {
  IDLE: "player-pino-idle",
  RUN_01: "player-pino-run-01",
  RUN_02: "player-pino-run-02",
  JUMP: "player-pino-jump",
  FALL: "player-pino-fall",
  DEATH_01: "player-pino-death-01",
  DEATH_02: "player-pino-death-02",
  RESPAWN_01: "player-pino-respawn-01",
  RESPAWN_02: "player-pino-respawn-02",
} as const;

export type PinoTextureKey =
  (typeof PINO_TEXTURE_KEYS)[keyof typeof PINO_TEXTURE_KEYS];

export const PINO_SPRITE_SIZE_PX = {
  width: 12,
  height: 24,
} as const;

export type PinoSpriteAssetDefinition = {
  readonly key: PinoTextureKey;
  readonly path: `assets/sprites/${string}.png`;
  readonly sizePx: typeof PINO_SPRITE_SIZE_PX;
  readonly description: string;
  readonly origin: "Gerado no projeto com magick";
  readonly license: "Original do projeto";
};

export const PINO_SPRITE_ASSETS = [
  {
    key: PINO_TEXTURE_KEYS.IDLE,
    path: "assets/sprites/player-pino-idle.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description: "Pose idle de Pino, com corpo amarelo e visor frontal.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.RUN_01,
    path: "assets/sprites/player-pino-run-01.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description: "Frame 1 de corrida de Pino, corpo inclinado para frente.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.RUN_02,
    path: "assets/sprites/player-pino-run-02.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description: "Frame 2 de corrida de Pino, troca de apoio dos pes.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.JUMP,
    path: "assets/sprites/player-pino-jump.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description: "Pose de pulo de Pino, silhueta esticada para cima.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.FALL,
    path: "assets/sprites/player-pino-fall.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description: "Pose de queda de Pino, visor baixo e pes soltos.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.DEATH_01,
    path: "assets/sprites/player-pino-death-01.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description: "Frame 1 de morte de Pino, impacto vermelho comprimido.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.DEATH_02,
    path: "assets/sprites/player-pino-death-02.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description: "Frame 2 de morte de Pino, corpo quebrado e baixo.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.RESPAWN_01,
    path: "assets/sprites/player-pino-respawn-01.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description: "Frame 1 de respawn de Pino, silhueta em varredura ciano.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.RESPAWN_02,
    path: "assets/sprites/player-pino-respawn-02.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description: "Frame 2 de respawn de Pino, corpo reconstruido.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
] as const satisfies readonly PinoSpriteAssetDefinition[];

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
  CharacterAnimationDefinition<PinoAnimationState> & {
    readonly key: PinoAnimationKey;
  };

export type PinoAnimationSelectorInput = {
  readonly isAlive: boolean;
  readonly isRespawning: boolean;
  readonly isGrounded: boolean;
  readonly velocity: Vector2Like;
  readonly isUsingPrimaryAction: boolean;
  readonly isUsingSecondaryAction: boolean;
};

const MOVEMENT_EPSILON = 1;

type CreatePinoAnimationConfig = {
  readonly key: PinoAnimationKey;
  readonly state: PinoAnimationState;
  readonly frameRate: number;
  readonly repeat: number;
  readonly frames: readonly PinoTextureKey[];
  readonly isPlaceholder: boolean;
};

function createPinoAnimation(
  config: CreatePinoAnimationConfig,
): PinoAnimationDefinition {
  return {
    key: config.key,
    state: config.state,
    playback: config.repeat === -1 ? "loop" : "once",
    frameRate: config.frameRate,
    repeat: config.repeat,
    frames: config.frames.map((textureKey) => ({
      textureKey,
    })),
    isPlaceholder: config.isPlaceholder,
  };
}

const pinoIdleAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.IDLE,
  state: PINO_ANIMATION_STATES.IDLE,
  frameRate: 1,
  repeat: -1,
  frames: [PINO_TEXTURE_KEYS.IDLE],
  isPlaceholder: false,
});
const pinoRunAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.RUN,
  state: PINO_ANIMATION_STATES.RUN,
  frameRate: 8,
  repeat: -1,
  frames: [PINO_TEXTURE_KEYS.RUN_01, PINO_TEXTURE_KEYS.RUN_02],
  isPlaceholder: false,
});
const pinoJumpAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.JUMP,
  state: PINO_ANIMATION_STATES.JUMP,
  frameRate: 1,
  repeat: 0,
  frames: [PINO_TEXTURE_KEYS.JUMP],
  isPlaceholder: false,
});
const pinoFallAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.FALL,
  state: PINO_ANIMATION_STATES.FALL,
  frameRate: 1,
  repeat: 0,
  frames: [PINO_TEXTURE_KEYS.FALL],
  isPlaceholder: false,
});
const pinoDeathAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.DEATH,
  state: PINO_ANIMATION_STATES.DEATH,
  frameRate: 10,
  repeat: 0,
  frames: [PINO_TEXTURE_KEYS.DEATH_01, PINO_TEXTURE_KEYS.DEATH_02],
  isPlaceholder: false,
});
const pinoRespawnAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.RESPAWN,
  state: PINO_ANIMATION_STATES.RESPAWN,
  frameRate: 12,
  repeat: 0,
  frames: [
    PINO_TEXTURE_KEYS.RESPAWN_01,
    PINO_TEXTURE_KEYS.RESPAWN_02,
    PINO_TEXTURE_KEYS.IDLE,
  ],
  isPlaceholder: false,
});
const pinoPrimaryActionAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.PRIMARY_ACTION,
  state: PINO_ANIMATION_STATES.PRIMARY_ACTION,
  frameRate: 16,
  repeat: 0,
  frames: [PINO_TEXTURE_KEYS.RUN_01, PINO_TEXTURE_KEYS.RUN_02],
  isPlaceholder: true,
});
const pinoSecondaryActionAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.SECONDARY_ACTION,
  state: PINO_ANIMATION_STATES.SECONDARY_ACTION,
  frameRate: 8,
  repeat: 0,
  frames: [PINO_TEXTURE_KEYS.IDLE],
  isPlaceholder: true,
});

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
