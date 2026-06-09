import Phaser from "phaser";

import {
  applyPinoSpriteFrame,
  getPinoRenderScale,
  PINO_ANIMATIONS,
  PINO_FRAME_IDS,
  type PinoFrameId,
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
import { emitAudioVolumeSettingsChanged } from "../systems/audio-settings-events";
import { formatMusicMuteStatus } from "../ui/hud";
import {
  createAudioSettingsControls,
  createMenuAudioSettingsLayout,
} from "../ui/audio-settings-controls";
import { readPersistedAudioSettings } from "../systems/audio-settings-persistence";
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
  private audioSettingsControls?: import("../ui/audio-settings-controls").AudioSettingsControls;

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
    this.drawAudioSettingsControls();
    this.bindStartInput();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  private drawBackdrop(): void {
    const { width, height, groundY } = START_SCREEN_LAYOUT;

    // Deterministic pseudo-random for reproducible visuals
    const rng = (seed: number): number => {
      const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    // ── Sky gradient ──────────────────────────────────────────────────────
    const skyGfx = this.add.graphics();
    skyGfx.fillGradientStyle(0x06080e, 0x06080e, 0x0d1824, 0x0d1824, 1);
    skyGfx.fillRect(0, 0, width, groundY);

    // ── Stars ─────────────────────────────────────────────────────────────
    const starGfx = this.add.graphics();
    for (let i = 0; i < 65; i++) {
      const sx = Math.round(rng(i * 7 + 1) * width);
      const sy = Math.round(rng(i * 7 + 2) * (groundY * 0.72));
      const ss = rng(i * 7 + 3) > 0.88 ? 2 : 1;
      const sa = 0.12 + rng(i * 7 + 4) * 0.62;
      starGfx.fillStyle(0xdce8f6, sa);
      starGfx.fillRect(sx, sy, ss, ss);
    }
    for (let i = 0; i < 12; i++) {
      const sx = Math.round(rng(i * 13 + 91) * (width - 40)) + 20;
      const sy = Math.round(rng(i * 13 + 92) * (groundY * 0.6)) + 10;
      const sa = 0.5 + rng(i * 13 + 93) * 0.4;
      const star = this.add.rectangle(sx, sy, 1, 1, 0xdce8f6).setAlpha(sa);
      this.tweens.add({
        targets: star,
        alpha: sa * 0.08,
        duration: 800 + Math.round(rng(i * 13 + 94) * 2200),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: Math.round(rng(i * 13 + 95) * 3000),
      });
    }

    // ── Moon ──────────────────────────────────────────────────────────────
    const moonX = Math.round(width * 0.79);
    const moonCY = 68;
    const moonGfx = this.add.graphics();
    const moonRings: Array<[number, number]> = [
      [50, 0.025],
      [36, 0.05],
      [26, 0.09],
      [18, 0.17],
    ];
    for (const [r, a] of moonRings) {
      moonGfx.fillStyle(0x6aaac2, a);
      moonGfx.fillCircle(moonX, moonCY, r);
    }
    moonGfx.fillStyle(0xaacee0, 0.62);
    moonGfx.fillCircle(moonX, moonCY, 13);
    moonGfx.fillStyle(0xc8e2f2, 0.84);
    moonGfx.fillCircle(moonX, moonCY, 10);
    moonGfx.fillStyle(0x0d1824, 0.44);
    moonGfx.fillCircle(moonX + 5, moonCY - 3, 10);
    const moonPulse = this.add.circle(moonX, moonCY, 13, 0xaacee0, 0.52);
    this.tweens.add({
      targets: moonPulse,
      alpha: 0.24,
      duration: 3400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // ── Procedural city buildings ─────────────────────────────────────────
    type Building = { x: number; top: number; w: number };
    const genLayer = (
      minW: number,
      maxW: number,
      minH: number,
      maxH: number,
      gapMin: number,
      gapMax: number,
      seed: number,
    ): Building[] => {
      const out: Building[] = [];
      let bx = 0;
      let bi = 0;
      while (bx < width + maxW) {
        const bw = minW + Math.round(rng(seed + bi * 5) * (maxW - minW));
        const bh = minH + Math.round(rng(seed + bi * 5 + 1) * (maxH - minH));
        const gap =
          gapMin + Math.round(rng(seed + bi * 5 + 2) * (gapMax - gapMin));
        out.push({ x: bx, top: groundY - bh, w: bw });
        bx += bw + gap;
        bi++;
      }
      return out;
    };

    const farLayer = genLayer(
      TILE_SIZE_PX,
      TILE_SIZE_PX * 3,
      TILE_SIZE_PX * 2,
      TILE_SIZE_PX * 4,
      4,
      TILE_SIZE_PX,
      10,
    );
    const midLayer = genLayer(
      TILE_SIZE_PX + 8,
      TILE_SIZE_PX * 3,
      TILE_SIZE_PX * 3,
      TILE_SIZE_PX * 7,
      2,
      TILE_SIZE_PX - 6,
      100,
    );
    const nearLayer = genLayer(
      TILE_SIZE_PX * 2,
      TILE_SIZE_PX * 4,
      TILE_SIZE_PX * 4,
      TILE_SIZE_PX * 9,
      0,
      14,
      200,
    );

    const farGfx = this.add.graphics();
    farGfx.fillStyle(0x0d1020, 1);
    for (const b of farLayer) farGfx.fillRect(b.x, b.top, b.w, groundY - b.top);

    const midGfx = this.add.graphics();
    midGfx.fillStyle(0x090c16, 1);
    for (const b of midLayer) midGfx.fillRect(b.x, b.top, b.w, groundY - b.top);

    const nearGfx = this.add.graphics();
    nearGfx.fillStyle(0x060912, 1);
    for (const b of nearLayer)
      nearGfx.fillRect(b.x, b.top, b.w, groundY - b.top);

    // ── Window lights ─────────────────────────────────────────────────────
    const winGfx = this.add.graphics();
    const addWindows = (buildings: Building[], seed: number) => {
      buildings.forEach((b, bi) => {
        if (rng(seed + bi * 7) < 0.38) return;
        for (let wy = b.top + 8; wy < groundY - TILE_SIZE_PX - 2; wy += 10) {
          for (let wx = b.x + 4; wx < b.x + b.w - 4; wx += 8) {
            if (rng(seed + wx * 0.1 + wy * 0.05 + bi) > 0.58) {
              const warm = rng(seed + wx + wy) > 0.35;
              winGfx.fillStyle(
                warm ? 0xf0d878 : 0x80d7c2,
                0.18 + rng(seed + wx * 2 + wy) * 0.28,
              );
              winGfx.fillRect(wx, wy, 2, 3);
            }
          }
        }
      });
    };
    addWindows(midLayer, 300);
    addWindows(nearLayer, 400);

    // ── Horizon atmosphere ────────────────────────────────────────────────
    for (let i = 0; i < 8; i++) {
      const fogY = groundY - TILE_SIZE_PX * (8 - i);
      this.add
        .rectangle(0, fogY, width, TILE_SIZE_PX, 0x1e3d52)
        .setAlpha(0.02 + i * 0.007)
        .setOrigin(0);
    }

    // ── Ground platform ───────────────────────────────────────────────────
    this.add
      .rectangle(0, groundY, width, height - groundY + 2, 0x07090f)
      .setOrigin(0);
    this.add.rectangle(0, groundY, width, 3, 0x80d7c2).setOrigin(0).setAlpha(0.62);
    const groundGfx = this.add.graphics();
    groundGfx.lineStyle(1, 0x18223a, 0.35);
    for (let gx = TILE_SIZE_PX; gx < width; gx += TILE_SIZE_PX) {
      groundGfx.lineBetween(gx, groundY + 1, gx, groundY + TILE_SIZE_PX * 3);
    }
    groundGfx.lineBetween(0, groundY + TILE_SIZE_PX, width, groundY + TILE_SIZE_PX);
    groundGfx.lineBetween(
      0,
      groundY + TILE_SIZE_PX * 2,
      width,
      groundY + TILE_SIZE_PX * 2,
    );
  }

  private drawParticles(): void {
    const { width, groundY } = START_SCREEN_LAYOUT;

    for (let i = 0; i < 28; i++) {
      const size = i % 5 === 0 ? 3 : i % 2 === 0 ? 2 : 1;
      const x = Math.random() * width;
      const y = Math.random() * (groundY - scaleLegacyY(30));
      const color = Math.random() > 0.38 ? 0x80d7c2 : 0xdce8f6;
      const alpha = 0.14 + Math.random() * 0.3;

      const particle = this.add.rectangle(x, y, size, size, color).setAlpha(alpha);

      this.tweens.add({
        targets: particle,
        y: y - scaleLegacyY(18) - Math.random() * scaleLegacyY(32),
        x: x + (Math.random() - 0.5) * scaleLegacyX(38),
        alpha: 0,
        duration: 2500 + Math.random() * 4000,
        delay: Math.random() * 3500,
        repeat: -1,
        repeatDelay: Math.random() * 1800,
        ease: "Sine.easeIn",
        onRepeat: () => {
          particle.setPosition(
            Math.random() * width,
            groundY - Math.random() * scaleLegacyY(30),
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

    // Escala maior para o herói ficar prominente na tela inicial (3× o tamanho de jogo)
    player.setScale(3 * getPinoRenderScale());
    player.setAlpha(0.95);

    this.playDanceLoop(player, playerX, groundY, 3);
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
    scale = 2,
  ): void {
    const s = scale * getPinoRenderScale();
    const runWidth = scaleLegacyX(44);
    const bigJumpH = scaleLegacyY(48);
    const idleBobH = scaleLegacyY(4);
    const hopH = scaleLegacyY(10);

    // Troca de frame preservando a escala do menu (não usa applyPinoVisualDisplaySize)
    const setFrame = (id: PinoFrameId, flipX = false) => {
      applyPinoSpriteFrame(player, id);
      player.setScale(s);
      player.setFlipX(flipX);
    };

    const idle = () => setFrame(PINO_FRAME_IDS.IDLE);

    const sequence = [
      // ── 1. idle breath A ─────────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - idleBobH,
          scaleX: s * 1.04,
          scaleY: s * 0.97,
          duration: 250,
          yoyo: true,
          ease: "Sine.easeInOut",
          onStart: idle,
          onComplete: idle,
        }),
      // ── 2. idle breath B ─────────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - idleBobH,
          scaleX: s * 1.04,
          scaleY: s * 0.97,
          duration: 250,
          yoyo: true,
          ease: "Sine.easeInOut",
          onStart: idle,
          onComplete: idle,
        }),
      // ── 3. pause ─────────────────────────────────────────────────────────
      () => this.time.delayedCall(180, () => advance()),
      // ── 4. run right: step 1 ─────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          x: originX + runWidth * 0.35,
          duration: 75,
          ease: "Linear",
          onStart: () => setFrame(PINO_FRAME_IDS.RUN_01),
        }),
      // ── 5. run right: step 2 ─────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          x: originX + runWidth * 0.67,
          duration: 75,
          ease: "Linear",
          onStart: () => setFrame(PINO_FRAME_IDS.RUN_02),
        }),
      // ── 6. run right: step 3 ─────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          x: originX + runWidth,
          duration: 75,
          ease: "Linear",
          onStart: () => setFrame(PINO_FRAME_IDS.RUN_03),
        }),
      // ── 7. skid/turnaround ────────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          scaleX: s * 1.08,
          scaleY: s * 0.93,
          duration: 90,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: idle,
        }),
      // ── 8. run left: step 1 ──────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          x: originX + runWidth * 0.65,
          duration: 75,
          ease: "Linear",
          onStart: () => setFrame(PINO_FRAME_IDS.RUN_01, true),
        }),
      // ── 9. run left: step 2 ──────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          x: originX + runWidth * 0.33,
          duration: 75,
          ease: "Linear",
          onStart: () => setFrame(PINO_FRAME_IDS.RUN_02, true),
        }),
      // ── 10. run left: step 3 ─────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          x: originX,
          duration: 75,
          ease: "Linear",
          onStart: () => setFrame(PINO_FRAME_IDS.RUN_03, true),
        }),
      // ── 11. settle + pause ────────────────────────────────────────────────
      () => this.time.delayedCall(100, () => { idle(); advance(); }),
      // ── 12. squat (jump anticipation) ────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          scaleY: s * 0.78,
          scaleX: s * 1.18,
          duration: 110,
          ease: "Quad.easeIn",
          onStart: idle,
        }),
      // ── 13. jump ascent ───────────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - bigJumpH * 0.55,
          scaleY: s * 1.12,
          scaleX: s * 0.9,
          duration: 210,
          ease: "Quad.easeOut",
          onStart: () => setFrame(PINO_FRAME_IDS.JUMP),
        }),
      // ── 14. peak (slow float at apex) ────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - bigJumpH,
          scaleY: s,
          scaleX: s,
          duration: 170,
          ease: "Quad.easeOut",
          onStart: () => setFrame(PINO_FRAME_IDS.JUMP_PEAK),
        }),
      // ── 15. fall ──────────────────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          y: groundY,
          scaleY: s * 0.94,
          scaleX: s * 1.04,
          duration: 270,
          ease: "Quad.easeIn",
          onStart: () => setFrame(PINO_FRAME_IDS.FALL),
        }),
      // ── 16. land squash ───────────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          scaleY: s * 0.73,
          scaleX: s * 1.27,
          duration: 72,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => setFrame(PINO_FRAME_IDS.IDLE),
          onComplete: idle,
        }),
      // ── 17. pause ─────────────────────────────────────────────────────────
      () => this.time.delayedCall(90, () => advance()),
      // ── 18. charge 01: gathering energy ──────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          scaleX: s * 0.93,
          scaleY: s * 1.1,
          alpha: 0.8,
          duration: 210,
          yoyo: true,
          ease: "Sine.easeInOut",
          onStart: () => setFrame(PINO_FRAME_IDS.CHARGE_01),
          onComplete: () => { player.setScale(s); player.setAlpha(0.95); },
        }),
      // ── 19. charge 02: energy rising (cyan tint) ─────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          scaleX: s * 0.9,
          scaleY: s * 1.14,
          alpha: 0.75,
          duration: 200,
          yoyo: true,
          ease: "Sine.easeInOut",
          onStart: () => { setFrame(PINO_FRAME_IDS.CHARGE_02); player.setTint(0x80d7c2); },
          onComplete: () => { player.setScale(s); player.clearTint(); player.setAlpha(0.95); },
        }),
      // ── 20. spark: rapid flicker ──────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          alpha: 0.45,
          duration: 55,
          yoyo: true,
          repeat: 2,
          ease: "Linear",
          onStart: () => { setFrame(PINO_FRAME_IDS.CYAN_SPARK_01); player.setTint(0x80d7c2); },
          onComplete: () => { player.clearTint(); player.setAlpha(0.95); },
        }),
      // ── 21. burst prepare: coil ───────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          scaleX: s * 1.1,
          scaleY: s * 0.88,
          duration: 100,
          ease: "Quad.easeOut",
          onStart: () => setFrame(PINO_FRAME_IDS.CYAN_BURST_PREPARE_01),
        }),
      // ── 22. burst fire: white flash ───────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          scaleX: s * 1.42,
          scaleY: s * 0.66,
          alpha: 1,
          duration: 65,
          yoyo: true,
          ease: "Expo.easeOut",
          onStart: () => { setFrame(PINO_FRAME_IDS.CYAN_BURST_FIRE_01); player.setTint(0xffffff); },
          onComplete: () => { idle(); player.clearTint(); player.setAlpha(0.95); },
        }),
      // ── 23. pause ─────────────────────────────────────────────────────────
      () => this.time.delayedCall(80, () => advance()),
      // ── 24. dash: lunge right ─────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          x: originX + scaleLegacyX(42),
          scaleX: s * 1.2,
          scaleY: s * 0.84,
          duration: 115,
          ease: "Expo.easeOut",
          onStart: () => setFrame(PINO_FRAME_IDS.DASH),
          onComplete: () => { player.setX(originX); idle(); },
        }),
      // ── 25. pause ─────────────────────────────────────────────────────────
      () => this.time.delayedCall(65, () => advance()),
      // ── 26. celebration hop A ─────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - hopH,
          duration: 130,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => setFrame(PINO_FRAME_IDS.JUMP),
          onComplete: idle,
        }),
      // ── 27. celebration hop B ─────────────────────────────────────────────
      () =>
        this.tweens.add({
          targets: player,
          y: groundY - hopH,
          duration: 130,
          yoyo: true,
          ease: "Quad.easeOut",
          onStart: () => setFrame(PINO_FRAME_IDS.JUMP),
          onComplete: idle,
        }),
      // ── 28. rest before loop ──────────────────────────────────────────────
      () => this.time.delayedCall(940, () => advance()),
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

  private drawAudioSettingsControls(): void {
    const persistedSettings = readPersistedAudioSettings();

    this.audioSettingsControls = createAudioSettingsControls({
      scene: this,
      layout: createMenuAudioSettingsLayout(),
      initialSettings: persistedSettings,
      onChange: (settings) => {
        emitAudioVolumeSettingsChanged(settings);
      },
    });
    this.audioSettingsControls.container.setDepth(25);
  }

  private bindStartInput(): void {
    this.input.keyboard?.once("keydown-ENTER", this.startLevel, this);
    this.input.keyboard?.once("keydown-SPACE", this.startLevel, this);
    this.input.keyboard?.on("keydown-M", this.toggleMute, this);
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

    if (this.audioSettingsControls?.containsPoint(pointer.x, pointer.y)) {
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

  private toggleMute(): void {
    gameStateStore.toggleMuted();
  }

  private playMenuMusic(): void {
    emitGameEvent(GAME_EVENTS.AUDIO_PLAY_REQUESTED, {
      audioId: MUSIC_AUDIO_IDS.MENU_LOOP,
      category: "music",
    });
  }

  private cleanup(): void {
    this.audioSettingsControls?.destroy();
    this.audioSettingsControls = undefined;
    this.unsubscribeState?.();
    this.unsubscribeState = undefined;
    this.input.keyboard?.off("keydown-M", this.toggleMute, this);
    this.input.off(
      Phaser.Input.Events.POINTER_DOWN,
      this.startLevelFromPointer,
      this,
    );
    this.input.keyboard?.off("keydown-ENTER", this.startLevel, this);
    this.input.keyboard?.off("keydown-SPACE", this.startLevel, this);
  }
}
