Object.defineProperty(Object, "isObject", {
	enumerable: false,
	writable: true,
	value: function(value) {
		// http://jsperf.com/isobject4
		return value !== null && typeof value === 'object' && !Array.isArray(value);
	}
});

Object.defineProperty(Object, "deepObserve", {
	enumerable: false,
	writable: true,
    /**
     * observes changes on tree of objects
     * @param {Object} obj
     * @param {Function} CB
     */
	value: function deepObserve(obj, CB, notifier, previousPath) {

        var notf = notifier || Object.getNotifier(obj);
		var keys = Object.keys(obj);
		if (!previousPath) {
			previousPath = [];
		}
		var recourse = function(rObj, pathToAdd) {
			previousPath.push(pathToAdd);
			deepObserve(rObj, CB, notf, pathToAdd);
		};

		var key;
		while (key = keys.pop()) {
			if (typeof obj[key] === 'object') {
				console.log("Observing property " + key);
				recourse(obj[key], key);
			}
		}

        function observerFn(changes) {
            console.log("changes triggered " + changes.length );
            var i = changes.length;
            while (i--) {
                var change = changes[i];

                //  console.log(change.type, change.name, change.oldValue);
                if (change.type === 'add') {
                    console.log("add");
                    var addedObj = change.object[change.name];
                    if (Object.isObject(addedObj)) {
                        console.log("Observing new property because it is an object " + change.name);
                        recourse(addedObj, change.name);
                    }
                } else if (change.type === 'delete') {
                    console.log("delete");
                    if (typeof change.oldValue === 'object') {
						console.log("unobserving on delete");
						Object.unobserve(change.oldValue, observerFn);	// TODO why does this fail?
                    }
                } else if (change.type === 'update') {
                    if (typeof change.oldValue === 'object') {
						Object.unobserve(change.oldValue, observerFn);
                    }
                    var changed = change.object[change.name];
                    if (Object.isObject(changed)) {
                        recourse(changed, change.name);
                    }
                    //console.log("update");
                }
            }
            if (!notifier) {
                CB.apply(obj, arguments);
            } else {
                change.path = previousPath.join('.') + change.name;
                console.log("deep notif");
                change.type = 'deep_' + change.type;
                notf(change);
            }
        }

		Object.observe(obj, observerFn);
        return function () {
            Object.deliverChangeRecords(observerFn);
        }
	}
});
