// @flow

export default class Frac {
  numerator: number;
  denominator: number;

  static add(a: Frac, b: Frac): Frac {
    return new Frac(
      a.numerator * b.denominator + b.numerator * a.denominator,
      a.denominator * b.denominator
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

  static sub(a: Frac, b: Frac): Frac {
    return new Frac(
      a.numerator * b.denominator - b.numerator * a.denominator,
      a.denominator * b.denominator
    );
  }

  constructor(n: number, d: number) {
    this.numerator = n;
    this.denominator = d;
  }

  val(): number {
    return this.numerator / this.denominator;
  }
}
