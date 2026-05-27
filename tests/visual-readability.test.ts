import { describe, expect, it } from "vitest";

import { PLAYER_EFFECT_DEPTHS } from "../src/game/systems/player-visual-effects";
import {
  VISUAL_READABILITY_CONTRAST_RULES,
  VISUAL_READABILITY_DEPTHS,
  VISUAL_READABILITY_LIMITS,
  VISUAL_READABILITY_SEMANTIC_COLORS,
  clampWideEffectAlpha,
  getRgbColorDistance,
  hasPrimaryRoleColorContrast,
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
    expect(VISUAL_READABILITY_DEPTHS.bossBody).toBeLessThan(
      PLAYER_EFFECT_DEPTHS.energyShot,
    );
    expect(VISUAL_READABILITY_DEPTHS.bossHealth).toBeLessThan(
      VISUAL_READABILITY_DEPTHS.directHazard,
    );
    expect(VISUAL_READABILITY_DEPTHS.bossHealth).toBeLessThan(
      VISUAL_READABILITY_DEPTHS.trapProjectile,
    );
  });

  it("keeps boss, Pino energy and trap primary colors distinct", () => {
    expect(hasPrimaryRoleColorContrast("energy", "trap")).toBe(true);
    expect(hasPrimaryRoleColorContrast("energy", "boss")).toBe(true);
    expect(hasPrimaryRoleColorContrast("trap", "boss")).toBe(true);

    expect(
      getRgbColorDistance(
        VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary,
        VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary,
      ),
    ).toBeGreaterThanOrEqual(
      VISUAL_READABILITY_CONTRAST_RULES.minPrimaryColorDistance,
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
