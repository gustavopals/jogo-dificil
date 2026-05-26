import { describe, expect, it } from "vitest";

import { LEVEL_01 } from "../src/data/levels/level-01";
import {
  formatHudLabels,
  formatHudLevel,
  formatMusicMuteStatus,
  formatMuteStatus,
  isHudOutsideCriticalGameplayArea,
} from "../src/game/ui/hud";

describe("HUD", () => {
  it("formats the current level as a readable phase label", () => {
    expect(formatHudLevel(LEVEL_01)).toBe("Fase 1: Entrada Cruel");
  });

  it("only shows mute status when audio is muted", () => {
    expect(formatMuteStatus(false)).toBe("");
    expect(formatMuteStatus(true)).toBe("MUDO");
  });

  it("formats the music button state separately from global mute", () => {
    expect(formatMusicMuteStatus(false)).toBe("♪");
    expect(formatMusicMuteStatus(true)).toBe("OFF");
  });

  it("combines essential gameplay status into compact labels", () => {
    expect(
      formatHudLabels(
        {
          deathCount: 3,
          isMuted: true,
          isMusicMuted: false,
        },
        LEVEL_01,
      ),
    ).toEqual({
      deaths: "Mortes 3",
      level: "Fase 1: Entrada Cruel",
      music: "♪",
      mute: "MUDO",
    });
  });

  it("keeps the HUD in a small top area away from core platforming space", () => {
    expect(isHudOutsideCriticalGameplayArea()).toBe(true);
  });
});
