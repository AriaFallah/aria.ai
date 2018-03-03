// @flow

import { type Direction } from './types';

import { nullThrows } from './util';
import { Food } from './food';
import { Snake } from './snake';
import { Canvas } from './canvas';

export class Game {
  canvas: Canvas;
  food: Food;
  gameOver: boolean;
  highScoreElement: HTMLElement;
  highScore: number;
  gameLoop: IntervalID;
  score: number;
  scoreElement: HTMLElement;
  snake: Snake;
  steps = 13;
  stepSize = 1;
  t: number = 0;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
    this.highScoreElement = nullThrows(document.getElementById('high-score'));
    this.scoreElement = nullThrows(document.getElementById('score'));
    this.highScoreElement.innerHTML = `${this.highScore}`;
    this.startNewGame();
  }

  draw() {
    this.canvas.drawBackground();
    this.food.draw(this.canvas);
    this.snake.draw(this.canvas);
  }

  getNextFoodPos() {
    const point = this.canvas.randomPoint();
    for (const segment of this.snake.body) {
      if (segment.x === point.x && segment.y === point.y) {
        return null;
      }
    }
    return point;
  }

  onEvent = (e: Object) => {
    if (this.gameOver) {
      this.startNewGame();
      return;
    }

    if (e instanceof KeyboardEvent && !e.repeat) {
      const dir = getDirection(e.keyCode);
      if (dir) {
        this.queueMove(dir);
      }
    }
  };

  queueMove(dir: Direction) {
    this.snake.queueMove(dir);
  }

  setScore(newScore: number) {
    this.score = newScore;
    this.scoreElement.innerHTML = `${this.score}`;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreElement.innerHTML = `${this.highScore}`;
      localStorage.setItem('highScore', `${this.highScore}`);
    }
  }

  startNewGame() {
    this.food = new Food(this.canvas.randomPoint());
    this.gameOver = false;
    this.setScore(0);
    this.snake = new Snake(this.canvas.canvasSize / this.canvas.cellSize);
    this.gameLoop = setInterval(() => {
      this.draw();
      this.update();
    }, 8);
  }

  update() {
    this.snake.update(this.t / this.steps);

    if (this.snake.isCollidingWithSelf()) {
      this.gameOver = true;
      clearInterval(this.gameLoop);
      return;
    }

    const head = this.snake.body[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      this.setScore(this.score + 1);
      for (;;) {
        const p = this.getNextFoodPos();
        if (p !== null) {
          this.food = new Food(p);
          break;
        }
      }
      this.snake.grow();
    }

    this.t += this.stepSize;
    if (this.t > this.steps) {
      this.t = 0;
    }
  }
}

function getDirection(code: number): ?Direction {
  switch (code) {
    case 37:
      return 'left';
    case 38:
      return 'up';
    case 39:
      return 'right';
    case 40:
      return 'down';
    default:
      return null;
  }
}
