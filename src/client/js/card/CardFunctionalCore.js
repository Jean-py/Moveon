var commands = [];


var CardFunctionalCore = function() {
  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    execute: function(command) {
      command.execute();
      //We send the command to the server (the server log it into a file, see ./src/server/ServerLogger)
      logger.sendAndLogCommand(command);
      //and we save the command created
      commands.push(command);
      
    },
  }
};

//Pas de commande pour cette function pour l'instant
function playCard(iDiv,startDurationParam){
  console.log('play card in card functionalCore ');
  console.log(iDiv);
  
   //video.currentTime = startDurationParam;
  player.seekTo(startDurationParam);
  segmentFeedback.width = iDiv.style.width;
  segmentFeedback.startPostion = iDiv.style.left;
  //feedbackOnSliderVideo(true);
}


//Pas de commande pour cette function pour l'instant
function playCardOnce(iDiv,startDurationParam,endP,speedRate){
  console.log('play card in card functionalCore ');
  console.log(iDiv);
  
  player.seekTo(startDurationParam);
  segmentFeedback.width = iDiv.style.width;
  segmentFeedback.startPostion = iDiv.style.left;
  player.play();
  //feedbackOnSliderVideo(true);
  
}

var repetPartOfVideo = function (start,end, numberOfRepetition,speedRate) {
  console.log("function  - repetPartOfVideo" , start,end, numberOfRepetition,speedRate);
  
  //TODO trim de video ce fait avec cette commande
  /*video_current.timeOffset({
    start: this.start, // in seconds
    end: this.end
  });*/
  
  
  isPlayingCard = true;
  // faster speed initially
  video_current.playbackRate(speedRate);
  video_current.currentTime(start);
  
  video_current.ready(function(){
    video_current.abLoopPlugin.setStart(start).setEnd(end).playLoop();
  });
  
  //console.log("function  - repetPartOfVideo [play part] l87 videoCommand");
  play();
 /* video_current.ontimeupdate = function() {
    
    if(isPlayingCard){
      if ((end > start ) &&  repet > 0 ) {
        if (video_current.currentTime()   > end) {
          repet--;
          video_current.currentTime(start);
        }
      } else {
        video_current.ontimeupdate = null;
        feedbackOnSliderVideo(false);
        video_current.playbackRate(1);
      }
    }
    
  };*/
};

function modifyCardDescription(){
  this.card.description = this.text;
}
function modifyCardSpeed(){
  console.log("SPEEED  : "  ,this.speed)
  this.card.speed = this.speed;
}

function modifyCardNbRepet(){
  this.card.repetitionNumber = this.repetitionNumber;
}




