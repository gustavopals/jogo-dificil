import { INITIAL_VISUAL_DIRECTION } from "./visual-direction";

export const GAMEPLAY_SPRITE_KEYS = {
  TRAP_SPIKES: "trap-spikes",
  TRAP_FALSE_BLOCK: "trap-false-block",
  TRAP_FALLING_PLATFORM: "trap-falling-platform",
  TRAP_BREAKABLE_FLOOR: "trap-breakable-floor",
  TRAP_PROJECTILE: "trap-projectile",
  ENERGY_CYAN_SPARK_PROJECTILE: "energy-cyan-spark-projectile",
  ENERGY_CYAN_BURST_BEAM: "energy-cyan-burst-beam",
  ENERGY_IMPACT: "energy-impact",
  ENERGY_TARGET_ACTIVE: "energy-target-active",
  ENERGY_CRACKED_BLOCK_BROKEN: "energy-cracked-block-broken",
  ITEM_REQUIRED_CHIP: "item-required-chip",
  ITEM_MECHANISM_KEY: "item-mechanism-key",
  ITEM_OPTIONAL_TOKEN: "item-optional-token",
  MARKER_CHECKPOINT_INACTIVE: "marker-checkpoint-inactive",
  MARKER_CHECKPOINT_ACTIVE: "marker-checkpoint-active",
  MARKER_EXIT: "marker-exit",
  BOSS_HIROLITO_NARGUILITO: "boss-hirolito-narguilito",
  BOSS_DR_IMPORTS: "boss-dr-imports",
  BOSS_GIGA_FABIO: "boss-giga-fabio",
  BOSS_PROJECTILE_SMOKE_PUFF: "boss-projectile-smoke-puff",
  BOSS_PROJECTILE_IMPORT_BOTTLE: "boss-projectile-import-bottle",
  BOSS_PROJECTILE_BOULDER: "boss-projectile-boulder",
  BOSS_IMPACT_BURST: "boss-impact-burst",
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
// Fase 18: projeteis pequenos migraram de 8px para 16px nativos para leitura
// crisp em HD (tile 32), mantendo a grade de pixel art em multiplos de 8.
const PROJECTILE_SPRITE_SIZE = {
  width: 16,
  height: 16,
} as const;
const ENERGY_EFFECT_SPRITE_SIZE = {
  width: TILE_SIZE,
  height: TILE_SIZE,
} as const;
const BOSS_PROJECTILE_SPRITE_SIZES = {
  SMOKE_PUFF: {
    width: 16,
    height: 16,
  },
  IMPORT_BOTTLE: {
    width: 16,
    height: 16,
  },
  BOULDER: {
    width: 24,
    height: 24,
  },
  IMPACT_BURST: {
    width: 24,
    height: 24,
  },
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
    key: GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_SPARK_PROJECTILE,
    path: "assets/sprites/energy-cyan-spark-projectile.png",
    sizePx: PROJECTILE_SPRITE_SIZE,
    description: "Projetil pequeno da Centelha Ciano com nucleo claro.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_BURST_BEAM,
    path: "assets/sprites/energy-cyan-burst-beam.png",
    sizePx: ENERGY_EFFECT_SPRITE_SIZE,
    description: "Segmento tileavel do feixe curto da Rajada Ciano.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.ENERGY_IMPACT,
    path: "assets/sprites/energy-impact.png",
    sizePx: ENERGY_EFFECT_SPRITE_SIZE,
    description: "Explosao compacta de impacto ciano para tiros e alvos.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.ENERGY_TARGET_ACTIVE,
    path: "assets/sprites/energy-target-active.png",
    sizePx: ENERGY_EFFECT_SPRITE_SIZE,
    description: "Alvo de energia ativo com aro ciano e nucleo amarelo.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.ENERGY_CRACKED_BLOCK_BROKEN,
    path: "assets/sprites/energy-cracked-block-broken.png",
    sizePx: ENERGY_EFFECT_SPRITE_SIZE,
    description: "Bloco de energia quebrado em fragmentos com fendas claras.",
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
  {
    key: GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_SMOKE_PUFF,
    path: "assets/sprites/bosses/boss-projectile-smoke-puff.png",
    sizePx: BOSS_PROJECTILE_SPRITE_SIZES.SMOKE_PUFF,
    description:
      "Projetil placeholder de fumaca roxa para ataques de boss do tipo smoke-puff.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_IMPORT_BOTTLE,
    path: "assets/sprites/bosses/boss-projectile-import-bottle.png",
    sizePx: BOSS_PROJECTILE_SPRITE_SIZES.IMPORT_BOTTLE,
    description:
      "Projetil placeholder de garrafa importada para ataques de Dr. Imports.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_BOULDER,
    path: "assets/sprites/bosses/boss-projectile-boulder.png",
    sizePx: BOSS_PROJECTILE_SPRITE_SIZES.BOULDER,
    description:
      "Projetil placeholder de pedra pesada para arremessos do Giga Fabio.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
  {
    key: GAMEPLAY_SPRITE_KEYS.BOSS_IMPACT_BURST,
    path: "assets/sprites/bosses/boss-impact-burst.png",
    sizePx: BOSS_PROJECTILE_SPRITE_SIZES.IMPACT_BURST,
    description:
      "Impacto placeholder coral e amarelo para acertos e colisões de boss.",
    origin: "Gerado no projeto com magick",
    license: "Original do projeto",
  },
] as const satisfies readonly GameplaySpriteAssetDefinition[];
