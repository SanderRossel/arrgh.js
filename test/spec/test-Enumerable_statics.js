var testEnumerableStatics = function () {
	"use strict";

	describe("Enumerable statics", function () {
		describe("empty", function () {
			it("should be a singleton", function () {
				expect(arrgh.Enumerable.empty()).toBe(arrgh.Enumerable.empty());
			});

			it("should be empty", function () {
				expect(arrgh.Enumerable.empty().toArray()).toEqual([]);
			});
		});

		describe("range", function () {
			it("should create 1 to 10", function () {
				expect(arrgh.Enumerable.range(1, 10).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
			});

			it("should create 42 to 50", function () {
				expect(arrgh.Enumerable.range(42, 9).toArray()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50]);
			});

			it("should create 1 to infinity", function () {
				expect(arrgh.Enumerable.range(Number.MAX_SAFE_INTEGER - 2).toArray()).toEqual([Number.MAX_SAFE_INTEGER - 2, Number.MAX_SAFE_INTEGER -1, Number.MAX_SAFE_INTEGER]);
			});
		});
	});
};