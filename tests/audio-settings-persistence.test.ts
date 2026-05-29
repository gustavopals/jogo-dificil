import { describe, expect, it } from "vitest";

import {
  AUDIO_SETTINGS_STORAGE_KEY,
  deserializeAudioSettings,
  normalizePersistedAudioSettings,
  readPersistedAudioSettings,
  serializeAudioSettings,
  writePersistedAudioSettings,
} from "../src/game/systems/audio-settings-persistence";

describe("audio settings persistence", () => {
  it("normalizes invalid persisted values", () => {
    expect(
      normalizePersistedAudioSettings({
        masterVolume: 2,
        musicVolume: -1,
        sfxVolume: Number.NaN,
      }),
    ).toEqual({
      masterVolume: 1,
      musicVolume: 0,
      sfxVolume: 1,
    });
  });

  it("round-trips through serialize and deserialize", () => {
    const settings = {
      masterVolume: 1,
      musicVolume: 0.65,
      sfxVolume: 0.8,
    };

    expect(deserializeAudioSettings(serializeAudioSettings(settings))).toEqual(
      settings,
    );
  });

  it("reads and writes through storage adapter", () => {
    const backing = new Map<string, string>();
    const storage = {
      getItem: (key: string) => backing.get(key) ?? null,
      setItem: (key: string, value: string) => {
        backing.set(key, value);
      },
    };

    writePersistedAudioSettings(
      { masterVolume: 1, musicVolume: 0.5, sfxVolume: 0.9 },
      storage,
    );

    expect(backing.get(AUDIO_SETTINGS_STORAGE_KEY)).toContain("musicVolume");
    expect(readPersistedAudioSettings(storage)).toEqual({
      masterVolume: 1,
      musicVolume: 0.5,
      sfxVolume: 0.9,
    });
  });
});
