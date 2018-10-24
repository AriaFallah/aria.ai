open Types;

module List = Belt.List;
module MQ = Belt.MutableQueue;

type t = {
  boardSize: int,
  body: list(Segment.t),
  moveQueue: MQ.t(direction),
};

let validMove = (~curDir: direction, ~nextDir: direction): bool =>
  switch (curDir) {
  | Left => nextDir != Right
  | Right => nextDir != Left
  | Up => nextDir != Down
  | Down => nextDir != Up
  };

let queueMove = (snake: t, ~nextDir: direction) => {
  let size = MQ.size(snake.moveQueue);
  if (size < 3) {
    let curDir =
      switch (MQ.peek(snake.moveQueue)) {
      | Some(direction) => direction
      | None => List.headExn(snake.body).direction
      };
    if (validMove(~curDir, ~nextDir)) {
      MQ.add(snake.moveQueue, nextDir);
    };
  };
};

let make = (canvas: Canvas.t) => {
  body:
    List.makeBy(
      5,
      x => {
        let x = 4. -. L.float(x);
        Segment.make(~position={x, y: 0.}, ());
      },
    ),
  moveQueue: MQ.make(),
  boardSize: canvas.canvasSize / canvas.cellSize,
};

let draw =
    (
      snake: t,
      ~canvas: Canvas.t,
      ~dt: float,
      ~bodyCells: array(Rough.drawable),
    ) =>
  List.forEach(snake.body, (segment: Segment.t) =>
    Canvas.paintCell(
      canvas,
      ~image=bodyCells[segment.getCellIndex()],
      ~point=
        Segment.approximatePosition(segment, ~boardSize=snake.boardSize, ~dt),
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
    switch (MQ.pop(snake.moveQueue)) {
    | Some(direction) => {...head, direction, didPivot: true}
    | None => head
    };
  {...snake, body: [head, ...List.tailExn(snake.body)]};
};

let makePivot = (~leader: Segment.t, ~follower: Segment.t) =>
  if (leader.didPivot) {
    [
      {...leader, didPivot: false},
      {...follower, didPivot: true, direction: leader.direction},
    ];
  } else {
    [leader, follower];
  };

let pivotBody = (snake: t) => {
  let rec f = (l: list(Segment.t)) =>
    switch (l) {
    | [] => []
    | [s] => [s]
    | [s1, s2] => makePivot(~leader=s1, ~follower=s2)
    | [s, ...rest] =>
      let rest = f(rest);
      let pivot = makePivot(~leader=s, ~follower=List.headExn(rest));
      List.concat(pivot, List.tailExn(rest));
    };
  {...snake, body: f(snake.body)};
};

let moveSnake = (snake: t) => {
  ...snake,
  body:
    List.map(snake.body, (segment: Segment.t) =>
      {
        ...segment,
        position: Segment.updatePosition(segment, ~boardSize=snake.boardSize),
      }
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