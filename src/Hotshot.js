class Hotshot {
  constructor({ waitForInputTime, seqs, combos }){
    this._seqs = seqs || [];
    this._combos = combos || [];
    this._pressedSeqKeys = '';
    this._pressedComboKeys = [];
    this._waitForInputTime = waitForInputTime || 500;

    //bind key events
    document.addEventListener('keyup', ({ keyCode }) => {
      this._handleKeyUpSeq(keyCode);
      this._handleKeyUpCombo(keyCode);
    }, false);

    document.addEventListener('keydown', ({ keyCode }) => {
      this._handleKeyDownCombo(keyCode);
    }, false);
  }

  bindSeq(keyCodes, callback){
    this._seqs.push({
      keyCodes,
      callback
    });
  }

  bindCombo(keyCodes, callback){
    this._combos.push({
      keyCodes,
      callback
    });
  }

  _rmItemFromArr(item, arr){
    const idx = arr.indexOf(item);

    console.log(item, arr);

    if (idx !== -1) {
      arr.splice(idx, 1);
    }

    console.log(item, arr);
  }

  _handleKeyUpCombo(keyCode){
    this._rmItemFromArr(keyCode, this._pressedComboKeys);

    console.log(this._pressedComboKeys);
  }

  _handleKeyDownCombo(keyCode){
    if (!this._pressedComboKeys.includes(keyCode)) {
      this._pressedComboKeys.push(keyCode);
    }

    //check pressed keys against config
    const match = this._checkCombosForPressedKeys();

    if (match) {
      match.callback();
    }
  }

  _checkCombosForPressedKeys(){
    const combos = this._combos;
    const pressedComboKeys = this._pressedComboKeys;
    let match = null;

    combos.forEach(({ keyCodes, callback }) => {
      const keyCodesStr = keyCodes.join('');
      const pressedComboKeysStr = pressedComboKeys.join('');

      if (keyCodesStr === pressedComboKeysStr) {
        //match found
        match = { keyCodes, callback };
      }
    });

    return match;
  }
  
  _resetWaitInputTimer(callback, waitTime = this._waitForInputTime){
    //wait for user input for x amount of time
    //if there is no user input
    //reset the pressed keys register and trigger
    //the optional callback

    clearTimeout(this._waitInputTimer);
    this._waitInputTimer = setTimeout(() => {
      this._pressedSeqKeys = '';
      if (typeof callback === 'function') {
        callback();
      }
    }, waitTime);
  }

  _checkSeqsForPressedKeys(){
    const seqs = this._seqs;
    const pressedSeqKeys = this._pressedSeqKeys;

    let match = null;
    let shouldWait = false;

    //loop all key seqs and
    //check if the register matches one of the codes
    seqs.forEach(({ keyCodes, callback }) => {
      const codeStr = keyCodes.join('');

      if (pressedSeqKeys === codeStr) {
        //pressed keys match config code
        //wait for next input
        //if there is no next input, trigger callback
        match = { keyCodes, callback };
      } else if (codeStr.indexOf(pressedSeqKeys) === 0) {
        //if there is a shortcut
        //registered with more chars that starts with this
        //(e.g. user pressed gs but there is also gsp)
        //then give user time to press the next key
        shouldWait = true;
      }
    });

    return {
      match,
      shouldWait
    };
  }
  
  _handleKeyUpSeq(keyCode){
    //register pressed key
    this._pressedSeqKeys += keyCode;
    
    //check pressed keys against config
    const { match, shouldWait } = this._checkSeqsForPressedKeys();

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
