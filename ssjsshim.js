(function(thecontext) {

thecontext.process = thecontext.process || {
	env: {}
};


var logger = function(message) {
	print((this ? '[' + this.toString().toUpperCase() + ']: ' : '') + message);
};	
thecontext.console = thecontext.console || {
	debug : logger.bind('debug'),
	error : logger.bind('error'),
	info  : logger.bind('info'),
	log   : logger.bind('log'),
	warn  : logger.bind('warn')
};
	
Array.isArray = function(object) {
	return (object ? (object instanceof Array) : false);
};

Array.from = function(object, mapFunction, thisobject) {
	var arr = [];
	switch(object.constructor) {
		case Array  : { arr = object; break; }
		case String : { arr = object.split(""); break; }
		default     : {
			if(object.length && object[0] !== undefined) {
				for(i in object) {
					arr.push(object[i]);
				}
			}
		}
	}
	if(mapFunction instanceof Function) {
		arr = arr.map(mapFunction, thisobject);
	}
	return arr;
};

Array.prototype.filter = function(callable, thisobject) {
	if(!callable || typeof(callable) !== 'function') {
		throw new TypeError(callable + ' is not a function.');
	};

	var arr = Array.from(this);
	var filtered = [];
	for(var i = 0; i < arr.length; i++) {
		if(callable.call(thisobject, arr[i], i, this)) {
			filtered.push(arr[i]);
		}
	}
	return filtered;
};

Array.prototype.indexOf = function(matchable, thisobject) {
	var arr = Array.from(this);

	for(var i = 0; i < arr.length; i++) {
		if(arr[i] == matchable) {
			return i;
		}
	}
	return -1;
};

Array.prototype.forEach = function(callable, thisobject) {
	if(!callable || (typeof(callable) != 'function')) {
		throw new TypeError(callable + ' is not a function.');
	};
	var arr = Array.from(this);

	for(var i = 0; i < arr.length; i++) {
		callable.call(thisobject, arr[i], i, this);
	}
};

Array.prototype.map = function(callable, thisobject) {
	if(!callable || (typeof(callable) != 'function')) {
		throw new TypeError(callable + ' is not a function.');
	};

	var arr = Array.from(this);
	
	var mapped = [];
	for(var i = 0; i < arr.length; i++) {
		mapped.push(callable.call(thisobject, arr[i], i, this));
	}
	return mapped;
};

Array.prototype.reduce = function(callback, initialValue) {
	if(!callback || (typeof(callback) != 'function')) {
		throw new TypeError(callback + ' is not a function');
	}
	
	var arr = Array.from(this);
	
	if(arr.length == 0 && !initialValue) {
		throw new TypeError('Reduce of empty array with no initial value');
	}
	
	var value = initialValue || null;
	for(var i = 0; i < arr.length; i++) {
		value = callback(value, arr[i], i, arr);
	}
	return value;
};

Array.prototype.slice.apply = function(thisobject, args) {
  	if(!args) { args = []; }
  
	return Array.prototype.slice.call(thisobject, args[0], args[1]);
};

Array.prototype.slice.call = function(thisobject, start, end) {
	if(thisobject === undefined || thisobject == null) {
		throw new TypeError('Cannot convert undefined or null to object');
	}
	return Array.from(thisobject).slice(start, end);
};

Array.prototype.some = function(callable, thisobject) {
	if(!callable) {
		throw new TypeError(callable + ' is not a function.');
	};

	var arr = Array.from(this);
	
	var filtered = [];
	for(var i in arr) {
		if(callable.call(thisobject, arr[i], i, this)) {
			return true;
		}
	}
	return false;
};

Boolean.call = function(thisobject, value) {
	return Boolean(value);
};

Date.now = function() {
	return (new Date()).getTime();
};

thecontext.JSON = thecontext.JSON || {
	parse : function(value) {
		if(/^\[.*\]$/.test(value)) {
			return fromJson('{"value": ' + value + '}').value;
		} else {
			return fromJson(value);
		}
	},
	stringify : function(object) {
		return toJson(object);
	}
};

var Empty = function Empty() {};

Function.prototype.bind = function(thisobject) {
	var target = this;
	var args   = Array.prototype.slice.call(arguments, 1);
	var bound  = function() {
		var arguments_array = Array.prototype.slice.call(arguments).concat(args);
		
		if (thisobject) {
			return target.apply(thisobject, arguments_array);
		} else {
			return target(arguments_array);
		}
	};
	
	return bound;
};

Object.assign = function(target) {
	var sources = Array.prototype.slice.call(arguments, 1);
	
	var is_integer = function(value) {
		
	};
	
	for (var i in sources) {
		if (sources[i]) {
			for (var j in sources[i]) {
				var index = parseInt(j);
				if (Array.isArray(target) && !isNaN(index) && (String(index) == j)) {
					target[index] = sources[i][j];
				} else {
					target[j] = sources[i][j];
				}
			}
		}
	}
	return target;
};

/*
 * Simplified implementation.  Does not define properties.
 */
Object.create = function(proto) {
	if(proto === null) {
		return {};
	}
	
	if(proto === undefined ||
		(!(proto instanceof Object) && !(proto instanceof Function))) { 
		throw new TypeError('Object prototype may only be an object or null');
	}
	
	var Type = function Type() { };
	Type.prototype = proto;
	return new Type();
};

/*
 * Simplified implementation.  Only handles 'value' descriptor.
 */
Object.defineProperty = function(target, key, descriptor) {
	if(!target ||
		(!(target instanceof Object) && !(target instanceof Function))) {
		throw new TypeError("Object.defineProperty called on non-object");	
	}
	
	if(!key || {}.toString.call(key) != '[object String]') {
		throw new ReferenceError("Object not defined");
	}

	if(!descriptor ||
		(!(descriptor instanceof Object) && !(descriptor instanceof Function))) {
		throw new TypeError("Property description must be an object: " + descriptor);	
	}
	
	if(descriptor['value']) {
		target[key] = descriptor['value'];
	}
};

Object.prototype.toString = function() {
	var type = "NotExpected";
	
	if (this === undefined) {
		type = "Undefined";
	} else if (this == null) {
		type = "Null";
	} else if (this instanceof Error) {
		type = "Error";
	} else {
		switch(this.constructor) {
			case Array    : { type = "Array"; break; }
			case Boolean  : { type = "Boolean"; break; }
			case Date     : { type = "Date"; break; }
			case Function : { type = "Function"; break; }
			case Number   : { type = "Number"; break; }
			case Object   : { type = "Object"; break; }
			case RegExp   : { type = "RegExp"; break; }
			case String   : { type = "String"; break; }
		}
	}
	
	return "[object " + type + "]";
};

String.prototype.replace = function(searchValue, replacer) {
	if(!searchValue || !replacer) {
		return this;
	}
	
	var replaced    = this.toString();
	var is_function = (replacer instanceof Function);
	var replacement = null;
	
	switch(searchValue.constructor) {
		case String: {
			var index = replaced.indexOf(searchValue);
			if (index >= 0) {
				replacement = (is_function ? replacer.apply(undefined, [ searchValue, index, replaced ]) : replacer);
				replaced    = replaced.substr(0, index) + replacement + replaced.substr(index + searchValue.length);
			}
			break;
		}
		case RegExp: {
			var result = searchValue.exec(replaced);
			
			while(result) {
				result.push(result.index);
				result.push(result.input);
				
				replacement = (is_function ? replacer.apply(undefined, result) : replacer);
				replaced    = replaced.substr(0, result.index) + replacement + replaced.substr(result.index + result[0].length);
			    
				if(searchValue.global) {
					result = searchValue.exec(replaced);
				} else {
					result = null;
				}
			}
			
			break;
		}
	}
	
	return replaced;
};
})(this);