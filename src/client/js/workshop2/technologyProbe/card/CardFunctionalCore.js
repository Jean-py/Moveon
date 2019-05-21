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


function modifyCardDescription(){
  this.card.description = this.text;
}
function modifyCardSpeed(){
  this.card.speed = this.speed;
}

function modifyCardNbRepet(){
  this.card.repetitionNumber = this.repetitionNumber;
}


