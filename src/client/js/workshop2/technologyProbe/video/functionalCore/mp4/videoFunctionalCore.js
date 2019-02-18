/**
 * Deprecated if using the youtube api instead of loaded video
 * @type {HTMLElement | null}
 */


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

//Je ne saiss pas comment rendre cette ligne automatique pour l'isntant car la taille est en auto...
var WIDTH_RANGE_SLIDER_TRACK = "960px";
//Donc pour l'instant je reste comme ça
rangeSliderTrack.style.width = WIDTH_RANGE_SLIDER_TRACK;

var isPlayingCard = false;



var commands = [];
/**
 * Access point to the functional core, you can just execute command from here
 * @return {{execute: execute}}
 * @constructor
 */
var VideoFunctionalCoreManager = function() {
  //This is a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    execute: function(command) {
      switch (command.execute.name){
        case "repetPartOfVideo" : {
          command.execute(command.start,command.end,command.numberOfRepetition,command.speedRate);
          break;
        }
        case "updateKnobAndVideoComputer" :
          command.execute(command.e);
          break;
        
        default:
          command.execute();
          break;
      }
  
      //We send the command to the server (the server log it into a file, see ./src/server/ServerLogger)
      logger.sendAndLogCommand(command);
      //and we save the command created
      commands.push(command);
    }
    //We did not implemented undo redo for this manager, because undo play pause is kind of useless right?
  }
};


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


/**
 * Callback used *
 *-------------------------------
 * DO NOT USE THESE FUNCTIONS WITHOUT A COMMAND!
 * The following code should be considered as private
/*------------------------------- */

var muteButtonCallback = function(e){
  if (video.muted === false) {
    // Mute the video
    video.muted = true;
    // Update the button text
    muteButton.innerHTML = "Unmute";
  } else {
    // Unmute the video
    video.muted = false;
    //this.src="/media/workshop2/videoCommand/volumeFull.png";
    // Update the button text
    muteButton.innerHTML = "Mute";
  }
};

var repetPartOfVideo = function (start,end, numberOfRepetition,speedRate) {
  // console.log("function  - repetPartOfVideo" , start,end, numberOfRepetition,speedRate);
  isPlayingCard = true;
  video.playbackRate = speedRate;
  video.currentTime = start;
  var repet = numberOfRepetition;
  
  //console.log("function  - repetPartOfVideo [play part] l87 videoCommand");
  play();
  video.ontimeupdate = function() {
    if(isPlayingCard){
      if ((end > start ) &&  repet > 0 ) {
        if (video.currentTime > end) {
          repet--;
          video.currentTime = start;
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
};

var pause = function () {
  //console.log("appel a pause");
  video.pause();
  playButton.src='/media/workshop2/videoCommand/playButton.png';
};

var seekTo = function(startDurationParam){
  console.log(startDurationParam);
  video.currentTime = startDurationParam;
};

var playPausecallback = function(e){
  //console.log("callback play-pause, e : " + e);
  /*if(e != null && e !== undefined){
    e.preventDefault();
  }*/
  if (video.paused || video.ended ) {
    videoFunctionalCoreManager.execute(new PlayCommand());
    //play();
    } else {
      //pause();
    videoFunctionalCoreManager.execute(new PauseCommand());
  
  }
};

var setSource = function(source){
  video.src = source;
};

//Update knob on a tablet
var updateKnobAndVideo = function(event) {
  //  var offsetLeftSlider = wrapperCommandAndRangeid.offsetLeft+rangeSliderTrack.offsetLeft + dividCommandeVideo.offsetLeft;
  var offsetLeftSlider = wrapperCommandAndRangeid.offsetLeft; //-   ;
  //console.log("aa :  " +  body );
  
  video.currentTime = Math.round((((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length - 1].pageX) - (offsetLeftSlider)) * video.duration) / NUMBER_OF_TICK);
  //Update know position
  knobMin.style.left = ((((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length - 1].pageX)) - offsetLeftSlider)) + "px";
  if (segmentFeedback.displayed) {
    if (video.currentTime > segmentFeedback.endDurationVideo) {
      feedbackOnSliderVideo(false);
    }
  }
};

//Update knob on a laptop
var updateKnobAndVideoComputer = function(e) {
  //take into account offset on the left of the scroll bar (body scroll and centering the wrapper)
  
 // var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth;
  //    video.currentTime = pos * video.duration;
  var offsetLeftSlider = wrapperCommandAndRangeid.offsetLeft - body.scrollLeft; //- window.scrollLeft  ;
  currentValueKnob = ((e.pageX - offsetLeftSlider) * video.duration) / NUMBER_OF_TICK;
  if (currentValueKnob < video.duration && currentValueKnob >= 0) {
    video.currentTime = ((e.pageX - offsetLeftSlider) * video.duration) / NUMBER_OF_TICK;
    knobMin.style.left = e.pageX - (offsetLeftSlider + WIDTH_MID_KNOB_MIN / 2) + "px";
    if (segmentFeedback.displayed) {
      if (video.currentTime > segmentFeedback.endDurationVideo) {
        feedbackOnSliderVideo(false);
      }
    }
  }
};



function feedbackOnSliderVideo(onOff) {
  segmentFeedback.endPosition = parseInt(segmentFeedback.startPostion) + parseInt(segmentFeedback.width);
  var sliderToV = sliderToVideo(segmentFeedback.startPostion, segmentFeedback.endPosition);
  segmentFeedback.startDurationVideo = sliderToV.startDuration;
  segmentFeedback.endDurationVideo = sliderToV.endDuration;
  segmentFeedback.displayed = onOff;
  if (onOff) {
    //segmentFeedback.divGraphicalObject.style.marginLeft = segmentFeedback.startPostion;
    //minus 2 because we need to get 2 frame before the segment
    segmentFeedback.divGraphicalObject.style.marginLeft = parseInt(segmentFeedback.startPostion)  + "px"; //  segmentFeedback.startPostion;
    segmentFeedback.divGraphicalObject.style.visibility = "visible";
    segmentFeedback.divGraphicalObject.style.width = segmentFeedback.width;
  } else {
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
  }
}

/*

function feedbackOnSliderVideo(onOff) {
  segmentFeedback.endPosition = parseInt(segmentFeedback.startPostion) + parseInt(segmentFeedback.width) ;
  var sliderToV = sliderToVideo(segmentFeedback.startPostion, segmentFeedback.endPosition);
  segmentFeedback.startDurationVideo = sliderToV.startDuration;
  segmentFeedback.endDurationVideo = sliderToV.endDuration;
  segmentFeedback.displayed = onOff;
  if (onOff) {
    //segmentFeedback.divGraphicalObject.style.marginLeft = segmentFeedback.startPostion;
    //minus 2 because we need to get 2 frame before the segment
    segmentFeedback.divGraphicalObject.style.marginLeft = parseInt(segmentFeedback.startPostion) - 100 + "px"; //  segmentFeedback.startPostion;
    segmentFeedback.divGraphicalObject.style.visibility = "visible";
    segmentFeedback.divGraphicalObject.style.width = segmentFeedback.width ;
  } else {
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
  }
}
*/


function updateTimerVideo() {
  
  let minutes = Math.floor(video.currentTime / 60);
  let seconds = Math.floor(video.currentTime - minutes * 60);
  
  
  let minutesV = Math.floor(video.duration / 60);
  let secondsV = Math.floor(video.duration - minutes * 60);
  if(isNaN(minutesV) || isNaN(secondsV)){
    minutesV = 0;
    secondsV = 0;
  }
  if (seconds < 10)
    seconds = "0" + seconds;
  timerVideo.innerHTML = minutes + ":" + seconds + "/" + minutesV+":" +  secondsV ;
}

//start position on the slider and end position on the slider
function sliderToVideo(startP, endP) {
  if(startP < 0 ){
    startP = 0;
  }
  var startDuration = Math.round(((startP * video.duration) / NUMBER_OF_TICK));
  var endDuration = Math.round(((endP * video.duration) / NUMBER_OF_TICK));
  
  return {
    startDuration: startDuration,
    endDuration: endDuration
  };
}

