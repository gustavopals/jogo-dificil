import { describe, expect, it } from "vitest";

import {
  formatDeathCounter,
  isDeathCounterOutsideCriticalArea,
} from "../src/game/ui/death-counter";

describe("death counter HUD", () => {
  it("formats the death counter for compact HUD display", () => {
    expect(formatDeathCounter(0)).toBe("Mortes 0");
    expect(formatDeathCounter(12)).toBe("Mortes 12");
    expect(formatDeathCounter(3.8)).toBe("Mortes 3");
    expect(formatDeathCounter(-4)).toBe("Mortes 0");
  });

  it("keeps the death counter in a small non-critical HUD area", () => {
    expect(isDeathCounterOutsideCriticalArea()).toBe(true);
  });
});
