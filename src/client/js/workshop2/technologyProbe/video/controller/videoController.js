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

var NUMBER_OF_TICK = 10000;
var VALUE_KNOB_MIN = 0;
var WIDTH_MID_KNOB_MIN = 15;
var currentValueKnob = VALUE_KNOB_MIN;
var videoDuration = "1:47";


knobMin.style.left = (  currentValueKnob + rangeSliderTrack.offsetLeft) + "px" ;





/*---- Creation de ma propre bar de commande de lecture pour la vidéo ----- */
// Event controller for the play/pause button
playButton.addEventListener("touchstart", function(e) {
  e.preventDefault();
  event.preventDefault();
  console.log("appel l36 playPausecallback videoController" );
  playPausecallback(e);
},{passive: true});
//Click on the video trigger play and pause
video.addEventListener("touchend", function(e) {
  console.log("appel l42 playPausecallback videoCOntroller");
  playPausecallback(e);
});
muteButton.addEventListener("touchend", function(e) {
  muteButtonCallback();
});
rangeSliderWrapper.addEventListener("touchend", function(e) {
  //play();
  console.log("appel l50 playPausecallback video OCntroller");
  playPausecallback();
});

//Mouse event controller
playButton.addEventListener("mousedown", function(e) {
  e.preventDefault();
  event.preventDefault();
  console.log("appel playPause function playButton.addEventListener(mousedown in l56 videocontroller") ;
  playPausecallback(e);
});
muteButton.addEventListener("mousedown", function(e) {
  muteButtonCallback();
});
video.addEventListener("mousedown", function(e) {
  console.log("appel playPause function video.addEventListener(mousedown in l62 videocontroller") ;
  playPausecallback(e);
});
rangeSliderWrapper.addEventListener("mouseup", function(e) {
   //play();
  //playPausecallback();
  //console.log("AA");
  
});

// Event controller for the seek bar
videoSlider.addEventListener("change", function(e) {
  // Update the video time
  //video.currentTime = video.duration * (videoSlider.value / NUMBER_OF_TICK);
  updateTimerVideo();
});


// Update the seek bar as the video plays
video.addEventListener("timeupdate", function() {
  // Update the slider value
  if(!video.paused){
    currentValueKnob = (((NUMBER_OF_TICK / video.duration) * video.currentTime) + rangeSliderTrack.offsetLeft);
    // knobMin.style.left = currentValueKnob-(KNOB_WIDTH/2)+ "px" ;
    knobMin.style.left = currentValueKnob-(KNOB_WIDTH/2)+ "px" ;
  }
  //videoSlider.value = (NUMBER_OF_TICK / video.duration) * video.currentTime;
  updateTimerVideo();
}, false);



//Function to update the knob
var updateKnobAndVideoWrapper = function(e){
  if(e.type === "mouseup" || e.type === "mousedown" || e.type === "mousemove" ||  e.type === "[object MouseEvent]" ){
    updateKnobAndVideoComputer(e);
  } else {
    updateKnobAndVideo(e);
  }
 // video.play();
};


//Update knob on a tablet
var  updateKnobAndVideo = function(event){
//  var offsetLeftSlider = wrapperCommandAndRangeid.offsetLeft+rangeSliderTrack.offsetLeft + dividCommandeVideo.offsetLeft;
  var offsetLeftSlider = wrapperCommandAndRangeid.offsetLeft  ;//-   ;
  //console.log("aa :  " +  body );
  
  video.currentTime = Math.round(((( event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX )-(offsetLeftSlider))*video.duration)/NUMBER_OF_TICK) ;
  //Update know position
  knobMin.style.left = ((( (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX))-offsetLeftSlider ) )+ "px" ;
  if(segmentFeedback.displayed){
    if(video.currentTime > segmentFeedback.endDurationVideo){
      feedbackOnSliderVideo(false);
    }
  }
};

//Update knob on a laptop
var updateKnobAndVideoComputer = function(e){
  //take into account offset on the left of the scroll bar (body scroll and centering the wrapper)
  var offsetLeftSlider = wrapperCommandAndRangeid.offsetLeft - body.scrollLeft;//- window.scrollLeft  ;
  //currentValueKnob = ((e.clientX - offsetLeftSlider) * video.duration) / NUMBER_OF_TICK;
  currentValueKnob = ((e.pageX - offsetLeftSlider) * video.duration) / NUMBER_OF_TICK;
  if(currentValueKnob < video.duration ) {
    video.currentTime = ((e.pageX - offsetLeftSlider) * video.duration) / NUMBER_OF_TICK;
    knobMin.style.left = e.pageX -  (offsetLeftSlider +  WIDTH_MID_KNOB_MIN/2 ) + "px"
    if (segmentFeedback.displayed) {
      if (video.currentTime > segmentFeedback.endDurationVideo) {
        feedbackOnSliderVideo(false);
      }
    }
  }
};

function feedbackOnSliderVideo(onOff){
  segmentFeedback.endPosition = parseInt(segmentFeedback.startPostion) + parseInt(segmentFeedback.width);
  var sliderToV = sliderToVideo( segmentFeedback.startPostion, segmentFeedback.endPosition);
  segmentFeedback.startDurationVideo = sliderToV.startDuration;
  segmentFeedback.endDurationVideo = sliderToV.endDuration;
  segmentFeedback.displayed = onOff;
  if(onOff){
    //segmentFeedback.divGraphicalObject.style.marginLeft = segmentFeedback.startPostion;
    segmentFeedback.divGraphicalObject.style.marginLeft = parseInt(segmentFeedback.startPostion) - 5 +"px";//  segmentFeedback.startPostion;
    segmentFeedback.divGraphicalObject.style.visibility = "visible";
    segmentFeedback.divGraphicalObject.style.width =  segmentFeedback.width;
  } else {
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
  }
}


function updateTimerVideo(){
  let minutes = Math.floor(video.currentTime  / 60);
  let seconds =  Math.floor(video.currentTime - minutes * 60);
  if(seconds<10)
    seconds = "0"+seconds;
  timerVideo.innerHTML = minutes+":"+seconds+"/"+ videoDuration;
}

