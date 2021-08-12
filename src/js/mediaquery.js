/**
 * @function
 * @name MediaQuery
 * @description A javascript plugin for responsive media query events.
 * @param {Object} options - Instance options
 * @param {Array} [options.minWidth=[0]] - Array of min-widths
 * @param {Array} [options.maxWidth=[Infinity]] - Array of max-widths
 * @param {Array} [options.minHeight=[0]] - Array of min-heights
 * @param {Array} [options.maxHeight=[Infinity]] - Array of max-heights
 * @param {String} [options.unit='px'] - CSS unit used for width and height matches
 * @requires core
 * @example Formstone.mediaquery({ ... });
 */

(function(window, Formstone) {

  'use strict';

  var Namespace = 'mediaquery';

  var Options = {
    minWidth: [0],
    maxWidth: [Infinity],
    minHeight: [0],
    maxHeight: [Infinity],
    unit: 'px'
  };

  var State = null;
  var Bindings = [];
  var MQMatches = {};
  var MQStrings = {
    minWidth: 'min-width',
    maxWidth: 'max-width',
    minHeight: 'min-height',
    maxHeight: 'max-height'
  };

  // Private

  /**
   * @private
   * @description Initializes plugin.
   * @param {Object} options - Default options
   */

  function initialize(options) {
    options = options || {};

    // Build Media Queries

    for (var i in MQStrings) {
      if (MQStrings.hasOwnProperty(i) && options[i]) {
        Options[i] = options[i].concat(Options[i]);
      }
    }

    defaults(Options, options);

    // Sort

    Options.minWidth.sort(Formstone.sortDesc);
    Options.maxWidth.sort(Formstone.sortAsc);
    Options.minHeight.sort(Formstone.sortDesc);
    Options.maxHeight.sort(Formstone.sortAsc);

    // Bind Media Query Matches

    for (var j in MQStrings) {
      if (MQStrings.hasOwnProperty(j)) {
        MQMatches[j] = {};
        for (var k in Options[j]) {
          if (Options[j].hasOwnProperty(k)) {
            var mq = window.matchMedia('(' + MQStrings[j] + ': ' + (Options[j][k] === Infinity ? 100000 : Options[j][k]) + Options.unit + ')');

            mq.addEventListener('change', onStateChange);

            MQMatches[j][Options[j][k]] = mq;
          }
        }
      }
    }

    // Initial Trigger

    onStateChange();
  }

  /**
   * @private
   * @description Sets current media query match state.
   */

  function setState() {
    State = {
      unit: Options.unit
    };

    for (var i in MQStrings) {
      if (MQStrings.hasOwnProperty(i)) {

        for (var j in MQMatches[i]) {
          if (MQMatches[i].hasOwnProperty(j)) {
            var state = (j === 'Infinity') ? Infinity : parseInt(j, 10);
            var isMax = i.indexOf('max') > -1;

            if (MQMatches[i][j].matches) {
              if (isMax) {
                if (!State[i] || state < State[i]) {
                  State[i] = state;
                }
              } else {
                if (!State[i] || state > State[i]) {
                  State[i] = state;
                }
              }
            }

          }
        }

      }
    }
  }

  /**
   * @private
   * @description Handles media query changes.
   */

  function onStateChange() {
    setState();

    Formstone('body').trigger('mqchange', State);
  }

  /**
   * @private
   * @description Handles an individual binding's media query change.
   */

  function onBindingChange(mq) {
    var mqkey = createKey(mq.media);
    var binding = Bindings[mqkey];
    var matches = mq.matches;
    var event = matches ? 'enter' : 'leave';

    if (binding && (binding.active || (!binding.active && matches))) {
      for (var i in binding[event]) {
        if (binding[event].hasOwnProperty(i)) {
          binding[event][i].apply(binding.mq);
        }
      }

      binding.active = true;
    }
  }

  /**
   * @private
   * @description Creates valid object key from string.
   * @param {String} [text] - String to create key from
   * @return {String} - Valid object key
   */

  function createKey(text) {
    return text.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').replace(/^\s+|\s+$/g, '');
  }

  // Public

  /**
   * @description Sets default options.
   * @param {Object} options - Default options
   * @example Formstone.swap('defaults', { ... });
   */

   function defaults(options) {
    Options = Formstone.extend({}, Options, options);
  }

  /**
   * @description Returns the current state.
   * @return {Object} - Current state object
   * @example var state = Formstone.mediaquery('state');
   */

   function getState() {
    return State;
  }

  /**
   * @description Binds callbacks to media query matching.
   * @param {String} key - Instance key
   * @param {String} media - Media query to match
   * @param {Object} data - Callbacks object
   * @param {Function} [data.enter=null] - 'enter' callback funtion
   * @param {Function} [data.leave=null] - 'leave' callback funtion
   * @example Formstone.mediaquery('bind', 'key', '(min-width: 500px)', { ... });
   */

  function bind(key, media, data) {
    var mq = window.matchMedia(media);
    var mqKey = createKey(mq.media);

    if (!Bindings[mqKey]) {
      Bindings[mqKey] = {
        mq: mq,
        active: true,
        enter: {},
        leave: {}
      };

      Bindings[mqKey].mq.addEventListener('change', onBindingChange);
    }

    for (var i in data) {
      if (data.hasOwnProperty(i) && Bindings[mqKey].hasOwnProperty(i)) {
        Bindings[mqKey][i][key] = data[i];
      }
    }

    var binding = Bindings[mqKey];
    var matches = mq.matches;

    if (matches && binding['enter'].hasOwnProperty(key)) {
      binding['enter'][key].apply(mq);
      binding.active = true;
    } else if (!matches && binding['leave'].hasOwnProperty(key)) {
      binding['leave'][key].apply(mq);
      binding.active = false;
    }
  }

  /**
   * @description Unbinds all callbacks from media query.
   * @param {String} key - Instance key
   * @param {String} [media=null] - Media query to unbind; defaults to all
   * @example Formstone.mediaquery('unbind', 'key');
   */

  function unbind(key, media) {
    if (!key) {
      return;
    }

    if (media) {
      // unbind specific query
      var mqKey = createKey(media);

      if (Bindings[mqKey]) {
        if (Bindings[mqKey].enter[key]) {
          delete Bindings[mqKey].enter[key];
        }

        if (Bindings[mqKey].leave[key]) {
          delete Bindings[mqKey].leave[key];
        }
      }
    } else {
      // unbind all
      for (var i in Bindings) {
        if (Bindings.hasOwnProperty(i)) {
          if (Bindings[i].enter[key]) {
            delete Bindings[i].enter[key];
          }

          if (Bindings[i].leave[key]) {
            delete Bindings[i].leave[key];
          }
        }
      }
    }
  }

  // Utility

  Formstone.Utility(Namespace, {
    _initialize: initialize,
    _defaults: defaults,
    bind: bind,
    unbind: unbind,
    state: getState,
  });

})(window, Formstone);
