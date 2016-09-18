(function () {
	"use strict";

	describe("Dictionary", function () {
		describe("add", function () {
			describe("add some string keys with elements", function () {
				it("should add the items as key-value pairs and loop over them", function () {
					var d = new arrgh.Dictionary();
					d.add(p0.first, p0);
					d.add(p1.first, p1);
					var arr = [];
					d.forEach(function (pair, index) {
						arr.push(pair.key, pair.value, index);
					});
					expect(d.get(p0.first)).toEqual(p0);
					expect(d.get(p1.first)).toEqual(p1);
					expect(arr).toEqual([p0.first, p0, 0, p1.first, p1, 1]);
					expect(d.length).toEqual(2);
				});
			});

			describe("add some function keys with elements", function () {
				it("should add the items as key-value pairs and loop over them", function () {
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
					expect(d.get(f1)).toEqual(f1);
					expect(d.get(f2)).toEqual(f2);
					expect(arr).toEqual([f1, f1, 0, f2, f2, 1]);
					expect(d.length).toEqual(2);
				});
			});

			describe("add some object keys with custom toString", function () {
				it("should add the keys", function () {
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
					expect(d.get(o1)).toEqual("Hello");
					expect(d.get(o2)).toEqual("Goodbye");
					expect(d.length).toEqual(2);
				});
			});
		});
	});
}());