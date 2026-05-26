import { GAME_RESOLUTION, GAME_TITLE, TILE_SIZE_PX } from "../constants";
import { INITIAL_LEVEL_ID } from "../systems/game-state";

export const START_SCREEN_LEVEL_ID = INITIAL_LEVEL_ID;

export const START_SCREEN_COPY = {
  title: GAME_TITLE,
  startCommand: "INICIAR FASE 1: ENTER / ESPAÇO",
} as const;

export const START_SCREEN_TEXT_LINES = [
  START_SCREEN_COPY.title,
  START_SCREEN_COPY.startCommand,
] as const;

export const START_SCREEN_LAYOUT = {
  width: GAME_RESOLUTION.width,
  height: GAME_RESOLUTION.height,
  titleY: 66,
  commandY: 128,
  groundY: GAME_RESOLUTION.height - TILE_SIZE_PX * 3,
  playerX: 104,
  exitX: GAME_RESOLUTION.width - 92,
} as const;
