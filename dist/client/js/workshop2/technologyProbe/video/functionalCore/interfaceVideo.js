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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyZmFjZVZpZGVvLmpzIl0sIm5hbWVzIjpbImNvbnNvbGUiLCJsb2ciLCJlbnVtX3ZpZGVvcGxhdGZvcm0iLCJNUDQiLCJZT1VUVUJFIiwibWVkaWFwbGF0Zm9ybSIsInZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyIiwiVmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIiLCJQbGF5ZXIiLCJwbGF5UGF1c2VjYWxsYmFjayIsImNvbW1hbmQiLCJ1cGRhdGVUaW1lclZpZGVvIiwiY3JlYXRlTmV3Q2FyZCIsInN0YXJ0UCIsImVuZFAiLCJwbGF5IiwicGxhdXNlIiwicGF1c2UiLCJzZWVrVG8iLCJzdGFydER1cmF0aW9uUGFyYW0iLCJzbGlkZXJUb1ZpZGVvIiwicmVwZXRQYXJ0T2ZWaWRlbyIsInN0YXJ0IiwiZW5kIiwibnVtYmVyT2ZSZXBldGl0aW9uIiwic3BlZWRSYXRlIiwic2V0U291cmNlIiwic291cmNlIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxHQUFSLENBQVksa0NBQVo7O0FBR0EsSUFBSUMscUJBQXFCO0FBQ3ZCQyxPQUFLLENBRGtCO0FBRXZCQyxXQUFTO0FBRmMsQ0FBekI7O0FBS0EsSUFBSUMsZ0JBQWdCSCxtQkFBbUJDLEdBQXZDO0FBQ0E7O0FBRUEsSUFBSUcsNkJBQTZCQyw0QkFBakM7O0FBR0EsSUFBSUMsU0FBUyxTQUFUQSxNQUFTLEdBQVc7QUFDdEI7QUFDQSxTQUFPO0FBQ0w7QUFDQUM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsTUFBbUIsVUFBU0MsT0FBVCxFQUFrQjtBQUNuQ1YsY0FBUUMsR0FBUixDQUFZLE1BQVo7QUFDQVE7QUFDRCxLQUhELENBRks7O0FBT0xFO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWtCLFlBQVk7QUFDNUJBO0FBQ0QsS0FGRCxDQVBLOztBQVdMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFnQixVQUFVQyxNQUFWLEVBQWlCQyxJQUFqQixFQUF3QjtBQUN0Q0Ysb0JBQWNDLE1BQWQsRUFBcUJDLElBQXJCO0FBQ0YsS0FGQSxDQVhLOztBQWVMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFNLFlBQVk7QUFDaEJBO0FBQ0QsS0FGRCxDQWZLO0FBa0JMQyxZQUFRLGtCQUFZO0FBQ2xCQztBQUNELEtBcEJJO0FBcUJMQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFTLFVBQVVDLGtCQUFWLEVBQThCO0FBQ3JDRCxhQUFPQyxrQkFBUDtBQUVELEtBSEQsQ0FyQks7QUF5QkxDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWdCLFVBQVNQLE1BQVQsRUFBaUJDLElBQWpCLEVBQXVCO0FBQ3JDLGFBQU9NLGNBQWNQLE1BQWQsRUFBc0JDLElBQXRCLENBQVA7QUFDRCxLQUZELENBekJLO0FBNEJMTztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxNQUFvQixVQUFTQyxLQUFULEVBQWVDLEdBQWYsRUFBb0JDLGtCQUFwQixFQUF1Q0MsU0FBdkMsRUFBa0Q7QUFDcEVKLHVCQUFpQkMsS0FBakIsRUFBdUJDLEdBQXZCLEVBQTRCQyxrQkFBNUIsRUFBK0NDLFNBQS9DO0FBQ0QsS0FGRCxDQTVCSzs7QUFnQ0xDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE1BQWEsVUFBU0MsTUFBVCxFQUFpQjtBQUM1QkQsZ0JBQVVDLE1BQVY7QUFDRCxLQUZEOztBQWhDSyxHQUFQO0FBcUNELENBdkNEOztBQXlDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQ0EsSUFBSW5CLFNBQVMsSUFBSUEsTUFBSixFQUFiIiwiZmlsZSI6ImludGVyZmFjZVZpZGVvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc29sZS5sb2coXCIqKiogQ2hhcmdpbmcgaW50ZXJmYWNlIFZpZGVvICoqKlwiKTtcblxuXG52YXIgZW51bV92aWRlb3BsYXRmb3JtID0ge1xuICBNUDQ6IDEsXG4gIFlPVVRVQkU6IDJcbn07XG5cbnZhciBtZWRpYXBsYXRmb3JtID0gZW51bV92aWRlb3BsYXRmb3JtLk1QNDtcbi8vdmFyIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyID0gIG5ldyBQbGF5ZXIoKTtcblxudmFyIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyID0gVmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIoKTtcblxuXG52YXIgUGxheWVyID0gZnVuY3Rpb24oKSB7XG4gIC8vSSBpbXBsZW1lbnRlZCBhIGNvbW1hbmQgcGF0dGVybiwgc2VlIDogaHR0cHM6Ly93d3cuZG9mYWN0b3J5LmNvbS9qYXZhc2NyaXB0L2NvbW1hbmQtZGVzaWduLXBhdHRlcm5cbiAgcmV0dXJuIHtcbiAgICAvL2V4ZWN1dGUgYSBjb21tYW5kXG4gICAgcGxheVBhdXNlY2FsbGJhY2s6IGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwidGVzdFwiKTtcbiAgICAgIHBsYXlQYXVzZWNhbGxiYWNrKCk7XG4gICAgfSxcbiAgXG4gICAgdXBkYXRlVGltZXJWaWRlbzogZnVuY3Rpb24gKCkge1xuICAgICAgdXBkYXRlVGltZXJWaWRlbygpO1xuICAgIH0sXG4gIFxuICAgIGNyZWF0ZU5ld0NhcmQgOiBmdW5jdGlvbiAoc3RhcnRQLGVuZFAgKSB7XG4gICAgICBjcmVhdGVOZXdDYXJkKHN0YXJ0UCxlbmRQKTtcbiAgIH0sXG4gIFxuICAgIHBsYXk6IGZ1bmN0aW9uKCkgIHtcbiAgICAgIHBsYXkoKTtcbiAgICB9LFxuICAgIHBsYXVzZTogZnVuY3Rpb24oKSAge1xuICAgICAgcGF1c2UoKTtcbiAgICB9LFxuICAgIHNlZWtUbyA6IGZ1bmN0aW9uIChzdGFydER1cmF0aW9uUGFyYW0pIHtcbiAgICAgIHNlZWtUbyhzdGFydER1cmF0aW9uUGFyYW0pO1xuICBcbiAgICB9LFxuICAgIHNsaWRlclRvVmlkZW8gOiBmdW5jdGlvbihzdGFydFAsIGVuZFApIHtcbiAgICAgIHJldHVybiBzbGlkZXJUb1ZpZGVvKHN0YXJ0UCwgZW5kUCk7XG4gICAgfSxcbiAgICByZXBldFBhcnRPZlZpZGVvICA6IGZ1bmN0aW9uKHN0YXJ0LGVuZCwgbnVtYmVyT2ZSZXBldGl0aW9uLHNwZWVkUmF0ZSkge1xuICAgICAgcmVwZXRQYXJ0T2ZWaWRlbyhzdGFydCxlbmQsIG51bWJlck9mUmVwZXRpdGlvbixzcGVlZFJhdGUpIDtcbiAgICB9LFxuICBcbiAgICBzZXRTb3VyY2UgIDogZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBzZXRTb3VyY2Uoc291cmNlKSA7XG4gICAgfVxuICBcbiAgfVxufTtcblxuLypcbnZhciBQbGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgLy9UaGlzIGlzIGEgY29tbWFuZCBwYXR0ZXJuLCBzZWUgOiBodHRwczovL3d3dy5kb2ZhY3RvcnkuY29tL2phdmFzY3JpcHQvY29tbWFuZC1kZXNpZ24tcGF0dGVyblxuICByZXR1cm4ge1xuICBcbiAgICBwbGF5UGF1c2VjYWxsYmFjayA6IGZ1bmN0aW9uKGUpIHtcbiAgICBcbiAgICB9LFxuICAgIHBsYXk6IGZ1bmN0aW9uKCkgIHtcbiAgICAgIHZpZGVvRnVuY3Rpb25hbENvcmVNYW5hZ2VyLnBsYXkoKTtcbiAgICB9LFxuICAgIHBhdXNlIDogZnVuY3Rpb24gKCl7XG4gICAgICB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlci5wYXVzZSgpO1xuICAgIH0sXG4gIFxuICAgIHNsaWRlclRvVmlkZW8gOiBmdW5jdGlvbihzdGFydFAsIGVuZFApe1xuICAgICAgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIuc2xpZGVyVG9WaWRlbyhzdGFydFAsIGVuZFApO1xuICAgIH0sXG4gIFxuICAgIHVwZGF0ZVRpbWVyVmlkZW8gOiBmdW5jdGlvbigpe1xuICAgICAgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIudXBkYXRlVGltZXJWaWRlbygpO1xuICAgIH0sXG4gIFxuICAgIGZlZWRiYWNrT25TbGlkZXJWaWRlbyA6IGZ1bmN0aW9uKG9uT2ZmKSB7XG4gICAgICB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlci5mZWVkYmFja09uU2xpZGVyVmlkZW8ob25PZmYpO1xuICAgIH0sXG4gIFxuICAgIHVwZGF0ZUtub2JBbmRWaWRlb0NvbXB1dGVyIDogZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlb0Z1bmN0aW9uYWxDb3JlTWFuYWdlci51cGRhdGVLbm9iQW5kVmlkZW9Db21wdXRlcigpO1xuICAgIH0sXG4gIFxuICAgIHVwZGF0ZUtub2JBbmRWaWRlbyA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmlkZW9GdW5jdGlvbmFsQ29yZU1hbmFnZXIudXBkYXRlS25vYkFuZFZpZGVvKCk7XG4gICAgfSxcbiAgXG4gICAgY2xlYXJBbGxUaW1lciA6IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIH0sXG4gICAgcmVwZXRQYXJ0T2ZWaWRlbyAgOiBmdW5jdGlvbihzdGFydCxlbmQsIG51bWJlck9mUmVwZXRpdGlvbixzcGVlZFJhdGUpIHtcbiAgICBcbiAgICAgfSxcbiAgICBtdXRlQnV0dG9uQ2FsbGJhY2sgOiBmdW5jdGlvbihlKXtcbiAgICBcbiAgICB9XG4gIH1cbn07Ki9cblxudmFyIFBsYXllciA9IG5ldyBQbGF5ZXIoKTtcbiJdfQ==