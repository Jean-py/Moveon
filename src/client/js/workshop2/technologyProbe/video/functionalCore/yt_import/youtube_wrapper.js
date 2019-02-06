var video = document.getElementById("videoEAT");

var videotime = 0;
var timeupdater = null;
var onChangeTimer = null;

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
var VideoFunctionalCoreManagerYT = function() {
  //This is a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    execute: function(command) {
      //console.log("executing : ");
      //console.log(command);
      
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






var player = null;

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

var url_yt_chooser =  document.getElementById("yt_chooser");


url_yt_chooser.addEventListener("blur",setVideo, {passive: true});
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];

firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var id_yt_video = 'CqLL96nHUo4';
//    after the API code downloads.
// 4. The API will call this function when the video player is ready.
function onYouTubeIframeAPIReady() {



  player= new YT.Player('yt_player', {
    height: '540',
    width: '960',
    videoId: id_yt_video,
    playerVars: {  'controls': 2, 'autoplay' : 0 , 'modestbranding' : 1, 'showinfo' : 0, 'fs' : 0, 'rel' : 0 },
    events: {
      'onReady': onPlayerReady,
    }
  });

}




// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
/*var done = false;
function onPlayerStateCha  nge(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}*/
function stopVideo() {
  //player.stopVideo();
}


function setVideo(){
  var id_yt_video = yt_url_to_id(url_yt_chooser.value);
  player.loadVideoById(id_yt_video, 0, "large");
 
  console.log(id_yt_video)
}

function yt_url_to_id(url){
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    //error
  }
}




var play = function (){
  console.log("play video in youtube wrapper");
  playButton.src = '/media/workshop2/videoCommand/pauseButton.png';
  player.playVideo();
}

var pause = function (){
  player.pauseVideo();
  playButton.src='/media/workshop2/videoCommand/playButton.png';
  console.log("pause video in youtube wrapper");
}

var muteButtonCallback = function (){
  if (player.isMuted()) {
    // Mute the video
    player.unMute();
    // Update the button text
    muteButton.innerHTML = "Unmute";
  } else {
    // Unmute the video
    player.mute();
    //this.src="/media/workshop2/videoCommand/volumeFull.png";
    // Update the button text
    muteButton.innerHTML = "Mute";
  }
}



var repetPartOfVideo = function (start,end, numberOfRepetition,speedRate) {
   console.log("function  - repetPartOfVideo" , start,end, numberOfRepetition,speedRate);
  //console.log(start,end, numberOfRepetition,speedRate);
  isPlayingCard = true;
  player.setPlaybackRate(speedRate);
  player.seekTo(start, true);
  var repet = numberOfRepetition;
  
  //console.log("function  - repetPartOfVideo [play part] l87 videoCommand");
  player.playVideo();
  window.clearInterval(timeupdater);
  function testRepet() {
    
    console.log("updateTime");
    var oldTime = videotime;
    
      if(isPlayingCard){
        if ((end > start ) &&  repet > 0 ) {
          if (player.getCurrentTime() > end) {
            repet--;
            player.seekTo(start, true);
            console.log("nb repet : ", repet);
          }
        } else {
          //player.ontimeupdate = null;
          feedbackOnSliderVideo(false);
          player.setPlaybackRate(1);
  
          clearTimeout(timeupdater);
        }
      }
    
  }
  timeupdater = setInterval(testRepet, 100);
  
  
  
 
};


function updateTimerVideoYT() {
  let minutes = Math.floor(player.getCurrentTime() / 60);
  let seconds = Math.floor(player.getCurrentTime() - minutes * 60);
  let minutesVideo = Math.floor(player.getDuration() / 60);
  
  let secondsVideo = Math.floor(player.getDuration() - minutes * 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  timerVideo.innerHTML = minutes + ":" + seconds + "/" +  minutesVideo + ":" + secondsVideo ;
};


//Update knob on a laptop
var updateKnobAndVideoComputer = function(e) {
  clearAllTimer();
  //take into account offset on the left of the scroll bar (body scroll and centering the wrapper)
  
  // var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth;
  //    video.currentTime = pos * video.duration;
  var offsetLeftSlider = wrapperCommandAndRangeid.offsetLeft - body.scrollLeft; //- window.scrollLeft  ;
  
  currentValueKnob = ((e.pageX - offsetLeftSlider) * player.getDuration()) / NUMBER_OF_TICK;
  if (currentValueKnob < player.getDuration() && currentValueKnob >= 0) {
    player.seekTo(currentValueKnob, true);
    //knobMin.style.left = e.pageX - (offsetLeftSlider + WIDTH_MID_KNOB_MIN / 2) + "px";
    if (segmentFeedback.displayed) {
      if (player.getCurrentTime() > segmentFeedback.endDurationVideo) {
        feedbackOnSliderVideo(false);
      }
    }
  }
};

//Update knob on a tablet
var updateKnobAndVideo = function(event) {
  clearAllTimer();
  //  var offsetLeftSlider = wrapperCommandAndRangeid.offsetLeft+rangeSliderTrack.offsetLeft + dividCommandeVideo.offsetLeft;
  var offsetLeftSlider = wrapperCommandAndRangeid.offsetLeft; //-   ;
  //console.log("aa :  " +  body );
  var ctime = Math.round((((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length - 1].pageX) - (offsetLeftSlider)) * player.getDuration()) / NUMBER_OF_TICK );
  player.seekTo(ctime);
  //Update know position
  knobMin.style.left = ((((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length - 1].pageX)) - offsetLeftSlider)) + "px";
  if (segmentFeedback.displayed) {
    if (player.getCurrentTime() > segmentFeedback.endDurationVideo) {
      feedbackOnSliderVideo(false);
    }
  }
};


// when the player is ready, start checking the current time every 100 ms.
function onPlayerReady(event) {
  event.target.playVideo();
  function updateTime() {
        currentValueKnob = (((NUMBER_OF_TICK / player.getDuration()) * player.getCurrentTime()) + rangeSliderTrack.offsetLeft);
        // knobMin.style.left = currentValueKnob-(KNOB_WIDTH/2)+ "px" ;
        knobMin.style.left = currentValueKnob - (KNOB_WIDTH / 2) + "px";
      
      //videoSlider.value = (NUMBER_OF_TICK / video.duration) * video.currentTime;
      updateTimerVideoYT();
    
  }
  onChangeTimer = setInterval(updateTime, 50);
  
  
  //document.getElementsByClassName("ytp-load-progress")[0].addEventListener('mouseover' , function(e) {console.log("test mouse enter")} , {passive: true} );
}



function clearAllTimer() {
  window.clearInterval(timerRepetition);
  window.clearInterval(timeupdater);
  isPlayingCard = false;
  player.setPlaybackRate( 1);
  feedbackOnSliderVideo(false);
}



var playPausecallback = function(e){
  //console.log("callback play-pause, e : " + e);
  /*if(e != null && e !== undefined){
    e.preventDefault();
  }*/
  if (player.getPlayerState() == 0 || player.getPlayerState() == -1 || player.getPlayerState() == 2  ) {
    videoFunctionalCoreManager.execute(new PlayCommand());
    //play();
  } else {
    //pause();
    videoFunctionalCoreManager.execute(new PauseCommand());
    
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

//start position on the slider and end position on the slider
function sliderToVideo(startP, endP) {
  if(startP < 0 ){
    startP = 0;
  }
  var startDuration = Math.round(((startP * player.getDuration()) / NUMBER_OF_TICK));
  var endDuration = Math.round(((endP * player.getDuration()) / NUMBER_OF_TICK));
  
  return {
    startDuration: startDuration,
    endDuration: endDuration
  };
}

