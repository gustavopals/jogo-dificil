import { describe, expect, it } from "vitest";

import { resolveDeathOverlayPeakAlpha } from "../src/game/ui/death-juice";

describe("death juice overlay", () => {
  it("returns configured peak alpha when juice is enabled", () => {
    expect(resolveDeathOverlayPeakAlpha(true)).toBeGreaterThan(0);
    expect(resolveDeathOverlayPeakAlpha(false)).toBe(0);
  });
});
