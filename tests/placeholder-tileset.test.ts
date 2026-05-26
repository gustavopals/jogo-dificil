import labBackgroundPanelUrl from "../assets/tilesets/lab-background-panel.png";
import labHazardSpikesUrl from "../assets/tilesets/lab-hazard-spikes.png";
import labPlatformUrl from "../assets/tilesets/lab-platform.png";
import labSolidBlockUrl from "../assets/tilesets/lab-solid-block.png";
import { describe, expect, it } from "vitest";

import {
  PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS,
  PLACEHOLDER_TILESET_ASSET_KEYS,
  PLACEHOLDER_TILESET_ASSETS,
  PLACEHOLDER_TILESET_TILE_SIZE_PX,
} from "../src/data/art";

const TILESET_ASSET_URLS = {
  [PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK]: labSolidBlockUrl,
  [PLACEHOLDER_TILESET_ASSET_KEYS.PLATFORM]: labPlatformUrl,
  [PLACEHOLDER_TILESET_ASSET_KEYS.HAZARD_SPIKES]: labHazardSpikesUrl,
  [PLACEHOLDER_TILESET_ASSET_KEYS.BACKGROUND_PANEL]: labBackgroundPanelUrl,
} as const;

describe("placeholder tileset", () => {
  it("defines the four readable MVP tiles", () => {
    expect(PLACEHOLDER_LEVEL_TILESET_ASSET_KEYS).toEqual([
      PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK,
      PLACEHOLDER_TILESET_ASSET_KEYS.PLATFORM,
      PLACEHOLDER_TILESET_ASSET_KEYS.HAZARD_SPIKES,
      PLACEHOLDER_TILESET_ASSET_KEYS.BACKGROUND_PANEL,
    ]);
    expect(PLACEHOLDER_TILESET_ASSETS).toHaveLength(4);
  });

  it("registers original project assets under assets/tilesets", () => {
    PLACEHOLDER_TILESET_ASSETS.forEach((asset) => {
      expect(asset.path).toMatch(/^assets\/tilesets\/[a-z0-9-]+\.png$/);
      expect(asset.origin).toBe("Gerado no projeto com magick");
      expect(asset.license).toBe("Original do projeto");
      expect(asset.description.length).toBeGreaterThan(24);
      expect(TILESET_ASSET_URLS[asset.key].length).toBeGreaterThan(0);
    });
  });

  it("keeps every tile at the base pixel-art size", () => {
    PLACEHOLDER_TILESET_ASSETS.forEach((asset) => {
      expect(asset.sizePx).toEqual({
        width: PLACEHOLDER_TILESET_TILE_SIZE_PX,
        height: PLACEHOLDER_TILESET_TILE_SIZE_PX,
      });
    });
  });
});
