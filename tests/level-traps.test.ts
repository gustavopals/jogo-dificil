import { describe, expect, it } from "vitest";

import { GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import { LEVEL_01, LEVEL_02, LEVEL_03 } from "../src/data/levels";
import {
  findTriggeredPositionTraps,
  getProjectileTrailFeedback,
  getProjectileTextureKey,
  getTrapBodyTextureKey,
  getTrapFeedback,
  getTrapVisualState,
} from "../src/game/systems/level-traps";
import {
  createInitialRoomState,
  markTrapResolved,
  markTrapTriggered,
  resetRoomStateForRespawn,
} from "../src/game/systems/room-state";
import { VISUAL_READABILITY_SEMANTIC_COLORS } from "../src/game/systems/visual-readability";

describe("level traps", () => {
  it("finds position-triggered traps that overlap the player hitbox", () => {
    const roomState = createInitialRoomState(LEVEL_01);
    const trap = LEVEL_01.traps[0]!;

    expect(
      findTriggeredPositionTraps(
        {
          x: trap.trigger.area.x + 4,
          y: trap.trigger.area.y + 4,
          width: 10,
          height: 10,
        },
        LEVEL_01.traps,
        roomState,
      ),
    ).toEqual([
      {
        trap,
        state: roomState.traps[trap.id],
      },
    ]);
  });

  it("ignores already triggered traps and interaction-only triggers", () => {
    const trap = LEVEL_01.traps[0]!;
    const roomState = markTrapTriggered(
      createInitialRoomState(LEVEL_01),
      trap.id,
    );

    expect(
      findTriggeredPositionTraps(trap.trigger.area, LEVEL_01.traps, roomState),
    ).toEqual([]);

    expect(
      findTriggeredPositionTraps(
        trap.trigger.area,
        [
          {
            ...trap,
            id: "interaction-only-trap",
            trigger: {
              ...trap.trigger,
              kind: "interaction",
            },
          },
        ],
        {
          ...roomState,
          traps: {
            "interaction-only-trap": {
              ...roomState.traps[trap.id]!,
              id: "interaction-only-trap",
              isTriggered: false,
            },
          },
        },
      ),
    ).toEqual([]);
  });

  it("uses room reset to arm resettable traps again", () => {
    const trap = LEVEL_01.traps[0]!;
    const triggeredState = markTrapTriggered(
      createInitialRoomState(LEVEL_01),
      trap.id,
    );

    expect(triggeredState.traps[trap.id]).toMatchObject({
      isTriggered: true,
    });

    expect(
      resetRoomStateForRespawn(triggeredState, LEVEL_01).traps[trap.id],
    ).toMatchObject({
      isTriggered: false,
    });
  });

  it("exposes visual feedback and future audio cue metadata", () => {
    const trap = LEVEL_01.traps[0]!;
    const roomState = createInitialRoomState(LEVEL_01);
    const armedFeedback = getTrapFeedback(trap, roomState.traps[trap.id]!);
    const triggeredFeedback = getTrapFeedback(
      trap,
      markTrapTriggered(roomState, trap.id).traps[trap.id]!,
    );

    expect(armedFeedback.visual.triggerAlpha).toBeLessThan(
      triggeredFeedback.visual.triggerAlpha,
    );
    expect(triggeredFeedback.audio).toEqual({
      cueId: "trap:spike-pop:triggered",
      event: "triggered",
    });
  });

  it("classifies armed, triggered and visually resolved trap states", () => {
    const spikePop = LEVEL_01.traps.find(
      (candidate) => candidate.kind === "spike-pop",
    )!;
    const breakableFloor = LEVEL_03.traps.find(
      (candidate) => candidate.kind === "breakable-floor",
    )!;
    const roomState = createInitialRoomState(LEVEL_03);
    const resolvedBreakableState = markTrapResolved(
      markTrapTriggered(roomState, breakableFloor.id),
      breakableFloor.id,
    );
    const resetState = resetRoomStateForRespawn(
      resolvedBreakableState,
      LEVEL_03,
    );

    expect(
      getTrapVisualState(
        spikePop,
        createInitialRoomState(LEVEL_01).traps[spikePop.id]!,
      ),
    ).toBe("armed");
    expect(
      getTrapVisualState(
        spikePop,
        markTrapTriggered(createInitialRoomState(LEVEL_01), spikePop.id).traps[
          spikePop.id
        ]!,
      ),
    ).toBe("triggered");
    expect(
      getTrapVisualState(
        breakableFloor,
        resolvedBreakableState.traps[breakableFloor.id]!,
      ),
    ).toBe("resolved");
    expect(
      getTrapVisualState(breakableFloor, resetState.traps[breakableFloor.id]!),
    ).toBe("armed");
  });

  it("adds stronger tells for projectile and breakable floor feedback", () => {
    const projectile = LEVEL_02.traps.find(
      (candidate) => candidate.kind === "projectile",
    )!;
    const breakableFloor = LEVEL_03.traps.find(
      (candidate) => candidate.kind === "breakable-floor",
    )!;
    const projectileFeedback = getTrapFeedback(
      projectile,
      createInitialRoomState(LEVEL_02).traps[projectile.id]!,
    );
    const armedBreakableFeedback = getTrapFeedback(
      breakableFloor,
      createInitialRoomState(LEVEL_03).traps[breakableFloor.id]!,
    );
    const resolvedBreakableFeedback = getTrapFeedback(
      breakableFloor,
      markTrapResolved(
        markTrapTriggered(createInitialRoomState(LEVEL_03), breakableFloor.id),
        breakableFloor.id,
      ).traps[breakableFloor.id]!,
    );

    expect(projectileFeedback.visual.tellAlpha).toBeGreaterThan(0);
    expect(armedBreakableFeedback.visual.crackAlpha).toBeGreaterThan(0);
    expect(resolvedBreakableFeedback.visual.crackAlpha).toBeGreaterThan(
      armedBreakableFeedback.visual.crackAlpha,
    );
  });

  it("keeps moving trap tells away from Pino energy cyan", () => {
    const fallingPlatform = LEVEL_02.traps.find(
      (candidate) => candidate.kind === "falling-platform",
    )!;
    const feedback = getTrapFeedback(
      fallingPlatform,
      createInitialRoomState(LEVEL_02).traps[fallingPlatform.id]!,
    );

    expect(feedback.visual.bodyColor).toBe(
      VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary,
    );
    expect(feedback.visual.tellColor).toBe(
      VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary,
    );
    expect(feedback.visual.bodyColor).not.toBe(
      VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary,
    );
  });

  it("keeps trap body and tell colors distinct from boss primary color", () => {
    const traps = [LEVEL_01, LEVEL_02, LEVEL_03].flatMap((level) =>
      level.traps.map((trap) => ({ level, trap })),
    );

    traps.forEach(({ level, trap }) => {
      const feedback = getTrapFeedback(
        trap,
        createInitialRoomState(level).traps[trap.id]!,
      );

      expect(feedback.visual.bodyColor).not.toBe(
        VISUAL_READABILITY_SEMANTIC_COLORS.boss.primary,
      );
      expect(feedback.visual.tellColor).not.toBe(
        VISUAL_READABILITY_SEMANTIC_COLORS.boss.primary,
      );
    });
  });

  it("creates projectile trail feedback behind the projectile direction", () => {
    expect(
      getProjectileTrailFeedback(
        {
          x: 100,
          y: 40,
          width: 8,
          height: 8,
        },
        {
          x: -150,
          y: 0,
        },
      ),
    ).toMatchObject({
      area: {
        x: 108,
        y: 42.5,
        height: 3,
      },
      color: 0x9b5de5,
      alpha: 0.42,
    });
  });

  it("maps MVP trap kinds to readable sprite art", () => {
    const spikePop = LEVEL_01.traps.find(
      (candidate) => candidate.kind === "spike-pop",
    )!;
    const fallingPlatform = LEVEL_02.traps.find(
      (candidate) => candidate.kind === "falling-platform",
    )!;
    const projectile = LEVEL_02.traps.find(
      (candidate) => candidate.kind === "projectile",
    )!;
    const falseBlock = LEVEL_03.traps.find(
      (candidate) => candidate.kind === "false-block",
    )!;
    const breakableFloor = LEVEL_03.traps.find(
      (candidate) => candidate.kind === "breakable-floor",
    )!;

    expect(getTrapBodyTextureKey(spikePop)).toBe(
      GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES,
    );
    expect(getTrapBodyTextureKey(fallingPlatform)).toBe(
      GAMEPLAY_SPRITE_KEYS.TRAP_FALLING_PLATFORM,
    );
    expect(getTrapBodyTextureKey(projectile)).toBe(
      GAMEPLAY_SPRITE_KEYS.TRAP_PROJECTILE,
    );
    expect(getTrapBodyTextureKey(falseBlock)).toBe(
      GAMEPLAY_SPRITE_KEYS.TRAP_FALSE_BLOCK,
    );
    expect(getTrapBodyTextureKey(breakableFloor)).toBe(
      GAMEPLAY_SPRITE_KEYS.TRAP_BREAKABLE_FLOOR,
    );
    expect(getProjectileTextureKey()).toBe(
      GAMEPLAY_SPRITE_KEYS.TRAP_PROJECTILE,
    );
  });
});
