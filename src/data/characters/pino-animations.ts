import type { CharacterAnimationDefinition, Vector2Like } from "../../shared";

export const PINO_TEXTURE_KEYS = {
  IDLE: "player-pino-idle",
  RUN_01: "player-pino-run-01",
  RUN_02: "player-pino-run-02",
  RUN_03: "player-pino-run-03",
  JUMP: "player-pino-jump",
  JUMP_PEAK: "player-pino-jump-peak",
  FALL: "player-pino-fall",
  DASH: "player-pino-dash",
  CHARGE_01: "player-pino-charge-01",
  CHARGE_02: "player-pino-charge-02",
  CYAN_SPARK_01: "player-pino-cyan-spark-01",
  CYAN_SPARK_02: "player-pino-cyan-spark-02",
  CYAN_BURST_PREPARE_01: "player-pino-cyan-burst-prepare-01",
  CYAN_BURST_PREPARE_02: "player-pino-cyan-burst-prepare-02",
  CYAN_BURST_FIRE_01: "player-pino-cyan-burst-fire-01",
  CYAN_BURST_FIRE_02: "player-pino-cyan-burst-fire-02",
  DEATH_01: "player-pino-death-01",
  DEATH_02: "player-pino-death-02",
  RESPAWN_01: "player-pino-respawn-01",
  RESPAWN_02: "player-pino-respawn-02",
} as const;

export type PinoTextureKey =
  (typeof PINO_TEXTURE_KEYS)[keyof typeof PINO_TEXTURE_KEYS];

export const PINO_SPRITE_SIZE_PX = {
  width: 14,
  height: 26,
} as const;

export const PINO_HITBOX_SIZE_PX = {
  width: 10,
  height: 22,
} as const;

export type PinoSpriteAssetDefinition = {
  readonly key: PinoTextureKey;
  readonly path: `assets/sprites/${string}.png`;
  readonly sizePx: typeof PINO_SPRITE_SIZE_PX;
  readonly description: string;
  readonly origin: "Gerado no projeto por script";
  readonly license: "Original do projeto";
};

export const PINO_SPRITE_ASSETS = [
  {
    key: PINO_TEXTURE_KEYS.IDLE,
    path: "assets/sprites/player-pino-idle.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Pose idle de Pino, agora como lutador shonen original com cabelo espetado e aura baixa.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.RUN_01,
    path: "assets/sprites/player-pino-run-01.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 1 de corrida de Pino, corpo inclinado e braço armado para impulso.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.RUN_02,
    path: "assets/sprites/player-pino-run-02.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 2 de corrida de Pino, troca de apoio com cabelo e faixa em atraso.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.RUN_03,
    path: "assets/sprites/player-pino-run-03.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 3 de corrida de Pino, passada baixa com energia ciano no calcanhar.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.JUMP,
    path: "assets/sprites/player-pino-jump.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Pose de pulo de Pino, joelho alto, cabelo vertical e energia saindo dos pes.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.JUMP_PEAK,
    path: "assets/sprites/player-pino-jump-peak.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame de ápice do pulo de Pino, pose compacta com aura ciano ao redor.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.FALL,
    path: "assets/sprites/player-pino-fall.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Pose de queda de Pino, braços abertos e cabelo puxado para cima pela descida.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.DASH,
    path: "assets/sprites/player-pino-dash.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Pose de dash de Pino, corpo horizontal com rastro de aura e faixa atrasada.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.CHARGE_01,
    path: "assets/sprites/player-pino-charge-01.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 1 da Carga Ciano de Pino, pose firme com aura baixa e uma mao energizada.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.CHARGE_02,
    path: "assets/sprites/player-pino-charge-02.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 2 da Carga Ciano de Pino, postura comprimida com faixas de energia ciano nos pes.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_SPARK_01,
    path: "assets/sprites/player-pino-cyan-spark-01.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 1 de Pino disparando Centelha Ciano, braco estendido e faisca curta na mao.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_SPARK_02,
    path: "assets/sprites/player-pino-cyan-spark-02.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 2 de Pino disparando Centelha Ciano, recuo compacto e pulso ciano no punho.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_01,
    path: "assets/sprites/player-pino-cyan-burst-prepare-01.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 1 de Pino preparando Rajada Ciano, energia segmentada crescendo no punho.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_02,
    path: "assets/sprites/player-pino-cyan-burst-prepare-02.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 2 de Pino preparando Rajada Ciano, postura comprimida e nucleo ciano maior.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_01,
    path: "assets/sprites/player-pino-cyan-burst-fire-01.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 1 de Pino soltando Rajada Ciano, braco estendido e inicio curto do feixe.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_02,
    path: "assets/sprites/player-pino-cyan-burst-fire-02.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 2 de Pino soltando Rajada Ciano, recuo do corpo e feixe segmentado no punho.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.DEATH_01,
    path: "assets/sprites/player-pino-death-01.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 1 de morte de Pino, impacto vermelho quebrando a aura do lutador.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.DEATH_02,
    path: "assets/sprites/player-pino-death-02.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 2 de morte de Pino, silhueta baixa com cabelo e faixa desfeitos.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.RESPAWN_01,
    path: "assets/sprites/player-pino-respawn-01.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 1 de respawn de Pino, silhueta shonen reconstruida por varredura ciano.",
    origin: "Gerado no projeto por script",
    license: "Original do projeto",
  },
  {
    key: PINO_TEXTURE_KEYS.RESPAWN_02,
    path: "assets/sprites/player-pino-respawn-02.png",
    sizePx: PINO_SPRITE_SIZE_PX,
    description:
      "Frame 2 de respawn de Pino, pose firme com aura e cabelo ja reconstruidos.",
    origin: "Gerado no projeto por script",
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
  CYAN_CHARGE: "cyan-charge",
  CYAN_SPARK: "cyan-spark",
  CYAN_BURST_PREPARE: "cyan-burst-prepare",
  CYAN_BURST_FIRE: "cyan-burst-fire",
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
  CYAN_CHARGE: "pino:cyan-charge",
  CYAN_SPARK: "pino:cyan-spark",
  CYAN_BURST_PREPARE: "pino:cyan-burst-prepare",
  CYAN_BURST_FIRE: "pino:cyan-burst-fire",
} as const;

export type PinoAnimationKey =
  (typeof PINO_ANIMATION_KEYS)[keyof typeof PINO_ANIMATION_KEYS];

export type PinoAnimationDefinition =
  CharacterAnimationDefinition<PinoAnimationState> & {
    readonly key: PinoAnimationKey;
    readonly hitboxPx: typeof PINO_HITBOX_SIZE_PX;
  };

export const PINO_POWER_ANIMATION_MODES = {
  NONE: "none",
  CYAN_CHARGE: "cyan-charge",
  CYAN_SPARK: "cyan-spark",
  CYAN_BURST_PREPARE: "cyan-burst-prepare",
  CYAN_BURST_FIRE: "cyan-burst-fire",
} as const;

export type PinoPowerAnimationMode =
  (typeof PINO_POWER_ANIMATION_MODES)[keyof typeof PINO_POWER_ANIMATION_MODES];

export type PinoAnimationSelectorInput = {
  readonly isAlive: boolean;
  readonly isRespawning: boolean;
  readonly isGrounded: boolean;
  readonly velocity: Vector2Like;
  readonly isUsingPrimaryAction: boolean;
  readonly isUsingSecondaryAction: boolean;
  readonly powerAnimationMode?: PinoPowerAnimationMode;
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
    hitboxPx: PINO_HITBOX_SIZE_PX,
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
  frameRate: 12,
  repeat: -1,
  frames: [
    PINO_TEXTURE_KEYS.RUN_01,
    PINO_TEXTURE_KEYS.RUN_02,
    PINO_TEXTURE_KEYS.RUN_03,
  ],
  isPlaceholder: false,
});
const pinoJumpAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.JUMP,
  state: PINO_ANIMATION_STATES.JUMP,
  frameRate: 10,
  repeat: -1,
  frames: [PINO_TEXTURE_KEYS.JUMP, PINO_TEXTURE_KEYS.JUMP_PEAK],
  isPlaceholder: false,
});
const pinoFallAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.FALL,
  state: PINO_ANIMATION_STATES.FALL,
  frameRate: 8,
  repeat: -1,
  frames: [PINO_TEXTURE_KEYS.JUMP_PEAK, PINO_TEXTURE_KEYS.FALL],
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
  frameRate: 18,
  repeat: 0,
  frames: [PINO_TEXTURE_KEYS.DASH],
  isPlaceholder: false,
});
const pinoSecondaryActionAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.SECONDARY_ACTION,
  state: PINO_ANIMATION_STATES.SECONDARY_ACTION,
  frameRate: 8,
  repeat: 0,
  frames: [PINO_TEXTURE_KEYS.IDLE],
  isPlaceholder: true,
});
const pinoCyanChargeAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.CYAN_CHARGE,
  state: PINO_ANIMATION_STATES.CYAN_CHARGE,
  frameRate: 8,
  repeat: -1,
  frames: [PINO_TEXTURE_KEYS.CHARGE_01, PINO_TEXTURE_KEYS.CHARGE_02],
  isPlaceholder: false,
});
const pinoCyanSparkAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.CYAN_SPARK,
  state: PINO_ANIMATION_STATES.CYAN_SPARK,
  frameRate: 18,
  repeat: 0,
  frames: [PINO_TEXTURE_KEYS.CYAN_SPARK_01, PINO_TEXTURE_KEYS.CYAN_SPARK_02],
  isPlaceholder: false,
});
const pinoCyanBurstPrepareAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.CYAN_BURST_PREPARE,
  state: PINO_ANIMATION_STATES.CYAN_BURST_PREPARE,
  frameRate: 8,
  repeat: -1,
  frames: [
    PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_01,
    PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_02,
  ],
  isPlaceholder: false,
});
const pinoCyanBurstFireAnimation = createPinoAnimation({
  key: PINO_ANIMATION_KEYS.CYAN_BURST_FIRE,
  state: PINO_ANIMATION_STATES.CYAN_BURST_FIRE,
  frameRate: 14,
  repeat: -1,
  frames: [
    PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_01,
    PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_02,
  ],
  isPlaceholder: false,
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
  pinoCyanChargeAnimation,
  pinoCyanSparkAnimation,
  pinoCyanBurstPrepareAnimation,
  pinoCyanBurstFireAnimation,
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
  [PINO_ANIMATION_STATES.CYAN_CHARGE]: pinoCyanChargeAnimation,
  [PINO_ANIMATION_STATES.CYAN_SPARK]: pinoCyanSparkAnimation,
  [PINO_ANIMATION_STATES.CYAN_BURST_PREPARE]: pinoCyanBurstPrepareAnimation,
  [PINO_ANIMATION_STATES.CYAN_BURST_FIRE]: pinoCyanBurstFireAnimation,
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

  const powerAnimationState = getPinoPowerAnimationState(
    input.powerAnimationMode ?? PINO_POWER_ANIMATION_MODES.NONE,
  );

  if (
    powerAnimationState === PINO_ANIMATION_STATES.CYAN_BURST_PREPARE ||
    powerAnimationState === PINO_ANIMATION_STATES.CYAN_BURST_FIRE
  ) {
    return powerAnimationState;
  }

  if (input.isUsingPrimaryAction) {
    return PINO_ANIMATION_STATES.PRIMARY_ACTION;
  }

  if (powerAnimationState) {
    return powerAnimationState;
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

function getPinoPowerAnimationState(
  mode: PinoPowerAnimationMode,
): PinoAnimationState | undefined {
  switch (mode) {
    case PINO_POWER_ANIMATION_MODES.CYAN_CHARGE:
      return PINO_ANIMATION_STATES.CYAN_CHARGE;
    case PINO_POWER_ANIMATION_MODES.CYAN_SPARK:
      return PINO_ANIMATION_STATES.CYAN_SPARK;
    case PINO_POWER_ANIMATION_MODES.CYAN_BURST_PREPARE:
      return PINO_ANIMATION_STATES.CYAN_BURST_PREPARE;
    case PINO_POWER_ANIMATION_MODES.CYAN_BURST_FIRE:
      return PINO_ANIMATION_STATES.CYAN_BURST_FIRE;
    case PINO_POWER_ANIMATION_MODES.NONE:
      return undefined;
  }
}
