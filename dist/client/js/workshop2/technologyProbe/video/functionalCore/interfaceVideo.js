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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyZmFjZVZpZGVvLmpzIl0sIm5hbWVzIjpbImNvbnNvbGUiLCJsb2ciLCJlbnVtX3ZpZGVvcGxhdGZvcm0iLCJNUDQiLCJZT1VUVUJFIiwibWVkaWFwbGF0Zm9ybSIsInZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyIiwiVmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIiLCJQbGF5ZXIiLCJwbGF5UGF1c2VjYWxsYmFjayIsImNvbW1hbmQiLCJ1cGRhdGVUaW1lclZpZGVvIiwiY3JlYXRlTmV3Q2FyZCIsInN0YXJ0UCIsImVuZFAiLCJwbGF5IiwicGxhdXNlIiwicGF1c2UiLCJzZWVrVG8iLCJzdGFydER1cmF0aW9uUGFyYW0iLCJzbGlkZXJUb1ZpZGVvIiwicmVwZXRQYXJ0T2ZWaWRlbyIsInN0YXJ0IiwiZW5kIiwibnVtYmVyT2ZSZXBldGl0aW9uIiwic3BlZWRSYXRlIiwic2V0U291cmNlIiwic291cmNlIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxHQUFSLENBQVksa0NBQVo7O0FBR0EsSUFBSUMscUJBQXFCO0FBQ3ZCQyxPQUFLLENBRGtCO0FBRXZCQyxXQUFTO0FBRmMsQ0FBekI7O0FBS0EsSUFBSUMsZ0JBQWdCSCxtQkFBbUJDLEdBQXZDO0FBQ0E7O0FBRUEsSUFBSUcsNkJBQTZCQyw0QkFBakM7O0FBR0EsSUFBSUMsU0FBUyxTQUFUQSxNQUFTLEdBQVc7O0FBRXRCO0FBQ0EsU0FBTztBQUNMO0FBQ0FDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQW1CLFVBQVNDLE9BQVQsRUFBa0I7QUFDbkNWLGNBQVFDLEdBQVIsQ0FBWSxNQUFaO0FBQ0FRO0FBQ0QsS0FIRCxDQUZLOztBQU9MRTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFrQixZQUFZO0FBQzVCQTtBQUNELEtBRkQsQ0FQSzs7QUFXTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBZ0IsVUFBVUMsTUFBVixFQUFpQkMsSUFBakIsRUFBd0I7QUFDdENGLG9CQUFjQyxNQUFkLEVBQXFCQyxJQUFyQjtBQUNGLEtBRkEsQ0FYSzs7QUFlTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBTSxZQUFZO0FBQ2hCQTtBQUNELEtBRkQsQ0FmSztBQWtCTEMsWUFBUSxrQkFBWTtBQUNsQkM7QUFDRCxLQXBCSTtBQXFCTEM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBUyxVQUFVQyxrQkFBVixFQUE4QjtBQUNyQ0QsYUFBT0Msa0JBQVA7QUFFRCxLQUhELENBckJLO0FBeUJMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFnQixVQUFTUCxNQUFULEVBQWlCQyxJQUFqQixFQUF1QjtBQUNyQyxhQUFPTSxjQUFjUCxNQUFkLEVBQXNCQyxJQUF0QixDQUFQO0FBQ0QsS0FGRCxDQXpCSztBQTRCTE87QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBb0IsVUFBU0MsS0FBVCxFQUFlQyxHQUFmLEVBQW9CQyxrQkFBcEIsRUFBdUNDLFNBQXZDLEVBQWtEO0FBQ3BFSix1QkFBaUJDLEtBQWpCLEVBQXVCQyxHQUF2QixFQUE0QkMsa0JBQTVCLEVBQStDQyxTQUEvQztBQUNELEtBRkQsQ0E1Qks7O0FBZ0NMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFhLFVBQVNDLE1BQVQsRUFBaUI7QUFDNUJELGdCQUFVQyxNQUFWO0FBQ0QsS0FGRDs7QUFoQ0ssR0FBUDtBQXNDRCxDQXpDRDs7QUEyQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0NBLElBQUluQixTQUFTLElBQUlBLE1BQUosRUFBYiIsImZpbGUiOiJpbnRlcmZhY2VWaWRlby5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUubG9nKFwiKioqIENoYXJnaW5nIGludGVyZmFjZSBWaWRlbyAqKipcIik7XG5cblxudmFyIGVudW1fdmlkZW9wbGF0Zm9ybSA9IHtcbiAgTVA0OiAxLFxuICBZT1VUVUJFOiAyXG59O1xuXG52YXIgbWVkaWFwbGF0Zm9ybSA9IGVudW1fdmlkZW9wbGF0Zm9ybS5NUDQ7XG4vL3ZhciB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlciA9ICBuZXcgUGxheWVyKCk7XG5cbnZhciB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlciA9IFZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyKCk7XG5cblxudmFyIFBsYXllciA9IGZ1bmN0aW9uKCkge1xuICBcbiAgLy9JIGltcGxlbWVudGVkIGEgY29tbWFuZCBwYXR0ZXJuLCBzZWUgOiBodHRwczovL3d3dy5kb2ZhY3RvcnkuY29tL2phdmFzY3JpcHQvY29tbWFuZC1kZXNpZ24tcGF0dGVyblxuICByZXR1cm4ge1xuICAgIC8vZXhlY3V0ZSBhIGNvbW1hbmRcbiAgICBwbGF5UGF1c2VjYWxsYmFjazogZnVuY3Rpb24oY29tbWFuZCkge1xuICAgICAgY29uc29sZS5sb2coXCJ0ZXN0XCIpO1xuICAgICAgcGxheVBhdXNlY2FsbGJhY2soKTtcbiAgICB9LFxuICBcbiAgICB1cGRhdGVUaW1lclZpZGVvOiBmdW5jdGlvbiAoKSB7XG4gICAgICB1cGRhdGVUaW1lclZpZGVvKCk7XG4gICAgfSxcbiAgXG4gICAgY3JlYXRlTmV3Q2FyZCA6IGZ1bmN0aW9uIChzdGFydFAsZW5kUCApIHtcbiAgICAgIGNyZWF0ZU5ld0NhcmQoc3RhcnRQLGVuZFApO1xuICAgfSxcbiAgXG4gICAgcGxheTogZnVuY3Rpb24oKSAge1xuICAgICAgcGxheSgpO1xuICAgIH0sXG4gICAgcGxhdXNlOiBmdW5jdGlvbigpICB7XG4gICAgICBwYXVzZSgpO1xuICAgIH0sXG4gICAgc2Vla1RvIDogZnVuY3Rpb24gKHN0YXJ0RHVyYXRpb25QYXJhbSkge1xuICAgICAgc2Vla1RvKHN0YXJ0RHVyYXRpb25QYXJhbSk7XG4gIFxuICAgIH0sXG4gICAgc2xpZGVyVG9WaWRlbyA6IGZ1bmN0aW9uKHN0YXJ0UCwgZW5kUCkge1xuICAgICAgcmV0dXJuIHNsaWRlclRvVmlkZW8oc3RhcnRQLCBlbmRQKTtcbiAgICB9LFxuICAgIHJlcGV0UGFydE9mVmlkZW8gIDogZnVuY3Rpb24oc3RhcnQsZW5kLCBudW1iZXJPZlJlcGV0aXRpb24sc3BlZWRSYXRlKSB7XG4gICAgICByZXBldFBhcnRPZlZpZGVvKHN0YXJ0LGVuZCwgbnVtYmVyT2ZSZXBldGl0aW9uLHNwZWVkUmF0ZSkgO1xuICAgIH0sXG4gIFxuICAgIHNldFNvdXJjZSAgOiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIHNldFNvdXJjZShzb3VyY2UpIDtcbiAgICB9LFxuICBcbiAgXG4gIH1cbn07XG5cbi8qXG52YXIgUGxheWVyID0gZnVuY3Rpb24oKSB7XG4gIC8vVGhpcyBpcyBhIGNvbW1hbmQgcGF0dGVybiwgc2VlIDogaHR0cHM6Ly93d3cuZG9mYWN0b3J5LmNvbS9qYXZhc2NyaXB0L2NvbW1hbmQtZGVzaWduLXBhdHRlcm5cbiAgcmV0dXJuIHtcbiAgXG4gICAgcGxheVBhdXNlY2FsbGJhY2sgOiBmdW5jdGlvbihlKSB7XG4gICAgXG4gICAgfSxcbiAgICBwbGF5OiBmdW5jdGlvbigpICB7XG4gICAgICB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlci5wbGF5KCk7XG4gICAgfSxcbiAgICBwYXVzZSA6IGZ1bmN0aW9uICgpe1xuICAgICAgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIucGF1c2UoKTtcbiAgICB9LFxuICBcbiAgICBzbGlkZXJUb1ZpZGVvIDogZnVuY3Rpb24oc3RhcnRQLCBlbmRQKXtcbiAgICAgIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyLnNsaWRlclRvVmlkZW8oc3RhcnRQLCBlbmRQKTtcbiAgICB9LFxuICBcbiAgICB1cGRhdGVUaW1lclZpZGVvIDogZnVuY3Rpb24oKXtcbiAgICAgIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyLnVwZGF0ZVRpbWVyVmlkZW8oKTtcbiAgICB9LFxuICBcbiAgICBmZWVkYmFja09uU2xpZGVyVmlkZW8gOiBmdW5jdGlvbihvbk9mZikge1xuICAgICAgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIuZmVlZGJhY2tPblNsaWRlclZpZGVvKG9uT2ZmKTtcbiAgICB9LFxuICBcbiAgICB1cGRhdGVLbm9iQW5kVmlkZW9Db21wdXRlciA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIudXBkYXRlS25vYkFuZFZpZGVvQ29tcHV0ZXIoKTtcbiAgICB9LFxuICBcbiAgICB1cGRhdGVLbm9iQW5kVmlkZW8gOiBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyLnVwZGF0ZUtub2JBbmRWaWRlbygpO1xuICAgIH0sXG4gIFxuICAgIGNsZWFyQWxsVGltZXIgOiBmdW5jdGlvbigpIHtcbiAgICBcbiAgICB9LFxuICAgIHJlcGV0UGFydE9mVmlkZW8gIDogZnVuY3Rpb24oc3RhcnQsZW5kLCBudW1iZXJPZlJlcGV0aXRpb24sc3BlZWRSYXRlKSB7XG4gICAgXG4gICAgIH0sXG4gICAgbXV0ZUJ1dHRvbkNhbGxiYWNrIDogZnVuY3Rpb24oZSl7XG4gICAgXG4gICAgfVxuICB9XG59OyovXG5cbnZhciBQbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG4iXX0=