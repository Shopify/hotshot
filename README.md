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
1. Make your changes in the `src/Hotshot.js` file
2. Make sure you have the dev deps installed: `npm i`
3. Build: `npm run build`
4. Compiled files can be found in `dist/`
5. ![](http://media.tumblr.com/tumblr_meh2kbVICW1rrdzra.gif)


