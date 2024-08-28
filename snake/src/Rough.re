type t;
type canvas;
type drawable;
type options = {
  .
  "fill": Js.undefined(string),
  "stroke": Js.undefined(string),
  "roughness": Js.undefined(float),
  "strokeWidth": Js.undefined(float),
  "fillStyle": Js.undefined(string),
  "hachureAngle": Js.undefined(float),
  "hachureGap": Js.undefined(float),
  "bowing": Js.undefined(float),
};

[@bs.obj]
external makeOptions:
  (
    ~fill: string=?,
    ~stroke: string=?,
    ~roughness: float=?,
    ~strokeWidth: float=?,
    ~fillStyle: string=?,
    ~hachureAngle: float=?,
    ~hachureGap: float=?,
    ~bowing: float=?,
    unit
  ) =>
  options;

[@bs.module "roughjs"] [@bs.scope "default"]
external canvas: Dom.element => canvas = "canvas";

[@bs.get] external make: canvas => t = "generator";
[@bs.send] external draw: (canvas, drawable) => unit = "draw";
[@bs.send]
external rectangle:
  (t, ~x: float, ~y: float, ~w: float, ~h: float, ~options: options) =>
  drawable =
  "rectangle";
