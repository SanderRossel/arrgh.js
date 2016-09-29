var testEnumerable = function () {
	"use strict";

    /*var arr = [];
	var l = new arrgh.List();

	var benchmark = function(description, callback) {
		var start = new Date().getTime();
		var i = 0;
		callback();
		console.log(description + " took: " + (new Date().getTime() - start));
	};*/

    /*benchmark("filling list", function () {
		var i = 0;
		for (i; i < 10000000; i += 1) {
			l.add(i);
		}
	});

	benchmark("filling array", function () {
		var i = 0;
		for (i; i < 10000000; i += 1) {
			arr.push(i);
		}
	});

	benchmark("iterate over array in for loop", function () {
		var i = 0;
		for (i; i < arr.length; i += 1) {
			var a = arr[i];
		}
	});

	benchmark("iterate over list in for loop", function () {
		var i = 0;
		for (i; i < l.length; i += 1) {
			var a = l[i];
		}
	});

	benchmark("iterate over array using forEach", function () {
		arr.forEach(function (elem, index) {
			var a = elem;
			var b = index;
		});
	});

	benchmark("iterate over list using forEach", function () {
		l.forEach(function (elem, index) {
			var a = elem;
			var b = index;
		});
	});*/

	describe("Enumerable", function () {
		describe("all", function () {
			describe("empty enumerable", function () {
				it("always returns true", function () {
					var e = arrgh.Enumerable.empty();
					expect(e.all(function () {
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
					expect(e.any(function () {
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
			it("should throw if the collection is empty", function () {
				var e = arrgh.Enumerable.empty();
				expect(function () {
					e.average();
				}).toThrow();
			});

			describe("with a collection of numerics", function () {
				it("should return the integer average", function () {
					var e = new arrgh.Enumerable(1, 2, 3, 4, 5);
					expect(e.average()).toBe(3);
				});

				it("should return the decimal average", function () {
					var e = new arrgh.Enumerable([1, 2, 3, 4, 5, 6]);
					expect(e.average()).toBe(3.5);
				});

				it("should return the fracture average", function () {
					var e = new arrgh.Enumerable([3, 3, 4]);
					expect(e.average()).toBeCloseTo(3.33);
				});

				it("should calculate the average (with floating-point rounding error)", function () {
					var e = new arrgh.Enumerable([1.2, 2.3, 3.4]);
                    expect(e.average()).toBeCloseTo(2.3); // Floating point precision... Ugh!
                });
			});

			describe("with a collection of non-numerics", function () {
				it("can return NaN if the collection has objects", function () {
					var e = new arrgh.Enumerable(people);
					expect(e.average()).toBeNaN();
				});

				it("can return NaN even if some elements are numeric", function () {
					var e = new arrgh.Enumerable([1, 2, p0, 0.2]);
					expect(e.average()).toBeNaN();
				});

				it("can return unexpected results", function () {
					var e = new arrgh.Enumerable([2, "2"]);
					expect(e.average()).toBe(11);
				});

				it("can return an average even when it makes no sense at all", function () {
					var e = new arrgh.Enumerable([2, [2]]);
					expect(e.average()).toBe(11);
				});
			});

			describe("using a selector", function () {
				it("should return the average age", function () {
					var e = new arrgh.Enumerable(people);
					expect(e.average(function (p) {
						return p.age;
					})).toBeCloseTo(50.17);
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
					expect(e.count(function () {
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
				expect(e.distinct({
					getHash: function (obj) {
						return obj[1];
					},
					equals: function (x, y) {
						return x[1] === y[1];
					}
				}).toArray()).toEqual([p0.first, p1.first, p4.first]);
			});
		});

		describe("elementAt", function () {
			it("should return the element at the 0th position", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.elementAt(0)).toBe(p0);
			});

			it("and at the 2nd position", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.elementAt(2)).toBe(p2);
			});

			it("and also at the last position", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.elementAt(e.count() - 1)).toBe(p5);
			});

			it("but not the -1th position (or any negative index)", function () {
				var e = new arrgh.Enumerable(people);
				expect(function () {
					e.elementAt(-1);
				}).toThrow();
			});

			it("and the 10th position (list only has 6 elements)", function () {
				var e = new arrgh.Enumerable(people);
				expect(function () {
					e.elementAt(10);
				}).toThrow();
			});

			it("should not throw in the edge case the inner (implementation) default is the same as an element", function () {
				var e = new arrgh.Enumerable([{}]);
				expect(e.elementAt(0)).toEqual({});
			});
		});

		describe("elementAtOrDefault", function () {
			it("should return the element at the 0th position", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.elementAtOrDefault(0, "Hello")).toBe(p0);
			});

			it("and at the 2nd position", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.elementAtOrDefault(2, "Hello")).toBe(p2);
			});

			it("and also at the last position", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.elementAtOrDefault(e.count() - 1, "Hello")).toBe(p5);
			});

			it("if the index is negative and no default value is supplied it should return undefined", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.elementAtOrDefault(-1)).toBe(undefined);
			});

			it("same for positive out of bounds", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.elementAtOrDefault(10)).toBe(undefined);
			});

			it("if the index is negative and a default value is supplied it should return the default value", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.elementAtOrDefault(-1, "Hello")).toBe("Hello");
			});

			it("also at positive out of bounds", function () {
				var e = new arrgh.Enumerable(people);
				expect(e.elementAtOrDefault(10, "Bye")).toBe("Bye");
			});
		});

		describe("except", function () {
			it("should return elements that are in the source, but not in the other collection", function () {
				var e = new arrgh.Enumerable(1, 2, 3, 4, 5).except(new arrgh.Enumerable(3, 5));
				expect(e.toArray()).toEqual([1, 2, 4]);
			});

			it("should return all elements if the other collection is empty", function () {
				var e = new arrgh.Enumerable(1, 2, 3, 4, 5).except(arrgh.Enumerable.empty());
				expect(e.toArray()).toEqual([1, 2, 3, 4, 5]);
			});

			it("should return no elements if the source is empty", function () {
				var e = arrgh.Enumerable.empty().except(new arrgh.Enumerable(1, 2));
				expect(e.toArray()).toEqual([]);
			});

			it("should return a set with distinct elements", function () {
				var e = new arrgh.Enumerable(1, 2, 2, 3, 4, 4, 5).except(new arrgh.Enumerable(3, 5, 3));
				expect(e.toArray()).toEqual([1, 2, 4]);
			});

			it("should return a set with distinct elements based on an equality comparer", function () {
				var e = new arrgh.Enumerable(people).except(new arrgh.Enumerable([{
					first: "Bill",
					last: "Murray"
				}, {
					first: "Bailey",
					last: null
				}]), {
					equals: function (a, b) {
						return a.first === b.first && a.last === b.last;
					},
					getHash: function (obj) {
						return obj.first + obj.last;
					}
				});
				expect(e.toArray()).toEqual([p0, p2, p4, p5]);
			});
		});

		describe("first", function () {
			it("should throw when the collection is empty", function () {
				expect(function () {
					arrgh.Enumerable.empty().first();
				}).toThrow();
			});

			it("should throw when a predicate is specified, but the collection is empty", function () {
				expect(function () {
					arrgh.Enumerable.empty().first(function (elem) {
						return elem === 1;
					});
				}).toThrow();
			});

			it("should throw when the collection is not empty, but no element matches the predicate", function () {
				expect(function () {
					new arrgh.Enumerable(1, 2, 3, 4).first(function (n) {
						return n === 5;
					});
				}).toThrow();
			});

			it("should return the first element if no predicate is defined", function () {
				expect(new arrgh.Enumerable(1, 2, 3, 4).first()).toBe(1);
			});

			it("should return the first element that matches the predicate", function () {
				expect(new arrgh.Enumerable(people).first(function (p) {
					return p.first === "Bill";
				})).toBe(p1);
			});
		});

		describe("firstOrDefault", function () {
			it("should return undefined when the collection is empty and no default is specified", function () {
				expect(arrgh.Enumerable.empty().firstOrDefault()).toBe(undefined);
			});

			it("should return undefined when the collection is not empty, but no element matches the predicate", function () {
				expect(new arrgh.Enumerable(1, 2, 3, 4).firstOrDefault(function (n) {
					return n === 5;
				})).toBe(undefined);
			});

			it("should return the first element if no predicate is defined", function () {
				expect(new arrgh.Enumerable(1, 2, 3, 4).firstOrDefault()).toBe(1);
			});

			it("should return the first element that matches the predicate", function () {
				expect(new arrgh.Enumerable(people).firstOrDefault(function (p) {
					return p.first === "Bill";
				})).toBe(p1);
			});

			it("should return the default when a default is defined and the collection is empty", function () {
				expect(arrgh.Enumerable.empty().firstOrDefault(p0)).toBe(p0);
			});

			it("should return the default when a default is defined and no element matches the predicate", function () {
				expect(new arrgh.Enumerable(people).firstOrDefault(function () {
					return false;
				}, p7)).toBe(p7);
			});
		});

		describe("forEach", function () {
			it("should not loop through an empty collection", function () {
				var arr = [];
				arrgh.Enumerable.empty().forEach(function (elem, index) {
					arr.push({ elem: elem, index: index });
				});
				expect(arr.length).toBe(0);
			});

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

			var testStopLoop = function (returnValue) {
				var arr = [];
				new arrgh.Enumerable(people).forEach(function (person, index) {
					arr.push({
						index: index,
						person: person
					});
					if (index === 1) {
						return returnValue;
					}
				});

				expect(arr).toEqual([
				{
					index: 0,
					person: p0
				}, {
					index: 1,
					person: p1
				}]);
			};

			it("should stop looping when false is returned", function () {
				testStopLoop(false);
			});

			it("should stop looping when anything falsey (except null and undefined) is returned", function () {
				testStopLoop(0);
			});

			var testContLoop = function (returnValue) {
				var arr = [];
				new arrgh.Enumerable(1, 2, 3).forEach(function (n) {
					arr.push(n);
					return returnValue;
				});
				expect(arr).toEqual([1, 2, 3]);
			};

			it("should continue looping when true is returned", function () {
				testContLoop(true);
			});

			it("should continue looping when anything truthy (and null and undefined) is returned", function () {
				testContLoop({});
			});

			it("should continue looping when anything null is returned", function () {
				testContLoop(null);
			});

			it("should continue looping when anything null is returned", function () {
				testContLoop(undefined);
			});
		});

		describe("intersect", function () {
			it("should return elements that are in the source and in the other collection", function () {
				var e = new arrgh.Enumerable(1, 2, 3, 4, 5).intersect(new arrgh.Enumerable(3, 5));
				expect(e.toArray()).toEqual([3, 5]);
			});

			it("should return no elements if the other collection is empty", function () {
				var e = new arrgh.Enumerable(1, 2, 3, 4, 5).intersect(arrgh.Enumerable.empty());
				expect(e.toArray()).toEqual([]);
			});

			it("should return no elements if the source is empty", function () {
				var e = arrgh.Enumerable.empty().intersect(new arrgh.Enumerable(1, 2));
				expect(e.toArray()).toEqual([]);
			});

			it("should return a set with distinct elements", function () {
				var e = new arrgh.Enumerable(1, 2, 2, 3, 4, 5, 5).intersect(new arrgh.Enumerable(2, 3, 5, 3));
				expect(e.toArray()).toEqual([2, 3, 5]);
			});

			it("should return a set with distinct elements based on an equality comparer", function () {
				var e = new arrgh.Enumerable(people).intersect(new arrgh.Enumerable([{
					first: "Bill",
					last: "Murray"
				}, {
					first: "Bailey",
					last: null
				}, {
					first: "Steve",
					last: "McQueen"
				}]), {
					equals: function (a, b) {
						return a.first === b.first && a.last === b.last;
					},
					getHash: function (obj) {
						return obj.first + obj.last;
					}
				});
				expect(e.toArray()).toEqual([p1, p3, p4]);
			});
		});

		describe("last", function () {
			it("should throw when the collection is empty", function () {
				expect(function () {
					arrgh.Enumerable.empty().last();
				}).toThrow();
			});

			it("should throw when a predicate is specified, but the collection is empty", function () {
				expect(function () {
					arrgh.Enumerable.empty().last(function (elem) {
						return elem === 1;
					});
				}).toThrow();
			});

			it("should throw when the collection is not empty, but no element matches the predicate", function () {
				expect(function () {
					new arrgh.Enumerable(1, 2, 3, 4).last(function (n) {
						return n === 5;
					});
				}).toThrow();
			});

			it("should return the last element if no predicate is defined", function () {
				expect(new arrgh.Enumerable(1, 2, 3, 4).last()).toBe(4);
			});

			it("should return the last element that matches the predicate", function () {
				expect(new arrgh.Enumerable(people).last(function (p) {
					return p.first === "Bill";
				})).toBe(p5);
			});

			it("should return the last element that matches the predicate, even when it's not the last in the collection", function () {
				expect(new arrgh.Enumerable(people).last(function (p) {
					return p.first === "Steve";
				})).toBe(p4);
			});
		});

		describe("lastOrDefault", function () {
			it("should return undefined when the collection is empty and no default is specified", function () {
				expect(arrgh.Enumerable.empty().lastOrDefault()).toBe(undefined);
			});

			it("should return undefined when the collection is not empty, but no element matches the predicate", function () {
				expect(new arrgh.Enumerable(1, 2, 3, 4).lastOrDefault(function (n) {
					return n === 5;
				})).toBe(undefined);
			});

			it("should return the last element if no predicate is defined", function () {
				expect(new arrgh.Enumerable(1, 2, 3, 4).lastOrDefault()).toBe(4);
			});

			it("should return the last element that matches the predicate", function () {
				expect(new arrgh.Enumerable(people).lastOrDefault(function (p) {
					return p.first === "Bill";
				})).toBe(p5);
			});

			it("should return the last element that matches the predicate, even when it's not the last in the collection", function () {
				expect(new arrgh.Enumerable(people).lastOrDefault(function (p) {
					return p.first === "Steve";
				})).toBe(p4);
			});

			it("should return the default when a default is defined and the collection is empty", function () {
				expect(arrgh.Enumerable.empty().lastOrDefault(p0)).toBe(p0);
			});

			it("should return the default when a default is defined and no element matches the predicate", function () {
				expect(new arrgh.Enumerable(people).lastOrDefault(function () {
					return false;
				}, p7)).toBe(p7);
			});
		});

		describe("max", function () {
			it("should return undefined when the collection is empty", function () {
				var e = arrgh.Enumerable.empty();
				expect(e.max()).toBe(undefined);
			});

			describe("with a collection of numerics", function () {
				it("should return the integer max", function () {
					var e = new arrgh.Enumerable(1, 3, 5, 2, 4);
					expect(e.max()).toBe(5);
				});

				it("should return the decimal max", function () {
					var e = new arrgh.Enumerable([1.4, 2.6, 6.33, 3, 6.32]);
					expect(e.max()).toBe(6.33);
				});

				it("should return Infinity", function () {
					var e = new arrgh.Enumerable(1, 3, 5, Infinity, 2, 4);
					expect(e.max()).toBe(Infinity);
				});
			});

			describe("with a collection of non-numerics", function () {
				it("can return the first result it finds", function () {
					var e = new arrgh.Enumerable(people);
					expect(e.max()).toBe(p0);
				});

				it("can return the max numeric value even if some values are non-numeric", function () {
					var e = new arrgh.Enumerable([1, 2, p0, 0.2]);
					expect(e.max()).toBe(2);
				});

				it("can favor strings over numerics", function () {
					var e = new arrgh.Enumerable([2, "3", 3]);
					expect(e.max()).toBe("3");
				});

				it("can return a max even when it makes no sense at all", function () {
					var e = new arrgh.Enumerable([2, [3], 3]);
					expect(e.max()).toEqual([3]);
				});
			});

			describe("using a selector", function () {
				it("should return the max age", function () {
					var e = new arrgh.Enumerable(people);
					expect(e.max(function (p) {
						return p.age;
					})).toBe(69);
				});
			});
		});

		describe("min", function () {
			it("should return undefined when the collection is empty", function () {
				var e = arrgh.Enumerable.empty();
				expect(e.min()).toBe(undefined);
			});

			describe("with a collection of numerics", function () {
				it("should return the integer min", function () {
					var e = new arrgh.Enumerable(3, 5, 1, 2, 4);
					expect(e.min()).toBe(1);
				});

				it("should return the decimal min", function () {
					var e = new arrgh.Enumerable([2.6, 6.33, 1.4, 3, 6.32]);
					expect(e.min()).toBe(1.4);
				});

				it("should not return Infinity", function () {
					var e = new arrgh.Enumerable(2, 3, 5, Infinity, 1, 4);
					expect(e.min()).toBe(1);
				});
			});

			describe("with a collection of non-numerics", function () {
				it("can return the first result it finds", function () {
					var e = new arrgh.Enumerable(people);
					expect(e.min()).toBe(p0);
				});

				it("can return the min numeric value even if some values are non-numeric", function () {
					var e = new arrgh.Enumerable([2, 1, p0, 0.2]);
					expect(e.min()).toBe(0.2);
				});

				it("can favor strings over numerics", function () {
					var e = new arrgh.Enumerable([3, "1", 1]);
					expect(e.min()).toBe("1");
				});

				it("can return a min even when it makes no sense at all", function () {
					var e = new arrgh.Enumerable([3, [2], 2]);
					expect(e.min()).toEqual([2]);
				});
			});

			describe("using a selector", function () {
				it("should return the min age", function () {
					var e = new arrgh.Enumerable(people);
					expect(e.min(function (p) {
						return p.age;
					})).toBe(10);
				});
			});
		});

		describe("typeof", function () {
			var f1 = function () { return 42; };
			var f2 = function (arg1, arg2) { return "Hi"; };
			var o1 = { greet: "Hello" };
			var o2 = new Object();
			var e1 = new arrgh.Enumerable();

			var allTypes = new arrgh.Enumerable([true, 42, "Hello", f1, o1, undefined, null, e1,
				false, 666, "Bye", f2, o2, null, undefined, arrgh.Enumerable.empty(), true]);
			it("should return only booleans", function () {
				expect(allTypes.ofType(Boolean).toArray()).toEqual([true, false, true]);
			});

			it("should return only numbers", function () {
				expect(allTypes.ofType(Number).toArray()).toEqual([42, 666]);
			});

			it("should return only strings", function () {
				expect(allTypes.ofType(String).toArray()).toEqual(["Hello", "Bye"]);
			});

			it("should return only functions", function () {
				expect(allTypes.ofType(Function).toArray()).toEqual([f1, f2]);
			});

			it("should return only objects", function () {
				expect(allTypes.ofType(Object).toArray()).toEqual([o1, e1, o2, arrgh.Enumerable.empty()]);
			});

			it("should return only undefineds", function () {
				expect(allTypes.ofType(undefined).toArray()).toEqual([undefined, undefined]);
			});

			it("should return only nulls", function () {
				expect(allTypes.ofType(null).toArray()).toEqual([null, null]);
			});

			it("should return only enumerables", function () {
				expect(allTypes.ofType(arrgh.Enumerable).toArray()).toEqual([e1, arrgh.Enumerable.empty()]);
			});
		});

		describe("where", function () {
			it("should contain only Bills", function () {
				var arr = new arrgh.Enumerable(people).where(function (person) {
					return person.first === "Bill";
				}).toArray();
				expect(arr).toEqual([p1, p2, p5]);
			});

			it("should be empty", function () {
				var arr = new arrgh.Enumerable(people).where(function (person) {
					return person.last === "Jobs";
				}).toArray();
				expect(arr).toEqual([]);
			});

			it("should contain one element, Clinton", function () {
				var arr = new arrgh.Enumerable(people).where(function (person) {
					return person.last === "Clinton";
				}).toArray();
				expect(arr).toEqual([p5]);
			});

			it("should contain one element, McQueen", function () {
				var arr = new arrgh.Enumerable(people).where(function (person) {
					return person.last === "McQueen";
				}).toArray();
				expect(arr).toEqual([p4]);
			});

			it("should contain people on even indices", function () {
				var arr = new arrgh.Enumerable(people).where(function (person, index) {
					return index % 2 === 0;
				}).toArray();
				expect(arr).toEqual([p0, p2, p4]);
			});
		});

		describe("toArray", function () {
			it("should convert back to the original array", function () {
				var arr = new arrgh.Enumerable(people).toArray();
				expect(arr).toEqual(people);
			});
		});


		describe("select", function () {
			it("should contain all first names", function () {
				var arr = new arrgh.Enumerable(people).select(function (person) {
					return person.first;
				}).toArray();
				expect(arr).toEqual([p0.first, p1.first, p2.first, p3.first, p4.first, p5.first]);
			});

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
};