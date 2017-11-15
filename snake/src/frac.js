// @flow

export default class Frac {
  numerator: number;
  denominator: number;

  static add(a: Frac, b: Frac): Frac {
    if (a.denominator === b.denominator) {
      return new Frac(a.numerator + b.numerator, a.denominator);
    }
    const lcd = Frac.lcd(a.denominator, b.denominator);
    return Frac.add(
      new Frac(a.numerator * (lcd / a.denominator), lcd),
      new Frac(b.numerator * (lcd / b.denominator), lcd)
    );
  }

  static ceil(a: Frac): Frac {
    const val = a.val();
    return new Frac(a.val() % 1 === 0 ? val + 1 : Math.ceil(val), 1);
  }

  static floor(a: Frac): Frac {
    const val = a.val();
    return new Frac(a.val() % 1 === 0 ? val - 1 : Math.floor(val), 1);
  }

  static lcd(a: number, b: number): number {
    return a * b / Frac.gcd(a, b);
  }

  static gcd(a: number, b: number): number {
    while (b != 0) {
      if (a > b) {
        a = a - b;
      } else {
        b = b - a;
      }
    }
    return a;
  }

  static sub(a: Frac, b: Frac): Frac {
    if (a.denominator === b.denominator) {
      return new Frac(a.numerator - b.numerator, a.denominator);
    }
    const lcd = Frac.lcd(a.denominator, b.denominator);
    return Frac.sub(
      new Frac(a.numerator * (lcd / a.denominator), lcd),
      new Frac(b.numerator * (lcd / b.denominator), lcd)
    );
  }

  constructor(n: number, d?: number = 1) {
    this.numerator = n;
    this.denominator = d;
  }

  val(): number {
    return this.numerator / this.denominator;
  }
}
(Frac: any).gcd = memoize(Frac.gcd);

function memoize<T: Function>(f: T): T {
  const cache = {};

  function m(...args) {
    const k = JSON.stringify(args);
    if (cache[k]) {
      return cache[k];
    }
    const result = f(...args);
    cache[k] = result;
    return result;
  }

  return ((m: any): T);
}
