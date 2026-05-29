import type {
  AudioCategory,
  AudioDefinition,
  AudioSettings,
} from "../../shared";
import {
  DEFAULT_MUSIC_DUCK_CONFIG,
  applyMusicDuckMultiplier,
  resolveMusicDuckMultiplier,
  type MusicDuckConfig,
} from "./audio-ducking";
import {
  recordSfxPlayback,
  shouldAllowSfxPlayback,
} from "./audio-sfx-cooldown";

export type AudioPlaybackConfig = {
  readonly volume: number;
  readonly loop: boolean;
};

export type AudioPlaybackHandle = {
  readonly audioId: string;
  readonly category: AudioCategory;
  setVolume(volume: number): void;
  stop(): void;
};

export type AudioPlaybackEngine = {
  isPlaybackUnlocked(): boolean;
  play(
    audio: AudioDefinition,
    config: AudioPlaybackConfig,
  ): AudioPlaybackHandle | undefined;
};

export type AudioPlayOptions = {
  readonly volume?: number;
  readonly loop?: boolean;
};

export type AudioPlayResult =
  | "played"
  | "already-playing"
  | "queued-autoplay"
  | "missing-audio"
  | "engine-unavailable";

export type AudioManagerSnapshot = AudioSettings & {
  readonly isAutoplayBlocked: boolean;
  readonly registeredAudioCount: number;
  readonly pendingPlayCount: number;
  readonly activeSoundCount: number;
};

type QueuedPlayRequest = {
  readonly audioId: string;
  readonly options: AudioPlayOptions;
};

export const DEFAULT_AUDIO_SETTINGS = {
  masterVolume: 1,
  musicVolume: 0.8,
  sfxVolume: 1,
  isMuted: false,
} as const satisfies AudioSettings;

export class AudioManager {
  private readonly audioDefinitions = new Map<string, AudioDefinition>();
  private readonly activeSounds = new Map<string, AudioPlaybackHandle>();
  private readonly pendingPlayRequests: QueuedPlayRequest[] = [];
  private readonly sfxLastPlayedAt = new Map<string, number>();
  private settings: AudioSettings;
  private isAutoplayBlocked = false;
  private musicDuckUntilMs: number | null = null;
  private musicDuckVolumeMultiplier = 1;
  private readonly nowMs: () => number;

  public constructor(
    private readonly engine?: AudioPlaybackEngine,
    settings: AudioSettings = DEFAULT_AUDIO_SETTINGS,
    nowMs: () => number = () => Date.now(),
  ) {
    this.settings = normalizeSettings(settings);
    this.nowMs = nowMs;
  }

  public registerAudio(audioDefinitions: readonly AudioDefinition[]): void {
    audioDefinitions.forEach((audio) => {
      this.audioDefinitions.set(audio.id, audio);
    });
  }

  public play(
    audioId: string,
    options: AudioPlayOptions = {},
  ): AudioPlayResult {
    const audio = this.audioDefinitions.get(audioId);

    if (!audio) {
      return "missing-audio";
    }

    if (!this.engine) {
      return "engine-unavailable";
    }

    if (!this.engine.isPlaybackUnlocked()) {
      this.pendingPlayRequests.push({
        audioId,
        options,
      });
      this.isAutoplayBlocked = true;

      return "queued-autoplay";
    }

    return this.playNow(audio, options);
  }

  public stop(audioId: string): void {
    this.removePendingPlayRequests((request) => request.audioId === audioId);

    const activeSound = this.activeSounds.get(audioId);

    if (!activeSound) {
      return;
    }

    activeSound.stop();
    this.activeSounds.delete(audioId);
  }

  public stopCategory(category: AudioCategory): void {
    this.removePendingPlayRequests((request) => {
      const audio = this.audioDefinitions.get(request.audioId);

      return audio?.category === category;
    });

    [...this.activeSounds.entries()].forEach(([audioId, activeSound]) => {
      if (activeSound.category !== category) {
        return;
      }

      activeSound.stop();
      this.activeSounds.delete(audioId);
    });
  }

  public setMasterVolume(volume: number): void {
    this.settings = normalizeSettings({
      ...this.settings,
      masterVolume: volume,
    });
    this.refreshActiveVolumes();
  }

  public setMusicVolume(volume: number): void {
    this.settings = normalizeSettings({
      ...this.settings,
      musicVolume: volume,
    });
    this.refreshActiveVolumes();
  }

  public setSfxVolume(volume: number): void {
    this.settings = normalizeSettings({
      ...this.settings,
      sfxVolume: volume,
    });
    this.refreshActiveVolumes();
  }

  public setMuted(isMuted: boolean): void {
    this.settings = {
      ...this.settings,
      isMuted,
    };
    this.refreshActiveVolumes();
  }

  public toggleMuted(): boolean {
    const isMuted = !this.settings.isMuted;

    this.setMuted(isMuted);

    return isMuted;
  }

  public unlockPlayback(): void {
    if (!this.engine?.isPlaybackUnlocked()) {
      this.isAutoplayBlocked = this.pendingPlayRequests.length > 0;

      return;
    }

    this.isAutoplayBlocked = false;
    const pendingRequests = this.pendingPlayRequests.splice(0);

    pendingRequests.forEach((request) => {
      const audio = this.audioDefinitions.get(request.audioId);

      if (!audio) {
        return;
      }

      this.playNow(audio, request.options);
    });
  }

  public requestMusicDuck(
    config: MusicDuckConfig = DEFAULT_MUSIC_DUCK_CONFIG,
  ): void {
    this.musicDuckVolumeMultiplier = config.volumeMultiplier;
    this.musicDuckUntilMs = this.nowMs() + config.durationMs;
    this.refreshActiveVolumes();
  }

  public syncMusicDuck(nowMs = this.nowMs()): void {
    if (this.musicDuckUntilMs === null) {
      return;
    }

    if (nowMs < this.musicDuckUntilMs) {
      return;
    }

    this.musicDuckUntilMs = null;
    this.refreshActiveVolumes();
  }

  public getMusicDuckMultiplier(nowMs = this.nowMs()): number {
    return resolveMusicDuckMultiplier(
      nowMs,
      this.musicDuckUntilMs,
      this.musicDuckVolumeMultiplier,
    );
  }

  public getEffectiveVolume(category: AudioCategory, baseVolume = 1): number {
    if (this.settings.isMuted) {
      return 0;
    }

    const categoryVolume =
      category === "music"
        ? this.settings.musicVolume
        : this.settings.sfxVolume;

    const effectiveBase = clampVolume(baseVolume) * categoryVolume;

    if (category !== "music") {
      return effectiveBase * this.settings.masterVolume;
    }

    return (
      applyMusicDuckMultiplier(
        effectiveBase,
        this.getMusicDuckMultiplier(),
      ) * this.settings.masterVolume
    );
  }

  public getSnapshot(): AudioManagerSnapshot {
    return {
      ...this.settings,
      isAutoplayBlocked: this.isAutoplayBlocked,
      registeredAudioCount: this.audioDefinitions.size,
      pendingPlayCount: this.pendingPlayRequests.length,
      activeSoundCount: this.activeSounds.size,
    };
  }

  private playNow(
    audio: AudioDefinition,
    options: AudioPlayOptions,
  ): AudioPlayResult {
    if (
      audio.category === "sfx" &&
      !shouldAllowSfxPlayback(
        audio.id,
        this.nowMs(),
        this.sfxLastPlayedAt,
      )
    ) {
      return "already-playing";
    }

    const activeSound = this.activeSounds.get(audio.id);

    if (audio.category === "music" && audio.loop && activeSound) {
      activeSound.setVolume(
        this.getEffectiveVolume(audio.category, options.volume ?? audio.volume),
      );

      return "already-playing";
    }

    if (audio.category === "music") {
      this.stopCategory("music");
    } else {
      this.stop(audio.id);
    }

    const handle = this.engine?.play(audio, {
      volume: this.getEffectiveVolume(
        audio.category,
        options.volume ?? audio.volume,
      ),
      loop: options.loop ?? audio.loop,
    });

    if (!handle) {
      return "engine-unavailable";
    }

    this.activeSounds.set(audio.id, handle);

    if (audio.category === "sfx") {
      recordSfxPlayback(audio.id, this.nowMs(), this.sfxLastPlayedAt);
    }

    return "played";
  }

  private removePendingPlayRequests(
    shouldRemove: (request: QueuedPlayRequest) => boolean,
  ): void {
    for (let index = this.pendingPlayRequests.length - 1; index >= 0; index--) {
      const request = this.pendingPlayRequests[index];

      if (!request || !shouldRemove(request)) {
        continue;
      }

      this.pendingPlayRequests.splice(index, 1);
    }

    if (this.pendingPlayRequests.length === 0) {
      this.isAutoplayBlocked = false;
    }
  }

  private refreshActiveVolumes(): void {
    this.activeSounds.forEach((activeSound, audioId) => {
      const audio = this.audioDefinitions.get(audioId);

      if (!audio) {
        return;
      }

      activeSound.setVolume(
        this.getEffectiveVolume(audio.category, audio.volume),
      );
    });
  }
}

function normalizeSettings(settings: AudioSettings): AudioSettings {
  return {
    masterVolume: clampVolume(settings.masterVolume),
    musicVolume: clampVolume(settings.musicVolume),
    sfxVolume: clampVolume(settings.sfxVolume),
    isMuted: settings.isMuted,
  };
}

function clampVolume(volume: number): number {
  if (!Number.isFinite(volume)) {
    return 0;
  }

  return Math.max(0, Math.min(1, volume));
}
