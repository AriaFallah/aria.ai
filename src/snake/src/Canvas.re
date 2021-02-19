open Types;
open Webapi.Dom;
open Webapi.Canvas;

type t = {
  canvasElement: Dom.element,
  ctx: Canvas2d.t,
  canvasSize: int,
  cellSize: int,
  dpr: float,
  roughCtx: Rough.canvas,
  generator: Rough.t,
};

[@bs.val] [@bs.return nullable] [@bs.scope "window"]
external devicePixelRatio: option(float) = "devicePixelRatio";

let make = (~canvasElement, ~canvasSize, ~cellSize): t => {
  let roughCtx = Rough.canvas(canvasElement);
  {
    canvasElement,
    canvasSize,
    cellSize,
    ctx: CanvasElement.getContext2d(canvasElement),
    dpr:
      switch (devicePixelRatio) {
      | None => 1.
      | Some(v) => v
      },
    roughCtx,
    generator: Rough.make(roughCtx),
  };
};

let drawBackground = ({canvasSize, ctx}: t) => {
  let canvasSize = L.float(canvasSize);
  Canvas2d.setFillStyle(ctx, Canvas2d.String, "white");
  ctx |> Canvas2d.fillRect(~x=0., ~y=0., ~w=canvasSize, ~h=canvasSize);
};

let makeCell = (canvas: t, ~color: string) => {
  let {cellSize, generator} = canvas;
  let cellSize = L.float(cellSize);
  Rough.rectangle(
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

let randomPoint = (canvas: t): point => {
  let {canvasSize, cellSize} = canvas;
  let upperBound = (canvasSize - cellSize) / cellSize;
  {
    x: L.float(L.randomInt(upperBound)),
    y: L.float(L.randomInt(upperBound)),
  };
};

let scaleCanvas = (canvas: t) => {
  let {canvasSize, canvasElement, ctx, dpr} = canvas;
  let canvasSizeStr = {j|$(canvasSize)px|j};
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
  canvas;
};

let getCellImageData = (canvas: t, ~image: Rough.drawable) => {
  let {cellSize, ctx, dpr, roughCtx} = canvas;
  let cellSize = L.float(cellSize) *. dpr +. 3.0;
  Rough.draw(roughCtx, image);
  let imageData =
    ctx |> Canvas2d.getImageData(~sx=0., ~sy=0., ~sw=cellSize, ~sh=cellSize);
  Canvas2d.setFillStyle(ctx, Canvas2d.String, "white");
  ctx |> Canvas2d.fillRect(~x=0., ~y=0., ~w=cellSize, ~h=cellSize);
  imageData;
};

let putCellImageData = ({cellSize, ctx, dpr}: t, ~imageData: Image.t, ~point) => {
  let cellSize = L.float(cellSize) *. dpr;
  Canvas2d.putImageData(
    ctx,
    ~imageData,
    ~dx=point.x *. cellSize,
    ~dy=point.y *. cellSize,
    ~dirtyX=0.,
    ~dirtyY=0.,
    ~dirtyWidth=cellSize +. 3.0,
    ~dirtyHeight=cellSize +. 3.0,
    (),
  );
};

module Cell = {
  type t = {
    position: point,
    getCellIndex: unit => int,
  };

  let make = (~position) => {
    let calls = ref(0);
    let index = ref(L.randomInt(50));
    let getCellIndex = () => {
      calls := calls^ + 1;
      if (calls^ == 3) {
        calls := 0;
        index := L.randomInt(50);
      };
      index^;
    };
    {position, getCellIndex};
  };
};