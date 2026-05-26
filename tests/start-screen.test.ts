import { describe, expect, it } from "vitest";

import { GAME_TITLE } from "../src/game/constants";
import { INITIAL_LEVEL_ID } from "../src/game/systems/game-state";
import {
  START_SCREEN_COPY,
  START_SCREEN_LAYOUT,
  START_SCREEN_LEVEL_ID,
  START_SCREEN_TEXT_LINES,
} from "../src/game/ui/start-screen";

describe("start screen", () => {
  it("shows the provisional game name and a clear start command", () => {
    expect(START_SCREEN_COPY.title).toBe(GAME_TITLE);
    expect(START_SCREEN_COPY.startCommand).toContain("INICIAR FASE 1");
    expect(START_SCREEN_COPY.startCommand).toContain("ENTER");
    expect(START_SCREEN_COPY.startCommand).toContain("ESPAÇO");
  });

  it("keeps the first screen copy intentionally short", () => {
    expect(START_SCREEN_TEXT_LINES).toHaveLength(2);
    START_SCREEN_TEXT_LINES.forEach((line) => {
      expect(line.length).toBeLessThanOrEqual(32);
    });
  });

  it("starts from the first level and keeps visual anchors inside the viewport", () => {
    expect(START_SCREEN_LEVEL_ID).toBe(INITIAL_LEVEL_ID);
    expect(START_SCREEN_LAYOUT.playerX).toBeGreaterThan(0);
    expect(START_SCREEN_LAYOUT.exitX).toBeLessThan(START_SCREEN_LAYOUT.width);
    expect(START_SCREEN_LAYOUT.groundY).toBeLessThan(
      START_SCREEN_LAYOUT.height,
    );
  });
});
