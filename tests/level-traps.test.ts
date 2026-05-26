import { describe, expect, it } from "vitest";

import { GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import { LEVEL_01, LEVEL_02, LEVEL_03 } from "../src/data/levels";
import {
  findTriggeredPositionTraps,
  getProjectileTextureKey,
  getTrapBodyTextureKey,
  getTrapFeedback,
} from "../src/game/systems/level-traps";
import {
  createInitialRoomState,
  markTrapTriggered,
  resetRoomStateForRespawn,
} from "../src/game/systems/room-state";

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
