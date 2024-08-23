---
date: 2024-08-23T01:18:38.163Z
title: Generosity In Software
description: A culture of giving and the high returns of kindness
slug: generosity-in-software
---

Almost 8 years ago I privately reached out to
[BurntSushi](https://github.com/BurntSushi) asking about his
[CSV parser](https://github.com/BurntSushi/rust-csv) and how to get started
implementing my own. I never expected an answer, but he replied _very_
thoroughly.

<!--more-->

I basically copied everything he said to make
[my own csv parser](https://github.com/AriaFallah/csv-parser), which I suppose I
can write a very overdue blog post about later. But what I want to talk about
here was how incredible it was that he put poured that amount of effort into
something that only one person would ever see. Even later, when I felt kinda bad
for taking up his time and offered to pay for his advice, he was very kind and
just asked me to donate to a cause I care for.

**I love that guy**. He modeled such incredible values, and for me it was very
influential.

When it comes to software, people are so generous with their
time/effort/projects online. I don't know if I can write so poignantly on the
topic, but I guess I just want to say that without the help of random
commenters, open source authors, stackoverflow question-answerers, blog-post
writers, talk-givers, and more, there's no way I'd have ever come close to
having the amount of knowledge and success I've had now. That level of
widespread generosity and knowledge-sharing permeating every facet of the
profession feels relatively unique to me, and it's something I'm very thankful
for.

In general I try emulate and preserve that culture and try to continue paying it
forward because I think it can have a larger impact than you think. For example,
in the case of BurntSushi taking the time to help me, that parser I wrote got
140 stars, which is a lot for a random boring C++ project, had 4 other people
make changes
([who I added as contributers](https://felixge.de/2013/03/11/the-pull-request-hack/)),
and, I assume is being used by others for things I can't even imagine (lol for
real because after writing this I discovered,
[a tool for a Digimon game's files](https://github.com/SydMontague/DSCSTools),
is using it). And even if other people never used it, it's been very personally
influential as it seems I still can't shut up about it after all this time 😅.

Also, to that end of paying things forward, I figure that maybe those messages
would be much more useful to the world had I not been afraid to publicly ask on
GitHub vs. hidden in some random inbox. So, better late than never, here they
are (regrettably without me editing any parts I find cringey out):

## Messages to BurntSushi

### Nov 22nd 2016

Hey Burnt Sushi,

I'm a computer science student currently trying to figure parsers, and I figured
the best way to do that was to write my own simple parser. I decided that I
would make a CSV parser, and while looking around at the existing examples, I
found yours.

I didn't want to make this an issue on github since I didn't think it would be
appropriate, but I was curious of you could give me a "behind the scenes" of how
you decided to make the parser. After reading through the source code (I don't
really know rust so I might be wrong), it seems like it's not a typical LR(1)
parser with the shifting and reducing, or anything else I really can recognize
without spending a few more hours just reading through the code again and again.

So to get to the point, I was hoping you could answer the following:

- How'd you originally come up with the design for the parser? Did you write out
  a grammar, and decide to write an LR(1) parser (or any other kind of parser)
  based on it? If you didn't approach it that formally, how did you decide how
  to make it?
- In the same gist of the above question, how does your parser differ from one
  that I would create by feeding a grammar into a parser generator?
- Your parser seems to be faster than most, and other than the fact that it's
  written in Rust, did you do anything in particular to give it extra speed?

I would really appreciate it if you could explain the above, and when I figure
it all out I'd definitely pay it forward by making a tutorial or something
([my blog needs more entries anyways :p](https://blog.aria.ai/)).

---

> I didn't want to make this an issue on github since I didn't think it would be
> appropriate, but I was curious of you could give me a "behind the scenes" of
> how you decided to make the parser.

Happy to! Generally speaking, I'm pretty liberal when it comes to the issue
tracker on low traffic projects, so feel free to ask questions there! Plus, it
benefits anyone else who sees it. Stricter policies only really matter at higher
volumes IMO. :-)

> it seems like it's not a typical LR(1) parser with the shifting and reducing

Indeed not!

> or anything else I really can recognize without spending a few more hours just
> reading through the code again and again.

I'd probably assign the following attributes to it:

1. Hand written.
2. Deterministic finite state machine. (There are multiple classes of DFAs,
   including table driven, gotos or just direct code. My csv library uses direct
   code, which is especially nice in a language with algebraic data types and
   pattern matching.)
3. Pull. (As opposed to push. In a pull parser, a caller asks the parser for
   most stuff. In a push parser, the caller is given more stuff. The telltale
   sign of a push parser is the visitor pattern using either an explicit
   interface or closures.)

> How'd you originally come up with the design for the parser? Did you write out
> a grammar, and decide to write an LR(1) parser (or any other kind of parser)
> based on it? If you didn't approach it that formally, how did you decide how
> to make it?

I never wrote out the grammar. For the most part, I
[read the specification](https://tools.ietf.org/html/rfc4180) and started
implementing that in the most natural way possible. LR(1) parsers are _huge
complicated beasts_, and if you don't absolutely need them, then I don't see any
good reason to use them. For something as simple as CSV, you don't even need the
full power of context-free languages anyway. A simple DFA does the trick. DFAs
are simple because all you need to do is maintain a state transition function.
The function takes in the current state and the current character and spits out
the next state. That transition function is
[encoded in this match expression](https://github.com/BurntSushi/rust-csv/blob/master/src/reader.rs#L642-L713).

Once I had an initial implementation done, I wrote as many test cases as I
could. Once that was done, I tested it on as much real data as I could and
compared it to a battle-tested parser such as the one found in Python's standard
library.

> In the same gist of the above question, how does your parser differ from one
> that I would create by feeding a grammar into a parser generator?

It's probably a lot faster. Full parser generators are meant to handle a much
more complicated class of language than CSV.

I also find hand written parsers nicer to maintain and they give you more
control over the performance trade offs you take. Parser generators are useful
when your language is sufficiently complex and your performance requirements are
sufficiently relaxed.

> Your parser seems to be faster than most, and other than the fact that it's
> written in Rust, did you do anything in particular to give it extra speed?

The key to a fast CSV parser is to avoid allocation. If you look in the core
`next` method, you'll see that it reuses an internal buffer and returns a
reference to it for the caller. If the caller wants to hold on to that data,
then they can allocate room for it and copy it to that space. Otherwise, they
can just throw it away.

While the internal buffer can allocate, in practice, the cost is amortized
because most CSV cells are going to be of similar length. The worst case is if
each subsequent CSV cell grew by N bytes, but even then, the underlying
dynamically growable array (in Rust, that's `Vec<T>`) will amortize that growth
by doubling its size whenever it needs more capacity.

The other key to a fast CSV parser is to do as little branching as possible.
This is where finite state machines shine.

I bet it would be even faster to turn this into a table-driven DFA, but those
are typically auto generated by tools like Ragel. However, CSV's state machine
is simple enough that I bet someone could hand write it.

> I would really appreciate it if you could explain the above, and when I figure
> it all out I'd definitely pay it forward by making a tutorial or something (my
> blog needs more entries anyways :p).

Good luck! Please feel free to ask more questions.

One other thing that's worth mentioned: a lot of people, such as myself, _enjoy_
the process of hand writing parsers. My favorite parser that I've written is
probably a
[regular expression syntax parser](https://github.com/rust-lang-nursery/regex/blob/master/regex-syntax/src/parser.rs).

The other class of parsers that I haven't mentioned here are
[parser combinators](https://en.wikipedia.org/wiki/Parser_combinator). They were
popularized by the Haskell
[`parsec`](https://hackage.haskell.org/package/parsec) library, but Rust has
[its own parser combinator library called `nom`](https://github.com/Geal/nom).
It would be an interesting exercise to write a CSV parser in `nom` and compare
it to my hand written one.

## March 23nd 2017

Hey again!

So I, naively, feel like my CSV parser is mostly complete. After (naively)
benchmarking it against yours though, it still seems to be significantly slower.
I was wondering if you would be willing to take some time to look at my parser
(https://github.com/AriaFallah/csv-parser/blob/master/parser.hpp), and give me a
code review / advice on how to make it faster (also I'm sure you could break it
in some way or another 😅). I know you said

> The key to a fast CSV parser is to avoid allocation.

and I've tried to abide by that...seems like I haven't really succeeded though
haha.

I'd be willing to pay for your time through paypal or something since I know
you're probably extremely busy. I just am not quite sure how to know if I'm in
the right or wrong without reaching out to people like you with a good amount of
expertise in the subject.

I'd really appreciate it.

Please let me know :)

---

> I was wondering if you would be willing to take some time to look at my parser
> (https://github.com/AriaFallah/csv-parser/blob/master/parser.hpp), and give me
> a code review / advice on how to make it faster (also I'm sure you could break
> it in some way or another 😅).

I'd be happy to... Unfortunately, I'm not a C++ programmer. I can read it
somewhat though. Reading through it, I don't have any major criticisms. It does
seem like your `read_all` method is allocating new space for each row though. To
do a benchmark, you probably want to avoid storing the entire CSV file in memory
and just seeing how long it takes to parse each row. Ideally, parsing a row can
reuse memory from the previous row.

The key isn't really to "avoid allocation." That's a bit misleading. The key is
to _amortize_ allocation. (You obviously get that concept, since you're doing
buffered reads, which is one form of amortizing both allocation and syscalls to
read data from a file descriptor.)

> I just am not quite sure how to know if I'm in the right or wrong without
> reaching out to people like you with a good amount of expertise in the
> subject.

Reaching out is good!

I don't ever accept payment for stuff like this. If you are feeling generous,
I'd recommend donating it to cause you care about. :-)
