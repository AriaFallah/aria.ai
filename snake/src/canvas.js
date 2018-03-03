// @flow

import { type Point } from './types';

export interface Drawable {
  draw(canvas: Canvas): void;
}

export class Canvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  canvasSize: number;
  cellSize: number;

  constructor(canvas: HTMLCanvasElement, canvasSize: number, cellSize: number) {
    this.canvas = canvas;
    this.canvasSize = canvasSize;
    this.cellSize = cellSize;
    this.context = canvas.getContext('2d');
    this.scaleCanvas();
  }

  drawBackground() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvasSize, this.canvasSize);
  }

  isOutOfBounds(point: Point) {
    const { x, y } = point;
    const { canvasSize, cellSize } = this;
    return (
      x < 0 || y < 0 || x >= canvasSize / cellSize || y >= canvasSize / cellSize
    );
  }

  paintCell(color: string, point: Point) {
    const { x, y } = point;
    const { cellSize, context } = this;

    context.fillStyle = color;
    context.strokeStyle = color;
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }

  randomPoint(): Point {
    const { canvasSize, cellSize } = this;
    return {
      x: Math.round(Math.random() * (canvasSize - cellSize) / cellSize),
      y: Math.round(Math.random() * (canvasSize - cellSize) / cellSize),
    };
  }

  scaleCanvas() {
    const { canvas, context, canvasSize } = this;
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
      canvas.width = canvasSize * ratio;
      canvas.height = canvasSize * ratio;

      canvas.style.width = canvasSize + 'px';
      canvas.style.height = canvasSize + 'px';
    } else {
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      canvas.style.width = '';
      canvas.style.height = '';
    }

    context.scale(ratio, ratio);
  }
}
