// @flow

type Exact<T> = T & $Shape<T>;

export type Config = {|
  cellWidth: number,
  height: number,
  snakeColor: string,
  speed: number,
  width: number,
|};

export type Direction = 'left' | 'right' | 'up' | 'down';

export type Pos = {
  x: number,
  y: number,
};

export type Segment = {
  x: number,
  y: number,
  didPivot: boolean,
  direction: Direction,
};
