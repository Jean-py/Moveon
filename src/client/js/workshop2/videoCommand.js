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

var KNOB_WIDTH = 25;

//var volumeBar = document.getElementById("volume-bar");

var NUMBER_OF_TICK = 1000;

var VALUE_KNOB_MIN = 0;
var VALUE_KNOB_MAX = 100;
var offsetLeftKnobMin = 200;
var currentValueKnob = VALUE_KNOB_MIN;
var videoDuration = "1:47";

var isPlayingCard = false;

knobMin.style.left = (  currentValueKnob + rangeSliderTrack.offsetLeft) + "px" ;
/*

window.onload = function() {
    video.play(); //start loading, didn't used `vid.load()` since it causes problems with the `ended` event
    
    if (video.readyState !== 4) { //HAVE_ENOUGH_DATA
      video.addEventListener('canplaythrough', onCanPlay, false);
      video.addEventListener('load', onCanPlay, false); //add load event as well to avoid errors, sometimes 'canplaythrough' won't dispatch.
      setTimeout(function () {
        video.pause(); //block play so it buffers before playing
      }, 1); //it needs to be after a delay otherwise it doesn't work properly.
    } else {
      //video is ready
    }
  
  
    video.removeEventListener('canplaythrough', onCanPlay, false);
    video.removeEventListener('load', onCanPlay, false);
    //video is ready
    video.play();
  
};
*/

window.addEventListener("load",function() {
  setTimeout(function(){
    // This hides the address bar:
    window.scrollTo(0, 1);
  }, 0);
});




var play = function () {
  if(video.paused){
      video.play();
      playButton.src='/media/workshop2/videoCommand/pauseButton.png';
  }
 
};
var pause = function () {
  if(!video.paused){
    video.pause();
    // Update the button text to 'Play'
    playButton.src='/media/workshop2/videoCommand/playButton.png';
    
  }
};



// Update the seek bar as the video plays
video.addEventListener("timeupdate", function() {
  // Update the slider value
  if(!video.paused){
    currentValueKnob = (  ((NUMBER_OF_TICK / video.duration) * video.currentTime) + rangeSliderTrack.offsetLeft);
    knobMin.style.left = currentValueKnob-(KNOB_WIDTH/2)+ "px" ;
  }
  //videoSlider.value = (NUMBER_OF_TICK / video.duration) * video.currentTime;
  updateTimerVideo();
});




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

/*---- Creation de ma propre bar de commande de lecture pour la vidéo ----- */
// Event listener for the play/pause button
playButton.addEventListener("touchstart", function() {
  if(video.paused){
    play();
  } else{
    pause();
  }
});
// Event listener for the mute button
muteButton.addEventListener("touchstart", function() {
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
});
// Event listener for the seek bar
videoSlider.addEventListener("change", function() {
  // Update the video time
  //video.currentTime = video.duration * (videoSlider.value / NUMBER_OF_TICK);
  updateTimerVideo();
});

// Play the video when the slider handle is dropped
videoSlider.addEventListener("touchend", function() {
  play();
  return false;
});

function updateKnobAndVideo(event){
  video.currentTime = Math.round(((( event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX )-(rangeSliderTrack.offsetLeft+dividCommandeVideo.offsetLeft))*video.duration)/NUMBER_OF_TICK) ;
  //Update know position
  knobMin.style.left = ((( (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX))-dividCommandeVideo.offsetLeft ) )+ "px" ;
  
  if(segmentFeedback.displayed){
    if(video.currentTime > segmentFeedback.endDurationVideo){
      feedbackOnSliderVideo(false);
    }
  }
}

function updateKnobMax(e){
  video.currentTime = Math.round((((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX)-(rangeSliderTrack.offsetLeft+dividCommandeVideo.offsetLeft))*video.duration)/NUMBER_OF_TICK) ;
  knobMax.style.left = ((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX)-dividCommandeVideo.offsetLeft)+ "px" ;
}



/* For computer

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
*/





function getPos(el) {
  // yay readability
  for (var lx=0, ly=0;
       el != null;
       lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
  return {x: lx,y: ly};
}

