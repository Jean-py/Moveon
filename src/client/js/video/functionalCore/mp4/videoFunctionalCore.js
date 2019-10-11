
var speedrate = 1;
// Buttons
var playButton = document.getElementById("play-pause");
var muteButton = document.getElementById("mute");
// Sliders
var knobMin = document.getElementById("range-slider_handle-min");
var rangeSliderTrack = document.getElementById("rangeSliderTrack");

var divCardBoard = document.getElementById("divCardBoard");
var body = document.getElementsByTagName("BODY")[0];

//Je ne saiss pas comment rendre cette ligne automatique pour l'isntant, pourtant la taille est en auto...
var WIDTH_RANGE_SLIDER_TRACK = "960px";
//Donc pour l'instant je reste comme ça
if(rangeSliderTrack != null)
  rangeSliderTrack.style.width = WIDTH_RANGE_SLIDER_TRACK;

var isPlayingCard = false;

var mirrored = false;

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
    //console.log(videovjs);
    //videovjs.load();
    window.scrollTo(0, 1);
    
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
      if (ua.indexOf('chrome') > -1) {
      } else {
        video_current.load();
        
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
  if (video_current.muted === false) {
    // Mute the video
    video_current.muted = true;
    // Update the button text
    muteButton.innerHTML = "Unmute";
  } else {
    // Unmute the video
    video_current.muted = false;
    // Update the button text
    muteButton.innerHTML = "Mute";
  }
};



function clearAllTimer() {
  window.clearInterval(timerRepetition);
  isPlayingCard = false;
  console.log("ClearAllTimer");
  video_current.playbackRate( 1);
  //feedbackOnSliderVideo(false);
}


var play = function () {
  video_current.play();
};

var pause = function () {
  //console.log("appesl a pause");
  video_current.pause();
};

var seekTo = function(startDurationParam){
  if(startDurationParam < video_current.currentTime() )
    video_current.currentTime(startDurationParam);
};

var playPausecallback = function(e){
  //console.log("callback play-pause, e : " + e);
  /*if(e != null && e !== undefined){
    e.preventDefault();
  }*/
  //if (video_current.paused || video_current.ended ) {
  
    if (video_current.paused()) {
     videoFunctionalCoreManager.execute(new PlayCommand());
    } else {
    videoFunctionalCoreManager.execute(new PauseCommand());
  }
};

var mirror = function () {
  if(mirrored){
    
    document.getElementsByClassName("vjs-tech")[0].style.transform = "rotateY("+ 0 +"deg)";
    mirrored = false;
  } else {
    document.getElementsByClassName("vjs-tech")[0].style.transform = "rotateY("+ 180 +"deg)";
  
    video_current.style = 'rotateY('+ 180 +'deg)';
    mirrored = true;
  }
};


var plus1second = function () {
  video_current.currentTime(video_current.currentTime()+0.5);
  //video_current.play();
};


var minus1second = function () {
  video_current.currentTime(video_current.currentTime()-0.5);
  //video_current.play();
};


var setSource = function(source){
  video_current.src = source;
};


