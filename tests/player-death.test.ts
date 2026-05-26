import { describe, expect, it } from "vitest";

import { isBelowLevelDeathPlane } from "../src/game/systems/player-death";

const TEST_LEVEL = {
  bounds: {
    x: 0,
    y: 0,
    width: 480,
    height: 270,
  },
};

describe("player death", () => {
  it("detects fall death only after the player fully leaves the level below", () => {
    expect(
      isBelowLevelDeathPlane(
        {
          x: 120,
          y: 269,
          width: 10,
          height: 22,
        },
        TEST_LEVEL,
      ),
    ).toBe(false);

    expect(
      isBelowLevelDeathPlane(
        {
          x: 120,
          y: 271,
          width: 10,
          height: 22,
        },
        TEST_LEVEL,
      ),
    ).toBe(true);
  });
});
