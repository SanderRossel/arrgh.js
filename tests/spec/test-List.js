(function () {
	"use strict";

	describe("List", function () {
		describe("from array", function () {
			it("should initialize from an array", function () {
				var l = new arrgh.List([p0, p1, p2]);
				expect(l.length).toEqual(3);
				expect(l[0]).toEqual(p0);
				expect(l[1]).toEqual(p1);
				expect(l[2]).toEqual(p2);
			});
		});

		describe("from Enumerable", function () {
			it("should initialize from an Enumerable", function () {
				var l = new arrgh.List(new arrgh.Enumerable([p0, p1, p2]));
				expect(l.length).toEqual(3);
				expect(l[0]).toEqual(p0);
				expect(l[1]).toEqual(p1);
				expect(l[2]).toEqual(p2);
			});
		});

		describe("from List", function () {
			it("should initialize from another List", function () {
				var l = new arrgh.List(new arrgh.List([p0, p1, p2]));
				expect(l.length).toEqual(3);
				expect(l[0]).toEqual(p0);
				expect(l[1]).toEqual(p1);
				expect(l[2]).toEqual(p2);
			});
		});

		describe("toArray", function () {
			it("should convert back to the original array", function () {
				var arr = new arrgh.List(people).toArray();
				expect(arr).toEqual(people);
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
			describe("add an array", function () {
				it("should have added all the items", function () {
					var list = new arrgh.List([p0, p1, p2]);
					list.addRange([p3, p4, p5]);
					expect(list.toArray()).toEqual(people);
					expect(list.length).toEqual(people.length);
				});
			});

			describe("add another list", function () {
				it("should have added all the items", function () {
					var list = new arrgh.List([p0, p1, p2]);
					list.addRange(new arrgh.List([p3, p4, p5]));
					expect(list.toArray()).toEqual(people);
					expect(list.length).toEqual(people.length);
				});
			});

			describe("add multiple arguments", function () {
				it("should have added all the items", function () {
					var list = new arrgh.List([p0, p1, p2]);
					list.addRange(p3, p4, p5);
					expect(list.toArray()).toEqual(people);
					expect(list.length).toEqual(people.length);
				});
			});
		});

		describe("remove", function () {
			describe("remove an existing item", function () {
				it("should have the item removed", function () {
					var list = new arrgh.List(people);
					list.remove(p3);
					var arr = people.slice();
					arr.splice(3, 1);
					expect(list.toArray()).toEqual(arr);
					expect(list.length).toEqual(people.length - 1);
				});
			});

			describe("remove non-existing item", function () {
				it("should do nothing", function () {
					var list = new arrgh.List(people);
					list.remove("hello");
					expect(list.toArray()).toEqual(people);
					expect(list.length).toEqual(people.length);
				});
			});
		});

		describe("indices", function () {
			describe("add one item", function () {
				it("should have index 0", function () {
					var l = new arrgh.List();
					expect(l.hasOwnProperty(0)).toEqual(false);
					l.add("Hello");
					expect(l.hasOwnProperty(0)).toEqual(true);
					expect(l[0]).toEqual("Hello");
				});
			});

			describe("add three items", function () {
				it("should have index 0, 1, 2", function () {
					var l = new arrgh.List();
					l.addRange("Greetings", "Hello", "Bye");
					expect(l[0]).toEqual("Greetings");
					expect(l[1]).toEqual("Hello");
					expect(l[2]).toEqual("Bye");
				});
			});

			describe("add a custom item", function () {
				it("should throw", function () {
					var l = new arrgh.List();
					l.add("Hi");
					l[1] = "Something";
					expect(function () {
						l.add("Bye");
					}).toThrow();
				});
			});

			describe("remove an item", function () {
				it("should remove the last index", function () {
					var l = new arrgh.List(["Greetings", "Hello", "Bye"]);
					l.remove("Hello");
					expect(l.hasOwnProperty(2)).toEqual(false);
					expect(l[1]).toEqual("Bye");
				});
			});
		});
	});
}());