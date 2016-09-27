Hotshot.js
==========
### A teeny tiny keyboard shortcuts library [WIP]

### Usage
```js
new Hotshot({
  //number of milliseconds we wait for user input before the callback is triggered
  waitForInputTime: 300,
  bindings: [{
    keyCodes: [71, 83], //gs
    callback: () => console.log('TRIGGER', 'G S')
  }, {
    keyCodes: [71, 83, 80], //gsp
    callback: () => console.log('TRIGGER', 'G S P')
  }]
});
```

### Development
1. Make sure you have the dev deps installed: `npm i`
2. Open `test.html` and run `npm run watch` to watch for changes
3. Make your changes in the `src/Hotshot.js` file
4. When done run `npm run build` to also create a minified file
5. Compiled files can be found in `dist/`
6. ![](http://media.tumblr.com/tumblr_meh2kbVICW1rrdzra.gif)

### Note
The bindings object works with key codes instead of actual letters for performance reasons. Want to quickly find the key codes you need for your shortcut? Use [this](http://jsbin.com/yayocohace/embed?js,console,output) jsbin.

