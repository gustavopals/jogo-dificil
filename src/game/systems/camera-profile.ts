import type { LevelDefinition, Vector2Like } from "../../shared";
import { GAME_RESOLUTION } from "../constants";
import { scaleLegacyX, scaleLegacyY } from "../scale";

export type LevelCameraProfile = {
  readonly deadzoneWidth: number;
  readonly deadzoneHeight: number;
  readonly followLerpX: number;
  readonly followLerpY: number;
  readonly lookAheadMaxX: number;
  readonly lookAheadMaxY: number;
};

export function getLevelCameraProfile(
  level: Pick<LevelDefinition, "bounds" | "difficulty" | "bosses">,
): LevelCameraProfile {
  const normalizedDifficulty = clamp01((level.difficulty - 1) / 9);
  const hasBossArena = (level.bosses?.length ?? 0) > 0;
  const baseDeadzoneWidth = scaleLegacyX(160);
  const baseDeadzoneHeight = scaleLegacyY(96);
  const deadzoneWidth = clamp(
    Math.round(baseDeadzoneWidth - scaleLegacyX(44) * normalizedDifficulty),
    scaleLegacyX(96),
    Math.min(level.bounds.width, GAME_RESOLUTION.width),
  );
  const deadzoneHeight = clamp(
    Math.round(baseDeadzoneHeight - scaleLegacyY(24) * normalizedDifficulty),
    scaleLegacyY(64),
    Math.min(level.bounds.height, GAME_RESOLUTION.height),
  );

  return {
    deadzoneWidth,
    deadzoneHeight,
    followLerpX: hasBossArena
      ? 0.22
      : 0.14 + normalizedDifficulty * 0.14,
    followLerpY: hasBossArena
      ? 0.2
      : 0.12 + normalizedDifficulty * 0.1,
    lookAheadMaxX: hasBossArena
      ? scaleLegacyX(80)
      : Math.round(scaleLegacyX(44) + scaleLegacyX(28) * normalizedDifficulty),
    lookAheadMaxY: hasBossArena
      ? scaleLegacyY(24)
      : Math.round(scaleLegacyY(12) + scaleLegacyY(10) * normalizedDifficulty),
  };
}

export function resolveCameraLookAhead(
  velocity: Vector2Like,
  profile: Pick<LevelCameraProfile, "lookAheadMaxX" | "lookAheadMaxY">,
): Vector2Like {
  const velocityXRatio = clamp01(Math.abs(velocity.x) / 240);
  const velocityYRatio = clamp01(Math.abs(velocity.y) / 540);

  return {
    x: Math.sign(velocity.x) * profile.lookAheadMaxX * velocityXRatio,
    y: Math.sign(velocity.y) * profile.lookAheadMaxY * velocityYRatio,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}
