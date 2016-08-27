(function () {
	'use strict';

	var p0 = {
		first: "Sander",
		last: "Rossel",
		age: 28
	};

	var p1 = {
		first: "Bill",
		last: "Murray",
		age: 58
	};

	var p2 = {
		first: "Bill",
		last: "Gates",
		age: 68
	};

	var p3 = {
		first: "Bailey",
		last: null,
		age: 10
	};

	var p4 = {
		first: "Steve",
		last: "McQueen",
		age: 68
	};

	var p5 = {
		first: "Bill",
		last: "Clinton",
		age: 69
	};

	var p6 = {
		first: "Steve",
		last: "Jobs"
	};

	var p7 = {
		first: "Steve",
		last: "McQueen",
		age: 88
	};

	var people = [p0, p1, p2, p3, p4, p5];

	describe("Enumerable", function () {
		describe("toArray", function () {
			it("should convert back to the original array", function () {
				var arr = new arrgh.Enumerable(people).toArray();
				expect(arr).toEqual(people);
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

	describe("List", function () {
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
				it("should raise an exception", function () {
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

	describe("OrderedEnumerable", function () {
		describe("orderBy", function () {
			describe("order by first", function () {
				it("should be ordered by first", function () {
					var ordered = new arrgh.Enumerable(people)
					.orderBy(function (p) {
						return p.first;
					});
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

	describe("Dictionary", function () {
		describe("add", function () {
			it("should add the items as key-value pairs and loop over them", function () {
				var d = new arrgh.Dictionary();
				d.add(p0.first, p0);
				d.add(p1.first, p1);
				var arr = [];
				d.forEach(function (pair, index) {
					arr.push(pair.key, pair.value, index);
				});
				expect(d[p0.first]).toEqual(p0);
				expect(d[p1.first]).toEqual(p1);
				expect(arr).toEqual([p0.first, p0, 0, p1.first, p1, 1]);
			});
		});
	});
})();