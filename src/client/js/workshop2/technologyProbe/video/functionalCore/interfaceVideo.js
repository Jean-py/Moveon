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
    playPausecallback: function() {
      playPausecallback();
    },
  
    updateTimerVideo: function () {
      updateTimerVideo();
    },
  
    createNewCard : function (startP,endP, positionStart, positionStop ) {
      createNewCard(startP,endP,positionStart, positionStop);
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


var player = new Player();

