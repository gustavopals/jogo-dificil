import { describe, expect, it } from "vitest";

import {
  defineLevel,
  LEVEL_02,
  type BossDefinition,
  type LevelDefinition,
} from "../src/data/levels";
import { transitionBossRuntimeState } from "../src/game/physics";
import {
  absorbEnergyTarget,
  activateEnergyCore,
  activateEnergyRelay,
  activateEnergySwitch,
  damageEnergyTarget,
  createInitialRoomState,
  setRoomBossRuntimeState,
  updateRoomEnergyTargets,
} from "../src/game/systems/room-state";
import {
  getCyanBurstBeamCollisionTargets,
  getCyanSparkCollisionTargets,
  getEnergyTargetSolidAreas,
  getLevelEnergyTargets,
} from "../src/game/systems/level-energy-targets";

const LEVEL_WITH_ENERGY_TARGETS = defineLevel({
  ...LEVEL_02,
  energyTargets: [
    {
      id: "test-cracked-block",
      kind: "energy-cracked-block",
      area: {
        x: 192,
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
      id: "test-energy-core",
      kind: "energy-core",
      area: {
        x: 256,
        y: 174,
        width: 24,
        height: 48,
      },
      acceptedPowers: ["cyan-burst"],
      hitPoints: 2,
      resetOnRespawn: true,
    },
    {
      id: "test-boss-hurtbox",
      kind: "boss-hurtbox",
      area: {
        x: 320,
        y: 158,
        width: 32,
        height: 64,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 4,
      resetOnRespawn: false,
      hitGroupId: "boss-test",
    },
  ],
} satisfies LevelDefinition);

const MOVING_BOSS = {
  id: "boss-test",
  levelId: "level-02",
  displayName: "Boss Test",
  arena: {
    x: 288,
    y: 126,
    width: 144,
    height: 112,
  },
  spawn: {
    x: 336,
    y: 190,
  },
  initialFacing: "left",
  health: 3,
  hitbox: {
    x: 320,
    y: 158,
    width: 32,
    height: 64,
  },
  weakPoint: {
    x: 320,
    y: 158,
    width: 32,
    height: 64,
  },
  resetOnRespawn: true,
  movement: {
    kind: "anchor-swap",
    anchors: [
      {
        x: 336,
        y: 190,
      },
      {
        x: 368,
        y: 190,
      },
    ],
  },
  attacks: [
    {
      id: "boss-test-smoke-swap",
      kind: "smoke-swap",
      windupMs: 500,
      activeMs: 220,
      recoverMs: 800,
      cooldownMs: 900,
      contactDamage: 0,
    },
  ],
  damageRules: [
    {
      power: "cyan-spark",
      damage: 1,
      validStates: ["recover"],
      requiresWeakPoint: true,
      oncePerAttack: false,
      consumesHit: true,
      effects: ["damage"],
    },
  ],
  vulnerabilityWindows: [
    {
      id: "boss-test-recover",
      state: "recover",
      durationMs: 800,
      weakPointActive: true,
    },
  ],
  entryCheckpointId: "level-02-mid",
  defeatUnlocks: ["level-02-exit-door"],
} satisfies BossDefinition;

const LEVEL_WITH_MOVING_BOSS_HURTBOX = defineLevel({
  ...LEVEL_WITH_ENERGY_TARGETS,
  bosses: [MOVING_BOSS],
} satisfies LevelDefinition);

describe("level energy targets", () => {
  it("exposes cracked blocks as solids until Rajada Ciano breaks them", () => {
    const targets = getLevelEnergyTargets(LEVEL_WITH_ENERGY_TARGETS);
    const initialState = createInitialRoomState(LEVEL_WITH_ENERGY_TARGETS);

    expect(getEnergyTargetSolidAreas(targets, initialState)).toEqual([
      LEVEL_WITH_ENERGY_TARGETS.energyTargets![0]!.area,
    ]);

    const brokenState = damageEnergyTarget(
      initialState,
      "test-cracked-block",
      2,
    );

    expect(getEnergyTargetSolidAreas(targets, brokenState)).toEqual([]);
  });

  it("keeps non-blocking cracked blocks targetable by Rajada without adding solids", () => {
    const crackedBlock = {
      id: "test-non-blocking-cracked-block",
      kind: "energy-cracked-block",
      area: {
        x: 192,
        y: 190,
        width: 24,
        height: 32,
      },
      acceptedPowers: ["cyan-burst"],
      hitPoints: 2,
      resetOnRespawn: true,
      blocksMovement: false,
    } as const;
    const level = defineLevel({
      ...LEVEL_02,
      energyTargets: [crackedBlock],
    } satisfies LevelDefinition);
    const targets = getLevelEnergyTargets(level);
    const initialState = createInitialRoomState(level);

    expect(getEnergyTargetSolidAreas(targets, initialState)).toEqual([]);
    expect(getCyanBurstBeamCollisionTargets(targets, initialState)).toEqual([
      {
        id: "test-non-blocking-cracked-block",
        kind: "cracked-block",
        area: crackedBlock.area,
      },
    ]);
  });

  it("maps energy blocks, targets and boss hurtboxes to Rajada Ciano collisions", () => {
    const targets = getLevelEnergyTargets(LEVEL_WITH_ENERGY_TARGETS);
    const roomState = createInitialRoomState(LEVEL_WITH_ENERGY_TARGETS);

    expect(getCyanBurstBeamCollisionTargets(targets, roomState)).toEqual([
      {
        id: "test-cracked-block",
        kind: "cracked-block",
        area: LEVEL_WITH_ENERGY_TARGETS.energyTargets![0]!.area,
      },
      {
        id: "test-energy-core",
        kind: "target",
        area: LEVEL_WITH_ENERGY_TARGETS.energyTargets![1]!.area,
      },
      {
        id: "test-boss-hurtbox",
        kind: "boss",
        area: LEVEL_WITH_ENERGY_TARGETS.energyTargets![2]!.area,
        hitGroupId: "boss-test",
      },
    ]);
  });

  it("does not expose cracked blocks to Centelha Ciano collisions", () => {
    const targets = getLevelEnergyTargets(LEVEL_WITH_ENERGY_TARGETS);
    const roomState = createInitialRoomState(LEVEL_WITH_ENERGY_TARGETS);

    expect(getCyanSparkCollisionTargets(targets, roomState)).not.toContainEqual(
      expect.objectContaining({
        id: "test-cracked-block",
      }),
    );
  });

  it("maps boss hurtboxes that accept Centelha Ciano to boss collision targets", () => {
    const targets = getLevelEnergyTargets(LEVEL_WITH_ENERGY_TARGETS);
    const roomState = createInitialRoomState(LEVEL_WITH_ENERGY_TARGETS);

    expect(getCyanSparkCollisionTargets(targets, roomState)).toContainEqual({
      id: "test-boss-hurtbox",
      kind: "boss",
      area: LEVEL_WITH_ENERGY_TARGETS.energyTargets![2]!.area,
    });
  });

  it("moves boss hurtbox collision targets with boss runtime position", () => {
    const targets = getLevelEnergyTargets(LEVEL_WITH_MOVING_BOSS_HURTBOX);
    const roomState = createInitialRoomState(LEVEL_WITH_MOVING_BOSS_HURTBOX);
    const movedState = setRoomBossRuntimeState(
      roomState,
      transitionBossRuntimeState({
        state: roomState.bosses["boss-test"]!,
        nextState: "patrol",
        position: {
          x: MOVING_BOSS.spawn.x + 32,
          y: MOVING_BOSS.spawn.y,
        },
      }),
    );

    expect(
      getCyanSparkCollisionTargets(
        targets,
        movedState,
        LEVEL_WITH_MOVING_BOSS_HURTBOX.bosses,
      ),
    ).toContainEqual({
      id: "test-boss-hurtbox",
      kind: "boss",
      area: {
        x: LEVEL_WITH_ENERGY_TARGETS.energyTargets![2]!.area.x + 32,
        y: LEVEL_WITH_ENERGY_TARGETS.energyTargets![2]!.area.y,
        width: LEVEL_WITH_ENERGY_TARGETS.energyTargets![2]!.area.width,
        height: LEVEL_WITH_ENERGY_TARGETS.energyTargets![2]!.area.height,
      },
    });
  });

  it("maps inactive energy switches to Centelha Ciano collisions until activated", () => {
    const energySwitch = {
      id: "test-energy-switch",
      kind: "energy-switch",
      area: {
        x: 176,
        y: 198,
        width: 16,
        height: 24,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      activatesObjectId: "level-02-lever-exit",
    } as const;
    const levelWithSwitch = defineLevel({
      ...LEVEL_02,
      energyTargets: [energySwitch],
    } satisfies LevelDefinition);
    const targets = getLevelEnergyTargets(levelWithSwitch);
    const initialState = createInitialRoomState(levelWithSwitch);

    expect(getCyanSparkCollisionTargets(targets, initialState)).toEqual([
      {
        id: "test-energy-switch",
        kind: "target",
        area: energySwitch.area,
      },
    ]);

    expect(
      getCyanSparkCollisionTargets(
        targets,
        activateEnergySwitch(initialState, energySwitch),
      ),
    ).toEqual([]);
  });

  it("maps energy relays to Centelha Ciano collisions until the sequence completes", () => {
    const energyRelay = {
      id: "test-energy-relay",
      kind: "energy-relay",
      area: {
        x: 208,
        y: 198,
        width: 16,
        height: 24,
      },
      acceptedPowers: ["cyan-spark"],
      hitPoints: 2,
      resetOnRespawn: true,
      relayWindowMs: 600,
    } as const;
    const levelWithRelay = defineLevel({
      ...LEVEL_02,
      energyTargets: [energyRelay],
    } satisfies LevelDefinition);
    const targets = getLevelEnergyTargets(levelWithRelay);
    const initialState = createInitialRoomState(levelWithRelay);

    expect(getCyanSparkCollisionTargets(targets, initialState)).toEqual([
      {
        id: "test-energy-relay",
        kind: "target",
        area: energyRelay.area,
      },
    ]);

    expect(
      getCyanSparkCollisionTargets(
        targets,
        activateEnergyRelay(
          activateEnergyRelay(initialState, energyRelay),
          energyRelay,
        ),
      ),
    ).toEqual([]);
  });

  it("keeps energy absorbers targetable after consuming energy hits", () => {
    const energyAbsorber = {
      id: "test-energy-absorber",
      kind: "energy-absorber",
      area: {
        x: 208,
        y: 198,
        width: 16,
        height: 24,
      },
      acceptedPowers: ["cyan-spark", "cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      absorbsEnergy: true,
    } as const;
    const levelWithAbsorber = defineLevel({
      ...LEVEL_02,
      energyTargets: [energyAbsorber],
    } satisfies LevelDefinition);
    const targets = getLevelEnergyTargets(levelWithAbsorber);
    const absorbedState = absorbEnergyTarget(
      createInitialRoomState(levelWithAbsorber),
      energyAbsorber,
    );

    expect(getCyanSparkCollisionTargets(targets, absorbedState)).toEqual([
      {
        id: "test-energy-absorber",
        kind: "target",
        area: energyAbsorber.area,
      },
    ]);
    expect(getCyanBurstBeamCollisionTargets(targets, absorbedState)).toEqual([
      {
        id: "test-energy-absorber",
        kind: "target",
        area: energyAbsorber.area,
      },
    ]);
  });

  it("removes active temporary energy cores from Rajada collisions until they re-arm", () => {
    const energyCore = {
      id: "test-temporary-energy-core",
      kind: "energy-core",
      area: {
        x: 256,
        y: 174,
        width: 24,
        height: 48,
      },
      acceptedPowers: ["cyan-burst"],
      hitPoints: 1,
      resetOnRespawn: true,
      activationDurationMs: 500,
    } as const;
    const levelWithCore = defineLevel({
      ...LEVEL_02,
      energyTargets: [energyCore],
    } satisfies LevelDefinition);
    const targets = getLevelEnergyTargets(levelWithCore);
    const activeState = activateEnergyCore(
      createInitialRoomState(levelWithCore),
      energyCore,
      2,
    );
    const rearmedState = updateRoomEnergyTargets(
      activeState,
      levelWithCore,
      501,
    );

    expect(getCyanBurstBeamCollisionTargets(targets, activeState)).toEqual([]);
    expect(getCyanBurstBeamCollisionTargets(targets, rearmedState)).toEqual([
      {
        id: "test-temporary-energy-core",
        kind: "target",
        area: energyCore.area,
      },
    ]);
  });
});
