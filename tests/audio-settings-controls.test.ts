import { describe, expect, it } from "vitest";

import {
  createMenuAudioSettingsLayout,
  isPointInsideAudioSettingsHitArea,
  resolveAudioSettingsHitArea,
} from "../src/game/ui/audio-settings-layout";

describe("audio settings controls", () => {
  it("defines a hit area that covers all slider rows", () => {
    const layout = createMenuAudioSettingsLayout();
    const hitArea = resolveAudioSettingsHitArea(layout);

    expect(layout.rows).toHaveLength(3);
    expect(hitArea.width).toBeGreaterThan(0);
    expect(hitArea.height).toBeGreaterThan(layout.rowHeight * 2);

    const centerX = hitArea.x + hitArea.width / 2;
    const centerY = hitArea.y + hitArea.height / 2;

    expect(centerX).toBeGreaterThanOrEqual(hitArea.x);
    expect(centerX).toBeLessThanOrEqual(hitArea.x + hitArea.width);
    expect(centerY).toBeGreaterThanOrEqual(hitArea.y);
    expect(centerY).toBeLessThanOrEqual(hitArea.y + hitArea.height);
  });

  it("detects pointer hits inside the menu audio controls", () => {
    const layout = createMenuAudioSettingsLayout();
    const hitArea = resolveAudioSettingsHitArea(layout);
    const insideX = hitArea.x + hitArea.width / 2;
    const insideY = hitArea.y + hitArea.height / 2;

    expect(isPointInsideAudioSettingsHitArea(insideX, insideY, layout)).toBe(
      true,
    );
    expect(isPointInsideAudioSettingsHitArea(0, 0, layout)).toBe(false);
  });
});
