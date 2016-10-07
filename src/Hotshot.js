class Hotshot {
  constructor({ waitForInputTime, seqs, combos }){
    this._seqs = seqs || [];
    this._combos = combos || [];
    this._pressedSeqKeys = '';
    this._pressedComboKeys = [];
    this._pressedComboMetaKeys = [];
    this._waitForInputTime = waitForInputTime || 500;

    //bind key events
    document.addEventListener('keyup', (e) => {
      this._handleKeyUpSeq(e.keyCode);
      this._handleKeyUpCombo(e.keyCode);
    });

    document.addEventListener('keydown', (e) => this._handleKeyDownCombo(e.keyCode, e.metaKey));
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

    if (idx !== -1) {
      arr.splice(idx, 1);
    }
  }

  _handleKeyUpCombo(keyCode){
    this._rmItemFromArr(keyCode, this._pressedComboKeys);

    if (this._pressedComboMetaKeys.length > 0) {
      //if there are keys that were pressed while
      //the meta key was pressed flush them
      //because the keyup wasn't triggered for them
      //@see http://stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key

      this._pressedComboMetaKeys.forEach((metaKeyCode) => this._rmItemFromArr(metaKeyCode, this._pressedComboKeys));
      this._pressedComboMetaKeys = [];
    }
  }

  _handleKeyDownCombo(keyCode, metaKey){
    if (this._pressedComboKeys.indexOf(keyCode) === -1) {
      this._pressedComboKeys.push(keyCode);

      //if the meta key is pressed
      //register the keyCode also in seperate array
      if (metaKey) {
        this._pressedComboMetaKeys.push(keyCode);
      }
    }

    //check pressed keys against config
    const match = this._checkCombosForPressedKeys();

    if (match) {
      this._pressedComboKeys = [];
      this._pressedComboMetaKeys = [];
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

//expose as global var
window.Hotshot = Hotshot;

//expose as a common js module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Hotshot;
}

//expose as an AMD module
if (typeof define === 'function' && define.amd) {
    define(function() {
        return Hotshot;
    });
}
