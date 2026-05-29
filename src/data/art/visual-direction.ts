import { PLAYER_SIZE, TILE_SIZE_PX } from "../../game/constants";

export const VISUAL_PALETTE_ROLES = [
  "void",
  "panel",
  "metal",
  "text",
  "shadow",
  "safe",
  "hero",
  "hazard",
  "exit",
  "specialTrap",
] as const;

export type VisualPaletteRole = (typeof VISUAL_PALETTE_ROLES)[number];

export type VisualPaletteEntry = {
  readonly hex: `#${string}`;
  readonly usage: string;
};

export const INITIAL_VISUAL_PALETTE = {
  void: {
    hex: "#111217",
    usage: "background void and deep room negative space",
  },
  panel: {
    hex: "#242630",
    usage: "HUD bands, pause overlays and distant structures",
  },
  metal: {
    hex: "#3f4958",
    usage: "solid terrain, platforms and lab blocks",
  },
  text: {
    hex: "#f5f7fb",
    usage: "primary text and small highlight pixels",
  },
  shadow: {
    hex: "#050608",
    usage: "outlines, contact shadows and hard separation",
  },
  safe: {
    hex: "#80d7c2",
    usage: "checkpoints, UI accent and readable interactive edges",
  },
  hero: {
    hex: "#f4d35e",
    usage: "Pino hair energy, key items and collectible focus",
  },
  hazard: {
    hex: "#e35d6a",
    usage: "spikes, damage states and immediate death warnings",
  },
  exit: {
    hex: "#e76f51",
    usage: "exit doors, trap tells and false safety accents",
  },
  specialTrap: {
    hex: "#9b5de5",
    usage: "projectiles and unusual trap mechanisms",
  },
} as const satisfies Record<VisualPaletteRole, VisualPaletteEntry>;

export const INITIAL_VISUAL_DIRECTION = {
  id: "cozy-cruel-lab-pixel-art",
  style: "low-res-pixel-art",
  thesis:
    "Cozy Stardew-inspired pixel art in a tricky test world: warm stone, grass and wood platforms, soft skies, and saturated semantic accents for danger, progress and false safety.",
  tileSizePx: TILE_SIZE_PX,
  playerApproxSizePx: {
    width: PLAYER_SIZE.visualWidth,
    height: PLAYER_SIZE.visualHeight,
  },
  playerHitboxSizePx: {
    width: PLAYER_SIZE.hitboxWidth,
    height: PLAYER_SIZE.hitboxHeight,
  },
  playerTileRatio: {
    width: PLAYER_SIZE.tileScale.visualWidth,
    height: PLAYER_SIZE.tileScale.visualHeight,
  },
  palette: INITIAL_VISUAL_PALETTE,
  assetRules: [
    "Read every sprite at 1x before adding detail.",
    "Keep collision-critical shapes blocky and predictable.",
    "Use hazard, safe and exit colors by meaning, not decoration.",
    "Prefer 1px hard outlines and flat fills over gradients.",
    "Keep background detail darker than gameplay objects.",
  ],
} as const;
