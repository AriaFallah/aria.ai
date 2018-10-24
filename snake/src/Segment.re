open Types;

type t = {
  position: point,
  didPivot: bool,
  direction,
  getCellIndex: unit => int,
};

let make = (~position, ~direction=Right, ~didPivot=false, ()) => {
  let cell = Canvas.Cell.make(~position);
  {position, didPivot, direction, getCellIndex: cell.getCellIndex};
};

let updatePosition = (segment: t, ~boardSize: int) => {
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

let approximatePosition = (segment: t, ~boardSize: int, ~dt: float) => {
  let {x: x1, y: y1} = segment.position;
  let {x: x2, y: y2} = updatePosition(segment, ~boardSize);
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