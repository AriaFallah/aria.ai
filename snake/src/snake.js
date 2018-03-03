// @flow

import { type Drawable, Canvas } from './canvas';
import { type Direction, type Point } from './types';
import { interp, seq } from './util';

export class Snake implements Drawable {
  body: Array<Segment> = seq(5)
    .reverse()
    .map(i => new Segment(i, 0, 'right'));
  moveQueue: Array<Direction> = [];
  boardSize: number;

  constructor(boardSize: number) {
    this.boardSize = boardSize;
  }

  static validMove(curDir: Direction, nextDir: Direction) {
    return !(
      (curDir === 'right' && nextDir === 'left') ||
      (curDir === 'left' && nextDir === 'right') ||
      (curDir === 'up' && nextDir === 'down') ||
      (curDir === 'down' && nextDir === 'up')
    );
  }

  draw(canvas: Canvas) {
    for (const segment of this.body) {
      canvas.paintCell('#fff', segment);
    }
  }

  isCollidingWithSelf() {
    const head = this.body[0];

    for (const segment of this.body.slice(1)) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }

    return false;
  }

  grow() {
    let { direction, x, y } = this.body[this.body.length - 1];
    if (direction === 'right') {
      x -= 1;
    } else if (direction === 'left') {
      x += 1;
    } else if (direction === 'up') {
      y += 1;
    } else if (direction === 'down') {
      y -= 1;
    }
    this.body.push(new Segment(x, y, direction));
  }

  update(t: number) {
    if (t !== 0) {
      for (const segment of this.body) {
        segment.updatePosition(t);

        if (segment.x === this.boardSize + 1) {
          segment.x = -1;
        } else if (segment.x === -1) {
          segment.x = this.boardSize + 1;
        }

        if (segment.y === this.boardSize + 1) {
          segment.y = -1;
        } else if (segment.y === -1) {
          segment.y = this.boardSize + 1;
        }
      }
      return;
    }

    // Pivot the snake's body
    for (let i = this.body.length - 1; i > 0; --i) {
      if (this.body[i - 1].didPivot) {
        this.body[i].didPivot = true;
        this.body[i].direction = this.body[i - 1].direction;
        this.body[i - 1].didPivot = false;
      }
      this.body[i].updatePosition = this.body[i].positionUpdater();
    }

    // Pivot the snake's head
    if (
      this.moveQueue.length > 0 &&
      this.body[0].x < this.boardSize &&
      this.body[0].x >= 0 &&
      this.body[0].y < this.boardSize &&
      this.body[0].y >= 0
    ) {
      this.body[0].direction = this.moveQueue.shift();
      this.body[0].didPivot = true;
    }
    this.body[0].updatePosition = this.body[0].positionUpdater();
  }

  queueMove(nextDir: Direction): void {
    if (this.moveQueue.length >= 3) {
      return;
    }

    const curDir =
      this.moveQueue.length > 0
        ? this.moveQueue[this.moveQueue.length - 1]
        : this.body[0].direction;

    if (Snake.validMove(curDir, nextDir)) {
      this.moveQueue.push(nextDir);
    }
  }
}

export class Segment implements Point {
  x: number;
  y: number;
  didPivot: boolean;
  direction: Direction;
  updatePosition: (t: number) => void;

  constructor(x: number, y: number, dir: Direction) {
    this.x = x;
    this.y = y;
    this.didPivot = false;
    this.direction = dir;
    this.updatePosition = this.positionUpdater();
  }

  positionUpdater(): (t: number) => void {
    const startingX = this.x;
    const startingY = this.y;
    switch (this.direction) {
      case 'left':
        return (t: number) => {
          this.x = interp(startingX, startingX - 1, t);
        };
      case 'right':
        return (t: number) => {
          this.x = interp(startingX, startingX + 1, t);
        };
      case 'up':
        return (t: number) => {
          this.y = interp(startingY, startingY - 1, t);
        };
      case 'down':
        return (t: number) => {
          this.y = interp(startingY, startingY + 1, t);
        };
      default:
        throw new Error('Switch case should have been exhausted');
    }
  }
}
