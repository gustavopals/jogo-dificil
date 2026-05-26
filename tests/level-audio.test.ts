import { describe, expect, it } from "vitest";

import { LEVEL_AUDIO_DEFINITIONS, LEVEL_AUDIO_IDS } from "../src/data/audio";
import { AUDIO_ASSETS } from "../src/game/assets";

describe("level audio data", () => {
  it("defines short sfx hooks for required phase feedback", () => {
    expect(LEVEL_AUDIO_DEFINITIONS.map((audio) => audio.id)).toEqual([
      LEVEL_AUDIO_IDS.CHECKPOINT,
      LEVEL_AUDIO_IDS.COMPLETE,
      LEVEL_AUDIO_IDS.ITEM_COLLECT,
      LEVEL_AUDIO_IDS.TRAP_ACTIVATE,
      LEVEL_AUDIO_IDS.FALLING_PLATFORM,
      LEVEL_AUDIO_IDS.PROJECTILE,
    ]);

    LEVEL_AUDIO_DEFINITIONS.forEach((audio) => {
      expect(audio.category, audio.id).toBe("sfx");
      expect(audio.loop, audio.id).toBe(false);
      expect(audio.volume, audio.id).toBeGreaterThan(0);
      expect(audio.volume, audio.id).toBeLessThanOrEqual(1);
      expect(audio.path, audio.id).toMatch(/^assets\/audio\/sfx\/.+\.wav$/);
    });
  });

  it("preloads every level audio asset key", () => {
    const assetKeys = AUDIO_ASSETS.map((asset) => asset.key);

    LEVEL_AUDIO_DEFINITIONS.forEach((audio) => {
      expect(assetKeys).toContain(audio.assetKey);
    });
  });
});
