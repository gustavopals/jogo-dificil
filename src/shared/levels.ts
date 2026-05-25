import type { AudioDefinition } from "./audio";
import type { RectLike, Vector2Like } from "./geometry";

export type LevelId = string;
export type CheckpointId = string;
export type TerrainId = string;
export type HazardId = string;
export type TrapId = string;
export type ItemId = string;
export type InteractiveObjectId = string;

export type TerrainKind = "solid" | "one-way";
export type HazardKind = "spikes" | "fall" | "projectile" | "crusher";
export type TrapTriggerKind = "area" | "touch" | "interaction";
export type ItemKind = "required" | "optional" | "collectible" | "key";
export type InteractiveObjectKind = "door" | "button" | "lever" | "mechanism";

export type CheckpointDefinition = {
  readonly id: CheckpointId;
  readonly position: Vector2Like;
  readonly area: RectLike;
};

export type ExitDefinition = {
  readonly id: string;
  readonly area: RectLike;
  readonly nextLevelId?: LevelId;
};

export type TerrainDefinition = {
  readonly id: TerrainId;
  readonly kind: TerrainKind;
  readonly area: RectLike;
  readonly assetId?: string;
};

export type HazardDefinition = {
  readonly id: HazardId;
  readonly kind: HazardKind;
  readonly area: RectLike;
  readonly isInstantDeath: boolean;
};

export type TrapTriggerDefinition = {
  readonly kind: TrapTriggerKind;
  readonly area: RectLike;
};

export type TrapDefinition = {
  readonly id: TrapId;
  readonly kind: string;
  readonly trigger: TrapTriggerDefinition;
  readonly area?: RectLike;
  readonly resetOnRespawn: boolean;
  readonly config?: Record<string, unknown>;
};

export type ItemDefinition = {
  readonly id: ItemId;
  readonly kind: ItemKind;
  readonly position: Vector2Like;
  readonly hitbox: RectLike;
  readonly persistsAfterDeath: boolean;
  readonly assetId?: string;
};

export type InteractiveObjectDefinition = {
  readonly id: InteractiveObjectId;
  readonly kind: InteractiveObjectKind;
  readonly area: RectLike;
  readonly startsActive: boolean;
  readonly resetOnRespawn: boolean;
};

export type LevelAudioDefinition = {
  readonly musicId?: string;
  readonly sounds: readonly AudioDefinition[];
};

export type LevelAssetsDefinition = {
  readonly sprites: readonly string[];
  readonly tilesets: readonly string[];
  readonly audio: readonly string[];
};

export type LevelDefinition = {
  readonly id: LevelId;
  readonly name: string;
  readonly order: number;
  readonly theme: string;
  readonly bounds: RectLike;
  readonly spawn: Vector2Like;
  readonly exit: ExitDefinition;
  readonly checkpoints: readonly CheckpointDefinition[];
  readonly terrain: readonly TerrainDefinition[];
  readonly hazards: readonly HazardDefinition[];
  readonly traps: readonly TrapDefinition[];
  readonly items: readonly ItemDefinition[];
  readonly interactiveObjects: readonly InteractiveObjectDefinition[];
  readonly audio: LevelAudioDefinition;
  readonly difficulty: number;
  readonly mainChallenge: string;
  readonly progressReward: string;
  readonly assets: LevelAssetsDefinition;
};
