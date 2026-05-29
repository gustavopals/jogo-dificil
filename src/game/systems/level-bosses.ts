import type {
  BossAttackId,
  BossDefinition,
  BossId,
  BossStateKind,
  CheckpointDefinition,
  CheckpointId,
  EnergyPowerKind,
  LevelAssetId,
  RectLike,
} from "../../shared";
import { GAMEPLAY_SPRITE_KEYS } from "../../data/art";
import {
  BOSS_HD_VISUAL_PROFILES,
  BOSS_SPRITESHEET_KEYS,
  resolveBossAnimationFrameIndex,
  type BossAnimationState,
} from "../../data/characters/boss-spritesheet-registry";
import {
  applyBossRuntimeDamage,
  canSpawnBossProjectile,
  createBossProjectile,
  getBossProjectileHitbox,
  transitionBossRuntimeState,
  updateBossAttackCycle,
  updateBossProjectiles,
  type BossAttackCycleEvent,
  type BossProjectileRuntimeState,
  type BossRuntimeState,
} from "../physics";
import type { DeathCause } from "./game-events";
import {
  setInteractiveObjectActive,
  setRoomBossProjectiles,
  setRoomBossRuntimeState,
  spawnRoomBossProjectile,
  type RoomRuntimeState,
} from "./room-state";
import { VISUAL_READABILITY_SEMANTIC_COLORS } from "./visual-readability";

export type EnteredBossArena = {
  readonly boss: BossDefinition;
  readonly state: BossRuntimeState;
};

export type EnteredBossArenaCheckpoint = {
  readonly boss: BossDefinition;
  readonly checkpoint: CheckpointDefinition;
};

export type BossAttackRuntimeUpdate = {
  readonly state: RoomRuntimeState;
  readonly events: readonly BossAttackCycleEvent[];
};

export type BossThreatKind = "projectile" | "attack" | "body";

export type TouchedBossThreat = {
  readonly kind: BossThreatKind;
  readonly cause: DeathCause;
  readonly sourceId: string;
  readonly boss: BossDefinition;
  readonly state: BossRuntimeState;
};

export type BossEnergyHitInput = {
  readonly bossId: BossId;
  readonly power: EnergyPowerKind;
  readonly didHitWeakPoint: boolean;
  readonly sourceAttackId?: string;
};

export type BossEnergyHitResult = {
  readonly state: RoomRuntimeState;
  readonly didApplyDamage: boolean;
  readonly didDefeat: boolean;
  readonly didConsumeHit: boolean;
  readonly damage: number;
  readonly bossId?: BossId;
};

export type BossHealthIndicatorPip = {
  readonly area: RectLike;
  readonly isFilled: boolean;
  readonly fillColor: number;
  readonly alpha: number;
};

export type BossBodyHealthIndicator = {
  readonly visible: boolean;
  readonly frame: RectLike;
  readonly frameColor: number;
  readonly frameAlpha: number;
  readonly outlineColor: number;
  readonly outlineAlpha: number;
  readonly pips: readonly BossHealthIndicatorPip[];
};

export type BossWeakPointCrystalFeedback = {
  readonly visible: boolean;
  readonly isOpen: boolean;
  readonly area: RectLike;
  readonly fillColor: number;
  readonly fillAlpha: number;
  readonly strokeColor: number;
  readonly strokeAlpha: number;
  readonly pulseColor: number;
  readonly pulseAlpha: number;
};

export const BOSS_ENERGY_HIT_INVULNERABILITY_MS = 650;
export const BOSS_ENERGY_HIT_STUN_MS = 250;

const BOSS_HEALTH_INDICATOR_COLORS = {
  frame: VISUAL_READABILITY_SEMANTIC_COLORS.boss.frame,
  outline: VISUAL_READABILITY_SEMANTIC_COLORS.boss.outline,
  filled: VISUAL_READABILITY_SEMANTIC_COLORS.boss.healthFilled,
  empty: VISUAL_READABILITY_SEMANTIC_COLORS.boss.healthEmpty,
  invulnerable: VISUAL_READABILITY_SEMANTIC_COLORS.boss.primary,
} as const;

const BOSS_HEALTH_INDICATOR_LAYOUT = {
  bodyTopOffsetPx: 4,
  framePaddingPx: 2,
  maxPipWidthPx: 6,
  minPipWidthPx: 3,
  pipHeightPx: 3,
  pipGapPx: 2,
} as const;

const BOSS_WEAK_POINT_CRYSTAL_COLORS = {
  closedFill: VISUAL_READABILITY_SEMANTIC_COLORS.boss.healthEmpty,
  closedStroke: VISUAL_READABILITY_SEMANTIC_COLORS.boss.outline,
  openFill: VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary,
  openStroke: VISUAL_READABILITY_SEMANTIC_COLORS.energy.charged,
  pulse: VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary,
} as const;

export function findEnteredBossArenas(
  playerHitbox: RectLike,
  bosses: readonly BossDefinition[] | undefined = [],
  roomState: RoomRuntimeState,
): readonly EnteredBossArena[] {
  return (bosses ?? []).flatMap((boss) => {
    const state = roomState.bosses[boss.id];

    if (
      !state ||
      state.state !== "inactive" ||
      !rectsOverlap(playerHitbox, boss.arena)
    ) {
      return [];
    }

    return [
      {
        boss,
        state,
      },
    ];
  });
}

export function findBossEntryCheckpoint(
  boss: BossDefinition,
  checkpoints: readonly CheckpointDefinition[] = [],
): CheckpointDefinition | undefined {
  return checkpoints.find(
    (checkpoint) => checkpoint.id === boss.entryCheckpointId,
  );
}

export function findEnteredBossArenaCheckpoints(
  playerHitbox: RectLike,
  bosses: readonly BossDefinition[] | undefined = [],
  roomState: RoomRuntimeState,
  checkpoints: readonly CheckpointDefinition[] = [],
  activeCheckpointId?: CheckpointId,
): readonly EnteredBossArenaCheckpoint[] {
  return findEnteredBossArenas(playerHitbox, bosses, roomState).flatMap(
    ({ boss }) => {
      if (boss.entryCheckpointId === activeCheckpointId) {
        return [];
      }

      const checkpoint = findBossEntryCheckpoint(boss, checkpoints);

      if (!checkpoint) {
        return [];
      }

      return [
        {
          boss,
          checkpoint,
        },
      ];
    },
  );
}

export function lockBossArenaEntrance(
  state: RoomRuntimeState,
  boss: BossDefinition,
): RoomRuntimeState {
  const bossState = state.bosses[boss.id];

  if (!bossState || bossState.state !== "inactive") {
    return state;
  }

  const startedState = setRoomBossRuntimeState(
    state,
    transitionBossRuntimeState({
      state: bossState,
      nextState: "intro",
    }),
  );

  if (!boss.entryDoorId) {
    return startedState;
  }

  return setInteractiveObjectActive(startedState, boss.entryDoorId, false);
}

export function lockEnteredBossArenas(
  state: RoomRuntimeState,
  bosses: readonly BossDefinition[] | undefined = [],
  playerHitbox: RectLike,
): RoomRuntimeState {
  return findEnteredBossArenas(playerHitbox, bosses, state).reduce(
    (nextState, { boss }) => lockBossArenaEntrance(nextState, boss),
    state,
  );
}

export function updateBossAttackRuntime(
  state: RoomRuntimeState,
  bosses: readonly BossDefinition[] | undefined = [],
  deltaMs: number,
  bounds?: RectLike,
  solids: readonly RectLike[] = [],
): BossAttackRuntimeUpdate {
  const projectileUpdate = updateBossProjectiles({
    projectiles: state.bossProjectiles,
    deltaMs,
    bounds,
    solids,
    arenasByBossId: getBossProjectileArenas(bosses),
  });
  let nextState =
    projectileUpdate.projectiles === state.bossProjectiles
      ? state
      : setRoomBossProjectiles(state, projectileUpdate.projectiles);
  const events: BossAttackCycleEvent[] = [];

  (bosses ?? []).forEach((boss) => {
    const bossState = nextState.bosses[boss.id];

    if (!bossState) {
      return;
    }

    const result = updateBossAttackCycle({
      boss,
      state: bossState,
      deltaMs,
    });

    events.push(...result.events);
    nextState = setRoomBossRuntimeState(nextState, result.state);
    nextState = spawnBossProjectilesForStartedAttacks(
      nextState,
      boss,
      result.state,
      result.events,
    );
  });

  return {
    state: nextState,
    events,
  };
}

export function getBossAttackTellAreas(
  bosses: readonly BossDefinition[] | undefined = [],
  roomState: RoomRuntimeState,
): readonly RectLike[] {
  return (bosses ?? []).flatMap((boss) => {
    const state = roomState.bosses[boss.id];

    if (!state || state.state !== "windup" || !state.activeAttackId) {
      return [];
    }

    const attack = findBossAttack(boss, state.activeAttackId);

    return attack?.tellArea ? [attack.tellArea] : [];
  });
}

export function getBossActiveAttackHitboxes(
  bosses: readonly BossDefinition[] | undefined = [],
  roomState: RoomRuntimeState,
): readonly RectLike[] {
  return (bosses ?? []).flatMap((boss) => {
    const state = roomState.bosses[boss.id];

    if (!state || state.state !== "attack" || !state.activeAttackId) {
      return [];
    }

    const attack = findBossAttack(boss, state.activeAttackId);

    return attack?.hitbox ? [attack.hitbox] : [];
  });
}

export function getBossEnergyBlockingHitboxes(
  bosses: readonly BossDefinition[] | undefined = [],
  roomState: RoomRuntimeState,
): readonly RectLike[] {
  return (bosses ?? []).flatMap((boss) => {
    const state = roomState.bosses[boss.id];

    if (!state || state.state !== "attack" || !state.activeAttackId) {
      return [];
    }

    const attack = findBossAttack(boss, state.activeAttackId);

    return attack?.kind === "paper-wall" && attack.hitbox
      ? [attack.hitbox]
      : [];
  });
}

export function findTouchedBossThreat(
  playerHitbox: RectLike,
  bosses: readonly BossDefinition[] | undefined = [],
  roomState: RoomRuntimeState,
): TouchedBossThreat | undefined {
  return (
    findTouchedBossProjectileThreat(playerHitbox, bosses, roomState) ??
    findTouchedBossAttackThreat(playerHitbox, bosses, roomState) ??
    findTouchedBossBodyThreat(playerHitbox, bosses, roomState)
  );
}

export function applyBossEnergyHit(
  state: RoomRuntimeState,
  bosses: readonly BossDefinition[] | undefined = [],
  input: BossEnergyHitInput,
): BossEnergyHitResult {
  const boss = bosses.find((candidate) => candidate.id === input.bossId);
  const bossState = state.bosses[input.bossId];

  if (!boss || !bossState) {
    return createMissedBossEnergyHitResult(state);
  }

  const damageRule = boss.damageRules.find(
    (rule) =>
      rule.power === input.power &&
      rule.damage > 0 &&
      rule.effects.includes("damage") &&
      rule.validStates.includes(bossState.state) &&
      (!rule.requiresWeakPoint ||
        (input.didHitWeakPoint && isBossWeakPointOpen(boss, bossState))) &&
      canApplyOncePerAttackDamageRule(rule, bossState, input),
  );

  if (!damageRule) {
    return createMissedBossEnergyHitResult(state, boss.id);
  }

  const damageHitLockKey = createDamageHitLockKey(input);
  const damageResult = applyBossRuntimeDamage({
    state: bossState,
    damage: damageRule.damage,
    invulnerabilityMs: BOSS_ENERGY_HIT_INVULNERABILITY_MS,
    stunMs: BOSS_ENERGY_HIT_STUN_MS,
    ...(damageRule.oncePerAttack && damageHitLockKey
      ? { damageHitLockKey }
      : {}),
  });

  return {
    state: damageResult.didApplyDamage
      ? setRoomBossRuntimeState(state, damageResult.state)
      : state,
    didApplyDamage: damageResult.didApplyDamage,
    didDefeat: damageResult.didDefeat,
    didConsumeHit: damageRule.consumesHit,
    damage: damageResult.didApplyDamage ? damageRule.damage : 0,
    bossId: boss.id,
  };
}

export function unlockBossDefeatObjects(
  state: RoomRuntimeState,
  boss: BossDefinition,
): RoomRuntimeState {
  const bossState = state.bosses[boss.id];

  if (!bossState || isBossAlive(bossState)) {
    return state;
  }

  const lockedObjectIds = boss.defeatUnlocks.filter(
    (objectId) => state.interactiveObjects[objectId]?.isActive === false,
  );

  if (lockedObjectIds.length === 0) {
    return state;
  }

  return lockedObjectIds.reduce(
    (nextState, objectId) =>
      setInteractiveObjectActive(nextState, objectId, true),
    state,
  );
}

export function unlockDefeatedBossObjects(
  state: RoomRuntimeState,
  bosses: readonly BossDefinition[] | undefined = [],
): RoomRuntimeState {
  return (bosses ?? []).reduce(
    (nextState, boss) => unlockBossDefeatObjects(nextState, boss),
    state,
  );
}

export function isBossDefeated(state: BossRuntimeState): boolean {
  return state.state === "defeated" || state.healthRemaining <= 0;
}

export function isBossAlive(state: BossRuntimeState): boolean {
  return !isBossDefeated(state);
}

export function isLevelExitBlockedByLivingBosses(
  bosses: readonly BossDefinition[] | undefined = [],
  roomState: RoomRuntimeState,
): boolean {
  return (bosses ?? []).some((boss) => {
    const state = roomState.bosses[boss.id];

    return !state || isBossAlive(state);
  });
}

export function getBossTextureKey(boss: BossDefinition): LevelAssetId {
  if (boss.assetId) {
    return boss.assetId;
  }

  const hdProfile = getBossHdVisualProfile(boss);
  if (hdProfile) {
    return hdProfile.textureKey;
  }

  if (boss.id.includes("dr-imports")) {
    return GAMEPLAY_SPRITE_KEYS.BOSS_DR_IMPORTS;
  }

  if (boss.id.includes("giga-fabio")) {
    return GAMEPLAY_SPRITE_KEYS.BOSS_GIGA_FABIO;
  }

  return BOSS_SPRITESHEET_KEYS.HIROLITO_512;
}

export function getBossVisualDisplaySize(
  boss: BossDefinition,
): Readonly<Pick<RectLike, "width" | "height">> {
  const hdProfile = getBossHdVisualProfile(boss);

  return hdProfile?.displaySize ?? boss.hitbox;
}

export function getBossVisualBottomOffsetY(boss: BossDefinition): number {
  const hdProfile = getBossHdVisualProfile(boss);

  return hdProfile?.bottomOffsetY ?? 0;
}

export function getBossFrameByState(
  boss: Pick<BossDefinition, "id">,
  state: BossStateKind,
  stateElapsedMs = 0,
): number {
  return resolveBossAnimationFrameIndex(
    boss.id,
    state as BossAnimationState,
    stateElapsedMs,
  );
}

export function getBossProjectileTextureKey(
  projectile: Pick<BossProjectileRuntimeState, "bossId" | "attackId">,
  bosses: readonly BossDefinition[] | undefined = [],
): LevelAssetId {
  const boss = bosses.find((candidate) => candidate.id === projectile.bossId);
  const attack = boss?.attacks.find(
    (candidate) => candidate.id === projectile.attackId,
  );

  switch (attack?.kind) {
    case "import-bottle":
      return GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_IMPORT_BOTTLE;
    case "boulder-toss":
      return GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_BOULDER;
    case "smoke-puff":
    default:
      return GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_SMOKE_PUFF;
  }
}

export function getBossBodyHealthIndicator(
  boss: BossDefinition,
  state: BossRuntimeState,
): BossBodyHealthIndicator {
  const hitbox = getBossRuntimeHitbox(boss, state);
  const health = Math.max(1, state.health);
  const healthRemaining = Math.max(0, Math.min(state.healthRemaining, health));
  const pipSize = getBossHealthPipSize(hitbox, health);
  const totalPipWidth =
    health * pipSize.width +
    Math.max(0, health - 1) * BOSS_HEALTH_INDICATOR_LAYOUT.pipGapPx;
  const startX = Math.round(hitbox.x + (hitbox.width - totalPipWidth) / 2);
  const y = hitbox.y + BOSS_HEALTH_INDICATOR_LAYOUT.bodyTopOffsetPx;
  const frame = {
    x: startX - BOSS_HEALTH_INDICATOR_LAYOUT.framePaddingPx,
    y: y - BOSS_HEALTH_INDICATOR_LAYOUT.framePaddingPx,
    width: totalPipWidth + BOSS_HEALTH_INDICATOR_LAYOUT.framePaddingPx * 2,
    height: pipSize.height + BOSS_HEALTH_INDICATOR_LAYOUT.framePaddingPx * 2,
  };
  const pips = Array.from({ length: health }, (_, index) => {
    const isFilled = index < healthRemaining;

    return {
      area: {
        x:
          startX +
          index * (pipSize.width + BOSS_HEALTH_INDICATOR_LAYOUT.pipGapPx),
        y,
        width: pipSize.width,
        height: pipSize.height,
      },
      isFilled,
      fillColor: isFilled
        ? getBossFilledHealthPipColor(state)
        : BOSS_HEALTH_INDICATOR_COLORS.empty,
      alpha: isFilled ? 0.92 : 0.58,
    };
  });

  return {
    visible: state.state !== "inactive" && state.state !== "defeated",
    frame,
    frameColor: BOSS_HEALTH_INDICATOR_COLORS.frame,
    frameAlpha: 0.72,
    outlineColor: BOSS_HEALTH_INDICATOR_COLORS.outline,
    outlineAlpha: 0.42,
    pips,
  };
}

export function getBossWeakPointCrystalFeedback(
  boss: BossDefinition,
  state: BossRuntimeState,
): BossWeakPointCrystalFeedback {
  const isOpen = isBossWeakPointOpen(boss, state);
  const visible = state.state !== "inactive" && !isBossDefeated(state);

  return {
    visible,
    isOpen,
    area: getBossRuntimeWeakPoint(boss, state),
    fillColor: isOpen
      ? BOSS_WEAK_POINT_CRYSTAL_COLORS.openFill
      : BOSS_WEAK_POINT_CRYSTAL_COLORS.closedFill,
    fillAlpha: isOpen ? 0.86 : 0.34,
    strokeColor: isOpen
      ? BOSS_WEAK_POINT_CRYSTAL_COLORS.openStroke
      : BOSS_WEAK_POINT_CRYSTAL_COLORS.closedStroke,
    strokeAlpha: isOpen ? 0.92 : 0.38,
    pulseColor: BOSS_WEAK_POINT_CRYSTAL_COLORS.pulse,
    pulseAlpha: isOpen ? 0.28 : 0,
  };
}

export function getBossRuntimeHitbox(
  boss: BossDefinition,
  state: BossRuntimeState,
): RectLike {
  return translateRectByBossPosition(boss.hitbox, boss, state);
}

export function getBossRuntimeWeakPoint(
  boss: BossDefinition,
  state: BossRuntimeState,
): RectLike {
  return translateRectByBossPosition(boss.weakPoint, boss, state);
}

function spawnBossProjectilesForStartedAttacks(
  state: RoomRuntimeState,
  boss: BossDefinition,
  bossState: BossRuntimeState,
  events: readonly BossAttackCycleEvent[],
): RoomRuntimeState {
  return events.reduce((nextState, event) => {
    if (event.kind !== "attack-started" || !event.attackId) {
      return nextState;
    }

    const attack = findBossAttack(boss, event.attackId);

    if (
      !attack ||
      !canSpawnBossProjectile(nextState.bossProjectiles, bossState, attack)
    ) {
      return nextState;
    }

    const projectile = createBossProjectile({
      id: createBossProjectileId(
        boss.id,
        attack.id,
        nextState.bossProjectiles.length,
      ),
      boss: bossState,
      attack,
    });

    if (!projectile) {
      return nextState;
    }

    return spawnRoomBossProjectile(nextState, projectile);
  }, state);
}

function findTouchedBossProjectileThreat(
  playerHitbox: RectLike,
  bosses: readonly BossDefinition[] | undefined,
  roomState: RoomRuntimeState,
): TouchedBossThreat | undefined {
  for (const projectile of roomState.bossProjectiles) {
    if (!rectsOverlap(playerHitbox, getBossProjectileHitbox(projectile))) {
      continue;
    }

    const boss = (bosses ?? []).find(
      (candidate) => candidate.id === projectile.bossId,
    );
    const state = roomState.bosses[projectile.bossId];

    if (!boss || !state || !isBossAlive(state)) {
      continue;
    }

    return {
      kind: "projectile",
      cause: "projectile",
      sourceId: projectile.id,
      boss,
      state,
    };
  }

  return undefined;
}

function findTouchedBossAttackThreat(
  playerHitbox: RectLike,
  bosses: readonly BossDefinition[] | undefined,
  roomState: RoomRuntimeState,
): TouchedBossThreat | undefined {
  for (const boss of bosses ?? []) {
    const state = roomState.bosses[boss.id];

    if (
      !state ||
      !isBossActiveThreat(state) ||
      state.state !== "attack" ||
      !state.activeAttackId
    ) {
      continue;
    }

    const attack = findBossAttack(boss, state.activeAttackId);

    if (
      !attack?.hitbox ||
      attack.contactDamage <= 0 ||
      !rectsOverlap(playerHitbox, attack.hitbox)
    ) {
      continue;
    }

    return {
      kind: "attack",
      cause: "boss",
      sourceId: `${boss.id}:${attack.id}`,
      boss,
      state,
    };
  }

  return undefined;
}

function findTouchedBossBodyThreat(
  playerHitbox: RectLike,
  bosses: readonly BossDefinition[] | undefined,
  roomState: RoomRuntimeState,
): TouchedBossThreat | undefined {
  for (const boss of bosses ?? []) {
    const state = roomState.bosses[boss.id];

    if (
      !state ||
      !isBossActiveThreat(state) ||
      !rectsOverlap(playerHitbox, getBossRuntimeHitbox(boss, state))
    ) {
      continue;
    }

    return {
      kind: "body",
      cause: "boss",
      sourceId: boss.id,
      boss,
      state,
    };
  }

  return undefined;
}

function translateRectByBossPosition(
  rect: RectLike,
  boss: BossDefinition,
  state: BossRuntimeState,
): RectLike {
  const deltaX = state.position.x - boss.spawn.x;
  const deltaY = state.position.y - boss.spawn.y;

  if (deltaX === 0 && deltaY === 0) {
    return rect;
  }

  return {
    x: rect.x + deltaX,
    y: rect.y + deltaY,
    width: rect.width,
    height: rect.height,
  };
}

function findBossAttack(
  boss: BossDefinition,
  attackId: BossAttackId,
): BossDefinition["attacks"][number] | undefined {
  return boss.attacks.find((attack) => attack.id === attackId);
}

function createBossProjectileId(
  bossId: BossDefinition["id"],
  attackId: BossAttackId,
  sequence: number,
): string {
  return `${bossId}-${attackId}-${sequence}`;
}

function getBossFilledHealthPipColor(state: BossRuntimeState): number {
  return state.invulnerabilityRemainingMs > 0
    ? BOSS_HEALTH_INDICATOR_COLORS.invulnerable
    : BOSS_HEALTH_INDICATOR_COLORS.filled;
}

function getBossHealthPipSize(
  body: Pick<RectLike, "width">,
  health: number,
): Pick<RectLike, "width" | "height"> {
  const totalGap =
    Math.max(0, health - 1) * BOSS_HEALTH_INDICATOR_LAYOUT.pipGapPx;
  const availableWidth = Math.max(
    BOSS_HEALTH_INDICATOR_LAYOUT.minPipWidthPx,
    body.width - BOSS_HEALTH_INDICATOR_LAYOUT.framePaddingPx * 2 - totalGap,
  );
  const width = Math.max(
    BOSS_HEALTH_INDICATOR_LAYOUT.minPipWidthPx,
    Math.min(
      BOSS_HEALTH_INDICATOR_LAYOUT.maxPipWidthPx,
      Math.floor(availableWidth / health),
    ),
  );

  return {
    width,
    height: BOSS_HEALTH_INDICATOR_LAYOUT.pipHeightPx,
  };
}

function getBossProjectileArenas(
  bosses: readonly BossDefinition[] | undefined,
): Partial<Record<BossId, RectLike>> {
  return (bosses ?? []).reduce<Partial<Record<BossId, RectLike>>>(
    (arenasByBossId, boss) => ({
      ...arenasByBossId,
      [boss.id]: boss.arena,
    }),
    {},
  );
}

function isBossActiveThreat(state: BossRuntimeState): boolean {
  return state.state !== "inactive" && isBossAlive(state);
}

function createMissedBossEnergyHitResult(
  state: RoomRuntimeState,
  bossId?: BossId,
): BossEnergyHitResult {
  return {
    state,
    didApplyDamage: false,
    didDefeat: false,
    didConsumeHit: false,
    damage: 0,
    ...(bossId ? { bossId } : {}),
  };
}

function canApplyOncePerAttackDamageRule(
  rule: BossDefinition["damageRules"][number],
  state: BossRuntimeState,
  input: BossEnergyHitInput,
): boolean {
  if (!rule.oncePerAttack) {
    return true;
  }

  const damageHitLockKey = createDamageHitLockKey(input);

  return (
    damageHitLockKey !== undefined &&
    !state.damageHitLockKeys.includes(damageHitLockKey)
  );
}

function createDamageHitLockKey(
  input: Pick<BossEnergyHitInput, "power" | "sourceAttackId">,
): string | undefined {
  if (!input.sourceAttackId) {
    return undefined;
  }

  return `${input.power}:${input.sourceAttackId}`;
}

function isBossWeakPointOpen(
  boss: BossDefinition,
  state: BossRuntimeState,
): boolean {
  if (!state.activeVulnerabilityWindowId) {
    return false;
  }

  const vulnerabilityWindow = boss.vulnerabilityWindows.find(
    (window) => window.id === state.activeVulnerabilityWindowId,
  );

  return (
    vulnerabilityWindow?.state === state.state &&
    vulnerabilityWindow.weakPointActive
  );
}

function getBossHdVisualProfile(
  boss: Pick<BossDefinition, "id">,
): (typeof BOSS_HD_VISUAL_PROFILES)[keyof typeof BOSS_HD_VISUAL_PROFILES] | undefined {
  if (boss.id.includes("dr-imports")) {
    return BOSS_HD_VISUAL_PROFILES.DR_IMPORTS;
  }

  if (boss.id.includes("giga-fabio")) {
    return BOSS_HD_VISUAL_PROFILES.GIGA_FABIO;
  }

  if (boss.id.includes("hirolito")) {
    return BOSS_HD_VISUAL_PROFILES.HIROLITO_NARGUILITO;
  }

  if (boss.id.includes("boss-schema-test")) {
    return {
      textureKey: BOSS_SPRITESHEET_KEYS.HIROLITO_512,
      displaySize: BOSS_HD_VISUAL_PROFILES.HIROLITO_NARGUILITO.displaySize,
      bottomOffsetY: 0,
    };
  }

  return undefined;
}

function rectsOverlap(a: RectLike, b: RectLike): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
