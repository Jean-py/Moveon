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
      command.execute();
      //We send the command to the server (the server log it into a file, see ./src/server/ServerLogger)
      logger.sendAndLogCommand(command);
      //and we save the command created
      commands.push(command);
      console.log("executing : ");
      console.log(command);
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
    this.src="/media/workshop2/videoCommand/volumeFull.png";
    // Update the button text
    muteButton.innerHTML = "Mute";
  }
};

var repetPartOfVideo = function (start,end, numberOfRepetition,speedRate) {
  //console.log("function  - repetPartOfVideo");
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

var playPausecallback = function(e){
  //console.log("callback play-pause, e : " + e);
  if(e != null && e !== undefined){
    e.preventDefault();
  }
  if (video.paused || video.ended ) {
      play();
    } else {
      pause();
    }
};