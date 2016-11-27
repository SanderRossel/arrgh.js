/* exported testEnumerableUnions */
var testEnumerableUnions = function () {
	"use strict";

	describe("unions", function () {
		describe("unionAll", function () {
			it("should union two distinct collections", function () {
				var u = new arrgh.Enumerable(["a", "b", "c"]).unionAll(new arrgh.Enumerable(["d", "e", "f"]));
				expect(u.toArray()).toEqual(["a", "b", "c", "d", "e", "f"]);
			});

			it("should union two collections with overlapping elements", function () {
				var u = new arrgh.Enumerable(["a", "b", "c"]).unionAll(new arrgh.Enumerable(["c", "d", "e", "f", "a"]));
				expect(u.toArray()).toEqual(["a", "b", "c", "c", "d", "e", "f", "a"]);
			});

			it("should return the second collection when the first is empty", function () {
				var u = arrgh.Enumerable.empty().unionAll(new arrgh.Enumerable(["a", "b", "c", "c"]));
				expect(u.toArray()).toEqual(["a", "b", "c", "c"]);
			});

			it("should return the first collection when the second is empty", function () {
				var u = new arrgh.Enumerable(["a", "b", "c", "c"]).unionAll(new arrgh.Enumerable.empty());
				expect(u.toArray()).toEqual(["a", "b", "c", "c"]);
			});
		});

		describe("union", function () {
			it("should union two distinct collections", function () {
				var u = new arrgh.Enumerable(["a", "b", "c"]).union(new arrgh.Enumerable(["d", "e", "f"]));
				expect(u.toArray()).toEqual(["a", "b", "c", "d", "e", "f"]);
			});

			it("should create a set of two collections with overlapping elements", function () {
				var u = new arrgh.Enumerable(["a", "b", "c"]).union(new arrgh.Enumerable(["c", "d", "e", "f", "a"]));
				expect(u.toArray()).toEqual(["a", "b", "c", "d", "e", "f"]);
			});


			it("should return the second collection as a set when the first is empty", function () {
				var u = arrgh.Enumerable.empty().union(new arrgh.Enumerable(["a", "b", "c", "c"]));
				expect(u.toArray()).toEqual(["a", "b", "c"]);
			});

			it("should return the first collection as a set when the second is empty", function () {
				var u = new arrgh.Enumerable(["a", "b", "c", "c"]).union(new arrgh.Enumerable.empty());
				expect(u.toArray()).toEqual(["a", "b", "c"]);
			});

			it("should union two distinct collections with objects", function () {
				var u = new arrgh.Enumerable([p0, p1, p2]).union(new arrgh.Enumerable([p3, p4, p5]));
				expect(u.toArray()).toEqual([p0, p1, p2, p3, p4, p5]);
			});

			it("should create a set of two collections with overlapping object elements", function () {
				var u = new arrgh.Enumerable([p0, p1, p2]).union(new arrgh.Enumerable([p2, p3, p4, p0]));
				expect(u.toArray()).toEqual([p0, p1, p2, p3, p4]);
			});

			it("should create a set of two collections with distinct objects that are equal according to an equality comparer", function () {
				var u = new arrgh.Enumerable([p0, p1, p2]).union(new arrgh.Enumerable([p2, p3, p4, p0, p6]), firstNameEqComparer);
				expect(u.toArray()).toEqual([p0, p1, p3, p4]);
			});

			it("should union only strings with a unique second character", function () {
				var u = new arrgh.Enumerable([p0.first, p1.first, p2.first, p3.first])
				.union(new arrgh.Enumerable([p4.first, p5.first, p6.first]), {
					getHash: function (obj) {
						return obj[1];
					},
					equals: function (x, y) {
						return x[1] === y[1];
					}
				});
				expect(u.toArray()).toEqual([p0.first, p1.first, p4.first]);
			});
		});
	});
};