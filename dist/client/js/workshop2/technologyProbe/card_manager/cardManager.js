"use strict";

var numberOfCard = 0;
var arrayCard = [];
//var arrayCardDeleted = [];
var commands = [];

var CardManager = function CardManager() {
  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    execute: function execute(command) {
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
      command.execute(command.card);
      //We send the command to the server (the server log it into a file, see ./src/server/ServerLogger)
      logger.sendAndLogCommand(command);
      //and we save the command created
      commands.push(command);
      console.log("executing : ");
      console.log(command);
    },
    //Undo a command
    undo: function undo() {
      //TODO
      var command = commands.pop();
      command.undo();
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

  cardManager.execute(new CreateNewCardCommand(card));
  // addingNewCard(card);

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
  clearAllTimer();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIm51bWJlck9mQ2FyZCIsImFycmF5Q2FyZCIsImNvbW1hbmRzIiwiQ2FyZE1hbmFnZXIiLCJleGVjdXRlIiwiY29tbWFuZCIsImNhcmQiLCJsb2dnZXIiLCJzZW5kQW5kTG9nQ29tbWFuZCIsInB1c2giLCJjb25zb2xlIiwibG9nIiwidW5kbyIsInBvcCIsIndyYXBwZXJDb21tYW5kQW5kUmFuZ2UiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbiIsImNhcmRJbmZvIiwic3RhcnRQIiwiZW5kUCIsInRyYW5zaXQiLCJyZXN1bHQiLCJzbGlkZXJUb1ZpZGVvIiwiZGVsZXRlZCIsIkNhcmQiLCJzdGFydER1cmF0aW9uIiwiZW5kRHVyYXRpb24iLCJpbnNlcnRCZWZvcmUiLCJpRGl2IiwiZmlyc3RDaGlsZCIsImNyZWF0ZU5ld0NhcmQiLCJjYXJkTWFuYWdlciIsIkNyZWF0ZU5ld0NhcmRDb21tYW5kIiwiYWRkaW5nTmV3Q2FyZCIsImRlbGV0ZUNhcmQiLCJjbGVhckFsbFRpbWVyIiwiZGVsZXRlQ2FyZFVJIiwiZmVlZGJhY2tPblNsaWRlclZpZGVvIiwicmVtb3ZlIiwiZXhwb3J0Q2FyZCIsImFycmF5SXRlbVVwZGF0ZWQiLCJmb3JFYWNoIiwiYXJyYXlJdGVtIiwiaXRlbSIsInVwZGF0ZUluZm8iLCJzZXJpYWxpemVkQXJyIiwiSlNPTiIsInN0cmluZ2lmeSIsImRvd25sb2FkIiwiY3JlYXRlVW5pcXVlSWQiLCJjb250ZW50IiwiZmlsZU5hbWUiLCJjb250ZW50VHlwZSIsImEiLCJjcmVhdGVFbGVtZW50IiwiZmlsZSIsIkJsb2IiLCJ0eXBlIiwiaHJlZiIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImNsaWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGVBQWUsQ0FBbkI7QUFDQSxJQUFJQyxZQUFZLEVBQWhCO0FBQ0E7QUFDQSxJQUFJQyxXQUFXLEVBQWY7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ZXJPZkNhcmQgPSAwO1xudmFyIGFycmF5Q2FyZCA9IFtdO1xuLy92YXIgYXJyYXlDYXJkRGVsZXRlZCA9IFtdO1xudmFyIGNvbW1hbmRzID0gW107XG5cblxudmFyIENhcmRNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gIC8vSSBpbXBsZW1lbnRlZCBhIGNvbW1hbmQgcGF0dGVybiwgc2VlIDogaHR0cHM6Ly93d3cuZG9mYWN0b3J5LmNvbS9qYXZhc2NyaXB0L2NvbW1hbmQtZGVzaWduLXBhdHRlcm5cbiAgcmV0dXJuIHtcbiAgICAvL2V4ZWN1dGUgYSBjb21tYW5kXG4gICAgZXhlY3V0ZTogZnVuY3Rpb24oY29tbWFuZCkge1xuICAgICAgLy9pZiB0aGlzIGlzIGEgZGVsZXRlIGNvbW1hbmQgdGhlbiBjYXJkIGlzIGFuIGFyZ3VtZW50IG9mIHRoZSBjb21tYW5kXG4gICAgICAvKnN3aXRjaCAoY29tbWFuZC5leGVjdXRlLm5hbWUpe1xuICAgICAgICBjYXNlIFwiZGVsZXRlQ2FyZFwiIDoge1xuICAgICAgICAgIGNvbW1hbmQuZXhlY3V0ZShjb21tYW5kLmNhcmQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJjcmVhdGVOZXdDYXJkXCIgOlxuICAgICAgICAgIGNvbW1hbmQuZXhlY3V0ZShjb21tYW5kLnN0YXJ0UCwgY29tbWFuZC5lbmRQKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb21tYW5kLmV4ZWN1dGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH0qL1xuICAgICBjb21tYW5kLmV4ZWN1dGUoY29tbWFuZC5jYXJkKTtcbiAgICAgIC8vV2Ugc2VuZCB0aGUgY29tbWFuZCB0byB0aGUgc2VydmVyICh0aGUgc2VydmVyIGxvZyBpdCBpbnRvIGEgZmlsZSwgc2VlIC4vc3JjL3NlcnZlci9TZXJ2ZXJMb2dnZXIpXG4gICAgICBsb2dnZXIuc2VuZEFuZExvZ0NvbW1hbmQoY29tbWFuZCk7XG4gICAgICAvL2FuZCB3ZSBzYXZlIHRoZSBjb21tYW5kIGNyZWF0ZWRcbiAgICAgIGNvbW1hbmRzLnB1c2goY29tbWFuZCk7XG4gICAgICBjb25zb2xlLmxvZyhcImV4ZWN1dGluZyA6IFwiKTtcbiAgICAgIGNvbnNvbGUubG9nKGNvbW1hbmQpO1xuICAgIH0sXG4gICAgLy9VbmRvIGEgY29tbWFuZFxuICAgIHVuZG86IGZ1bmN0aW9uKCkge1xuICAgICAgLy9UT0RPXG4gICAgICB2YXIgY29tbWFuZCA9IGNvbW1hbmRzLnBvcCgpO1xuICAgICAgY29tbWFuZC51bmRvKCk7XG4gICAgfSxcbiAgICBcbiAgfVxufTtcblxuLyoqKiogRnVuY3Rpb25hbCBjb3JlIG9mIHRoZSBjYXJkIG1hbmFnZXIgKGNyZWF0ZSBhIGNhcnQsIGRlbGV0ZSBhIGNhcmQgYW5kIHNhdmUgY2FyZCkgKioqKiovXG4vKipcbiAqIFRoaXMgY2xhc3MgbWFuYWcgYWxsIHRoZSBjYXJkcyBjcmVhdGVkLiBUaGlzIGlzIHRoZSBzZWdtZW50IGhpc3RvcnkuXG4gKiBAdHlwZSB7SFRNTEVsZW1lbnQgfCBudWxsfVxuICovXG52YXIgd3JhcHBlckNvbW1hbmRBbmRSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlckNvbW1hbmRBbmRSYW5nZWlkXCIpO1xuXG4vL1RPRE8gU2F2ZSBhbmQgbG9hZCBidXR0b24sIGRvIG5vIGRlbGV0ZVxuLypzYXZlTG9nQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLGZ1bmN0aW9uIChlKSB7XG4gIGNvbnNvbGUubG9nKFwic2F2aW5nIGxvZ1wiKTtcbiAgYXJyYXlDYXJkLmZvckVhY2goZnVuY3Rpb24gKGFycmF5SXRlbSkge1xuICAgLy8gYXJyYXlJdGVtLnVwZGF0ZUluZm8oKTtcbiAgICAvL2FycmF5SXRlbS5cbiAgfSk7XG4gIGV4cG9ydENhcmRzSlNvbigpO1xuICB0ZXh0U2F2ZUxvZy5pbm5lclRleHQgPSBcIkxvZyBzYXZlZCFcIiA7XG59KTtcblxubG9hZExvZ0J0bi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICBsb2FkSlNPTihudWxsKTtcbn07XG5cbmxvYWRMb2dCdG4uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixmdW5jdGlvbiAoZSkge1xuICAvL2NvbnNvbGUubG9nKFwiQUFBQUFBXCIpO1xuICAvL3ZhciBteWRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAvL2NvbnNvbGUubG9nKCBsb2FkTG9nQnRuLnZhbHVlKTtcbn0pO1xuXG5cblxuZnVuY3Rpb24gbG9hZEpTT04oY2FsbGJhY2spIHtcbiAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxdWVzdC5vcGVuKFwiR0VUXCIsIFwiL3B1YmxpYy9sb2dXMkpzb24vaXBhZDEuanNvblwiLCBmYWxzZSk7XG4gIHJlcXVlc3Quc2VuZChudWxsKTtcbiAgLy9jb25zb2xlLmxvZyhcInJlcXVlc3QgOiBcIisgcmVxdWVzdC5yZXNwb25zZVRleHQpO1xuICB2YXIgbXlfSlNPTl9vYmplY3QgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgXG4gIGNvbnNvbGUubG9nKG15X0pTT05fb2JqZWN0KTtcbiAgXG4gIGZvciggbGV0IGsgPSAwIDsgayA8ICBteV9KU09OX29iamVjdC5sZW5ndGggOyBrICsrKXtcbiAgICBhZGRpbmdOZXdDYXJkc0Zyb21KU29uKG15X0pTT05fb2JqZWN0W2tdKTtcbiAgfVxufS8qXG5cblxuXG4vL2RyYWdFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FyZDFcIikpO1xuXG4vKlxuYWRkQ2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gIGNyZWF0ZU5ld0NhcmQoKTtcbn0pOyovXG5cbi8vQWRkIGEgY2FyZCBmcm9tIGEganNvbiBmaWxlXG5mdW5jdGlvbiBhZGRpbmdOZXdDYXJkc0Zyb21KU29uKGNhcmRJbmZvKSB7XG4gIGlmIChjYXJkSW5mby5zdGFydFAgPiBjYXJkSW5mby5lbmRQKSB7XG4gICAgbGV0IHRyYW5zaXQgPSBjYXJkSW5mby5zdGFydFA7XG4gICAgY2FyZEluZm8uc3RhcnRQID0gY2FyZEluZm8uZW5kUDtcbiAgICBjYXJkSW5mby5lbmRQID0gdHJhbnNpdDtcbiAgfVxuICBpZiAoY2FyZEluZm8uc3RhcnRQIDwgMCkge1xuICAgIGNhcmRJbmZvLnN0YXJ0UCA9IDA7XG4gIH1cbiAgbGV0IHJlc3VsdCA9IHNsaWRlclRvVmlkZW8oY2FyZEluZm8uc3RhcnRQLCBjYXJkSW5mby5lbmRQKTtcbiAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgbnVtYmVyT2ZDYXJkKys7XG4gIGlmICghY2FyZEluZm8uZGVsZXRlZCkge1xuICAgIHZhciBjYXJkID0gQ2FyZChyZXN1bHQuc3RhcnREdXJhdGlvbiwgcmVzdWx0LmVuZER1cmF0aW9uLCBjYXJkSW5mby5zdGFydFAsIGNhcmRJbmZvLmVuZFAsIGNhcmRJbmZvKTtcbiAgICBhcnJheUNhcmQucHVzaChjYXJkKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2Q2FyZEJvYXJkJykuaW5zZXJ0QmVmb3JlKGNhcmQuaURpdiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmZpcnN0Q2hpbGQpO1xuICB9XG4gIFxufVxuXG4vKipcbiAqIEFkZGluZyBhIGNhcmQgYnkgZHJhZyBhbmQgZHJvcC4gVGhlIGNhcmQgaXMgYWRkZWQgaW4gdGhlIGxpc3Qgb2YgY2FyZHNcbiAqIFJldHVybiB0aGUgY2FyZCB0aGF0IGhhdmUgYmVlbiBjcmVhdGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZU5ld0NhcmQoc3RhcnRQLCBlbmRQKSB7XG4gIC8vY29uc29sZS5sb2coXCJURVNUIC8gOiBcIiArIHN0YXJ0UCArIFwiIFwiICsgZW5kUCk7XG4gIFxuICBpZiAoc3RhcnRQID4gZW5kUCkge1xuICAgIGxldCB0cmFuc2l0ID0gc3RhcnRQO1xuICAgIHN0YXJ0UCA9IGVuZFA7XG4gICAgZW5kUCA9IHRyYW5zaXQ7XG4gIH1cbiAgbGV0IHJlc3VsdCA9IHNsaWRlclRvVmlkZW8oc3RhcnRQLCBlbmRQKTtcbiAgbnVtYmVyT2ZDYXJkKys7XG4gIC8vY29uc29sZS5sb2coXCJ3cmFwcGVyQ29tbWFuZEFuZFJhbmdlIDogXCIgKyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh3cmFwcGVyQ29tbWFuZEFuZFJhbmdlKS4pO1xuICB2YXIgY2FyZCA9IG5ldyBDYXJkKHJlc3VsdC5zdGFydER1cmF0aW9uLCByZXN1bHQuZW5kRHVyYXRpb24sIHN0YXJ0UCwgZW5kUCk7XG4gIFxuICBcbiAgY2FyZE1hbmFnZXIuZXhlY3V0ZShuZXcgQ3JlYXRlTmV3Q2FyZENvbW1hbmQoY2FyZCkpO1xuIC8vIGFkZGluZ05ld0NhcmQoY2FyZCk7XG4gIFxuICAvKioqKioqIFRlc3QgcHVycG9zZXMgLSBGb3IgdGVzdGluZyBhY3Rpb25zIG9uIGNhcmRzICoqKioqL1xuICAvKnZhciBjYXJkID0gbmV3IENhcmQocmVzdWx0LnN0YXJ0RHVyYXRpb24sIHJlc3VsdC5lbmREdXJhdGlvbixzdGFydFAsZW5kUCk7XG4gIGFkZGluZ05ld0NhcmQoY2FyZCk7XG4gIGxldCByZXN1bHQyID0gc2xpZGVyVG9WaWRlbygxMCwyMCk7XG4gIHZhciBjYXJkID0gIG5ldyBDYXJkKHJlc3VsdDIuc3RhcnREdXJhdGlvbixyZXN1bHQyLmVuZER1cmF0aW9uLDEwLDIwKTtcbiAgYWRkaW5nTmV3Q2FyZChjYXJkKTtcbiAgbGV0IHJlc3VsdDMgPSBzbGlkZXJUb1ZpZGVvKDE1LDI1KTtcbiAgdmFyIGNhcmQgPSAgbmV3IENhcmQocmVzdWx0My5zdGFydER1cmF0aW9uLHJlc3VsdDMuZW5kRHVyYXRpb24sMTUsMjUpO1xuICBhZGRpbmdOZXdDYXJkKGNhcmQpOyovXG4gIC8qKioqKiogVGVzdCBwdXJwb3NlcyAtIEZvciB0ZXN0aW5nIGFjdGlvbnMgb24gY2FyZHMgKioqKiovXG4gIFxuICByZXR1cm4gY2FyZDtcbn1cblxuZnVuY3Rpb24gYWRkaW5nTmV3Q2FyZChjYXJkKSB7XG4gIGFycmF5Q2FyZC5wdXNoKGNhcmQpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2Q2FyZEJvYXJkJykuaW5zZXJ0QmVmb3JlKGNhcmQuaURpdiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmZpcnN0Q2hpbGQpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVDYXJkKGNhcmQpIHtcblxuICAvL1N1cHByaW1lIGxhIGNhcnRlIGRlIGxhIGxpc3RlIGRlIGNhcnRlXG4gIC8qZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheUNhcmQubGVuZ3RoICAgOyBpKyspIHtcbiAgICBpZihhcnJheUNhcmRbaV0gID09PSBjYXJkKXtcbiAgICAgIHZhciBzdXBDYXJkID0gYXJyYXlDYXJkLnNwbGljZShpLDEpO1xuICAgICAgYXJyYXlDYXJkRGVsZXRlZC5wdXNoKHN1cENhcmQpO1xuICAgICAgY29uc29sZS5sb2coXCJkZWxldGVkIGNhcmQgOiBcIik7XG4gICAgICBjb25zb2xlLmxvZyhzdXBDYXJkKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSovXG4gIC8vZGVsZXRlQ2FyZFVJKGNhcmQpO1xuICAvKmFycmF5Q2FyZERlbGV0ZWQuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgY29uc29sZS5sb2coICAgZWxlbWVudCk7XG4gIH0pO1xuICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqKioqKlwiKTtcbiAgYXJyYXlDYXJkLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICB9KTsqL1xuICBjbGVhckFsbFRpbWVyKCk7XG4gIGRlbGV0ZUNhcmRVSShjYXJkKTtcbiAgcmV0dXJuIGNhcmQ7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUNhcmRVSShjYXJkKSB7XG4gIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG4gIGNhcmQuaURpdi5yZW1vdmUoKTtcbiAgY2FyZC5kZWxldGVkID0gdHJ1ZVxufVxuXG5cbi8qLS0tLS0tIEV4cG9ydCBjYXJkIGluIGEgSlNPTiBmaWxlICAtLS0tLS0tKi9cbi8vVE9ET1xuZnVuY3Rpb24gZXhwb3J0Q2FyZCgpIHtcbiAgdmFyIGFycmF5SXRlbVVwZGF0ZWQgPSBbXTtcbiAgYXJyYXlDYXJkLmZvckVhY2goZnVuY3Rpb24oYXJyYXlJdGVtKSB7XG4gICAgLy9hcnJheUl0ZW0udXBkYXRlSW5mbygpO1xuICAgIHZhciBpdGVtID0gYXJyYXlJdGVtLnVwZGF0ZUluZm8oKTtcbiAgICBhcnJheUl0ZW1VcGRhdGVkLnB1c2goaXRlbSk7XG4gICAgLy8gY29uc29sZS5sb2coaXRlbSk7XG4gIH0pO1xuICB2YXIgc2VyaWFsaXplZEFyciA9IEpTT04uc3RyaW5naWZ5KFthcnJheUl0ZW1VcGRhdGVkLCBudW1iZXJPZkNhcmRdKTtcbiAgY29uc29sZS5sb2coXCIqKioqKiAgU2VyaWFsaXNhdGlvbiBvZiBjYXJkIGNvbXBsZXRlIDogXCIgKyBzZXJpYWxpemVkQXJyKTtcbiAgZG93bmxvYWQoc2VyaWFsaXplZEFyciwgJ2pzb25XMmxvZy0nICsgY3JlYXRlVW5pcXVlSWQoKSArICcudHh0JywgJ3RleHQvcGxhaW4nKTtcbn07XG5cbmZ1bmN0aW9uIGRvd25sb2FkKGNvbnRlbnQsIGZpbGVOYW1lLCBjb250ZW50VHlwZSkge1xuICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICB2YXIgZmlsZSA9IG5ldyBCbG9iKFtjb250ZW50XSwge1xuICAgIHR5cGU6IGNvbnRlbnRUeXBlXG4gIH0pO1xuICBhLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICBhLmRvd25sb2FkID0gZmlsZU5hbWU7XG4gIGEuY2xpY2soKTtcbn0iXX0=