/**
 * @function
 * @name Tabs
 * @description A javascript plugin for simple tabs.
 * @param {Object} options - Instance options
 * @param {String} [options.customClass=''] - Additional class applied to element
 * @param {String} [options.maxWidth=Infinity] - Width to auto-disable instance
 * @param {String} [options.mobileMaxWidth='740px'] - Width to auto-disable mobile styles
 * @requires core
 * @requires mediaquery
 * @requires swap
 * @example Formstone('.target').swap({ ... });
 */

 (function(window, Formstone) {

  'use strict';

  var Namespace = 'tabs';
  var GUID = 0;

  var Options = {
    customClass: '',
    maxWidth: Infinity,
    mobileMaxWidth: '740px',
  };

  var Classes = {
    'base': namespace(''),
    'tab': namespace('tab'),
    'tab_mobile': namespace('tab_mobile'),
    'content': namespace('content'),
    'active': namespace('active'),
    'enabled': namespace('enabled'),
    'mobile': namespace('mobile'),
  };

  var Events = {
    namespace: '.tabs',
    click: 'click.tabs',
    update: 'update.tabs',
    swap: {
      namespace: '.swap',
      activate: 'activate.swap',
      deactivate: 'deactivate.swap',
      enable: 'enable.swap',
      disable: 'disable.swap',
    }
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

  // /**
  //  * @private
  //  * @description Builds selector dotspace.
  //  * @param {String} string - String to prefix
  //  */

  // function dotspace(string) {
  //   return '.' + srting;
  // }

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

    GUID++

    data = Formstone.extend({
      guid: GUID,
      guidClass: namespace(String(GUID).padStart(3, '0')),
      enabled: false,
      active: false,
    }, Options, options, ($el.getData('tabsOptions') || {}));

    $el.setData(Namespace, data);

    data.el = this;
    data.$el = $el;
    data.target = data.$el.data(namespace('target', false));
    data.$target = Formstone(data.target);

    //

    data.mq = '(max-width:' + (data.mobileMaxWidth === Infinity ? '100000px' : data.mobileMaxWidth) + ')';

    data.href = data.$el.attr('href');
    data.group = data.$el.getData('tabsGroup');

    data.elClasses = [Classes.base, Classes.tab, data.guidClass, data.customClass];
    data.mobileTabClasses = [Classes.tab, Classes.tab_mobile, data.guidClass, data.customClass];
    data.contentClasses = [Classes.content, data.guidClass, data.customClass];

    // DOM

    data.$mobileTab = Formstone('<button type="button" class="' + data.mobileTabClasses.join(' ') + '" data-tabs-parent=".' + data.guidClass + '" aria-hidden="true">' + data.$el.html() + '</button>');
    data.mobileTab = data.$mobileTab.first();

    data.$content = Formstone(data.href).addClass(data.contentClasses.join(' '));
    data.content = data.$content.first();

    data.$content.before(data.$mobileTab)
      .attr('role', 'tabpanel');

    data.$el.attr('role', 'tab');

    // Aria

    data.id = data.$el.attr('id');

    if (data.id) {
      data.ariaId = data.id;
    } else {
      data.ariaId = data.guidClass;
      data.$el.attr('id', data.ariaId);
    }

    data.contentId = data.$content.attr('id');
    data.contentGuid = data.guidClass + '_content';

    if (data.contentId) {
      data.ariacontentId = data.contentId;
    } else {
      data.ariaContentId = data.contentGuid;
      data.$content.attr('id', data.ariaContentId);
    }

    // Check for hash

    var hash = window.location.hash;
    var hashActive = false;
    var hashGroup = false;

    if (hash.length) {
      hashActive = (data.$el.filter('[href*="' + hash + '"]').length > 0);
      hashGroup = data.group && (Formstone('[data-' + Namespace + '-group="' + data.group + '"]').filter('[href*="' + hash + '"]').length > 0);
    }

    if (hashActive) {
      // If this matches hash
      data.$el.attr('data-swap-active', 'true');
    } else if (hashGroup) {
      // If item in group matches hash
      data.el.removeAttribute('data-swap-active');
    } else if (data.$el.attr('data-tabs-active') === 'true') {
      // If this has active attribute
      data.$el.attr('data-swap-active', 'true');
    }

    data.$el.attr('data-swap-target', data.href)
      .attr('data-swap-group', data.group)
      .addClass(data.elClasses)
      .bind(Events.swap.activate, onActivate)
      .bind(Events.swap.deactivate, onDeactivate)
      .bind(Events.swap.enable, onEnable)
      .bind(Events.swap.disable, onDisable);
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

    data.$el.swap({
      maxWidth: data.maxWidth,
      classes: {
        target: data.guidClass,
        enabled: Classes.enabled,
        active: Classes.active,
      },
      collapse: false
    });

    data.$mobileTab.bind(Events.click, onMobileActivate);

    // Media Query support
    Formstone.mediaquery('bind', data.guidClass, data.mq, {
      enter: function() {
        mobileEnable.apply(data.el);
      },
      leave: function() {
        mobileDisable.apply(data.el);
      }
    });
  }

  /**
   * @private
   * @description Handles tab open event.
   * @param e [object] 'Event data'
   */

  function onActivate(e) {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      // index in group
      var index = (data.group) ? Formstone('[data-' + Namespace + '-group="' + data.group + '"]').nodes.indexOf(data.el) : null;

      data.$el.attr('aria-selected', true)
        .trigger(Events.update, index);
      data.$mobileTab.addClass(Classes.active);
      data.$content.attr('aria-hidden', false)
        .addClass(Classes.active);
    }
  }

  /**
   * @private
   * @description Handles tab close event.
   * @param e [object] 'Event data'
   */

  function onDeactivate(e) {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$el.attr('aria-selected', false);
      data.$mobileTab.removeClass(Classes.active);
      data.$content.attr('aria-hidden', true)
        .removeClass(Classes.active);
    }
  }

  /**
   * @private
   * @description Handles tab enable event.
   * @param e [object] 'Event data'
   */

  function onEnable(e) {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$el.attr('aria-controls', data.ariaContentId);
      data.$mobileTab.addClass(Classes.enabled);
      data.$content.attr('aria-labelledby', data.ariaId)
        .addClass(Classes.enabled);
    }
  }

  /**
   * @private
   * @description Handles tab disable event.
   * @param e [object] 'Event data'
   */

  function onDisable(e) {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.el.removeAttribute('aria-controls');
      data.el.removeAttribute('aria-selected');

      data.$mobileTab.removeClass(Classes.enabled);

      data.content.removeAttribute('aria-labelledby');
      data.content.removeAttribute('aria-hidden');
      data.$content.removeClass(Classes.enabled);
    }
  }

  /**
   * @private
   * @description Activates instance.
   * @param e [object] 'Event data'
   */

  function onMobileActivate(e) {
    var parent = Formstone(this).data(namespace('parent', false));
    var data = Formstone(parent).getData(Namespace);

    if (data) {
      data.$el.swap('activate');
    }
  }

  /**
   * @private
   * @description Handles mobile enable event.
   */

  function mobileEnable() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$el.addClass(Classes.mobile);
      data.$mobileTab.addClass(Classes.mobile);
      data.$content.addClass(Classes.mobile);
    }
  }

  /**
   * @private
   * @description Handles mobile disable event.
   */

  function mobileDisable() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$el.removeClass(Classes.mobile);
      data.$mobileTab.removeClass(Classes.mobile);
      data.$content.removeClass(Classes.mobile);
    }
  }

  // Public

  /**
   * @description Sets default options; applies to future instances.
   * @param {Object} options - Default options
   * @example Formstone.swap('defaults', { ... });
   */

  function defaults(options) {
    Options = Formstone.extend({}, Options, options);
  }

  /**
   * @private
   * @description Tears down instance.
   * @example Formstone.swap('destroy');
   */

  function destroy() {
    var data = Formstone(this).getData(Namespace);

    if (!data) {
      return;
    }

    Formstone.mediaquery('unbind', data.guidClass);

    data.$mobileTab.unbind(Events.namespace)
      .remove();

    data.elClasses.push(Classes.mobile);
    data.contentClasses.push(Classes.mobile);

    data.content.removeAttribute('aria-labelledby');
    data.content.removeAttribute('aria-hidden');
    data.content.removeAttribute('role');
    data.$content.removeClass(data.contentClasses);

    if (data.$content.attr('id') === data.contentGuid) {
      data.content.removeAttribute('id');
    }

    data.el.removeAttribute('aria-controls');
    data.el.removeAttribute('aria-selected');
    data.el.removeAttribute('data-swap-active');
    data.el.removeAttribute('data-swap-target');
    data.el.removeAttribute('data-swap-group');
    data.el.removeAttribute('role');
    data.$el.removeClass(data.elClasses)
      .unbind(Events.swap.namespace)
      .swap('destroy');

    if (data.$el.attr('id') === data.guidClass) {
      data.el.removeAttribute('id');
    }

    data.$el.deleteData(Namespace);
  }

  /**
   * @description Activates instance.
   * @example Formstone('.target').tabs('activate');
   */

  function activate() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$el.swap('activate');
    }
  }

  /**
   * @description Enables instance.
   * @example Formstone('.target').tabs('enable');
   */

  function enable() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$el.swap('enable');
    }
  }

  /**
   * @description Disables instance.
   * @example Formstone('.target').tabs('disable');
   */

  function disable() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.$el.swap('disable');
    }
  }

  // Component

  Formstone.Component(Namespace, {
    _construct: construct,
    _postConstruct: postConstruct,
    defaults: defaults,
    destroy: destroy,
    activate: activate,
    enable: enable,
    disable: disable,
  });

  /**
   * @event update.tabs
   * @description Tab has been activated
   * @param {Object} e - Event data
   * @param {Number} index - Active index in group
   * @example Formstone('.target').bind('update.tabs', function(e, index) { ... });
   */

})(window, Formstone);