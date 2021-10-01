/*! formstone v1.4.21 [analytics.js] 2021-10-01 | GPL-3.0 License | formstone.it */
!function(e){"function"==typeof define&&define.amd?define(["jquery","./core","./mediaquery"],e):e(jQuery,Formstone)}(function(c,a){"use strict";function t(){p.scrollDepth&&l()}function n(){var e,t=c(this),n=void 0!==t[0].href?t[0].href:"",i=document.domain.split(".").reverse(),o=null!==n.match(i[1]+"."+i[0]);if(n.match(/^mailto\:/i))e="Email, Click, "+n.replace(/^mailto\:/i,"");else if(n.match(/^tel\:/i))e="Telephone, Click, "+n.replace(/^tel\:/i,"");else if(n.match(p.fileTypes)){e="File, Download:"+(/[.]/.exec(n)?/[^.]+$/.exec(n):void 0)[0]+", "+n.replace(/ /g,"-")}else o||(e="ExternalLink, Click, "+n);e&&t.attr(w,e)}function i(e){h.startTimer(T,250,o)}function o(){for(var e,t=u.scrollTop()+a.windowHeight,n=1/p.scrollStops,i=n,o=1;o<=p.scrollStops;o++){if(e=Math.round(100*i).toString(),!x[k][e].passed&&t>x[k][e].edge)x[k][e].passed=!0,s(c.extend(p.scrollFields,{eventCategory:"ScrollDepth",eventAction:k,eventLabel:e,nonInteraction:!0}));i+=n}}function l(){var e,t=c.mediaquery("state"),n=v.outerHeight(),i={},o=1/p.scrollStops,a=o,l=0;t.minWidth&&(k="MinWidth:"+t.minWidth+"px");for(var r=1;r<=p.scrollStops;r++)l=parseInt(n*a),i[e=Math.round(100*a).toString()]={edge:"100"===e?l-10:l,passsed:!(!x[k]||!x[k][e])&&x[k][e].passed},a+=o;x[k]=i}function r(e){var t=c(this),n=t.attr("href"),i=t.data(g).split(",");for(var o in p.eventCallback&&e.preventDefault(),i)i.hasOwnProperty(o)&&(i[o]=c.trim(i[o]));s({eventCategory:i[0],eventAction:i[1],eventLabel:i[2]||n,eventValue:i[3],nonInteraction:i[4]},t)}function s(e,t){d.location;var n=c.extend({hitType:"event"},e);if(void 0!==t&&!t.attr("data-analytics-stop")){var i=void 0!==t[0].href?t[0].href:"",o=!i.match(/^mailto\:/i)&&!i.match(/^tel\:/i)&&i.indexOf(":")<0?d.location.protocol+"//"+d.location.hostname+"/"+i:i;if(""!==o){var a=t.attr("target");if(a)d.open(o,a);else if(p.eventCallback){var l="hitCallback";n[l]=function(){b&&(h.clearTimer(b),function(e){document.location=e}(o))},b=h.startTimer(b,p.eventTimeout,n[l])}}}f(n)}function f(e){if("function"==typeof d.ga&&"function"==typeof d.ga.getAll)for(var t=d.ga.getAll(),n=0,i=t.length;n<i;n++)d.ga(t[n].get("name")+".send",e)}var e=a.Plugin("analytics",{methods:{_resize:t},utilities:{_delegate:function(){if(arguments.length&&"object"!=typeof arguments[0])if("destroy"===arguments[0])(function(){y&&v&&v.length&&(u.off(m.namespace),v.off(m.namespace),y=!1)}).apply(this);else{var e=Array.prototype.slice.call(arguments,1);switch(arguments[0]){case"pageview":(function(e){f(c.extend({hitType:"pageview"},e))}).apply(this,e);break;case"event":s.apply(this,e)}}else(function(e){!y&&v&&v.length&&(y=!0,(p=c.extend(p,e||{})).autoEvents&&v.find("a").not("["+w+"]").each(n),p.scrollDepth&&(l(),u.on(m.scroll,i).one(m.load,t)),v.on(m.click,"*["+w+"]",r))}).apply(this,arguments);return null}}}),p={autoEvents:!1,fileTypes:/\.(zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|txt|rar|wma|mov|avi|wmv|flv|wav)$/i,eventCallback:!1,eventTimeout:1e3,scrollDepth:!1,scrollStops:5,scrollFields:{}},d=a.window,u=a.$window,v=null,h=e.functions,m=e.events,y=!1,g="analytics-event",w="data-"+g,x={},T=null,k="Site",b=null;a.Ready(function(){v=a.$body})});