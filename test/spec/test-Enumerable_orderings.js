var testEnumerableOrderings = function () {
	"use strict";

	describe("orderings", function () {
		var firstNameComparer = function (x, y) {
			if (x.first < y.first) {
				return -1;
			} else if (x.first > y.first) {
				return 1;
			} else {
				return 0;
			}
		};
		describe("orderBy", function () {
			it("should order by first", function () {
				var ordered = new arrgh.Enumerable(people)
				.orderBy(function (p) {
					return p.first;
				});
				expect(ordered.toArray()).toEqual([p3, p5, p2, p1, p0, p4]);
			});

			it("should order by first in descending order", function () {
				var ordered = new arrgh.Enumerable(people)
				.orderByDescending(function (p) {
					return p.first;
				});
				expect(ordered.toArray()).toEqual([p4, p0, p5, p2, p1, p3]);
			});

			it("should order by first using a comparer", function () {
				var ordered = new arrgh.Enumerable(people)
				.orderBy(function (p) {
					return p;
				}, firstNameComparer);
				expect(ordered.toArray()).toEqual([p3, p5, p2, p1, p0, p4]);
			});

			it("should order by first in descending order using a comparer", function () {
				var ordered = new arrgh.Enumerable(people)
				.orderByDescending(function (p) {
					return p;
				}, firstNameComparer);
				expect(ordered.toArray()).toEqual([p4, p0, p5, p2, p1, p3]);
			});
		});

		describe("thenBy", function () {
			it("should order by first then last", function () {
				var ordered = new arrgh.Enumerable(people)
				.orderBy(function (p) {
					return p.first;
				}).thenBy(function (p) {
					return p.last;
				});
				expect(ordered.toArray()).toEqual([p3, p5, p2, p1, p0, p4]);
			});

			it("should order by last then first", function () {
				var ordered = new arrgh.Enumerable(people)
				.orderBy(function (p) {
					return p.last;
				}).thenBy(function (p) {
					return p.first;
				});
				expect(ordered.toArray()).toEqual([p3, p5, p2, p4, p1, p0]);
			});

			it("should order by name in descending order", function () {
				var ordered = new arrgh.Enumerable(people)
				.orderByDescending(function (p) {
					return p.first;
				}).thenByDescending(function (p) {
					return p.last;
				});
				expect(ordered.toArray()).toEqual([p4, p0, p1, p2, p5, p3]);
			});

			it("should order by first in descending order then by last and then by age descending", function () {
				var list = new arrgh.List(people);
				list.add(p7);
				var ordered = list.orderByDescending(function (p) {
					return p.first;
				}).thenBy(function (p) {
					return p.last;
				}).thenByDescending(function (p) {
					return p.age;
				});
				expect(ordered.toArray()).toEqual([p7, p4, p0, p5, p2, p1, p3]);
			});

			it("should order by last then first using a comparer", function () {
				var ordered = new arrgh.Enumerable(people)
				.orderBy(function (p) {
					return p.last;
				}).thenBy(function (p) {
					return p;
				}, firstNameComparer);
				expect(ordered.toArray()).toEqual([p3, p5, p2, p4, p1, p0]);
			});

			it("should order by first in descending order then by last and then by age descending using only comparers", function () {
				var list = new arrgh.List(people);
				list.add(p7);
				var ordered = list.orderByDescending(function (p) {
					return p;
				}, firstNameComparer).thenBy(function (p) {
					return p.last;
				}, function (x, y) {
					if (x.last < y.last) {
						return -1;
					} else if (x.last > y.last) {
						return 1;
					} else {
						return 0;
					}
				}).thenByDescending(function (p) {
					return p;
				}, function (x, y) {
					if (x.age < y.age) {
						return -1;
					} else if (x.age > y.age) {
						return 1;
					} else {
						return 0;
					}
				});
				expect(ordered.toArray()).toEqual([p7, p4, p0, p5, p2, p1, p3]);
			});
		});
	});
};