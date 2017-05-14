/* exported testList */
var testList = function () {
	"use strict";

	describe("List", function () {
		describe("ctor", function () {
			it("should have an initial length of 0", function () {
				var l = new arrgh.List();
				expect(l.length).toBe(0);
			});

			it("should have an initial length of 3", function () {
				var l = new arrgh.List([1, 2, 3]);
				expect(l.length).toBe(3);
			});

			it("should have an initial length of 5", function () {
				var l = new arrgh.List("Hello");
				expect(l.length).toBe(5);
			});
		});

		describe("add", function () {
			it("should not alter the original array", function () {
				var l = new arrgh.List(people);
				l.add(p6);
				expect(people).toEqual([p0, p1, p2, p3, p4, p5]);
			});

			it("should add an item to the list", function () {
				var l = new arrgh.List();
				l.add("Something");
				expect(l.toArray()).toEqual(["Something"]);
			});

			it("should add undefined to the list", function () {
				var l = new arrgh.List();
				l.add(undefined);
				expect(l.toArray()).toEqual([undefined]);
			});

			it("should add NaN to the list", function () {
				var l = new arrgh.List();
				l.add(NaN);
				var arr = l.toArray();
				expect(arr.length).toBe(1);
				expect(arr[0]).toBeNaN();
			});

			it("should add multiple items to the list", function () {
				var l = new arrgh.List();
				l.add(p0);
				l.add(42);
				l.add(p1);
				l.add(NaN);
				l.add("Hello");
				var arr = l.toArray();
				expect(arr.length).toBe(5);
				expect(arr[0]).toBe(p0);
				expect(arr[1]).toBe(42);
				expect(arr[2]).toBe(p1);
				expect(arr[3]).toBeNaN();
				expect(arr[4]).toBe("Hello");
			});

			it("should add the same item twice", function () {
				var l = new arrgh.List();
				l.add(p0);
				l.add(p0);
				expect(l.toArray()).toEqual([p0, p0]);
			});

			it("should ignore additional arguments", function () {
				var l = new arrgh.List();
				l.add(p0, p2);
				expect(l.toArray()).toEqual([p0]);
			});

			it("should increase the length when an item is added to the list", function () {
				var l = new arrgh.List();
				l.add("Something");
				expect(l.length).toEqual(1);
			});

			it("should increase the length with 1 even when additional arguments are passed", function () {
				var l = new arrgh.List();
				l.add(p1, p2);
				expect(l.length).toEqual(1);
			});
		});

		describe("addRange", function () {
			it("should not alter the original array", function () {
				var l = new arrgh.List(people);
				l.addRange([p6]);
				expect(people).toEqual([p0, p1, p2, p3, p4, p5]);
			});

			it("should not add anything when an empty array is passed", function () {
				var l = new arrgh.List();
				l.addRange([]);
				expect(l.toArray()).toEqual([]);
			});

			it("should not add anything when an empty enumerable is passed", function () {
				var l = new arrgh.List();
				l.addRange(arrgh.Enumerable.empty());
				expect(l.toArray()).toEqual([]);
			});

			it("should add an array when an empty array is passed in an array", function () {
				var l = new arrgh.List();
				l.addRange([[]]);
				expect(l.toArray()).toEqual([[]]);
			});

			it("should add all the items in an array", function () {
				var l = new arrgh.List();
				l.addRange(people);
				expect(l.toArray()).toEqual(people);
			});

			it("should add all the items in another list", function () {
				var l = new arrgh.List();
				l.addRange(new arrgh.List(people));
				expect(l.toArray()).toEqual(people);
			});

			it("should add all the items that are passed as arguments", function () {
				var l = new arrgh.List();
				l.addRange(p0, p1, p2, p3, p4, p5);
				expect(l.toArray()).toEqual(people);
			});

			it("should add a single item if it's not an array or enumerable", function () {
				var l = new arrgh.List();
				l.addRange(p0);
				expect(l.toArray()).toEqual([p0]);
			});

			it("should add edge-case items", function () {
				var l = new arrgh.List();
				l.addRange(NaN, -Infinity, undefined, null);
				var arr = l.toArray();
				expect(arr.length).toBe(4);
				expect(arr[0]).toBeNaN();
				expect(arr[1]).toBe(-Infinity);
				expect(arr[2]).toBeUndefined();
				expect(arr[3]).toBeNull();
			});

			it("should add a single item if a non-enumerable is passed as argument", function () {
				var l = new arrgh.List();
				l.addRange("Hello");
				expect(l.toArray()).toEqual(["Hello"]);
			});

			it("should add new items to the end of the list", function () {
				var l = new arrgh.List(p0, p1);
				l.addRange(p2, p3);
				l.addRange(p4, p5);
				expect(l.toArray()).toEqual(people);
			});

			it("should increase the length with the number of items added", function () {
				var l = new arrgh.List();
				l.addRange(people);
				expect(l.length).toBe(6);
			});
		});

		describe("clear", function () {
			it("should clear the list", function () {
				var l = new arrgh.List(people);
				l.clear();
				expect(l.toArray()).toEqual([]);
			});

			it("should set length to 0", function () {
				var l = new arrgh.List(people);
				l.clear();
				expect(l.length).toBe(0);
			});
		});

		describe("get", function () {
			it("should get the item at the specified index", function () {
				var l = new arrgh.List("abcdefg");
				expect(l.get(3)).toBe("d");
			});

			it("should get an item after adding it", function () {
				var l = new arrgh.List();
				l.add("Hello");
				expect(l.get(0)).toBe("Hello");
			});

			it("should get the last item after adding a range", function () {
				var l = new arrgh.List();
				l.addRange(people);
				expect(l.get(l.length - 1)).toBe(p5);
			});

			it("should get the item at the specified index even when it's undefined", function () {
				var l = new arrgh.List(1, 2, 3, undefined, 4, 5);
				expect(l.get(3)).toBeUndefined();
			});

			it("should get the item at the last index", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5);
				expect(l.get(4)).toBe(5);
			});

			it("should throw when the index is negative", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.get(-1);
				}).toThrow();
			});

			it("should throw when the index is greater than the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.get(4);
				}).toThrow();
			});

			it("should throw when the index is the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.get(l.length);
				}).toThrow();
			});

			it("should throw when the list is empty", function () {
				var l = new arrgh.List();
				expect(function () {
					l.get(0);
				}).toThrow();
			});
		});

		describe("insert", function () {
			it("should not alter the original array", function () {
				var l = new arrgh.List(people);
				l.insert(2, p6);
				expect(people).toEqual([p0, p1, p2, p3, p4, p5]);
			});

			it("should insert at the start of the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5);
				l.insert(0, 0);
				expect(l.toArray()).toEqual([0, 1, 2, 3, 4, 5]);
			});

			it("should insert at the end of the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5);
				l.insert(5, 6);
				expect(l.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
			});

			it("should insert at the length of the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5);
				l.insert(l.length, 6);
				expect(l.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
			});

			it("should insert at the middle of the list", function () {
				var l = new arrgh.List(1, 2, 4, 5);
				l.insert(2, 3);
				expect(l.toArray()).toEqual([1, 2, 3, 4, 5]);
			});

			it("should insert at 0 when the list is empty", function () {
				var l = new arrgh.List();
				l.insert(0, "Hello");
				expect(l.toArray()).toEqual(["Hello"]);
			});

			it("should throw when the index is negative", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.insert(-1, 0);
				}).toThrow();
			});

			it("should throw when the index is greater than the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.insert(l.length + 1, 4);
				}).toThrow();
			});
		});

		describe("insertRange", function () {
			it("should not alter the original array", function () {
				var l = new arrgh.List(people);
				l.insertRange(1, [p6]);
				expect(people).toEqual([p0, p1, p2, p3, p4, p5]);
			});

			it("should insert an enumerable at the start of the list", function () {
				var l = new arrgh.List("def");
				l.insertRange(0, new arrgh.Enumerable("abc"));
				expect(l.toArray()).toEqual(new arrgh.Enumerable("abcdef").toArray());
			});

			it("should insert an enumerable at the end of the list", function () {
				var l = new arrgh.List("abc");
				l.insertRange(3, new arrgh.Enumerable("def"));
				expect(l.toArray()).toEqual(new arrgh.Enumerable("abcdef").toArray());
			});

			it("should insert an enumerable at the middle of the list", function () {
				var l = new arrgh.List("abcghi");
				l.insertRange(3, new arrgh.Enumerable("def"));
				expect(l.toArray()).toEqual(new arrgh.Enumerable("abcdefghi").toArray());
			});

			it("should insert an array at the middle of the list", function () {
				var l = new arrgh.List("abcghi");
				l.insertRange(3, ["d", "e", "f"]);
				expect(l.toArray()).toEqual(new arrgh.Enumerable("abcdefghi").toArray());
			});

			it("should insert items at the middle of the list", function () {
				var l = new arrgh.List("abcghi");
				l.insertRange(3, "d", "e", "f");
				expect(l.toArray()).toEqual(new arrgh.Enumerable("abcdefghi").toArray());
			});

			it("should insert a single item at the middle of the list", function () {
				var l = new arrgh.List("ac");
				l.insertRange(1, "b");
				expect(l.toArray()).toEqual(["a", "b", "c"]);
			});

			it("should insert items at the length of the list", function () {
				var l = new arrgh.List("abc");
				l.insertRange(l.length, new arrgh.Enumerable("def"));
				expect(l.toArray()).toEqual(new arrgh.Enumerable("abcdef").toArray());
			});

			it("should not insert anything when an empty array is passed", function () {
				var l = new arrgh.List("abc");
				l.insertRange(1, []);
				expect(l.toArray()).toEqual(["a", "b", "c"]);
			});

			it("should insert an empty array when an empty array is passed in an array", function () {
				var l = new arrgh.List("abc");
				l.insertRange(1, [[]]);
				expect(l.toArray()).toEqual(["a", [], "b", "c"]);
			});

			it("should not insert anything when an empty enumerable is passed", function () {
				var l = new arrgh.List("abc");
				l.insertRange(1, arrgh.Enumerable.empty());
				expect(l.toArray()).toEqual(["a", "b", "c"]);
			});

			it("should throw when the index is negative", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.insertRange(-1, [-2, -1, 0]);
				}).toThrow();
			});

			it("should throw when the index is greater than the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.insertRange(l.length + 1, [4]);
				}).toThrow();
			});
		});

		describe("remove", function () {
			it("should not alter the original array", function () {
				var l = new arrgh.List(people);
				l.remove(p1);
				expect(people).toEqual([p0, p1, p2, p3, p4, p5]);
			});

			it("should remove an item that's in the list", function () {
				var l = new arrgh.List(people);
				l.remove(p3);
				expect(l.toArray()).toEqual([p0, p1, p2, p4, p5]);
			});

			it("should remove only the first occurrence of an item in the list", function () {
				var l = new arrgh.List(1, 2, 3, 2, 4);
				l.remove(2);
				expect(l.toArray()).toEqual([1, 3, 2, 4]);
			});

			it("should not remove anything when the item is not in the list", function () {
				var l = new arrgh.List(people);
				l.remove("hello");
				expect(l.toArray()).toEqual(people);
			});

			it("should return true when an item was removed", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(l.remove(1)).toBe(true);
			});

			it("should return false when an item was not removed", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(l.remove(4)).toBe(false);
			});

			it("should descrease the length of the list when an item is removed", function () {
				var l = new arrgh.List(1, 2, 3);
				l.remove(1);
				expect(l.length).toBe(2);
			});

			it("should not descrease the length of the list when an item is not removed", function () {
				var l = new arrgh.List(1, 2, 3);
				l.remove(4);
				expect(l.length).toBe(3);
			});

			it("should remove undefined, null and NaN", function () {
				var l = new arrgh.List(undefined, null, NaN);
				l.remove(undefined);
				l.remove(null);
				l.remove(NaN);
				expect(l.toArray()).toEqual([]);
			});
		});

		describe("removeAll", function () {
			it("should not alter the original array", function () {
				var l = new arrgh.List(people);
				l.removeAll(function (p) {
					return p.first === "Bill";
				});
				expect(people).toEqual([p0, p1, p2, p3, p4, p5]);
			});

			it("should remove all even numbers", function () {
				var l = arrgh.Enumerable.range(1, 10).toList();
				l.removeAll(function (i) {
					return i % 2 === 1;
				});
				expect(l.toArray()).toEqual([2, 4, 6, 8, 10]);
			});

			it("should remove all Bills", function () {
				var l = new arrgh.List(people);
				l.removeAll(function (p) {
					return p.first === "Bill";
				});
				expect(l.toArray()).toEqual([p0, p3, p4]);
			});

			it("should not remove anything", function () {
				var l = new arrgh.List(people);
				l.removeAll(function (p) {
					return p.first === "Hello";
				});
				expect(l.toArray()).toEqual(people);
			});

			it("should return the count of removed items", function () {
				var l = new arrgh.List(people);
				expect(l.removeAll(function (p) {
					return p.first === "Bill";
				})).toBe(3);
			});

			it("should return 0 if not items were removed", function () {
				var l = new arrgh.List(people);
				expect(l.removeAll(function (p) {
					return p.first === "Hello";
				})).toBe(0);
			});

			it("should set the new length of the list", function () {
				var l = arrgh.Enumerable.range(1, 10).toList();
				l.removeAll(function (i) {
					return i % 2 === 1;
				});
				expect(l.length).toBe(5);
			});
		});

		describe("removeAt", function () {
			it("should not alter the original array", function () {
				var l = new arrgh.List(people);
				l.removeAt(0);
				expect(people).toEqual([p0, p1, p2, p3, p4, p5]);
			});

			it("should remove an item at the start of the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5);
				l.removeAt(0);
				expect(l.toArray()).toEqual([2, 3, 4, 5]);
			});

			it("should remove an item at the end of the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5);
				l.removeAt(l.length - 1);
				expect(l.toArray()).toEqual([1, 2, 3, 4]);
			});

			it("should remove an item at the middle of the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5);
				l.removeAt(2);
				expect(l.toArray()).toEqual([1, 2, 4, 5]);
			});

			it("should throw when the index is negative", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.removeAt(-1);
				}).toThrow();
			});

			it("should throw when the index is greater than the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.removeAt(4);
				}).toThrow();
			});

			it("should throw when the index is the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.removeAt(l.length);
				}).toThrow();
			});

			it("should throw when the list is empty", function () {
				var l = new arrgh.List();
				expect(function () {
					l.removeAt(0);
				}).toThrow();
			});

			it("should descrease the length of the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5);
				l.removeAt(2);
				expect(l.length).toEqual(4);
			});
		});

		describe("removeRange", function () {
			it("should not alter the original array", function () {
				var l = new arrgh.List(people);
				l.removeRange(1, 2);
				expect(people).toEqual([p0, p1, p2, p3, p4, p5]);
			});

			it("should remove a range at the start of the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5, 6);
				l.removeRange(0, 3);
				expect(l.toArray()).toEqual([4, 5, 6]);
			});

			it("should remove a range at the end of the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5, 6);
				l.removeRange(3, 3);
				expect(l.toArray()).toEqual([1, 2, 3]);
			});

			it("should remove a range at the middle of the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5, 6);
				l.removeRange(2, 2);
				expect(l.toArray()).toEqual([1, 2, 5, 6]);
			});

			it("should not remove anything when count is zero", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5, 6);
				l.removeRange(2, 0);
				expect(l.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
			});

			it("should remove the last item", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5, 6);
				l.removeRange(5, 1);
				expect(l.toArray()).toEqual([1, 2, 3, 4, 5]);
			});

			it("should throw when the index is negative", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.removeRange(-1, 1);
				}).toThrow();
			});

			it("should throw when the index is greater than the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.removeRange(4, 1);
				}).toThrow();
			});

			it("should throw when the index is the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.removeRange(l.length, 1);
				}).toThrow();
			});

			it("should throw when the list is empty", function () {
				var l = new arrgh.List();
				expect(function () {
					l.removeRange(0, 1);
				}).toThrow();
			});

			it("should throw when count is negative", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.removeRange(0, -1);
				}).toThrow();
			});

			it("should throw when the range exceeds the number of items in the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5, 6);
				expect(function () {
					l.removeRange(4, 3);
				}).toThrow();
			});

			it("should not throw when the list is empty, but the index and count are zero", function () {
				var l = new arrgh.List();
				l.removeRange(0, 0);
				expect(l.toArray()).toEqual([]);
			});

			it("should set the new length", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5, 6);
				l.removeRange(2, 3);
				expect(l.length).toBe(3);
			});

			it("should not set length when count is zero", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5, 6);
				l.removeRange(2, 0);
				expect(l.length).toBe(6);
			});
		});

		describe("set", function () {
			it("should not alter the original array", function () {
				var l = new arrgh.List(people);
				l.set(1, "");
				expect(people).toEqual([p0, p1, p2, p3, p4, p5]);
			});

			it("should set an item at an index", function () {
				var l = new arrgh.List("Hello");
				l.set(2, "e");
				expect(l.toArray().join("")).toBe("Heelo");
			});

			it("should not change the length", function () {
				var l = new arrgh.List("Hello");
				l.set(2, "e");
				expect(l.length).toBe(5);
			});

			it("should set the first item", function () {
				var l = new arrgh.List(people);
				l.set(0, "e");
				expect(l.toArray()).toEqual(["e", p1, p2, p3, p4, p5]);
			});

			it("should set the last item", function () {
				var l = new arrgh.List(people);
				l.set(l.length - 1, "e");
				expect(l.toArray()).toEqual([p0, p1, p2, p3, p4, "e"]);
			});

			it("should throw when the index is negative", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.set(-1, 1);
				}).toThrow();
			});

			it("should throw when the index is greater than the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.set(4, 1);
				}).toThrow();
			});

			it("should throw when the index is the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.set(l.length, 1);
				}).toThrow();
			});

			it("should throw when the list is empty", function () {
				var l = new arrgh.List();
				expect(function () {
					l.set(0, 1);
				}).toThrow();
			});
		});

		describe("sort", function () {
			it("should sort the entire list", function () {
				var l = new arrgh.List(4, 1, 2, 5, 3);
				l.sort();
				expect(l.toArray()).toEqual([1, 2, 3, 4, 5]);
			});

			it("should sort the list from an index", function () {
				var l = new arrgh.List(4, 1, 2, 5, 3, 7, 9, 6, 8);
				l.sort(4);
				expect(l.toArray()).toEqual([4, 1, 2, 5, 3, 6, 7, 8, 9]);
			});

			it("should sort a subset of the list", function () {
				var l = new arrgh.List(4, 1, 2, 5, 3, 7, 9, 6, 8);
				l.sort(1, 4);
				expect(l.toArray()).toEqual([4, 1, 2, 3, 5, 7, 9, 6, 8]);
			});

			it("should do nothing if count is zero or one", function () {
				var l = new arrgh.List(4, 1, 2, 5, 3, 7, 9, 6, 8);
				l.sort(0, 0);
				l.sort(0, 1);
				expect(l.toArray()).toEqual([4, 1, 2, 5, 3, 7, 9, 6, 8]);
			});

			it("should sort the entire list based on a comparer", function () {
				var l = new arrgh.List(people);
				l.sort(firstNameComparer);
				expect(l.toArray()).toEqual([p3, p1, p2, p5, p0, p4]);
			});

			it("should sort the list from an index based on a comparer", function () {
				var l = new arrgh.List(people);
				l.sort(3, firstNameComparer);
				expect(l.toArray()).toEqual([p0, p1, p2, p3, p5, p4]);
			});

			it("should sort a subset of the list based on a comparer", function () {
				var l = new arrgh.List(people);
				l.sort(1, 3, firstNameComparer);
				expect(l.toArray()).toEqual([p0, p3, p1, p2, p4, p5]);
			});

			it("should not throw on an empty list", function () {
				var l = new arrgh.List();
				l.sort();
				expect(l.toArray()).toEqual([]);
			});

			it("should throw when the index is negative", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.sort(-1, 1);
				}).toThrow();
			});

			it("should throw when the index is greater than the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.sort(4, 1);
				}).toThrow();
			});

			it("should throw when the index is the length of the list", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.sort(l.length, 1);
				}).toThrow();
			});

			it("should throw when the list is empty", function () {
				var l = new arrgh.List();
				expect(function () {
					l.sort(0, 1);
				}).toThrow();
			});

			it("should throw when count is negative", function () {
				var l = new arrgh.List(1, 2, 3);
				expect(function () {
					l.sort(0, -1);
				}).toThrow();
			});

			it("should throw when the range exceeds the number of items in the list", function () {
				var l = new arrgh.List(1, 2, 3, 4, 5, 6);
				expect(function () {
					l.sort(4, 3);
				}).toThrow();
			});

			it("should not throw when the list is empty, but the index and count are zero", function () {
				var l = new arrgh.List();
				l.sort(0, 0);
				expect(l.toArray()).toEqual([]);
			});
		});

		testOverridden(arrgh.List, function () {
			return new arrgh.List();
		});
	});
};