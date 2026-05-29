import { describe, expect, it } from "vitest";

import {
  LEVEL_TRANSITION_JUICE,
  resolveLevelTransitionFadeOutStartMs,
} from "../src/game/ui/level-transition-juice";
import { LEVEL_TRANSITION_DELAY_MS } from "../src/game/ui/level-transition";

describe("level transition juice", () => {
  it("starts fade-out before the configured transition delay ends", () => {
    const fadeOutStartMs = resolveLevelTransitionFadeOutStartMs(
      LEVEL_TRANSITION_DELAY_MS,
    );

    expect(fadeOutStartMs).toBe(
      LEVEL_TRANSITION_DELAY_MS - LEVEL_TRANSITION_JUICE.fadeOutLeadMs,
    );
    expect(fadeOutStartMs + LEVEL_TRANSITION_JUICE.fadeOutLeadMs).toBe(
      LEVEL_TRANSITION_DELAY_MS,
    );
  });
});
