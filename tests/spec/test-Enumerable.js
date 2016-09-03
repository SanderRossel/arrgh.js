(function () {
	"use strict";

	describe("Enumerable", function () {
		describe("all", function () {
			describe("empty enumerable", function () {
				it("always returns true", function () {
					var e = arrgh.Enumerable.empty();
					expect(e.all(function (elem) {
						return false;
					})).toBe(true);
				});
				it("even without a predicate", function () {
					var e = arrgh.Enumerable.empty();
					expect(e.all()).toBe(true);
				});
			});

			it("when all elements match the predicate it should return true", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.all(function (elem) {
					return elem.first !== null;
				})).toBe(true);
			});

			it("when some (or all) elements don't match the predicate it should return false", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.all(function (elem) {
					return elem.last !== null;
				})).toBe(false);
			});

			it("when no predicate is defined it should throw", function () {
				var e = new arrgh.Enumerable(people);
				expect(function () {
					e.all();
				}).toThrow();
			});
		});

		describe("any", function () {
			describe("empty enumerable", function () {
				it("always returns false", function () {
					var e = arrgh.Enumerable.empty();
					expect(e.any()).toBe(false);
				});
				it("even when a predicate is defined", function () {
					var e = arrgh.Enumerable.empty();
					expect(e.any(function (elem) {
						return true;
					})).toBe(false);
				});
			});

			it("when no predicate is defined it should return true", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.any()).toBe(true);
			});

			it("when an element matches the predicate it should return true", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.any(function (elem) {
					return elem.first === "Bailey";
				})).toBe(true);
			});

			it("when no element matches the predicate it should return false", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.any(function (elem) {
					return elem.first === "nope";
				})).toBe(false);
			});
		});

		describe("average", function () {
			it("when the collection is empty it should throw an error", function () {
				var e = arrgh.Enumerable.empty();
				expect(function () {
					e.average();
				}).toThrow();
			});

			describe ("when the collection contains only integers", function () {
				it("and the result is an integer it should return the average", function () {
					var e = new arrgh.Enumerable([1, 2, 3, 4, 5]);
					expect(e.average()).toBe(3);
				});

				it("and the result is a decimal it should return the average", function () {
					var e = new arrgh.Enumerable([1, 2, 3, 4, 5, 6]);
					expect(e.average()).toBe(3.5);
				});

				it("and the result is a fracture it should return the average", function () {
					var e = new arrgh.Enumerable([3, 3, 4]);
					expect(e.average()).toBeCloseTo(3.33);
				});
			});

			describe ("when the collection contains decimal numbers", function () {
				it("it should calculate the average (with floating-point rounding error)", function () {
					var e = new arrgh.Enumerable([1.2, 2.3, 3.4]);
					expect(e.average()).toBeCloseTo(2.3); // Floating point precision... Ugh!
				});
			});

			describe("when the collection contains non-numerics", function () {
				it("it can return NaN", function () {
					var e = new arrgh.Enumerable(people);
					expect(e.average()).toBeNaN();
				});

				it("even when some elements are numeric", function () {
					var e = new arrgh.Enumerable([1, 2, p0, 0.2]);
					expect(e.average()).toBeNaN();
				});

				it("or the result is unexpected", function () {
					var e = new arrgh.Enumerable([2, "2"]);
					expect(e.average()).toBe(11);
				});

				it("even adding arrays may yield a numeric average (that makes no sense)", function () {
					var e = new arrgh.Enumerable([2, [2]]);
					expect(e.average()).toBe(11);
				});
			});
		});

		describe("contains", function () {
			describe("empty enumerable", function () {
				it("should not contain undefined", function () {
					var e = arrgh.Enumerable.empty();
					expect(e.contains(undefined)).toBe(false);
				});

				it("and also not 'hello'", function () {
					var e = arrgh.Enumerable.empty();
					expect(e.contains("hello")).toBe(false);
				});
			});


			it("when the collection contains the value it should return true", function () {
				var e = new arrgh.Enumerable([1, 2, 3, 4]);
				expect(e.contains(3)).toBe(true);
			});

			it("the same goes for objects", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.contains(p3)).toBe(true);
			});

			it("when the collection does not contain the value it should return false", function () {
				var e = new arrgh.Enumerable([1, 2, 3, 4]);
				expect(e.contains(5)).toBe(false);
			});


			it("and, again, the same goes for objects", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.contains(p7)).toBe(false);
			});

			it("if the elements don't match reference (or type), but the comparer matches them it should return true", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.contains({
					first: "Bill"
				}, function (x, y) {
					return x.first === y.first;
				})).toBe(true);
			});

			it("if the elements don't match reference (or type), and the comparer also doesn't match any it should return false", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.contains({
					first: "Bill"
				}, function (x, y) {
					return x.last === y.last;
				})).toBe(false);
			});
		});

		describe("count", function () {
			describe("empty enumerable", function () {
				it("always returns 0", function () {
					var e = arrgh.Enumerable.empty();
					expect(e.count()).toBe(0);
				});
				it("even when a predicate is defined", function () {
					var e = arrgh.Enumerable.empty();
					expect(e.count(function (elem) {
						return true;
					})).toBe(0);
				});
			});

			it("when no predicate is defined it should return the number of elements", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.count()).toBe(6);
			});

			it("when some elements match the predicate it should return the number of matching elements", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.count(function (elem) {
					return elem.first === "Bill";
				})).toBe(3);
			});

			it("when no element matches the predicate it should return 0", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.count(function (elem) {
					return elem.first === "nope";
				})).toBe(0);
			});
		});

		describe("defaultIfEmpty", function () {
			it("should return the original elements if there are any", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.defaultIfEmpty().toArray()).toEqual(people);
			});
			it("should return the default value in a collection if the collection is empty", function () {
				var e = arrgh.Enumerable.empty();
				expect(e.defaultIfEmpty("some value").toArray()).toEqual(["some value"]);
			});
		});

		describe("distinct", function () {
			it("should remove doubles from a collection", function () {
				var e = new arrgh.Enumerable([1, 2, 2, 3, 4, 5, 5]);
				expect(e.distinct().toArray()).toEqual([1, 2, 3, 4, 5]);
			});

			it("or, when no doubles are found, the original collection", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.distinct().toArray()).toEqual(people);
			});

			it("or remove doubles based on an equality comparer", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.distinct(function (x, y) {
					return x.first === y.first;
				}).toArray()).toEqual([p0, p1, p3, p4]);
			});

			it("or remove doubles based on a rather weird, but edge-case, equality comparer", function () {
				var e = new arrgh.Enumerable([p0.first, p1.first, p2.first, p3.first, p4.first, p5.first, p6.first]);
				expect(e.distinct(function (x, y) {
					return x[1] === y[1];
				}).toArray()).toEqual([p0.first, p1.first, p4.first]);
			});
		});

		describe("forEach", function () {
			it("should loop through all people", function () {
				var arr = [];
				new arrgh.Enumerable(people).forEach(function (person, index) {
					arr.push({
						index: index,
						person: person
					});
				});

				expect(arr).toEqual([
				{
					index: 0,
					person: p0
				}, {
					index: 1,
					person: p1
				}, {
					index: 2,
					person: p2
				}, {
					index: 3,
					person: p3
				}, {
					index: 4,
					person: p4
				}, {
					index: 5,
					person: p5
				}]);
			});
		});

		describe("where", function () {
			describe("first is Bill", function () {
				it("should contain only Bills", function () {
					var arr = new arrgh.Enumerable(people).where(function (person) {
						return person.first === "Bill";
					}).toArray();
					expect(arr).toEqual([p1, p2, p5]);
				});
			});

			describe("last is Jobs", function () {
				it("should be empty", function () {
					var arr = new arrgh.Enumerable(people).where(function (person) {
						return person.last === "Jobs";
					}).toArray();
					expect(arr).toEqual([]);
				});
			});

			describe("last is Clinton", function () {
				it("should contain one element, Clinton", function () {
					var arr = new arrgh.Enumerable(people).where(function (person) {
						return person.last === "Clinton";
					}).toArray();
					expect(arr).toEqual([p5]);
				});
			});

			describe("last is McQueen", function () {
				it("should contain one element, McQueen", function () {
					var arr = new arrgh.Enumerable(people).where(function (person) {
						return person.last === "McQueen";
					}).toArray();
					expect(arr).toEqual([p4]);
				});
			});

			describe("index is even", function () {
				it("should contain people on even indices", function () {
					var arr = new arrgh.Enumerable(people).where(function (person, index) {
						return index % 2 === 0;
					}).toArray();
					expect(arr).toEqual([p0, p2, p4]);
				});
			});
		});

		describe("toArray", function () {
			it("should convert back to the original array", function () {
				var arr = new arrgh.Enumerable(people).toArray();
				expect(arr).toEqual(people);
			});
		});


		describe("select", function() {
			describe("first", function () {
				it("should contain all first names", function () {
					var arr = new arrgh.Enumerable(people).select(function (person) {
						return person.first;
					}).toArray();
					expect(arr).toEqual([p0.first, p1.first, p2.first, p3.first, p4.first, p5.first]);
				});
			});

			describe("first and last in new object", function () {
				it("should contain objects with first and last names", function () {
					var arr = new arrgh.Enumerable(people).select(function (person) {
						return {
							first: person.first,
							last: person.last
						};
					}).toArray();
					expect(arr).toEqual([{
						first: p0.first,
						last: p0.last
					}, {
						first: p1.first,
						last: p1.last
					}, {
						first: p2.first,
						last: p2.last
					}, {
						first: p3.first,
						last: p3.last
					}, {
						first: p4.first,
						last: p4.last
					}, {
						first: p5.first,
						last: p5.last
					}]);
				});
			});

			describe("index and full name", function () {
				it("should contain indices and full names", function () {
					var arr = new arrgh.Enumerable(people).select(function (person, index) {
						return {
							index: index,
							fullName: person.first + (person.last ? (" " + person.last) : "")
						};
					}).toArray();
					expect(arr).toEqual([
					{
						index: 0,
						fullName: p0.first + " " + p0.last
					}, {
						index: 1,
						fullName: p1.first + " " + p1.last
					}, {
						index: 2,
						fullName: p2.first + " " + p2.last
					}, {
						index: 3,
						fullName: p3.first
					}, {
						index: 4,
						fullName: p4.first + " " + p4.last
					}, {
						index: 5,
						fullName: p5.first + " " + p5.last
					}]);
				});
			});
		});
	});
}());