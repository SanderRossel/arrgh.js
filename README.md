# arrgh.js - Bringing LINQ to JavaScript
**Argh!**<br />
*exclamation*<br />
&nbsp;&nbsp;&nbsp;&nbsp;Expression of frusration or anger.<br />
&nbsp;&nbsp;&nbsp;&nbsp;"Argh! That JavaScript is driving me crazy!"

**Array**<br />
*noun*<br />
&nbsp;&nbsp;&nbsp;&nbsp;A high-level, list-like object.<br />
&nbsp;&nbsp;&nbsp;&nbsp;"The server call returns an array of objects."

arrgh.js was born from the utter frustration of working with arrays in JavaScript.<br />
What kind of collection is a list, queue and stack all in one, but does nothing right?<br />
What kind of collection does not have a simple "contains" function?<br />
What kind of collection does not even have a simple "remove" method!?<br />
And what kind of collection works slightly different on each browser?<br />
That's right, the JavaScript array!

arrgh.js takes all this frustration out of JavaScript arrays and gives you the functionality you'd expect from proper collections.<br />
arrgh.js is based on the collection types of .NET and gives you all the functionality provided by LINQ to Objects.

arrgh.js is **lightweight**, **thoroughly tested** and **easy to use**.

Install using [npm](https://www.npmjs.com/package/arrgh):

	npm install arrgh

Install using [NuGet](https://www.nuget.org/packages/arrgh.js/):

	Install-Package arrgh.js

Simply add a reference to the arrgh.js source file and you're ready to go!

Here are a few **examples** to get you started.

~~~~
// Creates an Enumerable from an Array and sorts the results.
var arr = [3, 1, 5, 2, 4];
var e = new arrgh.Enumerable(arr);
var sortedArr = e.orderBy(x => x).toArray();
// Use this for older browsers.
//var sortedArr = e.orderBy(function (x) {
//    return x;
//});
console.log(sortedArr); // logs '[1, 2, 3, 4, 5]'
~~~~

~~~~
// Creates an Enumerable from a string and checks if a character is present.
var name = "Sander";
var e = new arrgh.Enumerable(name);
var b = e.contains("d");
console.log(b); // logs 'true'
~~~~

~~~~
// Creates a List, adds an element, removes an element and then projects the elements to create a new collection of people.
var names = new arrgh.List("Sander", "Bill", "Steve", "Sergey", "Larry");
names.add("Satya");
names.remove("Larry");
var people = names.select(n => {
    return {
        firstName: n
    };
}).toArray();
console.log(people); // logs [{ firstName: "Sander"}, { firstName: "Bill" }, ...].
~~~~
<a href="https://sanderrossel.github.io/arrgh.js/" target="_blank">Full documentation</a><br />
<a href="https://www.codeproject.com/Articles/1157838/Arrgh-js-Bringing-LINQ-to-JavaScript" target="_blank">How arrgh.js was made</a><br />
<a href="https://github.com/SanderRossel/arrgh.js" target="_blank">GitHub</a>

---
Release notes:

0.9.2
+ Fixed Dictionary implementation.

0.9.1
+ Initial version.

---
MIT License
Copyright (c) 2016 Sander Rossel

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.