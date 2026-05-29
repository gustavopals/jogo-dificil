import type { AudioSettings } from "../../shared";
import { DEFAULT_AUDIO_SETTINGS } from "./audio-manager";

export const AUDIO_SETTINGS_STORAGE_KEY = "jogo-dificil-audio-settings";

export type PersistedAudioSettings = Pick<
  AudioSettings,
  "masterVolume" | "musicVolume" | "sfxVolume"
>;

export type AudioSettingsStorage = Pick<Storage, "getItem" | "setItem">;

export function createDefaultPersistedAudioSettings(): PersistedAudioSettings {
  return {
    masterVolume: DEFAULT_AUDIO_SETTINGS.masterVolume,
    musicVolume: DEFAULT_AUDIO_SETTINGS.musicVolume,
    sfxVolume: DEFAULT_AUDIO_SETTINGS.sfxVolume,
  };
}

export function normalizePersistedAudioSettings(
  value: unknown,
): PersistedAudioSettings {
  const defaults = createDefaultPersistedAudioSettings();

  if (typeof value !== "object" || value === null) {
    return defaults;
  }

  const candidate = value as Partial<PersistedAudioSettings>;

  return {
    masterVolume: normalizeVolume(
      readOptionalNumber(candidate.masterVolume),
      defaults.masterVolume,
    ),
    musicVolume: normalizeVolume(
      readOptionalNumber(candidate.musicVolume),
      defaults.musicVolume,
    ),
    sfxVolume: normalizeVolume(
      readOptionalNumber(candidate.sfxVolume),
      defaults.sfxVolume,
    ),
  };
}

export function serializeAudioSettings(
  settings: PersistedAudioSettings,
): string {
  return JSON.stringify(settings);
}

export function deserializeAudioSettings(raw: string): PersistedAudioSettings {
  try {
    return normalizePersistedAudioSettings(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultPersistedAudioSettings();
  }
}

export function readPersistedAudioSettings(
  storage: AudioSettingsStorage | null = resolveAudioSettingsStorage(),
): PersistedAudioSettings {
  if (!storage) {
    return createDefaultPersistedAudioSettings();
  }

  try {
    const raw = storage.getItem(AUDIO_SETTINGS_STORAGE_KEY);

    if (!raw) {
      return createDefaultPersistedAudioSettings();
    }

    return deserializeAudioSettings(raw);
  } catch {
    return createDefaultPersistedAudioSettings();
  }
}

export function writePersistedAudioSettings(
  settings: PersistedAudioSettings,
  storage: AudioSettingsStorage | null = resolveAudioSettingsStorage(),
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      AUDIO_SETTINGS_STORAGE_KEY,
      serializeAudioSettings(normalizePersistedAudioSettings(settings)),
    );
  } catch {
    // storage unavailable or full
  }
}

export function resolveAudioSettingsStorage(): AudioSettingsStorage | null {
  if (typeof globalThis.localStorage === "undefined") {
    return null;
  }

  return globalThis.localStorage;
}

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function normalizeVolume(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.min(1, value));
}
