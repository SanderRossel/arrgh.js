var testDictionary = function () {
	"use strict";

	describe("Dictionary", function () {
		describe("add", function () {
			it("should add just a key", function () {
				var d = new arrgh.Dictionary();
				d.add("key");
				expect(d.toArray()).toEqual([{ key: "key", value: undefined }]);
			});

			it("should add an item with a key", function () {
				var d = new arrgh.Dictionary();
				d.add("key", "value");
				expect(d.toArray()).toEqual([{ key: "key", value: "value" }]);
			});

			it("should add a key that's an object", function () {
				var d = new arrgh.Dictionary();
				d.add(p0, p0.first);
				expect(d.toArray()).toEqual([{ key: p0, value: p0.first }]);
			});

			it("should add multiple keys with conflicting hashes", function () {
				var d = new arrgh.Dictionary();
				d.add(p0, p0.first);
				d.add(p1, p1.first);
				expect(d.toArray()).toEqual([{ key: p0, value: p0.first }, { key: p1, value: p1.first }]);
			});

			it("should add keys using an equality comparer", function () {
				var d = new arrgh.Dictionary(firstNameEqComparer);
				d.add(p0, "p0");
				d.add(p1, "p1");
				expect(d.toArray()).toEqual([{ key: p0, value: "p0" }, { key: p1, value: "p1" }]);
			});

			it("should add undefined, null and NaN as keys", function () {
				var d = new arrgh.Dictionary();
				d.add(undefined, "undef");
				d.add(null, "NULL");
				d.add(NaN, "nAn");
				expect(d.toArray()).toEqual([{ key: undefined, value: "undef" }, { key: null, value: "NULL" }, { key: NaN, value: "nAn" }]);
			});

			it("should throw when a string key is already present", function () {
				var d = new arrgh.Dictionary();
				d.add("a");
				expect(function () {
					d.add("a");
				}).toThrow();
			});

			it("should throw when key undefined is already present", function () {
				var d = new arrgh.Dictionary();
				d.add(undefined);
				expect(function () {
					d.add(undefined);
				}).toThrow();
			});

			it("should throw when key null is already present", function () {
				var d = new arrgh.Dictionary();
				d.add(null);
				expect(function () {
					d.add(null);
				}).toThrow();
			});

			it("should throw when key NaN is already present", function () {
				var d = new arrgh.Dictionary();
				d.add(NaN);
				expect(function () {
					d.add(NaN);
				}).toThrow();
			});

			it("should throw when an object key is already present", function () {
				var d = new arrgh.Dictionary();
				d.add(p0);
				expect(function () {
					d.add(p0);
				}).toThrow();
			});

			it("should throw when two objects that are not the same are the same according to an equality comparer", function () {
				var d = new arrgh.Dictionary(firstNameEqComparer);
				d.add(p1);
				expect(function () {
					d.add(p2);
				}).toThrow();
			});

			it("should add two objects using the overridden toString method", function () {
				var d = new arrgh.Dictionary();
				var o1 = {
					toString: function () {
						return "o1";
					}
				};
				var o2 = {
					toString: function () {
						return "o2";
					}
				};
				d.add(o1, p1);
				d.add(o2, p2);
				expect(d.toArray()).toEqual([{ key: o1, value: p1 }, { key: o2, value: p2 }]);
			});

			it("should throw if two objects return the same toString", function () {
				var d = new arrgh.Dictionary(firstNameEqComparer);
				var o1 = {
					name: "o1",
					toString: function () {
						return "object";
					}
				};
				var o2 = {
					name: "o2",
					toString: function () {
						return "object";
					}
				};
				d.add(o1);
				expect(function () {
					d.add(o2, p2);
				}).toThrow();
			});

			it("should add two objects using the overridden getHash method", function () {
				var d = new arrgh.Dictionary();
				var o1 = {
					getHash: function () {
						return "o1";
					}
				};
				var o2 = {
					getHash: function () {
						return "o2";
					}
				};
				d.add(o1, p1);
				d.add(o2, p2);
				expect(d.toArray()).toEqual([{ key: o1, value: p1 }, { key: o2, value: p2 }]);
			});

			it("should throw if two objects return the same getHash", function () {
				var d = new arrgh.Dictionary(firstNameEqComparer);
				var o1 = {
					name: "o1",
					getHash: function () {
						return "object";
					}
				};
				var o2 = {
					name: "o2",
					getHash: function () {
						return "object";
					}
				};
				d.add(o1);
				expect(function () {
					d.add(o2, p2);
				}).toThrow();
			});

			it("should increase the length when an item is added to the dictionary", function () {
				var d = new arrgh.Dictionary();
				d.add("key");
				expect(d.length).toEqual(1);
			});

			it("should not increase the length when a key is added twice", function () {
				var d = new arrgh.Dictionary();
				d.add("key");
				try {
					d.add("key");
				} catch (ex) { }
				expect(d.length).toEqual(1);
			});

			it("should add two different items without a comparer and without a toString method", function () {
				var d = new arrgh.Dictionary();
				var k1 = {
					value: p1,
					toString: undefined
				};
				var k2 = {
					value: p2,
					toString: undefined
				};
				d.add(k1);
				d.add(k2);
				expect(d.toArray()).toEqual([{ key: k1, value: undefined }, { key: k2, value: undefined }]);
			});

			it("should add using an incomplete equality comparer", function () {
				var d = new arrgh.Dictionary({
					getHash: function (obj) {
						return obj.first[0];
					}
				});
				d.add(p1);
				d.add(p2);
				expect(d.toArray()).toEqual([{ key: p1, value: undefined }, { key: p2, value: undefined }]);
			});

			it("should get weird using an incomplete equality comparer", function () {
				var d = new arrgh.Dictionary({
					equals: function () {
						return false;
					}
				});
				d.add(p1);
				d.add(p1);
				expect(d.toArray()).toEqual([{ key: p1, value: undefined }, { key: p1, value: undefined }]);
			});
		});

describe("clear", function () {
	it("should clear the Dictionary", function () {
		var d = new arrgh.Dictionary();
		d.add("a");
		d.add("b")
		d.clear();
		expect(d.toArray()).toEqual([]);
	});

	it("should set length to 0", function () {
		var d = new arrgh.Dictionary();
		d.add("a");
		d.add("b")
		d.clear();
		expect(d.length).toBe(0);
	});
});

describe("containsKey", function () {
	it("should contain a simple string key", function () {
		var d = new arrgh.Dictionary();
		d.add("Hello");
		expect(d.containsKey("Hello")).toBe(true);
	});

	it("should contain an object key", function () {
		var d = new arrgh.Dictionary();
		d.add(p0);
		expect(d.containsKey(p0)).toBe(true);
	});

	it("should not contain other object keys", function () {
		var d = new arrgh.Dictionary();
		d.add(p0);
		expect(d.containsKey(p1)).toBe(false);
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
	});

	it("should not contain the value of the custom toString key", function () {
		var d = new arrgh.Dictionary();

		var o1 = {
			toString: function () {
				return "Hi";
			}
		};
		d.add(o1);
		expect(d.containsKey("Hi")).toBe(false);
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
	});

	it("should contain undefined", function () {
		var d = new arrgh.Dictionary();
		d.add(undefined);
		expect(d.containsKey(undefined)).toBe(true);
	});

	it("should contain null", function () {
		var d = new arrgh.Dictionary();
		d.add(null);
		expect(d.containsKey(null)).toBe(true);
	});

	it("should not mistake undefined for null", function () {
		var d = new arrgh.Dictionary();
		d.add(null);
		expect(d.containsKey(undefined)).toBe(false);
	});

	it("should contain NaN", function () {
		var d = new arrgh.Dictionary();
		d.add(NaN);
		expect(d.containsKey(NaN)).toBe(true);
	});

	it("should work with an equality comparer", function () {
		var d = new arrgh.Dictionary(firstNameEqComparer);
		d.add(p0);
		expect(d.containsKey(p0)).toBe(true);
	});

	it("should work with an equality comparer and different objects with the same key", function () {
		var d = new arrgh.Dictionary(firstNameEqComparer);
		d.add(p1);
		expect(d.containsKey(p2)).toBe(true);
	});

	it("should not actually contain the hash of the equality comparer", function () {
		var d = new arrgh.Dictionary(firstNameEqComparer);
		d.add(p1);
		expect(d.containsKey(p1.first)).toBe(false);
	});
});

describe("containsValue", function () {
	it("should contain the value when it's added", function () {
		var d = new arrgh.Dictionary();
		d.add("key", "value");
		expect(d.containsValue("value")).toBe(true);
	});

	it("should contain the value when it's added twice", function () {
		var d = new arrgh.Dictionary();
		d.add("key", "value");
		d.add("secondKey", "value");
		expect(d.containsValue("value")).toBe(true);
	});

	it("should not contain the value when it's not added", function () {
		var d = new arrgh.Dictionary();
		d.add("key", "value");
		expect(d.containsValue("key")).toBe(false);
	});

	it("should contain the value undefined", function () {
		var d = new arrgh.Dictionary();
		d.add("key", undefined);
		expect(d.containsValue(undefined)).toBe(true);
	});

	it("should contain the value null", function () {
		var d = new arrgh.Dictionary();
		d.add("key", null);
		expect(d.containsValue(null)).toBe(true);
	});

	it("should not mistake null for undefined", function () {
		var d = new arrgh.Dictionary();
		d.add("key", null);
		expect(d.containsValue(undefined)).toBe(false);
	});

	it("should contain the value NaN", function () {
		var d = new arrgh.Dictionary();
		d.add("key", NaN);
		expect(d.containsValue(NaN)).toBe(true);
	});

	it("should not contain a value even when the overridden toString matches that of a value", function () {
		var d = new arrgh.Dictionary();
		d.add("key", {
			value: p0,
			toString: function () {
				return "Hello";
			}
		});
		expect(d.containsValue({
			value: p2,
			toString: function () {
				return "Hello";
			}
		})).toBe(false);
	});

	it("should not contain a value even when the custom getHash matches that of a value", function () {
		var d = new arrgh.Dictionary();
		d.add("key", {
			value: p0,
			getHash: function () {
				return "Hello";
			}
		});
		expect(d.containsValue({
			value: p2,
			getHash: function () {
				return "Hello";
			}
		})).toBe(false);
	});

	it("should not contain the value even when an equality comparer should think them equal", function () {
		var d = new arrgh.Dictionary(firstNameEqComparer);
		d.add("key", p1);
		expect(d.containsValue(p2)).toBe(false);
	});
});

describe("get", function () {
	it("should get an item at a key after adding it", function () {
		var d = new arrgh.Dictionary();
		d.add("key", "value");
		expect(d.get("key")).toBe("value");
	});

	it("should get an item at a key that's not the same, but matches the equality comparer", function () {
		var d = new arrgh.Dictionary(firstNameEqComparer);
		d.add(p1, "value");
		expect(d.get(p2)).toBe("value");
	});

	it("should throw when the key is not present", function () {
		var d = new arrgh.Dictionary();
		expect(function () {
			d.get("some key");
		}).toThrow();
	});

	it("should not mistake undefined for null", function () {
		var d = new arrgh.Dictionary();
		d.add(undefined);
		expect(function () {
			d.get(null);
		}).toThrow();
	});

	it("should get the value of undefined", function () {
		var d = new arrgh.Dictionary();
		d.add(undefined, "value");
		expect(d.get(undefined)).toBe("value");
	});

	it("should get the value of null", function () {
		var d = new arrgh.Dictionary();
		d.add(null, "value");
		expect(d.get(null)).toBe("value");
	});

	it("should get the value of NaN", function () {
		var d = new arrgh.Dictionary();
		d.add(NaN, "value");
		expect(d.get(NaN)).toBe("value");
	});

	it("should get the correct value with multiple keys", function () {
		var d = new arrgh.Dictionary();
		d.add(p0, "p0");
		d.add(p1, "p1");
		d.add(p2, "p2");
		expect(d.get(p1)).toBe("p1");
	});
});

describe("getKeys", function () {
	it("should return all keys in an array", function () {
		var d = new arrgh.Dictionary();
		d.add(p0, "value");
		d.add(p1);
		d.add("some key", "some value");
		d.add([], 123);
		expect(d.getKeys()).toEqual([p0, p1, "some key", []]);
	});

	it("should return an empty array when no keys are present", function () {
		var d = new arrgh.Dictionary();
		expect(d.getKeys()).toEqual([]);
	});

	it("should return all keys in an array when an equality comparer was specified", function () {
		var d = new arrgh.Dictionary(firstNameEqComparer);
		d.add(p0, "value");
		d.add(p1);
		d.add({ first: "some key" }, "some value");
		expect(d.getKeys()).toEqual([p0, p1, { first: "some key" }]);
	});
});

describe("getValues", function () {
	it("should return all values in an array", function () {
		var d = new arrgh.Dictionary();
		d.add(p0, "value");
		d.add(p1);
		d.add("some key", "some value");
		d.add([], 123);
		expect(d.getValues()).toEqual(["value", undefined, "some value", 123]);
	});

	it("should return an empty array when no values (and keys) are present", function () {
		var d = new arrgh.Dictionary();
		expect(d.getKeys()).toEqual([]);
	});

	it("should return all values in an array when an equality comparer was specified", function () {
		var d = new arrgh.Dictionary(firstNameEqComparer);
		d.add(p0, "value");
		d.add(p1, []);
		d.add(p3, p3)
		d.add({ first: "some key" }, "some value");
		expect(d.getValues()).toEqual(["value", [], p3, "some value"]);
	});
});

describe("remove", function () {
	it("should remove an item", function () {
		var d = new arrgh.Dictionary();
		d.add("key", "value");
		d.remove("key");
		expect(d.toArray()).toEqual([]);
	});

	it("should only remove a single item", function () {
		var d = new arrgh.Dictionary();
		d.add("key", "value");
		d.add("another key", "another value");
		d.remove("key");
		expect(d.toArray()).toEqual([{ key: "another key", value: "another value" }]);
	});

	it("should remove the correct item when keys are objects", function () {
		var d = new arrgh.Dictionary();
		var k1 = {};
		var k2 = {};
		d.add(k1, "k1");
		d.add(k2, "k2");
		d.remove(k2);
		expect(d.toArray()).toEqual([{ key: k1, value: "k1" }]);
	});

	it("should remove an item when the equality comparer equals it", function () {
		var d = new arrgh.Dictionary(firstNameEqComparer);
		d.add(p1, "p1");
		d.remove(p2);
		expect(d.toArray()).toEqual([]);
	});

	it("should not remove an item when the equality comparer doesn't equal it", function () {
		var d = new arrgh.Dictionary(firstNameEqComparer);
		d.add(p0, "p0");
		d.remove(p1);
		expect(d.toArray()).toEqual([{ key: p0, value: "p0" }]);
	});

	it("should return true when an item is removed", function () {
		var d = new arrgh.Dictionary();
		d.add(p0);
		expect(d.remove(p0)).toBe(true);
	});

	it("should return false when an item is not found", function () {
		var d = new arrgh.Dictionary();
		d.add(p1);
		expect(d.remove(p2)).toBe(false);
	});

	it("should decrement the length when an item is successfully removed", function () {
		var d = new arrgh.Dictionary();
		d.add(p0);
		d.add(p1);
		d.add(p2);
		d.remove(p1);
		expect(d.length).toBe(2);
	});

	it("should not decrement the length when a key is not found", function () {
		var d = new arrgh.Dictionary();
		d.add(p0);
		d.add(p1);
		d.add(p2);
		d.remove(p3);
		expect(d.length).toBe(3);
	});
});

describe("tryGet", function () {
		it("should get an item at a key after adding it", function () {
		var d = new arrgh.Dictionary();
		d.add("key", "value");
		expect(d.tryGet("key")).toEqual({ success: true, value: "value" });
	});

	it("should get an item at a key that's not the same, but matches the equality comparer", function () {
		var d = new arrgh.Dictionary(firstNameEqComparer);
		d.add(p1, "value");
		expect(d.tryGet(p2)).toEqual({ success: true, value: "value" });
	});

	it("should not throw when the key is not present, but return success false", function () {
		var d = new arrgh.Dictionary();
		expect(d.tryGet("some key")).toEqual({ success: false, value: undefined });
	});

	it("should not mistake undefined for null", function () {
		var d = new arrgh.Dictionary();
		d.add(undefined);
		expect(d.tryGet(null)).toEqual({ success: false, value: undefined });
	});

	it("should get the value of undefined", function () {
		var d = new arrgh.Dictionary();
		d.add(undefined, "value");
		expect(d.tryGet(undefined)).toEqual({ success: true, value: "value" });
	});

	it("should get the value of null", function () {
		var d = new arrgh.Dictionary();
		d.add(null, "value");
		expect(d.tryGet(null)).toEqual({ success: true, value: "value" });
	});

	it("should get the value of NaN", function () {
		var d = new arrgh.Dictionary();
		d.add(NaN, "value");
		expect(d.tryGet(NaN)).toEqual({ success: true, value: "value" });
	});

	it("should get the correct value with multiple keys", function () {
		var d = new arrgh.Dictionary();
		d.add(p0, p0);
		d.add(p1, p1);
		d.add(p2, p2);
		expect(d.tryGet(p1)).toEqual({ success: true, value: p1 });
	});
});

	describe("count", function () {
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
			var d = new arrgh.Dictionary();
			d.add(1);
			d.add(2);
			d.add(3);
			d.add(4);
			d.add(5);
			d.add(6);
			expect(d.count()).toBe(6);
		});

		it("should return the number of matching elements when some elements match the predicate", function () {
			var d = new arrgh.Dictionary();
			d.add(p0, p0);
			d.add(p1, p1);
			d.add(p2, p2);
			d.add(p3, p3);
			d.add(p4, p4);
			d.add(p5, p5);
			expect(d.count(function (elem) {
				return elem.value.first === "Bill";
			})).toBe(3);
		});

		it("should return 0 when no element match the predicate", function () {
			var d = new arrgh.Dictionary();
			d.add(p0, p0);
			d.add(p1, p1);
			d.add(p2, p2);
			d.add(p3, p3);
			d.add(p4, p4);
			d.add(p5, p5);
			expect(d.count(function (elem) {
				return elem.first === "nope";
			})).toBe(0);
		});
	});
});
};