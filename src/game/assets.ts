import playerPinoIdleUrl from "../../assets/sprites/player-pino-idle.png";

export const ASSET_KEYS = {
  PLAYER_PINO_IDLE: "player-pino-idle",
} as const;

export const IMAGE_ASSETS = [
  {
    key: ASSET_KEYS.PLAYER_PINO_IDLE,
    url: playerPinoIdleUrl,
  },
] as const;
