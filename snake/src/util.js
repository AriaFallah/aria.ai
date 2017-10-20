// @flow

import type { Config, Direction, Pos, Segment } from './types';

export function createFood(config: Config) {
  const { cellWidth, height, width } = config;
  return {
    x: Math.round(Math.random() * (width - cellWidth) / cellWidth),
    y: Math.round(Math.random() * (height - cellWidth) / cellWidth),
  };
}

export function didLose(body: Array<Segment>, config: Config, head: Segment) {
  return isOutOfBounds(config, head) || collidingWithSelf(head, body);
}

export function nullThrows<T>(x: ?T): T {
  if (x == null) {
    throw new Error('Argument was null');
  }
  return x;
}

export function paintCell(
  config: Config,
  ctx: CanvasRenderingContext2D,
  pos: Pos
) {
  const { cellWidth, snakeColor } = config;
  const { x, y } = pos;

  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeColor;
  ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
  ctx.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
}

export function scaleCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const devicePixelRatio = window.devicePixelRatio || 1;

  const backingStoreRatio: number =
    (context: any).webkitBackingStorePixelRatio ||
    (context: any).mozBackingStorePixelRatio ||
    (context: any).msBackingStorePixelRatio ||
    (context: any).oBackingStorePixelRatio ||
    (context: any).backingStorePixelRatio ||
    1;

  const ratio = devicePixelRatio / backingStoreRatio;

  if (devicePixelRatio !== backingStoreRatio) {
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  } else {
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '';
    canvas.style.height = '';
  }

  context.scale(ratio, ratio);
}

export function seq(length: number): Array<number> {
  return Array.from({ length }, (_, i) => i);
}

export function validMove(curDir: Direction, nextDir: Direction) {
  return !(
    (curDir === 'right' && nextDir === 'left') ||
    (curDir === 'left' && nextDir === 'right') ||
    (curDir === 'up' && nextDir === 'down') ||
    (curDir === 'down' && nextDir === 'up')
  );
}

function collidingWithSelf(head: Segment, body: Array<Segment>) {
  const { x, y } = head;

  for (const bodyCell of body.slice(1)) {
    if (x === bodyCell.x && y === bodyCell.y) {
      return true;
    }
  }
  return false;
}

function isOutOfBounds(config, pos) {
  const { x, y } = pos;
  const { width, height, cellWidth } = config;
  return x < 0 || y < 0 || x >= width / cellWidth || y >= height / cellWidth;
}
