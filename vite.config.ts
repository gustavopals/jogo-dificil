import { defineConfig } from "vite";

// HD runtime skips legacy Pino/boss PNGs when spritesheets are active.
const HD_RUNTIME_ASSET_INLINE_LIMIT_BYTES = 4096;
const LARGE_VENDOR_CHUNK_WARNING_LIMIT_KB = 1400;

export default defineConfig({
  build: {
    // Keep small UI sprites inline; externalize HD sheets and large PNGs for cache.
    assetsInlineLimit: HD_RUNTIME_ASSET_INLINE_LIMIT_BYTES,
    // Phaser 3 is shipped as a large ESM module; keep it cached separately from
    // the game code and set the warning limit to the expected vendor size.
    chunkSizeWarningLimit: LARGE_VENDOR_CHUNK_WARNING_LIMIT_KB,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "phaser-vendor",
              test: /node_modules[\\/]phaser[\\/]/,
              priority: 2,
            },
            {
              name: "vendor",
              test: /node_modules[\\/]/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
});
