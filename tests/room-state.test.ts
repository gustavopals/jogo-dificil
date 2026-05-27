import { describe, expect, it } from "vitest";

import {
  defineLevel,
  LEVEL_02,
  LEVEL_03,
  type LevelDefinition,
} from "../src/data/levels";
import {
  absorbEnergyTarget,
  activateEnergyCore,
  activateEnergyRelay,
  activateEnergySwitch,
  collectRoomItem,
  createInitialRoomState,
  damageEnergyTarget,
  markTrapTriggered,
  resetRoomStateForRespawn,
  setInteractiveObjectActive,
  setMovingPlatformFalling,
  spawnRoomProjectile,
  updateRoomEnergyTargets,
} from "../src/game/systems/room-state";

const LEVEL_WITH_REQUIRED_ITEM = defineLevel({
  ...LEVEL_03,
  items: [
    ...LEVEL_03.items,
    {
      id: "test-required-key",
      kind: "required",
      position: {
        x: 80,
        y: 176,
      },
      hitbox: {
        x: 72,
        y: 168,
        width: 16,
        height: 16,
      },
      persistsAfterDeath: false,
      assetId: "sprite-required-key",
    },
  ],
  assets: {
    ...LEVEL_03.assets,
    sprites: [...LEVEL_03.assets.sprites, "sprite-required-key"],
  },
} satisfies LevelDefinition);

describe("room state", () => {
  it("resets traps, projectiles, falling platforms and interactive objects", () => {
    const initialState = createInitialRoomState(LEVEL_02);
    const changedState = setInteractiveObjectActive(
      spawnRoomProjectile(
        setMovingPlatformFalling(
          markTrapTriggered(initialState, "level-02-falling-platform"),
          "level-02-falling-platform",
        ),
        {
          id: "test-projectile",
          sourceId: "level-02-falling-platform",
          position: {
            x: 120,
            y: 160,
          },
          velocity: {
            x: 80,
            y: 0,
          },
        },
      ),
      "level-02-lever-exit",
      true,
    );

    const resetState = resetRoomStateForRespawn(changedState, LEVEL_02);

    expect(resetState.traps["level-02-falling-platform"]).toMatchObject({
      isTriggered: false,
      isResolved: false,
    });
    expect(resetState.projectiles).toEqual([]);
    expect(
      resetState.movingPlatforms["level-02-falling-platform"],
    ).toMatchObject({
      area: LEVEL_02.traps[0]!.area,
      isFalling: false,
      isDisabled: false,
    });
    expect(resetState.interactiveObjects["level-02-lever-exit"]).toMatchObject({
      isActive: false,
    });
  });

  it("restores required items and preserves collected optional items that persist", () => {
    const initialState = createInitialRoomState(LEVEL_WITH_REQUIRED_ITEM);
    const changedState = collectRoomItem(
      collectRoomItem(initialState, "level-03-risk-token"),
      "test-required-key",
    );

    const resetState = resetRoomStateForRespawn(
      changedState,
      LEVEL_WITH_REQUIRED_ITEM,
    );

    expect(resetState.items["level-03-risk-token"]).toMatchObject({
      isCollected: true,
      isAvailable: false,
    });
    expect(resetState.items["test-required-key"]).toMatchObject({
      isCollected: false,
      isAvailable: true,
    });
  });

  it("tracks energy target damage, cracked blocks and respawn reset", () => {
    const levelWithEnergyTargets = defineLevel({
      ...LEVEL_02,
      energyTargets: [
        {
          id: "test-cracked-block",
          kind: "energy-cracked-block",
          area: {
            x: 176,
            y: 190,
            width: 24,
            height: 32,
          },
          acceptedPowers: ["cyan-burst"],
          hitPoints: 2,
          resetOnRespawn: true,
          blocksMovement: true,
        },
        {
          id: "test-boss-hurtbox",
          kind: "boss-hurtbox",
          area: {
            x: 256,
            y: 164,
            width: 32,
            height: 58,
          },
          acceptedPowers: ["cyan-spark", "cyan-burst"],
          hitPoints: 4,
          resetOnRespawn: false,
        },
      ],
    } satisfies LevelDefinition);
    const partialState = damageEnergyTarget(
      createInitialRoomState(levelWithEnergyTargets),
      "test-cracked-block",
      1,
    );
    const damagedState = damageEnergyTarget(
      damageEnergyTarget(partialState, "test-cracked-block", 1),
      "test-boss-hurtbox",
      2,
    );

    expect(partialState.energyTargets["test-cracked-block"]).toMatchObject({
      hitPointsRemaining: 1,
      isBroken: false,
      isActive: false,
    });
    expect(damagedState.energyTargets["test-cracked-block"]).toMatchObject({
      hitPointsRemaining: 0,
      isBroken: true,
      isActive: false,
    });
    expect(damagedState.energyTargets["test-boss-hurtbox"]).toMatchObject({
      hitPointsRemaining: 2,
      isBroken: false,
    });

    const resetState = resetRoomStateForRespawn(
      damagedState,
      levelWithEnergyTargets,
    );

    expect(resetState.energyTargets["test-cracked-block"]).toMatchObject({
      hitPointsRemaining: 2,
      isBroken: false,
    });
    expect(resetState.energyTargets["test-boss-hurtbox"]).toMatchObject({
      hitPointsRemaining: 2,
      isBroken: false,
    });
  });

  it("activates energy switches and their target interactive object", () => {
    const energySwitch = {
      id: "test-energy-switch",
      kind: "energy-switch",
      area: {
        x: 320,
        y: 198,
        width: 16,
        height: 24,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      activatesObjectId: "level-02-exit-door",
    } as const;
    const levelWithEnergySwitch = defineLevel({
      ...LEVEL_02,
      energyTargets: [energySwitch],
    } satisfies LevelDefinition);
    const activeState = activateEnergySwitch(
      createInitialRoomState(levelWithEnergySwitch),
      energySwitch,
    );

    expect(activeState.energyTargets["test-energy-switch"]).toMatchObject({
      hitPointsRemaining: 0,
      isActive: true,
      isBroken: false,
    });
    expect(activeState.interactiveObjects["level-02-exit-door"]).toMatchObject({
      isActive: true,
    });
  });

  it("advances energy relay pulses inside the declared window", () => {
    const energyRelay = {
      id: "test-energy-relay",
      kind: "energy-relay",
      area: {
        x: 320,
        y: 198,
        width: 16,
        height: 24,
      },
      acceptedPowers: ["cyan-spark"],
      hitPoints: 3,
      resetOnRespawn: true,
      activatesObjectId: "level-02-exit-door",
      relayWindowMs: 500,
    } as const;
    const levelWithEnergyRelay = defineLevel({
      ...LEVEL_02,
      energyTargets: [energyRelay],
    } satisfies LevelDefinition);
    const firstPulseState = activateEnergyRelay(
      createInitialRoomState(levelWithEnergyRelay),
      energyRelay,
    );
    const tickingState = updateRoomEnergyTargets(
      firstPulseState,
      levelWithEnergyRelay,
      300,
    );
    const secondPulseState = activateEnergyRelay(tickingState, energyRelay);
    const resetSequenceState = updateRoomEnergyTargets(
      secondPulseState,
      levelWithEnergyRelay,
      501,
    );
    const activeState = activateEnergyRelay(
      activateEnergyRelay(
        activateEnergyRelay(resetSequenceState, energyRelay),
        energyRelay,
      ),
      energyRelay,
    );

    expect(firstPulseState.energyTargets["test-energy-relay"]).toMatchObject({
      hitPointsRemaining: 2,
      relayWindowRemainingMs: 500,
      isActive: false,
    });
    expect(tickingState.energyTargets["test-energy-relay"]).toMatchObject({
      hitPointsRemaining: 2,
      relayWindowRemainingMs: 200,
      isActive: false,
    });
    expect(secondPulseState.energyTargets["test-energy-relay"]).toMatchObject({
      hitPointsRemaining: 1,
      relayWindowRemainingMs: 500,
      isActive: false,
    });
    expect(resetSequenceState.energyTargets["test-energy-relay"]).toMatchObject(
      {
        hitPointsRemaining: 3,
        relayWindowRemainingMs: 0,
        isActive: false,
      },
    );
    expect(activeState.energyTargets["test-energy-relay"]).toMatchObject({
      hitPointsRemaining: 0,
      relayWindowRemainingMs: 0,
      isActive: true,
    });
    expect(activeState.interactiveObjects["level-02-exit-door"]).toMatchObject({
      isActive: true,
    });
  });

  it("records energy absorber hits without activating or resolving the target", () => {
    const energyAbsorber = {
      id: "test-energy-absorber",
      kind: "energy-absorber",
      area: {
        x: 320,
        y: 198,
        width: 16,
        height: 24,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      absorbsEnergy: true,
    } as const;
    const levelWithEnergyAbsorber = defineLevel({
      ...LEVEL_02,
      energyTargets: [energyAbsorber],
    } satisfies LevelDefinition);
    const absorbedState = absorbEnergyTarget(
      absorbEnergyTarget(
        createInitialRoomState(levelWithEnergyAbsorber),
        energyAbsorber,
      ),
      energyAbsorber,
    );

    expect(absorbedState.energyTargets["test-energy-absorber"]).toMatchObject({
      absorbedEnergyHits: 2,
      hitPointsRemaining: 1,
      isActive: false,
      isBroken: false,
    });

    const resetState = resetRoomStateForRespawn(
      absorbedState,
      levelWithEnergyAbsorber,
    );

    expect(resetState.energyTargets["test-energy-absorber"]).toMatchObject({
      absorbedEnergyHits: 0,
      hitPointsRemaining: 1,
      isActive: false,
      isBroken: false,
    });
  });

  it("activates temporary energy cores and re-arms them after the declared duration", () => {
    const energyCore = {
      id: "test-energy-core",
      kind: "energy-core",
      area: {
        x: 320,
        y: 174,
        width: 24,
        height: 48,
      },
      acceptedPowers: ["cyan-burst"],
      hitPoints: 3,
      resetOnRespawn: true,
      activatesObjectId: "level-02-exit-door",
      activationDurationMs: 600,
    } as const;
    const levelWithEnergyCore = defineLevel({
      ...LEVEL_02,
      energyTargets: [energyCore],
    } satisfies LevelDefinition);
    const partialState = activateEnergyCore(
      createInitialRoomState(levelWithEnergyCore),
      energyCore,
      2,
    );
    const activeState = activateEnergyCore(partialState, energyCore, 2);
    const tickingState = updateRoomEnergyTargets(
      activeState,
      levelWithEnergyCore,
      300,
    );
    const rearmedState = updateRoomEnergyTargets(
      tickingState,
      levelWithEnergyCore,
      301,
    );

    expect(partialState.energyTargets["test-energy-core"]).toMatchObject({
      hitPointsRemaining: 1,
      activationRemainingMs: 0,
      isActive: false,
      isBroken: false,
    });
    expect(activeState.energyTargets["test-energy-core"]).toMatchObject({
      hitPointsRemaining: 0,
      activationRemainingMs: 600,
      isActive: true,
      isBroken: false,
    });
    expect(activeState.interactiveObjects["level-02-exit-door"]).toMatchObject({
      isActive: true,
    });
    expect(tickingState.energyTargets["test-energy-core"]).toMatchObject({
      hitPointsRemaining: 0,
      activationRemainingMs: 300,
      isActive: true,
    });
    expect(rearmedState.energyTargets["test-energy-core"]).toMatchObject({
      hitPointsRemaining: 3,
      activationRemainingMs: 0,
      isActive: false,
      isBroken: false,
    });
    expect(rearmedState.interactiveObjects["level-02-exit-door"]).toMatchObject(
      {
        isActive: false,
      },
    );

    const resetState = resetRoomStateForRespawn(
      activeState,
      levelWithEnergyCore,
    );

    expect(resetState.energyTargets["test-energy-core"]).toMatchObject({
      hitPointsRemaining: 3,
      activationRemainingMs: 0,
      isActive: false,
    });
    expect(resetState.interactiveObjects["level-02-exit-door"]).toMatchObject({
      isActive: false,
    });
  });
});
