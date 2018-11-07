"use strict";

var numberOfCard = 0;
var arrayCard = [];
var arrayCardDeleted = [];
var current = 0;
var commands = [];
var logger = new Logger();
logger.connect();

var CardManager = function CardManager() {
  //Here we have the command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  /* function action(command) {
     var name = command.execute.toString().substr(9, 3);
     return name.charAt(0).toUpperCase() + name.slice(1);
   }*/
  return {
    //execute a command
    execute: function execute(command) {
      command.execute(command.startP, command.endP);
      //We log the command into the server
      logger.sendAndLogCommand(command);
      //and we save the command created
      commands.push(command);
      console.log("executing : ");
      console.log(command);
    },
    //TODO will not work in the current state
    //Undo a command
    undo: function undo() {
      var command = commands.pop();
      command.undo();
      //log.add("Undo " + action(command) + ": " + command.value);
      //log.show();
    }

  };
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



function loadJSON(callback) {
  var request = new XMLHttpRequest();
  request.open("GET", "/public/logW2Json/ipad1.json", false);
  request.send(null);
  //console.log("request : "+ request.responseText);
  var my_JSON_object = JSON.parse(request.responseText);
  
  console.log(my_JSON_object);
  
  for( let k = 0 ; k <  my_JSON_object.length ; k ++){
    addingNewCardsFromJSon(my_JSON_object[k]);
  }
}/*



//dragElement(document.getElementById("card1"));

/*
addCard.addEventListener('click', function (e) {
  createNewCard();
});*/

//Add a card from a json file
function addingNewCardsFromJSon(cardInfo) {
  if (cardInfo.startP > cardInfo.endP) {
    var transit = cardInfo.startP;
    cardInfo.startP = cardInfo.endP;
    cardInfo.endP = transit;
  }
  if (cardInfo.startP < 0) {
    cardInfo.startP = 0;
  }
  var result = sliderToVideo(cardInfo.startP, cardInfo.endP);
  console.log(result);
  numberOfCard++;
  if (!cardInfo.deleted) {
    var card = Card(result.startDuration, result.endDuration, cardInfo.startP, cardInfo.endP, cardInfo);
    arrayCard.push(card);
    document.getElementById('divCardBoard').insertBefore(card.iDiv, document.getElementById('divCardBoard').firstChild);
  }
}

/**
 * Adding a card by drag and drop. The card is added in the list of cards
 * Return the card that have been created
 */
function createNewCard(startP, endP) {
  //console.log("TEST / : " + startP + " " + endP);

  if (startP > endP) {
    var transit = startP;
    startP = endP;
    endP = transit;
  }
  var result = sliderToVideo(startP, endP);
  numberOfCard++;
  //console.log("wrapperCommandAndRange : " + window.getComputedStyle(wrapperCommandAndRange).);
  var card = new Card(result.startDuration, result.endDuration, startP, endP);
  addingNewCard(card);

  /****** Test purposes - For testing actions on cards *****/
  /*var card = new Card(result.startDuration, result.endDuration,startP,endP);
  addingNewCard(card);
  let result2 = sliderToVideo(10,20);
  var card =  new Card(result2.startDuration,result2.endDuration,10,20);
  addingNewCard(card);
  let result3 = sliderToVideo(15,25);
  var card =  new Card(result3.startDuration,result3.endDuration,15,25);
  addingNewCard(card);*/
  /****** Test purposes - For testing actions on cards *****/

  return card;
}

function addingNewCard(card) {
  arrayCard.push(card);
  document.getElementById('divCardBoard').insertBefore(card.iDiv, document.getElementById('divCardBoard').firstChild);
}

function deleteCard(card) {
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
  deleteCardUI(card);
  return card;
}

function deleteCardUI(card) {
  feedbackOnSliderVideo(false);
  card.iDiv.remove();
  card.deleted = true;
}

/*------ Export card in a JSON file  -------*/
//TODO
function exportCard() {
  var arrayItemUpdated = [];
  arrayCard.forEach(function (arrayItem) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIm51bWJlck9mQ2FyZCIsImFycmF5Q2FyZCIsImFycmF5Q2FyZERlbGV0ZWQiLCJjdXJyZW50IiwiY29tbWFuZHMiLCJsb2dnZXIiLCJMb2dnZXIiLCJjb25uZWN0IiwiQ2FyZE1hbmFnZXIiLCJleGVjdXRlIiwiY29tbWFuZCIsInN0YXJ0UCIsImVuZFAiLCJzZW5kQW5kTG9nQ29tbWFuZCIsInB1c2giLCJjb25zb2xlIiwibG9nIiwidW5kbyIsInBvcCIsIndyYXBwZXJDb21tYW5kQW5kUmFuZ2UiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbiIsImNhcmRJbmZvIiwidHJhbnNpdCIsInJlc3VsdCIsInNsaWRlclRvVmlkZW8iLCJkZWxldGVkIiwiY2FyZCIsIkNhcmQiLCJzdGFydER1cmF0aW9uIiwiZW5kRHVyYXRpb24iLCJpbnNlcnRCZWZvcmUiLCJpRGl2IiwiZmlyc3RDaGlsZCIsImNyZWF0ZU5ld0NhcmQiLCJhZGRpbmdOZXdDYXJkIiwiZGVsZXRlQ2FyZCIsImRlbGV0ZUNhcmRVSSIsImZlZWRiYWNrT25TbGlkZXJWaWRlbyIsInJlbW92ZSIsImV4cG9ydENhcmQiLCJhcnJheUl0ZW1VcGRhdGVkIiwiZm9yRWFjaCIsImFycmF5SXRlbSIsIml0ZW0iLCJ1cGRhdGVJbmZvIiwic2VyaWFsaXplZEFyciIsIkpTT04iLCJzdHJpbmdpZnkiLCJkb3dubG9hZCIsImNyZWF0ZVVuaXF1ZUlkIiwiY29udGVudCIsImZpbGVOYW1lIiwiY29udGVudFR5cGUiLCJhIiwiY3JlYXRlRWxlbWVudCIsImZpbGUiLCJCbG9iIiwidHlwZSIsImhyZWYiLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJjbGljayJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxlQUFlLENBQW5CO0FBQ0EsSUFBSUMsWUFBWSxFQUFoQjtBQUNBLElBQUlDLG1CQUFtQixFQUF2QjtBQUNBLElB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anMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbnVtYmVyT2ZDYXJkID0gMDtcbnZhciBhcnJheUNhcmQgPSBbXTtcbnZhciBhcnJheUNhcmREZWxldGVkID0gW107XG52YXIgY3VycmVudCA9IDA7XG52YXIgY29tbWFuZHMgPSBbXTtcbnZhciBsb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG5sb2dnZXIuY29ubmVjdCgpO1xuXG52YXIgQ2FyZE1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgLy9IZXJlIHdlIGhhdmUgdGhlIGNvbW1hbmQgcGF0dGVybiwgc2VlIDogaHR0cHM6Ly93d3cuZG9mYWN0b3J5LmNvbS9qYXZhc2NyaXB0L2NvbW1hbmQtZGVzaWduLXBhdHRlcm5cbiAvKiBmdW5jdGlvbiBhY3Rpb24oY29tbWFuZCkge1xuICAgIHZhciBuYW1lID0gY29tbWFuZC5leGVjdXRlLnRvU3RyaW5nKCkuc3Vic3RyKDksIDMpO1xuICAgIHJldHVybiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbiAgfSovXG4gIHJldHVybiB7XG4gICAgLy9leGVjdXRlIGEgY29tbWFuZFxuICAgIGV4ZWN1dGU6IGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgICAgIGNvbW1hbmQuZXhlY3V0ZShjb21tYW5kLnN0YXJ0UCwgY29tbWFuZC5lbmRQKTtcbiAgICAgIC8vV2UgbG9nIHRoZSBjb21tYW5kIGludG8gdGhlIHNlcnZlclxuICAgICAgbG9nZ2VyLnNlbmRBbmRMb2dDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgLy9hbmQgd2Ugc2F2ZSB0aGUgY29tbWFuZCBjcmVhdGVkXG4gICAgICBjb21tYW5kcy5wdXNoKGNvbW1hbmQpO1xuICAgICAgY29uc29sZS5sb2coXCJleGVjdXRpbmcgOiBcIik7XG4gICAgICBjb25zb2xlLmxvZyhjb21tYW5kKTtcbiAgICB9LFxuICAgIC8vVE9ETyB3aWxsIG5vdCB3b3JrIGluIHRoZSBjdXJyZW50IHN0YXRlXG4gICAgLy9VbmRvIGEgY29tbWFuZFxuICAgIHVuZG86IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbW1hbmQgPSBjb21tYW5kcy5wb3AoKTtcbiAgICAgIGNvbW1hbmQudW5kbygpO1xuICAgICAgLy9sb2cuYWRkKFwiVW5kbyBcIiArIGFjdGlvbihjb21tYW5kKSArIFwiOiBcIiArIGNvbW1hbmQudmFsdWUpO1xuICAgICAgLy9sb2cuc2hvdygpO1xuICAgIH0sXG4gICAgXG4gIH1cbn07XG5cbi8qKioqIEZ1bmN0aW9uYWwgY29yZSBvZiB0aGUgY2FyZCBtYW5hZ2VyIChjcmVhdGUgYSBjYXJ0LCBkZWxldGUgYSBjYXJkIGFuZCBzYXZlIGNhcmQpICoqKioqL1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgbWFuYWcgYWxsIHRoZSBjYXJkcyBjcmVhdGVkLiBUaGlzIGlzIHRoZSBzZWdtZW50IGhpc3RvcnkuXG4gKiBAdHlwZSB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICovXG52YXIgd3JhcHBlckNvbW1hbmRBbmRSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlckNvbW1hbmRBbmRSYW5nZWlkXCIpO1xuXG4vL1RPRE8gU2F2ZSBhbmQgbG9hZCBidXR0b24sIGRvIG5vIGRlbGV0ZVxuLypzYXZlTG9nQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLGZ1bmN0aW9uIChlKSB7XG4gIGNvbnNvbGUubG9nKFwic2F2aW5nIGxvZ1wiKTtcbiAgYXJyYXlDYXJkLmZvckVhY2goZnVuY3Rpb24gKGFycmF5SXRlbSkge1xuICAgLy8gYXJyYXlJdGVtLnVwZGF0ZUluZm8oKTtcbiAgICAvL2FycmF5SXRlbS5cbiAgfSk7XG4gIGV4cG9ydENhcmRzSlNvbigpO1xuICB0ZXh0U2F2ZUxvZy5pbm5lclRleHQgPSBcIkxvZyBzYXZlZCFcIiA7XG59KTtcblxubG9hZExvZ0J0bi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICBsb2FkSlNPTihudWxsKTtcbn07XG5cbmxvYWRMb2dCdG4uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixmdW5jdGlvbiAoZSkge1xuICAvL2NvbnNvbGUubG9nKFwiQUFBQUFBXCIpO1xuICAvL3ZhciBteWRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAvL2NvbnNvbGUubG9nKCBsb2FkTG9nQnRuLnZhbHVlKTtcbn0pO1xuXG5cblxuZnVuY3Rpb24gbG9hZEpTT04oY2FsbGJhY2spIHtcbiAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxdWVzdC5vcGVuKFwiR0VUXCIsIFwiL3B1YmxpYy9sb2dXMkpzb24vaXBhZDEuanNvblwiLCBmYWxzZSk7XG4gIHJlcXVlc3Quc2VuZChudWxsKTtcbiAgLy9jb25zb2xlLmxvZyhcInJlcXVlc3QgOiBcIisgcmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICB2YXIgbXlfSlNPTl9vYmplY3QgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgXG4gIGNvbnNvbGUubG9nKG15X0pTT05fb2JqZWN0KTtcbiAgXG4gIGZvciggbGV0IGsgPSAwIDsgayA8ICBteV9KU09OX29iamVjdC5sZW5ndGggOyBrICsrKXtcbiAgICBhZGRpbmdOZXdDYXJkc0Zyb21KU29uKG15X0pTT05fb2JqZWN0W2tdKTtcbiAgfVxufS8qXG5cblxuXG4vL2RyYWdFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FyZDFcIikpO1xuXG4vKlxuYWRkQ2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gIGNyZWF0ZU5ld0NhcmQoKTtcbn0pOyovXG5cbi8vQWRkIGEgY2FyZCBmcm9tIGEganNvbiBmaWxlXG5mdW5jdGlvbiBhZGRpbmdOZXdDYXJkc0Zyb21KU29uKGNhcmRJbmZvKSB7XG4gIGlmIChjYXJkSW5mby5zdGFydFAgPiBjYXJkSW5mby5lbmRQKSB7XG4gICAgbGV0IHRyYW5zaXQgPSBjYXJkSW5mby5zdGFydFA7XG4gICAgY2FyZEluZm8uc3RhcnRQID0gY2FyZEluZm8uZW5kUDtcbiAgICBjYXJkSW5mby5lbmRQID0gdHJhbnNpdDtcbiAgfVxuICBpZiAoY2FyZEluZm8uc3RhcnRQIDwgMCkge1xuICAgIGNhcmRJbmZvLnN0YXJ0UCA9IDA7XG4gIH1cbiAgbGV0IHJlc3VsdCA9IHNsaWRlclRvVmlkZW8oY2FyZEluZm8uc3RhcnRQLCBjYXJkSW5mby5lbmRQKTtcbiAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgbnVtYmVyT2ZDYXJkKys7XG4gIGlmICghY2FyZEluZm8uZGVsZXRlZCkge1xuICAgIHZhciBjYXJkID0gQ2FyZChyZXN1bHQuc3RhcnREdXJhdGlvbiwgcmVzdWx0LmVuZER1cmF0aW9uLCBjYXJkSW5mby5zdGFydFAsIGNhcmRJbmZvLmVuZFAsIGNhcmRJbmZvKTtcbiAgICBhcnJheUNhcmQucHVzaChjYXJkKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2Q2FyZEJvYXJkJykuaW5zZXJ0QmVmb3JlKGNhcmQuaURpdiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmZpcnN0Q2hpbGQpO1xuICB9XG4gIFxufVxuXG4vKipcbiAqIEFkZGluZyBhIGNhcmQgYnkgZHJhZyBhbmQgZHJvcC4gVGhlIGNhcmQgaXMgYWRkZWQgaW4gdGhlIGxpc3Qgb2YgY2FyZHNcbiAqIFJldHVybiB0aGUgY2FyZCB0aGF0IGhhdmUgYmVlbiBjcmVhdGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZU5ld0NhcmQoc3RhcnRQLCBlbmRQKSB7XG4gIC8vY29uc29sZS5sb2coXCJURVNUIC8gOiBcIiArIHN0YXJ0UCArIFwiIFwiICsgZW5kUCk7XG4gIFxuICBpZiAoc3RhcnRQID4gZW5kUCkge1xuICAgIGxldCB0cmFuc2l0ID0gc3RhcnRQO1xuICAgIHN0YXJ0UCA9IGVuZFA7XG4gICAgZW5kUCA9IHRyYW5zaXQ7XG4gIH1cbiAgbGV0IHJlc3VsdCA9IHNsaWRlclRvVmlkZW8oc3RhcnRQLCBlbmRQKTtcbiAgbnVtYmVyT2ZDYXJkKys7XG4gIC8vY29uc29sZS5sb2coXCJ3cmFwcGVyQ29tbWFuZEFuZFJhbmdlIDogXCIgKyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh3cmFwcGVyQ29tbWFuZEFuZFJhbmdlKS4pO1xuICB2YXIgY2FyZCA9IG5ldyBDYXJkKHJlc3VsdC5zdGFydER1cmF0aW9uLCByZXN1bHQuZW5kRHVyYXRpb24sIHN0YXJ0UCwgZW5kUCk7XG4gIGFkZGluZ05ld0NhcmQoY2FyZCk7XG4gIFxuICAvKioqKioqIFRlc3QgcHVycG9zZXMgLSBGb3IgdGVzdGluZyBhY3Rpb25zIG9uIGNhcmRzICoqKioqL1xuICAvKnZhciBjYXJkID0gbmV3IENhcmQocmVzdWx0LnN0YXJ0RHVyYXRpb24sIHJlc3VsdC5lbmREdXJhdGlvbixzdGFydFAsZW5kUCk7XG4gIGFkZGluZ05ld0NhcmQoY2FyZCk7XG4gIGxldCByZXN1bHQyID0gc2xpZGVyVG9WaWRlbygxMCwyMCk7XG4gIHZhciBjYXJkID0gIG5ldyBDYXJkKHJlc3VsdDIuc3RhcnREdXJhdGlvbixyZXN1bHQyLmVuZER1cmF0aW9uLDEwLDIwKTtcbiAgYWRkaW5nTmV3Q2FyZChjYXJkKTtcbiAgbGV0IHJlc3VsdDMgPSBzbGlkZXJUb1ZpZGVvKDE1LDI1KTtcbiAgdmFyIGNhcmQgPSAgbmV3IENhcmQocmVzdWx0My5zdGFydER1cmF0aW9uLHJlc3VsdDMuZW5kRHVyYXRpb24sMTUsMjUpO1xuICBhZGRpbmdOZXdDYXJkKGNhcmQpOyovXG4gIC8qKioqKiogVGVzdCBwdXJwb3NlcyAtIEZvciB0ZXN0aW5nIGFjdGlvbnMgb24gY2FyZHMgKioqKiovXG4gIFxuICByZXR1cm4gY2FyZDtcbn1cblxuZnVuY3Rpb24gYWRkaW5nTmV3Q2FyZChjYXJkKSB7XG4gIGFycmF5Q2FyZC5wdXNoKGNhcmQpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2Q2FyZEJvYXJkJykuaW5zZXJ0QmVmb3JlKGNhcmQuaURpdiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmZpcnN0Q2hpbGQpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVDYXJkKGNhcmQpIHtcbiAgLy9TdXBwcmltZSBsYSBjYXJ0ZSBkZSBsYSBsaXN0ZSBkZSBjYXJ0ZVxuICAvKmZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlDYXJkLmxlbmd0aCAgIDsgaSsrKSB7XG4gICAgaWYoYXJyYXlDYXJkW2ldICA9PT0gY2FyZCl7XG4gICAgICB2YXIgc3VwQ2FyZCA9IGFycmF5Q2FyZC5zcGxpY2UoaSwxKTtcbiAgICAgIGFycmF5Q2FyZERlbGV0ZWQucHVzaChzdXBDYXJkKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGVsZXRlZCBjYXJkIDogXCIpO1xuICAgICAgY29uc29sZS5sb2coc3VwQ2FyZCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH0qL1xuICAvL2RlbGV0ZUNhcmRVSShjYXJkKTtcbiAgLyphcnJheUNhcmREZWxldGVkLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGNvbnNvbGUubG9nKCAgIGVsZW1lbnQpO1xuICB9KTtcbiAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gIGFycmF5Q2FyZC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgfSk7Ki9cbiAgZGVsZXRlQ2FyZFVJKGNhcmQpO1xuICByZXR1cm4gY2FyZDtcbn1cblxuZnVuY3Rpb24gZGVsZXRlQ2FyZFVJKGNhcmQpIHtcbiAgZmVlZGJhY2tPblNsaWRlclZpZGVvKGZhbHNlKTtcbiAgY2FyZC5pRGl2LnJlbW92ZSgpO1xuICBjYXJkLmRlbGV0ZWQgPSB0cnVlXG59XG5cblxuLyotLS0tLS0gRXhwb3J0IGNhcmQgaW4gYSBKU09OIGZpbGUgIC0tLS0tLS0qL1xuLy9UT0RPXG5mdW5jdGlvbiBleHBvcnRDYXJkKCkge1xuICB2YXIgYXJyYXlJdGVtVXBkYXRlZCA9IFtdO1xuICBhcnJheUNhcmQuZm9yRWFjaChmdW5jdGlvbihhcnJheUl0ZW0pIHtcbiAgICAvL2FycmF5SXRlbS51cGRhdGVJbmZvKCk7XG4gICAgdmFyIGl0ZW0gPSBhcnJheUl0ZW0udXBkYXRlSW5mbygpO1xuICAgIGFycmF5SXRlbVVwZGF0ZWQucHVzaChpdGVtKTtcbiAgICAvLyBjb25zb2xlLmxvZyhpdGVtKTtcbiAgfSk7XG4gIHZhciBzZXJpYWxpemVkQXJyID0gSlNPTi5zdHJpbmdpZnkoW2FycmF5SXRlbVVwZGF0ZWQsIG51bWJlck9mQ2FyZF0pO1xuICBjb25zb2xlLmxvZyhcIioqKioqICBTZXJpYWxpc2F0aW9uIG9mIGNhcmQgY29tcGxldGUgOiBcIiArIHNlcmlhbGl6ZWRBcnIpO1xuICBkb3dubG9hZChzZXJpYWxpemVkQXJyLCAnanNvblcybG9nLScgKyBjcmVhdGVVbmlxdWVJZCgpICsgJy50eHQnLCAndGV4dC9wbGFpbicpO1xufTtcblxuZnVuY3Rpb24gZG93bmxvYWQoY29udGVudCwgZmlsZU5hbWUsIGNvbnRlbnRUeXBlKSB7XG4gIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gIHZhciBmaWxlID0gbmV3IEJsb2IoW2NvbnRlbnRdLCB7XG4gICAgdHlwZTogY29udGVudFR5cGVcbiAgfSk7XG4gIGEuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG4gIGEuZG93bmxvYWQgPSBmaWxlTmFtZTtcbiAgYS5jbGljaygpO1xufSJdfQ==