import { GAME_RESOLUTION, TILE_SIZE_PX } from "./constants";

export const LEGACY_GAME_RESOLUTION = {
  width: 480,
  height: 270,
} as const;

export const LEGACY_TILE_SIZE_PX = 16;

export type ResolutionScale = {
  readonly x: number;
  readonly y: number;
  readonly uniform: number;
};

export function getResolutionScale(): ResolutionScale {
  const x = GAME_RESOLUTION.width / LEGACY_GAME_RESOLUTION.width;
  const y = GAME_RESOLUTION.height / LEGACY_GAME_RESOLUTION.height;

  return {
    x,
    y,
    uniform: Math.min(x, y),
  };
}

export function getTileScaleFactor(): number {
  return TILE_SIZE_PX / LEGACY_TILE_SIZE_PX;
}

export function scaleLegacyX(value: number): number {
  return roundScaled(value, getResolutionScale().x);
}

export function scaleLegacyY(value: number): number {
  return roundScaled(value, getResolutionScale().y);
}

export function scaleLegacyPx(value: number): number {
  return roundScaled(value, getResolutionScale().uniform);
}

export function scaleLegacyFontPx(value: number): `${number}px` {
  return `${scaleLegacyPx(value)}px`;
}

export function legacyTileCountToPx(tileCount: number): number {
  return roundScaled(tileCount, getTileScaleFactor()) * LEGACY_TILE_SIZE_PX;
}

function roundScaled(value: number, scale: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(scale)) {
    return 0;
  }

  return Math.round(value * scale);
}
