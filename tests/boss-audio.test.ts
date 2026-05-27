import { describe, expect, it } from "vitest";

import { BOSS_AUDIO_DEFINITIONS, BOSS_AUDIO_IDS } from "../src/data/audio";
import { AUDIO_ASSETS } from "../src/game/assets";
import {
  getBossAttackCycleAudioIds,
  getBossDamageAudioId,
  getBossEntryAudioId,
} from "../src/game/systems/boss-audio-feedback";

describe("boss audio", () => {
  it("defines original shared boss sfx hooks", () => {
    expect(BOSS_AUDIO_DEFINITIONS.map((audio) => audio.id)).toEqual([
      BOSS_AUDIO_IDS.ENTRY,
      BOSS_AUDIO_IDS.WINDUP,
      BOSS_AUDIO_IDS.ATTACK,
      BOSS_AUDIO_IDS.HIT,
      BOSS_AUDIO_IDS.DEFEAT,
    ]);

    BOSS_AUDIO_DEFINITIONS.forEach((audio) => {
      expect(audio.category, audio.id).toBe("sfx");
      expect(audio.loop, audio.id).toBe(false);
      expect(audio.volume, audio.id).toBeGreaterThan(0);
      expect(audio.volume, audio.id).toBeLessThanOrEqual(1);
      expect(audio.path, audio.id).toMatch(
        /^assets\/audio\/sfx\/boss-.+\.wav$/,
      );
    });
  });

  it("preloads every shared boss audio asset key", () => {
    const assetKeys = AUDIO_ASSETS.map((asset) => asset.key);

    BOSS_AUDIO_DEFINITIONS.forEach((audio) => {
      expect(assetKeys).toContain(audio.assetKey);
    });
  });

  it("maps boss flow events to readable sfx cues", () => {
    expect(getBossEntryAudioId()).toBe(BOSS_AUDIO_IDS.ENTRY);
    expect(
      getBossAttackCycleAudioIds([
        {
          kind: "tell-started",
          bossId: "boss-audio-test",
          attackId: "boss-audio-windup",
        },
        {
          kind: "attack-started",
          bossId: "boss-audio-test",
          attackId: "boss-audio-attack",
        },
        {
          kind: "recover-started",
          bossId: "boss-audio-test",
          attackId: "boss-audio-recover",
        },
        {
          kind: "recover-ended",
          bossId: "boss-audio-test",
          attackId: "boss-audio-recover",
        },
      ]),
    ).toEqual([BOSS_AUDIO_IDS.WINDUP, BOSS_AUDIO_IDS.ATTACK]);
  });

  it("maps boss damage results to hit and defeat sfx", () => {
    expect(
      getBossDamageAudioId({
        didApplyDamage: false,
        didDefeat: false,
      }),
    ).toBeUndefined();
    expect(
      getBossDamageAudioId({
        didApplyDamage: true,
        didDefeat: false,
      }),
    ).toBe(BOSS_AUDIO_IDS.HIT);
    expect(
      getBossDamageAudioId({
        didApplyDamage: true,
        didDefeat: true,
      }),
    ).toBe(BOSS_AUDIO_IDS.DEFEAT);
  });
});
