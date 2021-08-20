/**
 * @function
 * @name Touch
 * @description A javascript plugin for multi-touch events.
 * @param {Object} options - Instance options
 * @param {String} [options.axis=null] - Limit axis for pan and swipe; 'x' or 'y'
 * @param {Boolean} [options.pan=false] - Pan events
 * @param {Boolean} [options.scale=false] - Scale events
 * @param {Boolean} [options.swipe=false] - Swipe events
 * @param {Number} [options.threshold=10] - Touch threshold for single axis
 * @param {Number} [options.time=50] - Touch time for single axis, in milliseconds
 * @requires core
 * @example Formstone('.target').touch({ ... });
 */

 (function(window, Formstone) {

  'use strict';

  var Namespace = 'touch';
  var GUID = 0;

  var PointerSuppoort = !!(window.PointerEvent);

  var Options = {
    axis: null,
    pan: false,
    scale: false,
    swipe: false,
    threshold: 10,
    time: 50,
  };

  var Classes = {
    base: namespace(''),
  };

  var Events = {
    namespace: eventspace(''),
    click: eventspace('click'),

    // drag: eventspace('drag'),
    dragend: eventspace('dragend'),
    // dragenter: eventspace('dragenter'),
    // dragleave: eventspace('dragleave'),
    // dragover: eventspace('dragover'),
    dragstart: eventspace('dragstart'),

    mousedown: eventspace('mousedown'),
    mouseup: eventspace('mouseup'),
    mousemove: eventspace('mousemove'),

    touchstart: eventspace('touchstart'),
    touchend: eventspace('touchend'),
    touchmove: eventspace('touchmove'),
    touchcancel: eventspace('touchcancel'),
    touchleave: eventspace('touchleave'),

    pointerdown: eventspace('pointerdown'),
    pointerup: eventspace('pointerup'),
    pointermove: eventspace('pointermove'),
    pointercancel: eventspace('pointercancel'),

    pan: eventspace('pan'),
    panstart: eventspace('panstart'),
    panend: eventspace('panend'),
    scale: eventspace('scale'),
    scalestart: eventspace('scalestart'),
    scaleend: eventspace('scaleend'),
    swipe: eventspace('swipe'),
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
      touches: [],
      touching: false,
    }, Options, options, ($el.getData('touchOptions') || {}));

    $el.setData(Namespace, data);

    data.el = this;
    data.$el = $el;

    data.$el.addClass([Classes.base, data.guidClass])
      .bind(Events.dragstart, Formstone.killEvent);

    if (data.swipe) {
      data.pan = true;
    }

    if (data.scale) {
      data.axis = null;
    }

    data.axisX = ( data.axis === 'x' );
    data.axisY = ( data.axis === 'y' );

    // Pointer Events
    if (PointerSuppoort) {
      var action = '';

      if (!data.axis || (data.axisX && data.axisY)) {
        action = 'none';
      } else {
        if (data.axisX) {
          action += ' pan-y';
        }
        if (data.axisY) {
          action += ' pan-x';
        }
      }

      data.el.style['touch-action'] = action;

      data.$el.bind(Events.pointerdown, onTouch);
    } else {
      // Touch Events
      data.$el.bind(Events.touchstart, onTouch)
        .bind(Events.mousedown, onPointerStart);
    }
  }

  /**
   * @private
   * @description Delegates touch events.
   * @param {Object} e - Event object
   */

  function onTouch(e) {
    var data = Formstone(this).getData(Namespace);

    if (!data) {
      return;
    }

    // Stop panning and zooming
    if (e.preventManipulation) {
      e.preventManipulation();
    }

    if (e.type.match(/(up|end|cancel)$/i)) {
      onPointerEnd.apply(data.el, [e]);
      return;
    }

    if (e.pointerId) {
      // Normalize MS pointer events back to standard touches
      var activeTouch = false;

      for (var i in data.touches) {
        if (data.touches[i].id === e.pointerId) {
          activeTouch = true;
          data.touches[i].pageX = e.pageX;
          data.touches[i].pageY = e.pageY;
        }
      }

      if (!activeTouch) {
        data.touches.push({
          id: e.pointerId,
          pageX: e.pageX,
          pageY: e.pageY
        });
      }
    } else {
      // Alias normal touches
      data.touches = e.touches;
    }

    // Delegate touch actions
    if (e.type.match(/(down|start)$/i)) {
      onPointerStart.apply(data.el, [e]);
    } else if (e.type.match(/move$/i)) {
      onPointerMove.apply(data.el, [e]);
    }
  }

  /**
   * @private
   * @description Handles pointer start.
   * @param {Object} e - Event object
   */

  function onPointerStart(e) {
    var data = Formstone(this).getData(Namespace);

    if (!data) {
      return;
    }

    var touch = (typeof data.touches !== 'undefined' && data.touches.length) ? data.touches[0] : null;

    if (touch) {
      data.$el.unbind(Events.mousedown);
    }

    if (!data.touching) {
      data.startE = e;
      data.startX = (touch) ? touch.pageX : e.pageX;
      data.startY = (touch) ? touch.pageY : e.pageY;
      data.startT = new Date().getTime();
      data.scaleD = 1;
      data.passedAxis = false;
    }

    // Clear old click events

    if (data.$links) {
      data.$links.unbind(Events.click);
    }

    // Pan / Scale

    var newE = buildEvent(data.scale ? Events.scalestart : Events.panstart, e, data.startX, data.startY, data.scaleD, 0, 0, "", "");

    if (data.scale && data.touches && data.touches.length >= 2) {
      var t = data.touches;

      data.pinch = {
        startX: midpoint(t[0].pageX, t[1].pageX),
        startY: midpoint(t[0].pageY, t[1].pageY),
        startD: pythagorus((t[1].pageX - t[0].pageX), (t[1].pageY - t[0].pageY))
      };

      newE.pageX = data.startX = data.pinch.startX;
      newE.pageY = data.startY = data.pinch.startY;
    }

    // Only bind at first touch
    if (!data.touching) {
      data.touching = true;

      if (data.pan && !touch) {
        Formstone('body').bind(Events.mousemove, function(e) {
          onPointerMove.apply(data.el, [e]);
        }).bind(Events.mouseup, function(e) {
          onPointerEnd.apply(data.el, [e]);
        });
      }

      if (PointerSuppoort) {
        Formstone('body').bind([
          Events.pointermove,
          Events.pointerup,
          Events.pointercancel
        ], function(e) {
          onTouch.apply(data.el, [e]);
        });
      } else {
        Formstone('body').bind([
          Events.touchmove,
          Events.touchend,
          Events.touchcancel
        ], function(e) {
          onTouch.apply(data.el, [e]);
        });
      }

      // data.$el.trigger(newE);
      data.el.dispatchEvent(newE);
    }
  }

  /**
   * @private
   * @description Handles pointer move.
   * @param {Object} e - Event object
   */

  function onPointerMove(e) {
    var data = Formstone(this).getData(Namespace);

    if (!data) {
      return;
    }

    var touch = (typeof data.touches !== 'undefined' && data.touches.length) ? data.touches[0] : null;
    var newX = (touch) ? touch.pageX : e.pageX;
    var newY = (touch) ? touch.pageY : e.pageY;
    var deltaX = newX - data.startX;
    var deltaY = newY - data.startY;
    var dirX = (deltaX > 0) ? 'right' : 'left';
    var dirY = (deltaY > 0) ? 'down' : 'up';
    var movedX = Math.abs(deltaX) > data.threshold;
    var movedY = Math.abs(deltaY) > data.threshold;

    if (!data.passedAxis && data.axis && ((data.axisX && movedY) || (data.axisY && movedX))) {
      // if axis and moved in opposite direction
      onPointerEnd.apply(data.el, [e]);
    } else {
      if (!data.passedAxis && (!data.axis || (data.axis && (data.axisX && movedX) || (data.axisY && movedY)))) {
        // if has axis and moved in same direction
        data.passedAxis = true;
      }

      if (data.passedAxis) {
        Formstone.killEvent(e);
        Formstone.killEvent(data.startE);
      }

      // Pan / Scale

      var fire = true;
      var newE = buildEvent(data.scale ? Events.scale : Events.pan, e, newX, newY, data.scaleD, deltaX, deltaY, dirX, dirY);

      if (data.scale) {
        if (data.touches && data.touches.length >= 2) {
          var t = data.touches;

          data.pinch.endX = midpoint(t[0].pageX, t[1].pageX);
          data.pinch.endY = midpoint(t[0].pageY, t[1].pageY);
          data.pinch.endD = pythagorus((t[1].pageX - t[0].pageX), (t[1].pageY - t[0].pageY));
          data.scaleD = (data.pinch.endD / data.pinch.startD);
          newE.pageX = data.pinch.endX;
          newE.pageY = data.pinch.endY;
          newE.scale = data.scaleD;
          newE.deltaX = data.pinch.endX - data.pinch.startX;
          newE.deltaY = data.pinch.endY - data.pinch.startY;
        } else if (!data.pan) {
          fire = false;
        }
      }

      if (fire) {
        // data.$el.trigger(newE);
        data.el.dispatchEvent(newE);
      }
    }
  }

  /**
   * @private
   * @description Handles pointer end / cancel.
   * @param {Object} e - Event object
   */

  function onPointerEnd(e) {
    var data = Formstone(this).getData(Namespace);

    if (!data) {
      return;
    }

    // Pan / Swipe / Scale

    var touch = (typeof data.touches !== 'undefined' && data.touches.length) ? data.touches[0] : null;
    var newX = (touch) ? touch.pageX : e.pageX;
    var newY = (touch) ? touch.pageY : e.pageY;
    var deltaX = newX - data.startX;
    var deltaY = newY - data.startY;
    var endT = new Date().getTime();
    var eType = data.scale ? Events.scaleend : Events.panend;
    var dirX = (deltaX > 0) ? 'right' : 'left';
    var dirY = (deltaY > 0) ? 'down' : 'up';
    var movedX = Math.abs(deltaX) > 1;
    var movedY = Math.abs(deltaY) > 1;

    // Swipe
    if ( data.swipe && (endT - data.startT) < data.time && Math.abs(deltaX) > data.threshold) {
      eType = Events.swipe;
    }

    // Kill clicks to internal links

    if ((data.axis && ((data.axisX && movedY) || (data.axisY && movedX))) || (movedX || movedY)) {
      data.$links = data.$el.find('a');

      for (var i = 0, count = data.$links.length; i < count; i++) {
        bindLink(data.$links.eq(i), data);
      }
    }

    var newE = buildEvent(eType, e, newX, newY, data.scaleD, deltaX, deltaY, dirX, dirY);

    Formstone('body').unbind([
      Events.touchmove,
      Events.touchend,
      Events.touchcancel,
      Events.mousemove,
      Events.mouseup,
      Events.pointermove,
      Events.pointerup,
      Events.pointercancel
    ]);

    // data.$el.trigger(newE);
    data.el.dispatchEvent(newE);

    data.touches = [];

    if (data.scale) {
      /*
      if (e.originalEvent.pointerId) {
        for (var i in data.touches) {
          if (data.touches[i].id === e.originalEvent.pointerId) {
            data.touches.splice(i, 1);
          }
        }
      } else {
        data.touches = e.originalEvent.touches;
      }
      */

      /*
      if (data.touches.length) {
        onPointerStart($.extend(e, {
          data: data,
          originalEvent: {
            touches: data.touches
          }
        }));
      }
      */
    }

    if (touch) {
      data.touchTimer = Formstone.startTimer(data.touchTimer, 5, function() {
        data.$el.bind(Events.mousedown, onPointerStart);
      });
    }

    data.touching = false;
  }

  /**
   * @private
   * @description Builds new event.
   * @param {String} event - Event type
   * @param {Object} oe - Original event object
   * @param {Number} x - X value
   * @param {Number} y - Y value
   * @param {Number} scale - Scale value
   * @param {Number} dx - Delta X value
   * @param {Number} dy - Delta Y value
   * @param {Number} dirx - Direction X value
   * @param {Number} diry - Direction Y value
   */

  function buildEvent(event, oe, px, py, s, dx, dy, dirx, diry) {
    var ev;

    var parts = event.split('.');
    var domEvent = parts.shift();
    var namespace = parts.join('.');

    // Allow the event to bubble up and to be cancelable (as default)
    var opts = {
      bubbles: true,
      cancelable: true,
      detail: {
        pageX: px,
        pageY: py,
        scale: s,
        deltaX: dx,
        deltaY: dy,
        directionX: dirx,
        directionY: diry,
        // originalEvent: oe,
      }
    };

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

    return ev;

    // node.dispatchEvent(ev);

    // return $.Event(type, {
    //   originalEvent: oe,
    //   bubbles: true,
    //   pageX: px,
    //   pageY: py,
    //   scale: s,
    //   deltaX: dx,
    //   deltaY: dy,
    //   directionX: dirx,
    //   directionY: diry
    // });
  }

  /**
   * @private
   * @description Calculates midpoint.
   * @param {Number} a - Value 1
   * @param {Number} b - Value 2
   */

  function midpoint(a, b) {
    return (a + b) / 2.0;
  }

  /**
   * @private
   * @description Pythagorean midpoint.
   * @param {Number} a - Value 1
   * @param {Number} b - Value 2
   */

  function pythagorus(a, b) {
    return Math.sqrt((a * a) + (b * b));
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
   * @description Tears down instance.
   * @example Formstone('.target').swap('destroy');
   */

  function destroy() {
    var data = Formstone(this).getData(Namespace);

    if (data) {
      data.el.removeProperty('touch-action');

      data.$el.removeClass([Classes.base, data.guidClass])
        .unbind(Events.namespace)
        .deleteData(Namespace);
    }
  }

  // Component

  Formstone.Component(Namespace, {
    _construct: construct,
    defaults: defaults,
    destroy: destroy,
  });

  /**
   * @event pan.touch
   * @description Panning
   * @param {Object} e - Event data
   * @example Formstone('.target').bind('pan.touch', function(e) { ... });
   */

})(window, Formstone);






//     /**
//      * @method private
//      * @name bindLink
//      * @description Bind events to internal links
//      * @param $link [object] "Object to bind"
//      * @param data [object] "Instance data"
//      */

//     function bindLink($link, data) {
//       $link.on(Events.click, data, onLinkClick);

//       // http://www.elijahmanor.com/how-to-access-jquerys-internal-data/
//       var events = $._data($link[0], "events")["click"];
//       events.unshift(events.pop());
//     }

//     /**
//      * @method private
//      * @name onLinkClick
//      * @description Handles clicks to internal links
//      * @param e [object] "Event data"
//      */

//     function onLinkClick(e) {
//       Functions.killEvent(e, true);
//       e.data.$links.off(Events.click);
//     }




