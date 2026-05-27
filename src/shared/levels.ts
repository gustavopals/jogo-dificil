import type { AudioDefinition } from "./audio";
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

export interface LevelAudioDefinition {
  readonly musicId?: string;
  readonly sounds: readonly AudioDefinition[];
}

export interface LevelAssetsDefinition {
  readonly sprites: readonly LevelAssetId[];
  readonly tilesets: readonly LevelAssetId[];
  readonly audio: readonly LevelAssetId[];
}

export interface LevelDefinition {
  readonly id: LevelId;
  readonly name: string;
  readonly order: number;
  readonly theme: string;
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
  readonly energyTargets?: readonly EnergyTargetDefinition[];
  readonly audio: LevelAudioDefinition;
  readonly difficulty: number;
  readonly mainChallenge: string;
  readonly progressReward: string;
  readonly assets: LevelAssetsDefinition;
}
