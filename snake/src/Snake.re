open Types;

open Belt;

module Segment = {
  type t = {
    position: point,
    didPivot: bool,
    direction,
  };
  let make = (~position, ~direction=Right, ~didPivot=false, ()) => {
    position,
    didPivot,
    direction,
  };
};

type t = {
  boardSize: int,
  body: list(Segment.t),
  moveQueue: MutableQueue.t(direction),
};

let validMove = (cur: direction, next: direction) : bool =>
  switch (cur) {
  | Left => next != Right
  | Right => next != Left
  | Up => next != Down
  | Down => next != Up
  };

let queueMove = (snake: t, nextDir: direction) => {
  let size = MutableQueue.size(snake.moveQueue);
  if (size < 3) {
    let dir =
      switch (MutableQueue.peek(snake.moveQueue)) {
      | Some(direction) => direction
      | None => List.headExn(snake.body).direction
      };
    if (validMove(dir, nextDir)) {
      MutableQueue.add(snake.moveQueue, nextDir);
    };
  };
};

let make = (boardSize: int) => {
  body:
    List.makeBy(
      5,
      x => {
        let x = 4. -. L.float(x);
        Segment.make(~position={x, y: 0.}, ());
      },
    ),
  moveQueue: MutableQueue.make(),
  boardSize,
};

let updatePosition = (segment: Segment.t, boardSize: int) => {
  let {x, y} = segment.position;
  let boardSize = L.float(boardSize);
  switch (segment.direction) {
  | Left =>
    let x = x -. 1.;
    let x = x < 0. ? boardSize -. 1. : x;
    {x, y};
  | Right =>
    let x = x +. 1.;
    let x = x >= boardSize ? 0. : x;
    {x, y};
  | Up =>
    let y = y -. 1.;
    let y = y < 0. ? boardSize -. 1. : y;
    {x, y};
  | Down =>
    let y = y +. 1.;
    let y = y >= boardSize ? 0. : y;
    {x, y};
  };
};

let approximatePosition = (segment: Segment.t, boardSize: int, dt: float) => {
  let {x: x1, y: y1} = segment.position;
  let {x: x2, y: y2} = updatePosition(segment, boardSize);
  switch (segment.direction) {
  | Left =>
    let x1 = x1 < x2 ? x2 +. 1. : x1;
    {x: L.lerp(x1, x2, dt), y: y1};
  | Right =>
    let x1 = x1 > x2 ? x2 -. 1. : x1;
    {x: L.lerp(x1, x2, dt), y: y1};
  | Up =>
    let y1 = y1 < y2 ? y2 +. 1. : y1;
    {x: x1, y: L.lerp(y1, y2, dt)};
  | Down =>
    let y1 = y1 > y2 ? y2 -. 1. : y1;
    {x: x1, y: L.lerp(y1, y2, dt)};
  };
};

let draw = (snake: t, canvas: Canvas.t, dt: float) =>
  List.forEach(snake.body, (segment: Segment.t) =>
    Canvas.paintCell(
      canvas,
      "blue",
      approximatePosition(segment, snake.boardSize, dt),
    )
  );

let isCollidingWithSelf = (snake: t) => {
  let head = List.headExn(snake.body);
  let rec f = (l: list(Segment.t)) =>
    switch (l) {
    | [] => false
    | [s] => s.position == head.position
    | [s, ...rest] => s.position == head.position || f(rest)
    };
  f(List.tailExn(snake.body));
};

let pivotHead = (snake: t) => {
  let head = List.headExn(snake.body);
  let head =
    switch (MutableQueue.pop(snake.moveQueue)) {
    | Some(direction) => {...head, direction, didPivot: true}
    | None => head
    };
  {...snake, body: [head, ...List.tailExn(snake.body)]};
};

let makePivot = (s1: Segment.t, s2: Segment.t) =>
  if (s1.didPivot) {
    [
      {...s1, didPivot: false},
      {...s2, didPivot: true, direction: s1.direction},
    ];
  } else {
    [s1, s2];
  };

let pivotBody = (snake: t) => {
  let rec f = (l: list(Segment.t)) =>
    switch (l) {
    | [] => []
    | [s] => [s]
    | [s1, s2] => makePivot(s1, s2)
    | [s, ...rest] =>
      let rest = f(rest);
      let pivot = makePivot(s, List.headExn(rest));
      List.concat(pivot, List.tailExn(rest));
    };
  {...snake, body: f(snake.body)};
};

let moveSnake = (snake: t) => {
  ...snake,
  body:
    List.map(snake.body, (segment: Segment.t) =>
      {...segment, position: updatePosition(segment, snake.boardSize)}
    ),
};

let grow = (snake: t) => {
  let last = List.getExn(snake.body, List.length(snake.body) - 1);
  let position =
    switch (last.direction) {
    | Right => {x: last.position.x -. 1., y: last.position.y}
    | Left => {x: last.position.x +. 1., y: last.position.y}
    | Up => {x: last.position.x, y: last.position.y +. 1.}
    | Down => {x: last.position.x, y: last.position.y -. 1.}
    };
  {
    ...snake,
    body:
      List.concat(
        snake.body,
        [Segment.make(~position, ~direction=last.direction, ())],
      ),
  };
};

let update = (snake: t) => snake |> moveSnake |> pivotBody |> pivotHead;