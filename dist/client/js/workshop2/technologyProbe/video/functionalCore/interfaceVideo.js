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
      function playPausecallback(_x) {
        return _playPausecallback.apply(this, arguments);
      }

      playPausecallback.toString = function () {
        return _playPausecallback.toString();
      };

      return playPausecallback;
    }(function (command) {
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
      function createNewCard(_x2, _x3) {
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
      function seekTo(_x4) {
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
      function sliderToVideo(_x5, _x6) {
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
      function repetPartOfVideo(_x7, _x8, _x9, _x10) {
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
      function setSource(_x11) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyZmFjZVZpZGVvLmpzIl0sIm5hbWVzIjpbImNvbnNvbGUiLCJsb2ciLCJlbnVtX3ZpZGVvcGxhdGZvcm0iLCJNUDQiLCJZT1VUVUJFIiwibWVkaWFwbGF0Zm9ybSIsInZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyIiwiVmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIiLCJQbGF5ZXIiLCJwbGF5UGF1c2VjYWxsYmFjayIsImNvbW1hbmQiLCJ1cGRhdGVUaW1lclZpZGVvIiwiY3JlYXRlTmV3Q2FyZCIsInN0YXJ0UCIsImVuZFAiLCJwbGF5IiwicGxhdXNlIiwicGF1c2UiLCJzZWVrVG8iLCJzdGFydER1cmF0aW9uUGFyYW0iLCJzbGlkZXJUb1ZpZGVvIiwicmVwZXRQYXJ0T2ZWaWRlbyIsInN0YXJ0IiwiZW5kIiwibnVtYmVyT2ZSZXBldGl0aW9uIiwic3BlZWRSYXRlIiwic2V0U291cmNlIiwic291cmNlIiwibWlycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxHQUFSLENBQVksa0NBQVo7QUFDQSxJQUFJQyxxQkFBcUI7QUFDdkJDLE9BQUssQ0FEa0I7QUFFdkJDLFdBQVM7QUFGYyxDQUF6QjtBQUlBLElBQUlDLGdCQUFnQkgsbUJBQW1CQyxHQUF2QztBQUNBOzs7QUFHQSxJQUFJRyw2QkFBNkJDLDRCQUFqQzs7QUFFQSxJQUFJQyxTQUFTLFNBQVRBLE1BQVMsR0FBVzs7QUFFdEI7QUFDQSxTQUFPO0FBQ0w7QUFDQUM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBbUIsVUFBU0MsT0FBVCxFQUFrQjtBQUNuQ0Q7QUFDRCxLQUZELENBRks7O0FBTUxFO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWtCLFlBQVk7QUFDNUJBO0FBQ0QsS0FGRCxDQU5LOztBQVVMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFnQixVQUFVQyxNQUFWLEVBQWlCQyxJQUFqQixFQUF3QjtBQUN0Q0Ysb0JBQWNDLE1BQWQsRUFBcUJDLElBQXJCO0FBQ0YsS0FGQSxDQVZLOztBQWNMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFNLFlBQVk7QUFDaEJBO0FBQ0QsS0FGRCxDQWRLO0FBaUJMQyxZQUFRLGtCQUFZO0FBQ2xCQztBQUNELEtBbkJJO0FBb0JMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFTLFVBQVVDLGtCQUFWLEVBQThCO0FBQ3JDRCxhQUFPQyxrQkFBUDtBQUVELEtBSEQsQ0FwQks7QUF3QkxDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWdCLFVBQVNQLE1BQVQsRUFBaUJDLElBQWpCLEVBQXVCO0FBQ3JDLGFBQU9NLGNBQWNQLE1BQWQsRUFBc0JDLElBQXRCLENBQVA7QUFDRCxLQUZELENBeEJLO0FBMkJMTztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFvQixVQUFTQyxLQUFULEVBQWVDLEdBQWYsRUFBb0JDLGtCQUFwQixFQUF1Q0MsU0FBdkMsRUFBa0Q7QUFDcEVKLHVCQUFpQkMsS0FBakIsRUFBdUJDLEdBQXZCLEVBQTRCQyxrQkFBNUIsRUFBK0NDLFNBQS9DO0FBQ0QsS0FGRCxDQTNCSzs7QUErQkxDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWEsVUFBU0MsTUFBVCxFQUFpQjtBQUM1QkQsZ0JBQVVDLE1BQVY7QUFDRCxLQUZELENBL0JLO0FBa0NMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFTLFlBQVk7QUFDbkJBO0FBQ0QsS0FGRDs7QUFsQ0ssR0FBUDtBQXdDRCxDQTNDRDs7QUE2Q0EsSUFBSXBCLFNBQVMsSUFBSUEsTUFBSixFQUFiIiwiZmlsZSI6ImludGVyZmFjZVZpZGVvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc29sZS5sb2coXCIqKiogQ2hhcmdpbmcgaW50ZXJmYWNlIFZpZGVvICoqKlwiKTtcbnZhciBlbnVtX3ZpZGVvcGxhdGZvcm0gPSB7XG4gIE1QNDogMSxcbiAgWU9VVFVCRTogMlxufTtcbnZhciBtZWRpYXBsYXRmb3JtID0gZW51bV92aWRlb3BsYXRmb3JtLk1QNDtcbi8vdmFyIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyID0gIG5ldyBQbGF5ZXIoKTtcblxuXG52YXIgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIgPSBWaWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlcigpO1xuXG52YXIgUGxheWVyID0gZnVuY3Rpb24oKSB7XG4gIFxuICAvL0kgaW1wbGVtZW50ZWQgYSBjb21tYW5kIHBhdHRlcm4sIHNlZSA6IGh0dHBzOi8vd3d3LmRvZmFjdG9yeS5jb20vamF2YXNjcmlwdC9jb21tYW5kLWRlc2lnbi1wYXR0ZXJuXG4gIHJldHVybiB7XG4gICAgLy9leGVjdXRlIGEgY29tbWFuZFxuICAgIHBsYXlQYXVzZWNhbGxiYWNrOiBmdW5jdGlvbihjb21tYW5kKSB7XG4gICAgICBwbGF5UGF1c2VjYWxsYmFjaygpO1xuICAgIH0sXG4gIFxuICAgIHVwZGF0ZVRpbWVyVmlkZW86IGZ1bmN0aW9uICgpIHtcbiAgICAgIHVwZGF0ZVRpbWVyVmlkZW8oKTtcbiAgICB9LFxuICBcbiAgICBjcmVhdGVOZXdDYXJkIDogZnVuY3Rpb24gKHN0YXJ0UCxlbmRQICkge1xuICAgICAgY3JlYXRlTmV3Q2FyZChzdGFydFAsZW5kUCk7XG4gICB9LFxuICBcbiAgICBwbGF5OiBmdW5jdGlvbigpICB7XG4gICAgICBwbGF5KCk7XG4gICAgfSxcbiAgICBwbGF1c2U6IGZ1bmN0aW9uKCkgIHtcbiAgICAgIHBhdXNlKCk7XG4gICAgfSxcbiAgICBzZWVrVG8gOiBmdW5jdGlvbiAoc3RhcnREdXJhdGlvblBhcmFtKSB7XG4gICAgICBzZWVrVG8oc3RhcnREdXJhdGlvblBhcmFtKTtcbiAgXG4gICAgfSxcbiAgICBzbGlkZXJUb1ZpZGVvIDogZnVuY3Rpb24oc3RhcnRQLCBlbmRQKSB7XG4gICAgICByZXR1cm4gc2xpZGVyVG9WaWRlbyhzdGFydFAsIGVuZFApO1xuICAgIH0sXG4gICAgcmVwZXRQYXJ0T2ZWaWRlbyAgOiBmdW5jdGlvbihzdGFydCxlbmQsIG51bWJlck9mUmVwZXRpdGlvbixzcGVlZFJhdGUpIHtcbiAgICAgIHJlcGV0UGFydE9mVmlkZW8oc3RhcnQsZW5kLCBudW1iZXJPZlJlcGV0aXRpb24sc3BlZWRSYXRlKSA7XG4gICAgfSxcbiAgXG4gICAgc2V0U291cmNlICA6IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgc2V0U291cmNlKHNvdXJjZSkgO1xuICAgIH0sXG4gICAgbWlycm9yIDogZnVuY3Rpb24gKCkge1xuICAgICAgbWlycm9yKCk7XG4gICAgfVxuICBcbiAgXG4gIH1cbn07XG5cbnZhciBQbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG4iXX0=