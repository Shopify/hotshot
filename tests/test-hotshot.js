var expect = chai.expect;

var hotshot;
var WAIT_INPUT_TIME = 500;

// document.addEventListener('keyup', function(e){
//     console.log('PRESS', e.keyCode);
// });

var utils = {
    testBindSeq: function(config, shouldWait, callback){
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

    it('2 letter sequence (a b)', function(done) {
        utils.testBindSeq({
            chars: 'a b',
            keyCodes: [65, 66],
        }, true, done);
    });

    it('3 letter sequence that starts with already registered two letter sequence (a b g)', function(done) {
        utils.testBindSeq({
            chars: 'a b g',
            keyCodes: [65, 66, 71],
        }, false, done);
    });

    it('long sequence (konami code)', function(done) {
        utils.testBindSeq({
            chars: 'up up down down left right left right b a',
            keyCodes: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        }, false, done);
    });

});

describe('Hotshot.bindCombo', function() {

    it('binding key combinations (command+b)', function() {
        var spy = sinon.spy();
        hotshot.bindCombo([91, 66], spy);

        KeyEvent.simulate('b'.charCodeAt(0), 66, ['meta']);

        expect(spy.callCount).to.equal(1, 'command+b callback should fire');
    });

    it('binding key combos with multiple modifiers (command+shift+b)', function() {
        var spy = sinon.spy();
        hotshot.bindCombo([91, 16, 66], spy);

        KeyEvent.simulate('b'.charCodeAt(0), 66, ['meta']);
        expect(spy.callCount).to.equal(0, 'command+shift+b callback should not fire');

        KeyEvent.simulate('b'.charCodeAt(0), 66, ['meta', 'shift']);
        expect(spy.callCount).to.equal(1, 'command+shift+b callback should fire');
    });

});
