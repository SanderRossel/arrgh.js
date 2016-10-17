var testList = function () {
	"use strict";

	describe("List", function () {
		describe("ctors", function () {
			it("should construct from an array", function () {
				var e = new arrgh.List([1, 2, 3, 4, 5]);
				expect(e.toArray()).toEqual([1, 2, 3, 4, 5]);
			});

			it("should construct from some random objects", function () {
				var o = {};
				var e = new arrgh.List("Hello", true, 1, o);
				expect(e.toArray()).toEqual(["Hello", true, 1, o]);
			});

			it("should construct from another Enumerable", function () {
				var e1 = new arrgh.Enumerable([1, 2, 3, 4, 5]);
				var e2 = new arrgh.List(e1);
				expect(e2.toArray()).toEqual([1, 2, 3, 4, 5]);
			});

			it("should construct from a string", function () {
				var e = new arrgh.List("Hello");
				expect(e.toArray()).toEqual(["H", "e", "l", "l", "o"]);
			});

			it("should throw on an invalid argument", function () {
				expect(function () {
					new arrgh.List(true);
				}).toThrow();
			});
		});

		describe("add", function () {
			it("should have the item added", function () {
				var list = new arrgh.List(people);
				list.add(p6);
				var arr = people.slice();
				arr.push(p6);
				expect(list.toArray()).toEqual(arr);
			});
		});

		describe("addRange", function () {
			it("should add all the items in an array", function () {
				var list = new arrgh.List([p0, p1, p2]);
				list.addRange([p3, p4, p5]);
				expect(list.toArray()).toEqual(people);
				expect(list.length).toEqual(people.length);
			});

			it("should add all the items in another list", function () {
				var list = new arrgh.List([p0, p1, p2]);
				list.addRange(new arrgh.List([p3, p4, p5]));
				expect(list.toArray()).toEqual(people);
				expect(list.length).toEqual(people.length);
			});

			it("should add all the items that are passed as arguments", function () {
				var list = new arrgh.List([p0, p1, p2]);
				list.addRange(p3, p4, p5);
				expect(list.toArray()).toEqual(people);
				expect(list.length).toEqual(people.length);
			});
		});

		describe("asEnumerable", function () {
			it("should return a new enumerable", function () {
				var e = new arrgh.List(1, 2, 3, 4, 5);
				expect(e.asEnumerable()).not.toBe(e);
			});

			it("should not be a list", function () {
				var e = new arrgh.List(1, 2, 3, 4, 5);
				expect(e.asEnumerable() instanceof arrgh.Enumerable).toBe(true);
			});

			it("should contain the same elements as the original enumerable", function () {
				var e = new arrgh.List(1, 2, 3, 4, 5);
				expect(e.asEnumerable().sequenceEquals(e)).toBe(true);
			});
		});

		describe("remove", function () {
			it("should remove an item that's in the list", function () {
				var list = new arrgh.List(people);
				list.remove(p3);
				var arr = people.slice();
				arr.splice(3, 1);
				expect(list.toArray()).toEqual(arr);
				expect(list.length).toEqual(people.length - 1);
			});

			it("should not remove anything when the item is not in the list", function () {
				var list = new arrgh.List(people);
				list.remove("hello");
				expect(list.toArray()).toEqual(people);
				expect(list.length).toEqual(people.length);
			});
		});

		describe("indices", function () {
			it("should give the first added element an index of 0", function () {
				var l = new arrgh.List();
				expect(l.hasOwnProperty(0)).toEqual(false);
				l.add("Hello");
				expect(l.hasOwnProperty(0)).toEqual(true);
				expect(l[0]).toEqual("Hello");
			});

			it("should generate indices 0, 1, 2 if three items are added", function () {
				var l = new arrgh.List();
				l.addRange("Greetings", "Hello", "Bye");
				expect(l[0]).toEqual("Greetings");
				expect(l[1]).toEqual("Hello");
				expect(l[2]).toEqual("Bye");
			});

			it("should overwrite any items that are not added through add methods", function () {
				var l = new arrgh.List();
				l.add("Hi");
				l[1] = "Something";
				l.add("Bye");
				expect(l[1]).toBe("Bye");
			});

			it("should remove the last index when that item is removed", function () {
				var l = new arrgh.List(["Greetings", "Hello", "Bye"]);
				l.remove("Hello");
				expect(l.hasOwnProperty(2)).toEqual(false);
				expect(l[1]).toEqual("Bye");
			});
		});

		testOverridden(arrgh.List, function () {
			return new arrgh.List();
		});
	});
};