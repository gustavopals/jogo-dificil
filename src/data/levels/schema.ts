import type { LevelDefinition } from "../../shared";

export type {
  CheckpointDefinition,
  EnergyPowerKind,
  EnergyTargetDefinition,
  EnergyTargetId,
  EnergyTargetKind,
  ExitDefinition,
  HazardDefinition,
  InteractiveObjectAction,
  InteractiveObjectDefinition,
  ItemDefinition,
  LevelAssetsDefinition,
  LevelAudioDefinition,
  LevelDefinition,
  TerrainDefinition,
  TrapDefinition,
  TrapTriggerDefinition,
} from "../../shared";

export function defineLevel<const TLevel extends LevelDefinition>(
  level: TLevel,
): TLevel {
  return level;
}
