import Phaser from "phaser";

import { AUDIO_ASSETS, RUNTIME_IMAGE_ASSETS, SPRITESHEET_ASSETS } from "../assets";
import { GAME_BACKGROUND_COLOR } from "../constants";
import { SCENE_KEYS } from "./scene-keys";

export class PreloadScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  public preload(): void {
    this.cameras.main.setBackgroundColor(GAME_BACKGROUND_COLOR);

    RUNTIME_IMAGE_ASSETS.forEach((asset) => {
      this.load.image(asset.key, asset.url);
    });
    SPRITESHEET_ASSETS.forEach((asset) => {
      if (!asset.enabled) {
        return;
      }

      this.load.spritesheet(asset.key, asset.url, {
        frameWidth: asset.frameWidth,
        frameHeight: asset.frameHeight,
      });
    });
    AUDIO_ASSETS.forEach((asset) => {
      this.load.audio(asset.key, asset.url);
    });
  }

  public create(): void {
    this.applySmoothCharacterFiltering();
    this.scene.start(SCENE_KEYS.MENU);
  }

  /**
   * Os sheets HD de personagem e bosses guardam arte detalhada (células 256)
   * exibida em tamanho menor; com o filtro NEAREST global (pixelArt) o
   * downscale serrilharia. LINEAR só nessas texturas mantém tiles e traps
   * pixel-perfect e personagens suaves e nítidos.
   */
  private applySmoothCharacterFiltering(): void {
    SPRITESHEET_ASSETS.forEach((asset) => {
      if (!asset.enabled || !this.textures.exists(asset.key)) {
        return;
      }

      this.textures.get(asset.key).setFilter(Phaser.Textures.FilterMode.LINEAR);
    });
  }
}
