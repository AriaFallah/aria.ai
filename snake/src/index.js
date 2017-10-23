// @flow

import Frac from './frac';
import Game from './game';
import { scaleCanvas } from './util';
import type { Config, Pos, Direction } from './types';

const { clientHeight, clientWidth } = (document.body: any);
const size = Math.min(clientHeight, clientWidth) * 0.75;

const config: Config = {
  cellWidth: 10,
  height: size,
  snakeColor: '#0074D9',
  speed: new Frac(1, 10),
  width: size,
};

const canvas: HTMLCanvasElement = (document.getElementById('canvas'): any);
const ctx = canvas.getContext('2d');
scaleCanvas(canvas, ctx, config.width, config.height);
const game = new Game(config, ctx);
document.addEventListener('keydown', game.onKeyDown);
