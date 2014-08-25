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
	value: function deepObserve(obj, CB, notifier, previousPath) {
		var notf = Object.getNotifier(obj);
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

		Object.observe(obj, function(changes) {
			var i = changes.length;
			while (i--) {
				var change = changes[i];

			//  console.log(change.type, change.name, change.oldValue);
				if (change.type === 'add') {
					var addedObj = change.object[change.name];
					if (isObject(addedObj)) {
						console.log("Observing new property because it is an object " + change.name);
						recourse(addedObj, change.name);
					}
				} else if (change.type === 'delete') {
					console.log("delete");
				} else if (change.type === 'update') {
					if (typeof change.oldValue === 'object') {

					}
					var changed = change.object[change.name];
					if (isObject(changed)) {
						recourse(changed, change.name);
					}
					console.log("update");
				}
			}
			if (!notifier) {
				CB.apply(obj, arguments);
			}
		});

	}
});
