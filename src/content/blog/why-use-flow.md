---
date: 2016-09-13T18:00:00-05:00
timezone: America/New_York
description:
  An introduction to and explanation of the benefits of static typing in
  JavaScript
slug: why-use-flow
title: Why Use Flow?
---

[Flow](https://flow.org) is a static type checker for JavaScript open sourced by
Facebook. It helps you deal with many of the pain points of JavaScript and write
better, easier to reason about code.

<!--more-->

According to flow's homepage:

> Flow can catch common bugs in JavaScript programs before they run, including
>
> - silent type conversions,
> - null dereferences,
> - and the dreaded undefined is not a function.

and

> Flow also lets you gradually add type assertions to your code

So flow is a solution to many common JavaScript problems that you can gradually
introduce into your codebase. Pretty cool!

## Types

Before we even address flow, however, we must first clarify what types are. I'm
going to go ahead and use the definition in
[Wikipedia's data types article:](https://en.wikipedia.org/wiki/Data_type)

> A type is a classification identifying one of various types of data, such as
> real, integer or boolean, that determines the possible values for that type,
> the operations that can be done on values of that type, the meaning of the
> data, and the way values of that type can be stored.

More simply put, in my own words, types are rules about the data in your
program, and those rules help the computer determine what you can and can't do
with that data, which can be pretty helpful if you accidentally try to break
those rules.

As you write code in different languages though, you'll notice that the ways
that types manifest themselves can vary quite a bit, from being explicitly
required, to optional, to nearly non-existent. Generally the type systems of
programming languages fall into two categories: Strong vs. Weak and Static vs
Dynamic.

### Strong typing vs. Weak typing

[Wikipedia has a great article on this.](https://en.wikipedia.org/wiki/Strong_and_weak_typing)
The general consensus being that strong vs. weak is a bit ambiguous because
there is no agreed upon definition. I'm going to go with the definition on the
wikipedia page titled

> Implicit type conversions and "type punning"

---

In a strongly typed language such as python, a mismatch between two incompatible
values will cause a type error. The only way to avoid type errors is to
explicitly transform values such that they match up.

```python
x = 5
print x + "" # cannot add integers to strings
```

throws the following error

```python
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

but this is fine

```python
x = 5
print str(x) + "" # transformed x to a string so it's fine
```

---

In a weakly typed language such as JavaScript, anything goes because variables
are all implicitly have their types converted when they're used. You can add
strings to Objects, Arrays to Objects, numbers to null, and more; even worse,
none of it throws an error if it's an accident.

```js
console.log({} + {}); // NaN
console.log({} + []); // 0
console.log([] + []); // ''
console.log({} + 2); // [object Object]2
console.log({} + 'hello'); // [object Object]hello
```

I think you can imagine all the possible problems that arise from all this
happening without throwing any errors whatsoever.

### Static typing vs. Dynamic typing

Static vs Dynamic typing is a bit more controversial than Weak vs. Strong. I'm
not going to be saying one is better than another or giving a comprehensive
breakdown of the benefits of each; instead, I'll just be giving a brief
introduction of both. If you want to see a bit more debate which is better, the
following are great discussions

- [Is type safety worth the trade-offs?](http://programmers.stackexchange.com/questions/59606/is-type-safety-worth-the-trade-offs)
- [What is the supposed productivity gain of dynamic typing?](http://programmers.stackexchange.com/questions/122205/what-is-the-supposed-productivity-gain-of-dynamic-typing)

Now given that disclaimer:

**Static Typing**

As far as I know most statically typed languages are also strongly typed.
Moreover, in a statically typed language, you explicitly write out the types of
your variables. Most people have seen Java, a statically typed language, where
you write the types of your variables out such as `int` or `String`, and the
return type and parameter types of your functions like `int add(int a, int b)`:

```java
public class Hello {
  public static void main(String[] args) {
    int x = 5;
    int y = 10;
    String s = "1.23131";

    System.out.println(add(x, y)); // 15
    System.out.println(add(x, s)); // Incompatible types: String cannot be converted to int
  }

  public static int add(int a, int b) {
    return a + b;
  }
}
```

This code will throw an error at line 8 when you compile your code because you
cannot add a `String` type to an `int` type.

Note that:

- The error is caught at compile-time instead of at run-time, which means you
  can't even run the code until you fix the errors.
- If you're using an IDE, you'd get a message saying that `add(x, s)` isn't
  possible. Because you specified your types in advance, your code can be
  analyzed at a higher level without compiling to find mistakes.
- If the function was instead called `sfjkasjf` instead of `add`, you'd still
  know that it takes in two integers and returns an integer, which is useful
  information.

**Type Inference in Statically Typed Languages**

What I said earlier about statically typed languages needing types to be
explicitly written out is not 100% true. In languages without type inference
such as Java this is true, but in languages with type inference, you can leave
it to the computer to figure out what types you're using. For example, the
following example contains the same code above written in Haskell, a language
known for its really powerful type system, but where I write `let x = 1` as well
as where I write `let add' = (+)` Haskell infers the types, and doesn't require
explicit guidance.

**Haskell**

```haskell
main :: IO()
main = do
  let x = 1
  let y = 2
  let s = ""

  -- Type inference
  let add' = (+)

  print (add x y)  -- 3
  print (add' x y) -- 3
  print (add x s)  -- throws error

-- With Explicit Types
add :: Int -> Int -> Int
add = (+)
```

Type inference exists in many other type systems including flow's type system.
The general idea though is that while type inference makes your life a bit
easier since you don't have to write as much, you can't and shouldn't rely on
type inference for everything.

---

**Dynamic Typing**

In a dynamically typed language, the only concept of typing comes from the types
of the values in your code. You never write out types yourself. The main benefit
of this is that your code looks less cluttered, and you don't have to think
about types at all while programming, which is a productivity boost in the short
run. In python, the above code for addition would look like:

```python
def main():
  x = 5
  y = 10
  s = "1.23131"

  print add(x, y) # 15
  print add(x, s) # TypeError: unsupported operand type(s) for +: 'int' and 'str'

def add(a, b):
  return a + b
```

This code will throw an error at line 7 when you run your code because you
cannot add a `string` type to an `int` type. Remember though, that the only
reason this is an error is because python is strongly typed.
`add(5, "1.2313213")` would be 100% valid in a weakly typed language like
JavaScript.

Note that

- The code is more concise
- There is no type inference going on. In dynamically typed languages variables
  are just containers for values, and have no other special properties.
  `add(x, s)` fails because during run-time you try to add an `int` and a
  `string` not because the interpreter figured out in advance `x` and `s` are
  not compatible.
- You can't really tell what the type of `a` and `b` are. `int`, `string`,
  `float`, `etc.` are all possibilities.
- It still throws an error when you run it, albeit at run-time rather than
  compile-time, which is a big distinction. This means testing is more crucial
  for dynamically typed languages because they will run just fine even if the
  code contains type errors.

## Bringing it back to JavaScript and Flow

Now that we know more about types, we can get back to the matter at hand, which
is making it harder to make mistakes in your JavaScript code.

JavaScript is both weakly and dynamically typed, which is a flexible but
extremely error prone combination. As we read above, we know that due to
implicit casting all operations between values of different types happen without
error regardless of whether or not those operations are valid (weak typing), and
that you never write out your types yourself (dynamic typing).

This mishmash of weak and dynamic is pretty unfortunate as you can see in
following example and countless others that criticize these qualities of the
language.

- [wat](https://www.destroyallsoftware.com/talks/wat)

The solution to most of these problems is flow, which through static typing and
type inference, addresses a lot of the pain points of the language like the one
above.

This isn't a tutorial, so if you want to follow along you can check out
[the getting started guide for flow.](https://flowtype.org/docs/getting-started.html)

Lets go ahead and return to our very first JS example in the weak typing
section, but this time with flow checking our code.

We add `// @flow` to the first line of the program to opt into typing, and then
run the command line tool `flow` to check our code (IDE integration is also
possible):

```js
// @flow
// ^^^^^ that's necessary to activate flow
// flow is opt-in to allow you to gradually add types

console.log({} + {}); // NaN
console.log({} + []); // 0
console.log([] + []); // ''
console.log({} + 2); // [object Object]2
console.log({} + 'hello'); // [object Object]hello
```

Immediately **every single line** becomes a type error similar to the one below.

```js
index.js:3
  3: console.log({} + {}) // NaN
                 ^^ object literal. This type cannot be added to
  3: console.log({} + {}) // NaN
                 ^^^^^^^ string
```

Without doing any extra work to add type annotations, flow already indicates
that there's something incorrect going on. The `wat` video doesn't really apply
anymore.

### Benefits of annotating your code

While flow will help catch errors like the one above, to truly start benefiting
from it, you'll have to write your own type annotations, meaning you use either
flow's built in types such as `number`, `string`, `null`, `boolean`, `etc.` to
specify the types of your values or you create some type aliases of your own
such as

```js
type Person = {
  age: number,
  name: string,
  gender: 'male' | 'female',
};
```

Now you can transform a function such as

```js
function xyz(x, y, z) {
  return x + y + z;
}
```

into

```js
// @flow

function xyz(x: number, y: number, z: number): number {
  return x + y + z;
}
```

In this specific case we know that xyz is supposed to take in 3 numbers and
return a number. Now if you tried to do `xyz({}, '2', [])`, which is 100% valid
JavaScript (lol), flow would throw an error! As you begin to do this more and
more, flow learns more about your code base and gets better at telling you what
mistakes you've made.

## A Few Examples

**Catches Incorrect Number of Parameters Passed to Function**

Code:

```js
// @flow

function xyz(x: number, y: number, z: number): number {
  return x + y + z;
}

xyz(1, 2);
```

Error:

```js
index.js:7
  7: xyz(1, 2)
     ^^^^^^^^^ function call
  7: xyz(1, 2)
     ^^^^^^^^^ undefined (too few arguments, expected default/rest parameters). This type is incompatible with
  3: function xyz(x: number, y: number, z: number): number {
                                           ^^^^^^ number
```

**Catches Incorrect Parameter Types**

Code:

```js
// @flow

function xyz(x: number, y: number, z: number): number {
  return x + y + z;
}

xyz(1, 2, '');
```

Error:

```js
index.js:7
  7: xyz(1, 2, '')
     ^^^^^^^^^^^^^ function call
  7: xyz(1, 2, '')
               ^^ string. This type is incompatible with
  3: function xyz(x: number, y: number, z: number): number {
                                           ^^^^^^ number
```

**Makes Sure You Don't Forget to Check for NULL**

Code:

```js
// @flow

function xyz(x: number, y: number, z: number): ?number {
  return Math.random() < 0.5 ? x + y + z : null;
}

function printNumber(x: number): void {
  console.log(x);
}

printNumber(xyz(1, 2, 3));
```

Error:

```js
index.js:11
 11: printNumber(xyz(1, 2, 3))
     ^^^^^^^^^^^^^^^^^^^^^^^^^ function call
 11: printNumber(xyz(1, 2, 3))
                 ^^^^^^^^^^^^ null. This type is incompatible with
  7: function printNumber(x: number): void {
                             ^^^^^^ number
```

**Makes Sure You Return The Right Types**

Code:

```js
// @flow

function xyz(x: number, y: number, z: number): number {
  return Math.random() < 0.5 ? x + y + z : null;
}
```

Error:

```js
index.js:6
  6:     : null
           ^^^^ null. This type is incompatible with the expected return type of
  3: function xyz(x: number, y: number, z: number): number {
                                                    ^^^^^^ number
```

**Make Sure Your Objects Contain All the Properties They're Supposed to
Contain**

Code:

```js
// @flow

type Person = {
  age: number,
  name: string,
  gender: 'male' | 'female',
};

const person: Person = { name: 'joe', age: 10 };
```

Error:

```js
index.js:9
  9: const person: Person = { name: 'joe', age: 10 }
                   ^^^^^^ property `gender`. Property not found in
  9: const person: Person = { name: 'joe', age: 10 }
                            ^^^^^^^^^^^^^^^^^^^^^^^^ object literal
```

**Make Sure You Don't Access Nonexistent Object Properties**

Code:

```js
// @flow

type Person = {
  age: number,
  name: string,
  gender: 'male' | 'female',
};

const person: Person = { name: 'joe', age: 10, gender: 'male' };
console.log(person.job);
```

Error:

```js
index.js:9
  9: console.log(person.job)
                        ^^^ property `job`. Property not found in
  9: console.log(person.job)
                 ^^^^^^ object type
```

## Going Deeper

There's a few more common benefits that I'm probably forgetting, but the above
examples cover most of them. If you're thinking, "that's it?", the rabbit hole
goes much much deeper. Types are really powerful almost to the point that
they're like tests that you inline into your code. It's not just about variable
types or return types, but every single aspect of your program that can be
conceptualized as a type.

[Giulio Canti](https://github.com/gcanti) has written quite a few articles on
the more advanced things that you can do with flow that allow you to make sure
every part of your code is working as intended.

- You can use types to check if user input has been validated in
  [Phantom Types with Flow](https://medium.com/@gcanti/phantom-types-with-flow-828aff73232b#.su86baahz)
- You can create types with built in constraints in
  [Refinement Types with Flow](https://medium.com/@gcanti/refinements-with-flow-9c7eeae8478b#.e2ik0oqgs)
- You can create higher kinded types in
  [Higher Kinded Types with Flow](https://medium.com/@gcanti/higher-kinded-types-in-flow-275b657992b7#.1oa0j4u1a)
- You can express the side effects of your code as types in
  [The Eff Monad Implemented in Flow](https://medium.com/@gcanti/the-eff-monad-implemented-in-flow-40803670c3eb#.i067byfnq)

He also has authored
[flow-static-land,](https://github.com/gcanti/flow-static-land) which is pretty
mind blowing.

## Conclusion

TL;DR:

- JavaScript is weakly and dynamically typed, which is error prone and a big
  reason for the bad rep of the language.
- With little upfront cost and with the ability to opt-in slowly, Flow fixes
  both of these things by adding a type system to JavaScript.
