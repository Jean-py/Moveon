"use strict";

var video = document.getElementById("videoEAT");
var wrapperVideo = document.getElementById("idVideo");
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

//Je ne saiss pas comment rendre cette ligne automatique pour l'isntant car la taille est en auto...
var WIDTH_RANGE_SLIDER_TRACK = "960px";
//Donc pour l'instant je reste comme ça
//console.log("AAA : " + window.getComputedStyle(video).getPropertyValue('width'));
rangeSliderTrack.style.width = WIDTH_RANGE_SLIDER_TRACK;

//var volumeBar = document.getElementById("volume-bar");

//On load of the page


window.addEventListener("load", function () {
  //The size of the controller is the same than the size of the video


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
  //console.log("function  - repetPartOfVideo");
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
          //console.log("function  - repetPartOfVideo [play part] l87 videoCommand");
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
  //console.log("appel a play");
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
  //console.log("appel a pause");
  video.pause();
  playButton.src = '/media/workshop2/videoCommand/playButton.png';
};

var playPausecallback = function playPausecallback(e) {
  //console.log("callback play-pause, e : " + e);
  if (e != null && e !== undefined) {
    e.preventDefault();
  }
  //event.preventDefault();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZGVvQ29tbWFuZC5qcyJdLCJuYW1lcyI6WyJ2aWRlbyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3cmFwcGVyVmlkZW8iLCJzcGVlZHJhdGUiLCJwbGF5QnV0dG9uIiwibXV0ZUJ1dHRvbiIsImtub2JNaW4iLCJyYW5nZVNsaWRlclRyYWNrIiwiZGl2Q2FyZEJvYXJkIiwiYm9keSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwidmlkZW9Jc1BsYXlpbmciLCJXSURUSF9SQU5HRV9TTElERVJfVFJBQ0siLCJzdHlsZSIsIndpZHRoIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldFRpbWVvdXQiLCJsb2FkIiwic2Nyb2xsVG8iLCJ1YSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiaW5kZXhPZiIsImNvbnNvbGUiLCJsb2ciLCJzcmMiLCJldmVudCIsInRvcFdpbmRvdyIsInNjcm9sbFkiLCJsZWZ0V2luZG93Iiwic2Nyb2xsWCIsInRvcEJvZHkiLCJsZWZ0Qm9keSIsIm11dGVCdXR0b25DYWxsYmFjayIsImUiLCJtdXRlZCIsImlubmVySFRNTCIsInJlcGV0UGFydE9mVmlkZW8iLCJzdGFydCIsImVuZCIsIm51bWJlck9mUmVwZXRpdGlvbiIsInNwZWVkUmF0ZSIsImlzUGxheWluZ0NhcmQiLCJwbGF5YmFja1JhdGUiLCJjdXJyZW50VGltZSIsInJlcGV0Iiwib250aW1ldXBkYXRlIiwicGxheSIsImZlZWRiYWNrT25TbGlkZXJWaWRlbyIsImNsZWFyQWxsVGltZXIiLCJjbGVhckludGVydmFsIiwidGltZXJSZXBldGl0aW9uIiwicGxheVByb21pc2UiLCJ1bmRlZmluZWQiLCJ0aGVuIiwidmFsdWUiLCJjYXRjaCIsInBhdXNlIiwicGxheVBhdXNlY2FsbGJhY2siLCJwcmV2ZW50RGVmYXVsdCIsInBhdXNlZCIsImVuZGVkIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVFDLFNBQVNDLGNBQVQsQ0FB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QWUsOENBQWY7QUFDRCxDQUpEOztBQU1BLElBQUlpQyxvQkFBb0IsU0FBcEJBLGlCQUFvQixDQUFTeEIsQ0FBVCxFQUFXO0FBQ2pDO0FBQ0EsTUFBR0EsS0FBSyxJQUFMLElBQWFBLE1BQU1tQixTQUF0QixFQUFnQztBQUM5Qm5CLE1BQUV5QixjQUFGO0FBQ0Q7QUFDRDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxNQUFJOUQsTUFBTStELE1BQU4sSUFBZ0IvRCxNQUFNZ0UsS0FBMUIsRUFBa0M7QUFDOUJkO0FBQ0E7QUFDRCxHQUhILE1BR1M7O0FBRUxVO0FBQ0E7QUFDRDtBQUdKLENBakNEIiwiZmlsZSI6InZpZGVvQ29tbWFuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB2aWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmlkZW9FQVRcIik7XG52YXIgd3JhcHBlclZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZFZpZGVvXCIpO1xudmFyIHNwZWVkcmF0ZSA9IDE7XG4vLyBCdXR0b25zXG52YXIgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheS1wYXVzZVwiKTtcbnZhciBtdXRlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtdXRlXCIpO1xuLy8gU2xpZGVyc1xudmFyIGtub2JNaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmdlLXNsaWRlcl9oYW5kbGUtbWluXCIpO1xudmFyIHJhbmdlU2xpZGVyVHJhY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmdlU2xpZGVyVHJhY2tcIik7XG5cbnZhciBkaXZDYXJkQm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpdkNhcmRCb2FyZFwiKTtcbnZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJCT0RZXCIpWzBdO1xuXG52YXIgdmlkZW9Jc1BsYXlpbmcgPSAxO1xuXG4vL0plIG5lIHNhaXNzIHBhcyBjb21tZW50IHJlbmRyZSBjZXR0ZSBsaWduZSBhdXRvbWF0aXF1ZSBwb3VyIGwnaXNudGFudCBjYXIgbGEgdGFpbGxlIGVzdCBlbiBhdXRvLi4uXG52YXIgV0lEVEhfUkFOR0VfU0xJREVSX1RSQUNLID0gXCI5NjBweFwiO1xuLy9Eb25jIHBvdXIgbCdpbnN0YW50IGplIHJlc3RlIGNvbW1lIMOnYVxuLy9jb25zb2xlLmxvZyhcIkFBQSA6IFwiICsgd2luZG93LmdldENvbXB1dGVkU3R5bGUodmlkZW8pLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJykpO1xucmFuZ2VTbGlkZXJUcmFjay5zdHlsZS53aWR0aCA9IFdJRFRIX1JBTkdFX1NMSURFUl9UUkFDSztcblxuXG4vL3ZhciB2b2x1bWVCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZvbHVtZS1iYXJcIik7XG5cbi8vT24gbG9hZCBvZiB0aGUgcGFnZVxuXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZnVuY3Rpb24oKSB7XG4gIC8vVGhlIHNpemUgb2YgdGhlIGNvbnRyb2xsZXIgaXMgdGhlIHNhbWUgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgdmlkZW9cbiAgXG4gIFxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgLy8gVGhpcyBoaWRlcyB0aGUgYWRkcmVzcyBiYXI6XG4gICAgdmlkZW8ubG9hZCgpO1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCAxKTtcbiAgXG4gICAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICh1YS5pbmRleE9mKCdzYWZhcmknKSAhPSAtMSkge1xuICAgICAgaWYgKHVhLmluZGV4T2YoJ2Nocm9tZScpID4gLTEpIHtcbiAgICAgICAgLy92aWRlby5zcmMgPSBcIi4vcHVibGljL21lZGlhL0VBVDMud2VibVwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9hbGVydChcIjJcIikgLy8gU2FmYXJpXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGVzdCBzYWZhcmlcIik7XG4gICAgICAgIHZpZGVvLnNyYyA9IFwiLi4vLi4vLi4vcHVibGljL21lZGlhL3dvcmtzaG9wMi9FQVQzLm1wNFwiO1xuICAgICAgICBjb25zb2xlLmxvZyhcInRlc3Qgc2FmYXJpIDogXCIgKyB2aWRlby5zcmMpO1xuICAgICAgICB2aWRlby5sb2FkKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCAwKTtcbn0pO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgIHRvcFdpbmRvdyA9IHRoaXMuc2Nyb2xsWTtcbiAgIGxlZnRXaW5kb3cgPXRoaXMuc2Nyb2xsWDtcbiAgLy8gY29uc29sZS5sb2coXCJ3aW5kb3cgc2Nyb2xsIDogXCIgKyBsZWZ0V2luZG93KTtcbn0sIGZhbHNlKTtcblxuYm9keS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICB0b3BCb2R5ID0gIHRoaXMuc2Nyb2xsWTtcbiAgIGxlZnRCb2R5ID0gdGhpcy5zY3JvbGxYO1xuICAgLy9jb25zb2xlLmxvZyhcIiBib2R5IDogXCIrICBib2R5LnNjcm9sbExlZnQgICk7XG59LCBmYWxzZSk7XG5cblxuXG4vKkNhbGxiYWNrIHVzZWQqL1xudmFyIG11dGVCdXR0b25DYWxsYmFjayA9IGZ1bmN0aW9uKGUpe1xuICBpZiAodmlkZW8ubXV0ZWQgPT09IGZhbHNlKSB7XG4gICAgLy8gTXV0ZSB0aGUgdmlkZW9cbiAgICB2aWRlby5tdXRlZCA9IHRydWU7XG4gICAgLy8gVXBkYXRlIHRoZSBidXR0b24gdGV4dFxuICAgIG11dGVCdXR0b24uaW5uZXJIVE1MID0gXCJVbm11dGVcIjtcbiAgfSBlbHNlIHtcbiAgICAvLyBVbm11dGUgdGhlIHZpZGVvXG4gICAgdmlkZW8ubXV0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnNyYz1cIi9tZWRpYS93b3Jrc2hvcDIvdmlkZW9Db21tYW5kL3ZvbHVtZUZ1bGwucG5nXCI7XG4gICAgLy8gVXBkYXRlIHRoZSBidXR0b24gdGV4dFxuICAgIG11dGVCdXR0b24uaW5uZXJIVE1MID0gXCJNdXRlXCI7XG4gIH1cbn07XG5cbnZhciByZXBldFBhcnRPZlZpZGVvID0gZnVuY3Rpb24gKHN0YXJ0LGVuZCwgbnVtYmVyT2ZSZXBldGl0aW9uLHNwZWVkUmF0ZSkge1xuICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gIC0gcmVwZXRQYXJ0T2ZWaWRlb1wiKTtcbiAgaXNQbGF5aW5nQ2FyZCA9IHRydWU7XG4gIHZpZGVvLnBsYXliYWNrUmF0ZSA9IHNwZWVkUmF0ZTtcbiAgdmlkZW8uY3VycmVudFRpbWUgPSBzdGFydDtcbiAgdmFyIHJlcGV0ID0gbnVtYmVyT2ZSZXBldGl0aW9uO1xuICBcbiAgdmlkZW8ub250aW1ldXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYoaXNQbGF5aW5nQ2FyZCl7XG4gICAgICBpZiAoKGVuZCA+IHN0YXJ0ICkgJiYgIHJlcGV0ID4gMCApIHtcbiAgICAgICAgaWYgKHZpZGVvLmN1cnJlbnRUaW1lID4gZW5kKSB7XG4gICAgICAgICAgcmVwZXQtLTtcbiAgICAgICAgICB2aWRlby5jdXJyZW50VGltZSA9IHN0YXJ0O1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImZ1bmN0aW9uICAtIHJlcGV0UGFydE9mVmlkZW8gW3BsYXkgcGFydF0gbDg3IHZpZGVvQ29tbWFuZFwiKTtcbiAgICAgICAgICAgIHBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlkZW8ub250aW1ldXBkYXRlID0gbnVsbDtcbiAgICAgICAgZmVlZGJhY2tPblNsaWRlclZpZGVvKGZhbHNlKTtcbiAgICAgICAgdmlkZW8ucGxheWJhY2tSYXRlID0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59O1xuXG5mdW5jdGlvbiBjbGVhckFsbFRpbWVyKCkge1xuICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aW1lclJlcGV0aXRpb24pO1xuICBpc1BsYXlpbmdDYXJkID0gZmFsc2U7XG4gIHZpZGVvLnBsYXliYWNrUmF0ZSA9IDE7XG4gIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG59XG5cblxudmFyIHBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gIC8vY29uc29sZS5sb2coXCJhcHBlbCBhIHBsYXlcIik7XG4gLyogdmFyIHBsYXlQcm9taXNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvRUFUJykucGxheSgpO1xuLy8gSW4gYnJvd3NlcnMgdGhhdCBkb27igJl0IHlldCBzdXBwb3J0IHRoaXMgZnVuY3Rpb25hbGl0eSxcbi8vIHBsYXlQcm9taXNlIHdvbuKAmXQgYmUgZGVmaW5lZC5cbiAgaWYgKHBsYXlQcm9taXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICBwbGF5UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW9FQVQnKS5wbGF5KCk7XG4gICAgICBwbGF5QnV0dG9uLnNyYyA9ICcvbWVkaWEvd29ya3Nob3AyL3ZpZGVvQ29tbWFuZC9wYXVzZUJ1dHRvbi5wbmcnO1xuICAgICAgLy8gQXV0b21hdGljIHBsYXliYWNrIHN0YXJ0ZWQhXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIC8vIEF1dG9tYXRpYyBwbGF5YmFjayBmYWlsZWQuXG4gICAgICAvLyBTaG93IGEgVUkgZWxlbWVudCB0byBsZXQgdGhlIHVzZXIgbWFudWFsbHkgc3RhcnQgcGxheWJhY2suXG4gICAgICBjb25zb2xlLmxvZyhcImVycm9yIDogXCIgKyBlcnJvcik7XG4gICAgfSk7XG4gIH0qL1xuICBcbiAvKiBpZiAodmlkZW8ucGF1c2VkIHx8IHZpZGVvLmVuZGVkICkge1xuICAgIHZpZGVvLnBsYXkoKTtcbiAgICBwbGF5QnV0dG9uLnNyYyA9ICcvbWVkaWEvd29ya3Nob3AyL3ZpZGVvQ29tbWFuZC9wYXVzZUJ1dHRvbi5wbmcnO1xuICB9Ki9cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBsYXlQcm9taXNlID0gdmlkZW8ucGxheSgpO1xuICAgIGlmIChwbGF5UHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwbGF5UHJvbWlzZS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgIHBsYXlCdXR0b24uc3JjID0gJy9tZWRpYS93b3Jrc2hvcDIvdmlkZW9Db21tYW5kL3BhdXNlQnV0dG9uLnBuZyc7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgdmlkZW8ubG9hZCgpO1xuICAgICAgICAvL3ZpZGVvLnBhdXNlKCk7XG4gICAgICB9KVxuICAgIFxuICAgIH1cbiAgfSwyNTApO1xuIC8qIHZhciBwbGF5UHJvbWlzZSA9IHZpZGVvLnBsYXkoKTtcblxuLy8gSW4gYnJvd3NlcnMgdGhhdCBkb27igJl0IHlldCBzdXBwb3J0IHRoaXMgZnVuY3Rpb25hbGl0eSxcbi8vIHBsYXlQcm9taXNlIHdvbuKAmXQgYmUgZGVmaW5lZC5cbiAgaWYgKHBsYXlQcm9taXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICBwbGF5UHJvbWlzZS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgLy8gQXV0b21hdGljIHBsYXliYWNrIHN0YXJ0ZWQhXG4gICAgICB2aWRlby5wbGF5KCk7XG4gICAgICBwbGF5QnV0dG9uLnNyYyA9ICcvbWVkaWEvd29ya3Nob3AyL3ZpZGVvQ29tbWFuZC9wYXVzZUJ1dHRvbi5wbmcnO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIHZpZGVvLmxvYWQoKTtcbiAgICAgIC8vdmlkZW8ucGF1c2UoKTtcbiAgICAgIC8vIEF1dG9tYXRpYyBwbGF5YmFjayBmYWlsZWQuXG4gICAgICAvLyBTaG93IGEgVUkgZWxlbWVudCB0byBsZXQgdGhlIHVzZXIgbWFudWFsbHkgc3RhcnQgcGxheWJhY2suXG4gICAgfSk7XG4gIH0qL1xuICBcbiAvLyB2aWRlby5wbGF5KCk7XG59O1xuXG52YXIgcGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gIC8vY29uc29sZS5sb2coXCJhcHBlbCBhIHBhdXNlXCIpO1xuICB2aWRlby5wYXVzZSgpO1xuICBwbGF5QnV0dG9uLnNyYz0nL21lZGlhL3dvcmtzaG9wMi92aWRlb0NvbW1hbmQvcGxheUJ1dHRvbi5wbmcnO1xufTtcblxudmFyIHBsYXlQYXVzZWNhbGxiYWNrID0gZnVuY3Rpb24oZSl7XG4gIC8vY29uc29sZS5sb2coXCJjYWxsYmFjayBwbGF5LXBhdXNlLCBlIDogXCIgKyBlKTtcbiAgaWYoZSAhPSBudWxsICYmIGUgIT09IHVuZGVmaW5lZCl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG4gIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgLyp2aWRlb0lzUGxheWluZyArPSAxO1xuICB2aWRlb0lzUGxheWluZyAlPSAyO1xuICBjb25zb2xlLmxvZyhcInZpZGVvSXNQbGF5aW5nIDogIFwiICsgdmlkZW9Jc1BsYXlpbmcpO1xuICBcbiAgaWYgKCF2aWRlb0lzUGxheWluZykge1xuICAgIGNvbnNvbGUubG9nKFwicGxheVwiKTtcbiAgICBcbiAgICBwbGF5KCk7XG4gICAgLy9zZXRUaW1lb3V0KHBsYXkoKSwyNTApO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwicGF1c2VcIik7XG4gICAgXG4gICAgcGF1c2UoKTtcbiAgICAvL3NldFRpbWVvdXQocGF1c2UoKSwyNTApO1xuICB9XG4gICovXG4gIFxuICBpZiAodmlkZW8ucGF1c2VkIHx8IHZpZGVvLmVuZGVkICkge1xuICAgICAgcGxheSgpO1xuICAgICAgLy9zZXRUaW1lb3V0KHBsYXkoKSwyNTApO1xuICAgIH0gZWxzZSB7XG4gIFxuICAgICAgcGF1c2UoKTtcbiAgICAgIC8vc2V0VGltZW91dChwYXVzZSgpLDI1MCk7XG4gICAgfVxuICBcbiAgXG59OyJdfQ==