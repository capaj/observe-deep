function isObject(value) {
  return value !== null && typeof value === 'object';
}

var debug = require('debug')('o.deepObserve');

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
    }else{
      debug("previousPath", previousPath);
    }
    var recourse = function(rObj, pathToAdd) {
      previousPath.push(pathToAdd);
      deepObserve(rObj, CB, notf, pathToAdd);
    };

    var key;
    while (key = keys.pop()) {
      if (typeof obj[key] === 'object') {
        debug("Observing property " + key);
        recourse(obj[key], [key]);
      }
    }

    function observerFn(changes) {
      debug("changes triggered ", changes);
      var path = previousPath.slice();
      var i = changes.length;
      while (i--) {
        var change = changes[i];
        debug("change.name", change.name);


        debug("previousPath2", previousPath);
        //  debug(change.type, change.name, change.oldValue);
        if (change.type === 'add') {
          debug("add");
          var addedObj = change.object[change.name];
          if (isObject(addedObj)) {
            debug("Observing new property because it is an object " + change.name);
            recourse(addedObj, previousPath);
          }
        } else if (change.type === 'delete') {
          debug("delete");
          if (typeof change.oldValue === 'object') {
            debug("unobserving on delete");
            Object.unobserve(change.oldValue, observerFn);
          }
        } else if (change.type === 'update') {
          if (typeof change.oldValue === 'object') {
            Object.unobserve(change.oldValue, observerFn);
          }
          var changed = change.object[change.name];
          if (isObject(changed)) {
            recourse(changed, previousPath);
          }
          //debug("update");
        }
      }
      if (!notifier) {
        CB.apply(obj, arguments);
      } else {
        debug("previousPath3", previousPath);
        change.path = previousPath.join('.') + change.name;
        change.type = 'deep_' + change.type;
        debug("deep notif", change);
        notf.notify(change);
      }
    }

    Object.observe(obj, observerFn);
    return function() {
      Object.deliverChangeRecords(observerFn);
    }
  }
});
