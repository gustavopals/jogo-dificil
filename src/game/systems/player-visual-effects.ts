import type { FacingDirection, Vector2Like } from "../../shared";

export type PlayerEnergyMode =
  | "idle"
  | "run"
  | "jump"
  | "fall"
  | "dash"
  | "death"
  | "respawn";

export type PlayerAuraConfig = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly color: number;
  readonly alpha: number;
};

export type PlayerBurstParticle = {
  readonly x: number;
  readonly y: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly width: number;
  readonly height: number;
  readonly color: number;
  readonly alpha: number;
  readonly durationMs: number;
};

export const PLAYER_EFFECT_DEPTHS = {
  aura: 3,
  trail: 5,
  burst: 6,
  sprite: 7,
} as const;

export const PLAYER_DASH_TRAIL_INTERVAL_MS = 38;
export const PLAYER_RUN_SPARK_INTERVAL_MS = 90;
export const PLAYER_RUN_SPARK_SPEED_THRESHOLD = 90;

const ENERGY_COLOR = 0x80d7c2;
const ENERGY_HOT_COLOR = 0xf4d35e;
const IMPACT_COLOR = 0xe35d6a;
const WHITE_COLOR = 0xf5f7fb;

const AURA_BY_MODE = {
  idle: { width: 17, height: 26, yOffset: -13, alpha: 0.09 },
  run: { width: 20, height: 23, yOffset: -12, alpha: 0.14 },
  jump: { width: 18, height: 33, yOffset: -17, alpha: 0.22 },
  fall: { width: 21, height: 28, yOffset: -14, alpha: 0.16 },
  dash: { width: 31, height: 18, yOffset: -13, alpha: 0.3 },
  death: { width: 25, height: 19, yOffset: -10, alpha: 0.2 },
  respawn: { width: 22, height: 34, yOffset: -16, alpha: 0.28 },
} as const satisfies Record<
  PlayerEnergyMode,
  {
    readonly width: number;
    readonly height: number;
    readonly yOffset: number;
    readonly alpha: number;
  }
>;

export function getPlayerAuraConfig(
  position: Vector2Like,
  mode: PlayerEnergyMode,
): PlayerAuraConfig {
  const aura = AURA_BY_MODE[mode];

  return {
    x: position.x,
    y: position.y + aura.yOffset,
    width: aura.width,
    height: aura.height,
    color: mode === "death" ? IMPACT_COLOR : ENERGY_COLOR,
    alpha: aura.alpha,
  };
}

export function resolvePlayerEnergyMode(input: {
  readonly isAlive: boolean;
  readonly isRespawning: boolean;
  readonly isGrounded: boolean;
  readonly isDashing: boolean;
  readonly velocity: Vector2Like;
}): PlayerEnergyMode {
  if (input.isRespawning) {
    return "respawn";
  }

  if (!input.isAlive) {
    return "death";
  }

  if (input.isDashing) {
    return "dash";
  }

  if (!input.isGrounded) {
    return input.velocity.y < 0 ? "jump" : "fall";
  }

  return Math.abs(input.velocity.x) > PLAYER_RUN_SPARK_SPEED_THRESHOLD
    ? "run"
    : "idle";
}

export function shouldEmitTimedEffect(input: {
  readonly nowMs: number;
  readonly lastEmitMs: number;
  readonly intervalMs: number;
}): boolean {
  return input.nowMs - input.lastEmitMs >= input.intervalMs;
}

export function createJumpBurstParticles(
  position: Vector2Like,
): readonly PlayerBurstParticle[] {
  return [
    createBurstParticle(position, -7, 0, -12, 4, 6, 2, ENERGY_COLOR, 0.54, 180),
    createBurstParticle(position, 0, 1, 0, 8, 5, 2, WHITE_COLOR, 0.5, 150),
    createBurstParticle(position, 7, 0, 12, 4, 6, 2, ENERGY_COLOR, 0.54, 180),
  ];
}

export function createLandingBurstParticles(
  position: Vector2Like,
): readonly PlayerBurstParticle[] {
  return [
    createBurstParticle(
      position,
      -8,
      0,
      -14,
      3,
      7,
      2,
      ENERGY_HOT_COLOR,
      0.42,
      160,
    ),
    createBurstParticle(position, 0, 1, 0, 5, 6, 2, WHITE_COLOR, 0.32, 130),
    createBurstParticle(
      position,
      8,
      0,
      14,
      3,
      7,
      2,
      ENERGY_HOT_COLOR,
      0.42,
      160,
    ),
  ];
}

export function createRunSparkParticle(
  position: Vector2Like,
  facing: FacingDirection,
): PlayerBurstParticle {
  const direction = facing === "left" ? 1 : -1;

  return createBurstParticle(
    position,
    direction * 8,
    -2,
    direction * 14,
    -5,
    4,
    2,
    ENERGY_COLOR,
    0.38,
    170,
  );
}

export function getDashGhostOffset(facing: FacingDirection): Vector2Like {
  const direction = facing === "left" ? 1 : -1;

  return {
    x: direction * 8,
    y: -1,
  };
}

function createBurstParticle(
  position: Vector2Like,
  x: number,
  y: number,
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  color: number,
  alpha: number,
  durationMs: number,
): PlayerBurstParticle {
  return {
    x: position.x + x,
    y: position.y + y,
    offsetX,
    offsetY,
    width,
    height,
    color,
    alpha,
    durationMs,
  };
}
