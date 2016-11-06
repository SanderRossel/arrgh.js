/**
 * @license
 * MIT License
 * Copyright (c) 2016 Sander Rossel
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * Contains all collection classes used by arrgh.js.
 * @namespace arrgh
 */
var arrgh = (function () {
    "use strict";

    /**
     * An accumulator function.
     *
     * @callback accumulator
     * @param {*} aggregate - The current aggregate.
     * @param {*} element - An item that should be aggregated to the aggregate.
     * @returns {*} - Returns the new aggregate.
     */

    /**
     * A function that is applied to each element in an enumerable.
     *
     * @callback forEachCallback
     * @param {*} element - The current element in the for loop.
     * @param {Number} index - The index of the current element.
     * @returns {bool} - Return false (or falsey, but not null or undefined) to jump out of the loop early.
     */

    /**
     * A function to test each element for a condition.
     *
     * @callback predicate
     * @param {*} element - The element to test for a condition.
     * @returns {Boolean} - Returns whether the current element satisfies the condition.
     */

    /**
     * A function to test each element for a condition.
     *
     * @callback indexPredicate
     * @param {*} element - The element to test for a condition.
     * @param {Number} [index] - The index of the current element.
     * @returns {Boolean} - Returns whether the current element satisfies the condition.
     */

    /**
     * A function that projects an element into a new form.
     *
     * @callback selector
     * @param {*} element - The element to project into a new form.
     * @returns {*} - A projection of the current element.
     */

    /**
     * A function that projects an element into a new form.
     *
     * @callback indexSelector
     * @param {*} element - The element to project into a new form.
     * @param {Number} [index] - The index of the current element.
     * @returns {*} - A projection of the current element.
     */

    /**
     * A function that projects an element into a collection.
     *
     * @callback collectionSelector
     * @param {*} element - The element to project into a collection.
     * @param {Number} [index] - The index of the current element.
     * @returns {Array|String|arrgh.Enumerable} - A collection obtained from the current element.
     */

    /**
     * A function that returns the key value from an element.
     *
     * @callback keySelector
     * @param {*} element - The element from which to select a key.
     * @returns {*} - The value of the key for the current element.
     */

    /**
     * A function that tests if an object is smaller than, greater than or equal to another object.
     * @callback compare
     * @param {*} x - The element to compare to another element.
     * @param {*} y - The element to compare to.
     * @returns {Number} - Returns a negative value if the first object is smaller, a positive value if the first object is greater and 0 if both objects are equal.
     */

    /**
     * A function that tests if two elements are equal.
     * @callback equals
     * @param {*} x - The element to test for equality.
     * @param {*} y - The element to test on.
     * @returns {Boolean} - Return whether the elements are equal.
     */

    /**
     * A function that creates a result value from a group of elements.
     * @callback groupByResultSelector
     * @param {*} key - The key that groups the elements.
     * @param {grouping} group - The elements in the group.
     * @returns {*} - Returns a result value from a group of elements.
     */

    /**
     * A function that creates a result value from a group of elements.
     * @callback groupJoinResultSelector
     * @param {*} element - The element that is joined.
     * @param {grouping} group - The elements that are joined with the element.
     * @returns {*} - Returns a result value from a group of elements.
     */

    /**
     * A function that creates a result value from two elements.
     * @callback joinResultSelector
     * @param {*} outer - The element that is joined.
     * @param {*} inner - The element that is joined with the outer element.
     * @returns {*} - Returns a result value from two matched elements.
     */

    /**
     * A function that creates a result value from each element in the intermediate collection.
     * @callback selectManyResultSelector
     * @param {*} element - The element whose collection is processed.
     * @param {*} intermediate - The current element of the intermediate collection.
     * @returns {*} - Returns a result value from an intermediate element.
     */

    /**
     * A function that creates a result value from two elements.
     * @callback zipResultSelector
     * @param {*} sourceElement - An element from the source collection.
     * @param {*} otherElement - An element from the other collection.
     * @returns {*} - Returns a result value from two elements.
     */

    /**
     * Returns a hash code for the specified object.
     * @callback getHash
     * @param {*} obj - The object for which a hash code is to be returned.
     * @returns {String} - A hash code for the specified object.
     */

    /**
     * Defines methods to support the comparison of objects for equality.
     * @name equalityComparer
     * @type {Object}
     * @property {equals} [equals=(===)] - A function that tests if two elements are equal.
     * @property {getHash} [getHash=getHash() || toString()] - A function that computes an element's hash code.
     */

    /**
     * A collection of objects that share a common key.
     * @name grouping
     * @type {arrgh.Enumerable}
     * @property {*} key - The key that the elements have in common.
     */

    var Temp = function () {
        // This will shut up JSLint :-)
        // Minify will remove 'return' so no precious bytes are lost.
        return;
    };

    function inherit(inheritor, inherited) {
        Temp.prototype = inherited.prototype;
        inheritor.prototype = new Temp();
        Temp.prototype = null;
        inheritor.prototype.constructor = inheritor;
    }

    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

    function isArray(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    }

    function isNull(obj) {
        return obj === undefined || obj === null;
    }

    function isActualNaN (obj) {
        return obj !== obj;
    }

    function alwaysTrue() {
        return true;
    }

    function identity(x) {
        return x;
    }

    function defaultCompare(x, y) {
        if (isNull(x) || isNull(y)) {
            // Treat undefined as smaller than null
            // and both as smaller than anything else.
            var noVal = function (a, b, val) {
                if (a === b) {
                    return 0;
                }
                if (a === val && b !== val) {
                    return -1;
                }
                if (a !== val && b === val) {
                    return 1;
                }
            };
            var eq = noVal(x, y, undefined);

            if (eq === undefined) {
                return noVal(x, y, null);
            }
            return eq;
        }

        // Treat NaN as smaller than anything else
        // except undefined and null.
        if (isActualNaN(x) && isActualNaN(y)) {
            return 0;
        }
        if (isActualNaN(x)) {
            return -1;
        }
        if (isActualNaN(y)) {
            return 1;
        }

        if (x > y) {
            return 1;
        }
        if (x < y) {
            return -1;
        }
        return 0;
    }

    var defaultEqComparer = {
        equals: function (x, y) {
            return x === y || (isActualNaN(x) && isActualNaN(y)); // NaN edge case.
        },
        getHash: function (obj) {
            var hash;
            if (obj === null) {
                hash = "null";
            } else if (obj === undefined) {
                hash = "undefined";
            } else if (isActualNaN(obj)) {
                hash = "NaN";
            } else {
                hash = typeof obj.getHash === "function" ?
                obj.getHash() :
                typeof obj.toString === "function" ? obj.toString() : Object.prototype.toString.call(obj);
            }
            return hash;
        }
    };

    function ensureEqComparer(eqComparer) {
        if (!eqComparer || eqComparer === defaultEqComparer) {
            return defaultEqComparer;
        }
        if (eqComparer.equals && eqComparer.getHash) {
            return eqComparer;
        }

        var fullEqComparer;
        if (typeof eqComparer === "function") {
            fullEqComparer = {
                equals: eqComparer,
                getHash: defaultEqComparer.getHash
            };
        } else {
            fullEqComparer = {
                equals: eqComparer.equals || defaultEqComparer.equals,
                getHash: eqComparer.getHash || defaultEqComparer.getHash
            };
        }
        return fullEqComparer;
    }

    function findElem(collection, predicate, xOrDefault) {
        if (!collection.any()) {
            throw new Error("Collection contains no elements.");
        }
        var def = {},
            elem = xOrDefault(predicate, def);
        if (elem === def) {
            throw new Error("Collection contains no matching element.");
        }
        return elem;
    }

    function findOrDefault(collection, onFound, predicate, defaultValue) {
        var temp = predicate;
        predicate = typeof predicate === "function" ? predicate : undefined;
        defaultValue = predicate ? defaultValue : temp;
        if (collection.any()) {
            var context = {
                found: false,
                elem: undefined
            };
            collection.forEach(function (elem) {
                if (predicate) {
                    if (predicate(elem)) {
                        return onFound(context, elem);
                    }
                } else {
                    return onFound(context, elem);
                }
            });
            if (!context.found) {
                return defaultValue;
            }
            return context.elem;
        }
        return defaultValue;
    }

    function sumCount(collection, selector, calculator) {
        selector = selector || identity;
        var sum = 0,
            count = 0;
        collection.forEach(function (elem) {
            sum += +selector(elem);
            count += 1;
        });

        if (count === 0) {
            throw new Error("Collection contains no elements.");
        }

        return calculator(sum, count);
    }

    /**
     * A parameterless function that moves the iterator to the next position.<br />
     * Returns false when no next position is found.
     * @function moveNext
     * @memberof arrgh.Iterator
     * @instance
     * @returns {Boolean} - Returns whether the Iterator has moved to the next position.
     */

    /**
    * A parameterless function that returns the value at the current position.<br />
    * Returns undefined when the iterator is at its initial position or when moveNext returns false.
    * @function current
    * @memberof arrgh.Iterator
    * @instance
    * @returns {*} - Returns the value at the current position of the Iterator.
    */

    /**
     * Supports iteration over a collection.
     * @memberof arrgh
     * @constructor
     * @param {function} moveNext - A parameterless function that moves the iterator to the next position.
     * @param {function} current - A parameterless function that returns the value at the current position.
     */
    var Iterator = function (moveNext, current) {
        this.moveNext = moveNext;
        this.current = current;
    };

    var getArrayIterator = function (arr) {
        var len = arr.length,
            index = -1;
        return new Iterator(function () {
            if (arr.length !== len) {
                throw new Error("Collection was modified, enumeration operation may not execute.");
            }
            index += 1;
            return index < len;
        }, function () {
            return arr[index];
        });
    };

    /**
     * Returns an iterator that iterates through the collection.
     * @function getIterator
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {arrgh.Iterator} - Returns an iterator that iterates through the collection.
     */

    /**
     * Represents the base class for any collection.
     * @memberof arrgh
     * @constructor
     * @param {(Array|String|arrgh.Enumerable|Function)} [iterator=[]] - An array, string or enumerable to add to the new collection or a parameterless function that returns an {@link arrgh.Iterator}.
     */
    var Enumerable = function (iterator) {
        var iterable;
        if (arguments.length > 1) {
            iterable = Array.prototype.slice.call(arguments);
        } else {
            iterable = iterator || [];
        }

        if (isArray(iterable) || typeof iterable === "string") {
            this.getIterator = function () {
                return getArrayIterator(iterable);
            };
        } else if (iterable.getIterator) {
            this.getIterator = iterable.getIterator;
        } else if (typeof iterable === "function") {
            this.getIterator = iterable;
        } else {
            throw new Error("The input parameter for Enumerable was not valid.");
        }
    };

    /**
     * Represents a list of objects that can be accessed by index. Provides methods to manipulate the list.
     * @memberof arrgh
     * @constructor
     * @extends arrgh.Enumerable
     * @param {(Array|String|arrgh.Enumerable)} [enumerable=[]] - An array, string or enumerable whose elements are copied to the new list.
     */
    var List = function (iterator) {
        var self = this,
            iterable;

        Enumerable.call(self, function () {
            return getArrayIterator(self);
        });

        if (arguments.length > 1) {
            iterable = Array.prototype.slice.call(arguments);
        } else {
            iterable = iterator || [];
        }

        if (isArray(iterable) || typeof iterable === "string") {
            self.length = iterable.length;
            var i;
            for (i = 0; i < iterable.length; i += 1) {
                self[i] = iterable[i];
            }
        } else if (iterable.getIterator) {
            self.length = 0;
            iterable.forEach(function (elem, index) {
                self[index] = elem;
                self.length += 1;
            });
        } else {
            throw new Error("The input parameter for List was not valid.");
        }
    };
    inherit(List, Enumerable);

    /**
     * Represents a collection of keys and values.
     * @memberof arrgh
     * @constructor
     * @extends arrgh.Enumerable
     * @param {equalityComparer} [eqComparer=(===)] - An object that tests if two objects are equal.
     */
    var Dictionary = function (eqComparer) {
        var self = this;
        Enumerable.call(self, function () {
            var len = self.length,
                current,
                hashIndex = -1,
                currentKeys,
                keyIndex = -1;

            return new Iterator(function () {
                if (self.length !== len) {
                    throw new Error("Collection was modified, enumeration operation may not execute.");
                }
                current = undefined;
                if (!currentKeys || keyIndex === currentKeys.length - 1) {
                    hashIndex += 1;
                    if (hashIndex < self._.hashes.length) {
                        var hash = self._.hashes[hashIndex];
                        currentKeys = self._.keys[hash];
                        keyIndex = 0;
                        current = currentKeys[keyIndex];
                    }
                } else {
                    keyIndex += 1;
                    current = currentKeys[keyIndex];
                }
                return hashIndex <= self._.hashes.length - 1;
            }, function () {
                return current;
            });
        });

        self.length = 0;
        self._ = {
            eqComparer: ensureEqComparer(eqComparer),
            keys: {},
            hashes: new List()
        };
    };
    inherit(Dictionary, Enumerable);

    /**
     * Represents a collection of keys each mapped to one or more values.
     * @memberof arrgh
     * @private
     * @constructor
     * @extends arrgh.Enumerable
     * @param {arrgh.Enumerable} source - The collection to map to a lookup.
     * @param {keySelector} keySelector - A function that returns the key value from an element of the inner collection.
     * @param {selector} [elementSelector] - A function that projects an element into a new form.
     * @param {equalityComparer} [eqComparer=(===)] - An object that tests if two keys are equal.
     */
    var Lookup = function (source, keySelector, elementSelector, eqComparer) {
        var d;
        Enumerable.call(this, function () {
            var iterator = d.getIterator();
            return new Iterator(iterator.moveNext, function () {
                var current = iterator.current();
                if (isNull(current)) {
                    return current;
                }
                var group = current.value.asEnumerable();
                group.key = current.key;
                return group;
            });
        });

        if (typeof elementSelector !== "function") {
            eqComparer = elementSelector;
            elementSelector = null;
        }
        elementSelector = elementSelector || identity;

        d = new Dictionary(eqComparer);
        source.forEach(function (elem) {
            var key = keySelector(elem);
            var element = elementSelector(elem);
            if (d.containsKey(key)) {
                d.get(key).add(element);
            } else {
                d.add(key, new List([element]));
            }
        });

        this.length = d.length;
        this.get = function (key) {
            var group;
            if (d.containsKey(key)) {
                group = d.get(key).asEnumerable();
                group.key = key;
            } else {
                group = new Enumerable();
                group.key = key;
            }
            return group;
        };
    };
    inherit(Lookup, Enumerable);

    function stableQuicksort(map, startIndex, endIndex, compare) {
        var low = startIndex,
            high = endIndex,
            pindex = Math.floor((low + high) / 2),
            pivot = map[pindex],
            lindex,
            hindex,
            result,
            temp;

        while (low <= high) {
            lindex = map[low];
            result = compare(lindex, pivot);
            while (result < 0 || (result === 0 && lindex < pivot)) {
                low += 1;
                lindex = map[low];
                result = compare(lindex, pivot);
            }

            hindex = map[high];
            result = compare(hindex, pivot);
            while (result > 0 || (result === 0 && hindex > pivot)) {
                high -= 1;
                hindex = map[high];
                result = compare(hindex, pivot);
            }
            if (low <= high) {
                temp = map[low];
                map[low] = map[high];
                map[high] = temp;
                low += 1;
                high -= 1;
            }
        }

        if (low < endIndex) {
            stableQuicksort(map, low, endIndex, compare);
        }
        if (high > startIndex) {
            stableQuicksort(map, startIndex, high, compare);
        }
    }

    /**
     * Represents an ordered collection that can be iterated over.
     * @memberof arrgh
     * @private
     * @constructor
     * @extends arrgh.Enumerable
     * @param {arrgh.Enumerable} source - The collection that needs to be sorted.
     * @param {keySelector} keySelector - A function to extract the key from an element.
     * @param {compare} [compare] - A function that tests if an object is smaller than, greater than or equal to another object.
     * @param {Boolean} descending - Indicated wheter the collection needs to be sorted ascending or descending.
     */
    var OrderedEnumerable = function (source, keySelector, compare, descending) {
        var self = this,
            keys;
        compare = compare || defaultCompare;
        descending = descending ? -1 : 1;

        self.getSource = function () {
            if (source.getSource) {
                return source.getSource();
            }
            return source;
        };

        self.computeKeys = function (elements, count) {
            var arr = new Array(count),
                i;
            for (i = 0; i < count; i += 1) {
                arr[i] = keySelector(elements[i]);
            }
            keys = arr;
            if (source.computeKeys) {
                source.computeKeys(elements, count);
            }
        };
        self.compareKeys = function (i, j) {
            var result = 0;
            if (source.compareKeys) {
                result = source.compareKeys(i, j);
            }
            if (result === 0) {
                result = compare(keys[i], keys[j]) * descending;
            }
            return result;
        };
        Enumerable.call(this, function () {
            var sourceArr = self.getSource().toArray(),
                count = sourceArr.length,
                map = new Array(count),
                index;
            self.computeKeys(sourceArr, count);
            for (index = 0; index < count; index += 1) {
                map[index] = index;
            }
            stableQuicksort(map, 0, count - 1, self.compareKeys);
            index = -1;
            return new Iterator(function () {
                index += 1;
                return index < count;
            }, function () {
                return sourceArr[map[index]];
            });
        });
    };
    inherit(OrderedEnumerable, Enumerable);

    var getUnionIterator = function (first, second, eqComparer) {
        var firstIterator = first.getIterator(),
            secondIterator = second.getIterator(),
            current,
            moveFirst = true,
            d,
            alreadyUnioned,
            moveNext;

        var move = function (iterator) {
            var hasNext = iterator.moveNext();
            if (hasNext) {
                current = iterator.current();
                if (eqComparer && alreadyUnioned(current)) {
                    return moveNext(iterator);
                }
            }
            return hasNext;
        };

        if (eqComparer) {
            d = new Dictionary(eqComparer);

            alreadyUnioned = function (elem) {
                if (d.containsKey(elem)) {
                    return true;
                }
                d.add(elem);
                return false;
            };
        }
        moveNext = function () {
            current = undefined;
            if (moveFirst) {
                moveFirst = move(firstIterator);
                if (!moveFirst) {
                    // If there is no next item
                    // move on to the second iterator.
                    return moveNext();
                }

                return true;
            }
            return move(secondIterator);
        };

        return new Iterator(moveNext, function () {
            return current;
        });
    };

    var empty = new Enumerable(),
        enumProto = Enumerable.prototype,
        aggregate = function (source, aggregator) {
            var iterator = source.getIterator();
            if (!iterator.moveNext()) {
                throw new Error("Collection contains no elements.");
            }
            var accumulate = iterator.current();
            while (iterator.moveNext()) {
                accumulate = aggregator(accumulate, iterator.current());
            }
            return accumulate;
        },
        aggregateSeed = function (source, seed, aggregator, resultSelector) {
            resultSelector = resultSelector || identity;
            var accumulate = seed,
                loopedOnce = false;
            source.forEach(function (elem) {
                loopedOnce = true;
                accumulate = aggregator(accumulate, elem);
            });
            if (!loopedOnce) {
                throw new Error("Collection contains no elements.");
            }
            return resultSelector(accumulate);
        };

    /**
     * Determines whether all elements of the collection satisfy a condition.<br />
     * When a result selector is passed to the function a seed should also be specified.
     * @param {*} [seed] - The initial accumulator value (mandatory if a result selector is specified).
     * @param {accumulator} accumulator - An accumulator function to be invoked on each element.
     * @param {selector} [resultSelector] - A function to transform the final accumulator value into the result value.
     * @function aggregate
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {*} - The final accumulator value.
     */
    enumProto.aggregate = function (seed, accumulator, selector) {
        if (accumulator) {
            return aggregateSeed(this, seed, accumulator, selector);
        }
        return aggregate(this, seed);
    };

    /**
     * Determines whether all elements of the collection satisfy a condition.
     * @param {predicate} predicate - A function to test each element for a condition.
     * @function all
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {Boolean} - True if the list is empty or if all elements in the collection satisfy a condition, else false.
     */
    enumProto.all = function (predicate) {
        var all = true;
        this.forEach(function (elem) {
            all = predicate(elem);
            return all;
        });
        return all;
    };

    /**
     * Determines whether the collection contains any elements or if any elements satisfy a condition.
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @function any
     * @see {@link arrgh.Enumerable#some}
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {Boolean} - True if the collection contains any elements or if any elements satisfy a condition, else false.
     */
    enumProto.any = function (predicate) {
        var any = false;
        this.forEach(function (elem, index) {
            if (predicate) {
                any = predicate(elem, index);
                return !any;
            }
            any = true;
            return false;
        });
        return any;
    };

    /**
     * Determines whether the collection contains any elements or if any elements satisfy a condition.
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @function some
     * @see {@link arrgh.Enumerable#any}
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {Boolean} - True if the collection contains any elements or if any elements satisfy a condition, else false.
     */
    enumProto.some = enumProto.any;

    /**
    * Returns the input typed as Enumerable.
    * @function asEnumerable
    * @memberof arrgh.Enumerable
    * @instance
    * @returns {arrgh.Enumerable} - The input collection as Enumerable.
    */
    enumProto.asEnumerable = function () {
        return new Enumerable(this.getIterator);
    };

    /**
     * Computes the average of a collection of values.<br />
     * Values are converted to numerics, but if this fails unexpected averages may occur.
     * @param {selector} [selector] - A function that projects an element into a new form.
     * @function average
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {Number} - The average of all values in the collection, or NaN.
     * @throws Throws an error if the collection contains no elements.
     */
    enumProto.average = function (selector) {
        return sumCount(this, selector, function (sum, count) {
            return sum / count;
        });
    };

    /**
     * Concatenates two collections.
     * @param {other} other - The collection to concatenate to the current collection.
     * @function concat
     * @see {@link arrgh.Enumerable#unionAll}
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {arrgh.Enumerable} - A collection that contains all the elements of both the current and the other collection.
     */
    enumProto.concat = function (other) {
        var self = this;
        return new Enumerable(function () {
            return getUnionIterator(self, other);
        });
    };

    /**
     * Concatenates two collections.
     * @param {other} other - The collection to concatenate to the current collection.
     * @function unionAll
     * @see {@link arrgh.Enumerable#concat}
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {arrgh.Enumerable} - A collection that contains all the elements of both the current and the other collection.
     */
    enumProto.unionAll = enumProto.concat;

    /**
     * Determines whether a collection contains a specified element, optionally uses a custom equality comparer.
     * @param {*} elem - The element to locate in the collection.
     * @param {equals|equalityComparer} [eqComparer=(===)] - A function or object that tests if two elements are equal.
     * @function contains
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {Boolean} - Returns whether the specified element is contained in the collection.
     */
    enumProto.contains = function (elem, eqComparer) {
        eqComparer = ensureEqComparer(eqComparer);
        var hasElem = false;
        this.forEach(function (item) {
            hasElem = eqComparer.equals(item, elem);
            return !hasElem;
        });
        return hasElem;
    };

    /**
     * Specifies how many elements the collection has, or how many satisfy a certain condition.
     * @function count
     * @memberof arrgh.Enumerable
     * @instance
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @returns {Number} - A number that specifies how many elements the collection has, or how many satisfy a certain condition.
     */
    enumProto.count = function (predicate) {
        var count = 0;
        predicate = predicate || alwaysTrue;

        this.forEach(function (elem) {
            if (predicate(elem)) {
                count += 1;
            }
        });
        return count;
    };

    /**
     * Returns the elements of the specified collection or a collection containing only the default value if the collection is empty.
     * @function defaultIfEmpty
     * @memberof arrgh.Enumerable
     * @instance
     * @param {*} defaultValue - The default value to be returned when the collection is empty.
     * @returns {arrgh.Enumerable} - A new collection containing the elements of the specified collection or a new collection containing only the default value if the collection is empty.
     */
    enumProto.defaultIfEmpty = function (defaultValue) {
        var self = this;
        return new Enumerable(function () {
            var iterator = self.getIterator();
            var current;
            var empty = true;
            return new Iterator(function () {
                current = undefined;
                if (iterator.moveNext()) {
                    empty = false;
                    current = iterator.current();
                    return true;
                }
                if (empty) {
                    empty = false;
                    current = defaultValue;
                    return true;
                }
                return false;
            }, function () {
                return current;
            });
        });
    };

    /**
     * Returns distinct elements from a collection by using the default or a custom equality comparer to compare values.
     * @function distinct
     * @memberof arrgh.Enumerable
     * @instance
     * @param {equals|equalityComparer} [eqComparer=(===)] - A function or object that tests if two elements are equal.
     * @returns {arrgh.Enumerable} - A new collection with unique elements.
     */
    enumProto.distinct = function (eqComparer) {
        return this.union(empty, eqComparer);
    };

    /**
     * Returns the element at a specified index.
     * @function elementAt
     * @memberof arrgh.Enumerable
     * @instance
     * @param {Number} index - The index of the element to find.
     * @returns {*} - The element at the specified index.
     * @throws - Throws an error if the specified index is outside the bounds of the collection.
     */
    enumProto.elementAt = function (index) {
        var def = {};
        var elem = this.elementAtOrDefault(index, def);
        if (elem === def) {
            throw new Error("Index was outside the bounds of the collection.");
        }
        return elem;
    };

    /**
     * Returns the element at a specified index or a default value.
     * @function elementAtOrDefault
     * @memberof arrgh.Enumerable
     * @instance
     * @param {Number} index - The index of the element to find.
     * @param {*} [defaultValue] - The value that is returned when the specified index is not found.
     * @returns {*} - The element at the specified index or a default value.
     */
    enumProto.elementAtOrDefault = function (index, defaultValue) {
        if (index < 0) {
            return defaultValue;
        }

        var elem,
            elemSet = false;
        this.forEach(function (e, i) {
            if (i === index) {
                elem = e;
                elemSet = true;
                return false;
            }
        });

        if (!elemSet) {
            return defaultValue;
        }
        return elem;
    };

    /**
    * Returns an empty singleton instance of enumerable.
    * @function empty
    * @memberof arrgh.Enumerable
    * @static
    * @returns {arrgh.Enumerable} - An empty singleton collection.
    */
    Enumerable.empty = function () {
        return empty;
    };

    /**
     * Produces the set difference of two collections.
     * @function except
     * @memberof arrgh.Enumerable
     * @instance
     * @param {arrgh.Enumerable} other - A collection whose elements that also occur in the first sequence will cause those elements to be removed from the returned collection.
     * @param {equals|equalityComparer} [eqComparer=(===)] - A function or object that tests if two elements are equal.
     * @returns {arrgh.Enumerable} - A collection that contains the set difference of the elements of two collections.
     */
    enumProto.except = function (other, eqComparer) {
        var self = this;
        return new Enumerable(function () {
            var iterator = self.getIterator(),
                d = new Dictionary(eqComparer),
                current;
            other.forEach(function (elem) {
                if (!d.containsKey(elem)) {
                    d.add(elem);
                }
            });
            return new Iterator(function () {
                while (iterator.moveNext()) {
                    current = iterator.current();
                    if (!d.containsKey(current)) {
                        d.add(current);
                        return true;
                    }
                }
                current = undefined;
                return false;
            }, function () {
                return current;
            });
        });
    };

    /**
     * Returns the first element in a collection, or the first element that satisfies a condition.
     * @function first
     * @memberof arrgh.Enumerable
     * @instance
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @returns {*} - Returns the first element of the collection, or the first element that satisfies a condition.
     * @throws Throws an error if the collection is empty or when no element matches the condition.
     */
    enumProto.first = function (predicate) {
        var self = this;
        return findElem(this, predicate, function (predicate, defaultValue) {
            return self.firstOrDefault(predicate, defaultValue);
        });
    };

    /**
     * Returns the first element in a collection, or the first element that satisfies a condition.<br />
     * If the element is not found returns a default value.
     * @function firstOrDefault
     * @memberof arrgh.Enumerable
     * @instance
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @param {*} [defaultValue] - The value that is returned when the collection is empty or no element matches the condition.
     * @returns {*} - Returns the first element of the collection, or the first element that satisfies a condition, or a specified default value.
     */
    enumProto.firstOrDefault = function (predicate, defaultValue) {
        return findOrDefault(this, function (context, foundElem) {
            context.elem = foundElem;
            context.found = true;
            return false;
        }, predicate, defaultValue);
    };

    /**
     * Performs the specified action on each element of the collection.
     * @param {forEachCallback} callback - The callback that is applied to each element in the enumerable.
     * @function forEach
     * @memberof arrgh.Enumerable
     * @instance
     */
    enumProto.forEach = function (callback) {
        var iterator = this.getIterator(),
            cont = null,
            index = 0;
        while ((isNull(cont) || cont) && iterator.moveNext()) {
            cont = callback(iterator.current(), index);
            index += 1;
        }
    };

    /**
     * Groups the elements of a collection according to a specified key selector.
     * @param {keySelector} keySelector - A function that returns the key value from an element.
     * @param {selector} [elementSelector] - A function to project an element into a new form.
     * @param {groupByResultSelector} [resultSelector] - A function to create a result value from each group.
     * @param {equalityComparer} [eqComparer=(===)] - An object that tests if two keys are equal.
     * @function groupBy
     * @memberof arrgh.Enumerable
     * @instance
     * @arrgh.Enumerable - A collection where each object contains a collection of objects and a key.
     */
    enumProto.groupBy = function (keySelector) {
        var self = this,
            elementSelector,
            resultSelector,
            eqComparer,
            args = Array.prototype.slice.call(arguments),
            setArg = function (index) {
                var type = typeof args[index];
                if (type === "object") {
                    eqComparer = args[index];
                } else if (type === "function") {
                    if (args[index].length === 1) {
                        elementSelector = args[index];
                    } else {
                        resultSelector = args[index];
                    }
                }
            };
        setArg(1);
        setArg(2);
        setArg(3);

        elementSelector = elementSelector || identity;
        eqComparer = ensureEqComparer(eqComparer);

        return new Enumerable(function () {
            var iterator = self.toLookup(keySelector, elementSelector, eqComparer).getIterator();
            return new Iterator(iterator.moveNext, function () {
                var current = iterator.current();
                if (isNull(current)) {
                    return current;
                }
                if (resultSelector) {
                    return resultSelector(current.key, current);
                }
                return current;
            });
        });
    };

    /**
     * Correlates the elements of two collections based on equality of keys and groups the results.
     * @param {arrgh.Enumerable} inner - The collection to join with.
     * @param {keySelector} outerKeySelector - A function that returns the key value from an element of the outer collection.
     * @param {keySelector} innerKeySelector - A function that returns the key value from an element of the inner collection.
     * @param {groupJoinResultSelector} resultSelector - A function to create a result value from each group.
     * @param {equalityComparer} [eqComparer=(===)] - An object that tests if two keys are equal.
     * @function groupJoin
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {arrgh.Enumerable} - A collection that contains elements that are obtained by performing a grouped join on two collections.
     */
    enumProto.groupJoin = function (inner, outerKeySelector, innerKeySelector, resultSelector, eqComparer) {
        var self = this;
        eqComparer = ensureEqComparer(eqComparer);
        return new Enumerable(function () {
            var iterator = self.getIterator(),
                innerLookup = inner.toLookup(innerKeySelector, eqComparer),
                moved = false;
            return new Iterator(function () {
                moved = iterator.moveNext();
                return moved;
            }, function () {
                if (!moved) {
                    return undefined;
                }
                var current = iterator.current();
                var outerKey = outerKeySelector(current);
                return resultSelector(current, innerLookup.get(outerKey));
            });
        });
    };

    /**
     * Finds the first index at which a given element can be found in the collection, or -1 if it is not present.
     * @param {*} searchElem - The element to locate in the collection.
     * @param {Number} [fromIndex=0] - The index to start the search at.
     * @function indexOf
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {Number} - The first index of the element in the array or -1 if not found.
     */
    enumProto.indexOf = function (searchElem, fromIndex) {
        fromIndex = fromIndex || 0;
        var foundIndex = -1;
        this.forEach(function (elem, index) {
            if (index >= fromIndex && searchElem === elem) {
                foundIndex = index;
                return false;
            }
        });
        return foundIndex;
    };

    /**
     * Produces the set intersection of two collections.
     * @function intersect
     * @memberof arrgh.Enumerable
     * @instance
     * @param {arrgh.Enumerable} other - A collection whose elements that also occur in the first sequence will cause those elements to be included in the returned collection.
     * @param {equals|equalityComparer} [eqComparer=(===)] - A function or object that tests if two elements are equal.
     * @returns {arrgh.Enumerable} - A collection that contains the set intersection of the elements of two collections.
     */
    enumProto.intersect = function (other, eqComparer) {
        var self = this;
        return new Enumerable(function () {
            var iterator = self.getIterator(),
                d = new Dictionary(eqComparer);
            other.forEach(function (elem) {
                if (!d.containsKey(elem)) {
                    d.add(elem);
                }
            });
            var current;
            return new Iterator(function () {
                while (iterator.moveNext()) {
                    current = iterator.current();
                    if (d.containsKey(current)) {
                        return d.remove(current);
                    }
                }
                current = undefined;
                return false;
            }, function () {
                return current;
            });
        });
    };

    /**
     * Correlates the elements of two collections based on equality of keys.
     * @param {arrgh.Enumerable} inner - The collection to join with.
     * @param {keySelector} outerKeySelector - A function that returns the key value from an element of the outer collection.
     * @param {keySelector} innerKeySelector - A function that returns the key value from an element of the inner collection.
     * @param {joinResultSelector} resultSelector - A function to create a result from two matched elements.
     * @param {equalityComparer} [eqComparer=(===)] - An object that tests if two keys are equal.
     * @function join
     * @memberof arrgh.Enumerable
     * @instance
     * returns {arrgh.Enumerable} - A collection that has elements that are obtained by performing an inner join on two collections.
     */
    enumProto.join = function (inner, outerKeySelector, innerKeySelector, resultSelector, eqComparer) {
        var self = this;
        eqComparer = ensureEqComparer(eqComparer);
        return new Enumerable(function () {

            var outerIterator = self.getIterator(),
                innerLookup = inner.toLookup(innerKeySelector, eqComparer),
                moved,
                innerIterator,
                outerCurrent,
                innerCurrent,
                moveNext;

            moveNext = function () {
                if (innerIterator) {
                    moved = innerIterator.moveNext();
                    if (moved) {
                        innerCurrent = innerIterator.current();
                    } else {
                        innerIterator = undefined;
                        moveNext();
                    }
                } else {
                    moved = outerIterator.moveNext();
                    if (moved) {
                        outerCurrent = outerIterator.current();
                        innerIterator = innerLookup.get(outerKeySelector(outerCurrent)).getIterator();
                        moveNext();
                    }
                }
                return moved;
            };
            return new Iterator(moveNext, function () {
                if (!moved) {
                    return undefined;
                }
                return resultSelector(outerCurrent, innerCurrent);
            });
        });
    };

    /**
     * Returns the last element in a collection, or the last element that satisfies a condition.
     * @function last
     * @memberof arrgh.Enumerable
     * @instance
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @returns {*} - Returns the last element of the collection, or the last element that satisfies a condition.
     * @throws Throws an error when the collection is empty or when no element matches the condition.
     */
    enumProto.last = function (predicate) {
        var self = this;
        return findElem(this, predicate, function (predicate, defaultValue) {
            return self.lastOrDefault(predicate, defaultValue);
        });
    };

    /**
     * Returns the last element in a collection, or the last element that satisfies a condition.<br />
     * If the element is not found returns a default value.
     * @function lastOrDefault
     * @memberof arrgh.Enumerable
     * @instance
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @param {*} [defaultValue] - The value that is returned when the collection is empty or no element matches the condition.
     * @returns {*} - Returns the last element of the collection, or the last element that satisfies a condition, or a specified default value.
     */
    enumProto.lastOrDefault = function (predicate, defaultValue) {
        return findOrDefault(this, function (context, foundElem) {
            context.elem = foundElem;
            context.found = true;
        }, predicate, defaultValue);
    };

    /**
     * Returns the maximum value in a collection.<br />
     * Values are converted to numerics. If this fails and the value is NaN then NaN is treated as smaller than anything.
     * @param {selector} [selector] - A function that projects an element into a new form.
     * @function max
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {*} - Returns the maximum value in the collection or NaN.
     * @throws - Throws an error when the collection is empty.
     */
    enumProto.max = function (selector) {
        selector = selector || identity;
        var max,
            first = true,
            hasNan = false;
        this.forEach(function (elem) {
            elem = selector(elem);
            if (!isNull(elem)) {
                elem = +elem;
                // Really weird behavior where NaN is smaller
                // than anything else (except in the min function).
                // And, of course, it can't be compared to anything...
                if (isNaN(elem)) {
                    hasNan = true;
                } else {
                    if (first) {
                        first = false;
                        max = elem;
                    } else {
                        if (defaultCompare(elem, max) > 0) {
                            max = elem;
                        }
                    }
                }
            }
        });
        if (first) {
            if (hasNan) {
                max = NaN;
            } else {
                throw new Error("Collection contains no elements.");
            }
        }
        return max;
    };

    /**
     * Returns the minimum value in a collection.<br />
     * Values are converted to numerics. If this fails the function returns NaN.
     * @param {selector} [selector] - A function that projects an element into a new form.
     * @function max
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {*} - Returns the minimum value in the collection or NaN.
     * @throws - Throws an error when the collection is empty.
     */
    enumProto.min = function (selector) {
        selector = selector || identity;
        var min,
            first = true;
        this.forEach(function (elem) {
            elem = selector(elem);
            if (!isNull(elem)) {
                elem = +elem;
                if (isNaN(elem)) {
                    // Really weird behavior where NaN is smaller
                    // than anything else (except in the min function).
                    first = false;
                    min = elem;
                    return false;
                }
                if (first) {
                    first = false;
                    min = elem;
                } else {
                    if (defaultCompare(elem, min) < 0) {
                        min = elem;
                    }
                }
            }
        });
        if (first) {
            throw new Error("Collection contains no elements.");
        }
        return min;
    };

    /**
     * Filters elements based on a specified type (constructor).<br />
     * Object and null do not evaluate to the same type and neither do undefined and null.
     * @param {*|undefined|null} type - The constructor of a type or undefined or null.
     * @function ofType
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {arrgh.Enumerable} - Returns a collection containing only values that are of the specified type.
     */
    enumProto.ofType = function (type) {
        var typeName;
        var getType;
        if (type === Boolean) {
            typeName = "boolean";
        } else if (type === Number) {
            typeName = "number";
        } else if (type === String) {
            typeName = "string";
        } else if (type === Function) {
            typeName = "function";
        } else if (type === Object) {
            getType = function (elem) {
                return elem && typeof elem === "object";
            };
        } else if (type === undefined) {
            typeName = "undefined";
        } else if (type === null) {
            getType = function (elem) {
                return elem === null;
            };
        } else {
            getType = function (elem) {
                return elem instanceof type;
            };
        }
        getType = getType || function (elem) {
            return typeof elem === typeName;
        };
        return this.where(getType);
    };

    /**
     * Sorts the elements of a sequence in ascending order according to a key.
     * @function orderBy
     * @memberof arrgh.Enumerable
     * @instance
     * @param {keySelector} keySelector - A function to extract a key from an element.
     * @param {compare} [compare] - A function that tests if an object is smaller than, greater than or equal to another object.
     * @returns {arrgh.OrderedEnumerable} - Returns an ordered enumerable.
     */
    enumProto.orderBy = function (keySelector, compare) {
        return new OrderedEnumerable(this, keySelector, compare, false);
    };

    /**
     * Sorts the elements of a sequence in descending order according to a key.
     * @function orderByDescending
     * @memberof arrgh.Enumerable
     * @instance
     * @param {keySelector} keySelector - A function to extract a key from an element.
     * @param {compare} [compare] - A function that tests if an object is smaller than, greater than or equal to another object.
     * @returns {arrgh.OrderedEnumerable} - Returns an ordered enumerable.
     */
    enumProto.orderByDescending = function (keySelector, compare) {
        return new OrderedEnumerable(this, keySelector, compare, true);
    };

    /**
    * Generates a collection of integral numbers within a specified range.<br />
    * When no count is supplied the range will stop at 9007199254740991 (a.k.a. Number.MAX_SAFE_INTEGER).<br />
    * Depending on your start value your browser will probably flip though, so just provide a count.
    * @function range
    * @memberof arrgh.Enumerable
    * @static
    * @param {Number} start - The value of the first integer in the collection.
    * @param {Number} [count] - The number of sequential integers to generate.
    * @returns {arrgh.Enumerable} - A collection that contains a range of sequential integral numbers.
    * @throws Throws when count is lower than 0 or when the range exceeds 9007199254740991 (a.k.a. Number.MAX_SAFE_INTEGER).
    */
    Enumerable.range = function (start, count) {
        if (!isNull(count)) {
            if (count < 0) {
                throw new Error("Count cannot be lower than 0.");
            }
            if (start + (count - 1) > MAX_SAFE_INTEGER) {
                throw new Error("Start and count can not exceed " + MAX_SAFE_INTEGER + ".");
            }
        }
        return new Enumerable(function () {
            if (isNull(count)) {
                var moved = false;
                return new Iterator(function () {
                    if (!moved) {
                        moved = true;
                    } else {
                        start += 1;
                    }
                    return start <= MAX_SAFE_INTEGER;
                }, function () {
                    if (!moved || start > MAX_SAFE_INTEGER) {
                        return undefined;
                    }
                    return start;
                });
            } else {
                var index = -1;
                return new Iterator(function () {
                    index += 1;
                    return index < count;
                }, function () {
                    if (index === -1 || index >= count) {
                        return undefined;
                    }
                    return start + index;
                });
            }
        });
    };

    /**
    * Generates a collection that contains one repeated value.
    * @function repeat
    * @memberof arrgh.Enumerable
    * @static
    * @param {*} element - The element to repeat.
    * @param {Number} count - The number of times to repeat the element.
    * @returns {arrgh.Enumerable} - A collection that contains a one value count times.
    * @throws Throws when count is lower than 0.
    */
    Enumerable.repeat = function (element, count) {
        count = count || 0;
        if (count < 0) {
            throw new Error("Count cannot be lower than 0.");
        }
        return new Enumerable(function () {
            var index = -1;
            return new Iterator(function () {
                index += 1;
                return index < count;
            }, function () {
                if (index === -1 || index >= count) {
                    return undefined;
                }
                return element;
            });
        });
    };

    /**
    * Reverses the order of the elements in a collection.
    * @function reverse
    * @memberof arrgh.Enumerable
    * @instance
    * @returns {arrgh.Enumerable} - A collection that contains the original collection in reversed order.
    */
    enumProto.reverse = function () {
        var self = this;
        return new Enumerable(function () {
            var list = new List(self),
                length = list.length,
                index = length;
            return new Iterator(function () {
                index -= 1;
                return index >= 0;
            }, function () {
                if (index === length) {
                    return undefined;
                }
                return list.get(index);
            });
        });
    };

    /**
     * Projects each element of a collection into a new form.
     * @param {indexSelector} selector - A function that projects an element into a new form.
     * @function select
     * @see {@link arrgh.Enumerable#map}
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {arrgh.Enumerable} - A collection whose elements are the result of invoking the transform function on each element of source.
     */
    enumProto.select = function (selector) {
        var self = this;
        return new Enumerable(function () {
            var index = -1,
                iterator = self.getIterator(),
                next;
            return new Iterator(function () {
                index += 1;
                next = iterator.moveNext();
                return next;
            }, function () {
                var current;
                if (next) {
                    current = selector(iterator.current(), index);
                }
                return current;
            });
        });
    };

    /**
     * Projects each element of a collection into a new form.
     * @param {indexSelector} selector - A function that projects an element into a new form.
     * @function map
     * @see {@link arrgh.Enumerable#select}
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {arrgh.Enumerable} - A collection whose elements are the result of invoking the transform function on each element of source.
     */
    enumProto.map = enumProto.select;

    /**
     * Projects each element of a collection to an Enumerable and flattens the resulting collections into one collection.
     * @param {collectionSelector} collectionSelector - A function that projects an element into a new form.
     * @param {selectManyResultSelector} [resultSelector] - A function that creates a result value from each element in the intermediate collection.
     * @function selectMany
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {arrgh.Enumerable} - A collection whose elements are the result of invoking the one-to-many transform function on each element of the input collection.
     */
    enumProto.selectMany = function (collectionSelector, resultSelector) {
        var self = this;
        return new Enumerable(function () {
            var iterator = self.getIterator(),
                innerIterator,
                outerCurrent,
                current, index = -1,
                moveNext;

            moveNext = function () {
                current = undefined;
                if (innerIterator) {
                    if (innerIterator.moveNext()) {
                        if (resultSelector) {
                            current = resultSelector(outerCurrent, innerIterator.current());
                        } else {
                            current = innerIterator.current();
                        }
                        return true;
                    } else {
                        innerIterator = null;
                        return moveNext();
                    }
                }

                if (iterator.moveNext()) {
                    index += 1;
                    outerCurrent = iterator.current();
                    innerIterator = new Enumerable(collectionSelector(outerCurrent, index)).getIterator();
                    return moveNext();
                }
                return false;
            };
            return new Iterator(moveNext, function () {
                return current;
            });
        });
    };

    /**
     * Determines whether two collections are equal by comparing the elements, optionally using a custom equality comparer for their type.
     * @param {arrgh.Enumerable} other - Another collection to compare with.
     * @param {equalityComparer} [eqComparer=(===)] - An object that tests if two objects are equal.
     * @function sequenceEquals
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {Boolean} - True if all elements in both collections match, otherwise false.
     */
    enumProto.sequenceEquals = function (other, eqComparer) {
        eqComparer = ensureEqComparer(eqComparer);

        var iterator = this.getIterator(),
            otherIterator = other.getIterator(),
            equal = true;

        while (iterator.moveNext() && equal) {
            if (!otherIterator.moveNext() || !eqComparer.equals(iterator.current(), otherIterator.current())) {
                equal = false;
            }
        }
        equal = !otherIterator.moveNext();
        return equal;
    };

    /**
     * Returns the only element in a collection, or the only element that satisfies a condition.
     * @function single
     * @memberof arrgh.Enumerable
     * @instance
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @returns {*} - Returns the only element of the collection, or the only element that satisfies a condition.
     * @throws Throws an error when the collection is empty or when no element matches the condition or when the collection (or predicate) returns more than a single element.
     */
    enumProto.single = function (predicate) {
        var self = this;
        return findElem(this, predicate, function (predicate, defaultValue) {
            return self.singleOrDefault(predicate, defaultValue);
        });
    };

    /**
     * Returns the only element in a collection, or the only element that satisfies a condition.<br />
     * If the element is not found returns a default value.
     * @function singleOrDefault
     * @memberof arrgh.Enumerable
     * @instance
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @param {*} [defaultValue] - The value that is returned when the collection is empty or no element matches the condition.
     * @returns {*} - Returns the only element of the collection, or the only element that satisfies a condition, or a specified default value.
     * @throws Throws an error when the collection (or predicate) returns more than a single element.
     */
    enumProto.singleOrDefault = function (predicate, defaultValue) {
        return findOrDefault(this, function (context, foundElem) {
            if (context.found) {
                throw new Error("Collection contains more than one matching element.");
            }
            context.elem = foundElem;
            context.found = true;
        }, predicate, defaultValue);
    };

    /**
     * Bypasses a specified number of elements in a collection and then returns the remaining elements.
     * @function skip
     * @memberof arrgh.Enumerable
     * @instance
     * @param {Number} count - The number of elements to skip.
     * @returns {arrgh.Enumerable} - A collection that contains the elements that occur after the specified index.
     */
    enumProto.skip = function (count) {
        var self = this;
        return new Enumerable(function () {
            var iterator = self.getIterator(),
                skipped = 0;
            return new Iterator(function () {
                while (skipped < count) {
                    skipped += 1;
                    if (!iterator.moveNext()) {
                        return false;
                    }
                }
                return iterator.moveNext();
            }, function () {
                return iterator.current();
            });
        });
    };

    /**
     * Bypasses elements in a collection as long as a specified condition is true and then returns the remaining elements.
     * @function skipWhile
     * @memberof arrgh.Enumerable
     * @instance
     * @param {indexPredicate} predicate - A function to test whether to skip the element.
     * @returns {arrgh.Enumerable} - A collection that contains the elements starting at the first element in the linear series that does not pass the test specified by predicate.
     */
    enumProto.skipWhile = function (predicate) {
        var self = this;
        return new Enumerable(function () {
            var iterator = self.getIterator(),
                index = -1,
                current,
                skipped = false;
            return new Iterator(function () {
                current = undefined;
                while (!skipped) {
                    index += 1;
                    if (iterator.moveNext()) {
                        current = iterator.current();
                        if (!predicate(current, index)) {
                            skipped = true;
                            return true;
                        }
                    } else {
                        skipped = true;
                        return false;
                    }
                }
                var next = iterator.moveNext();
                current = iterator.current();
                return next;
            }, function () {
                return current;
            });
        });
    };

    /**
     * Computes the sum of a collection of values.<br />
     * If values are not numerics the result may be NaN or something unexpected (e.g. "2" + 2 will results 22).
     * @param {selector} [selector] - A function that projects an element into a new form.
     * @function sum
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {Number} - The sum of all values in the collection, or NaN.
     * @throws Throws an error if the collection contains no elements.
     */
    enumProto.sum = function (selector) {
        return sumCount(this, selector, function (sum) {
            return sum;
        });
    };

    /**
     * Returns a specified number of elements from the start of a collection.
     * @function take
     * @memberof arrgh.Enumerable
     * @instance
     * @param {Number} count - The number of elements to take.
     * @returns {arrgh.Enumerable} - A collection that contains the elements that occur before the specified index.
     */
    enumProto.take = function (count) {
        var self = this;
        return new Enumerable(function () {
            var iterator = self.getIterator(),
                index = -1;
            return new Iterator(function () {
                index += 1;
                return index < count && iterator.moveNext();
            }, function () {
                if (index === -1 || index >= count) {
                    return undefined;
                }
                return iterator.current();
            });
        });
    };

    /**
     * Returns elements from a collection as long as a specified condition is true.
     * @function takeWhile
     * @memberof arrgh.Enumerable
     * @instance
     * @param {indexPredicate} predicate - A function to test whether to take the element.
     * @returns {arrgh.Enumerable} - A collection that contains the elements that occur before the element at which the test no longer passes.
     */
    enumProto.takeWhile = function (predicate) {
        var self = this;
        return new Enumerable(function () {
            var iterator = self.getIterator(),
                take = true,
                current,
                index = -1;
            return new Iterator(function () {
                take = take && iterator.moveNext();
                if (take) {
                    index += 1;
                    current = iterator.current();
                    take = predicate(current, index);
                }
                return take;
            }, function () {
                if (take) {
                    return current;
                }
            });
        });
    };

    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * @function thenBy
     * @memberof arrgh.OrderedEnumerable
     * @instance
     * @param {keySelector} keySelector - A function to extract a key from an element.
     * @param {compare} [compare] - A function that tests if an object is smaller than, greater than or equal to another object.
     * @returns {arrgh.OrderedEnumerable} - Returns an ordered enumerable.
     */
    OrderedEnumerable.prototype.thenBy = function (keySelector, compare) {
        return new OrderedEnumerable(this, keySelector, compare, false);
    };

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * @function thenByDescending
     * @memberof arrgh.OrderedEnumerable
     * @instance
     * @param {keySelector} keySelector - A function to extract a key from an element.
     * @param {compare} [compare] - A function that tests if an object is smaller than, greater than or equal to another object.
     * @returns {arrgh.OrderedEnumerable} - Returns an ordered enumerable.
     */
    OrderedEnumerable.prototype.thenByDescending = function (keySelector, compare) {
        return new OrderedEnumerable(this, keySelector, compare, true);
    };

    /**
     * Converts the collection to a JavaScript array.
     * @function toArray
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {Array} - Returns a JavaScript array.
     */
    enumProto.toArray = function () {
        var arr = [];
        this.forEach(function (elem) {
            arr.push(elem);
        });
        return arr;
    };

    /**
     * Converts the collection to a dictionary.
     * @function toDictionary
     * @memberof arrgh.Enumerable
     * @instance
     * @param {keySelector} keySelector - A function that returns the key value from an element of the inner collection.
     * @param {selector} [elementSelector] - A function that projects an element into a new form.
     * @param {equalityComparer} [eqComparer=(===)] - An object that tests if two keys are equal.
     * @returns {arrgh.Dictionary} - Returns a dictionary containing the keys and elements that are selected from the input collection.
     */
    enumProto.toDictionary = function (keySelector, elementSelector, eqComparer) {
        if (typeof arguments[1] === "function") {
            elementSelector = arguments[1];
            eqComparer = arguments[2];
        } else {
            eqComparer = arguments[1];
        }
        elementSelector = elementSelector || identity;
        eqComparer = ensureEqComparer(eqComparer);

        var d = new Dictionary(eqComparer);
        this.forEach(function (elem) {
            d.add(keySelector(elem), elementSelector(elem));
        });
        return d;
    };

    /**
     * Converts the collection to a list.
     * @function toList
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {arrgh.List} - Returns a List containing all the elements from the input collection.
     */
    enumProto.toList = function () {
        return new List(this);
    };

    /**
     * Converts the collection to a collection of keys each mapped to one or more values.
     * @function toLookup
     * @memberof arrgh.Enumerable
     * @instance
     * @param {keySelector} keySelector - A function that returns the key value from an element of the inner collection.
     * @param {selector} [elementSelector] - A function that projects an element into a new form.
     * @param {equalityComparer} [eqComparer=(===)] - An object that tests if two keys are equal.
     * @returns {arrgh.LookUp} - Returns a collection of keys mapped to one or more values.
     */
    enumProto.toLookup = function (keySelector, elementSelector, eqComparer) {
        if (typeof arguments[1] === "function") {
            elementSelector = arguments[1];
            eqComparer = arguments[2];
        } else {
            eqComparer = arguments[1];
        }
        elementSelector = elementSelector || identity;
        eqComparer = ensureEqComparer(eqComparer);

        return new Lookup(this, keySelector, elementSelector, eqComparer);
    };

    /**
     * Produces the set union of two collections by using the default or a custom equality comparer to compare values.
     * @function union
     * @memberof arrgh.Enumerable
     * @instance
     * @param {arrgh.Enumerable} other - The other collection to union with.
     * @param {equalityComparer} [eqComparer=(===)] - An object that tests if two elements are equal.
     * @returns {arrgh.Enumerable} - A collection that contains distinct element from the two input collections.
     */
    enumProto.union = function (other, eqComparer) {
        var self = this;
        return new Enumerable(function () {
            return getUnionIterator(self, other, ensureEqComparer(eqComparer));
        });
    };

    /**
     * Filters a collection of values based on a predicate. Each element's index is used in the logic of the predicate function.
     * @function where
     * @see {@link arrgh.Enumerable#filter}
     * @memberof arrgh.Enumerable
     * @instance
     * @param {indexPredicate} predicate - A function to test each element for a condition.
     * @returns {arrgh.Enumerable} - A collection that contains all elements that satisfy the condition.
     */
    enumProto.where = function (predicate) {
        var self = this;
        return new Enumerable(function () {
            var index = -1,
                iterator = self.getIterator(),
                current;
            return new Iterator(function () {
                while (iterator.moveNext()) {
                    index += 1;
                    current = iterator.current();
                    if (predicate(current, index)) {
                        return true;
                    }
                }
                current = undefined;
                return false;
            }, function () {
                return current;
            });
        });
    };

    /**
     * Filters a collection of values based on a predicate. Each element's index is used in the logic of the predicate function.
     * @function filter
     * @see {@link arrgh.Enumerable#where}
     * @memberof arrgh.Enumerable
     * @instance
     * @param {indexPredicate} predicate - A function to test each element for a condition.
     * @returns {arrgh.Enumerable} - A collection that contains all elements that satisfy the condition.
     */
    enumProto.filter = enumProto.where;

    /**
     * Applies a specified function to the corresponding elements of two collections, producing a collection of the results.
     * @function zip
     * @memberof arrgh.Enumerable
     * @instance
     * @param {arrgh.Enumerable} other - The collection to merge with.
     * @param {zipResultSelector} resultSelector - A function that creates a result value from two elements.
     * @returns {arrgh.Enumerable} - A collection that contains merged elements of two input collections.
     */
    enumProto.zip = function (other, resultSelector) {
        var self = this;
        return new Enumerable(function () {
            var sourceIterator = self.getIterator(),
                otherIterator = other.getIterator(),
                current;

            return new Iterator(function () {
                current = undefined;
                if (sourceIterator.moveNext() && otherIterator.moveNext()) {
                    current = resultSelector(sourceIterator.current(), otherIterator.current());
                    return true;
                }
                return false;
            }, function () {
                return current;
            });
        });
    };

    var listProto = List.prototype;

    listProto.add = function (elem) {
        this[this.length] = elem;
        this.length += 1;
    };

    listProto.addRange = function () {
        if (arguments.length === 1 && arguments[0].getIterator) {
            var self = this;
            arguments[0].forEach(function (elem) {
                self[self.length] = elem;
                self.length += 1;
            });
        } else {
            var arr = arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments,
                i;

            for (i = 0; i < arr.length; i += 1) {
                this[this.length] = arr[i];
                this.length += 1;
            }
        }
    };

    listProto.push = function () {
        this.addRange(arguments);
        return this.length;
    };

    listProto.remove = function (elem) {
        var len = this.length,
            i,
            found = false;
        for (i = 0; i < len; i += 1) {
            found = found || this[i] === elem;
            if (found) {
                this[i] = this[i + 1];
            }
        }
        if (found) {
            delete this[len - 1];
            this.length -= 1;
        }
        return found;
    };

    listProto.get = function (index) {
        return this[index];
    };

    listProto.count = function (predicate) {
        if (!predicate) {
            return this.length;
        } else {
            return Enumerable.prototype.count.call(this, predicate);
        }
    };

    listProto.elementAt = function (index) {
        if (index < 0 || index >= this.length) {
            throw new Error("Index was outside the bounds of the collection.");
        }
        return this[index];
    };

    listProto.elementAtOrDefault = function (index, defaultValue) {
        if (index < 0 || index >= this.length) {
            return defaultValue;
        }
        return this[index];
    };

    listProto.indexOf = function (searchElem, fromIndex) {
        fromIndex = fromIndex || 0;
        for (fromIndex; fromIndex < this.length; fromIndex += 1) {
            if (this[fromIndex] === searchElem) {
                return fromIndex;
            }
        }
        return -1;
    };

    listProto.last = function (predicate) {
        if (this.length > 0 && !predicate) {
            return this[this.length - 1];
        } else {
            return Enumerable.prototype.last.call(this, predicate);
        }
    };

    listProto.lastOrDefault = function (predicate, defaultValue) {
        if (typeof arguments[0] === "function") {
            return Enumerable.prototype.lastOrDefault.call(this, predicate, defaultValue);
        } else {
            if (this.length > 0) {
                return this[this.length - 1];
            } else {
                return arguments[0];
            }
        }
    };

    listProto.toArray = function () {
        return Array.prototype.slice.call(this);
    };

    var dictProto = Dictionary.prototype;

    var containsKey = function (hash, key, privs) {
        if (privs.keys.hasOwnProperty(hash)) {
            return privs.keys[hash].contains(key, function (x, y) {
                return privs.eqComparer.equals(x.key, y);
            });
        }
        return false;
    };

    dictProto.containsKey = function (key) {
        var hash = this._.eqComparer.getHash(key);
        return containsKey(hash, key, this._);
    };

    dictProto.add = function (key, value) {
        var hash = this._.eqComparer.getHash(key);
        if (containsKey(hash, key, this._)) {
            throw new Error("Key [" + key + "] is already present in the dictionary.");
        }

        if (!this._.keys[hash]) {
            this._.keys[hash] = new List();
            this._.hashes.add(hash);
        }
        this._.keys[hash].add({ key: key, value: value });

        this.length += 1;
    };

    var getKvpByKey = function (dict, hash, key, whenNotExists) {
        var elem;
        if (!dict._.keys.hasOwnProperty(hash)) {
            whenNotExists();
        } else {
            var def = {};
            elem = dict._.keys[hash].firstOrDefault(function (kvp) {
                return dict._.eqComparer.equals(kvp.key, key);
            }, def);
            if (elem === def) {
                whenNotExists();
            }
        }
        return elem;
    };

    dictProto.remove = function (key) {
        var hash = this._.eqComparer.getHash(key),
            notFound;

        var elem = getKvpByKey(this, hash, key, function () {
            notFound = true;
        });
        if (notFound) {
            return false;
        }

        var keys = this._.keys[hash];
        keys.remove(elem);
        if (!keys.any()) {
            delete this._.keys[hash];
            this._.hashes.remove(hash);
        }
        this.length -= 1;
        return true;
    };

    dictProto.get = function (key) {
        var hash = this._.eqComparer.getHash(key);
        return getKvpByKey(this, hash, key, function () {
            throw new Error("Key [" + key + "] was not found in the dictionary.");
        }).value;
    };

    var getKvps = function (selector) {
        var keys = new List(),
            prop;

        for (prop in this._.keys) {
            if (this._.keys.hasOwnProperty(prop)) {
                keys.addRange(this._.keys[prop].select(selector));
            }
        }
        return keys;
    };

    dictProto.getKeys = function () {
        return getKvps(function (kvp) {
            return kvp.key;
        });
    };

    dictProto.getValues = function () {
        return getKvps(function (kvp) {
            return kvp.value;
        });
    };

    dictProto.count = function (predicate) {
        if (!predicate) {
            return this.length;
        } else {
            return Enumerable.prototype.count.call(this, predicate);
        }
    };

    return {
        Enumerable: Enumerable,
        Dictionary: Dictionary,
        Iterator: Iterator,
        List: List
    };
}());