import type { FacingDirection, Vector2Like } from "../../shared";
import {
  DEPTH_LAYERS,
  VISUAL_READABILITY_SEMANTIC_COLORS,
  clampWideEffectAlpha,
} from "./visual-readability";
import { scaleLegacyX, scaleLegacyY } from "../scale";

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
  aura: DEPTH_LAYERS.playerAura,
  trail: DEPTH_LAYERS.playerTrail,
  burst: DEPTH_LAYERS.playerBurst,
  sprite: DEPTH_LAYERS.player,
  energyShot: DEPTH_LAYERS.energyEffect,
} as const;

export const PLAYER_DASH_TRAIL_INTERVAL_MS = 38;
export const PLAYER_RUN_SPARK_INTERVAL_MS = 90;
export const PLAYER_RUN_SPARK_SPEED_THRESHOLD = 90;

const ENERGY_COLOR = VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary;
const ENERGY_HOT_COLOR = VISUAL_READABILITY_SEMANTIC_COLORS.energy.charged;
const IMPACT_COLOR = VISUAL_READABILITY_SEMANTIC_COLORS.energy.failure;
const WHITE_COLOR = 0xf5f7fb;
const sx = (value: number) => scaleLegacyX(value);
const sy = (value: number) => scaleLegacyY(value);

const AURA_BY_MODE = {
  idle: { width: sx(17), height: sy(26), yOffset: -sy(13), alpha: 0.09 },
  run: { width: sx(20), height: sy(23), yOffset: -sy(12), alpha: 0.14 },
  jump: { width: sx(18), height: sy(33), yOffset: -sy(17), alpha: 0.22 },
  fall: { width: sx(21), height: sy(28), yOffset: -sy(14), alpha: 0.16 },
  dash: { width: sx(31), height: sy(18), yOffset: -sy(13), alpha: 0.3 },
  death: { width: sx(25), height: sy(19), yOffset: -sy(10), alpha: 0.2 },
  respawn: { width: sx(22), height: sy(34), yOffset: -sy(16), alpha: 0.28 },
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
    createBurstParticle(
      position,
      -sx(7),
      0,
      -sx(12),
      sy(4),
      sx(6),
      sy(2),
      ENERGY_COLOR,
      0.54,
      180,
    ),
    createBurstParticle(
      position,
      0,
      sy(1),
      0,
      sy(8),
      sx(5),
      sy(2),
      WHITE_COLOR,
      0.5,
      150,
    ),
    createBurstParticle(
      position,
      sx(7),
      0,
      sx(12),
      sy(4),
      sx(6),
      sy(2),
      ENERGY_COLOR,
      0.54,
      180,
    ),
  ];
}

export function createLandingBurstParticles(
  position: Vector2Like,
): readonly PlayerBurstParticle[] {
  return [
    createBurstParticle(
      position,
      -sx(8),
      0,
      -sx(14),
      sy(3),
      sx(7),
      sy(2),
      ENERGY_HOT_COLOR,
      0.42,
      160,
    ),
    createBurstParticle(
      position,
      0,
      sy(1),
      0,
      sy(5),
      sx(6),
      sy(2),
      WHITE_COLOR,
      0.32,
      130,
    ),
    createBurstParticle(
      position,
      sx(8),
      0,
      sx(14),
      sy(3),
      sx(7),
      sy(2),
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
    direction * sx(8),
    -sy(2),
    direction * sx(14),
    -sy(5),
    sx(4),
    sy(2),
    ENERGY_COLOR,
    0.38,
    170,
  );
}

export function createInsufficientEnergyParticles(
  position: Vector2Like,
  facing: FacingDirection,
): readonly PlayerBurstParticle[] {
  const direction = facing === "left" ? -1 : 1;

  return [
    createBurstParticle(
      position,
      direction * sx(11),
      -sy(15),
      direction * sx(5),
      -sy(4),
      sx(4),
      sy(2),
      IMPACT_COLOR,
      0.68,
      130,
    ),
    createBurstParticle(
      position,
      direction * sx(8),
      -sy(12),
      -direction * sx(5),
      sy(1),
      sx(2),
      sy(2),
      WHITE_COLOR,
      0.46,
      110,
    ),
    createBurstParticle(
      position,
      direction * sx(13),
      -sy(9),
      direction * sx(3),
      sy(5),
      sx(5),
      sy(2),
      ENERGY_HOT_COLOR,
      0.36,
      145,
    ),
  ];
}

export function createCyanBurstPreparationParticles(
  position: Vector2Like,
  facing: FacingDirection,
): readonly PlayerBurstParticle[] {
  const direction = facing === "left" ? -1 : 1;

  return [
    createBurstParticle(
      position,
      direction * sx(10),
      -sy(15),
      direction * sx(8),
      -sy(7),
      sx(5),
      sy(2),
      ENERGY_COLOR,
      0.64,
      190,
    ),
    createBurstParticle(
      position,
      direction * sx(5),
      -sy(18),
      direction * sx(2),
      -sy(10),
      sx(3),
      sy(3),
      WHITE_COLOR,
      0.52,
      170,
    ),
    createBurstParticle(
      position,
      direction * sx(14),
      -sy(11),
      direction * sx(9),
      sy(1),
      sx(6),
      sy(2),
      ENERGY_HOT_COLOR,
      0.3,
      210,
    ),
  ];
}

export function getDashGhostOffset(facing: FacingDirection): Vector2Like {
  const direction = facing === "left" ? 1 : -1;

  return {
    x: direction * sx(8),
    y: -sy(1),
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
    alpha: clampWideEffectAlpha(alpha),
    durationMs,
  };
}
