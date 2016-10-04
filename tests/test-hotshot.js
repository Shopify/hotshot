var expect = chai.expect;

var hotshot;
var WAIT_INPUT_TIME = 500;

document.addEventListener('keyup', function(e){
    console.log('PRESS', e.keyCode);
});

var utils = {
    testSeq: function(config, shouldWait, callback){
        config.chars = config.chars.split('');

        var spy = sinon.spy();

        hotshot.bindSeq(config.keyCodes, spy);

        config.chars.forEach(function(char, idx){
            KeyEvent.simulate(char.charCodeAt(0), config.keyCodes[idx]);
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
            chars: 'ab',
            keyCodes: [65, 66],
        }, true, done);
    });

    it('abg callback fires when pressing abg', function(done) {
        utils.testSeq({
            chars: 'abg',
            keyCodes: [65, 66, 71],
        }, false, done);
    });

    it('abg callback fires when pressing abg', function(done) {
        //https://github.com/ccampbell/mousetrap/blob/master/tests/test.mousetrap.js#L513
        utils.testSeq({
            chars: 'up up down down left right left right b a enter',
            keyCodes: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        }, false, done);
    });

});