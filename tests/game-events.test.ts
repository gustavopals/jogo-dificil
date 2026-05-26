import { afterEach, describe, expect, it } from "vitest";

import {
  clearAllGameEventListeners,
  emitGameEvent,
  GAME_EVENTS,
  onGameEvent,
  onceGameEvent,
  type PlayerDiedEvent,
} from "../src/game/systems/game-events";

afterEach(() => {
  clearAllGameEventListeners();
});

describe("game events", () => {
  it("emits typed payloads to subscribers", () => {
    const payload: PlayerDiedEvent = {
      levelId: "level-01",
      checkpointId: "level-01-start",
      deathCount: 1,
      cause: "hazard",
      sourceId: "level-01-fixed-spikes",
      position: {
        x: 64,
        y: 210,
      },
    };

    const receivedPayloads: PlayerDiedEvent[] = [];
    const unsubscribe = onGameEvent(GAME_EVENTS.PLAYER_DIED, (eventPayload) => {
      receivedPayloads.push(eventPayload);
    });

    emitGameEvent(GAME_EVENTS.PLAYER_DIED, payload);
    unsubscribe();
    emitGameEvent(GAME_EVENTS.PLAYER_DIED, {
      ...payload,
      deathCount: 2,
    });

    expect(receivedPayloads).toEqual([payload]);
  });

  it("runs one-time subscribers only once", () => {
    let eventCount = 0;

    onceGameEvent(GAME_EVENTS.AUDIO_MUTE_CHANGED, () => {
      eventCount += 1;
    });

    emitGameEvent(GAME_EVENTS.AUDIO_MUTE_CHANGED, { isMuted: true });
    emitGameEvent(GAME_EVENTS.AUDIO_MUTE_CHANGED, { isMuted: false });

    expect(eventCount).toBe(1);
  });
});
