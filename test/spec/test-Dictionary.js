var testDictionary = function () {
	"use strict";

	describe("Dictionary", function () {
		describe("add", function () {
			describe("without an equality comparer", function () {
				it("should add and get a key", function () {
					var d = new arrgh.Dictionary();
					d.add("a");
					expect(d.get("a")).toBe(undefined);
				});

				it("should add strings and people as key-value pairs", function () {
					var d = new arrgh.Dictionary();
					d.add(p0.first, p0);
					d.add(p1.first, p1);
					var arr = [];
					d.forEach(function (pair, index) {
						arr.push(pair.key, pair.value, index);
					});
					expect(d.get(p0.first)).toBe(p0);
					expect(d.get(p1.first)).toBe(p1);
					expect(arr).toEqual([p0.first, p0, 0, p1.first, p1, 1]);
					expect(d.length).toBe(2);
				});

				it("should add functions as key-value pairs", function () {
					var d = new arrgh.Dictionary();

					var f1 = function () {
						return "a";
					};
					var f2 = function () {
						return "b";
					};
					d.add(f1, f1);
					d.add(f2, f2);
					var arr = [];
					d.forEach(function (pair, index) {
						arr.push(pair.key, pair.value, index);
					});
					expect(d.get(f1)).toBe(f1);
					expect(d.get(f2)).toBe(f2);
					expect(arr).toEqual([f1, f1, 0, f2, f2, 1]);
					expect(d.length).toBe(2);
				});

				it("should add regular objects as key-value pairs", function () {
					var d = new arrgh.Dictionary();
					var o1 = {
						name: "Sander"
					};
					var o2 = {
						name: "Bill"
					};
					d.add(o1, o1);
					d.add(o2, o2);
					expect(d.get(o1)).toBe(o1);
					expect(d.get(o2)).toBe(o2);
					expect(d.length).toBe(2);
				});

				it("should add objects with overridden toString methods as key-value pairs", function () {
					var d = new arrgh.Dictionary();

					var o1 = {
						toString: function () {
							return "Hi";
						}
					};
					var o2 = {
						toString: function () {
							return "Bye";
						}
					};

					d.add(o1, "Hello");
					d.add(o2, "Goodbye");
					expect(d.get(o1)).toBe("Hello");
					expect(d.get(o2)).toBe("Goodbye");
					expect(d.length).toBe(2);
				});

				it("should throw when an item with the same key is already added", function () {
					var d = new arrgh.Dictionary();
					d.add(p1.first, p1);
					expect(function () {
						d.add(p2.first, p2);
					}).toThrow();
				});
			});

			describe("with an equality comparer", function () {
				it("should add strings and people as key-value pairs", function () {
					var d = new arrgh.Dictionary({
						getHash: function (obj) {
							return obj.first;
						},
						equals: function (a, b) {
							return a.first === b.first;
						}
					});
					d.add(p0, p0);
					d.add(p1, p1);
					var arr = [];
					d.forEach(function (pair, index) {
						arr.push(pair.key, pair.value, index);
					});
					expect(d.get(p0)).toBe(p0);
					expect(d.get(p1)).toBe(p1);
					expect(arr).toEqual([p0, p0, 0, p1, p1, 1]);
					expect(d.length).toBe(2);
				});

				it("should ignore overridden toString methods and use the comparers getHash instead", function () {
					var d = new arrgh.Dictionary({
						getHash: function (obj) {
							return obj.toString()[0];
						}
					});

					var o1 = {
						toString: function () {
							return "Hi";
						}
					};
					var o2 = {
						toString: function () {
							return "Bye";
						}
					};

					d.add(o1, "Hello");
					d.add(o2, "Goodbye");
					expect(d.get(o1)).toBe("Hello");
					expect(d.get(o2)).toBe("Goodbye");
					expect(d.length).toBe(2);
				});

				it("should throw when an item that compares to a key that is already added", function () {
					var d = new arrgh.Dictionary({
						getHash: function (obj) {
							return obj.first[0];
						},
						equals: function (a, b) {
							return a.first[0] === b.first[0];
						}
					});
					d.add(p0, p0);
					expect(function () {
						d.add(p4, p4);
					}).toThrow();
				});
			});
		});

		describe("containsKey", function () {
			describe("without an equality comparer", function () {
				it("should contain the simple string key", function () {
					var d = new arrgh.Dictionary();
					d.add("Hello");
					expect(d.containsKey("Hello")).toBe(true);
				});

				it("should contain the complex object key", function () {
					var d = new arrgh.Dictionary();
					var key = {};
					d.add(key);
					expect(d.containsKey(key)).toBe(true);
					expect(d.containsKey({})).toBe(false);
				});

				it("should contain the custom toString key", function () {
					var d = new arrgh.Dictionary();

					var o1 = {
						toString: function () {
							return "Hi";
						}
					};
					d.add(o1);
					expect(d.containsKey(o1)).toBe(true);
					expect(d.containsKey("Hi")).toBe(false);
					expect(d.containsKey("[object Object]")).toBe(false);
				});

				it("should contain the custom getHash key", function () {
					var d = new arrgh.Dictionary();

					var o1 = {
						toString: function () {
							return "Bye";
						},
						getHash: function () {
							return "Hi";
						}
					};
					d.add(o1);
					expect(d.containsKey(o1)).toBe(true);
					expect(d.containsKey("Hi")).toBe(false);
					expect(d.containsKey("Bye")).toBe(false);
				});

				it("should work with undefined, null and NaN", function () {
					var d = new arrgh.Dictionary();
					d.add(undefined, "a");
					d.add(null, "b");
					d.add(NaN, "c");
					var o = {};
					o.toString = undefined;
					d.add(o, "d");
					expect(d.get(undefined)).toBe("a");
					expect(d.get(null)).toBe("b");
					expect(d.get(NaN)).toBe("c");
					expect(d.get(o)).toBe("d");
				});
			});

			describe("with an equality comparer", function () {
				it("should work with a weird default comparer", function () {
					var d = new arrgh.Dictionary({
						equals: function (a, b) {
							return a === b;
						}
					});
					d.add(p0);
					expect(d.containsKey(p0)).toBe(true);
				});

				it("should contain the simple string key", function () {
					var usedHash = false;
					var d = new arrgh.Dictionary({
						getHash: function (obj) {
							usedHash = true;
							return obj[0];
						}
					});
					d.add("Hello");
					expect(usedHash).toBe(true);
					expect(d.containsKey("Hello")).toBe(true);
					expect(d.containsKey("H")).toBe(false);
				});

				it("should contain the custom toString key", function () {
					var usedHash = false;
					var usedToString = false;
					var d = new arrgh.Dictionary({
						getHash: function () {
							usedHash = true;
							return "Hello";
						}
					});

					var o1 = {
						toString: function () {
							usedToString = true;
							return "Hi";
						}
					};
					d.add(o1);
					expect(usedHash).toBe(true);
					expect(usedToString).toBe(false);
					expect(d.containsKey(o1)).toBe(true);
					expect(d.containsKey("Hi")).toBe(false);
					expect(d.containsKey("Hello")).toBe(false);
					expect(d.containsKey("[object Object]")).toBe(false);
				});

				it("should contain the custom getHash key", function () {
					var usedHash = false;
					var usedToString = false;
					var d = new arrgh.Dictionary({
						getHash: function () {
							usedHash = true;
							return "Hello";
						}
					});

					var o1 = {
						toString: function () {
							usedToString = true;
							return "Bye";
						},
						getHash: function () {
							usedToString = true;
							return "Hi";
						}
					};
					d.add(o1);
					expect(usedHash).toBe(true);
					expect(usedToString).toBe(false);
					expect(d.containsKey(o1)).toBe(true);
					expect(d.containsKey("Hi")).toBe(false);
					expect(d.containsKey("Bye")).toBe(false);
				});
			});
		});

		describe("remove", function () {
			describe("without an equality comparer", function () {
				it("should remove the item", function () {
					var d = new arrgh.Dictionary();
					d.add(p0.first, p0);
					d.add(p1.first, p1);
					expect(d.remove(p0.first)).toBe(true);
					expect(d.remove("Hi")).toBe(false);
					expect(d.containsKey(p0.first)).toBe(false);
					expect(d.containsKey(p1.first)).toBe(true);
					expect(d.length).toBe(1);
				});

				it("should remove the item, but not the hash clash", function () {
					var d = new arrgh.Dictionary();
					d.add(p1, p1);
					d.add(p2, p2);
					expect(d.remove(p1)).toBe(true);
					expect(d.containsKey(p1)).toBe(false);
					expect(d.containsKey(p2)).toBe(true);
					expect(d.get(p2)).toBe(p2);
					expect(d.length).toBe(1);
				});
			});

			describe("with an equality comparer", function () {
				it("should remove the item", function () {
					var d = new arrgh.Dictionary({
						getHash: function (obj) {
							return obj.first;
						}
					});
					d.add(p0.first, p0);
					d.add(p1.first, p1);
					expect(d.remove(p0.first)).toBe(true);
					expect(d.remove("Hi")).toBe(false);
					expect(d.containsKey(p0.first)).toBe(false);
					expect(d.containsKey(p1.first)).toBe(true);
					expect(d.length).toBe(1);
				});

				it("should remove the item, but not the hash clash", function () {
					var d = new arrgh.Dictionary({
						getHash: function (obj) {
							return obj.first;
						}
					});
					d.add(p1, p1);
					d.add(p2, p2);
					expect(d.remove(p1)).toBe(true);
					expect(d.containsKey(p1)).toBe(false);
					expect(d.containsKey(p2)).toBe(true);
					expect(d.get(p2)).toBe(p2);
					expect(d.length).toBe(1);
				});
			});
		});

		describe("count", function () {
			var d = new arrgh.Dictionary();
			d.add(p0, p0);
			d.add(p1, p1);
			d.add(p2, p2);
			d.add(p3, p3);
			d.add(p4, p4);
			d.add(p5, p5);

			describe("with an empty enumerable", function () {
				it("should always returns 0", function () {
					expect(new arrgh.Dictionary().count()).toBe(0);
				});
				it("should always return 0 even when a predicate is defined", function () {
					expect(new arrgh.Dictionary().count(function () {
						return true;
					})).toBe(0);
				});
			});

			it("should return the number of elements when no predicate is defined", function () {
				expect(d.count()).toBe(6);
			});

			it("should return the number of matching elements when some elements match the predicate", function () {
				expect(d.count(function (pair) {
					return pair.value.first === "Bill";
				})).toBe(3);
			});

			it("should return 0 when no element match the predicate", function () {
				expect(d.count(function (pair) {
					return pair.value.first === "nope";
				})).toBe(0);
			});
		});
	});
};