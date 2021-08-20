/**
 * @function
 * @name Checkpoint
 * @description A javascript plugin for animating visible elements.
 * @param {Object} options - Instance options
 * @param {String} [options.intersect='bottom-top'] - Position of intersection; window-element
 * @param {Number} [options.offset=0] - Intersection offset; pixel value
 * @param {Boolean} [options.reverse=false] - Deactivate animation when reversed
 * @requires core
 * @example Formstone('.target').checkpoint({ ... });
 */

 (function(window, Formstone) {

  'use strict';

  var Namespace = 'checkpoint';
  var GUID = 0;

  var Initialized = false;
  var ResizeWatcher = new ResizeObserver(resize);

  var $Instances = Formstone();

  var ScrollTop = 0;
  var OldScrollTop = 0;

  var Options = {
    intersect: 'bottom-top',
    offset: 0,
    reverse: false,
  };

  var Classes = {
    base: namespace(''),
    active: namespace('active'),
  };

  var Events = {
    namespace: eventspace(''),
    load: eventspace('load'),
    activate: eventspace('activate'),
    deactivate: eventspace('deactivate'),
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
      window.requestAnimationFrame(raf);
    }
  }

  /**
   * @private
   * @description Handles document resize.
   */

  function resize() {
    $Instances.each(function(el, i) {
      resizeInstance.apply(el);
    });
  }

  /**
   * @private
   * @description Handles request animation frame.
   */

  function raf() {
    ScrollTop = window.scrollY;

    if (ScrollTop < 0) {
      ScrollTop = 0;
    }

    if (ScrollTop !== OldScrollTop) {
      $Instances.each(function(el, i) {
        checkInstance.apply(el);
      });

      OldScrollTop = ScrollTop;
    }

    $Instances.each(function(el, i) {
      rafInstance.apply(el);
    });

    window.requestAnimationFrame(raf);
  }

  /**
   * @private
   * @description Caches internal instances.
   */

  function cacheInstances() {
    $Instances = Formstone(dotspace(Classes.base));

    resize();
  }

  /**
   * @private
   * @description Calculates top offset.
   */

  function offsetTop(el) {
    var offset = 0;

    while (el) {
      offset += el.offsetTop;
      el = el.offsetParent;
    }

    return offset;
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
      initialized: false,
      visible: false,
    }, Options, options, ($el.getData('checkpointOptions') || {}));

    $el.setData(Namespace, data);

    data.el = this;
    data.$el = $el;

    var dataParent = data.$el.getData('checkpointParent');
    var dataContainer = data.$el.getData('checkpointContainer');
    var dataIntersect = data.$el.getData('checkpointIntersect');
    var dataOffset = data.$el.getData('checkpointOffset');

    var $parent = Formstone(dataParent);
    var $container = Formstone(dataContainer);

    if (dataIntersect) {
      data.intersect = dataIntersect;
    }
    if (dataOffset) {
      data.offset = dataOffset;
    }

    var intersectParts = data.intersect.split('-');

    data.windowIntersect = intersectParts[0];
    data.elIntersect = intersectParts[1];

    data.$target = ($container.nodes.length) ? $container : data.$el;

    data.hasParent = ($parent.nodes.length > 0);
    data.$parent = $parent;

    // var $images = data.$target.find('img');

    // if ($images.length) {
    //   $images.on(Events.load, data, resizeInstance);
    // }

    data.$el.addClass(Classes.base);

    data.initialized = true;

    cacheInstances();
  }

  /**
   * @private
   * @description Handles request animation frame for parent.
   */

  function rafInstance() {
    var data = Formstone(this).getData(Namespace);

    if (!data || !data.hasParent) {
      return;
    }

    var parentScroll = parseInt( data.$parent.first().scrollTop, 10);

    if (parentScroll !== data.parentScroll) {
      checkInstance.apply(data.el);

      data.parentScroll = parentScroll;
    }
  }

  /**
   * @private
   * @description Handles window scroll event.
   */

  function checkInstance() {
    var data = Formstone(this).getData(Namespace);

    if (!data || !data.initialized) {
      return;
    }

    var check = data.windowCheck + ((data.hasParent) ? data.parentScroll : ScrollTop);

    if (check >= data.elCheck) {
      if (!data.active) {
        data.$el.trigger(Events.activate);
      }

      data.active = true;
      data.$el.addClass(Classes.active);
    } else {
      if (data.reverse) {
        if (data.active) {
          data.$el.trigger(Events.deactivate);
        }

        data.active = false;
        data.$el.removeClass(Classes.active);
      }
    }
  }

  // Public

  /**
   * @description Sets default options; applies to future instances.
   * @param {Object} options - Default options
   * @example Formstone.checkpoint('defaults', { ... });
   */

  function defaults(options) {
    Options = Formstone.extend({}, Options, options);
  }

  /**
   * @private
   * @description Tears down instance.
   * @example Formstone('.target').checkpoint('destroy');
   */

  function destroy() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$el.removeClass([namespace(''), namespace('active')]);

      cacheInstances();
    }
  }

  /**
   * @name resize
   * @description Resizes target instance.
   * @example Formstone('.target').checkpoint('resize');
   */

  /**
   * @private
   * @description Resizes target instance.
   */

  function resizeInstance(data) {
    var data = Formstone(this).getData(Namespace);

    if (!data) {
      return;
    }

    data.parentHeight = window.innerHeight;

    if (data.hasParent) {
      var parentSize = data.$parent.size(false);

      data.parentHeight = parentSize.height;
    }

    switch (data.windowIntersect) {
      case "top":
        data.windowCheck = 0 + data.offset;
        break;
      case "middle":
      case "center":
        data.windowCheck = (data.parentHeight / 2) - data.offset;
        break;
      case "bottom":
        data.windowCheck = data.parentHeight - data.offset;
        break;
      default:
        break;
    }

    data.elSize = data.$target.size();

    switch (data.elIntersect) {
      case "top":
        data.elCheck = offsetTop(data.el);
        break;
      case "middle":
        data.elCheck = offsetTop(data.el) + (data.elSize.height / 2);
        break;
      case "bottom":
        data.elCheck = offsetTop(data.el) + data.elSize.height;
        break;
      default:
        break;
    }

    if (data.hasParent) {
      data.elCheck -= data.$parent.first().offsetTop;
    }

    checkInstance.apply(data.el);
  }

  // Component

  Formstone.Component(Namespace, {
    _construct: construct,
    defaults: defaults,
    destroy: destroy,
    resize: resizeInstance,
  });

  /**
   * @event activate.checkpoint
   * @description Element has been activated
   * @example Formstone('.target').on('activate.checkpoint', function(e) { ... });
   */

  /**
   * @event deactivate.checkpoint
   * @description Element has been deactivated
   * @example Formstone('.target').on('deactivate.checkpoint', function(e) { ... });
   */

})(window, Formstone);