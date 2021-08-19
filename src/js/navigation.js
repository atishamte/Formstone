/**
 * @function
 * @name Tabs
 * @description A javascript plugin for simple responsive navigation.
 * @param {Object} options - Instance options
 * @param {String} [options.customClass=''] - Additional class applied to element
 * @param {String} [options.gravity='left'] - Gravity of 'push', 'reveal' and 'overlay' navigation; 'right', 'left'
 * @param {Boolean} [options.label=true] - Display handle width label
 * @param {String} [options.labels] - Label text
 * @param {String} [options.labels.closed='Menu'] - Closed state label text
 * @param {String} [options.labels.open='Close'] - Open state label text
 * @param {String} [options.maxWidth=Infinity] - Width to auto-disable instance
 * @param {String} [options.type='toggle'] - Type of navigation; 'toggle', 'push', 'reveal', 'overlay'
 * @requires core
 * @requires mediaquery
 * @requires swap
 * @example Formstone('.target').nevigation({ ... });
 */

 (function(window, Formstone) {

  'use strict';

  var Namespace = 'navigation';
  var GUID = 0;

  var Initialized = false;
  var $Locks = Formstone();

  var Options = {
    customClass: '',
    gravity: 'left',
    label: true,
    labels: {
      closed: 'Menu',
      open: 'Close',
    },
    maxWidth: Infinity,
    mobileMaxWidth: '740px',
    type: 'toggle',
  };

  var Classes = {
    'base': namespace(''),
    'animated': namespace('animated'),
    'content': namespace('content'),
    'enabled': namespace('enabled'),
    'focus': namespace('focus'),
    'handle': namespace('handle'),
    'lock': namespace('lock'),
    'nav': namespace('nav'),
    'open': namespace('open'),
  };

  var Events = {
    namespace: '.navigation',
    open: 'open.navigation',
    close: 'close.navigation',
    blur: 'blur.navigation',
    focus: 'focus.navigation',
    click: 'click.navigation',
    keypress: 'keypress.navigation',
    swap: {
      namespace: '.swap',
      activate: 'activate.swap',
      deactivate: 'deactivate.swap',
      enable: 'enable.swap',
      disable: 'disable.swap',
    }
  }

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
   * @description Sets up plugin.
   */

  function initialize() {
    if (!Initialized) {
      $Locks = Formstone('html, body');
    }
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
      open: false,
      // gravity: '',
    }, Options, options, ($el.getData('navigationOptions') || {}));

    $el.setData(Namespace, data);

    data.el = this;
    data.$el = $el;
    data.handle = data.$el.getData('navigationHandle');
    data.content = data.$el.getData('navigationContent');

    // guid
    data.guidHandle = data.guidClass + '-handle';

    data.isToggle = (data.type === 'toggle');
    data.open = false;

    if (data.isToggle) {
      data.gravity = '';
    }

    var baseClass = Classes.base;
    var typeClass = [baseClass, data.type].join('-');
    var gravityClass = data.gravity ? [typeClass, data.gravity].join('-') : '';
    var classGroup = [data.guidClass, data.customClass];

    data.handleClasses = [
      Classes.handle.replace(baseClass, typeClass),
      gravityClass ? Classes.handle.replace(baseClass, gravityClass) : '',
      data.guidHandle,
      data.customClass,
    ];

    data.thisClasses = [
      Classes.nav,
      Classes.nav.replace(baseClass, typeClass),
      gravityClass ? Classes.nav.replace(baseClass, gravityClass) : '',
    ].concat(classGroup);

    data.contentClasses = [
      Classes.content,
      Classes.content.replace(baseClass, typeClass),
    ].concat(classGroup);

    data.contentClassesOpen = [
      gravityClass ? Classes.content.replace(baseClass, gravityClass) : '',
      Classes.open
    ];

    // DOM

    data.$nav = data.$el.addClass(data.thisClasses).attr('role', 'navigation');
    data.$handle = Formstone(data.handle).addClass(data.handleClasses);
    data.$content = Formstone(data.content).addClass(data.contentClasses);

    if (data.content) {
      data.$animate = Formstone([ dotspace(Classes.nav) + dotspace(data.guidClass), data.content ].join(', '));
    } else {
      data.$animate = data.$nav;
    }

    cacheLabel(data);

    // Tab index

    data.navTabIndex = data.$nav.attr('tabindex');
    data.$nav.attr('tabindex', -1);

    // Aria

    data.id = data.$el.attr('id');

    if (data.id) {
      data.ariaId = data.id;
    } else {
      data.ariaId = data.guidClass;
      data.$el.attr('id', data.ariaId);
    }

    // toggle

    data.$handle.attr('data-swap-target', dotspace(data.guidClass))
      .attr('data-swap-linked', dotspace(data.guidHandle))
      .attr('data-swap-group', Classes.base)
      .attr('tabindex', 0)
      .bind(Events.swap.activate, onOpen)
      .bind(Events.swap.deactivate, onClose)
      .bind(Events.swap.enable, onEnable)
      .bind(Events.swap.disable, onDisable)
      .bind(Events.focus, onFocus)
      .bind(Events.blur, onBlur);

    if (!data.$handle.is('a, button')) {
      data.$handle.bind(Events.keypress, onKeyup);
    }
  }

  /**
   * @private
   * @description Run post build.
   */

   function postConstruct() {
    var data = Formstone(this).getData(Namespace);

    if (!data) {
      return;
    }

    data.$handle.swap({
      maxWidth: data.maxWidth,
      classes: {
        target: data.guidClass,
        enabled: Classes.enabled,
        active: Classes.open,
      }
    });
  }

    /**
     * @private
     * @description Handles instance focus.
     * @param e [object] 'Event data'
     */

    function onFocus(e) {
      var target = Formstone(this).data('swap-target');
      var $nav = Formstone(target);
      var data = $nav.getData(Namespace);

      if (data) {
        data.$handle.addClass(Classes.focus);
      }
    }

    /**
     * @private
     * @description Handles instance blur.
     * @param e [object] 'Event data'
     */

    function onBlur(e) {
      var target = Formstone(this).data('swap-target');
      var $nav = Formstone(target);
      var data = $nav.getData(Namespace);

      if (data) {
        data.$handle.removeClass(Classes.focus);
      }
    }

    /**
     * @private
     * @description Handles keypress event on inputs.
     * @param e [object] 'Event data'
     */

    function onKeyup(e) {
      var target = Formstone(this).data('swap-target');
      var $nav = Formstone(target);
      var data = $nav.getData(Namespace);

      if (data && (e.keyCode === 13 || e.keyCode === 32)) {
        Formstone.killEvent(e);

        data.$handle.trigger('click');
      }
    }

    /**
     * @private
     * @description Handles nav open event.
     * @param e [object] 'Event data'
     */

    function onOpen(e) {
      var target = Formstone(this).data('swap-target');
      var nav = Formstone(target + dotspace(Classes.nav)).first();
      var data = Formstone(nav).getData(Namespace);

      if (data && !data.open) {
        data.$el.trigger(Events.open)
          .attr('aria-hidden', false);

        data.$content.addClass(data.contentClassesOpen)
          .bind(Events.click, function() {
            close.apply(nav);
          });

        data.$handle.attr('aria-expanded', true);

        if (data.label) {
          data.$handle.html(data.labels.open);
        }

        addLocks(data);

        data.open = true;

        nav.focus();
      }
    }

  /**
   * @private
   * @description Handles nav close event.
   * @param e [object] 'Event data'
   */

  function onClose(e) {
    var target = Formstone(this).data('swap-target');
    var nav = Formstone(target + dotspace(Classes.nav)).first();
    var data = Formstone(nav).getData(Namespace);

    if (data && data.open) {
      data.$el.trigger(Events.close)
        .attr('aria-hidden', true);

      data.$content.removeClass(data.contentClassesOpen)
        .unbind(Events.swap.namespace)
        .unbind(Events.namespace);

      data.$handle.attr('aria-expanded', false);

      if (data.label) {
        data.$handle.html(data.labels.closed);
      }

      clearLocks(data);

      data.open = false;

      data.el.focus();
    }
  }

  /**
   * @private
   * @description Handles nav enable event.
   * @param e [object] 'Event data'
   */

  function onEnable(e) {
    var target = Formstone(this).data('swap-target');
    var nav = Formstone(target + dotspace(Classes.nav)).first();
    var data = Formstone(nav).getData(Namespace);

    if (data) {
      data.$el.attr('aria-hidden', 'true');
      data.$handle.attr('aria-controls', data.ariaId)
        .attr('aria-expanded', 'false');
      data.$content.addClass(Classes.enabled);

      setTimeout(function() {
        data.$animate.addClass(Classes.animated);
      }, 0);

      if (data.label) {
        data.$handle.html(data.labels.closed);
      }
    }
  }

  /**
   * @private
   * @description Handles nav disable event.
   * @param e [object] 'Event data'
   */

  function onDisable(e) {
    var target = Formstone(this).data('swap-target');
    var nav = Formstone(target + dotspace(Classes.nav)).first();
    var data = Formstone(nav).getData(Namespace);

    if (data) {
      data.$el.removeAttr(['aria-hidden', 'aria-controls', 'aria-expanded']);
      data.$content.removeClass([Classes.enabled, Classes.animated]);
      data.$animate.removeClass(Classes.animated);

      restoreLabel(data);

      clearLocks(data);
    }
  }

  /**
   * @private
   * @description Locks scrolling
   * @param data [object] 'Instance data'
   */

  function addLocks(data) {
    if (!data.isToggle) {
      $Locks.addClass(Classes.lock);
    }
  }

  /**
   * @private
   * @description Unlocks scrolling
   * @param data [object] 'Instance data'
   */

  function clearLocks(data) {
    if (!data.isToggle) {
      $Locks.removeClass(Classes.lock);
    }
  }

  /**
   * @private
   * @description Sets handle labels
   * @param data [object] 'Instance data'
   */

  function cacheLabel(data) {
    if (data.label) {
      if (data.$handle.length > 1) {
        data.originalLabel = [];

        for (var i = 0, count = data.$handle.length; i < count; i++) {
          data.originalLabel[i] = Formstone(data.$handle.nodes[i]).html();
        }
      } else {
        data.originalLabel = data.$handle.html();
      }
    }
  }

  /**
   * @private
   * @description restores handle labels
   * @param data [object] 'Instance data'
   */

  function restoreLabel(data) {
    if (data.label) {
      if (data.$handle.length > 1) {
        for (var i = 0, count = data.$handle.length; i < count; i++) {
          Formstone(data.$handle.nodes[i]).html(data.originalLabel[i]);
        }
      } else {
        data.$handle.html(data.originalLabel);
      }
    }
  }

  // Public

  /**
   * @description Sets default options; applies to future instances.
   * @param {Object} options - Default options
   * @example Formstone.navigation('defaults', { ... });
   */

   function defaults(options) {
    Options = Formstone.extend({}, Options, options);
  }

  /**
   * @private
   * @description Tears down instance.
   */

  function destroy() {
    var data = Formstone(this).getData(Namespace);

    if (!data) {
      return;
    }

    data.$content.removeClass(data.contentClasses, data.contentClassesOpen)
      .unbind(Events.namespace);
      // .off(Events.namespace);

    data.$handle.removeAttr(['aria-controls', 'aria-expanded', 'data-swap-target', 'data-swap-linked', 'data-swap-group'])
      .removeClass(data.handleClasses)
      .unbind(Events.swap.namespace)
      .unbind(Events.namespace)
      .html(data.originalLabel)
      .swap('destroy');

    data.$nav.attr('tabindex', data.navTabIndex);

    restoreLabel(data);

    clearLocks(data);

    data.$el.removeAttr('aria-hidden')
      .removeClass(data.thisClasses);

    if (data.$el.attr('id') === data.guidClass) {
      data.$el.removeAttr('id');
    }

    Formstone.deleteData(data.el, Namespace);
  }

  /**
   * @description Opens instance.
   * @example Formstone('.target').navigation('open');
   */

  function open() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$handle.swap('activate');
    }
  }

  /**
   * @description Closes instance.
   * @example Formstone('.target').navigation('close');
   */

  function close() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$handle.swap('deactivate');
    }
  }

  /**
   * @description Enables instance.
   * @example Formstone('.target').navigation('enable');
   */

   function enable() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$handle.swap('enable');
    }
  }

  /**
   * @description Disables instance.
   * @example Formstone('.target').navigation('disable');
   */

  function disable() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$handle.swap('disable');
    }
  }

  // Component

  Formstone.Component(Namespace, {
    _construct: construct,
    _postConstruct: postConstruct,
    defaults: defaults,
    destroy: destroy,
    open: open,
    close: close,
    enable: enable,
    disable: disable,
  });

  /**
   * @event open.navigation
   * @description Navigation has been opened
   * @param {Object} e - Event data
   * @example Formstone('.target').bind('open.navigation', function(e) { ... });
   */

  /**
   * @event close.navigation
   * @description Navigation has been closed
   * @param {Object} e - Event data
   * @example Formstone('.target').bind('close.navigation', function(e) { ... });
   */

})(window, Formstone);