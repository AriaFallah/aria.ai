const config = {
  height: document.body.clientHeight * 0.5,
  width: document.body.clientWidth * 0.5,
  cellWidth: 10,
  fillStyle: '#0074D9',
  strokeStyle: '#0074D9',
};
let game = createGame();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

scaleCanvas(canvas, ctx, config.width, config.height);
document.addEventListener('keydown', move);

function paint() {
  const { height, width } = config;
  const { interval, moves, snake } = game;
  const { body, direction } = snake;
  const head = body[0];
  let { x, y } = head;

  if (moves.length > 0) {
    snake.direction = moves.shift();
  }

  if (direction === 'right') {
    x++;
  } else if (direction === 'left') {
    x--;
  } else if (direction === 'up') {
    y--;
  } else if (direction === 'down') {
    y++;
  }

  if (didLose(body, config, { x, y })) {
    clearInterval(interval);
    game.gameOver = true;
    return;
  }

  let tail = {};
  if (x === game.food.x && y === game.food.y) {
    tail = { x, y };
    game.score++;
    scoreEl.innerHTML = game.score;
    game.food = createFood(config);
  } else {
    tail = snake.body.pop();
    tail.x = x;
    tail.y = y;
  }
  snake.body.unshift(tail);

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  for (const bodyCell of body) {
    paintCell(config, ctx, bodyCell);
  }

  paintCell(config, ctx, game.food);
}

function collidingWithSelf(head, body) {
  const { x, y } = head;

  for (const bodyCell of body.slice(1)) {
    if (x === bodyCell.x && y === bodyCell.y) {
      return true;
    }
  }
  return false;
}

function createFood(config) {
  const { cellWidth, height, width } = config;
  return {
    x: Math.round(Math.random() * (width - cellWidth) / cellWidth),
    y: Math.round(Math.random() * (height - cellWidth) / cellWidth),
  };
}

function createGame() {
  const { height, width } = config;

  return {
    food: createFood(config),
    gameOver: false,
    interval: setInterval(paint, 30),
    moves: [],
    score: 0,
    snake: {
      body: Array.from({ length: 5 }, (_, i) => ({
        x: i,
        y: 0,
      })).reverse(),
      direction: 'right',
    },
  };
}

function didLose(body, config, head) {
  return isOutOfBounds(config, head) || collidingWithSelf(head, body);
}

function isOutOfBounds(config, pos) {
  const { x, y } = pos;
  const { width, height, cellWidth } = config;
  return x < 0 || y < 0 || x >= width / cellWidth || y >= height / cellWidth;
}

function move(e) {
  const { gameOver, moves, snake } = game;
  if (gameOver) {
    game = createGame();
    scoreEl.innerHTML = game.score;
  }

  if (moves.length >= 3) {
    return;
  }

  if (e.keyCode === 37 && snake.direction !== 'right') {
    moves.push('left');
  } else if (e.keyCode === 38 && snake.direction !== 'down') {
    moves.push('up');
  } else if (e.keyCode === 39 && snake.direction !== 'left') {
    moves.push('right');
  } else if (e.keyCode === 40 && snake.direction !== 'up') {
    moves.push('down');
  }
}

function paintCell(config, ctx, pos) {
  const { cellWidth, fillStyle, strokeStyle } = config;
  const { x, y } = pos;

  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
  ctx.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
}

function scaleCanvas(canvas, context, width, height) {
  const devicePixelRatio = window.devicePixelRatio || 1;

  const backingStoreRatio =
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
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
