(function () {
	"use strict";

	describe("unions", function () {
		describe("unionAll", function () {
			describe("unique lists", function () {
				it("should union both lists", function () {
					var u = new arrgh.Enumerable(["a", "b", "c"])
					.unionAll(new arrgh.Enumerable(["d", "e", "f"]));
					expect(u.toArray()).toEqual(["a", "b", "c", "d", "e", "f"]);
				});
			});

			describe("overlapping lists", function () {
				it("should union both lists", function () {
					var u = new arrgh.Enumerable(["a", "b", "c"])
					.unionAll(new arrgh.Enumerable(["c", "d", "e", "f", "a"]));
					expect(u.toArray()).toEqual(["a", "b", "c", "c", "d", "e", "f", "a"]);
				});
			});

			describe("first empty", function () {
				it("should union both lists", function () {
					var u = new arrgh.Enumerable([])
					.unionAll(new arrgh.Enumerable(["a", "b", "c"]));
					expect(u.toArray()).toEqual(["a", "b", "c"]);
				});
			});

			describe("second empty", function () {
				it("should union both lists", function () {
					var u = new arrgh.Enumerable(["a", "b", "c"])
					.unionAll(new arrgh.Enumerable([]));
					expect(u.toArray()).toEqual(["a", "b", "c"]);
				});
			});
		});

		describe("union", function () {
			describe("unique lists", function () {
				it("should union both lists", function () {
					var u = new arrgh.Enumerable(["a", "b", "c"])
					.union(new arrgh.Enumerable(["d", "e", "f"]));
					expect(u.toArray()).toEqual(["a", "b", "c", "d", "e", "f"]);
				});
			});

			describe("overlapping lists", function () {
				it("should union only unique elements", function () {
					var u = new arrgh.Enumerable(["a", "b", "c"])
					.union(new arrgh.Enumerable(["c", "d", "e", "f", "a"]));
					expect(u.toArray()).toEqual(["a", "b", "c", "d", "e", "f"]);
				});
			});

			describe("first empty", function () {
				it("should union both lists", function () {
					var u = new arrgh.Enumerable([])
					.union(new arrgh.Enumerable(["a", "b", "c"]));
					expect(u.toArray()).toEqual(["a", "b", "c"]);
				});
			});

			describe("second empty", function () {
				it("should union both lists", function () {
					var u = new arrgh.Enumerable(["a", "b", "c"])
					.union(new arrgh.Enumerable([]));
					expect(u.toArray()).toEqual(["a", "b", "c"]);
				});
			});

			describe("unique lists with objects", function () {
				it("should union only unique elements", function () {
					var u = new arrgh.Enumerable([p0, p1, p2])
					.union(new arrgh.Enumerable([p3, p4, p5]));
					expect(u.toArray()).toEqual([p0, p1, p2, p3, p4, p5]);
				});
			});

			describe("overlapping lists with objects", function () {
				it("should union only unique elements", function () {
					var u = new arrgh.Enumerable([p0, p1, p2])
					.union(new arrgh.Enumerable([p2, p3, p4, p0]));
					expect(u.toArray()).toEqual([p0, p1, p2, p3, p4]);
				});
			});

			describe("overlapping lists with objects and first name comparer", function () {
				it("should union only unique first names", function () {
					var u = new arrgh.Enumerable([p0, p1, p2])
					.union(new arrgh.Enumerable([p2, p3, p4, p0, p6]), function (x, y) {
						return x.first === y.first;
					});
					expect(u.toArray()).toEqual([p0, p1, p3, p4]);
				});
			});

			describe("overlapping lists with strings that compare on second character", function () {
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
	});
}());