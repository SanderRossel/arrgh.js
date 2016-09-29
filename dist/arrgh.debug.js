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
     * @param {*} element - The element to test for a condition.
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

    // Collections
    var Enumerable;
    var List;
    var Dictionary;
    var OrderedEnumerable;
    var Lookup;

    // Helper functions
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

    function defaultCompare (x, y) {
        // Treat undefined as smaller than null
        // and both as smaller than anything else.
        var noVal = function (a, b, val) {
        	if (a !== val && b === val) {
        		return 1;
        	} else if (a === val && b !== val) {
        		return -1;
        	} else {
        		return 0;
        	}
        };
        if (isNull(x) || isNull(y)) {
        	return noVal(x, y, undefined) || noVal(x, y, null);
        }

        if (x > y) {
        	return 1;
        } else if (x < y) {
        	return -1;
        } else {
        	return 0;
        }
    }

    var defaultEqComparer = {
    	equals: function (x, y) {
    		return x === y;
    	},
    	getHash: function (obj) {
    		var hash;
    		if (obj === null) {
    			hash = "null";
    		} else if (obj === undefined) {
    			hash = "undefined";
    		} else {
    			hash = typeof obj.getHash === "function"
    			? obj.getHash()
    			: (typeof obj.toString === "function" ? obj.toString() : Object.prototype.toString.call(obj));
    		}
    		return hash;
    	}
    };

    function ensureEqComparer (eqComparer) {
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

    function qsort(enumerable, compare) {
    	if (enumerable.count() < 2) {
    		return enumerable;
    	}

    	var head = enumerable.first();
    	var smaller = enumerable.where(function (item, index) {
    		if (index === 0) {
    			return false;
    		}
    		return compare(item, head) <= 0;
    	});
    	var bigger = enumerable.where(function (item, index) {
    		if (index === 0) {
    			return false;
    		}
    		return compare(item, head) > 0;
    	});

    	var smallerSorted = qsort(smaller, compare);
    	var biggerSorted = qsort(bigger, compare);
    	return smallerSorted.unionAll(new Enumerable([head])).unionAll(biggerSorted);
    }

    // Iterators
    var ArrayIterator = function (arr) {
    	var len = arr.length;
    	var index = -1;
    	this.moveNext = function () {
    		if (arr.length !== len) {
    			throw new Error("Collection was modified, enumeration operation may not execute.");
    		}
    		index += 1;
    		return index < len;
    	};
    	this.current = function () {
    		return arr[index];
    	};
    };

    var DictionaryIterator = function (dict) {
    	var len = dict.length;
    	var current;
    	var hashIndex = -1;
    	var currentKeys;
    	var keyIndex = -1;
    	this.moveNext = function () {
    		if (dict.length !== len) {
    			throw new Error("Collection was modified, enumeration operation may not execute.");
    		}
    		current = undefined;
    		if (!currentKeys || keyIndex === currentKeys.length - 1) {
    			hashIndex += 1;
    			if (hashIndex < dict._.hashes.length) {
    				var hash = dict._.hashes[hashIndex];
    				currentKeys = dict._.keys[hash];
    				keyIndex = 0;
    				current = currentKeys[keyIndex];
    			}
    		} else {
    			keyIndex += 1;
    			current = currentKeys[keyIndex];
    		}
    		return hashIndex <= dict._.hashes.length - 1;
    	};
    	this.current = function () {
    		return current;
    	};
    };

    var WhereIterator = function (source, predicate) {
    	predicate = predicate || alwaysTrue;

    	var index = -1;
    	var iterator = source.getIterator();
    	var moveNext;
    	var current;
    	moveNext = function () {
    		index += 1;
    		if (iterator.moveNext()) {
    			current = iterator.current();
    			if (predicate(current, index)) {
    				return true;
    			} else {
    				return moveNext();
    			}
    		} else {
    			current = undefined;
    			return false;
    		}
    	};
    	this.moveNext = moveNext;
    	this.current = function () {
    		return current;
    	};
    };

    var DefaultIfEmptyIterator = function (source, defaultValue) {
    	var iterator = source.getIterator();
    	var current;
    	var empty = true;
    	this.moveNext = function () {
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
    	};
    	this.current = function () {
    		return current;
    	};
    };

    var SelectIterator = function (source, selector) {
    	selector = selector || identity;

    	var index = -1;
    	var iterator = source.getIterator();
    	var next;
    	this.moveNext = function () {
    		index += 1;
    		next = iterator.moveNext();
    		return next;
    	};
    	this.current = function () {
    		var current;
    		if (next) {
    			current = selector(iterator.current(), index);
    		}
    		return current;
    	};
    };

    var OrderedIterator = (function () {
    	var getNextSource = function (source, currentSource) {
    		var next = source;
    		while (next._.source instanceof OrderedEnumerable && next._.source !== currentSource) {
    			next = next._.source;
    		}
    		return next;
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
                    		result = currentSource._.compare(currentSource._.keySelector(x), currentSource._.keySelector(y)) * currentSource._.descending;
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
            	return arr ? arr[index] : undefined;
            };
        };
    }());

    var UnionIterator = function (first, second, eqComparer) {
    	var firstIterator = first.getIterator();
    	var secondIterator = second.getIterator();
    	var current;
    	var moveFirst = true;
    	var d;
    	var alreadyUnioned;
    	if (eqComparer) {
    		d = new Dictionary(eqComparer);

    		alreadyUnioned = function (elem) {
    			if (d.containsKey(elem)) {
    				return true;
    			} else {
    				d.add(elem);
    				return false;
    			}
    		};
    	}

    	var moveNext;
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
            } else {
            	return move(secondIterator);
            }
        };
        this.moveNext = moveNext;
        this.current = function () {
        	return current;
        };
    };

    var ExceptIterator = function (source, other, eqComparer) {
    	var iterator = source.getIterator();
    	var d = new Dictionary(eqComparer);
    	other.forEach(function (elem) {
    		if (!d.containsKey(elem)) {
    			d.add(elem);
    		}
    	});
    	var moveNext;
    	var current;
    	moveNext = function () {
    		if (iterator.moveNext()) {
    			current = iterator.current();
    			if (!d.containsKey(current)) {
    				d.add(current);
    				return true;
    			} else {
    				return moveNext();
    			}
    		}
    		current = undefined;
    		return false;
    	};
    	this.moveNext = moveNext;
    	this.current = function () {
    		return current;
    	};
    };

    var LookupIterator = function (dictionary) {
    	var iterator = dictionary.getIterator();
    	this.moveNext = iterator.moveNext;
    	this.current = function () {
    		var current = iterator.current();
    		if (isNull(current)) {
    			return current;
    		}
    		var group = current.value.asEnumerable();
    		group.key = current.key;
    		return group;
    	};
    };

    var GroupByIterator = function (source, keySelector, elementSelector, resultSelector, eqComparer) {
    	elementSelector = elementSelector || identity;
    	eqComparer = ensureEqComparer(eqComparer);

    	var iterator = source.toLookUp(keySelector, elementSelector, eqComparer).getIterator();
    	this.moveNext = iterator.moveNext;
    	this.current = function () {
    		var current = iterator.current();
    		if (isNull(current)) {
    			return current;
    		}
    		if (resultSelector) {
    			return resultSelector(current.key, current);
    		}
    		return current;
    	};
    };

    var GroupJoinIterator = function (source, inner, outerKeySelector, innerKeySelector, resultSelector, eqComparer) {
    	eqComparer = ensureEqComparer(eqComparer);

    	var iterator = source.getIterator();
    	var innerLookup = inner.toLookUp(innerKeySelector, eqComparer);
    	var moved = false;

    	this.moveNext = function () {
    		moved = iterator.moveNext();
    		return moved;
    	};
    	this.current = function () {
    		if (!moved) {
    			return undefined;
    		}
    		var current = iterator.current();
    		var outerKey = outerKeySelector(current);
    		return resultSelector(current, innerLookup.get(outerKey));
    	};
    };

    var IntersectIterator = function (source, other, eqComparer) {
    	var iterator = source.getIterator();
    	var d = new Dictionary(eqComparer);
    	other.forEach(function (elem) {
    		if (!d.containsKey(elem)) {
    			d.add(elem);
    		}
    	});
    	var moveNext;
    	var current;
    	moveNext = function () {
    		if (iterator.moveNext()) {
    			current = iterator.current()
    			if (d.containsKey(current)) {
    				return d.remove(current);
    			} else {
    				return moveNext();
    			}
    		}
    		current = undefined;
    		return false;
    	};
    	this.moveNext = moveNext;
    	this.current = function () {
    		return current;
    	};
    };

    var JoinIterator = function (source, inner, outerKeySelector, innerKeySelector, resultSelector, eqComparer) {
    	eqComparer = ensureEqComparer(eqComparer);

    	var outerIterator = source.getIterator();
    	var innerLookup = inner.toLookUp(innerKeySelector, eqComparer);
    	var moved;
    	var innerIterator;
    	var innerMoved;

    	var outerCurrent;
    	var innerCurrent;
    	var moveNext;
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
    	this.moveNext = moveNext;
    	this.current = function () {
    		if (!moved) {
    			return undefined;
    		}
    		return resultSelector(outerCurrent, innerCurrent);
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
     	var iterable;
     	if (arguments.length > 1) {
     		iterable = Array.prototype.slice.call(arguments);
     	} else {
     		iterable = arguments[0] || [];
     	}

     	if (isArray(iterable)) {
     		this.getIterator = function () {
     			return new ArrayIterator(iterable);
     		};
     	} else {
     		this.getIterator = iterable;
     	}
     };

     var enumProto = Enumerable.prototype;

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
     	this.forEach(function (elem) {
     		if (predicate) {
     			any = predicate(elem);
     			return !any;
     		} else {
     			any = true;
     			return false;
     		}
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
     * Computes the average of a collection of values.<br />
     * If values are not numerics the result may be NaN or something unexpected (e.g. "2" + 2 will results in an average of 11 ("2" + 2 = 22, 22 / 2 = 11)).
     * @param {selector} [selector] - A function that projects an element into a new form.
     * @function average
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {Number} - The average of all values in the collection, or NaN.
     * @throws Throws an error if the collection contains no elements.
     */
     enumProto.average = function (selector) {
     	selector = selector || identity;

     	var sum = 0;
     	var count = 0;
     	this.forEach(function (elem) {
     		sum += selector(elem);
     		count += 1;
     	});

     	if (count === 0) {
     		throw new Error("Collection contains no elements.");
     	}

     	return sum / count;
     };

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
     		return new DefaultIfEmptyIterator(self, defaultValue);
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

     	var elem;
     	var elemSet = false;
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

     var empty = new Enumerable();
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
     		return new ExceptIterator(self, other, eqComparer);
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
     	if (!this.any()) {
     		throw new Error("Collection contains no elements.");
     	}
     	var def = {};
     	var elem = this.firstOrDefault(predicate, def);
     	if (elem === def) {
     		throw new Error("Collection contains no matching element.");
     	}
     	return elem;
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
     enumProto.firstOrDefault = function () {
     	var predicate = typeof arguments[0] === "function" ? arguments[0] : undefined;
     	var defaultValue = predicate ? arguments[1] : arguments[0];
     	if (this.any()) {
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
     			return defaultValue;
     		}
     		return first;
     	} else {
     		return defaultValue;
     	}
     };

    /**
     * Performs the specified action on each element of the collection.
     * @param {forEachCallback} callback - The callback that is applied to each element in the enumerable.
     * @function forEach
     * @memberof arrgh.Enumerable
     * @instance
     */
     enumProto.forEach = function (callback) {
     	var iterator = this.getIterator();
     	var cont = null;
     	var index = 0;
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
     */
     enumProto.groupBy = function (keySelector) {
     	var elementSelector;
     	var resultSelector;
     	var eqComparer;

     	var args = Array.prototype.slice.call(arguments);
     	var setArg = function (index) {
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
     	var self = this;
     	return new Enumerable(function () {
     		return new GroupByIterator(self, keySelector, elementSelector, resultSelector, eqComparer);
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
     */
     enumProto.groupJoin = function (inner, outerKeySelector, innerKeySelector, resultSelector, eqComparer) {
     	var self = this;
     	return new Enumerable(function () {
     		return new GroupJoinIterator(self, inner, outerKeySelector, innerKeySelector, resultSelector, eqComparer);
     	});
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
     		return new IntersectIterator(self, other, eqComparer);
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
     */
     enumProto.join = function (inner, outerKeySelector, innerKeySelector, resultSelector, eqComparer) {
     	var self = this;
     	return new Enumerable(function () {
     		return new JoinIterator(self, inner, outerKeySelector, innerKeySelector, resultSelector, eqComparer);
     	});
     };

    /**
     * Returns the last element in a collection, or the last element that satisfies a condition.
     * @function last
     * @memberof arrgh.Enumerable
     * @instance
     * @param {predicate} [predicate] - A function to test each element for a condition.
     * @returns {*} - Returns the last element of the collection, or the last element that satisfies a condition.
     * @throws Throws an error if the collection is empty or when no element matches the condition.
     */
     enumProto.last = function (predicate) {
     	if (!this.any()) {
     		throw new Error("Collection contains no elements.");
     	}
     	var def = {};
     	var elem = this.lastOrDefault(predicate, def);
     	if (elem === def) {
     		throw new Error("Collection contains no matching element.");
     	}
     	return elem;
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
     enumProto.lastOrDefault = function () {
     	var predicate = typeof arguments[0] === "function" ? arguments[0] : undefined;
     	var defaultValue = predicate ? arguments[1] : arguments[0];
     	if (this.any()) {
     		var last;
     		var found = false;
     		this.forEach(function (elem) {
     			if (predicate) {
     				if (predicate(elem)) {
     					last = elem;
     					found = true;
     				}
     			} else {
     				last = elem;
     				found = true;
     			}
     		});
     		if (!found) {
     			return defaultValue;
     		}
     		return last;
     	} else {
     		return defaultValue;
     	}
     };

    /**
     * Returns the maximum value in a collection.<br />
     * If values are non numeric results may vary.
     * @param {selector} [selector] - A function that projects an element into a new form.
     * @function max
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {*} - Returns the maximum value in the collection.
     */
     enumProto.max = function (selector) {
     	selector = selector || identity;
     	var max;
     	var first = true;
     	this.forEach(function (elem) {
     		elem = selector(elem);
     		if (!isNull(elem)) {
     			if (first) {
     				first = false;
     				max = elem;
     			} else {
     				if (defaultCompare(elem, max) > 0) {
     					max = elem;
     				}
     			}
     		}
     	});
     	return max;
     };

    /**
     * Returns the minimum value in a collection.<br />
     * If values are non numeric results may vary.
     * @param {selector} [selector] - A function that projects an element into a new form.
     * @function max
     * @memberof arrgh.Enumerable
     * @instance
     * @returns {*} - Returns the minimum value in the collection.
     */
     enumProto.min = function (selector) {
     	selector = selector || identity;
     	var min;
     	var first = true;
     	this.forEach(function (elem) {
     		elem = selector(elem);
     		if (!isNull(elem)) {
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
     	switch (type)
     	{
     		case Boolean: {
     			typeName = typeof true;
     			break;
     		} case Number: {
     			typeName = typeof 0;
     			break;
     		} case String: {
     			typeName = typeof "";
     			break;
     		} case Function: {
     			typeName = typeof function () { return; };
     			break;
     		} case Object: {
     			typeName = typeof {};
     			getType = function (elem) {
     				return elem && typeof elem === typeName;
     			};
     			break;
     		} case undefined: {
     			typeName = typeof undefined;
     			break;
     		} case null: {
     			getType = function (elem) {
     				return elem === null;
     			};
     			break;
     		} default: {
     			getType = function (elem) {
     				return elem instanceof type;
     			};
     			break;
     		}
     	}
     	var getType = getType || function (elem) {
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

    var RangeIterator = function (start, count) {
    	count = isNull(count) ? Number.MAX_SAFE_INTEGER - start + 1 : count;
     	if (count < 0) {
     		throw new Error("Count cannot be lower than 0.");
     	}
     	var index = -1;
     	this.moveNext = function () {
     		index += 1;
     		return isNull(count) || index !== count;
     	};
     	this.current = function () {
     		if (index === -1 || index === count) {
     			return undefined;
     		}
     		return start + index;
     	};
    };

     /**
     * Generates a collection of integral numbers within a specified range.
     * @function empty
     * @memberof arrgh.Enumerable
     * @static
     * @param {Number} start - The value of the first integer in the collection.
     * @param {Number} [count=Number.MAX_SAFE_INTEGER] - The number of sequential integers to generate.
     * @returns {arrgh.Enumerable} - A collection that contains a range of sequential integral numbers.
     */
    Enumerable.range = function (start, count) {
     	return new Enumerable(function () {
     		return new RangeIterator(start, count);
     	});
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

     enumProto.toLookUp = function (keySelector, elementSelector, eqComparer) {
     	return new Lookup(this, keySelector, elementSelector, eqComparer);
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

     enumProto.unionAll = function (other) {
     	var self = this;
     	return new Enumerable(function () {
     		return new UnionIterator(self, other);
     	});
     };
     enumProto.concat = enumProto.unionAll;

     enumProto.union = function (other, eqComparer) {
     	var self = this;
     	return new Enumerable(function () {
     		return new UnionIterator(self, other, ensureEqComparer(eqComparer));
     	});
     };

     enumProto.asEnumerable = function () {
     	return new Enumerable(this.getIterator);
     };

     enumProto.toList = function () {
     	return new List(this);
     };

     enumProto.toDictionary = function (keySelector, valueSelector) {
     	keySelector = keySelector || identity;
     	valueSelector = valueSelector || identity;

     	var d = new Dictionary();
     	this.forEach(function (elem) {
     		d.add(keySelector(elem), valueSelector(elem));
     	});
     	return d;
     };

    /**
     * Represents a list of objects that can be accessed by index. Provides methods to manipulate the list.
     * @memberof arrgh
     * @constructor
     * @extends arrgh.Enumerable
     * @param {array|arrgh.Enumerable} [arr=[]] - An array or Enumerable whose elements are copied to the new list.
     */
     List = function () {
     	var self = this;
     	Enumerable.call(self, function () {
     		return new ArrayIterator(self);
     	});

     	var iterable;
     	if (arguments.length > 1) {
     		iterable = Array.prototype.slice.call(arguments);
     	} else {
     		iterable = arguments[0] || [];
     	}

     	if (isArray(iterable)) {
     		self.length = iterable.length;
     		var i;
     		for (i = 0; i < iterable.length; i += 1) {
     			self[i] = iterable[i];
     		}
        } else { // Enumerable
        	self.length = 0;
        	iterable.forEach(function (elem, index) {
        		self[index] = elem;
        		self.length += 1;
        	});
        }
    };
    inherit(List, Enumerable);

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
    		var arr = (arguments.length === 1 && isArray(arguments[0])) ? arguments[0] : arguments;
    		var i;
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
     * @param {equalityComparer} [eqComparer=(===)] - An object that tests if two objects are equal.
     */
     Dictionary = function (eqComparer) {
     	var self = this;
     	Enumerable.call(self, function () {
     		return new DictionaryIterator(self);
     	});

     	self.length = 0;
     	self._ = {
     		eqComparer: ensureEqComparer(eqComparer),
     		hashes: new List(),
     		keys: {}
     	};
     };
     inherit(Dictionary, Enumerable);

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
     	}
     	this._.keys[hash].add({ key: key, value: value });
     	this._.hashes.add(hash);

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
     	var hash = this._.eqComparer.getHash(key);
     	var notFound;

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
     	var keys = new List();
     	var prop;
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
     * @param {compare} [compare] - A function that tests if an object is smaller than, greater than or equal to another object.
     * @param {Boolean} descending - Indicated wheter the collection needs to be sorted ascending or descending.
     */
     OrderedEnumerable = function (source, keySelector, compare, descending) {
     	var self = this;
     	Enumerable.call(this, function () {
     		return new OrderedIterator(self);
     	});
     	self._ = {
     		source: source,
     		keySelector: keySelector || identity,
     		compare: compare || defaultCompare,
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
     * @param {compare} [compare] - A function that tests if an object is smaller than, greater than or equal to another object.
     * @returns {arrgh.OrderedEnumerable} - Returns an ordered enumerable.
     */
     ordProto.thenBy = function (keySelector, compare) {
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
     ordProto.thenByDescending = function (keySelector, compare) {
     	return new OrderedEnumerable(this, keySelector, compare, true);
     };

     Lookup = function (source, keySelector) {
     	var d;
     	Enumerable.call(this, function () {
     		return new LookupIterator(d);
     	});

     	var elementSelector;
     	var eqComparer;

     	if (typeof arguments[2] === "function") {
     		elementSelector = arguments[2];
     		eqComparer = arguments[3];
     	} else {
     		eqComparer = arguments[2];
     	}
     	elementSelector = elementSelector || identity;

     	d = new Dictionary(ensureEqComparer(eqComparer));
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

     return {
     	Enumerable: Enumerable,
     	List: List,
     	Dictionary: Dictionary
     };
 }());