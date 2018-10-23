---
{
  "date": "2016-09-13T14:00:00-05:00",
  "description": "My first blog post",
  "slug": "hello-world",
  "title": "Hello World"
}
---

I had some pretty good ideas for this blog a while ago, but now I've forgotten
them all. The rest of this post will be a markdown demo.

<!--more-->

---

Anyways this is what _italicized text_, **bold text**, and
[links](https://google.com) look like.

---

Quotes

> If the French noblesse had been capable of playing cricket with their
> peasants, their chateaux would never have been burnt.

---

Code sample

```js
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
```

---

Lists

- Ignore blog
- Stop ignoring blog

1. Make unordered list
2. Make ordered list

---

Headings

# HI

## HI

### HI

#### HI

##### HI

###### HI

---

Tables

| Tables   |      Are      |  Cool |
| -------- | :-----------: | ----: |
| col 1 is | left-aligned  | $1600 |
| col 2 is |   centered    |   $12 |
| col 3 is | right-aligned |    $1 |

```

```
