(function () {
	"use strict";
	describe("arrgh.js tests", function () {
		it("should load using require.js", function (done) {
			require(['../src/arrgh.js'], function (arrgh) {
				expect(arrgh.Enumerable).not.toBeNull();
				done();
			});
		});
	});
}());