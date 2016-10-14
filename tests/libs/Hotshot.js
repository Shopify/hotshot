'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function rmItemFromArr(item, arr) {
  var idx = arr.indexOf(item);

  if (idx !== -1) {
    arr.splice(idx, 1);
  }
}

var Hotshot = function () {
  function Hotshot(_ref) {
    var _this = this;

    var waitForInputTime = _ref.waitForInputTime;
    var seqs = _ref.seqs;
    var combos = _ref.combos;

    _classCallCheck(this, Hotshot);

    this._seqs = seqs || [];
    this._combos = combos || [];
    this._pressedSeqKeys = '';
    this._pressedComboKeys = [];
    this._pressedComboMetaKeys = [];
    this._waitForInputTime = waitForInputTime || 500;

    //bind key events
    document.addEventListener('keyup', function (e) {
      if (!_this._checkElIsInput(e.target)) {
        _this._handleKeyUpSeq(e.keyCode);
        _this._handleKeyUpCombo(e.keyCode);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!_this._checkElIsInput(e.target)) {
        _this._handleKeyDownCombo(e.keyCode, e.metaKey);
      }
    });
  }

  _createClass(Hotshot, [{
    key: 'bindSeq',
    value: function bindSeq(keyCodes, callback) {
      this._seqs.push({
        keyCodes: keyCodes,
        callback: callback
      });
    }
  }, {
    key: 'bindCombo',
    value: function bindCombo(keyCodes, callback) {
      this._combos.push({
        keyCodes: keyCodes,
        callback: callback
      });
    }
  }, {
    key: '_checkElIsInput',
    value: function _checkElIsInput(el) {
      return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.hasAttribute && el.hasAttribute('contenteditable');
    }
  }, {
    key: '_handleKeyUpCombo',
    value: function _handleKeyUpCombo(keyCode) {
      var _this2 = this;

      rmItemFromArr(keyCode, this._pressedComboKeys);

      if (this._pressedComboMetaKeys.length > 0) {
        //if there are keys that were pressed while
        //the meta key was pressed flush them
        //because the keyup wasn't triggered for them
        //@see http://stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key

        this._pressedComboMetaKeys.forEach(function (metaKeyCode) {
          return rmItemFromArr(metaKeyCode, _this2._pressedComboKeys);
        });
        this._pressedComboMetaKeys = [];
      }
    }
  }, {
    key: '_handleKeyDownCombo',
    value: function _handleKeyDownCombo(keyCode, metaKey) {
      if (this._pressedComboKeys.indexOf(keyCode) === -1) {
        this._pressedComboKeys.push(keyCode);

        //if the meta key is pressed
        //register the keyCode also in seperate array
        if (metaKey) {
          this._pressedComboMetaKeys.push(keyCode);
        }
      }

      //check pressed keys against config
      var match = this._checkCombosForPressedKeys();

      if (match) {
        this._pressedComboKeys = [];
        this._pressedComboMetaKeys = [];
        match.callback();
      }
    }
  }, {
    key: '_checkCombosForPressedKeys',
    value: function _checkCombosForPressedKeys() {
      var combos = this._combos;
      var pressedComboKeys = this._pressedComboKeys;
      var match = null;

      combos.forEach(function (details) {
        var keyCodesStr = details.keyCodes.join('');
        var pressedComboKeysStr = details.pressedComboKeys.join('');

        if (keyCodesStr === pressedComboKeysStr) {
          //match found
          match = details;
        }
      });

      return match;
    }
  }, {
    key: '_resetWaitInputTimer',
    value: function _resetWaitInputTimer(callback) {
      var _this3 = this;

      var waitTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._waitForInputTime;

      //wait for user input for x amount of time
      //if there is no user input
      //reset the pressed keys register and trigger
      //the optional callback

      clearTimeout(this._waitInputTimer);
      this._waitInputTimer = setTimeout(function () {
        _this3._pressedSeqKeys = '';
        if (typeof callback === 'function') {
          callback();
        }
      }, waitTime);
    }
  }, {
    key: '_checkSeqsForPressedKeys',
    value: function _checkSeqsForPressedKeys() {
      var seqs = this._seqs;
      var pressedSeqKeys = this._pressedSeqKeys;

      var match = null;
      var shouldWait = false;

      //loop all key seqs and
      //check if the register matches one of the codes
      seqs.forEach(function (_ref2) {
        var keyCodes = _ref2.keyCodes;
        var callback = _ref2.callback;

        var codeStr = keyCodes.join('');

        if (pressedSeqKeys === codeStr) {
          //pressed keys match config code
          //wait for next input
          //if there is no next input, trigger callback
          match = { keyCodes: keyCodes, callback: callback };
        } else if (codeStr.indexOf(pressedSeqKeys) === 0) {
          //if there is a shortcut
          //registered with more chars that starts with this
          //(e.g. user pressed gs but there is also gsp)
          //then give user time to press the next key
          shouldWait = true;
        }
      });

      return {
        match: match,
        shouldWait: shouldWait
      };
    }
  }, {
    key: '_handleKeyUpSeq',
    value: function _handleKeyUpSeq(keyCode) {
      //register pressed key
      this._pressedSeqKeys += keyCode;

      //check pressed keys against config

      var _checkSeqsForPressedK = this._checkSeqsForPressedKeys();

      var match = _checkSeqsForPressedK.match;
      var shouldWait = _checkSeqsForPressedK.shouldWait;


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
  }]);

  return Hotshot;
}();

//expose as global var


window.Hotshot = Hotshot;

//expose as a common js module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Hotshot;
}

//expose as an AMD module
if (typeof define === 'function' && define.amd) {
  define(function () {
    return Hotshot;
  });
}
