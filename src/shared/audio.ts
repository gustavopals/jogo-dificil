export type AudioCategory = "music" | "sfx";

export type AudioDefinition = {
  readonly id: string;
  readonly category: AudioCategory;
  readonly assetKey: string;
  readonly path: string;
  readonly volume: number;
  readonly loop: boolean;
};

export type AudioSettings = {
  readonly masterVolume: number;
  readonly musicVolume: number;
  readonly sfxVolume: number;
  readonly isMuted: boolean;
};
