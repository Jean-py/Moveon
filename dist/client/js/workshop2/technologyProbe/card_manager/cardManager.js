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
  function action(command) {
    var name = command.execute.toString().substr(9, 3);
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIm51bWJlck9mQ2FyZCIsImFycmF5Q2FyZCIsImFycmF5Q2FyZERlbGV0ZWQiLCJjdXJyZW50IiwiY29tbWFuZHMiLCJsb2dnZXIiLCJMb2dnZXIiLCJjb25uZWN0IiwiQ2FyZE1hbmFnZXIiLCJhY3Rpb24iLCJjb21tYW5kIiwibmFtZSIsImV4ZWN1dGUiLCJ0b1N0cmluZyIsInN1YnN0ciIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJzdGFydFAiLCJlbmRQIiwic2VuZEFuZExvZ0NvbW1hbmQiLCJwdXNoIiwiY29uc29sZSIsImxvZyIsInVuZG8iLCJwb3AiLCJ3cmFwcGVyQ29tbWFuZEFuZFJhbmdlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFkZGluZ05ld0NhcmRzRnJvbUpTb24iLCJjYXJkSW5mbyIsInRyYW5zaXQiLCJyZXN1bHQiLCJzbGlkZXJUb1ZpZGVvIiwiZGVsZXRlZCIsImNhcmQiLCJDYXJkIiwic3RhcnREdXJhdGlvbiIsImVuZER1cmF0aW9uIiwiaW5zZXJ0QmVmb3JlIiwiaURpdiIsImZpcnN0Q2hpbGQiLCJjcmVhdGVOZXdDYXJkIiwiYWRkaW5nTmV3Q2FyZCIsImRlbGV0ZUNhcmQiLCJkZWxldGVDYXJkVUkiLCJmZWVkYmFja09uU2xpZGVyVmlkZW8iLCJyZW1vdmUiLCJleHBvcnRDYXJkIiwiYXJyYXlJdGVtVXBkYXRlZCIsImZvckVhY2giLCJhcnJheUl0ZW0iLCJpdGVtIiwidXBkYXRlSW5mbyIsInNlcmlhbGl6ZWRBcnIiLCJKU09OIiwic3RyaW5naWZ5IiwiZG93bmxvYWQiLCJjcmVhdGVVbmlxdWVJZCIsImNvbnRlbnQiLCJmaWxlTmFtZSIsImNvbnRlbnRUeXBlIiwiYSIsImNyZWF0ZUVsZW1lbnQiLCJmaWxlIiwiQmxvYiIsInR5cGUiLCJocmVmIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwiY2xpY2siXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFB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QUFyQyxFQUFrRDtBQUNoRCxNQUFJQyxJQUFJbkMsU0FBU29DLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBUjtBQUNBLE1BQUlDLE9BQU8sSUFBSUMsSUFBSixDQUFTLENBQUNOLE9BQUQsQ0FBVCxFQUFvQjtBQUM3Qk8sVUFBTUw7QUFEdUIsR0FBcEIsQ0FBWDtBQUdBQyxJQUFFSyxJQUFGLEdBQVNDLElBQUlDLGVBQUosQ0FBb0JMLElBQXBCLENBQVQ7QUFDQUYsSUFBRUwsUUFBRixHQUFhRyxRQUFiO0FBQ0FFLElBQUVRLEtBQUY7QUFDRCIsImZpbGUiOiJjYXJkTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBudW1iZXJPZkNhcmQgPSAwO1xudmFyIGFycmF5Q2FyZCA9IFtdO1xudmFyIGFycmF5Q2FyZERlbGV0ZWQgPSBbXTtcbnZhciBjdXJyZW50ID0gMDtcbnZhciBjb21tYW5kcyA9IFtdO1xudmFyIGxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcbmxvZ2dlci5jb25uZWN0KCk7XG5cbnZhciBDYXJkTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICAvL0hlcmUgd2UgaGF2ZSB0aGUgY29tbWFuZCBwYXR0ZXJuLCBzZWUgOiBodHRwczovL3d3dy5kb2ZhY3RvcnkuY29tL2phdmFzY3JpcHQvY29tbWFuZC1kZXNpZ24tcGF0dGVyblxuICBmdW5jdGlvbiBhY3Rpb24oY29tbWFuZCkge1xuICAgIHZhciBuYW1lID0gY29tbWFuZC5leGVjdXRlLnRvU3RyaW5nKCkuc3Vic3RyKDksIDMpO1xuICAgIHJldHVybiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIC8vZXhlY3V0ZSBhIGNvbW1hbmRcbiAgICBleGVjdXRlOiBmdW5jdGlvbihjb21tYW5kKSB7XG4gICAgICBjb21tYW5kLmV4ZWN1dGUoY29tbWFuZC5zdGFydFAsIGNvbW1hbmQuZW5kUCk7XG4gICAgICAvL1dlIGxvZyB0aGUgY29tbWFuZCBpbnRvIHRoZSBzZXJ2ZXJcbiAgICAgIGxvZ2dlci5zZW5kQW5kTG9nQ29tbWFuZChjb21tYW5kKTtcbiAgICAgIC8vYW5kIHdlIHNhdmUgdGhlIGNvbW1hbmQgY3JlYXRlZFxuICAgICAgY29tbWFuZHMucHVzaChjb21tYW5kKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiZXhlY3V0aW5nIDogXCIpO1xuICAgICAgY29uc29sZS5sb2coY29tbWFuZCk7XG4gICAgfSxcbiAgICAvL1RPRE8gd2lsbCBub3Qgd29yayBpbiB0aGUgY3VycmVudCBzdGF0ZVxuICAgIC8vVW5kbyBhIGNvbW1hbmRcbiAgICB1bmRvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb21tYW5kID0gY29tbWFuZHMucG9wKCk7XG4gICAgICBjb21tYW5kLnVuZG8oKTtcbiAgICAgIC8vbG9nLmFkZChcIlVuZG8gXCIgKyBhY3Rpb24oY29tbWFuZCkgKyBcIjogXCIgKyBjb21tYW5kLnZhbHVlKTtcbiAgICAgIC8vbG9nLnNob3coKTtcbiAgICB9LFxuICAgIFxuICB9XG59O1xuXG4vKioqKiBGdW5jdGlvbmFsIGNvcmUgb2YgdGhlIGNhcmQgbWFuYWdlciAoY3JlYXRlIGEgY2FydCwgZGVsZXRlIGEgY2FyZCBhbmQgc2F2ZSBjYXJkKSAqKioqKi9cblxuLyoqXG4gKiBUaGlzIGNsYXNzIG1hbmFnIGFsbCB0aGUgY2FyZHMgY3JlYXRlZC4gVGhpcyBpcyB0aGUgc2VnbWVudCBoaXN0b3J5LlxuICogQHR5cGUge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAqL1xudmFyIHdyYXBwZXJDb21tYW5kQW5kUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXJDb21tYW5kQW5kUmFuZ2VpZFwiKTtcblxuLy9UT0RPIFNhdmUgYW5kIGxvYWQgYnV0dG9uLCBkbyBubyBkZWxldGVcbi8qc2F2ZUxvZ0J0bi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIixmdW5jdGlvbiAoZSkge1xuICBjb25zb2xlLmxvZyhcInNhdmluZyBsb2dcIik7XG4gIGFycmF5Q2FyZC5mb3JFYWNoKGZ1bmN0aW9uIChhcnJheUl0ZW0pIHtcbiAgIC8vIGFycmF5SXRlbS51cGRhdGVJbmZvKCk7XG4gICAgLy9hcnJheUl0ZW0uXG4gIH0pO1xuICBleHBvcnRDYXJkc0pTb24oKTtcbiAgdGV4dFNhdmVMb2cuaW5uZXJUZXh0ID0gXCJMb2cgc2F2ZWQhXCIgO1xufSk7XG5cbmxvYWRMb2dCdG4ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgbG9hZEpTT04obnVsbCk7XG59O1xuXG5sb2FkTG9nQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsZnVuY3Rpb24gKGUpIHtcbiAgLy9jb25zb2xlLmxvZyhcIkFBQUFBQVwiKTtcbiAgLy92YXIgbXlkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgLy9jb25zb2xlLmxvZyggbG9hZExvZ0J0bi52YWx1ZSk7XG59KTtcblxuXG5cbmZ1bmN0aW9uIGxvYWRKU09OKGNhbGxiYWNrKSB7XG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBcIi9wdWJsaWMvbG9nVzJKc29uL2lwYWQxLmpzb25cIiwgZmFsc2UpO1xuICByZXF1ZXN0LnNlbmQobnVsbCk7XG4gIC8vY29uc29sZS5sb2coXCJyZXF1ZXN0IDogXCIrIHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgdmFyIG15X0pTT05fb2JqZWN0ID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gIFxuICBjb25zb2xlLmxvZyhteV9KU09OX29iamVjdCk7XG4gIFxuICBmb3IoIGxldCBrID0gMCA7IGsgPCAgbXlfSlNPTl9vYmplY3QubGVuZ3RoIDsgayArKyl7XG4gICAgYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbihteV9KU09OX29iamVjdFtrXSk7XG4gIH1cbn0vKlxuXG5cblxuLy9kcmFnRWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQxXCIpKTtcblxuLypcbmFkZENhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICBjcmVhdGVOZXdDYXJkKCk7XG59KTsqL1xuXG4vL0FkZCBhIGNhcmQgZnJvbSBhIGpzb24gZmlsZVxuZnVuY3Rpb24gYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbihjYXJkSW5mbykge1xuICBpZiAoY2FyZEluZm8uc3RhcnRQID4gY2FyZEluZm8uZW5kUCkge1xuICAgIGxldCB0cmFuc2l0ID0gY2FyZEluZm8uc3RhcnRQO1xuICAgIGNhcmRJbmZvLnN0YXJ0UCA9IGNhcmRJbmZvLmVuZFA7XG4gICAgY2FyZEluZm8uZW5kUCA9IHRyYW5zaXQ7XG4gIH1cbiAgaWYgKGNhcmRJbmZvLnN0YXJ0UCA8IDApIHtcbiAgICBjYXJkSW5mby5zdGFydFAgPSAwO1xuICB9XG4gIGxldCByZXN1bHQgPSBzbGlkZXJUb1ZpZGVvKGNhcmRJbmZvLnN0YXJ0UCwgY2FyZEluZm8uZW5kUCk7XG4gIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gIG51bWJlck9mQ2FyZCsrO1xuICBpZiAoIWNhcmRJbmZvLmRlbGV0ZWQpIHtcbiAgICB2YXIgY2FyZCA9IENhcmQocmVzdWx0LnN0YXJ0RHVyYXRpb24sIHJlc3VsdC5lbmREdXJhdGlvbiwgY2FyZEluZm8uc3RhcnRQLCBjYXJkSW5mby5lbmRQLCBjYXJkSW5mbyk7XG4gICAgYXJyYXlDYXJkLnB1c2goY2FyZCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmluc2VydEJlZm9yZShjYXJkLmlEaXYsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXZDYXJkQm9hcmQnKS5maXJzdENoaWxkKTtcbiAgfVxuICBcbn1cblxuLyoqXG4gKiBBZGRpbmcgYSBjYXJkIGJ5IGRyYWcgYW5kIGRyb3AuIFRoZSBjYXJkIGlzIGFkZGVkIGluIHRoZSBsaXN0IG9mIGNhcmRzXG4gKiBSZXR1cm4gdGhlIGNhcmQgdGhhdCBoYXZlIGJlZW4gY3JlYXRlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVOZXdDYXJkKHN0YXJ0UCwgZW5kUCkge1xuICAvL2NvbnNvbGUubG9nKFwiVEVTVCAvIDogXCIgKyBzdGFydFAgKyBcIiBcIiArIGVuZFApO1xuICBcbiAgaWYgKHN0YXJ0UCA+IGVuZFApIHtcbiAgICBsZXQgdHJhbnNpdCA9IHN0YXJ0UDtcbiAgICBzdGFydFAgPSBlbmRQO1xuICAgIGVuZFAgPSB0cmFuc2l0O1xuICB9XG4gIGxldCByZXN1bHQgPSBzbGlkZXJUb1ZpZGVvKHN0YXJ0UCwgZW5kUCk7XG4gIG51bWJlck9mQ2FyZCsrO1xuICAvL2NvbnNvbGUubG9nKFwid3JhcHBlckNvbW1hbmRBbmRSYW5nZSA6IFwiICsgd2luZG93LmdldENvbXB1dGVkU3R5bGUod3JhcHBlckNvbW1hbmRBbmRSYW5nZSkuKTtcbiAgdmFyIGNhcmQgPSBuZXcgQ2FyZChyZXN1bHQuc3RhcnREdXJhdGlvbiwgcmVzdWx0LmVuZER1cmF0aW9uLCBzdGFydFAsIGVuZFApO1xuICBhZGRpbmdOZXdDYXJkKGNhcmQpO1xuICBcbiAgLyoqKioqKiBUZXN0IHB1cnBvc2VzIC0gRm9yIHRlc3RpbmcgYWN0aW9ucyBvbiBjYXJkcyAqKioqKi9cbiAgLyp2YXIgY2FyZCA9IG5ldyBDYXJkKHJlc3VsdC5zdGFydER1cmF0aW9uLCByZXN1bHQuZW5kRHVyYXRpb24sc3RhcnRQLGVuZFApO1xuICBhZGRpbmdOZXdDYXJkKGNhcmQpO1xuICBsZXQgcmVzdWx0MiA9IHNsaWRlclRvVmlkZW8oMTAsMjApO1xuICB2YXIgY2FyZCA9ICBuZXcgQ2FyZChyZXN1bHQyLnN0YXJ0RHVyYXRpb24scmVzdWx0Mi5lbmREdXJhdGlvbiwxMCwyMCk7XG4gIGFkZGluZ05ld0NhcmQoY2FyZCk7XG4gIGxldCByZXN1bHQzID0gc2xpZGVyVG9WaWRlbygxNSwyNSk7XG4gIHZhciBjYXJkID0gIG5ldyBDYXJkKHJlc3VsdDMuc3RhcnREdXJhdGlvbixyZXN1bHQzLmVuZER1cmF0aW9uLDE1LDI1KTtcbiAgYWRkaW5nTmV3Q2FyZChjYXJkKTsqL1xuICAvKioqKioqIFRlc3QgcHVycG9zZXMgLSBGb3IgdGVzdGluZyBhY3Rpb25zIG9uIGNhcmRzICoqKioqL1xuICBcbiAgcmV0dXJuIGNhcmQ7XG59XG5cbmZ1bmN0aW9uIGFkZGluZ05ld0NhcmQoY2FyZCkge1xuICBhcnJheUNhcmQucHVzaChjYXJkKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmluc2VydEJlZm9yZShjYXJkLmlEaXYsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXZDYXJkQm9hcmQnKS5maXJzdENoaWxkKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlQ2FyZChjYXJkKSB7XG4gIC8vU3VwcHJpbWUgbGEgY2FydGUgZGUgbGEgbGlzdGUgZGUgY2FydGVcbiAgLypmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Q2FyZC5sZW5ndGggICA7IGkrKykge1xuICAgIGlmKGFycmF5Q2FyZFtpXSAgPT09IGNhcmQpe1xuICAgICAgdmFyIHN1cENhcmQgPSBhcnJheUNhcmQuc3BsaWNlKGksMSk7XG4gICAgICBhcnJheUNhcmREZWxldGVkLnB1c2goc3VwQ2FyZCk7XG4gICAgICBjb25zb2xlLmxvZyhcImRlbGV0ZWQgY2FyZCA6IFwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHN1cENhcmQpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9Ki9cbiAgLy9kZWxldGVDYXJkVUkoY2FyZCk7XG4gIC8qYXJyYXlDYXJkRGVsZXRlZC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBjb25zb2xlLmxvZyggICBlbGVtZW50KTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICBhcnJheUNhcmQuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgY29uc29sZS5sb2coZWxlbWVudCk7XG4gIH0pOyovXG4gIGRlbGV0ZUNhcmRVSShjYXJkKTtcbiAgcmV0dXJuIGNhcmQ7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUNhcmRVSShjYXJkKSB7XG4gIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG4gIGNhcmQuaURpdi5yZW1vdmUoKTtcbiAgY2FyZC5kZWxldGVkID0gdHJ1ZVxufVxuXG5cbi8qLS0tLS0tIEV4cG9ydCBjYXJkIGluIGEgSlNPTiBmaWxlICAtLS0tLS0tKi9cbi8vVE9ET1xuZnVuY3Rpb24gZXhwb3J0Q2FyZCgpIHtcbiAgdmFyIGFycmF5SXRlbVVwZGF0ZWQgPSBbXTtcbiAgYXJyYXlDYXJkLmZvckVhY2goZnVuY3Rpb24oYXJyYXlJdGVtKSB7XG4gICAgLy9hcnJheUl0ZW0udXBkYXRlSW5mbygpO1xuICAgIHZhciBpdGVtID0gYXJyYXlJdGVtLnVwZGF0ZUluZm8oKTtcbiAgICBhcnJheUl0ZW1VcGRhdGVkLnB1c2goaXRlbSk7XG4gICAgLy8gY29uc29sZS5sb2coaXRlbSk7XG4gIH0pO1xuICB2YXIgc2VyaWFsaXplZEFyciA9IEpTT04uc3RyaW5naWZ5KFthcnJheUl0ZW1VcGRhdGVkLCBudW1iZXJPZkNhcmRdKTtcbiAgY29uc29sZS5sb2coXCIqKioqKiAgU2VyaWFsaXNhdGlvbiBvZiBjYXJkIGNvbXBsZXRlIDogXCIgKyBzZXJpYWxpemVkQXJyKTtcbiAgZG93bmxvYWQoc2VyaWFsaXplZEFyciwgJ2pzb25XMmxvZy0nICsgY3JlYXRlVW5pcXVlSWQoKSArICcudHh0JywgJ3RleHQvcGxhaW4nKTtcbn07XG5cbmZ1bmN0aW9uIGRvd25sb2FkKGNvbnRlbnQsIGZpbGVOYW1lLCBjb250ZW50VHlwZSkge1xuICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICB2YXIgZmlsZSA9IG5ldyBCbG9iKFtjb250ZW50XSwge1xuICAgIHR5cGU6IGNvbnRlbnRUeXBlXG4gIH0pO1xuICBhLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICBhLmRvd25sb2FkID0gZmlsZU5hbWU7XG4gIGEuY2xpY2soKTtcbn0iXX0=