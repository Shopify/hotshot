class Hotshot {
  constructor({ waitForInputTime, bindings }){
    this._bindings = bindings;
    this._pressedKeys = '';
    this._waitForInputTime = waitForInputTime;

    //bind keyup event
    document.addEventListener('keyup', this._handleKey.bind(this), false);
  }
  
  _resetWaitInputTimer(callback, waitTime = this._waitForInputTime){
    //wait for user input for x amount of time
    //if there is no user input
    //reset the pressed keys register and trigger
    //the optional callback

    clearTimeout(this._waitInputTimer);
    this._waitInputTimer = setTimeout(() => {
      this._pressedKeys = '';
      if (typeof callback === 'function') {
        callback();
      }
    }, waitTime);
  }

  _checkBindingsForPressedKeys(){
    const bindings = this._bindings;
    const pressedKeys = this._pressedKeys;

    let match = null;
    let shouldWait = false;

    //loop all key bindings and
    //check if the register matches one of the codes
    for (const { keyCodes, callback } of bindings) {
      const codeStr = keyCodes.join('');
      if (pressedKeys === codeStr) {
        //pressed keys match config code
        //wait for next input
        //if there is no next input, trigger callback
        match = { keyCodes, callback };
      } else if (codeStr.indexOf(pressedKeys) === 0) {
        //if there is a shortcut
        //registered with more chars that starts with this
        //(e.g. user pressed gs but there is also gsp)
        //then give user time to press the next key
        shouldWait = true;
      }
    }

    return {
      match,
      shouldWait
    };
  }
  
  _handleKey({ keyCode }){
    //register pressed key
    this._pressedKeys += keyCode;
    
    //check pressed keys against config
    const { match, shouldWait } = this._checkBindingsForPressedKeys();

    if (match) {
      //keys match found
      if (shouldWait) {
        this._resetWaitInputTimer(match.callback);
      } else {
        this._resetWaitInputTimer(match.callback, 0);
      }
    } else {
      //if no match was found yet
      //reset timer so the pressed keys are
      //reset if there is no more user input
      this._resetWaitInputTimer();
    }
  }
}

window.Hotshot = Hotshot;
