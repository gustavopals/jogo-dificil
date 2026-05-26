import { describe, expect, it } from "vitest";

import { SCENE_KEYS } from "../src/game/scenes/scene-keys";
import { GAME_SCENE_ORDER } from "../src/game/scenes/scene-order";

describe("scene list", () => {
  it("starts with BootScene so preload and menu are reached", () => {
    expect(GAME_SCENE_ORDER[0]).toBe(SCENE_KEYS.BOOT);
    expect(GAME_SCENE_ORDER.indexOf(SCENE_KEYS.AUDIO)).toBeGreaterThan(
      GAME_SCENE_ORDER.indexOf(SCENE_KEYS.BOOT),
    );
    expect(GAME_SCENE_ORDER.indexOf(SCENE_KEYS.MENU)).toBeGreaterThan(
      GAME_SCENE_ORDER.indexOf(SCENE_KEYS.PRELOAD),
    );
    expect(
      GAME_SCENE_ORDER.indexOf(SCENE_KEYS.LEVEL_TRANSITION),
    ).toBeGreaterThan(GAME_SCENE_ORDER.indexOf(SCENE_KEYS.LEVEL));
  });
});
