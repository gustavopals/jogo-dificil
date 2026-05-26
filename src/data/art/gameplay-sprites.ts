import { INITIAL_VISUAL_DIRECTION } from "./visual-direction";

export const GAMEPLAY_SPRITE_KEYS = {
  TRAP_SPIKES: "trap-spikes",
  TRAP_FALSE_BLOCK: "trap-false-block",
  TRAP_FALLING_PLATFORM: "trap-falling-platform",
  TRAP_BREAKABLE_FLOOR: "trap-breakable-floor",
  TRAP_PROJECTILE: "trap-projectile",
  ITEM_REQUIRED_CHIP: "item-required-chip",
  ITEM_MECHANISM_KEY: "item-mechanism-key",
  ITEM_OPTIONAL_TOKEN: "item-optional-token",
  MARKER_CHECKPOINT_INACTIVE: "marker-checkpoint-inactive",
  MARKER_CHECKPOINT_ACTIVE: "marker-checkpoint-active",
  MARKER_EXIT: "marker-exit",
} as const;

export type GameplaySpriteKey =
  (typeof GAMEPLAY_SPRITE_KEYS)[keyof typeof GAMEPLAY_SPRITE_KEYS];

export type GameplaySpriteAssetDefinition = {
  readonly key: GameplaySpriteKey;
  readonly path: `assets/sprites/${string}.png`;
  readonly sizePx: {
    readonly width: number;
    readonly height: number;
  };
  readonly description: string;
  readonly origin: "Gerado no projeto com magick";
  readonly license: "Original do projeto";
};

const TILE_SIZE = INITIAL_VISUAL_DIRECTION.tileSizePx;
const TILE_SPRITE_SIZE = {
  width: TILE_SIZE,
  height: TILE_SIZE,
} as const;
const PROJECTILE_SPRITE_SIZE = {
  width: 8,
  height: 8,
} as const;

export const GAMEPLAY_SPRITE_ASSETS = [
  {
    key: GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES,
    path: "assets/sprites/trap-spikes.png",
    sizePx: TILE_SPRITE_SIZE,
    description:
      "Espinhos vermelhos com contorno duro para hazards e spike-pop.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.TRAP_FALSE_BLOCK,
    path: "assets/sprites/trap-false-block.png",
    sizePx: TILE_SPRITE_SIZE,
    description: "Bloco falso industrial com pequenos pixels roxos de trap.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.TRAP_FALLING_PLATFORM,
    path: "assets/sprites/trap-falling-platform.png",
    sizePx: TILE_SPRITE_SIZE,
    description: "Plataforma instavel com borda ciano e alerta inferior.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.TRAP_BREAKABLE_FLOOR,
    path: "assets/sprites/trap-breakable-floor.png",
    sizePx: TILE_SPRITE_SIZE,
    description: "Piso quebravel com rachaduras vermelhas legiveis.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.TRAP_PROJECTILE,
    path: "assets/sprites/trap-projectile.png",
    sizePx: PROJECTILE_SPRITE_SIZE,
    description: "Projetil roxo em losango para traps disparadas.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.ITEM_REQUIRED_CHIP,
    path: "assets/sprites/item-required-chip.png",
    sizePx: TILE_SPRITE_SIZE,
    description: "Chip obrigatorio amarelo com nucleo ciano.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.ITEM_MECHANISM_KEY,
    path: "assets/sprites/item-mechanism-key.png",
    sizePx: TILE_SPRITE_SIZE,
    description: "Chave coral para mecanismos da fase.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.ITEM_OPTIONAL_TOKEN,
    path: "assets/sprites/item-optional-token.png",
    sizePx: TILE_SPRITE_SIZE,
    description: "Token opcional em losango ciano e amarelo.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_INACTIVE,
    path: "assets/sprites/marker-checkpoint-inactive.png",
    sizePx: TILE_SPRITE_SIZE,
    description: "Checkpoint inativo com poste escuro e faixa amarela.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_ACTIVE,
    path: "assets/sprites/marker-checkpoint-active.png",
    sizePx: TILE_SPRITE_SIZE,
    description: "Checkpoint ativo com poste ciano e brilho claro.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.MARKER_EXIT,
    path: "assets/sprites/marker-exit.png",
    sizePx: TILE_SPRITE_SIZE,
    description: "Saida de fase coral com painel vertical claro.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
] as const satisfies readonly GameplaySpriteAssetDefinition[];
