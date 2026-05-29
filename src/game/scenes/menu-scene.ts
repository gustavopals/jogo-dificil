import Phaser from "phaser";

import {
  applyPinoSpriteFrame,
  applyPinoVisualDisplaySize,
  PINO_ANIMATIONS,
  PINO_FRAME_IDS,
  resolveInitialPinoSpriteFrame,
} from "../../data/characters/pino-animations";
import { MUSIC_AUDIO_IDS } from "../../data/audio";
import { getRequiredLevelDefinition } from "../../data/levels";
import { GAME_BACKGROUND_COLOR, TILE_SIZE_PX } from "../constants";
import {
  scaleLegacyFontPx,
  scaleLegacyX,
  scaleLegacyY,
} from "../scale";
import { emitGameEvent, GAME_EVENTS } from "../systems/game-events";
import { gameStateStore } from "../systems/game-state";
import { resolveLevelInitialEnergy } from "../systems/level-progress";
import { formatMusicMuteStatus } from "../ui/hud";
import {
  START_SCREEN_COPY,
  START_SCREEN_LAYOUT,
  START_SCREEN_LEVEL_ID,
  START_SCREEN_MUSIC_BUTTON_STYLE,
  addDeathsToTotal,
  getTotalDeaths,
  getSessionAttempts,
  incrementSessionAttempts,
  isPointInsideStartScreenMusicButton,
  pickRandomHumorPhrase,
} from "../ui/start-screen";
import { SCENE_KEYS } from "./scene-keys";

export class MenuScene extends Phaser.Scene {
  private hasStarted = false;
  private unsubscribeState?: () => void;

  public constructor() {
    super(SCENE_KEYS.MENU);
  }

  public create(): void {
    this.hasStarted = false;

    const { deathCount } = gameStateStore.getSnapshot();

    if (deathCount > 0) {
      addDeathsToTotal(deathCount);
    }

    gameStateStore.enterMenu();
    this.playMenuMusic();
    this.cameras.main.setBackgroundColor(GAME_BACKGROUND_COLOR);

    this.drawBackdrop();
    this.drawParticles();
    this.drawStartScreen();
    this.drawMusicButton();
    this.bindStartInput();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  private drawBackdrop(): void {
    const { width, height, groundY } = START_SCREEN_LAYOUT;

    this.add.rectangle(0, 0, width, height, 0x111217).setOrigin(0);

    const skyline = this.add.graphics();
    skyline.fillStyle(0x171923, 1);
    skyline.fillRect(0, groundY - TILE_SIZE_PX * 3, width, TILE_SIZE_PX * 3);
    skyline.fillStyle(0x20232d, 1);

    for (let x = 0; x < width; x += TILE_SIZE_PX * 2) {
      const heightOffset =
        x % (TILE_SIZE_PX * 4) === 0 ? scaleLegacyY(18) : scaleLegacyY(8);

      skyline.fillRect(
        x,
        groundY - TILE_SIZE_PX * 3 - heightOffset,
        TILE_SIZE_PX,
        heightOffset,
      );
    }

    this.add.rectangle(
      width / 2,
      groundY + scaleLegacyY(16),
      width,
      scaleLegacyY(32),
      0x242630,
    );
    this.add.rectangle(width / 2, groundY, width, 2, 0x80d7c2).setAlpha(0.45);

    const hazards = this.add.graphics();
    hazards.fillStyle(0xe35d6a, 1);

    for (
      let x = width - scaleLegacyX(158);
      x < width - scaleLegacyX(90);
      x += scaleLegacyX(12)
    ) {
      hazards.fillTriangle(
        x,
        groundY,
        x + scaleLegacyX(6),
        groundY - scaleLegacyY(14),
        x + scaleLegacyX(12),
        groundY,
      );
    }
  }

  private drawParticles(): void {
    const { width, groundY } = START_SCREEN_LAYOUT;
    const particleCount = 18;
    const particles: Phaser.GameObjects.Rectangle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const size = 1 + Math.random() * 2;
      const x = Math.random() * width;
      const y = Math.random() * (groundY - scaleLegacyY(20));
      const color = Math.random() > 0.5 ? 0x80d7c2 : 0xf5f7fb;
      const alpha = 0.08 + Math.random() * 0.18;

      const particle = this.add
        .rectangle(x, y, size, size, color)
        .setAlpha(alpha);

      particles.push(particle);

      this.tweens.add({
        targets: particle,
        y: y - scaleLegacyY(15) - Math.random() * scaleLegacyY(25),
        x: x + (Math.random() - 0.5) * scaleLegacyX(30),
        alpha: 0,
        duration: 3000 + Math.random() * 4000,
        delay: Math.random() * 3000,
        repeat: -1,
        repeatDelay: Math.random() * 2000,
        ease: "Sine.easeInOut",
        onRepeat: () => {
          particle.setPosition(
            Math.random() * width,
            groundY - Math.random() * scaleLegacyY(20),
          );
          particle.setAlpha(alpha);
        },
      });
    }
  }

  private drawStartScreen(): void {
    const {
      width,
      titleY,
      subtitleY,
      humorPhraseY,
      commandY,
      statsY,
      vibeTagY,
      groundY,
      playerX,
      exitX,
    } = START_SCREEN_LAYOUT;

    this.add
      .text(width / 2, titleY, START_SCREEN_COPY.title, {
        color: "#f5f7fb",
        fontFamily: "monospace",
        fontSize: scaleLegacyFontPx(34),
      })
      .setOrigin(0.5)
      .setShadow(0, 3, "#05060a", 2);

    this.add
      .text(width / 2, subtitleY, START_SCREEN_COPY.subtitle, {
        color: "#a0a4b8",
        fontFamily: "monospace",
        fontSize: scaleLegacyFontPx(11),
      })
      .setOrigin(0.5);

    const humorPhrase = this.add
      .text(width / 2, humorPhraseY, `"${pickRandomHumorPhrase()}"`, {
        color: "#e3b341",
        fontFamily: "monospace",
        fontSize: scaleLegacyFontPx(9),
        fontStyle: "italic",
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    this.tweens.add({
      targets: humorPhrase,
      alpha: 0.35,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    const startCommand = this.add
      .text(width / 2, commandY, START_SCREEN_COPY.startCommand, {
        color: "#80d7c2",
        fontFamily: "monospace",
        fontSize: scaleLegacyFontPx(12),
      })
      .setOrigin(0.5);

    const totalDeaths = getTotalDeaths();
    const attempts = getSessionAttempts();

    const statsLines: string[] = [];

    if (totalDeaths > 0) {
      statsLines.push(`Total de mortes: ${totalDeaths}`);
    }

    if (attempts > 0) {
      statsLines.push(`Tentativa #${attempts + 1}`);
    }

    if (statsLines.length > 0) {
      this.add
        .text(width / 2, statsY, statsLines.join("   |   "), {
          color: "#e35d6a",
          fontFamily: "monospace",
          fontSize: scaleLegacyFontPx(8),
        })
        .setOrigin(0.5)
        .setAlpha(0.6);
    }

    this.add
      .text(width / 2, vibeTagY, START_SCREEN_COPY.vibeTag, {
        color: "#80d7c2",
        fontFamily: "monospace",
        fontSize: scaleLegacyFontPx(9),
      })
      .setOrigin(0.5)
      .setAlpha(0.4);

    this.tweens.add({
      targets: startCommand,
      alpha: 0.48,
      duration: 740,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.add
      .rectangle(
        exitX,
        groundY - scaleLegacyY(25),
        scaleLegacyX(28),
        scaleLegacyY(50),
        0x80d7c2,
      )
      .setAlpha(0.18)
      .setStrokeStyle(scaleLegacyX(2), 0x80d7c2, 0.85);
    this.add
      .rectangle(
        exitX,
        groundY - scaleLegacyY(4),
        scaleLegacyX(12),
        scaleLegacyY(4),
        0xf5f7fb,
      )
      .setAlpha(0.75);

    this.registerMenuAnimations();

    const initialFrame = resolveInitialPinoSpriteFrame();
    const player = this.add
      .sprite(
        playerX,
        groundY,
        initialFrame.textureKey,
        initialFrame.frame,
      )
      .setOrigin(0.5, 1);

    applyPinoVisualDisplaySize(player);
    player.setAlpha(0.95);

    this.playDanceLoop(player, playerX, groundY);
  }

  private drawMusicButton(): void {
    const button = this.add
      .rectangle(
        START_SCREEN_LAYOUT.musicButtonX,
        START_SCREEN_LAYOUT.musicButtonY,
        START_SCREEN_LAYOUT.musicButtonWidth,
        START_SCREEN_LAYOUT.musicButtonHeight,
        START_SCREEN_MUSIC_BUTTON_STYLE.fillColor,
        START_SCREEN_MUSIC_BUTTON_STYLE.fillAlpha,
      )
      .setOrigin(0, 0)
      .setStrokeStyle(
        1,
        START_SCREEN_MUSIC_BUTTON_STYLE.strokeColor,
        START_SCREEN_MUSIC_BUTTON_STYLE.strokeAlpha,
      )
      .setDepth(20)
      .setInteractive({ useHandCursor: true });

    const buttonText = this.add
      .text(
        START_SCREEN_LAYOUT.musicButtonTextX,
        START_SCREEN_LAYOUT.musicButtonTextY,
        "",
        {
          color: START_SCREEN_MUSIC_BUTTON_STYLE.textColor,
          fontFamily: "monospace",
          fontSize: scaleLegacyFontPx(
            Number.parseInt(START_SCREEN_MUSIC_BUTTON_STYLE.fontSize, 10),
          ),
        },
      )
      .setOrigin(0.5)
      .setDepth(21);

    button.on(Phaser.Input.Events.POINTER_DOWN, () => {
      gameStateStore.toggleMusicMuted();
    });

    this.unsubscribeState = gameStateStore.subscribe((state) => {
      buttonText.setText(formatMusicMuteStatus(state.isMusicMuted));
      buttonText.setColor(
        state.isMusicMuted
          ? START_SCREEN_MUSIC_BUTTON_STYLE.mutedTextColor
          : START_SCREEN_MUSIC_BUTTON_STYLE.textColor,
      );
      button.setFillStyle(
        state.isMusicMuted
          ? START_SCREEN_MUSIC_BUTTON_STYLE.mutedFillColor
          : START_SCREEN_MUSIC_BUTTON_STYLE.fillColor,
        state.isMusicMuted
          ? START_SCREEN_MUSIC_BUTTON_STYLE.mutedFillAlpha
          : START_SCREEN_MUSIC_BUTTON_STYLE.fillAlpha,
      );
    });
  }

  private registerMenuAnimations(): void {
    PINO_ANIMATIONS.forEach((animation) => {
      if (this.anims.exists(animation.key)) {
        return;
      }

      this.anims.create({
        key: animation.key,
        frames: animation.frames.map((frame) => ({
          key: frame.textureKey,
          ...(frame.frame !== undefined ? { frame: frame.frame } : {}),
        })),
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      });
    });
  }

  private playDanceLoop(
    player: Phaser.GameObjects.Sprite,
    originX: number,
    groundY: number,
  ): void {
    const baseScale = 1;
    const hopOffset = scaleLegacyX(18);
    const bigJumpHeight = scaleLegacyY(38);
    const smallHopHeight = scaleLegacyY(8);

    const resetPose = () => {
      applyPinoSpriteFrame(player, PINO_FRAME_IDS.IDLE);
      player.setScale(baseScale, baseScale);
      player.setFlipX(false);
    };

    const sequence = [
      // 1. idle bounce - "getting ready"
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - smallHopHeight,
          scaleX: baseScale * 1.075,
          scaleY: baseScale * 0.925,
          duration: 180,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => applyPinoSpriteFrame(player, PINO_FRAME_IDS.JUMP),
          onComplete: () => resetPose(),
        }),
      // 2. pause
      () => this.time.delayedCall(200, () => advance()),
      // 3. hop left
      () =>
        this.tweens.add({
          targets: player,
          x: originX - hopOffset,
          y: groundY - smallHopHeight,
          duration: 220,
          yoyo: true,
          ease: "Sine.easeOut",
          onStart: () => {
            applyPinoSpriteFrame(player, PINO_FRAME_IDS.RUN_01);
            player.setFlipX(true);
          },
          onYoyo: () => applyPinoSpriteFrame(player, PINO_FRAME_IDS.RUN_02),
          onComplete: () => {
            player.setX(originX);
            resetPose();
          },
        }),
      // 4. hop right
      () =>
        this.tweens.add({
          targets: player,
          x: originX + hopOffset,
          y: groundY - smallHopHeight,
          duration: 220,
          yoyo: true,
          ease: "Sine.easeOut",
          onStart: () => {
            applyPinoSpriteFrame(player, PINO_FRAME_IDS.RUN_01);
            player.setFlipX(false);
          },
          onYoyo: () => applyPinoSpriteFrame(player, PINO_FRAME_IDS.RUN_02),
          onComplete: () => {
            player.setX(originX);
            resetPose();
          },
        }),
      // 5. pause before big jump
      () => this.time.delayedCall(120, () => advance()),
      // 6. squat down (anticipation)
      () =>
        this.tweens.add({
          targets: player,
          scaleY: baseScale * 0.8,
          scaleX: baseScale * 1.15,
          duration: 150,
          ease: "Quad.easeIn",
          onStart: () => applyPinoSpriteFrame(player, PINO_FRAME_IDS.IDLE),
        }),
      // 7. big jump + spin
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - bigJumpHeight,
          scaleY: baseScale * 1.05,
          scaleX: baseScale * 0.95,
          angle: 360,
          duration: 420,
          ease: "Sine.easeOut",
          onStart: () => applyPinoSpriteFrame(player, PINO_FRAME_IDS.JUMP),
        }),
      // 8. fall down
      () =>
        this.tweens.add({
          targets: player,
          y: groundY,
          duration: 280,
          ease: "Quad.easeIn",
          onStart: () => applyPinoSpriteFrame(player, PINO_FRAME_IDS.FALL),
        }),
      // 9. land squash
      () =>
        this.tweens.add({
          targets: player,
          scaleY: baseScale * 0.75,
          scaleX: baseScale * 1.25,
          duration: 80,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => {
            applyPinoSpriteFrame(player, PINO_FRAME_IDS.IDLE);
            player.setAngle(0);
          },
          onComplete: () => resetPose(),
        }),
      // 10. victory pose - little hops
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - scaleLegacyY(6),
          duration: 130,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => applyPinoSpriteFrame(player, PINO_FRAME_IDS.JUMP),
          onComplete: () => resetPose(),
        }),
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - scaleLegacyY(6),
          duration: 130,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => applyPinoSpriteFrame(player, PINO_FRAME_IDS.JUMP),
          onComplete: () => resetPose(),
        }),
      // 11. rest before loop
      () => this.time.delayedCall(800, () => advance()),
    ];

    let step = 0;

    const advance = () => {
      if (!player.active) {
        return;
      }

      step = (step + 1) % sequence.length;
      const tween = sequence[step]!();

      if (tween instanceof Phaser.Tweens.Tween) {
        tween.once("complete", () => advance());
      }
    };

    const first = sequence[0]!();

    if (first instanceof Phaser.Tweens.Tween) {
      first.once("complete", () => advance());
    }
  }

  private bindStartInput(): void {
    this.input.keyboard?.once("keydown-ENTER", this.startLevel, this);
    this.input.keyboard?.once("keydown-SPACE", this.startLevel, this);
    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      this.startLevelFromPointer,
      this,
    );
  }

  private startLevelFromPointer(pointer: Phaser.Input.Pointer): void {
    if (isPointInsideStartScreenMusicButton(pointer.x, pointer.y)) {
      return;
    }

    this.startLevel();
  }

  private startLevel(): void {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;
    incrementSessionAttempts();

    const initialLevel = getRequiredLevelDefinition(START_SCREEN_LEVEL_ID);

    gameStateStore.startLevel(
      initialLevel.id,
      initialLevel.spawn,
      resolveLevelInitialEnergy(initialLevel),
    );
    this.scene.start(SCENE_KEYS.LEVEL);
  }

  private playMenuMusic(): void {
    emitGameEvent(GAME_EVENTS.AUDIO_PLAY_REQUESTED, {
      audioId: MUSIC_AUDIO_IDS.MENU_LOOP,
      category: "music",
    });
  }

  private cleanup(): void {
    this.unsubscribeState?.();
    this.unsubscribeState = undefined;
    this.input.off(
      Phaser.Input.Events.POINTER_DOWN,
      this.startLevelFromPointer,
      this,
    );
    this.input.keyboard?.off("keydown-ENTER", this.startLevel, this);
    this.input.keyboard?.off("keydown-SPACE", this.startLevel, this);
  }
}
