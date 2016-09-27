var testEnumerableJoins = function () {
    "use strict";

    describe("joins", function () {
        describe("groupBy", function () {
            it("should group by key", function () {
                var arr = [];
                var e = new arrgh.Enumerable(people);
                e.groupBy(firstNameSelector).forEach(function (group) {
                    arr.push(group.key);
                    arr.push.apply(arr, group.toArray());
                });
                expect(arr).toEqual(["Sander", p0, "Bill", p1, p2, p5, "Bailey", p3, "Steve", p4]);
            });

            it("should group by key and use an element selector", function () {
                var arr = [];
                var e = new arrgh.Enumerable(people);
                e.groupBy(firstNameSelector, fullNameSelector).forEach(function (group) {
                    arr.push(group.key);
                    arr.push.apply(arr, group.toArray());
                });
                expect(arr).toEqual(["Sander", "Sander Rossel", "Bill", "Bill Murray", "Bill Gates", "Bill Clinton", "Bailey", "Bailey", "Steve", "Steve McQueen"]);
            });

            it("should group by key, use an element selector and project to a custom result", function () {
                var arr = [];
                var e = new arrgh.Enumerable(people);
                e.groupBy(firstNameSelector, fullNameSelector, function (key, p) {
                    return { key: key, count: p.count() };
                }).forEach(function (elem) {
                    arr.push(elem.key);
                    arr.push(elem.count);
                });
                expect(arr).toEqual(["Sander", 1, "Bill", 3, "Bailey", 1, "Steve", 1]);
            });

            it("should group by key, use an element selector, project to a custom result and use the equality comparer", function () {
                var arr = [];
                var e = new arrgh.Enumerable(people);
                e.groupBy(firstNameSelector, fullNameSelector, function (key, p) {
                    return { key: key, count: p.count() };
                }, firstCharEqComparer).forEach(function (elem) {
                    arr.push(elem.key);
                    arr.push(elem.count);
                });
                expect(arr).toEqual(["Sander", 2, "Bill", 4]);
            });

            it("should group by key, use an element selector and use the equality comparer", function () {
                var arr = [];
                var e = new arrgh.Enumerable(people);
                e.groupBy(firstNameSelector, fullNameSelector, firstCharEqComparer).forEach(function (group) {
                    arr.push(group.key);
                    arr.push.apply(arr, group.toArray());
                });
                expect(arr).toEqual(["Sander", "Sander Rossel", "Steve McQueen", "Bill", "Bill Murray", "Bill Gates", "Bailey", "Bill Clinton"]);
            });

            it("should group by key, project to a custom result and use the equality comparer", function () {
                var arr = [];
                var e = new arrgh.Enumerable(people);
                e.groupBy(firstNameSelector, function (key, p) {
                    return { key: key, count: p.count() };
                }, firstCharEqComparer).forEach(function (elem) {
                    arr.push(elem.key);
                    arr.push(elem.count);
                });
                expect(arr).toEqual(["Sander", 2, "Bill", 4]);
            });

            it("should group by key and use the equality comparer", function () {
                var arr = [];
                var e = new arrgh.Enumerable(people);
                e.groupBy(firstNameSelector, firstCharEqComparer).forEach(function (group) {
                    arr.push(group.key);
                    arr.push.apply(arr, group.toArray());
                });
                expect(arr).toEqual(["Sander", p0, p4, "Bill", p1, p2, p3, p5]);
            });

            it("should group by key and project to a custom result", function () {
                var arr = [];
                var e = new arrgh.Enumerable(people);
                e.groupBy(firstNameSelector, function (key, p) {
                    return { key: key, count: p.count() };
                }).forEach(function (elem) {
                    arr.push(elem.key);
                    arr.push(elem.count);
                });
                expect(arr).toEqual(["Sander", 1, "Bill", 3, "Bailey", 1, "Steve", 1]);
            });
        });

        describe("groupJoin", function () {
            it("should match people with people with the same name", function () {
                var e = new arrgh.Enumerable(people);
                var inner = new arrgh.Enumerable(people);
                var joined = e.groupJoin(inner, firstNameSelector, firstNameSelector, function (p, ppl) {
                    return { key: p, values: ppl.toArray() };
                });
                expect(joined.toArray()).toEqual([{
                    key: p0,
                    values: [p0]
                }, {
                    key: p1,
                    values: [p1, p2, p5]
                }, {
                    key: p2,
                    values: [p1, p2, p5]
                }, {
                    key: p3,
                    values: [p3]
                }, {
                    key: p4,
                    values: [p4]
                }, {
                    key: p5,
                    values: [p1, p2, p5]
                }]);
            });

            it("should match people with people with the same name first letter based on a comparer", function () {
                var e = new arrgh.Enumerable(people);
                var inner = new arrgh.Enumerable(people);
                var joined = e.groupJoin(inner, firstNameSelector, firstNameSelector, function (p, ppl) {
                    return { key: p, values: ppl.toArray() };
                }, firstCharEqComparer);
                expect(joined.toArray()).toEqual([{
                    key: p0,
                    values: [p0, p4]
                }, {
                    key: p1,
                    values: [p1, p2, p3, p5]
                }, {
                    key: p2,
                    values: [p1, p2, p3, p5]
                }, {
                    key: p3,
                    values: [p1, p2, p3, p5]
                }, {
                    key: p4,
                    values: [p0, p4]
                }, {
                    key: p5,
                    values: [p1, p2, p3, p5]
                }]);
            });
        });

        describe("join", function () {
        	it("should join on full name", function () {
        		var e = new arrgh.Enumerable(people);
        		var inner = new arrgh.Enumerable(people);
        		var joined = e.join(inner, fullNameSelector, fullNameSelector, function (p1, p2) {
        			return { p1: p1, p2: p2 };
        		});
        		expect(joined.toArray()).toEqual([{
        			p1: p0,
        			p2: p0
        		}, {
        			p1: p1,
        			p2: p1
        		}, {
        			p1: p2,
        			p2: p2
        		}, {
        			p1: p3,
        			p2: p3
        		}, {
        			p1: p4,
        			p2: p4
        		}, {
        			p1: p5,
        			p2: p5
        		}]);
        	});

        	it("should join on first name", function () {
				var e = new arrgh.Enumerable(people);
        		var inner = new arrgh.Enumerable(people);
        		var joined = e.join(inner, firstNameSelector, firstNameSelector, function (p1, p2) {
        			return { p1: p1, p2: p2 };
        		});
        		expect(joined.toArray()).toEqual([{
        			p1: p0,
        			p2: p0
        		}, {
        			p1: p1,
        			p2: p1
        		}, {
        			p1: p1,
        			p2: p2
        		}, {
        			p1: p1,
        			p2: p5
        		}, {
        			p1: p2,
        			p2: p1
        		}, {
        			p1: p2,
        			p2: p2
        		}, {
        			p1: p2,
        			p2: p5
        		}, {
        			p1: p3,
        			p2: p3
        		}, {
        			p1: p4,
        			p2: p4
        		}, {
        			p1: p5,
        			p2: p1
        		}, {
        			p1: p5,
        			p2: p2
        		}, {
        			p1: p5,
        			p2: p5
        		}]);
        	});

        	it("should join on first letter of first name using an equality comparer", function () {
				var e = new arrgh.Enumerable(people);
        		var inner = new arrgh.Enumerable(people);
        		var joined = e.join(inner, firstNameSelector, firstNameSelector, function (p1, p2) {
        			return { p1: p1, p2: p2 };
        		}, firstCharEqComparer);
        		expect(joined.toArray()).toEqual([{
        			p1: p0,
        			p2: p0
        		}, {
        			p1: p0,
        			p2: p4
        		}, {
        			p1: p1,
        			p2: p1
        		}, {
        			p1: p1,
        			p2: p2
        		}, {
        			p1: p1,
        			p2: p3
        		}, {
        			p1: p1,
        			p2: p5
        		}, {
        			p1: p2,
        			p2: p1
        		}, {
        			p1: p2,
        			p2: p2
        		}, {
        			p1: p2,
        			p2: p3
        		}, {
        			p1: p2,
        			p2: p5
        		}, {
        			p1: p3,
        			p2: p1
        		}, {
        			p1: p3,
        			p2: p2
        		}, {
        			p1: p3,
        			p2: p3
        		}, {
        			p1: p3,
        			p2: p5
        		}, {
        			p1: p4,
        			p2: p0
        		}, {
        			p1: p4,
        			p2: p4
        		}, {
        			p1: p5,
        			p2: p1
        		}, {
        			p1: p5,
        			p2: p2
        		}, {
        			p1: p5,
        			p2: p3
        		}, {
        			p1: p5,
        			p2: p5
        		}]);
        	});
        });
    });
};