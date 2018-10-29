"use strict";

var video = document.getElementById("videoEAT");
var speedrate = 1;
// Buttons
var playButton = document.getElementById("play-pause");
var muteButton = document.getElementById("mute");
// Sliders
var knobMin = document.getElementById("range-slider_handle-min");
var rangeSliderTrack = document.getElementById("rangeSliderTrack");

var divCardBoard = document.getElementById("divCardBoard");
var body = document.getElementsByTagName("BODY")[0];

var videoIsPlaying = 1;

//var volumeBar = document.getElementById("volume-bar");

//On load of the page


window.addEventListener("load", function () {
  setTimeout(function () {
    // This hides the address bar:
    video.load();
    window.scrollTo(0, 1);

    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
      if (ua.indexOf('chrome') > -1) {
        //video.src = "./public/media/EAT3.webm";
      } else {
        //alert("2") // Safari
        console.log("test safari");
        video.src = "../../../public/media/workshop2/EAT3.mp4";
        console.log("test safari : " + video.src);
        video.load();
      }
    }
  }, 0);
});
window.addEventListener("scroll", function (event) {
  topWindow = this.scrollY;
  leftWindow = this.scrollX;
  // console.log("window scroll : " + leftWindow);
}, false);

body.addEventListener("scroll", function (event) {
  topBody = this.scrollY;
  leftBody = this.scrollX;
  //console.log(" body : "+  body.scrollLeft  );
}, false);

/*Callback used*/
var muteButtonCallback = function muteButtonCallback(e) {
  if (video.muted === false) {
    // Mute the video
    video.muted = true;
    // Update the button text
    muteButton.innerHTML = "Unmute";
  } else {
    // Unmute the video
    video.muted = false;
    this.src = "/media/workshop2/videoCommand/volumeFull.png";
    // Update the button text
    muteButton.innerHTML = "Mute";
  }
};

var repetPartOfVideo = function repetPartOfVideo(start, end, numberOfRepetition, speedRate) {
  console.log("function  - repetPartOfVideo");
  isPlayingCard = true;
  video.playbackRate = speedRate;
  video.currentTime = start;
  var repet = numberOfRepetition;

  video.ontimeupdate = function () {
    if (isPlayingCard) {
      if (end > start && repet > 0) {
        if (video.currentTime > end) {
          repet--;
          video.currentTime = start;
          console.log("function  - repetPartOfVideo [play part] l87 videoCommand");
          play();
        }
      } else {
        video.ontimeupdate = null;
        feedbackOnSliderVideo(false);
        video.playbackRate = 1;
      }
    }
  };
};

function clearAllTimer() {
  window.clearInterval(timerRepetition);
  isPlayingCard = false;
  video.playbackRate = 1;
  feedbackOnSliderVideo(false);
}

var play = function play() {
  console.log("appel a play");
  /* var playPromise = document.getElementById('videoEAT').play();
  // In browsers that don’t yet support this functionality,
  // playPromise won’t be defined.
   if (playPromise !== undefined) {
     playPromise.then(function() {
       document.querySelector('videoEAT').play();
       playButton.src = '/media/workshop2/videoCommand/pauseButton.png';
       // Automatic playback started!
     }).catch(function(error) {
       // Automatic playback failed.
       // Show a UI element to let the user manually start playback.
       console.log("error : " + error);
     });
   }*/

  /* if (video.paused || video.ended ) {
     video.play();
     playButton.src = '/media/workshop2/videoCommand/pauseButton.png';
   }*/
  setTimeout(function () {
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(function (value) {
        video.play();
        playButton.src = '/media/workshop2/videoCommand/pauseButton.png';
      }).catch(function (e) {
        console.log(e);
        video.load();
        //video.pause();
      });
    }
  }, 250);
  /* var playPromise = video.play();
  // In browsers that don’t yet support this functionality,
  // playPromise won’t be defined.
   if (playPromise !== undefined) {
     playPromise.then(function() {
       // Automatic playback started!
       video.play();
       playButton.src = '/media/workshop2/videoCommand/pauseButton.png';
     }).catch(function(error) {
       console.log(e);
       video.load();
       //video.pause();
       // Automatic playback failed.
       // Show a UI element to let the user manually start playback.
     });
   }*/

  // video.play();
};

var pause = function pause() {
  console.log("appel a pause");
  video.pause();
  playButton.src = '/media/workshop2/videoCommand/playButton.png';
};

var playPausecallback = function playPausecallback(e) {
  console.log("callback play-pause");
  e.preventDefault();
  event.preventDefault();
  /*videoIsPlaying += 1;
  videoIsPlaying %= 2;
  console.log("videoIsPlaying :  " + videoIsPlaying);
  
  if (!videoIsPlaying) {
    console.log("play");
    
    play();
    //setTimeout(play(),250);
  } else {
    console.log("pause");
    
    pause();
    //setTimeout(pause(),250);
  }
  */

  if (video.paused || video.ended) {
    play();
    //setTimeout(play(),250);
  } else {

    pause();
    //setTimeout(pause(),250);
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZGVvQ29tbWFuZC5qcyJdLCJuYW1lcyI6WyJ2aWRlbyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzcGVlZHJhdGUiLCJwbGF5QnV0dG9uIiwibXV0ZUJ1dHRvbiIsImtub2JNaW4iLCJyYW5nZVNsaWRlclRyYWNrIiwiZGl2Q2FyZEJvYXJkIiwiYm9keSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwidmlkZW9Jc1BsYXlpbmciLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwic2V0VGltZW91dCIsImxvYWQiLCJzY3JvbGxUbyIsInVhIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwiY29uc29sZSIsImxvZyIsInNyYyIsImV2ZW50IiwidG9wV2luZG93Iiwic2Nyb2xsWSIsImxlZnRXaW5kb3ciLCJzY3JvbGxYIiwidG9wQm9keSIsImxlZnRCb2R5IiwibXV0ZUJ1dHRvbkNhbGxiYWNrIiwiZSIsIm11dGVkIiwiaW5uZXJIVE1MIiwicmVwZXRQYXJ0T2ZWaWRlbyIsInN0YXJ0IiwiZW5kIiwibnVtYmVyT2ZSZXBldGl0aW9uIiwic3BlZWRSYXRlIiwiaXNQbGF5aW5nQ2FyZCIsInBsYXliYWNrUmF0ZSIsImN1cnJlbnRUaW1lIiwicmVwZXQiLCJvbnRpbWV1cGRhdGUiLCJwbGF5IiwiZmVlZGJhY2tPblNsaWRlclZpZGVvIiwiY2xlYXJBbGxUaW1lciIsImNsZWFySW50ZXJ2YWwiLCJ0aW1lclJlcGV0aXRpb24iLCJwbGF5UHJvbWlzZSIsInVuZGVmaW5lZCIsInRoZW4iLCJ2YWx1ZSIsImNhdGNoIiwicGF1c2UiLCJwbGF5UGF1c2VjYWxsYmFjayIsInByZXZlbnREZWZhdWx0IiwicGF1c2VkIiwiZW5kZWQiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsU0FBU0MsY0FBVCxDQUF3QixVQUF4QixDQUFaO0FBQ0EsSUFBSUMsWUFBWSxDQUFoQjtBQUNBO0FBQ0EsSUFBSUMsYUFBYUgsU0FBU0MsY0FBVCxDQUF3QixZQUF4QixDQUFqQjtBQUNBLElBQUlHLGFBQWFKLFNBQVNDLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBakI7QUFDQTtBQUNBLElBQUlJLFVBQVVMLFNBQVNDLGNBQVQsQ0FBd0IseUJBQXhCLENBQWQ7QUFDQSxJQUFJSyxtQkFBbUJOLFNBQVNDLGNBQVQsQ0FBd0Isa0JBQXhCLENBQXZCOztBQUVBLElBQUlNLGVBQWVQLFNBQVNDLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBbkI7QUFDQSxJQUFJTyxPQUFPUixTQUFTUyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUFYOztBQUVBLElBQUlDLGlCQUFpQixDQUFyQjs7QUFFQTs7QUFFQTs7O0FBR0FDLE9BQU9DLGdCQUFQLENBQXdCLE1BQXhCLEVBQStCLFlBQVc7QUFDeENDLGFBQVcsWUFBVTtBQUNuQjtBQUNBZCxVQUFNZSxJQUFOO0FBQ0FILFdBQU9JLFFBQVAsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkI7O0FBRUEsUUFBSUMsS0FBS0MsVUFBVUMsU0FBVixDQUFvQkMsV0FBcEIsRUFBVDtBQUNBLFFBQUlILEdBQUdJLE9BQUgsQ0FBVyxRQUFYLEtBQXdCLENBQUMsQ0FBN0IsRUFBZ0M7QUFDOUIsVUFBSUosR0FBR0ksT0FBSCxDQUFXLFFBQVgsSUFBdUIsQ0FBQyxDQUE1QixFQUErQjtBQUM3QjtBQUNELE9BRkQsTUFFTztBQUNMO0FBQ0FDLGdCQUFRQyxHQUFSLENBQVksYUFBWjtBQUNBdkIsY0FBTXdCLEdBQU4sR0FBWSwwQ0FBWjtBQUNBRixnQkFBUUMsR0FBUixDQUFZLG1CQUFtQnZCLE1BQU13QixHQUFyQztBQUNBeEIsY0FBTWUsSUFBTjtBQUNEO0FBQ0Y7QUFDRixHQWpCRCxFQWlCRyxDQWpCSDtBQWtCRCxDQW5CRDtBQW9CQUgsT0FBT0MsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsVUFBU1ksS0FBVCxFQUFnQjtBQUMvQ0MsY0FBWSxLQUFLQyxPQUFqQjtBQUNBQyxlQUFZLEtBQUtDLE9BQWpCO0FBQ0Q7QUFDRCxDQUpELEVBSUcsS0FKSDs7QUFNQXBCLEtBQUtJLGdCQUFMLENBQXNCLFFBQXRCLEVBQWdDLFVBQVNZLEtBQVQsRUFBZ0I7QUFDN0NLLFlBQVcsS0FBS0gsT0FBaEI7QUFDQUksYUFBVyxLQUFLRixPQUFoQjtBQUNBO0FBQ0YsQ0FKRCxFQUlHLEtBSkg7O0FBUUE7QUFDQSxJQUFJRyxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFTQyxDQUFULEVBQVc7QUFDbEMsTUFBSWpDLE1BQU1rQyxLQUFOLEtBQWdCLEtBQXBCLEVBQTJCO0FBQ3pCO0FBQ0FsQyxVQUFNa0MsS0FBTixHQUFjLElBQWQ7QUFDQTtBQUNBN0IsZUFBVzhCLFNBQVgsR0FBdUIsUUFBdkI7QUFDRCxHQUxELE1BS087QUFDTDtBQUNBbkMsVUFBTWtDLEtBQU4sR0FBYyxLQUFkO0FBQ0EsU0FBS1YsR0FBTCxHQUFTLDhDQUFUO0FBQ0E7QUFDQW5CLGVBQVc4QixTQUFYLEdBQXVCLE1BQXZCO0FBQ0Q7QUFDRixDQWJEOztBQWVBLElBQUlDLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQVVDLEtBQVYsRUFBZ0JDLEdBQWhCLEVBQXFCQyxrQkFBckIsRUFBd0NDLFNBQXhDLEVBQW1EO0FBQ3hFbEIsVUFBUUMsR0FBUixDQUFZLDhCQUFaO0FBQ0FrQixrQkFBZ0IsSUFBaEI7QUFDQXpDLFFBQU0wQyxZQUFOLEdBQXFCRixTQUFyQjtBQUNBeEMsUUFBTTJDLFdBQU4sR0FBb0JOLEtBQXBCO0FBQ0EsTUFBSU8sUUFBUUwsa0JBQVo7O0FBRUF2QyxRQUFNNkMsWUFBTixHQUFxQixZQUFXO0FBQzlCLFFBQUdKLGFBQUgsRUFBaUI7QUFDZixVQUFLSCxNQUFNRCxLQUFQLElBQW1CTyxRQUFRLENBQS9CLEVBQW1DO0FBQ2pDLFlBQUk1QyxNQUFNMkMsV0FBTixHQUFvQkwsR0FBeEIsRUFBNkI7QUFDM0JNO0FBQ0E1QyxnQkFBTTJDLFdBQU4sR0FBb0JOLEtBQXBCO0FBQ0VmLGtCQUFRQyxHQUFSLENBQVksMkRBQVo7QUFDQXVCO0FBQ0g7QUFDRixPQVBELE1BT087QUFDTDlDLGNBQU02QyxZQUFOLEdBQXFCLElBQXJCO0FBQ0FFLDhCQUFzQixLQUF0QjtBQUNBL0MsY0FBTTBDLFlBQU4sR0FBcUIsQ0FBckI7QUFDRDtBQUNGO0FBQ0YsR0FmRDtBQWdCRCxDQXZCRDs7QUF5QkEsU0FBU00sYUFBVCxHQUF5QjtBQUN2QnBDLFNBQU9xQyxhQUFQLENBQXFCQyxlQUFyQjtBQUNBVCxrQkFBZ0IsS0FBaEI7QUFDQXpDLFFBQU0wQyxZQUFOLEdBQXFCLENBQXJCO0FBQ0FLLHdCQUFzQixLQUF0QjtBQUNEOztBQUdELElBQUlELE9BQU8sU0FBUEEsSUFBTyxHQUFZO0FBQ3JCeEIsVUFBUUMsR0FBUixDQUFZLGNBQVo7QUFDRDs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7Ozs7QUFJQ1QsYUFBVyxZQUFZO0FBQ3JCLFFBQUlxQyxjQUFjbkQsTUFBTThDLElBQU4sRUFBbEI7QUFDQSxRQUFJSyxnQkFBZ0JDLFNBQXBCLEVBQStCO0FBQzdCRCxrQkFBWUUsSUFBWixDQUFpQixVQUFVQyxLQUFWLEVBQWlCO0FBQ2hDdEQsY0FBTThDLElBQU47QUFDQTFDLG1CQUFXb0IsR0FBWCxHQUFpQiwrQ0FBakI7QUFDRCxPQUhELEVBR0crQixLQUhILENBR1MsVUFBVXRCLENBQVYsRUFBYTtBQUNwQlgsZ0JBQVFDLEdBQVIsQ0FBWVUsQ0FBWjtBQUNBakMsY0FBTWUsSUFBTjtBQUNBO0FBQ0QsT0FQRDtBQVNEO0FBQ0YsR0FiRCxFQWFFLEdBYkY7QUFjRDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkE7QUFDQSxDQXRERDs7QUF3REEsSUFBSXlDLFFBQVEsU0FBUkEsS0FBUSxHQUFZO0FBQ3RCbEMsVUFBUUMsR0FBUixDQUFZLGVBQVo7QUFDQXZCLFFBQU13RCxLQUFOO0FBQ0FwRCxhQUFXb0IsR0FBWCxHQUFlLDhDQUFmO0FBQ0QsQ0FKRDs7QUFNQSxJQUFJaUMsb0JBQW9CLFNBQXBCQSxpQkFBb0IsQ0FBU3hCLENBQVQsRUFBVztBQUNqQ1gsVUFBUUMsR0FBUixDQUFZLHFCQUFaO0FBQ0FVLElBQUV5QixjQUFGO0FBQ0FqQyxRQUFNaUMsY0FBTjtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxNQUFJMUQsTUFBTTJELE1BQU4sSUFBZ0IzRCxNQUFNNEQsS0FBMUIsRUFBa0M7QUFDOUJkO0FBQ0E7QUFDRCxHQUhILE1BR1M7O0FBRUxVO0FBQ0E7QUFDRDtBQUdKLENBL0JEIiwiZmlsZSI6InZpZGVvQ29tbWFuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB2aWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmlkZW9FQVRcIik7XG52YXIgc3BlZWRyYXRlID0gMTtcbi8vIEJ1dHRvbnNcbnZhciBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LXBhdXNlXCIpO1xudmFyIG11dGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm11dGVcIik7XG4vLyBTbGlkZXJzXG52YXIga25vYk1pbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZ2Utc2xpZGVyX2hhbmRsZS1taW5cIik7XG52YXIgcmFuZ2VTbGlkZXJUcmFjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZ2VTbGlkZXJUcmFja1wiKTtcblxudmFyIGRpdkNhcmRCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGl2Q2FyZEJvYXJkXCIpO1xudmFyIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIkJPRFlcIilbMF07XG5cbnZhciB2aWRlb0lzUGxheWluZyA9IDE7XG5cbi8vdmFyIHZvbHVtZUJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidm9sdW1lLWJhclwiKTtcblxuLy9PbiBsb2FkIG9mIHRoZSBwYWdlXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZnVuY3Rpb24oKSB7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAvLyBUaGlzIGhpZGVzIHRoZSBhZGRyZXNzIGJhcjpcbiAgICB2aWRlby5sb2FkKCk7XG4gICAgd2luZG93LnNjcm9sbFRvKDAsIDEpO1xuICBcbiAgICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKHVhLmluZGV4T2YoJ3NhZmFyaScpICE9IC0xKSB7XG4gICAgICBpZiAodWEuaW5kZXhPZignY2hyb21lJykgPiAtMSkge1xuICAgICAgICAvL3ZpZGVvLnNyYyA9IFwiLi9wdWJsaWMvbWVkaWEvRUFUMy53ZWJtXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2FsZXJ0KFwiMlwiKSAvLyBTYWZhcmlcbiAgICAgICAgY29uc29sZS5sb2coXCJ0ZXN0IHNhZmFyaVwiKTtcbiAgICAgICAgdmlkZW8uc3JjID0gXCIuLi8uLi8uLi9wdWJsaWMvbWVkaWEvd29ya3Nob3AyL0VBVDMubXA0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidGVzdCBzYWZhcmkgOiBcIiArIHZpZGVvLnNyYyk7XG4gICAgICAgIHZpZGVvLmxvYWQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIDApO1xufSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBmdW5jdGlvbihldmVudCkge1xuICAgdG9wV2luZG93ID0gdGhpcy5zY3JvbGxZO1xuICAgbGVmdFdpbmRvdyA9dGhpcy5zY3JvbGxYO1xuICAvLyBjb25zb2xlLmxvZyhcIndpbmRvdyBzY3JvbGwgOiBcIiArIGxlZnRXaW5kb3cpO1xufSwgZmFsc2UpO1xuXG5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgIHRvcEJvZHkgPSAgdGhpcy5zY3JvbGxZO1xuICAgbGVmdEJvZHkgPSB0aGlzLnNjcm9sbFg7XG4gICAvL2NvbnNvbGUubG9nKFwiIGJvZHkgOiBcIisgIGJvZHkuc2Nyb2xsTGVmdCAgKTtcbn0sIGZhbHNlKTtcblxuXG5cbi8qQ2FsbGJhY2sgdXNlZCovXG52YXIgbXV0ZUJ1dHRvbkNhbGxiYWNrID0gZnVuY3Rpb24oZSl7XG4gIGlmICh2aWRlby5tdXRlZCA9PT0gZmFsc2UpIHtcbiAgICAvLyBNdXRlIHRoZSB2aWRlb1xuICAgIHZpZGVvLm11dGVkID0gdHJ1ZTtcbiAgICAvLyBVcGRhdGUgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgbXV0ZUJ1dHRvbi5pbm5lckhUTUwgPSBcIlVubXV0ZVwiO1xuICB9IGVsc2Uge1xuICAgIC8vIFVubXV0ZSB0aGUgdmlkZW9cbiAgICB2aWRlby5tdXRlZCA9IGZhbHNlO1xuICAgIHRoaXMuc3JjPVwiL21lZGlhL3dvcmtzaG9wMi92aWRlb0NvbW1hbmQvdm9sdW1lRnVsbC5wbmdcIjtcbiAgICAvLyBVcGRhdGUgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgbXV0ZUJ1dHRvbi5pbm5lckhUTUwgPSBcIk11dGVcIjtcbiAgfVxufTtcblxudmFyIHJlcGV0UGFydE9mVmlkZW8gPSBmdW5jdGlvbiAoc3RhcnQsZW5kLCBudW1iZXJPZlJlcGV0aXRpb24sc3BlZWRSYXRlKSB7XG4gIGNvbnNvbGUubG9nKFwiZnVuY3Rpb24gIC0gcmVwZXRQYXJ0T2ZWaWRlb1wiKTtcbiAgaXNQbGF5aW5nQ2FyZCA9IHRydWU7XG4gIHZpZGVvLnBsYXliYWNrUmF0ZSA9IHNwZWVkUmF0ZTtcbiAgdmlkZW8uY3VycmVudFRpbWUgPSBzdGFydDtcbiAgdmFyIHJlcGV0ID0gbnVtYmVyT2ZSZXBldGl0aW9uO1xuICBcbiAgdmlkZW8ub250aW1ldXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYoaXNQbGF5aW5nQ2FyZCl7XG4gICAgICBpZiAoKGVuZCA+IHN0YXJ0ICkgJiYgIHJlcGV0ID4gMCApIHtcbiAgICAgICAgaWYgKHZpZGVvLmN1cnJlbnRUaW1lID4gZW5kKSB7XG4gICAgICAgICAgcmVwZXQtLTtcbiAgICAgICAgICB2aWRlby5jdXJyZW50VGltZSA9IHN0YXJ0O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmdW5jdGlvbiAgLSByZXBldFBhcnRPZlZpZGVvIFtwbGF5IHBhcnRdIGw4NyB2aWRlb0NvbW1hbmRcIik7XG4gICAgICAgICAgICBwbGF5KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpZGVvLm9udGltZXVwZGF0ZSA9IG51bGw7XG4gICAgICAgIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG4gICAgICAgIHZpZGVvLnBsYXliYWNrUmF0ZSA9IDE7XG4gICAgICB9XG4gICAgfVxuICB9O1xufTtcblxuZnVuY3Rpb24gY2xlYXJBbGxUaW1lcigpIHtcbiAgd2luZG93LmNsZWFySW50ZXJ2YWwodGltZXJSZXBldGl0aW9uKTtcbiAgaXNQbGF5aW5nQ2FyZCA9IGZhbHNlO1xuICB2aWRlby5wbGF5YmFja1JhdGUgPSAxO1xuICBmZWVkYmFja09uU2xpZGVyVmlkZW8oZmFsc2UpO1xufVxuXG5cbnZhciBwbGF5ID0gZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLmxvZyhcImFwcGVsIGEgcGxheVwiKTtcbiAvKiB2YXIgcGxheVByb21pc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW9FQVQnKS5wbGF5KCk7XG4vLyBJbiBicm93c2VycyB0aGF0IGRvbuKAmXQgeWV0IHN1cHBvcnQgdGhpcyBmdW5jdGlvbmFsaXR5LFxuLy8gcGxheVByb21pc2Ugd29u4oCZdCBiZSBkZWZpbmVkLlxuICBpZiAocGxheVByb21pc2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHBsYXlQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlb0VBVCcpLnBsYXkoKTtcbiAgICAgIHBsYXlCdXR0b24uc3JjID0gJy9tZWRpYS93b3Jrc2hvcDIvdmlkZW9Db21tYW5kL3BhdXNlQnV0dG9uLnBuZyc7XG4gICAgICAvLyBBdXRvbWF0aWMgcGxheWJhY2sgc3RhcnRlZCFcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgLy8gQXV0b21hdGljIHBsYXliYWNrIGZhaWxlZC5cbiAgICAgIC8vIFNob3cgYSBVSSBlbGVtZW50IHRvIGxldCB0aGUgdXNlciBtYW51YWxseSBzdGFydCBwbGF5YmFjay5cbiAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgOiBcIiArIGVycm9yKTtcbiAgICB9KTtcbiAgfSovXG4gIFxuIC8qIGlmICh2aWRlby5wYXVzZWQgfHwgdmlkZW8uZW5kZWQgKSB7XG4gICAgdmlkZW8ucGxheSgpO1xuICAgIHBsYXlCdXR0b24uc3JjID0gJy9tZWRpYS93b3Jrc2hvcDIvdmlkZW9Db21tYW5kL3BhdXNlQnV0dG9uLnBuZyc7XG4gIH0qL1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGxheVByb21pc2UgPSB2aWRlby5wbGF5KCk7XG4gICAgaWYgKHBsYXlQcm9taXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHBsYXlQcm9taXNlLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgcGxheUJ1dHRvbi5zcmMgPSAnL21lZGlhL3dvcmtzaG9wMi92aWRlb0NvbW1hbmQvcGF1c2VCdXR0b24ucG5nJztcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB2aWRlby5sb2FkKCk7XG4gICAgICAgIC8vdmlkZW8ucGF1c2UoKTtcbiAgICAgIH0pXG4gICAgXG4gICAgfVxuICB9LDI1MCk7XG4gLyogdmFyIHBsYXlQcm9taXNlID0gdmlkZW8ucGxheSgpO1xuXG4vLyBJbiBicm93c2VycyB0aGF0IGRvbuKAmXQgeWV0IHN1cHBvcnQgdGhpcyBmdW5jdGlvbmFsaXR5LFxuLy8gcGxheVByb21pc2Ugd29u4oCZdCBiZSBkZWZpbmVkLlxuICBpZiAocGxheVByb21pc2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHBsYXlQcm9taXNlLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAvLyBBdXRvbWF0aWMgcGxheWJhY2sgc3RhcnRlZCFcbiAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgIHBsYXlCdXR0b24uc3JjID0gJy9tZWRpYS93b3Jrc2hvcDIvdmlkZW9Db21tYW5kL3BhdXNlQnV0dG9uLnBuZyc7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgdmlkZW8ubG9hZCgpO1xuICAgICAgLy92aWRlby5wYXVzZSgpO1xuICAgICAgLy8gQXV0b21hdGljIHBsYXliYWNrIGZhaWxlZC5cbiAgICAgIC8vIFNob3cgYSBVSSBlbGVtZW50IHRvIGxldCB0aGUgdXNlciBtYW51YWxseSBzdGFydCBwbGF5YmFjay5cbiAgICB9KTtcbiAgfSovXG4gIFxuIC8vIHZpZGVvLnBsYXkoKTtcbn07XG5cbnZhciBwYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc29sZS5sb2coXCJhcHBlbCBhIHBhdXNlXCIpO1xuICB2aWRlby5wYXVzZSgpO1xuICBwbGF5QnV0dG9uLnNyYz0nL21lZGlhL3dvcmtzaG9wMi92aWRlb0NvbW1hbmQvcGxheUJ1dHRvbi5wbmcnO1xufTtcblxudmFyIHBsYXlQYXVzZWNhbGxiYWNrID0gZnVuY3Rpb24oZSl7XG4gIGNvbnNvbGUubG9nKFwiY2FsbGJhY2sgcGxheS1wYXVzZVwiKTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAvKnZpZGVvSXNQbGF5aW5nICs9IDE7XG4gIHZpZGVvSXNQbGF5aW5nICU9IDI7XG4gIGNvbnNvbGUubG9nKFwidmlkZW9Jc1BsYXlpbmcgOiAgXCIgKyB2aWRlb0lzUGxheWluZyk7XG4gIFxuICBpZiAoIXZpZGVvSXNQbGF5aW5nKSB7XG4gICAgY29uc29sZS5sb2coXCJwbGF5XCIpO1xuICAgIFxuICAgIHBsYXkoKTtcbiAgICAvL3NldFRpbWVvdXQocGxheSgpLDI1MCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCJwYXVzZVwiKTtcbiAgICBcbiAgICBwYXVzZSgpO1xuICAgIC8vc2V0VGltZW91dChwYXVzZSgpLDI1MCk7XG4gIH1cbiAgKi9cbiAgXG4gIGlmICh2aWRlby5wYXVzZWQgfHwgdmlkZW8uZW5kZWQgKSB7XG4gICAgICBwbGF5KCk7XG4gICAgICAvL3NldFRpbWVvdXQocGxheSgpLDI1MCk7XG4gICAgfSBlbHNlIHtcbiAgXG4gICAgICBwYXVzZSgpO1xuICAgICAgLy9zZXRUaW1lb3V0KHBhdXNlKCksMjUwKTtcbiAgICB9XG4gIFxuICBcbn07Il19