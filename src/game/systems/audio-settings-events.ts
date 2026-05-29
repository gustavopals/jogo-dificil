import { emitGameEvent, GAME_EVENTS } from "./game-events";
import type { PersistedAudioSettings } from "./audio-settings-persistence";

export function emitAudioVolumeSettingsChanged(
  settings: PersistedAudioSettings,
): void {
  emitGameEvent(GAME_EVENTS.AUDIO_VOLUME_SETTINGS_CHANGED, settings);
}
