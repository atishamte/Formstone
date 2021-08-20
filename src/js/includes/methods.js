// Call an event manually on all the nodes; Modified to handle namespaced events
u.prototype.trigger = u.prototype.fire = function (events) {
  var data = this.slice(arguments).slice(1);

  return this.eacharg(events, function (node, event) {
    var ev;

    var parts = event.split('.');
    var domEvent = parts.shift();
    var namespace = parts.join('.');

    // Allow the event to bubble up and to be cancelable (as default)
    var opts = { bubbles: true, cancelable: true, detail: data };

    try {
      // Accept different types of event names or an event itself
      ev = new window.CustomEvent(domEvent, opts);
    } catch (e) {
      ev = document.createEvent('CustomEvent');
      ev.initCustomEvent(domEvent, true, true, data);
    }

    if (namespace) {
      ev.namespace = namespace;
    }

    node.dispatchEvent(ev);
  });
};

// Attach a callback to the specified events; Modified to handle namespaced events
u.prototype.on = u.prototype.bind = function (events, cb, cb2) {
  var sel = null;
  var orig_callback = cb;
  if (typeof cb === 'string') {
    sel = cb;
    orig_callback = cb2;
    cb = function (e) {
      var args = arguments;
      var targetFound = false;
      u(e.currentTarget)
        .find(sel)
        .each(function (target) {
          if (target === e.target || target.contains(e.target)) {
            targetFound = true;
            try {
              Object.defineProperty(e, 'currentTarget', {
                get: function () {
                  return target;
                }
              });
            } catch (err) { }
            cb2.apply(target, args);
          }
        });
      // due to e.currentEvent reassigning a second (or subsequent) handler may
      // not be fired for a single event, so chekc and apply if needed.
      if (!targetFound && e.currentTarget === e.target) {
        cb2.apply(e.target, args);
      }
    };
  }

  // // Add the custom data as arguments to the callback
  // var callback = function (e) {
  //   return cb.apply(this, [e].concat(e.detail || []));
  // };

  return this.eacharg(events, function (node, event) {
    var parts = event.split('.');
    var domEvent = parts.shift();
    var namespace = parts.join('.');

    // Add the custom data as arguments to the callback
    var callback = function (e) {
      // Verify namespace, if it exists
      if (namespace && e.namespace && namespace != e.namespace) {
        return;
      }

      return cb.apply(this, [e].concat(e.detail || []));
    };

    node.addEventListener(domEvent, callback);

    // Store it so we can dereference it with `.off()` later on
    node._e = node._e || {};
    node._e[event] = node._e[event] || [];
    node._e[event].push({
      callback: callback,
      orig_callback: orig_callback,
      selector: sel
    });
  });
};

// Removes the callback to the event listener for each node; Modified to handle namespaced events
u.prototype.off = u.prototype.unbind = function (events, cb, cb2) {
  var cb_filter_off = (cb == null && cb2 == null);
  var sel = null;
  var cb_to_be_removed = cb;
  if (typeof cb === 'string') {
    sel = cb;
    cb_to_be_removed = cb2;
  }

  return this.eacharg(events, function (node, event) {
    var parts = event.split('.');
    var fullEvent = (event.indexOf('.') > 0);
    var domEvent = parts.shift();
    var namespace = parts.join('.');

    var allEvents = node._e ? node._e : {};
    var filteredEvents = {};

    // Find all matching, possibly namespaced, events
    if (fullEvent) {
      filteredEvents[event] = allEvents[event];
    } else if (domEvent || namespace) {
      Object.keys(allEvents).forEach(function(key) {
        if ((domEvent && key.indexOf(domEvent) === 0) || (namespace && key.indexOf(namespace) > -1)) {
          filteredEvents[key] = allEvents[key];
        }
      });
    }

    // u(node._e ? node._e[event] : []).each(function(ref, i) {
    Object.keys(filteredEvents).forEach(function(key) {
      var localParts = key.split('.');
      var localEvent = localParts.shift();
      // var localNamespace = localParts.join('.');
      var localEvents = filteredEvents[key];

      u( localEvents ? localEvents : [] ).each(function(ref, i) {
        if (ref && (cb_filter_off || (ref.orig_callback === cb_to_be_removed && ref.selector === sel))) {
          node.removeEventListener(localEvent, ref.callback);
          filteredEvents[key][i] = null;
        }
      });
    });
  });
};

// Removes an attribute from all of the matched nodes
u.prototype.removeAttr = function () {
  // Loop the combination of each node with each argument
  return this.eacharg(arguments, function (el, name) {
    // Remove the attribute using the native method
    el.removeAttribute(name);
  });
};

// Returns 'data-*' attributes (JSON decoded) or internally set data from first matched node
u.prototype.getData = function(key) {
  // return this.eacharg(arguments, function (el, key) {

    var el = this.first();

    var val = null;

    if (Storage.exists(el, key)) {
      return Storage.get(el, key);
    }

    if (key in el.dataset) {
      val = el.dataset[key];
    }

    try {
      var test = JSON.parse(val);

      if (Formstone.isObject(test)) {
        val = test;
      }
    } catch (error) {
      // Shh
    }

    return val;
  // });
};

// Set internal data on first matched node
u.prototype.setData = function(key, data) {
  // console.log(this, arguments);
  // return this.eacharg(arguments, function (el, key, data) {
  //   console.log('Set', el, key, data);
    var el = this.first();

    Storage.set(el, key, data);
  // });
};

// Delete internal data from first matched node
u.prototype.deleteData = function(key) {
  // return this.eacharg(arguments, function (el, key) {
    var el = this.first();

    Storage.delete(el, key);
  // });
};