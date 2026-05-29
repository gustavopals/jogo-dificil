import {
  SPRITESHEET_CELL_SIZE_PX,
  type SpritesheetAssetDefinition,
} from "../art";

export const PINO_SPRITESHEET_KEYS = {
  CORE_512: "player-pino-core-512",
  ENERGY_512: "player-pino-energy-512",
} as const;

export type PinoSpritesheetKey =
  (typeof PINO_SPRITESHEET_KEYS)[keyof typeof PINO_SPRITESHEET_KEYS];

export const PINO_SPRITESHEET_ASSETS = [
  {
    key: PINO_SPRITESHEET_KEYS.CORE_512,
    path: "assets/spritesheets/player-pino-core-512.png",
    sheetSizePx: 512,
    frameWidth: SPRITESHEET_CELL_SIZE_PX,
    frameHeight: SPRITESHEET_CELL_SIZE_PX,
    purpose: "player",
    enabled: true,
    description:
      "Sheet 512 do Pino para locomocao e estados basicos em celulas 128x128.",
  },
  {
    key: PINO_SPRITESHEET_KEYS.ENERGY_512,
    path: "assets/spritesheets/player-pino-energy-512.png",
    sheetSizePx: 512,
    frameWidth: SPRITESHEET_CELL_SIZE_PX,
    frameHeight: SPRITESHEET_CELL_SIZE_PX,
    purpose: "player",
    enabled: true,
    description:
      "Sheet 512 do Pino para Carga/Centelha/Rajada em celulas 128x128.",
  },
] as const satisfies readonly SpritesheetAssetDefinition[];

export const PINO_FRAME_IDS = {
  IDLE: "idle",
  RUN_01: "run-01",
  RUN_02: "run-02",
  RUN_03: "run-03",
  JUMP: "jump",
  JUMP_PEAK: "jump-peak",
  FALL: "fall",
  DASH: "dash",
  CHARGE_01: "charge-01",
  CHARGE_02: "charge-02",
  CYAN_SPARK_01: "cyan-spark-01",
  CYAN_SPARK_02: "cyan-spark-02",
  CYAN_BURST_PREPARE_01: "cyan-burst-prepare-01",
  CYAN_BURST_PREPARE_02: "cyan-burst-prepare-02",
  CYAN_BURST_FIRE_01: "cyan-burst-fire-01",
  CYAN_BURST_FIRE_02: "cyan-burst-fire-02",
  DEATH_01: "death-01",
  DEATH_02: "death-02",
  RESPAWN_01: "respawn-01",
  RESPAWN_02: "respawn-02",
} as const;

export type PinoFrameId = (typeof PINO_FRAME_IDS)[keyof typeof PINO_FRAME_IDS];

export const PINO_SPRITESHEET_FRAME_REGISTRY = {
  [PINO_FRAME_IDS.IDLE]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 0,
  },
  [PINO_FRAME_IDS.RUN_01]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 1,
  },
  [PINO_FRAME_IDS.RUN_02]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 2,
  },
  [PINO_FRAME_IDS.RUN_03]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 3,
  },
  [PINO_FRAME_IDS.JUMP]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 4,
  },
  [PINO_FRAME_IDS.JUMP_PEAK]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 5,
  },
  [PINO_FRAME_IDS.FALL]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 6,
  },
  [PINO_FRAME_IDS.DASH]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 7,
  },
  [PINO_FRAME_IDS.DEATH_01]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 8,
  },
  [PINO_FRAME_IDS.DEATH_02]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 9,
  },
  [PINO_FRAME_IDS.RESPAWN_01]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 10,
  },
  [PINO_FRAME_IDS.RESPAWN_02]: {
    textureKey: PINO_SPRITESHEET_KEYS.CORE_512,
    frame: 11,
  },
  [PINO_FRAME_IDS.CHARGE_01]: {
    textureKey: PINO_SPRITESHEET_KEYS.ENERGY_512,
    frame: 0,
  },
  [PINO_FRAME_IDS.CHARGE_02]: {
    textureKey: PINO_SPRITESHEET_KEYS.ENERGY_512,
    frame: 1,
  },
  [PINO_FRAME_IDS.CYAN_SPARK_01]: {
    textureKey: PINO_SPRITESHEET_KEYS.ENERGY_512,
    frame: 2,
  },
  [PINO_FRAME_IDS.CYAN_SPARK_02]: {
    textureKey: PINO_SPRITESHEET_KEYS.ENERGY_512,
    frame: 3,
  },
  [PINO_FRAME_IDS.CYAN_BURST_PREPARE_01]: {
    textureKey: PINO_SPRITESHEET_KEYS.ENERGY_512,
    frame: 4,
  },
  [PINO_FRAME_IDS.CYAN_BURST_PREPARE_02]: {
    textureKey: PINO_SPRITESHEET_KEYS.ENERGY_512,
    frame: 5,
  },
  [PINO_FRAME_IDS.CYAN_BURST_FIRE_01]: {
    textureKey: PINO_SPRITESHEET_KEYS.ENERGY_512,
    frame: 6,
  },
  [PINO_FRAME_IDS.CYAN_BURST_FIRE_02]: {
    textureKey: PINO_SPRITESHEET_KEYS.ENERGY_512,
    frame: 7,
  },
} as const satisfies Record<
  PinoFrameId,
  {
    readonly textureKey: PinoSpritesheetKey;
    readonly frame: number;
  }
>;

export const PINO_ANIMATION_FRAME_REGISTRY = {
  idle: [PINO_FRAME_IDS.IDLE],
  run: [PINO_FRAME_IDS.RUN_01, PINO_FRAME_IDS.RUN_02, PINO_FRAME_IDS.RUN_03],
  jump: [PINO_FRAME_IDS.JUMP, PINO_FRAME_IDS.JUMP_PEAK],
  fall: [PINO_FRAME_IDS.JUMP_PEAK, PINO_FRAME_IDS.FALL],
  death: [PINO_FRAME_IDS.DEATH_01, PINO_FRAME_IDS.DEATH_02],
  respawn: [
    PINO_FRAME_IDS.RESPAWN_01,
    PINO_FRAME_IDS.RESPAWN_02,
    PINO_FRAME_IDS.IDLE,
  ],
  "primary-action": [PINO_FRAME_IDS.DASH],
  "secondary-action": [PINO_FRAME_IDS.IDLE],
  "cyan-charge": [PINO_FRAME_IDS.CHARGE_01, PINO_FRAME_IDS.CHARGE_02],
  "cyan-spark": [PINO_FRAME_IDS.CYAN_SPARK_01, PINO_FRAME_IDS.CYAN_SPARK_02],
  "cyan-burst-prepare": [
    PINO_FRAME_IDS.CYAN_BURST_PREPARE_01,
    PINO_FRAME_IDS.CYAN_BURST_PREPARE_02,
  ],
  "cyan-burst-fire": [
    PINO_FRAME_IDS.CYAN_BURST_FIRE_01,
    PINO_FRAME_IDS.CYAN_BURST_FIRE_02,
  ],
} as const;
