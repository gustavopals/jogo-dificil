import playerDeath01Url from "../../assets/audio/sfx/player-death-01.wav";
import playerDeath02Url from "../../assets/audio/sfx/player-death-02.wav";
import playerDeath03Url from "../../assets/audio/sfx/player-death-03.wav";
import playerJumpUrl from "../../assets/audio/sfx/player-jump.wav";
import playerLandUrl from "../../assets/audio/sfx/player-land.wav";
import playerPrimaryUrl from "../../assets/audio/sfx/player-primary.wav";
import playerRespawnUrl from "../../assets/audio/sfx/player-respawn.wav";
import playerSecondaryUrl from "../../assets/audio/sfx/player-secondary.wav";
import playerPinoIdleUrl from "../../assets/sprites/player-pino-idle.png";
import { PLAYER_AUDIO_DEFINITIONS } from "../data/audio";
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

export const AUDIO_ASSETS = [
  {
    key: PLAYER_AUDIO_DEFINITIONS[0].assetKey,
    url: playerJumpUrl,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[1].assetKey,
    url: playerLandUrl,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[2].assetKey,
    url: playerDeath01Url,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[3].assetKey,
    url: playerDeath02Url,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[4].assetKey,
    url: playerDeath03Url,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[5].assetKey,
    url: playerRespawnUrl,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[6].assetKey,
    url: playerPrimaryUrl,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[7].assetKey,
    url: playerSecondaryUrl,
  },
] as const;
