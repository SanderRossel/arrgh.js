var testEnumerableOrderings = function () {
	"use strict";

	describe("orderings", function () {
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
		});
	});
};