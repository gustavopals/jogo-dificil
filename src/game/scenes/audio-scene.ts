import Phaser from "phaser";

import {
  BOSS_AUDIO_DEFINITIONS,
  ENERGY_AUDIO_DEFINITIONS,
  LEVEL_AUDIO_DEFINITIONS,
  LEVEL_AUDIO_IDS,
  getPlayerDeathAudioId,
  MUSIC_AUDIO_DEFINITIONS,
  MUSIC_AUDIO_IDS,
  PLAYER_AUDIO_DEFINITIONS,
  PLAYER_AUDIO_IDS,
} from "../../data/audio";
import { LEVEL_DEFINITIONS } from "../../data/levels";
import type { AudioDefinition } from "../../shared";
import { AudioManager, DEFAULT_AUDIO_SETTINGS } from "../systems/audio-manager";
import {
  GAME_EVENTS,
  onGameEvent,
  type AudioPlayRequestedEvent,
  type AudioStopRequestedEvent,
} from "../systems/game-events";
import { gameStateStore } from "../systems/game-state";
import { PhaserAudioEngine } from "../systems/phaser-audio-engine";
import { SCENE_KEYS } from "./scene-keys";

export class AudioScene extends Phaser.Scene {
  private audioManager?: AudioManager;
  private unsubscribeEvents: readonly (() => void)[] = [];

  public constructor() {
    super(SCENE_KEYS.AUDIO);
  }

  public create(): void {
    this.audioManager = new AudioManager(
      new PhaserAudioEngine(this),
      DEFAULT_AUDIO_SETTINGS,
    );
    this.audioManager.registerAudio(getInitialAudioDefinitions());
    const initialAudioState = gameStateStore.getSnapshot();
    this.audioManager.setMuted(initialAudioState.isMuted);
    this.audioManager.setMusicVolume(
      getMusicVolumeForMuteState(initialAudioState.isMusicMuted),
    );

    this.unsubscribeEvents = [
      onGameEvent(GAME_EVENTS.AUDIO_PLAY_REQUESTED, (payload) => {
        this.handlePlayRequested(payload);
      }),
      onGameEvent(GAME_EVENTS.AUDIO_STOP_REQUESTED, (payload) => {
        this.handleStopRequested(payload);
      }),
      onGameEvent(GAME_EVENTS.AUDIO_MUTE_CHANGED, ({ isMuted }) => {
        this.audioManager?.setMuted(isMuted);
      }),
      onGameEvent(GAME_EVENTS.AUDIO_MUSIC_MUTE_CHANGED, ({ isMusicMuted }) => {
        this.audioManager?.setMusicVolume(
          getMusicVolumeForMuteState(isMusicMuted),
        );
      }),
      onGameEvent(GAME_EVENTS.PLAYER_DIED, ({ deathCount }) => {
        this.audioManager?.play(getPlayerDeathAudioId(deathCount));
      }),
      onGameEvent(GAME_EVENTS.PLAYER_RESPAWNED, () => {
        this.audioManager?.play(PLAYER_AUDIO_IDS.RESPAWN);
      }),
      onGameEvent(GAME_EVENTS.CHECKPOINT_ACTIVATED, () => {
        this.audioManager?.play(LEVEL_AUDIO_IDS.CHECKPOINT);
      }),
      onGameEvent(GAME_EVENTS.LEVEL_COMPLETED, () => {
        this.audioManager?.play(LEVEL_AUDIO_IDS.COMPLETE);
        this.audioManager?.play(MUSIC_AUDIO_IDS.LEVEL_COMPLETE_STING);
      }),
    ];

    this.sound.on(Phaser.Sound.Events.UNLOCKED, this.unlockAudio, this);
    this.input.once(Phaser.Input.Events.POINTER_DOWN, this.unlockAudio, this);
    this.input.keyboard?.once("keydown", this.unlockAudio, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  private handlePlayRequested(payload: AudioPlayRequestedEvent): void {
    this.audioManager?.play(payload.audioId, {
      volume: payload.volume,
      loop: payload.loop,
    });
  }

  private handleStopRequested(payload: AudioStopRequestedEvent): void {
    if (payload.category) {
      this.audioManager?.stopCategory(payload.category);

      return;
    }

    this.audioManager?.stop(payload.audioId);
  }

  private unlockAudio(): void {
    this.audioManager?.unlockPlayback();
  }

  private cleanup(): void {
    this.unsubscribeEvents.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.unsubscribeEvents = [];
    this.sound.off(Phaser.Sound.Events.UNLOCKED, this.unlockAudio, this);
    this.audioManager?.stopCategory("music");
    this.audioManager?.stopCategory("sfx");
    this.audioManager = undefined;
  }
}

function getInitialAudioDefinitions(): readonly AudioDefinition[] {
  const audioDefinitions: AudioDefinition[] = [
    ...PLAYER_AUDIO_DEFINITIONS,
    ...LEVEL_AUDIO_DEFINITIONS,
    ...ENERGY_AUDIO_DEFINITIONS,
    ...BOSS_AUDIO_DEFINITIONS,
    ...MUSIC_AUDIO_DEFINITIONS,
  ];

  LEVEL_DEFINITIONS.forEach((level) => {
    audioDefinitions.push(...level.audio.sounds);
  });

  return audioDefinitions;
}

function getMusicVolumeForMuteState(isMusicMuted: boolean): number {
  return isMusicMuted ? 0 : DEFAULT_AUDIO_SETTINGS.musicVolume;
}
