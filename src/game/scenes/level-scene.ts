import Phaser from "phaser";

import {
  getRequiredLevelDefinition,
  type LevelDefinition,
} from "../../data/levels";
import {
  PINO_POWER_ANIMATION_MODES,
  type PinoPowerAnimationMode,
} from "../../data/characters/pino-animations";
import { PLACEHOLDER_TILESET_ASSET_KEYS } from "../../data/art";
import { PLAYER_ENERGY_MAX } from "../../shared";
import type {
  BossDefinition,
  BossId,
  CheckpointId,
  EnergyPowerKind,
  EnergyTargetId,
  FacingDirection,
  InteractiveObjectId,
  ItemId,
  RectLike,
  TrapId,
  Vector2Like,
} from "../../shared";
import { MUSIC_AUDIO_IDS, PLAYER_AUDIO_IDS } from "../../data/audio";
import { PLAYER_SIZE, TILE_SIZE_PX } from "../constants";
import { ASSET_KEYS } from "../assets";
import { Player } from "../entities";
import {
  ActionInput,
  createInitialSecondaryActionIntentState,
  resolveSecondaryActionIntent,
  type SecondaryActionIntentState,
} from "../input";
import {
  calculateDashMovement,
  calculateHorizontalVelocity,
  calculateJumpMovement,
  canPrepareCyanBurst,
  canSpawnCyanSparkProjectile,
  canUseCyanSpark,
  clearPlayerEnergyTemporaryState,
  createCyanSparkProjectile,
  createInitialDashMovementState,
  createInitialJumpMovementState,
  createInitialPlayerEnergyState,
  getCyanSparkProjectileHitbox,
  getBossProjectileHitbox,
  getHorizontalDirection,
  getPlayerEnergyMovementConstraint,
  getWorldHitbox,
  resetDashMovementState,
  resetPlayerEnergyState,
  resolveCyanBurstFacingLock,
  resolveCyanBurstBeam,
  resolveKinematicCollisions,
  updateCyanSparkProjectiles,
  updatePlayerEnergy,
  type DashDirection,
  type DashMovementState,
  type JumpMovementState,
  type KinematicBodyCollisionConfig,
  type CyanBurstBeamImpact,
  type CyanSparkProjectileImpact,
  type CyanSparkProjectileState,
  type PlayerEnergyState,
} from "../physics";
import { gameStateStore } from "../systems/game-state";
import type {
  DevQaDeathSnapshot,
  DevQaEnergyStateSnapshot,
  DevQaLevelSnapshot,
} from "../systems/dev-qa-tools";
import {
  createLevelCompletionAttemptFromRunCounters,
  recordLevelCompletion,
  type LevelCompletionResult,
} from "../systems/level-results";
import {
  emitGameEvent,
  GAME_EVENTS,
  type DeathCause,
} from "../systems/game-events";
import {
  findTouchedDeadlyHazard,
  getHazardPlaceholderColor,
  getHazardPlaceholderTextureKey,
} from "../systems/level-hazards";
import {
  activateInteractiveObject,
  findTriggeredInteractiveObjects,
  getInteractiveObjectFeedback,
  getInteractiveObjectSolidAreas,
} from "../systems/level-interactive-objects";
import {
  getItemCollectionAudioId,
  getTrapActivationAudioId,
} from "../systems/level-audio-feedback";
import {
  getBossAttackCycleAudioIds,
  getBossDamageAudioId,
  getBossEntryAudioId,
} from "../systems/boss-audio-feedback";
import {
  applyBossEnergyHit,
  findBossEntryCheckpoint,
  findEnteredBossArenas,
  getBossActiveAttackHitboxes,
  getBossAttackTellAreas,
  getBossBodyHealthIndicator,
  getBossEnergyBlockingHitboxes,
  getBossProjectileTextureKey,
  getBossRuntimeHitbox,
  getBossTextureKey,
  getBossWeakPointCrystalFeedback,
  findTouchedBossThreat,
  isLevelExitBlockedByLivingBosses,
  lockBossArenaEntrance,
  updateBossAttackRuntime as updateBossAttackRuntimeState,
  unlockDefeatedBossObjects,
} from "../systems/level-bosses";
import {
  getCyanBurstImpactAudioCues,
  getCyanSparkImpactAudioCues,
  getPlayerEnergyAudioCues,
  getPlayerEnergyRejectionAudioCues,
  getStopPlayerEnergyAudioCues,
  type EnergyAudioCue,
} from "../systems/player-energy-audio-feedback";
import {
  collectLevelItem,
  findTouchedAvailableItems,
  getItemFeedback,
  getItemTextureKey,
} from "../systems/level-items";
import {
  getCyanBurstBeamCollisionTargets,
  getCyanSparkCollisionTargets,
  getEnergyTargetFeedback,
  getEnergyTargetSolidAreas,
  getLevelEnergyTargets,
} from "../systems/level-energy-targets";
import {
  getCheckpointTextureKey,
  getExitTextureKey,
} from "../systems/level-markers";
import {
  createActiveCheckpointFromDefinition,
  createLevelStartCheckpoint,
  findTouchedCheckpoint,
  isTouchingExit,
} from "../systems/level-progress";
import { isBelowLevelDeathPlane } from "../systems/player-death";
import {
  AUTO_RESPAWN_DELAY_MS,
  RESPAWN_RECOVERY_MS,
} from "../systems/player-respawn";
import {
  PLAYER_DASH_TRAIL_INTERVAL_MS,
  PLAYER_EFFECT_DEPTHS,
  PLAYER_RUN_SPARK_INTERVAL_MS,
  PLAYER_RUN_SPARK_SPEED_THRESHOLD,
  createCyanBurstPreparationParticles,
  createJumpBurstParticles,
  createInsufficientEnergyParticles,
  createLandingBurstParticles,
  createRunSparkParticle,
  getDashGhostOffset,
  getPlayerAuraConfig,
  resolvePlayerEnergyMode,
  shouldEmitTimedEffect,
} from "../systems/player-visual-effects";
import {
  VISUAL_READABILITY_DEPTHS,
  VISUAL_READABILITY_SEMANTIC_COLORS,
  clampWideEffectAlpha,
} from "../systems/visual-readability";
import {
  getPlayerActionAudioId,
  shouldPlayLandingAudio,
} from "../systems/player-audio-feedback";
import {
  getSolidTerrainAreas,
  getTerrainPlaceholderTextureKey,
} from "../systems/level-terrain";
import {
  findTriggeredPositionTraps,
  getProjectileTextureKey,
  getProjectileTrailFeedback,
  getTrapBodyTextureKey,
  getTrapFeedback,
} from "../systems/level-traps";
import {
  activateMvpTrap,
  findTouchedTrapThreat,
  getProjectileHitbox,
  removeDisabledTrapSolids,
  updateTrapProjectiles,
} from "../systems/mvp-traps";
import {
  absorbEnergyTarget,
  activateEnergyCore,
  activateEnergyRelay,
  activateEnergySwitch,
  createInitialRoomState,
  damageEnergyTarget,
  resetRoomStateForRespawn,
  updateRoomEnergyTargets,
  type RoomRuntimeState,
} from "../systems/room-state";
import { SCENE_KEYS } from "./scene-keys";

const CAMERA_DEADZONE_SIZE = {
  width: TILE_SIZE_PX * 8,
  height: TILE_SIZE_PX * 5,
} as const;
const MARKER_COLORS = {
  spawn: VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary,
} as const;
const CYAN_SPARK_PLAYER_ANIMATION_DURATION_MS = 140;

const PLAYER_COLLISION_BODY = {
  visualWidth: PLAYER_SIZE.visualWidth,
  visualHeight: PLAYER_SIZE.visualHeight,
  pivot: PLAYER_SIZE.pivot,
  hitbox: {
    x: PLAYER_SIZE.spriteMargin.left,
    y: PLAYER_SIZE.spriteMargin.top,
    width: PLAYER_SIZE.hitboxWidth,
    height: PLAYER_SIZE.hitboxHeight,
  },
} as const satisfies KinematicBodyCollisionConfig;

type TrapMarker = {
  readonly trigger: Phaser.GameObjects.Rectangle;
  readonly body?: Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite;
  readonly tell?: Phaser.GameObjects.Rectangle;
  readonly crack?: Phaser.GameObjects.Graphics;
};

type EnergyTargetMarker = {
  readonly base: Phaser.GameObjects.Rectangle;
  readonly active: Phaser.GameObjects.TileSprite;
  readonly broken: Phaser.GameObjects.TileSprite;
};

type BossMarker = {
  readonly sprite: Phaser.GameObjects.Image;
  readonly health: Phaser.GameObjects.Graphics;
  readonly weakPoint: Phaser.GameObjects.Graphics;
};

type PlayerDeathContext = {
  readonly cause: DeathCause;
  readonly sourceId?: string;
};

export class LevelScene extends Phaser.Scene {
  private player?: Player;
  private actionInput?: ActionInput;
  private jumpState: JumpMovementState = createInitialJumpMovementState();
  private dashState: DashMovementState = createInitialDashMovementState();
  private playerEnergyState: PlayerEnergyState =
    createInitialPlayerEnergyState();
  private secondaryActionIntentState: SecondaryActionIntentState =
    createInitialSecondaryActionIntentState();
  private cyanBurstLockedFacing?: FacingDirection;
  private level?: LevelDefinition;
  private roomState?: RoomRuntimeState;
  private solids: readonly RectLike[] = [];
  private readonly checkpointMarkers = new Map<
    CheckpointId,
    Phaser.GameObjects.TileSprite
  >();
  private readonly trapMarkers = new Map<TrapId, TrapMarker>();
  private readonly itemMarkers = new Map<ItemId, Phaser.GameObjects.Image>();
  private readonly interactiveObjectMarkers = new Map<
    InteractiveObjectId,
    Phaser.GameObjects.Rectangle
  >();
  private readonly energyTargetMarkers = new Map<
    EnergyTargetId,
    EnergyTargetMarker
  >();
  private readonly bossMarkers = new Map<BossId, BossMarker>();
  private readonly bossTellMarkers: Phaser.GameObjects.Rectangle[] = [];
  private readonly bossAttackMarkers: Phaser.GameObjects.Rectangle[] = [];
  private readonly bossProjectileMarkers = new Map<
    string,
    Phaser.GameObjects.Image
  >();
  private readonly projectileMarkers = new Map<
    string,
    Phaser.GameObjects.Image
  >();
  private readonly projectileTrailMarkers = new Map<
    string,
    Phaser.GameObjects.Rectangle
  >();
  private readonly cyanSparkProjectileMarkers = new Map<
    string,
    Phaser.GameObjects.Image
  >();
  private readonly cyanBurstHitBossIds = new Set<string>();
  private cyanBurstActiveAttackId?: string;
  private cyanBurstBeamMarker?: Phaser.GameObjects.TileSprite;
  private cyanSparkProjectiles: readonly CyanSparkProjectileState[] = [];
  private cyanSparkProjectileSequence = 0;
  private cyanBurstAttackSequence = 0;
  private cyanSparkAnimationRemainingMs = 0;
  private respawnTimer?: Phaser.Time.TimerEvent;
  private respawnRecoveryTimer?: Phaser.Time.TimerEvent;
  private hasCompletedLevel = false;
  private levelStartedAtMs = 0;
  private levelStartDeathCount = 0;
  private playerAura?: Phaser.GameObjects.Ellipse;
  private lastDashTrailAtMs = 0;
  private lastRunSparkAtMs = 0;

  public constructor() {
    super(SCENE_KEYS.LEVEL);
  }

  public create(): void {
    this.scene.launch(SCENE_KEYS.HUD);
    gameStateStore.setPaused(false);
    Player.registerAnimations(this);
    this.actionInput = new ActionInput(this);
    this.jumpState = createInitialJumpMovementState();
    this.dashState = createInitialDashMovementState();
    this.secondaryActionIntentState = createInitialSecondaryActionIntentState();

    const snapshot = gameStateStore.getSnapshot();
    const { activeCheckpoint, currentLevelId } = snapshot;
    this.level = getRequiredLevelDefinition(currentLevelId);
    const startCheckpoint =
      activeCheckpoint.levelId === this.level.id
        ? activeCheckpoint
        : createLevelStartCheckpoint(this.level);
    this.resetPlayerEnergyForCheckpoint(startCheckpoint.initialEnergy);
    this.roomState = createInitialRoomState(this.level);
    this.refreshRoomSolids();
    this.hasCompletedLevel = false;
    this.levelStartedAtMs = this.time.now;
    this.levelStartDeathCount = snapshot.deathCount;
    this.playGameplayMusic();

    this.drawLevelBackground(this.level);
    this.drawTerrain(this.level);
    this.drawHazards(this.level);
    this.drawTraps(this.level, this.roomState);
    this.drawItems(this.level, this.roomState);
    this.drawInteractiveObjects(this.level, this.roomState);
    this.drawEnergyTargets(this.level, this.roomState);
    this.drawBosses(this.level, this.roomState);
    this.drawLevelMarkers(this.level, activeCheckpoint.id);

    this.player = new Player(this, {
      id: "player-pino",
      position: startCheckpoint,
      facing: "right",
    });
    this.player.getSprite().setDepth(PLAYER_EFFECT_DEPTHS.sprite);
    this.playerAura = this.add
      .ellipse(0, 0, 1, 1, VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary, 0)
      .setDepth(PLAYER_EFFECT_DEPTHS.aura);
    this.updatePlayerEnergyAura(false);
    this.configureCamera();

    this.input.keyboard?.on("keydown-ESC", this.pauseLevel, this);
    this.input.keyboard?.on("keydown-M", this.toggleMute, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  public override update(_time: number, delta: number): void {
    if (this.actionInput?.wasPressed("restart")) {
      this.restartAtCheckpoint();
      return;
    }

    if (gameStateStore.getSnapshot().playerLifeState === "dead") {
      return;
    }

    this.updateCyanSparkProjectileRuntime(delta);
    this.updateTrapRuntime(delta);
    this.updatePinoPowerAnimationTimers(delta);
    this.updatePlayerMovement(delta);
    if (this.updatePlayerDeath()) {
      return;
    }

    this.updateBossArenaLocks();
    this.updateBossAttackRuntime(delta);
    this.updateBossDefeatUnlocks();
    this.syncBossMarkers();
    this.updateTrapTriggers();
    if (this.updatePlayerDeath()) {
      return;
    }

    this.updateItemCollection();
    this.updatePlayerEnergyRuntime(delta);
    this.updateInteractiveObjectActions(delta);
    this.updateLevelProgress();
  }

  public getDevQaLevelSnapshot(
    lastDeath: DevQaDeathSnapshot | null,
  ): DevQaLevelSnapshot | null {
    if (!this.level) {
      return null;
    }

    const snapshot = gameStateStore.getSnapshot();
    const physicsState = this.player?.getPhysicsState();
    const visualState = this.player?.getVisualState();

    return {
      levelId: this.level.id,
      levelName: this.level.name,
      checkpointId: snapshot.activeCheckpoint.id,
      deathCount: snapshot.deathCount,
      hasCompletedLevel: this.hasCompletedLevel,
      lastDeath,
      player:
        physicsState && visualState
          ? {
              position: physicsState.position,
              velocity: physicsState.velocity,
              isGrounded: physicsState.isGrounded,
              isAlive: visualState.isAlive,
              animationState: visualState.animationState,
              energy: this.playerEnergyState.energy,
              energyActivity: this.playerEnergyState.activity,
            }
          : null,
      traps: Object.values(this.roomState?.traps ?? {}),
      projectiles: this.roomState?.projectiles ?? [],
      items: Object.values(this.roomState?.items ?? {}),
      interactiveObjects: Object.values(
        this.roomState?.interactiveObjects ?? {},
      ),
      energyTargets: Object.values(this.roomState?.energyTargets ?? {}),
    };
  }

  public readDevQaEnergyState(): DevQaEnergyStateSnapshot | null {
    if (!this.level) {
      return null;
    }

    return {
      energy: this.playerEnergyState.energy,
      activity: this.playerEnergyState.activity,
      sparkCooldownRemainingMs: this.playerEnergyState.sparkCooldownRemainingMs,
      burstCooldownRemainingMs: this.playerEnergyState.burstCooldownRemainingMs,
      burstPreparationRemainingMs:
        this.playerEnergyState.burstPreparationRemainingMs,
      burstDurationRemainingMs: this.playerEnergyState.burstDurationRemainingMs,
      canUseCyanSpark: canUseCyanSpark(this.playerEnergyState),
      canPrepareCyanBurst: canPrepareCyanBurst(this.playerEnergyState),
    };
  }

  public fillDevQaEnergy(): boolean {
    if (!this.level) {
      return false;
    }

    this.setPlayerEnergyState({
      ...this.playerEnergyState,
      energy: PLAYER_ENERGY_MAX,
    });
    gameStateStore.triggerPlayerEnergyHudFeedback("full");

    return true;
  }

  public clearDevQaEnergyCooldowns(): boolean {
    if (!this.level) {
      return false;
    }

    this.clearTemporaryEnergyState();

    return true;
  }

  public goToDevQaCheckpoint(checkpointId?: CheckpointId): boolean {
    if (!this.level || !this.player) {
      return false;
    }

    const checkpoint = checkpointId
      ? this.level.checkpoints.find(
          (candidate) => candidate.id === checkpointId,
        )
      : this.level.checkpoints[0];

    if (!checkpoint) {
      return false;
    }

    const activeCheckpoint = createActiveCheckpointFromDefinition(
      this.level,
      checkpoint,
    );

    gameStateStore.setActiveCheckpoint(activeCheckpoint);
    this.clearRespawnTimer();
    this.clearRespawnRecoveryTimer();
    this.resetRoomTransientState(checkpoint.id);
    this.player.respawn(activeCheckpoint);
    this.scheduleRespawnRecoveryEnd();

    return true;
  }

  public completeDevQaLevel(): boolean {
    if (!this.level || this.hasCompletedLevel) {
      return false;
    }

    this.hasCompletedLevel = true;
    this.completeLevel();

    return true;
  }

  private updatePlayerMovement(delta: number): void {
    if (!this.player || !this.actionInput) {
      return;
    }

    const physicsState = this.player.getPhysicsState();
    const { position, velocity, isGrounded } = physicsState;
    const direction = getHorizontalDirection({
      isMovingLeft: this.actionInput.isDown("move-left"),
      isMovingRight: this.actionInput.isDown("move-right"),
    });
    const energyMovementConstraint = getPlayerEnergyMovementConstraint({
      state: this.playerEnergyState,
      isChargeHeld: this.actionInput.isDown("charge-energy"),
      canCharge:
        gameStateStore.getSnapshot().playerLifeState === "alive" &&
        this.dashState.activeRemainingMs <= 0,
      isGrounded,
      wasJumpPressed: this.actionInput.wasPressed("jump"),
    });
    const walkingVelocity =
      calculateHorizontalVelocity({
        currentVelocityX: velocity.x,
        direction,
        isGrounded,
        deltaMs: delta,
      }) * energyMovementConstraint.horizontalSpeedScale;
    const dashMovement = calculateDashMovement({
      wasDashPressed:
        energyMovementConstraint.canDash &&
        this.actionInput.wasPressed("primary"),
      direction,
      fallbackDirection: this.getPlayerFacingDirection(),
      deltaMs: delta,
      state: this.dashState,
    });
    const horizontalVelocity = dashMovement.isDashing
      ? dashMovement.velocityX
      : walkingVelocity;
    const jumpMovement = calculateJumpMovement({
      currentPositionY: position.y,
      currentVelocityY: velocity.y,
      isGrounded,
      isJumpDown: this.actionInput.isDown("jump"),
      wasJumpPressed: this.actionInput.wasPressed("jump"),
      wasJumpReleased: this.actionInput.wasReleased("jump"),
      deltaMs: delta,
      state: this.jumpState,
    });

    this.jumpState = jumpMovement.state;
    this.dashState = dashMovement.state;
    const deltaSeconds = delta / 1000;
    const collision = resolveKinematicCollisions({
      currentPosition: position,
      targetPosition: {
        x: position.x + horizontalVelocity * deltaSeconds,
        y: jumpMovement.positionY,
      },
      velocity: {
        x: horizontalVelocity,
        y: jumpMovement.velocityY,
      },
      body: PLAYER_COLLISION_BODY,
      solids: this.solids,
    });
    const didLand = shouldPlayLandingAudio({
      wasGrounded: isGrounded,
      isGrounded: collision.isGrounded,
      velocityY: jumpMovement.velocityY,
    });

    const requestedFacing =
      direction !== 0 ? (direction === -1 ? "left" : "right") : undefined;
    const facingLock = resolveCyanBurstFacingLock({
      activity: this.playerEnergyState.activity,
      currentFacing: this.player.getVisualState().facing,
      ...(requestedFacing ? { requestedFacing } : {}),
      ...(this.cyanBurstLockedFacing
        ? { lockedFacing: this.cyanBurstLockedFacing }
        : {}),
    });

    this.cyanBurstLockedFacing = facingLock.lockedFacing;
    this.player.updateMovement({
      position: collision.position,
      velocity: collision.velocity,
      facing: facingLock.facing,
      isGrounded: collision.isGrounded,
      isUsingPrimaryAction: dashMovement.isDashing,
      powerAnimationMode: this.getPinoPowerAnimationMode(),
    });

    this.updatePlayerEnergyAura(dashMovement.isDashing);
    this.emitPlayerMovementEffects({
      isDashing: dashMovement.isDashing,
      didJump: jumpMovement.didJump,
      didLand,
      isGrounded: collision.isGrounded,
      velocity: collision.velocity,
    });

    if (dashMovement.didStartDash) {
      this.playPlayerSfx(getPlayerActionAudioId("primary"));
    }

    if (jumpMovement.didJump) {
      this.playPlayerSfx(PLAYER_AUDIO_IDS.JUMP);
    }

    if (didLand) {
      this.playPlayerSfx(PLAYER_AUDIO_IDS.LAND);
    }
  }

  private updatePlayerEnergyAura(isDashing: boolean): void {
    if (!this.player || !this.playerAura) {
      return;
    }

    const physicsState = this.player.getPhysicsState();
    const visualState = this.player.getVisualState();
    const aura = getPlayerAuraConfig(
      physicsState.position,
      resolvePlayerEnergyMode({
        isAlive: visualState.isAlive,
        isRespawning: visualState.isRespawning,
        isGrounded: physicsState.isGrounded,
        isDashing,
        velocity: physicsState.velocity,
      }),
    );

    this.playerAura
      .setPosition(aura.x, aura.y)
      .setSize(aura.width, aura.height)
      .setFillStyle(aura.color, aura.alpha);
  }

  private emitPlayerMovementEffects(input: {
    readonly isDashing: boolean;
    readonly didJump: boolean;
    readonly didLand: boolean;
    readonly isGrounded: boolean;
    readonly velocity: Vector2Like;
  }): void {
    if (!this.player) {
      return;
    }

    if (input.isDashing) {
      this.emitDashGhost();
    } else if (
      input.isGrounded &&
      Math.abs(input.velocity.x) >= PLAYER_RUN_SPARK_SPEED_THRESHOLD &&
      shouldEmitTimedEffect({
        nowMs: this.time.now,
        lastEmitMs: this.lastRunSparkAtMs,
        intervalMs: PLAYER_RUN_SPARK_INTERVAL_MS,
      })
    ) {
      this.lastRunSparkAtMs = this.time.now;
      this.emitBurstParticles([
        createRunSparkParticle(
          this.player.getPhysicsState().position,
          this.player.getVisualState().facing,
        ),
      ]);
    }

    if (input.didJump) {
      this.emitBurstParticles(
        createJumpBurstParticles(this.player.getPhysicsState().position),
      );
    }

    if (input.didLand) {
      this.emitBurstParticles(
        createLandingBurstParticles(this.player.getPhysicsState().position),
      );
    }
  }

  private emitDashGhost(): void {
    if (!this.player) {
      return;
    }

    if (
      !shouldEmitTimedEffect({
        nowMs: this.time.now,
        lastEmitMs: this.lastDashTrailAtMs,
        intervalMs: PLAYER_DASH_TRAIL_INTERVAL_MS,
      })
    ) {
      return;
    }

    this.lastDashTrailAtMs = this.time.now;
    const sprite = this.player.getSprite();
    const offset = getDashGhostOffset(this.player.getVisualState().facing);
    const ghost = this.add
      .image(sprite.x + offset.x, sprite.y + offset.y, sprite.texture.key)
      .setOrigin(PLAYER_SIZE.pivot.x, PLAYER_SIZE.pivot.y)
      .setFlipX(sprite.flipX)
      .setScale(sprite.scaleX, sprite.scaleY)
      .setAngle(sprite.angle)
      .setAlpha(0.34)
      .setTint(VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary)
      .setDepth(PLAYER_EFFECT_DEPTHS.trail);

    this.tweens.add({
      targets: ghost,
      alpha: 0,
      x: ghost.x + offset.x,
      duration: 160,
      ease: "Quad.easeOut",
      onComplete: () => {
        ghost.destroy();
      },
    });
  }

  private emitBurstParticles(
    particles: readonly ReturnType<typeof createRunSparkParticle>[],
  ): void {
    particles.forEach((particle) => {
      const marker = this.add
        .rectangle(
          particle.x,
          particle.y,
          particle.width,
          particle.height,
          particle.color,
          particle.alpha,
        )
        .setDepth(PLAYER_EFFECT_DEPTHS.burst);

      this.tweens.add({
        targets: marker,
        x: marker.x + particle.offsetX,
        y: marker.y + particle.offsetY,
        alpha: 0,
        duration: particle.durationMs,
        ease: "Quad.easeOut",
        onComplete: () => {
          marker.destroy();
        },
      });
    });
  }

  private drawTerrain(level: LevelDefinition): void {
    level.terrain.forEach((terrain) => {
      const { area } = terrain;

      this.add
        .tileSprite(
          area.x + area.width / 2,
          area.y + area.height / 2,
          area.width,
          area.height,
          getTerrainPlaceholderTextureKey(terrain),
        )
        .setOrigin(0.5);
    });
  }

  private drawLevelBackground(level: LevelDefinition): void {
    const { bounds } = level;

    this.add
      .tileSprite(
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
        bounds.width,
        bounds.height,
        PLACEHOLDER_TILESET_ASSET_KEYS.BACKGROUND_PANEL,
      )
      .setOrigin(0.5)
      .setDepth(-10);
  }

  private drawHazards(level: LevelDefinition): void {
    level.hazards.forEach((hazard) => {
      const { area } = hazard;
      const color = getHazardPlaceholderColor(hazard);

      if (hazard.kind === "spikes") {
        this.drawSpikeHazard(area, getHazardPlaceholderTextureKey());
        return;
      }

      if (hazard.kind === "fall") {
        this.add
          .tileSprite(
            area.x + area.width / 2,
            area.y + area.height / 2,
            area.width,
            area.height,
            getHazardPlaceholderTextureKey(),
          )
          .setOrigin(0.5)
          .setAlpha(0.35)
          .setDepth(VISUAL_READABILITY_DEPTHS.directHazard);
        return;
      }

      this.add
        .rectangle(
          area.x + area.width / 2,
          area.y + area.height / 2,
          area.width,
          area.height,
          color,
        )
        .setAlpha(0.7)
        .setDepth(VISUAL_READABILITY_DEPTHS.directHazard);
    });
  }

  private drawSpikeHazard(area: RectLike, textureKey: string): void {
    const spikeWidth = TILE_SIZE_PX;

    for (let x = area.x; x < area.x + area.width; x += spikeWidth) {
      const width = Math.min(spikeWidth, area.x + area.width - x);

      this.add
        .image(x + width / 2, area.y + area.height, textureKey)
        .setOrigin(0.5, 1)
        .setDisplaySize(width, area.height)
        .setDepth(VISUAL_READABILITY_DEPTHS.directHazard);
    }
  }

  private drawTraps(level: LevelDefinition, roomState: RoomRuntimeState): void {
    level.traps.forEach((trap) => {
      const state = roomState.traps[trap.id];

      if (!state) {
        return;
      }

      const feedback = getTrapFeedback(trap, state);
      const { area: triggerArea } = trap.trigger;
      const triggerMarker = this.add
        .rectangle(
          triggerArea.x + triggerArea.width / 2,
          triggerArea.y + triggerArea.height / 2,
          triggerArea.width,
          triggerArea.height,
          feedback.visual.triggerColor,
          feedback.visual.triggerAlpha,
        )
        .setStrokeStyle(
          1,
          feedback.visual.triggerStrokeColor,
          feedback.visual.triggerStrokeAlpha,
        );

      const bodyMarker = this.createTrapBodyMarker(
        trap,
        feedback.visual.bodyAlpha,
      );
      const tellMarker = this.createTrapTellMarker(trap, feedback);
      const crackMarker = this.createTrapCrackMarker(trap, feedback);

      this.trapMarkers.set(trap.id, {
        trigger: triggerMarker,
        ...(bodyMarker ? { body: bodyMarker } : {}),
        ...(tellMarker ? { tell: tellMarker } : {}),
        ...(crackMarker ? { crack: crackMarker } : {}),
      });
    });
  }

  private createTrapBodyMarker(
    trap: LevelDefinition["traps"][number],
    alpha: number,
  ): Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite | undefined {
    if (!trap.area) {
      return undefined;
    }

    const { area } = trap;
    const textureKey = getTrapBodyTextureKey(trap);

    if (trap.kind === "projectile" || trap.kind === "spike-pop") {
      return this.add
        .image(area.x + area.width / 2, area.y + area.height / 2, textureKey)
        .setOrigin(0.5)
        .setDisplaySize(area.width, area.height)
        .setAlpha(alpha)
        .setDepth(VISUAL_READABILITY_DEPTHS.trapThreat);
    }

    return this.add
      .tileSprite(
        area.x + area.width / 2,
        area.y + area.height / 2,
        area.width,
        area.height,
        textureKey,
      )
      .setOrigin(0.5)
      .setAlpha(alpha)
      .setDepth(1);
  }

  private createTrapTellMarker(
    trap: LevelDefinition["traps"][number],
    feedback: ReturnType<typeof getTrapFeedback>,
  ): Phaser.GameObjects.Rectangle | undefined {
    const area = trap.area;

    if (!area) {
      return undefined;
    }

    return this.add
      .rectangle(
        area.x + area.width / 2,
        area.y + area.height / 2,
        area.width,
        area.height,
        feedback.visual.tellColor,
        feedback.visual.tellAlpha,
      )
      .setStrokeStyle(
        1,
        feedback.visual.tellColor,
        feedback.visual.tellStrokeAlpha,
      )
      .setDepth(3);
  }

  private createTrapCrackMarker(
    trap: LevelDefinition["traps"][number],
    feedback: ReturnType<typeof getTrapFeedback>,
  ): Phaser.GameObjects.Graphics | undefined {
    if (trap.kind !== "breakable-floor" || !trap.area) {
      return undefined;
    }

    const crack = this.add.graphics().setDepth(4);
    this.drawTrapCrack(crack, trap.area, feedback.visual.crackAlpha);

    return crack;
  }

  private drawItems(level: LevelDefinition, roomState: RoomRuntimeState): void {
    level.items.forEach((item) => {
      const state = roomState.items[item.id];

      if (!state) {
        return;
      }

      const feedback = getItemFeedback(item, state);
      const { hitbox } = item;
      const marker = this.add
        .image(
          hitbox.x + hitbox.width / 2,
          hitbox.y + hitbox.height / 2,
          getItemTextureKey(item),
        )
        .setOrigin(0.5)
        .setDisplaySize(hitbox.width, hitbox.height)
        .setAlpha(feedback.visual.fillAlpha);

      this.itemMarkers.set(item.id, marker);
    });
  }

  private drawInteractiveObjects(
    level: LevelDefinition,
    roomState: RoomRuntimeState,
  ): void {
    level.interactiveObjects.forEach((object) => {
      const state = roomState.interactiveObjects[object.id];

      if (!state) {
        return;
      }

      const feedback = getInteractiveObjectFeedback(object, state);
      const { area } = object;
      const marker = this.add
        .rectangle(
          area.x + area.width / 2,
          area.y + area.height / 2,
          area.width,
          area.height,
          feedback.visual.fillColor,
          feedback.visual.fillAlpha,
        )
        .setStrokeStyle(
          1,
          feedback.visual.strokeColor,
          feedback.visual.strokeAlpha,
        );

      this.interactiveObjectMarkers.set(object.id, marker);
    });
  }

  private drawEnergyTargets(
    level: LevelDefinition,
    roomState: RoomRuntimeState,
  ): void {
    getLevelEnergyTargets(level).forEach((target) => {
      if (target.kind === "boss-hurtbox") {
        return;
      }

      const state = roomState.energyTargets[target.id];

      if (!state) {
        return;
      }

      const feedback = getEnergyTargetFeedback(target, state);
      const { area } = target;
      const base = this.add
        .rectangle(
          area.x + area.width / 2,
          area.y + area.height / 2,
          area.width,
          area.height,
          feedback.visual.fillColor,
          feedback.visual.fillAlpha,
        )
        .setStrokeStyle(
          1,
          feedback.visual.strokeColor,
          feedback.visual.strokeAlpha,
        )
        .setDepth(2);
      const active = this.add
        .tileSprite(
          area.x + area.width / 2,
          area.y + area.height / 2,
          area.width,
          area.height,
          ASSET_KEYS.ENERGY_TARGET_ACTIVE,
        )
        .setOrigin(0.5)
        .setAlpha(0)
        .setVisible(false)
        .setDepth(3);
      const broken = this.add
        .tileSprite(
          area.x + area.width / 2,
          area.y + area.height / 2,
          area.width,
          area.height,
          ASSET_KEYS.ENERGY_CRACKED_BLOCK_BROKEN,
        )
        .setOrigin(0.5)
        .setAlpha(0)
        .setVisible(false)
        .setDepth(3);

      this.energyTargetMarkers.set(target.id, {
        base,
        active,
        broken,
      });
      this.updateEnergyTargetMarker(target.id);
    });
  }

  private drawBosses(
    level: LevelDefinition,
    roomState: RoomRuntimeState,
  ): void {
    (level.bosses ?? []).forEach((boss) => {
      const state = roomState.bosses[boss.id];

      if (!state) {
        return;
      }

      this.bossMarkers.set(boss.id, this.createBossMarker(boss));
    });

    this.syncBossMarkers();
  }

  private createBossMarker(boss: BossDefinition): BossMarker {
    const { hitbox } = boss;
    const sprite = this.add
      .image(
        hitbox.x + hitbox.width / 2,
        hitbox.y + hitbox.height / 2,
        getBossTextureKey(boss),
      )
      .setOrigin(0.5)
      .setDisplaySize(hitbox.width, hitbox.height)
      .setDepth(VISUAL_READABILITY_DEPTHS.bossBody);
    const health = this.add
      .graphics()
      .setDepth(VISUAL_READABILITY_DEPTHS.bossHealth);
    const weakPoint = this.add
      .graphics()
      .setDepth(VISUAL_READABILITY_DEPTHS.bossHealth);

    return {
      sprite,
      health,
      weakPoint,
    };
  }

  private drawLevelMarkers(
    level: LevelDefinition,
    activeCheckpointId: CheckpointId,
  ): void {
    this.add
      .rectangle(
        level.spawn.x,
        level.spawn.y - PLAYER_SIZE.hitboxHeight / 2,
        PLAYER_SIZE.hitboxWidth,
        PLAYER_SIZE.hitboxHeight,
        MARKER_COLORS.spawn,
      )
      .setAlpha(0.45);

    const { area: exitArea } = level.exit;

    this.add
      .tileSprite(
        exitArea.x + exitArea.width / 2,
        exitArea.y + exitArea.height / 2,
        exitArea.width,
        exitArea.height,
        getExitTextureKey(),
      )
      .setOrigin(0.5)
      .setAlpha(0.9);

    level.checkpoints.forEach((checkpoint) => {
      const { area } = checkpoint;
      const marker = this.add
        .tileSprite(
          area.x + area.width / 2,
          area.y + area.height / 2,
          area.width,
          area.height,
          getCheckpointTextureKey(false),
        )
        .setOrigin(0.5)
        .setAlpha(0.65);

      this.checkpointMarkers.set(checkpoint.id, marker);
    });

    this.updateCheckpointMarkers(activeCheckpointId);
  }

  private updateLevelProgress(): void {
    if (!this.level || !this.player) {
      return;
    }

    const { activeCheckpoint } = gameStateStore.getSnapshot();
    const playerHitbox = getWorldHitbox(
      this.player.getPhysicsState().position,
      PLAYER_COLLISION_BODY,
    );
    const touchedCheckpoint = findTouchedCheckpoint(
      playerHitbox,
      this.level.checkpoints,
      activeCheckpoint.id,
    );

    if (touchedCheckpoint) {
      gameStateStore.setActiveCheckpoint(
        createActiveCheckpointFromDefinition(this.level, touchedCheckpoint),
      );
      this.updateCheckpointMarkers(touchedCheckpoint.id);
    }

    if (
      !this.hasCompletedLevel &&
      isTouchingExit(playerHitbox, this.level) &&
      !this.isExitBlockedByBoss()
    ) {
      this.hasCompletedLevel = true;
      this.completeLevel();
    }
  }

  private isExitBlockedByBoss(): boolean {
    if (!this.level || !this.roomState) {
      return false;
    }

    return isLevelExitBlockedByLivingBosses(this.level.bosses, this.roomState);
  }

  private completeLevel(): void {
    if (!this.level) {
      return;
    }

    const { deathCount } = gameStateStore.getSnapshot();
    const nextLevelId = this.level.exit.nextLevelId;
    const levelResult = this.completeLevelResult(this.level, deathCount);

    gameStateStore.completeLevel(nextLevelId);
    this.scene.start(SCENE_KEYS.LEVEL_TRANSITION, {
      completedLevelId: this.level.id,
      nextLevelId,
      deathCount,
      levelResult,
    });
  }

  private completeLevelResult(
    level: LevelDefinition,
    deathCount: number,
  ): LevelCompletionResult {
    return recordLevelCompletion(
      createLevelCompletionAttemptFromRunCounters({
        levelId: level.id,
        elapsedMs: this.time.now - this.levelStartedAtMs,
        levelStartDeathCount: this.levelStartDeathCount,
        currentDeathCount: deathCount,
      }),
    );
  }

  private updatePlayerDeath(): boolean {
    if (!this.level || !this.player) {
      return false;
    }

    const playerHitbox = getWorldHitbox(
      this.player.getPhysicsState().position,
      PLAYER_COLLISION_BODY,
    );
    const touchedHazard = findTouchedDeadlyHazard(
      playerHitbox,
      this.level.hazards,
    );

    if (touchedHazard) {
      this.killPlayer({
        cause: touchedHazard.cause,
        sourceId: touchedHazard.hazard.id,
      });

      return true;
    }

    const touchedTrapThreat = this.roomState
      ? findTouchedTrapThreat(playerHitbox, this.level.traps, this.roomState)
      : undefined;

    if (touchedTrapThreat) {
      this.killPlayer({
        cause: touchedTrapThreat.cause,
        sourceId: touchedTrapThreat.sourceId,
      });

      return true;
    }

    const touchedBossThreat = this.roomState
      ? findTouchedBossThreat(playerHitbox, this.level.bosses, this.roomState)
      : undefined;

    if (touchedBossThreat) {
      this.killPlayer({
        cause: touchedBossThreat.cause,
        sourceId: touchedBossThreat.sourceId,
      });

      return true;
    }

    if (!isBelowLevelDeathPlane(playerHitbox, this.level)) {
      return false;
    }

    this.killPlayer({
      cause: "fall",
    });

    return true;
  }

  private updateTrapTriggers(): void {
    if (!this.level || !this.player || !this.roomState) {
      return;
    }

    const playerHitbox = getWorldHitbox(
      this.player.getPhysicsState().position,
      PLAYER_COLLISION_BODY,
    );
    const triggeredTraps = findTriggeredPositionTraps(
      playerHitbox,
      this.level.traps,
      this.roomState,
    );

    triggeredTraps.forEach(({ trap }) => {
      if (!this.roomState) {
        return;
      }

      this.roomState = activateMvpTrap(this.roomState, trap);
      this.refreshRoomSolids();
      this.syncProjectileMarkers();
      this.updateTrapMarker(trap.id);
      this.playLevelSfx(getTrapActivationAudioId(trap.kind));
    });
  }

  private updateBossArenaLocks(): void {
    if (!this.level || !this.player || !this.roomState) {
      return;
    }

    const playerHitbox = getWorldHitbox(
      this.player.getPhysicsState().position,
      PLAYER_COLLISION_BODY,
    );
    const enteredBossArenas = findEnteredBossArenas(
      playerHitbox,
      this.level.bosses,
      this.roomState,
    );

    if (enteredBossArenas.length === 0) {
      return;
    }

    enteredBossArenas.forEach(({ boss }) => {
      this.activateBossEntryCheckpoint(boss);
      this.playLevelSfx(getBossEntryAudioId());
    });

    const nextRoomState = enteredBossArenas.reduce(
      (state, { boss }) => lockBossArenaEntrance(state, boss),
      this.roomState,
    );

    this.roomState = nextRoomState;
    this.refreshRoomSolids();
    this.updateInteractiveObjectMarkers();
  }

  private activateBossEntryCheckpoint(boss: BossDefinition): void {
    if (!this.level) {
      return;
    }

    const checkpoint = findBossEntryCheckpoint(boss, this.level.checkpoints);

    if (!checkpoint) {
      return;
    }

    const { activeCheckpoint } = gameStateStore.getSnapshot();

    if (
      activeCheckpoint.levelId === this.level.id &&
      activeCheckpoint.id === checkpoint.id
    ) {
      this.updateCheckpointMarkers(checkpoint.id);
      return;
    }

    const bossCheckpoint = createActiveCheckpointFromDefinition(
      this.level,
      checkpoint,
    );

    gameStateStore.setActiveCheckpoint(bossCheckpoint);
    this.updateCheckpointMarkers(bossCheckpoint.id);
  }

  private updateBossAttackRuntime(delta: number): void {
    if (!this.level || !this.roomState) {
      return;
    }

    const result = updateBossAttackRuntimeState(
      this.roomState,
      this.level.bosses,
      delta,
      this.level.bounds,
      this.solids,
    );

    this.roomState = result.state;
    this.syncBossMarkers();
    this.syncBossAttackMarkers();
    this.syncBossProjectileMarkers();
    getBossAttackCycleAudioIds(result.events).forEach((audioId) => {
      this.playLevelSfx(audioId);
    });
  }

  private updateBossDefeatUnlocks(): void {
    if (!this.level || !this.roomState) {
      return;
    }

    const nextRoomState = unlockDefeatedBossObjects(
      this.roomState,
      this.level.bosses,
    );

    if (nextRoomState === this.roomState) {
      return;
    }

    this.roomState = nextRoomState;
    this.refreshRoomSolids();
    this.updateInteractiveObjectMarkers();
    this.syncBossAttackMarkers();
    this.syncBossProjectileMarkers();
  }

  private updateTrapRuntime(delta: number): void {
    if (!this.level || !this.roomState) {
      return;
    }

    this.roomState = updateTrapProjectiles(this.roomState, this.level, delta);
    this.syncProjectileMarkers();
  }

  private updateItemCollection(): void {
    if (!this.level || !this.player || !this.roomState) {
      return;
    }

    const playerHitbox = getWorldHitbox(
      this.player.getPhysicsState().position,
      PLAYER_COLLISION_BODY,
    );
    const touchedItems = findTouchedAvailableItems(
      playerHitbox,
      this.level.items,
      this.roomState,
    );

    touchedItems.forEach(({ item }) => {
      if (!this.roomState) {
        return;
      }

      this.roomState = collectLevelItem(this.roomState, item);
      this.updateItemMarker(item.id);
      this.refreshRoomSolids();
      this.updateInteractiveObjectMarkers();
      this.playLevelSfx(getItemCollectionAudioId(item.kind));
    });
  }

  private updatePlayerEnergyRuntime(delta: number): void {
    if (!this.player || !this.actionInput) {
      return;
    }

    const physicsState = this.player.getPhysicsState();
    const previousActivity = this.playerEnergyState.activity;
    const energyResult = updatePlayerEnergy({
      state: this.playerEnergyState,
      deltaMs: delta,
      isChargeHeld: this.actionInput.isDown("charge-energy"),
      canCharge:
        gameStateStore.getSnapshot().playerLifeState === "alive" &&
        this.dashState.activeRemainingMs <= 0 &&
        !this.actionInput.wasPressed("jump"),
      isGrounded: physicsState.isGrounded,
    });

    this.setPlayerEnergyState(energyResult.state);
    this.triggerPlayerEnergyHudFeedback(energyResult);
    this.emitEnergyAudioCues(
      getPlayerEnergyAudioCues({
        previousActivity,
        nextActivity: this.playerEnergyState.activity,
        effects: energyResult.effects,
      }),
    );
    if (energyResult.effects.includes("cyan-burst-finished")) {
      this.cyanBurstLockedFacing = undefined;
      this.cyanBurstActiveAttackId = undefined;
      this.cyanBurstHitBossIds.clear();
    }
    this.syncCyanBurstBeamMarker();
  }

  private updatePinoPowerAnimationTimers(delta: number): void {
    this.cyanSparkAnimationRemainingMs = Math.max(
      0,
      this.cyanSparkAnimationRemainingMs - delta,
    );
  }

  private getPinoPowerAnimationMode(): PinoPowerAnimationMode {
    if (this.playerEnergyState.activity === "burst-firing") {
      return PINO_POWER_ANIMATION_MODES.CYAN_BURST_FIRE;
    }

    if (this.playerEnergyState.activity === "burst-preparing") {
      return PINO_POWER_ANIMATION_MODES.CYAN_BURST_PREPARE;
    }

    if (this.cyanSparkAnimationRemainingMs > 0) {
      return PINO_POWER_ANIMATION_MODES.CYAN_SPARK;
    }

    if (this.playerEnergyState.activity === "charging") {
      return PINO_POWER_ANIMATION_MODES.CYAN_CHARGE;
    }

    return PINO_POWER_ANIMATION_MODES.NONE;
  }

  private updateCyanSparkProjectileRuntime(delta: number): void {
    this.updateEnergyTargetRuntime(delta);

    const projectileUpdate = updateCyanSparkProjectiles({
      projectiles: this.cyanSparkProjectiles,
      deltaMs: delta,
      solids: this.getCyanSparkBlockingSolids(),
      targets:
        this.level && this.roomState
          ? getCyanSparkCollisionTargets(
              getLevelEnergyTargets(this.level),
              this.roomState,
              this.level.bosses,
            )
          : [],
    });

    this.cyanSparkProjectiles = projectileUpdate.projectiles;
    this.applyCyanSparkEnergyTargetHits(projectileUpdate.impacts);
    this.emitEnergyAudioCues(
      getCyanSparkImpactAudioCues(projectileUpdate.impacts),
    );
    this.syncCyanSparkProjectileMarkers();
  }

  private updateEnergyTargetRuntime(delta: number): void {
    if (!this.level || !this.roomState) {
      return;
    }

    const nextRoomState = updateRoomEnergyTargets(
      this.roomState,
      this.level,
      delta,
    );

    if (nextRoomState === this.roomState) {
      return;
    }

    this.roomState = nextRoomState;
    this.refreshRoomSolids();
    this.updateEnergyTargetMarkers();
    this.updateInteractiveObjectMarkers();
  }

  private applyCyanSparkEnergyTargetHits(
    impacts: readonly CyanSparkProjectileImpact[],
  ): void {
    const energyImpacts = impacts.filter(
      (impact) =>
        (impact.kind === "target" || impact.kind === "boss") && impact.targetId,
    );

    if (!this.level || !this.roomState || energyImpacts.length === 0) {
      return;
    }

    energyImpacts.forEach((impact) => {
      if (!this.roomState || !impact.targetId) {
        return;
      }

      if (
        impact.kind === "boss" &&
        this.applyBossEnergyTargetHit({
          targetId: impact.targetId,
          power: "cyan-spark",
          sourceAttackId: impact.projectileId,
        })
      ) {
        return;
      }

      this.applyEnergySwitchHit(impact.targetId);
      this.applyEnergyRelayHit(impact.targetId);
      this.applyEnergyAbsorberHit(impact.targetId);
    });
  }

  private updateInteractiveObjectActions(delta: number): void {
    if (!this.level || !this.player || !this.actionInput || !this.roomState) {
      return;
    }

    const playerHitbox = getWorldHitbox(
      this.player.getPhysicsState().position,
      PLAYER_COLLISION_BODY,
    );
    const triggeredObjects = findTriggeredInteractiveObjects(
      playerHitbox,
      this.level.interactiveObjects,
      this.roomState,
      "secondary",
    );
    const secondaryIntent = resolveSecondaryActionIntent({
      isSecondaryDown: this.actionInput.isDown("secondary"),
      wasSecondaryPressed: this.actionInput.wasPressed("secondary"),
      wasSecondaryReleased: this.actionInput.wasReleased("secondary"),
      hasNearbyInteraction: triggeredObjects.length > 0,
      canPrepareSpecial: canPrepareCyanBurst(this.playerEnergyState),
      deltaMs: delta,
      state: this.secondaryActionIntentState,
    });

    this.secondaryActionIntentState = secondaryIntent.state;

    if (secondaryIntent.intent === "special-charge-start") {
      this.tryStartCyanBurstPreparation();
      return;
    }

    if (secondaryIntent.intent === "special-fire") {
      this.tryFireCyanBurst();
      return;
    }

    if (secondaryIntent.intent === "special-cancel") {
      this.cancelCyanBurstPreparation();
      return;
    }

    if (secondaryIntent.intent === "quick-shot") {
      this.trySpawnCyanSparkShot();
      return;
    }

    if (secondaryIntent.intent !== "interact") {
      return;
    }

    this.playPlayerSfx(getPlayerActionAudioId("secondary"));

    triggeredObjects.forEach(({ object }) => {
      if (!this.roomState) {
        return;
      }

      this.roomState = activateInteractiveObject(this.roomState, object);
      this.refreshRoomSolids();
      this.updateInteractiveObjectMarkers();
    });
  }

  private trySpawnCyanSparkShot(): void {
    if (!this.player) {
      return;
    }

    if (!canSpawnCyanSparkProjectile(this.cyanSparkProjectiles)) {
      return;
    }

    const previousActivity = this.playerEnergyState.activity;
    const energyResult = updatePlayerEnergy({
      state: this.playerEnergyState,
      deltaMs: 0,
      isChargeHeld: false,
      canCharge: false,
      isGrounded: this.player.getPhysicsState().isGrounded,
      request: "cyan-spark",
    });

    this.setPlayerEnergyState(energyResult.state);
    this.triggerPlayerEnergyHudFeedback(energyResult);
    this.emitEnergyAudioCues([
      ...getPlayerEnergyAudioCues({
        previousActivity,
        nextActivity: this.playerEnergyState.activity,
        effects: energyResult.effects,
      }),
      ...getPlayerEnergyRejectionAudioCues(energyResult.rejections),
    ]);

    if (!energyResult.effects.includes("cyan-spark-fired")) {
      if (this.hasCyanSparkInsufficientEnergyRejection(energyResult)) {
        this.playInsufficientEnergyFeedback();
      }

      return;
    }

    this.cyanSparkAnimationRemainingMs =
      CYAN_SPARK_PLAYER_ANIMATION_DURATION_MS;
    this.cyanSparkProjectiles = [
      ...this.cyanSparkProjectiles,
      createCyanSparkProjectile({
        id: `cyan-spark-${this.cyanSparkProjectileSequence}`,
        origin: this.player.getPhysicsState().position,
        facing: this.player.getVisualState().facing,
      }),
    ];
    this.cyanSparkProjectileSequence += 1;
    this.syncCyanSparkProjectileMarkers();
  }

  private tryStartCyanBurstPreparation(): void {
    if (!this.player) {
      return;
    }

    const lockedFacing = this.player.getVisualState().facing;
    const previousActivity = this.playerEnergyState.activity;
    const energyResult = updatePlayerEnergy({
      state: this.playerEnergyState,
      deltaMs: 0,
      isChargeHeld: false,
      canCharge: false,
      isGrounded: this.player.getPhysicsState().isGrounded,
      request: "cyan-burst-prepare",
    });

    this.setPlayerEnergyState(energyResult.state);
    this.triggerPlayerEnergyHudFeedback(energyResult);
    this.emitEnergyAudioCues([
      ...getPlayerEnergyAudioCues({
        previousActivity,
        nextActivity: this.playerEnergyState.activity,
        effects: energyResult.effects,
      }),
      ...getPlayerEnergyRejectionAudioCues(energyResult.rejections),
    ]);

    if (!energyResult.effects.includes("cyan-burst-preparation-started")) {
      this.cyanBurstLockedFacing = undefined;
      this.cyanBurstActiveAttackId = undefined;
      this.cyanBurstHitBossIds.clear();
      return;
    }

    this.cyanBurstLockedFacing = lockedFacing;
    this.cyanBurstActiveAttackId = undefined;
    this.cyanBurstHitBossIds.clear();
    this.playCyanBurstPreparationFeedback(lockedFacing);
  }

  private tryFireCyanBurst(): void {
    if (!this.player) {
      return;
    }

    const firingFacing =
      this.cyanBurstLockedFacing ?? this.player.getVisualState().facing;
    const previousActivity = this.playerEnergyState.activity;
    const energyResult = updatePlayerEnergy({
      state: this.playerEnergyState,
      deltaMs: 0,
      isChargeHeld: false,
      canCharge: false,
      isGrounded: this.player.getPhysicsState().isGrounded,
      request: "cyan-burst-fire",
    });

    this.setPlayerEnergyState(energyResult.state);
    this.triggerPlayerEnergyHudFeedback(energyResult);
    this.emitEnergyAudioCues([
      ...getPlayerEnergyAudioCues({
        previousActivity,
        nextActivity: this.playerEnergyState.activity,
        effects: energyResult.effects,
      }),
      ...getPlayerEnergyRejectionAudioCues(energyResult.rejections),
    ]);

    if (!energyResult.effects.includes("cyan-burst-fired")) {
      this.cancelCyanBurstPreparation();
      return;
    }

    this.cyanBurstLockedFacing = firingFacing;
    this.cyanBurstActiveAttackId = this.createCyanBurstAttackId();
    this.applyCyanBurstBeamHits(firingFacing);
    this.syncCyanBurstBeamMarker();
  }

  private applyCyanBurstBeamHits(facing: FacingDirection): void {
    if (!this.level || !this.player || !this.roomState) {
      return;
    }

    const beam = resolveCyanBurstBeam({
      origin: this.player.getPhysicsState().position,
      facing,
      solids: this.getCyanBurstBlockingSolids(),
      alreadyHitBossIds: [...this.cyanBurstHitBossIds],
      targets: getCyanBurstBeamCollisionTargets(
        getLevelEnergyTargets(this.level),
        this.roomState,
        this.level.bosses,
      ),
    });

    if (beam.impacts.length === 0) {
      return;
    }

    beam.impacts.forEach((impact) => {
      if (!this.roomState) {
        return;
      }

      if (impact.kind === "boss") {
        this.applyBossEnergyTargetHit({
          targetId: impact.targetId,
          power: "cyan-burst",
          hitGroupId: impact.hitGroupId,
          sourceAttackId: this.cyanBurstActiveAttackId,
        });
        this.cyanBurstHitBossIds.add(impact.hitGroupId ?? impact.targetId);
        return;
      }

      if (this.applyEnergySwitchHit(impact.targetId)) {
        return;
      }

      if (this.applyEnergyAbsorberHit(impact.targetId)) {
        return;
      }

      if (this.applyEnergyCoreHit(impact.targetId, impact.damage)) {
        return;
      }

      this.roomState = damageEnergyTarget(
        this.roomState,
        impact.targetId,
        impact.damage,
      );
    });
    this.refreshRoomSolids();
    this.updateEnergyTargetMarkers();
    this.playCyanBurstImpactFeedback(beam.impacts);
    this.emitEnergyAudioCues(getCyanBurstImpactAudioCues(beam.impacts));
  }

  private createCyanBurstAttackId(): string {
    const id = `cyan-burst-${this.cyanBurstAttackSequence}`;

    this.cyanBurstAttackSequence += 1;

    return id;
  }

  private applyBossEnergyTargetHit(input: {
    readonly targetId: string;
    readonly power: EnergyPowerKind;
    readonly hitGroupId?: string;
    readonly sourceAttackId?: string;
  }): boolean {
    if (!this.level || !this.roomState) {
      return false;
    }

    const bossId = this.resolveBossIdFromEnergyTargetHit(
      input.targetId,
      input.hitGroupId,
    );

    if (!bossId) {
      return false;
    }

    const result = applyBossEnergyHit(this.roomState, this.level.bosses, {
      bossId,
      power: input.power,
      didHitWeakPoint: true,
      sourceAttackId: input.sourceAttackId,
    });
    const bossDamageAudioId = getBossDamageAudioId(result);

    this.roomState = result.state;
    this.syncBossMarkers();

    if (bossDamageAudioId) {
      this.playLevelSfx(bossDamageAudioId);
    }

    return true;
  }

  private resolveBossIdFromEnergyTargetHit(
    targetId: string,
    hitGroupId?: string,
  ): BossId | undefined {
    if (!this.level) {
      return undefined;
    }

    if (
      hitGroupId &&
      this.level.bosses?.some((candidate) => candidate.id === hitGroupId)
    ) {
      return hitGroupId;
    }

    const target = getLevelEnergyTargets(this.level).find(
      (candidate) => candidate.id === targetId,
    );

    if (target?.kind !== "boss-hurtbox") {
      return undefined;
    }

    return target.hitGroupId ?? target.id;
  }

  private applyEnergySwitchHit(targetId: string): boolean {
    if (!this.level || !this.roomState) {
      return false;
    }

    const target = getLevelEnergyTargets(this.level).find(
      (candidate) => candidate.id === targetId,
    );

    if (!target || target.kind !== "energy-switch") {
      return false;
    }

    this.roomState = activateEnergySwitch(this.roomState, target);
    this.refreshRoomSolids();
    this.updateEnergyTargetMarker(target.id);
    this.updateInteractiveObjectMarkers();

    return true;
  }

  private applyEnergyAbsorberHit(targetId: string): boolean {
    if (!this.level || !this.roomState) {
      return false;
    }

    const target = getLevelEnergyTargets(this.level).find(
      (candidate) => candidate.id === targetId,
    );

    if (!target || target.kind !== "energy-absorber") {
      return false;
    }

    this.roomState = absorbEnergyTarget(this.roomState, target);
    this.updateEnergyTargetMarker(target.id);

    return true;
  }

  private applyEnergyCoreHit(targetId: string, damage: number): boolean {
    if (!this.level || !this.roomState) {
      return false;
    }

    const target = getLevelEnergyTargets(this.level).find(
      (candidate) => candidate.id === targetId,
    );

    if (!target || target.kind !== "energy-core") {
      return false;
    }

    this.roomState = activateEnergyCore(this.roomState, target, damage);
    this.refreshRoomSolids();
    this.updateEnergyTargetMarker(target.id);
    this.updateInteractiveObjectMarkers();

    return true;
  }

  private applyEnergyRelayHit(targetId: string): boolean {
    if (!this.level || !this.roomState) {
      return false;
    }

    const target = getLevelEnergyTargets(this.level).find(
      (candidate) => candidate.id === targetId,
    );

    if (!target || target.kind !== "energy-relay") {
      return false;
    }

    this.roomState = activateEnergyRelay(this.roomState, target);
    this.refreshRoomSolids();
    this.updateEnergyTargetMarker(target.id);
    this.updateInteractiveObjectMarkers();

    return true;
  }

  private cancelCyanBurstPreparation(): void {
    const previousActivity = this.playerEnergyState.activity;
    const energyResult = updatePlayerEnergy({
      state: this.playerEnergyState,
      deltaMs: 0,
      isChargeHeld: false,
      canCharge: false,
      isGrounded: this.player?.getPhysicsState().isGrounded ?? true,
      request: "cyan-burst-cancel",
    });

    this.setPlayerEnergyState(energyResult.state);
    this.emitEnergyAudioCues(
      getPlayerEnergyAudioCues({
        previousActivity,
        nextActivity: this.playerEnergyState.activity,
        effects: energyResult.effects,
      }),
    );
    this.cyanBurstLockedFacing = undefined;
    this.cyanBurstActiveAttackId = undefined;
    this.cyanBurstHitBossIds.clear();
    this.clearCyanBurstBeamMarker();
  }

  private playCyanBurstPreparationFeedback(facing: FacingDirection): void {
    if (!this.player) {
      return;
    }

    const physicsState = this.player.getPhysicsState();

    this.emitBurstParticles(
      createCyanBurstPreparationParticles(physicsState.position, facing),
    );

    const pulse = this.add
      .ellipse(
        physicsState.position.x,
        physicsState.position.y - 14,
        18,
        28,
        VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary,
        0.24,
      )
      .setStrokeStyle(1, 0xf5f7fb, 0.52)
      .setDepth(PLAYER_EFFECT_DEPTHS.energyShot);

    this.tweens.add({
      targets: pulse,
      alpha: 0,
      scaleX: 1.22,
      scaleY: 1.08,
      duration: 210,
      ease: "Quad.easeOut",
      onComplete: () => {
        pulse.destroy();
      },
    });
  }

  private playCyanBurstImpactFeedback(
    impacts: readonly CyanBurstBeamImpact[],
  ): void {
    if (!this.level || !this.roomState) {
      return;
    }

    const targets = getLevelEnergyTargets(this.level);

    impacts.forEach((impact) => {
      const target = targets.find(
        (candidate) => candidate.id === impact.targetId,
      );
      const state = this.roomState?.energyTargets[impact.targetId];

      if (!target || !state) {
        return;
      }

      const { area } = target;
      const color =
        impact.kind === "boss"
          ? VISUAL_READABILITY_SEMANTIC_COLORS.boss.primary
          : impact.kind === "cracked-block"
            ? VISUAL_READABILITY_SEMANTIC_COLORS.energy.charged
            : VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary;
      const pulse = this.add
        .image(
          area.x + area.width / 2,
          area.y + area.height / 2,
          ASSET_KEYS.ENERGY_IMPACT,
        )
        .setDisplaySize(
          Math.min(Math.max(area.width + 8, 16), 32),
          Math.min(Math.max(area.height + 8, 16), 32),
        )
        .setTint(color)
        .setAlpha(clampWideEffectAlpha(state.isBroken ? 0.68 : 0.58))
        .setDepth(PLAYER_EFFECT_DEPTHS.energyShot);

      this.tweens.add({
        targets: pulse,
        alpha: 0,
        scaleX: 1.18,
        scaleY: 1.18,
        duration: 170,
        ease: "Quad.easeOut",
        onComplete: () => {
          pulse.destroy();
        },
      });
    });
  }

  private hasCyanSparkInsufficientEnergyRejection(
    result: ReturnType<typeof updatePlayerEnergy>,
  ): boolean {
    return result.rejections.some(
      (rejection) =>
        rejection.request === "cyan-spark" &&
        rejection.reason === "insufficient-energy",
    );
  }

  private playInsufficientEnergyFeedback(): void {
    if (!this.player) {
      return;
    }

    const physicsState = this.player.getPhysicsState();
    const visualState = this.player.getVisualState();

    this.emitBurstParticles(
      createInsufficientEnergyParticles(
        physicsState.position,
        visualState.facing,
      ),
    );

    const pulse = this.add
      .ellipse(
        physicsState.position.x,
        physicsState.position.y - 13,
        22,
        24,
        VISUAL_READABILITY_SEMANTIC_COLORS.energy.failure,
        0.22,
      )
      .setDepth(PLAYER_EFFECT_DEPTHS.energyShot);

    this.tweens.add({
      targets: pulse,
      alpha: 0,
      scaleX: 1.28,
      scaleY: 0.74,
      duration: 150,
      ease: "Quad.easeOut",
      onComplete: () => {
        pulse.destroy();
      },
    });
  }

  private killPlayer(death: PlayerDeathContext): void {
    if (!this.player) {
      return;
    }

    if (gameStateStore.getSnapshot().playerLifeState === "dead") {
      return;
    }

    const { position } = this.player.getPhysicsState();

    this.clearRespawnRecoveryTimer();
    this.resetTemporaryEnergyStateForCheckpoint();
    this.player.die();
    this.updatePlayerEnergyAura(false);
    this.emitBurstParticles(
      createLandingBurstParticles(this.player.getPhysicsState().position),
    );
    this.jumpState = createInitialJumpMovementState();
    this.dashState = resetDashMovementState(this.dashState);
    gameStateStore.registerDeath(death.cause, position, death.sourceId);
    this.scheduleAutomaticRespawn();
  }

  private scheduleAutomaticRespawn(): void {
    this.respawnTimer?.remove(false);
    this.respawnTimer = this.time.delayedCall(
      AUTO_RESPAWN_DELAY_MS,
      this.respawnPlayerAtCheckpoint,
      undefined,
      this,
    );
  }

  private respawnPlayerAtCheckpoint(): void {
    if (!this.player) {
      return;
    }

    this.respawnTimer = undefined;

    this.restorePlayerAtCheckpoint(false);
  }

  private restartAtCheckpoint(): void {
    if (!this.player) {
      return;
    }

    this.clearRespawnTimer();
    this.clearRespawnRecoveryTimer();
    this.restorePlayerAtCheckpoint(true);
  }

  private restorePlayerAtCheckpoint(isManualRestart: boolean): void {
    if (!this.player) {
      return;
    }

    const checkpoint = gameStateStore.respawnAtCheckpoint(isManualRestart);

    this.resetRoomTransientState(checkpoint.id);
    this.player.respawn(checkpoint);
    this.updatePlayerEnergyAura(false);
    this.emitBurstParticles(createJumpBurstParticles(checkpoint));
    this.scheduleRespawnRecoveryEnd();
  }

  private resetRoomTransientState(activeCheckpointId: CheckpointId): void {
    if (this.level && this.roomState) {
      this.roomState = resetRoomStateForRespawn(this.roomState, this.level);
      this.refreshRoomSolids();
      this.syncProjectileMarkers();
    }

    this.jumpState = createInitialJumpMovementState();
    this.dashState = resetDashMovementState(this.dashState);
    this.resetTemporaryEnergyStateForCheckpoint();
    this.hasCompletedLevel = false;
    this.updateTrapMarkers();
    this.updateItemMarkers();
    this.updateInteractiveObjectMarkers();
    this.updateEnergyTargetMarkers();
    this.syncBossMarkers();
    this.syncBossAttackMarkers();
    this.syncBossProjectileMarkers();
    this.updateCheckpointMarkers(activeCheckpointId);
  }

  private updateTrapMarkers(): void {
    this.trapMarkers.forEach((_marker, trapId) => {
      this.updateTrapMarker(trapId);
    });
  }

  private updateTrapMarker(trapId: TrapId): void {
    if (!this.level || !this.roomState) {
      return;
    }

    const trap = this.level.traps.find((candidate) => candidate.id === trapId);
    const state = this.roomState.traps[trapId];
    const marker = this.trapMarkers.get(trapId);

    if (!trap || !state || !marker) {
      return;
    }

    const feedback = getTrapFeedback(trap, state);

    marker.trigger
      .setFillStyle(feedback.visual.triggerColor, feedback.visual.triggerAlpha)
      .setStrokeStyle(
        1,
        feedback.visual.triggerStrokeColor,
        feedback.visual.triggerStrokeAlpha,
      );

    marker.body?.setAlpha(feedback.visual.bodyAlpha);
    marker.body?.setTint(feedback.visual.bodyTint);
    marker.tell
      ?.setFillStyle(feedback.visual.tellColor, feedback.visual.tellAlpha)
      .setStrokeStyle(
        1,
        feedback.visual.tellColor,
        feedback.visual.tellStrokeAlpha,
      );

    if (marker.crack && trap.area) {
      this.drawTrapCrack(marker.crack, trap.area, feedback.visual.crackAlpha);
    }

    this.playTrapVisualActivation(trap, marker, feedback);
  }

  private updateItemMarkers(): void {
    this.itemMarkers.forEach((_marker, itemId) => {
      this.updateItemMarker(itemId);
    });
  }

  private updateItemMarker(itemId: ItemId): void {
    if (!this.level || !this.roomState) {
      return;
    }

    const item = this.level.items.find((candidate) => candidate.id === itemId);
    const state = this.roomState.items[itemId];
    const marker = this.itemMarkers.get(itemId);

    if (!item || !state || !marker) {
      return;
    }

    const feedback = getItemFeedback(item, state);

    marker.setAlpha(feedback.visual.fillAlpha);
  }

  private updateInteractiveObjectMarkers(): void {
    this.interactiveObjectMarkers.forEach((_marker, objectId) => {
      this.updateInteractiveObjectMarker(objectId);
    });
  }

  private updateInteractiveObjectMarker(objectId: InteractiveObjectId): void {
    if (!this.level || !this.roomState) {
      return;
    }

    const object = this.level.interactiveObjects.find(
      (candidate) => candidate.id === objectId,
    );
    const state = this.roomState.interactiveObjects[objectId];
    const marker = this.interactiveObjectMarkers.get(objectId);

    if (!object || !state || !marker) {
      return;
    }

    const feedback = getInteractiveObjectFeedback(object, state);

    marker
      .setFillStyle(feedback.visual.fillColor, feedback.visual.fillAlpha)
      .setStrokeStyle(
        1,
        feedback.visual.strokeColor,
        feedback.visual.strokeAlpha,
      );
  }

  private updateEnergyTargetMarkers(): void {
    this.energyTargetMarkers.forEach((_marker, targetId) => {
      this.updateEnergyTargetMarker(targetId);
    });
  }

  private updateEnergyTargetMarker(targetId: EnergyTargetId): void {
    if (!this.level || !this.roomState) {
      return;
    }

    const target = getLevelEnergyTargets(this.level).find(
      (candidate) => candidate.id === targetId,
    );
    const state = this.roomState.energyTargets[targetId];
    const marker = this.energyTargetMarkers.get(targetId);

    if (!target || !state || !marker) {
      return;
    }

    const feedback = getEnergyTargetFeedback(target, state);
    const { area } = target;
    const isActive = state.isActive && !state.isBroken;
    const isBrokenBlock =
      target.kind === "energy-cracked-block" && state.isBroken;

    marker.base
      .setFillStyle(feedback.visual.fillColor, feedback.visual.fillAlpha)
      .setStrokeStyle(
        1,
        feedback.visual.strokeColor,
        feedback.visual.strokeAlpha,
      );
    marker.active
      .setPosition(area.x + area.width / 2, area.y + area.height / 2)
      .setSize(area.width, area.height)
      .setAlpha(isActive ? 0.86 : 0)
      .setVisible(isActive);
    marker.broken
      .setPosition(area.x + area.width / 2, area.y + area.height / 2)
      .setSize(area.width, area.height)
      .setAlpha(isBrokenBlock ? 0.82 : 0)
      .setVisible(isBrokenBlock);
  }

  private syncBossMarkers(): void {
    if (!this.level || !this.roomState) {
      this.bossMarkers.forEach((marker) => {
        marker.sprite.destroy();
        marker.health.destroy();
        marker.weakPoint.destroy();
      });
      this.bossMarkers.clear();
      return;
    }

    const activeBossIds = new Set<BossId>();

    (this.level.bosses ?? []).forEach((boss) => {
      const state = this.roomState?.bosses[boss.id];

      if (!state) {
        return;
      }

      activeBossIds.add(boss.id);

      const marker =
        this.bossMarkers.get(boss.id) ?? this.createBossMarker(boss);

      this.updateBossMarker(boss, state, marker);
      this.bossMarkers.set(boss.id, marker);
    });

    this.bossMarkers.forEach((marker, bossId) => {
      if (activeBossIds.has(bossId)) {
        return;
      }

      marker.sprite.destroy();
      marker.health.destroy();
      marker.weakPoint.destroy();
      this.bossMarkers.delete(bossId);
    });
  }

  private updateBossMarker(
    boss: BossDefinition,
    state: RoomRuntimeState["bosses"][BossId],
    marker: BossMarker,
  ): void {
    const hitbox = getBossRuntimeHitbox(boss, state);
    const isDefeated = state.state === "defeated" || state.healthRemaining <= 0;

    marker.sprite
      .setPosition(hitbox.x + hitbox.width / 2, hitbox.y + hitbox.height / 2)
      .setDisplaySize(hitbox.width, hitbox.height)
      .setDepth(VISUAL_READABILITY_DEPTHS.bossBody)
      .setFlipX(state.facing === "left")
      .setVisible(!isDefeated)
      .setAlpha(state.state === "inactive" ? 0.45 : 1);
    marker.sprite.clearTint();

    if (state.invulnerabilityRemainingMs > 0) {
      marker.sprite.setTint(VISUAL_READABILITY_SEMANTIC_COLORS.boss.primary);
    }

    this.drawBossHealthIndicator(boss, state, marker.health);
    this.drawBossWeakPointCrystal(boss, state, marker.weakPoint);
  }

  private syncBossAttackMarkers(): void {
    this.clearBossAttackMarkers();

    if (!this.level || !this.roomState) {
      return;
    }

    getBossAttackTellAreas(this.level.bosses, this.roomState).forEach(
      (area) => {
        this.bossTellMarkers.push(
          this.add
            .rectangle(
              area.x + area.width / 2,
              area.y + area.height / 2,
              area.width,
              area.height,
              VISUAL_READABILITY_SEMANTIC_COLORS.boss.primary,
              0.16,
            )
            .setStrokeStyle(
              1,
              VISUAL_READABILITY_SEMANTIC_COLORS.boss.outline,
              0.58,
            )
            .setDepth(VISUAL_READABILITY_DEPTHS.trapThreat),
        );
      },
    );

    getBossActiveAttackHitboxes(this.level.bosses, this.roomState).forEach(
      (area) => {
        this.bossAttackMarkers.push(
          this.add
            .rectangle(
              area.x + area.width / 2,
              area.y + area.height / 2,
              area.width,
              area.height,
              VISUAL_READABILITY_SEMANTIC_COLORS.boss.primary,
              0.34,
            )
            .setStrokeStyle(
              1,
              VISUAL_READABILITY_SEMANTIC_COLORS.boss.primary,
              0.76,
            )
            .setDepth(VISUAL_READABILITY_DEPTHS.directHazard),
        );
      },
    );
  }

  private syncBossProjectileMarkers(): void {
    if (!this.level || !this.roomState) {
      this.bossProjectileMarkers.forEach((marker) => marker.destroy());
      this.bossProjectileMarkers.clear();
      return;
    }

    const activeProjectileIds = new Set<string>();
    const bosses = this.level.bosses;

    this.roomState.bossProjectiles.forEach((projectile) => {
      activeProjectileIds.add(projectile.id);

      const hitbox = getBossProjectileHitbox(projectile);
      const marker =
        this.bossProjectileMarkers.get(projectile.id) ??
        this.add
          .image(
            hitbox.x + hitbox.width / 2,
            hitbox.y + hitbox.height / 2,
            getBossProjectileTextureKey(projectile, bosses),
          )
          .setOrigin(0.5)
          .setAlpha(0.94)
          .setDepth(VISUAL_READABILITY_DEPTHS.trapProjectile);

      marker
        .setTexture(getBossProjectileTextureKey(projectile, bosses))
        .setPosition(hitbox.x + hitbox.width / 2, hitbox.y + hitbox.height / 2)
        .setDisplaySize(hitbox.width, hitbox.height)
        .setDepth(VISUAL_READABILITY_DEPTHS.trapProjectile);

      this.bossProjectileMarkers.set(projectile.id, marker);
    });

    this.bossProjectileMarkers.forEach((marker, projectileId) => {
      if (activeProjectileIds.has(projectileId)) {
        return;
      }

      marker.destroy();
      this.bossProjectileMarkers.delete(projectileId);
    });
  }

  private drawBossHealthIndicator(
    boss: BossDefinition,
    state: RoomRuntimeState["bosses"][BossId],
    marker: Phaser.GameObjects.Graphics,
  ): void {
    const indicator = getBossBodyHealthIndicator(boss, state);

    marker.clear();

    if (!indicator.visible) {
      return;
    }

    marker
      .fillStyle(indicator.frameColor, indicator.frameAlpha)
      .fillRect(
        indicator.frame.x,
        indicator.frame.y,
        indicator.frame.width,
        indicator.frame.height,
      )
      .lineStyle(1, indicator.outlineColor, indicator.outlineAlpha)
      .strokeRect(
        indicator.frame.x,
        indicator.frame.y,
        indicator.frame.width,
        indicator.frame.height,
      );

    indicator.pips.forEach((pip) => {
      marker
        .fillStyle(pip.fillColor, pip.alpha)
        .fillRect(pip.area.x, pip.area.y, pip.area.width, pip.area.height);
    });
  }

  private drawBossWeakPointCrystal(
    boss: BossDefinition,
    state: RoomRuntimeState["bosses"][BossId],
    marker: Phaser.GameObjects.Graphics,
  ): void {
    const crystal = getBossWeakPointCrystalFeedback(boss, state);

    marker.clear();

    if (!crystal.visible) {
      return;
    }

    const { area } = crystal;
    const centerX = area.x + area.width / 2;
    const centerY = area.y + area.height / 2;

    if (crystal.pulseAlpha > 0) {
      marker
        .fillStyle(crystal.pulseColor, crystal.pulseAlpha)
        .fillEllipse(centerX, centerY, area.width + 8, area.height + 8);
    }

    marker
      .fillStyle(crystal.fillColor, crystal.fillAlpha)
      .lineStyle(1, crystal.strokeColor, crystal.strokeAlpha)
      .beginPath()
      .moveTo(centerX, area.y)
      .lineTo(area.x + area.width, centerY)
      .lineTo(centerX, area.y + area.height)
      .lineTo(area.x, centerY)
      .closePath()
      .fillPath()
      .strokePath();
  }

  private refreshRoomSolids(): void {
    if (!this.level || !this.roomState) {
      this.solids = [];
      return;
    }

    this.solids = [
      ...this.getBaseRoomSolidAreas(),
      ...getEnergyTargetSolidAreas(
        getLevelEnergyTargets(this.level),
        this.roomState,
      ),
    ];
  }

  private getBaseRoomSolidAreas(): readonly RectLike[] {
    if (!this.level || !this.roomState) {
      return [];
    }

    const terrainSolids = removeDisabledTrapSolids(
      getSolidTerrainAreas(this.level),
      this.level.traps,
      this.roomState,
    );

    return [
      ...terrainSolids,
      ...getInteractiveObjectSolidAreas(
        this.level.interactiveObjects,
        this.roomState,
      ),
    ];
  }

  private getCyanBurstBlockingSolids(): readonly RectLike[] {
    return [
      ...this.getBaseRoomSolidAreas(),
      ...this.getActiveBossEnergyBlockingHitboxes(),
    ];
  }

  private getCyanSparkBlockingSolids(): readonly RectLike[] {
    return [...this.solids, ...this.getActiveBossEnergyBlockingHitboxes()];
  }

  private getActiveBossEnergyBlockingHitboxes(): readonly RectLike[] {
    if (!this.level || !this.roomState) {
      return [];
    }

    return getBossEnergyBlockingHitboxes(this.level.bosses, this.roomState);
  }

  private syncProjectileMarkers(): void {
    if (!this.roomState) {
      this.projectileMarkers.forEach((marker) => marker.destroy());
      this.projectileMarkers.clear();
      this.projectileTrailMarkers.forEach((marker) => marker.destroy());
      this.projectileTrailMarkers.clear();
      return;
    }

    const activeProjectileIds = new Set<string>();

    this.roomState.projectiles.forEach((projectile) => {
      activeProjectileIds.add(projectile.id);

      const hitbox = getProjectileHitbox(projectile);
      const trailFeedback = getProjectileTrailFeedback(
        hitbox,
        projectile.velocity,
      );
      const trailMarker =
        this.projectileTrailMarkers.get(projectile.id) ??
        this.add.rectangle(
          trailFeedback.area.x + trailFeedback.area.width / 2,
          trailFeedback.area.y + trailFeedback.area.height / 2,
          trailFeedback.area.width,
          trailFeedback.area.height,
          trailFeedback.color,
          trailFeedback.alpha,
        );
      const marker =
        this.projectileMarkers.get(projectile.id) ??
        this.add
          .image(
            hitbox.x + hitbox.width / 2,
            hitbox.y + hitbox.height / 2,
            getProjectileTextureKey(),
          )
          .setOrigin(0.5)
          .setDepth(VISUAL_READABILITY_DEPTHS.trapProjectile);

      trailMarker
        .setPosition(
          trailFeedback.area.x + trailFeedback.area.width / 2,
          trailFeedback.area.y + trailFeedback.area.height / 2,
        )
        .setSize(trailFeedback.area.width, trailFeedback.area.height)
        .setFillStyle(trailFeedback.color, trailFeedback.alpha)
        .setDepth(PLAYER_EFFECT_DEPTHS.trail);

      marker.setPosition(
        hitbox.x + hitbox.width / 2,
        hitbox.y + hitbox.height / 2,
      );
      marker.setDisplaySize(hitbox.width, hitbox.height);
      marker.setDepth(VISUAL_READABILITY_DEPTHS.trapProjectile);
      this.projectileTrailMarkers.set(projectile.id, trailMarker);
      this.projectileMarkers.set(projectile.id, marker);
    });

    this.projectileMarkers.forEach((marker, projectileId) => {
      if (activeProjectileIds.has(projectileId)) {
        return;
      }

      marker.destroy();
      this.projectileMarkers.delete(projectileId);
    });
    this.projectileTrailMarkers.forEach((marker, projectileId) => {
      if (activeProjectileIds.has(projectileId)) {
        return;
      }

      marker.destroy();
      this.projectileTrailMarkers.delete(projectileId);
    });
  }

  private syncCyanSparkProjectileMarkers(): void {
    const activeProjectileIds = new Set<string>();

    this.cyanSparkProjectiles.forEach((projectile) => {
      activeProjectileIds.add(projectile.id);

      const hitbox = getCyanSparkProjectileHitbox(projectile);
      const marker =
        this.cyanSparkProjectileMarkers.get(projectile.id) ??
        this.add
          .image(
            hitbox.x + hitbox.width / 2,
            hitbox.y + hitbox.height / 2,
            ASSET_KEYS.ENERGY_CYAN_SPARK_PROJECTILE,
          )
          .setOrigin(0.5)
          .setAlpha(0.92)
          .setDepth(PLAYER_EFFECT_DEPTHS.energyShot);

      marker
        .setPosition(hitbox.x + hitbox.width / 2, hitbox.y + hitbox.height / 2)
        .setDisplaySize(8, 8)
        .setFlipX(projectile.direction < 0);

      this.cyanSparkProjectileMarkers.set(projectile.id, marker);
    });

    this.cyanSparkProjectileMarkers.forEach((marker, projectileId) => {
      if (activeProjectileIds.has(projectileId)) {
        return;
      }

      marker.destroy();
      this.cyanSparkProjectileMarkers.delete(projectileId);
    });
  }

  private syncCyanBurstBeamMarker(): void {
    if (
      !this.player ||
      !this.cyanBurstLockedFacing ||
      this.playerEnergyState.activity !== "burst-firing" ||
      this.playerEnergyState.burstDurationRemainingMs <= 0
    ) {
      this.clearCyanBurstBeamMarker();
      return;
    }

    const beam = resolveCyanBurstBeam({
      origin: this.player.getPhysicsState().position,
      facing: this.cyanBurstLockedFacing,
      solids: this.getCyanBurstBlockingSolids(),
    });
    const { area } = beam;
    const marker =
      this.cyanBurstBeamMarker ??
      this.add
        .tileSprite(
          area.x + area.width / 2,
          area.y + area.height / 2,
          area.width,
          area.height,
          ASSET_KEYS.ENERGY_CYAN_BURST_BEAM,
        )
        .setOrigin(0.5)
        .setAlpha(clampWideEffectAlpha(0.62))
        .setDepth(PLAYER_EFFECT_DEPTHS.energyShot);

    marker
      .setPosition(area.x + area.width / 2, area.y + area.height / 2)
      .setSize(area.width, area.height)
      .setAlpha(clampWideEffectAlpha(0.62));
    marker.tilePositionX =
      this.cyanBurstLockedFacing === "right"
        ? -this.time.now * 0.12
        : this.time.now * 0.12;

    this.cyanBurstBeamMarker = marker;
  }

  private drawTrapCrack(
    crack: Phaser.GameObjects.Graphics,
    area: RectLike,
    alpha: number,
  ): void {
    crack.clear();

    if (alpha <= 0) {
      return;
    }

    crack
      .lineStyle(1, VISUAL_READABILITY_SEMANTIC_COLORS.trap.danger, alpha)
      .beginPath()
      .moveTo(area.x + area.width * 0.18, area.y + area.height * 0.28)
      .lineTo(area.x + area.width * 0.44, area.y + area.height * 0.52)
      .lineTo(area.x + area.width * 0.32, area.y + area.height * 0.78)
      .moveTo(area.x + area.width * 0.56, area.y + area.height * 0.22)
      .lineTo(area.x + area.width * 0.72, area.y + area.height * 0.48)
      .lineTo(area.x + area.width * 0.62, area.y + area.height * 0.82)
      .strokePath();
  }

  private playTrapVisualActivation(
    trap: LevelDefinition["traps"][number],
    marker: TrapMarker,
    feedback: ReturnType<typeof getTrapFeedback>,
  ): void {
    if (feedback.visual.state === "armed") {
      return;
    }

    if (trap.kind === "spike-pop" && marker.body) {
      this.tweens.killTweensOf(marker.body);
      marker.body.setAlpha(0.24);
      this.tweens.add({
        targets: marker.body,
        alpha: feedback.visual.bodyAlpha,
        duration: 120,
        ease: "Quad.easeOut",
      });
    }

    if (trap.kind === "projectile" && marker.tell) {
      this.tweens.killTweensOf(marker.tell);
      marker.tell.setAlpha(0.9);
      this.tweens.add({
        targets: marker.tell,
        alpha: feedback.visual.tellAlpha,
        duration: 160,
        ease: "Quad.easeOut",
      });
    }
  }

  private scheduleRespawnRecoveryEnd(): void {
    this.clearRespawnRecoveryTimer();
    this.respawnRecoveryTimer = this.time.delayedCall(
      RESPAWN_RECOVERY_MS,
      () => {
        this.player?.finishRespawn();
        this.respawnRecoveryTimer = undefined;
      },
    );
  }

  private clearRespawnTimer(): void {
    this.respawnTimer?.remove(false);
    this.respawnTimer = undefined;
  }

  private clearRespawnRecoveryTimer(): void {
    this.respawnRecoveryTimer?.remove(false);
    this.respawnRecoveryTimer = undefined;
  }

  private updateCheckpointMarkers(activeCheckpointId: CheckpointId): void {
    this.checkpointMarkers.forEach((marker, checkpointId) => {
      const isActive = checkpointId === activeCheckpointId;

      marker.setTexture(getCheckpointTextureKey(isActive));
      marker.setAlpha(isActive ? 0.95 : 0.65);
    });
  }

  private configureCamera(): void {
    if (!this.player || !this.level) {
      return;
    }

    const { bounds } = this.level;

    this.cameras.main
      .setBounds(bounds.x, bounds.y, bounds.width, bounds.height)
      .setRoundPixels(true)
      .startFollow(this.player.getSprite(), true, 1, 1)
      .setDeadzone(CAMERA_DEADZONE_SIZE.width, CAMERA_DEADZONE_SIZE.height);
  }

  private pauseLevel(): void {
    if (gameStateStore.getSnapshot().isPaused) {
      return;
    }

    this.clearTemporaryEnergyState();
    gameStateStore.setPaused(true);
    this.scene.pause();
    this.scene.launch(SCENE_KEYS.PAUSE);
  }

  private toggleMute(): void {
    gameStateStore.toggleMuted();
  }

  private getPlayerFacingDirection(): DashDirection {
    return this.player?.getVisualState().facing === "left" ? -1 : 1;
  }

  private playPlayerSfx(audioId: string): void {
    emitGameEvent(GAME_EVENTS.AUDIO_PLAY_REQUESTED, {
      audioId,
      category: "sfx",
    });
  }

  private playLevelSfx(audioId: string): void {
    emitGameEvent(GAME_EVENTS.AUDIO_PLAY_REQUESTED, {
      audioId,
      category: "sfx",
    });
  }

  private emitEnergyAudioCues(cues: readonly EnergyAudioCue[]): void {
    cues.forEach((cue) => {
      if (cue.action === "stop") {
        emitGameEvent(GAME_EVENTS.AUDIO_STOP_REQUESTED, {
          audioId: cue.audioId,
        });
        return;
      }

      emitGameEvent(GAME_EVENTS.AUDIO_PLAY_REQUESTED, {
        audioId: cue.audioId,
        category: cue.category,
        ...(cue.loop === undefined ? {} : { loop: cue.loop }),
      });
    });
  }

  private playGameplayMusic(): void {
    emitGameEvent(GAME_EVENTS.AUDIO_PLAY_REQUESTED, {
      audioId: MUSIC_AUDIO_IDS.MVP_LOOP,
      category: "music",
    });
  }

  private setPlayerEnergyState(state: PlayerEnergyState): void {
    this.playerEnergyState = state;
    this.syncPlayerEnergyHud();
  }

  private syncPlayerEnergyHud(): void {
    gameStateStore.setPlayerEnergyHudState({
      current: this.playerEnergyState.energy,
      max: PLAYER_ENERGY_MAX,
      isCharging: this.playerEnergyState.activity === "charging",
    });
  }

  private triggerPlayerEnergyHudFeedback(
    result: ReturnType<typeof updatePlayerEnergy>,
  ): void {
    if (result.effects.includes("cyan-energy-full")) {
      gameStateStore.triggerPlayerEnergyHudFeedback("full");
    }

    if (
      result.rejections.some(
        (rejection) => rejection.reason === "insufficient-energy",
      )
    ) {
      gameStateStore.triggerPlayerEnergyHudFeedback("insufficient");
    }
  }

  private resetPlayerEnergyForCheckpoint(initialEnergy: number): void {
    this.emitEnergyAudioCues(getStopPlayerEnergyAudioCues());
    this.setPlayerEnergyState(resetPlayerEnergyState(initialEnergy));
    this.secondaryActionIntentState = createInitialSecondaryActionIntentState();
    this.cyanBurstLockedFacing = undefined;
    this.cyanBurstActiveAttackId = undefined;
    this.cyanBurstHitBossIds.clear();
    this.cyanSparkAnimationRemainingMs = 0;
    this.clearCyanSparkProjectiles();
    this.clearCyanBurstBeamMarker();
  }

  private resetTemporaryEnergyStateForCheckpoint(): void {
    const { activeCheckpoint } = gameStateStore.getSnapshot();

    this.resetPlayerEnergyForCheckpoint(activeCheckpoint.initialEnergy);
  }

  private clearTemporaryEnergyState(): void {
    this.emitEnergyAudioCues(getStopPlayerEnergyAudioCues());
    this.setPlayerEnergyState(
      clearPlayerEnergyTemporaryState(this.playerEnergyState),
    );
    this.secondaryActionIntentState = createInitialSecondaryActionIntentState();
    this.cyanBurstLockedFacing = undefined;
    this.cyanBurstActiveAttackId = undefined;
    this.cyanBurstHitBossIds.clear();
    this.cyanSparkAnimationRemainingMs = 0;
    this.clearCyanSparkProjectiles();
    this.clearCyanBurstBeamMarker();
  }

  private clearCyanSparkProjectiles(): void {
    this.cyanSparkProjectiles = [];
    this.cyanSparkProjectileMarkers.forEach((marker) => {
      marker.destroy();
    });
    this.cyanSparkProjectileMarkers.clear();
  }

  private clearCyanBurstBeamMarker(): void {
    this.cyanBurstBeamMarker?.destroy();
    this.cyanBurstBeamMarker = undefined;
  }

  private clearBossAttackMarkers(): void {
    this.bossTellMarkers.forEach((marker) => marker.destroy());
    this.bossTellMarkers.length = 0;
    this.bossAttackMarkers.forEach((marker) => marker.destroy());
    this.bossAttackMarkers.length = 0;
  }

  private cleanup(): void {
    this.emitEnergyAudioCues(getStopPlayerEnergyAudioCues());
    this.clearRespawnTimer();
    this.clearRespawnRecoveryTimer();
    this.playerAura?.destroy();
    this.playerAura = undefined;
    this.input.keyboard?.off("keydown-ESC", this.pauseLevel, this);
    this.input.keyboard?.off("keydown-M", this.toggleMute, this);
    this.actionInput?.destroy();
    this.actionInput = undefined;
    this.player?.destroy();
    this.player = undefined;
    this.level = undefined;
    this.roomState = undefined;
    this.solids = [];
    this.jumpState = createInitialJumpMovementState();
    this.dashState = createInitialDashMovementState();
    this.setPlayerEnergyState(createInitialPlayerEnergyState());
    this.secondaryActionIntentState = createInitialSecondaryActionIntentState();
    this.cyanBurstLockedFacing = undefined;
    this.cyanBurstActiveAttackId = undefined;
    this.cyanBurstHitBossIds.clear();
    this.cyanSparkAnimationRemainingMs = 0;
    this.clearCyanSparkProjectiles();
    this.clearCyanBurstBeamMarker();
    this.cyanSparkProjectileSequence = 0;
    this.cyanBurstAttackSequence = 0;
    this.levelStartedAtMs = 0;
    this.levelStartDeathCount = 0;
    this.checkpointMarkers.clear();
    this.trapMarkers.clear();
    this.itemMarkers.forEach((marker) => marker.destroy());
    this.itemMarkers.clear();
    this.interactiveObjectMarkers.forEach((marker) => marker.destroy());
    this.interactiveObjectMarkers.clear();
    this.energyTargetMarkers.forEach((marker) => {
      marker.base.destroy();
      marker.active.destroy();
      marker.broken.destroy();
    });
    this.energyTargetMarkers.clear();
    this.bossMarkers.forEach((marker) => {
      marker.sprite.destroy();
      marker.health.destroy();
      marker.weakPoint.destroy();
    });
    this.bossMarkers.clear();
    this.clearBossAttackMarkers();
    this.bossProjectileMarkers.forEach((marker) => marker.destroy());
    this.bossProjectileMarkers.clear();
    this.projectileMarkers.forEach((marker) => marker.destroy());
    this.projectileMarkers.clear();
    this.projectileTrailMarkers.forEach((marker) => marker.destroy());
    this.projectileTrailMarkers.clear();
    this.hasCompletedLevel = false;
    this.scene.stop(SCENE_KEYS.HUD);
  }
}
