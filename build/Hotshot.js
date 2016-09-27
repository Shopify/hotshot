'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hotshot = function () {
  function Hotshot(_ref) {
    var waitForInputTime = _ref.waitForInputTime;
    var bindings = _ref.bindings;

    _classCallCheck(this, Hotshot);

    this._bindings = bindings;
    this._pressedKeys = '';
    this._waitForInputTime = waitForInputTime;

    //bind keyup event
    document.addEventListener('keyup', this._handleKey.bind(this), false);
  }

  _createClass(Hotshot, [{
    key: '_resetWaitInputTimer',
    value: function _resetWaitInputTimer(callback) {
      var _this = this;

      var waitTime = arguments.length <= 1 || arguments[1] === undefined ? this._waitForInputTime : arguments[1];

      //wait for user input for x amount of time
      //if there is no user input
      //reset the pressed keys register and trigger
      //the optional callback

      clearTimeout(this._waitInputTimer);
      this._waitInputTimer = setTimeout(function () {
        _this._pressedKeys = '';
        if (typeof callback === 'function') {
          callback();
        }
      }, waitTime);
    }
  }, {
    key: '_checkBindingsForPressedKeys',
    value: function _checkBindingsForPressedKeys() {
      var bindings = this._bindings;
      var pressedKeys = this._pressedKeys;

      var match = null;
      var shouldWait = false;

      //loop all key bindings and
      //check if the register matches one of the codes
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = bindings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _step.value;
          var keyCodes = _step$value.keyCodes;
          var callback = _step$value.callback;

          var codeStr = keyCodes.join('');
          if (pressedKeys === codeStr) {
            //pressed keys match config code
            //wait for next input
            //if there is no next input, trigger callback
            match = { keyCodes: keyCodes, callback: callback };
          } else if (codeStr.indexOf(pressedKeys) === 0) {
            //if there is a shortcut
            //registered with more chars that starts with this
            //(e.g. user pressed gs but there is also gsp)
            //then give user time to press the next key
            shouldWait = true;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return {
        match: match,
        shouldWait: shouldWait
      };
    }
  }, {
    key: '_handleKey',
    value: function _handleKey(_ref2) {
      var keyCode = _ref2.keyCode;

      //register pressed key
      this._pressedKeys += keyCode;

      //check pressed keys against config

      var _checkBindingsForPres = this._checkBindingsForPressedKeys();

      var match = _checkBindingsForPres.match;
      var shouldWait = _checkBindingsForPres.shouldWait;


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

window.Hotshot = Hotshot;
