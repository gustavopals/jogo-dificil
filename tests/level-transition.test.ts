import { describe, expect, it } from "vitest";

import { LEVEL_01, LEVEL_02, LEVEL_06 } from "../src/data/levels";
import {
  createLevelTransitionLabels,
  formatTransitionDeaths,
  formatTransitionLevel,
  formatTransitionResult,
  LEVEL_TRANSITION_DELAY_MS,
  normalizeTransitionDeathCount,
} from "../src/game/ui/level-transition";

describe("level transition UI", () => {
  it("formats the next-level transition with completed and upcoming phases", () => {
    expect(createLevelTransitionLabels(LEVEL_01, LEVEL_02, 4)).toMatchObject({
      title: "Fase concluida",
      detail: "Fase 1: Entrada Cruel -> Fase 2: O Caminho Nao Confia Em Voce",
      result: "",
      deaths: "Mortes 4",
      prompt: "",
      isFinal: false,
    });
  });

  it("formats the final campaign screen after the last phase", () => {
    expect(createLevelTransitionLabels(LEVEL_06, undefined, 9)).toMatchObject({
      title: "Campanha concluida",
      detail: "As 6 fases atuais foram vencidas",
      result: "",
      deaths: "Mortes 9",
      prompt: "ENTER reinicia",
      isFinal: true,
    });
  });

  it("keeps transition timing short and death count safe", () => {
    expect(LEVEL_TRANSITION_DELAY_MS).toBeGreaterThanOrEqual(700);
    expect(LEVEL_TRANSITION_DELAY_MS).toBeLessThanOrEqual(1500);
    expect(formatTransitionLevel(LEVEL_02)).toBe(
      "Fase 2: O Caminho Nao Confia Em Voce",
    );
    expect(formatTransitionDeaths(Number.NaN)).toBe("Mortes 0");
    expect(normalizeTransitionDeathCount(2.8)).toBe(2);
    expect(normalizeTransitionDeathCount(-3)).toBe(0);
  });

  it("formats compact local result labels", () => {
    expect(
      formatTransitionResult({
        elapsedMs: 12_340,
        deathCount: 1,
        bestTimeMs: 12_340,
        fewestDeaths: 1,
        isNewBestTime: true,
        isNewFewestDeaths: true,
      }),
    ).toBe("Resultado 12.3s | 1 morte | novo recorde");
    expect(
      formatTransitionResult({
        elapsedMs: 15_000,
        deathCount: 3,
        bestTimeMs: 12_340,
        fewestDeaths: 1,
        isNewBestTime: false,
        isNewFewestDeaths: false,
      }),
    ).toBe("Resultado 15.0s | 3 mortes | melhor 12.3s/1");
    expect(formatTransitionResult(null)).toBe("");
  });

  it("includes per-level result in transition labels when available", () => {
    expect(
      createLevelTransitionLabels(LEVEL_01, LEVEL_02, 4, {
        levelId: "level-01",
        elapsedMs: 8_200,
        deathCount: 0,
        bestTimeMs: 8_200,
        fewestDeaths: 0,
        completions: 1,
        isNewBestTime: true,
        isNewFewestDeaths: true,
      }),
    ).toMatchObject({
      result: "Resultado 8.2s | 0 mortes | novo recorde",
      deaths: "Mortes 4",
    });
  });
});
