import bossDrImportsUrl from "../../assets/legacy/bosses/dr-imports.png";
import bossGigaFabioUrl from "../../assets/legacy/bosses/giga-fabio.png";
import bossHirolitoNarguilitoUrl from "../../assets/legacy/bosses/hirolito-narguilito.png";
import playerPinoCharge01Url from "../../assets/legacy/pino/player-pino-charge-01.png";
import playerPinoCharge02Url from "../../assets/legacy/pino/player-pino-charge-02.png";
import playerPinoCyanBurstFire01Url from "../../assets/legacy/pino/player-pino-cyan-burst-fire-01.png";
import playerPinoCyanBurstFire02Url from "../../assets/legacy/pino/player-pino-cyan-burst-fire-02.png";
import playerPinoCyanBurstPrepare01Url from "../../assets/legacy/pino/player-pino-cyan-burst-prepare-01.png";
import playerPinoCyanBurstPrepare02Url from "../../assets/legacy/pino/player-pino-cyan-burst-prepare-02.png";
import playerPinoCyanSpark01Url from "../../assets/legacy/pino/player-pino-cyan-spark-01.png";
import playerPinoCyanSpark02Url from "../../assets/legacy/pino/player-pino-cyan-spark-02.png";
import playerPinoDashUrl from "../../assets/legacy/pino/player-pino-dash.png";
import playerPinoDeath01Url from "../../assets/legacy/pino/player-pino-death-01.png";
import playerPinoDeath02Url from "../../assets/legacy/pino/player-pino-death-02.png";
import playerPinoFallUrl from "../../assets/legacy/pino/player-pino-fall.png";
import playerPinoIdleUrl from "../../assets/legacy/pino/player-pino-idle.png";
import playerPinoJumpUrl from "../../assets/legacy/pino/player-pino-jump.png";
import playerPinoJumpPeakUrl from "../../assets/legacy/pino/player-pino-jump-peak.png";
import playerPinoRespawn01Url from "../../assets/legacy/pino/player-pino-respawn-01.png";
import playerPinoRespawn02Url from "../../assets/legacy/pino/player-pino-respawn-02.png";
import playerPinoRun01Url from "../../assets/legacy/pino/player-pino-run-01.png";
import playerPinoRun02Url from "../../assets/legacy/pino/player-pino-run-02.png";
import playerPinoRun03Url from "../../assets/legacy/pino/player-pino-run-03.png";
import { GAMEPLAY_SPRITE_KEYS } from "../data/art";
import {
  PINO_TEXTURE_KEYS,
  type PinoTextureKey,
} from "../data/characters/pino-animations";
import type { ImageAssetDefinition } from "./assets";

/** PNGs de personagem arquivados; importados fora do bundle principal de producao. */
export const LEGACY_CHARACTER_IMAGE_ASSETS = [
  {
    key: PINO_TEXTURE_KEYS.IDLE,
    url: playerPinoIdleUrl,
  },
  {
    key: PINO_TEXTURE_KEYS.RUN_01,
    url: playerPinoRun01Url,
  },
  {
    key: PINO_TEXTURE_KEYS.RUN_02,
    url: playerPinoRun02Url,
  },
  {
    key: PINO_TEXTURE_KEYS.RUN_03,
    url: playerPinoRun03Url,
  },
  {
    key: PINO_TEXTURE_KEYS.JUMP,
    url: playerPinoJumpUrl,
  },
  {
    key: PINO_TEXTURE_KEYS.JUMP_PEAK,
    url: playerPinoJumpPeakUrl,
  },
  {
    key: PINO_TEXTURE_KEYS.FALL,
    url: playerPinoFallUrl,
  },
  {
    key: PINO_TEXTURE_KEYS.DASH,
    url: playerPinoDashUrl,
  },
  {
    key: PINO_TEXTURE_KEYS.CHARGE_01,
    url: playerPinoCharge01Url,
  },
  {
    key: PINO_TEXTURE_KEYS.CHARGE_02,
    url: playerPinoCharge02Url,
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_SPARK_01,
    url: playerPinoCyanSpark01Url,
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_SPARK_02,
    url: playerPinoCyanSpark02Url,
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_01,
    url: playerPinoCyanBurstPrepare01Url,
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_02,
    url: playerPinoCyanBurstPrepare02Url,
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_01,
    url: playerPinoCyanBurstFire01Url,
  },
  {
    key: PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_02,
    url: playerPinoCyanBurstFire02Url,
  },
  {
    key: PINO_TEXTURE_KEYS.DEATH_01,
    url: playerPinoDeath01Url,
  },
  {
    key: PINO_TEXTURE_KEYS.DEATH_02,
    url: playerPinoDeath02Url,
  },
  {
    key: PINO_TEXTURE_KEYS.RESPAWN_01,
    url: playerPinoRespawn01Url,
  },
  {
    key: PINO_TEXTURE_KEYS.RESPAWN_02,
    url: playerPinoRespawn02Url,
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.BOSS_HIROLITO_NARGUILITO,
    url: bossHirolitoNarguilitoUrl,
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.BOSS_DR_IMPORTS,
    url: bossDrImportsUrl,
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.BOSS_GIGA_FABIO,
    url: bossGigaFabioUrl,
  },
] as const satisfies readonly ImageAssetDefinition[];

export const LEGACY_PINO_TEXTURE_KEYS = Object.values(
  PINO_TEXTURE_KEYS,
) as readonly PinoTextureKey[];

export const LEGACY_BOSS_BODY_TEXTURE_KEYS = [
  GAMEPLAY_SPRITE_KEYS.BOSS_HIROLITO_NARGUILITO,
  GAMEPLAY_SPRITE_KEYS.BOSS_DR_IMPORTS,
  GAMEPLAY_SPRITE_KEYS.BOSS_GIGA_FABIO,
] as const;
