'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* The MIT License (MIT)

Copyright (c) 2014-2015 Benoit Tremblay <trembl.ben@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
/*global define, YT*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['videojs'], function (videojs) {
      return root.Youtube = factory(videojs);
    });
  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    module.exports = root.Youtube = factory(require('videojs'));
  } else {
    root.Youtube = factory(root.videojs);
  }
})(undefined, function (videojs) {
  'use strict';

  var Tech = videojs.getComponent('Tech');

  var Youtube = videojs.extend(Tech, {

    constructor: function constructor(options, ready) {
      Tech.call(this, options, ready);

      this.setPoster(options.poster);
      this.setSrc(this.options_.source, true);

      // Set the vjs-youtube class to the player
      // Parent is not set yet so we have to wait a tick
      setTimeout(function () {
        this.el_.parentNode.className += ' vjs-youtube';

        if (_isOnMobile) {
          this.el_.parentNode.className += ' vjs-youtube-mobile';
        }

        if (Youtube.isApiReady) {
          this.initYTPlayer();
        } else {
          Youtube.apiReadyQueue.push(this);
        }
      }.bind(this));
    },

    dispose: function dispose() {
      this.el_.parentNode.className = this.el_.parentNode.className.replace(' vjs-youtube', '').replace(' vjs-youtube-mobile', '');
    },

    createEl: function createEl() {
      var div = document.createElement('div');
      div.setAttribute('id', this.options_.techId);
      div.setAttribute('style', 'width:100%;height:100%;top:0;left:0;position:absolute');

      var divWrapper = document.createElement('div');
      divWrapper.appendChild(div);

      if (!_isOnMobile && !this.options_.ytControls) {
        var divBlocker = document.createElement('div');
        divBlocker.setAttribute('class', 'vjs-iframe-blocker');
        divBlocker.setAttribute('style', 'position:absolute;top:0;left:0;width:100%;height:100%');

        // In case the blocker is still there and we want to pause
        divBlocker.onclick = function () {
          this.pause();
        }.bind(this);

        divWrapper.appendChild(divBlocker);
      }

      return divWrapper;
    },

    initYTPlayer: function initYTPlayer() {
      var playerVars = {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        loop: this.options_.loop ? 1 : 0
      };

      // Let the user set any YouTube parameter
      // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#Parameters
      // To use YouTube controls, you must use ytControls instead
      // To use the loop or autoplay, use the video.js settings

      if (typeof this.options_.autohide !== 'undefined') {
        playerVars.autohide = this.options_.autohide;
      }

      if (typeof this.options_['cc_load_policy'] !== 'undefined') {
        playerVars['cc_load_policy'] = this.options_['cc_load_policy'];
      }

      if (typeof this.options_.ytControls !== 'undefined') {
        playerVars.controls = this.options_.ytControls;
      }

      if (typeof this.options_.disablekb !== 'undefined') {
        playerVars.disablekb = this.options_.disablekb;
      }

      if (typeof this.options_.end !== 'undefined') {
        playerVars.end = this.options_.end;
      }

      if (typeof this.options_.color !== 'undefined') {
        playerVars.color = this.options_.color;
      }

      if (!playerVars.controls) {
        // Let video.js handle the fullscreen unless it is the YouTube native controls
        playerVars.fs = 0;
      } else if (typeof this.options_.fs !== 'undefined') {
        playerVars.fs = this.options_.fs;
      }

      if (typeof this.options_.end !== 'undefined') {
        playerVars.end = this.options_.end;
      }

      if (typeof this.options_.hl !== 'undefined') {
        playerVars.hl = this.options_.hl;
      } else if (typeof this.options_.language !== 'undefined') {
        // Set the YouTube player on the same language than video.js
        playerVars.hl = this.options_.language.substr(0, 2);
      }

      if (typeof this.options_['iv_load_policy'] !== 'undefined') {
        playerVars['iv_load_policy'] = this.options_['iv_load_policy'];
      }

      if (typeof this.options_.list !== 'undefined') {
        playerVars.list = this.options_.list;
      } else if (this.url && typeof this.url.listId !== 'undefined') {
        playerVars.list = this.url.listId;
      }

      if (typeof this.options_.listType !== 'undefined') {
        playerVars.listType = this.options_.listType;
      }

      if (typeof this.options_.modestbranding !== 'undefined') {
        playerVars.modestbranding = this.options_.modestbranding;
      }

      if (typeof this.options_.playlist !== 'undefined') {
        playerVars.playlist = this.options_.playlist;
      }

      if (typeof this.options_.playsinline !== 'undefined') {
        playerVars.playsinline = this.options_.playsinline;
      }

      if (typeof this.options_.rel !== 'undefined') {
        playerVars.rel = this.options_.rel;
      }

      if (typeof this.options_.showinfo !== 'undefined') {
        playerVars.showinfo = this.options_.showinfo;
      }

      if (typeof this.options_.start !== 'undefined') {
        playerVars.start = this.options_.start;
      }

      if (typeof this.options_.theme !== 'undefined') {
        playerVars.theme = this.options_.theme;
      }

      this.activeVideoId = this.url ? this.url.videoId : null;
      this.activeList = playerVars.list;

      this.ytPlayer = new YT.Player(this.options_.techId, {
        videoId: this.activeVideoId,
        playerVars: playerVars,
        events: {
          onReady: this.onPlayerReady.bind(this),
          onPlaybackQualityChange: this.onPlayerPlaybackQualityChange.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
          onError: this.onPlayerError.bind(this)
        }
      });
    },

    onPlayerReady: function onPlayerReady() {
      this.playerReady_ = true;
      this.triggerReady();

      if (this.playOnReady) {
        this.play();
      }
    },

    onPlayerPlaybackQualityChange: function onPlayerPlaybackQualityChange() {},

    onPlayerStateChange: function onPlayerStateChange(e) {
      var state = e.data;

      if (state === this.lastState) {
        return;
      }

      switch (state) {
        case -1:
          this.trigger('loadedmetadata');
          this.trigger('durationchange');
          break;

        case YT.PlayerState.ENDED:
          this.trigger('ended');
          break;

        case YT.PlayerState.PLAYING:
          this.trigger('timeupdate');
          this.trigger('durationchange');
          this.trigger('playing');
          this.trigger('play');

          if (this.isSeeking) {
            this.onSeeked();
          }
          break;

        case YT.PlayerState.PAUSED:
          this.trigger('canplay');
          if (this.isSeeking) {
            this.onSeeked();
          } else {
            this.trigger('pause');
          }
          break;

        case YT.PlayerState.BUFFERING:
          this.player_.trigger('timeupdate');
          this.player_.trigger('waiting');
          break;
      }

      this.lastState = state;
    },

    onPlayerError: function onPlayerError(e) {
      this.errorNumber = e.data;
      this.trigger('error');

      this.ytPlayer.stopVideo();
      this.ytPlayer.destroy();
      this.ytPlayer = null;
    },

    error: function error() {
      switch (this.errorNumber) {
        case 2:
          return { code: 'Unable to find the video' };

        case 5:
          return { code: 'Error while trying to play the video' };

        case 100:
          return { code: 'Unable to find the video' };

        case 101:
        case 150:
          return { code: 'Playback on other Websites has been disabled by the video owner.' };
      }

      return { code: 'YouTube unknown error (' + this.errorNumber + ')' };
    },

    src: function src(_src) {
      if (_src) {
        this.setSrc({ src: _src });
        this.play();
      }

      return this.source;
    },

    poster: function poster() {
      // You can't start programmaticlly a video with a mobile
      // through the iframe so we hide the poster and the play button (with CSS)
      if (_isOnMobile) {
        return null;
      }

      return this.poster_;
    },

    setPoster: function setPoster(poster) {
      this.poster_ = poster;
    },

    setSrc: function setSrc(source) {
      if (!source || !source.src) {
        return;
      }

      this.source = source;
      this.url = Youtube.parseUrl(source.src);

      if (!this.options_.poster) {
        if (this.url.videoId) {
          // Set the low resolution first
          this.poster_ = 'https://img.youtube.com/vi/' + this.url.videoId + '/0.jpg';

          // Check if their is a high res
          this.checkHighResPoster();
        }
      }

      if (this.options_.autoplay && !_isOnMobile) {
        if (this.isReady_) {
          this.play();
        } else {
          this.playOnReady = true;
        }
      }
    },

    play: function play() {
      if (!this.url || !this.url.videoId) {
        return;
      }

      if (this.isReady_) {
        if (this.url.listId) {
          if (this.activeList === this.url.listId) {
            this.ytPlayer.playVideo();
          } else {
            this.ytPlayer.loadPlaylist(this.url.listId);
            this.activeList = this.url.listId;
          }
        }

        if (this.activeVideoId === this.url.videoId) {
          this.ytPlayer.playVideo();
        } else {
          this.ytPlayer.loadVideoById(this.url.videoId);
          this.activeVideoId = this.url.videoId;
        }
      } else {
        this.trigger('waiting');
        this.playOnReady = true;
      }
    },

    pause: function pause() {
      if (this.ytPlayer) {
        this.ytPlayer.pauseVideo();
      }
    },

    paused: function paused() {
      return this.ytPlayer ? this.lastState !== YT.PlayerState.PLAYING && this.lastState !== YT.PlayerState.BUFFERING : true;
    },

    currentTime: function currentTime() {
      return this.ytPlayer ? this.ytPlayer.getCurrentTime() : 0;
    },

    setCurrentTime: function setCurrentTime(seconds) {
      if (this.lastState === YT.PlayerState.PAUSED) {
        this.timeBeforeSeek = this.currentTime();
      }

      if (!this.isSeeking) {
        this.wasPausedBeforeSeek = this.paused();
      }

      this.ytPlayer.seekTo(seconds, true);
      this.trigger('timeupdate');
      this.trigger('seeking');
      this.isSeeking = true;

      // A seek event during pause does not return an event to trigger a seeked event,
      // so run an interval timer to look for the currentTime to change
      if (this.lastState === YT.PlayerState.PAUSED && this.timeBeforeSeek !== seconds) {
        clearInterval(this.checkSeekedInPauseInterval);
        this.checkSeekedInPauseInterval = setInterval(function () {
          if (this.lastState !== YT.PlayerState.PAUSED || !this.isSeeking) {
            // If something changed while we were waiting for the currentTime to change,
            //  clear the interval timer
            clearInterval(this.checkSeekedInPauseInterval);
          } else if (this.currentTime() !== this.timeBeforeSeek) {
            this.trigger('timeupdate');
            this.onSeeked();
          }
        }.bind(this), 250);
      }
    },

    onSeeked: function onSeeked() {
      clearInterval(this.checkSeekedInPauseInterval);
      this.trigger('seeked');
      this.isSeeking = false;
      if (this.wasPausedBeforeSeek) {
        this.pause();
      }
    },

    playbackRate: function playbackRate() {
      return this.ytPlayer ? this.ytPlayer.getPlaybackRate() : 1;
    },

    setPlaybackRate: function setPlaybackRate(suggestedRate) {
      if (!this.ytPlayer) {
        return;
      }

      this.ytPlayer.setPlaybackRate(suggestedRate);
      this.trigger('ratechange');
    },

    duration: function duration() {
      return this.ytPlayer ? this.ytPlayer.getDuration() : 0;
    },

    currentSrc: function currentSrc() {
      return this.source;
    },

    ended: function ended() {
      return this.ytPlayer ? this.lastState === YT.PlayerState.ENDED : false;
    },

    volume: function volume() {
      return this.ytPlayer ? this.ytPlayer.getVolume() / 100.0 : 1;
    },

    setVolume: function setVolume(percentAsDecimal) {
      if (!this.ytPlayer) {
        return;
      }

      this.ytPlayer.setVolume(percentAsDecimal * 100.0);
      this.setTimeout(function () {
        this.trigger('volumechange');
      }, 50);
    },

    muted: function muted() {
      return this.ytPlayer ? this.ytPlayer.isMuted() : false;
    },

    setMuted: function setMuted(mute) {
      if (!this.ytPlayer) {
        return;
      } else {
        this.muted(true);
      }

      if (mute) {
        this.ytPlayer.mute();
      } else {
        this.ytPlayer.unMute();
      }
      this.setTimeout(function () {
        this.trigger('volumechange');
      }, 50);
    },

    buffered: function buffered() {
      if (!this.ytPlayer || !this.ytPlayer.getVideoLoadedFraction) {
        return {
          length: 0,
          start: function start() {
            throw new Error('This TimeRanges object is empty');
          },
          end: function end() {
            throw new Error('This TimeRanges object is empty');
          }
        };
      }

      var _end = this.ytPlayer.getVideoLoadedFraction() * this.ytPlayer.getDuration();

      return {
        length: 1,
        start: function start() {
          return 0;
        },
        end: function end() {
          return _end;
        }
      };
    },

    supportsFullScreen: function supportsFullScreen() {
      return true;
    },

    // Tries to get the highest resolution thumbnail available for the video
    checkHighResPoster: function checkHighResPoster() {
      var uri = 'https://img.youtube.com/vi/' + this.url.videoId + '/maxresdefault.jpg';

      try {
        var image = new Image();
        image.onload = function () {
          // Onload may still be called if YouTube returns the 120x90 error thumbnail
          if ('naturalHeight' in this) {
            if (this.naturalHeight <= 90 || this.naturalWidth <= 120) {
              this.onerror();
              return;
            }
          } else if (image.height <= 90 || image.width <= 120) {
            this.onerror();
            return;
          }

          this.poster_ = uri;
          this.trigger('posterchange');
        }.bind(this);
        image.onerror = function () {};
        image.src = uri;
      } catch (e) {}
    }
  });

  Youtube.isSupported = function () {
    return true;
  };

  Youtube.canPlaySource = function (e) {
    return e.type === 'video/youtube';
  };

  var _isOnMobile = /(iPad|iPhone|iPod|Android)/g.test(navigator.userAgent);

  Youtube.parseUrl = function (url) {
    var result = {
      videoId: null
    };

    var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regex);

    if (match && match[2].length === 11) {
      result.videoId = match[2];
    }

    var regPlaylist = /[?&]list=([^#\&\?]+)/;
    match = url.match(regPlaylist);

    if (match && match[1]) {
      result.listId = match[1];
    }

    return result;
  };

  function loadApi() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function injectCss() {
    var css = // iframe blocker to catch mouse events
    '.vjs-youtube .vjs-iframe-blocker { display: none; }' + '.vjs-youtube.vjs-user-inactive .vjs-iframe-blocker { display: block; }' + '.vjs-youtube .vjs-poster { background-size: cover; }' + '.vjs-youtube-mobile .vjs-big-play-button { display: none; }';

    var head = document.head || document.getElementsByTagName('head')[0];

    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }

  Youtube.apiReadyQueue = [];

  window.onYouTubeIframeAPIReady = function () {
    Youtube.isApiReady = true;

    for (var i = 0; i < Youtube.apiReadyQueue.length; ++i) {
      Youtube.apiReadyQueue[i].initYTPlayer();
    }
  };

  loadApi();
  injectCss();

  videojs.registerTech('Youtube', Youtube);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInl0LmpzIl0sIm5hbWVzIjpbInJvb3QiLCJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwidmlkZW9qcyIsIllvdXR1YmUiLCJtb2R1bGUiLCJleHBvcnRzIiwicmVxdWlyZSIsIlRlY2giLCJnZXRDb21wb25lbnQiLCJleHRlbmQiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJyZWFkeSIsImNhbGwiLCJzZXRQb3N0ZXIiLCJwb3N0ZXIiLCJzZXRTcmMiLCJvcHRpb25zXyIsInNvdXJjZSIsInNldFRpbWVvdXQiLCJlbF8iLCJwYXJlbnROb2RlIiwiY2xhc3NOYW1lIiwiX2lzT25Nb2JpbGUiLCJpc0FwaVJlYWR5IiwiaW5pdFlUUGxheWVyIiwiYXBpUmVhZHlRdWV1ZSIsInB1c2giLCJiaW5kIiwiZGlzcG9zZSIsInJlcGxhY2UiLCJjcmVhdGVFbCIsImRpdiIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsInRlY2hJZCIsImRpdldyYXBwZXIiLCJhcHBlbmRDaGlsZCIsInl0Q29udHJvbHMiLCJkaXZCbG9ja2VyIiwib25jbGljayIsInBhdXNlIiwicGxheWVyVmFycyIsImNvbnRyb2xzIiwibW9kZXN0YnJhbmRpbmciLCJyZWwiLCJzaG93aW5mbyIsImxvb3AiLCJhdXRvaGlkZSIsImRpc2FibGVrYiIsImVuZCIsImNvbG9yIiwiZnMiLCJobCIsImxhbmd1YWdlIiwic3Vic3RyIiwibGlzdCIsInVybCIsImxpc3RJZCIsImxpc3RUeXBlIiwicGxheWxpc3QiLCJwbGF5c2lubGluZSIsInN0YXJ0IiwidGhlbWUiLCJhY3RpdmVWaWRlb0lkIiwidmlkZW9JZCIsImFjdGl2ZUxpc3QiLCJ5dFBsYXllciIsIllUIiwiUGxheWVyIiwiZXZlbnRzIiwib25SZWFkeSIsIm9uUGxheWVyUmVhZHkiLCJvblBsYXliYWNrUXVhbGl0eUNoYW5nZSIsIm9uUGxheWVyUGxheWJhY2tRdWFsaXR5Q2hhbmdlIiwib25TdGF0ZUNoYW5nZSIsIm9uUGxheWVyU3RhdGVDaGFuZ2UiLCJvbkVycm9yIiwib25QbGF5ZXJFcnJvciIsInBsYXllclJlYWR5XyIsInRyaWdnZXJSZWFkeSIsInBsYXlPblJlYWR5IiwicGxheSIsImUiLCJzdGF0ZSIsImRhdGEiLCJsYXN0U3RhdGUiLCJ0cmlnZ2VyIiwiUGxheWVyU3RhdGUiLCJFTkRFRCIsIlBMQVlJTkciLCJpc1NlZWtpbmciLCJvblNlZWtlZCIsIlBBVVNFRCIsIkJVRkZFUklORyIsInBsYXllcl8iLCJlcnJvck51bWJlciIsInN0b3BWaWRlbyIsImRlc3Ryb3kiLCJlcnJvciIsImNvZGUiLCJzcmMiLCJwb3N0ZXJfIiwicGFyc2VVcmwiLCJjaGVja0hpZ2hSZXNQb3N0ZXIiLCJhdXRvcGxheSIsImlzUmVhZHlfIiwicGxheVZpZGVvIiwibG9hZFBsYXlsaXN0IiwibG9hZFZpZGVvQnlJZCIsInBhdXNlVmlkZW8iLCJwYXVzZWQiLCJjdXJyZW50VGltZSIsImdldEN1cnJlbnRUaW1lIiwic2V0Q3VycmVudFRpbWUiLCJzZWNvbmRzIiwidGltZUJlZm9yZVNlZWsiLCJ3YXNQYXVzZWRCZWZvcmVTZWVrIiwic2Vla1RvIiwiY2xlYXJJbnRlcnZhbCIsImNoZWNrU2Vla2VkSW5QYXVzZUludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJwbGF5YmFja1JhdGUiLCJnZXRQbGF5YmFja1JhdGUiLCJzZXRQbGF5YmFja1JhdGUiLCJzdWdnZXN0ZWRSYXRlIiwiZHVyYXRpb24iLCJnZXREdXJhdGlvbiIsImN1cnJlbnRTcmMiLCJlbmRlZCIsInZvbHVtZSIsImdldFZvbHVtZSIsInNldFZvbHVtZSIsInBlcmNlbnRBc0RlY2ltYWwiLCJtdXRlZCIsImlzTXV0ZWQiLCJzZXRNdXRlZCIsIm11dGUiLCJ1bk11dGUiLCJidWZmZXJlZCIsImdldFZpZGVvTG9hZGVkRnJhY3Rpb24iLCJsZW5ndGgiLCJFcnJvciIsInN1cHBvcnRzRnVsbFNjcmVlbiIsInVyaSIsImltYWdlIiwiSW1hZ2UiLCJvbmxvYWQiLCJuYXR1cmFsSGVpZ2h0IiwibmF0dXJhbFdpZHRoIiwib25lcnJvciIsImhlaWdodCIsIndpZHRoIiwiaXNTdXBwb3J0ZWQiLCJjYW5QbGF5U291cmNlIiwidHlwZSIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJyZXN1bHQiLCJyZWdleCIsIm1hdGNoIiwicmVnUGxheWxpc3QiLCJsb2FkQXBpIiwidGFnIiwiZmlyc3RTY3JpcHRUYWciLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImluc2VydEJlZm9yZSIsImluamVjdENzcyIsImNzcyIsImhlYWQiLCJzdHlsZSIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwiY3JlYXRlVGV4dE5vZGUiLCJ3aW5kb3ciLCJvbllvdVR1YmVJZnJhbWVBUElSZWFkeSIsImkiLCJyZWdpc3RlclRlY2giXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBO0FBQ0MsV0FBVUEsSUFBVixFQUFnQkMsT0FBaEIsRUFBeUI7QUFDeEIsTUFBRyxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUExQyxFQUErQztBQUM3Q0QsV0FBTyxDQUFDLFNBQUQsQ0FBUCxFQUFvQixVQUFTRSxPQUFULEVBQWlCO0FBQ25DLGFBQVFKLEtBQUtLLE9BQUwsR0FBZUosUUFBUUcsT0FBUixDQUF2QjtBQUNELEtBRkQ7QUFHRCxHQUpELE1BSU8sSUFBRyxRQUFPRSxNQUFQLHlDQUFPQSxNQUFQLE9BQWtCLFFBQWxCLElBQThCQSxPQUFPQyxPQUF4QyxFQUFpRDtBQUN0REQsV0FBT0MsT0FBUCxHQUFrQlAsS0FBS0ssT0FBTCxHQUFlSixRQUFRTyxRQUFRLFNBQVIsQ0FBUixDQUFqQztBQUNELEdBRk0sTUFFQTtBQUNMUixTQUFLSyxPQUFMLEdBQWVKLFFBQVFELEtBQUtJLE9BQWIsQ0FBZjtBQUNEO0FBQ0YsQ0FWQSxhQVVPLFVBQVNBLE9BQVQsRUFBa0I7QUFDeEI7O0FBRUEsTUFBSUssT0FBT0wsUUFBUU0sWUFBUixDQUFxQixNQUFyQixDQUFYOztB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LENBQWlCQyxPQUFqQixHQUEyQkosR0FBM0I7QUFDRCxLQUZELE1BRU87QUFDTEUsWUFBTXRJLFdBQU4sQ0FBa0JMLFNBQVM4SSxjQUFULENBQXdCTCxHQUF4QixDQUFsQjtBQUNEOztBQUVEQyxTQUFLckksV0FBTCxDQUFpQnNJLEtBQWpCO0FBQ0Q7O0FBRUR6SyxVQUFRdUIsYUFBUixHQUF3QixFQUF4Qjs7QUFFQXNKLFNBQU9DLHVCQUFQLEdBQWlDLFlBQVc7QUFDMUM5SyxZQUFRcUIsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxTQUFLLElBQUkwSixJQUFJLENBQWIsRUFBZ0JBLElBQUkvSyxRQUFRdUIsYUFBUixDQUFzQm9ILE1BQTFDLEVBQWtELEVBQUVvQyxDQUFwRCxFQUF1RDtBQUNyRC9LLGNBQVF1QixhQUFSLENBQXNCd0osQ0FBdEIsRUFBeUJ6SixZQUF6QjtBQUNEO0FBQ0YsR0FORDs7QUFRQTJJO0FBQ0FLOztBQUVBdkssVUFBUWlMLFlBQVIsQ0FBcUIsU0FBckIsRUFBZ0NoTCxPQUFoQztBQUNELENBcGxCQSxDQUFEIiwiZmlsZSI6Inl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbkNvcHlyaWdodCAoYykgMjAxNC0yMDE1IEJlbm9pdCBUcmVtYmxheSA8dHJlbWJsLmJlbkBnbWFpbC5jb20+XG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS4gKi9cbi8qZ2xvYmFsIGRlZmluZSwgWVQqL1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ3ZpZGVvanMnXSwgZnVuY3Rpb24odmlkZW9qcyl7XG4gICAgICByZXR1cm4gKHJvb3QuWW91dHViZSA9IGZhY3RvcnkodmlkZW9qcykpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IChyb290LllvdXR1YmUgPSBmYWN0b3J5KHJlcXVpcmUoJ3ZpZGVvanMnKSkpO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuWW91dHViZSA9IGZhY3Rvcnkocm9vdC52aWRlb2pzKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbih2aWRlb2pzKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgXG4gIHZhciBUZWNoID0gdmlkZW9qcy5nZXRDb21wb25lbnQoJ1RlY2gnKTtcbiAgXG4gIHZhciBZb3V0dWJlID0gdmlkZW9qcy5leHRlbmQoVGVjaCwge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbihvcHRpb25zLCByZWFkeSkge1xuICAgICAgVGVjaC5jYWxsKHRoaXMsIG9wdGlvbnMsIHJlYWR5KTtcbiAgICAgIFxuICAgICAgdGhpcy5zZXRQb3N0ZXIob3B0aW9ucy5wb3N0ZXIpO1xuICAgICAgdGhpcy5zZXRTcmModGhpcy5vcHRpb25zXy5zb3VyY2UsIHRydWUpO1xuICAgICAgXG4gICAgICAvLyBTZXQgdGhlIHZqcy15b3V0dWJlIGNsYXNzIHRvIHRoZSBwbGF5ZXJcbiAgICAgIC8vIFBhcmVudCBpcyBub3Qgc2V0IHlldCBzbyB3ZSBoYXZlIHRvIHdhaXQgYSB0aWNrXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmVsXy5wYXJlbnROb2RlLmNsYXNzTmFtZSArPSAnIHZqcy15b3V0dWJlJztcbiAgICAgICAgXG4gICAgICAgIGlmIChfaXNPbk1vYmlsZSkge1xuICAgICAgICAgIHRoaXMuZWxfLnBhcmVudE5vZGUuY2xhc3NOYW1lICs9ICcgdmpzLXlvdXR1YmUtbW9iaWxlJztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKFlvdXR1YmUuaXNBcGlSZWFkeSkge1xuICAgICAgICAgIHRoaXMuaW5pdFlUUGxheWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgWW91dHViZS5hcGlSZWFkeVF1ZXVlLnB1c2godGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcbiAgICBcbiAgICBkaXNwb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZWxfLnBhcmVudE5vZGUuY2xhc3NOYW1lID0gdGhpcy5lbF8ucGFyZW50Tm9kZS5jbGFzc05hbWVcbiAgICAgICAgLnJlcGxhY2UoJyB2anMteW91dHViZScsICcnKVxuICAgICAgICAucmVwbGFjZSgnIHZqcy15b3V0dWJlLW1vYmlsZScsICcnKTtcbiAgICB9LFxuICAgIFxuICAgIGNyZWF0ZUVsOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5vcHRpb25zXy50ZWNoSWQpO1xuICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnd2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTt0b3A6MDtsZWZ0OjA7cG9zaXRpb246YWJzb2x1dGUnKTtcbiAgICAgIFxuICAgICAgdmFyIGRpdldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdldyYXBwZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgIFxuICAgICAgaWYgKCFfaXNPbk1vYmlsZSAmJiAhdGhpcy5vcHRpb25zXy55dENvbnRyb2xzKSB7XG4gICAgICAgIHZhciBkaXZCbG9ja2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpdkJsb2NrZXIuc2V0QXR0cmlidXRlKCdjbGFzcycsICd2anMtaWZyYW1lLWJsb2NrZXInKTtcbiAgICAgICAgZGl2QmxvY2tlci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlJyk7XG4gICAgICAgIFxuICAgICAgICAvLyBJbiBjYXNlIHRoZSBibG9ja2VyIGlzIHN0aWxsIHRoZXJlIGFuZCB3ZSB3YW50IHRvIHBhdXNlXG4gICAgICAgIGRpdkJsb2NrZXIub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICBcbiAgICAgICAgZGl2V3JhcHBlci5hcHBlbmRDaGlsZChkaXZCbG9ja2VyKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIGRpdldyYXBwZXI7XG4gICAgfSxcbiAgICBcbiAgICBpbml0WVRQbGF5ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBsYXllclZhcnMgPSB7XG4gICAgICAgIGNvbnRyb2xzOiAwLFxuICAgICAgICBtb2Rlc3RicmFuZGluZzogMSxcbiAgICAgICAgcmVsOiAwLFxuICAgICAgICBzaG93aW5mbzogMCxcbiAgICAgICAgbG9vcDogdGhpcy5vcHRpb25zXy5sb29wID8gMSA6IDBcbiAgICAgIH07XG4gICAgICBcbiAgICAgIC8vIExldCB0aGUgdXNlciBzZXQgYW55IFlvdVR1YmUgcGFyYW1ldGVyXG4gICAgICAvLyBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS95b3V0dWJlL3BsYXllcl9wYXJhbWV0ZXJzP3BsYXllclZlcnNpb249SFRNTDUjUGFyYW1ldGVyc1xuICAgICAgLy8gVG8gdXNlIFlvdVR1YmUgY29udHJvbHMsIHlvdSBtdXN0IHVzZSB5dENvbnRyb2xzIGluc3RlYWRcbiAgICAgIC8vIFRvIHVzZSB0aGUgbG9vcCBvciBhdXRvcGxheSwgdXNlIHRoZSB2aWRlby5qcyBzZXR0aW5nc1xuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18uYXV0b2hpZGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMuYXV0b2hpZGUgPSB0aGlzLm9wdGlvbnNfLmF1dG9oaWRlO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc19bJ2NjX2xvYWRfcG9saWN5J10gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnNbJ2NjX2xvYWRfcG9saWN5J10gPSB0aGlzLm9wdGlvbnNfWydjY19sb2FkX3BvbGljeSddO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18ueXRDb250cm9scyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcGxheWVyVmFycy5jb250cm9scyA9IHRoaXMub3B0aW9uc18ueXRDb250cm9scztcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNfLmRpc2FibGVrYiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcGxheWVyVmFycy5kaXNhYmxla2IgPSB0aGlzLm9wdGlvbnNfLmRpc2FibGVrYjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNfLmVuZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcGxheWVyVmFycy5lbmQgPSB0aGlzLm9wdGlvbnNfLmVuZDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNfLmNvbG9yICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwbGF5ZXJWYXJzLmNvbG9yID0gdGhpcy5vcHRpb25zXy5jb2xvcjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKCFwbGF5ZXJWYXJzLmNvbnRyb2xzKSB7XG4gICAgICAgIC8vIExldCB2aWRlby5qcyBoYW5kbGUgdGhlIGZ1bGxzY3JlZW4gdW5sZXNzIGl0IGlzIHRoZSBZb3VUdWJlIG5hdGl2ZSBjb250cm9sc1xuICAgICAgICBwbGF5ZXJWYXJzLmZzID0gMDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18uZnMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMuZnMgPSB0aGlzLm9wdGlvbnNfLmZzO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18uZW5kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwbGF5ZXJWYXJzLmVuZCA9IHRoaXMub3B0aW9uc18uZW5kO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18uaGwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMuaGwgPSB0aGlzLm9wdGlvbnNfLmhsO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zXy5sYW5ndWFnZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gU2V0IHRoZSBZb3VUdWJlIHBsYXllciBvbiB0aGUgc2FtZSBsYW5ndWFnZSB0aGFuIHZpZGVvLmpzXG4gICAgICAgIHBsYXllclZhcnMuaGwgPSB0aGlzLm9wdGlvbnNfLmxhbmd1YWdlLnN1YnN0cigwLCAyKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNfWydpdl9sb2FkX3BvbGljeSddICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwbGF5ZXJWYXJzWydpdl9sb2FkX3BvbGljeSddID0gdGhpcy5vcHRpb25zX1snaXZfbG9hZF9wb2xpY3knXTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnNfLmxpc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMubGlzdCA9IHRoaXMub3B0aW9uc18ubGlzdDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy51cmwgJiYgdHlwZW9mIHRoaXMudXJsLmxpc3RJZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcGxheWVyVmFycy5saXN0ID0gdGhpcy51cmwubGlzdElkO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18ubGlzdFR5cGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMubGlzdFR5cGUgPSB0aGlzLm9wdGlvbnNfLmxpc3RUeXBlO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18ubW9kZXN0YnJhbmRpbmcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMubW9kZXN0YnJhbmRpbmcgPSB0aGlzLm9wdGlvbnNfLm1vZGVzdGJyYW5kaW5nO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18ucGxheWxpc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMucGxheWxpc3QgPSB0aGlzLm9wdGlvbnNfLnBsYXlsaXN0O1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18ucGxheXNpbmxpbmUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMucGxheXNpbmxpbmUgPSB0aGlzLm9wdGlvbnNfLnBsYXlzaW5saW5lO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18ucmVsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwbGF5ZXJWYXJzLnJlbCA9IHRoaXMub3B0aW9uc18ucmVsO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18uc2hvd2luZm8gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMuc2hvd2luZm8gPSB0aGlzLm9wdGlvbnNfLnNob3dpbmZvO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18uc3RhcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMuc3RhcnQgPSB0aGlzLm9wdGlvbnNfLnN0YXJ0O1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9uc18udGhlbWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBsYXllclZhcnMudGhlbWUgPSB0aGlzLm9wdGlvbnNfLnRoZW1lO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLmFjdGl2ZVZpZGVvSWQgPSB0aGlzLnVybCA/IHRoaXMudXJsLnZpZGVvSWQgOiBudWxsO1xuICAgICAgdGhpcy5hY3RpdmVMaXN0ID0gcGxheWVyVmFycy5saXN0O1xuICAgICAgXG4gICAgICB0aGlzLnl0UGxheWVyID0gbmV3IFlULlBsYXllcih0aGlzLm9wdGlvbnNfLnRlY2hJZCwge1xuICAgICAgICB2aWRlb0lkOiB0aGlzLmFjdGl2ZVZpZGVvSWQsXG4gICAgICAgIHBsYXllclZhcnM6IHBsYXllclZhcnMsXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgIG9uUmVhZHk6IHRoaXMub25QbGF5ZXJSZWFkeS5iaW5kKHRoaXMpLFxuICAgICAgICAgIG9uUGxheWJhY2tRdWFsaXR5Q2hhbmdlOiB0aGlzLm9uUGxheWVyUGxheWJhY2tRdWFsaXR5Q2hhbmdlLmJpbmQodGhpcyksXG4gICAgICAgICAgb25TdGF0ZUNoYW5nZTogdGhpcy5vblBsYXllclN0YXRlQ2hhbmdlLmJpbmQodGhpcyksXG4gICAgICAgICAgb25FcnJvcjogdGhpcy5vblBsYXllckVycm9yLmJpbmQodGhpcylcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBcbiAgICBvblBsYXllclJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucGxheWVyUmVhZHlfID0gdHJ1ZTtcbiAgICAgIHRoaXMudHJpZ2dlclJlYWR5KCk7XG4gICAgICBcbiAgICAgIGlmICh0aGlzLnBsYXlPblJlYWR5KSB7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgb25QbGF5ZXJQbGF5YmFja1F1YWxpdHlDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIH0sXG4gICAgXG4gICAgb25QbGF5ZXJTdGF0ZUNoYW5nZTogZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIHN0YXRlID0gZS5kYXRhO1xuICAgICAgXG4gICAgICBpZiAoc3RhdGUgPT09IHRoaXMubGFzdFN0YXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICBjYXNlIC0xOlxuICAgICAgICAgIHRoaXMudHJpZ2dlcignbG9hZGVkbWV0YWRhdGEnKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2R1cmF0aW9uY2hhbmdlJyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIFxuICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLkVOREVEOlxuICAgICAgICAgIHRoaXMudHJpZ2dlcignZW5kZWQnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgIGNhc2UgWVQuUGxheWVyU3RhdGUuUExBWUlORzpcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3RpbWV1cGRhdGUnKTtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2R1cmF0aW9uY2hhbmdlJyk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCdwbGF5aW5nJyk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCdwbGF5Jyk7XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKHRoaXMuaXNTZWVraW5nKSB7XG4gICAgICAgICAgICB0aGlzLm9uU2Vla2VkKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgICAgY2FzZSBZVC5QbGF5ZXJTdGF0ZS5QQVVTRUQ6XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCdjYW5wbGF5Jyk7XG4gICAgICAgICAgaWYgKHRoaXMuaXNTZWVraW5nKSB7XG4gICAgICAgICAgICB0aGlzLm9uU2Vla2VkKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcigncGF1c2UnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIFxuICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLkJVRkZFUklORzpcbiAgICAgICAgICB0aGlzLnBsYXllcl8udHJpZ2dlcigndGltZXVwZGF0ZScpO1xuICAgICAgICAgIHRoaXMucGxheWVyXy50cmlnZ2VyKCd3YWl0aW5nJyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMubGFzdFN0YXRlID0gc3RhdGU7XG4gICAgfSxcbiAgICBcbiAgICBvblBsYXllckVycm9yOiBmdW5jdGlvbihlKSB7XG4gICAgICB0aGlzLmVycm9yTnVtYmVyID0gZS5kYXRhO1xuICAgICAgdGhpcy50cmlnZ2VyKCdlcnJvcicpO1xuICAgICAgXG4gICAgICB0aGlzLnl0UGxheWVyLnN0b3BWaWRlbygpO1xuICAgICAgdGhpcy55dFBsYXllci5kZXN0cm95KCk7XG4gICAgICB0aGlzLnl0UGxheWVyID0gbnVsbDtcbiAgICB9LFxuICAgIFxuICAgIGVycm9yOiBmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5lcnJvck51bWJlcikge1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgcmV0dXJuIHsgY29kZTogJ1VuYWJsZSB0byBmaW5kIHRoZSB2aWRlbycgfTtcbiAgICAgICAgXG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICByZXR1cm4geyBjb2RlOiAnRXJyb3Igd2hpbGUgdHJ5aW5nIHRvIHBsYXkgdGhlIHZpZGVvJyB9O1xuICAgICAgICBcbiAgICAgICAgY2FzZSAxMDA6XG4gICAgICAgICAgcmV0dXJuIHsgY29kZTogJ1VuYWJsZSB0byBmaW5kIHRoZSB2aWRlbycgfTtcbiAgICAgICAgXG4gICAgICAgIGNhc2UgMTAxOlxuICAgICAgICBjYXNlIDE1MDpcbiAgICAgICAgICByZXR1cm4geyBjb2RlOiAnUGxheWJhY2sgb24gb3RoZXIgV2Vic2l0ZXMgaGFzIGJlZW4gZGlzYWJsZWQgYnkgdGhlIHZpZGVvIG93bmVyLicgfTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHsgY29kZTogJ1lvdVR1YmUgdW5rbm93biBlcnJvciAoJyArIHRoaXMuZXJyb3JOdW1iZXIgKyAnKScgfTtcbiAgICB9LFxuICAgIFxuICAgIHNyYzogZnVuY3Rpb24oc3JjKSB7XG4gICAgICBpZiAoc3JjKSB7XG4gICAgICAgIHRoaXMuc2V0U3JjKHsgc3JjOiBzcmMgfSk7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2U7XG4gICAgfSxcbiAgICBcbiAgICBwb3N0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gWW91IGNhbid0IHN0YXJ0IHByb2dyYW1tYXRpY2xseSBhIHZpZGVvIHdpdGggYSBtb2JpbGVcbiAgICAgIC8vIHRocm91Z2ggdGhlIGlmcmFtZSBzbyB3ZSBoaWRlIHRoZSBwb3N0ZXIgYW5kIHRoZSBwbGF5IGJ1dHRvbiAod2l0aCBDU1MpXG4gICAgICBpZiAoX2lzT25Nb2JpbGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiB0aGlzLnBvc3Rlcl87XG4gICAgfSxcbiAgICBcbiAgICBzZXRQb3N0ZXI6IGZ1bmN0aW9uKHBvc3Rlcikge1xuICAgICAgdGhpcy5wb3N0ZXJfID0gcG9zdGVyO1xuICAgIH0sXG4gICAgXG4gICAgc2V0U3JjOiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmICghc291cmNlIHx8ICFzb3VyY2Uuc3JjKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLnVybCA9IFlvdXR1YmUucGFyc2VVcmwoc291cmNlLnNyYyk7XG4gICAgICBcbiAgICAgIGlmICghdGhpcy5vcHRpb25zXy5wb3N0ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMudXJsLnZpZGVvSWQpIHtcbiAgICAgICAgICAvLyBTZXQgdGhlIGxvdyByZXNvbHV0aW9uIGZpcnN0XG4gICAgICAgICAgdGhpcy5wb3N0ZXJfID0gJ2h0dHBzOi8vaW1nLnlvdXR1YmUuY29tL3ZpLycgKyB0aGlzLnVybC52aWRlb0lkICsgJy8wLmpwZyc7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlaXIgaXMgYSBoaWdoIHJlc1xuICAgICAgICAgIHRoaXMuY2hlY2tIaWdoUmVzUG9zdGVyKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHRoaXMub3B0aW9uc18uYXV0b3BsYXkgJiYgIV9pc09uTW9iaWxlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUmVhZHlfKSB7XG4gICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wbGF5T25SZWFkeSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIHBsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLnVybCB8fCAhdGhpcy51cmwudmlkZW9JZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICh0aGlzLmlzUmVhZHlfKSB7XG4gICAgICAgIGlmICh0aGlzLnVybC5saXN0SWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5hY3RpdmVMaXN0ID09PSB0aGlzLnVybC5saXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMueXRQbGF5ZXIucGxheVZpZGVvKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMueXRQbGF5ZXIubG9hZFBsYXlsaXN0KHRoaXMudXJsLmxpc3RJZCk7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUxpc3QgPSB0aGlzLnVybC5saXN0SWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5hY3RpdmVWaWRlb0lkID09PSB0aGlzLnVybC52aWRlb0lkKSB7XG4gICAgICAgICAgdGhpcy55dFBsYXllci5wbGF5VmlkZW8oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnl0UGxheWVyLmxvYWRWaWRlb0J5SWQodGhpcy51cmwudmlkZW9JZCk7XG4gICAgICAgICAgdGhpcy5hY3RpdmVWaWRlb0lkID0gdGhpcy51cmwudmlkZW9JZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCd3YWl0aW5nJyk7XG4gICAgICAgIHRoaXMucGxheU9uUmVhZHkgPSB0cnVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMueXRQbGF5ZXIpIHtcbiAgICAgICAgdGhpcy55dFBsYXllci5wYXVzZVZpZGVvKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcbiAgICBwYXVzZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICh0aGlzLnl0UGxheWVyKSA/XG4gICAgICAgICh0aGlzLmxhc3RTdGF0ZSAhPT0gWVQuUGxheWVyU3RhdGUuUExBWUlORyAmJiB0aGlzLmxhc3RTdGF0ZSAhPT0gWVQuUGxheWVyU3RhdGUuQlVGRkVSSU5HKVxuICAgICAgICA6IHRydWU7XG4gICAgfSxcbiAgICBcbiAgICBjdXJyZW50VGltZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy55dFBsYXllciA/IHRoaXMueXRQbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKSA6IDA7XG4gICAgfSxcbiAgICBcbiAgICBzZXRDdXJyZW50VGltZTogZnVuY3Rpb24oc2Vjb25kcykge1xuICAgICAgaWYgKHRoaXMubGFzdFN0YXRlID09PSBZVC5QbGF5ZXJTdGF0ZS5QQVVTRUQpIHtcbiAgICAgICAgdGhpcy50aW1lQmVmb3JlU2VlayA9IHRoaXMuY3VycmVudFRpbWUoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKCF0aGlzLmlzU2Vla2luZykge1xuICAgICAgICB0aGlzLndhc1BhdXNlZEJlZm9yZVNlZWsgPSB0aGlzLnBhdXNlZCgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLnl0UGxheWVyLnNlZWtUbyhzZWNvbmRzLCB0cnVlKTtcbiAgICAgIHRoaXMudHJpZ2dlcigndGltZXVwZGF0ZScpO1xuICAgICAgdGhpcy50cmlnZ2VyKCdzZWVraW5nJyk7XG4gICAgICB0aGlzLmlzU2Vla2luZyA9IHRydWU7XG4gICAgICBcbiAgICAgIC8vIEEgc2VlayBldmVudCBkdXJpbmcgcGF1c2UgZG9lcyBub3QgcmV0dXJuIGFuIGV2ZW50IHRvIHRyaWdnZXIgYSBzZWVrZWQgZXZlbnQsXG4gICAgICAvLyBzbyBydW4gYW4gaW50ZXJ2YWwgdGltZXIgdG8gbG9vayBmb3IgdGhlIGN1cnJlbnRUaW1lIHRvIGNoYW5nZVxuICAgICAgaWYgKHRoaXMubGFzdFN0YXRlID09PSBZVC5QbGF5ZXJTdGF0ZS5QQVVTRUQgJiYgdGhpcy50aW1lQmVmb3JlU2VlayAhPT0gc2Vjb25kcykge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuY2hlY2tTZWVrZWRJblBhdXNlSW50ZXJ2YWwpO1xuICAgICAgICB0aGlzLmNoZWNrU2Vla2VkSW5QYXVzZUludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHRoaXMubGFzdFN0YXRlICE9PSBZVC5QbGF5ZXJTdGF0ZS5QQVVTRUQgfHwgIXRoaXMuaXNTZWVraW5nKSB7XG4gICAgICAgICAgICAvLyBJZiBzb21ldGhpbmcgY2hhbmdlZCB3aGlsZSB3ZSB3ZXJlIHdhaXRpbmcgZm9yIHRoZSBjdXJyZW50VGltZSB0byBjaGFuZ2UsXG4gICAgICAgICAgICAvLyAgY2xlYXIgdGhlIGludGVydmFsIHRpbWVyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuY2hlY2tTZWVrZWRJblBhdXNlSW50ZXJ2YWwpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VGltZSgpICE9PSB0aGlzLnRpbWVCZWZvcmVTZWVrKSB7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3RpbWV1cGRhdGUnKTtcbiAgICAgICAgICAgIHRoaXMub25TZWVrZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSwgMjUwKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIG9uU2Vla2VkOiBmdW5jdGlvbigpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jaGVja1NlZWtlZEluUGF1c2VJbnRlcnZhbCk7XG4gICAgICB0aGlzLnRyaWdnZXIoJ3NlZWtlZCcpO1xuICAgICAgdGhpcy5pc1NlZWtpbmcgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLndhc1BhdXNlZEJlZm9yZVNlZWspIHtcbiAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgXG4gICAgcGxheWJhY2tSYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnl0UGxheWVyID8gdGhpcy55dFBsYXllci5nZXRQbGF5YmFja1JhdGUoKSA6IDE7XG4gICAgfSxcbiAgICBcbiAgICBzZXRQbGF5YmFja1JhdGU6IGZ1bmN0aW9uKHN1Z2dlc3RlZFJhdGUpIHtcbiAgICAgIGlmICghdGhpcy55dFBsYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMueXRQbGF5ZXIuc2V0UGxheWJhY2tSYXRlKHN1Z2dlc3RlZFJhdGUpO1xuICAgICAgdGhpcy50cmlnZ2VyKCdyYXRlY2hhbmdlJyk7XG4gICAgfSxcbiAgICBcbiAgICBkdXJhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy55dFBsYXllciA/IHRoaXMueXRQbGF5ZXIuZ2V0RHVyYXRpb24oKSA6IDA7XG4gICAgfSxcbiAgICBcbiAgICBjdXJyZW50U3JjOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZTtcbiAgICB9LFxuICAgIFxuICAgIGVuZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnl0UGxheWVyID8gKHRoaXMubGFzdFN0YXRlID09PSBZVC5QbGF5ZXJTdGF0ZS5FTkRFRCkgOiBmYWxzZTtcbiAgICB9LFxuICAgIFxuICAgIHZvbHVtZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy55dFBsYXllciA/IHRoaXMueXRQbGF5ZXIuZ2V0Vm9sdW1lKCkgLyAxMDAuMCA6IDE7XG4gICAgfSxcbiAgICBcbiAgICBzZXRWb2x1bWU6IGZ1bmN0aW9uKHBlcmNlbnRBc0RlY2ltYWwpIHtcbiAgICAgIGlmICghdGhpcy55dFBsYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMueXRQbGF5ZXIuc2V0Vm9sdW1lKHBlcmNlbnRBc0RlY2ltYWwgKiAxMDAuMCk7XG4gICAgICB0aGlzLnNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMudHJpZ2dlcigndm9sdW1lY2hhbmdlJyk7XG4gICAgICB9LCA1MCk7XG4gICAgICBcbiAgICB9LFxuICAgIFxuICAgIG11dGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnl0UGxheWVyID8gdGhpcy55dFBsYXllci5pc011dGVkKCkgOiBmYWxzZTtcbiAgICB9LFxuICAgIFxuICAgIHNldE11dGVkOiBmdW5jdGlvbihtdXRlKSB7XG4gICAgICBpZiAoIXRoaXMueXRQbGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgdGhpcy5tdXRlZCh0cnVlKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKG11dGUpIHtcbiAgICAgICAgdGhpcy55dFBsYXllci5tdXRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnl0UGxheWVyLnVuTXV0ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRUaW1lb3V0KCBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3ZvbHVtZWNoYW5nZScpO1xuICAgICAgfSwgNTApO1xuICAgIH0sXG4gICAgXG4gICAgYnVmZmVyZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYoIXRoaXMueXRQbGF5ZXIgfHwgIXRoaXMueXRQbGF5ZXIuZ2V0VmlkZW9Mb2FkZWRGcmFjdGlvbikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxlbmd0aDogMCxcbiAgICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgVGltZVJhbmdlcyBvYmplY3QgaXMgZW1wdHknKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgVGltZVJhbmdlcyBvYmplY3QgaXMgZW1wdHknKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBlbmQgPSB0aGlzLnl0UGxheWVyLmdldFZpZGVvTG9hZGVkRnJhY3Rpb24oKSAqIHRoaXMueXRQbGF5ZXIuZ2V0RHVyYXRpb24oKTtcbiAgICAgIFxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGVuZ3RoOiAxLFxuICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9LFxuICAgICAgICBlbmQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZW5kOyB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgXG4gICAgXG4gICAgXG4gICAgc3VwcG9ydHNGdWxsU2NyZWVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgXG4gICAgLy8gVHJpZXMgdG8gZ2V0IHRoZSBoaWdoZXN0IHJlc29sdXRpb24gdGh1bWJuYWlsIGF2YWlsYWJsZSBmb3IgdGhlIHZpZGVvXG4gICAgY2hlY2tIaWdoUmVzUG9zdGVyOiBmdW5jdGlvbigpe1xuICAgICAgdmFyIHVyaSA9ICdodHRwczovL2ltZy55b3V0dWJlLmNvbS92aS8nICsgdGhpcy51cmwudmlkZW9JZCArICcvbWF4cmVzZGVmYXVsdC5qcGcnO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAvLyBPbmxvYWQgbWF5IHN0aWxsIGJlIGNhbGxlZCBpZiBZb3VUdWJlIHJldHVybnMgdGhlIDEyMHg5MCBlcnJvciB0aHVtYm5haWxcbiAgICAgICAgICBpZignbmF0dXJhbEhlaWdodCcgaW4gdGhpcyl7XG4gICAgICAgICAgICBpZih0aGlzLm5hdHVyYWxIZWlnaHQgPD0gOTAgfHwgdGhpcy5uYXR1cmFsV2lkdGggPD0gMTIwKSB7XG4gICAgICAgICAgICAgIHRoaXMub25lcnJvcigpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmKGltYWdlLmhlaWdodCA8PSA5MCB8fCBpbWFnZS53aWR0aCA8PSAxMjApIHtcbiAgICAgICAgICAgIHRoaXMub25lcnJvcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICB0aGlzLnBvc3Rlcl8gPSB1cmk7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCdwb3N0ZXJjaGFuZ2UnKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24oKXt9O1xuICAgICAgICBpbWFnZS5zcmMgPSB1cmk7XG4gICAgICB9XG4gICAgICBjYXRjaChlKXt9XG4gICAgfVxuICB9KTtcbiAgXG4gIFlvdXR1YmUuaXNTdXBwb3J0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgXG4gIFlvdXR1YmUuY2FuUGxheVNvdXJjZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gKGUudHlwZSA9PT0gJ3ZpZGVvL3lvdXR1YmUnKTtcbiAgfTtcbiAgXG4gIHZhciBfaXNPbk1vYmlsZSA9IC8oaVBhZHxpUGhvbmV8aVBvZHxBbmRyb2lkKS9nLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIFxuICBZb3V0dWJlLnBhcnNlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIHZpZGVvSWQ6IG51bGxcbiAgICB9O1xuICAgIFxuICAgIHZhciByZWdleCA9IC9eLiooeW91dHUuYmVcXC98dlxcL3x1XFwvXFx3XFwvfGVtYmVkXFwvfHdhdGNoXFw/dj18XFwmdj0pKFteI1xcJlxcP10qKS4qLztcbiAgICB2YXIgbWF0Y2ggPSB1cmwubWF0Y2gocmVnZXgpO1xuICAgIFxuICAgIGlmIChtYXRjaCAmJiBtYXRjaFsyXS5sZW5ndGggPT09IDExKSB7XG4gICAgICByZXN1bHQudmlkZW9JZCA9IG1hdGNoWzJdO1xuICAgIH1cbiAgICBcbiAgICB2YXIgcmVnUGxheWxpc3QgPSAvWz8mXWxpc3Q9KFteI1xcJlxcP10rKS87XG4gICAgbWF0Y2ggPSB1cmwubWF0Y2gocmVnUGxheWxpc3QpO1xuICAgIFxuICAgIGlmKG1hdGNoICYmIG1hdGNoWzFdKSB7XG4gICAgICByZXN1bHQubGlzdElkID0gbWF0Y2hbMV07XG4gICAgfVxuICAgIFxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIFxuICBmdW5jdGlvbiBsb2FkQXBpKCkge1xuICAgIHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB0YWcuc3JjID0gJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGknO1xuICAgIHZhciBmaXJzdFNjcmlwdFRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICBmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0YWcsIGZpcnN0U2NyaXB0VGFnKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gaW5qZWN0Q3NzKCkge1xuICAgIHZhciBjc3MgPSAvLyBpZnJhbWUgYmxvY2tlciB0byBjYXRjaCBtb3VzZSBldmVudHNcbiAgICAgICcudmpzLXlvdXR1YmUgLnZqcy1pZnJhbWUtYmxvY2tlciB7IGRpc3BsYXk6IG5vbmU7IH0nICtcbiAgICAgICcudmpzLXlvdXR1YmUudmpzLXVzZXItaW5hY3RpdmUgLnZqcy1pZnJhbWUtYmxvY2tlciB7IGRpc3BsYXk6IGJsb2NrOyB9JyArXG4gICAgICAnLnZqcy15b3V0dWJlIC52anMtcG9zdGVyIHsgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjsgfScgK1xuICAgICAgJy52anMteW91dHViZS1tb2JpbGUgLnZqcy1iaWctcGxheS1idXR0b24geyBkaXNwbGF5OiBub25lOyB9JztcbiAgICBcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICBcbiAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgIFxuICAgIGlmIChzdHlsZS5zdHlsZVNoZWV0KXtcbiAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgfVxuICAgIFxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG4gIFxuICBZb3V0dWJlLmFwaVJlYWR5UXVldWUgPSBbXTtcbiAgXG4gIHdpbmRvdy5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9IGZ1bmN0aW9uKCkge1xuICAgIFlvdXR1YmUuaXNBcGlSZWFkeSA9IHRydWU7XG4gICAgXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBZb3V0dWJlLmFwaVJlYWR5UXVldWUubGVuZ3RoOyArK2kpIHtcbiAgICAgIFlvdXR1YmUuYXBpUmVhZHlRdWV1ZVtpXS5pbml0WVRQbGF5ZXIoKTtcbiAgICB9XG4gIH07XG4gIFxuICBsb2FkQXBpKCk7XG4gIGluamVjdENzcygpO1xuICBcbiAgdmlkZW9qcy5yZWdpc3RlclRlY2goJ1lvdXR1YmUnLCBZb3V0dWJlKTtcbn0pKTsiXX0=