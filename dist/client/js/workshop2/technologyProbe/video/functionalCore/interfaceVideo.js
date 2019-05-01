"use strict";

console.log("*** Charging interface Video ***");
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
      function createNewCard(_x, _x2) {
        return _createNewCard.apply(this, arguments);
      }

      createNewCard.toString = function () {
        return _createNewCard.toString();
      };

      return createNewCard;
    }(function (startP, endP) {
      createNewCard(startP, endP);
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
      function seekTo(_x3) {
        return _seekTo.apply(this, arguments);
      }

      seekTo.toString = function () {
        return _seekTo.toString();
      };

      return seekTo;
    }(function (startDurationParam) {
      seekTo(startDurationParam);
    }),
    sliderToVideo: function (_sliderToVideo) {
      function sliderToVideo(_x4, _x5) {
        return _sliderToVideo.apply(this, arguments);
      }

      sliderToVideo.toString = function () {
        return _sliderToVideo.toString();
      };

      return sliderToVideo;
    }(function (startP, endP) {
      return sliderToVideo(startP, endP);
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

var Player = new Player();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyZmFjZVZpZGVvLmpzIl0sIm5hbWVzIjpbImNvbnNvbGUiLCJsb2ciLCJlbnVtX3ZpZGVvcGxhdGZvcm0iLCJNUDQiLCJZT1VUVUJFIiwibWVkaWFwbGF0Zm9ybSIsInZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyIiwiVmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIiLCJQbGF5ZXIiLCJwbGF5UGF1c2VjYWxsYmFjayIsInVwZGF0ZVRpbWVyVmlkZW8iLCJjcmVhdGVOZXdDYXJkIiwic3RhcnRQIiwiZW5kUCIsInBsYXkiLCJwbGF1c2UiLCJwYXVzZSIsInNlZWtUbyIsInN0YXJ0RHVyYXRpb25QYXJhbSIsInNsaWRlclRvVmlkZW8iLCJyZXBldFBhcnRPZlZpZGVvIiwic3RhcnQiLCJlbmQiLCJudW1iZXJPZlJlcGV0aXRpb24iLCJzcGVlZFJhdGUiLCJzZXRTb3VyY2UiLCJzb3VyY2UiLCJtaXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLEdBQVIsQ0FBWSxrQ0FBWjtBQUNBLElBQUlDLHFCQUFxQjtBQUN2QkMsT0FBSyxDQURrQjtBQUV2QkMsV0FBUztBQUZjLENBQXpCO0FBSUEsSUFBSUMsZ0JBQWdCSCxtQkFBbUJDLEdBQXZDO0FBQ0E7OztBQUdBLElBQUlHLDZCQUE2QkMsNEJBQWpDOztBQUVBLElBQUlDLFNBQVMsU0FBVEEsTUFBUyxHQUFXOztBQUV0QjtBQUNBLFNBQU87QUFDTDtBQUNBQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFtQixZQUFXO0FBQzVCQTtBQUNELEtBRkQsQ0FGSzs7QUFNTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBa0IsWUFBWTtBQUM1QkE7QUFDRCxLQUZELENBTks7O0FBVUxDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWdCLFVBQVVDLE1BQVYsRUFBaUJDLElBQWpCLEVBQXdCO0FBQ3RDRixvQkFBY0MsTUFBZCxFQUFxQkMsSUFBckI7QUFDRixLQUZBLENBVks7O0FBY0xDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQU0sWUFBWTtBQUNoQkE7QUFDRCxLQUZELENBZEs7QUFpQkxDLFlBQVEsa0JBQVk7QUFDbEJDO0FBQ0QsS0FuQkk7QUFvQkxDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQVMsVUFBVUMsa0JBQVYsRUFBOEI7QUFDckNELGFBQU9DLGtCQUFQO0FBRUQsS0FIRCxDQXBCSztBQXdCTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBZ0IsVUFBU1AsTUFBVCxFQUFpQkMsSUFBakIsRUFBdUI7QUFDckMsYUFBT00sY0FBY1AsTUFBZCxFQUFzQkMsSUFBdEIsQ0FBUDtBQUNELEtBRkQsQ0F4Qks7QUEyQkxPO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQW9CLFVBQVNDLEtBQVQsRUFBZUMsR0FBZixFQUFvQkMsa0JBQXBCLEVBQXVDQyxTQUF2QyxFQUFrRDtBQUNwRUosdUJBQWlCQyxLQUFqQixFQUF1QkMsR0FBdkIsRUFBNEJDLGtCQUE1QixFQUErQ0MsU0FBL0M7QUFDRCxLQUZELENBM0JLOztBQStCTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBYSxVQUFTQyxNQUFULEVBQWlCO0FBQzVCRCxnQkFBVUMsTUFBVjtBQUNELEtBRkQsQ0EvQks7QUFrQ0xDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQVMsWUFBWTtBQUNuQkE7QUFDRCxLQUZEOztBQWxDSyxHQUFQO0FBd0NELENBM0NEOztBQTZDQSxJQUFJbkIsU0FBUyxJQUFJQSxNQUFKLEVBQWIiLCJmaWxlIjoiaW50ZXJmYWNlVmlkZW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zb2xlLmxvZyhcIioqKiBDaGFyZ2luZyBpbnRlcmZhY2UgVmlkZW8gKioqXCIpO1xudmFyIGVudW1fdmlkZW9wbGF0Zm9ybSA9IHtcbiAgTVA0OiAxLFxuICBZT1VUVUJFOiAyXG59O1xudmFyIG1lZGlhcGxhdGZvcm0gPSBlbnVtX3ZpZGVvcGxhdGZvcm0uTVA0O1xuLy92YXIgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIgPSAgbmV3IFBsYXllcigpO1xuXG5cbnZhciB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlciA9IFZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyKCk7XG5cbnZhciBQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgXG4gIC8vSSBpbXBsZW1lbnRlZCBhIGNvbW1hbmQgcGF0dGVybiwgc2VlIDogaHR0cHM6Ly93d3cuZG9mYWN0b3J5LmNvbS9qYXZhc2NyaXB0L2NvbW1hbmQtZGVzaWduLXBhdHRlcm5cbiAgcmV0dXJuIHtcbiAgICAvL2V4ZWN1dGUgYSBjb21tYW5kXG4gICAgcGxheVBhdXNlY2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgcGxheVBhdXNlY2FsbGJhY2soKTtcbiAgICB9LFxuICBcbiAgICB1cGRhdGVUaW1lclZpZGVvOiBmdW5jdGlvbiAoKSB7XG4gICAgICB1cGRhdGVUaW1lclZpZGVvKCk7XG4gICAgfSxcbiAgXG4gICAgY3JlYXRlTmV3Q2FyZCA6IGZ1bmN0aW9uIChzdGFydFAsZW5kUCApIHtcbiAgICAgIGNyZWF0ZU5ld0NhcmQoc3RhcnRQLGVuZFApO1xuICAgfSxcbiAgXG4gICAgcGxheTogZnVuY3Rpb24oKSAge1xuICAgICAgcGxheSgpO1xuICAgIH0sXG4gICAgcGxhdXNlOiBmdW5jdGlvbigpICB7XG4gICAgICBwYXVzZSgpO1xuICAgIH0sXG4gICAgc2Vla1RvIDogZnVuY3Rpb24gKHN0YXJ0RHVyYXRpb25QYXJhbSkge1xuICAgICAgc2Vla1RvKHN0YXJ0RHVyYXRpb25QYXJhbSk7XG4gIFxuICAgIH0sXG4gICAgc2xpZGVyVG9WaWRlbyA6IGZ1bmN0aW9uKHN0YXJ0UCwgZW5kUCkge1xuICAgICAgcmV0dXJuIHNsaWRlclRvVmlkZW8oc3RhcnRQLCBlbmRQKTtcbiAgICB9LFxuICAgIHJlcGV0UGFydE9mVmlkZW8gIDogZnVuY3Rpb24oc3RhcnQsZW5kLCBudW1iZXJPZlJlcGV0aXRpb24sc3BlZWRSYXRlKSB7XG4gICAgICByZXBldFBhcnRPZlZpZGVvKHN0YXJ0LGVuZCwgbnVtYmVyT2ZSZXBldGl0aW9uLHNwZWVkUmF0ZSkgO1xuICAgIH0sXG4gIFxuICAgIHNldFNvdXJjZSAgOiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIHNldFNvdXJjZShzb3VyY2UpIDtcbiAgICB9LFxuICAgIG1pcnJvciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIG1pcnJvcigpO1xuICAgIH1cbiAgXG4gIFxuICB9XG59O1xuXG52YXIgUGxheWVyID0gbmV3IFBsYXllcigpO1xuIl19