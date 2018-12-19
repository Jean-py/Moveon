var commands = [];


var CardFunctionalCore = function() {
  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    execute: function(command) {
  
      switch (command.execute.name){
       case "modifyCardDescription" : {
         command.execute(command.card, command.text);
         break;
       }
       case "modifyCardSpeed" :
         //console.log("KOKOKOK");
         command.execute(command.card, command.speed);
         break;
         case "modifyCardNbRepet" :
           command.execute(command.card, command.nbRepet);
           break;
       default:
         command.execute();
         break;
     }
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
  video.currentTime = startDurationParam;
  segmentFeedback.width = iDiv.style.width;
  segmentFeedback.startPostion = iDiv.style.left;
  feedbackOnSliderVideo(true);
}


function modifyCardDescription(card,text){
  //window.getElementById(id_card).
  //description = text;
  card.description  = text;
}



function modifyCardSpeed(card,speed){
  
  //let nbRepet = selectNbRepet.options[selectNbRepet.selectedIndex].value;
  card.speed = speed;
  
}

function modifyCardNbRepet(card,nbRepet){
  //let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
  card.nbRepet = nbRepet;
  
}


