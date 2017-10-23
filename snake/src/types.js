// @flow

import Frac from './frac';

export type Config = {|
  cellWidth: number,
  height: number,
  snakeColor: string,
  speed: Frac,
  width: number,
|};

export type Direction = 'left' | 'right' | 'up' | 'down';

export type Pos = {
  x: number,
  y: number,
};

export type Segment = {
  x: Frac,
  y: Frac,
  didPivot: boolean,
  direction: Direction,
};
