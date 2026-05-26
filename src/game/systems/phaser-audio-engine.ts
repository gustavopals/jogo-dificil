import Phaser from "phaser";

import type { AudioDefinition } from "../../shared";
import type {
  AudioPlaybackConfig,
  AudioPlaybackEngine,
  AudioPlaybackHandle,
} from "./audio-manager";

type PhaserManagedSound = Phaser.Sound.BaseSound & {
  volume: number;
};

class PhaserAudioPlaybackHandle implements AudioPlaybackHandle {
  public constructor(
    public readonly audioId: string,
    public readonly category: AudioDefinition["category"],
    private readonly sound: PhaserManagedSound,
  ) {}

  public setVolume(volume: number): void {
    this.sound.volume = volume;
  }

  public stop(): void {
    this.sound.stop();
    this.sound.destroy();
  }
}

export class PhaserAudioEngine implements AudioPlaybackEngine {
  public constructor(private readonly scene: Phaser.Scene) {}

  public isPlaybackUnlocked(): boolean {
    return !this.scene.sound.locked;
  }

  public play(
    audio: AudioDefinition,
    config: AudioPlaybackConfig,
  ): AudioPlaybackHandle | undefined {
    if (!this.scene.cache.audio.exists(audio.assetKey)) {
      return undefined;
    }

    const sound = this.scene.sound.add(audio.assetKey, {
      loop: config.loop,
      volume: config.volume,
    }) as PhaserManagedSound;

    if (!sound.play()) {
      sound.destroy();

      return undefined;
    }

    return new PhaserAudioPlaybackHandle(audio.id, audio.category, sound);
  }
}
