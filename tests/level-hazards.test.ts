import { describe, expect, it } from "vitest";

import { GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import {
  findTouchedDeadlyHazard,
  getDeathCauseForHazard,
  getHazardPlaceholderColor,
  getHazardPlaceholderTextureKey,
} from "../src/game/systems/level-hazards";
import type { HazardDefinition } from "../src/shared";

const SPIKES_HAZARD = {
  id: "test-spikes",
  kind: "spikes",
  area: {
    x: 32,
    y: 48,
    width: 16,
    height: 8,
  },
  isInstantDeath: true,
} as const satisfies HazardDefinition;

const FALL_HAZARD = {
  id: "test-fall-zone",
  kind: "fall",
  area: {
    x: 64,
    y: 220,
    width: 48,
    height: 48,
  },
  isInstantDeath: true,
} as const satisfies HazardDefinition;

const PROJECTILE_HAZARD = {
  id: "test-projectile-zone",
  kind: "projectile",
  area: {
    x: 112,
    y: 80,
    width: 8,
    height: 8,
  },
  isInstantDeath: true,
} as const satisfies HazardDefinition;

const CRUSHER_HAZARD = {
  id: "test-crusher-zone",
  kind: "crusher",
  area: {
    x: 128,
    y: 80,
    width: 16,
    height: 16,
  },
  isInstantDeath: true,
} as const satisfies HazardDefinition;

describe("level hazards", () => {
  it("detects contact with instant-death hazards", () => {
    expect(
      findTouchedDeadlyHazard(
        {
          x: 40,
          y: 52,
          width: 10,
          height: 10,
        },
        [SPIKES_HAZARD],
      ),
    ).toEqual({
      hazard: SPIKES_HAZARD,
      cause: "hazard",
    });
  });

  it("ignores non-overlapping and non-deadly hazards", () => {
    expect(
      findTouchedDeadlyHazard(
        {
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        },
        [SPIKES_HAZARD],
      ),
    ).toBeUndefined();

    expect(
      findTouchedDeadlyHazard(
        {
          x: 40,
          y: 52,
          width: 10,
          height: 10,
        },
        [
          {
            ...SPIKES_HAZARD,
            isInstantDeath: false,
          },
        ],
      ),
    ).toBeUndefined();
  });

  it("maps hazard kinds to death causes", () => {
    expect(getDeathCauseForHazard(FALL_HAZARD)).toBe("fall");
    expect(getDeathCauseForHazard(PROJECTILE_HAZARD)).toBe("projectile");
    expect(getDeathCauseForHazard(CRUSHER_HAZARD)).toBe("crusher");
    expect(getDeathCauseForHazard(SPIKES_HAZARD)).toBe("hazard");
  });

  it("returns placeholder colors by hazard kind", () => {
    expect(getHazardPlaceholderColor(SPIKES_HAZARD)).toBe(0xe35d6a);
    expect(getHazardPlaceholderColor(FALL_HAZARD)).toBe(0xe35d6a);
  });

  it("uses the hazard spike sprite for readable danger", () => {
    expect(getHazardPlaceholderTextureKey()).toBe(
      GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES,
    );
  });
});
