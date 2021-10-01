/*! formstone v1.4.21 [core.js] 2021-10-01 | GPL-3.0 License | formstone.it */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)}(function(w){"use strict";function e(){this.Version="1.4.21",this.Plugins={},this.DontConflict=!1,this.Conflicts={fn:{}},this.ResizeHandlers=[],this.RAFHandlers=[],this.window=i,this.$window=w(i),this.document=r,this.$document=w(r),this.$body=null,this.windowWidth=0,this.windowHeight=0,this.fallbackWidth=1024,this.fallbackHeight=768,this.userAgent=window.navigator.userAgent||window.navigator.vendor||window.opera,this.isFirefox=/Firefox/i.test(this.userAgent),this.isChrome=/Chrome/i.test(this.userAgent),this.isSafari=/Safari/i.test(this.userAgent)&&!this.isChrome,this.isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(this.userAgent),this.isIEMobile=/IEMobile/i.test(this.userAgent),this.isFirefoxMobile=this.isFirefox&&this.isMobile,this.transform=null,this.transition=null,this.support={file:!!(window.File&&window.FileList&&window.FileReader),history:!!(window.history&&window.history.pushState&&window.history.replaceState),matchMedia:!(!window.matchMedia&&!window.msMatchMedia),pointer:!!window.PointerEvent,raf:!(!window.requestAnimationFrame||!window.cancelAnimationFrame),touch:!!("ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch),transition:!1,transform:!1}}var t,n,s,i="undefined"!=typeof window?window:this,r=i.document,o={killEvent:function(e,t){try{e.preventDefault(),e.stopPropagation(),t&&e.stopImmediatePropagation()}catch(e){}},killGesture:function(e){try{e.preventDefault()}catch(e){}},lockViewport:function(e){h[e]=!0,w.isEmptyObject(h)||p||(t.length?t.attr("content",s):t=w("head").append('<meta name="viewport" content="'+s+'">'),c.$body.on(u.gestureChange,o.killGesture).on(u.gestureStart,o.killGesture).on(u.gestureEnd,o.killGesture),p=!0)},unlockViewport:function(e){void 0!==h[e]&&delete h[e],w.isEmptyObject(h)&&p&&(t.length&&(n?t.attr("content",n):t.remove()),c.$body.off(u.gestureChange).off(u.gestureStart).off(u.gestureEnd),p=!1)},startTimer:function(e,t,n,s){return o.clearTimer(e),s?setInterval(n,t):setTimeout(n,t)},clearTimer:function(e,t){e&&(t?clearInterval(e):clearTimeout(e),e=null)},sortAsc:function(e,t){return parseInt(e,10)-parseInt(t,10)},sortDesc:function(e,t){return parseInt(t,10)-parseInt(e,10)},decodeEntities:function(e){var t=c.document.createElement("textarea");return t.innerHTML=e,t.value},parseQueryString:function(e){for(var t={},n=e.slice(e.indexOf("?")+1).split("&"),s=0;s<n.length;s++){var i=n[s].split("=");t[i[0]]=i[1]}return t}},c=new e,a=w.Deferred(),l={base:"{ns}",element:"{ns}-element"},u={namespace:".{ns}",beforeUnload:"beforeunload.{ns}",blur:"blur.{ns}",change:"change.{ns}",click:"click.{ns}",dblClick:"dblclick.{ns}",drag:"drag.{ns}",dragEnd:"dragend.{ns}",dragEnter:"dragenter.{ns}",dragLeave:"dragleave.{ns}",dragOver:"dragover.{ns}",dragStart:"dragstart.{ns}",drop:"drop.{ns}",error:"error.{ns}",focus:"focus.{ns}",focusIn:"focusin.{ns}",focusOut:"focusout.{ns}",gestureChange:"gesturechange.{ns}",gestureStart:"gesturestart.{ns}",gestureEnd:"gestureend.{ns}",input:"input.{ns}",keyDown:"keydown.{ns}",keyPress:"keypress.{ns}",keyUp:"keyup.{ns}",load:"load.{ns}",mouseDown:"mousedown.{ns}",mouseEnter:"mouseenter.{ns}",mouseLeave:"mouseleave.{ns}",mouseMove:"mousemove.{ns}",mouseOut:"mouseout.{ns}",mouseOver:"mouseover.{ns}",mouseUp:"mouseup.{ns}",panStart:"panstart.{ns}",pan:"pan.{ns}",panEnd:"panend.{ns}",resize:"resize.{ns}",scaleStart:"scalestart.{ns}",scaleEnd:"scaleend.{ns}",scale:"scale.{ns}",scroll:"scroll.{ns}",select:"select.{ns}",swipe:"swipe.{ns}",touchCancel:"touchcancel.{ns}",touchEnd:"touchend.{ns}",touchLeave:"touchleave.{ns}",touchMove:"touchmove.{ns}",touchStart:"touchstart.{ns}"},d=null,f=20,h=[],p=!1;function m(e,t,n,s){var i,r={raw:{}};for(i in s=s||{})s.hasOwnProperty(i)&&("classes"===e?(r.raw[s[i]]=t+"-"+s[i],r[s[i]]="."+t+"-"+s[i]):(r.raw[i]=s[i],r[i]=s[i]+"."+t));for(i in n)n.hasOwnProperty(i)&&("classes"===e?(r.raw[i]=n[i].replace(/{ns}/g,t),r[i]=n[i].replace(/{ns}/g,"."+t)):(r.raw[i]=n[i].replace(/.{ns}/g,""),r[i]=n[i].replace(/{ns}/g,t)));return r}function g(){c.windowWidth=c.$window.width(),c.windowHeight=c.$window.height(),d=o.startTimer(d,f,y)}function y(){for(var e in c.ResizeHandlers)c.ResizeHandlers.hasOwnProperty(e)&&c.ResizeHandlers[e].callback.call(window,c.windowWidth,c.windowHeight)}function v(e,t){return parseInt(e.priority)-parseInt(t.priority)}return e.prototype.NoConflict=function(){for(var e in c.DontConflict=!0,c.Plugins)c.Plugins.hasOwnProperty(e)&&(w[e]=c.Conflicts[e],w.fn[e]=c.Conflicts.fn[e])},e.prototype.Ready=function(e){"complete"===c.document.readyState||"loading"!==c.document.readyState&&!c.document.documentElement.doScroll?e():c.document.addEventListener("DOMContentLoaded",e)},e.prototype.Plugin=function(e,t){function d(e){return e.data(p)}var f,h,n,p;return c.Plugins[e]=(h=t,n="fs-"+(f=e),p="fs"+f.replace(/(^|\s)([a-z])/g,function(e,t,n){return t+n.toUpperCase()}),h.initialized=!1,h.priority=h.priority||10,h.classes=m("classes",n,l,h.classes),h.events=m("events",f,u,h.events),h.functions=w.extend({getData:d,iterate:function(e){for(var t=Array.prototype.slice.call(arguments,1),n=0,s=this.length;n<s;n++){var i=this.eq(n),r=d(i)||{};void 0!==r.$el&&e.apply(i,[r].concat(t))}return this}},o,h.functions),h.methods=w.extend(!0,{_construct:w.noop,_postConstruct:w.noop,_destruct:w.noop,_resize:!1,destroy:function(e){h.functions.iterate.apply(this,[h.methods._destruct].concat(Array.prototype.slice.call(arguments,1))),this.removeClass(h.classes.raw.element).removeData(p)}},h.methods),h.utilities=w.extend(!0,{_initialize:!1,_delegate:!1,defaults:function(e){h.defaults=w.extend(!0,h.defaults,e||{})}},h.utilities),h.widget&&(c.Conflicts.fn[f]=w.fn[f],w.fn[p]=function(e){if(this instanceof w){var t=h.methods[e];if("object"==typeof e||!e)return function(e){var t,n,s,i="object"==typeof e,r=Array.prototype.slice.call(arguments,i?1:0),o=w();for(e=w.extend(!0,{},h.defaults||{},i?e:{}),n=0,s=this.length;n<s;n++)if(!d(t=this.eq(n))){h.guid++;var a="__"+h.guid,c=h.classes.raw.base+a,l=t.data(f+"-options"),u=w.extend(!0,{$el:t,guid:a,numGuid:h.guid,rawGuid:c,dotGuid:"."+c},e,"object"==typeof l?l:{});t.addClass(h.classes.raw.element).data(p,u),h.methods._construct.apply(t,[u].concat(r)),o=o.add(t)}for(n=0,s=o.length;n<s;n++)t=o.eq(n),h.methods._postConstruct.apply(t,[d(t)]);return this}.apply(this,arguments);if(t&&0!==e.indexOf("_")){var n=[t].concat(Array.prototype.slice.call(arguments,1));return h.functions.iterate.apply(this,n)}return this}},c.DontConflict||(w.fn[f]=w.fn[p])),c.Conflicts[f]=w[f],w[p]=h.utilities._delegate||function(e){var t=h.utilities[e]||h.utilities._initialize||!1;if(t){var n=Array.prototype.slice.call(arguments,"object"==typeof e?0:1);return t.apply(window,n)}},c.DontConflict||(w[f]=w[p]),h.namespace=f,h.namespaceClean=p,h.guid=0,h.methods._resize&&(c.ResizeHandlers.push({namespace:f,priority:h.priority,callback:h.methods._resize}),c.ResizeHandlers.sort(v)),h.methods._raf&&(c.RAFHandlers.push({namespace:f,priority:h.priority,callback:h.methods._raf}),c.RAFHandlers.sort(v)),h),c.Plugins[e]},c.$window.on("resize.fs",g),g(),function e(){if(c.support.raf)for(var t in c.window.requestAnimationFrame(e),c.RAFHandlers)c.RAFHandlers.hasOwnProperty(t)&&c.RAFHandlers[t].callback.call(window)}(),c.Ready(function(){c.$body=w("body"),w("html").addClass(c.support.touch?"touchevents":"no-touchevents"),t=w('meta[name="viewport"]'),n=!!t.length&&t.attr("content"),s="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",a.resolve()}),u.clickTouchStart=u.click+" "+u.touchStart,function(){var e,t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"},n=["transition","-webkit-transition"],s={transform:"transform",MozTransform:"-moz-transform",OTransform:"-o-transform",msTransform:"-ms-transform",webkitTransform:"-webkit-transform"},i="transitionend",r="",o="",a=document.createElement("div");for(e in t)if(t.hasOwnProperty(e)&&e in a.style){i=t[e],c.support.transition=!0;break}for(e in u.transitionEnd=i+".{ns}",n)if(n.hasOwnProperty(e)&&n[e]in a.style){r=n[e];break}for(e in c.transition=r,s)if(s.hasOwnProperty(e)&&s[e]in a.style){c.support.transform=!0,o=s[e];break}c.transform=o}(),window.Formstone=c});