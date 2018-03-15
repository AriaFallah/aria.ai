open Webapi.Dom;

let pageSize = () => {
  let body =
    Document.unsafeAsHtmlDocument(document) |> HtmlDocument.body |> L.unwrap;
  let clientHeight = Element.clientHeight(body);
  let clientWidth = Element.clientWidth(body);
  L.float(min(clientHeight, clientWidth)) *. 0.75;
};

let main = () => {
  let size = pageSize();
  let cellSize = L.ceil(size /. 25.);
  let canvas =
    Canvas.make(
      ~canvasElement=Document.getElementById("canvas", document) |> L.unwrap,
      ~canvasSize=L.int(L.roundToNearest(size, cellSize)),
      ~cellSize=L.int(cellSize),
    );
  Canvas.scaleCanvas(canvas);
  let game = Game.make(~canvas, ~msPerUpdate=150.);
  Game.run(game);
};

main();