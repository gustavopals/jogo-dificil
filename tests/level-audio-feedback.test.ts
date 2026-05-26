import { describe, expect, it } from "vitest";

import { LEVEL_AUDIO_IDS } from "../src/data/audio";
import {
  getItemCollectionAudioId,
  getTrapActivationAudioId,
} from "../src/game/systems/level-audio-feedback";

describe("level audio feedback", () => {
  it("uses one short cue for item collection regardless of item type", () => {
    expect(getItemCollectionAudioId("required")).toBe(
      LEVEL_AUDIO_IDS.ITEM_COLLECT,
    );
    expect(getItemCollectionAudioId("optional")).toBe(
      LEVEL_AUDIO_IDS.ITEM_COLLECT,
    );
    expect(getItemCollectionAudioId("collectible")).toBe(
      LEVEL_AUDIO_IDS.ITEM_COLLECT,
    );
    expect(getItemCollectionAudioId("key")).toBe(LEVEL_AUDIO_IDS.ITEM_COLLECT);
  });

  it("maps special traps to specific readable cues", () => {
    expect(getTrapActivationAudioId("falling-platform")).toBe(
      LEVEL_AUDIO_IDS.FALLING_PLATFORM,
    );
    expect(getTrapActivationAudioId("projectile")).toBe(
      LEVEL_AUDIO_IDS.PROJECTILE,
    );
  });

  it("maps other trap activations to the generic trap cue", () => {
    expect(getTrapActivationAudioId("spike-pop")).toBe(
      LEVEL_AUDIO_IDS.TRAP_ACTIVATE,
    );
    expect(getTrapActivationAudioId("false-block")).toBe(
      LEVEL_AUDIO_IDS.TRAP_ACTIVATE,
    );
    expect(getTrapActivationAudioId("breakable-floor")).toBe(
      LEVEL_AUDIO_IDS.TRAP_ACTIVATE,
    );
  });
});
