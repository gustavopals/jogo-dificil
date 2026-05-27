import { GAME_RESOLUTION, TILE_SIZE_PX } from "../constants";
import {
  DEFAULT_PLAYER_INITIAL_ENERGY,
  PLAYER_ENERGY_MAX,
  PLAYER_ENERGY_MIN,
  type CheckpointId,
  type LevelId,
  type Vector2Like,
} from "../../shared";
import { emitGameEvent, GAME_EVENTS, type DeathCause } from "./game-events";

export const INITIAL_LEVEL_ID: LevelId = "level-01";
export const INITIAL_CHECKPOINT_ID: CheckpointId =
  createInitialCheckpointId(INITIAL_LEVEL_ID);

export type GameStatus = "booting" | "menu" | "playing" | "paused";
export type PlayerLifeState = "alive" | "dead";

export type ActiveCheckpoint = Vector2Like & {
  readonly id: CheckpointId;
  readonly levelId: LevelId;
  readonly initialEnergy: number;
};

export type PlayerEnergyHudState = {
  readonly current: number;
  readonly max: number;
  readonly isCharging: boolean;
  readonly isFull: boolean;
  readonly feedback: PlayerEnergyHudFeedback;
};

export type PlayerEnergyHudStateInput = {
  readonly current: number;
  readonly max?: number;
  readonly isCharging?: boolean;
  readonly feedback?: PlayerEnergyHudFeedback;
};

export type PlayerEnergyHudFeedbackKind = "none" | "full" | "insufficient";

export type PlayerEnergyHudFeedback = {
  readonly kind: PlayerEnergyHudFeedbackKind;
  readonly sequence: number;
};

export type GameStateSnapshot = {
  status: GameStatus;
  currentLevelId: LevelId;
  playerLifeState: PlayerLifeState;
  deathCount: number;
  activeCheckpoint: ActiveCheckpoint;
  playerEnergy: PlayerEnergyHudState;
  isPaused: boolean;
  isMuted: boolean;
  isMusicMuted: boolean;
};

type GameStateListener = (state: GameStateSnapshot) => void;

const INITIAL_PLAYER_PIVOT_X = TILE_SIZE_PX * 4;
const INITIAL_GROUND_Y = GAME_RESOLUTION.height - TILE_SIZE_PX * 3;
const INITIAL_PLAYER_PIVOT_Y = INITIAL_GROUND_Y;

function createInitialCheckpointId(levelId: LevelId): CheckpointId {
  return `${levelId}-start`;
}

function createInitialCheckpoint(
  levelId: LevelId,
  position: Vector2Like = {
    x: INITIAL_PLAYER_PIVOT_X,
    y: INITIAL_PLAYER_PIVOT_Y,
  },
  initialEnergy = DEFAULT_PLAYER_INITIAL_ENERGY,
): ActiveCheckpoint {
  return {
    id: createInitialCheckpointId(levelId),
    levelId,
    x: position.x,
    y: position.y,
    initialEnergy: normalizeInitialEnergy(initialEnergy),
  };
}

function normalizeInitialEnergy(initialEnergy: number): number {
  if (!Number.isFinite(initialEnergy)) {
    return DEFAULT_PLAYER_INITIAL_ENERGY;
  }

  return Math.min(
    PLAYER_ENERGY_MAX,
    Math.max(PLAYER_ENERGY_MIN, initialEnergy),
  );
}

function createPlayerEnergyHudState(
  current = DEFAULT_PLAYER_INITIAL_ENERGY,
): PlayerEnergyHudState {
  return normalizePlayerEnergyHudState({
    current,
    max: PLAYER_ENERGY_MAX,
    isCharging: false,
    feedback: createInitialPlayerEnergyFeedback(),
  });
}

function normalizePlayerEnergyHudState(
  input: PlayerEnergyHudStateInput,
  fallbackFeedback: PlayerEnergyHudFeedback = createInitialPlayerEnergyFeedback(),
): PlayerEnergyHudState {
  const max =
    Number.isFinite(input.max) && input.max !== undefined
      ? Math.max(1, input.max)
      : PLAYER_ENERGY_MAX;
  const current = Number.isFinite(input.current)
    ? Math.min(max, Math.max(PLAYER_ENERGY_MIN, input.current))
    : PLAYER_ENERGY_MIN;

  return {
    current,
    max,
    isCharging: input.isCharging ?? false,
    isFull: current >= max,
    feedback: normalizePlayerEnergyFeedback(input.feedback ?? fallbackFeedback),
  };
}

function createInitialPlayerEnergyFeedback(): PlayerEnergyHudFeedback {
  return {
    kind: "none",
    sequence: 0,
  };
}

function normalizePlayerEnergyFeedback(
  feedback: PlayerEnergyHudFeedback,
): PlayerEnergyHudFeedback {
  return {
    kind: feedback.kind,
    sequence: Number.isFinite(feedback.sequence)
      ? Math.max(0, Math.trunc(feedback.sequence))
      : 0,
  };
}

function arePlayerEnergyHudStatesEqual(
  left: PlayerEnergyHudState,
  right: PlayerEnergyHudState,
): boolean {
  return (
    left.current === right.current &&
    left.max === right.max &&
    left.isCharging === right.isCharging &&
    left.isFull === right.isFull &&
    left.feedback.kind === right.feedback.kind &&
    left.feedback.sequence === right.feedback.sequence
  );
}

function cloneState(state: GameStateSnapshot): GameStateSnapshot {
  return {
    ...state,
    activeCheckpoint: {
      ...state.activeCheckpoint,
    },
    playerEnergy: {
      ...state.playerEnergy,
    },
  };
}

export function createInitialGameState(): GameStateSnapshot {
  return {
    status: "booting",
    currentLevelId: INITIAL_LEVEL_ID,
    playerLifeState: "alive",
    deathCount: 0,
    activeCheckpoint: createInitialCheckpoint(INITIAL_LEVEL_ID),
    playerEnergy: createPlayerEnergyHudState(),
    isPaused: false,
    isMuted: false,
    isMusicMuted: false,
  };
}

class GameStateStore {
  private state = createInitialGameState();
  private readonly listeners = new Set<GameStateListener>();

  public getSnapshot(): GameStateSnapshot {
    return cloneState(this.state);
  }

  public subscribe(listener: GameStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());

    return () => {
      this.listeners.delete(listener);
    };
  }

  public resetRun(): void {
    this.state = createInitialGameState();
    this.notify();
  }

  public enterMenu(): void {
    this.setState({
      status: "menu",
      isPaused: false,
    });
  }

  public startLevel(
    levelId: LevelId = INITIAL_LEVEL_ID,
    spawnPosition?: Vector2Like,
    initialEnergy = DEFAULT_PLAYER_INITIAL_ENERGY,
  ): void {
    this.setState({
      status: "playing",
      currentLevelId: levelId,
      playerLifeState: "alive",
      activeCheckpoint: createInitialCheckpoint(
        levelId,
        spawnPosition,
        initialEnergy,
      ),
      playerEnergy: createPlayerEnergyHudState(initialEnergy),
      isPaused: false,
    });
  }

  public setActiveCheckpoint(checkpoint: ActiveCheckpoint): void {
    this.setState({
      activeCheckpoint: checkpoint,
      currentLevelId: checkpoint.levelId,
    });

    emitGameEvent(GAME_EVENTS.CHECKPOINT_ACTIVATED, {
      levelId: checkpoint.levelId,
      checkpointId: checkpoint.id,
      position: {
        x: checkpoint.x,
        y: checkpoint.y,
      },
    });
  }

  public registerDeath(
    cause: DeathCause = "unknown",
    position: Vector2Like = this.state.activeCheckpoint,
    sourceId?: string,
  ): number {
    if (this.state.playerLifeState === "dead") {
      return this.state.deathCount;
    }

    const deathCount = this.state.deathCount + 1;
    this.setState({
      deathCount,
      playerLifeState: "dead",
    });

    emitGameEvent(GAME_EVENTS.PLAYER_DIED, {
      levelId: this.state.currentLevelId,
      checkpointId: this.state.activeCheckpoint.id,
      deathCount,
      cause,
      ...(sourceId ? { sourceId } : {}),
      position: {
        x: position.x,
        y: position.y,
      },
    });

    return deathCount;
  }

  public respawnAtCheckpoint(isManualRestart = false): ActiveCheckpoint {
    const checkpoint = this.getSnapshot().activeCheckpoint;

    this.setState({
      status: "playing",
      playerLifeState: "alive",
      playerEnergy: createPlayerEnergyHudState(checkpoint.initialEnergy),
      isPaused: false,
    });

    emitGameEvent(GAME_EVENTS.PLAYER_RESPAWNED, {
      levelId: checkpoint.levelId,
      checkpointId: checkpoint.id,
      position: {
        x: checkpoint.x,
        y: checkpoint.y,
      },
      isManualRestart,
    });

    return checkpoint;
  }

  public setPlayerEnergyHudState(energy: PlayerEnergyHudStateInput): void {
    const playerEnergy = normalizePlayerEnergyHudState(
      energy,
      this.state.playerEnergy.feedback,
    );

    if (arePlayerEnergyHudStatesEqual(this.state.playerEnergy, playerEnergy)) {
      return;
    }

    this.setState({ playerEnergy });
  }

  public triggerPlayerEnergyHudFeedback(
    kind: Exclude<PlayerEnergyHudFeedbackKind, "none">,
  ): void {
    this.setState({
      playerEnergy: {
        ...this.state.playerEnergy,
        feedback: {
          kind,
          sequence: this.state.playerEnergy.feedback.sequence + 1,
        },
      },
    });
  }

  public completeLevel(nextLevelId?: LevelId): void {
    emitGameEvent(GAME_EVENTS.LEVEL_COMPLETED, {
      levelId: this.state.currentLevelId,
      nextLevelId,
      deathCount: this.state.deathCount,
    });
  }

  public setPaused(isPaused: boolean): void {
    this.setState({
      status: isPaused ? "paused" : "playing",
      isPaused,
    });
  }

  public setMuted(isMuted: boolean): void {
    if (this.state.isMuted === isMuted) {
      return;
    }

    this.setState({ isMuted });

    emitGameEvent(GAME_EVENTS.AUDIO_MUTE_CHANGED, { isMuted });
  }

  public toggleMuted(): boolean {
    const isMuted = !this.state.isMuted;
    this.setMuted(isMuted);

    return isMuted;
  }

  public setMusicMuted(isMusicMuted: boolean): void {
    if (this.state.isMusicMuted === isMusicMuted) {
      return;
    }

    this.setState({ isMusicMuted });

    emitGameEvent(GAME_EVENTS.AUDIO_MUSIC_MUTE_CHANGED, { isMusicMuted });
  }

  public toggleMusicMuted(): boolean {
    const isMusicMuted = !this.state.isMusicMuted;
    this.setMusicMuted(isMusicMuted);

    return isMusicMuted;
  }

  private setState(patch: Partial<GameStateSnapshot>): void {
    this.state = {
      ...this.state,
      ...patch,
      activeCheckpoint: patch.activeCheckpoint
        ? { ...patch.activeCheckpoint }
        : { ...this.state.activeCheckpoint },
      playerEnergy: patch.playerEnergy
        ? { ...patch.playerEnergy }
        : { ...this.state.playerEnergy },
    };

    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      listener(this.getSnapshot());
    });
  }
}

export const gameStateStore = new GameStateStore();
