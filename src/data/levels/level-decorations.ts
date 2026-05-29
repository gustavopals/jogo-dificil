import type { LevelId } from "../../shared";
import { getResolutionScale } from "../../game/scale";

/** Decoração não colidível em coordenadas legadas (480x270 / tile 16). */
export type LevelDecorationKind = "bush" | "flower" | "lantern" | "cloud" | "mushroom";

export type LevelDecorationDefinition = {
  readonly kind: LevelDecorationKind;
  readonly x: number;
  readonly y: number;
  readonly color?: number;
};

const LEGACY_DECORATIONS = {
  "level-01": [
    { kind: "bush", x: 72, y: 206 },
    { kind: "flower", x: 136, y: 210, color: 0xff6b9d },
    { kind: "lantern", x: 96, y: 182 },
    { kind: "mushroom", x: 248, y: 208 },
    { kind: "cloud", x: 512, y: 44 },
  ],
  "level-02": [
    { kind: "bush", x: 72, y: 222 },
    { kind: "mushroom", x: 288, y: 222 },
    { kind: "lantern", x: 504, y: 222 },
    { kind: "flower", x: 568, y: 222, color: 0xf0a830 },
    { kind: "bush", x: 848, y: 222 },
  ],
  "level-03": [
    { kind: "lantern", x: 128, y: 180 },
    { kind: "mushroom", x: 80, y: 208 },
    { kind: "bush", x: 320, y: 206 },
    { kind: "flower", x: 256, y: 138, color: 0xb8a9c9 },
    { kind: "flower", x: 480, y: 210, color: 0x9b5de5 },
    { kind: "lantern", x: 688, y: 168 },
    { kind: "cloud", x: 880, y: 44 },
    { kind: "mushroom", x: 1008, y: 208 },
  ],
  "level-04": [
    { kind: "lantern", x: 96, y: 172 },
    { kind: "bush", x: 48, y: 206 },
    { kind: "cloud", x: 80, y: 36 },
    { kind: "cloud", x: 264, y: 28 },
    { kind: "flower", x: 272, y: 210, color: 0x4cc9f0 },
    { kind: "bush", x: 432, y: 206 },
    { kind: "lantern", x: 512, y: 164 },
    { kind: "flower", x: 576, y: 210, color: 0x80d7c2 },
    { kind: "cloud", x: 656, y: 40 },
    { kind: "lantern", x: 864, y: 160 },
    { kind: "flower", x: 784, y: 210, color: 0x56cfe1 },
    { kind: "cloud", x: 880, y: 32 },
  ],
  "level-05": [
    { kind: "cloud", x: 112, y: 36 },
    { kind: "mushroom", x: 160, y: 208 },
    { kind: "flower", x: 300, y: 210, color: 0xe76f51 },
    { kind: "bush", x: 440, y: 206 },
    { kind: "flower", x: 560, y: 210, color: 0xf4a261 },
    { kind: "lantern", x: 688, y: 172 },
    { kind: "bush", x: 820, y: 206 },
    { kind: "cloud", x: 896, y: 44 },
  ],
  "level-06": [
    { kind: "lantern", x: 72, y: 172 },
    { kind: "flower", x: 128, y: 210, color: 0x9b5de5 },
    { kind: "bush", x: 192, y: 206 },
    { kind: "cloud", x: 288, y: 44 },
    { kind: "mushroom", x: 264, y: 152 },
    { kind: "lantern", x: 504, y: 168 },
    { kind: "flower", x: 488, y: 210, color: 0x4cc9f0 },
    { kind: "bush", x: 560, y: 206 },
    { kind: "lantern", x: 608, y: 164 },
    { kind: "flower", x: 672, y: 210, color: 0x9b5de5 },
    { kind: "cloud", x: 768, y: 48 },
    { kind: "mushroom", x: 856, y: 208 },
    { kind: "bush", x: 928, y: 206 },
    { kind: "lantern", x: 992, y: 160 },
    { kind: "lantern", x: 1088, y: 148 },
    { kind: "flower", x: 1120, y: 210, color: 0x9b5de5 },
    { kind: "cloud", x: 1216, y: 36 },
    { kind: "lantern", x: 1312, y: 148 },
    { kind: "bush", x: 1360, y: 206 },
  ],
  "level-07": [
    { kind: "lantern", x: 80, y: 172 },
    { kind: "flower", x: 168, y: 210, color: 0x56cfe1 },
    { kind: "cloud", x: 192, y: 36 },
    { kind: "bush", x: 256, y: 206 },
    { kind: "flower", x: 344, y: 210, color: 0x4cc9f0 },
    { kind: "lantern", x: 400, y: 168 },
    { kind: "mushroom", x: 464, y: 208 },
    { kind: "lantern", x: 496, y: 164 },
    { kind: "flower", x: 568, y: 210, color: 0x80d7c2 },
    { kind: "bush", x: 624, y: 206 },
    { kind: "cloud", x: 688, y: 44 },
    { kind: "flower", x: 736, y: 210, color: 0x56cfe1 },
    { kind: "lantern", x: 816, y: 160 },
    { kind: "mushroom", x: 896, y: 208 },
  ],
  "level-08": [
    { kind: "cloud", x: 128, y: 32 },
    { kind: "bush", x: 64, y: 206 },
    { kind: "lantern", x: 160, y: 168 },
    { kind: "flower", x: 176, y: 210, color: 0x9b5de5 },
    { kind: "mushroom", x: 224, y: 208 },
    { kind: "lantern", x: 288, y: 172 },
    { kind: "flower", x: 320, y: 210, color: 0x56cfe1 },
    { kind: "lantern", x: 416, y: 164 },
    { kind: "cloud", x: 544, y: 40 },
    { kind: "bush", x: 560, y: 206 },
    { kind: "lantern", x: 528, y: 160 },
    { kind: "mushroom", x: 704, y: 208 },
    { kind: "flower", x: 768, y: 210, color: 0x48b8d0 },
    { kind: "lantern", x: 816, y: 156 },
    { kind: "flower", x: 864, y: 210, color: 0x56cfe1 },
    { kind: "cloud", x: 832, y: 48 },
  ],
  "level-09": [
    { kind: "cloud", x: 112, y: 40 },
    { kind: "bush", x: 128, y: 206 },
    { kind: "flower", x: 176, y: 210, color: 0x4ea8de },
    { kind: "lantern", x: 256, y: 168 },
    { kind: "flower", x: 352, y: 210, color: 0x56cfe1 },
    { kind: "lantern", x: 416, y: 164 },
    { kind: "mushroom", x: 480, y: 208 },
    { kind: "bush", x: 544, y: 206 },
    { kind: "cloud", x: 608, y: 48 },
    { kind: "lantern", x: 672, y: 160 },
    { kind: "flower", x: 704, y: 210, color: 0x80d7c2 },
    { kind: "mushroom", x: 752, y: 208 },
    { kind: "lantern", x: 832, y: 156 },
    { kind: "flower", x: 880, y: 210, color: 0x48b0e8 },
    { kind: "cloud", x: 912, y: 44 },
  ],
  "level-10": [
    { kind: "lantern", x: 72, y: 172 },
    { kind: "flower", x: 96, y: 210, color: 0xffd166 },
    { kind: "lantern", x: 144, y: 88 },
    { kind: "lantern", x: 528, y: 88 },
    { kind: "lantern", x: 216, y: 120 },
    { kind: "lantern", x: 456, y: 120 },
    { kind: "cloud", x: 336, y: 40 },
    { kind: "cloud", x: 200, y: 52 },
    { kind: "cloud", x: 472, y: 48 },
    { kind: "lantern", x: 592, y: 164 },
  ],
  "level-11": [
    { kind: "lantern", x: 80, y: 168 },
    { kind: "bush", x: 48, y: 206 },
    { kind: "flower", x: 96, y: 210, color: 0xffd166 },
    { kind: "flower", x: 160, y: 210, color: 0x56cfe1 },
    { kind: "cloud", x: 272, y: 28 },
    { kind: "cloud", x: 304, y: 44 },
    { kind: "lantern", x: 208, y: 152 },
    { kind: "flower", x: 288, y: 210, color: 0xffd166 },
    { kind: "mushroom", x: 416, y: 208 },
    { kind: "flower", x: 368, y: 210, color: 0x4cc9f0 },
    { kind: "lantern", x: 472, y: 160 },
    { kind: "cloud", x: 520, y: 32 },
    { kind: "flower", x: 544, y: 210, color: 0xffd166 },
    { kind: "lantern", x: 608, y: 148 },
    { kind: "lantern", x: 656, y: 148 },
    { kind: "flower", x: 632, y: 210, color: 0x56cfe1 },
    { kind: "cloud", x: 760, y: 40 },
    { kind: "cloud", x: 880, y: 36 },
    { kind: "flower", x: 832, y: 210, color: 0xffd166 },
    { kind: "bush", x: 912, y: 206 },
  ],
} as const satisfies Partial<Record<LevelId, readonly LevelDecorationDefinition[]>>;

const DECORATION_COLORS = {
  bush: 0x5a9e4b,
  bushHighlight: 0x7bc96f,
  flower: 0xff6b9d,
  flowerCenter: 0xf4d35e,
  lantern: 0xffb703,
  lanternGlow: 0xffe066,
  cloud: 0xf5f7fb,
  mushroom: 0xe76f51,
  mushroomSpot: 0xf5f7fb,
} as const;

export function getLevelDecorations(
  levelId: LevelId,
): readonly LevelDecorationDefinition[] {
  return LEGACY_DECORATIONS[levelId as keyof typeof LEGACY_DECORATIONS] ?? [];
}

export function scaleLevelDecoration(
  decoration: LevelDecorationDefinition,
): LevelDecorationDefinition & { readonly scale: number } {
  const factor = getResolutionScale().uniform;

  return {
    ...decoration,
    x: Math.round(decoration.x * factor),
    y: Math.round(decoration.y * factor),
    scale: factor,
  };
}

export function getDecorationColors(
  decoration: LevelDecorationDefinition,
): { readonly primary: number; readonly secondary: number } {
  switch (decoration.kind) {
    case "bush":
      return {
        primary: DECORATION_COLORS.bush,
        secondary: DECORATION_COLORS.bushHighlight,
      };
    case "flower":
      return {
        primary: decoration.color ?? DECORATION_COLORS.flower,
        secondary: DECORATION_COLORS.flowerCenter,
      };
    case "lantern":
      return {
        primary: DECORATION_COLORS.lantern,
        secondary: DECORATION_COLORS.lanternGlow,
      };
    case "cloud":
      return {
        primary: DECORATION_COLORS.cloud,
        secondary: DECORATION_COLORS.cloud,
      };
    case "mushroom":
      return {
        primary: DECORATION_COLORS.mushroom,
        secondary: DECORATION_COLORS.mushroomSpot,
      };
  }
}
