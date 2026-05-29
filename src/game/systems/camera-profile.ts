import type { LevelDefinition, Vector2Like } from "../../shared";
import { GAME_RESOLUTION } from "../constants";
import { scaleLegacyX, scaleLegacyY } from "../scale";

// Zoom aplicado à câmera durante o gameplay para tornar Pino e chefões
// mais visíveis. Reduz a área visível de 960×540 para 640×360 (20×11 tiles).
export const GAMEPLAY_CAMERA_ZOOM = 1.5;

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
  const baseDeadzoneWidth = scaleLegacyX(60);    // 120px — ~19% do viewport 640px
  const baseDeadzoneHeight = scaleLegacyY(40);   // 80px  — ~22% do viewport 360px
  const deadzoneWidth = clamp(
    Math.round(baseDeadzoneWidth - scaleLegacyX(16) * normalizedDifficulty),
    scaleLegacyX(40),
    Math.min(level.bounds.width, GAME_RESOLUTION.width),
  );
  const deadzoneHeight = clamp(
    Math.round(baseDeadzoneHeight - scaleLegacyY(8) * normalizedDifficulty),
    scaleLegacyY(28),
    Math.min(level.bounds.height, GAME_RESOLUTION.height),
  );

  return {
    deadzoneWidth,
    deadzoneHeight,
    followLerpX: hasBossArena
      ? 0.22
      : 0.10 + normalizedDifficulty * 0.10,
    followLerpY: hasBossArena
      ? 0.2
      : 0.09 + normalizedDifficulty * 0.09,
    lookAheadMaxX: hasBossArena
      ? scaleLegacyX(120)
      : Math.round(scaleLegacyX(72) + scaleLegacyX(20) * normalizedDifficulty),
    lookAheadMaxY: hasBossArena
      ? scaleLegacyY(24)
      : Math.round(scaleLegacyY(16) + scaleLegacyY(6) * normalizedDifficulty),
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
