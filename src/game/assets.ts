import playerPinoIdleUrl from "../../assets/sprites/player-pino-idle.png";
import { PINO_TEXTURE_KEYS } from "../data/characters/pino-animations";

export const ASSET_KEYS = {
  PLAYER_PINO_IDLE: PINO_TEXTURE_KEYS.IDLE,
} as const;

export const IMAGE_ASSETS = [
  {
    key: ASSET_KEYS.PLAYER_PINO_IDLE,
    url: playerPinoIdleUrl,
  },
] as const;
