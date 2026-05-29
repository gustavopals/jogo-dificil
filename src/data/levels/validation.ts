import {
  DEFAULT_PLAYER_INITIAL_ENERGY,
  PLAYER_ENERGY_MAX,
  PLAYER_ENERGY_MIN,
  type BossAttackDefinition,
  type BossDamageRuleDefinition,
  type BossDefinition,
  type BossMovementDefinition,
  type BossProjectileDefinition,
  type BossVulnerabilityWindowDefinition,
  type CheckpointDefinition,
  type EnergyPowerKind,
  type EnergyTargetDefinition,
  type InteractiveObjectDefinition,
  type LevelDefinition,
} from "../../shared";
import type { RectLike, Vector2Like } from "../../shared";

export type LevelValidationCode =
  | "duplicate-id"
  | "invalid-boss"
  | "invalid-energy"
  | "invalid-energy-target"
  | "invalid-rect"
  | "missing-reference"
  | "out-of-bounds"
  | "missing-asset";

export interface LevelValidationIssue {
  readonly code: LevelValidationCode;
  readonly path: string;
  readonly message: string;
}

export interface LevelValidationResult {
  readonly isValid: boolean;
  readonly issues: readonly LevelValidationIssue[];
}

type ValidationIssueDraft = {
  readonly code: LevelValidationCode;
  readonly path: string;
  readonly message: string;
};

const CYAN_SPARK_POWER: EnergyPowerKind = "cyan-spark";
const CYAN_BURST_POWER: EnergyPowerKind = "cyan-burst";

export function validateLevel(level: LevelDefinition): LevelValidationResult {
  const issues: ValidationIssueDraft[] = [];

  validateRect("bounds", level.bounds, issues);
  validateInitialEnergy("initialEnergy", level.initialEnergy, issues);
  validatePointInBounds("spawn", level.spawn, level.bounds, issues);
  validateRectInBounds("exit.area", level.exit.area, level.bounds, issues);
  validateUniqueLevelEntityIds(level, issues);
  validateCheckpoints(level, issues);
  validateTerrain(level, issues);
  validateHazards(level, issues);
  validateTraps(level, issues);
  validateItems(level, issues);
  validateInteractiveObjects(level, issues);
  validateEnergyTargets(level, issues);
  validateBosses(level, issues);
  validateReferencedAssets(level, issues);

  return createResult(issues);
}

export function validateLevels(
  levels: readonly LevelDefinition[],
): LevelValidationResult {
  const issues: ValidationIssueDraft[] = [];
  const seenLevelIds = new Set<string>();

  levels.forEach((level, index) => {
    const path = `levels[${index}].id`;

    if (seenLevelIds.has(level.id)) {
      issues.push({
        code: "duplicate-id",
        path,
        message: `Level id "${level.id}" is duplicated.`,
      });
    }

    seenLevelIds.add(level.id);

    validateLevel(level).issues.forEach((issue) => {
      issues.push({
        ...issue,
        path: `levels[${index}].${issue.path}`,
      });
    });
  });

  return createResult(issues);
}

function validateUniqueLevelEntityIds(
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  const entries = [
    { id: level.exit.id, path: "exit.id" },
    ...level.checkpoints.map((checkpoint, index) => ({
      id: checkpoint.id,
      path: `checkpoints[${index}].id`,
    })),
    ...level.terrain.map((terrain, index) => ({
      id: terrain.id,
      path: `terrain[${index}].id`,
    })),
    ...level.hazards.map((hazard, index) => ({
      id: hazard.id,
      path: `hazards[${index}].id`,
    })),
    ...level.traps.map((trap, index) => ({
      id: trap.id,
      path: `traps[${index}].id`,
    })),
    ...level.items.map((item, index) => ({
      id: item.id,
      path: `items[${index}].id`,
    })),
    ...level.interactiveObjects.map((interactiveObject, index) => ({
      id: interactiveObject.id,
      path: `interactiveObjects[${index}].id`,
    })),
    ...(level.energyTargets ?? []).map((energyTarget, index) => ({
      id: energyTarget.id,
      path: `energyTargets[${index}].id`,
    })),
    ...(level.bosses ?? []).map((boss, index) => ({
      id: boss.id,
      path: `bosses[${index}].id`,
    })),
  ];

  const seenIds = new Map<string, string>();

  entries.forEach(({ id, path }) => {
    const firstPath = seenIds.get(id);

    if (firstPath) {
      issues.push({
        code: "duplicate-id",
        path,
        message: `Id "${id}" duplicates ${firstPath}.`,
      });

      return;
    }

    seenIds.set(id, path);
  });
}

function validateCheckpoints(
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  level.checkpoints.forEach((checkpoint, index) => {
    validatePointInBounds(
      `checkpoints[${index}].position`,
      checkpoint.position,
      level.bounds,
      issues,
    );
    validateRectInBounds(
      `checkpoints[${index}].area`,
      checkpoint.area,
      level.bounds,
      issues,
    );
    validateInitialEnergy(
      `checkpoints[${index}].initialEnergy`,
      checkpoint.initialEnergy,
      issues,
    );
  });
}

function validateInitialEnergy(
  path: string,
  initialEnergy: number | undefined,
  issues: ValidationIssueDraft[],
): void {
  if (initialEnergy === undefined) {
    return;
  }

  if (
    !Number.isFinite(initialEnergy) ||
    initialEnergy < PLAYER_ENERGY_MIN ||
    initialEnergy > PLAYER_ENERGY_MAX
  ) {
    issues.push({
      code: "invalid-energy",
      path,
      message: `Initial energy must be between ${PLAYER_ENERGY_MIN} and ${PLAYER_ENERGY_MAX}. Default is ${DEFAULT_PLAYER_INITIAL_ENERGY}.`,
    });
  }
}

function validateTerrain(
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  level.terrain.forEach((terrain, index) => {
    validateRectInBounds(
      `terrain[${index}].area`,
      terrain.area,
      level.bounds,
      issues,
    );
  });
}

function validateHazards(
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  level.hazards.forEach((hazard, index) => {
    validateRectInBounds(
      `hazards[${index}].area`,
      hazard.area,
      level.bounds,
      issues,
    );
  });
}

function validateTraps(
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  level.traps.forEach((trap, index) => {
    validateRectInBounds(
      `traps[${index}].trigger.area`,
      trap.trigger.area,
      level.bounds,
      issues,
    );

    if (trap.area) {
      validateRectInBounds(
        `traps[${index}].area`,
        trap.area,
        level.bounds,
        issues,
      );
    }
  });
}

function validateItems(
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  const interactiveObjectIds = new Set(
    level.interactiveObjects.map((interactiveObject) => interactiveObject.id),
  );

  level.items.forEach((item, index) => {
    validatePointInBounds(
      `items[${index}].position`,
      item.position,
      level.bounds,
      issues,
    );
    validateRectInBounds(
      `items[${index}].hitbox`,
      item.hitbox,
      level.bounds,
      issues,
    );

    if (
      item.activatesObjectId &&
      !interactiveObjectIds.has(item.activatesObjectId)
    ) {
      issues.push({
        code: "missing-reference",
        path: `items[${index}].activatesObjectId`,
        message: `Item "${item.id}" activates missing interactive object "${item.activatesObjectId}".`,
      });
    }
  });
}

function validateInteractiveObjects(
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  const interactiveObjectIds = new Set(
    level.interactiveObjects.map((interactiveObject) => interactiveObject.id),
  );

  level.interactiveObjects.forEach((interactiveObject, index) => {
    validateRectInBounds(
      `interactiveObjects[${index}].area`,
      interactiveObject.area,
      level.bounds,
      issues,
    );

    if (
      interactiveObject.targetObjectId &&
      !interactiveObjectIds.has(interactiveObject.targetObjectId)
    ) {
      issues.push({
        code: "missing-reference",
        path: `interactiveObjects[${index}].targetObjectId`,
        message: `Interactive object "${interactiveObject.id}" targets missing interactive object "${interactiveObject.targetObjectId}".`,
      });
    }
  });
}

function validateEnergyTargets(
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  const interactiveObjectIds = new Set(
    level.interactiveObjects.map((interactiveObject) => interactiveObject.id),
  );

  (level.energyTargets ?? []).forEach((energyTarget, index) => {
    validateRectInBounds(
      `energyTargets[${index}].area`,
      energyTarget.area,
      level.bounds,
      issues,
    );

    if (
      !Number.isInteger(energyTarget.hitPoints) ||
      energyTarget.hitPoints <= 0
    ) {
      issues.push({
        code: "invalid-energy-target",
        path: `energyTargets[${index}].hitPoints`,
        message: `Energy target "${energyTarget.id}" must have positive integer hitPoints.`,
      });
    }

    validateEnergyTargetPowers(energyTarget, index, issues);
    validateEnergyTargetTiming(energyTarget, index, issues);
    validateEnergyTargetKindRules(energyTarget, index, issues);

    if (
      energyTarget.activatesObjectId &&
      !interactiveObjectIds.has(energyTarget.activatesObjectId)
    ) {
      issues.push({
        code: "missing-reference",
        path: `energyTargets[${index}].activatesObjectId`,
        message: `Energy target "${energyTarget.id}" activates missing interactive object "${energyTarget.activatesObjectId}".`,
      });
    }
  });
}

function validateBosses(
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  const checkpointsById = new Map(
    level.checkpoints.map((checkpoint) => [checkpoint.id, checkpoint]),
  );
  const interactiveObjectsById = new Map(
    level.interactiveObjects.map((interactiveObject) => [
      interactiveObject.id,
      interactiveObject,
    ]),
  );

  (level.bosses ?? []).forEach((boss, index) => {
    const path = `bosses[${index}]`;

    validateBossIdentity(path, boss, level, issues);
    validateBossGeometry(path, boss, level, issues);
    validateBossArenaCheckpoint(path, boss, checkpointsById, issues);
    validateBossMovement(`${path}.movement`, boss.movement, boss.arena, issues);
    validateBossAttacks(path, boss, issues);
    validateBossDamageRules(path, boss.damageRules, issues);
    validateBossVulnerabilityWindows(path, boss, issues);
    validateBossArenaLock(path, boss, interactiveObjectsById, issues);
    validateBossDefeatUnlocks(path, boss, interactiveObjectsById, issues);
  });
}

function validateBossIdentity(
  path: string,
  boss: BossDefinition,
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  if (boss.levelId === level.id) {
    return;
  }

  issues.push({
    code: "invalid-boss",
    path: `${path}.levelId`,
    message: `Boss "${boss.id}" must declare levelId "${level.id}".`,
  });
}

function validateBossGeometry(
  path: string,
  boss: BossDefinition,
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  validateRectInBounds(`${path}.arena`, boss.arena, level.bounds, issues);
  validatePointInBounds(`${path}.spawn`, boss.spawn, level.bounds, issues);
  validateBossPointInArena(`${path}.spawn`, boss.spawn, boss.arena, issues);
  validateBossRectInArena(
    `${path}.hitbox`,
    boss.hitbox,
    boss.arena,
    level.bounds,
    issues,
  );
  validateBossRectInArena(
    `${path}.weakPoint`,
    boss.weakPoint,
    boss.arena,
    level.bounds,
    issues,
  );

  if (
    isRectPositive(boss.hitbox) &&
    isRectPositive(boss.weakPoint) &&
    !isRectInsideRect(boss.weakPoint, boss.hitbox)
  ) {
    issues.push({
      code: "invalid-boss",
      path: `${path}.weakPoint`,
      message: `Boss "${boss.id}" weakPoint must be inside its hitbox.`,
    });
  }

  if (!isPositiveInteger(boss.health)) {
    issues.push({
      code: "invalid-boss",
      path: `${path}.health`,
      message: `Boss "${boss.id}" must have positive integer health.`,
    });
  }
}

function validateBossArenaCheckpoint(
  path: string,
  boss: BossDefinition,
  checkpointsById: ReadonlyMap<string, CheckpointDefinition>,
  issues: ValidationIssueDraft[],
): void {
  const checkpoint = checkpointsById.get(boss.entryCheckpointId);

  if (!checkpoint) {
    issues.push({
      code: "missing-reference",
      path: `${path}.entryCheckpointId`,
      message: `Boss "${boss.id}" uses missing entry checkpoint "${boss.entryCheckpointId}".`,
    });

    return;
  }

  if (isCheckpointImmediatelyBeforeBossArena(checkpoint, boss.arena)) {
    return;
  }

  issues.push({
    code: "invalid-boss",
    path: `${path}.entryCheckpointId`,
    message: `Boss "${boss.id}" entry checkpoint "${checkpoint.id}" must be immediately before the arena entrance.`,
  });
}

function validateBossMovement(
  path: string,
  movement: BossMovementDefinition,
  arena: RectLike,
  issues: ValidationIssueDraft[],
): void {
  if (
    movement.speedPxPerSecond !== undefined &&
    (!Number.isFinite(movement.speedPxPerSecond) ||
      movement.speedPxPerSecond <= 0)
  ) {
    issues.push({
      code: "invalid-boss",
      path: `${path}.speedPxPerSecond`,
      message: `Boss movement must use a positive speedPxPerSecond when declared.`,
    });
  }

  if (movement.patrolArea) {
    validateRect(`${path}.patrolArea`, movement.patrolArea, issues);

    if (
      isRectPositive(arena) &&
      isRectPositive(movement.patrolArea) &&
      !isRectInsideRect(movement.patrolArea, arena)
    ) {
      issues.push({
        code: "invalid-boss",
        path: `${path}.patrolArea`,
        message: `Boss patrolArea must be inside its arena.`,
      });
    }
  }

  movement.anchors?.forEach((anchor, index) => {
    validateBossPointInArena(
      `${path}.anchors[${index}]`,
      anchor,
      arena,
      issues,
    );
  });

  if (
    (movement.kind === "patrol" || movement.kind === "anchor-swap") &&
    (movement.anchors?.length ?? 0) < 2 &&
    movement.patrolArea === undefined
  ) {
    issues.push({
      code: "invalid-boss",
      path,
      message: `Boss movement "${movement.kind}" must declare at least two anchors or a patrolArea.`,
    });
  }
}

function validateBossAttacks(
  path: string,
  boss: BossDefinition,
  issues: ValidationIssueDraft[],
): void {
  if (boss.attacks.length === 0) {
    issues.push({
      code: "invalid-boss",
      path: `${path}.attacks`,
      message: `Boss "${boss.id}" must declare at least one attack.`,
    });
  }

  validateScopedIds(
    boss.attacks.map((attack, index) => ({
      id: attack.id,
      path: `${path}.attacks[${index}].id`,
    })),
    issues,
  );

  const vulnerabilityWindowIds = new Set(
    boss.vulnerabilityWindows.map((window) => window.id),
  );

  boss.attacks.forEach((attack, index) => {
    validateBossAttack(
      `${path}.attacks[${index}]`,
      boss,
      attack,
      vulnerabilityWindowIds,
      issues,
    );
  });
}

function validateBossAttack(
  path: string,
  boss: BossDefinition,
  attack: BossAttackDefinition,
  vulnerabilityWindowIds: ReadonlySet<string>,
  issues: ValidationIssueDraft[],
): void {
  validatePositiveInteger(`${path}.windupMs`, attack.windupMs, issues);
  validatePositiveInteger(`${path}.activeMs`, attack.activeMs, issues);
  validatePositiveInteger(`${path}.recoverMs`, attack.recoverMs, issues);
  validatePositiveInteger(`${path}.cooldownMs`, attack.cooldownMs, issues);

  if (!isNonNegativeInteger(attack.contactDamage)) {
    issues.push({
      code: "invalid-boss",
      path: `${path}.contactDamage`,
      message: `Boss attack "${attack.id}" must use non-negative integer contactDamage.`,
    });
  }

  if (attack.tellArea) {
    validateBossRectInsideArena(
      `${path}.tellArea`,
      attack.tellArea,
      boss.arena,
      issues,
    );
  }

  if (attack.hitbox) {
    validateBossRectInsideArena(
      `${path}.hitbox`,
      attack.hitbox,
      boss.arena,
      issues,
    );
  }

  if (attack.projectile) {
    validateBossProjectile(
      `${path}.projectile`,
      attack,
      attack.projectile,
      issues,
    );
  }

  if (
    attack.opensVulnerabilityWindowId &&
    !vulnerabilityWindowIds.has(attack.opensVulnerabilityWindowId)
  ) {
    issues.push({
      code: "missing-reference",
      path: `${path}.opensVulnerabilityWindowId`,
      message: `Boss attack "${attack.id}" opens missing vulnerability window "${attack.opensVulnerabilityWindowId}".`,
    });
  }
}

function validateBossProjectile(
  path: string,
  attack: BossAttackDefinition,
  projectile: BossProjectileDefinition,
  issues: ValidationIssueDraft[],
): void {
  validateRect(`${path}.hitbox`, projectile.hitbox, issues);

  if (
    !isFiniteVector(projectile.velocity) ||
    isZeroVector(projectile.velocity)
  ) {
    issues.push({
      code: "invalid-boss",
      path: `${path}.velocity`,
      message: `Boss attack "${attack.id}" projectile must use a finite non-zero velocity.`,
    });
  }

  validatePositiveInteger(`${path}.maxActive`, projectile.maxActive, issues);

  if (projectile.maxRangePx !== undefined) {
    validatePositiveInteger(
      `${path}.maxRangePx`,
      projectile.maxRangePx,
      issues,
    );
  }

  if (
    projectile.isDestructibleBy !== undefined &&
    projectile.isDestructibleBy.length === 0
  ) {
    issues.push({
      code: "invalid-boss",
      path: `${path}.isDestructibleBy`,
      message: `Boss attack "${attack.id}" projectile destructible powers cannot be empty when declared.`,
    });
  }
}

function validateBossDamageRules(
  path: string,
  damageRules: readonly BossDamageRuleDefinition[],
  issues: ValidationIssueDraft[],
): void {
  if (damageRules.length === 0) {
    issues.push({
      code: "invalid-boss",
      path: `${path}.damageRules`,
      message: `Boss must declare at least one damage rule.`,
    });
  }

  damageRules.forEach((rule, index) => {
    const rulePath = `${path}.damageRules[${index}]`;

    if (!isNonNegativeInteger(rule.damage)) {
      issues.push({
        code: "invalid-boss",
        path: `${rulePath}.damage`,
        message: `Boss damage rule for "${rule.power}" must use non-negative integer damage.`,
      });
    }

    if (rule.validStates.length === 0) {
      issues.push({
        code: "invalid-boss",
        path: `${rulePath}.validStates`,
        message: `Boss damage rule for "${rule.power}" must declare at least one valid state.`,
      });
    }

    if (rule.effects.length === 0) {
      issues.push({
        code: "invalid-boss",
        path: `${rulePath}.effects`,
        message: `Boss damage rule for "${rule.power}" must declare at least one effect.`,
      });
    }

    if (rule.damage > 0 && !rule.effects.includes("damage")) {
      issues.push({
        code: "invalid-boss",
        path: `${rulePath}.effects`,
        message: `Boss damage rule for "${rule.power}" must include "damage" when damage is positive.`,
      });
    }
  });
}

function validateBossVulnerabilityWindows(
  path: string,
  boss: BossDefinition,
  issues: ValidationIssueDraft[],
): void {
  if (boss.vulnerabilityWindows.length === 0) {
    issues.push({
      code: "invalid-boss",
      path: `${path}.vulnerabilityWindows`,
      message: `Boss "${boss.id}" must declare at least one vulnerability window.`,
    });
  }

  validateScopedIds(
    boss.vulnerabilityWindows.map((window, index) => ({
      id: window.id,
      path: `${path}.vulnerabilityWindows[${index}].id`,
    })),
    issues,
  );

  const attackIds = new Set(boss.attacks.map((attack) => attack.id));

  boss.vulnerabilityWindows.forEach((window, index) => {
    validateBossVulnerabilityWindow(
      `${path}.vulnerabilityWindows[${index}]`,
      boss,
      window,
      attackIds,
      issues,
    );
  });
}

function validateBossVulnerabilityWindow(
  path: string,
  boss: BossDefinition,
  window: BossVulnerabilityWindowDefinition,
  attackIds: ReadonlySet<string>,
  issues: ValidationIssueDraft[],
): void {
  validatePositiveInteger(`${path}.durationMs`, window.durationMs, issues);

  window.opensAfterAttackIds?.forEach((attackId, index) => {
    if (attackIds.has(attackId)) {
      return;
    }

    issues.push({
      code: "missing-reference",
      path: `${path}.opensAfterAttackIds[${index}]`,
      message: `Boss "${boss.id}" vulnerability window "${window.id}" references missing attack "${attackId}".`,
    });
  });
}

function validateBossDefeatUnlocks(
  path: string,
  boss: BossDefinition,
  interactiveObjectsById: ReadonlyMap<string, InteractiveObjectDefinition>,
  issues: ValidationIssueDraft[],
): void {
  if (boss.defeatUnlocks.length === 0) {
    issues.push({
      code: "invalid-boss",
      path: `${path}.defeatUnlocks`,
      message: `Boss "${boss.id}" must unlock at least one interactive object on defeat.`,
    });
  }

  boss.defeatUnlocks.forEach((unlockId, index) => {
    if (interactiveObjectsById.has(unlockId)) {
      return;
    }

    issues.push({
      code: "missing-reference",
      path: `${path}.defeatUnlocks[${index}]`,
      message: `Boss "${boss.id}" unlocks missing interactive object "${unlockId}".`,
    });
  });
}

function validateBossArenaLock(
  path: string,
  boss: BossDefinition,
  interactiveObjectsById: ReadonlyMap<string, InteractiveObjectDefinition>,
  issues: ValidationIssueDraft[],
): void {
  if (!boss.entryDoorId) {
    return;
  }

  const entryDoor = interactiveObjectsById.get(boss.entryDoorId);

  if (!entryDoor) {
    issues.push({
      code: "missing-reference",
      path: `${path}.entryDoorId`,
      message: `Boss "${boss.id}" uses missing entry door "${boss.entryDoorId}".`,
    });

    return;
  }

  if (entryDoor.kind !== "door") {
    issues.push({
      code: "invalid-boss",
      path: `${path}.entryDoorId`,
      message: `Boss "${boss.id}" entryDoorId must reference a door interactive object.`,
    });
  }
}

function validateReferencedAssets(
  level: LevelDefinition,
  issues: ValidationIssueDraft[],
): void {
  const sprites = new Set(level.assets.sprites);
  const tilesets = new Set(level.assets.tilesets);
  const audio = new Set(level.assets.audio);

  level.terrain.forEach((terrain, index) => {
    if (terrain.assetId && !tilesets.has(terrain.assetId)) {
      pushMissingAssetIssue(
        `terrain[${index}].assetId`,
        terrain.assetId,
        "assets.tilesets",
        issues,
      );
    }
  });

  level.items.forEach((item, index) => {
    if (item.assetId && !sprites.has(item.assetId)) {
      pushMissingAssetIssue(
        `items[${index}].assetId`,
        item.assetId,
        "assets.sprites",
        issues,
      );
    }
  });

  (level.bosses ?? []).forEach((boss, index) => {
    if (boss.assetId && !sprites.has(boss.assetId)) {
      pushMissingAssetIssue(
        `bosses[${index}].assetId`,
        boss.assetId,
        "assets.sprites",
        issues,
      );
    }
  });

  if (level.audio.musicId && !audio.has(level.audio.musicId)) {
    pushMissingAssetIssue(
      "audio.musicId",
      level.audio.musicId,
      "assets.audio",
      issues,
    );
  }

  level.audio.sounds.forEach((sound, index) => {
    if (!audio.has(sound.assetKey)) {
      pushMissingAssetIssue(
        `audio.sounds[${index}].assetKey`,
        sound.assetKey,
        "assets.audio",
        issues,
      );
    }
  });
}

function validateEnergyTargetPowers(
  energyTarget: EnergyTargetDefinition,
  index: number,
  issues: ValidationIssueDraft[],
): void {
  if (energyTarget.acceptedPowers.length > 0) {
    return;
  }

  issues.push({
    code: "invalid-energy-target",
    path: `energyTargets[${index}].acceptedPowers`,
    message: `Energy target "${energyTarget.id}" must accept at least one energy power.`,
  });
}

function validateEnergyTargetTiming(
  energyTarget: EnergyTargetDefinition,
  index: number,
  issues: ValidationIssueDraft[],
): void {
  if (
    energyTarget.activationDurationMs !== undefined &&
    !isPositiveInteger(energyTarget.activationDurationMs)
  ) {
    issues.push({
      code: "invalid-energy-target",
      path: `energyTargets[${index}].activationDurationMs`,
      message: `Energy target "${energyTarget.id}" must use a positive integer activationDurationMs.`,
    });
  }

  if (
    energyTarget.relayWindowMs !== undefined &&
    !isPositiveInteger(energyTarget.relayWindowMs)
  ) {
    issues.push({
      code: "invalid-energy-target",
      path: `energyTargets[${index}].relayWindowMs`,
      message: `Energy target "${energyTarget.id}" must use a positive integer relayWindowMs.`,
    });
  }
}

function validateEnergyTargetKindRules(
  energyTarget: EnergyTargetDefinition,
  index: number,
  issues: ValidationIssueDraft[],
): void {
  if (
    energyTarget.kind === "energy-cracked-block" &&
    !acceptsOnlyPowers(energyTarget, [CYAN_BURST_POWER])
  ) {
    pushEnergyTargetRuleIssue(
      index,
      energyTarget,
      "`energy-cracked-block` must accept only `cyan-burst`.",
      issues,
    );
  }

  if (
    energyTarget.kind === "energy-core" &&
    !acceptsOnlyPowers(energyTarget, [CYAN_BURST_POWER])
  ) {
    pushEnergyTargetRuleIssue(
      index,
      energyTarget,
      "`energy-core` must accept only `cyan-burst`.",
      issues,
    );
  }

  if (
    energyTarget.kind === "energy-relay" &&
    (!acceptsOnlyPowers(energyTarget, [CYAN_SPARK_POWER]) ||
      energyTarget.relayWindowMs === undefined)
  ) {
    pushEnergyTargetRuleIssue(
      index,
      energyTarget,
      "`energy-relay` must accept only `cyan-spark` and declare `relayWindowMs`.",
      issues,
    );
  }

  if (energyTarget.kind === "energy-absorber") {
    if (energyTarget.absorbsEnergy !== true) {
      issues.push({
        code: "invalid-energy-target",
        path: `energyTargets[${index}].absorbsEnergy`,
        message: `Energy target "${energyTarget.id}" must declare absorbsEnergy: true.`,
      });
    }

    if (energyTarget.activatesObjectId !== undefined) {
      issues.push({
        code: "invalid-energy-target",
        path: `energyTargets[${index}].activatesObjectId`,
        message: `Energy target "${energyTarget.id}" is an absorber and cannot activate interactive objects.`,
      });
    }
  }
}

function acceptsOnlyPowers(
  energyTarget: EnergyTargetDefinition,
  acceptedPowers: readonly EnergyPowerKind[],
): boolean {
  return (
    energyTarget.acceptedPowers.length === acceptedPowers.length &&
    acceptedPowers.every((power) => energyTarget.acceptedPowers.includes(power))
  );
}

function pushEnergyTargetRuleIssue(
  index: number,
  energyTarget: EnergyTargetDefinition,
  message: string,
  issues: ValidationIssueDraft[],
): void {
  issues.push({
    code: "invalid-energy-target",
    path: `energyTargets[${index}].acceptedPowers`,
    message: `Energy target "${energyTarget.id}" has invalid declarative rules: ${message}`,
  });
}

function validatePointInBounds(
  path: string,
  point: Vector2Like,
  bounds: RectLike,
  issues: ValidationIssueDraft[],
): void {
  if (isPointInRect(point, bounds)) {
    return;
  }

  issues.push({
    code: "out-of-bounds",
    path,
    message: `${path} must be inside level bounds.`,
  });
}

function validateRectInBounds(
  path: string,
  rect: RectLike,
  bounds: RectLike,
  issues: ValidationIssueDraft[],
): void {
  validateRect(path, rect, issues);

  if (!isRectPositive(rect) || isRectInsideRect(rect, bounds)) {
    return;
  }

  issues.push({
    code: "out-of-bounds",
    path,
    message: `${path} must be fully inside level bounds.`,
  });
}

function validateBossRectInArena(
  path: string,
  rect: RectLike,
  arena: RectLike,
  bounds: RectLike,
  issues: ValidationIssueDraft[],
): void {
  validateRectInBounds(path, rect, bounds, issues);

  if (
    !isRectPositive(arena) ||
    !isRectPositive(rect) ||
    isRectInsideRect(rect, arena)
  ) {
    return;
  }

  issues.push({
    code: "invalid-boss",
    path,
    message: `${path} must be inside boss arena.`,
  });
}

function validateBossRectInsideArena(
  path: string,
  rect: RectLike,
  arena: RectLike,
  issues: ValidationIssueDraft[],
): void {
  validateRect(path, rect, issues);

  if (
    !isRectPositive(arena) ||
    !isRectPositive(rect) ||
    isRectInsideRect(rect, arena)
  ) {
    return;
  }

  issues.push({
    code: "invalid-boss",
    path,
    message: `${path} must be inside boss arena.`,
  });
}

function validateBossPointInArena(
  path: string,
  point: Vector2Like,
  arena: RectLike,
  issues: ValidationIssueDraft[],
): void {
  if (!isRectPositive(arena) || isPointInRect(point, arena)) {
    return;
  }

  issues.push({
    code: "invalid-boss",
    path,
    message: `${path} must be inside boss arena.`,
  });
}

function isCheckpointImmediatelyBeforeBossArena(
  checkpoint: CheckpointDefinition,
  arena: RectLike,
): boolean {
  if (!isRectPositive(checkpoint.area) || !isRectPositive(arena)) {
    return true;
  }

  const checkpointRight = checkpoint.area.x + checkpoint.area.width;
  const horizontalGap = arena.x - checkpointRight;
  const maxGapPx = checkpoint.area.width * 4;

  return (
    horizontalGap >= 0 &&
    horizontalGap <= maxGapPx &&
    rectsOverlapVertically(checkpoint.area, arena)
  );
}

function rectsOverlapVertically(a: RectLike, b: RectLike): boolean {
  return a.y < b.y + b.height && a.y + a.height > b.y;
}

function validateRect(
  path: string,
  rect: RectLike,
  issues: ValidationIssueDraft[],
): void {
  if (isRectPositive(rect)) {
    return;
  }

  issues.push({
    code: "invalid-rect",
    path,
    message: `${path} must have positive width and height.`,
  });
}

function validatePositiveInteger(
  path: string,
  value: number,
  issues: ValidationIssueDraft[],
): void {
  if (isPositiveInteger(value)) {
    return;
  }

  issues.push({
    code: "invalid-boss",
    path,
    message: `${path} must be a positive integer.`,
  });
}

function validateScopedIds(
  entries: readonly { readonly id: string; readonly path: string }[],
  issues: ValidationIssueDraft[],
): void {
  const seenIds = new Map<string, string>();

  entries.forEach(({ id, path }) => {
    const firstPath = seenIds.get(id);

    if (firstPath) {
      issues.push({
        code: "duplicate-id",
        path,
        message: `Id "${id}" duplicates ${firstPath}.`,
      });

      return;
    }

    seenIds.set(id, path);
  });
}

function pushMissingAssetIssue(
  path: string,
  assetId: string,
  assetListPath: string,
  issues: ValidationIssueDraft[],
): void {
  issues.push({
    code: "missing-asset",
    path,
    message: `Asset "${assetId}" referenced by ${path} is missing from ${assetListPath}.`,
  });
}

function createResult(
  issues: readonly ValidationIssueDraft[],
): LevelValidationResult {
  return {
    isValid: issues.length === 0,
    issues: [...issues],
  };
}

function isPointInRect(point: Vector2Like, rect: RectLike): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

function isFiniteVector(vector: Vector2Like): boolean {
  return Number.isFinite(vector.x) && Number.isFinite(vector.y);
}

function isZeroVector(vector: Vector2Like): boolean {
  return vector.x === 0 && vector.y === 0;
}

function isRectInsideRect(rect: RectLike, bounds: RectLike): boolean {
  return (
    rect.x >= bounds.x &&
    rect.y >= bounds.y &&
    rect.x + rect.width <= bounds.x + bounds.width &&
    rect.y + rect.height <= bounds.y + bounds.height
  );
}

function isRectPositive(rect: RectLike): boolean {
  return rect.width > 0 && rect.height > 0;
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}
