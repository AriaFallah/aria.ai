// @flow

import { type Point } from './types';
import { type Drawable, Canvas } from './canvas';

export class Food implements Drawable, Point {
  x: number;
  y: number;

  constructor(p: Point) {
    this.x = p.x;
    this.y = p.y;
  }

  draw(canvas: Canvas) {
    canvas.paintCell('#fff', this);
  }
}
