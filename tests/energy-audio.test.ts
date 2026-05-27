import { describe, expect, it } from "vitest";

import { ENERGY_AUDIO_DEFINITIONS, ENERGY_AUDIO_IDS } from "../src/data/audio";
import { AUDIO_ASSETS } from "../src/game/assets";

describe("energy audio data", () => {
  it("defines original Energia Ciano sfx hooks", () => {
    expect(ENERGY_AUDIO_DEFINITIONS.map((audio) => audio.id)).toEqual([
      ENERGY_AUDIO_IDS.CHARGE_LOOP,
      ENERGY_AUDIO_IDS.CHARGE_FULL,
      ENERGY_AUDIO_IDS.SHOT,
      ENERGY_AUDIO_IDS.SHOT_EMPTY,
      ENERGY_AUDIO_IDS.SPECIAL_WINDUP,
      ENERGY_AUDIO_IDS.SPECIAL_FIRE,
      ENERGY_AUDIO_IDS.IMPACT_SMALL,
      ENERGY_AUDIO_IDS.IMPACT_HEAVY,
    ]);

    ENERGY_AUDIO_DEFINITIONS.forEach((audio) => {
      expect(audio.category, audio.id).toBe("sfx");
      expect(audio.volume, audio.id).toBeGreaterThan(0);
      expect(audio.volume, audio.id).toBeLessThanOrEqual(1);
      expect(audio.path, audio.id).toMatch(
        /^assets\/audio\/sfx\/energy-.+\.wav$/,
      );
    });
  });

  it("keeps only the charge bed looped", () => {
    expect(
      ENERGY_AUDIO_DEFINITIONS.filter((audio) => audio.loop).map(
        (audio) => audio.id,
      ),
    ).toEqual([ENERGY_AUDIO_IDS.CHARGE_LOOP]);
  });

  it("preloads every Energia Ciano audio asset key", () => {
    const assetKeys = AUDIO_ASSETS.map((asset) => asset.key);

    ENERGY_AUDIO_DEFINITIONS.forEach((audio) => {
      expect(assetKeys).toContain(audio.assetKey);
    });
  });
});
