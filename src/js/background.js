/**
 * @function
 * @name Background
 * @description A javascript plugin full-frame image and video backgrounds.
 * @param {Object} options - Instance options
 * @param {Boolean} [options.autoPlay=true] - Autoplay video background
 * @param {String} [options.customClass=''] - Additional class applied to element
 * @param {Number} [options.embedRatio=1.777] - Video / embed ratio (16/9)
 * @param {Boolean} [options.lazy=false] - Lazy load background
 * @param {String} [options.lazyEdge='100px'] - Lazy load edge; must include CSS unit
 * @param {Boolean} [options.loop=true] - Loop video background
 * @param {Boolean} [options.mute=true] - Mute video background
 * @param {String} [options.source=null] - Source image string
 * @param {Object} [options.source={}] - Source media object
 * @example Formstone('.target').background({ ... });
 */

(function(window, Formstone) {

  'use strict';

  var Namespace = 'background';
  var GUID = 0;

  var $Instances = Formstone();
  // var $LazyInstances = Formstone();
  var YouTubeReady = false;
  var YouTubeQueue = [];

  var Initialized = false;
  var ResizeWatcher = new ResizeObserver(resize);

  var Options = {
    alt: '',
    autoPlay: true,
    customClass: '',
    embedRatio: 1.777777,
    lazy: false,
    lazyEdge: '100px',
    loop: true,
    mute: true,
    source: null,
    youtubeOptions: {} // deprecated
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
    $Instances.each(function(el, i) {
      resizeInstance.apply(el);
    });
  }

  /**
   * @method private
   * @name scroll
   * @description Handles instance visibilty changes.
   */

  function scroll(changes, observer) {
    changes.forEach(function(change, i) {
      if (change.intersectionRatio > 0) {
        loadInstance.apply(change.target);
      }
    });
  }

  // Private

  /**
   * @private
   * @description Builds instance.
   */

  function construct(data) {
    var data = Formstone.getData(this, Namespace);

    if (data) {
      return;
    }

    initialize();

    GUID++

    data = Formstone.extend({
      guid: GUID,
      guidClass: namespace(String(GUID).padStart(3, '0')),
      enabled: false,
      active: false,
    }, Options, (Formstone.getData(this, 'backgroundOptions') || {}));

    Formstone.setData(this, Namespace, data);


    data.el = this;
    data.$el = Formstone(this);
    data.$container = Formstone('<div class="' + namespace('container') + '"></div>');

    data.thisClasses = [namespace(''), data.guidClass, data.customClass]
    data.visible = true;
    data.youTubeGuid = 0;

    if (data.lazy) {
      data.visible = false;
      data.thisClasses.push(namespace('lazy'));
    }

    data.$el.addClass(data.thisClasses).append(data.$container);

    if (!data.lazy) {
      loadInitialSource.apply(data.el);
    } else {
      data.scrollWatcher = new IntersectionObserver(scroll, {
        root: null,
        rootMargin: data.lazyEdge,
        threshold: 0
      });

      data.scrollWatcher.observe(data.el);
    }

    $Instances = Formstone('.' + namespace(''));
  }

  /**
   * @private
   * @description Loads visible instances.
   */

  function loadInstance() {
    var data = Formstone.getData(this, Namespace);

    if (data && !data.visible) {
      data.visible = true;
      data.$el.removeClass(namespace('lazy'));

      data.scrollWatcher.disconnect();
      data.scrollWatcher = null;

      loadInitialSource.apply(data.el);
    }
  }

  /**
   * @private
   * @description Loads initial source.
   */

  function loadInitialSource() {
    var data = Formstone.getData(this, Namespace);

    if (data && data.visible) {
      var source = data.source;
      data.source = null;

      loadMedia.apply(data.el, [source, true]);
    }
  }

  /**
   * @private
   * @description Determines responsive source.
   * @return {String} - New source url
   */

   function calculateSource() {
    var data = Formstone.getData(this, Namespace);

    if (!data) {
      return;
    }

    var source = data.source;

    if (data.responsive) {
      source = data.sources[0].url;

      for (var i in data.sources) {
        if (data.sources.hasOwnProperty(i)) {
          if (data.sources[i].mq.matches) {
            source = data.sources[i].url;
          }
        }
      }
    }

    return source;
  }

  /**
   * @private
   * @description Loads source image.
   * @param {String} source - 'Source image'
   * @param {Boolean} poster - 'Flag for video poster'
   * @param {Boolean} firstLoad - 'Flag for first load'
   */

  function loadImage(source, poster, firstLoad) {
    var data = Formstone.getData(this, Namespace);

    if (!data) {
      return;
    }

    var imageClasses = [namespace('media'), namespace('image'), (firstLoad !== true ? namespace('animated') : '')];
    var $media = Formstone('<div class="' + imageClasses.join(' ') + '" aria-hidden="true"><img alt="' + data.alt + '"></div>');
    var $img = $media.find('img');
    var newSource = source;

    // Load image
    $img.on('load', function() {
      $media.first().style.backgroundImage = 'url(' + newSource + ')';

      // Transition in
      $media.first().style.opacity = 1;
      // $media.css({
      //   opacity: 1
      // });
      // $media.fsTransition({ // JQ
      //   property: "opacity"
      // },
      // function() {
      //   if (!poster) {
          cleanMedia.apply(data.el);
      //   }
      // }).css({ // JQ
      //   opacity: 1
      // });

      doResizeInstance.apply(data.el);

      if (!poster || firstLoad) {
        data.$el.trigger('loaded');
      }
    }).on('error', loadError)
      .attr('src', newSource);

    if (data.responsive) {
      $media.addClass(namespace('responsive'));
    }

    data.$container.append($media);

    // Check if image is cached
    if ($img.first().complete || $img.first().readyState === 4) {
      $img.trigger('load');
    }

    data.currentSource = newSource;
  }

  /**
   * @method private
   * @description Loads source video
   * @param {String} source - 'Source video'
   * @param {Boolean} firstLoad - 'Flag for first load'
   */

  function loadVideo(source, firstLoad) {
    var data = Formstone.getData(this, Namespace);

    if (!data) {
      return;
    }

    if (data.source && data.source.poster) {
      loadImage.apply(data.el, [data.source.poster, true, true]);

      firstLoad = false;
    }

    var videoClasses = [namespace('media'), namespace('video'), (firstLoad !== true ? namespace('animated') : '')];
    var html = '<div class="' + videoClasses.join(' ') + '" aria-hidden="true">';

    html += '<video playsinline';
    if (data.loop) {
      html += ' loop';
    }
    if (data.mute) {
      html += ' muted';
    }
    if (data.autoPlay) {
      html += ' autoplay';
    }
    html += '>';
    if (data.source.webm) {
      html += '<source src="' + data.source.webm + '" type="video/webm" />';
    }
    if (data.source.mp4) {
      html += '<source src="' + data.source.mp4 + '" type="video/mp4" />';
    }
    if (data.source.ogg) {
      html += '<source src="' + data.source.ogg + '" type="video/ogg" />';
    }
    html += '</video>';
    html += '</div>';

    var $media = Formstone(html);
    var $video = $media.find('video');

    $video.on('loadedmetadata', function(e) {
      $media.first().style.opacity = 1;
    //   // $media.css({
    //   //   opacity: 1
    //   // });
    //   // $media.fsTransition({ // JQ
    //   //   property: "opacity"
    //   // },
    //   // function() {
        cleanMedia.apply(data.el);
    //   // }).css({ // JQ
    //   //   opacity: 1
    //   // });

      doResizeInstance.apply(data.el);

      // data.$el.trigger(Events.loaded); // JQ

      // Events
      if (data.autoPlay) {
        playVideo.apply(data.el);
      }
    });

    data.$container.append($media);
  }

  /**
   * @private
   * @description Loads source video
   * @param {String} source - 'Source video'
   * @param {Boolean} firstLoad - 'Flag for first load'
   */

  function loadYouTube(source, firstLoad) {
    var data = Formstone.getData(this, Namespace);

    if (!data) {
      return;
    }

    if (!data.videoId) {
      var parts = source.match(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
      data.videoId = parts[1];
    }

    if (!data.posterLoaded) {
      if (!data.source.poster) {
        data.source.poster = '//img.youtube.com/vi/' + data.videoId + '/0.jpg';
      }

      data.posterLoaded = true;
      loadImage.apply(data.el, [data.source.poster, true, firstLoad]);

      firstLoad = false;
    }

    if (!Formstone('script[src*="youtube.com/iframe_api"]').nodes.length) {
      var script = document.createElement('script');
      script.src = '//www.youtube.com/iframe_api';
      Formstone('head').append(Formstone(script));
    }

    if (!YouTubeReady) {
      YouTubeQueue.push({
        data: data,
        el: data.el,
        source: source
      });
    } else {
      var guid = data.guid + '-' + (data.youTubeGuid++);
      var youTubeClasses = [namespace('media'), namespace('embed'), (firstLoad !== true ? namespace('animated') : '')];
      var html = '<div class="' + youTubeClasses.join(' ') + '" aria-hidden="true">';

      html += '<div id="' + guid + '"></div>';
      html += '</div>';

      var $media = Formstone(html);
      var ytOptions = Formstone.extend(true, {
        controls: 0,
        rel: 0,
        showinfo: 0,
        wmode: 'transparent',
        enablejsapi: 1,
        version: 3,
        playerapiid: guid,
        loop: (data.loop) ? 1 : 0,
        autoplay: 1,
        mute: 1,
        origin: window.location.protocol + '//' + window.location.host
      }, data.youtubeOptions);

      // For youtube autoplay so events fire, disabled by plugin
      ytOptions.autoplay = 1;

      data.$container.append($media);

      if (data.player) {
        data.oldPlayer = data.player;
        data.player = null;
      }

      data.player = new window.YT.Player(guid, {
        videoId: data.videoId,
        playerVars: ytOptions,
        events: {
          onReady: function(e) {
            /* console.log("onReady", e); */

            data.playerReady = true;
            /* data.player.setPlaybackQuality("highres"); */

            if (data.mute) {
              data.player.mute();
            }

            if (data.autoPlay) {
              // make sure the video plays
              data.player.playVideo();
            } else {
              data.player.pauseVideo();
            }
          },
          onStateChange: function(e) {
            /* console.log("onStateChange", e); */

            // -1 = unstarted
            //  0 = ended
            //  1 = playing
            //  2 = paused
            //  3 = buffering
            //  4 =
            //  5 = cued

            if (!data.playing && e.data === window.YT.PlayerState.PLAYING) {
              data.playing = true;

              $media.first().style.opacity = 1;
              // $media.css({
              //   opacity: 1
              // });
              // $media.fsTransition({ // JQ
              //   property: "opacity"
              // },
              // function() {
                cleanMedia.apply(data.el);
              // }).css({
              //   opacity: 1
              // });

              doResizeInstance.apply(data.el);

              // data.$el.trigger(Events.loaded); // JQ
            } else if (data.loop && data.playing && e.data === window.YT.PlayerState.ENDED) {
              // fix looping option
              data.player.playVideo();
            }

            // Fix for Safari's overly secure security settings...
            var embed = data.$el.find('.' + namespace('embed'));
            Formstone(embed).addClass(namespace('ready'));
          },
          onPlaybackQualityChange: function(e) {
            /* console.log("onPlaybackQualityChange", e); */
          },
          onPlaybackRateChange: function(e) {
            /* console.log("onPlaybackRateChange", e); */
          },
          onError: function(e) {
            /* console.log("onError", e); */
            loadError({
              data: data
            });
          },
          onApiChange: function(e) {
            /* console.log("onApiChange", e); */
          }
        }
      });

      // Resize
      doResizeInstance.apply(data.el);
    }
  }

  /**
   * @private
   * @description Cleans up old media.
   */

  function cleanMedia() {
    var data = Formstone.getData(this, Namespace);

    if (!data) {
      return;
    }

    var $media = data.$container.find('.' + namespace('media'));

    if ($media.nodes.length >= 1) {
      $media.not(':last-child').remove();
      data.oldPlayer = null;
    }
  }

  /**
   * @private
   * @description Error when resource fails to load.
   */

  function loadError(e) {
    // var data = e.data;

    // data.$el.trigger(Events.error); // JQ
  }

  // Public

  /**
   * @description Sets default options; applies to future instances.
   * @param {Object} options - Default options
   * @example Formstone.background('defaults', { ... });
   */

   function defaults(options) {
    Options = Formstone.extend({}, Options, options);
  }

  /**
   * @private
   * @description Tears down instance.
   * @example Formstone('.target').background('destroy');
   */

  function destroy(data) {
    var data = Formstone.getData(this, Namespace);

    if (data) {
      data.$container.remove();

      this.removeClass(data.thisClasses);
        // .off(Events.namespace); // JQ

      cacheInstances();
    }
  }

  /**
   * @method
   * @name load
   * @description Loads source media.
   * @param {String} [options.source=null] - Source image string
   * @param {Object} [options.source={}] - Source media object
   * @example Formstone('.target').background('load', 'path/to/image.jpg');
   * @example Formstone('.target').background('load', { '0px': 'path/to/image-small.jpg', '980px': 'path/to/image-large.jpg' });
   * @example Formstone('.target').background('load', { 'poster': 'path/to/image.jpg', 'webm': 'path/to/video.webm', 'mp4': 'path/to/video.mp4', 'ogg': 'path/to/video.ogv' });
   */

  /**
   * @private
   * @description Determines how to handle source media
   * @param {String} [source=null] - Source image string
   * @param {Object} [source={}] - Source media object
   * @param {Boolean} [firstLoad] - Flag for first load
   */

  function loadMedia(source, firstLoad) {
    var data = Formstone.getData(this, Namespace);

    if (!data) {
      return;
    }

    // Check if the source is new
    if (source !== data.source && data.visible) {
      data.source = source;
      data.responsive = false;
      data.isYouTube = false;

      // Check YouTube
      if (Formstone.type(source) === 'object' && Formstone.type(source.video) === 'string') {
        var parts = source.video.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);

        if (parts && parts.length >= 1) {
          data.isYouTube = true;
          data.videoId = parts[1];
        }
      }

      var isVideo = !data.isYouTube && (Formstone.type(source) === 'object' &&
        (source.hasOwnProperty('mp4') || source.hasOwnProperty('ogg') || source.hasOwnProperty('webm'))
      );

      data.video = data.isYouTube || isVideo;
      data.playing = false;

      if (data.isYouTube) {
        // YouTube video
        data.playerReady = false;
        data.posterLoaded = false;

        loadYouTube.apply(this, [source, firstLoad]);
      } else if (Formstone.type(source) === 'object' && source.hasOwnProperty('poster')) {
        // HTML5 video
        loadVideo.apply(this, [source, firstLoad]);
      } else {
        var newSource = source;

        // Responsive image handling
        if (Formstone.type(source) === 'object') {
          var cache = [],
            keys = [],
            i;

          for (i in source) {
            if (source.hasOwnProperty(i)) {
              keys.push(i);
            }
          }

          keys.sort(Formstone.sortAsc);

          for (i in keys) {
            if (keys.hasOwnProperty(i)) {
              cache.push({
                width: parseInt(keys[i]),
                url: source[keys[i]],
                mq: window.matchMedia('(min-width: ' + parseInt(keys[i]) + 'px)')
              });
            }
          }

          data.responsive = true;
          data.sources = cache;

          newSource = calculateSource.apply(data.el);
        }

        loadImage.apply(data.el, [newSource, false, firstLoad]);
      }
    } else {
      // data.$el.trigger(Events.loaded); // JQ
    }
  }


  /**
   * @name unload
   * @description Unloads current media.
   * @example Formstone('.target').background('unload');
   */

  /**
   * @private
   * @description Unloads current media.
   */

  function unloadMedia(data) {
    var data = Formstone.getData(this, Namespace);

    if (data) {
      var $media = data.$container.find('.' + namespace('media'));

      if ($media.nodes.length >= 1) {
        $media.first().style.opacity = 0;
        // $media.css({
        //   opacity: 0
        // });
        // $media.fsTransition({ // JQ
        //   property: "opacity"
        // },
        // function() {
          $media.remove();

          delete data.source;
        // }).css({ // JQ
        //   opacity: 0
        // });
      }
    }
  }

  /**
   * @name pause
   * @description Pauses target video.
   * @example Formstone('.target').background('pause');
   */

  /**
   * @private
   * @description Pauses target video.
   */

  function pauseVideo() {
    var data = Formstone.getData(this, Namespace);

    if (data && data.video && data.playing) {
      if (data.isYouTube) {
        if (data.playerReady) {
          data.player.pauseVideo();
        } else {
          data.autoPlay = false;
        }
      } else {
        var $video = data.$container.find('video');

        if ($video) {
          $video.first().pause();
        }
      }

      data.playing = false;
    }
  }

  /**
   * @method
   * @name play
   * @description Plays target video.
   * @example Formstone('.target').background('play');
   */

  /**
   * @private
   * @description Plays target video.
   */

  function playVideo() {
    var data = Formstone.getData(this, Namespace);

    if (data && data.video && !data.playing) {
      if (data.isYouTube) {
        if (data.playerReady) {
          data.player.playVideo();
        } else {
          data.autoPlay = true;
        }
      } else {
        var $video = data.$container.find('video');

        if ($video.nodes.length) {
          $video.first().play();
        }

        data.playing = true;
      }
    }
  }

  /**
   * @name mute
   * @description Mutes target video.
   * @example Formstone('.target').background('mute');
   */

  /**
   * @private
   * @description Mutes target video.
   */

  function muteVideo() {
    var data = Formstone.getData(this, Namespace);

    if (data && data.video) {
      if (data.isYouTube && data.playerReady) {
        data.player.mute();
      } else {
        var $video = data.$container.find('video');

        if ($video) {
          $video.first().muted = true;
        }
      }

      data.mute = true;
    }
  }

  /**
   * @name unmute
   * @description Unmutes target video.
   * @example Formstone('.target').background('unmute');
   */

  /**
   * @private
   * @description Unmutes target video.
   */

  function unmuteVideo(data) {
    var data = Formstone.getData(this, Namespace);

    if (data && data.video) {
      if (data.isYouTube && data.playerReady) {
        data.player.unMute();
      } else {
        var $video = data.$container.find('video');

        if ($video) {
          $video.first().muted = false;
        }
      }

      // data.playing = true;
      data.mute = false;
    }
  }

  /**
   * @private
   * @description Handles window resize event.
   */

  function resizeInstance() {
    var data = Formstone.getData(this, Namespace);

    if (data && data.visible) {
      if (data.responsive) {
        var newSource = calculateSource.apply(data.el);

        if (newSource !== data.currentSource) {
          loadImage.apply(data.el, [newSource, true, true]);
        } else {
          doResizeInstance.apply(data.el);
        }
      } else {
        doResizeInstance.apply(data.el);
      }
    }
  }

  /**
   * @name resize
   * @description Resizes target instance.
   * @example Formstone('.target').background('resize');
   */

  /**
   * @private
   * @description Resizes target instance.
   */

  function doResizeInstance() {
    var data = Formstone.getData(this, Namespace);

    if (!data) {
      return;
    }

    // Target all media
    var $allMedia = data.$container.find('.' + namespace('media'));

    $allMedia.each(function(el, i) {
      var $media = Formstone(el);
      var $youTube = $media.find('iframe');

      if ($youTube.nodes.length) {
        var frameSize = data.$el.size();

        // First check the height
        data.height = frameSize.height;
        data.width = data.height * data.embedRatio;
        data.left = 0;
        data.top = 0;

        // Next check the width
        if (data.width < frameSize.width) {
          data.width = frameSize.width;
          data.height = data.width / data.embedRatio;
        }

        // Position the media
        data.left = -(data.width - frameSize.width) / 2;
        data.top = -(data.height - frameSize.height) / 2;

        var m = $media.first();

        m.style.height = data.height + 'px';
        m.style.width = data.width + 'px';
        m.style.left = data.left + 'px';
        m.style.top = data.top + 'px';
      }
    });
  }

  // Component

  Formstone.Component(Namespace, {
    _construct: construct,
    defaults: defaults,
    destroy: destroy,
    load: loadMedia,
    unload: unloadMedia,
    pause: pauseVideo,
    play: playVideo,
    mute: muteVideo,
    unmute: unmuteVideo,
  });

  /**
   * @private
   * @name window.onYouTubeIframeAPIReady
   * @description Attaches YouTube players to active instances.
   */

  window.onYouTubeIframeAPIReady = function() {
    YouTubeReady = true;

    for (var i in YouTubeQueue) {
      if (YouTubeQueue.hasOwnProperty(i)) {
        loadYouTube.apply(YouTubeQueue[i].data.el, [YouTubeQueue[i].source]);
      }
    }

    YouTubeQueue = [];
  };

})(window, Formstone);