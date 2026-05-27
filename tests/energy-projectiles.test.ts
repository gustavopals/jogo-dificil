import { describe, expect, it } from "vitest";

import {
  canSpawnCyanSparkProjectile,
  createCyanSparkProjectile,
  CYAN_SPARK_MAX_ACTIVE_PROJECTILES,
  DEFAULT_CYAN_BURST_BEAM_CONFIG,
  DEFAULT_CYAN_SPARK_PROJECTILE_CONFIG,
  getCyanBurstBeamArea,
  getCyanSparkProjectileHitbox,
  resolveCyanBurstBeam,
  updateCyanSparkProjectiles,
} from "../src/game/physics";

const CONFIG = DEFAULT_CYAN_SPARK_PROJECTILE_CONFIG;
const BEAM_CONFIG = DEFAULT_CYAN_BURST_BEAM_CONFIG;

describe("energy projectiles", () => {
  it("spawns Centelha Ciano in front of the player with horizontal velocity", () => {
    const rightSpark = createCyanSparkProjectile({
      id: "spark-right",
      origin: { x: 100, y: 120 },
      facing: "right",
    });
    const leftSpark = createCyanSparkProjectile({
      id: "spark-left",
      origin: { x: 100, y: 120 },
      facing: "left",
    });

    expect(rightSpark).toMatchObject({
      position: {
        x: 100 + CONFIG.spawnOffsetX,
        y: 120 + CONFIG.spawnOffsetY,
      },
      velocity: {
        x: CONFIG.speed,
        y: 0,
      },
      direction: 1,
      distanceTraveled: 0,
      maxRange: CONFIG.maxRange,
    });
    expect(leftSpark).toMatchObject({
      position: {
        x: 100 - CONFIG.spawnOffsetX,
        y: 120 + CONFIG.spawnOffsetY,
      },
      velocity: {
        x: -CONFIG.speed,
        y: 0,
      },
      direction: -1,
    });
  });

  it("allows only two active Centelha Ciano projectiles", () => {
    const firstSpark = createCyanSparkProjectile({
      id: "spark-1",
      origin: { x: 100, y: 120 },
      facing: "right",
    });
    const secondSpark = createCyanSparkProjectile({
      id: "spark-2",
      origin: { x: 120, y: 120 },
      facing: "right",
    });

    expect(CYAN_SPARK_MAX_ACTIVE_PROJECTILES).toBe(2);
    expect(canSpawnCyanSparkProjectile([])).toBe(true);
    expect(canSpawnCyanSparkProjectile([firstSpark])).toBe(true);
    expect(canSpawnCyanSparkProjectile([firstSpark, secondSpark])).toBe(false);
  });

  it("moves Centelha Ciano by declared speed and accumulates traveled distance", () => {
    const spark = createCyanSparkProjectile({
      id: "spark",
      origin: { x: 100, y: 120 },
      facing: "right",
    });
    const result = updateCyanSparkProjectiles({
      projectiles: [spark],
      deltaMs: 100,
    });
    const moved = result.projectiles[0]!;

    expect(moved.position.x).toBe(spark.position.x + CONFIG.speed * 0.1);
    expect(moved.position.y).toBe(spark.position.y);
    expect(moved.distanceTraveled).toBe(CONFIG.speed * 0.1);
    expect(result.impacts).toEqual([]);
  });

  it("removes Centelha Ciano when it reaches maximum range", () => {
    const spark = createCyanSparkProjectile({
      id: "spark",
      origin: { x: 100, y: 120 },
      facing: "right",
    });

    expect(
      updateCyanSparkProjectiles({
        projectiles: [spark],
        deltaMs: 100,
      }).projectiles,
    ).toHaveLength(1);
    expect(
      updateCyanSparkProjectiles({
        projectiles: [spark],
        deltaMs: 400,
      }),
    ).toEqual({
      projectiles: [],
      impacts: [
        {
          projectileId: "spark",
          kind: "range",
        },
      ],
    });
  });

  it("removes Centelha Ciano when it collides with solids", () => {
    const spark = createCyanSparkProjectile({
      id: "spark",
      origin: { x: 100, y: 120 },
      facing: "right",
    });
    const result = updateCyanSparkProjectiles({
      projectiles: [spark],
      deltaMs: 100,
      solids: [
        {
          x: 150,
          y: 100,
          width: 12,
          height: 20,
        },
      ],
    });

    expect(result).toEqual({
      projectiles: [],
      impacts: [
        {
          projectileId: "spark",
          kind: "solid",
        },
      ],
    });
  });

  it("reports collisions with generic energy targets", () => {
    const spark = createCyanSparkProjectile({
      id: "spark",
      origin: { x: 100, y: 120 },
      facing: "right",
    });
    const result = updateCyanSparkProjectiles({
      projectiles: [spark],
      deltaMs: 100,
      targets: [
        {
          id: "energy-switch-01",
          kind: "target",
          area: {
            x: 150,
            y: 100,
            width: 12,
            height: 20,
          },
        },
      ],
    });

    expect(result).toEqual({
      projectiles: [],
      impacts: [
        {
          projectileId: "spark",
          kind: "target",
          targetId: "energy-switch-01",
        },
      ],
    });
  });

  it("reports collisions with boss hurtboxes", () => {
    const spark = createCyanSparkProjectile({
      id: "spark",
      origin: { x: 100, y: 120 },
      facing: "right",
    });
    const result = updateCyanSparkProjectiles({
      projectiles: [spark],
      deltaMs: 100,
      targets: [
        {
          id: "boss-hirolito",
          kind: "boss",
          area: {
            x: 150,
            y: 100,
            width: 12,
            height: 20,
          },
        },
      ],
    });

    expect(result).toEqual({
      projectiles: [],
      impacts: [
        {
          projectileId: "spark",
          kind: "boss",
          targetId: "boss-hirolito",
        },
      ],
    });
  });

  it("resolves the nearest Centelha Ciano collision when solid and target overlap the sweep", () => {
    const spark = createCyanSparkProjectile({
      id: "spark",
      origin: { x: 100, y: 120 },
      facing: "right",
    });

    expect(
      updateCyanSparkProjectiles({
        projectiles: [spark],
        deltaMs: 100,
        solids: [
          {
            x: 130,
            y: 100,
            width: 4,
            height: 20,
          },
        ],
        targets: [
          {
            id: "energy-switch-after-wall",
            kind: "target",
            area: {
              x: 150,
              y: 100,
              width: 12,
              height: 20,
            },
          },
        ],
      }).impacts,
    ).toEqual([
      {
        projectileId: "spark",
        kind: "solid",
      },
    ]);

    expect(
      updateCyanSparkProjectiles({
        projectiles: [spark],
        deltaMs: 100,
        solids: [
          {
            x: 150,
            y: 100,
            width: 4,
            height: 20,
          },
        ],
        targets: [
          {
            id: "energy-switch-before-wall",
            kind: "target",
            area: {
              x: 126,
              y: 100,
              width: 12,
              height: 20,
            },
          },
        ],
      }).impacts,
    ).toEqual([
      {
        projectileId: "spark",
        kind: "target",
        targetId: "energy-switch-before-wall",
      },
    ]);
  });

  it("reports Centelha Ciano collisions while moving left", () => {
    const spark = createCyanSparkProjectile({
      id: "spark-left",
      origin: { x: 200, y: 120 },
      facing: "left",
    });
    const result = updateCyanSparkProjectiles({
      projectiles: [spark],
      deltaMs: 100,
      targets: [
        {
          id: "left-energy-switch",
          kind: "target",
          area: {
            x: 150,
            y: 100,
            width: 12,
            height: 20,
          },
        },
      ],
    });

    expect(result).toEqual({
      projectiles: [],
      impacts: [
        {
          projectileId: "spark-left",
          kind: "target",
          targetId: "left-energy-switch",
        },
      ],
    });
  });

  it("keeps Centelha Ciano active when a target is crossed horizontally but missed vertically", () => {
    const spark = createCyanSparkProjectile({
      id: "spark",
      origin: { x: 100, y: 120 },
      facing: "right",
    });
    const result = updateCyanSparkProjectiles({
      projectiles: [spark],
      deltaMs: 100,
      targets: [
        {
          id: "high-energy-switch",
          kind: "target",
          area: {
            x: 130,
            y: 84,
            width: 12,
            height: 10,
          },
        },
      ],
    });

    expect(result.impacts).toEqual([]);
    expect(result.projectiles).toHaveLength(1);
    expect(result.projectiles[0]!.position.x).toBe(
      spark.position.x + CONFIG.speed * 0.1,
    );
  });

  it("removes only the Centelha Ciano projectile that collided", () => {
    const collidingSpark = createCyanSparkProjectile({
      id: "colliding-spark",
      origin: { x: 100, y: 120 },
      facing: "right",
    });
    const safeSpark = createCyanSparkProjectile({
      id: "safe-spark",
      origin: { x: 20, y: 120 },
      facing: "right",
    });
    const result = updateCyanSparkProjectiles({
      projectiles: [collidingSpark, safeSpark],
      deltaMs: 100,
      targets: [
        {
          id: "energy-switch",
          kind: "target",
          area: {
            x: 150,
            y: 100,
            width: 12,
            height: 20,
          },
        },
      ],
    });

    expect(result.impacts).toEqual([
      {
        projectileId: "colliding-spark",
        kind: "target",
        targetId: "energy-switch",
      },
    ]);
    expect(result.projectiles).toHaveLength(1);
    expect(result.projectiles[0]).toMatchObject({
      id: "safe-spark",
      position: {
        x: safeSpark.position.x + CONFIG.speed * 0.1,
        y: safeSpark.position.y,
      },
    });
  });

  it("prefers Centelha Ciano collision impact over range removal in the same update", () => {
    const spark = createCyanSparkProjectile({
      id: "short-spark",
      origin: { x: 100, y: 120 },
      facing: "right",
      config: {
        ...CONFIG,
        maxRange: 20,
      },
    });
    const result = updateCyanSparkProjectiles({
      projectiles: [spark],
      deltaMs: 100,
      targets: [
        {
          id: "range-edge-switch",
          kind: "target",
          area: {
            x: 124,
            y: 100,
            width: 8,
            height: 20,
          },
        },
      ],
    });

    expect(result).toEqual({
      projectiles: [],
      impacts: [
        {
          projectileId: "short-spark",
          kind: "target",
          targetId: "range-edge-switch",
        },
      ],
    });
  });

  it("detects solid collisions crossed between frames", () => {
    const spark = createCyanSparkProjectile({
      id: "spark",
      origin: { x: 100, y: 120 },
      facing: "right",
    });
    const result = updateCyanSparkProjectiles({
      projectiles: [spark],
      deltaMs: 100,
      solids: [
        {
          x: 132,
          y: 100,
          width: 4,
          height: 20,
        },
      ],
    });

    expect(result.impacts).toEqual([
      {
        projectileId: "spark",
        kind: "solid",
      },
    ]);
  });

  it("exposes the current hitbox for collision checks", () => {
    const spark = createCyanSparkProjectile({
      id: "spark",
      origin: { x: 100, y: 120 },
      facing: "right",
    });

    expect(getCyanSparkProjectileHitbox(spark)).toEqual({
      x: spark.position.x - CONFIG.hitboxWidth / 2,
      y: spark.position.y - CONFIG.hitboxHeight / 2,
      width: CONFIG.hitboxWidth,
      height: CONFIG.hitboxHeight,
    });
  });

  it("builds Rajada Ciano beam area in the locked horizontal direction", () => {
    expect(
      getCyanBurstBeamArea({
        origin: { x: 100, y: 120 },
        facing: "right",
      }),
    ).toEqual({
      x: 100 + BEAM_CONFIG.originOffsetX,
      y: 120 + BEAM_CONFIG.originOffsetY - BEAM_CONFIG.height / 2,
      width: BEAM_CONFIG.range,
      height: BEAM_CONFIG.height,
    });
    expect(
      getCyanBurstBeamArea({
        origin: { x: 100, y: 120 },
        facing: "left",
      }),
    ).toEqual({
      x: 100 - BEAM_CONFIG.originOffsetX - BEAM_CONFIG.range,
      y: 120 + BEAM_CONFIG.originOffsetY - BEAM_CONFIG.height / 2,
      width: BEAM_CONFIG.range,
      height: BEAM_CONFIG.height,
    });
  });

  it("clips Rajada Ciano at solid blockers", () => {
    const result = resolveCyanBurstBeam({
      origin: { x: 100, y: 120 },
      facing: "right",
      solids: [
        {
          x: 160,
          y: 96,
          width: 16,
          height: 64,
        },
      ],
    });

    expect(result.blockedBySolid).toBe(true);
    expect(result.area).toEqual({
      x: 100 + BEAM_CONFIG.originOffsetX,
      y: 120 + BEAM_CONFIG.originOffsetY - BEAM_CONFIG.height / 2,
      width: 160 - (100 + BEAM_CONFIG.originOffsetX),
      height: BEAM_CONFIG.height,
    });
  });

  it("reports strong Rajada Ciano damage against targets before blockers", () => {
    expect(
      resolveCyanBurstBeam({
        origin: { x: 100, y: 120 },
        facing: "right",
        solids: [
          {
            x: 230,
            y: 96,
            width: 16,
            height: 64,
          },
        ],
        targets: [
          {
            id: "cracked-block",
            kind: "cracked-block",
            area: {
              x: 148,
              y: 96,
              width: 16,
              height: 40,
            },
          },
          {
            id: "boss-hirolito",
            kind: "boss",
            area: {
              x: 190,
              y: 96,
              width: 24,
              height: 48,
            },
          },
          {
            id: "blocked-target",
            kind: "target",
            area: {
              x: 260,
              y: 96,
              width: 16,
              height: 40,
            },
          },
        ],
      }).impacts,
    ).toEqual([
      {
        targetId: "cracked-block",
        kind: "cracked-block",
        damage: 2,
      },
      {
        targetId: "boss-hirolito",
        kind: "boss",
        damage: 2,
        hitGroupId: "boss-hirolito",
      },
    ]);
  });

  it("limits Rajada Ciano to one impact per boss hit group", () => {
    expect(
      resolveCyanBurstBeam({
        origin: { x: 100, y: 120 },
        facing: "right",
        targets: [
          {
            id: "boss-hirolito-head",
            kind: "boss",
            hitGroupId: "boss-hirolito",
            area: {
              x: 140,
              y: 96,
              width: 16,
              height: 40,
            },
          },
          {
            id: "boss-hirolito-body",
            kind: "boss",
            hitGroupId: "boss-hirolito",
            area: {
              x: 170,
              y: 96,
              width: 24,
              height: 48,
            },
          },
          {
            id: "boss-imports-body",
            kind: "boss",
            hitGroupId: "boss-imports",
            area: {
              x: 204,
              y: 96,
              width: 24,
              height: 48,
            },
          },
        ],
      }).impacts,
    ).toEqual([
      {
        targetId: "boss-hirolito-head",
        kind: "boss",
        damage: 2,
        hitGroupId: "boss-hirolito",
      },
      {
        targetId: "boss-imports-body",
        kind: "boss",
        damage: 2,
        hitGroupId: "boss-imports",
      },
    ]);
  });

  it("ignores bosses already hit by the active Rajada Ciano", () => {
    expect(
      resolveCyanBurstBeam({
        origin: { x: 100, y: 120 },
        facing: "right",
        alreadyHitBossIds: ["boss-hirolito"],
        targets: [
          {
            id: "boss-hirolito-body",
            kind: "boss",
            hitGroupId: "boss-hirolito",
            area: {
              x: 150,
              y: 96,
              width: 24,
              height: 48,
            },
          },
          {
            id: "energy-core",
            kind: "target",
            area: {
              x: 190,
              y: 96,
              width: 16,
              height: 40,
            },
          },
        ],
      }).impacts,
    ).toEqual([
      {
        targetId: "energy-core",
        kind: "target",
        damage: 2,
      },
    ]);
  });

  it("prevents repeated boss damage across checks of the same active Rajada Ciano", () => {
    const targets = [
      {
        id: "boss-hirolito-head",
        kind: "boss" as const,
        hitGroupId: "boss-hirolito",
        area: {
          x: 150,
          y: 96,
          width: 16,
          height: 40,
        },
      },
      {
        id: "boss-hirolito-body",
        kind: "boss" as const,
        hitGroupId: "boss-hirolito",
        area: {
          x: 174,
          y: 96,
          width: 24,
          height: 48,
        },
      },
    ];
    const firstCheck = resolveCyanBurstBeam({
      origin: { x: 100, y: 120 },
      facing: "right",
      targets,
    });
    const alreadyHitBossIds = firstCheck.impacts.flatMap((impact) =>
      impact.kind === "boss" ? [impact.hitGroupId ?? impact.targetId] : [],
    );
    const secondCheck = resolveCyanBurstBeam({
      origin: { x: 100, y: 120 },
      facing: "right",
      targets,
      alreadyHitBossIds,
    });

    expect(firstCheck.impacts).toEqual([
      {
        targetId: "boss-hirolito-head",
        kind: "boss",
        damage: 2,
        hitGroupId: "boss-hirolito",
      },
    ]);
    expect(alreadyHitBossIds).toEqual(["boss-hirolito"]);
    expect(secondCheck.impacts).toEqual([]);
  });

  it("allows a new Rajada Ciano to hit the same boss after hit tracking is reset", () => {
    const targets = [
      {
        id: "boss-hirolito-body",
        kind: "boss" as const,
        hitGroupId: "boss-hirolito",
        area: {
          x: 150,
          y: 96,
          width: 24,
          height: 48,
        },
      },
    ];
    const firstBurst = resolveCyanBurstBeam({
      origin: { x: 100, y: 120 },
      facing: "right",
      targets,
    });
    const nextBurst = resolveCyanBurstBeam({
      origin: { x: 100, y: 120 },
      facing: "right",
      targets,
      alreadyHitBossIds: [],
    });

    expect(firstBurst.impacts).toEqual([
      {
        targetId: "boss-hirolito-body",
        kind: "boss",
        damage: 2,
        hitGroupId: "boss-hirolito",
      },
    ]);
    expect(nextBurst.impacts).toEqual(firstBurst.impacts);
  });
});
