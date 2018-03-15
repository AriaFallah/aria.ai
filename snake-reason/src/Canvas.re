open Types;

open Webapi.Canvas;

open Webapi.Dom;

module Rough = {
  type t;
  type canvas;
  type options = {
    .
    "fill": string,
    "stroke": string,
    "roughness": float,
    "strokeWidth": float,
    "fillStyle": string,
    "hachureAngle": float,
  };
  [@bs.module "roughjs"] external roughjs : t = "default";
  [@bs.send] external canvas : (t, Dom.element) => canvas = "";
  [@bs.send]
  external rectangle :
    (canvas, ~x: float, ~y: float, ~w: float, ~h: float, ~options: options) =>
    unit =
    "";
};

type t = {
  canvasElement: Dom.element,
  ctx: Canvas2d.t,
  canvasSize: int,
  cellSize: int,
  roughCtx: Rough.canvas,
};

[@bs.val] [@bs.return nullable] [@bs.scope "window"]
external devicePixelRatio : option(float) = "devicePixelRatio";

let make = (~canvasElement, ~canvasSize, ~cellSize) : t => {
  canvasElement,
  canvasSize,
  cellSize,
  ctx: CanvasElement.getContext2d(canvasElement),
  roughCtx: Rough.canvas(Rough.roughjs, canvasElement),
};

let drawBackground = (canvas: t) => {
  let {canvasSize, ctx} = canvas;
  let canvasSize = float(canvasSize);
  Canvas2d.setFillStyle(ctx, Canvas2d.String, "white");
  ctx |> Canvas2d.fillRect(~x=0., ~y=0., ~w=canvasSize, ~h=canvasSize);
};

let paintCell = (canvas: t, color: string, point: point) => {
  let {x, y} = point;
  let {cellSize, roughCtx} = canvas;
  let cellSize = float(cellSize);
  Rough.rectangle(
    roughCtx,
    ~x=x *. cellSize,
    ~y=y *. cellSize,
    ~w=cellSize,
    ~h=cellSize,
    ~options={
      "fill": color,
      "fillStyle": "hachure",
      "stroke": "black",
      "roughness": 1.2,
      "strokeWidth": 1.,
      "hachureAngle": (-41.),
    },
  );
};

let randomPoint = (canvas: t) : point => {
  let {canvasSize, cellSize} = canvas;
  let upperBound = L.float((canvasSize - cellSize) / cellSize);
  {x: L.randomInt(upperBound), y: L.randomInt(upperBound)};
};

let scaleCanvas = (canvas: t) => {
  let {canvasSize, canvasElement, ctx} = canvas;
  let canvasSizeStr = {j|$(canvasSize)px|j};
  let dpr =
    switch (devicePixelRatio) {
    | None => 1.
    | Some(v) => v
    };
  if (dpr != 1.) {
    let scaledSize = L.float(canvasSize) *. dpr;
    let scaledSizeStr = {j|$(scaledSize)px|j};
    let style =
      canvasElement |> Element.unsafeAsHtmlElement |> HtmlElement.style;
    style |> CssStyleDeclaration.setProperty("width", canvasSizeStr, "");
    style |> CssStyleDeclaration.setProperty("height", canvasSizeStr, "");
    canvasElement |> Element.setAttribute("width", scaledSizeStr);
    canvasElement |> Element.setAttribute("height", scaledSizeStr);
  } else {
    canvasElement |> Element.setAttribute("width", canvasSizeStr);
    canvasElement |> Element.setAttribute("height", canvasSizeStr);
  };
  ctx |> Canvas2d.scale(~x=dpr, ~y=dpr);
};