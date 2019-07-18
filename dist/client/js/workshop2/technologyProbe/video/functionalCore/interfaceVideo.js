"use strict";

var enum_videoplatform = {
  MP4: 1,
  YOUTUBE: 2
};
var mediaplatform = enum_videoplatform.MP4;
//var videoFunctionalCoreManager =  new Player();


var videoFunctionalCoreManager = VideoFunctionalCoreManager();

var Player = function Player() {

  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    playPausecallback: function (_playPausecallback) {
      function playPausecallback() {
        return _playPausecallback.apply(this, arguments);
      }

      playPausecallback.toString = function () {
        return _playPausecallback.toString();
      };

      return playPausecallback;
    }(function () {
      playPausecallback();
    }),

    updateTimerVideo: function (_updateTimerVideo) {
      function updateTimerVideo() {
        return _updateTimerVideo.apply(this, arguments);
      }

      updateTimerVideo.toString = function () {
        return _updateTimerVideo.toString();
      };

      return updateTimerVideo;
    }(function () {
      updateTimerVideo();
    }),

    createNewCard: function (_createNewCard) {
      function createNewCard(_x, _x2, _x3, _x4) {
        return _createNewCard.apply(this, arguments);
      }

      createNewCard.toString = function () {
        return _createNewCard.toString();
      };

      return createNewCard;
    }(function (startP, endP, positionStart, positionStop) {
      createNewCard(startP, endP, positionStart, positionStop);
    }),

    play: function (_play) {
      function play() {
        return _play.apply(this, arguments);
      }

      play.toString = function () {
        return _play.toString();
      };

      return play;
    }(function () {
      play();
    }),
    plause: function plause() {
      pause();
    },
    seekTo: function (_seekTo) {
      function seekTo(_x5) {
        return _seekTo.apply(this, arguments);
      }

      seekTo.toString = function () {
        return _seekTo.toString();
      };

      return seekTo;
    }(function (startDurationParam) {
      seekTo(startDurationParam);
    }),
    repetPartOfVideo: function (_repetPartOfVideo) {
      function repetPartOfVideo(_x6, _x7, _x8, _x9) {
        return _repetPartOfVideo.apply(this, arguments);
      }

      repetPartOfVideo.toString = function () {
        return _repetPartOfVideo.toString();
      };

      return repetPartOfVideo;
    }(function (start, end, numberOfRepetition, speedRate) {
      repetPartOfVideo(start, end, numberOfRepetition, speedRate);
    }),

    setSource: function (_setSource) {
      function setSource(_x10) {
        return _setSource.apply(this, arguments);
      }

      setSource.toString = function () {
        return _setSource.toString();
      };

      return setSource;
    }(function (source) {
      setSource(source);
    }),
    mirror: function (_mirror) {
      function mirror() {
        return _mirror.apply(this, arguments);
      }

      mirror.toString = function () {
        return _mirror.toString();
      };

      return mirror;
    }(function () {
      mirror();
    })

  };
};

var player = new Player();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyZmFjZVZpZGVvLmpzIl0sIm5hbWVzIjpbImVudW1fdmlkZW9wbGF0Zm9ybSIsIk1QNCIsIllPVVRVQkUiLCJtZWRpYXBsYXRmb3JtIiwidmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIiLCJWaWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlciIsIlBsYXllciIsInBsYXlQYXVzZWNhbGxiYWNrIiwidXBkYXRlVGltZXJWaWRlbyIsImNyZWF0ZU5ld0NhcmQiLCJzdGFydFAiLCJlbmRQIiwicG9zaXRpb25TdGFydCIsInBvc2l0aW9uU3RvcCIsInBsYXkiLCJwbGF1c2UiLCJwYXVzZSIsInNlZWtUbyIsInN0YXJ0RHVyYXRpb25QYXJhbSIsInJlcGV0UGFydE9mVmlkZW8iLCJzdGFydCIsImVuZCIsIm51bWJlck9mUmVwZXRpdGlvbiIsInNwZWVkUmF0ZSIsInNldFNvdXJjZSIsInNvdXJjZSIsIm1pcnJvciIsInBsYXllciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxxQkFBcUI7QUFDdkJDLE9BQUssQ0FEa0I7QUFFdkJDLFdBQVM7QUFGYyxDQUF6QjtBQUlBLElBQUlDLGdCQUFnQkgsbUJBQW1CQyxHQUF2QztBQUNBOzs7QUFHQSxJQUFJRyw2QkFBNkJDLDRCQUFqQzs7QUFFQSxJQUFJQyxTQUFTLFNBQVRBLE1BQVMsR0FBVzs7QUFFdEI7QUFDQSxTQUFPO0FBQ0w7QUFDQUM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBbUIsWUFBVztBQUM1QkE7QUFDRCxLQUZELENBRks7O0FBTUxDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWtCLFlBQVk7QUFDNUJBO0FBQ0QsS0FGRCxDQU5LOztBQVVMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFnQixVQUFVQyxNQUFWLEVBQWlCQyxJQUFqQixFQUF1QkMsYUFBdkIsRUFBc0NDLFlBQXRDLEVBQXFEO0FBQ25FSixvQkFBY0MsTUFBZCxFQUFxQkMsSUFBckIsRUFBMEJDLGFBQTFCLEVBQXlDQyxZQUF6QztBQUNGLEtBRkEsQ0FWSzs7QUFjTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBTSxZQUFZO0FBQ2hCQTtBQUNELEtBRkQsQ0FkSztBQWlCTEMsWUFBUSxrQkFBWTtBQUNsQkM7QUFDRCxLQW5CSTtBQW9CTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBUyxVQUFVQyxrQkFBVixFQUE4QjtBQUNyQ0QsYUFBT0Msa0JBQVA7QUFFRCxLQUhELENBcEJLO0FBd0JMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFvQixVQUFTQyxLQUFULEVBQWVDLEdBQWYsRUFBb0JDLGtCQUFwQixFQUF1Q0MsU0FBdkMsRUFBa0Q7QUFDcEVKLHVCQUFpQkMsS0FBakIsRUFBdUJDLEdBQXZCLEVBQTRCQyxrQkFBNUIsRUFBK0NDLFNBQS9DO0FBQ0QsS0FGRCxDQXhCSzs7QUE0QkxDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWEsVUFBU0MsTUFBVCxFQUFpQjtBQUM1QkQsZ0JBQVVDLE1BQVY7QUFDRCxLQUZELENBNUJLO0FBK0JMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFTLFlBQVk7QUFDbkJBO0FBQ0QsS0FGRDs7QUEvQkssR0FBUDtBQXFDRCxDQXhDRDs7QUEyQ0EsSUFBSUMsU0FBUyxJQUFJckIsTUFBSixFQUFiIiwiZmlsZSI6ImludGVyZmFjZVZpZGVvLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVudW1fdmlkZW9wbGF0Zm9ybSA9IHtcbiAgTVA0OiAxLFxuICBZT1VUVUJFOiAyXG59O1xudmFyIG1lZGlhcGxhdGZvcm0gPSBlbnVtX3ZpZGVvcGxhdGZvcm0uTVA0O1xuLy92YXIgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIgPSAgbmV3IFBsYXllcigpO1xuXG5cbnZhciB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlciA9IFZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyKCk7XG5cbnZhciBQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgXG4gIC8vSSBpbXBsZW1lbnRlZCBhIGNvbW1hbmQgcGF0dGVybiwgc2VlIDogaHR0cHM6Ly93d3cuZG9mYWN0b3J5LmNvbS9qYXZhc2NyaXB0L2NvbW1hbmQtZGVzaWduLXBhdHRlcm5cbiAgcmV0dXJuIHtcbiAgICAvL2V4ZWN1dGUgYSBjb21tYW5kXG4gICAgcGxheVBhdXNlY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcGxheVBhdXNlY2FsbGJhY2soKTtcbiAgICB9LFxuICBcbiAgICB1cGRhdGVUaW1lclZpZGVvOiBmdW5jdGlvbiAoKSB7XG4gICAgICB1cGRhdGVUaW1lclZpZGVvKCk7XG4gICAgfSxcbiAgXG4gICAgY3JlYXRlTmV3Q2FyZCA6IGZ1bmN0aW9uIChzdGFydFAsZW5kUCwgcG9zaXRpb25TdGFydCwgcG9zaXRpb25TdG9wICkge1xuICAgICAgY3JlYXRlTmV3Q2FyZChzdGFydFAsZW5kUCxwb3NpdGlvblN0YXJ0LCBwb3NpdGlvblN0b3ApO1xuICAgfSxcbiAgXG4gICAgcGxheTogZnVuY3Rpb24oKSAge1xuICAgICAgcGxheSgpO1xuICAgIH0sXG4gICAgcGxhdXNlOiBmdW5jdGlvbigpICB7XG4gICAgICBwYXVzZSgpO1xuICAgIH0sXG4gICAgc2Vla1RvIDogZnVuY3Rpb24gKHN0YXJ0RHVyYXRpb25QYXJhbSkge1xuICAgICAgc2Vla1RvKHN0YXJ0RHVyYXRpb25QYXJhbSk7XG4gIFxuICAgIH0sXG4gICAgcmVwZXRQYXJ0T2ZWaWRlbyAgOiBmdW5jdGlvbihzdGFydCxlbmQsIG51bWJlck9mUmVwZXRpdGlvbixzcGVlZFJhdGUpIHtcbiAgICAgIHJlcGV0UGFydE9mVmlkZW8oc3RhcnQsZW5kLCBudW1iZXJPZlJlcGV0aXRpb24sc3BlZWRSYXRlKSA7XG4gICAgfSxcbiAgXG4gICAgc2V0U291cmNlICA6IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgc2V0U291cmNlKHNvdXJjZSkgO1xuICAgIH0sXG4gICAgbWlycm9yIDogZnVuY3Rpb24gKCkge1xuICAgICAgbWlycm9yKCk7XG4gICAgfVxuICBcbiAgXG4gIH1cbn07XG5cblxudmFyIHBsYXllciA9IG5ldyBQbGF5ZXIoKTtcblxuIl19