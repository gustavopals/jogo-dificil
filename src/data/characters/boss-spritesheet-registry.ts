import {
  SPRITESHEET_CELL_SIZE_PX,
  type SpritesheetAssetDefinition,
} from "../art";

export const BOSS_SPRITESHEET_KEYS = {
  HIROLITO_1024: "boss-hirolito-sheet-1024",
  DR_IMPORTS_1024: "boss-dr-imports-sheet-1024",
  GIGA_FABIO_1024: "boss-giga-fabio-sheet-1024",
} as const;

export type BossSpritesheetKey =
  (typeof BOSS_SPRITESHEET_KEYS)[keyof typeof BOSS_SPRITESHEET_KEYS];

export const BOSS_SPRITESHEET_ASSETS = [
  {
    key: BOSS_SPRITESHEET_KEYS.HIROLITO_1024,
    path: "assets/spritesheets/boss-hirolito-sheet-1024.png",
    sheetSizePx: 1024,
    frameWidth: SPRITESHEET_CELL_SIZE_PX,
    frameHeight: SPRITESHEET_CELL_SIZE_PX,
    purpose: "boss",
    enabled: true,
    description:
      "Sheet 1024 do Hirolito Narguilito com estados de idle, windup, attack e recover.",
  },
  {
    key: BOSS_SPRITESHEET_KEYS.DR_IMPORTS_1024,
    path: "assets/spritesheets/boss-dr-imports-sheet-1024.png",
    sheetSizePx: 1024,
    frameWidth: SPRITESHEET_CELL_SIZE_PX,
    frameHeight: SPRITESHEET_CELL_SIZE_PX,
    purpose: "boss",
    enabled: true,
    description:
      "Sheet 1024 do Dr. Imports com estados de idle, windup, attack e recover.",
  },
  {
    key: BOSS_SPRITESHEET_KEYS.GIGA_FABIO_1024,
    path: "assets/spritesheets/boss-giga-fabio-sheet-1024.png",
    sheetSizePx: 1024,
    frameWidth: SPRITESHEET_CELL_SIZE_PX,
    frameHeight: SPRITESHEET_CELL_SIZE_PX,
    purpose: "boss",
    enabled: true,
    description:
      "Sheet 1024 do Giga Fabio com estados de idle, windup, attack e recover.",
  },
] as const satisfies readonly SpritesheetAssetDefinition[];

export const BOSS_ANIMATION_FRAME_MS = 160;

export type BossAnimationState =
  | "inactive"
  | "intro"
  | "patrol"
  | "windup"
  | "attack"
  | "recover"
  | "stunned"
  | "defeated";

/**
 * Frame indices in the 4x4 boss sheet (0–15), mapped from reference art rows.
 * Hirolito: idle 0–2, intro/hose 3, charge 4–7, attack 8–9, hurt 12, death 13,
 * recover smoke 14–15.
 */
export const BOSS_ANIMATION_FRAMES = {
  HIROLITO_NARGUILITO: {
    inactive: [0],
    intro: [3],
    patrol: [0, 1, 2],
    windup: [4, 5, 6, 7],
    attack: [8, 9],
    recover: [14, 15],
    stunned: [12],
    defeated: [13],
  },
  DR_IMPORTS: {
    inactive: [0],
    intro: [2],
    patrol: [0, 2],
    windup: [14, 2],
    attack: [6, 7],
    recover: [0, 2],
    stunned: [12],
    defeated: [13],
  },
  GIGA_FABIO: {
    inactive: [0],
    intro: [2],
    patrol: [0, 1, 2],
    windup: [4, 5, 6],
    attack: [7, 10],
    recover: [11],
    stunned: [14],
    defeated: [15],
  },
} as const satisfies Record<
  "HIROLITO_NARGUILITO" | "DR_IMPORTS" | "GIGA_FABIO",
  Record<BossAnimationState, readonly number[]>
>;

export const BOSS_STATE_FRAME_IDS = {
  INACTIVE: 0,
  INTRO: 0,
  PATROL: 0,
  WINDUP: 1,
  ATTACK: 2,
  RECOVER: 3,
  STUNNED: 3,
  DEFEATED: 4,
} as const;

export type BossHdVisualProfile = {
  readonly textureKey: BossSpritesheetKey;
  readonly displaySize: {
    readonly width: number;
    readonly height: number;
  };
  readonly bottomOffsetY: number;
};

export const BOSS_HD_VISUAL_PROFILES = {
  HIROLITO_NARGUILITO: {
    textureKey: BOSS_SPRITESHEET_KEYS.HIROLITO_1024,
    displaySize: {
      width: 56,
      height: 72,
    },
    bottomOffsetY: 0,
  },
  DR_IMPORTS: {
    textureKey: BOSS_SPRITESHEET_KEYS.DR_IMPORTS_1024,
    displaySize: {
      width: 56,
      height: 80,
    },
    bottomOffsetY: 0,
  },
  GIGA_FABIO: {
    textureKey: BOSS_SPRITESHEET_KEYS.GIGA_FABIO_1024,
    displaySize: {
      width: 72,
      height: 88,
    },
    bottomOffsetY: 0,
  },
} as const;

export type BossVisualProfileKey = keyof typeof BOSS_HD_VISUAL_PROFILES;

export function resolveBossVisualProfileKey(
  bossId: string,
): BossVisualProfileKey {
  if (bossId.includes("dr-imports")) {
    return "DR_IMPORTS";
  }

  if (bossId.includes("giga-fabio")) {
    return "GIGA_FABIO";
  }

  return "HIROLITO_NARGUILITO";
}

export function getBossAnimationFrames(
  bossId: string,
  state: BossAnimationState,
): readonly number[] {
  const profileKey = resolveBossVisualProfileKey(bossId);
  const frames = BOSS_ANIMATION_FRAMES[profileKey][state];

  return frames.length > 0 ? frames : BOSS_ANIMATION_FRAMES[profileKey].patrol;
}

export function resolveBossAnimationFrameIndex(
  bossId: string,
  state: BossAnimationState,
  stateElapsedMs: number,
): number {
  const frames = getBossAnimationFrames(bossId, state);
  const frameIndex = Math.floor(stateElapsedMs / BOSS_ANIMATION_FRAME_MS);

  return frames[frameIndex % frames.length] ?? frames[0] ?? 0;
}
