open Types;

open Webapi.Canvas;

type t = {
  canvasElement: Dom.element,
  ctx: Canvas2d.t,
  canvasSize: int,
  cellSize: int,
  roughCtx: Rough.canvas,
  generator: Rough.Generator.t,
};

[@bs.val] [@bs.return nullable] [@bs.scope "window"]
external devicePixelRatio : option(float) = "devicePixelRatio";

let make = (~canvasElement, ~canvasSize, ~cellSize) : t => {
  let roughCtx = Rough.canvas(canvasElement);
  {
    canvasElement,
    canvasSize,
    cellSize,
    ctx: CanvasElement.getContext2d(canvasElement),
    roughCtx,
    generator: Rough.Generator.make(roughCtx),
  };
};

let drawBackground = (canvas: t) => {
  let {canvasSize, ctx} = canvas;
  let canvasSize = float(canvasSize);
  Canvas2d.setFillStyle(ctx, Canvas2d.String, "white");
  ctx |> Canvas2d.fillRect(~x=0., ~y=0., ~w=canvasSize, ~h=canvasSize);
};

let makeCell = (canvas: t, color: string) => {
  let {cellSize, generator} = canvas;
  let cellSize = L.float(cellSize);
  Rough.Generator.rectangle(
    generator,
    ~x=0.,
    ~y=0.,
    ~w=cellSize,
    ~h=cellSize,
    ~options=
      Rough.makeOptions(
        ~fill=color,
        ~stroke="black",
        ~roughness=1.1,
        ~strokeWidth=1.4,
        ~bowing=0.,
        (),
      ),
  );
};

let paintCell = (canvas: t, image: Rough.drawable, point) => {
  let {x, y} = point;
  let {cellSize, roughCtx} = canvas;
  let cellSize = float(cellSize);
  canvas.ctx |> Canvas2d.save;
  canvas.ctx |> Canvas2d.translate(~x=x *. cellSize, ~y=y *. cellSize);
  Rough.draw(roughCtx, image);
  canvas.ctx |> Canvas2d.restore;
};

let randomPoint = (canvas: t) : point => {
  let {canvasSize, cellSize} = canvas;
  let upperBound = L.float((canvasSize - cellSize) / cellSize);
  {x: L.randomInt(upperBound), y: L.randomInt(upperBound)};
};

let scaleCanvas = (canvas: t) => {
  open Webapi.Dom;
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

module Cell = {
  type t = {
    position: point,
    getImage: unit => Rough.drawable,
  };
  let make = (~canvas, ~position, ~color) => {
    let calls = ref(0);
    let image = ref(makeCell(canvas, color));
    let getImage = () => {
      calls := calls^ + 1;
      if (calls^ mod 3 == 0) {
        image := makeCell(canvas, color);
      };
      image^;
    };
    {position, getImage};
  };
};