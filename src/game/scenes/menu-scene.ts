import Phaser from "phaser";

import {
  PINO_TEXTURE_KEYS,
  PINO_ANIMATIONS,
} from "../../data/characters/pino-animations";
import { getRequiredLevelDefinition } from "../../data/levels";
import { GAME_BACKGROUND_COLOR, TILE_SIZE_PX } from "../constants";
import { gameStateStore } from "../systems/game-state";
import {
  START_SCREEN_COPY,
  START_SCREEN_LAYOUT,
  START_SCREEN_LEVEL_ID,
  addDeathsToTotal,
  getTotalDeaths,
  getSessionAttempts,
  incrementSessionAttempts,
  pickRandomHumorPhrase,
} from "../ui/start-screen";
import { SCENE_KEYS } from "./scene-keys";

export class MenuScene extends Phaser.Scene {
  private hasStarted = false;

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
    this.cameras.main.setBackgroundColor(GAME_BACKGROUND_COLOR);

    this.drawBackdrop();
    this.drawParticles();
    this.drawStartScreen();
    this.bindStartInput();
  }

  private drawBackdrop(): void {
    const { width, height, groundY } = START_SCREEN_LAYOUT;

    this.add.rectangle(0, 0, width, height, 0x111217).setOrigin(0);

    const skyline = this.add.graphics();
    skyline.fillStyle(0x171923, 1);
    skyline.fillRect(0, groundY - TILE_SIZE_PX * 3, width, TILE_SIZE_PX * 3);
    skyline.fillStyle(0x20232d, 1);

    for (let x = 0; x < width; x += TILE_SIZE_PX * 2) {
      const heightOffset = x % (TILE_SIZE_PX * 4) === 0 ? 18 : 8;

      skyline.fillRect(
        x,
        groundY - TILE_SIZE_PX * 3 - heightOffset,
        TILE_SIZE_PX,
        heightOffset,
      );
    }

    this.add.rectangle(width / 2, groundY + 16, width, 32, 0x242630);
    this.add.rectangle(width / 2, groundY, width, 2, 0x80d7c2).setAlpha(0.45);

    const hazards = this.add.graphics();
    hazards.fillStyle(0xe35d6a, 1);

    for (let x = width - 158; x < width - 90; x += 12) {
      hazards.fillTriangle(x, groundY, x + 6, groundY - 14, x + 12, groundY);
    }
  }

  private drawParticles(): void {
    const { width, groundY } = START_SCREEN_LAYOUT;
    const particleCount = 18;
    const particles: Phaser.GameObjects.Rectangle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const size = 1 + Math.random() * 2;
      const x = Math.random() * width;
      const y = Math.random() * (groundY - 20);
      const color = Math.random() > 0.5 ? 0x80d7c2 : 0xf5f7fb;
      const alpha = 0.08 + Math.random() * 0.18;

      const particle = this.add
        .rectangle(x, y, size, size, color)
        .setAlpha(alpha);

      particles.push(particle);

      this.tweens.add({
        targets: particle,
        y: y - 15 - Math.random() * 25,
        x: x + (Math.random() - 0.5) * 30,
        alpha: 0,
        duration: 3000 + Math.random() * 4000,
        delay: Math.random() * 3000,
        repeat: -1,
        repeatDelay: Math.random() * 2000,
        ease: "Sine.easeInOut",
        onRepeat: () => {
          particle.setPosition(
            Math.random() * width,
            groundY - Math.random() * 20,
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
        fontSize: "34px",
      })
      .setOrigin(0.5)
      .setShadow(0, 3, "#05060a", 2);

    this.add
      .text(width / 2, subtitleY, START_SCREEN_COPY.subtitle, {
        color: "#a0a4b8",
        fontFamily: "monospace",
        fontSize: "11px",
      })
      .setOrigin(0.5);

    const humorPhrase = this.add
      .text(width / 2, humorPhraseY, `"${pickRandomHumorPhrase()}"`, {
        color: "#e3b341",
        fontFamily: "monospace",
        fontSize: "9px",
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
        fontSize: "12px",
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
          fontSize: "8px",
        })
        .setOrigin(0.5)
        .setAlpha(0.6);
    }

    this.add
      .text(width / 2, vibeTagY, START_SCREEN_COPY.vibeTag, {
        color: "#80d7c2",
        fontFamily: "monospace",
        fontSize: "9px",
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
      .rectangle(exitX, groundY - 25, 28, 50, 0x80d7c2)
      .setAlpha(0.18)
      .setStrokeStyle(2, 0x80d7c2, 0.85);
    this.add.rectangle(exitX, groundY - 4, 12, 4, 0xf5f7fb).setAlpha(0.75);

    this.registerMenuAnimations();

    const player = this.add
      .sprite(playerX, groundY, PINO_TEXTURE_KEYS.IDLE)
      .setOrigin(0.5, 1)
      .setScale(2)
      .setAlpha(0.95);

    this.playDanceLoop(player, playerX, groundY);
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
    const hopOffset = 18;
    const bigJumpHeight = 38;
    const smallHopHeight = 8;

    const resetPose = () => {
      player.setTexture(PINO_TEXTURE_KEYS.IDLE);
      player.setScale(2, 2);
      player.setFlipX(false);
    };

    const sequence = [
      // 1. idle bounce - "getting ready"
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - smallHopHeight,
          scaleX: 2.15,
          scaleY: 1.85,
          duration: 180,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => player.setTexture(PINO_TEXTURE_KEYS.JUMP),
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
            player.setTexture(PINO_TEXTURE_KEYS.RUN_01);
            player.setFlipX(true);
          },
          onYoyo: () => player.setTexture(PINO_TEXTURE_KEYS.RUN_02),
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
            player.setTexture(PINO_TEXTURE_KEYS.RUN_01);
            player.setFlipX(false);
          },
          onYoyo: () => player.setTexture(PINO_TEXTURE_KEYS.RUN_02),
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
          scaleY: 1.6,
          scaleX: 2.3,
          duration: 150,
          ease: "Quad.easeIn",
          onStart: () => player.setTexture(PINO_TEXTURE_KEYS.IDLE),
        }),
      // 7. big jump + spin
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - bigJumpHeight,
          scaleY: 2.1,
          scaleX: 1.9,
          angle: 360,
          duration: 420,
          ease: "Sine.easeOut",
          onStart: () => player.setTexture(PINO_TEXTURE_KEYS.JUMP),
        }),
      // 8. fall down
      () =>
        this.tweens.add({
          targets: player,
          y: groundY,
          duration: 280,
          ease: "Quad.easeIn",
          onStart: () => player.setTexture(PINO_TEXTURE_KEYS.FALL),
        }),
      // 9. land squash
      () =>
        this.tweens.add({
          targets: player,
          scaleY: 1.5,
          scaleX: 2.5,
          duration: 80,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => {
            player.setTexture(PINO_TEXTURE_KEYS.IDLE);
            player.setAngle(0);
          },
          onComplete: () => resetPose(),
        }),
      // 10. victory pose - little hops
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - 6,
          duration: 130,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => player.setTexture(PINO_TEXTURE_KEYS.JUMP),
          onComplete: () => resetPose(),
        }),
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - 6,
          duration: 130,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => player.setTexture(PINO_TEXTURE_KEYS.JUMP),
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
    this.input.once("pointerdown", this.startLevel, this);
  }

  private startLevel(): void {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;
    incrementSessionAttempts();

    const initialLevel = getRequiredLevelDefinition(START_SCREEN_LEVEL_ID);

    gameStateStore.startLevel(initialLevel.id, initialLevel.spawn);
    this.scene.start(SCENE_KEYS.LEVEL);
  }
}
