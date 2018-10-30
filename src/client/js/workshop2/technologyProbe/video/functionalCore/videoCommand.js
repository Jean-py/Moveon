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



window.addEventListener("load",function() {
  //The size of the controller is the same than the size of the video
  
  
  setTimeout(function(){
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
window.addEventListener("scroll", function(event) {
   topWindow = this.scrollY;
   leftWindow =this.scrollX;
  // console.log("window scroll : " + leftWindow);
}, false);

body.addEventListener("scroll", function(event) {
   topBody =  this.scrollY;
   leftBody = this.scrollX;
   //console.log(" body : "+  body.scrollLeft  );
}, false);



/*Callback used*/
var muteButtonCallback = function(e){
  if (video.muted === false) {
    // Mute the video
    video.muted = true;
    // Update the button text
    muteButton.innerHTML = "Unmute";
  } else {
    // Unmute the video
    video.muted = false;
    this.src="/media/workshop2/videoCommand/volumeFull.png";
    // Update the button text
    muteButton.innerHTML = "Mute";
  }
};

var repetPartOfVideo = function (start,end, numberOfRepetition,speedRate) {
  console.log("function  - repetPartOfVideo");
  isPlayingCard = true;
  video.playbackRate = speedRate;
  video.currentTime = start;
  var repet = numberOfRepetition;
  
  video.ontimeupdate = function() {
    if(isPlayingCard){
      if ((end > start ) &&  repet > 0 ) {
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


var play = function () {
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
      })
    
    }
  },250);
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

var pause = function () {
  console.log("appel a pause");
  video.pause();
  playButton.src='/media/workshop2/videoCommand/playButton.png';
};

var playPausecallback = function(e){
  console.log("callback play-pause, e : " + e);
  if(e != null && e != "undefined"){
  
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
  
  if (video.paused || video.ended ) {
      play();
      //setTimeout(play(),250);
    } else {
  
      pause();
      //setTimeout(pause(),250);
    }
  
  
};