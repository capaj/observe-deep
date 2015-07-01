function isObject(value) {
  return value !== null && typeof value === 'object';
}

var debug = require('debug')('o.deepObserve');

function deepObserve(obj, CB, notifier, previousPath, observersMap) {
  var recourse = function(rObj, pathToAdd) {
    deepObserve(rObj, CB, notifier, pathToAdd, observersMap);
  };
  var keys = Object.keys(obj);
  var key;
  while (key = keys.pop()) {
    if (typeof obj[key] === 'object') {
      debug("Observing property " + key);
      recourse(obj[key], key);
    }
  }

  function unobserve(change) {
    Object.unobserve(change.oldValue, observersMap.get(change.oldValue));
    observersMap.delete(change.oldValue);
  }

  function observerFn(changes) {
    debug("changes triggered on path", previousPath, changes);
    var i = changes.length;
    while (i--) {
      var path = previousPath.slice();
      var change = changes[i];
      debug("change.name", change.name);
      path.push(change.name);

      debug("path", path);
      //  debug(change.type, change.name, change.oldValue);

      if (change.type === 'add') {
        var addedObj = change.object[change.name];
        if (isObject(addedObj)) {
          debug("Observing new property because it is an object " + change.name);
          recourse(addedObj, path);
        }
      } else if (change.type === 'delete') {

        if (typeof change.oldValue === 'object') {
          debug("unobserving on delete");
          unobserve(change);
        }
      } else if (change.type === 'update') {
        if (typeof change.oldValue === 'object') {
          unobserve(change);
        }
        var changed = change.object[change.name];
        if (isObject(changed)) {
          recourse(changed, path);
        }
        //debug("update");
      }
    }
    if (previousPath.length === 0) {
      CB.apply(obj, arguments);
    } else {
      debug("previousPath3", previousPath);

      var changeCopy = {
        name: change.name,
        object: change.object
      };
      changeCopy.path = previousPath.join('.') + '.' + change.name;
      changeCopy.type = 'deep_' + change.type;
      debug("deep notif", changeCopy);
      notifier.notify(change);
    }
  }
  observersMap.set(obj, observerFn);
  Object.observe(obj, observerFn);
  return function() {
    Object.deliverChangeRecords(observerFn);
  }
}

Object.defineProperty(Object, "deepObserve", {
  enumerable: false,
  writable: true,
  /**
   * observes changes on tree of objects
   * @param {Object} obj to deeply observe
   * @param {Function} CB to call when changes occur
   */
  value: function(obj, CB) {
    var observersMap = new WeakMap();
    var notf = Object.getNotifier(obj);
    return deepObserve(obj, CB, notf, [], observersMap);
  }
});
