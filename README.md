Hotshot.js
==========
### A teeny tiny keyboard shortcuts library

### Usage
```js
new Hotshot({
  //number of milliseconds we wait for user input before the callback is triggered
  //this is only done if there is also a shortcut with more chars available
  //e.g. if the user pressed gs and gsp is available then we wait
  //otherwise we trigger the callback right away
  waitForInputTime: 500, 
  bindings: [{
    keyCodes: [71, 83],
    callback: () => console.log('TRIGGER', 'G S')
  }, {
    keyCodes: [71, 83, 80],
    callback: () => console.log('TRIGGER', 'G S P')
  }, {
    keyCodes: [91, 13, 71, 83, 80],
    callback: () => console.log('TRIGGER', 'COMMAND ENTER G S P')
  }, {
    keyCodes: [91, 13],
    callback: () => console.log('TRIGGER', 'COMMAND ENTER')
  }, {
    keyCodes: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
    callback: () => console.log('TRIGGER', '↑ ↑ ↓ ↓ ← → ← → B A')
  }]
});
```

### Development
1. Make sure you have the dev deps installed: `npm i`
2. Make your changes in `src/` and run `npm run build` to build to `build/`
3. Update the tests in `test/src` and run `npm test` to test
4. If all tests pass you're good to go!
5. ![](http://media.tumblr.com/tumblr_meh2kbVICW1rrdzra.gif)

> Run `npm run watch` to watch for changes in `src/Hotshot.js`. When it changes it will run the `build` and `test` scripts.

### Quickly Finding Keycodes
The bindings object works with key codes instead of actual letters for performance reasons. Want to quickly find the key codes you need for your shortcut? Use [this](http://jsbin.com/yayocohace/embed?js,console,output) jsbin.

### Why not use an existing library like `Mousetrap`?
https://github.com/Shopify/shopify/issues/83034

