/**
 * @function
 * @name Equalize
 * @description A javascript plugin for equal widths and heights.
 * @param {Object} options - Instance options
 * @param {String} [options.maxWidth=Infinity] - Width to auto-disable instance
 * @param {Number} [options.minWidth=0] - Width to auto-disable instance
 * @param {String} [options.property='height'] - Property to size; 'height' or 'width'
 * @param {String} [options.target=null] - Target child selector(s); Defaults to direct descendants
 * @requires core
 * @requires mediaquery
 * @example Formstone('.target').equalize({ ... });
 */

 (function(window, Formstone) {

  'use strict';

  var Namespace = 'equalize';
  var GUID = 0;

  var Initialized = false;
  var ResizeWatcher = new ResizeObserver(resize);
  var ResizeTimer = null;
  var $Instances = Formstone();

  var Options = {
    customClass: '',
    maxWidth: Infinity,
    minWidth: 0,
    property: 'height',
    target: null,
  };

  var Classes = {
    'base': namespace(''),
  };

  var Events = {
    namespace: eventspace(''),
    load: eventspace('load'),
  };

  // Internal

  /**
   * @private
   * @description Builds namespace.
   * @param {String} string - String to namespace
   * @param {Boolean} prefix - Inlcude library prefix
   */

  function namespace(string, prefix) {
    return (prefix === false ? '' : 'fs-') + Namespace + (string !== '' ? '-' + string : '');
  }

  /**
   * @private
   * @description Builds selector dotspace.
   * @param {String} string - String to prefix
   */

  function dotspace(string) {
    return '.' + string;
  }

  /**
   * @private
   * @description Builds selector dotspace.
   * @param {String} string - String to prefix
   */

  function eventspace(string) {
    return string + '.' + Namespace;
  }

  /**
   * @private
   * @description Sets up plugin.
   */

  function initialize() {
    if (!Initialized) {
      ResizeWatcher.observe(document.body);
    }
  }

  /**
   * @private
   * @description Handles document resize.
   */

  function resize() {
    ResizeTimer = Formstone.startTimer(ResizeTimer, 20, _resize);
  }

  /**
   * @private
   * @description Handles debounced document resize.
   */

  function _resize() {
    $Instances.each(function(el, i) {
      resizeInstance.apply(el);
    });
  }

  /**
   * @private
   * @description Caches internal instances.
   */

  function cacheInstances() {
    $Instances = Formstone(dotspace(Classes.base));
  }

  // Private

  /**
   * @private
   * @description Builds instance.
   */

  function construct(options) {
    var $el = Formstone(this);
    var data = $el.getData(Namespace);

    if (data) {
      return;
    }

    initialize();

    GUID++;

    data = Formstone.extend({
      guid: GUID,
      guidClass: namespace(String(GUID).padStart(3, '0')),
      enabled: false,
    }, Options, options, ($el.getData('equalizeOptions') || {}));

    $el.setData(Namespace, data);

    data.el = this;
    data.$el = $el;

    //

    data.maxWidth = (data.maxWidth === Infinity ? '100000px' : data.maxWidth);
    data.mq = '(min-width:' + data.minWidth + ') and (max-width:' + data.maxWidth + ')';

    data.$el.addClass(Classes.base);

    if (data.target) {
      if (!Formstone.isArray(data.target)) {
        data.target = [data.target];
      }
    } else {
      data.target = [':scope > *'];
    }

    Formstone.mediaquery('bind', data.guidClass, data.mq, {
      enter: function() {
        enable.apply(data.el);
      },
      leave: function() {
        disable.apply(data.el);
      }
    });
  }

  /**
   * @private
   * @description Removes styling from elements
   */

  function tearDown() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      for (var i = 0; i < data.target.length; i++) {
        var $target = data.$el.find(data.target[i]);

        $target.each(function(el, i) {
          el.style[data.property] = '';
        });
      }

      data.$el.find('img').off(Events.namespace);
    }
  }

  // Public

  /**
   * @description Sets default options; applies to future instances.
   * @param {Object} options - Default options
   * @example Formstone.tabs('defaults', { ... });
   */

  function defaults(options) {
    Options = Formstone.extend({}, Options, options);
  }

  /**
   * @private
   * @description Tears down instance.
   * @example Formstone.equalize('destroy');
   */

  function destroy() {
    var data = Formstone(this).getData(Namespace);

    if (!data) {
      return;
    }

    tearDown.apply(data.el);

    Formstone.mediaquery('unbind', data.guidClass);

    data.$el.removeClass(Classes.base);

    cacheInstances();
  }

  /**
   * @description Enables instance.
   * @example Formstone('.target').equalize('enable');
   */

  function enable() {
    var data = Formstone(this).getData(Namespace);

    if (data && ! data.enabled) {
      data.enabled = true;

      var $images = data.$el.find('img');

      if ($images.length) {
        $images.on(Events.load, function() {
          resizeInstance.apply(data.el);
        });
      }

      resizeInstance.apply(data.el);

      cacheInstances();
    }
  }

  /**
   * @description Disables instance.
   * @example Formstone('.target').equalize('disable');
   */

  function disable() {
    var data = Formstone(this).getData(Namespace);

    if (data && data.enabled) {
      data.enabled = false;

      tearDown.apply(data.el);
    }
  }

  /**
   * @name resize
   * @description Resizes target instance.
   * @example Formstone('.target').equalize('resize');
   */

  /**
   * @private
   * @description Handles window resize event.
   */

  function resizeInstance() {
    var data = Formstone(this).getData(Namespace);

    if (!data || !data.enabled) {
      return;
    }

    var value;
    var $target;

    for (var i = 0; i < data.target.length; i++) {
      value = 0;
      $target = data.$el.find(data.target[i]);

      $target.each(function(el, i) {
        el.style[data.property] = '';
      });

      $target.each(function(el, i) {
        var size = Formstone(el).size();

        if (size[data.property] > value) {
          value = size[data.property];
        }
      });

      $target.each(function(el, i) {
        el.style[data.property] = value + 'px';
      });
    }
  }

  // Component

  Formstone.Component(Namespace, {
    _construct: construct,
    defaults: defaults,
    destroy: destroy,
    enable: enable,
    disable: disable,
    resize: resizeInstance,
  });

})(window, Formstone);
