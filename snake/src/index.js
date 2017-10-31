// @flow

import Hammer from 'hammerjs';
import Frac from './frac';
import Game from './game';
import { scaleCanvas } from './util';
import type { Config, Pos, Direction } from './types';

const { clientHeight, clientWidth } = (document.body: any);
const size =
  Math.ceil(Math.min(clientHeight, clientWidth) * 0.75 / 10 + 1) * 10;

// Global config
const config: Config = {
  cellWidth: 10,
  height: size,
  snakeColor: '#fff',
  speed: new Frac(1, 10),
  width: size,
};

// Set up canvas
const canvas: HTMLCanvasElement = (document.getElementById('canvas'): any);
const ctx = canvas.getContext('2d');
scaleCanvas(canvas, ctx, config.width, config.height);

// Create game and add events
const game = new Game(config, ctx);
const hammer = new Hammer(document);
hammer
  .get('swipe')
  .set({ direction: Hammer.DIRECTION_ALL, threshold: 1, velocity: 0.1 });
hammer.on('swipe', game.onEvent);
document.addEventListener('keydown', game.onEvent);
