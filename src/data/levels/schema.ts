import type { LevelDefinition } from "../../shared";

export type {
  BossAttackDefinition,
  BossAttackId,
  BossAttackKind,
  BossDamageEffectKind,
  BossDamageRuleDefinition,
  BossDefinition,
  BossId,
  BossMovementDefinition,
  BossMovementKind,
  BossProjectileDefinition,
  BossStateKind,
  BossVulnerabilityWindowDefinition,
  BossVulnerabilityWindowId,
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
