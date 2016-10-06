Hotshot.js
==========
### A teeny tiny keyboard shortcuts library

### Usage
```js
const hotshot = new Hotshot({
  //number of milliseconds we wait for user input before the callback is triggered
  //this is only done if there is also a shortcut with more chars available
  //e.g. if the user pressed gs and gsp is available then we wait
  //otherwise we trigger the callback right away
  waitForInputTime: 500, 
  seqs: [{
    keyCodes: [71, 83],
    callback: () => console.log('TRIGGER', 'G S')
  }, {
    keyCodes: [71, 83, 80],
    callback: () => console.log('TRIGGER', 'G S P')
  }, {
    keyCodes: [91, 13, 71, 83, 80],
    callback: () => console.log('TRIGGER', 'COMMAND ENTER G S P')
  }, {
    keyCodes: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
    callback: () => console.log('TRIGGER', '↑ ↑ ↓ ↓ ← → ← → B A')
  }],
  combos: [{
    keyCodes: [91, 66],
    callback: () => console.log('TRIGGER', 'COMMAND+B')
  }]
});

hotshot.bindSeq([65, 66, 71], () => console.log('TRIGGER', 'A B G'));
hotshot.bindCombo([91, 65], () => console.log('TRIGGER', 'COMMAND+A'));
```

### Development
1. Make sure you have the dev deps installed: `npm i`
2. Make your changes in `src/` and run `npm run build` to build to `build/`
3. Run `npm test` and make sure all tests still pass
4. ![](http://media.tumblr.com/tumblr_meh2kbVICW1rrdzra.gif)

> Run `npm run watch` to watch for changes in `src/Hotshot.js`.
> Run `npm run serve-test` to serve the manual test file on `localhost:9000/demo.html`

### Quickly Finding Keycodes
The bindings object works with key codes instead of actual letters for performance reasons. Want to quickly find the key codes you need for your shortcut? Use [this](http://jsbin.com/yayocohace/embed?js,console,output) jsbin.

### Why not use an existing library like `Mousetrap`?
Mousetrap:
- Does not currently support a combination of two and three letter sequences ([details](https://github.com/ccampbell/mousetrap/issues/362))
- Supports IE 6+ which we don't really need. We support IE 11+ at the moment.
- Spends extra time and code on string character to key code conversion. With `Hotshot` we went with just using key codes.
