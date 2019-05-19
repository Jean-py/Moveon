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
    repetPartOfVideo: function (_repetPartOfVideo) {
      function repetPartOfVideo(_x4, _x5, _x6, _x7) {
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
      function setSource(_x8) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyZmFjZVZpZGVvLmpzIl0sIm5hbWVzIjpbImNvbnNvbGUiLCJsb2ciLCJlbnVtX3ZpZGVvcGxhdGZvcm0iLCJNUDQiLCJZT1VUVUJFIiwibWVkaWFwbGF0Zm9ybSIsInZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyIiwiVmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIiLCJQbGF5ZXIiLCJwbGF5UGF1c2VjYWxsYmFjayIsInVwZGF0ZVRpbWVyVmlkZW8iLCJjcmVhdGVOZXdDYXJkIiwic3RhcnRQIiwiZW5kUCIsInBsYXkiLCJwbGF1c2UiLCJwYXVzZSIsInNlZWtUbyIsInN0YXJ0RHVyYXRpb25QYXJhbSIsInJlcGV0UGFydE9mVmlkZW8iLCJzdGFydCIsImVuZCIsIm51bWJlck9mUmVwZXRpdGlvbiIsInNwZWVkUmF0ZSIsInNldFNvdXJjZSIsInNvdXJjZSIsIm1pcnJvciIsInBsYXllciJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsR0FBUixDQUFZLGtDQUFaO0FBQ0EsSUFBSUMscUJBQXFCO0FBQ3ZCQyxPQUFLLENBRGtCO0FBRXZCQyxXQUFTO0FBRmMsQ0FBekI7QUFJQSxJQUFJQyxnQkFBZ0JILG1CQUFtQkMsR0FBdkM7QUFDQTs7O0FBR0EsSUFBSUcsNkJBQTZCQyw0QkFBakM7O0FBRUEsSUFBSUMsU0FBUyxTQUFUQSxNQUFTLEdBQVc7O0FBRXRCO0FBQ0EsU0FBTztBQUNMO0FBQ0FDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQW1CLFlBQVc7QUFDNUJBO0FBQ0QsS0FGRCxDQUZLOztBQU1MQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFrQixZQUFZO0FBQzVCQTtBQUNELEtBRkQsQ0FOSzs7QUFVTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBZ0IsVUFBVUMsTUFBVixFQUFpQkMsSUFBakIsRUFBd0I7QUFDdENGLG9CQUFjQyxNQUFkLEVBQXFCQyxJQUFyQjtBQUNGLEtBRkEsQ0FWSzs7QUFjTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBTSxZQUFZO0FBQ2hCQTtBQUNELEtBRkQsQ0FkSztBQWlCTEMsWUFBUSxrQkFBWTtBQUNsQkM7QUFDRCxLQW5CSTtBQW9CTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBUyxVQUFVQyxrQkFBVixFQUE4QjtBQUNyQ0QsYUFBT0Msa0JBQVA7QUFFRCxLQUhELENBcEJLO0FBd0JMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFvQixVQUFTQyxLQUFULEVBQWVDLEdBQWYsRUFBb0JDLGtCQUFwQixFQUF1Q0MsU0FBdkMsRUFBa0Q7QUFDcEVKLHVCQUFpQkMsS0FBakIsRUFBdUJDLEdBQXZCLEVBQTRCQyxrQkFBNUIsRUFBK0NDLFNBQS9DO0FBQ0QsS0FGRCxDQXhCSzs7QUE0QkxDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWEsVUFBU0MsTUFBVCxFQUFpQjtBQUM1QkQsZ0JBQVVDLE1BQVY7QUFDRCxLQUZELENBNUJLO0FBK0JMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFTLFlBQVk7QUFDbkJBO0FBQ0QsS0FGRDs7QUEvQkssR0FBUDtBQXFDRCxDQXhDRDs7QUEyQ0EsSUFBSUMsU0FBUyxJQUFJbkIsTUFBSixFQUFiIiwiZmlsZSI6ImludGVyZmFjZVZpZGVvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc29sZS5sb2coXCIqKiogQ2hhcmdpbmcgaW50ZXJmYWNlIFZpZGVvICoqKlwiKTtcbnZhciBlbnVtX3ZpZGVvcGxhdGZvcm0gPSB7XG4gIE1QNDogMSxcbiAgWU9VVFVCRTogMlxufTtcbnZhciBtZWRpYXBsYXRmb3JtID0gZW51bV92aWRlb3BsYXRmb3JtLk1QNDtcbi8vdmFyIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyID0gIG5ldyBQbGF5ZXIoKTtcblxuXG52YXIgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIgPSBWaWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlcigpO1xuXG52YXIgUGxheWVyID0gZnVuY3Rpb24oKSB7XG4gIFxuICAvL0kgaW1wbGVtZW50ZWQgYSBjb21tYW5kIHBhdHRlcm4sIHNlZSA6IGh0dHBzOi8vd3d3LmRvZmFjdG9yeS5jb20vamF2YXNjcmlwdC9jb21tYW5kLWRlc2lnbi1wYXR0ZXJuXG4gIHJldHVybiB7XG4gICAgLy9leGVjdXRlIGEgY29tbWFuZFxuICAgIHBsYXlQYXVzZWNhbGxiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIHBsYXlQYXVzZWNhbGxiYWNrKCk7XG4gICAgfSxcbiAgXG4gICAgdXBkYXRlVGltZXJWaWRlbzogZnVuY3Rpb24gKCkge1xuICAgICAgdXBkYXRlVGltZXJWaWRlbygpO1xuICAgIH0sXG4gIFxuICAgIGNyZWF0ZU5ld0NhcmQgOiBmdW5jdGlvbiAoc3RhcnRQLGVuZFAgKSB7XG4gICAgICBjcmVhdGVOZXdDYXJkKHN0YXJ0UCxlbmRQKTtcbiAgIH0sXG4gIFxuICAgIHBsYXk6IGZ1bmN0aW9uKCkgIHtcbiAgICAgIHBsYXkoKTtcbiAgICB9LFxuICAgIHBsYXVzZTogZnVuY3Rpb24oKSAge1xuICAgICAgcGF1c2UoKTtcbiAgICB9LFxuICAgIHNlZWtUbyA6IGZ1bmN0aW9uIChzdGFydER1cmF0aW9uUGFyYW0pIHtcbiAgICAgIHNlZWtUbyhzdGFydER1cmF0aW9uUGFyYW0pO1xuICBcbiAgICB9LFxuICAgIHJlcGV0UGFydE9mVmlkZW8gIDogZnVuY3Rpb24oc3RhcnQsZW5kLCBudW1iZXJPZlJlcGV0aXRpb24sc3BlZWRSYXRlKSB7XG4gICAgICByZXBldFBhcnRPZlZpZGVvKHN0YXJ0LGVuZCwgbnVtYmVyT2ZSZXBldGl0aW9uLHNwZWVkUmF0ZSkgO1xuICAgIH0sXG4gIFxuICAgIHNldFNvdXJjZSAgOiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIHNldFNvdXJjZShzb3VyY2UpIDtcbiAgICB9LFxuICAgIG1pcnJvciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIG1pcnJvcigpO1xuICAgIH1cbiAgXG4gIFxuICB9XG59O1xuXG5cbnZhciBwbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG5cbiJdfQ==