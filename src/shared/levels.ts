import type { AudioDefinition } from "./audio";
import type { FacingDirection } from "./entities";
import type { RectLike, Vector2Like } from "./geometry";

export type LevelId = string;
export type CheckpointId = string;
export type ExitId = string;
export type TerrainId = string;
export type HazardId = string;
export type TrapId = string;
export type ItemId = string;
export type InteractiveObjectId = string;
export type EnergyTargetId = string;
export type BossId = string;
export type BossAttackId = string;
export type BossVulnerabilityWindowId = string;
export type LevelAssetId = string;

export type TerrainKind = "solid";
export type HazardKind = "spikes" | "fall" | "projectile" | "crusher";
export type TrapKind =
  | "false-block"
  | "falling-platform"
  | "spike-pop"
  | "projectile"
  | "breakable-floor";
export type TrapTriggerKind = "area" | "touch" | "interaction";
export type ItemKind = "required" | "optional" | "collectible" | "key";
export type InteractiveObjectKind = "door" | "button" | "lever" | "mechanism";
export type InteractiveObjectAction = "primary" | "secondary";
export type EnergyTargetKind =
  | "energy-switch"
  | "energy-cracked-block"
  | "energy-relay"
  | "energy-absorber"
  | "energy-core"
  | "boss-hurtbox";
export type EnergyPowerKind = "cyan-spark" | "cyan-burst";
export type TrapConfig = Readonly<Record<string, unknown>>;
export type BossStateKind =
  | "inactive"
  | "intro"
  | "patrol"
  | "windup"
  | "attack"
  | "recover"
  | "stunned"
  | "defeated";
export type BossMovementKind = "stationary" | "patrol" | "anchor-swap" | "walk";
export type BossAttackKind =
  | "smoke-puff"
  | "hose-snap"
  | "import-bottle"
  | "paper-wall"
  | "smoke-swap"
  | "floor-slam"
  | "boulder-toss"
  | "shoulder-charge";
export type BossDamageEffectKind =
  | "damage"
  | "block"
  | "cancel-projectile"
  | "activate-arena-target";

export interface CheckpointDefinition {
  readonly id: CheckpointId;
  readonly position: Vector2Like;
  readonly area: RectLike;
  readonly initialEnergy?: number;
}

export interface ExitDefinition {
  readonly id: ExitId;
  readonly area: RectLike;
  readonly nextLevelId?: LevelId;
}

export interface TerrainDefinition {
  readonly id: TerrainId;
  readonly kind: TerrainKind;
  readonly area: RectLike;
  readonly assetId?: LevelAssetId;
}

export interface HazardDefinition {
  readonly id: HazardId;
  readonly kind: HazardKind;
  readonly area: RectLike;
  readonly isInstantDeath: boolean;
}

export interface TrapTriggerDefinition {
  readonly kind: TrapTriggerKind;
  readonly area: RectLike;
}

export interface TrapDefinition {
  readonly id: TrapId;
  readonly kind: TrapKind;
  readonly trigger: TrapTriggerDefinition;
  readonly area?: RectLike;
  readonly resetOnRespawn: boolean;
  readonly config?: TrapConfig;
}

export interface ItemDefinition {
  readonly id: ItemId;
  readonly kind: ItemKind;
  readonly position: Vector2Like;
  readonly hitbox: RectLike;
  readonly persistsAfterDeath: boolean;
  readonly activatesObjectId?: InteractiveObjectId;
  readonly assetId?: LevelAssetId;
}

export interface HintDefinition {
  readonly id: string;
  /** Posição no mundo (legacy coords — migrado 2x no runtime). */
  readonly position: Vector2Like;
  /** Linha 1 = teclas (dourado), linha 2 = ação (claro). */
  readonly lines: readonly [string, string];
}

export interface InteractiveObjectDefinition {
  readonly id: InteractiveObjectId;
  readonly kind: InteractiveObjectKind;
  readonly area: RectLike;
  readonly startsActive: boolean;
  readonly resetOnRespawn: boolean;
  readonly action?: InteractiveObjectAction;
  readonly targetObjectId?: InteractiveObjectId;
}

export interface EnergyTargetDefinition {
  readonly id: EnergyTargetId;
  readonly kind: EnergyTargetKind;
  readonly area: RectLike;
  readonly acceptedPowers: readonly EnergyPowerKind[];
  readonly hitPoints: number;
  readonly resetOnRespawn: boolean;
  readonly startsActive?: boolean;
  readonly startsBroken?: boolean;
  readonly activatesObjectId?: InteractiveObjectId;
  readonly activationDurationMs?: number;
  readonly relayWindowMs?: number;
  readonly hitGroupId?: string;
  readonly blocksMovement?: boolean;
  readonly absorbsEnergy?: boolean;
}

export interface BossMovementDefinition {
  readonly kind: BossMovementKind;
  readonly speedPxPerSecond?: number;
  readonly anchors?: readonly Vector2Like[];
  readonly patrolArea?: RectLike;
}

export interface BossProjectileDefinition {
  readonly hitbox: RectLike;
  readonly velocity: Vector2Like;
  readonly maxActive: number;
  readonly maxRangePx?: number;
  readonly isDestructibleBy?: readonly EnergyPowerKind[];
}

export interface BossAttackDefinition {
  readonly id: BossAttackId;
  readonly kind: BossAttackKind;
  readonly windupMs: number;
  readonly activeMs: number;
  readonly recoverMs: number;
  readonly cooldownMs: number;
  readonly contactDamage: number;
  readonly tellArea?: RectLike;
  readonly hitbox?: RectLike;
  readonly projectile?: BossProjectileDefinition;
  readonly opensVulnerabilityWindowId?: BossVulnerabilityWindowId;
}

export interface BossDamageRuleDefinition {
  readonly power: EnergyPowerKind;
  readonly damage: number;
  readonly validStates: readonly BossStateKind[];
  readonly requiresWeakPoint: boolean;
  readonly oncePerAttack: boolean;
  readonly consumesHit: boolean;
  readonly effects: readonly BossDamageEffectKind[];
}

export interface BossVulnerabilityWindowDefinition {
  readonly id: BossVulnerabilityWindowId;
  readonly state: BossStateKind;
  readonly durationMs: number;
  readonly weakPointActive: boolean;
  readonly opensAfterAttackIds?: readonly BossAttackId[];
}

export interface BossDefinition {
  readonly id: BossId;
  readonly levelId: LevelId;
  readonly displayName: string;
  readonly arena: RectLike;
  readonly spawn: Vector2Like;
  readonly initialFacing: FacingDirection;
  readonly health: number;
  readonly hitbox: RectLike;
  readonly weakPoint: RectLike;
  readonly resetOnRespawn: boolean;
  readonly movement: BossMovementDefinition;
  readonly attacks: readonly BossAttackDefinition[];
  readonly damageRules: readonly BossDamageRuleDefinition[];
  readonly vulnerabilityWindows: readonly BossVulnerabilityWindowDefinition[];
  readonly entryCheckpointId: CheckpointId;
  readonly entryDoorId?: InteractiveObjectId;
  readonly defeatUnlocks: readonly InteractiveObjectId[];
  readonly assetId?: LevelAssetId;
}

export interface LevelAudioDefinition {
  readonly musicId?: string;
  readonly sounds: readonly AudioDefinition[];
}

export interface LevelAssetsDefinition {
  readonly sprites: readonly LevelAssetId[];
  readonly tilesets: readonly LevelAssetId[];
  readonly audio: readonly LevelAssetId[];
}

export type LevelContentKind = "campaign" | "challenge";

export interface LevelDefinition {
  readonly id: LevelId;
  readonly name: string;
  readonly order: number;
  readonly theme: string;
  readonly contentKind?: LevelContentKind;
  readonly initialEnergy?: number;
  readonly bounds: RectLike;
  readonly spawn: Vector2Like;
  readonly exit: ExitDefinition;
  readonly checkpoints: readonly CheckpointDefinition[];
  readonly terrain: readonly TerrainDefinition[];
  readonly hazards: readonly HazardDefinition[];
  readonly traps: readonly TrapDefinition[];
  readonly items: readonly ItemDefinition[];
  readonly interactiveObjects: readonly InteractiveObjectDefinition[];
  readonly hints?: readonly HintDefinition[];
  readonly energyTargets?: readonly EnergyTargetDefinition[];
  readonly bosses?: readonly BossDefinition[];
  readonly audio: LevelAudioDefinition;
  readonly difficulty: number;
  readonly mainChallenge: string;
  readonly progressReward: string;
  readonly assets: LevelAssetsDefinition;
}
