var numberOfCard = 0;
var arrayCard = [];
//var arrayCardDeleted = [];
var commands = [];



var CardManager = function() {
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
    //Undo a command
    undo: function() {
      //TODO
      var command = commands.pop();
      command.undo();
    },
    exportCard: function(){
      console.log("function export card");
      /*------ Create a set of card from a JSON file -------*/
      var arrayItemUpdated = [];
      var listSegment = document.getElementsByClassName('segment');
      //playCard(arrayItem.iDiv, arrayItem.startP);
      console.log(listSegment);
      
      for (var i = 0; i < listSegment.length; i++) {
        console.log(listSegment[i].id); //second console output
        triggerMouseEvent(listSegment[i],'mousedown');
      }
        arrayCard.forEach(function(arrayItem) {
          console.log(arrayItem);
          var item = arrayItem.updateInfo();
          arrayItemUpdated.push(item);
          console.log(item);
        });
        var serializedArr = JSON.stringify(arrayItemUpdated);
        console.log("*****  Serialisation of card complete : " + serializedArr);
        download(serializedArr, 'jsonW2log-' + createUniqueId() + '.json', 'text/plain');
        
        logger.saveSH(serializedArr);
    }, loadSegmentHistoryFromServer: function(){
      
    
      //We charge all the video only one time
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'src/server/log-SH/SH_all_path.txt', true);
      xhr.onreadystatechange = function () {
        console.log(this.responseText);
      };
      xhr.send();
    
    
    },
    
    
  }
};


/*Private function, do not call outside the CardManager*/


function triggerMouseEvent (node, eventType) {
  var clickEvent = document.createEvent ('MouseEvents');
  clickEvent.initEvent (eventType, true, true);
  node.dispatchEvent (clickEvent);
}

/**** Functional core of the card manager (create a cart, delete a card and save card) *****/
/**
 * This class manag all the cards created. This is the segment history.
 * @type {HTMLElement | null}
 */
var wrapperCommandAndRange = document.getElementById("wrapperCommandAndRangeid");



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
  console.log(cardInfo.startP, cardInfo.endP);
  let result = Player.sliderToVideo(cardInfo.startP, cardInfo.endP);
  //console.log(result);
  numberOfCard++;
  if (!cardInfo.deleted) {
    console.log(result.startDuration, result.endDuration, cardInfo.startP, cardInfo.endP, cardInfo);
    var card = Card(result.startDuration, result.endDuration, cardInfo.startP, cardInfo.endP, cardInfo);
    cardManager.execute(new CreateNewCardCommand(card));
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
  let result = Player.sliderToVideo(startP, endP);
  numberOfCard++;
  console.log(result);
  
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

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  
  
 //a.style.display = "block";
  var file = new Blob([content], {
    type: contentType
  });
  
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  a.remove();
  
  
  
  
}



function loadJSONSegmentHistory1() {
  
      console.log(generateJSONfromvar());
      
      let generatedJson = generateJSONfromvar();
      var my_JSON_object = JSON.parse(generatedJson);
      console.log(my_JSON_object);
      for (let k = 0; k < my_JSON_object.length; k++) {
        addingNewCardsFromJSon(my_JSON_object[k]);
    }
  
}

function loadJSONSegmentHistory2() {
  let generatedJson2 = generateJSONfromvar2();
  var my_JSON_object = JSON.parse(generatedJson2);
  console.log(my_JSON_object);
  for (let k = 0; k < my_JSON_object.length; k++) {
    addingNewCardsFromJSon(my_JSON_object[k]);
  }
}

function loadJSONSegmentHistoryTutorial() {
  let generatedJson2 = generateJSONfromvarTuto();
  var my_JSON_object = JSON.parse(generatedJson2);
  console.log(my_JSON_object);
  for (let k = 0; k < my_JSON_object.length; k++) {
    addingNewCardsFromJSon(my_JSON_object[k]);
  }
}


var  loadSHHistoryfromSrv = function() {
  
  //We charge all the video only one time
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'src/client/js/workshop2/technologyProbe/card_manager/SHLoaderOverview_view.html', true);
  xhr.onreadystatechange = function () {
    if (this.readyState !== 4) return;
    if (this.status !== 200) return; // or whatever error handling you want
    document.getElementById('SHPickerOverviewModal').innerHTML = this.responseText;
    xhr.send();
    console.log('HAHAHAHA')
  
    /*
    //Code permettant de charger un SH, il suffit de recuperer tous les SH du server,
    // puis de les entrer dans une div correspondante, àa doit faire un overview je pense
    let generatedJson = generateJSONfromvar();
    var my_JSON_object = JSON.parse(generatedJson);
    console.log(my_JSON_object);
    for (let k = 0; k < my_JSON_object.length; k++) {
      addingNewCardsFromJSon(my_JSON_object[k]);
    }*/
    
    /*var elms = document.getElementById('videoPickerOverviewModal').getElementsByTagName("div");
    var video = document.getElementById('videoEAT');
    var span = document.getElementsByClassName("close")[0];
    
    span.addEventListener( "mousedown" , function() {
      modalVideo.style.display = "none";
    });
    for (var i = 0; i < elms.length; i++) {
      elms[i].addEventListener("mousedown", function (){
        //console.log(this.getElementsByTagName("source")[0].src);
        video.src = this.getElementsByTagName("source")[0].src;
        var notification_feedback = "Video successfully loaded!";
        notificationFeedback(notification_feedback);
        //modalVideo.style.display = "none";
        //modalVideo.style.visibility = "hidden";
      });
    }
  };*/
  
    
  }
}
/*

var span = document.getElementsByClassName("close")[1];
var modalSH = document.getElementById('SHPickerOverview');

span.addEventListener( "mousedown" , function() {
  modalSH.style.display = "none";
});*/
