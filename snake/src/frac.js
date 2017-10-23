// @flow

export default class Frac {
  numerator: number;
  denominator: number;

  static add(a: Frac, b: Frac): Frac {
    if (a.denominator === b.denominator) {
      return new Frac(a.numerator + b.numerator, a.denominator);
    }

    const [a1, b1] = Frac.lcd(a, b);
    return Frac.add(a1, b1);
  }

  static ceil(a: Frac): Frac {
    const val = a.val();
    return new Frac(a.val() % 1 === 0 ? val + 1 : Math.ceil(val), 1);
  }

  static floor(a: Frac): Frac {
    const val = a.val();
    return new Frac(a.val() % 1 === 0 ? val - 1 : Math.floor(val), 1);
  }

  static lcd(a: Frac, b: Frac): [Frac, Frac] {
    const f1 = factors(a.denominator);
    const f2 = factors(b.denominator);

    let aMul = b.denominator;
    let bMul = a.denominator;
    let minD = a.denominator * b.denominator;

    for (const factor of Object.keys(f1)) {
      if (f2[factor]) {
        const newD = a.denominator * f2[factor];
        if (newD < minD) {
          minD = newD;
          aMul = f2[factor];
          bMul = f1[factor];
        }
      }
    }

    const a1 = new Frac(a.numerator * aMul, minD);
    const b1 = new Frac(b.numerator * bMul, minD);
    return [a1, b1];
  }

  static sub(a: Frac, b: Frac): Frac {
    if (a.denominator === b.denominator) {
      return new Frac(a.numerator - b.numerator, a.denominator);
    }

    const [a1, b1] = Frac.lcd(a, b);
    return Frac.sub(a1, b1);
  }

  constructor(n: number, d: number) {
    this.numerator = n;
    this.denominator = d;
  }

  val(): number {
    return this.numerator / this.denominator;
  }
}

const mem = {};
function factors(x: number): Object {
  if (mem[x]) {
    return mem[x];
  }

  const f = {};
  for (let i = 2; i <= x; ++i) {
    if (x % i === 0 && !f[x / i]) {
      f[i] = x / i;
    }
  }

  mem[x] = f;
  return f;
}
