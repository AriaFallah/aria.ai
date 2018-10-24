exception NoneThrow(string);

[@bs.val] external parseInt: string => int = "";
[@bs.val] [@bs.scope "Math"] external random: unit => float = "";
[@bs.val] [@bs.scope "Math"] external ceil: float => float = "";
[@bs.val] [@bs.scope "Math"] external floor: float => float = "";
[@bs.val] [@bs.scope "Math"] external round: float => float = "";

[@bs.val] external string: 'a => string = "String";
external float: int => float = "%identity";
external int: float => int = "%identity";

let lerp = (x1, x2, t) => x1 *. (1. -. t) +. x2 *. t;
let roundToNearest = (n, m) => ceil(n /. m +. 1.) *. m;
let randomInt = upperBound => int(floor(random() *. float(upperBound)));

let unwrap = x =>
  switch (x) {
  | Some(v) => v
  | None => raise(NoneThrow("None value passed to unwrap"))
  };

let default = (x, o) =>
  switch (o) {
  | Some(v) => v
  | None => x
  };