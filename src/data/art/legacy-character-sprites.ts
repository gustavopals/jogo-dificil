import { GAMEPLAY_SPRITE_KEYS } from "./gameplay-sprites";

export type LegacyCharacterSpriteAssetDefinition = {
  readonly key:
    | typeof GAMEPLAY_SPRITE_KEYS.BOSS_HIROLITO_NARGUILITO
    | typeof GAMEPLAY_SPRITE_KEYS.BOSS_DR_IMPORTS
    | typeof GAMEPLAY_SPRITE_KEYS.BOSS_GIGA_FABIO;
  readonly path: `assets/legacy/bosses/${string}.png`;
  readonly sizePx: {
    readonly width: number;
    readonly height: number;
  };
  readonly description: string;
  readonly origin: "Gerado no projeto com magick";
  readonly license: "Original do projeto";
};

const BOSS_SPRITE_SIZES = {
  HIROLITO_NARGUILITO: {
    width: 96,
    height: 112,
  },
  DR_IMPORTS: {
    width: 96,
    height: 128,
  },
  GIGA_FABIO: {
    width: 120,
    height: 128,
  },
} as const;

/** Placeholders de corpo de boss antes da migracao HD; arquivados em `assets/legacy/`. */
export const LEGACY_BOSS_BODY_SPRITE_ASSETS = [
  {
    key: GAMEPLAY_SPRITE_KEYS.BOSS_HIROLITO_NARGUILITO,
    path: "assets/legacy/bosses/hirolito-narguilito.png",
    sizePx: BOSS_SPRITE_SIZES.HIROLITO_NARGUILITO,
    description:
      "Placeholder do Hirolito Narguilito com corpo de narguile e cristal ciano.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.BOSS_DR_IMPORTS,
    path: "assets/legacy/bosses/dr-imports.png",
    sizePx: BOSS_SPRITE_SIZES.DR_IMPORTS,
    description:
      "Placeholder do Dr. Imports com casaco escuro, maleta e fumaca roxa.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.BOSS_GIGA_FABIO,
    path: "assets/legacy/bosses/giga-fabio.png",
    sizePx: BOSS_SPRITE_SIZES.GIGA_FABIO,
    description:
      "Placeholder do Giga Fabio com silhueta grande, punhos dourados e nucleo ciano.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
] as const satisfies readonly LegacyCharacterSpriteAssetDefinition[];
