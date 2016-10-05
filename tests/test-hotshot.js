var expect = chai.expect;

var hotshot;
var WAIT_INPUT_TIME = 500;

document.addEventListener('keyup', function(e){
    console.log('PRESS', e.keyCode);
});

var utils = {
    testSeq: function(config, shouldWait, callback){
        config.chars = config.chars.split(' ');

        var spy = sinon.spy();
        var zeroChars = 'up up down down left right left right enter';

        hotshot.bindSeq(config.keyCodes, spy);

        config.chars.forEach(function(char, idx){
            var charNum;

            if (zeroChars.split(' ').indexOf(char) !== -1) {
                charNum = 0;
            } else {
                charNum = char.charCodeAt(0);
            }

            KeyEvent.simulate(charNum, config.keyCodes[idx]);
        });

        //the lib should not wait as
        //there is no shortcut with more letters
        setTimeout(function(){
            expect(spy.callCount).to.equal(1, 'callback should fire once');
            callback();
        }, (shouldWait ? WAIT_INPUT_TIME : 0));
    }
};

before(function() {
    hotshot = new Hotshot({
        waitForInputTime: WAIT_INPUT_TIME
    });
});

describe('Hotshot.bindSeq', function() {

    it('ab callback fires when pressing ab', function(done) {
        utils.testSeq({
            chars: 'a b',
            keyCodes: [65, 66],
        }, true, done);
    });

    it('abg callback fires when pressing abg', function(done) {
        utils.testSeq({
            chars: 'a b g',
            keyCodes: [65, 66, 71],
        }, false, done);
    });

    it('konami callback fires when pressing up up down down left right left right b a enter', function(done) {
        utils.testSeq({
            chars: 'up up down down left right left right b a',
            keyCodes: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        }, false, done);
    });

});