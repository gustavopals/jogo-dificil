import type {
  BossAttackDefinition,
  BossDefinition,
  BossMovementDefinition,
  BossProjectileDefinition,
  InteractiveObjectDefinition,
  ItemDefinition,
  LevelDefinition,
  TrapConfig,
  TrapDefinition,
} from "../../shared";
import { getResolutionScale, LEGACY_GAME_RESOLUTION } from "../../game/scale";

const LEGACY_TRAP_CONFIG_SCALAR_KEYS = new Set(["velocityX", "velocityY"]);

export function migrateLegacyLevelDefinition<TLevel extends LevelDefinition>(
  level: TLevel,
): TLevel {
  if (!shouldScaleLegacyLevel(level)) {
    return level;
  }

  const factor = getResolutionScale().uniform;

  if (factor <= 1) {
    return level;
  }

  return {
    ...level,
    bounds: scaleRect(level.bounds, factor),
    spawn: scaleVector(level.spawn, factor),
    exit: {
      ...level.exit,
      area: scaleRect(level.exit.area, factor),
    },
    checkpoints: level.checkpoints.map((checkpoint) => ({
      ...checkpoint,
      position: scaleVector(checkpoint.position, factor),
      area: scaleRect(checkpoint.area, factor),
    })),
    terrain: level.terrain.map((terrain) => ({
      ...terrain,
      area: scaleRect(terrain.area, factor),
    })),
    hazards: level.hazards.map((hazard) => ({
      ...hazard,
      area: scaleRect(hazard.area, factor),
    })),
    traps: level.traps.map((trap) => scaleTrap(trap, factor)),
    items: level.items.map((item) => scaleItem(item, factor)),
    interactiveObjects: level.interactiveObjects.map((interactiveObject) =>
      scaleInteractiveObject(interactiveObject, factor),
    ),
    hints: level.hints?.map((hint) => ({
      ...hint,
      position: scaleVector(hint.position, factor),
    })),
    energyTargets: level.energyTargets?.map((target) => ({
      ...target,
      area: scaleRect(target.area, factor),
    })),
    bosses: level.bosses?.map((boss) => scaleBoss(boss, factor)),
  };
}

function shouldScaleLegacyLevel(level: LevelDefinition): boolean {
  return level.bounds.height === LEGACY_GAME_RESOLUTION.height;
}

function scaleTrap(trap: TrapDefinition, factor: number): TrapDefinition {
  return {
    ...trap,
    trigger: {
      ...trap.trigger,
      area: scaleRect(trap.trigger.area, factor),
    },
    area: trap.area ? scaleRect(trap.area, factor) : undefined,
    config: trap.config ? scaleTrapConfig(trap.config, factor) : undefined,
  };
}

function scaleTrapConfig(config: TrapConfig, factor: number): TrapConfig {
  const scaledEntries = Object.entries(config).map(([key, value]) => {
    if (typeof value === "number" && LEGACY_TRAP_CONFIG_SCALAR_KEYS.has(key)) {
      return [key, scaleNumber(value, factor)];
    }

    return [key, value];
  });

  return Object.fromEntries(scaledEntries);
}

function scaleItem(item: ItemDefinition, factor: number): ItemDefinition {
  return {
    ...item,
    position: scaleVector(item.position, factor),
    hitbox: scaleRect(item.hitbox, factor),
  };
}

function scaleInteractiveObject(
  interactiveObject: InteractiveObjectDefinition,
  factor: number,
): InteractiveObjectDefinition {
  return {
    ...interactiveObject,
    area: scaleRect(interactiveObject.area, factor),
  };
}

function scaleBoss(boss: BossDefinition, factor: number): BossDefinition {
  return {
    ...boss,
    arena: scaleRect(boss.arena, factor),
    spawn: scaleVector(boss.spawn, factor),
    hitbox: scaleRect(boss.hitbox, factor),
    weakPoint: scaleRect(boss.weakPoint, factor),
    movement: scaleBossMovement(boss.movement, factor),
    attacks: boss.attacks.map((attack) => scaleBossAttack(attack, factor)),
  };
}

function scaleBossMovement(
  movement: BossMovementDefinition,
  factor: number,
): BossMovementDefinition {
  return {
    ...movement,
    speedPxPerSecond:
      movement.speedPxPerSecond === undefined
        ? undefined
        : scaleNumber(movement.speedPxPerSecond, factor),
    anchors: movement.anchors?.map((anchor) => scaleVector(anchor, factor)),
    patrolArea: movement.patrolArea
      ? scaleRect(movement.patrolArea, factor)
      : undefined,
  };
}

function scaleBossAttack(
  attack: BossAttackDefinition,
  factor: number,
): BossAttackDefinition {
  return {
    ...attack,
    tellArea: attack.tellArea ? scaleRect(attack.tellArea, factor) : undefined,
    hitbox: attack.hitbox ? scaleRect(attack.hitbox, factor) : undefined,
    projectile: attack.projectile
      ? scaleBossProjectile(attack.projectile, factor)
      : undefined,
  };
}

function scaleBossProjectile(
  projectile: BossProjectileDefinition,
  factor: number,
): BossProjectileDefinition {
  return {
    ...projectile,
    hitbox: scaleRect(projectile.hitbox, factor),
    velocity: scaleVector(projectile.velocity, factor),
    maxRangePx:
      projectile.maxRangePx === undefined
        ? undefined
        : scaleNumber(projectile.maxRangePx, factor),
  };
}

function scaleRect(
  rect: Readonly<{ x: number; y: number; width: number; height: number }>,
  factor: number,
) {
  return {
    x: scaleNumber(rect.x, factor),
    y: scaleNumber(rect.y, factor),
    width: scaleNumber(rect.width, factor),
    height: scaleNumber(rect.height, factor),
  };
}

function scaleVector(vector: Readonly<{ x: number; y: number }>, factor: number) {
  return {
    x: scaleNumber(vector.x, factor),
    y: scaleNumber(vector.y, factor),
  };
}

function scaleNumber(value: number, factor: number): number {
  return Math.round(value * factor);
}
