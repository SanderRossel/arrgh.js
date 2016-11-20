var testOverridden = function (ctor, empty) {
	describe("ctors", function () {
		it("should construct from an array", function () {
			var e = new ctor([1, 2, 3, 4, 5]);
			expect(e.toArray()).toEqual([1, 2, 3, 4, 5]);
		});

		it("should construct from some random objects", function () {
			var o = {};
			var e = new ctor("Hello", true, 1, o);
			expect(e.toArray()).toEqual(["Hello", true, 1, o]);
		});

		it("should construct from another Enumerable", function () {
			var e1 = new arrgh.Enumerable([1, 2, 3, 4, 5]);
			var e2 = new ctor(e1);
			expect(e2.toArray()).toEqual([1, 2, 3, 4, 5]);
		});

		it("should construct from a string", function () {
			var e = new ctor("Hello");
			expect(e.toArray()).toEqual(["H", "e", "l", "l", "o"]);
		});

		it("should throw on an invalid argument", function () {
			expect(function () {
				new ctor(true);
			}).toThrow();
		});
	});

	describe("asEnumerable", function () {
		it("should return a new enumerable", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.asEnumerable()).not.toBe(e);
		});

		it("should be of type Enumerable", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.asEnumerable() instanceof arrgh.Enumerable).toBe(true);
		});

		it("should contain the same elements as the original enumerable", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.asEnumerable().toArray()).toEqual([1, 2, 3, 4, 5]);
		});
	});

	describe("count", function () {
		describe("with an empty enumerable", function () {
			it("should always returns 0", function () {
				expect(empty().count()).toBe(0);
			});
			it("should always return 0 even when a predicate is defined", function () {
				expect(empty().count(function () {
					return true;
				})).toBe(0);
			});
		});

		it("should return the number of elements when no predicate is defined", function () {
			var e = new ctor(people);
			expect(e.count()).toBe(6);
		});

		it("should return the number of matching elements when some elements match the predicate", function () {
			var e = new ctor(people);
			expect(e.count(function (elem) {
				return elem.first === "Bill";
			})).toBe(3);
		});

		it("should return 0 when no element match the predicate", function () {
			var e = new ctor(people);
			expect(e.count(function (elem) {
				return elem.first === "nope";
			})).toBe(0);
		});
	});

	describe("elementAt", function () {
		it("should return the element at the 0th position", function () {
			var e = new ctor(people);
			expect(e.elementAt(0)).toBe(p0);
		});

		it("should return the elements at the 2nd position", function () {
			var e = new ctor(people);
			expect(e.elementAt(2)).toBe(p2);
		});

		it("should return the element at the last position", function () {
			var e = new ctor(people);
			expect(e.elementAt(e.count() - 1)).toBe(p5);
		});

		it("should throw when the index is negative", function () {
			var e = new ctor(people);
			expect(function () {
				e.elementAt(-1);
			}).toThrow();
		});

		it("should throw when the index is greater than the number of elements -1", function () {
			var e = new ctor(people);
			expect(function () {
				e.elementAt(6);
			}).toThrow();
		});

		it("should not throw in the edge case the inner (implementation) default is the same as an element", function () {
			var e = new ctor([{}]);
			expect(e.elementAt(0)).toEqual({});
		});
	});

	describe("elementAtOrDefault", function () {
		it("should return the element at the 0th position", function () {
			var e = new ctor(people);
			expect(e.elementAtOrDefault(0, "Hello")).toBe(p0);
		});

		it("should return the element at the 2nd position", function () {
			var e = new ctor(people);
			expect(e.elementAtOrDefault(2, "Hello")).toBe(p2);
		});

		it("should return the element at the last position", function () {
			var e = new ctor(people);
			expect(e.elementAtOrDefault(e.count() - 1, "Hello")).toBe(p5);
		});

		it("should return undefined when the index is negative and no default value is supplied", function () {
			var e = new ctor(people);
			expect(e.elementAtOrDefault(-1)).toBe(undefined);
		});

		it("should return undefined when the index is out of bounds and no default value is supplied", function () {
			var e = new ctor(people);
			expect(e.elementAtOrDefault(10)).toBe(undefined);
		});

		it("should return the default value when the index is negative and a default value is supplied", function () {
			var e = new ctor(people);
			expect(e.elementAtOrDefault(-1, "Hello")).toBe("Hello");
		});

		it("should return the default value when the index is positive and out of bounds and a default value is supplied", function () {
			var e = new ctor(people);
			expect(e.elementAtOrDefault(10, "Bye")).toBe("Bye");
		});
	});

	describe("indexOf", function () {
		it("should return -1 if the element is not found", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.indexOf(6)).toBe(-1);
		});

		it("should return -1 if the fromIndex is greater than the length of the collection", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.indexOf(5, 5)).toBe(-1);
		});

		it("should return the index of the element if the fromIndex starts at the index of that element", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.indexOf(5, 4)).toBe(4);
		});

		it("should return -1 if the fromIndex is greater than the index of the element", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.indexOf(1, 1)).toBe(-1);
		});

		it("should return the index of the first element", function () {
			var e = new ctor(1, 2, 3, 1, 4, 5);
			expect(e.indexOf(1)).toBe(0);
		});

		it("should return the index of the found element", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.indexOf(3)).toBe(2);
		});

		it("should return the index of the found element after the fromIndex", function () {
			var e = new ctor(1, 2, 3, 4, 5, 3);
			expect(e.indexOf(3, 3)).toBe(5);
		});

		it("should return the first index of NaN", function () {
			var e = new ctor(1, NaN, 3, NaN, 5, 3);
			expect(e.indexOf(NaN)).toBe(1);
		});
	});

	describe("last", function () {
		it("should throw when the collection is empty", function () {
			expect(function () {
				empty().last();
			}).toThrow();
		});

		it("should throw when a predicate is specified, but the collection is empty", function () {
			expect(function () {
				empty().last(function (elem) {
					return elem === 1;
				});
			}).toThrow();
		});

		it("should throw when the collection is not empty, but no element matches the predicate", function () {
			expect(function () {
				new ctor(1, 2, 3, 4).last(function (n) {
					return n === 5;
				});
			}).toThrow();
		});

		it("should return the last element if no predicate is defined", function () {
			expect(new ctor(1, 2, 3, 4).last()).toBe(4);
		});

		it("should return the last element that matches the predicate", function () {
			expect(new ctor(people).last(function (p) {
				return p.first === "Bill";
			})).toBe(p5);
		});

		it("should return the last element that matches the predicate, even when it's not the last in the collection", function () {
			expect(new ctor(people).last(function (p) {
				return p.first === "Steve";
			})).toBe(p4);
		});
	});

	describe("lastIndexOf", function () {
		it("should return -1 if the element is not found", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.lastIndexOf(6)).toBe(-1);
		});

		it("should return -1 if the fromIndex is greater than the length of the collection", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.lastIndexOf(5, 5)).toBe(-1);
		});

		it("should return the index of the element if the fromIndex starts at the index of that element", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.lastIndexOf(5, 4)).toBe(4);
		});

		it("should return -1 if the fromIndex is greater than the index of the element", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.lastIndexOf(1, 1)).toBe(-1);
		});

		it("should return the index of the last element", function () {
			var e = new ctor(1, 2, 3, 1, 4, 5);
			expect(e.lastIndexOf(1)).toBe(3);
		});

		it("should return the index of the found element", function () {
			var e = new ctor(1, 2, 3, 4, 5);
			expect(e.lastIndexOf(3)).toBe(2);
		});

		it("should return the index of the found element after the fromIndex", function () {
			var e = new ctor(1, 2, 3, 4, 5, 3);
			expect(e.lastIndexOf(3, 3)).toBe(5);
		});

		it("should return the last index of NaN", function () {
			var e = new ctor(1, NaN, 3, NaN, 5, 3);
			expect(e.lastIndexOf(NaN)).toBe(3);
		});
	});

	describe("lastOrDefault", function () {
		it("should return undefined when the collection is empty and no default is specified", function () {
			expect(empty().lastOrDefault()).toBe(undefined);
		});

		it("should return undefined when the collection is not empty, but no element matches the predicate", function () {
			expect(new ctor(1, 2, 3, 4).lastOrDefault(function (n) {
				return n === 5;
			})).toBe(undefined);
		});

		it("should return the last element if no predicate is defined", function () {
			expect(new ctor(1, 2, 3, 4).lastOrDefault()).toBe(4);
		});

		it("should return the last element that matches the predicate", function () {
			expect(new ctor(people).lastOrDefault(function (p) {
				return p.first === "Bill";
			})).toBe(p5);
		});

		it("should return the last element that matches the predicate, even when it's not the last in the collection", function () {
			expect(new ctor(people).lastOrDefault(function (p) {
				return p.first === "Steve";
			})).toBe(p4);
		});

		it("should return the default when a default is defined and the collection is empty", function () {
			expect(empty().lastOrDefault(p0)).toBe(p0);
		});

		it("should return the default when a default is defined and no element matches the predicate", function () {
			expect(new ctor(people).lastOrDefault(function () {
				return false;
			}, p7)).toBe(p7);
		});
	});

	describe("toArray", function () {
		it("should convert back to the original array", function () {
			var arr = new ctor(people).toArray();
			expect(arr).toEqual(people);
		});

		it("should convert back to an empty array", function () {
			var arr = empty().toArray();
			expect(arr).toEqual([]);
		});

		it("should convert back to a string array", function () {
			var arr = new ctor("Hello").toArray();
			expect(arr).toEqual(["H", "e", "l", "l", "o"]);
		});

		it("should convert back to a string", function () {
			var arr = new ctor("Hello").toArray().join("");
			expect(arr).toBe("Hello");
		});
	});
};