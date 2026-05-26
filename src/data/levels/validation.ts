import type { LevelDefinition } from "../../shared";
import type { RectLike, Vector2Like } from "../../shared";

export type LevelValidationCode =
  | "duplicate-id"
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

export function validateLevel(level: LevelDefinition): LevelValidationResult {
  const issues: ValidationIssueDraft[] = [];

  validateRect("bounds", level.bounds, issues);
  validatePointInBounds("spawn", level.spawn, level.bounds, issues);
  validateRectInBounds("exit.area", level.exit.area, level.bounds, issues);
  validateUniqueLevelEntityIds(level, issues);
  validateCheckpoints(level, issues);
  validateTerrain(level, issues);
  validateHazards(level, issues);
  validateTraps(level, issues);
  validateItems(level, issues);
  validateInteractiveObjects(level, issues);
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
  });
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
