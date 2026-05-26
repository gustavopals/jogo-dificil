import { describe, expect, it } from "vitest";

import { LEVEL_02 } from "../src/data/levels";
import {
  AudioManager,
  type AudioPlaybackConfig,
  type AudioPlaybackEngine,
  type AudioPlaybackHandle,
} from "../src/game/systems/audio-manager";
import {
  activateMvpTrap,
  updateTrapProjectiles,
} from "../src/game/systems/mvp-traps";
import {
  createInitialRoomState,
  resetRoomStateForRespawn,
  setInteractiveObjectActive,
  type RoomRuntimeState,
} from "../src/game/systems/room-state";
import type { AudioCategory, AudioDefinition } from "../src/shared";

const MUSIC: AudioDefinition = {
  id: "music-stability",
  category: "music",
  assetKey: "music-stability-key",
  path: "assets/audio/music/music-stability.ogg",
  volume: 0.5,
  loop: true,
};

const DEATH_VARIATIONS: readonly AudioDefinition[] = [
  {
    id: "death-01-stability",
    category: "sfx",
    assetKey: "death-01-stability-key",
    path: "assets/audio/sfx/death-01-stability.ogg",
    volume: 0.8,
    loop: false,
  },
  {
    id: "death-02-stability",
    category: "sfx",
    assetKey: "death-02-stability-key",
    path: "assets/audio/sfx/death-02-stability.ogg",
    volume: 0.8,
    loop: false,
  },
  {
    id: "death-03-stability",
    category: "sfx",
    assetKey: "death-03-stability-key",
    path: "assets/audio/sfx/death-03-stability.ogg",
    volume: 0.8,
    loop: false,
  },
] as const;

const RESPAWN: AudioDefinition = {
  id: "respawn-stability",
  category: "sfx",
  assetKey: "respawn-stability-key",
  path: "assets/audio/sfx/respawn-stability.ogg",
  volume: 0.7,
  loop: false,
};

describe("performance and stability contracts", () => {
  it("keeps room reset stable across many respawn attempts", () => {
    const fallingPlatform = LEVEL_02.traps.find(
      (trap) => trap.kind === "falling-platform",
    )!;
    const projectileTrap = LEVEL_02.traps.find(
      (trap) => trap.kind === "projectile",
    )!;
    let state: RoomRuntimeState = createInitialRoomState(LEVEL_02);

    for (let attempt = 0; attempt < 60; attempt += 1) {
      state = activateMvpTrap(state, fallingPlatform);
      state = activateMvpTrap(state, projectileTrap);
      state = updateTrapProjectiles(state, LEVEL_02, 250);
      state = setInteractiveObjectActive(state, "level-02-lever-exit", true);

      expect(state.projectiles).toHaveLength(1);
      expect(state.traps[projectileTrap.id]?.isTriggered).toBe(true);
      expect(state.movingPlatforms[fallingPlatform.id]?.isDisabled).toBe(true);

      state = resetRoomStateForRespawn(state, LEVEL_02);

      expect(state.projectiles).toEqual([]);
      expect(state.traps[projectileTrap.id]).toMatchObject({
        isTriggered: false,
        isResolved: false,
      });
      expect(state.traps[fallingPlatform.id]).toMatchObject({
        isTriggered: false,
        isResolved: false,
      });
      expect(state.movingPlatforms[fallingPlatform.id]).toMatchObject({
        isFalling: false,
        isDisabled: false,
      });
      expect(state.interactiveObjects["level-02-lever-exit"]).toMatchObject({
        isActive: false,
      });
    }
  });

  it("keeps repeated music, death and respawn cues bounded", () => {
    const engine = new FakeAudioEngine();
    const manager = new AudioManager(engine);

    manager.registerAudio([MUSIC, ...DEATH_VARIATIONS, RESPAWN]);

    for (let attempt = 0; attempt < 90; attempt += 1) {
      expect(manager.play(MUSIC.id)).toMatch(/played|already-playing/);
      expect(
        manager.play(DEATH_VARIATIONS[attempt % DEATH_VARIATIONS.length]!.id),
      ).toBe("played");
      expect(manager.play(RESPAWN.id)).toBe("played");
    }

    expect(manager.getSnapshot().activeSoundCount).toBe(5);
    expect(
      engine.handles.filter(
        (handle) => handle.audioId === MUSIC.id && !handle.wasStopped,
      ),
    ).toHaveLength(1);
    expect(
      engine.handles.filter(
        (handle) => handle.audioId === RESPAWN.id && !handle.wasStopped,
      ),
    ).toHaveLength(1);
    DEATH_VARIATIONS.forEach((deathAudio) => {
      expect(
        engine.handles.filter(
          (handle) => handle.audioId === deathAudio.id && !handle.wasStopped,
        ),
      ).toHaveLength(1);
    });
  });
});

class FakeAudioHandle implements AudioPlaybackHandle {
  public wasStopped = false;

  public constructor(
    public readonly audioId: string,
    public readonly category: AudioCategory,
  ) {}

  public setVolume(): void {}

  public stop(): void {
    this.wasStopped = true;
  }
}

class FakeAudioEngine implements AudioPlaybackEngine {
  public readonly handles: FakeAudioHandle[] = [];

  public isPlaybackUnlocked(): boolean {
    return true;
  }

  public play(
    audio: AudioDefinition,
    _config: AudioPlaybackConfig,
  ): AudioPlaybackHandle {
    const handle = new FakeAudioHandle(audio.id, audio.category);

    this.handles.push(handle);

    return handle;
  }
}
