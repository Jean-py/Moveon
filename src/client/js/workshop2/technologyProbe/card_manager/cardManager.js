var numberOfCard = 0;
var arrayCard = [];
//var arrayCardDeleted = [];
var commands = [];


var CardManager = function() {
  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    execute: function(command) {
      //if this is a delete command then card is an argument of the command
      /*switch (command.execute.name){
        case "deleteCard" : {
          command.execute(command.card);
          break;
        }
        case "createNewCard" :
          command.execute(command.startP, command.endP);
          break;
        default:
          command.execute();
          break;
      }*/
     command.execute();
      //We send the command to the server (the server log it into a file, see ./src/server/ServerLogger)
      logger.sendAndLogCommand(command);
      //and we save the command created
      commands.push(command);
    },
    //Undo a command
    undo: function() {
      //TODO
      var command = commands.pop();
      command.undo();
    },
    
  }
};

/**** Functional core of the card manager (create a cart, delete a card and save card) *****/
/**
 * This class manag all the cards created. This is the segment history.
 * @type {HTMLElement | null}
 */
var wrapperCommandAndRange = document.getElementById("wrapperCommandAndRangeid");

//TODO Save and load button, do no delete
/*saveLogBtn.addEventListener("touchend",function (e) {
  console.log("saving log");
  arrayCard.forEach(function (arrayItem) {
   // arrayItem.updateInfo();
    //arrayItem.
  });
  exportCardsJSon();
  textSaveLog.innerText = "Log saved!" ;
});

loadLogBtn.onclick = function () {
  loadJSON(null);
};

loadLogBtn.addEventListener("mouseup",function (e) {
  //console.log("AAAAAA");
  //var mydata = JSON.parse(data);
  //console.log( loadLogBtn.value);
});



/*



//dragElement(document.getElementById("card1"));


addCard.addEventListener('click', function (e) {
  createNewCard();
});*/


function cleanSegmentHistory(){
  console.log("TESTING");
  clearAllTimer();
  arrayCard.forEach(function(e){
      deleteCardUI(e);
  });
}

function loadJSON() {
  var files = document.getElementById('logFileLoad').files;
  if (!files.length) {
    alert('Please select a file!');
    return;
  }
  
  var file = files[0];
  var start =  0;
  var stop = file.size - 1;
  
  var reader = new FileReader();
  var test = 0;
  
  // If we use onloadend, we need to check the readyState.
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      var test = evt.target.result;
      console.log('Read bytes: ', start + 1, ' - ', stop + 1,
          ' of ', file.size, ' byte file' );
      console.log(test);
      var my_JSON_object = JSON.parse(test);
  
      console.log(my_JSON_object);
  
      for (let k = 0; k < my_JSON_object.length; k++) {
        addingNewCardsFromJSon(my_JSON_object[k]);
      }
  
    }
  };
  var blob = file.slice(start, stop + 1);
  reader.readAsBinaryString(blob);
}

//Add a card from a json file
function addingNewCardsFromJSon(cardInfo) {
  if (cardInfo.startP > cardInfo.endP) {
    let transit = cardInfo.startP;
    cardInfo.startP = cardInfo.endP;
    cardInfo.endP = transit;
  }
  if (cardInfo.startP < 0) {
    cardInfo.startP = 0;
  }
  let result = sliderToVideo(cardInfo.startP, cardInfo.endP);
  console.log(result);
  numberOfCard++;
  if (!cardInfo.deleted) {
    var card = Card(result.startDuration, result.endDuration, cardInfo.startP, cardInfo.endP, cardInfo);
    cardManager.execute(new CreateNewCardCommand(card));
    arrayCard.push(card);
    //document.getElementById('divCardBoard').insertBefore(card.iDiv, document.getElementById('divCardBoard').firstChild);
  }
}

/**
 * Adding a card by drag and drop. The card is added in the list of cards
 * Return the card that have been created
 */
function createNewCard(startP, endP) {
  //console.log("TEST / : " + startP + " " + endP);
  if (startP > endP) {
    let transit = startP;
    startP = endP;
    endP = transit;
  }
  let result = sliderToVideo(startP, endP);
  numberOfCard++;
  var card = new Card(result.startDuration, result.endDuration, startP, endP);
  cardManager.execute(new CreateNewCardCommand(card));
  return card;
}

function addingNewCard() {
  arrayCard.push(this.card);
  document.getElementById('divCardBoard').insertBefore(this.card.iDiv, document.getElementById('divCardBoard').firstChild);
}

function deleteCard() {
  //Supprime la carte de la liste de carte
  /*for (let i = 0; i < arrayCard.length   ; i++) {
    if(arrayCard[i]  === card){
      var supCard = arrayCard.splice(i,1);
      arrayCardDeleted.push(supCard);
      console.log("deleted card : ");
      console.log(supCard);
      break;
    }
  }*/
  //deleteCardUI(card);
  /*arrayCardDeleted.forEach(function(element) {
    console.log(   element);
  });
  console.log("************************");
  arrayCard.forEach(function(element) {
    console.log(element);
  });*/
  clearAllTimer();
  deleteCardUI(this.card);
  return this.card;
}

function deleteCardUI(card) {
  feedbackOnSliderVideo(false);
  card.iDiv.remove();
  card.deleted = true
}


/*------ Export card in a JSON file  -------*/
//TODO
function exportCard() {
  var arrayItemUpdated = [];
  arrayCard.forEach(function(arrayItem) {
    //arrayItem.updateInfo();
    var item = arrayItem.updateInfo();
    arrayItemUpdated.push(item);
    // console.log(item);
  });
  var serializedArr = JSON.stringify([arrayItemUpdated, numberOfCard]);
  console.log("*****  Serialisation of card complete : " + serializedArr);
  download(serializedArr, 'jsonW2log-' + createUniqueId() + '.txt', 'text/plain');
};

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {
    type: contentType
  });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}