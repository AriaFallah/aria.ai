---
{
  "date": "2020-11-30T05:03:51.141Z",
  "description": "Have your small font size cake and eat it too",
  "slug": "ios-stop-auto-input-zoom-hook",
  "title": "Stopping iOS input zoom with a handy React hook"
}
---

There's
[this stack overflow post](https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone)
with tons of views and upvotes and solutions on how to prevent iOS from zooming
into inputs on forms. Unfortunately the advice is terrible. Make my font size
16px??? Preposterous! Disable zoooming completely??? Am I an animal?! If only
there was a better way!

<!--more-->

Well there is! Here's the gist of it:

```js
// Get the input some way
const input = document.getElementByID('username_input');

function handleFocus() {
  input.style.fontSize = '16px';
}
function handleBlur() {
  input.style.fontSize = '';
}

input.addEventListener('touchstart', handleFocus);
input.addEventListener('blur', handleBlur);
```

We make the font bigger when they touch the input and we make it smaller when
the input loses focus. Absolutely genius. One might wonder why `touchstart`
instead of `focus`? Well it's because when I tested it, it didn't work when you
switched directly between two different inputs...very strange.

This is only a problem on iOS though so how can we tell the device type? We
could pull in a battle-tested library like `react-device-detect` without really
thinking about it, ORRR we could read yet another
[stack overflow post](https://stackoverflow.com/questions/9038625/detect-if-device-is-ios),
cross reference all the answers to figure out the actual right one, get confused
which is best, end up reading
[the source code](https://github.com/duskload/react-device-detect/blob/master/src/components/helpers/get-ua-data.js#L30-L35)
of `react-device-detect` to confirm, and we end up with

```js
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.platform);
}
```

Just kidding we have to support iPad kids so we get

```js
function isIOS() {
  return (
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  );
}
```

Now you can slap a `if (!isIOS())` early return at the top of your code to let
everyone else except the apple elitists enjoy your tiny tiny text.

## Wait it's 2020

JavaScript isn't even real in 2020 if you don't have `import React` at the top
so we **must** turn this into a hook. Do you really think I use
`document.getElementID` like some sort of savage? Behold

```js
function useIOSInputRef() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (input == null || !isIOS()) {
      return;
    }

    function handleFocus() {
      input.style.fontSize = '16px';
    }
    function handleBlur() {
      input.style.fontSize = '';
    }

    input.addEventListener('touchstart', handleFocus);
    input.addEventListener('blur', handleBlur);

    return () => {
      input.removeEventListener('touchstart', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  }, []);

  return inputRef;
}
```

Then in your code you'd use it like

```js
function MyComponent() {
  const inputRef = useIOSInputRef();
  return <input className="super-tiny-font" ref={inputRef} type="text" />;
}
```

# Wait that Makes No Sense

Raw `addEventListener` calls? A hook? Jokes aside if we want to do this
idiomatically, we can simply use the appropriate event handlers React allows us
to specify. Thus we can better write this as:

```js
function getIOSInputEventHandlers() {
  if (isIOS()) {
    return {};
  }

  return {
    onTouchStart: (e) => {
      e.currentTarget.style.fontSize = '16px';
    },
    onBlur: (e) => {
      e.currentTarget.style.fontSize = '';
    },
  };
}
```

and use it like

```js
function MyComponent() {
  return (
    <input
      {...getIOSInputEventHandlers()}
      className="super-tiny-font"
      type="text"
    />
  );
}
```

---

With that you will never be a slave to someone else's random font-size
preferences. Take that Apple!
