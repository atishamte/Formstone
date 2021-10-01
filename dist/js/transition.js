/*! formstone v1.4.22 [transition.js] 2021-10-01 | GPL-3.0 License | formstone.it */
!function(t){"function"==typeof define&&define.amd?define(["jquery","./core"],t):t(jQuery,Formstone)}(function(s,a){"use strict";function i(t){t.stopPropagation(),t.preventDefault();var e=t.data,r=t.originalEvent,n=e.target?e.$target:e.$el;e.property&&r.propertyName!==e.property||!s(r.target).is(n)||o(e)}function o(t){t.always||t.$el[e.namespaceClean]("destroy"),t.callback.apply(t.$el)}function c(t){var e,r,n,a={};if(t instanceof s&&(t=t[0]),f.getComputedStyle)for(var i=0,o=(e=f.getComputedStyle(t,null)).length;i<o;i++)r=e[i],n=e.getPropertyValue(r),a[r]=n;else if(t.currentStyle)for(r in e=t.currentStyle)a[r]=e[r];return a}var e=a.Plugin("transition",{widget:!0,defaults:{always:!1,property:null,target:null},methods:{_construct:function(t,e){if(e){t.$target=this.find(t.target),t.$check=t.target?t.$target:this,t.callback=e,t.styles=c(t.$check),t.timer=null;var r=t.$check.css(a.transition+"-duration"),n=parseFloat(r);a.support.transition&&r&&n?this.on(l.transitionEnd,t,i):t.timer=u.startTimer(t.timer,50,function(){!function(t){var e=c(t.$check);!function(t,e){if(typeof t!=typeof e)return!1;for(var r in t){if(!t.hasOwnProperty(r))return!1;if(!t.hasOwnProperty(r)||!e.hasOwnProperty(r)||t[r]!==e[r])return!1}return!0}(t.styles,e)&&o(t);t.styles=e}(t)},!0)}},_destruct:function(t){u.clearTimer(t.timer,!0),this.off(l.namespace)},resolve:o}}),l=e.events,u=e.functions,f=a.window});