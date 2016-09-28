'use strict';

var utils = {

  doneTests: {},

  genKeyBindingsObject: function genKeyBindingsObject() {
    var _this = this;

    var keyBindings = [];

    testsConfig.forEach(function (details, idx) {
      keyBindings.push({
        keyCodes: details.keyCodes,
        callback: function callback() {
          _this.doneTests[details.name] = details;
          console.log('CALLBACK', details.name);
        }
      });
    });

    return keyBindings;
  },
  triggerKeyUpSeries: function triggerKeyUpSeries(keyCodes, delay, callback) {
    var _this2 = this;

    var currTimeoutTime = 0;
    var currKeyCodeIdx = 0;

    var setDelay = function setDelay() {
      setTimeout(function () {
        _this2.triggerKeyUp(keyCodes[currKeyCodeIdx]);
        currKeyCodeIdx++;

        if (keyCodes.length > currKeyCodeIdx) {
          currTimeoutTime += delay;
          setDelay();
        } else {
          callback();
        }
      }, currTimeoutTime);
    };

    setDelay();
  },
  triggerKeyUp: function triggerKeyUp(code) {
    //http://stackoverflow.com/questions/22574431/testing-keydown-events-in-jasmine-with-specific-keycode
    var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack: filter this otherwise Safari will complain
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      Object.defineProperty(oEvent, 'keyCode', {
        get: function get() {
          return this.keyCodeVal;
        }
      });
      Object.defineProperty(oEvent, 'which', {
        get: function get() {
          return this.keyCodeVal;
        }
      });
    }

    if (oEvent.initKeyboardEvent) {
      oEvent.initKeyboardEvent('keyup', true, true, document.defaultView, false, false, false, false, code, code);
    } else {
      oEvent.initKeyEvent('keyup', true, true, document.defaultView, false, false, false, false, code, 0);
    }

    oEvent.keyCodeVal = code;

    if (oEvent.keyCode !== code) {
      console.log("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ") -> " + code);
    }

    document.body.dispatchEvent(oEvent);
  }
};

document.addEventListener('keyup', function (e) {
  console.log('KEYUP TRIGGERED', e.keyCode);
});

new Hotshot({
  waitForInputTime: WAIT_FOR_INPUT_TIME,
  bindings: utils.genKeyBindingsObject()
});