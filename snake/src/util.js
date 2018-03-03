// @flow

export function nullThrows<T>(x: ?T): T {
  if (x == null) {
    throw new Error('Argument was null');
  }
  return x;
}

export function seq(length: number): Array<number> {
  const array = Array(length);
  for (let i = 0; i < length; ++i) {
    array[i] = i;
  }
  return array;
}

export function interp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t;
}
