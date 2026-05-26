import { describe, expect, it } from "vitest";

import { GAME_TITLE } from "../src/game/constants";
import { INITIAL_LEVEL_ID } from "../src/game/systems/game-state";
import {
  START_SCREEN_COPY,
  START_SCREEN_HUMOR_PHRASES,
  START_SCREEN_LAYOUT,
  START_SCREEN_LEVEL_ID,
  isPointInsideStartScreenMusicButton,
  pickRandomHumorPhrase,
} from "../src/game/ui/start-screen";

describe("start screen", () => {
  it("shows the provisional game name and a clear start command", () => {
    expect(START_SCREEN_COPY.title).toBe(GAME_TITLE);
    expect(START_SCREEN_COPY.startCommand).toContain("INICIAR FASE 1");
    expect(START_SCREEN_COPY.startCommand).toContain("ENTER");
    expect(START_SCREEN_COPY.startCommand).toContain("ESPAÇO");
  });

  it("includes studio credit and vibe tag", () => {
    expect(START_SCREEN_COPY.subtitle).toContain("pals corp");
    expect(START_SCREEN_COPY.vibeTag).toContain("vibe");
  });

  it("has humor phrases and picks one at random", () => {
    expect(START_SCREEN_HUMOR_PHRASES.length).toBeGreaterThanOrEqual(5);
    const phrase = pickRandomHumorPhrase();
    expect(
      START_SCREEN_HUMOR_PHRASES.includes(
        phrase as (typeof START_SCREEN_HUMOR_PHRASES)[number],
      ),
    ).toBe(true);
  });

  it("starts from the first level and keeps visual anchors inside the viewport", () => {
    expect(START_SCREEN_LEVEL_ID).toBe(INITIAL_LEVEL_ID);
    expect(START_SCREEN_LAYOUT.playerX).toBeGreaterThan(0);
    expect(START_SCREEN_LAYOUT.exitX).toBeLessThan(START_SCREEN_LAYOUT.width);
    expect(START_SCREEN_LAYOUT.groundY).toBeLessThan(
      START_SCREEN_LAYOUT.height,
    );
    expect(START_SCREEN_LAYOUT.musicButtonX).toBeGreaterThan(0);
    expect(
      START_SCREEN_LAYOUT.musicButtonX + START_SCREEN_LAYOUT.musicButtonWidth,
    ).toBeLessThanOrEqual(START_SCREEN_LAYOUT.width);
    expect(
      START_SCREEN_LAYOUT.musicButtonY + START_SCREEN_LAYOUT.musicButtonHeight,
    ).toBeLessThanOrEqual(START_SCREEN_LAYOUT.height);
  });

  it("keeps menu music button clicks from starting the game", () => {
    expect(
      isPointInsideStartScreenMusicButton(
        START_SCREEN_LAYOUT.musicButtonTextX,
        START_SCREEN_LAYOUT.musicButtonTextY,
      ),
    ).toBe(true);
    expect(isPointInsideStartScreenMusicButton(0, 0)).toBe(false);
  });
});
