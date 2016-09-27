'use strict';

describe('test keyboard shortcuts', function () {
	testsConfig.forEach(function (details) {

		it(details.name, function (done) {
			this.timeout(10000);

			console.log('START', details.name);
			utils.triggerKeyUpSeries(details.keyCodes, 50, function () {
				setTimeout(function () {
					expect(utils.doneTests[details.name]).to.be.ok;
					done();
				}, WAIT_FOR_INPUT_TIME);
			});
		});
	});
});