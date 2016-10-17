var expect = chai.expect;

var hotshot;
var WAIT_INPUT_TIME = 500;
var constructorSpy = sinon.spy();

// document.addEventListener('keyup', function(e){
//     console.log('PRESS', e.keyCode);
// });

var utils = {
    simluateKey: function(charCode, keyCode, modifiers){
        KeyEvent.simulate(charCode, keyCode, modifiers, document.body);
    },
    testSeq: function(config, shouldWait, callback, options){
        options = options || {};
        spy = options.spy || sinon.spy();

        var zeroChars = 'up up down down left right left right enter';
        var expectCalls = options.expectCalls || 1;

        if (options.dontBind !== true) {
            hotshot.bindSeq(config.keyCodes, spy);
        }

        config.chars = config.chars.split(' ');

        config.chars.forEach(function(char, idx){
            var charNum;

            if (zeroChars.split(' ').indexOf(char) !== -1) {
                charNum = 0;
            } else {
                charNum = char.charCodeAt(0);
            }

            utils.simluateKey(charNum, config.keyCodes[idx], []);
        });

        //the lib should not wait as
        //there is no shortcut with more letters
        setTimeout(function(){
            expect(spy.callCount).to.equal(expectCalls, 'callback should fire '+expectCalls+' times');
            callback();
        }, (shouldWait ? WAIT_INPUT_TIME : 0));
    }
};

before(function() {
    hotshot = new Hotshot({
        waitForInputTime: WAIT_INPUT_TIME,
        seqs: [{
            keyCodes: [65, 66, 67],
            callback: constructorSpy
        }, {
            keyCodes: [49, 50, 51, 52],
            callback: constructorSpy
        }]
    });
});

describe('Hotshot Constructor', function(done) {

    it('3 letter sequence (a b c)', function(done) {
        utils.testSeq({
            chars: 'a b c',
            keyCodes: [65, 66, 67],
        }, false, done, {
            dontBind: true,
            spy: constructorSpy
        });
    });

    it('4 letter sequence (1 2 3 4)', function(done) {
        utils.testSeq({
            chars: '1 2 3 4',
            keyCodes: [49, 50, 51, 52],
        }, false, done, {
            dontBind: true,
            spy: constructorSpy,
            expectCalls: 2
        });
    });

});

describe('Hotshot.bindSeq', function() {

    it('2 letter sequence (a b)', function(done) {
        utils.testSeq({
            chars: 'a b',
            keyCodes: [65, 66],
        }, true, done);
    });

    it('3 letter sequence that starts with already registered two letter sequence (a b g)', function(done) {
        utils.testSeq({
            chars: 'a b g',
            keyCodes: [65, 66, 71],
        }, false, done);
    });

    it('long sequence (konami code)', function(done) {
        utils.testSeq({
            chars: 'up up down down left right left right b a',
            keyCodes: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        }, false, done);
    });

});

describe('Hotshot.bindCombo', function() {

    it('binding key combinations (command+b)', function() {
        var spy = sinon.spy();
        hotshot.bindCombo([91, 66], spy);

        utils.simluateKey('b'.charCodeAt(0), 66, ['meta']);

        expect(spy.callCount).to.equal(1, 'command+b callback should fire');
    });

    it('binding key combos with multiple modifiers (command+shift+b)', function() {
        var spy = sinon.spy();
        hotshot.bindCombo([91, 16, 66], spy);

        utils.simluateKey('b'.charCodeAt(0), 66, ['meta']);
        expect(spy.callCount).to.equal(0, 'command+shift+b callback should not fire');

        utils.simluateKey('b'.charCodeAt(0), 66, ['meta', 'shift']);
        expect(spy.callCount).to.equal(1, 'command+shift+b callback should fire');
    });

});
