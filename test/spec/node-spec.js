/* exported arrgh, p0, p1, p2, p3, p4, p5, p6, p7, people,
   fullNameSelector, firstNameSelector, hobbiesSelector,
   firstNameEqComparer, firstCharEqComparer, firstNameComparer,
   MAX_SAFE_INTEGER
*/

var p0 = {
	first: "Sander",
	last: "Rossel",
	age: 28,
	hobbies: ["Programming" ,"Gaming" ,"Music"]
};

var p1 = {
	first: "Bill",
	last: "Murray",
	age: 58,
	hobbies: ["Hiking", "Travelling"]
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
	age: 68,
	hobbies: []
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

var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

var fullNameSelector = function (p) {
	return p.first + (p.last ? " " + p.last : "");
};

var firstNameSelector = function (p) {
	return p.first;
};

var hobbiesSelector = function (p) {
	return p.hobbies;
};

var firstNameEqComparer = {
	getHash: function (obj) {
		return obj.first;
	},
	equals: function (a, b) {
		return a.first === b.first;
	}
};

var firstCharEqComparer = {
	getHash: function (obj) {
		return obj[0];
	},
	equals: function (a, b) {
		return a[0] === b[0];
	}
};

var firstNameComparer = function (x, y) {
	if (x.first < y.first) {
		return -1;
	} else if (x.first > y.first) {
		return 1;
	} else {
		return 0;
	}
};

var arrgh = require('../../src/arrgh.js');
/* jshint ignore:start */
var fs = require('fs');
eval(fs.readFileSync('./test/spec/test-Enumerable_overridden.js','utf-8'));
eval(fs.readFileSync('./test/spec/test-Iterators.js','utf-8'));
eval(fs.readFileSync('./test/spec/test-Enumerable.js','utf-8'));
eval(fs.readFileSync('./test/spec/test-Enumerable_unions.js','utf-8'));
eval(fs.readFileSync('./test/spec/test-Enumerable_joins.js','utf-8'));
eval(fs.readFileSync('./test/spec/test-Enumerable_orderings.js','utf-8'));
eval(fs.readFileSync('./test/spec/test-Enumerable_toSomethings.js','utf-8'));
eval(fs.readFileSync('./test/spec/test-Enumerable_statics.js','utf-8'));
eval(fs.readFileSync('./test/spec/test-List.js','utf-8'));
eval(fs.readFileSync('./test/spec/test-Dictionary.js','utf-8'));
/* jshint ignore:end */

(function () {
	"use strict";
	describe("arrgh.js tests", function () {
		testIterators();
		testEnumerable();
		testEnumerableUnions();
		testEnumerableJoins();
		testEnumerableOrderings();
		testEnumerableToSomethings();
		testEnumerableStatics();
		testList();
		testDictionary();
	});
}());