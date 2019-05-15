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
var WIDTH_MID_KNOB_MIN = 0.5;
var currentValueKnob = VALUE_KNOB_MIN;
var videoDuration = "1:47";


//Click  space to playpause the video
window.addEventListener("keydown", function (e) {
  
  if(e.keyCode == 32 ) {
    player.playPausecallback();
    event.preventDefault();
  }
  // Annuler l'action par défaut pour éviter qu'elle ne soit traitée deux fois.
  event.preventDefault();
}, true);



/*muteButton.addEventListener("touchend", function(e) {
  e.preventDefault();
  videoFunctionalCoreManager.execute(new MuteButtonCommand());
});*/
if(rangeSliderWrapper != null){
  
  rangeSliderWrapper.addEventListener("touchend", function(e) {
    e.preventDefault();
    Player.playPausecallback(e);
  });
}

//Mouse event controller
/*playButton.addEventListener("mousedown", function(e) {
  //console.log("appel playPause function playButton.addEventListener(mousedown in l56 videocontroller") ;
  //videoFunctionalCoreManager.execute(new PlayPauseCommand());
  Player.playPausecallback();
  // event.preventDefault();
});*/
/*muteButton.addEventListener("mousedown", function(e) {
  videoFunctionalCoreManager.execute(new MuteButtonCommand());
  
});*/
if(video_current !== null){
 
 video_current.ready(function () {
    this.on('timeupdate', function () {
        knobMin.style.left = parseFloat(document.getElementsByClassName("vjs-play-progress")[0].style.width,10) - WIDTH_MID_KNOB_MIN +"%" ; // Returns (string) "70px"
    })
  });
  
  /*
  video_current.addEventListener("mousedown", function(e) {
    //console.log("appel playPause function video.addEventListener(mousedown in l62 videocontroller") ;
    //videoFunctionalCoreManager.execute(new PlayPauseCommand());
    player.playPausecallback();
  });
//Click on the video trigger play and pause
  video_current.addEventListener("touchend", function(e) {
    e.preventDefault();
    player.playPausecallback(e);
  });

// Update the seek bar as the video plays
  video_current.addEventListener("timeupdate", function() {
    // Update the slider value
    if (!video_current.paused) {
      currentValueKnob = (((NUMBER_OF_TICK / video_current.duration) * video_current.currentTime) + rangeSliderTrack.offsetLeft);
      // knobMin.style.left = currentValueKnob-(KNOB_WIDTH/2)+ "px" ;
      knobMin.style.left = currentValueKnob - (KNOB_WIDTH / 2) + "px";
    }
    //videoSlider.value = (NUMBER_OF_TICK / video.duration) * video.currentTime;
    player.updateTimerVideo();
  }, false);*/
  
  
}




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

var eventT = new EventTarget();
console.log(eventT);
var handleBar = function() {
  console.log('bar was triggered');
};

eventT.addEventListener('bar', handleBar);
eventT.trigger('bar');
*/

/*

var mytest = videojs('videojs',{
  controls: false,
  autoplay: false,
  preload: 'auto'
});*/
//myPlayer.addChild('BigPlayButton');
/*

mytest.userActive(false);


*/


// This causes any `event listeners` for the `bar` event to get called
// see EventTarget#trigger for more information
// logs 'bar was triggered'
/*

var vjs_progress_control = document.getElementsByClassName("vjs-progress-control")[0];

vjs_progress_control.addEventListener("mousedown", function(e) {
  console.log("holla");
});

vjs_progress_control.addEventListener("long-press", function(e) {
  console.log("Hallo");
});
*/

//seekbar.handleMouseDown();
/*
var seekBarVideojs = document.getElementsByClassName("vjs-remaining-time-display")[0];




//test sur videojs
console.log(vjs_progress_control);

vjs_progress_control.addEventListener("mousedown", function(e) {
  console.log("holla");
}, {
  passive: true
});*/
/*

seekBarVideojs.addEventListener(['mousedown', 'touchstart'], function (e) {
  console.log("helloooo");
} );*/
/*





var vjs_progress_control = document.getElementsByClassName("vjs-progress-control")[0];
//test sur videojs
console.log(vjs_progress_control);

vjs_progress_control.addEventListener("mousedown", function(e) {
  console.log("holla");
}, {
  passive: true
});


var seekBarVideojs = document.getElementsByClassName("vjs-slider-horizontal")[1];

seekBarVideojs.addEventListener("mousedown", function(e){
  console.log("jajaja");
});

var p = document.getElementsByClassName("vjs-control")[6];
p.addEventListener("mousedown", function(e){
  pause();
  longpressCreateSegmentCallback(e);
  console.log("jojo");

});
*/

/*

seekBarVideojs.addEventListener("long-press", function(e){
  pause();
  longpressCreateSegmentCallback(e);
});
*/

/*
var player = videojs('videovjscontrol');

var myComponent = new Component(player);
var button = new Component(player);

var myButton = myComponent.addChild(button, {
  text: 'Press Me',
  buttonChildExample: {
    buttonChildOption: true
  }
});*/



//var video = videojs('videovjscontrol');
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
