import { describe, expect, it } from "vitest";

import { PLAYER_EFFECT_DEPTHS } from "../src/game/systems/player-visual-effects";
import {
  VISUAL_READABILITY_DEPTHS,
  VISUAL_READABILITY_LIMITS,
  clampWideEffectAlpha,
  isSmallHazardArea,
} from "../src/game/systems/visual-readability";

describe("visual readability", () => {
  it("keeps direct hazards and trap projectiles above player energy effects", () => {
    expect(VISUAL_READABILITY_DEPTHS.directHazard).toBeGreaterThan(
      PLAYER_EFFECT_DEPTHS.energyShot,
    );
    expect(VISUAL_READABILITY_DEPTHS.trapThreat).toBeGreaterThan(
      PLAYER_EFFECT_DEPTHS.energyShot,
    );
    expect(VISUAL_READABILITY_DEPTHS.trapProjectile).toBeGreaterThan(
      PLAYER_EFFECT_DEPTHS.energyShot,
    );
  });

  it("identifies small hazard areas and clamps wide effect alpha", () => {
    expect(isSmallHazardArea({ width: 16, height: 8 })).toBe(true);
    expect(isSmallHazardArea({ width: 32, height: 24 })).toBe(false);
    expect(clampWideEffectAlpha(0.68)).toBe(
      VISUAL_READABILITY_LIMITS.maxWideEffectAlpha,
    );
    expect(clampWideEffectAlpha(-1)).toBe(0);
  });
});
