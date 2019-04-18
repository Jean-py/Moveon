console.log("*** Charging interface Video ***");
var enum_videoplatform = {
  MP4: 1,
  YOUTUBE: 2
};
var mediaplatform = enum_videoplatform.MP4;
//var videoFunctionalCoreManager =  new Player();


var videoFunctionalCoreManager = VideoFunctionalCoreManager();

var Player = function() {
  
  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    playPausecallback: function(command) {
      playPausecallback();
    },
  
    updateTimerVideo: function () {
      updateTimerVideo();
    },
  
    createNewCard : function (startP,endP ) {
      createNewCard(startP,endP);
   },
  
    play: function()  {
      play();
    },
    plause: function()  {
      pause();
    },
    seekTo : function (startDurationParam) {
      seekTo(startDurationParam);
  
    },
    sliderToVideo : function(startP, endP) {
      return sliderToVideo(startP, endP);
    },
    repetPartOfVideo  : function(start,end, numberOfRepetition,speedRate) {
      repetPartOfVideo(start,end, numberOfRepetition,speedRate) ;
    },
  
    setSource  : function(source) {
      setSource(source) ;
    },
    mirror : function () {
      mirror();
    }
  
  
  }
};

var Player = new Player();
