// @flow

import Game from './game';
import { scaleCanvas } from './util';
import type { Config, Pos, Direction } from './types';

const config: Config = {
  cellWidth: 10,
  height: (document.body: any).clientHeight * 0.5,
  snakeColor: '#0074D9',
  speed: 1 / 16,
  width: (document.body: any).clientWidth * 0.5,
};

const canvas: HTMLCanvasElement = (document.getElementById('canvas'): any);
const ctx = canvas.getContext('2d');
scaleCanvas(canvas, ctx, config.width, config.height);
const game = new Game(config, ctx);
document.addEventListener('keydown', game.onKeyDown);
