import type {
  LevelDefinition,
  RectLike,
  TerrainDefinition,
  TerrainKind,
} from "../../shared";
import {
  PLACEHOLDER_TILESET_ASSET_KEYS,
  type PlaceholderTilesetAssetKey,
} from "../../data/art";
import { TILE_SIZE_PX } from "../constants";

const TERRAIN_PLACEHOLDER_COLORS = {
  solid: 0x3f4958,
} as const satisfies Record<TerrainKind, number>;

const TERRAIN_PLACEHOLDER_TEXTURE_KEYS = {
  solid: PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK,
} as const satisfies Record<TerrainKind, PlaceholderTilesetAssetKey>;

export function getSolidTerrainAreas(
  level: LevelDefinition,
): readonly RectLike[] {
  return level.terrain
    .filter((terrain) => terrain.kind === "solid")
    .map((terrain) => ({
      ...terrain.area,
    }));
}

export function getTerrainPlaceholderColor(terrain: TerrainDefinition): number {
  return TERRAIN_PLACEHOLDER_COLORS[terrain.kind];
}

export function getTerrainPlaceholderTextureKey(
  terrain: TerrainDefinition,
): PlaceholderTilesetAssetKey {
  if (terrain.area.height <= TILE_SIZE_PX) {
    return PLACEHOLDER_TILESET_ASSET_KEYS.PLATFORM;
  }

  return TERRAIN_PLACEHOLDER_TEXTURE_KEYS[terrain.kind];
}
