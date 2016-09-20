(function () {
	"use strict";

	var test = function (enumerable) {
		it("should return undefined when not moved", function () {
			var iterator = enumerable.getIterator();
			expect(iterator.current()).toBe(undefined);
		});

		it("should not return undefined when moveNext is true", function () {
			var iterator = enumerable.getIterator();
			var i = 0;
			for (i; i < 1000; i += 1) {
				var moved = iterator.moveNext();
				if (moved) {
					expect(iterator.current()).not.toBe(undefined);
				}
			}
		});

		it("should return undefined when moveNext is false", function () {
			var iterator = enumerable.getIterator();
			var i = 0;
			for (i; i < 1000; i += 1) {
				var moved = iterator.moveNext();
				if (!moved) {
					expect(iterator.current()).toBe(undefined);
				}
			}
		});
	};

	describe("Iterators", function () {
		describe("- ArrayIterator", function () {
			describe("for an Enumerable", function () {
				test(new arrgh.Enumerable(1, 2, 3, 4, 5));
			});

			describe("for a List", function () {
				var list = new arrgh.List(1, 2, 3, 4, 5);
				test(list);

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
			});
		});
	});
}());