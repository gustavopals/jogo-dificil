import { describe, expect, it } from "vitest";

import { GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import {
  getCheckpointTextureKey,
  getExitTextureKey,
} from "../src/game/systems/level-markers";

describe("level markers", () => {
  it("uses distinct checkpoint textures for inactive and active states", () => {
    expect(getCheckpointTextureKey(false)).toBe(
      GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_INACTIVE,
    );
    expect(getCheckpointTextureKey(true)).toBe(
      GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_ACTIVE,
    );
  });

  it("uses the exit marker texture for level exits", () => {
    expect(getExitTextureKey()).toBe(GAMEPLAY_SPRITE_KEYS.MARKER_EXIT);
  });
});
