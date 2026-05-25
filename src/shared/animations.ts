export type AnimationPlaybackMode = "loop" | "once";

export type CharacterAnimationFrameDefinition = {
  readonly textureKey: string;
  readonly frame?: string | number;
  readonly durationMs?: number;
};

export type CharacterAnimationDefinition<
  TAnimationState extends string = string,
> = {
  readonly key: string;
  readonly state: TAnimationState;
  readonly playback: AnimationPlaybackMode;
  readonly frameRate: number;
  readonly repeat: number;
  readonly frames: readonly CharacterAnimationFrameDefinition[];
  readonly isPlaceholder: boolean;
};
