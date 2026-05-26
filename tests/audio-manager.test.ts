import { describe, expect, it } from "vitest";

import {
  AudioManager,
  type AudioPlaybackConfig,
  type AudioPlaybackEngine,
  type AudioPlaybackHandle,
} from "../src/game/systems/audio-manager";
import type { AudioDefinition, AudioCategory } from "../src/shared";

const MUSIC: AudioDefinition = {
  id: "music-test",
  category: "music",
  assetKey: "music-test-key",
  path: "assets/audio/music/music-test.ogg",
  volume: 0.5,
  loop: true,
};

const SFX: AudioDefinition = {
  id: "sfx-test",
  category: "sfx",
  assetKey: "sfx-test-key",
  path: "assets/audio/sfx/sfx-test.ogg",
  volume: 0.75,
  loop: false,
};

describe("audio manager", () => {
  it("calculates effective volume from master, category volume and mute", () => {
    const manager = new AudioManager();

    expect(manager.getEffectiveVolume("music", MUSIC.volume)).toBe(0.4);
    expect(manager.getEffectiveVolume("sfx", SFX.volume)).toBe(0.75);

    manager.setMasterVolume(0.5);
    manager.setMusicVolume(0.25);
    manager.setSfxVolume(0.2);

    expect(manager.getEffectiveVolume("music", MUSIC.volume)).toBe(0.0625);
    expect(manager.getEffectiveVolume("sfx", SFX.volume)).toBeCloseTo(0.075);

    manager.setMuted(true);

    expect(manager.getEffectiveVolume("music", MUSIC.volume)).toBe(0);
    expect(manager.getEffectiveVolume("sfx", SFX.volume)).toBe(0);
  });

  it("clamps volume settings into a safe range", () => {
    const manager = new AudioManager();

    manager.setMasterVolume(2);
    manager.setMusicVolume(-1);
    manager.setSfxVolume(Number.NaN);

    expect(manager.getSnapshot()).toMatchObject({
      masterVolume: 1,
      musicVolume: 0,
      sfxVolume: 0,
    });
  });

  it("plays registered audio through the engine and updates active volumes", () => {
    const engine = new FakeAudioEngine();
    const manager = new AudioManager(engine);

    manager.registerAudio([SFX]);

    expect(manager.play(SFX.id)).toBe("played");
    expect(engine.playedConfigs).toEqual([
      {
        audioId: SFX.id,
        volume: 0.75,
        loop: false,
      },
    ]);

    manager.setSfxVolume(0.5);

    expect(engine.handles[0]!.volumeHistory).toEqual([0.75, 0.375]);
  });

  it("keeps one active music track when new music starts", () => {
    const engine = new FakeAudioEngine();
    const manager = new AudioManager(engine);

    manager.registerAudio([MUSIC]);

    expect(manager.play(MUSIC.id)).toBe("played");
    expect(manager.play(MUSIC.id, { volume: 1 })).toBe("played");

    expect(engine.handles[0]!.wasStopped).toBe(true);
    expect(engine.handles[1]!.volumeHistory).toEqual([0.8]);
    expect(manager.getSnapshot().activeSoundCount).toBe(1);
  });

  it("queues play requests while browser autoplay is locked", () => {
    const engine = new FakeAudioEngine(false);
    const manager = new AudioManager(engine);

    manager.registerAudio([SFX]);

    expect(manager.play(SFX.id)).toBe("queued-autoplay");
    expect(manager.getSnapshot()).toMatchObject({
      isAutoplayBlocked: true,
      pendingPlayCount: 1,
      activeSoundCount: 0,
    });

    manager.unlockPlayback();

    expect(manager.getSnapshot()).toMatchObject({
      isAutoplayBlocked: true,
      pendingPlayCount: 1,
    });

    engine.isUnlocked = true;
    manager.unlockPlayback();

    expect(engine.playedConfigs).toHaveLength(1);
    expect(manager.getSnapshot()).toMatchObject({
      isAutoplayBlocked: false,
      pendingPlayCount: 0,
      activeSoundCount: 1,
    });
  });

  it("reports missing audio and missing engine without throwing", () => {
    const managerWithoutEngine = new AudioManager();
    const managerWithEngine = new AudioManager(new FakeAudioEngine());

    managerWithoutEngine.registerAudio([SFX]);

    expect(managerWithoutEngine.play(SFX.id)).toBe("engine-unavailable");
    expect(managerWithEngine.play("missing")).toBe("missing-audio");
  });

  it("stops audio by id and by category", () => {
    const engine = new FakeAudioEngine();
    const manager = new AudioManager(engine);

    manager.registerAudio([MUSIC, SFX]);
    manager.play(MUSIC.id);
    manager.play(SFX.id);
    manager.stop(SFX.id);

    expect(engine.handles[1]!.wasStopped).toBe(true);
    expect(manager.getSnapshot().activeSoundCount).toBe(1);

    manager.stopCategory("music");

    expect(engine.handles[0]!.wasStopped).toBe(true);
    expect(manager.getSnapshot().activeSoundCount).toBe(0);
  });
});

type PlayedConfig = AudioPlaybackConfig & {
  readonly audioId: string;
};

class FakeAudioHandle implements AudioPlaybackHandle {
  public readonly volumeHistory: number[];
  public wasStopped = false;

  public constructor(
    public readonly audioId: string,
    public readonly category: AudioCategory,
    initialVolume: number,
  ) {
    this.volumeHistory = [initialVolume];
  }

  public setVolume(volume: number): void {
    this.volumeHistory.push(volume);
  }

  public stop(): void {
    this.wasStopped = true;
  }
}

class FakeAudioEngine implements AudioPlaybackEngine {
  public readonly playedConfigs: PlayedConfig[] = [];
  public readonly handles: FakeAudioHandle[] = [];

  public constructor(public isUnlocked = true) {}

  public isPlaybackUnlocked(): boolean {
    return this.isUnlocked;
  }

  public play(
    audio: AudioDefinition,
    config: AudioPlaybackConfig,
  ): AudioPlaybackHandle {
    const handle = new FakeAudioHandle(audio.id, audio.category, config.volume);

    this.playedConfigs.push({
      audioId: audio.id,
      volume: config.volume,
      loop: config.loop,
    });
    this.handles.push(handle);

    return handle;
  }
}
