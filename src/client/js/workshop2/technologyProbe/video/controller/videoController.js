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


//Click on the video trigger play and pause
video.addEventListener("touchend", function(e) {
  //console.log("appel l42 playPausecallback videoCOntroller");
  //videoFunctionalCoreManager.execute(new PlayPauseCommand());
  e.preventDefault();
  Player.playPausecallback(e);
});

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
video.addEventListener("mousedown", function(e) {
  //console.log("appel playPause function video.addEventListener(mousedown in l62 videocontroller") ;
  //videoFunctionalCoreManager.execute(new PlayPauseCommand());
  Player.playPausecallback();
  
});




// Event controller for the seek bar
videoSlider.addEventListener("change", function(e) {
  Player.updateTimerVideo();
});


// Update the seek bar as the video plays
video.addEventListener("timeupdate", function() {
  // Update the slider value
  if (!video.paused) {
    currentValueKnob = (((NUMBER_OF_TICK / video.duration) * video.currentTime) + rangeSliderTrack.offsetLeft);
    // knobMin.style.left = currentValueKnob-(KNOB_WIDTH/2)+ "px" ;
    knobMin.style.left = currentValueKnob - (KNOB_WIDTH / 2) + "px";
  }
  //videoSlider.value = (NUMBER_OF_TICK / video.duration) * video.currentTime;
  Player.updateTimerVideo();
}, false);



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

