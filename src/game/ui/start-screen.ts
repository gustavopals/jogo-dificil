import { GAME_RESOLUTION, GAME_TITLE, TILE_SIZE_PX } from "../constants";
import { INITIAL_LEVEL_ID } from "../systems/game-state";

export const START_SCREEN_LEVEL_ID = INITIAL_LEVEL_ID;

export const START_SCREEN_COPY = {
  title: GAME_TITLE,
  subtitle: "um jogo da pals corp.",
  vibeTag: "~ vibe coded ~",
  startCommand: "INICIAR FASE 1: ENTER / ESPAÇO",
} as const;

export const START_SCREEN_HUMOR_PHRASES = [
  "Boa sorte. Voce vai precisar.",
  "O chao e lava. E o teto. E o ar.",
  "Recorde mundial: 0 mortes (mentira)",
  "Feito com raiva e carinho.",
  "Cada morte e uma licao. Voce vai aprender MUITO.",
  "Nao e bug, e dificuldade.",
  "Respire fundo. Nao vai adiantar.",
  "O Pino acredita em voce. Eu nao.",
  "Dica: nao morra. De nada.",
  "Testado por 0 jogadores e aprovado por nenhum.",
  "A culpa nunca e do controle. E do level designer.",
  "Spoiler: o proximo obstaculo e pior.",
] as const;

export const START_SCREEN_LAYOUT = {
  width: GAME_RESOLUTION.width,
  height: GAME_RESOLUTION.height,
  titleY: 52,
  subtitleY: 80,
  humorPhraseY: 106,
  commandY: 132,
  statsY: GAME_RESOLUTION.height - TILE_SIZE_PX * 3 + 20,
  vibeTagY: GAME_RESOLUTION.height - TILE_SIZE_PX * 3 - 14,
  groundY: GAME_RESOLUTION.height - TILE_SIZE_PX * 3,
  playerX: 104,
  exitX: GAME_RESOLUTION.width - 92,
} as const;

const STORAGE_KEY = "jogo-dificil-stats";

type PersistedStats = {
  totalDeaths: number;
};

function readPersistedStats(): PersistedStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { totalDeaths: 0 };
    }

    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "totalDeaths" in parsed &&
      typeof (parsed as PersistedStats).totalDeaths === "number"
    ) {
      return parsed as PersistedStats;
    }
  } catch {
    // corrupted data
  }

  return { totalDeaths: 0 };
}

function writePersistedStats(stats: PersistedStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // storage full or unavailable
  }
}

export function getTotalDeaths(): number {
  return readPersistedStats().totalDeaths;
}

export function addDeathsToTotal(count: number): number {
  const stats = readPersistedStats();
  stats.totalDeaths += count;
  writePersistedStats(stats);

  return stats.totalDeaths;
}

export function pickRandomHumorPhrase(): string {
  const index = Math.floor(Math.random() * START_SCREEN_HUMOR_PHRASES.length);

  return START_SCREEN_HUMOR_PHRASES[index] ?? START_SCREEN_HUMOR_PHRASES[0]!;
}

let sessionAttempts = 0;

export function incrementSessionAttempts(): number {
  sessionAttempts += 1;

  return sessionAttempts;
}

export function getSessionAttempts(): number {
  return sessionAttempts;
}
