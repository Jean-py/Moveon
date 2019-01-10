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
      command.execute();
      //We send the command to the server (the server log it into a file, see ./src/server/ServerLogger)
      logger.sendAndLogCommand(command);
      //and we save the command created
      commands.push(command);
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



/*



//dragElement(document.getElementById("card1"));


addCard.addEventListener('click', function (e) {
  createNewCard();
});*/

function cleanSegmentHistory() {
  console.log("TESTING");
  clearAllTimer();
  arrayCard.forEach(function (e) {
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
  var start = 0;
  var stop = file.size - 1;

  var reader = new FileReader();
  var test = 0;

  // If we use onloadend, we need to check the readyState.
  reader.onloadend = function (evt) {
    if (evt.target.readyState == FileReader.DONE) {
      // DONE == 2
      var test = evt.target.result;
      console.log('Read bytes: ', start + 1, ' - ', stop + 1, ' of ', file.size, ' byte file');
      console.log(test);
      var my_JSON_object = JSON.parse(test);

      console.log(my_JSON_object);

      for (var k = 0; k < my_JSON_object.length; k++) {
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
    var transit = startP;
    startP = endP;
    endP = transit;
  }
  var result = sliderToVideo(startP, endP);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIm51bWJlck9mQ2FyZCIsImFycmF5Q2FyZCIsImNvbW1hbmRzIiwiQ2FyZE1hbmFnZXIiLCJleGVjdXRlIiwiY29tbWFuZCIsImxvZ2dlciIsInNlbmRBbmRMb2dDb21tYW5kIiwicHVzaCIsInVuZG8iLCJwb3AiLCJ3cmFwcGVyQ29tbWFuZEFuZFJhbmdlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImNsZWFuU2VnbWVudEhpc3RvcnkiLCJjb25zb2xlIiwibG9nIiwiY2xlYXJBbGxUaW1lciIsImZvckVhY2giLCJlIiwiZGVsZXRlQ2FyZFVJIiwibG9hZEpTT04iLCJmaWxlcyIsImxlbmd0aCIsImFsZXJ0IiwiZmlsZSIsInN0YXJ0Iiwic3RvcCIsInNpemUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwidGVzdCIsIm9ubG9hZGVuZCIsImV2dCIsInRhcmdldCIsInJlYWR5U3RhdGUiLCJET05FIiwicmVzdWx0IiwibXlfSlNPTl9vYmplY3QiLCJKU09OIiwicGFyc2UiLCJrIiwiYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbiIsImJsb2IiLCJzbGljZSIsInJlYWRBc0JpbmFyeVN0cmluZyIsImNhcmRJbmZvIiwic3RhcnRQIiwiZW5kUCIsInRyYW5zaXQiLCJzbGlkZXJUb1ZpZGVvIiwiZGVsZXRlZCIsImNhcmQiLCJDYXJkIiwic3RhcnREdXJhdGlvbiIsImVuZER1cmF0aW9uIiwiY2FyZE1hbmFnZXIiLCJDcmVhdGVOZXdDYXJkQ29tbWFuZCIsImNyZWF0ZU5ld0NhcmQiLCJhZGRpbmdOZXdDYXJkIiwiaW5zZXJ0QmVmb3JlIiwiaURpdiIsImZpcnN0Q2hpbGQiLCJkZWxldGVDYXJkIiwiZmVlZGJhY2tPblNsaWRlclZpZGVvIiwicmVtb3ZlIiwiZXhwb3J0Q2FyZCIsImFycmF5SXRlbVVwZGF0ZWQiLCJhcnJheUl0ZW0iLCJpdGVtIiwidXBkYXRlSW5mbyIsInNlcmlhbGl6ZWRBcnIiLCJzdHJpbmdpZnkiLCJkb3dubG9hZCIsImNyZWF0ZVVuaXF1ZUlkIiwiY29udGVudCIsImZpbGVOYW1lIiwiY29udGVudFR5cGUiLCJhIiwiY3JlYXRlRWxlbWVudCIsIkJsb2IiLCJ0eXBlIiwiaHJlZiIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImNsaWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGVBQWUsQ0FBbkI7QUFDQSxJQUFJQyxZQUFZLEVBQWhCO0FBQ0E7QUFDQSxJQUFJQyxXQUFXLEVBQWY7O0FBR0EsSUFBSUMsY0FBYyxTQUFkQSxXQUFjLEdBQVc7QUFDM0I7QUFDQSxTQUFPO0FBQ0w7QUFDQUMsYUFBUyxpQkFBU0MsT0FBVCxFQUFrQjtBQUN6QjtBQUNBOzs7Ozs7Ozs7Ozs7QUFZREEsY0FBUUQsT0FBUjtBQUNDO0FBQ0FFLGFBQU9DLGlCQUFQLENBQXlCRixPQUF6QjtBQUNBO0FBQ0FILGVBQVNNLElBQVQsQ0FBY0gsT0FBZDtBQUNELEtBckJJO0FBc0JMO0FBQ0FJLFVBQU0sZ0JBQVc7QUFDZjtBQUNBLFVBQUlKLFVBQVVILFNBQVNRLEdBQVQsRUFBZDtBQUNBTCxjQUFRSSxJQUFSO0FBQ0Q7O0FBM0JJLEdBQVA7QUE4QkQsQ0FoQ0Q7O0FBa0NBO0FBQ0E7Ozs7QUFJQSxJQUFJRSx5QkFBeUJDLFNBQVNDLGNBQVQsQ0FBd0IsMEJBQXhCLENBQTdCOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtDQSxTQUFTQyxtQkFBVCxHQUE4QjtBQUM1QkMsVUFBUUMsR0FBUixDQUFZLFNBQVo7QUFDQUM7QUFDQWhCLFlBQVVpQixPQUFWLENBQWtCLFVBQVNDLENBQVQsRUFBVztBQUN6QkMsaUJBQWFELENBQWI7QUFDSCxHQUZEO0FBR0Q7O0FBRUQsU0FBU0UsUUFBVCxHQUFvQjtBQUNsQixNQUFJQyxRQUFRVixTQUFTQyxjQUFULENBQXdCLGFBQXhCLEVBQXVDUyxLQUFuRDtBQUNBLE1BQUksQ0FBQ0EsTUFBTUMsTUFBWCxFQUFtQjtBQUNqQkMsVUFBTSx1QkFB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QUFDN0JNLFVBQU1KO0FBRHVCLEdBQXBCLENBQVg7QUFHQUMsSUFBRUksSUFBRixHQUFTQyxJQUFJQyxlQUFKLENBQW9CM0QsSUFBcEIsQ0FBVDtBQUNBcUQsSUFBRUwsUUFBRixHQUFhRyxRQUFiO0FBQ0FFLElBQUVPLEtBQUY7QUFDRCIsImZpbGUiOiJjYXJkTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBudW1iZXJPZkNhcmQgPSAwO1xudmFyIGFycmF5Q2FyZCA9IFtdO1xuLy92YXIgYXJyYXlDYXJkRGVsZXRlZCA9IFtdO1xudmFyIGNvbW1hbmRzID0gW107XG5cblxudmFyIENhcmRNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG4gIC8vSSBpbXBsZW1lbnRlZCBhIGNvbW1hbmQgcGF0dGVybiwgc2VlIDogaHR0cHM6Ly93d3cuZG9mYWN0b3J5LmNvbS9qYXZhc2NyaXB0L2NvbW1hbmQtZGVzaWduLXBhdHRlcm5cbiAgcmV0dXJuIHtcbiAgICAvL2V4ZWN1dGUgYSBjb21tYW5kXG4gICAgZXhlY3V0ZTogZnVuY3Rpb24oY29tbWFuZCkge1xuICAgICAgLy9pZiB0aGlzIGlzIGEgZGVsZXRlIGNvbW1hbmQgdGhlbiBjYXJkIGlzIGFuIGFyZ3VtZW50IG9mIHRoZSBjb21tYW5kXG4gICAgICAvKnN3aXRjaCAoY29tbWFuZC5leGVjdXRlLm5hbWUpe1xuICAgICAgICBjYXNlIFwiZGVsZXRlQ2FyZFwiIDoge1xuICAgICAgICAgIGNvbW1hbmQuZXhlY3V0ZShjb21tYW5kLmNhcmQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJjcmVhdGVOZXdDYXJkXCIgOlxuICAgICAgICAgIGNvbW1hbmQuZXhlY3V0ZShjb21tYW5kLnN0YXJ0UCwgY29tbWFuZC5lbmRQKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb21tYW5kLmV4ZWN1dGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH0qL1xuICAgICBjb21tYW5kLmV4ZWN1dGUoKTtcbiAgICAgIC8vV2Ugc2VuZCB0aGUgY29tbWFuZCB0byB0aGUgc2VydmVyICh0aGUgc2VydmVyIGxvZyBpdCBpbnRvIGEgZmlsZSwgc2VlIC4vc3JjL3NlcnZlci9TZXJ2ZXJMb2dnZXIpXG4gICAgICBsb2dnZXIuc2VuZEFuZExvZ0NvbW1hbmQoY29tbWFuZCk7XG4gICAgICAvL2FuZCB3ZSBzYXZlIHRoZSBjb21tYW5kIGNyZWF0ZWRcbiAgICAgIGNvbW1hbmRzLnB1c2goY29tbWFuZCk7XG4gICAgfSxcbiAgICAvL1VuZG8gYSBjb21tYW5kXG4gICAgdW5kbzogZnVuY3Rpb24oKSB7XG4gICAgICAvL1RPRE9cbiAgICAgIHZhciBjb21tYW5kID0gY29tbWFuZHMucG9wKCk7XG4gICAgICBjb21tYW5kLnVuZG8oKTtcbiAgICB9LFxuICAgIFxuICB9XG59O1xuXG4vKioqKiBGdW5jdGlvbmFsIGNvcmUgb2YgdGhlIGNhcmQgbWFuYWdlciAoY3JlYXRlIGEgY2FydCwgZGVsZXRlIGEgY2FyZCBhbmQgc2F2ZSBjYXJkKSAqKioqKi9cbi8qKlxuICogVGhpcyBjbGFzcyBtYW5hZyBhbGwgdGhlIGNhcmRzIGNyZWF0ZWQuIFRoaXMgaXMgdGhlIHNlZ21lbnQgaGlzdG9yeS5cbiAqIEB0eXBlIHtIVE1MRWxlbWVudCB8IG51bGx9XG4gKi9cbnZhciB3cmFwcGVyQ29tbWFuZEFuZFJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3cmFwcGVyQ29tbWFuZEFuZFJhbmdlaWRcIik7XG5cbi8vVE9ETyBTYXZlIGFuZCBsb2FkIGJ1dHRvbiwgZG8gbm8gZGVsZXRlXG4vKnNhdmVMb2dCdG4uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsZnVuY3Rpb24gKGUpIHtcbiAgY29uc29sZS5sb2coXCJzYXZpbmcgbG9nXCIpO1xuICBhcnJheUNhcmQuZm9yRWFjaChmdW5jdGlvbiAoYXJyYXlJdGVtKSB7XG4gICAvLyBhcnJheUl0ZW0udXBkYXRlSW5mbygpO1xuICAgIC8vYXJyYXlJdGVtLlxuICB9KTtcbiAgZXhwb3J0Q2FyZHNKU29uKCk7XG4gIHRleHRTYXZlTG9nLmlubmVyVGV4dCA9IFwiTG9nIHNhdmVkIVwiIDtcbn0pO1xuXG5sb2FkTG9nQnRuLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gIGxvYWRKU09OKG51bGwpO1xufTtcblxubG9hZExvZ0J0bi5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLGZ1bmN0aW9uIChlKSB7XG4gIC8vY29uc29sZS5sb2coXCJBQUFBQUFcIik7XG4gIC8vdmFyIG15ZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gIC8vY29uc29sZS5sb2coIGxvYWRMb2dCdG4udmFsdWUpO1xufSk7XG5cblxuXG4vKlxuXG5cblxuLy9kcmFnRWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhcmQxXCIpKTtcblxuXG5hZGRDYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgY3JlYXRlTmV3Q2FyZCgpO1xufSk7Ki9cblxuXG5mdW5jdGlvbiBjbGVhblNlZ21lbnRIaXN0b3J5KCl7XG4gIGNvbnNvbGUubG9nKFwiVEVTVElOR1wiKTtcbiAgY2xlYXJBbGxUaW1lcigpO1xuICBhcnJheUNhcmQuZm9yRWFjaChmdW5jdGlvbihlKXtcbiAgICAgIGRlbGV0ZUNhcmRVSShlKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvYWRKU09OKCkge1xuICB2YXIgZmlsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9nRmlsZUxvYWQnKS5maWxlcztcbiAgaWYgKCFmaWxlcy5sZW5ndGgpIHtcbiAgICBhbGVydCgnUGxlYXNlIHNlbGVjdCBhIGZpbGUhJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICB2YXIgZmlsZSA9IGZpbGVzWzBdO1xuICB2YXIgc3RhcnQgPSAgMDtcbiAgdmFyIHN0b3AgPSBmaWxlLnNpemUgLSAxO1xuICBcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gIHZhciB0ZXN0ID0gMDtcbiAgXG4gIC8vIElmIHdlIHVzZSBvbmxvYWRlbmQsIHdlIG5lZWQgdG8gY2hlY2sgdGhlIHJlYWR5U3RhdGUuXG4gIHJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbihldnQpIHtcbiAgICBpZiAoZXZ0LnRhcmdldC5yZWFkeVN0YXRlID09IEZpbGVSZWFkZXIuRE9ORSkgeyAvLyBET05FID09IDJcbiAgICAgIHZhciB0ZXN0ID0gZXZ0LnRhcmdldC5yZXN1bHQ7XG4gICAgICBjb25zb2xlLmxvZygnUmVhZCBieXRlczogJywgc3RhcnQgKyAxLCAnIC0gJywgc3RvcCArIDEsXG4gICAgICAgICAgJyBvZiAnLCBmaWxlLnNpemUsICcgYnl0ZSBmaWxlJyApO1xuICAgICAgY29uc29sZS5sb2codGVzdCk7XG4gICAgICB2YXIgbXlfSlNPTl9vYmplY3QgPSBKU09OLnBhcnNlKHRlc3QpO1xuICBcbiAgICAgIGNvbnNvbGUubG9nKG15X0pTT05fb2JqZWN0KTtcbiAgXG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IG15X0pTT05fb2JqZWN0Lmxlbmd0aDsgaysrKSB7XG4gICAgICAgIGFkZGluZ05ld0NhcmRzRnJvbUpTb24obXlfSlNPTl9vYmplY3Rba10pO1xuICAgICAgfVxuICBcbiAgICB9XG4gIH07XG4gIHZhciBibG9iID0gZmlsZS5zbGljZShzdGFydCwgc3RvcCArIDEpO1xuICByZWFkZXIucmVhZEFzQmluYXJ5U3RyaW5nKGJsb2IpO1xufVxuXG4vL0FkZCBhIGNhcmQgZnJvbSBhIGpzb24gZmlsZVxuZnVuY3Rpb24gYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbihjYXJkSW5mbykge1xuICBpZiAoY2FyZEluZm8uc3RhcnRQID4gY2FyZEluZm8uZW5kUCkge1xuICAgIGxldCB0cmFuc2l0ID0gY2FyZEluZm8uc3RhcnRQO1xuICAgIGNhcmRJbmZvLnN0YXJ0UCA9IGNhcmRJbmZvLmVuZFA7XG4gICAgY2FyZEluZm8uZW5kUCA9IHRyYW5zaXQ7XG4gIH1cbiAgaWYgKGNhcmRJbmZvLnN0YXJ0UCA8IDApIHtcbiAgICBjYXJkSW5mby5zdGFydFAgPSAwO1xuICB9XG4gIGxldCByZXN1bHQgPSBzbGlkZXJUb1ZpZGVvKGNhcmRJbmZvLnN0YXJ0UCwgY2FyZEluZm8uZW5kUCk7XG4gIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gIG51bWJlck9mQ2FyZCsrO1xuICBpZiAoIWNhcmRJbmZvLmRlbGV0ZWQpIHtcbiAgICB2YXIgY2FyZCA9IENhcmQocmVzdWx0LnN0YXJ0RHVyYXRpb24sIHJlc3VsdC5lbmREdXJhdGlvbiwgY2FyZEluZm8uc3RhcnRQLCBjYXJkSW5mby5lbmRQLCBjYXJkSW5mbyk7XG4gICAgY2FyZE1hbmFnZXIuZXhlY3V0ZShuZXcgQ3JlYXRlTmV3Q2FyZENvbW1hbmQoY2FyZCkpO1xuICAgIGFycmF5Q2FyZC5wdXNoKGNhcmQpO1xuICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmluc2VydEJlZm9yZShjYXJkLmlEaXYsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXZDYXJkQm9hcmQnKS5maXJzdENoaWxkKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZGluZyBhIGNhcmQgYnkgZHJhZyBhbmQgZHJvcC4gVGhlIGNhcmQgaXMgYWRkZWQgaW4gdGhlIGxpc3Qgb2YgY2FyZHNcbiAqIFJldHVybiB0aGUgY2FyZCB0aGF0IGhhdmUgYmVlbiBjcmVhdGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZU5ld0NhcmQoc3RhcnRQLCBlbmRQKSB7XG4gIC8vY29uc29sZS5sb2coXCJURVNUIC8gOiBcIiArIHN0YXJ0UCArIFwiIFwiICsgZW5kUCk7XG4gIGlmIChzdGFydFAgPiBlbmRQKSB7XG4gICAgbGV0IHRyYW5zaXQgPSBzdGFydFA7XG4gICAgc3RhcnRQID0gZW5kUDtcbiAgICBlbmRQID0gdHJhbnNpdDtcbiAgfVxuICBsZXQgcmVzdWx0ID0gc2xpZGVyVG9WaWRlbyhzdGFydFAsIGVuZFApO1xuICBudW1iZXJPZkNhcmQrKztcbiAgdmFyIGNhcmQgPSBuZXcgQ2FyZChyZXN1bHQuc3RhcnREdXJhdGlvbiwgcmVzdWx0LmVuZER1cmF0aW9uLCBzdGFydFAsIGVuZFApO1xuICBjYXJkTWFuYWdlci5leGVjdXRlKG5ldyBDcmVhdGVOZXdDYXJkQ29tbWFuZChjYXJkKSk7XG4gIHJldHVybiBjYXJkO1xufVxuXG5mdW5jdGlvbiBhZGRpbmdOZXdDYXJkKCkge1xuICBhcnJheUNhcmQucHVzaCh0aGlzLmNhcmQpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2Q2FyZEJvYXJkJykuaW5zZXJ0QmVmb3JlKHRoaXMuY2FyZC5pRGl2LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2Q2FyZEJvYXJkJykuZmlyc3RDaGlsZCk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUNhcmQoKSB7XG4gIC8vU3VwcHJpbWUgbGEgY2FydGUgZGUgbGEgbGlzdGUgZGUgY2FydGVcbiAgLypmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Q2FyZC5sZW5ndGggICA7IGkrKykge1xuICAgIGlmKGFycmF5Q2FyZFtpXSAgPT09IGNhcmQpe1xuICAgICAgdmFyIHN1cENhcmQgPSBhcnJheUNhcmQuc3BsaWNlKGksMSk7XG4gICAgICBhcnJheUNhcmREZWxldGVkLnB1c2goc3VwQ2FyZCk7XG4gICAgICBjb25zb2xlLmxvZyhcImRlbGV0ZWQgY2FyZCA6IFwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHN1cENhcmQpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9Ki9cbiAgLy9kZWxldGVDYXJkVUkoY2FyZCk7XG4gIC8qYXJyYXlDYXJkRGVsZXRlZC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBjb25zb2xlLmxvZyggICBlbGVtZW50KTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICBhcnJheUNhcmQuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgY29uc29sZS5sb2coZWxlbWVudCk7XG4gIH0pOyovXG4gIGNsZWFyQWxsVGltZXIoKTtcbiAgZGVsZXRlQ2FyZFVJKHRoaXMuY2FyZCk7XG4gIHJldHVybiB0aGlzLmNhcmQ7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUNhcmRVSShjYXJkKSB7XG4gIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG4gIGNhcmQuaURpdi5yZW1vdmUoKTtcbiAgY2FyZC5kZWxldGVkID0gdHJ1ZVxufVxuXG5cbi8qLS0tLS0tIEV4cG9ydCBjYXJkIGluIGEgSlNPTiBmaWxlICAtLS0tLS0tKi9cbi8vVE9ET1xuZnVuY3Rpb24gZXhwb3J0Q2FyZCgpIHtcbiAgdmFyIGFycmF5SXRlbVVwZGF0ZWQgPSBbXTtcbiAgYXJyYXlDYXJkLmZvckVhY2goZnVuY3Rpb24oYXJyYXlJdGVtKSB7XG4gICAgLy9hcnJheUl0ZW0udXBkYXRlSW5mbygpO1xuICAgIHZhciBpdGVtID0gYXJyYXlJdGVtLnVwZGF0ZUluZm8oKTtcbiAgICBhcnJheUl0ZW1VcGRhdGVkLnB1c2goaXRlbSk7XG4gICAgLy8gY29uc29sZS5sb2coaXRlbSk7XG4gIH0pO1xuICB2YXIgc2VyaWFsaXplZEFyciA9IEpTT04uc3RyaW5naWZ5KFthcnJheUl0ZW1VcGRhdGVkLCBudW1iZXJPZkNhcmRdKTtcbiAgY29uc29sZS5sb2coXCIqKioqKiAgU2VyaWFsaXNhdGlvbiBvZiBjYXJkIGNvbXBsZXRlIDogXCIgKyBzZXJpYWxpemVkQXJyKTtcbiAgZG93bmxvYWQoc2VyaWFsaXplZEFyciwgJ2pzb25XMmxvZy0nICsgY3JlYXRlVW5pcXVlSWQoKSArICcudHh0JywgJ3RleHQvcGxhaW4nKTtcbn07XG5cbmZ1bmN0aW9uIGRvd25sb2FkKGNvbnRlbnQsIGZpbGVOYW1lLCBjb250ZW50VHlwZSkge1xuICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICB2YXIgZmlsZSA9IG5ldyBCbG9iKFtjb250ZW50XSwge1xuICAgIHR5cGU6IGNvbnRlbnRUeXBlXG4gIH0pO1xuICBhLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICBhLmRvd25sb2FkID0gZmlsZU5hbWU7XG4gIGEuY2xpY2soKTtcbn0iXX0=