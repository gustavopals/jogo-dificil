import type Phaser from "phaser";

import { LANDING_AUDIO_MIN_VELOCITY_Y } from "./player-audio-feedback";
import { isScreenShakeEnabled } from "./juice-settings";

export type ScreenShakePreset = "light" | "medium" | "subtle";

export type ScreenShakeConfig = {
  readonly durationMs: number;
  readonly intensity: number;
};

export const SCREEN_SHAKE_PRESETS = {
  light: {
    durationMs: 120,
    intensity: 0.003,
  },
  medium: {
    durationMs: 180,
    intensity: 0.006,
  },
  subtle: {
    durationMs: 80,
    intensity: 0.0015,
  },
} as const satisfies Record<ScreenShakePreset, ScreenShakeConfig>;

export const HEAVY_LANDING_SHAKE_MIN_VELOCITY_Y = LANDING_AUDIO_MIN_VELOCITY_Y;

export function resolveScreenShakeConfig(
  preset: ScreenShakePreset,
): ScreenShakeConfig {
  return SCREEN_SHAKE_PRESETS[preset];
}

export function shouldTriggerHeavyLandingShake(velocityY: number): boolean {
  return velocityY >= HEAVY_LANDING_SHAKE_MIN_VELOCITY_Y;
}

export function applyScreenShake(
  camera: Phaser.Cameras.Scene2D.Camera,
  preset: ScreenShakePreset,
): void {
  if (!isScreenShakeEnabled()) {
    return;
  }

  const config = resolveScreenShakeConfig(preset);
  camera.shake(config.durationMs, config.intensity);
}
