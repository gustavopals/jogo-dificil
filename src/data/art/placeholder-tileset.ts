import {
  INITIAL_VISUAL_DIRECTION,
  type VisualPaletteRole,
} from "./visual-direction";

export const PLACEHOLDER_TILESET_TILE_SIZE_PX =
  INITIAL_VISUAL_DIRECTION.tileSizePx;

export const PLACEHOLDER_TILESET_ASSET_KEYS = {
  SOLID_BLOCK: "tileset-lab-solid-block",
  PLATFORM: "tileset-lab-platform",
  HAZARD_SPIKES: "tileset-lab-hazard-spikes",
  BACKGROUND_PANEL: "tileset-lab-background-panel",
} as const;

export type PlaceholderTilesetAssetKey =
  (typeof PLACEHOLDER_TILESET_ASSET_KEYS)[keyof typeof PLACEHOLDER_TILESET_ASSET_KEYS];

export type PlaceholderTilesetAssetDefinition = {
  readonly key: PlaceholderTilesetAssetKey;
  readonly path: `assets/tilesets/${string}.png`;
  readonly sizePx: {
    readonly width: number;
    readonly height: number;
  };
  readonly paletteRole: VisualPaletteRole;
  readonly description: string;
  readonly origin: "Gerado no projeto com magick";
  readonly license: "Original do projeto";
};

export const PLACEHOLDER_TILESET_ASSETS = [
  {
    key: PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK,
    path: "assets/tilesets/lab-solid-block.png",
    sizePx: {
      width: PLACEHOLDER_TILESET_TILE_SIZE_PX,
      height: PLACEHOLDER_TILESET_TILE_SIZE_PX,
    },
    paletteRole: "metal",
    description: "Bloco solido industrial para paredes e massas grandes.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PLACEHOLDER_TILESET_ASSET_KEYS.PLATFORM,
    path: "assets/tilesets/lab-platform.png",
    sizePx: {
      width: PLACEHOLDER_TILESET_TILE_SIZE_PX,
      height: PLACEHOLDER_TILESET_TILE_SIZE_PX,
    },
    paletteRole: "metal",
    description: "Plataforma metalica de leitura rapida para pisos finos.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PLACEHOLDER_TILESET_ASSET_KEYS.HAZARD_SPIKES,
    path: "assets/tilesets/lab-hazard-spikes.png",
    sizePx: {
      width: PLACEHOLDER_TILESET_TILE_SIZE_PX,
      height: PLACEHOLDER_TILESET_TILE_SIZE_PX,
    },
    paletteRole: "hazard",
    description: "Perigo de espinhos com silhueta vermelha e contorno duro.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: PLACEHOLDER_TILESET_ASSET_KEYS.BACKGROUND_PANEL,
    path: "assets/tilesets/lab-background-panel.png",
    sizePx: {
      width: PLACEHOLDER_TILESET_TILE_SIZE_PX,
      height: PLACEHOLDER_TILESET_TILE_SIZE_PX,
    },
    paletteRole: "void",
    description: "Painel escuro repetivel para fundo simples de laboratorio.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
] as const satisfies readonly PlaceholderTilesetAssetDefinition[];

export const PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS = [
  PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK,
  PLACEHOLDER_TILESET_ASSET_KEYS.PLATFORM,
  PLACEHOLDER_TILESET_ASSET_KEYS.HAZARD_SPIKES,
  PLACEHOLDER_TILESET_ASSET_KEYS.BACKGROUND_PANEL,
] as const;
