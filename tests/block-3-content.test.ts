import { describe, expect, it } from "vitest";

import {
  LEVEL_07,
  LEVEL_08,
  LEVEL_09,
  LEVEL_10,
  LEVEL_DEFINITIONS,
  type EnergyTargetDefinition,
  type InteractiveObjectDefinition,
  type LevelDefinition,
  validateLevel,
} from "../src/data/levels";
import { GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import { DEFAULT_CYAN_SPARK_PROJECTILE_CONFIG } from "../src/game/physics";
import {
  getCyanBurstBeamCollisionTargets,
  getCyanSparkCollisionTargets,
  getEnergyTargetSolidAreas,
  getLevelEnergyTargets,
} from "../src/game/systems/level-energy-targets";
import { DEFAULT_PLAYER_ENERGY_CONFIG } from "../src/game/physics/player-energy";
import {
  activateInteractiveObject,
  getInteractiveObjectSolidAreas,
} from "../src/game/systems/level-interactive-objects";
import {
  absorbEnergyTarget,
  activateEnergyCore,
  activateEnergyRelay,
  activateEnergySwitch,
  createInitialRoomState,
  damageEnergyTarget,
  updateRoomEnergyTargets,
} from "../src/game/systems/room-state";
import { isTouchingExit } from "../src/game/systems/level-progress";

const TILE_SIZE_PX = 16;

describe("block 3 content", () => {
  it("registers level 07 as the first playable energy training room", () => {
    expect(LEVEL_DEFINITIONS.map((level) => level.id)).toContain("level-07");
    expect(validateLevel(LEVEL_07)).toEqual({
      isValid: true,
      issues: [],
    });
    expect(LEVEL_07.order).toBe(7);
    expect(LEVEL_07.difficulty).toBe(7);
    expect(LEVEL_07.exit.nextLevelId).toBe(LEVEL_08.id);
    expect(isTouchingExit(LEVEL_07.exit.area, LEVEL_07)).toBe(true);
  });

  it("registers level 08 as the first energy trick room", () => {
    expect(LEVEL_DEFINITIONS.map((level) => level.id)).toContain("level-08");
    expect(validateLevel(LEVEL_08)).toEqual({
      isValid: true,
      issues: [],
    });
    expect(LEVEL_08.order).toBe(8);
    expect(LEVEL_08.difficulty).toBe(8);
    expect(LEVEL_08.exit.nextLevelId).toBe(LEVEL_09.id);
    expect(isTouchingExit(LEVEL_08.exit.area, LEVEL_08)).toBe(true);
  });

  it("registers level 09 as the energy combination room", () => {
    expect(LEVEL_DEFINITIONS.map((level) => level.id)).toContain("level-09");
    expect(validateLevel(LEVEL_09)).toEqual({
      isValid: true,
      issues: [],
    });
    expect(LEVEL_09.order).toBe(9);
    expect(LEVEL_09.difficulty).toBe(9);
    expect(LEVEL_09.exit.nextLevelId).toBe(LEVEL_10.id);
    expect(isTouchingExit(LEVEL_09.exit.area, LEVEL_09)).toBe(true);
  });

  it("chains block 3 after level 06 and hands off to the final arena", () => {
    expect(
      LEVEL_DEFINITIONS.slice(5, 10).map((level) => ({
        id: level.id,
        nextLevelId:
          "nextLevelId" in level.exit ? level.exit.nextLevelId : undefined,
      })),
    ).toEqual([
      {
        id: "level-06",
        nextLevelId: LEVEL_07.id,
      },
      {
        id: "level-07",
        nextLevelId: LEVEL_08.id,
      },
      {
        id: "level-08",
        nextLevelId: LEVEL_09.id,
      },
      {
        id: "level-09",
        nextLevelId: LEVEL_10.id,
      },
      {
        id: "level-10",
        nextLevelId: "level-11",
      },
    ]);
  });

  it("keeps block 3 metadata aligned with teach, distort and combine progression", () => {
    expect(
      [LEVEL_07, LEVEL_08, LEVEL_09].map((level) => ({
        id: level.id,
        name: level.name,
        theme: level.theme,
        difficulty: level.difficulty,
        mainChallenge: level.mainChallenge,
        progressReward: level.progressReward,
      })),
    ).toEqual([
      {
        id: "level-07",
        name: "Faisca De Treino",
        theme: "cyan-energy-training-lab",
        difficulty: 7,
        mainChallenge:
          "Ensinar Centelha Ciano em tres alvos seguros, forçando recarga antes da saida.",
        progressReward:
          "Aprender que dois tiros resolvem alvos leves, mas o ritmo pede Carga Ciano no chao.",
      },
      {
        id: "level-08",
        name: "O Alvo Mente",
        theme: "cyan-energy-trick-lab",
        difficulty: 8,
        mainChallenge:
          "Distorcer a leitura dos alvos de energia com absorvedor falso, spike-pop conhecido e bloco rachado.",
        progressReward:
          "Aprender que nem todo alvo recompensa tiro simples e que bloco rachado pede Rajada Ciano carregada.",
      },
      {
        id: "level-09",
        name: "Carga Em Movimento",
        theme: "cyan-energy-combo-lab",
        difficulty: 9,
        mainChallenge:
          "Combinar dash, sequencia de Centelha Ciano, carga para Rajada Ciano e alavanca final.",
        progressReward:
          "Fechar o Bloco 3 provando que movimento, tiros, especial e interacao usam prioridades claras.",
      },
    ]);
  });

  it("declares the minimum energy assets used by each block 3 level", () => {
    expect(LEVEL_07.assets.sprites).toEqual(
      expect.arrayContaining([
        GAMEPLAY_SPRITE_KEYS.ENERGY_TARGET_ACTIVE,
        GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_SPARK_PROJECTILE,
      ]),
    );
    expect(LEVEL_08.assets.sprites).toEqual(
      expect.arrayContaining([
        GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES,
        GAMEPLAY_SPRITE_KEYS.ENERGY_TARGET_ACTIVE,
        GAMEPLAY_SPRITE_KEYS.ENERGY_CRACKED_BLOCK_BROKEN,
        GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_SPARK_PROJECTILE,
        GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_BURST_BEAM,
      ]),
    );
    expect(LEVEL_09.assets.sprites).toEqual(
      expect.arrayContaining([
        GAMEPLAY_SPRITE_KEYS.ENERGY_TARGET_ACTIVE,
        GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_SPARK_PROJECTILE,
        GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_BURST_BEAM,
      ]),
    );
  });

  it("teaches Centelha Ciano safely before asking for recharge", () => {
    const checkpoint = LEVEL_07.checkpoints[0]!;
    const firstSwitch = findEnergyTarget(
      LEVEL_07,
      "level-07-first-spark-switch",
    );
    const secondSwitch = findEnergyTarget(
      LEVEL_07,
      "level-07-second-spark-switch",
    );
    const rechargeSwitch = findEnergyTarget(
      LEVEL_07,
      "level-07-recharge-switch",
    );
    const firstDoor = findInteractiveObject(LEVEL_07, "level-07-training-door");
    const secondDoor = findInteractiveObject(LEVEL_07, "level-07-second-door");
    const exitDoor = findInteractiveObject(LEVEL_07, "level-07-exit-door");

    expect(LEVEL_07.initialEnergy).toBe(
      DEFAULT_PLAYER_ENERGY_CONFIG.sparkCost * 2,
    );
    expect(LEVEL_07.traps).toEqual([]);
    expect(LEVEL_07.energyTargets).toHaveLength(3);
    expect(
      LEVEL_07.energyTargets?.every(
        (target) =>
          target.kind === "energy-switch" &&
          target.acceptedPowers.includes("cyan-spark"),
      ),
    ).toBe(true);
    expect(firstSwitch.area.x).toBeLessThan(firstDoor.area.x);
    expect(secondSwitch.area.x).toBeLessThan(secondDoor.area.x);
    expect(checkpoint.position.x).toBeGreaterThan(secondDoor.area.x);
    expect(checkpoint.initialEnergy).toBe(0);
    expect(rechargeSwitch.area.x).toBeGreaterThan(checkpoint.position.x);
    expect(rechargeSwitch.area.x).toBeLessThan(exitDoor.area.x);
  });

  it("opens each training door from its declared energy switch", () => {
    const firstSwitch = findEnergyTarget(
      LEVEL_07,
      "level-07-first-spark-switch",
    );
    const secondSwitch = findEnergyTarget(
      LEVEL_07,
      "level-07-second-spark-switch",
    );
    const rechargeSwitch = findEnergyTarget(
      LEVEL_07,
      "level-07-recharge-switch",
    );
    const initialState = createInitialRoomState(LEVEL_07);

    expect(
      getInteractiveObjectSolidAreas(LEVEL_07.interactiveObjects, initialState),
    ).toHaveLength(3);

    const openedState = [firstSwitch, secondSwitch, rechargeSwitch].reduce(
      (state, target) => activateEnergySwitch(state, target),
      initialState,
    );

    expect(
      getInteractiveObjectSolidAreas(LEVEL_07.interactiveObjects, openedState),
    ).toEqual([]);
  });

  it("keeps every switch within Centelha Ciano range from a safe standing spot", () => {
    const safeShots = [
      {
        standingX: LEVEL_07.spawn.x,
        target: findEnergyTarget(LEVEL_07, "level-07-first-spark-switch"),
      },
      {
        standingX: TILE_SIZE_PX * 17,
        target: findEnergyTarget(LEVEL_07, "level-07-second-spark-switch"),
      },
      {
        standingX: LEVEL_07.checkpoints[0]!.position.x,
        target: findEnergyTarget(LEVEL_07, "level-07-recharge-switch"),
      },
    ];

    safeShots.forEach(({ standingX, target }) => {
      const sparkStartX =
        standingX + DEFAULT_CYAN_SPARK_PROJECTILE_CONFIG.spawnOffsetX;
      const targetDistance = target.area.x - sparkStartX;

      expect(targetDistance, target.id).toBeGreaterThan(0);
      expect(targetDistance, target.id).toBeLessThanOrEqual(
        DEFAULT_CYAN_SPARK_PROJECTILE_CONFIG.maxRange,
      );
    });
  });

  it("distorts energy target reading in level 08 with absorber before the real switch", () => {
    const absorber = findEnergyTarget(LEVEL_08, "level-08-fake-absorber");
    const spikePop = LEVEL_08.traps.find(
      (trap) => trap.id === "level-08-reader-spike-pop",
    )!;
    const truthSwitch = findEnergyTarget(LEVEL_08, "level-08-truth-switch");
    const switchDoor = findInteractiveObject(LEVEL_08, "level-08-switch-door");
    const crackedBlock = findEnergyTarget(LEVEL_08, "level-08-cracked-block");
    const checkpoint = LEVEL_08.checkpoints[0]!;

    expect(absorber.kind).toBe("energy-absorber");
    expect(absorber.absorbsEnergy).toBe(true);
    expect(absorber.activatesObjectId).toBeUndefined();
    expect(absorber.area.x).toBeLessThan(spikePop.trigger.area.x);
    expect(truthSwitch.kind).toBe("energy-switch");
    expect(truthSwitch.area.x).toBeGreaterThan(spikePop.area!.x);
    expect(truthSwitch.activatesObjectId).toBe(switchDoor.id);
    expect(crackedBlock.kind).toBe("energy-cracked-block");
    expect(crackedBlock.acceptedPowers).toEqual(["cyan-burst"]);
    expect(crackedBlock.hitPoints).toBe(2);
    expect(crackedBlock.blocksMovement).toBe(true);
    expect(checkpoint.initialEnergy).toBe(LEVEL_08.initialEnergy);
    expect(checkpoint.position.x).toBeLessThan(crackedBlock.area.x);
  });

  it("keeps level 08 absorber unrewarding and cracked block gated by Rajada Ciano", () => {
    const absorber = findEnergyTarget(LEVEL_08, "level-08-fake-absorber");
    const truthSwitch = findEnergyTarget(LEVEL_08, "level-08-truth-switch");
    const crackedBlock = findEnergyTarget(LEVEL_08, "level-08-cracked-block");
    const targets = getLevelEnergyTargets(LEVEL_08);
    const initialState = createInitialRoomState(LEVEL_08);

    expect(getCyanSparkCollisionTargets(targets, initialState)).toEqual([
      {
        id: absorber.id,
        kind: "target",
        area: absorber.area,
      },
      {
        id: truthSwitch.id,
        kind: "target",
        area: truthSwitch.area,
      },
    ]);
    expect(getCyanBurstBeamCollisionTargets(targets, initialState)).toEqual(
      expect.arrayContaining([
        {
          id: crackedBlock.id,
          kind: "cracked-block",
          area: crackedBlock.area,
        },
      ]),
    );
    expect(getEnergyTargetSolidAreas(targets, initialState)).toEqual([
      crackedBlock.area,
    ]);

    const absorbedState = absorbEnergyTarget(initialState, absorber);

    expect(
      getInteractiveObjectSolidAreas(
        LEVEL_08.interactiveObjects,
        absorbedState,
      ),
    ).toHaveLength(1);
    expect(absorbedState.energyTargets[absorber.id]?.absorbedEnergyHits).toBe(
      1,
    );

    const openDoorState = activateEnergySwitch(absorbedState, truthSwitch);
    const crackedState = damageEnergyTarget(
      openDoorState,
      crackedBlock.id,
      crackedBlock.hitPoints,
    );

    expect(
      getInteractiveObjectSolidAreas(
        LEVEL_08.interactiveObjects,
        openDoorState,
      ),
    ).toEqual([]);
    expect(getEnergyTargetSolidAreas(targets, crackedState)).toEqual([]);
  });

  it("combines dash, Centelha Ciano, Rajada Ciano and interaction in level 09", () => {
    const openingGap = LEVEL_09.hazards.find(
      (hazard) => hazard.id === "level-09-dash-opening-fall",
    )!;
    const relay = findEnergyTarget(LEVEL_09, "level-09-spark-relay");
    const relayDoor = findInteractiveObject(LEVEL_09, "level-09-relay-door");
    const checkpoint = LEVEL_09.checkpoints[0]!;
    const core = findEnergyTarget(LEVEL_09, "level-09-temporary-core");
    const coreDoor = findInteractiveObject(LEVEL_09, "level-09-core-door");
    const lever = findInteractiveObject(LEVEL_09, "level-09-final-lever");
    const exitDoor = findInteractiveObject(LEVEL_09, "level-09-exit-door");

    expect(openingGap.area.width).toBeGreaterThanOrEqual(TILE_SIZE_PX * 8);
    expect(LEVEL_09.initialEnergy).toBeGreaterThanOrEqual(
      DEFAULT_PLAYER_ENERGY_CONFIG.sparkCost * relay.hitPoints,
    );
    expect(relay.kind).toBe("energy-relay");
    expect(relay.acceptedPowers).toEqual(["cyan-spark"]);
    expect(relay.hitPoints).toBe(3);
    expect(relay.relayWindowMs).toBeGreaterThanOrEqual(800);
    expect(relay.activatesObjectId).toBe(relayDoor.id);
    expect(checkpoint.position.x).toBeGreaterThan(relayDoor.area.x);
    expect(checkpoint.position.x).toBeLessThan(core.area.x);
    expect(core.kind).toBe("energy-core");
    expect(core.acceptedPowers).toEqual(["cyan-burst"]);
    expect(core.activationDurationMs).toBeGreaterThanOrEqual(2000);
    expect(core.activatesObjectId).toBe(coreDoor.id);
    expect(lever.kind).toBe("lever");
    expect(lever.action).toBe("secondary");
    expect(lever.targetObjectId).toBe(exitDoor.id);
    expect(lever.area.x).toBeGreaterThan(coreDoor.area.x);
    expect(exitDoor.area.x).toBeLessThan(LEVEL_09.exit.area.x);
  });

  it("resolves level 09 relay, temporary core and final lever as separate gates", () => {
    const relay = findEnergyTarget(LEVEL_09, "level-09-spark-relay");
    const core = findEnergyTarget(LEVEL_09, "level-09-temporary-core");
    const lever = findInteractiveObject(LEVEL_09, "level-09-final-lever");
    const targets = getLevelEnergyTargets(LEVEL_09);
    const initialState = createInitialRoomState(LEVEL_09);

    expect(getCyanSparkCollisionTargets(targets, initialState)).toEqual([
      {
        id: relay.id,
        kind: "target",
        area: relay.area,
      },
    ]);
    expect(getCyanBurstBeamCollisionTargets(targets, initialState)).toEqual([
      {
        id: core.id,
        kind: "target",
        area: core.area,
      },
    ]);
    expect(
      getInteractiveObjectSolidAreas(LEVEL_09.interactiveObjects, initialState),
    ).toHaveLength(3);

    const relayState = activateEnergyRelay(
      activateEnergyRelay(activateEnergyRelay(initialState, relay), relay),
      relay,
    );
    const coreState = activateEnergyCore(relayState, core, core.hitPoints);
    const finalState = activateInteractiveObject(coreState, lever);
    const rearmedState = updateRoomEnergyTargets(
      finalState,
      LEVEL_09,
      core.activationDurationMs ?? 0,
    );

    expect(relayState.interactiveObjects["level-09-relay-door"]).toMatchObject({
      isActive: true,
    });
    expect(coreState.interactiveObjects["level-09-core-door"]).toMatchObject({
      isActive: true,
    });
    expect(finalState.interactiveObjects["level-09-exit-door"]).toMatchObject({
      isActive: true,
    });
    expect(
      getInteractiveObjectSolidAreas(LEVEL_09.interactiveObjects, finalState),
    ).toEqual([]);
    expect(rearmedState.interactiveObjects["level-09-core-door"]).toMatchObject(
      {
        isActive: false,
      },
    );
    expect(rearmedState.interactiveObjects["level-09-exit-door"]).toMatchObject(
      {
        isActive: true,
      },
    );
  });
});

function findEnergyTarget(
  level: LevelDefinition,
  id: string,
): EnergyTargetDefinition {
  const target = level.energyTargets?.find((candidate) => candidate.id === id);

  expect(target, `${level.id}:${id}`).toBeDefined();

  return target!;
}

function findInteractiveObject(
  level: LevelDefinition,
  id: string,
): InteractiveObjectDefinition {
  const object = level.interactiveObjects.find(
    (candidate) => candidate.id === id,
  );

  expect(object, `${level.id}:${id}`).toBeDefined();

  return object!;
}
