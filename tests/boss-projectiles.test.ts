import { describe, expect, it } from "vitest";

import type {
  BossAttackDefinition,
  BossDefinition,
} from "../src/data/levels/schema";
import {
  canSpawnBossProjectile,
  createBossProjectile,
  createInitialBossRuntimeState,
  getBossProjectileHitbox,
  updateBossProjectiles,
} from "../src/game/physics";

const BOSS = {
  id: "boss-projectile-test",
  levelId: "level-boss-projectile-test",
  displayName: "Boss Projectile Test",
  arena: {
    x: 160,
    y: 110,
    width: 180,
    height: 128,
  },
  spawn: {
    x: 240,
    y: 190,
  },
  initialFacing: "left",
  health: 3,
  hitbox: {
    x: 224,
    y: 160,
    width: 34,
    height: 62,
  },
  weakPoint: {
    x: 232,
    y: 174,
    width: 16,
    height: 16,
  },
  resetOnRespawn: true,
  movement: {
    kind: "patrol",
    speedPxPerSecond: 40,
    anchors: [
      {
        x: 192,
        y: 190,
      },
      {
        x: 304,
        y: 190,
      },
    ],
  },
  attacks: [
    {
      id: "boss-projectile-bottle",
      kind: "import-bottle",
      windupMs: 500,
      activeMs: 600,
      recoverMs: 800,
      cooldownMs: 900,
      contactDamage: 1,
      projectile: {
        hitbox: {
          x: -7,
          y: -7,
          width: 14,
          height: 14,
        },
        velocity: {
          x: -80,
          y: 0,
        },
        maxActive: 2,
        maxRangePx: 64,
        isDestructibleBy: ["cyan-spark"],
      },
      opensVulnerabilityWindowId: "boss-projectile-recover",
    },
    {
      id: "boss-projectile-slam",
      kind: "floor-slam",
      windupMs: 500,
      activeMs: 600,
      recoverMs: 800,
      cooldownMs: 900,
      contactDamage: 1,
      opensVulnerabilityWindowId: "boss-projectile-recover",
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
      id: "boss-projectile-recover",
      state: "recover",
      durationMs: 800,
      weakPointActive: true,
      opensAfterAttackIds: ["boss-projectile-bottle"],
    },
  ],
  entryCheckpointId: "boss-projectile-entry-checkpoint",
  defeatUnlocks: ["boss-projectile-exit-door"],
} satisfies BossDefinition;

const BOSS_STATE = createInitialBossRuntimeState(BOSS);
const PROJECTILE_ATTACK = BOSS.attacks[0]!;
const BODY_ATTACK = BOSS.attacks[1]!;
const DIAGONAL_PROJECTILE_ATTACK = {
  ...PROJECTILE_ATTACK,
  id: "boss-projectile-diagonal",
  projectile: {
    hitbox: {
      x: -6,
      y: -6,
      width: 12,
      height: 12,
    },
    velocity: {
      x: -30,
      y: 40,
    },
    maxActive: 1,
    maxRangePx: 50,
  },
} satisfies BossAttackDefinition;

describe("boss projectiles", () => {
  it("creates boss projectiles from attack definitions without using trap state", () => {
    const projectile = createBossProjectile({
      id: "boss-projectile-01",
      boss: BOSS_STATE,
      attack: PROJECTILE_ATTACK,
    });

    expect(projectile).toMatchObject({
      id: "boss-projectile-01",
      bossId: "boss-projectile-test",
      attackId: "boss-projectile-bottle",
      position: BOSS_STATE.position,
      velocity: {
        x: -80,
        y: 0,
      },
      distanceTraveled: 0,
      maxRangePx: 64,
      isDestructibleBy: ["cyan-spark"],
    });
    expect(getBossProjectileHitbox(projectile!)).toEqual({
      x: BOSS_STATE.position.x - 7,
      y: BOSS_STATE.position.y - 7,
      width: 14,
      height: 14,
    });
    expect(
      createBossProjectile({
        id: "no-projectile",
        boss: BOSS_STATE,
        attack: BODY_ATTACK,
      }),
    ).toBeUndefined();
  });

  it("flips left-authored boss projectiles when the boss faces right", () => {
    const projectile = createBossProjectile({
      id: "boss-projectile-right",
      boss: {
        ...BOSS_STATE,
        facing: "right",
      },
      attack: PROJECTILE_ATTACK,
    });

    expect(projectile?.velocity).toEqual({
      x: 80,
      y: 0,
    });
  });

  it("uses explicit projectile origins and defaults destructible powers to an empty list", () => {
    const projectile = createBossProjectile({
      id: "boss-projectile-origin",
      boss: BOSS_STATE,
      attack: DIAGONAL_PROJECTILE_ATTACK,
      origin: {
        x: 300,
        y: 180,
      },
    });

    expect(projectile).toMatchObject({
      id: "boss-projectile-origin",
      bossId: "boss-projectile-test",
      attackId: "boss-projectile-diagonal",
      position: {
        x: 300,
        y: 180,
      },
      velocity: {
        x: -30,
        y: 40,
      },
      distanceTraveled: 0,
      maxRangePx: 50,
      isDestructibleBy: [],
    });
    expect(getBossProjectileHitbox(projectile!)).toEqual({
      x: 294,
      y: 174,
      width: 12,
      height: 12,
    });
  });

  it("respects maxActive per boss attack", () => {
    const firstProjectile = createBossProjectile({
      id: "boss-projectile-01",
      boss: BOSS_STATE,
      attack: PROJECTILE_ATTACK,
    })!;
    const secondProjectile = {
      ...firstProjectile,
      id: "boss-projectile-02",
    };

    expect(canSpawnBossProjectile([], BOSS_STATE, PROJECTILE_ATTACK)).toBe(
      true,
    );
    expect(
      canSpawnBossProjectile([firstProjectile], BOSS_STATE, PROJECTILE_ATTACK),
    ).toBe(true);
    expect(
      canSpawnBossProjectile(
        [firstProjectile, secondProjectile],
        BOSS_STATE,
        PROJECTILE_ATTACK,
      ),
    ).toBe(false);
    expect(canSpawnBossProjectile([], BOSS_STATE, BODY_ATTACK)).toBe(false);
  });

  it("counts maxActive independently by boss and attack", () => {
    const firstProjectile = createBossProjectile({
      id: "boss-projectile-01",
      boss: BOSS_STATE,
      attack: PROJECTILE_ATTACK,
    })!;
    const otherBossProjectile = {
      ...firstProjectile,
      id: "boss-projectile-other-boss",
      bossId: "another-boss",
    };
    const otherAttackProjectile = {
      ...firstProjectile,
      id: "boss-projectile-other-attack",
      attackId: "another-attack",
    };
    const secondProjectile = {
      ...firstProjectile,
      id: "boss-projectile-02",
    };

    expect(
      canSpawnBossProjectile(
        [firstProjectile, otherBossProjectile, otherAttackProjectile],
        BOSS_STATE,
        PROJECTILE_ATTACK,
      ),
    ).toBe(true);
    expect(
      canSpawnBossProjectile(
        [
          firstProjectile,
          secondProjectile,
          otherBossProjectile,
          otherAttackProjectile,
        ],
        BOSS_STATE,
        PROJECTILE_ATTACK,
      ),
    ).toBe(false);
  });

  it("moves boss projectiles independently and removes them at max range", () => {
    const projectile = createBossProjectile({
      id: "boss-projectile-01",
      boss: BOSS_STATE,
      attack: PROJECTILE_ATTACK,
    })!;
    const moved = updateBossProjectiles({
      projectiles: [projectile],
      deltaMs: 100,
    });
    const removed = updateBossProjectiles({
      projectiles: [projectile],
      deltaMs: 800,
    });

    expect(moved).toEqual({
      projectiles: [
        {
          ...projectile,
          position: {
            x: projectile.position.x - 8,
            y: projectile.position.y,
          },
          distanceTraveled: 8,
        },
      ],
      removals: [],
    });
    expect(removed).toEqual({
      projectiles: [],
      removals: [
        {
          projectileId: "boss-projectile-01",
          kind: "range",
        },
      ],
    });
  });

  it("keeps surviving projectiles when other boss projectiles expire", () => {
    const survivor = createBossProjectile({
      id: "boss-projectile-survivor",
      boss: BOSS_STATE,
      attack: DIAGONAL_PROJECTILE_ATTACK,
    })!;
    const expiredProjectile = {
      ...survivor,
      id: "boss-projectile-expired",
      distanceTraveled: 49,
    };

    expect(
      updateBossProjectiles({
        projectiles: [survivor, expiredProjectile],
        deltaMs: 200,
      }),
    ).toEqual({
      projectiles: [
        {
          ...survivor,
          position: {
            x: survivor.position.x - 6,
            y: survivor.position.y + 8,
          },
          distanceTraveled: 10,
        },
      ],
      removals: [
        {
          projectileId: "boss-projectile-expired",
          kind: "range",
        },
      ],
    });
  });

  it("can remove boss projectiles when their hitbox leaves declared bounds", () => {
    const projectile = createBossProjectile({
      id: "boss-projectile-01",
      boss: {
        ...BOSS_STATE,
        position: {
          x: 20,
          y: 120,
        },
      },
      attack: PROJECTILE_ATTACK,
    })!;

    expect(
      updateBossProjectiles({
        projectiles: [projectile],
        deltaMs: 500,
        bounds: {
          x: 0,
          y: 0,
          width: 32,
          height: 240,
        },
      }),
    ).toEqual({
      projectiles: [],
      removals: [
        {
          projectileId: "boss-projectile-01",
          kind: "bounds",
        },
      ],
    });
  });

  it("removes boss projectiles when they touch solids", () => {
    const projectile = createBossProjectile({
      id: "boss-projectile-01",
      boss: BOSS_STATE,
      attack: PROJECTILE_ATTACK,
    })!;

    expect(
      updateBossProjectiles({
        projectiles: [projectile],
        deltaMs: 100,
        solids: [
          {
            x: 224,
            y: 180,
            width: 16,
            height: 24,
          },
        ],
      }),
    ).toEqual({
      projectiles: [],
      removals: [
        {
          projectileId: "boss-projectile-01",
          kind: "solid",
        },
      ],
    });
  });

  it("removes boss projectiles when they leave their boss arena", () => {
    const projectile = createBossProjectile({
      id: "boss-projectile-01",
      boss: {
        ...BOSS_STATE,
        position: {
          x: 165,
          y: 190,
        },
      },
      attack: PROJECTILE_ATTACK,
    })!;

    expect(
      updateBossProjectiles({
        projectiles: [projectile],
        deltaMs: 200,
        arenasByBossId: {
          "boss-projectile-test": BOSS.arena,
        },
      }),
    ).toEqual({
      projectiles: [],
      removals: [
        {
          projectileId: "boss-projectile-01",
          kind: "arena",
        },
      ],
    });
  });
});
