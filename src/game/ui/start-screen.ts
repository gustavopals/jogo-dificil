import { GAME_RESOLUTION, GAME_TITLE, TILE_SIZE_PX } from "../constants";
import { scaleLegacyX, scaleLegacyY } from "../scale";
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
  titleY: scaleLegacyY(46),
  subtitleY: scaleLegacyY(72),
  humorPhraseY: scaleLegacyY(100),
  commandY: scaleLegacyY(128),
  statsY: GAME_RESOLUTION.height - TILE_SIZE_PX * 3 + scaleLegacyY(16),
  vibeTagY: GAME_RESOLUTION.height - TILE_SIZE_PX * 3 - scaleLegacyY(18),
  groundY: GAME_RESOLUTION.height - TILE_SIZE_PX * 3,
  playerX: scaleLegacyX(130),
  exitX: GAME_RESOLUTION.width - scaleLegacyX(92),
  musicButtonX: GAME_RESOLUTION.width - scaleLegacyX(38),
  musicButtonY: scaleLegacyY(10),
  musicButtonWidth: scaleLegacyX(28),
  musicButtonHeight: scaleLegacyY(14),
  musicButtonTextX: GAME_RESOLUTION.width - scaleLegacyX(24),
  musicButtonTextY: scaleLegacyY(17),
} as const;

export const START_SCREEN_MUSIC_BUTTON_STYLE = {
  fillColor: 0x80d7c2,
  fillAlpha: 0.86,
  mutedFillColor: 0x262b31,
  mutedFillAlpha: 0.84,
  strokeColor: 0xf5f7fb,
  strokeAlpha: 0.42,
  textColor: "#050608",
  mutedTextColor: "#f5f7fb",
  fontSize: "9px",
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

export function isPointInsideStartScreenMusicButton(
  x: number,
  y: number,
): boolean {
  return (
    x >= START_SCREEN_LAYOUT.musicButtonX &&
    x <=
      START_SCREEN_LAYOUT.musicButtonX + START_SCREEN_LAYOUT.musicButtonWidth &&
    y >= START_SCREEN_LAYOUT.musicButtonY &&
    y <=
      START_SCREEN_LAYOUT.musicButtonY + START_SCREEN_LAYOUT.musicButtonHeight
  );
}
