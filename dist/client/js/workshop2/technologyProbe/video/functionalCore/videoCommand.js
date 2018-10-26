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
          //playPausecallback();
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
    console.log("play");

    play();
    //setTimeout(play(),250);
  } else {

    pause();
    //setTimeout(pause(),250);
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZGVvQ29tbWFuZC5qcyJdLCJuYW1lcyI6WyJ2aWRlbyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzcGVlZHJhdGUiLCJwbGF5QnV0dG9uIiwibXV0ZUJ1dHRvbiIsImtub2JNaW4iLCJyYW5nZVNsaWRlclRyYWNrIiwiZGl2Q2FyZEJvYXJkIiwiYm9keSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwidmlkZW9Jc1BsYXlpbmciLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwic2V0VGltZW91dCIsImxvYWQiLCJzY3JvbGxUbyIsImV2ZW50IiwidG9wV2luZG93Iiwic2Nyb2xsWSIsImxlZnRXaW5kb3ciLCJzY3JvbGxYIiwidG9wQm9keSIsImxlZnRCb2R5IiwibXV0ZUJ1dHRvbkNhbGxiYWNrIiwiZSIsIm11dGVkIiwiaW5uZXJIVE1MIiwic3JjIiwicmVwZXRQYXJ0T2ZWaWRlbyIsInN0YXJ0IiwiZW5kIiwibnVtYmVyT2ZSZXBldGl0aW9uIiwic3BlZWRSYXRlIiwiY29uc29sZSIsImxvZyIsImlzUGxheWluZ0NhcmQiLCJwbGF5YmFja1JhdGUiLCJjdXJyZW50VGltZSIsInJlcGV0Iiwib250aW1ldXBkYXRlIiwicGxheSIsImZlZWRiYWNrT25TbGlkZXJWaWRlbyIsImNsZWFyQWxsVGltZXIiLCJjbGVhckludGVydmFsIiwidGltZXJSZXBldGl0aW9uIiwicGxheVByb21pc2UiLCJ1bmRlZmluZWQiLCJ0aGVuIiwidmFsdWUiLCJjYXRjaCIsInBhdXNlIiwicGxheVBhdXNlY2FsbGJhY2siLCJwYXVzZWQiLCJlbmRlZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxTQUFTQyxjQUFULENBQXdCLFVBQXhCLENBQVo7QUFDQSxJQUFJQyxZQUFZLENBQWhCO0FBQ0E7QUFDQSxJQUFJQyxhQUFhSCxTQUFTQyxjQUFULENBQXdCLFlBQXhCLENBQWpCO0FBQ0EsSUFBSUcsYUFBYUosU0FBU0MsY0FBVCxDQUF3QixNQUF4QixD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QStCO0FBQzdCRCxrQkFBWUUsSUFBWixDQUFpQixVQUFVQyxLQUFWLEVBQWlCO0FBQ2hDakQsY0FBTXlDLElBQU47QUFDQXJDLG1CQUFXd0IsR0FBWCxHQUFpQiwrQ0FBakI7QUFDRCxPQUhELEVBR0dzQixLQUhILENBR1MsVUFBVXpCLENBQVYsRUFBYTtBQUNwQlMsZ0JBQVFDLEdBQVIsQ0FBWVYsQ0FBWjtBQUNBekIsY0FBTWUsSUFBTjtBQUNBO0FBQ0QsT0FQRDtBQVNEO0FBQ0YsR0FiRCxFQWFFLEdBYkY7QUFjRDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkE7QUFDQSxDQXRERDs7QUF3REEsSUFBSW9DLFFBQVEsU0FBUkEsS0FBUSxHQUFZO0FBQ3RCakIsVUFBUUMsR0FBUixDQUFZLGVBQVo7QUFDQW5DLFFBQU1tRCxLQUFOO0FBQ0EvQyxhQUFXd0IsR0FBWCxHQUFlLDhDQUFmO0FBQ0QsQ0FKRDs7QUFNQSxJQUFJd0Isb0JBQW9CLFNBQXBCQSxpQkFBb0IsQ0FBUzNCLENBQVQsRUFBVztBQUNqQ1MsVUFBUUMsR0FBUixDQUFZLHFCQUFaO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE1BQUluQyxNQUFNcUQsTUFBTixJQUFnQnJELE1BQU1zRCxLQUExQixFQUFrQztBQUM5QnBCLFlBQVFDLEdBQVIsQ0FBWSxNQUFaOztBQUVBTTtBQUNBO0FBQ0QsR0FMSCxNQUtTOztBQUVMVTtBQUNBO0FBQ0Q7QUFHSixDQS9CRCIsImZpbGUiOiJ2aWRlb0NvbW1hbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpZGVvRUFUXCIpO1xudmFyIHNwZWVkcmF0ZSA9IDE7XG4vLyBCdXR0b25zXG52YXIgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1wYXVzZVwiKTtcbnZhciBtdXRlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtdXRlXCIpO1xuLy8gU2xpZGVyc1xudmFyIGtub2JNaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmdlLXNsaWRlcl9oYW5kbGUtbWluXCIpO1xudmFyIHJhbmdlU2xpZGVyVHJhY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmdlU2xpZGVyVHJhY2tcIik7XG5cbnZhciBkaXZDYXJkQm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpdkNhcmRCb2FyZFwiKTtcbnZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJCT0RZXCIpWzBdO1xuXG52YXIgdmlkZW9Jc1BsYXlpbmcgPSAxO1xuXG4vL3ZhciB2b2x1bWVCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZvbHVtZS1iYXJcIik7XG5cbi8vT24gbG9hZCBvZiB0aGUgcGFnZVxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGZ1bmN0aW9uKCkge1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgLy8gVGhpcyBoaWRlcyB0aGUgYWRkcmVzcyBiYXI6XG4gICAgdmlkZW8ubG9hZCgpO1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAxKTtcbiAgfSwgMCk7XG59KTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICB0b3BXaW5kb3cgPSB0aGlzLnNjcm9sbFk7XG4gICBsZWZ0V2luZG93ID10aGlzLnNjcm9sbFg7XG4gIC8vIGNvbnNvbGUubG9nKFwid2luZG93IHNjcm9sbCA6IFwiICsgbGVmdFdpbmRvdyk7XG59LCBmYWxzZSk7XG5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgIHRvcEJvZHkgPSAgdGhpcy5zY3JvbGxZO1xuICAgbGVmdEJvZHkgPSB0aGlzLnNjcm9sbFg7XG4gICAvL2NvbnNvbGUubG9nKFwiIGJvZHkgOiBcIisgIGJvZHkuc2Nyb2xsTGVmdCAgKTtcbn0sIGZhbHNlKTtcblxuXG5cbi8qQ2FsbGJhY2sgdXNlZCovXG52YXIgbXV0ZUJ1dHRvbkNhbGxiYWNrID0gZnVuY3Rpb24oZSl7XG4gIGlmICh2aWRlby5tdXRlZCA9PT0gZmFsc2UpIHtcbiAgICAvLyBNdXRlIHRoZSB2aWRlb1xuICAgIHZpZGVvLm11dGVkID0gdHJ1ZTtcbiAgICAvLyBVcGRhdGUgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgbXV0ZUJ1dHRvbi5pbm5lckhUTUwgPSBcIlVubXV0ZVwiO1xuICB9IGVsc2Uge1xuICAgIC8vIFVubXV0ZSB0aGUgdmlkZW9cbiAgICB2aWRlby5tdXRlZCA9IGZhbHNlO1xuICAgIHRoaXMuc3JjPVwiL21lZGlhL3dvcmtzaG9wMi92aWRlb0NvbW1hbmQvdm9sdW1lRnVsbC5wbmdcIjtcbiAgICAvLyBVcGRhdGUgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgbXV0ZUJ1dHRvbi5pbm5lckhUTUwgPSBcIk11dGVcIjtcbiAgfVxufTtcblxudmFyIHJlcGV0UGFydE9mVmlkZW8gPSBmdW5jdGlvbiAoc3RhcnQsZW5kLCBudW1iZXJPZlJlcGV0aXRpb24sc3BlZWRSYXRlKSB7XG4gIGNvbnNvbGUubG9nKFwiZnVuY3Rpb24gIC0gcmVwZXRQYXJ0T2ZWaWRlb1wiKTtcbiAgaXNQbGF5aW5nQ2FyZCA9IHRydWU7XG4gIHZpZGVvLnBsYXliYWNrUmF0ZSA9IHNwZWVkUmF0ZTtcbiAgdmlkZW8uY3VycmVudFRpbWUgPSBzdGFydDtcbiAgdmFyIHJlcGV0ID0gbnVtYmVyT2ZSZXBldGl0aW9uO1xuICBcbiAgdmlkZW8ub250aW1ldXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYoaXNQbGF5aW5nQ2FyZCl7XG4gICAgICBpZiAoKGVuZCA+IHN0YXJ0ICkgJiYgIHJlcGV0ID4gMCApIHtcbiAgICAgICAgaWYgKHZpZGVvLmN1cnJlbnRUaW1lID4gZW5kKSB7XG4gICAgICAgICAgcmVwZXQtLTtcbiAgICAgICAgICB2aWRlby5jdXJyZW50VGltZSA9IHN0YXJ0O1xuICAgICAgICAgIC8vcGxheVBhdXNlY2FsbGJhY2soKTtcbiAgICAgICAgICAgIHBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlkZW8ub250aW1ldXBkYXRlID0gbnVsbDtcbiAgICAgICAgZmVlZGJhY2tPblNsaWRlclZpZGVvKGZhbHNlKTtcbiAgICAgICAgdmlkZW8ucGxheWJhY2tSYXRlID0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59O1xuXG5mdW5jdGlvbiBjbGVhckFsbFRpbWVyKCkge1xuICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aW1lclJlcGV0aXRpb24pO1xuICBpc1BsYXlpbmdDYXJkID0gZmFsc2U7XG4gIHZpZGVvLnBsYXliYWNrUmF0ZSA9IDE7XG4gIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG59XG5cblxudmFyIHBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnNvbGUubG9nKFwiYXBwZWwgYSBwbGF5XCIpO1xuIC8qIHZhciBwbGF5UHJvbWlzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlb0VBVCcpLnBsYXkoKTtcbi8vIEluIGJyb3dzZXJzIHRoYXQgZG9u4oCZdCB5ZXQgc3VwcG9ydCB0aGlzIGZ1bmN0aW9uYWxpdHksXG4vLyBwbGF5UHJvbWlzZSB3b27igJl0IGJlIGRlZmluZWQuXG4gIGlmIChwbGF5UHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcGxheVByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvRUFUJykucGxheSgpO1xuICAgICAgcGxheUJ1dHRvbi5zcmMgPSAnL21lZGlhL3dvcmtzaG9wMi92aWRlb0NvbW1hbmQvcGF1c2VCdXR0b24ucG5nJztcbiAgICAgIC8vIEF1dG9tYXRpYyBwbGF5YmFjayBzdGFydGVkIVxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAvLyBBdXRvbWF0aWMgcGxheWJhY2sgZmFpbGVkLlxuICAgICAgLy8gU2hvdyBhIFVJIGVsZW1lbnQgdG8gbGV0IHRoZSB1c2VyIG1hbnVhbGx5IHN0YXJ0IHBsYXliYWNrLlxuICAgICAgY29uc29sZS5sb2coXCJlcnJvciA6IFwiICsgZXJyb3IpO1xuICAgIH0pO1xuICB9Ki9cbiAgXG4gLyogaWYgKHZpZGVvLnBhdXNlZCB8fCB2aWRlby5lbmRlZCApIHtcbiAgICB2aWRlby5wbGF5KCk7XG4gICAgcGxheUJ1dHRvbi5zcmMgPSAnL21lZGlhL3dvcmtzaG9wMi92aWRlb0NvbW1hbmQvcGF1c2VCdXR0b24ucG5nJztcbiAgfSovXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHZhciBwbGF5UHJvbWlzZSA9IHZpZGVvLnBsYXkoKTtcbiAgICBpZiAocGxheVByb21pc2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcGxheVByb21pc2UudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmlkZW8ucGxheSgpO1xuICAgICAgICBwbGF5QnV0dG9uLnNyYyA9ICcvbWVkaWEvd29ya3Nob3AyL3ZpZGVvQ29tbWFuZC9wYXVzZUJ1dHRvbi5wbmcnO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIHZpZGVvLmxvYWQoKTtcbiAgICAgICAgLy92aWRlby5wYXVzZSgpO1xuICAgICAgfSlcbiAgICBcbiAgICB9XG4gIH0sMjUwKTtcbiAvKiB2YXIgcGxheVByb21pc2UgPSB2aWRlby5wbGF5KCk7XG5cbi8vIEluIGJyb3dzZXJzIHRoYXQgZG9u4oCZdCB5ZXQgc3VwcG9ydCB0aGlzIGZ1bmN0aW9uYWxpdHksXG4vLyBwbGF5UHJvbWlzZSB3b27igJl0IGJlIGRlZmluZWQuXG4gIGlmIChwbGF5UHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcGxheVByb21pc2UudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIC8vIEF1dG9tYXRpYyBwbGF5YmFjayBzdGFydGVkIVxuICAgICAgdmlkZW8ucGxheSgpO1xuICAgICAgcGxheUJ1dHRvbi5zcmMgPSAnL21lZGlhL3dvcmtzaG9wMi92aWRlb0NvbW1hbmQvcGF1c2VCdXR0b24ucG5nJztcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB2aWRlby5sb2FkKCk7XG4gICAgICAvL3ZpZGVvLnBhdXNlKCk7XG4gICAgICAvLyBBdXRvbWF0aWMgcGxheWJhY2sgZmFpbGVkLlxuICAgICAgLy8gU2hvdyBhIFVJIGVsZW1lbnQgdG8gbGV0IHRoZSB1c2VyIG1hbnVhbGx5IHN0YXJ0IHBsYXliYWNrLlxuICAgIH0pO1xuICB9Ki9cbiAgXG4gLy8gdmlkZW8ucGxheSgpO1xufTtcblxudmFyIHBhdXNlID0gZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLmxvZyhcImFwcGVsIGEgcGF1c2VcIik7XG4gIHZpZGVvLnBhdXNlKCk7XG4gIHBsYXlCdXR0b24uc3JjPScvbWVkaWEvd29ya3Nob3AyL3ZpZGVvQ29tbWFuZC9wbGF5QnV0dG9uLnBuZyc7XG59O1xuXG52YXIgcGxheVBhdXNlY2FsbGJhY2sgPSBmdW5jdGlvbihlKXtcbiAgY29uc29sZS5sb2coXCJjYWxsYmFjayBwbGF5LXBhdXNlXCIpO1xuICAvKnZpZGVvSXNQbGF5aW5nICs9IDE7XG4gIHZpZGVvSXNQbGF5aW5nICU9IDI7XG4gIGNvbnNvbGUubG9nKFwidmlkZW9Jc1BsYXlpbmcgOiAgXCIgKyB2aWRlb0lzUGxheWluZyk7XG4gIFxuICBpZiAoIXZpZGVvSXNQbGF5aW5nKSB7XG4gICAgY29uc29sZS5sb2coXCJwbGF5XCIpO1xuICAgIFxuICAgIHBsYXkoKTtcbiAgICAvL3NldFRpbWVvdXQocGxheSgpLDI1MCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCJwYXVzZVwiKTtcbiAgICBcbiAgICBwYXVzZSgpO1xuICAgIC8vc2V0VGltZW91dChwYXVzZSgpLDI1MCk7XG4gIH1cbiAgKi9cbiAgXG4gIGlmICh2aWRlby5wYXVzZWQgfHwgdmlkZW8uZW5kZWQgKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInBsYXlcIik7XG4gIFxuICAgICAgcGxheSgpO1xuICAgICAgLy9zZXRUaW1lb3V0KHBsYXkoKSwyNTApO1xuICAgIH0gZWxzZSB7XG4gIFxuICAgICAgcGF1c2UoKTtcbiAgICAgIC8vc2V0VGltZW91dChwYXVzZSgpLDI1MCk7XG4gICAgfVxuICBcbiAgXG59OyJdfQ==