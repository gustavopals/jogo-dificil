import { describe, expect, it } from "vitest";

import viteConfig from "../vite.config";

type BuildOptimizationConfig = {
  readonly build?: {
    readonly assetsInlineLimit?: number;
    readonly chunkSizeWarningLimit?: number;
    readonly rolldownOptions?: {
      readonly output?: {
        readonly codeSplitting?:
          | boolean
          | {
              readonly groups?: readonly {
                readonly name: string;
                readonly test?: RegExp;
                readonly priority?: number;
              }[];
            };
      };
    };
  };
};

describe("build optimization config", () => {
  it("externalizes large HD assets while keeping Phaser in a vendor chunk", () => {
    const config = viteConfig as BuildOptimizationConfig;
    const codeSplitting = config.build?.rolldownOptions?.output?.codeSplitting;

    expect(config.build?.assetsInlineLimit).toBe(4096);
    expect(config.build?.chunkSizeWarningLimit).toBe(1400);
    expect(codeSplitting).toMatchObject({
      groups: expect.arrayContaining([
        expect.objectContaining({
          name: "phaser-vendor",
          priority: 2,
        }),
      ]),
    });

    const phaserGroup =
      typeof codeSplitting === "object"
        ? codeSplitting.groups?.find((group) => group.name === "phaser-vendor")
        : undefined;

    expect(
      phaserGroup?.test?.test("/repo/node_modules/phaser/src/phaser.js"),
    ).toBe(true);
  });
});
