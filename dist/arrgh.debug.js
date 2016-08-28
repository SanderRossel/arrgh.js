/**
 * @namespace arrgh
 */
 var arrgh = (function () {
    "use strict";

    // Global types.

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
     * @param {*} element - The current element in the for loop.
     * @returns {Boolean} - Return whether the current element satisfies the condition.
     */

    /**
     * A function that returns the key value from an element.
     *
     * @callback keySelector
     * @param {*} element - The current element in the for loop.
     * @returns {*} - The value of the key for the current element.
     */

    // Collections
    var Enumerable;
    var List;
    var Dictionary;
    var OrderedEnumerable;
    var Lookup;

    // Iterators
    var ArrayIterator;
    var DictionaryIterator;
    var WhereIterator;
    var SelectIterator;
    var OrderedIterator;
    var UnionIterator;

    // Helper functions
    var Temp = function () {
        // This will shup up JSLint :-)
        // Minify will make it empty again.
        return;
    };
    function inherit(inheritor, inherited) {
        Temp.prototype = inherited.prototype;
        inheritor.prototype = new Temp();
        Temp.prototype = null;
        inheritor.prototype.constructor = inheritor;
    }

    function isArray(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    }

    function isNull(obj) {
        return obj === undefined || obj === null;
    }

    function alwaysTrue() {
        return true;
    }

    function identity(x) {
        return x;
    }

    function eqComparer(x, y) {
        return x === y;
    }

    function qsort(enumerable, comparer) {
        if (enumerable.count() < 2) {
            return enumerable;
        }

        var head = enumerable.first();
        var smaller = enumerable.where(function (item, index) {
            if (index === 0) {
                return false;
            }
            if (comparer) {
                return comparer(item, head) <= 0;
            } else {
                return item <= head;
            }
        });
        var bigger = enumerable.where(function (item, index) {
            if (index === 0) {
                return false;
            }
            if (comparer) {
                return comparer(item, head) > 0;
            } else {
                return item > head;
            }
        });

        var smallerSorted = qsort(smaller, comparer);
        var biggerSorted = qsort(bigger, comparer);
        return smallerSorted.unionAll(new Enumerable([head])).unionAll(biggerSorted);
    }

    // Iterators
    ArrayIterator = function (arr) {
        var len = arr.length;
        var index = -1;
        this.moveNext = function () {
            if (arr.length !== len) {
                throw "Collection was modified, enumeration operation may not execute.";
            }
            index += 1;
            return index < len;
        };
        this.current = function () {
            return arr[index];
        };
    };

    DictionaryIterator = function (dict) {
        var keys = dict.getKeys();
        var len = keys.count();
        var index = -1;
        var currentKey;
        this.moveNext = function () {
            if (dict.length !== len) {
                throw "Collection was modified, enumeration operation may not execute.";
            }
            index += 1;
            currentKey = keys[index];
            return index < len;
        };
        this.current = function () {
            return { key: currentKey, value: dict[currentKey] };
        };
    };

    WhereIterator = function (source, predicate) {
        predicate = predicate || alwaysTrue;

        var index = -1;
        var iterator = source.getIterator();
        var moveNext;
        moveNext = function () {
            index += 1;
            if (iterator.moveNext()) {
                if (predicate(iterator.current(), index)) {
                    return true;
                } else {
                    return moveNext();
                }
            } else {
                return false;
            }
        };
        this.moveNext = moveNext;
        this.current = iterator.current;
    };

    SelectIterator = function (source, selector) {
        selector = selector || identity;

        var index = -1;
        var iterator = source.getIterator();
        this.moveNext = function () {
            index += 1;
            return iterator.moveNext();
        };
        this.current = function () {
            return selector(iterator.current(), index);
        };
    };

    OrderedIterator = (function () {
        var getNextSource = function (source, currentSource) {
            var next = source;
            while (next._.source instanceof OrderedEnumerable && next._.source !== currentSource) {
                next = next._.source;
            }
            return next;
        };
        var compare = function (a, b) {
            // Treat undefined and null as
            // smaller than anything
            // and equal to each other.
            if (!isNull(a) && isNull(b)) {
                return 1;
            } else if (isNull(a) && !isNull(b)) {
                return -1;
            } else if (isNull(a) && isNull(b)) {
                return 0;
            } else if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        };
        return function (source) {
            var self = this;

            var arr;
            var len;
            var index = -1;
            self.moveNext = function () {
                if (index === -1) {
                    var parent = getNextSource(source);
                    // Make sure the source is fully evaluated by calling toArray().
                    arr = qsort(new Enumerable(parent._.source.toArray()), function (x, y) {
                        var result;
                        var cont = true;
                        var currentSource = parent;
                        while (cont) {
                            result = compare(currentSource._.keySelector(x), currentSource._.keySelector(y)) * currentSource._.descending;
                            if (result !== 0) {
                                break;
                            }
                            if (currentSource === source) {
                                cont = false;
                            } else {
                                currentSource = getNextSource(source, currentSource);
                            }
                        }
                        return result;
                    }).toArray();
                    len = arr.length;
                }
                index += 1;
                return index < len;
            };
            self.current = function () {
                return arr[index];
            };
        };
    }());

    UnionIterator = function (first, second, comparer) {
        var firstIterator = first.getIterator();
        var secondIterator = second.getIterator();
        var current;
        var l = new List();
        var moveFirst = true;

        var moveNext;
        var move = function (iterator) {
            var hasNext = iterator.moveNext();
            if (hasNext) {
                current = iterator.current();
                if (comparer && l.contains(current, comparer)) {
                    return moveNext(iterator);
                }
                l.add(current);
            }
            return hasNext;
        };

        moveNext = function () {
            if (moveFirst) {
                moveFirst = move(firstIterator);
                if (!moveFirst) {
                    // If there is no next item
                    // move on to the second iterator.
                    return moveNext();
                }
                return true;
            } else {
                return move(secondIterator);
            }
        };
        this.moveNext = moveNext;
        this.current = function () {
            return current;
        };
    };

    // Collections
    /**
     * Represents the base class for any collection.
     * @memberof arrgh
     * @constructor
     * @param {(array|function)} [iterator=[]] - An array to iterate over or a function that returns an iterator.
     */
     Enumerable = function () {
        var arg0 = arguments[0] || [];
        if (isArray(arg0)) {
            this.getIterator = function () {
                return new ArrayIterator(arg0);
            };
        } else {
            this.getIterator = arg0;
        }
    };

    var enumProto = Enumerable.prototype;

    /**
     * Performs the specified action on each element of the collection.
     * @param {forEachCallback} callback - The callback that is applied to each element in the enumerable.
     * @function forEach
     * @memberof arrgh.Enumerable
     * @instance
     */
     enumProto.forEach = function (callback) {
        var enumerator = this.getIterator();
        var cont = null;
        var index = 0;
        while ((isNull(cont) || cont) && enumerator.moveNext()) {
            cont = callback(enumerator.current(), index);
            index += 1;
        }
    };

    /**
     * Converts the collection to a JavaScript array.
     * @function toArray
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {array} - Returns a JavaScript array.
     */
     enumProto.toArray = function () {
        var arr = [];
        this.forEach(function (elem) {
            arr.push(elem);
        });
        return arr;
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

    enumProto.indexOf = function (searchElem, fromIndex) {
        var arr = this.toArray();
        if (Array.prototype.indexOf) {
            return arr.indexOf(searchElem, fromIndex);
        }

        var len = this.count();
        fromIndex = fromIndex || -1;

        if (len === 0 || fromIndex > len) {
            return -1;
        }

        var foundIndex = -1;
        var i;
        for (i = fromIndex; i < len; i += 1) {
            if (arr[i] === searchElem) {
                foundIndex = i;
                break;
            }
        }
        return foundIndex;
    };

    enumProto.filter = function (predicate) {
        var self = this;
        return new Enumerable(function () {
            return new WhereIterator(self, predicate);
        });
    };
    enumProto.where = enumProto.filter;

    enumProto.map = function (selector) {
        var self = this;
        return new Enumerable(function () {
            return new SelectIterator(self, selector);
        });
    };
    enumProto.select = enumProto.map;

    enumProto.first = function (predicate) {
        if (this.count() > 0) {
            var first;
            var found = false;
            this.forEach(function (elem) {
                if (predicate) {
                    if (predicate(elem)) {
                        first = elem;
                        found = true;
                        return false;
                    }
                } else {
                    first = elem;
                    found = true;
                    return false;
                }
            });
            if (!found) {
                throw "Collection contains no matching element.";
            }
            return first;
        } else {
            throw "Collection contains no elements.";
        }
    };

    enumProto.tail = function () {
        if (this.count() > 0) {
            var elems = [];
            this.forEach(function (elem, index) {
                if (index !== 0) {
                    elems.push(elem);
                }
            });
            return elems;
        } else {
            throw "Collection contains no elements.";
        }
    };

    enumProto.contains = function (elem, comparer) {
        comparer = comparer || eqComparer;

        var hasElem = false;
        this.forEach(function (item) {
            if (comparer(item, elem)) {
                hasElem = true;
                return false;
            }
        });
        return hasElem;
    };

    enumProto.unionAll = function (other) {
        var self = this;
        return new Enumerable(function () {
            return new UnionIterator(self, other);
        });
    };

    enumProto.union = function (other, comparer) {
        var self = this;
        return new Enumerable(function () {
            return new UnionIterator(self, other, comparer || eqComparer);
        });
    };

    enumProto.toList = function () {
        return new List(this.toArray());
    };

    enumProto.asEnumerable = function () {
        return new Enumerable(this.getIterator);
    };

    /**
     * Sorts the elements of a sequence in ascending order according to a key.
     * @function orderBy
     * @memberof arrgh.Enumerable
     * @instance
     * @param {keySelector} keySelector - A function to extract a key from an element.
     * @returns {arrgh.OrderedEnumerable} - Returns an ordered enumerable.
     */
    enumProto.orderBy = function (keySelector) {
        return new OrderedEnumerable(this, keySelector, false);
    };

    /**
     * Sorts the elements of a sequence in descending order according to a key.
     * @function orderByDescending
     * @memberof arrgh.Enumerable
     * @instance
     * @param {keySelector} keySelector - A function to extract a key from an element.
     * @returns {arrgh.OrderedEnumerable} - Returns an ordered enumerable.
     */
    enumProto.orderByDescending = function (keySelector) {
        return new OrderedEnumerable(this, keySelector, true);
    };

    /**
     * Represents a list of objects that can be accessed by index. Provides methods to manipulate the list.
     * @memberof arrgh
     * @constructor
     * @extends arrgh.Enumerable
     * @param {array} [arr] - An array whose elements are copied to the new list.
     */
     List = function (arr) {
        var self = this;
        Enumerable.call(self, function () {
            return new ArrayIterator(self);
        });

        arr = arr || [];
        self.length = arr.length;

        var i;
        for (i = 0; i < arr.length; i += 1) {
            self[i] = arr[i];
        }
    };
    inherit(List, Enumerable);

    var listProto = List.prototype;

    listProto.add = function (elem) {
        var len = this.length;
        if (this[len] !== undefined) {
            throw "Index " + len + " already declared.";
        }
        this[len] = elem;
        this.length += 1;
    };

    listProto.addRange = function () {
        if (arguments.length > 1 || isArray(arguments[0])) {
            var arr = arguments.length > 1 ? arguments : arguments[0];
            var i;
            for (i = 0; i < arr.length; i += 1) {
                this.add(arr[i]);
            }
        } else {
            var self = this;
            // Assume an Enumerable was passed as argument.
            arguments[0].forEach(function (elem) {
                self.add(elem);
            });
        }
    };

    listProto.push = function () {
        this.addRange(arguments);
        return this.length;
    };

    listProto.remove = function (elem) {
        var len = this.length;
        var i;
        var found = false;
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

    /**
     * Specifies how many elements the collection has, or how many satisfy a certain condition.
     * @function count
     * @memberof arrgh.List
     * @instance
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @returns {Number} - A number that specifies how many elements the collection has, or how many satisfy a certain condition.
     */
    listProto.count = function (predicate) {
        if (!predicate) {
            return this.length;
        } else {
            return Enumerable.prototype.count.call(this, predicate);
        }
    };

    listProto.toArray = function () {
        return Array.prototype.slice.call(this);
    };

    /**
     * Represents a collection of keys and values.
     * @memberof arrgh
     * @constructor
     * @extends arrgh.Enumerable
     */
    Dictionary = function () {
        var self = this;
        Enumerable.call(self, function () {
            return new DictionaryIterator(self);
        });

        self.length = 0;
        self._ = {
            keys: {},
            values: new List()
        };
    };
    inherit(Dictionary, Enumerable);

    var dictProto = Dictionary.prototype;

    dictProto.hasKey = function (key) {
        return this._.keys.hasOwnProperty(key);
    };

    dictProto.add = function (key, value) {
        if (this.hasKey(key)) {
            throw "Key is already present in the dictionary.";
        }
        this[key] = value;
        this._.keys[key] = value;
        this._.values.add(value);
        this.length += 1;
    };

    dictProto.getKeys = function () {
        var list = new List();
        var prop;
        for (prop in this._.keys) {
            if (this._.keys.hasOwnProperty(prop)) {
                list.add(prop);
            }
        }
        return list;
    };

    dictProto.getValues = function () {
        return this._.values.toList();
    };

    /**
     * Specifies how many elements the collection has, or how many satisfy a certain condition.
     * @function count
     * @memberof arrgh.Dictionary
     * @instance
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @returns {Number} - A number that specifies how many elements the collection has, or how many satisfy a certain condition.
     */
    dictProto.count = function (predicate) {
        if (!predicate) {
            return this.length;
        } else {
            return Enumerable.prototype.count.call(this, predicate);
        }
    };

    /**
     * Represents an ordered collection that can be iterated over.
     * @memberof arrgh
     * @constructor
     * @param {arrgh.Enumerable} source - The collection that needs to be sorted.
     * @param {keySelector} keySelector - A function to extract the key from an element.
     * @param {Boolean} descending - Indicated wheter the collection needs to be sorted ascending or descending.
    */
    OrderedEnumerable = function (source, keySelector, descending) {
        var self = this;
        Enumerable.call(this, function () {
            return new OrderedIterator(self);
        });
        self._ = {
            source: source,
            keySelector: keySelector || identity,
            descending: descending ? -1 : 1
        };
    };
    inherit(OrderedEnumerable, Enumerable);

    var ordProto = OrderedEnumerable.prototype;

    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * @function thenBy
     * @memberof arrgh.OrderedEnumerable
     * @instance
     * @param {keySelector} keySelector - A function to extract a key from an element.
     * @returns {arrgh.OrderedEnumerable} - Returns an ordered enumerable.
     */
    ordProto.thenBy = function (keySelector) {
        return new OrderedEnumerable(this, keySelector, false);
    };

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * @function thenByDescending
     * @memberof arrgh.OrderedEnumerable
     * @instance
     * @param {keySelector} keySelector - A function to extract a key from an element.
     * @returns {arrgh.OrderedEnumerable} - Returns an ordered enumerable.
     */
    ordProto.thenByDescending = function (keySelector) {
        return new OrderedEnumerable(this, keySelector, true);
    };

    return {
        Enumerable: Enumerable,
        List: List,
        Dictionary: Dictionary
    };
}());