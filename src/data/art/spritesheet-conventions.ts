export const SPRITESHEET_CELL_SIZE_PX = 128;

export const SPRITESHEET_ALLOWED_SHEET_SIZES_PX = [512, 1024] as const;

export type SpritesheetSheetSizePx =
  (typeof SPRITESHEET_ALLOWED_SHEET_SIZES_PX)[number];

export const SPRITESHEET_GRID_BY_SIZE = {
  512: {
    columns: 4,
    rows: 4,
    maxFrames: 16,
  },
  1024: {
    columns: 8,
    rows: 8,
    maxFrames: 64,
  },
} as const satisfies Record<
  SpritesheetSheetSizePx,
  {
    readonly columns: number;
    readonly rows: number;
    readonly maxFrames: number;
  }
>;

export type SpritesheetPurpose = "player" | "boss" | "effects" | "legacy";

export type SpritesheetAssetDefinition = {
  readonly key: string;
  readonly path: `assets/spritesheets/${string}.png`;
  readonly sheetSizePx: SpritesheetSheetSizePx;
  readonly frameWidth: number;
  readonly frameHeight: number;
  readonly purpose: SpritesheetPurpose;
  readonly enabled: boolean;
  readonly description: string;
};

export function isValidSpritesheetFrameSize(
  frameWidth: number,
  frameHeight: number,
): boolean {
  return (
    Number.isFinite(frameWidth) &&
    Number.isFinite(frameHeight) &&
    frameWidth === SPRITESHEET_CELL_SIZE_PX &&
    frameHeight === SPRITESHEET_CELL_SIZE_PX
  );
}
