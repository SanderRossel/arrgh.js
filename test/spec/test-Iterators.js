(function () {
	"use strict";

	var test = function (enumerable, getEmptyEnumerable) {
		if (getEmptyEnumerable) {
			it("current should return undefined when it's empty", function () {
				var iterator = getEmptyEnumerable(arrgh.Enumerable.empty()).getIterator();
				expect(iterator.current()).toBe(undefined);
			});

			it("moveNext should remove false when it's empty", function () {
				var iterator = getEmptyEnumerable(arrgh.Enumerable.empty()).getIterator();
				expect(iterator.moveNext()).toBe(false);
			});
		}

		it("current should return undefined when not moved", function () {
			var iterator = enumerable.getIterator();
			expect(iterator.current()).toBe(undefined);
		});

		it("should not return undefined when moveNext is true", function () {
			var iterator = enumerable.getIterator();
			var i = 0;
			for (i; i < 1000; i += 1) {
				var moved = iterator.moveNext();
				if (moved) {
					var current = iterator.current();
					expect(current).not.toBe(undefined);
					if (current === undefined) {
						break;
					}
				}
			}
		});

		it("should return undefined when moveNext is false", function () {
			var iterator = enumerable.getIterator();
			var i = 0;
			for (i; i < 1000; i += 1) {
				var moved = iterator.moveNext();
				if (!moved) {
					var current = iterator.current();
					expect(current).toBe(undefined);
					if (current !== undefined) {
						break;
					}
				}
			}
		});
	};

	var testList = function (list) {
		it("should throw if an item is added after getting the iterator, but before actual enumeration", function () {
			var iterator = list.getIterator();
			list.add(6);
			expect(function () {
				iterator.moveNext();
			}).toThrow();
		});

		it("should throw if an item is added during enumeration", function () {
			var iterator = list.getIterator();
			iterator.moveNext();
			list.remove(6);
			expect(function () {
				iterator.moveNext();
			}).toThrow();
		});
	};

	describe("Iterators", function () {
		describe("- ArrayIterator", function () {
			describe("for an Enumerable", function () {
				test(new arrgh.Enumerable(1, 2, 3, 4, 5), function (e) {
					return e;
				});
			});

			describe("for a List", function () {
				var list = new arrgh.List(1, 2, 3, 4, 5);
				test(list, function (e) {
					return new arrgh.List();
				});
				testList(list);
			});
		});

		describe("- DictionaryIterator", function () {
			var d = new arrgh.Dictionary();
			d.add(1, 1);
			d.add(2, 2);
			d.add(3, 3);
			d.add(4, 4);
			d.add(5, 5);
			test(d, function () {
				return new arrgh.Dictionary();
			});
			testList(d);
		});

		describe("- WhereIterator", function () {
			test(new arrgh.Enumerable(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).where(function (n) {
				return n % 2 == 1;
			}), function (e) {
				return e.where(function () {
					return false;
				});
			});
		});

		describe("- SelectIterator", function () {
			test(new arrgh.Enumerable(1, 2, 3, 4, 5).select(function (n) {
				return n;
			}), function (e) {
				return e.select(function () {
					return {};
				});
			});
		});

		describe("- DefaultIfEmptyIterator", function () {
			// DefaultIfEmpty is a little weird because it can never be empty.
			var enumerable = new arrgh.Enumerable(1, 2, 3, 4, 5);
			test(enumerable.defaultIfEmpty());

			var empty = arrgh.Enumerable.empty().defaultIfEmpty();
			it("moveNext should return true once, even when empty", function () {
				var iterator = empty.getIterator();
				expect(iterator.moveNext()).toBe(true);
				expect(iterator.moveNext()).toBe(false);
			});
		});

		describe("- OrderedIterator", function () {
			test(new arrgh.Enumerable(3, 2, 4, 5, 1).orderBy(function (elem) {
				return elem;
			}), function (e) {
				return e.orderBy(function (elem) {
					return elem;
				});
			});
		});

		describe("- UnionIterator", function () {
			test(new arrgh.Enumerable(1, 2, 3).union(new arrgh.Enumerable(1, 2)), function (e) {
				return e.union(arrgh.Enumerable.empty());
			});
		});

		describe("- ExceptIterator", function () {
			test(new arrgh.Enumerable(1, 2, 3, 4, 4, 5, 6, 7).except(new arrgh.Enumerable(6, 7)), function (e) {
				return e.except(arrgh.Enumerable.empty());
			});
		});
	});
}());