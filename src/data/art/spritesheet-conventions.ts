// Upgrade de fidelidade: células 256x256 (antes 128x128) preservam o dobro de
// detalhe da arte de referência de personagens e bosses sem mudar o tamanho em
// tela (a proporção conteúdo/célula é mantida pelos scripts de geração).
export const SPRITESHEET_CELL_SIZE_PX = 256;

export const SPRITESHEET_ALLOWED_SHEET_SIZES_PX = [1024, 2048] as const;

export type SpritesheetSheetSizePx =
  (typeof SPRITESHEET_ALLOWED_SHEET_SIZES_PX)[number];

export const SPRITESHEET_GRID_BY_SIZE = {
  1024: {
    columns: 4,
    rows: 4,
    maxFrames: 16,
  },
  2048: {
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
