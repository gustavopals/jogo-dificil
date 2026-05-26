import { describe, expect, it } from "vitest";

import {
  formatPauseMuteStatus,
  PAUSE_OVERLAY_COPY,
  PAUSE_OVERLAY_LAYOUT,
} from "../src/game/ui/pause-overlay";

describe("pause overlay", () => {
  it("keeps pause commands compact and explicit", () => {
    expect(PAUSE_OVERLAY_COPY.title).toBe("Pausado");
    expect(PAUSE_OVERLAY_COPY.resumeCommand).toContain("ESC");
    expect(PAUSE_OVERLAY_COPY.muteCommand).toContain("M");
    expect(
      `${PAUSE_OVERLAY_COPY.resumeCommand} ${PAUSE_OVERLAY_COPY.muteCommand}`
        .length,
    ).toBeLessThanOrEqual(20);
  });

  it("formats the mute state for the paused screen", () => {
    expect(formatPauseMuteStatus(false)).toBe("Som: ligado");
    expect(formatPauseMuteStatus(true)).toBe("Som: mudo");
  });

  it("covers the gameplay viewport while paused", () => {
    expect(PAUSE_OVERLAY_LAYOUT.width).toBeGreaterThan(0);
    expect(PAUSE_OVERLAY_LAYOUT.height).toBeGreaterThan(0);
    expect(PAUSE_OVERLAY_LAYOUT.centerX).toBe(PAUSE_OVERLAY_LAYOUT.width / 2);
    expect(PAUSE_OVERLAY_LAYOUT.centerY).toBe(PAUSE_OVERLAY_LAYOUT.height / 2);
  });
});
