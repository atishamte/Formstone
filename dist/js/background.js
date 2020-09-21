/*! formstone v1.4.16-1 [background.js] 2020-09-21 | GPL-3.0 License | formstone.it */
!function(e){"function"==typeof define&&define.amd?define(["jquery","./core","./transition"],e):e(jQuery,Formstone)}(function(u,t){"use strict";function e(){(Y=$.scrollTop()+t.windowHeight)<0&&(Y=0),T.iterate.call(j,s)}function i(){C=u(m.base),j=u(m.lazy),T.iterate.call(j,r)}function o(e){if(e.visible){var i=e.source;e.source=null,a(e,i,!0)}}function a(e,i,o){if(i!==e.source&&e.visible){if(e.source=i,e.responsive=!1,e.isYouTube=!1,"object"===u.type(i)&&"string"===u.type(i.video)){var t=i.video.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);t&&1<=t.length&&(e.isYouTube=!0,e.videoId=t[1])}var a=!e.isYouTube&&"object"===u.type(i)&&(i.hasOwnProperty("mp4")||i.hasOwnProperty("ogg")||i.hasOwnProperty("webm"));if(e.video=e.isYouTube||a,e.playing=!1,e.isYouTube)e.playerReady=!1,e.posterLoaded=!1,p(e,i,o);else if("object"===u.type(i)&&i.hasOwnProperty("poster"))!function(i,e,o){i.source&&i.source.poster&&(c(i,i.source.poster,!0,!0),o=!1);var t='<div class="'+[b.media,b.video,!0!==o?b.animated:""].join(" ")+'" aria-hidden="true">';t+="<video playsinline",i.loop&&(t+=" loop");i.mute&&(t+=" muted");i.autoPlay&&(t+=" autoplay");t+=">",i.source.webm&&(t+='<source src="'+i.source.webm+'" type="video/webm" />');i.source.mp4&&(t+='<source src="'+i.source.mp4+'" type="video/mp4" />');i.source.ogg&&(t+='<source src="'+i.source.ogg+'" type="video/ogg" />');t+="</video>";var a=u(t+="</div>");a.find("video").one(w.loadedMetaData,function(e){a.fsTransition({property:"opacity"},function(){y(i)}).css({opacity:1}),h(i),i.$el.trigger(w.loaded),i.autoPlay&&f(i)}),i.$container.append(a)}(e,0,o);else{var n=i;if("object"===u.type(i)){var r,s=[],d=[];for(r in i)i.hasOwnProperty(r)&&d.push(r);for(r in d.sort(T.sortAsc),d)d.hasOwnProperty(r)&&s.push({width:parseInt(d[r]),url:i[d[r]],mq:P.matchMedia("(min-width: "+parseInt(d[r])+"px)")});e.responsive=!0,e.sources=s,n=l(e)}c(e,n,!1,o)}}else e.$el.trigger(w.loaded)}function l(e){var i=e.source;if(e.responsive)for(var o in i=e.sources[0].url,e.sources)e.sources.hasOwnProperty(o)&&(t.support.matchMedia?e.sources[o].mq.matches&&(i=e.sources[o].url):e.sources[o].width<t.fallbackWidth&&(i=e.sources[o].url));return i}function c(e,i,o,t){var a=[b.media,b.image,!0!==t?b.animated:""].join(" "),n=u('<div class="'+a+'" aria-hidden="true"><img alt="'+e.alt+'"></div>'),r=n.find("img"),s=i;r.one(w.load,function(){I&&n.addClass(b.native).css({backgroundImage:"url('"+s+"')"}),n.fsTransition({property:"opacity"},function(){o||y(e)}).css({opacity:1}),h(e),o&&!t||e.$el.trigger(w.loaded)}).one(w.error,e,d).attr("src",s),e.responsive&&n.addClass(b.responsive),e.$container.append(n),!r[0].complete&&4!==r[0].readyState||r.trigger(w.load),e.currentSource=s}function p(i,e,o){if(!i.videoId){var t=e.match(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);i.videoId=t[1]}if(i.posterLoaded||(i.source.poster||(i.source.poster="//img.youtube.com/vi/"+i.videoId+"/0.jpg"),i.posterLoaded=!0,c(i,i.source.poster,!0,o),o=!1),u("script[src*='youtube.com/iframe_api']").length||u("head").append('<script src="//www.youtube.com/iframe_api"><\/script>'),R){var a=i.guid+"_"+i.youTubeGuid++,n='<div class="'+[b.media,b.embed,!0!==o?b.animated:""].join(" ")+'" aria-hidden="true">';n+='<div id="'+a+'"></div>';var r=u(n+="</div>"),s=u.extend(!0,{},{controls:0,rel:0,showinfo:0,wmode:"transparent",enablejsapi:1,version:3,playerapiid:a,loop:i.loop?1:0,autoplay:1,mute:1,origin:P.location.protocol+"//"+P.location.host},i.youtubeOptions);s.autoplay=1,i.$container.append(r),i.player&&(i.oldPlayer=i.player,i.player=null),i.player=new P.YT.Player(a,{videoId:i.videoId,playerVars:s,events:{onReady:function(e){i.playerReady=!0,i.mute&&i.player.mute(),i.autoPlay?i.player.playVideo():i.player.pauseVideo()},onStateChange:function(e){i.playing||e.data!==P.YT.PlayerState.PLAYING?i.loop&&i.playing&&e.data===P.YT.PlayerState.ENDED&&i.player.playVideo():(i.playing=!0,r.fsTransition({property:"opacity"},function(){y(i)}).css({opacity:1}),h(i),i.$el.trigger(w.loaded)),i.$el.find(m.embed).addClass(b.ready)},onPlaybackQualityChange:function(e){},onPlaybackRateChange:function(e){},onError:function(e){d({data:i})},onApiChange:function(e){}}}),h(i)}else z.push({data:i,source:e})}function y(e){var i=e.$container.find(m.media);1<=i.length&&(i.not(":last").remove(),e.oldPlayer=null)}function d(e){e.data.$el.trigger(w.error)}function f(e){if(e.video&&!e.playing)if(e.isYouTube)e.playerReady?e.player.playVideo():e.autoPlay=!0;else{var i=e.$container.find("video");i.length&&i[0].play(),e.playing=!0}}function n(e){if(e.visible)if(e.responsive){var i=l(e);i!==e.currentSource?c(e,i,!1,!0):h(e)}else h(e)}function h(e){for(var i=e.$container.find(m.media),o=0,t=i.length;o<t;o++){var a=i.eq(o),n=e.isYouTube?"iframe":a.find("video").length?"video":"img",r=a.find(n);if(r.length&&("img"!=n||!I)){var s=e.$el.outerWidth(),d=e.$el.outerHeight(),u=v(e,r);e.width=u.width,e.height=u.height,e.left=0,e.top=0;var l=e.isYouTube?e.embedRatio:e.width/e.height;e.height=d,e.width=e.height*l,e.width<s&&(e.width=s,e.height=e.width/l),e.left=-(e.width-s)/2,e.top=-(e.height-d)/2,a.css({height:e.height,width:e.width,left:e.left,top:e.top})}}}function r(e){e.scrollTop=e.$el.offset().top}function s(e){!e.visible&&e.scrollTop<Y+e.lazyEdge&&(e.visible=!0,o(e))}function v(e,i){if(e.isYouTube)return{height:500,width:500/e.embedRatio};if(i.is("img")){var o=i[0];if("undefined"!==u.type(o.naturalHeight))return{height:o.naturalHeight,width:o.naturalWidth};var t=new Image;return t.src=o.src,{height:t.height,width:t.width}}return{height:i[0].videoHeight,width:i[0].videoWidth}}var g=t.Plugin("background",{widget:!0,defaults:{alt:"",autoPlay:!0,customClass:"",embedRatio:1.777777,lazy:!1,lazyEdge:100,loop:!0,mute:!0,source:null,youtubeOptions:{}},classes:["container","media","animated","responsive","native","fixed","ready","lazy"],events:{loaded:"loaded",ready:"ready",loadedMetaData:"loadedmetadata"},methods:{_construct:function(e){e.youTubeGuid=0,e.$container=u('<div class="'+b.container+'"></div>').appendTo(this),e.thisClasses=[b.base,e.customClass],e.visible=!0,e.lazy&&(e.visible=!1,e.thisClasses.push(b.lazy)),this.addClass(e.thisClasses.join(" ")),i(),e.lazy?(r(e),s(e)):o(e)},_destruct:function(e){e.$container.remove(),this.removeClass(e.thisClasses.join(" ")).off(w.namespace),i()},_resize:function(){T.iterate.call(C,n),T.iterate.call(j,r),T.iterate.call(j,s)},play:f,pause:function(e){if(e.video&&e.playing){if(e.isYouTube)e.playerReady?e.player.pauseVideo():e.autoPlay=!1;else{var i=e.$container.find("video");i.length&&i[0].pause()}e.playing=!1}},mute:function(e){if(e.video)if(e.isYouTube&&e.playerReady)e.player.mute();else{var i=e.$container.find("video");i.length&&(i[0].muted=!0)}e.mute=!0},unmute:function(e){if(e.video){if(e.isYouTube&&e.playerReady)e.player.unMute();else{var i=e.$container.find("video");i.length&&(i[0].muted=!1)}e.playing=!0}e.mute=!1},resize:h,load:a,unload:function(e){var i=e.$container.find(m.media);1<=i.length&&i.fsTransition({property:"opacity"},function(){i.remove(),delete e.source}).css({opacity:0})}}}),m=g.classes,b=m.raw,w=g.events,T=g.functions,P=t.window,$=t.$window,Y=0,C=[],j=[],I="backgroundSize"in t.document.documentElement.style,R=!1,z=[];t.Ready(function(){e(),$.on("scroll",e)}),P.onYouTubeIframeAPIReady=function(){for(var e in R=!0,z)z.hasOwnProperty(e)&&p(z[e].data,z[e].source);z=[]}});