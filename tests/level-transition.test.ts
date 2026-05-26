import { describe, expect, it } from "vitest";

import { LEVEL_01, LEVEL_02, LEVEL_03 } from "../src/data/levels";
import {
  createLevelTransitionLabels,
  formatTransitionDeaths,
  formatTransitionLevel,
  LEVEL_TRANSITION_DELAY_MS,
  normalizeTransitionDeathCount,
} from "../src/game/ui/level-transition";

describe("level transition UI", () => {
  it("formats the next-level transition with completed and upcoming phases", () => {
    expect(createLevelTransitionLabels(LEVEL_01, LEVEL_02, 4)).toMatchObject({
      title: "Fase concluida",
      detail: "Fase 1: Entrada Cruel -> Fase 2: O Caminho Nao Confia Em Voce",
      deaths: "Mortes 4",
      prompt: "",
      isFinal: false,
    });
  });

  it("formats the final MVP screen after the last phase", () => {
    expect(createLevelTransitionLabels(LEVEL_03, undefined, 9)).toMatchObject({
      title: "MVP concluido",
      detail: "As 3 fases iniciais foram vencidas",
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
});
