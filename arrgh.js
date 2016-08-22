var arrgh = (function () {
	"use strict";

	var inherit = function (inheritor, inherited) {
		var Temp = function () {};
		Temp.prototype = inherited.prototype;
		inheritor.prototype = new Temp();
		inheritor.prototype.constructor = inheritor;
	};

	var isNull = function (obj) {
		return obj === undefined || obj === null;
	};

	var isNotNull = function (obj) {
		return !isNull(obj);
	};

	var alwaysTrue = function () {
		return true;
	};

	var identity = function (x) {
		return x;
	};

	var isArray = function (o) {
		return Object.prototype.toString.call(o) === "[object Array]";
	};

	var eqComparer = function (x, y) {
		return x === y;
	};

	var WhereIterator = function (source, predicate) {
		predicate = predicate || alwaysTrue;

		var index = -1;
		var iterator = source.getIterator();
		var moveNext = function () {
			if (iterator.moveNext()) {
				if (predicate(iterator.current(), iterator.getIndex())) {
					index += 1;
					return true;
				} else {
					return moveNext();
				}
			} else {
				return false;
			}
		};

		this.getIndex = function () {
			return index;
		};		
		this.moveNext = moveNext;
		this.current = iterator.current;
	};

	var SelectIterator = function (source, selector) {
		selector = selector || identity;

		var iterator = source.getIterator();
		this.getIndex = iterator.getIndex;
		this.moveNext = iterator.moveNext;
		this.current = function () {
			return selector(iterator.current(), iterator.getIndex());
		};
	};

	var Iterator = function (arr) {
		var len = arr.length;
		var index = -1;
		this.getIndex = function () {
			return index;
		};
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

	var Enumerable = function (getIterator) {
		this.getIterator = getIterator;
	};

	var eproto = Enumerable.prototype;

	eproto.forEach = function (callback) {
		var enumerator = this.getIterator();
		var cont = null;
		while ((isNull(cont) || cont) && enumerator.moveNext()) {
			cont = callback(enumerator.current(), enumerator.getIndex());
		}
	};

	eproto.toArray = function () {
		var arr = [];
		this.forEach(function (elem) {
			arr.push(elem);
		});
		return arr;
	};

	eproto.count = function (predicate) {
		var count = 0;
		predicate = predicate || alwaysTrue;

		this.forEach(function (elem) {
			if (predicate(elem)) {
				count += 1;
			}
		});
		return count;
	};
	eproto.length = eproto.count;

	eproto.indexOf = function (searchElem, fromIndex) {
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

	eproto.filter = function (predicate) {
		var self = this;
		return new Enumerable(function () {
			return new WhereIterator(self, predicate);
		});
	};
	eproto.where = eproto.filter;

	eproto.map = function (selector) {
		var self = this;
		return new Enumerable(function () {
			return new SelectIterator(self, selector);
		});
	};
	eproto.select = eproto.map;

	eproto.first = function (predicate) {
		if (this.length() > 0) {
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

	eproto.tail = function () {
		if (this.length() > 0) {
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

	eproto.contains = function (elem, comparer) {
		comparer = comparer || eqComparer;

		var hasElem = false;
		this.forEach(function (item) {
			if (item === elem) {
				hasElem = true;
				return false;
			}
		});
		return hasElem;
	};

	eproto.unionAll = function (other) {
		return new Enumerable(function () {
			return new UnionIterator(this, other);
		});
	};

	eproto.union = function (other, comparer) {
		return new Enumerable(function () {
			return new UnionIterator(this, other, comparer || eqComparer);
		});
	};

	var List = function (arr) {
		arr = arr || [];
		Enumerable.call(this, function () {
			return new Iterator(arr);
		});

		var self = this;
		this.forEach(function (elem, index) {
			self[index] = elem;
		});
		this.toArray = function () {
			return arr;
		};
	};

	inherit(List, Enumerable);

	var lproto = List.prototype;

	lproto.add = function (elem) {
		var arr = this.toArray();
		this[arr.length] = elem;
		arr.push(elem);
	};

	lproto.addRange = function (collection) {
		if (isArray(collection)) {
			var i;
			for (i = 0; i < collection.length; i += 1) {
				this.add(collection[i]);
			}
		} else {
			var self = this;
			collection.forEach(function (elem) {
				self.add(elem);
			});
		}
	};

	lproto.push = function () {
		var i;
		for (i = 0; i < arguments.length; i += 1) {
			this.add(arguments[i]);
		}
	};

	lproto.remove = function (elem) {
		var index = this.indexOf(elem);
		if (index >= 0) {
			var arr = this.getArray();
			arr.splice(index, 1);
			var i = arr.length - 1;
			while (i >= index) {
				this[i] = arr[i];
				i -= 1;
			}
			delete this[arr.length];
			return true;
		}
		return false;
	};

	eproto.toList = function () {
		return new List(this.toArray());
	};

	var qsort = function (enumerable, comparer) {
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
		var bigger = enumerable.where(function (item) {
			if (index === 0) {
				return false;
			}
			if (comparer) {
				return comparer(item, head) > 0;
			} else {
				return item > head;
			}
		});
		return qsort(smaller, comparer).unionAll([head]).unionAll(qsort(bigger, comparer));
	};

	var OrderedEnumerable = function (arr, keySelector, descending, parent) {
		Enumerable.call(this, arr)
		var self = this;
		this.list = list;
		this.parent = parent;
		this.keySelector = keySelector;
		this.descending = descending;
		this._getArray = function () {

			var getParent = function (parent) {
				var prevParent = self;
				while (prevParent.parent && prevParent.parent !== parent) {
					prevParent = prevParent.parent;
				}
				return prevParent;
			};

			return qsort(arr, function (x, y) {
				var topParent = getParent();
				var keyX = topParent.keySelector(x);
				var keyY = topParent.keySelector(y);
				var result = getResult(keyX, keyY, topParent.descending);
				while (result === 0 && topParent !== self) {
					topParent = getParent(topParent);
					keyX = topParent.keySelector(x);
					keyY = topParent.keySelector(y);
					result = getResult(keyX, keyY, topParent.descending);
				}
				return result;
			}).getArray();
		};
	};

	inherit(OrderedEnumerable, Enumerable);

	var oproto = OrderedEnumerable.prototype;
	oproto.orderBy = function (keySelector) {
		return new OrderedEnumerable(this, keySelector, false, null);
	};

	oproto.orderByDescending = function (keySelector) {
		return new OrderedEnumerable(this, keySelector, true, null);
	};

	return {
		asEnumerable: function (arr) {
			arr = (arr && arr.slice()) || [];
			return new Enumerable(function () {
				return new Iterator(arr);
			});
		},
		asList: function (arr) {
			arr = (arr && arr.slice()) || [];
			return new List(arr);
		}
	};
}());