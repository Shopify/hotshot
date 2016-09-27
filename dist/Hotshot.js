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

      //wait for user input for x amount of time
      //if there is no user input
      //reset the pressed keys register and trigger
      //the optional callback
      var waitTime = this._waitForInputTime;

      clearTimeout(this._waitInputTimer);
      this._waitInputTimer = setTimeout(function () {
        _this._pressedKeys = '';
        if (typeof callback === 'function') {
          callback();
        }
      }, waitTime);
    }
  }, {
    key: '_handleKey',
    value: function _handleKey(e) {
      var bindings = this._bindings;
      var keyCode = e.keyCode;

      //register pressed key
      this._pressedKeys += '' + keyCode;

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

      this._resetWaitInputTimer();
    }
  }]);

  return Hotshot;
}();

window.Hotshot = Hotshot;
