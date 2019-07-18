"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * videojs-time-offset
 * @version 0.3.0
 * @copyright 2016 Can Küçükyılmaz <can@vngrs.com>
 * @license MIT
 */
(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.videojsTimeOffset = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (require, module, exports) {
      (function (global) {
        /* global document */
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { 'default': obj };
        }

        var _videoJs = typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null;

        var _videoJs2 = _interopRequireDefault(_videoJs);

        // Default options for the plugin.
        var defaults = {
          start: 0,
          end: 0,
          page: 1,
          perPageInMinutes: 0
        };

        /**
         * for fixing buffer status overflow issue
         */
        var addStyle = function addStyle() {
          /**
           * Style already included, only include once
           */
          if (document.getElementById('vjs-time-offset-style')) {
            return false;
          }

          var css = '\n    .vjs-time-offset .vjs-load-progress {\n       overflow: hidden;\n    };\n  ';
          var head = document.head || document.getElementsByTagName('head')[0];
          var style = document.createElement('style');

          style.id = 'vjs-time-offset-style';
          style.type = 'text/css';
          if (style.styleSheet) {
            style.styleSheet.cssText = css;
          } else {
            style.appendChild(document.createTextNode(css));
          }

          head.appendChild(style);
        };

        /**
         * Function to invoke when the player is ready.
         *
         * This is a great place for your plugin to initialize itself. When this
         * function is called, the player will have its DOM and child components
         * in place.
         *
         * @function onPlayerReady
         * @param    {Player} player
         * @param    {Object} [options={}]
         */
        var onPlayerReady = function onPlayerReady(player, options) {
          var offsetStart = undefined;
          var offsetEnd = undefined;
          var computedDuration = undefined;

          // trigger ended event only once
          var isEndedTriggered = false;

          /**
           * calc offsetStart and offsetEnd based on options
           * if page params is setted use page values, Otherwise use defaults
           * default perPageInMinutes based on minutes, convert to seconds
           */
          options.perPageInMinutes = options.perPageInMinutes * 60;

          // page is natural number convert it to integer
          options.page = options.page - 1;

          if (options.start > 0) {
            offsetStart = options.start;
          } else {
            offsetStart = options.page * options.perPageInMinutes;
          }

          if (options.end > 0) {
            offsetEnd = options.end;
          } else {
            offsetEnd = (options.page + 1) * options.perPageInMinutes;
          }

          computedDuration = offsetEnd - offsetStart;

          /**
           * For monkey patching take references of original methods
           * We will override original methods
           */
          var __monkey__ = {
            currentTime: player.currentTime,
            remainingTime: player.remainingTime,
            duration: player.duration
          };

          player.addClass('vjs-time-offset');

          addStyle();

          player.remainingTime = function () {
            return player.duration() - player.currentTime();
          };

          player.duration = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            if (offsetEnd > 0) {
              __monkey__.duration.apply(player, args);
              return computedDuration;
            }

            return __monkey__.duration.apply(player, args) - offsetStart;
          };

          player.originalDuration = function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return __monkey__.duration.apply(player, args);
          };

          player.currentTime = function (seconds) {
            if (typeof seconds !== 'undefined') {
              seconds = seconds + offsetStart;

              return __monkey__.currentTime.call(player, seconds);
            }

            var current = __monkey__.currentTime.call(player) - offsetStart;

            // in safari with hls, it returns floating number numbers, fix it
            if (Math.ceil(current) < 0) {
              player.pause();
              player.currentTime(0);
              return 0;
            }
            return current;
          };

          /**
           * When user clicks play button after partition finished
           * start from beginning of partition
           */
          player.on('play', function () {
            var remaining = player.remainingTime();

            if (remaining <= 0) {
              player.currentTime(0);
              player.play();
            }
          });

          player.on('loadedmetadata', function () {
            var current = player.currentTime();
            var originalDuration = player.originalDuration();

            player.pageCount = Math.ceil(originalDuration / options.perPageInMinutes);

            isEndedTriggered = false;
            // if setted end value isn't correct, Fix IT
            // it shouldn't be bigger than video length
            if (offsetEnd > originalDuration) {
              computedDuration = originalDuration - offsetStart;
            }

            // if setted start value isn't correct, Fix IT
            // it shouldn't be bigger than video length
            if (offsetStart > originalDuration) {
              offsetStart = 0;
              computedDuration = originalDuration;
            }

            if (current < 0) {
              player.currentTime(0);
            }
          });

          player.on('timeupdate', function () {
            var remaining = player.remainingTime();

            if (remaining <= 0) {
              player.pause();

              if (!isEndedTriggered) {
                player.trigger('ended');
                player.on('adEnded', function () {
                  isEndedTriggered = true;
                });
              }
            }
          });
        };

        /**
         * A video.js plugin.
         *
         * In the plugin function, the value of `this` is a video.js `Player`
         * instance. You cannot rely on the player being in a "ready" state here,
         * depending on how the plugin is invoked. This may or may not be important
         * to you; if not, remove the wait for "ready"!
         *
         * @function time-offset
         * @param    {Object} [options={}]
         *           An object of options left to the plugin author to define.
         */
        var timeOffset = function timeOffset(options) {
          var _this = this;

          this.ready(function () {
            onPlayerReady(_this, _videoJs2['default'].mergeOptions(defaults, options));
          });
        };

        // Register the plugin with video.js.
        _videoJs2['default'].plugin('timeOffset', timeOffset);

        // Include the version number.
        timeOffset.VERSION = '0.0.1';

        exports['default'] = timeOffset;
        module.exports = exports['default'];
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}] }, {}, [1])(1);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZGVvanMtdGltZS1vZmZzZXQuanMiXSwibmFtZXMiOlsiZiIsImV4cG9ydHMiLCJtb2R1bGUiLCJkZWZpbmUiLCJhbWQiLCJnIiwid2luZG93IiwiZ2xvYmFsIiwic2VsZiIsInZpZGVvanNUaW1lT2Zmc2V0IiwiZSIsInQiLCJuIiwiciIsInMiLCJvIiwidSIsImEiLCJyZXF1aXJlIiwiaSIsIkVycm9yIiwiY29kZSIsImwiLCJjYWxsIiwibGVuZ3RoIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJvYmoiLCJfX2VzTW9kdWxlIiwiX3ZpZGVvSnMiLCJfdmlkZW9KczIiLCJkZWZhdWx0cyIsInN0YXJ0IiwiZW5kIiwicGFnZSIsInBlclBhZ2VJbk1pbnV0ZXMiLCJhZGRTdHlsZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjc3MiLCJoZWFkIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJzdHlsZSIsImNyZWF0ZUVsZW1lbnQiLCJpZCIsInR5cGUiLCJzdHlsZVNoZWV0IiwiY3NzVGV4dCIsImFwcGVuZENoaWxkIiwiY3JlYXRlVGV4dE5vZGUiLCJvblBsYXllclJlYWR5IiwicGxheWVyIiwib3B0aW9ucyIsIm9mZnNldFN0YXJ0IiwidW5kZWZpbmVkIiwib2Zmc2V0RW5kIiwiY29tcHV0ZWREdXJhdGlvbiIsImlzRW5kZWRUcmlnZ2VyZWQiLCJfX21vbmtleV9fIiwiY3VycmVudFRpbWUiLCJyZW1haW5pbmdUaW1lIiwiZHVyYXRpb24iLCJhZGRDbGFzcyIsIl9sZW4iLCJhcmd1bWVudHMiLCJhcmdzIiwiQXJyYXkiLCJfa2V5IiwiYXBwbHkiLCJvcmlnaW5hbER1cmF0aW9uIiwiX2xlbjIiLCJfa2V5MiIsInNlY29uZHMiLCJjdXJyZW50IiwiTWF0aCIsImNlaWwiLCJwYXVzZSIsIm9uIiwicmVtYWluaW5nIiwicGxheSIsInBhZ2VDb3VudCIsInRyaWdnZXIiLCJ0aW1lT2Zmc2V0IiwiX3RoaXMiLCJyZWFkeSIsIm1lcmdlT3B0aW9ucyIsInBsdWdpbiIsIlZFUlNJT04iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7O0FBTUEsQ0FBQyxVQUFTQSxDQUFULEVBQVc7QUFBQyxNQUFHLFFBQU9DLE9BQVAseUNBQU9BLE9BQVAsT0FBaUIsUUFBakIsSUFBMkIsT0FBT0MsTUFBUCxLQUFnQixXQUE5QyxFQUEwRDtBQUFDQSxXQUFPRCxPQUFQLEdBQWVELEdBQWY7QUFBbUIsR0FBOUUsTUFBbUYsSUFBRyxPQUFPRyxNQUFQLEtBQWdCLFVBQWhCLElBQTRCQSxPQUFPQyxHQUF0QyxFQUEwQztBQUFDRCxXQUFPLEVBQVAsRUFBVUgsQ0FBVjtBQUFhLEdBQXhELE1BQTREO0FBQUMsUUFBSUssQ0FBSixDQUFNLElBQUcsT0FBT0MsTUFBUCxLQUFnQixXQUFuQixFQUErQjtBQUFDRCxVQUFFQyxNQUFGO0FBQVMsS0FBekMsTUFBOEMsSUFBRyxPQUFPQyxNQUFQLEtBQWdCLFdBQW5CLEVBQStCO0FBQUNGLFVBQUVFLE1BQUY7QUFBUyxLQUF6QyxNQUE4QyxJQUFHLE9BQU9DLElBQVAsS0FBYyxXQUFqQixFQUE2QjtBQUFDSCxVQUFFRyxJQUFGO0FBQU8sS0FBckMsTUFBeUM7QUFBQ0gsVUFBRSxJQUFGO0FBQU8sT0FBRUksaUJBQUYsR0FBc0JULEdBQXRCO0FBQTBCO0FBQUMsQ0FBM1UsRUFBNlUsWUFBVTtBQUFDLE1BQUlHLE1BQUosRUFBV0QsTUFBWCxFQUFrQkQsT0FBbEIsQ0FBMEIsT0FBUSxTQUFTUyxDQUFULENBQVdDLENBQVgsRUFBYUMsQ0FBYixFQUFlQyxDQUFmLEVBQWlCO0FBQUMsYUFBU0MsQ0FBVCxDQUFXQyxDQUFYLEVBQWFDLENBQWIsRUFBZTtBQUFDLFVBQUcsQ0FBQ0osRUFBRUcsQ0FBRixDQUFKLEVBQVM7QUFBQyxZQUFHLENBQUNKLEVBQUVJLENBQUYsQ0FBSixFQUFTO0FBQUMsY0FBSUUsSUFBRSxPQUFPQyxPQUFQLElBQWdCLFVBQWhCLElBQTRCQSxPQUFsQyxDQUEwQyxJQUFHLENBQUNGLENBQUQsSUFBSUMsQ0FBUCxFQUFTLE9BQU9BLEVBQUVGLENBQUYsRUFBSSxDQUFDLENBQUwsQ0FBUCxDQUFlLElBQUdJLENBQUgsRUFBSyxPQUFPQSxFQUFFSixDQUFGLEVBQUksQ0FBQyxDQUFMLENBQVAsQ0FBZSxJQUFJZixJQUFFLElBQUlvQixLQUFKLENBQVUseUJBQXVCTCxDQUF2QixHQUF5QixHQUFuQyxDQUFOLENBQThDLE1BQU1mLEVBQUVxQixJQUFGLEdBQU8sa0JBQVAsRUFBMEJyQixDQUFoQztBQUFrQyxhQUFJc0IsSUFBRVYsRUFBRUcsQ0FBRixJQUFLLEVBQUNkLFNBQVEsRUFBVCxFQUFYLENBQXdCVSxFQUFFSSxDQUFGLEVBQUssQ0FBTCxFQUFRUSxJQUFSLENBQWFELEVBQUVyQixPQUFmLEVBQXVCLFVBQVNTLENBQVQsRUFBVztBQUFDLGNBQUlFLElBQUVELEVBQUVJLENBQUYsRUFBSyxDQUFMLEVBQVFMLENBQVIsQ0FBTixDQUFpQixPQUFPSSxFQUFFRixJQUFFQSxDQUFGLEdBQUlGLENBQU4sQ0FBUDtBQUFnQixTQUFwRSxFQUFxRVksQ0FBckUsRUFBdUVBLEVBQUVyQixPQUF6RSxFQUFpRlMsQ0FBakYsRUFBbUZDLENBQW5GLEVBQXFGQyxDQUFyRixFQUF1RkMsQ0FBdkY7QUFBMEYsY0FBT0QsRUFBRUcsQ0FBRixFQUFLZCxPQUFaO0FBQW9CLFNBQUlrQixJQUFFLE9BQU9ELE9BQVAsSUFBZ0IsVUFBaEIsSUFBNEJBLE9BQWxDLENBQTBDLEtBQUksSUFBSUgsSUFBRSxDQUFWLEVBQVlBLElBQUVGLEVBQUVXLE1BQWhCLEVBQXVCVCxHQUF2QjtBQUEyQkQsUUFBRUQsRUFBRUUsQ0FBRixDQUFGO0FBQTNCLEtBQW1DLE9BQU9ELENBQVA7QUFBUyxHQUF6YixDQUEyYixFQUFDLEdBQUUsQ0FBQyxVQUFTSSxPQUFULEVBQWlCaEIsTUFBakIsRUFBd0JELE9BQXhCLEVBQWdDO0FBQ3gxQixPQUFDLFVBQVVNLE1BQVYsRUFBaUI7QUFDbEI7QUFDQTs7QUFFQWtCLGVBQU9DLGNBQVAsQ0FBc0J6QixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUMzQzBCLGlCQUFPO0FBRG9DLFNBQTdDOztBQUlBLGlCQUFTQyxzQkFBVCxDQUFnQ0MsR0FBaEMsRUFBcUM7QUFBRSxpQkFBT0EsT0FBT0EsSUFBSUMsVUFBWCxHQUF3QkQsR0FBeEIsR0FBOEIsRUFBRSxXQUFXQSxHQUFiLEVBQXJDO0FBQTBEOztBQUVqRyxZQUFJRSxXQUFZLE9BQU96QixNQUFQLEtBQWtCLFdBQWxCLEdBQWdDQSxPQUFPLFNBQVAsQ0FBaEMsR0FBb0QsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQ0EsT0FBTyxTQUFQLENBQWhDLEdBQW9ELElBQXhIOztBQUVBLFlBQUl5QixZQUFZSix1QkFBdUJHLFFBQXZCLENBQWhCOztBQUVBO0FBQ0EsWUFBSUUsV0FBVztBQUNiQyxpQkFBTyxDQURNO0FBRWJDLGVBQUssQ0FGUTtBQUdiQyxnQkFBTSxDQUhPO0FBSWJDLDRCQUFrQjtBQUpMLFNBQWY7O0FBT0E7OztBQUdBLFlBQUlDLFdBQVcsU0FBU0EsUUFBVCxHQUFvQjtBQUNqQzs7O0FBR0EsY0FBSUMsU0FBU0MsY0FBVCxDQUF3Qix1QkFBeEIsQ0FBSixFQUFzRDtBQUNwRCxtQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsY0FBSUMsTUFBTSxtRkFBVjtBQUNBLGNBQUlDLE9BQU9ILFNBQVNHLElBQVQsSUFBaUJILFNBQVNJLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLENBQTVCO0FBQ0EsY0FBSUMsUUFBUUwsU0FBU00sYUFBVCxDQUF1QixPQUF2QixDQUFaOztBQUVBRCxnQkFBTUUsRUFBTixHQUFXLHVCQUFYO0FBQ0FGLGdCQUFNRyxJQUFOLEdBQWEsVUFBYjtBQUNBLGNBQUlILE1BQU1JLFVBQVYsRUFBc0I7QUFDcEJKLGtCQUFNSSxVQUFOLENBQWlCQyxPQUFqQixHQUEyQlIsR0FBM0I7QUFDRCxXQUZELE1BRU87QUFDTEcsa0JBQU1NLFdBQU4sQ0FBa0JYLFNBQVNZLGNBQVQsQ0FBd0JWLEdBQXhCLENBQWxCO0FBQ0Q7O0FBRURDLGVBQUtRLFdBQUwsQ0FBaUJOLEtBQWpCO0FBQ0QsU0FyQkQ7O0FBdUJBOzs7Ozs7Ozs7OztBQVdBLFlBQUlRLGdCQUFnQixTQUFTQSxhQUFULENBQXVCQyxNQUF2QixFQUErQkMsT0FBL0IsRUFBd0M7QUFDMUQsY0FBSUMsY0FBY0MsU0FBbEI7QUFDQSxjQUFJQyxZQUFZRCxTQUFoQjtBQUNBLGNBQUlFLG1CQUFtQkYsU0FBdkI7O0FBRUE7QUFDQSxjQUFJRyxtQkFBbUIsS0FBdkI7O0FBRUE7Ozs7O0FBS0FMLGtCQUFRakIsZ0JBQVIsR0FBMkJpQixRQUFRakIsZ0JBQVIsR0FBMkIsRUFBdEQ7O0FBRUE7QUFDQWlCLGtCQUFRbEIsSUFBUixHQUFla0IsUUFBUWxCLElBQVIsR0FBZSxDQUE5Qjs7QUFFQSxjQUFJa0IsUUFBUXBCLEtBQVIsR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckJxQiwwQkFBY0QsUUFBUXBCLEtBQXRCO0FBQ0QsV0FGRCxNQUVPO0FBQ0xxQiwwQkFBY0QsUUFBUWxCLElBQVIsR0FBZWtCLFFBQVFqQixnQkFBckM7QUFDRDs7QUFFRCxjQUFJaUIsUUFBUW5CLEdBQVIsR0FBYyxDQUFsQixFQUFxQjtBQUNuQnNCLHdCQUFZSCxRQUFRbkIsR0FBcEI7QUFDRCxXQUZELE1BRU87QUFDTHNCLHdCQUFZLENBQUNILFFBQVFsQixJQUFSLEdBQWUsQ0FBaEIsSUFBcUJrQixRQUFRakIsZ0JBQXpDO0FBQ0Q7O0FBRURxQiw2QkFBbUJELFlBQVlGLFdBQS9COztBQUVBOzs7O0FBSUEsY0FBSUssYUFBYTtBQUNmQyx5QkFBYVIsT0FBT1EsV0FETDtBQUVmQywyQkFBZVQsT0FBT1MsYUFGUDtBQUdmQyxzQkFBVVYsT0FBT1U7QUFIRixXQUFqQjs7QUFNQVYsaUJBQU9XLFFBQVAsQ0FBZ0IsaUJBQWhCOztBQUVBMUI7O0FBRUFlLGlCQUFPUyxhQUFQLEdBQXVCLFlBQVk7QUFDakMsbUJBQU9ULE9BQU9VLFFBQVAsS0FBb0JWLE9BQU9RLFdBQVAsRUFBM0I7QUFDRCxXQUZEOztBQUlBUixpQkFBT1UsUUFBUCxHQUFrQixZQUFZO0FBQzVCLGlCQUFLLElBQUlFLE9BQU9DLFVBQVUxQyxNQUFyQixFQUE2QjJDLE9BQU9DLE1BQU1ILElBQU4sQ0FBcEMsRUFBaURJLE9BQU8sQ0FBN0QsRUFBZ0VBLE9BQU9KLElBQXZFLEVBQTZFSSxNQUE3RSxFQUFxRjtBQUNuRkYsbUJBQUtFLElBQUwsSUFBYUgsVUFBVUcsSUFBVixDQUFiO0FBQ0Q7O0FBRUQsZ0JBQUlaLFlBQVksQ0FBaEIsRUFBbUI7QUFDakJHLHlCQUFXRyxRQUFYLENBQW9CTyxLQUFwQixDQUEwQmpCLE1BQTFCLEVBQWtDYyxJQUFsQztBQUNBLHFCQUFPVCxnQkFBUDtBQUNEOztBQUVELG1CQUFPRSxXQUFXRyxRQUFYLENBQW9CTyxLQUFwQixDQUEwQmpCLE1BQTFCLEVBQWtDYyxJQUFsQyxJQUEwQ1osV0FBakQ7QUFDRCxXQVhEOztBQWFBRixpQkFBT2tCLGdCQUFQLEdBQTBCLFlBQVk7QUFDcEMsaUJBQUssSUFBSUMsUUFBUU4sVUFBVTFDLE1BQXRCLEVBQThCMkMsT0FBT0MsTUFBTUksS0FBTixDQUFyQyxFQUFtREMsUUFBUSxDQUFoRSxFQUFtRUEsUUFBUUQsS0FBM0UsRUFBa0ZDLE9BQWxGLEVBQTJGO0FBQ3pGTixtQkFBS00sS0FBTCxJQUFjUCxVQUFVTyxLQUFWLENBQWQ7QUFDRDs7QUFFRCxtQkFBT2IsV0FBV0csUUFBWCxDQUFvQk8sS0FBcEIsQ0FBMEJqQixNQUExQixFQUFrQ2MsSUFBbEMsQ0FBUDtBQUNELFdBTkQ7O0FBUUFkLGlCQUFPUSxXQUFQLEdBQXFCLFVBQVVhLE9BQVYsRUFBbUI7QUFDdEMsZ0JBQUksT0FBT0EsT0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUNsQ0Esd0JBQVVBLFVBQVVuQixXQUFwQjs7QUFFQSxxQkFBT0ssV0FBV0MsV0FBWCxDQUF1QnRDLElBQXZCLENBQTRCOEIsTUFBNUIsRUFBb0NxQixPQUFwQyxDQUFQO0FBQ0Q7O0FBRUQsZ0JBQUlDLFVBQVVmLFdBQVdDLFdBQVgsQ0FBdUJ0QyxJQUF2QixDQUE0QjhCLE1BQTVCLElBQXNDRSxXQUFwRDs7QUFFQTtBQUNBLGdCQUFJcUIsS0FBS0MsSUFBTCxDQUFVRixPQUFWLElBQXFCLENBQXpCLEVBQTRCO0FBQzFCdEIscUJBQU95QixLQUFQO0FBQ0F6QixxQkFBT1EsV0FBUCxDQUFtQixDQUFuQjtBQUNBLHFCQUFPLENBQVA7QUFDRDtBQUNELG1CQUFPYyxPQUFQO0FBQ0QsV0FoQkQ7O0FBa0JBOzs7O0FBSUF0QixpQkFBTzBCLEVBQVAsQ0FBVSxNQUFWLEVBQWtCLFlBQVk7QUFDNUIsZ0JBQUlDLFlBQVkzQixPQUFPUyxhQUFQLEVBQWhCOztBQUVBLGdCQUFJa0IsYUFBYSxDQUFqQixFQUFvQjtBQUNsQjNCLHFCQUFPUSxXQUFQLENBQW1CLENBQW5CO0FBQ0FSLHFCQUFPNEIsSUFBUDtBQUNEO0FBQ0YsV0FQRDs7QUFTQTVCLGlCQUFPMEIsRUFBUCxDQUFVLGdCQUFWLEVBQTRCLFlBQVk7QUFDdEMsZ0JBQUlKLFVBQVV0QixPQUFPUSxXQUFQLEVBQWQ7QUFDQSxnQkFBSVUsbUJBQW1CbEIsT0FBT2tCLGdCQUFQLEVBQXZCOztBQUVBbEIsbUJBQU82QixTQUFQLEdBQW1CTixLQUFLQyxJQUFMLENBQVVOLG1CQUFtQmpCLFFBQVFqQixnQkFBckMsQ0FBbkI7O0FBRUFzQiwrQkFBbUIsS0FBbkI7QUFDQTtBQUNBO0FBQ0EsZ0JBQUlGLFlBQVljLGdCQUFoQixFQUFrQztBQUNoQ2IsaUNBQW1CYSxtQkFBbUJoQixXQUF0QztBQUNEOztBQUVEO0FBQ0E7QUFDQSxnQkFBSUEsY0FBY2dCLGdCQUFsQixFQUFvQztBQUNsQ2hCLDRCQUFjLENBQWQ7QUFDQUcsaUNBQW1CYSxnQkFBbkI7QUFDRDs7QUFFRCxnQkFBSUksVUFBVSxDQUFkLEVBQWlCO0FBQ2Z0QixxQkFBT1EsV0FBUCxDQUFtQixDQUFuQjtBQUNEO0FBQ0YsV0F2QkQ7O0FBeUJBUixpQkFBTzBCLEVBQVAsQ0FBVSxZQUFWLEVBQXdCLFlBQVk7QUFDbEMsZ0JBQUlDLFlBQVkzQixPQUFPUyxhQUFQLEVBQWhCOztBQUVBLGdCQUFJa0IsYUFBYSxDQUFqQixFQUFvQjtBQUNsQjNCLHFCQUFPeUIsS0FBUDs7QUFFQSxrQkFBSSxDQUFDbkIsZ0JBQUwsRUFBdUI7QUFDckJOLHVCQUFPOEIsT0FBUCxDQUFlLE9BQWY7QUFDQTlCLHVCQUFPMEIsRUFBUCxDQUFVLFNBQVYsRUFBcUIsWUFBWTtBQUMvQnBCLHFDQUFtQixJQUFuQjtBQUNELGlCQUZEO0FBR0Q7QUFDRjtBQUNGLFdBYkQ7QUFjRCxTQTdJRDs7QUErSUE7Ozs7Ozs7Ozs7OztBQVlBLFlBQUl5QixhQUFhLFNBQVNBLFVBQVQsQ0FBb0I5QixPQUFwQixFQUE2QjtBQUM1QyxjQUFJK0IsUUFBUSxJQUFaOztBQUVBLGVBQUtDLEtBQUwsQ0FBVyxZQUFZO0FBQ3JCbEMsMEJBQWNpQyxLQUFkLEVBQXFCckQsVUFBVSxTQUFWLEVBQXFCdUQsWUFBckIsQ0FBa0N0RCxRQUFsQyxFQUE0Q3FCLE9BQTVDLENBQXJCO0FBQ0QsV0FGRDtBQUdELFNBTkQ7O0FBUUE7QUFDQXRCLGtCQUFVLFNBQVYsRUFBcUJ3RCxNQUFyQixDQUE0QixZQUE1QixFQUEwQ0osVUFBMUM7O0FBRUE7QUFDQUEsbUJBQVdLLE9BQVgsR0FBcUIsT0FBckI7O0FBRUF4RixnQkFBUSxTQUFSLElBQXFCbUYsVUFBckI7QUFDQWxGLGVBQU9ELE9BQVAsR0FBaUJBLFFBQVEsU0FBUixDQUFqQjtBQUNDLE9BdE9ELEVBc09Hc0IsSUF0T0gsQ0FzT1EsSUF0T1IsRUFzT2EsT0FBT2hCLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0NBLE1BQWhDLEdBQXlDLE9BQU9DLElBQVAsS0FBZ0IsV0FBaEIsR0FBOEJBLElBQTlCLEdBQXFDLE9BQU9GLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0NBLE1BQWhDLEdBQXlDLEVBdE9wSTtBQXVPQyxLQXhPc3pCLEVBd09yekIsRUF4T3F6QixDQUFILEVBQTNiLEVBd09sWCxFQXhPa1gsRUF3Ty9XLENBQUMsQ0FBRCxDQXhPK1csRUF3TzFXLENBeE8wVyxDQUFQO0FBeU9qWCxDQXpPRCIsImZpbGUiOiJ2aWRlb2pzLXRpbWUtb2Zmc2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiB2aWRlb2pzLXRpbWUtb2Zmc2V0XG4gKiBAdmVyc2lvbiAwLjMuMFxuICogQGNvcHlyaWdodCAyMDE2IENhbiBLw7zDp8O8a3nEsWxtYXogPGNhbkB2bmdycy5jb20+XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuKGZ1bmN0aW9uKGYpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZSE9PVwidW5kZWZpbmVkXCIpe21vZHVsZS5leHBvcnRzPWYoKX1lbHNlIGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmKX1lbHNle3ZhciBnO2lmKHR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiKXtnPXdpbmRvd31lbHNlIGlmKHR5cGVvZiBnbG9iYWwhPT1cInVuZGVmaW5lZFwiKXtnPWdsb2JhbH1lbHNlIGlmKHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIil7Zz1zZWxmfWVsc2V7Zz10aGlzfWcudmlkZW9qc1RpbWVPZmZzZXQgPSBmKCl9fSkoZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiBnbG9iYWwgZG9jdW1lbnQgKi9cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF92aWRlb0pzID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ3ZpZGVvanMnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ3ZpZGVvanMnXSA6IG51bGwpO1xuXG52YXIgX3ZpZGVvSnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdmlkZW9Kcyk7XG5cbi8vIERlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIHBsdWdpbi5cbnZhciBkZWZhdWx0cyA9IHtcbiAgc3RhcnQ6IDAsXG4gIGVuZDogMCxcbiAgcGFnZTogMSxcbiAgcGVyUGFnZUluTWludXRlczogMFxufTtcblxuLyoqXG4gKiBmb3IgZml4aW5nIGJ1ZmZlciBzdGF0dXMgb3ZlcmZsb3cgaXNzdWVcbiAqL1xudmFyIGFkZFN0eWxlID0gZnVuY3Rpb24gYWRkU3R5bGUoKSB7XG4gIC8qKlxuICAgKiBTdHlsZSBhbHJlYWR5IGluY2x1ZGVkLCBvbmx5IGluY2x1ZGUgb25jZVxuICAgKi9cbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2anMtdGltZS1vZmZzZXQtc3R5bGUnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjc3MgPSAnXFxuICAgIC52anMtdGltZS1vZmZzZXQgLnZqcy1sb2FkLXByb2dyZXNzIHtcXG4gICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gICAgfTtcXG4gICc7XG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gIHN0eWxlLmlkID0gJ3Zqcy10aW1lLW9mZnNldC1zdHlsZSc7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxuXG4gIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgcGxheWVyIGlzIHJlYWR5LlxuICpcbiAqIFRoaXMgaXMgYSBncmVhdCBwbGFjZSBmb3IgeW91ciBwbHVnaW4gdG8gaW5pdGlhbGl6ZSBpdHNlbGYuIFdoZW4gdGhpc1xuICogZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGUgcGxheWVyIHdpbGwgaGF2ZSBpdHMgRE9NIGFuZCBjaGlsZCBjb21wb25lbnRzXG4gKiBpbiBwbGFjZS5cbiAqXG4gKiBAZnVuY3Rpb24gb25QbGF5ZXJSZWFkeVxuICogQHBhcmFtICAgIHtQbGF5ZXJ9IHBsYXllclxuICogQHBhcmFtICAgIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICovXG52YXIgb25QbGF5ZXJSZWFkeSA9IGZ1bmN0aW9uIG9uUGxheWVyUmVhZHkocGxheWVyLCBvcHRpb25zKSB7XG4gIHZhciBvZmZzZXRTdGFydCA9IHVuZGVmaW5lZDtcbiAgdmFyIG9mZnNldEVuZCA9IHVuZGVmaW5lZDtcbiAgdmFyIGNvbXB1dGVkRHVyYXRpb24gPSB1bmRlZmluZWQ7XG5cbiAgLy8gdHJpZ2dlciBlbmRlZCBldmVudCBvbmx5IG9uY2VcbiAgdmFyIGlzRW5kZWRUcmlnZ2VyZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogY2FsYyBvZmZzZXRTdGFydCBhbmQgb2Zmc2V0RW5kIGJhc2VkIG9uIG9wdGlvbnNcbiAgICogaWYgcGFnZSBwYXJhbXMgaXMgc2V0dGVkIHVzZSBwYWdlIHZhbHVlcywgT3RoZXJ3aXNlIHVzZSBkZWZhdWx0c1xuICAgKiBkZWZhdWx0IHBlclBhZ2VJbk1pbnV0ZXMgYmFzZWQgb24gbWludXRlcywgY29udmVydCB0byBzZWNvbmRzXG4gICAqL1xuICBvcHRpb25zLnBlclBhZ2VJbk1pbnV0ZXMgPSBvcHRpb25zLnBlclBhZ2VJbk1pbnV0ZXMgKiA2MDtcblxuICAvLyBwYWdlIGlzIG5hdHVyYWwgbnVtYmVyIGNvbnZlcnQgaXQgdG8gaW50ZWdlclxuICBvcHRpb25zLnBhZ2UgPSBvcHRpb25zLnBhZ2UgLSAxO1xuXG4gIGlmIChvcHRpb25zLnN0YXJ0ID4gMCkge1xuICAgIG9mZnNldFN0YXJ0ID0gb3B0aW9ucy5zdGFydDtcbiAgfSBlbHNlIHtcbiAgICBvZmZzZXRTdGFydCA9IG9wdGlvbnMucGFnZSAqIG9wdGlvbnMucGVyUGFnZUluTWludXRlcztcbiAgfVxuXG4gIGlmIChvcHRpb25zLmVuZCA+IDApIHtcbiAgICBvZmZzZXRFbmQgPSBvcHRpb25zLmVuZDtcbiAgfSBlbHNlIHtcbiAgICBvZmZzZXRFbmQgPSAob3B0aW9ucy5wYWdlICsgMSkgKiBvcHRpb25zLnBlclBhZ2VJbk1pbnV0ZXM7XG4gIH1cblxuICBjb21wdXRlZER1cmF0aW9uID0gb2Zmc2V0RW5kIC0gb2Zmc2V0U3RhcnQ7XG5cbiAgLyoqXG4gICAqIEZvciBtb25rZXkgcGF0Y2hpbmcgdGFrZSByZWZlcmVuY2VzIG9mIG9yaWdpbmFsIG1ldGhvZHNcbiAgICogV2Ugd2lsbCBvdmVycmlkZSBvcmlnaW5hbCBtZXRob2RzXG4gICAqL1xuICB2YXIgX19tb25rZXlfXyA9IHtcbiAgICBjdXJyZW50VGltZTogcGxheWVyLmN1cnJlbnRUaW1lLFxuICAgIHJlbWFpbmluZ1RpbWU6IHBsYXllci5yZW1haW5pbmdUaW1lLFxuICAgIGR1cmF0aW9uOiBwbGF5ZXIuZHVyYXRpb25cbiAgfTtcblxuICBwbGF5ZXIuYWRkQ2xhc3MoJ3Zqcy10aW1lLW9mZnNldCcpO1xuXG4gIGFkZFN0eWxlKCk7XG5cbiAgcGxheWVyLnJlbWFpbmluZ1RpbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHBsYXllci5kdXJhdGlvbigpIC0gcGxheWVyLmN1cnJlbnRUaW1lKCk7XG4gIH07XG5cbiAgcGxheWVyLmR1cmF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIGlmIChvZmZzZXRFbmQgPiAwKSB7XG4gICAgICBfX21vbmtleV9fLmR1cmF0aW9uLmFwcGx5KHBsYXllciwgYXJncyk7XG4gICAgICByZXR1cm4gY29tcHV0ZWREdXJhdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gX19tb25rZXlfXy5kdXJhdGlvbi5hcHBseShwbGF5ZXIsIGFyZ3MpIC0gb2Zmc2V0U3RhcnQ7XG4gIH07XG5cbiAgcGxheWVyLm9yaWdpbmFsRHVyYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgIGFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG5cbiAgICByZXR1cm4gX19tb25rZXlfXy5kdXJhdGlvbi5hcHBseShwbGF5ZXIsIGFyZ3MpO1xuICB9O1xuXG4gIHBsYXllci5jdXJyZW50VGltZSA9IGZ1bmN0aW9uIChzZWNvbmRzKSB7XG4gICAgaWYgKHR5cGVvZiBzZWNvbmRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgc2Vjb25kcyA9IHNlY29uZHMgKyBvZmZzZXRTdGFydDtcblxuICAgICAgcmV0dXJuIF9fbW9ua2V5X18uY3VycmVudFRpbWUuY2FsbChwbGF5ZXIsIHNlY29uZHMpO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50ID0gX19tb25rZXlfXy5jdXJyZW50VGltZS5jYWxsKHBsYXllcikgLSBvZmZzZXRTdGFydDtcblxuICAgIC8vIGluIHNhZmFyaSB3aXRoIGhscywgaXQgcmV0dXJucyBmbG9hdGluZyBudW1iZXIgbnVtYmVycywgZml4IGl0XG4gICAgaWYgKE1hdGguY2VpbChjdXJyZW50KSA8IDApIHtcbiAgICAgIHBsYXllci5wYXVzZSgpO1xuICAgICAgcGxheWVyLmN1cnJlbnRUaW1lKDApO1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50O1xuICB9O1xuXG4gIC8qKlxuICAgKiBXaGVuIHVzZXIgY2xpY2tzIHBsYXkgYnV0dG9uIGFmdGVyIHBhcnRpdGlvbiBmaW5pc2hlZFxuICAgKiBzdGFydCBmcm9tIGJlZ2lubmluZyBvZiBwYXJ0aXRpb25cbiAgICovXG4gIHBsYXllci5vbigncGxheScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVtYWluaW5nID0gcGxheWVyLnJlbWFpbmluZ1RpbWUoKTtcblxuICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgcGxheWVyLmN1cnJlbnRUaW1lKDApO1xuICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHBsYXllci5vbignbG9hZGVkbWV0YWRhdGEnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBwbGF5ZXIuY3VycmVudFRpbWUoKTtcbiAgICB2YXIgb3JpZ2luYWxEdXJhdGlvbiA9IHBsYXllci5vcmlnaW5hbER1cmF0aW9uKCk7XG5cbiAgICBwbGF5ZXIucGFnZUNvdW50ID0gTWF0aC5jZWlsKG9yaWdpbmFsRHVyYXRpb24gLyBvcHRpb25zLnBlclBhZ2VJbk1pbnV0ZXMpO1xuXG4gICAgaXNFbmRlZFRyaWdnZXJlZCA9IGZhbHNlO1xuICAgIC8vIGlmIHNldHRlZCBlbmQgdmFsdWUgaXNuJ3QgY29ycmVjdCwgRml4IElUXG4gICAgLy8gaXQgc2hvdWxkbid0IGJlIGJpZ2dlciB0aGFuIHZpZGVvIGxlbmd0aFxuICAgIGlmIChvZmZzZXRFbmQgPiBvcmlnaW5hbER1cmF0aW9uKSB7XG4gICAgICBjb21wdXRlZER1cmF0aW9uID0gb3JpZ2luYWxEdXJhdGlvbiAtIG9mZnNldFN0YXJ0O1xuICAgIH1cblxuICAgIC8vIGlmIHNldHRlZCBzdGFydCB2YWx1ZSBpc24ndCBjb3JyZWN0LCBGaXggSVRcbiAgICAvLyBpdCBzaG91bGRuJ3QgYmUgYmlnZ2VyIHRoYW4gdmlkZW8gbGVuZ3RoXG4gICAgaWYgKG9mZnNldFN0YXJ0ID4gb3JpZ2luYWxEdXJhdGlvbikge1xuICAgICAgb2Zmc2V0U3RhcnQgPSAwO1xuICAgICAgY29tcHV0ZWREdXJhdGlvbiA9IG9yaWdpbmFsRHVyYXRpb247XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnQgPCAwKSB7XG4gICAgICBwbGF5ZXIuY3VycmVudFRpbWUoMCk7XG4gICAgfVxuICB9KTtcblxuICBwbGF5ZXIub24oJ3RpbWV1cGRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlbWFpbmluZyA9IHBsYXllci5yZW1haW5pbmdUaW1lKCk7XG5cbiAgICBpZiAocmVtYWluaW5nIDw9IDApIHtcbiAgICAgIHBsYXllci5wYXVzZSgpO1xuXG4gICAgICBpZiAoIWlzRW5kZWRUcmlnZ2VyZWQpIHtcbiAgICAgICAgcGxheWVyLnRyaWdnZXIoJ2VuZGVkJyk7XG4gICAgICAgIHBsYXllci5vbignYWRFbmRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpc0VuZGVkVHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbi8qKlxuICogQSB2aWRlby5qcyBwbHVnaW4uXG4gKlxuICogSW4gdGhlIHBsdWdpbiBmdW5jdGlvbiwgdGhlIHZhbHVlIG9mIGB0aGlzYCBpcyBhIHZpZGVvLmpzIGBQbGF5ZXJgXG4gKiBpbnN0YW5jZS4gWW91IGNhbm5vdCByZWx5IG9uIHRoZSBwbGF5ZXIgYmVpbmcgaW4gYSBcInJlYWR5XCIgc3RhdGUgaGVyZSxcbiAqIGRlcGVuZGluZyBvbiBob3cgdGhlIHBsdWdpbiBpcyBpbnZva2VkLiBUaGlzIG1heSBvciBtYXkgbm90IGJlIGltcG9ydGFudFxuICogdG8geW91OyBpZiBub3QsIHJlbW92ZSB0aGUgd2FpdCBmb3IgXCJyZWFkeVwiIVxuICpcbiAqIEBmdW5jdGlvbiB0aW1lLW9mZnNldFxuICogQHBhcmFtICAgIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICogICAgICAgICAgIEFuIG9iamVjdCBvZiBvcHRpb25zIGxlZnQgdG8gdGhlIHBsdWdpbiBhdXRob3IgdG8gZGVmaW5lLlxuICovXG52YXIgdGltZU9mZnNldCA9IGZ1bmN0aW9uIHRpbWVPZmZzZXQob3B0aW9ucykge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIHRoaXMucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIG9uUGxheWVyUmVhZHkoX3RoaXMsIF92aWRlb0pzMlsnZGVmYXVsdCddLm1lcmdlT3B0aW9ucyhkZWZhdWx0cywgb3B0aW9ucykpO1xuICB9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIHRoZSBwbHVnaW4gd2l0aCB2aWRlby5qcy5cbl92aWRlb0pzMlsnZGVmYXVsdCddLnBsdWdpbigndGltZU9mZnNldCcsIHRpbWVPZmZzZXQpO1xuXG4vLyBJbmNsdWRlIHRoZSB2ZXJzaW9uIG51bWJlci5cbnRpbWVPZmZzZXQuVkVSU0lPTiA9ICcwLjAuMSc7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHRpbWVPZmZzZXQ7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxufSx7fV19LHt9LFsxXSkoMSlcbn0pOyJdfQ==