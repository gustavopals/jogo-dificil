import Phaser from "phaser";

import {
  getRequiredLevelDefinition,
  type LevelDefinition,
} from "../../data/levels";
import { PLACEHOLDER_TILESET_ASSET_KEYS } from "../../data/art";
import type {
  CheckpointId,
  InteractiveObjectId,
  ItemId,
  RectLike,
  TrapId,
} from "../../shared";
import { PLAYER_AUDIO_IDS } from "../../data/audio";
import { PLAYER_SIZE, TILE_SIZE_PX } from "../constants";
import { Player } from "../entities";
import { ActionInput } from "../input";
import {
  calculateHorizontalVelocity,
  calculateJumpMovement,
  createInitialJumpMovementState,
  getHorizontalDirection,
  getWorldHitbox,
  resolveKinematicCollisions,
  type JumpMovementState,
  type KinematicBodyCollisionConfig,
} from "../physics";
import { gameStateStore } from "../systems/game-state";
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
  collectLevelItem,
  findTouchedAvailableItems,
  getItemFeedback,
} from "../systems/level-items";
import {
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
  getPlayerActionAudioId,
  shouldPlayLandingAudio,
} from "../systems/player-audio-feedback";
import {
  getSolidTerrainAreas,
  getTerrainPlaceholderTextureKey,
} from "../systems/level-terrain";
import {
  findTriggeredPositionTraps,
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
  createInitialRoomState,
  resetRoomStateForRespawn,
  type RoomRuntimeState,
} from "../systems/room-state";
import { SCENE_KEYS } from "./scene-keys";

const CAMERA_DEADZONE_SIZE = {
  width: TILE_SIZE_PX * 8,
  height: TILE_SIZE_PX * 5,
} as const;
const MARKER_COLORS = {
  spawn: 0x80d7c2,
  exit: 0xe76f51,
  checkpointInactive: 0xf4d35e,
  checkpointActive: 0x80d7c2,
} as const;

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
  readonly body?: Phaser.GameObjects.Rectangle;
};

export class LevelScene extends Phaser.Scene {
  private player?: Player;
  private actionInput?: ActionInput;
  private jumpState: JumpMovementState = createInitialJumpMovementState();
  private level?: LevelDefinition;
  private roomState?: RoomRuntimeState;
  private solids: readonly RectLike[] = [];
  private readonly checkpointMarkers = new Map<
    CheckpointId,
    Phaser.GameObjects.Rectangle
  >();
  private readonly trapMarkers = new Map<TrapId, TrapMarker>();
  private readonly itemMarkers = new Map<
    ItemId,
    Phaser.GameObjects.Rectangle
  >();
  private readonly interactiveObjectMarkers = new Map<
    InteractiveObjectId,
    Phaser.GameObjects.Rectangle
  >();
  private readonly projectileMarkers = new Map<
    string,
    Phaser.GameObjects.Rectangle
  >();
  private respawnTimer?: Phaser.Time.TimerEvent;
  private respawnRecoveryTimer?: Phaser.Time.TimerEvent;
  private hasCompletedLevel = false;

  public constructor() {
    super(SCENE_KEYS.LEVEL);
  }

  public create(): void {
    this.scene.launch(SCENE_KEYS.HUD);
    gameStateStore.setPaused(false);
    Player.registerAnimations(this);
    this.actionInput = new ActionInput(this);
    this.jumpState = createInitialJumpMovementState();

    const { activeCheckpoint, currentLevelId } = gameStateStore.getSnapshot();
    this.level = getRequiredLevelDefinition(currentLevelId);
    this.roomState = createInitialRoomState(this.level);
    this.refreshRoomSolids();
    this.hasCompletedLevel = false;

    this.drawLevelBackground(this.level);
    this.drawTerrain(this.level);
    this.drawHazards(this.level);
    this.drawTraps(this.level, this.roomState);
    this.drawItems(this.level, this.roomState);
    this.drawInteractiveObjects(this.level, this.roomState);
    this.drawLevelMarkers(this.level, activeCheckpoint.id);

    this.player = new Player(this, {
      id: "player-pino",
      position:
        activeCheckpoint.levelId === this.level.id
          ? activeCheckpoint
          : createLevelStartCheckpoint(this.level),
      facing: "right",
    });
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

    this.updateTrapRuntime(delta);
    this.updatePlayerMovement(delta);
    if (this.updatePlayerDeath()) {
      return;
    }

    this.updateTrapTriggers();
    if (this.updatePlayerDeath()) {
      return;
    }

    this.updateItemCollection();
    this.updateInteractiveObjectActions();
    this.updateLevelProgress();
  }

  private updatePlayerMovement(delta: number): void {
    if (!this.player || !this.actionInput) {
      return;
    }

    const { position, velocity } = this.player.getPhysicsState();
    const isGrounded = this.player.getPhysicsState().isGrounded;
    const direction = getHorizontalDirection({
      isMovingLeft: this.actionInput.isDown("move-left"),
      isMovingRight: this.actionInput.isDown("move-right"),
    });
    const horizontalVelocity = calculateHorizontalVelocity({
      currentVelocityX: velocity.x,
      direction,
      isGrounded,
      deltaMs: delta,
    });
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

    this.player.updateMovement({
      position: collision.position,
      velocity: collision.velocity,
      ...(direction !== 0
        ? { facing: direction === -1 ? "left" : "right" }
        : {}),
      isGrounded: collision.isGrounded,
    });

    if (jumpMovement.didJump) {
      this.playPlayerSfx(PLAYER_AUDIO_IDS.JUMP);
    }

    if (
      shouldPlayLandingAudio({
        wasGrounded: isGrounded,
        isGrounded: collision.isGrounded,
        velocityY: jumpMovement.velocityY,
      })
    ) {
      this.playPlayerSfx(PLAYER_AUDIO_IDS.LAND);
    }
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
          .setAlpha(0.35);
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
        .setAlpha(0.7);
    });
  }

  private drawSpikeHazard(area: RectLike, textureKey: string): void {
    const spikeWidth = TILE_SIZE_PX;

    for (let x = area.x; x < area.x + area.width; x += spikeWidth) {
      const width = Math.min(spikeWidth, area.x + area.width - x);

      this.add
        .image(x + width / 2, area.y + area.height, textureKey)
        .setOrigin(0.5, 1)
        .setDisplaySize(width, area.height);
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

      const bodyMarker = trap.area
        ? this.add
            .rectangle(
              trap.area.x + trap.area.width / 2,
              trap.area.y + trap.area.height / 2,
              trap.area.width,
              trap.area.height,
              feedback.visual.bodyColor,
              feedback.visual.bodyAlpha,
            )
            .setStrokeStyle(1, feedback.visual.bodyColor, 0.85)
        : undefined;

      this.trapMarkers.set(trap.id, {
        trigger: triggerMarker,
        ...(bodyMarker ? { body: bodyMarker } : {}),
      });
    });
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
        .rectangle(
          hitbox.x + hitbox.width / 2,
          hitbox.y + hitbox.height / 2,
          hitbox.width,
          hitbox.height,
          feedback.visual.fillColor,
          feedback.visual.fillAlpha,
        )
        .setStrokeStyle(
          1,
          feedback.visual.strokeColor,
          feedback.visual.strokeAlpha,
        );

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
      .rectangle(
        exitArea.x + exitArea.width / 2,
        exitArea.y + exitArea.height / 2,
        exitArea.width,
        exitArea.height,
        MARKER_COLORS.exit,
      )
      .setAlpha(0.75);

    level.checkpoints.forEach((checkpoint) => {
      const { area } = checkpoint;
      const marker = this.add
        .rectangle(
          area.x + area.width / 2,
          area.y + area.height / 2,
          area.width,
          area.height,
          MARKER_COLORS.checkpointInactive,
        )
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
      gameStateStore.setActiveCheckpoint({
        id: touchedCheckpoint.id,
        levelId: this.level.id,
        x: touchedCheckpoint.position.x,
        y: touchedCheckpoint.position.y,
      });
      this.updateCheckpointMarkers(touchedCheckpoint.id);
    }

    if (!this.hasCompletedLevel && isTouchingExit(playerHitbox, this.level)) {
      this.hasCompletedLevel = true;
      this.completeLevel();
    }
  }

  private completeLevel(): void {
    if (!this.level) {
      return;
    }

    const { deathCount } = gameStateStore.getSnapshot();
    const nextLevelId = this.level.exit.nextLevelId;

    gameStateStore.completeLevel(nextLevelId);
    this.scene.start(SCENE_KEYS.LEVEL_TRANSITION, {
      completedLevelId: this.level.id,
      nextLevelId,
      deathCount,
    });
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
      this.killPlayer(touchedHazard.cause);

      return true;
    }

    const touchedTrapThreat = this.roomState
      ? findTouchedTrapThreat(playerHitbox, this.level.traps, this.roomState)
      : undefined;

    if (touchedTrapThreat) {
      this.killPlayer(touchedTrapThreat.cause);

      return true;
    }

    if (!isBelowLevelDeathPlane(playerHitbox, this.level)) {
      return false;
    }

    this.killPlayer("fall");

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

  private updateInteractiveObjectActions(): void {
    if (!this.level || !this.player || !this.actionInput || !this.roomState) {
      return;
    }

    const pressedAction = this.actionInput.wasPressed("primary")
      ? "primary"
      : this.actionInput.wasPressed("secondary")
        ? "secondary"
        : undefined;

    if (!pressedAction) {
      return;
    }

    this.playPlayerSfx(getPlayerActionAudioId(pressedAction));

    const playerHitbox = getWorldHitbox(
      this.player.getPhysicsState().position,
      PLAYER_COLLISION_BODY,
    );
    const triggeredObjects = findTriggeredInteractiveObjects(
      playerHitbox,
      this.level.interactiveObjects,
      this.roomState,
      pressedAction,
    );

    triggeredObjects.forEach(({ object }) => {
      if (!this.roomState) {
        return;
      }

      this.roomState = activateInteractiveObject(this.roomState, object);
      this.refreshRoomSolids();
      this.updateInteractiveObjectMarkers();
    });
  }

  private killPlayer(cause: DeathCause): void {
    if (!this.player) {
      return;
    }

    if (gameStateStore.getSnapshot().playerLifeState === "dead") {
      return;
    }

    const { position } = this.player.getPhysicsState();

    this.clearRespawnRecoveryTimer();
    this.player.die();
    this.jumpState = createInitialJumpMovementState();
    gameStateStore.registerDeath(cause, position);
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
    this.scheduleRespawnRecoveryEnd();
  }

  private resetRoomTransientState(activeCheckpointId: CheckpointId): void {
    if (this.level && this.roomState) {
      this.roomState = resetRoomStateForRespawn(this.roomState, this.level);
      this.refreshRoomSolids();
      this.syncProjectileMarkers();
    }

    this.jumpState = createInitialJumpMovementState();
    this.hasCompletedLevel = false;
    this.updateTrapMarkers();
    this.updateItemMarkers();
    this.updateInteractiveObjectMarkers();
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

    marker.body?.setFillStyle(
      feedback.visual.bodyColor,
      feedback.visual.bodyAlpha,
    );
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

    marker
      .setFillStyle(feedback.visual.fillColor, feedback.visual.fillAlpha)
      .setStrokeStyle(
        1,
        feedback.visual.strokeColor,
        feedback.visual.strokeAlpha,
      );
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

  private refreshRoomSolids(): void {
    if (!this.level || !this.roomState) {
      this.solids = [];
      return;
    }

    const terrainSolids = removeDisabledTrapSolids(
      getSolidTerrainAreas(this.level),
      this.level.traps,
      this.roomState,
    );

    this.solids = [
      ...terrainSolids,
      ...getInteractiveObjectSolidAreas(
        this.level.interactiveObjects,
        this.roomState,
      ),
    ];
  }

  private syncProjectileMarkers(): void {
    if (!this.roomState) {
      this.projectileMarkers.forEach((marker) => marker.destroy());
      this.projectileMarkers.clear();
      return;
    }

    const activeProjectileIds = new Set<string>();

    this.roomState.projectiles.forEach((projectile) => {
      activeProjectileIds.add(projectile.id);

      const hitbox = getProjectileHitbox(projectile);
      const marker =
        this.projectileMarkers.get(projectile.id) ??
        this.add
          .rectangle(
            hitbox.x + hitbox.width / 2,
            hitbox.y + hitbox.height / 2,
            hitbox.width,
            hitbox.height,
            0xf4d35e,
            0.9,
          )
          .setStrokeStyle(1, 0x050608, 0.85);

      marker.setPosition(
        hitbox.x + hitbox.width / 2,
        hitbox.y + hitbox.height / 2,
      );
      this.projectileMarkers.set(projectile.id, marker);
    });

    this.projectileMarkers.forEach((marker, projectileId) => {
      if (activeProjectileIds.has(projectileId)) {
        return;
      }

      marker.destroy();
      this.projectileMarkers.delete(projectileId);
    });
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
      marker.setFillStyle(
        checkpointId === activeCheckpointId
          ? MARKER_COLORS.checkpointActive
          : MARKER_COLORS.checkpointInactive,
      );
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

    gameStateStore.setPaused(true);
    this.scene.pause();
    this.scene.launch(SCENE_KEYS.PAUSE);
  }

  private toggleMute(): void {
    gameStateStore.toggleMuted();
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

  private cleanup(): void {
    this.clearRespawnTimer();
    this.clearRespawnRecoveryTimer();
    this.input.keyboard?.off("keydown-ESC", this.pauseLevel, this);
    this.input.keyboard?.off("keydown-M", this.toggleMute, this);
    this.actionInput?.destroy();
    this.actionInput = undefined;
    this.player?.destroy();
    this.player = undefined;
    this.level = undefined;
    this.roomState = undefined;
    this.solids = [];
    this.checkpointMarkers.clear();
    this.trapMarkers.clear();
    this.itemMarkers.forEach((marker) => marker.destroy());
    this.itemMarkers.clear();
    this.interactiveObjectMarkers.forEach((marker) => marker.destroy());
    this.interactiveObjectMarkers.clear();
    this.projectileMarkers.forEach((marker) => marker.destroy());
    this.projectileMarkers.clear();
    this.hasCompletedLevel = false;
    this.scene.stop(SCENE_KEYS.HUD);
  }
}
