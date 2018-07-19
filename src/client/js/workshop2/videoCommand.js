var video = document.getElementById("videoEAT");
var timerRepetition;
var speedrate = 1;
var videoSlider = document.getElementById("videoSlider");
// Buttons
var playButton = document.getElementById("play-pause");
var muteButton = document.getElementById("mute");
var timerVideo = document.getElementById("timerVideo");
// Sliders
var knobMin = document.getElementById("range-slider_handle-min");
var knobMax = document.getElementById("range-slider_handle-max");
var rangeSliderTrack = document.getElementById("rangeSliderTrack");

var dividCommandeVideo = document.getElementById("idCommandeVideo");

//var volumeBar = document.getElementById("volume-bar");

var NUMBER_OF_TICK = 1000;

var VALUE_KNOB_MIN = 0;
var VALUE_KNOB_MAX = 100;
var offsetLeftKnobMin = 200;
var currentValueKnob = VALUE_KNOB_MIN;
var videoDuration = "3:14";

var isPlayingCard = false;

knobMin.style.left = (  currentValueKnob + rangeSliderTrack.offsetLeft) + "px" ;




var play = function () {
  video.play();
  playButton.src='/media/workshop2/videoCommand/pauseButton.png';
};
var pause = function () {
  video.pause();
  // Pause the video
  // Update the button text to 'Play'
  playButton.src='/media/workshop2/videoCommand/playButton.png';
};
var defineSpeedRate = function(speed) {
  speedrate += 5;
  video.playbackRate = speedrate;
  play();
};
var upSpeedRate = function() {
  speedrate += 0.5;
  video.playbackRate = speedrate;
  play();
};
var slowSpeedRate = function() {
  if(speedrate < 1)
    speedrate -= 0.1;
  else
    speedrate -= 0.5;
  video.playbackRate = speedrate ;
  play();
};


var repetPartOfVideo = function (start,end, numberOfRepetition,speedRate) {
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
          play();
        }
      } else {
        video.ontimeupdate = null;
        console.log("else de repet part of videp");
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

function updateTimerVideo(){
  let minutes = Math.floor(video.currentTime  / 60);
  let seconds =  Math.floor(video.currentTime - minutes * 60);
  if(seconds<10)
    seconds = "0"+seconds;
  timerVideo.innerHTML = minutes+":"+seconds+"/"+ videoDuration;
}


/*Gere la vitesse de la video
slider.oninput = function() {
  speedrate  = this.value/10;
  if(speedrate <= 0.1){
    speedrate = 0.1;
  }
  video.playbackRate = speedrate ;
  video.play();
}
// Event listener for the volume bar
volumeBar.addEventListener("change", function() {
  // Update the video volume
  video.volume = volumeBar.value;
});*/

/*---- Creation de ma propre bar de commande de lecture pour la vidéo ----- */
// Event listener for the play/pause button
playButton.addEventListener("click", function() {
  if (video.paused === true) {
     play()
  } else {
    pause();
  }
});
// Event listener for the mute button
muteButton.addEventListener("click", function() {
  if (video.muted === false) {
    // Mute the video
    video.muted = true;
    this.src="/media/workshop2/videoCommand/muteSound.png";
  
    // Update the button text
    muteButton.innerHTML = "Unmute";
  } else {
    // Unmute the video
    video.muted = false;
    this.src="/media/workshop2/videoCommand/volumeFull.png";
  
    // Update the button text
    muteButton.innerHTML = "Mute";
  }
});
// Event listener for the seek bar
videoSlider.addEventListener("change", function() {
  // Update the video time
  //video.currentTime = video.duration * (videoSlider.value / NUMBER_OF_TICK);
  updateTimerVideo();
});

// Update the seek bar as the video plays
video.addEventListener("timeupdate", function() {
  // Update the slider value
  
  currentValueKnob = (  ((NUMBER_OF_TICK / video.duration) * video.currentTime) + rangeSliderTrack.offsetLeft);
  knobMin.style.left = currentValueKnob+ "px" ;
  //videoSlider.value = (NUMBER_OF_TICK / video.duration) * video.currentTime;
  updateTimerVideo();
});


// Play the video when the slider handle is dropped
videoSlider.addEventListener("mouseup", function() {
  play();
  return false;
});





function updateKnobAndVideo(e){
  video.currentTime = Math.round(((e.clientX-(rangeSliderTrack.offsetLeft+dividCommandeVideo.offsetLeft))*video.duration)/NUMBER_OF_TICK) ;
  //Update know position
  knobMin.style.left = ((e.clientX-dividCommandeVideo.offsetLeft))+ "px" ;
  
  if(segmentFeedback.displayed){
    if(video.currentTime > segmentFeedback.endDurationVideo){
      feedbackOnSliderVideo(false);
    }
  }
}

function updateKnobMax(e){
  video.currentTime = Math.round(((e.clientX-(rangeSliderTrack.offsetLeft+dividCommandeVideo.offsetLeft))*video.duration)/NUMBER_OF_TICK) ;
  knobMax.style.left = (e.clientX-dividCommandeVideo.offsetLeft)+ "px" ;
}





function getPos(el) {
  // yay readability
  for (var lx=0, ly=0;
       el != null;
       lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
  return {x: lx,y: ly};
}

