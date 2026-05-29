import { describe, expect, it } from "vitest";

import { LEVEL_01, LEVEL_02, LEVEL_10, LEVEL_11 } from "../src/data/levels";
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
      detail: "Fase 1: Bem-vindo, Pino! -> Fase 2: O Caminho Nao Confia Em Voce",
      result: "",
      deaths: "Mortes 4",
      prompt: "",
      isFinal: false,
    });
  });

  it("formats the challenge unlock transition after the campaign finale", () => {
    expect(createLevelTransitionLabels(LEVEL_10, LEVEL_11, 9)).toMatchObject({
      title: "Desafio liberado",
      detail:
        "Fase 10: O Ultimo Nucleo -> Desafio: Circuito Relampago",
      deaths: "Mortes 9",
      prompt: "",
      isFinal: false,
    });
  });

  it("formats the final screen after the challenge segment", () => {
    expect(createLevelTransitionLabels(LEVEL_11, undefined, 4)).toMatchObject({
      title: "Desafio concluido",
      detail:
        "O segmento pos-campanha foi vencido. Campanha e desafio completos.",
      result: "",
      deaths: "Mortes 4",
      prompt: "ENTER reinicia",
      isFinal: true,
    });
  });

  it("keeps transition timing readable and death count safe", () => {
    expect(LEVEL_TRANSITION_DELAY_MS).toBeGreaterThanOrEqual(2500);
    expect(LEVEL_TRANSITION_DELAY_MS).toBeLessThanOrEqual(3500);
    expect(formatTransitionLevel(LEVEL_02)).toBe(
      "Fase 2: O Caminho Nao Confia Em Voce",
    );
    expect(formatTransitionLevel(LEVEL_11)).toBe("Desafio: Circuito Relampago");
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
