open Types;
open Webapi.Dom;
open Dom.Storage;

module List = Belt.List;

[@bs.val] [@bs.scope ("window", "performance")]
external now: unit => float = "";

type t = {
  bodyCells: array(Rough.drawable),
  canvas: Canvas.t,
  highScoreElement: Dom.element,
  scoreElement: Dom.element,
  mutable food: Canvas.Cell.t,
  foodCells: array(Rough.drawable),
  mutable gameOver: bool,
  mutable highScore: int,
  mutable score: int,
  mutable snake: Snake.t,
  mutable msPerUpdate: float,
};

type gameState = {
  food: Canvas.Cell.t,
  gameOver: bool,
  score: int,
  snake: Snake.t,
};

let setScore = (game: t, ~score: int) => {
  game.score = score;
  let scoreString = L.string(game.score);
  Element.setInnerHTML(game.scoreElement, scoreString);
  if (game.score > game.highScore) {
    game.highScore = game.score;
    Element.setInnerHTML(game.highScoreElement, scoreString);
    localStorage |> setItem("highScore", scoreString);
  };
};

let spawnFood = (game: t) => {
  let rec loop = pos => {
    let containsPos =
      game.snake.body
      ->List.map(segment => segment.position)
      ->List.has(pos, (==));
    if (containsPos) {
      loop(Canvas.randomPoint(game.canvas));
    } else {
      pos;
    };
  };
  let position = loop(Canvas.randomPoint(game.canvas));
  {...game.food, position};
};

let render =
    (
      game: t,
      ~dt: float,
      ~bodyCells: array(Rough.drawable),
      ~foodCells: array(Rough.drawable),
    ) => {
  Canvas.drawBackground(game.canvas);
  Canvas.paintCell(
    game.canvas,
    ~image=foodCells[game.food.getCellIndex()],
    ~point=game.food.position,
  );
  Snake.draw(game.snake, ~canvas=game.canvas, ~dt, ~bodyCells);
};

let update = (game: t) => {
  game.snake = Snake.update(game.snake);
  game.gameOver = Snake.isCollidingWithSelf(game.snake);
  if (game.gameOver) {
    game;
  } else {
    let head = List.headExn(game.snake.body);
    if (head.position == game.food.position) {
      setScore(game, ~score=game.score + 1);
      game.snake = Snake.grow(game.snake);
      game.food = spawnFood(game);
    };
    game;
  };
};

let run = (initialGame: t) => {
  let rec gameLoop = (game: t, current: float, last: float, dt: float) => {
    let dt = dt +. (current -. last);
    let rec updateLoop = (game, dt) =>
      if (dt > game.msPerUpdate) {
        updateLoop(update(game), dt -. game.msPerUpdate);
      } else {
        (game, dt);
      };
    let (game, dt) = updateLoop(game, dt);
    render(
      game,
      ~dt=dt /. game.msPerUpdate,
      ~bodyCells=game.bodyCells,
      ~foodCells=game.foodCells,
    );
    if (!game.gameOver) {
      Webapi.requestAnimationFrame(c => gameLoop(game, c, current, dt));
    };
  };
  Webapi.requestAnimationFrame(c => gameLoop(initialGame, now(), c, 0.));
};

let newGame = canvas => {
  food: Canvas.Cell.make(~position=Canvas.randomPoint(canvas)),
  snake: Snake.make(canvas),
  score: 0,
  gameOver: false,
};

let restartGameIfOver = (game: t) =>
  if (game.gameOver) {
    let {food, snake, score, gameOver} = newGame(game.canvas);
    game.food = food;
    game.snake = snake;
    game.gameOver = gameOver;
    setScore(game, ~score);
    run(game);
  };

let getDirectionFromKey = (keyName: string) =>
  switch (keyName) {
  | "ArrowLeft"
  | "KeyA" => Some(Left)
  | "ArrowRight"
  | "KeyD" => Some(Right)
  | "ArrowUp"
  | "KeyW" => Some(Up)
  | "ArrowDown"
  | "KeyS" => Some(Down)
  | _ => None
  };

let handleInput = (game: t) => {
  Element.addKeyDownEventListener(
    e => {
      if (!KeyboardEvent.repeat(e)) {
        switch (e |> KeyboardEvent.code |> getDirectionFromKey) {
        | Some(d) => Snake.queueMove(game.snake, ~nextDir=d)
        | None => ()
        };
      };
      restartGameIfOver(game);
    },
    Document.documentElement(document),
  );
  let leftElement = document |> Document.getElementById("left") |> L.unwrap;
  let rightElement = document |> Document.getElementById("right") |> L.unwrap;
  let upElement = document |> Document.getElementById("up") |> L.unwrap;
  let downElement = document |> Document.getElementById("down") |> L.unwrap;
  Element.addClickEventListener(
    _ => {
      Snake.queueMove(game.snake, ~nextDir=Left);
      restartGameIfOver(game);
    },
    leftElement,
  );
  Element.addClickEventListener(
    _ => {
      Snake.queueMove(game.snake, ~nextDir=Right);
      restartGameIfOver(game);
    },
    rightElement,
  );
  Element.addClickEventListener(
    _ => {
      Snake.queueMove(game.snake, ~nextDir=Up);
      restartGameIfOver(game);
    },
    upElement,
  );
  Element.addClickEventListener(
    _ => {
      Snake.queueMove(game.snake, ~nextDir=Down);
      restartGameIfOver(game);
    },
    downElement,
  );
};

let make = (~canvas, ~msPerUpdate) => {
  let {food, snake, score, gameOver} = newGame(canvas);
  let bodyCells =
    Belt.Array.makeBy(50, _ => Canvas.makeCell(canvas, ~color="blue"));
  let foodCells =
    Belt.Array.makeBy(50, _ => Canvas.makeCell(canvas, ~color="red"));
  let game = {
    bodyCells,
    canvas,
    food,
    foodCells,
    gameOver,
    highScore:
      localStorage |> getItem("highScore") |> L.default("0") |> L.parseInt,
    highScoreElement:
      document |> Document.getElementById("highScore") |> L.unwrap,
    score,
    scoreElement: document |> Document.getElementById("score") |> L.unwrap,
    snake,
    msPerUpdate,
  };
  Element.setInnerHTML(game.highScoreElement, L.string(game.highScore));
  handleInput(game);
  game;
};