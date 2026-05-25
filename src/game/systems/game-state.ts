import { GAME_RESOLUTION, PLAYER_SIZE, TILE_SIZE_PX } from "../constants";
import type { CheckpointId, LevelId, Vector2Like } from "../../shared";
import { emitGameEvent, GAME_EVENTS, type DeathCause } from "./game-events";

export const INITIAL_LEVEL_ID: LevelId = "level-01";
export const INITIAL_CHECKPOINT_ID: CheckpointId =
  createInitialCheckpointId(INITIAL_LEVEL_ID);

export type GameStatus = "booting" | "menu" | "playing" | "paused";

export type ActiveCheckpoint = Vector2Like & {
  readonly id: CheckpointId;
  readonly levelId: LevelId;
};

export type GameStateSnapshot = {
  status: GameStatus;
  currentLevelId: LevelId;
  deathCount: number;
  activeCheckpoint: ActiveCheckpoint;
  isPaused: boolean;
  isMuted: boolean;
};

type GameStateListener = (state: GameStateSnapshot) => void;

const INITIAL_PLAYER_PIVOT_X = TILE_SIZE_PX * 4;
const INITIAL_GROUND_Y = GAME_RESOLUTION.height - TILE_SIZE_PX * 3;
const INITIAL_PLAYER_PIVOT_Y = INITIAL_GROUND_Y;

function createInitialCheckpointId(levelId: LevelId): CheckpointId {
  return `${levelId}-start`;
}

function createInitialCheckpoint(levelId: LevelId): ActiveCheckpoint {
  return {
    id: createInitialCheckpointId(levelId),
    levelId,
    x: INITIAL_PLAYER_PIVOT_X,
    y: INITIAL_PLAYER_PIVOT_Y,
  };
}

function cloneState(state: GameStateSnapshot): GameStateSnapshot {
  return {
    ...state,
    activeCheckpoint: {
      ...state.activeCheckpoint,
    },
  };
}

export function createInitialGameState(): GameStateSnapshot {
  return {
    status: "booting",
    currentLevelId: INITIAL_LEVEL_ID,
    deathCount: 0,
    activeCheckpoint: createInitialCheckpoint(INITIAL_LEVEL_ID),
    isPaused: false,
    isMuted: false,
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

  public startLevel(levelId: LevelId = INITIAL_LEVEL_ID): void {
    this.setState({
      status: "playing",
      currentLevelId: levelId,
      activeCheckpoint: createInitialCheckpoint(levelId),
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
  ): number {
    const deathCount = this.state.deathCount + 1;
    this.setState({ deathCount });

    emitGameEvent(GAME_EVENTS.PLAYER_DIED, {
      levelId: this.state.currentLevelId,
      checkpointId: this.state.activeCheckpoint.id,
      deathCount,
      cause,
      position: {
        x: position.x,
        y: position.y,
      },
    });

    return deathCount;
  }

  public respawnAtCheckpoint(isManualRestart = false): ActiveCheckpoint {
    const checkpoint = this.getSnapshot().activeCheckpoint;

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

  private setState(patch: Partial<GameStateSnapshot>): void {
    this.state = {
      ...this.state,
      ...patch,
      activeCheckpoint: patch.activeCheckpoint
        ? { ...patch.activeCheckpoint }
        : { ...this.state.activeCheckpoint },
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
