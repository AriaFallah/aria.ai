// @flow

import Hammer from 'hammerjs';
import Frac from './frac';
import type { Config, Direction, Pos, Segment } from './types';
import {
  createFood,
  didLose,
  nullThrows,
  paintCell,
  seq,
  validMove,
} from './util';

class Snake {
  body: Array<Segment> = seq(5)
    .map(i => ({
      x: new Frac(i),
      y: new Frac(0),
      didPivot: false,
      direction: 'right',
    }))
    .reverse();
  moves: Array<Direction> = [];

  queueMove(nextDir: Direction): void {
    if (this.moves.length >= 3) {
      return;
    }
    const curDir =
      this.moves.length > 0
        ? this.moves[this.moves.length - 1]
        : this.body[0].direction;

    if (validMove(curDir, nextDir)) {
      this.moves.push(nextDir);
    }
  }
}

export default class Game {
  accumulator: Frac = new Frac(0);
  config: Config;
  ctx: CanvasRenderingContext2D;
  food: Pos;
  gameOver: boolean;
  highScoreElement: HTMLElement;
  highScore: number;
  interval: number;
  score: number;
  scoreElement: HTMLElement;
  snake: Snake;
  speed: Frac;
  speedup: Frac;

  constructor(config: Config, ctx: CanvasRenderingContext2D) {
    this.config = config;
    this.ctx = ctx;
    this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
    this.highScoreElement = nullThrows(document.getElementById('high-score'));
    this.scoreElement = nullThrows(document.getElementById('score'));
    this.init();
    this.highScoreElement.innerHTML = `${this.highScore}`;
    this.speedup = new Frac(Math.floor(this.config.speed.val() / 100));
  }

  init(): void {
    this.food = createFood(this.config);
    this.gameOver = false;
    this.setScore(0);
    this.snake = new Snake();
    this.speed = this.config.speed;
    this.interval = setInterval(() => {
      this.update(this.speed);
      this.render();
    }, 16);
  }

  onEvent = (e: Object): void => {
    if (this.gameOver) {
      this.init();
      return;
    }
    let dir = null;
    if (e instanceof KeyboardEvent) {
      if (!e.repeat) {
        dir = getDirection(e.keyCode);
      }
    } else {
      dir = getDirection(e.direction);
    }

    if (dir) {
      this.snake.queueMove(dir);
    }
  };

  render() {
    const { height, width } = this.config;

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, width, height);

    for (const bodyCell of this.snake.body) {
      paintCell(this.config, this.ctx, {
        x: bodyCell.x.val(),
        y: bodyCell.y.val(),
      });
    }

    paintCell(this.config, this.ctx, this.food);
  }

  setScore(newScore: number): void {
    this.score = newScore;
    this.scoreElement.innerHTML = `${this.score}`;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreElement.innerHTML = `${this.highScore}`;
      localStorage.setItem('highScore', `${this.highScore}`);
    }
  }

  update(speed: Frac): void {
    const { cellWidth, height, width } = this.config;
    const logicalWidth = Math.floor(width / cellWidth);
    const logicalHeight = Math.floor(height / cellWidth);

    this.accumulator = Frac.add(this.accumulator, speed);
    for (let i = this.snake.body.length - 1; i >= 0; --i) {
      if (this.accumulator.val() >= 1) {
        if (this.snake.body[i].direction === 'right') {
          this.snake.body[i].x = Frac.ceil(this.snake.body[i].x);
        } else if (this.snake.body[i].direction === 'left') {
          this.snake.body[i].x = Frac.floor(this.snake.body[i].x);
        } else if (this.snake.body[i].direction === 'up') {
          this.snake.body[i].y = Frac.floor(this.snake.body[i].y);
        } else if (this.snake.body[i].direction === 'down') {
          this.snake.body[i].y = Frac.ceil(this.snake.body[i].y);
        }
      } else {
        if (this.snake.body[i].direction === 'right') {
          this.snake.body[i].x = Frac.add(this.snake.body[i].x, speed);
        } else if (this.snake.body[i].direction === 'left') {
          this.snake.body[i].x = Frac.sub(this.snake.body[i].x, speed);
        } else if (this.snake.body[i].direction === 'up') {
          this.snake.body[i].y = Frac.sub(this.snake.body[i].y, speed);
        } else if (this.snake.body[i].direction === 'down') {
          this.snake.body[i].y = Frac.add(this.snake.body[i].y, speed);
        }
      }

      if (this.snake.body[i].x.val() === logicalWidth + 1) {
        this.snake.body[i].x = new Frac(-1);
      } else if (this.snake.body[i].x.val() === -1) {
        this.snake.body[i].x = new Frac(logicalWidth + 1);
      }

      if (this.snake.body[i].y.val() === logicalHeight + 1) {
        this.snake.body[i].y = new Frac(-1);
      } else if (this.snake.body[i].y.val() === -1) {
        this.snake.body[i].y = new Frac(logicalHeight + 1);
      }

      if (
        this.accumulator.val() >= 1 &&
        i !== 0 &&
        this.snake.body[i - 1].didPivot
      ) {
        this.snake.body[i].didPivot = true;
        this.snake.body[i].direction = this.snake.body[i - 1].direction;
        this.snake.body[i - 1].didPivot = false;
      }
    }

    const head = this.snake.body[0];
    if (
      this.accumulator.val() >= 1 &&
      this.snake.moves.length > 0 &&
      head.x.val() < logicalWidth &&
      head.x.val() >= 0 &&
      head.y.val() < logicalHeight &&
      head.y.val() >= 0
    ) {
      this.snake.body[0].direction = this.snake.moves.shift();
      this.snake.body[0].didPivot = true;
    }

    if (this.accumulator.val() < 1) {
      return;
    }
    this.accumulator = new Frac(0);

    if (didLose(this.snake.body, this.config, this.snake.body[0])) {
      this.gameOver = true;
      clearInterval(this.interval);
      return;
    }

    if (
      this.snake.body[0].x.val() === this.food.x &&
      this.snake.body[0].y.val() === this.food.y
    ) {
      let { direction, x, y } = this.snake.body[this.snake.body.length - 1];
      if (direction === 'right') {
        x = Frac.sub(x, new Frac(1));
      } else if (direction === 'left') {
        x = Frac.add(x, new Frac(1));
      } else if (direction === 'up') {
        y = Frac.add(y, new Frac(1));
      } else if (direction === 'down') {
        y = Frac.sub(y, new Frac(1));
      }
      this.setScore(this.score + 1);
      this.food = createFood(this.config);
      this.snake.body.push({ didPivot: false, direction, x, y });
      this.speed = Frac.add(this.speed, this.speedup);
    }
  }
}

function getDirection(code: number): ?Direction {
  switch (code) {
    case Hammer.DIRECTION_LEFT:
    case 37:
      return 'left';
    case Hammer.DIRECTION_UP:
    case 38:
      return 'up';
    case Hammer.DIRECTION_RIGHT:
    case 39:
      return 'right';
    case Hammer.DIRECTION_DOWN:
    case 40:
      return 'down';
    default:
      return null;
  }
}
