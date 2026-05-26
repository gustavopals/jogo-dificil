import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  clearAllGameEventListeners,
  GAME_EVENTS,
  onGameEvent,
  type CheckpointActivatedEvent,
  type PlayerDiedEvent,
  type PlayerRespawnedEvent,
} from "../src/game/systems/game-events";
import {
  GAME_RESOLUTION,
  PLAYER_SIZE,
  TILE_SIZE_PX,
} from "../src/game/constants";
import { gameStateStore } from "../src/game/systems/game-state";

beforeEach(() => {
  gameStateStore.resetRun();
});

afterEach(() => {
  clearAllGameEventListeners();
});

describe("game state", () => {
  it("uses the player bottom-center pivot as checkpoint position", () => {
    gameStateStore.startLevel("level-01");

    expect(gameStateStore.getSnapshot().activeCheckpoint).toMatchObject({
      x: TILE_SIZE_PX * 4,
      y: GAME_RESOLUTION.height - TILE_SIZE_PX * 3,
    });
    expect(PLAYER_SIZE.pivot).toEqual({
      x: 0.5,
      y: 1,
    });
  });

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

  it("can start a level at a data-defined spawn position", () => {
    gameStateStore.startLevel("level-02", {
      x: 96,
      y: 208,
    });

    expect(gameStateStore.getSnapshot().activeCheckpoint).toMatchObject({
      id: "level-02-start",
      levelId: "level-02",
      x: 96,
      y: 208,
    });
  });

  it("tracks alive and dead states without counting the same death twice", () => {
    const deathEvents: PlayerDiedEvent[] = [];

    onGameEvent(GAME_EVENTS.PLAYER_DIED, (payload) => {
      deathEvents.push(payload);
    });

    gameStateStore.startLevel("level-01");

    expect(gameStateStore.getSnapshot()).toMatchObject({
      playerLifeState: "alive",
      deathCount: 0,
    });

    expect(gameStateStore.registerDeath("fall", { x: 128, y: 320 })).toBe(1);
    expect(gameStateStore.getSnapshot()).toMatchObject({
      playerLifeState: "dead",
      deathCount: 1,
    });

    expect(gameStateStore.registerDeath("fall", { x: 128, y: 320 })).toBe(1);
    expect(deathEvents).toHaveLength(1);

    const respawnCheckpoint = gameStateStore.respawnAtCheckpoint();

    expect(respawnCheckpoint).toMatchObject({
      id: "level-01-start",
      levelId: "level-01",
    });
    expect(gameStateStore.getSnapshot()).toMatchObject({
      status: "playing",
      playerLifeState: "alive",
      deathCount: 1,
    });
  });

  it("treats manual restart as a checkpoint respawn without adding a death", () => {
    const deathEvents: PlayerDiedEvent[] = [];
    const respawnEvents: PlayerRespawnedEvent[] = [];

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

    expect(gameStateStore.respawnAtCheckpoint(true)).toMatchObject({
      id: "level-01-mid",
      levelId: "level-01",
      x: 128,
      y: 192,
    });

    expect(gameStateStore.getSnapshot()).toMatchObject({
      playerLifeState: "alive",
      deathCount: 0,
    });
    expect(deathEvents).toEqual([]);
    expect(respawnEvents).toEqual([
      {
        levelId: "level-01",
        checkpointId: "level-01-mid",
        position: {
          x: 128,
          y: 192,
        },
        isManualRestart: true,
      },
    ]);
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
