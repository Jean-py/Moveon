var videovjs = document.getElementById("videovjscontrol");
var timerRepetition;
var speedrate = 1;
var videoSlider = document.getElementById("videoSlider");
// Buttons
var playButton = document.getElementById("play-pause");
var muteButton = document.getElementById("mute");
var timerVideo = document.getElementById("timerVideo");
// Sliders
var knobMin = document.getElementById("range-slider_handle-min");
//var knobMin = document.getElementsByClassName("vjs-button");

var rangeSliderTrack = document.getElementById("rangeSliderTrack");
var wrapperCommandAndRangeid = document.getElementById("wrapperCommandAndRangeid");

var rangeSliderWrapper = document.getElementById("range-slider-wrapper");
var divCardBoard = document.getElementById("divCardBoard");
var body = document.getElementsByTagName("BODY")[0];


var KNOB_WIDTH = 25;

var NUMBER_OF_TICK = parseInt(WIDTH_RANGE_SLIDER_TRACK, 10);
var VALUE_KNOB_MIN = 0;
var WIDTH_MID_KNOB_MIN = 15;
var currentValueKnob = VALUE_KNOB_MIN;
var videoDuration = "1:47";


knobMin.style.left = (currentValueKnob + rangeSliderTrack.offsetLeft) + "px";

/*---- Creation de ma propre bar de commande de lecture pour la vidéo ----- */
// Event controller for the play/pause button
playButton.addEventListener("touchstart", function(e) {
  /*e.preventDefault();
  event.preventDefault();
  //kill('mousedown');
  //console.log("appel l36 playPausecallback videoController" );
 // videoFunctionalCoreManager.execute(new PlayPauseCommand());
  playPausecallback(e);
  //playPausecallback(e);*/
}, {
  passive: true
});

//Click  space to playpause the video
window.addEventListener("keydown", function (e) {
  if(e.keyCode == 32 && e.target == document.body) {
    Player.playPausecallback();
    event.preventDefault();
  }
  
  
  // Annuler l'action par défaut pour éviter qu'elle ne soit traitée deux fois.
  event.preventDefault();
}, true);



muteButton.addEventListener("touchend", function(e) {
  e.preventDefault();
  videoFunctionalCoreManager.execute(new MuteButtonCommand());
});

rangeSliderWrapper.addEventListener("touchend", function(e) {
  e.preventDefault();
  Player.playPausecallback(e);
});

//Mouse event controller
playButton.addEventListener("mousedown", function(e) {
  //console.log("appel playPause function playButton.addEventListener(mousedown in l56 videocontroller") ;
  //videoFunctionalCoreManager.execute(new PlayPauseCommand());
  Player.playPausecallback();
  // event.preventDefault();
});
muteButton.addEventListener("mousedown", function(e) {
  videoFunctionalCoreManager.execute(new MuteButtonCommand());
  
});

if(videovjs !== null){
  
  videovjs.addEventListener("mousedown", function(e) {
    //console.log("appel playPause function video.addEventListener(mousedown in l62 videocontroller") ;
    //videoFunctionalCoreManager.execute(new PlayPauseCommand());
    Player.playPausecallback();
  });
//Click on the video trigger play and pause
  videovjs.addEventListener("touchend", function(e) {
    e.preventDefault();
    Player.playPausecallback(e);
  });

// Update the seek bar as the video plays
  videovjs.addEventListener("timeupdate", function() {
    // Update the slider value
    if (!videovjs.paused) {
      currentValueKnob = (((NUMBER_OF_TICK / videovjs.duration) * videovjs.currentTime) + rangeSliderTrack.offsetLeft);
      // knobMin.style.left = currentValueKnob-(KNOB_WIDTH/2)+ "px" ;
      knobMin.style.left = currentValueKnob - (KNOB_WIDTH / 2) + "px";
    }
    //videoSlider.value = (NUMBER_OF_TICK / video.duration) * video.currentTime;
    Player.updateTimerVideo();
  }, false);
  
  
}



// Event controller for the seek bar
videoSlider.addEventListener("change", function(e) {
  Player.updateTimerVideo();
});



//Function to update the knob
var updateKnobAndVideoWrapper = function(e) {
  if (e.type === "mouseup" || e.type === "mousedown" ){
    videoFunctionalCoreManager.execute(new updateKnobAndVideoComputerCommand(e));
    
    //updateKnobAndVideoComputer(e);
  } else if(e.type === "mousemove" || e.type === "[object MouseEvent]") {
  
    updateKnobAndVideoComputer(e);
  } else {
    updateKnobAndVideo(e);
  }
  // video.play();
};

/*
var video = videojs('videovjscontrol', {
  children: {
    controlBar: {
      children: {
        progressControl: true
      }
    }
  }
});*/

  /*.addEventListener("",function () {
  console.log("hello");
});*/
/*

var player = videojs('videovjscontrol', {
  controlBar: {
    children: {
      progressControl: true,
      playToggle: true,
      currentTimeDisplay: true,
      timeDivider: true,
      durationDisplay: true,
      //where I want to add custom component - logo brand
      //logoBrand : true,
      //where i want to add theater(not full screen, but larger) mode
      //theaterModeButton : true,
      volumeMenuButton: {
        vertical: true,
        inline: false,
        volumeBar: {
          vertical: true
        },
        volumeLevel: false
      },
      fullscreenToggle: true
    }
  }
});*/
