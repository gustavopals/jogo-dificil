import { describe, expect, it } from "vitest";

import {
  AudioManager,
  type AudioPlaybackConfig,
  type AudioPlaybackEngine,
  type AudioPlaybackHandle,
} from "../src/game/systems/audio-manager";
import { MUSIC_DUCK_VOLUME_MULTIPLIER } from "../src/game/systems/audio-ducking";
import {
  ENERGY_AUDIO_DEFINITIONS,
  ENERGY_AUDIO_IDS,
  PLAYER_AUDIO_DEFINITIONS,
  PLAYER_AUDIO_IDS,
} from "../src/data/audio";
import type { AudioDefinition, AudioCategory } from "../src/shared";

const MUSIC: AudioDefinition = {
  id: "music-test",
  category: "music",
  assetKey: "music-test-key",
  path: "assets/audio/music/music-test.ogg",
  volume: 0.5,
  loop: true,
};

const ALT_MUSIC: AudioDefinition = {
  id: "music-alt-test",
  category: "music",
  assetKey: "music-alt-test-key",
  path: "assets/audio/music/music-alt-test.ogg",
  volume: 0.6,
  loop: true,
};

const MUSIC_STING: AudioDefinition = {
  id: "music-sting-test",
  category: "music",
  assetKey: "music-sting-test-key",
  path: "assets/audio/music/music-sting-test.ogg",
  volume: 0.7,
  loop: false,
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

  it("applies mute changes to active music and sound effects", () => {
    const engine = new FakeAudioEngine();
    const manager = new AudioManager(engine);

    manager.registerAudio([MUSIC, SFX]);
    manager.play(MUSIC.id);
    manager.play(SFX.id);

    manager.setMuted(true);
    manager.setMuted(false);

    expect(engine.handles[0]!.volumeHistory).toEqual([0.4, 0, 0.4]);
    expect(engine.handles[1]!.volumeHistory).toEqual([0.75, 0, 0.75]);
  });

  it("applies global mute to the active Energia Ciano charge loop", () => {
    const engine = new FakeAudioEngine();
    const manager = new AudioManager(engine);
    const chargeLoop = ENERGY_AUDIO_DEFINITIONS.find(
      (audio) => audio.id === ENERGY_AUDIO_IDS.CHARGE_LOOP,
    )!;

    manager.registerAudio(ENERGY_AUDIO_DEFINITIONS);
    expect(manager.play(ENERGY_AUDIO_IDS.CHARGE_LOOP)).toBe("played");

    manager.setMuted(true);
    manager.setMuted(false);

    expect(engine.playedConfigs).toEqual([
      {
        audioId: ENERGY_AUDIO_IDS.CHARGE_LOOP,
        volume: chargeLoop.volume,
        loop: true,
      },
    ]);
    expect(engine.handles[0]!.volumeHistory).toEqual([
      chargeLoop.volume,
      0,
      chargeLoop.volume,
    ]);
  });

  it("allows music volume to be muted without silencing sound effects", () => {
    const engine = new FakeAudioEngine();
    const manager = new AudioManager(engine);

    manager.registerAudio([MUSIC, SFX]);
    manager.play(MUSIC.id);
    manager.play(SFX.id);

    manager.setMusicVolume(0);

    expect(manager.getEffectiveVolume("music", MUSIC.volume)).toBe(0);
    expect(manager.getEffectiveVolume("sfx", SFX.volume)).toBe(0.75);
    expect(engine.handles[0]!.volumeHistory).toEqual([0.4, 0]);
    expect(engine.handles[1]!.volumeHistory).toEqual([0.75, 0.75]);
  });

  it("keeps music loops from restarting and replaces different tracks", () => {
    const engine = new FakeAudioEngine();
    const manager = new AudioManager(engine);

    manager.registerAudio([MUSIC, ALT_MUSIC]);

    expect(manager.play(MUSIC.id)).toBe("played");
    expect(manager.play(MUSIC.id, { volume: 1 })).toBe("already-playing");

    expect(engine.handles[0]!.wasStopped).toBe(false);
    expect(engine.handles[0]!.volumeHistory).toEqual([0.4, 0.8]);

    expect(manager.play(ALT_MUSIC.id)).toBe("played");

    expect(engine.handles[0]!.wasStopped).toBe(true);
    expect(engine.handles[1]!.volumeHistory).toEqual([0.48]);
    expect(manager.getSnapshot().activeSoundCount).toBe(1);
  });

  it("allows non-loop music stings to be played again", () => {
    const engine = new FakeAudioEngine();
    const manager = new AudioManager(engine);

    manager.registerAudio([MUSIC_STING]);

    expect(manager.play(MUSIC_STING.id)).toBe("played");
    expect(manager.play(MUSIC_STING.id)).toBe("played");

    expect(engine.handles[0]!.wasStopped).toBe(true);
    expect(engine.handles[1]!.volumeHistory).toHaveLength(1);
    expect(engine.handles[1]!.volumeHistory[0]).toBeCloseTo(0.56);
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

  it("removes pending play requests when a sound is stopped before unlock", () => {
    const engine = new FakeAudioEngine(false);
    const manager = new AudioManager(engine);

    manager.registerAudio(ENERGY_AUDIO_DEFINITIONS);

    expect(manager.play(ENERGY_AUDIO_IDS.CHARGE_LOOP)).toBe("queued-autoplay");
    manager.stop(ENERGY_AUDIO_IDS.CHARGE_LOOP);

    expect(manager.getSnapshot()).toMatchObject({
      isAutoplayBlocked: false,
      pendingPlayCount: 0,
      activeSoundCount: 0,
    });

    engine.isUnlocked = true;
    manager.unlockPlayback();

    expect(engine.playedConfigs).toEqual([]);
  });

  it("reports missing audio and missing engine without throwing", () => {
    const managerWithoutEngine = new AudioManager();
    const managerWithEngine = new AudioManager(new FakeAudioEngine());

    managerWithoutEngine.registerAudio([SFX]);

    expect(managerWithoutEngine.play(SFX.id)).toBe("engine-unavailable");
    expect(managerWithEngine.play("missing")).toBe("missing-audio");
  });

  it("ducks active music volume temporarily", () => {
    const engine = new FakeAudioEngine();
    let nowMs = 1_000;
    const manager = new AudioManager(engine, undefined, () => nowMs);

    manager.registerAudio([MUSIC]);
    manager.play(MUSIC.id);

    manager.requestMusicDuck({
      volumeMultiplier: MUSIC_DUCK_VOLUME_MULTIPLIER,
      durationMs: 800,
    });

    expect(manager.getEffectiveVolume("music", MUSIC.volume)).toBeCloseTo(
      0.4 * MUSIC_DUCK_VOLUME_MULTIPLIER,
    );

    nowMs = 1_900;

    expect(manager.getMusicDuckMultiplier()).toBe(1);
    expect(engine.handles[0]!.volumeHistory.at(-1)).toBeCloseTo(
      0.4 * MUSIC_DUCK_VOLUME_MULTIPLIER,
    );

    manager.syncMusicDuck(nowMs);

    expect(engine.handles[0]!.volumeHistory.at(-1)).toBeCloseTo(0.4);
  });

  it("applies sfx cooldown without throwing", () => {
    const engine = new FakeAudioEngine();
    const manager = new AudioManager(engine, undefined, () => 5_000);
    const jumpSfx = PLAYER_AUDIO_DEFINITIONS.find(
      (audio) => audio.id === PLAYER_AUDIO_IDS.JUMP,
    )!;

    manager.registerAudio([jumpSfx]);

    expect(manager.play(PLAYER_AUDIO_IDS.JUMP)).toBe("played");
    expect(manager.play(PLAYER_AUDIO_IDS.JUMP)).toBe("already-playing");
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
