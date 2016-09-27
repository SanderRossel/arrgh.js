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

var p6 = {
	first: "Steve",
	last: "Jobs"
};

var p7 = {
	first: "Steve",
	last: "McQueen",
	age: 88
};

var people = [p0, p1, p2, p3, p4, p5];

var fullNameSelector = function (p) {
	return p.first + (p.last ? " " + p.last : "");
};

var firstNameSelector = function (p) {
	return p.first;
};

var firstCharEqComparer = {
	getHash: function (obj) {
		return obj[0];
	},
	equals: function (a, b) {
		return a[0] === b[0];
	}
};

(function () {
	"use strict";
	describe("arrgh.js tests", function () {
		testIterators();
		testList();
		testDictionary();
		testEnumerable();
		testEnumerableJoins();
		testEnumerableOrderings();
		testEnumerableUnions();
	});
}());