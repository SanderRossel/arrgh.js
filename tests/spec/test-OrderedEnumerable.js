(function () {
	"use strict";

	describe("OrderedEnumerable", function () {
		describe("orderBy", function () {
			describe("order by first", function () {
				it("should be ordered by first", function () {
					var ordered = new arrgh.Enumerable(people)
					.orderBy(function (p) {
						return p.first;
					});
					var s1 = p0.toString();
					var s2 = Object.prototype.toString.call(p0);
					expect(ordered.toArray()).toEqual([p3, p5, p2, p1, p0, p4]);
				});
			});

			describe("order by first then by last", function () {
				it("should be ordered by first then last", function () {
					var ordered = new arrgh.Enumerable(people)
					.orderBy(function (p) {
						return p.first;
					}).thenBy(function (p) {
						return p.last;
					});
					expect(ordered.toArray()).toEqual([p3, p5, p2, p1, p0, p4]);
				});
			});

			describe("order by last then by first", function () {
				it("should be ordered by last then first", function () {
					var ordered = new arrgh.Enumerable(people)
					.orderBy(function (p) {
						return p.last;
					}).thenBy(function (p) {
						return p.first;
					});
					expect(ordered.toArray()).toEqual([p3, p5, p2, p4, p1, p0]);
				});
			});

			describe("order by first descending", function () {
				it("should be ordered by first in descending order", function () {
					var ordered = new arrgh.Enumerable(people)
					.orderByDescending(function (p) {
						return p.first;
					});
					expect(ordered.toArray()).toEqual([p4, p0, p5, p2, p1, p3]);
				});
			});

			describe("order by first descending then by last descending", function () {
				it("should be ordered by name in descending order", function () {
					var ordered = new arrgh.Enumerable(people)
					.orderByDescending(function (p) {
						return p.first;
					}).thenByDescending(function (p) {
						return p.last;
					});
					expect(ordered.toArray()).toEqual([p4, p0, p1, p2, p5, p3]);
				});
			});

			describe("order by first descending then by last then by age descending", function () {
				it("should be ordered by first in descending order then by last and then by age descending", function () {
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
			});
		});
	});
}());