/* exported testEnumerableStatics */
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
			it("should throw when count is lower than 0", function () {
				expect(function () {
					arrgh.Enumerable.range(0, -1);
				}).toThrow();
			});

			it("should throw when start plus count - 1 (because start is the first) is higher than max", function () {
				expect(function () {
					arrgh.Enumerable.range(MAX_SAFE_INTEGER, 2);
				}).toThrow();
			});

			it("should return an empty range when count is 0", function () {
				expect(arrgh.Enumerable.range(42, 0).toArray()).toEqual([]);
			});

			it("should return start when count is 1", function () {
				expect(arrgh.Enumerable.range(42, 1).toArray()).toEqual([42]);
			});

			it("should return max when start is max and count is 1", function () {
				expect(arrgh.Enumerable.range(MAX_SAFE_INTEGER, 1).toArray()).toEqual([MAX_SAFE_INTEGER]);
			});

			it("should create 1 to 10", function () {
				expect(arrgh.Enumerable.range(1, 10).toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
			});

			it("should create -3 to 3", function () {
				expect(arrgh.Enumerable.range(-3, 7).toArray()).toEqual([-3, -2 ,-1, 0, 1, 2, 3]);
			});

			it("should create 42 to 50", function () {
				expect(arrgh.Enumerable.range(42, 9).toArray()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50]);
			});

			it("should create an empty range when start is higher than max and no count is specified", function () {
				expect(arrgh.Enumerable.range(MAX_SAFE_INTEGER + 1).toArray()).toEqual([]);
			});

			it("should create max - 2 to max", function () {
				expect(arrgh.Enumerable.range(MAX_SAFE_INTEGER - 2).toArray()).toEqual([MAX_SAFE_INTEGER - 2, MAX_SAFE_INTEGER -1, MAX_SAFE_INTEGER]);
			});

			it("should create -max to max (no way to actually test)", function () {
				var col = arrgh.Enumerable.range(-MAX_SAFE_INTEGER);
				expect(col.first()).toBe(-MAX_SAFE_INTEGER);
				//expect(col.last()).toBe(MAX_SAFE_INTEGER);
			});
		});

		describe("repeat", function () {
			it("should create an empty collection when count is 0", function () {
				expect(arrgh.Enumerable.repeat("Hello", 0).toArray()).toEqual([]);
			});

			it("should repeat 'Hello' 10 times", function () {
				expect(arrgh.Enumerable.repeat("Hello", 10).toArray()).toEqual(["Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello"]);
			});

			it("should return 'Hello' once when count is 1", function () {
				expect(arrgh.Enumerable.repeat("Hello", 1).toArray()).toEqual(["Hello"]);
			});

			it("should repeat a person five times", function () {
				expect(arrgh.Enumerable.repeat(p0, 5).toArray()).toEqual([p0, p0, p0, p0, p0]);
			});

			it("should throw when count is lower than 0", function () {
				expect(function () {
					arrgh.Enumerable.repeat("Hello", -1);
				}).toThrow();
			});
		});
	});
};