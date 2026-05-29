import Phaser from "phaser";

import { resolveGameplayMusicAudioId } from "../../data/audio";
import { getRequiredLevelDefinition } from "../../data/levels";
import type { LevelId } from "../../shared";
import { GAME_BACKGROUND_COLOR, GAME_RESOLUTION } from "../constants";
import { emitGameEvent, GAME_EVENTS } from "../systems/game-events";
import { gameStateStore } from "../systems/game-state";
import { scaleLegacyFontPx, scaleLegacyY } from "../scale";
import { resolveLevelInitialEnergy } from "../systems/level-progress";
import type { LevelCompletionResult } from "../systems/level-results";
import {
  createLevelTransitionLabels,
  LEVEL_TRANSITION_DELAY_MS,
  normalizeTransitionDeathCount,
} from "../ui/level-transition";
import {
  LEVEL_TRANSITION_JUICE,
  resolveLevelTransitionFadeOutStartMs,
} from "../ui/level-transition-juice";
import { SCENE_KEYS } from "./scene-keys";

export type LevelTransitionSceneData = {
  readonly completedLevelId: LevelId;
  readonly nextLevelId?: LevelId;
  readonly deathCount: number;
  readonly levelResult?: LevelCompletionResult;
};

export class LevelTransitionScene extends Phaser.Scene {
  private nextLevelId?: LevelId;
  private transitionTimer?: Phaser.Time.TimerEvent;
  private fadeOutTimer?: Phaser.Time.TimerEvent;
  private fadeOverlay?: Phaser.GameObjects.Rectangle;

  public constructor() {
    super(SCENE_KEYS.LEVEL_TRANSITION);
  }

  public create(data: LevelTransitionSceneData): void {
    const completedLevel = getRequiredLevelDefinition(data.completedLevelId);
    const nextLevel = data.nextLevelId
      ? getRequiredLevelDefinition(data.nextLevelId)
      : undefined;
    const labels = createLevelTransitionLabels(
      completedLevel,
      nextLevel,
      normalizeTransitionDeathCount(data.deathCount),
      data.levelResult ?? null,
    );

    this.nextLevelId = nextLevel?.id;
    this.cameras.main.setBackgroundColor(GAME_BACKGROUND_COLOR);
    this.drawTransition(
      labels.title,
      labels.detail,
      labels.result,
      labels.deaths,
      labels.prompt,
    );

    if (nextLevel) {
      this.fadeOutTimer = this.time.delayedCall(
        resolveLevelTransitionFadeOutStartMs(LEVEL_TRANSITION_DELAY_MS),
        this.fadeOutBeforeNextLevel,
        undefined,
        this,
      );
      this.transitionTimer = this.time.delayedCall(
        LEVEL_TRANSITION_DELAY_MS,
        this.startNextLevel,
        undefined,
        this,
      );
    } else {
      this.bindFinalScreenInput();
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  private drawTransition(
    title: string,
    detail: string,
    result: string,
    deaths: string,
    prompt: string,
  ): void {
    const centerX = GAME_RESOLUTION.width / 2;
    const centerY = GAME_RESOLUTION.height / 2;
    const hasResult = result.length > 0;
    const textWrapWidth = GAME_RESOLUTION.width - scaleLegacyY(96);
    const deathsY = hasResult
      ? centerY + scaleLegacyY(34)
      : centerY + scaleLegacyY(18);
    const separatorY = hasResult
      ? centerY + scaleLegacyY(52)
      : centerY + scaleLegacyY(44);
    const promptY = hasResult
      ? centerY + scaleLegacyY(64)
      : centerY + scaleLegacyY(56);

    this.add.rectangle(
      centerX,
      centerY,
      GAME_RESOLUTION.width,
      GAME_RESOLUTION.height,
      0x111217,
      1,
    );
    this.add
      .rectangle(
        centerX,
        centerY,
        GAME_RESOLUTION.width - scaleLegacyY(120),
        GAME_RESOLUTION.height - scaleLegacyY(108),
        0x0f1118,
        0.78,
      )
      .setStrokeStyle(1, 0x80d7c2, 0.32);
    this.add.rectangle(
      centerX,
      separatorY,
      GAME_RESOLUTION.width,
      2,
      0x80d7c2,
      0.45,
    );

    const titleText = this.add
      .text(centerX, centerY - scaleLegacyY(36), title, {
        color: "#f5f7fb",
        fontFamily: "monospace",
        fontSize: scaleLegacyFontPx(20),
        align: "center",
        wordWrap: {
          width: textWrapWidth,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setScale(LEVEL_TRANSITION_JUICE.titleScaleFrom);
    const detailText = this.add
      .text(centerX, centerY - scaleLegacyY(4), detail, {
        color: "#80d7c2",
        fontFamily: "monospace",
        fontSize: scaleLegacyFontPx(10),
        align: "center",
        wordWrap: {
          width: textWrapWidth,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0);
    const resultText = this.add
      .text(centerX, centerY + scaleLegacyY(14), result, {
        color: "#f4d35e",
        fontFamily: "monospace",
        fontSize: scaleLegacyFontPx(10),
        align: "center",
        wordWrap: {
          width: textWrapWidth,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0);
    const deathsText = this.add
      .text(centerX, deathsY, deaths, {
        color: "#f5f7fb",
        fontFamily: "monospace",
        fontSize: scaleLegacyFontPx(10),
        align: "center",
        wordWrap: {
          width: textWrapWidth,
        },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    if (prompt) {
      this.add
        .text(centerX, promptY, prompt, {
          color: "#80d7c2",
          fontFamily: "monospace",
          fontSize: scaleLegacyFontPx(10),
        })
        .setOrigin(0.5);
    }

    this.tweens.add({
      targets: [detailText, resultText, deathsText],
      alpha: 1,
      duration: LEVEL_TRANSITION_JUICE.titleFadeDurationMs,
      ease: "Sine.easeOut",
    });
    this.tweens.add({
      targets: titleText,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: LEVEL_TRANSITION_JUICE.titleScaleDurationMs,
      ease: "Back.easeOut",
    });

    this.fadeOverlay = this.add
      .rectangle(
        centerX,
        centerY,
        GAME_RESOLUTION.width,
        GAME_RESOLUTION.height,
        0x050608,
        1,
      )
      .setDepth(100);

    this.tweens.add({
      targets: this.fadeOverlay,
      alpha: 0,
      duration: LEVEL_TRANSITION_JUICE.fadeInDurationMs,
      ease: "Quad.easeOut",
    });
  }

  private fadeOutBeforeNextLevel(): void {
    if (!this.fadeOverlay) {
      return;
    }

    this.tweens.killTweensOf(this.fadeOverlay);
    this.tweens.add({
      targets: this.fadeOverlay,
      alpha: 1,
      duration: LEVEL_TRANSITION_JUICE.fadeOutDurationMs,
      ease: "Quad.easeIn",
    });
  }

  private bindFinalScreenInput(): void {
    this.input.keyboard?.once("keydown-ENTER", this.restartRun, this);
    this.input.keyboard?.once("keydown-SPACE", this.restartRun, this);
    this.input.once(Phaser.Input.Events.POINTER_DOWN, this.restartRun, this);
  }

  private startNextLevel(): void {
    if (!this.nextLevelId) {
      return;
    }

    const nextLevel = getRequiredLevelDefinition(this.nextLevelId);

    gameStateStore.startLevel(
      nextLevel.id,
      nextLevel.spawn,
      resolveLevelInitialEnergy(nextLevel),
    );
    emitGameEvent(GAME_EVENTS.AUDIO_PLAY_REQUESTED, {
      audioId: resolveGameplayMusicAudioId(nextLevel),
      category: "music",
    });
    this.scene.start(SCENE_KEYS.LEVEL);
  }

  private restartRun(): void {
    gameStateStore.resetRun();
    this.scene.start(SCENE_KEYS.MENU);
  }

  private cleanup(): void {
    this.transitionTimer?.remove(false);
    this.transitionTimer = undefined;
    this.fadeOutTimer?.remove(false);
    this.fadeOutTimer = undefined;
    this.input.keyboard?.off("keydown-ENTER", this.restartRun, this);
    this.input.keyboard?.off("keydown-SPACE", this.restartRun, this);
    this.input.off(Phaser.Input.Events.POINTER_DOWN, this.restartRun, this);
  }
}
