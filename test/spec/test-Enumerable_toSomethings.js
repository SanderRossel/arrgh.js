/* exported testEnumerableToSomethings */
var testEnumerableToSomethings = function () {
	"use strict";

	describe("toSomethings", function () {
		describe("toDictionary", function () {
			it("should create a dictionary", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.toDictionary(fullNameSelector) instanceof arrgh.Dictionary).toBe(true);
			});

			it("should throw when keys are double", function () {
				var e = new arrgh.Enumerable(people);
				expect(function () {
					e.toDictionary(firstNameSelector);
				}).toThrow();
			});

			it("should create a dictionary with last names as key", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.toDictionary(function (p) {
					return p.last;
				}).toArray()).toEqual([{
					key: "Rossel",
					value: p0
				}, {
					key: "Murray",
					value: p1
				}, {
					key: "Gates",
					value: p2
				}, {
					key: null,
					value: p3
				}, {
					key: "McQueen",
					value: p4
				}, {
					key: "Clinton",
					value: p5
				}]);
			});

			it("should create a dictionary with last names as key and full names as elements", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.toDictionary(function (p) {
					return p.last;
				}, fullNameSelector).toArray()).toEqual([{
					key: "Rossel",
					value: "Sander Rossel"
				}, {
					key: "Murray",
					value: "Bill Murray"
				}, {
					key: "Gates",
					value: "Bill Gates"
				}, {
					key: null,
					value: "Bailey"
				}, {
					key: "McQueen",
					value: "Steve McQueen"
				}, {
					key: "Clinton",
					value: "Bill Clinton"
				}]);
			});

			it("should create a dictionary with last names as key, full names as elements and an equality comparer and throw because the key is already present", function () {
				var e = new arrgh.Enumerable(people);
				expect(function () {
					e.toDictionary(function (p) {
						return p.last;
					}, fullNameSelector, {
						getHash: function (obj) {
							return obj ? obj[0] : "null"[0];
						},
						equals: function (a, b) {
							return (a ? a[0] : "null"[0]) === (b ? b[0] : "null"[0]);
						}
					});
				}).toThrow();
			});

			it("should create a dictionary with people as key and a first name equality comparer", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.toDictionary(function (p) {
					return p;
				}, {
					equals: function (x, y) {
						return x === y;
					},
					getHash: function (obj) {
						return obj.first;
					}
				}).toArray()).toEqual([{
					key: p0,
					value: p0
				}, {
					key: p1,
					value: p1
				}, {
					key: p2,
					value: p2
				}, {
					key: p3,
					value: p3
				}, {
					key: p4,
					value: p4
				}, {
					key: p5,
					value: p5
				}]);
			});

			it("should create a dictionary with last names as key and an equality comparer and throw because the key is already present", function () {
				var e = new arrgh.Enumerable(people);
				expect(function () {
					e.toDictionary(function (p) {
						return p.last;
					}, {
						getHash: function (obj) {
							return obj ? obj[0] : "null"[0];
						},
						equals: function (a, b) {
							return (a ? a[0] : "null"[0]) === (b ? b[0] : "null"[0]);
						}
					});
				}).toThrow();
			});
		});

		describe("toList", function () {
			it("should create a list", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.toList() instanceof arrgh.List).toEqual(true);
			});

			it("should create a list with the original items", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.toList().toArray()).toEqual(people);
			});

			it("should create an empty list ", function () {
				expect(arrgh.Enumerable.empty().toList().toArray()).toEqual([]);
			});

			it("should create a list containing the characters of Hello", function () {
				var e = new arrgh.Enumerable("Hello");
				expect(e.toList().toArray()).toEqual(["H", "e", "l", "l", "o"]);
			});
		});

		describe("toLookup", function () {
			it("should group people by first name", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.toLookup(firstNameSelector).select(function (g) {
					return { key: g.key, arr: g.toArray() };
				}).toArray()).toEqual([{
					key: "Sander",
					arr: [p0]
				}, {
					key: "Bill",
					arr: [p1, p2, p5]
				}, {
					key: "Bailey",
					arr: [p3]
				}, {
					key: "Steve",
					arr: [p4]
				}]);
			});

			it("should group by first name and return a group with one element", function () {
				var e = new arrgh.Enumerable(people);
				var group = e.toLookup(firstNameSelector).get("Sander");
				group = {
					key: group.key,
					arr: group.toArray()
				};
				expect(group).toEqual({
					key: "Sander",
					arr: [p0]
				});
			});

			it("should group by first name and return a group with elements", function () {
				var e = new arrgh.Enumerable(people);
				var group = e.toLookup(firstNameSelector).get("Bill");
				group = {
					key: group.key,
					arr: group.toArray()
				};
				expect(group).toEqual({
					key: "Bill",
					arr: [p1, p2, p5]
				});
			});

			it("should group by first name and also return not existing names, but without elements", function () {
				var e = new arrgh.Enumerable(people);
				var group = e.toLookup(firstNameSelector).get("Someone");
				group = {
					key: group.key,
					arr: group.toArray()
				};
				expect(group).toEqual({
					key: "Someone",
					arr: []
				});
			});

			it("should group people by first name and select full names as elements", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.toLookup(firstNameSelector, fullNameSelector).select(function (g) {
					return { key: g.key, arr: g.toArray() };
				}).toArray()).toEqual([{
					key: "Sander",
					arr: ["Sander Rossel"]
				}, {
					key: "Bill",
					arr: ["Bill Murray", "Bill Gates", "Bill Clinton"]
				}, {
					key: "Bailey",
					arr: ["Bailey"]
				}, {
					key: "Steve",
					arr: ["Steve McQueen"]
				}]);
			});

			it("should group people by first name, select full names as elements and use an equality comparer", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.toLookup(firstNameSelector, fullNameSelector, {
					getHash: function (obj) {
						return obj[0];
					},
					equals: function (a, b) {
						return a[0] === b[0];
					}
				}).select(function (g) {
					return { key: g.key, arr: g.toArray() };
				}).toArray()).toEqual([{
					key: "Sander",
					arr: ["Sander Rossel", "Steve McQueen"]
				}, {
					key: "Bill",
					arr: ["Bill Murray", "Bill Gates", "Bailey", "Bill Clinton"]
				}]);
			});

			it("should group people by first name and use an equality comparer", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.toLookup(firstNameSelector, {
					getHash: function (obj) {
						return obj[0];
					},
					equals: function (a, b) {
						return a[0] === b[0];
					}
				}).select(function (g) {
					return { key: g.key, arr: g.toArray() };
				}).toArray()).toEqual([{
					key: "Sander",
					arr: [p0, p4]
				}, {
					key: "Bill",
					arr: [p1, p2, p3, p5]
				}]);
			});
		});
	});
};