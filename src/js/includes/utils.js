// Utils

Formstone.onReady = function(callback) {
  if (
    document.readyState === 'complete' ||
    document.readyState !== 'loading' /* && !document.documentElement.doScroll() */ // Issue with JQ?
  ) {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

Formstone.scrollTop = function() { // need context param?
  return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop; // TODO only works for window?
};

Formstone.type = function(item) {
  var regex = /(?:^\[object\s(.*?)\]$)/;
  return Object.prototype.toString.call(item).replace(regex, '$1').toLowerCase();
};

Formstone.isObject = function(obj) {
  return Formstone.type(obj) == 'object';
};

Formstone.isEmptyObject = function(obj) {
  return Formston.isObject(obj) && Object.keys(obj).length === 0;
};

Formstone.extend = function() {
  var args = arguments;
  var deep = (args[0] === true);
  var extended = {};

  for (var i = (deep ? 1 : 0); i < args.length; i++) {
    var obj = args[i];

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (deep && Formstone.isObject(obj[prop])) {
          extended[prop] = Formstone.extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  }

  return extended;
};

// Data

// Formstone.getData = function(el, key) {
//   var val = null;

//   if (Storage.exists(el, key)) {
//     return Storage.get(el, key);
//   }

//   if (key in el.dataset) {
//     val = el.dataset[key];
//   }

//   try {
//     var test = JSON.parse(val);

//     if (Formstone.isObject(test)) {
//       val = test;
//     }
//   } catch (error) {
//     // Shh
//   }

//   return val;
// };

// Formstone.setData = function(el, key, data) {
//   Storage.set(el, key, data);
// };

// Formstone.deleteData = function(el, key) {
//   Storage.delete(el, key);
// };

Formstone.killEvent = function(e, immediate) {
  try {
    e.preventDefault();
    e.stopPropagation();

    if (immediate) {
      e.stopImmediatePropagation();
    }
  } catch (error) {
    // Shh
  }
};

// Sorting

Formstone.sortAsc = function(a, b) {
  return (parseInt(a, 10) - parseInt(b, 10));
};

Formstone.sortDesc = function(a, b) {
  return (parseInt(b, 10) - parseInt(a, 10));
};