import { describe, expect, it } from "vitest";

import { GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import {
  getCheckpointMarkerAlpha,
  getCheckpointTextureKey,
  getExitMarkerVisual,
  getExitTextureKey,
  LEVEL_MARKER_VISUAL,
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

  it("exposes strong marker readability values for active checkpoints and blocked exits", () => {
    expect(getCheckpointMarkerAlpha(true)).toBe(
      LEVEL_MARKER_VISUAL.checkpointActiveAlpha,
    );
    expect(getCheckpointMarkerAlpha(false)).toBe(
      LEVEL_MARKER_VISUAL.checkpointInactiveAlpha,
    );
    expect(getCheckpointMarkerAlpha(true)).toBeGreaterThan(
      getCheckpointMarkerAlpha(false),
    );

    expect(getExitMarkerVisual(false)).toEqual({
      alpha: LEVEL_MARKER_VISUAL.exitReadyAlpha,
      tint: 0xffffff,
    });
    expect(getExitMarkerVisual(true)).toEqual({
      alpha: LEVEL_MARKER_VISUAL.exitBlockedAlpha,
      tint: LEVEL_MARKER_VISUAL.exitBlockedTint,
    });
  });
});
