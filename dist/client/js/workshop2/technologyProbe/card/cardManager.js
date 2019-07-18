"use strict";

var numberOfCard = 0;
var arrayCard = [];
var arrayCardDeleted = [];
var current = 0;
var commands = [];

var CardManager = function CardManager() {
  //Here we have the command pattern, see :
  function action(command) {
    var name = command.execute.toString().substr(9, 3);
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return {
    //execute a command
    execute: function execute(command) {
      console.log(command);
      command.execute(command.startP, command.endP);
      commands.push(command);
      log.add(action(command) + ": " + command.startP + "  " + command.endP);
      log.show();
    },

    //TODO pour l'instant ça ne marchera pas
    //Undo a command
    undo: function undo() {
      var command = commands.pop();
      command.undo();
      log.add("Undo " + action(command) + ": " + command.value);
      log.show();
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
  arrayCardDeleted.forEach(function (element) {
    console.log(element);
  });
  console.log("************************");
  arrayCard.forEach(function (element) {
    console.log(element);
  });
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
var exportCard = function() {
  
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

// var item = arrayItem.updateInfo();
// triggerMouseEvent( a, "mousedown");
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
};




function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIm51bWJlck9mQ2FyZCIsImFycmF5Q2FyZCIsImFycmF5Q2FyZERlbGV0ZWQiLCJjdXJyZW50IiwiY29tbWFuZHMiLCJDYXJkTWFuYWdlciIsImFjdGlvbiIsImNvbW1hbmQiLCJuYW1lIiwiZXhlY3V0ZSIsInRvU3RyaW5nIiwic3Vic3RyIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImNvbnNvbGUiLCJsb2ciLCJzdGFydFAiLCJlbmRQIiwicHVzaCIsImFkZCIsInNob3ciLCJ1bmRvIiwicG9wIiwidmFsdWUiLCJ3cmFwcGVyQ29tbWFuZEFuZFJhbmdlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFkZGluZ05ld0NhcmRzRnJvbUpTb24iLCJjYXJkSW5mbyIsInRyYW5zaXQiLCJyZXN1bHQiLCJzbGlkZXJUb1ZpZGVvIiwiZGVsZXRlZCIsImNhcmQiLCJDYXJkIiwic3RhcnREdXJhdGlvbiIsImVuZER1cmF0aW9uIiwiaW5zZXJ0QmVmb3JlIiwiaURpdiIsImZpcnN0Q2hpbGQiLCJjcmVhdGVOZXdDYXJkIiwiYWRkaW5nTmV3Q2FyZCIsImRlbGV0ZUNhcmQiLCJmb3JFYWNoIiwiZWxlbWVudCIsImRlbGV0ZUNhcmRVSSIsImZlZWRiYWNrT25TbGlkZXJWaWRlbyIsInJlbW92ZSIsImV4cG9ydENhcmQiLCJhcnJheUl0ZW1VcGRhdGVkIiwiYXJyYXlJdGVtIiwiaXRlbSIsInVwZGF0ZUluZm8iLCJzZXJpYWxpemVkQXJyIiwiSlNPTiIsInN0cmluZ2lmeSIsImRvd25sb2FkIiwiY3JlYXRlVW5pcXVlSWQiLCJjb250ZW50IiwiZmlsZU5hbWUiLCJjb250ZW50VHlwZSIsImEiLCJjcmVhdGVFbGVtZW50IiwiZmlsZSIsIkJsb2IiLCJ0eXBlIiwiaHJlZiIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImNsaWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGVBQWUsQ0FBbkI7QUFD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c0JpQyxJQUF0QjtBQUNBckMsWUFBUUMsR0FBUixDQUFZb0MsSUFBWjtBQUNELEdBTEQ7QUFNQSxNQUFJRSxnQkFBZ0JDLEtBQUtDLFNBQUwsQ0FBZ0IsQ0FBQ04sZ0JBQUQsRUFBbUJsRCxZQUFuQixDQUFoQixDQUFwQjtBQUNBZSxVQUFRQyxHQUFSLENBQVksc0NBQXNDc0MsYUFBbEQ7QUFDQUcsV0FBU0gsYUFBVCxFQUF3QixlQUFhSSxnQkFBYixHQUE4QixNQUF0RCxFQUE4RCxZQUE5RDtBQUNEOztBQUVELFNBQVNELFFBQVQsQ0FBa0JFLE9BQWxCLEVBQTJCQyxRQUEzQixFQUFxQ0MsV0FBckMsRUFBa0Q7QUFDaEQsTUFBSUMsSUFBSXBDLFNBQVNxQyxhQUFULENBQXVCLEdBQXZCLENBQVI7QUFDQSxNQUFJQyxPQUFPLElBQUlDLElBQUosQ0FBUyxDQUFDTixPQUFELENBQVQsRUFBb0IsRUFBQ08sTUFBTUwsV0FBUCxFQUFwQixDQUFYO0FBQ0FDLElBQUVLLElBQUYsR0FBU0MsSUFBSUMsZUFBSixDQUFvQkwsSUFBcEIsQ0FBVDtBQUNBRixJQUFFTCxRQUFGLEdBQWFHLFFBQWI7QUFDQUUsSUFBRVEsS0FBRjtBQUNEIiwiZmlsZSI6ImNhcmRNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG51bWJlck9mQ2FyZCA9IDA7XG52YXIgYXJyYXlDYXJkID0gW107XG52YXIgYXJyYXlDYXJkRGVsZXRlZCA9IFtdO1xudmFyIGN1cnJlbnQgPSAwO1xudmFyIGNvbW1hbmRzID0gW107XG5cbnZhciBDYXJkTWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcbiAgLy9IZXJlIHdlIGhhdmUgdGhlIGNvbW1hbmQgcGF0dGVybiwgc2VlIDpcbiAgZnVuY3Rpb24gYWN0aW9uKGNvbW1hbmQpIHtcbiAgICB2YXIgbmFtZSA9IGNvbW1hbmQuZXhlY3V0ZS50b1N0cmluZygpLnN1YnN0cig5LCAzKTtcbiAgICByZXR1cm4gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG4gIH1cbiAgXG4gIHJldHVybiB7XG4gICAgLy9leGVjdXRlIGEgY29tbWFuZFxuICAgIGV4ZWN1dGU6IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICBjb25zb2xlLmxvZyhjb21tYW5kKTtcbiAgICAgIGNvbW1hbmQuZXhlY3V0ZShjb21tYW5kLnN0YXJ0UCwgY29tbWFuZC5lbmRQKTtcbiAgICAgIGNvbW1hbmRzLnB1c2goY29tbWFuZCk7XG4gICAgICBsb2cuYWRkKGFjdGlvbihjb21tYW5kKSArIFwiOiBcIiArIGNvbW1hbmQuc3RhcnRQICsgXCIgIFwiICsgY29tbWFuZC5lbmRQKTtcbiAgICAgIGxvZy5zaG93KCk7XG4gICAgfSxcbiAgICBcbiAgICAvL1RPRE8gcG91ciBsJ2luc3RhbnQgw6dhIG5lIG1hcmNoZXJhIHBhc1xuICAgIC8vVW5kbyBhIGNvbW1hbmRcbiAgICB1bmRvOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY29tbWFuZCA9IGNvbW1hbmRzLnBvcCgpO1xuICAgICAgY29tbWFuZC51bmRvKCk7XG4gICAgICBsb2cuYWRkKFwiVW5kbyBcIiArIGFjdGlvbihjb21tYW5kKSArIFwiOiBcIiArIGNvbW1hbmQudmFsdWUpO1xuICAgICAgbG9nLnNob3coKTtcbiAgICB9LFxuICAgIFxuICB9XG59O1xuXG4vKioqKiBGdW5jdGlvbmFsIGNvcmUgb2YgdGhlIGNhcmQgbWFuYWdlciAoY3JlYXRlIGEgY2FydCwgZGVsZXRlIGEgY2FyZCBhbmQgc2F2ZSBjYXJkKSAqKioqKi9cblxuLyoqXG4gKiBUaGlzIGNsYXNzIG1hbmFnIGFsbCB0aGUgY2FyZHMgY3JlYXRlZC4gVGhpcyBpcyB0aGUgc2VnbWVudCBoaXN0b3J5LlxuICogQHR5cGUge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAqL1xudmFyIHdyYXBwZXJDb21tYW5kQW5kUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXJDb21tYW5kQW5kUmFuZ2VpZFwiKTtcblxuLy9UT0RPIFNhdmUgYW5kIGxvYWQgYnV0dG9uLCBkbyBubyBkZWxldGVcbi8qc2F2ZUxvZ0J0bi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIixmdW5jdGlvbiAoZSkge1xuICBjb25zb2xlLmxvZyhcInNhdmluZyBsb2dcIik7XG4gIGFycmF5Q2FyZC5mb3JFYWNoKGZ1bmN0aW9uIChhcnJheUl0ZW0pIHtcbiAgIC8vIGFycmF5SXRlbS51cGRhdGVJbmZvKCk7XG4gICAgLy9hcnJheUl0ZW0uXG4gIH0pO1xuICBleHBvcnRDYXJkc0pTb24oKTtcbiAgdGV4dFNhdmVMb2cuaW5uZXJUZXh0ID0gXCJMb2cgc2F2ZWQhXCIgO1xufSk7XG5cbmxvYWRMb2dCdG4ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgbG9hZEpTT04obnVsbCk7XG59O1xuXG5sb2FkTG9nQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsZnVuY3Rpb24gKGUpIHtcbiAgLy9jb25zb2xlLmxvZyhcIkFBQUFBQVwiKTtcbiAgLy92YXIgbXlkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgLy9jb25zb2xlLmxvZyggbG9hZExvZ0J0bi52YWx1ZSk7XG59KTtcblxuXG5cbmZ1bmN0aW9uIGxvYWRKU09OKGNhbGxiYWNrKSB7XG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBcIi9wdWJsaWMvbG9nVzJKc29uL2lwYWQxLmpzb25cIiwgZmFsc2UpO1xuICByZXF1ZXN0LnNlbmQobnVsbCk7XG4gIC8vY29uc29sZS5sb2coXCJyZXF1ZXN0IDogXCIrIHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgdmFyIG15X0pTT05fb2JqZWN0ID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gIFxuICBjb25zb2xlLmxvZyhteV9KU09OX29iamVjdCk7XG4gIFxuICBmb3IoIGxldCBrID0gMCA7IGsgPCAgbXlfSlNPTl9vYmplY3QubGVuZ3RoIDsgayArKyl7XG4gICAgYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbihteV9KU09OX29iamVjdFtrXSk7XG4gIH1cbn0vKlxuXG5cblxuLy9kcmFnRWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQxXCIpKTtcblxuLypcbmFkZENhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICBjcmVhdGVOZXdDYXJkKCk7XG59KTsqL1xuXG4vL0FkZCBhIGNhcmQgZnJvbSBhIGpzb24gZmlsZVxuZnVuY3Rpb24gYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbihjYXJkSW5mbyl7XG4gIGlmKGNhcmRJbmZvLnN0YXJ0UCA+IGNhcmRJbmZvLmVuZFApe1xuICAgIGxldCB0cmFuc2l0ID0gY2FyZEluZm8uc3RhcnRQO1xuICAgIGNhcmRJbmZvLnN0YXJ0UCA9IGNhcmRJbmZvLmVuZFA7XG4gICAgY2FyZEluZm8uZW5kUCA9IHRyYW5zaXQ7XG4gIH1cbiAgaWYoY2FyZEluZm8uc3RhcnRQIDwgMCApe1xuICAgIGNhcmRJbmZvLnN0YXJ0UCA9IDA7XG4gIH1cbiAgbGV0IHJlc3VsdCA9IHNsaWRlclRvVmlkZW8oY2FyZEluZm8uc3RhcnRQLGNhcmRJbmZvLmVuZFApO1xuICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICBudW1iZXJPZkNhcmQrKztcbiAgaWYoIWNhcmRJbmZvLmRlbGV0ZWQpe1xuICAgIHZhciBjYXJkID0gIENhcmQocmVzdWx0LnN0YXJ0RHVyYXRpb24sIHJlc3VsdC5lbmREdXJhdGlvbixjYXJkSW5mby5zdGFydFAsY2FyZEluZm8uZW5kUCxjYXJkSW5mbyk7XG4gICAgYXJyYXlDYXJkLnB1c2goY2FyZCk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmluc2VydEJlZm9yZShjYXJkLmlEaXYsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXZDYXJkQm9hcmQnKS5maXJzdENoaWxkKTtcbiAgfVxuICBcbn1cblxuLyoqXG4gKiBBZGRpbmcgYSBjYXJkIGJ5IGRyYWcgYW5kIGRyb3AuIFRoZSBjYXJkIGlzIGFkZGVkIGluIHRoZSBsaXN0IG9mIGNhcmRzXG4gKiBSZXR1cm4gdGhlIGNhcmQgdGhhdCBoYXZlIGJlZW4gY3JlYXRlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVOZXdDYXJkKHN0YXJ0UCwgZW5kUCkge1xuICAvL2NvbnNvbGUubG9nKFwiVEVTVCAvIDogXCIgKyBzdGFydFAgKyBcIiBcIiArIGVuZFApO1xuICBcbiAgaWYoc3RhcnRQID4gZW5kUCl7XG4gICAgbGV0IHRyYW5zaXQgPSBzdGFydFA7XG4gICAgc3RhcnRQID0gZW5kUDtcbiAgICBlbmRQID0gdHJhbnNpdDtcbiAgfVxuICBsZXQgcmVzdWx0ID0gc2xpZGVyVG9WaWRlbyhzdGFydFAsZW5kUCk7XG4gIG51bWJlck9mQ2FyZCsrO1xuICAvL2NvbnNvbGUubG9nKFwid3JhcHBlckNvbW1hbmRBbmRSYW5nZSA6IFwiICsgd2luZG93LmdldENvbXB1dGVkU3R5bGUod3JhcHBlckNvbW1hbmRBbmRSYW5nZSkuKTtcbiAgdmFyIGNhcmQgPSBuZXcgQ2FyZChyZXN1bHQuc3RhcnREdXJhdGlvbiwgcmVzdWx0LmVuZER1cmF0aW9uLHN0YXJ0UCxlbmRQKTtcbiAgYWRkaW5nTmV3Q2FyZChjYXJkKTtcbiAgXG4gIC8qKioqKiogVGVzdCBwdXJwb3NlcyAtIEZvciB0ZXN0aW5nIGFjdGlvbnMgb24gY2FyZHMgKioqKiovXG4gIC8qdmFyIGNhcmQgPSBuZXcgQ2FyZChyZXN1bHQuc3RhcnREdXJhdGlvbiwgcmVzdWx0LmVuZER1cmF0aW9uLHN0YXJ0UCxlbmRQKTtcbiAgYWRkaW5nTmV3Q2FyZChjYXJkKTtcbiAgbGV0IHJlc3VsdDIgPSBzbGlkZXJUb1ZpZGVvKDEwLDIwKTtcbiAgdmFyIGNhcmQgPSAgbmV3IENhcmQocmVzdWx0Mi5zdGFydER1cmF0aW9uLHJlc3VsdDIuZW5kRHVyYXRpb24sMTAsMjApO1xuICBhZGRpbmdOZXdDYXJkKGNhcmQpO1xuICBsZXQgcmVzdWx0MyA9IHNsaWRlclRvVmlkZW8oMTUsMjUpO1xuICB2YXIgY2FyZCA9ICBuZXcgQ2FyZChyZXN1bHQzLnN0YXJ0RHVyYXRpb24scmVzdWx0My5lbmREdXJhdGlvbiwxNSwyNSk7XG4gIGFkZGluZ05ld0NhcmQoY2FyZCk7Ki9cbiAgLyoqKioqKiBUZXN0IHB1cnBvc2VzIC0gRm9yIHRlc3RpbmcgYWN0aW9ucyBvbiBjYXJkcyAqKioqKi9cbiAgXG4gIHJldHVybiBjYXJkO1xufVxuXG5mdW5jdGlvbiBhZGRpbmdOZXdDYXJkKGNhcmQpe1xuICBhcnJheUNhcmQucHVzaChjYXJkKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmluc2VydEJlZm9yZShjYXJkLmlEaXYsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXZDYXJkQm9hcmQnKS5maXJzdENoaWxkKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlQ2FyZChjYXJkKXtcbiAgLy9TdXBwcmltZSBsYSBjYXJ0ZSBkZSBsYSBsaXN0ZSBkZSBjYXJ0ZVxuICAvKmZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlDYXJkLmxlbmd0aCAgIDsgaSsrKSB7XG4gICAgaWYoYXJyYXlDYXJkW2ldICA9PT0gY2FyZCl7XG4gICAgICB2YXIgc3VwQ2FyZCA9IGFycmF5Q2FyZC5zcGxpY2UoaSwxKTtcbiAgICAgIGFycmF5Q2FyZERlbGV0ZWQucHVzaChzdXBDYXJkKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGVsZXRlZCBjYXJkIDogXCIpO1xuICAgICAgY29uc29sZS5sb2coc3VwQ2FyZCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH0qL1xuICAvL2RlbGV0ZUNhcmRVSShjYXJkKTtcbiAgYXJyYXlDYXJkRGVsZXRlZC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBjb25zb2xlLmxvZyggICBlbGVtZW50KTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICBhcnJheUNhcmQuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgY29uc29sZS5sb2coZWxlbWVudCk7XG4gIH0pO1xuICBkZWxldGVDYXJkVUkoY2FyZCk7XG4gIHJldHVybiBjYXJkO1xufVxuXG5mdW5jdGlvbiBkZWxldGVDYXJkVUkoY2FyZCkge1xuICBmZWVkYmFja09uU2xpZGVyVmlkZW8oZmFsc2UpO1xuICBjYXJkLmlEaXYucmVtb3ZlKCk7XG4gIGNhcmQuZGVsZXRlZCA9IHRydWVcbn1cblxuXG4vKi0tLS0tLSBFeHBvcnQgY2FyZCBpbiBhIEpTT04gZmlsZSAgLS0tLS0tLSovXG4vL1RPRE9cbmZ1bmN0aW9uIGV4cG9ydENhcmQoKXtcbiAgdmFyIGFycmF5SXRlbVVwZGF0ZWQgPSBbXTtcbiAgYXJyYXlDYXJkLmZvckVhY2goZnVuY3Rpb24gKGFycmF5SXRlbSkge1xuICAgIC8vYXJyYXlJdGVtLnVwZGF0ZUluZm8oKTtcbiAgICB2YXIgaXRlbSA9IGFycmF5SXRlbS51cGRhdGVJbmZvKCk7XG4gICAgYXJyYXlJdGVtVXBkYXRlZC5wdXNoKGl0ZW0pO1xuICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICB9KTtcbiAgdmFyIHNlcmlhbGl6ZWRBcnIgPSBKU09OLnN0cmluZ2lmeSggW2FycmF5SXRlbVVwZGF0ZWQsIG51bWJlck9mQ2FyZF0gKTtcbiAgY29uc29sZS5sb2coXCJTZXJpYWxpc2F0aW9uIG9mIGNhcmQgY29tcGxldGUgOiBcIiArIHNlcmlhbGl6ZWRBcnIpO1xuICBkb3dubG9hZChzZXJpYWxpemVkQXJyLCAnanNvblcybG9nLScrY3JlYXRlVW5pcXVlSWQoKSsnLnR4dCcsICd0ZXh0L3BsYWluJyk7XG59O1xuXG5mdW5jdGlvbiBkb3dubG9hZChjb250ZW50LCBmaWxlTmFtZSwgY29udGVudFR5cGUpIHtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgdmFyIGZpbGUgPSBuZXcgQmxvYihbY29udGVudF0sIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuICBhLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICBhLmRvd25sb2FkID0gZmlsZU5hbWU7XG4gIGEuY2xpY2soKTtcbn1cblxuXG5cbiJdfQ==