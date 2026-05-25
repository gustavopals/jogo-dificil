import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  clearAllGameEventListeners,
  GAME_EVENTS,
  onGameEvent,
  type CheckpointActivatedEvent,
  type PlayerDiedEvent,
  type PlayerRespawnedEvent,
} from "../src/game/systems/game-events";
import { gameStateStore } from "../src/game/systems/game-state";

beforeEach(() => {
  gameStateStore.resetRun();
});

afterEach(() => {
  clearAllGameEventListeners();
});

describe("game state", () => {
  it("tracks the active level and derives its start checkpoint", () => {
    gameStateStore.startLevel("level-02");

    expect(gameStateStore.getSnapshot()).toMatchObject({
      status: "playing",
      currentLevelId: "level-02",
      activeCheckpoint: {
        id: "level-02-start",
        levelId: "level-02",
      },
      isPaused: false,
    });
  });

  it("emits checkpoint, death and respawn events", () => {
    const checkpointEvents: CheckpointActivatedEvent[] = [];
    const deathEvents: PlayerDiedEvent[] = [];
    const respawnEvents: PlayerRespawnedEvent[] = [];

    onGameEvent(GAME_EVENTS.CHECKPOINT_ACTIVATED, (payload) => {
      checkpointEvents.push(payload);
    });
    onGameEvent(GAME_EVENTS.PLAYER_DIED, (payload) => {
      deathEvents.push(payload);
    });
    onGameEvent(GAME_EVENTS.PLAYER_RESPAWNED, (payload) => {
      respawnEvents.push(payload);
    });

    gameStateStore.startLevel("level-01");
    gameStateStore.setActiveCheckpoint({
      id: "level-01-mid",
      levelId: "level-01",
      x: 128,
      y: 192,
    });
    gameStateStore.registerDeath("trap", { x: 130, y: 194 });
    gameStateStore.respawnAtCheckpoint();

    expect(checkpointEvents).toEqual([
      {
        levelId: "level-01",
        checkpointId: "level-01-mid",
        position: {
          x: 128,
          y: 192,
        },
      },
    ]);
    expect(deathEvents).toEqual([
      {
        levelId: "level-01",
        checkpointId: "level-01-mid",
        deathCount: 1,
        cause: "trap",
        position: {
          x: 130,
          y: 194,
        },
      },
    ]);
    expect(respawnEvents).toEqual([
      {
        levelId: "level-01",
        checkpointId: "level-01-mid",
        position: {
          x: 128,
          y: 192,
        },
        isManualRestart: false,
      },
    ]);
  });
});
