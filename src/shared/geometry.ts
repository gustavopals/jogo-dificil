export type Vector2Like = {
  readonly x: number;
  readonly y: number;
};

export type RectLike = Vector2Like & {
  readonly width: number;
  readonly height: number;
};
