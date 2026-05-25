import type {
  AudioCategory,
  CheckpointId,
  LevelId,
  Vector2Like,
} from "../../shared";

export const GAME_EVENTS = {
  PLAYER_DIED: "player:died",
  PLAYER_RESPAWNED: "player:respawned",
  CHECKPOINT_ACTIVATED: "checkpoint:activated",
  LEVEL_COMPLETED: "level:completed",
  AUDIO_PLAY_REQUESTED: "audio:play-requested",
  AUDIO_STOP_REQUESTED: "audio:stop-requested",
  AUDIO_MUTE_CHANGED: "audio:mute-changed",
} as const;

export type DeathCause =
  | "hazard"
  | "fall"
  | "trap"
  | "manual-restart"
  | "unknown";

export type PlayerDiedEvent = {
  readonly levelId: LevelId;
  readonly checkpointId: CheckpointId;
  readonly deathCount: number;
  readonly cause: DeathCause;
  readonly position: Vector2Like;
};

export type PlayerRespawnedEvent = {
  readonly levelId: LevelId;
  readonly checkpointId: CheckpointId;
  readonly position: Vector2Like;
  readonly isManualRestart: boolean;
};

export type CheckpointActivatedEvent = {
  readonly levelId: LevelId;
  readonly checkpointId: CheckpointId;
  readonly position: Vector2Like;
};

export type LevelCompletedEvent = {
  readonly levelId: LevelId;
  readonly nextLevelId?: LevelId;
  readonly deathCount: number;
};

export type AudioPlayRequestedEvent = {
  readonly audioId: string;
  readonly category: AudioCategory;
  readonly volume?: number;
  readonly loop?: boolean;
};

export type AudioStopRequestedEvent = {
  readonly audioId: string;
  readonly category?: AudioCategory;
};

export type AudioMuteChangedEvent = {
  readonly isMuted: boolean;
};

export type GameEventPayloadMap = {
  readonly [GAME_EVENTS.PLAYER_DIED]: PlayerDiedEvent;
  readonly [GAME_EVENTS.PLAYER_RESPAWNED]: PlayerRespawnedEvent;
  readonly [GAME_EVENTS.CHECKPOINT_ACTIVATED]: CheckpointActivatedEvent;
  readonly [GAME_EVENTS.LEVEL_COMPLETED]: LevelCompletedEvent;
  readonly [GAME_EVENTS.AUDIO_PLAY_REQUESTED]: AudioPlayRequestedEvent;
  readonly [GAME_EVENTS.AUDIO_STOP_REQUESTED]: AudioStopRequestedEvent;
  readonly [GAME_EVENTS.AUDIO_MUTE_CHANGED]: AudioMuteChangedEvent;
};

export type GameEventName = keyof GameEventPayloadMap;
export type GameEventHandler<TEventName extends GameEventName> = (
  payload: GameEventPayloadMap[TEventName],
) => void;

type AnyGameEventHandler = (
  payload: GameEventPayloadMap[GameEventName],
) => void;

const listeners = new Map<GameEventName, Set<AnyGameEventHandler>>();

function getListeners(eventName: GameEventName): Set<AnyGameEventHandler> {
  const existingListeners = listeners.get(eventName);

  if (existingListeners) {
    return existingListeners;
  }

  const eventListeners = new Set<AnyGameEventHandler>();
  listeners.set(eventName, eventListeners);

  return eventListeners;
}

export function emitGameEvent<TEventName extends GameEventName>(
  eventName: TEventName,
  payload: GameEventPayloadMap[TEventName],
): void {
  const eventListeners = listeners.get(eventName);

  if (!eventListeners) {
    return;
  }

  eventListeners.forEach((listener) => {
    listener(payload);
  });
}

export function onGameEvent<TEventName extends GameEventName>(
  eventName: TEventName,
  handler: GameEventHandler<TEventName>,
): () => void {
  const eventListeners = getListeners(eventName);
  const eventHandler = handler as AnyGameEventHandler;

  eventListeners.add(eventHandler);

  return () => {
    eventListeners.delete(eventHandler);
  };
}

export function onceGameEvent<TEventName extends GameEventName>(
  eventName: TEventName,
  handler: GameEventHandler<TEventName>,
): () => void {
  const unsubscribe = onGameEvent(eventName, (payload) => {
    unsubscribe();
    handler(payload);
  });

  return unsubscribe;
}

export function clearAllGameEventListeners(): void {
  listeners.clear();
}
