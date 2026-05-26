import { defineConfig } from "vite";

const LARGE_VENDOR_CHUNK_WARNING_LIMIT_KB = 1400;

export default defineConfig({
  build: {
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
