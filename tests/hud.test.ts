import { describe, expect, it } from "vitest";

import { LEVEL_01 } from "../src/data/levels/level-01";
import {
  formatHudLabels,
  formatHudLevel,
  formatMusicMuteStatus,
  formatMuteStatus,
  getHudEnergyMeterView,
  HUD_ENERGY_METER_STYLE,
  isHudOutsideCriticalGameplayArea,
} from "../src/game/ui/hud";

describe("HUD", () => {
  it("formats the current level as a readable phase label", () => {
    expect(formatHudLevel(LEVEL_01)).toBe("Fase 1: Bem-vindo, Pino!");
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
      level: "Fase 1: Bem-vindo, Pino!",
      music: "♪",
      mute: "MUDO",
    });
  });

  it("keeps energy guidance out of fixed HUD text", () => {
    const labels = formatHudLabels(
      {
        deathCount: 3,
        isMuted: false,
        isMusicMuted: false,
      },
      LEVEL_01,
    );
    const fixedHudText = Object.values(labels).join(" ");
    const forbiddenTutorialPatterns = [
      /aperte/i,
      /pressione/i,
      /segure/i,
      /\bL\/C\b/i,
      /\bK\/X\b/i,
      /carregar energia/i,
      /energia insuficiente/i,
      /carga ciano/i,
      /centelha ciano/i,
      /rajada ciano/i,
    ];

    forbiddenTutorialPatterns.forEach((pattern) => {
      expect(fixedHudText).not.toMatch(pattern);
    });
  });

  it("formats the energy meter as small segmented fill ratios", () => {
    expect(
      getHudEnergyMeterView({
        current: 50,
        max: 100,
        isCharging: false,
        isFull: false,
      }),
    ).toMatchObject({
      fillRatio: 0.5,
      fillColor: HUD_ENERGY_METER_STYLE.fillColor,
      segmentFillRatios: [1, 1, 0.5, 0, 0],
    });
  });

  it("uses distinct energy meter colors for charging and full energy", () => {
    expect(
      getHudEnergyMeterView({
        current: 70,
        max: 100,
        isCharging: true,
        isFull: false,
      }).fillColor,
    ).toBe(HUD_ENERGY_METER_STYLE.chargingFillColor);

    expect(
      getHudEnergyMeterView({
        current: 100,
        max: 100,
        isCharging: false,
        isFull: true,
      }).fillColor,
    ).toBe(HUD_ENERGY_METER_STYLE.fullFillColor);
  });

  it("keeps the HUD in a small top area away from core platforming space", () => {
    expect(isHudOutsideCriticalGameplayArea()).toBe(true);
  });
});
