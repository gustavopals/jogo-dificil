import { describe, expect, it } from "vitest";

import {
  DEATH_FEEDBACK_DURATION_MS,
  formatDeathFeedback,
  hasDeathSource,
} from "../src/game/ui/death-feedback";

describe("death feedback", () => {
  it("formats short learning messages by death cause", () => {
    expect(formatDeathFeedback({ cause: "fall" })).toBe(
      "Caiu. O chao tambem mente.",
    );
    expect(formatDeathFeedback({ cause: "hazard" })).toBe("Perigo tocado.");
    expect(formatDeathFeedback({ cause: "trap" })).toBe("Armadilha ativada.");
    expect(formatDeathFeedback({ cause: "projectile" })).toBe(
      "Projetil acertou.",
    );
    expect(formatDeathFeedback({ cause: "crusher" })).toBe("Esmagado.");
    expect(formatDeathFeedback({ cause: "boss" })).toBe("Chefe acertou.");
    expect(formatDeathFeedback({ cause: "unknown" })).toBe("Morte registrada.");
  });

  it("keeps HUD feedback under one second", () => {
    expect(DEATH_FEEDBACK_DURATION_MS).toBeGreaterThan(0);
    expect(DEATH_FEEDBACK_DURATION_MS).toBeLessThan(1000);
  });

  it("detects when the death event carries a source id", () => {
    expect(hasDeathSource({ sourceId: "level-01-spike-pop" })).toBe(true);
    expect(hasDeathSource({ sourceId: "" })).toBe(false);
    expect(hasDeathSource({})).toBe(false);
  });
});
