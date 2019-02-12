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
      console.log("test");
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
    })

  };
};

/*
var Player = function() {
  //This is a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
  
    playPausecallback : function(e) {
    
    },
    play: function()  {
      videoFunctionalCoreManager.play();
    },
    pause : function (){
      videoFunctionalCoreManager.pause();
    },
  
    sliderToVideo : function(startP, endP){
      videoFunctionalCoreManager.sliderToVideo(startP, endP);
    },
  
    updateTimerVideo : function(){
      videoFunctionalCoreManager.updateTimerVideo();
    },
  
    feedbackOnSliderVideo : function(onOff) {
      videoFunctionalCoreManager.feedbackOnSliderVideo(onOff);
    },
  
    updateKnobAndVideoComputer : function() {
      videoFunctionalCoreManager.updateKnobAndVideoComputer();
    },
  
    updateKnobAndVideo : function() {
      videoFunctionalCoreManager.updateKnobAndVideo();
    },
  
    clearAllTimer : function() {
    
    },
    repetPartOfVideo  : function(start,end, numberOfRepetition,speedRate) {
    
     },
    muteButtonCallback : function(e){
    
    }
  }
};*/

var Player = new Player();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyZmFjZVZpZGVvLmpzIl0sIm5hbWVzIjpbImNvbnNvbGUiLCJsb2ciLCJlbnVtX3ZpZGVvcGxhdGZvcm0iLCJNUDQiLCJZT1VUVUJFIiwibWVkaWFwbGF0Zm9ybSIsInZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyIiwiVmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIiLCJQbGF5ZXIiLCJwbGF5UGF1c2VjYWxsYmFjayIsImNvbW1hbmQiLCJ1cGRhdGVUaW1lclZpZGVvIiwiY3JlYXRlTmV3Q2FyZCIsInN0YXJ0UCIsImVuZFAiLCJwbGF5IiwicGxhdXNlIiwicGF1c2UiLCJzZWVrVG8iLCJzdGFydER1cmF0aW9uUGFyYW0iLCJzbGlkZXJUb1ZpZGVvIiwicmVwZXRQYXJ0T2ZWaWRlbyIsInN0YXJ0IiwiZW5kIiwibnVtYmVyT2ZSZXBldGl0aW9uIiwic3BlZWRSYXRlIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxHQUFSLENBQVksa0NBQVo7O0FBR0EsSUFBSUMscUJBQXFCO0FBQ3ZCQyxPQUFLLENBRGtCO0FBRXZCQyxXQUFTO0FBRmMsQ0FBekI7O0FBS0EsSUFBSUMsZ0JBQWdCSCxtQkFBbUJDLEdBQXZDO0FBQ0E7O0FBRUEsSUFBSUcsNkJBQTZCQyw0QkFBakM7O0FBR0EsSUFBSUMsU0FBUyxTQUFUQSxNQUFTLEdBQVc7QUFDdEI7QUFDQSxTQUFPO0FBQ0w7QUFDQUM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBbUIsVUFBU0MsT0FBVCxFQUFrQjtBQUNuQ1YsY0FBUUMsR0FBUixDQUFZLE1BQVo7QUFDQVE7QUFDRCxLQUhELENBRks7O0FBT0xFO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWtCLFlBQVk7QUFDNUJBO0FBQ0QsS0FGRCxDQVBLOztBQVdMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFnQixVQUFVQyxNQUFWLEVBQWlCQyxJQUFqQixFQUF3QjtBQUN0Q0Ysb0JBQWNDLE1BQWQsRUFBcUJDLElBQXJCO0FBQ0YsS0FGQSxDQVhLOztBQWVMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFNLFlBQVk7QUFDaEJBO0FBQ0QsS0FGRCxDQWZLO0FBa0JMQyxZQUFRLGtCQUFZO0FBQ2xCQztBQUNELEtBcEJJO0FBcUJMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFTLFVBQVVDLGtCQUFWLEVBQThCO0FBQ3JDRCxhQUFPQyxrQkFBUDtBQUVELEtBSEQsQ0FyQks7QUF5QkxDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWdCLFVBQVNQLE1BQVQsRUFBaUJDLElBQWpCLEVBQXVCO0FBQ3JDLGFBQU9NLGNBQWNQLE1BQWQsRUFBc0JDLElBQXRCLENBQVA7QUFDRCxLQUZELENBekJLO0FBNEJMTztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFvQixVQUFTQyxLQUFULEVBQWVDLEdBQWYsRUFBb0JDLGtCQUFwQixFQUF1Q0MsU0FBdkMsRUFBa0Q7QUFDcEVKLHVCQUFpQkMsS0FBakIsRUFBdUJDLEdBQXZCLEVBQTRCQyxrQkFBNUIsRUFBK0NDLFNBQS9DO0FBQ0QsS0FGRDs7QUE1QkssR0FBUDtBQWtDRCxDQXBDRDs7QUFzQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0NBLElBQUlqQixTQUFTLElBQUlBLE1BQUosRUFBYiIsImZpbGUiOiJpbnRlcmZhY2VWaWRlby5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUubG9nKFwiKioqIENoYXJnaW5nIGludGVyZmFjZSBWaWRlbyAqKipcIik7XG5cblxudmFyIGVudW1fdmlkZW9wbGF0Zm9ybSA9IHtcbiAgTVA0OiAxLFxuICBZT1VUVUJFOiAyXG59O1xuXG52YXIgbWVkaWFwbGF0Zm9ybSA9IGVudW1fdmlkZW9wbGF0Zm9ybS5NUDQ7XG4vL3ZhciB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlciA9ICBuZXcgUGxheWVyKCk7XG5cbnZhciB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlciA9IFZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyKCk7XG5cblxudmFyIFBsYXllciA9IGZ1bmN0aW9uKCkge1xuICAvL0kgaW1wbGVtZW50ZWQgYSBjb21tYW5kIHBhdHRlcm4sIHNlZSA6IGh0dHBzOi8vd3d3LmRvZmFjdG9yeS5jb20vamF2YXNjcmlwdC9jb21tYW5kLWRlc2lnbi1wYXR0ZXJuXG4gIHJldHVybiB7XG4gICAgLy9leGVjdXRlIGEgY29tbWFuZFxuICAgIHBsYXlQYXVzZWNhbGxiYWNrOiBmdW5jdGlvbihjb21tYW5kKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInRlc3RcIik7XG4gICAgICBwbGF5UGF1c2VjYWxsYmFjaygpO1xuICAgIH0sXG4gIFxuICAgIHVwZGF0ZVRpbWVyVmlkZW86IGZ1bmN0aW9uICgpIHtcbiAgICAgIHVwZGF0ZVRpbWVyVmlkZW8oKTtcbiAgICB9LFxuICBcbiAgICBjcmVhdGVOZXdDYXJkIDogZnVuY3Rpb24gKHN0YXJ0UCxlbmRQICkge1xuICAgICAgY3JlYXRlTmV3Q2FyZChzdGFydFAsZW5kUCk7XG4gICB9LFxuICBcbiAgICBwbGF5OiBmdW5jdGlvbigpICB7XG4gICAgICBwbGF5KCk7XG4gICAgfSxcbiAgICBwbGF1c2U6IGZ1bmN0aW9uKCkgIHtcbiAgICAgIHBhdXNlKCk7XG4gICAgfSxcbiAgICBzZWVrVG8gOiBmdW5jdGlvbiAoc3RhcnREdXJhdGlvblBhcmFtKSB7XG4gICAgICBzZWVrVG8oc3RhcnREdXJhdGlvblBhcmFtKTtcbiAgXG4gICAgfSxcbiAgICBzbGlkZXJUb1ZpZGVvIDogZnVuY3Rpb24oc3RhcnRQLCBlbmRQKSB7XG4gICAgICByZXR1cm4gc2xpZGVyVG9WaWRlbyhzdGFydFAsIGVuZFApO1xuICAgIH0sXG4gICAgcmVwZXRQYXJ0T2ZWaWRlbyAgOiBmdW5jdGlvbihzdGFydCxlbmQsIG51bWJlck9mUmVwZXRpdGlvbixzcGVlZFJhdGUpIHtcbiAgICAgIHJlcGV0UGFydE9mVmlkZW8oc3RhcnQsZW5kLCBudW1iZXJPZlJlcGV0aXRpb24sc3BlZWRSYXRlKSA7XG4gICAgfSxcbiAgXG4gIFxuICB9XG59O1xuXG4vKlxudmFyIFBsYXllciA9IGZ1bmN0aW9uKCkge1xuICAvL1RoaXMgaXMgYSBjb21tYW5kIHBhdHRlcm4sIHNlZSA6IGh0dHBzOi8vd3d3LmRvZmFjdG9yeS5jb20vamF2YXNjcmlwdC9jb21tYW5kLWRlc2lnbi1wYXR0ZXJuXG4gIHJldHVybiB7XG4gIFxuICAgIHBsYXlQYXVzZWNhbGxiYWNrIDogZnVuY3Rpb24oZSkge1xuICAgIFxuICAgIH0sXG4gICAgcGxheTogZnVuY3Rpb24oKSAge1xuICAgICAgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIucGxheSgpO1xuICAgIH0sXG4gICAgcGF1c2UgOiBmdW5jdGlvbiAoKXtcbiAgICAgIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyLnBhdXNlKCk7XG4gICAgfSxcbiAgXG4gICAgc2xpZGVyVG9WaWRlbyA6IGZ1bmN0aW9uKHN0YXJ0UCwgZW5kUCl7XG4gICAgICB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlci5zbGlkZXJUb1ZpZGVvKHN0YXJ0UCwgZW5kUCk7XG4gICAgfSxcbiAgXG4gICAgdXBkYXRlVGltZXJWaWRlbyA6IGZ1bmN0aW9uKCl7XG4gICAgICB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlci51cGRhdGVUaW1lclZpZGVvKCk7XG4gICAgfSxcbiAgXG4gICAgZmVlZGJhY2tPblNsaWRlclZpZGVvIDogZnVuY3Rpb24ob25PZmYpIHtcbiAgICAgIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyLmZlZWRiYWNrT25TbGlkZXJWaWRlbyhvbk9mZik7XG4gICAgfSxcbiAgXG4gICAgdXBkYXRlS25vYkFuZFZpZGVvQ29tcHV0ZXIgOiBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyLnVwZGF0ZUtub2JBbmRWaWRlb0NvbXB1dGVyKCk7XG4gICAgfSxcbiAgXG4gICAgdXBkYXRlS25vYkFuZFZpZGVvIDogZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlci51cGRhdGVLbm9iQW5kVmlkZW8oKTtcbiAgICB9LFxuICBcbiAgICBjbGVhckFsbFRpbWVyIDogZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgfSxcbiAgICByZXBldFBhcnRPZlZpZGVvICA6IGZ1bmN0aW9uKHN0YXJ0LGVuZCwgbnVtYmVyT2ZSZXBldGl0aW9uLHNwZWVkUmF0ZSkge1xuICAgIFxuICAgICB9LFxuICAgIG11dGVCdXR0b25DYWxsYmFjayA6IGZ1bmN0aW9uKGUpe1xuICAgIFxuICAgIH1cbiAgfVxufTsqL1xuXG52YXIgUGxheWVyID0gbmV3IFBsYXllcigpO1xuIl19