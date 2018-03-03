// @flow

import { type Point, type Direction } from './types';

import { Canvas } from './canvas';
import { Game } from './game';
import { nullThrows } from './util';

const { clientHeight, clientWidth } = nullThrows(document.body);
const size = Math.round(Math.min(clientHeight, clientWidth) * 0.75);
const cellSize = Math.round(size / 25);
const canvasSize = Math.ceil(size / cellSize + 1) * cellSize;

// Set up canvas
const canvas = new Canvas(
  (document.getElementById('canvas'): any),
  canvasSize,
  cellSize
);

// Create game and add events
const game = new Game(canvas);
document.addEventListener('keydown', game.onEvent);

const left = nullThrows(document.getElementById('left'));
left.addEventListener('click', () => game.queueMove('left'));

const right = nullThrows(document.getElementById('right'));
right.addEventListener('click', () => game.queueMove('right'));

const up = nullThrows(document.getElementById('up'));
up.addEventListener('click', () => game.queueMove('up'));

const down = nullThrows(document.getElementById('down'));
down.addEventListener('click', () => game.queueMove('down'));
