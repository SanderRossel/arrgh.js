# arrgh.js
<b>Argh!</b><br />
<i>exclamation</i><br />
&nbsp;&nbsp;&nbsp;&nbsp;Expression of frusration or anger.<br />
&nbsp;&nbsp;&nbsp;&nbsp;"Argh! That JavaScript is driving me crazy!"</pre><br /><br />

<b>Array</b><br />
<i>noun</i><br />
&nbsp;&nbsp;&nbsp;&nbsp;A high-level, list-like object.<br />
&nbsp;&nbsp;&nbsp;&nbsp;"The server call returns an array of objects."<br /><br />

arrgh.js was born from the utter frustration of working with arrays in JavaScript.<br />
What kind of collection is a list, queue and stack all in one, but does nothing right?<br />
What kind of collection does not have a simple "contains" function?<br />
What kind of collection does not even have a simple "remove" method!?<br />
And what kind of collection works slightly different on each browser?<br />
That's right, the JavaScript array!<br /><br />
arrgh.js takes all this frustration out of JavaScript arrays and gives you the tools you'd expect from proper collections.<br />
arrgh.js is based on the collection types of .NET and gives you all functionality provided by LINQ to Objects.<br />
And it all starts with arrgh, the namespace containing all collection types.<br /><br />
arrgh.js is lightweight and easy to use.<br />

Simply add a reference to the arrgh.js source file and you're ready to go!<br /><br />

Works in older browsers as well (e.g. IE8).<br /><br />

Here are a few examples to get you started.

<pre>
// Creates an Enumerable from an Array and sorts the results.
var arr = [3, 1, 5, 2, 4];
var e = new arrgh.Enumerable(arr);
var sortedArr = e.orderBy(x => x).toArray();
// Use this for older browsers.
//var sortedArr = e.orderBy(function (x) {
//    return x;
//});
console.log(sortedArr); // logs '[1, 2, 3, 4, 5]'
</pre>

<pre>
// Creates an Enumerable from a string and checks if a character is present.
var name = "Sander";
var e = new arrgh.Enumerable(name);
var b = e.contains("d");
console.log(b); // logs 'true'
</pre>

<pre>
// Creates a List, adds an element, removes an element and then projects the elements to create a new collection of people.
var names = new arrgh.List("Sander", "Bill", "Steve", "Sergey", "Larry");
names.add("Satya");
names.remove("Larry");
var people = names.select(n => {
    return {
        firstName: n
    };
}).toArray();
console.log(people); // logs all the names as objects.
</pre>