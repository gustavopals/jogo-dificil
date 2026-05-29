import { describe, expect, it } from "vitest";

import {
  HEAVY_LANDING_SHAKE_MIN_VELOCITY_Y,
  resolveScreenShakeConfig,
  SCREEN_SHAKE_PRESETS,
  shouldTriggerHeavyLandingShake,
} from "../src/game/systems/camera-juice";
import { isJuiceEnabled, isScreenShakeEnabled } from "../src/game/systems/juice-settings";
import { LANDING_AUDIO_MIN_VELOCITY_Y } from "../src/game/systems/player-audio-feedback";

describe("camera juice", () => {
  it("exposes shake presets with increasing intensity", () => {
    const subtle = resolveScreenShakeConfig("subtle");
    const light = resolveScreenShakeConfig("light");
    const medium = resolveScreenShakeConfig("medium");

    expect(subtle.intensity).toBeLessThan(light.intensity);
    expect(light.intensity).toBeLessThan(medium.intensity);
    expect(subtle.durationMs).toBe(SCREEN_SHAKE_PRESETS.subtle.durationMs);
  });

  it("keeps heavy landing shake aligned with landing audio threshold", () => {
    expect(HEAVY_LANDING_SHAKE_MIN_VELOCITY_Y).toBe(LANDING_AUDIO_MIN_VELOCITY_Y);
    expect(shouldTriggerHeavyLandingShake(LANDING_AUDIO_MIN_VELOCITY_Y - 1)).toBe(
      false,
    );
    expect(shouldTriggerHeavyLandingShake(LANDING_AUDIO_MIN_VELOCITY_Y)).toBe(
      true,
    );
  });

  it("keeps juice flags enabled by default", () => {
    expect(isJuiceEnabled()).toBe(true);
    expect(isScreenShakeEnabled()).toBe(true);
  });
});
