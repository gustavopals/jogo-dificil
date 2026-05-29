import { describe, expect, it } from "vitest";

import {
  getDevQaScaleSnapshot,
  type DevQaScaleSnapshot,
} from "../src/game/systems/dev-qa-scale";

describe("dev QA scale snapshot", () => {
  it("reports the official HD runtime scale and player collision contract", () => {
    const snapshot = getDevQaScaleSnapshot();

    expect(snapshot).toEqual({
      resolution: {
        width: 960,
        height: 540,
      },
      tileSizePx: 32,
      worldPhysicsScale: 2,
      playerVisual: {
        width: 32,
        height: 48,
      },
      playerHitbox: {
        width: 20,
        height: 36,
      },
      playerHitboxMargin: {
        left: 6,
        right: 6,
        top: 8,
        bottom: 4,
      },
    } satisfies DevQaScaleSnapshot);
  });

  it("keeps the hitbox smaller than the visual sprite for fair collisions", () => {
    const snapshot = getDevQaScaleSnapshot();

    expect(snapshot.playerHitbox.width).toBeLessThan(snapshot.playerVisual.width);
    expect(snapshot.playerHitbox.height).toBeLessThan(
      snapshot.playerVisual.height,
    );
  });
});
