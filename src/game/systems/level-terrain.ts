import type {
  LevelDefinition,
  RectLike,
  TerrainDefinition,
  TerrainKind,
} from "../../shared";

const TERRAIN_PLACEHOLDER_COLORS = {
  solid: 0x314b57,
} as const satisfies Record<TerrainKind, number>;

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
