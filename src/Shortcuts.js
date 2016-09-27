class Hotshot {
  constructor({ waitForInputTime, bindings }){
    this._bindings = bindings;
    this._pressedKeys = '';
    this._waitForInputTime = waitForInputTime;

    //bind keyup event
    document.addEventListener('keyup', this._handleKey.bind(this), false);
  }
  
  _resetWaitInputTimer(callback){
    //wait for user input for x amount of time
    //if there is no user input
    //reset the pressed keys register and trigger
    //the optional callback
    const waitTime = this._waitForInputTime;

    clearTimeout(this._waitInputTimer);
    this._waitInputTimer = setTimeout(() => {
      this._pressedKeys = '';
      if (typeof callback === 'function') {
        callback();
      }
    }, waitTime);
  }
  
  _handleKey(e){
    const bindings = this._bindings;
    const keyCode = e.keyCode;
    
    //register pressed key
    this._pressedKeys += `${keyCode}`;
      
    //loop all key bindings and
    //check if the register matches one of the codes
    for (const {keyCodes, callback} of bindings) {
      const codeStr = keyCodes.join('');
      if (this._pressedKeys === codeStr) {
        //pressed keys match config code
        //wait for next input
        //if there is no next input, trigger callback
        this._resetWaitInputTimer(callback);
        return;
      }
    }
    
    //reset timer so the pressed keys are
    //reset if there is no more user input
    this._resetWaitInputTimer();
  }
}

window.Hotshot = Hotshot;
