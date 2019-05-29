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
      var command = commands.pop();
      command.undo();
    },
    exportCard: function(){
      console.log("function export card");
      /*------ Create a set of card from a JSON file -------*/
      var arrayItemUpdated = [];
      var listSegment = document.getElementsByClassName('segment');
      //playCard(arrayItem.iDiv, arrayItem.startP);
      //console.log(listSegment);
      
      for (var i = 0; i < listSegment.length; i++) {
        console.log(listSegment[i].id);
        //trigger the segment click
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
    },
    
    loadSegmentHistoryFromServer: function(){
      //We charge all the video only one time
      var xhr_view = new XMLHttpRequest();
      xhr_view.open('GET', 'src/client/js/workshop2/technologyProbe/card_manager/SHLoaderOverview_view.html', true);
      var view_SH_html = document.getElementById('SHPickerOverviewModal');
    
      xhr_view.onreadystatechange = function () {
        if (this.readyState!==4) return;
        if (this.status!==200) return; // or whatever error handling you want
        view_SH_html.innerHTML= this.responseText;
      };
      xhr_view.send();
    
      //We charge all the video only one time
      var xhr_allPath = new XMLHttpRequest();
      xhr_allPath.open('GET', 'src/server/log-SH/SH_all_path.txt', true);
    
      xhr_allPath.onreadystatechange = function () {
        if (this.readyState!==4) return;
        if (this.status!==200) return; // or whatever error handling you want
        
        
        var lines = this.responseText.split('\n');
        for(var j = 0; j < lines.length-1; j++){
          var xhr_SH = new XMLHttpRequest();
          xhr_SH.open('GET', lines[j], true);
          xhr_SH.onreadystatechange = function () {
            //console.log(this.responseText);
            //TODO faire un quick appercu des segment H
            //Ici il faut lire les fichier json et créer un appercu de chaque
          };
          xhr_SH.send();
          var div = document.createElement('div');
          div.className = 'gridSH';
          var split = lines[j].split('/');
          //get only the name
          var nameSH = split[split.length-1];
          console.log(nameSH);
          div.innerHTML = nameSH;
          document.getElementById('SH_list').appendChild(div);
          div.setAttribute("nameSH",lines[j] );
          div.addEventListener("mousedown",function () {
            console.log(this.getAttribute("nameSH"));
            loadJSONSegmentHistory(this.getAttribute("nameSH"));
          });
        }
      };
      xhr_allPath.send();
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
/*  if (cardInfo.startP < 0) {
    cardInfo.startP = 0;
  }*/
  console.log(cardInfo.startDuration, cardInfo.endDuration);
  var result = {startDuration : cardInfo.startDuration, endDuration : cardInfo.endDuration, startP :cardInfo.startP ,endP :cardInfo.endP };
  
  //let result = player.sliderToVideo(cardInfo.startP, cardInfo.endP);
  //console.log(result);
  numberOfCard++;
  if (!cardInfo.deleted) {
    console.log(result.startDuration, result.endDuration, cardInfo.startP, cardInfo.endP, cardInfo);
    var card = Card(result.startDuration, result.endDuration, result.startP, result.endP, cardInfo);
    cardManager.execute(new CreateNewCardCommand(card));
    //document.getElementById('divCardBoard').insertBefore(card.iDiv, document.getElementById('divCardBoard').firstChild);
  }
}

/**
 * Adding a card by drag and drop. The card is added in the list of cards
 * Return the card that have been created
 */
function createNewCard(startP, endP,positionStart, positionStop) {
  //console.log("TEST / : " + startP + " " + endP, positionStart, positionStop);
  //The two cases if we create a segment backward
  if (parseFloat(positionStart) > parseFloat(positionStop)) {
    let transit = positionStart;
    positionStart = positionStop;
    positionStop = transit;
  }
  if (parseFloat(startP) > parseFloat(endP)) {
    let transit = startP;
    startP = endP;
    endP = transit;
  }
  var result = {startDuration : startP, endDuration : endP};
  numberOfCard++;
  console.log(result.startDuration, result.endDuration, positionStart, positionStop);
  
  var card = new Card(result.startDuration, result.endDuration, positionStart, positionStop);
  //var card2 = new Card(startP, endP, startP, endP);
  cardManager.execute(new CreateNewCardCommand(card));
  //cardManager.execute(new CreateNewCardCommand(card2));
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
  console.log("deleting card : ");
  card.deleted = true;
  console.log(card.deleted);
  updateSegmentFeedback(false);
  card.iDiv.remove();
  console.log(card);
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

function loadJSONSegmentHistory(SH_path) {
  
  
  var xhr_SH = new XMLHttpRequest();
  xhr_SH.open('GET', SH_path, true);
  
  xhr_SH.onreadystatechange = function () {
    if (this.readyState!==4) return;
    if (this.status!==200) return; // or whatever error handling you want
    console.log(this.responseText);
    let generatedJson2 = this.responseText;
    
    var my_JSON_object = JSON.parse(generatedJson2);
    console.log(my_JSON_object);
    for (let k = 0; k < my_JSON_object.length; k++) {
      addingNewCardsFromJSon(my_JSON_object[k]);
    }
   
  };
  xhr_SH.send();
  
  
  var elms = document.getElementById('SHPickerOverview');
  var span = document.getElementsByClassName("close")[1];
  
  span.addEventListener( "mousedown" , function() {
    elms.style.display = "none";
  });
  
}




function updateSegmentFeedback(visibility,startP,endP){
  if(visibility){
    segmentFeedback.divGraphicalObject.style.visibility = "visible";
    segmentFeedback.divGraphicalObject.style.marginLeft = endP ;
    if(parseFloat(startP,10)  > parseFloat(endP,10) ){
      segmentFeedback.divGraphicalObject.style.width = parseFloat(startP,10) - parseFloat(endP,10)  +"%";
    } else {
      segmentFeedback.divGraphicalObject.style.marginLeft = startP ;
      segmentFeedback.divGraphicalObject.style.width = parseFloat(endP,10) - parseFloat(startP,10) +"%";
    }
  } else {
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
  }
  
 
}
