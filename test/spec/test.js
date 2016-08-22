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

	var people = [p0, p1, p2, p3, p4, p5];

	describe("Enumerable", function () {
		describe("toArray", function () {
			it("should convert back to the original array", function () {
				var arr = arrgh.asEnumerable(people).toArray();
				expect(arr).toEqual(people);
			});
		});

		describe("forEach", function () {
			it("should loop through all people", function () {
				var arr = [];
				arrgh.asEnumerable(people).forEach(function (person, index) {
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
					var arr = arrgh.asEnumerable(people).where(function (person) {
						return person.first === "Bill";
					}).toArray();
					expect(arr).toEqual([p1, p2, p5]);
				});
			});

			describe("last is Jobs", function () {
				it("should be empty", function () {
					var arr = arrgh.asEnumerable(people).where(function (person) {
						return person.last === "Jobs";
					}).toArray();
					expect(arr).toEqual([]);
				});
			});

			describe("index is even", function () {
				it("should contain people on even indices", function () {
					var arr = arrgh.asEnumerable(people).where(function (person, index) {
						return index % 2 === 0;
					}).toArray();
					expect(arr).toEqual([p0, p2, p4]);
				});
			});
		});

		describe("select", function() {
			describe("first", function () {
				it("should contain all first names", function () {
					var arr = arrgh.asEnumerable(people).select(function (person) {
						return person.first;
					}).toArray();
					expect(arr).toEqual([p0.first, p1.first, p2.first, p3.first, p4.first, p5.first]);
				});
			});

			describe("first and last in new object", function () {
				it("should contain objects with first and last names", function () {
					var arr = arrgh.asEnumerable(people).select(function (person) {
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
					var arr = arrgh.asEnumerable(people).select(function (person, index) {
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
			it("should add an item", function () {
				var list = arrgh.asList(people);
				var p6 = {
					first: "Steve",
					last: "Jobs"
				}
				list.add(p6);
				var arr = people.slice();
				arr.push(p6);
				expect(list.toArray()).toEqual(arr);
			});
		});
	});
})();