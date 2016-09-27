const utils = {

  doneTests: {},

  genKeyBindingsObject(){
    const keyBindings = [];
    
    testsConfig.forEach((details, idx) => {
      keyBindings.push({
        keyCodes: details.keyCodes,
        callback: () => this.doneTests[details.name] = details
      });
    });

    return keyBindings;
  },

  triggerKeyUpSeries(keyCodes, delay, callback){
    let currTimeoutTime = 0;
    let currKeyCodeIdx = 0;

    let setDelay = () => {
      setTimeout(() => {
        this.triggerKeyUp(keyCodes[currKeyCodeIdx]);
        currKeyCodeIdx++;

        if (keyCodes.length > (currKeyCodeIdx)) {
          currTimeoutTime += delay;
          setDelay();
        } else {
          callback();
        }
      }, currTimeoutTime);
    };

    setDelay();
  },

  triggerKeyUp(code){
    //http://stackoverflow.com/questions/22574431/testing-keydown-events-in-jasmine-with-specific-keycode
    var oEvent = document.createEvent('KeyboardEvent');

    // Chromium Hack: filter this otherwise Safari will complain
    if( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ){
      Object.defineProperty(oEvent, 'keyCode', {
        get : function() {
          return this.keyCodeVal;
        }
      });     
      Object.defineProperty(oEvent, 'which', {
        get : function() {
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
      console.log("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ") -> "+ code);
    }

    document.body.dispatchEvent(oEvent);
  }

};

document.addEventListener('keyup', (e) => {
  console.log('KEYUP TRIGGERED', e.keyCode);
});

new Hotshot({
  waitForInputTime: WAIT_FOR_INPUT_TIME, 
  bindings: utils.genKeyBindingsObject()
});