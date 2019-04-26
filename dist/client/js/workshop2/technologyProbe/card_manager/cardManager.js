'use strict';

var numberOfCard = 0;
var arrayCard = [];
//var arrayCardDeleted = [];
var commands = [];

var CardManager = function CardManager() {
  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    execute: function execute(command) {
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
    },
    exportCard: function exportCard() {
      console.log("function export card");
      /*------ Create a set of card from a JSON file -------*/
      var arrayItemUpdated = [];
      var listSegment = document.getElementsByClassName('segment');
      //playCard(arrayItem.iDiv, arrayItem.startP);
      console.log(listSegment);

      for (var i = 0; i < listSegment.length; i++) {
        console.log(listSegment[i].id); //second console output
        triggerMouseEvent(listSegment[i], 'mousedown');
      }
      arrayCard.forEach(function (arrayItem) {
        console.log(arrayItem);
        var item = arrayItem.updateInfo();
        arrayItemUpdated.push(item);
        console.log(item);
      });
      var serializedArr = JSON.stringify(arrayItemUpdated);
      console.log("*****  Serialisation of card complete : " + serializedArr);
      download(serializedArr, 'jsonW2log-' + createUniqueId() + '.json', 'text/plain');

      logger.saveSH(serializedArr);
    }, loadSegmentHistoryFromServer: function loadSegmentHistoryFromServer() {

      //We charge all the video only one time
      var xhr_view = new XMLHttpRequest();
      xhr_view.open('GET', 'src/client/js/workshop2/technologyProbe/card_manager/SHLoaderOverview_view.html', true);
      var view_SH_html = document.getElementById('SHPickerOverviewModal');

      xhr_view.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return; // or whatever error handling you want
        view_SH_html.innerHTML = this.responseText;
      };
      xhr_view.send();

      //We charge all the video only one time


      var xhr_allPath = new XMLHttpRequest();
      xhr_allPath.open('GET', 'src/server/log-SH/SH_all_path.txt', true);

      xhr_allPath.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return; // or whatever error handling you want


        var lines = this.responseText.split('\n');
        for (var j = 0; j < lines.length - 1; j++) {
          var xhr_SH = new XMLHttpRequest();
          xhr_SH.open('GET', lines[j], true);
          xhr_SH.onreadystatechange = function () {
            console.log(this.responseText);
            //Ici il faut lire les fichier json et créer un appercu de chaque
          };
          xhr_SH.send();

          var div = document.createElement('div');
          div.className = 'gridSH';
          var split = lines[j].split('/');
          //get only the name
          var nameSH = split[split.length - 1];
          console.log(nameSH);
          div.innerHTML = nameSH;
          document.getElementById('SH_list').appendChild(div);
          div.setAttribute("nameSH", lines[j]);
          div.addEventListener("mousedown", function () {
            console.log(this.getAttribute("nameSH"));
            loadJSONSegmentHistory(this.getAttribute("nameSH"));
          });
        }
      };
      xhr_allPath.send();
    }

  };
};

/*Private function, do not call outside the CardManager*/

function triggerMouseEvent(node, eventType) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

/**** Functional core of the card manager (create a cart, delete a card and save card) *****/
/**
 * This class manag all the cards created. This is the segment history.
 * @type {HTMLElement | null}
 */
var wrapperCommandAndRange = document.getElementById("wrapperCommandAndRangeid");

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
  console.log(cardInfo.startP, cardInfo.endP);
  var result = Player.sliderToVideo(cardInfo.startP, cardInfo.endP);
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
    var transit = startP;
    startP = endP;
    endP = transit;
  }
  var result = Player.sliderToVideo(startP, endP);
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
  card.deleted = true;
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

  var generatedJson = generateJSONfromvar();
  var my_JSON_object = JSON.parse(generatedJson);
  console.log(my_JSON_object);
  for (var k = 0; k < my_JSON_object.length; k++) {
    addingNewCardsFromJSon(my_JSON_object[k]);
  }
}

function loadJSONSegmentHistory2() {
  var generatedJson2 = generateJSONfromvar2();
  var my_JSON_object = JSON.parse(generatedJson2);
  console.log(my_JSON_object);
  for (var k = 0; k < my_JSON_object.length; k++) {
    addingNewCardsFromJSon(my_JSON_object[k]);
  }
}

function loadJSONSegmentHistory(SH_path) {

  var xhr_SH = new XMLHttpRequest();
  xhr_SH.open('GET', SH_path, true);

  xhr_SH.onreadystatechange = function () {
    if (this.readyState !== 4) return;
    if (this.status !== 200) return; // or whatever error handling you want
    console.log(this.responseText);
    var generatedJson2 = this.responseText;

    var my_JSON_object = JSON.parse(generatedJson2);
    console.log(my_JSON_object);
    for (var k = 0; k < my_JSON_object.length; k++) {
      addingNewCardsFromJSon(my_JSON_object[k]);
    }
  };
  xhr_SH.send();

  var elms = document.getElementById('SHPickerOverview');
  var span = document.getElementsByClassName("close")[1];

  span.addEventListener("mousedown", function () {
    elms.style.display = "none";
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIm51bWJlck9mQ2FyZCIsImFycmF5Q2FyZCIsImNvbW1hbmRzIiwiQ2FyZE1hbmFnZXIiLCJleGVjdXRlIiwiY29tbWFuZCIsImxvZ2dlciIsInNlbmRBbmRMb2dDb21tYW5kIiwicHVzaCIsInVuZG8iLCJwb3AiLCJleHBvcnRDYXJkIiwiY29uc29sZSIsImxvZyIsImFycmF5SXRlbVVwZGF0ZWQiLCJsaXN0U2VnbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImkiLCJsZW5ndGgiLCJpZCIsInRyaWdnZXJNb3VzZUV2ZW50IiwiZm9yRWFjaCIsImFycmF5SXRlbSIsIml0ZW0iLCJ1cGRhdGVJbmZvIiwic2VyaWFsaXplZEFyciIsIkpTT04iLCJzdHJpbmdpZnkiLCJkb3dubG9hZCIsImNyZWF0ZVVuaXF1ZUlkIiwic2F2ZVNIIiwibG9hZFNlZ21lbnRIaXN0b3J5RnJvbVNlcnZlciIsInhocl92aWV3IiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwidmlld19TSF9odG1sIiwiZ2V0RWxlbWVudEJ5SWQiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwiaW5uZXJIVE1MIiwicmVzcG9uc2VUZXh0Iiwic2VuZCIsInhocl9hbGxQYXRoIiwibGluZXMiLCJzcGxpdCIsImoiLCJ4aHJfU0giLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwibmFtZVNIIiwiYXBwZW5kQ2hpbGQiLCJzZXRBdHRyaWJ1dGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0QXR0cmlidXRlIiwibG9hZEpTT05TZWdtZW50SGlzdG9yeSIsIm5vZGUiLCJldmVudFR5cGUiLCJjbGlja0V2ZW50IiwiY3JlYXRlRXZlbnQiLCJpbml0RXZlbnQiLCJkaXNwYXRjaEV2ZW50Iiwid3JhcHBlckNvbW1hbmRBbmRSYW5nZSIsImNsZWFuU2VnbWVudEhpc3RvcnkiLCJjbGVhckFsbFRpbWVyIiwiZSIsImRlbGV0ZUNhcmRVSSIsImxvYWRKU09OIiwiZmlsZXMiLCJhbGVydCIsImZpbGUiLCJzdGFydCIsInN0b3AiLCJzaXplIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsInRlc3QiLCJvbmxvYWRlbmQiLCJldnQiLCJ0YXJnZXQiLCJET05FIiwicmVzdWx0IiwibXlfSlNPTl9vYmplY3QiLCJwYXJzZSIsImsiLCJhZGRpbmdOZXdDYXJkc0Zyb21KU29uIiwiYmxvYiIsInNsaWNlIiwicmVhZEFzQmluYXJ5U3RyaW5nIiwiY2FyZEluZm8iLCJzdGFydFAiLCJlbmRQIiwidHJhbnNpdCIsIlBsYXllciIsInNsaWRlclRvVmlkZW8iLCJkZWxldGVkIiwic3RhcnREdXJhdGlvbiIsImVuZER1cmF0aW9uIiwiY2FyZCIsIkNhcmQiLCJjYXJkTWFuYWdlciIsIkNyZWF0ZU5ld0NhcmRDb21tYW5kIiwiY3JlYXRlTmV3Q2FyZCIsImFkZGluZ05ld0NhcmQiLCJpbnNlcnRCZWZvcmUiLCJpRGl2IiwiZmlyc3RDaGlsZCIsImRlbGV0ZUNhcmQiLCJmZWVkYmFja09uU2xpZGVyVmlkZW8iLCJyZW1vdmUiLCJjb250ZW50IiwiZmlsZU5hbWUiLCJjb250ZW50VHlwZSIsImEiLCJCbG9iIiwidHlwZSIsImhyZWYiLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJjbGljayIsImxvYWRKU09OU2VnbWVudEhpc3RvcnkxIiwiZ2VuZXJhdGVKU09OZnJvbXZhciIsImdlbmVyYXRlZEpzb24iLCJsb2FkSlNPTlNlZ21lbnRIaXN0b3J5MiIsImdlbmVyYXRlZEpzb24yIiwiZ2VuZXJhdGVKU09OZnJvbXZhcjIiLCJTSF9wYXRoIiwiZWxtcyIsInNwYW4iLCJzdHlsZSIsImRpc3BsYXkiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsZUFBZSxDQUFuQjtBQUNBLElBQUlDLFlBQVksRUFBaEI7QUFDQTtBQUNBLElBQUlDLFdBQVcsRUFBZjs7QUFJQSxJQUFJQyxjQUFjLFNBQWRBLFdBQWMsR0FBVztBQUMzQjtB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QixDQUF0QixFQUF5QjtBQUN6QixRQUFJLEtBQUtDLE1BQUwsS0FBYyxHQUFsQixFQUF1QixPQUZlLENBRVA7QUFDL0I1QixZQUFRQyxHQUFSLENBQVksS0FBSzZCLFlBQWpCO0FBQ0EsUUFBSW9GLGlCQUFpQixLQUFLcEYsWUFBMUI7O0FBRUEsUUFBSTBDLGlCQUFpQnpELEtBQUswRCxLQUFMLENBQVd5QyxjQUFYLENBQXJCO0FBQ0FsSCxZQUFRQyxHQUFSLENBQVl1RSxjQUFaO0FBQ0EsU0FBSyxJQUFJRSxJQUFJLENBQWIsRUFBZ0JBLElBQUlGLGVBQWVqRSxNQUFuQyxFQUEyQ21FLEdBQTNDLEVBQWdEO0FBQzlDQyw2QkFBdUJILGVBQWVFLENBQWYsQ0FBdkI7QUFDRDtBQUVGLEdBWkQ7QUFhQXRDLFNBQU9MLElBQVA7O0FBR0EsTUFBSXNGLE9BQU9qSCxTQUFTcUIsY0FBVCxDQUF3QixrQkFBeEIsQ0FBWDtBQUNBLE1BQUk2RixPQUFPbEgsU0FBU0Msc0JBQVQsQ0FBZ0MsT0FBaEMsRUFBeUMsQ0FBekMsQ0FBWDs7QUFFQWlILE9BQUszRSxnQkFBTCxDQUF1QixXQUF2QixFQUFxQyxZQUFXO0FBQzlDMEUsU0FBS0UsS0FBTCxDQUFXQyxPQUFYLEdBQXFCLE1BQXJCO0FBQ0QsR0FGRDtBQUlEIiwiZmlsZSI6ImNhcmRNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG51bWJlck9mQ2FyZCA9IDA7XG52YXIgYXJyYXlDYXJkID0gW107XG4vL3ZhciBhcnJheUNhcmREZWxldGVkID0gW107XG52YXIgY29tbWFuZHMgPSBbXTtcblxuXG5cbnZhciBDYXJkTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICAvL0kgaW1wbGVtZW50ZWQgYSBjb21tYW5kIHBhdHRlcm4sIHNlZSA6IGh0dHBzOi8vd3d3LmRvZmFjdG9yeS5jb20vamF2YXNjcmlwdC9jb21tYW5kLWRlc2lnbi1wYXR0ZXJuXG4gIHJldHVybiB7XG4gICAgLy9leGVjdXRlIGEgY29tbWFuZFxuICAgIGV4ZWN1dGU6IGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgICAgY29tbWFuZC5leGVjdXRlKCk7XG4gICAgICAvL1dlIHNlbmQgdGhlIGNvbW1hbmQgdG8gdGhlIHNlcnZlciAodGhlIHNlcnZlciBsb2cgaXQgaW50byBhIGZpbGUsIHNlZSAuL3NyYy9zZXJ2ZXIvU2VydmVyTG9nZ2VyKVxuICAgICAgbG9nZ2VyLnNlbmRBbmRMb2dDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgLy9hbmQgd2Ugc2F2ZSB0aGUgY29tbWFuZCBjcmVhdGVkXG4gICAgICBjb21tYW5kcy5wdXNoKGNvbW1hbmQpO1xuICAgIH0sXG4gICAgLy9VbmRvIGEgY29tbWFuZFxuICAgIHVuZG86IGZ1bmN0aW9uKCkge1xuICAgICAgLy9UT0RPXG4gICAgICB2YXIgY29tbWFuZCA9IGNvbW1hbmRzLnBvcCgpO1xuICAgICAgY29tbWFuZC51bmRvKCk7XG4gICAgfSxcbiAgICBleHBvcnRDYXJkOiBmdW5jdGlvbigpe1xuICAgICAgY29uc29sZS5sb2coXCJmdW5jdGlvbiBleHBvcnQgY2FyZFwiKTtcbiAgICAgIC8qLS0tLS0tIENyZWF0ZSBhIHNldCBvZiBjYXJkIGZyb20gYSBKU09OIGZpbGUgLS0tLS0tLSovXG4gICAgICB2YXIgYXJyYXlJdGVtVXBkYXRlZCA9IFtdO1xuICAgICAgdmFyIGxpc3RTZWdtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VnbWVudCcpO1xuICAgICAgLy9wbGF5Q2FyZChhcnJheUl0ZW0uaURpdiwgYXJyYXlJdGVtLnN0YXJ0UCk7XG4gICAgICBjb25zb2xlLmxvZyhsaXN0U2VnbWVudCk7XG4gICAgICBcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdFNlZ21lbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc29sZS5sb2cobGlzdFNlZ21lbnRbaV0uaWQpOyAvL3NlY29uZCBjb25zb2xlIG91dHB1dFxuICAgICAgICB0cmlnZ2VyTW91c2VFdmVudChsaXN0U2VnbWVudFtpXSwnbW91c2Vkb3duJyk7XG4gICAgICB9XG4gICAgICAgIGFycmF5Q2FyZC5mb3JFYWNoKGZ1bmN0aW9uKGFycmF5SXRlbSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGFycmF5SXRlbSk7XG4gICAgICAgICAgdmFyIGl0ZW0gPSBhcnJheUl0ZW0udXBkYXRlSW5mbygpO1xuICAgICAgICAgIGFycmF5SXRlbVVwZGF0ZWQucHVzaChpdGVtKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBzZXJpYWxpemVkQXJyID0gSlNPTi5zdHJpbmdpZnkoYXJyYXlJdGVtVXBkYXRlZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiKioqKiogIFNlcmlhbGlzYXRpb24gb2YgY2FyZCBjb21wbGV0ZSA6IFwiICsgc2VyaWFsaXplZEFycik7XG4gICAgICAgIGRvd25sb2FkKHNlcmlhbGl6ZWRBcnIsICdqc29uVzJsb2ctJyArIGNyZWF0ZVVuaXF1ZUlkKCkgKyAnLmpzb24nLCAndGV4dC9wbGFpbicpO1xuICAgICAgICBcbiAgICAgICAgbG9nZ2VyLnNhdmVTSChzZXJpYWxpemVkQXJyKTtcbiAgICB9LCBsb2FkU2VnbWVudEhpc3RvcnlGcm9tU2VydmVyOiBmdW5jdGlvbigpe1xuICAgIFxuICAgIFxuICAgIFxuICAgICAgLy9XZSBjaGFyZ2UgYWxsIHRoZSB2aWRlbyBvbmx5IG9uZSB0aW1lXG4gICAgICB2YXIgeGhyX3ZpZXcgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhocl92aWV3Lm9wZW4oJ0dFVCcsICdzcmMvY2xpZW50L2pzL3dvcmtzaG9wMi90ZWNobm9sb2d5UHJvYmUvY2FyZF9tYW5hZ2VyL1NITG9hZGVyT3ZlcnZpZXdfdmlldy5odG1sJywgdHJ1ZSk7XG4gICAgICB2YXIgdmlld19TSF9odG1sID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1NIUGlja2VyT3ZlcnZpZXdNb2RhbCcpO1xuICAgIFxuICAgICAgeGhyX3ZpZXcub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlIT09NCkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMhPT0yMDApIHJldHVybjsgLy8gb3Igd2hhdGV2ZXIgZXJyb3IgaGFuZGxpbmcgeW91IHdhbnRcbiAgICAgICAgdmlld19TSF9odG1sLmlubmVySFRNTD0gdGhpcy5yZXNwb25zZVRleHQ7XG4gICAgICB9O1xuICAgICAgeGhyX3ZpZXcuc2VuZCgpO1xuICAgIFxuICAgICAgLy9XZSBjaGFyZ2UgYWxsIHRoZSB2aWRlbyBvbmx5IG9uZSB0aW1lXG4gICAgICBcbiAgICAgIFxuICAgICAgdmFyIHhocl9hbGxQYXRoID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHJfYWxsUGF0aC5vcGVuKCdHRVQnLCAnc3JjL3NlcnZlci9sb2ctU0gvU0hfYWxsX3BhdGgudHh0JywgdHJ1ZSk7XG4gICAgXG4gICAgICB4aHJfYWxsUGF0aC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUhPT00KSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyE9PTIwMCkgcmV0dXJuOyAvLyBvciB3aGF0ZXZlciBlcnJvciBoYW5kbGluZyB5b3Ugd2FudFxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIHZhciBsaW5lcyA9IHRoaXMucmVzcG9uc2VUZXh0LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IGxpbmVzLmxlbmd0aC0xOyBqKyspe1xuICAgICAgICAgIHZhciB4aHJfU0ggPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICB4aHJfU0gub3BlbignR0VUJywgbGluZXNbal0sIHRydWUpO1xuICAgICAgICAgIHhocl9TSC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAvL0ljaSBpbCBmYXV0IGxpcmUgbGVzIGZpY2hpZXIganNvbiBldCBjcsOpZXIgdW4gYXBwZXJjdSBkZSBjaGFxdWVcbiAgICAgICAgICAgIFxuICAgICAgICAgIH07XG4gICAgICAgICAgeGhyX1NILnNlbmQoKTtcbiAgICAgICAgICBcbiAgICAgICAgIFxuICAgICAgICAgIFxuICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBkaXYuY2xhc3NOYW1lID0gJ2dyaWRTSCc7XG4gICAgICAgICAgdmFyIHNwbGl0ID0gbGluZXNbal0uc3BsaXQoJy8nKTtcbiAgICAgICAgICAvL2dldCBvbmx5IHRoZSBuYW1lXG4gICAgICAgICAgdmFyIG5hbWVTSCA9IHNwbGl0W3NwbGl0Lmxlbmd0aC0xXTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhuYW1lU0gpO1xuICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBuYW1lU0g7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1NIX2xpc3QnKS5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJuYW1lU0hcIixsaW5lc1tqXSApO1xuICAgICAgICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5nZXRBdHRyaWJ1dGUoXCJuYW1lU0hcIikpO1xuICAgICAgICAgICAgbG9hZEpTT05TZWdtZW50SGlzdG9yeSh0aGlzLmdldEF0dHJpYnV0ZShcIm5hbWVTSFwiKSk7XG4gICAgICAgICAgfSk7XG4gIFxuICAgICAgICB9XG4gIFxuICAgICAgfTtcbiAgICAgIHhocl9hbGxQYXRoLnNlbmQoKTtcbiAgICBcbiAgICAgIFxuICAgIFxuICAgIH0sXG4gICAgXG4gICAgXG4gIH1cbn07XG5cblxuLypQcml2YXRlIGZ1bmN0aW9uLCBkbyBub3QgY2FsbCBvdXRzaWRlIHRoZSBDYXJkTWFuYWdlciovXG5cblxuZnVuY3Rpb24gdHJpZ2dlck1vdXNlRXZlbnQgKG5vZGUsIGV2ZW50VHlwZSkge1xuICB2YXIgY2xpY2tFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50ICgnTW91c2VFdmVudHMnKTtcbiAgY2xpY2tFdmVudC5pbml0RXZlbnQgKGV2ZW50VHlwZSwgdHJ1ZSwgdHJ1ZSk7XG4gIG5vZGUuZGlzcGF0Y2hFdmVudCAoY2xpY2tFdmVudCk7XG59XG5cbi8qKioqIEZ1bmN0aW9uYWwgY29yZSBvZiB0aGUgY2FyZCBtYW5hZ2VyIChjcmVhdGUgYSBjYXJ0LCBkZWxldGUgYSBjYXJkIGFuZCBzYXZlIGNhcmQpICoqKioqL1xuLyoqXG4gKiBUaGlzIGNsYXNzIG1hbmFnIGFsbCB0aGUgY2FyZHMgY3JlYXRlZC4gVGhpcyBpcyB0aGUgc2VnbWVudCBoaXN0b3J5LlxuICogQHR5cGUge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAqL1xudmFyIHdyYXBwZXJDb21tYW5kQW5kUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXJDb21tYW5kQW5kUmFuZ2VpZFwiKTtcblxuXG5cbmZ1bmN0aW9uIGNsZWFuU2VnbWVudEhpc3RvcnkoKXtcbiAgY29uc29sZS5sb2coXCJURVNUSU5HXCIpO1xuICBjbGVhckFsbFRpbWVyKCk7XG4gIGFycmF5Q2FyZC5mb3JFYWNoKGZ1bmN0aW9uKGUpe1xuICAgICAgZGVsZXRlQ2FyZFVJKGUpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbG9hZEpTT04oKSB7XG4gIHZhciBmaWxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dGaWxlTG9hZCcpLmZpbGVzO1xuICBpZiAoIWZpbGVzLmxlbmd0aCkge1xuICAgIGFsZXJ0KCdQbGVhc2Ugc2VsZWN0IGEgZmlsZSEnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIHZhciBmaWxlID0gZmlsZXNbMF07XG4gIHZhciBzdGFydCA9ICAwO1xuICB2YXIgc3RvcCA9IGZpbGUuc2l6ZSAtIDE7XG4gIFxuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgdmFyIHRlc3QgPSAwO1xuICAvLyBJZiB3ZSB1c2Ugb25sb2FkZW5kLCB3ZSBuZWVkIHRvIGNoZWNrIHRoZSByZWFkeVN0YXRlLlxuICByZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKGV2dC50YXJnZXQucmVhZHlTdGF0ZSA9PSBGaWxlUmVhZGVyLkRPTkUpIHsgLy8gRE9ORSA9PSAyXG4gICAgICB2YXIgdGVzdCA9IGV2dC50YXJnZXQucmVzdWx0O1xuICAgICAgY29uc29sZS5sb2coJ1JlYWQgYnl0ZXM6ICcsIHN0YXJ0ICsgMSwgJyAtICcsIHN0b3AgKyAxLFxuICAgICAgICAgICcgb2YgJywgZmlsZS5zaXplLCAnIGJ5dGUgZmlsZScgKTtcbiAgICAgIGNvbnNvbGUubG9nKHRlc3QpO1xuICAgICAgdmFyIG15X0pTT05fb2JqZWN0ID0gSlNPTi5wYXJzZSh0ZXN0KTtcbiAgXG4gICAgICBjb25zb2xlLmxvZyhteV9KU09OX29iamVjdCk7XG4gIFxuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBteV9KU09OX29iamVjdC5sZW5ndGg7IGsrKykge1xuICAgICAgICBhZGRpbmdOZXdDYXJkc0Zyb21KU29uKG15X0pTT05fb2JqZWN0W2tdKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHZhciBibG9iID0gZmlsZS5zbGljZShzdGFydCwgc3RvcCArIDEpO1xuICByZWFkZXIucmVhZEFzQmluYXJ5U3RyaW5nKGJsb2IpO1xufVxuXG4vL0FkZCBhIGNhcmQgZnJvbSBhIGpzb24gZmlsZVxuZnVuY3Rpb24gYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbihjYXJkSW5mbykge1xuICBpZiAoY2FyZEluZm8uc3RhcnRQID4gY2FyZEluZm8uZW5kUCkge1xuICAgIGxldCB0cmFuc2l0ID0gY2FyZEluZm8uc3RhcnRQO1xuICAgIGNhcmRJbmZvLnN0YXJ0UCA9IGNhcmRJbmZvLmVuZFA7XG4gICAgY2FyZEluZm8uZW5kUCA9IHRyYW5zaXQ7XG4gIH1cbiAgaWYgKGNhcmRJbmZvLnN0YXJ0UCA8IDApIHtcbiAgICBjYXJkSW5mby5zdGFydFAgPSAwO1xuICB9XG4gIGNvbnNvbGUubG9nKGNhcmRJbmZvLnN0YXJ0UCwgY2FyZEluZm8uZW5kUCk7XG4gIGxldCByZXN1bHQgPSBQbGF5ZXIuc2xpZGVyVG9WaWRlbyhjYXJkSW5mby5zdGFydFAsIGNhcmRJbmZvLmVuZFApO1xuICAvL2NvbnNvbGUubG9nKHJlc3VsdCk7XG4gIG51bWJlck9mQ2FyZCsrO1xuICBpZiAoIWNhcmRJbmZvLmRlbGV0ZWQpIHtcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQuc3RhcnREdXJhdGlvbiwgcmVzdWx0LmVuZER1cmF0aW9uLCBjYXJkSW5mby5zdGFydFAsIGNhcmRJbmZvLmVuZFAsIGNhcmRJbmZvKTtcbiAgICB2YXIgY2FyZCA9IENhcmQocmVzdWx0LnN0YXJ0RHVyYXRpb24sIHJlc3VsdC5lbmREdXJhdGlvbiwgY2FyZEluZm8uc3RhcnRQLCBjYXJkSW5mby5lbmRQLCBjYXJkSW5mbyk7XG4gICAgY2FyZE1hbmFnZXIuZXhlY3V0ZShuZXcgQ3JlYXRlTmV3Q2FyZENvbW1hbmQoY2FyZCkpO1xuICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmluc2VydEJlZm9yZShjYXJkLmlEaXYsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXZDYXJkQm9hcmQnKS5maXJzdENoaWxkKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZGluZyBhIGNhcmQgYnkgZHJhZyBhbmQgZHJvcC4gVGhlIGNhcmQgaXMgYWRkZWQgaW4gdGhlIGxpc3Qgb2YgY2FyZHNcbiAqIFJldHVybiB0aGUgY2FyZCB0aGF0IGhhdmUgYmVlbiBjcmVhdGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZU5ld0NhcmQoc3RhcnRQLCBlbmRQKSB7XG4gIC8vY29uc29sZS5sb2coXCJURVNUIC8gOiBcIiArIHN0YXJ0UCArIFwiIFwiICsgZW5kUCk7XG4gIGlmIChzdGFydFAgPiBlbmRQKSB7XG4gICAgbGV0IHRyYW5zaXQgPSBzdGFydFA7XG4gICAgc3RhcnRQID0gZW5kUDtcbiAgICBlbmRQID0gdHJhbnNpdDtcbiAgfVxuICBsZXQgcmVzdWx0ID0gUGxheWVyLnNsaWRlclRvVmlkZW8oc3RhcnRQLCBlbmRQKTtcbiAgbnVtYmVyT2ZDYXJkKys7XG4gIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gIFxuICB2YXIgY2FyZCA9IG5ldyBDYXJkKHJlc3VsdC5zdGFydER1cmF0aW9uLCByZXN1bHQuZW5kRHVyYXRpb24sIHN0YXJ0UCwgZW5kUCk7XG4gIGNhcmRNYW5hZ2VyLmV4ZWN1dGUobmV3IENyZWF0ZU5ld0NhcmRDb21tYW5kKGNhcmQpKTtcbiAgcmV0dXJuIGNhcmQ7XG59XG5cbmZ1bmN0aW9uIGFkZGluZ05ld0NhcmQoKSB7XG4gIGFycmF5Q2FyZC5wdXNoKHRoaXMuY2FyZCk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXZDYXJkQm9hcmQnKS5pbnNlcnRCZWZvcmUodGhpcy5jYXJkLmlEaXYsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXZDYXJkQm9hcmQnKS5maXJzdENoaWxkKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlQ2FyZCgpIHtcbiAgLy9TdXBwcmltZSBsYSBjYXJ0ZSBkZSBsYSBsaXN0ZSBkZSBjYXJ0ZVxuICAvKmZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXlDYXJkLmxlbmd0aCAgIDsgaSsrKSB7XG4gICAgaWYoYXJyYXlDYXJkW2ldICA9PT0gY2FyZCl7XG4gICAgICB2YXIgc3VwQ2FyZCA9IGFycmF5Q2FyZC5zcGxpY2UoaSwxKTtcbiAgICAgIGFycmF5Q2FyZERlbGV0ZWQucHVzaChzdXBDYXJkKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGVsZXRlZCBjYXJkIDogXCIpO1xuICAgICAgY29uc29sZS5sb2coc3VwQ2FyZCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH0qL1xuICAvL2RlbGV0ZUNhcmRVSShjYXJkKTtcbiAgLyphcnJheUNhcmREZWxldGVkLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGNvbnNvbGUubG9nKCAgIGVsZW1lbnQpO1xuICB9KTtcbiAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKipcIik7XG4gIGFycmF5Q2FyZC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgfSk7Ki9cbiAgY2xlYXJBbGxUaW1lcigpO1xuICBkZWxldGVDYXJkVUkodGhpcy5jYXJkKTtcbiAgcmV0dXJuIHRoaXMuY2FyZDtcbn1cblxuZnVuY3Rpb24gZGVsZXRlQ2FyZFVJKGNhcmQpIHtcbiAgZmVlZGJhY2tPblNsaWRlclZpZGVvKGZhbHNlKTtcbiAgY2FyZC5pRGl2LnJlbW92ZSgpO1xuICBjYXJkLmRlbGV0ZWQgPSB0cnVlXG59XG5cbmZ1bmN0aW9uIGRvd25sb2FkKGNvbnRlbnQsIGZpbGVOYW1lLCBjb250ZW50VHlwZSkge1xuICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICBcbiAgXG4gLy9hLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIHZhciBmaWxlID0gbmV3IEJsb2IoW2NvbnRlbnRdLCB7XG4gICAgdHlwZTogY29udGVudFR5cGVcbiAgfSk7XG4gIFxuICBhLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICBhLmRvd25sb2FkID0gZmlsZU5hbWU7XG4gIGEuY2xpY2soKTtcbiAgYS5yZW1vdmUoKTtcbiAgXG4gIFxuICBcbiAgXG59XG5cblxuXG5mdW5jdGlvbiBsb2FkSlNPTlNlZ21lbnRIaXN0b3J5MSgpIHtcbiAgXG4gICAgICBjb25zb2xlLmxvZyhnZW5lcmF0ZUpTT05mcm9tdmFyKCkpO1xuICAgICAgXG4gICAgICBsZXQgZ2VuZXJhdGVkSnNvbiA9IGdlbmVyYXRlSlNPTmZyb212YXIoKTtcbiAgICAgIHZhciBteV9KU09OX29iamVjdCA9IEpTT04ucGFyc2UoZ2VuZXJhdGVkSnNvbik7XG4gICAgICBjb25zb2xlLmxvZyhteV9KU09OX29iamVjdCk7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IG15X0pTT05fb2JqZWN0Lmxlbmd0aDsgaysrKSB7XG4gICAgICAgIGFkZGluZ05ld0NhcmRzRnJvbUpTb24obXlfSlNPTl9vYmplY3Rba10pO1xuICAgIH1cbiAgXG59XG5cbmZ1bmN0aW9uIGxvYWRKU09OU2VnbWVudEhpc3RvcnkyKCkge1xuICBsZXQgZ2VuZXJhdGVkSnNvbjIgPSBnZW5lcmF0ZUpTT05mcm9tdmFyMigpO1xuICB2YXIgbXlfSlNPTl9vYmplY3QgPSBKU09OLnBhcnNlKGdlbmVyYXRlZEpzb24yKTtcbiAgY29uc29sZS5sb2cobXlfSlNPTl9vYmplY3QpO1xuICBmb3IgKGxldCBrID0gMDsgayA8IG15X0pTT05fb2JqZWN0Lmxlbmd0aDsgaysrKSB7XG4gICAgYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbihteV9KU09OX29iamVjdFtrXSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbG9hZEpTT05TZWdtZW50SGlzdG9yeShTSF9wYXRoKSB7XG4gIFxuICBcbiAgdmFyIHhocl9TSCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB4aHJfU0gub3BlbignR0VUJywgU0hfcGF0aCwgdHJ1ZSk7XG4gIFxuICB4aHJfU0gub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnJlYWR5U3RhdGUhPT00KSByZXR1cm47XG4gICAgaWYgKHRoaXMuc3RhdHVzIT09MjAwKSByZXR1cm47IC8vIG9yIHdoYXRldmVyIGVycm9yIGhhbmRsaW5nIHlvdSB3YW50XG4gICAgY29uc29sZS5sb2codGhpcy5yZXNwb25zZVRleHQpO1xuICAgIGxldCBnZW5lcmF0ZWRKc29uMiA9IHRoaXMucmVzcG9uc2VUZXh0O1xuICAgIFxuICAgIHZhciBteV9KU09OX29iamVjdCA9IEpTT04ucGFyc2UoZ2VuZXJhdGVkSnNvbjIpO1xuICAgIGNvbnNvbGUubG9nKG15X0pTT05fb2JqZWN0KTtcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IG15X0pTT05fb2JqZWN0Lmxlbmd0aDsgaysrKSB7XG4gICAgICBhZGRpbmdOZXdDYXJkc0Zyb21KU29uKG15X0pTT05fb2JqZWN0W2tdKTtcbiAgICB9XG4gICBcbiAgfTtcbiAgeGhyX1NILnNlbmQoKTtcbiAgXG4gIFxuICB2YXIgZWxtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTSFBpY2tlck92ZXJ2aWV3Jyk7XG4gIHZhciBzcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNsb3NlXCIpWzFdO1xuICBcbiAgc3Bhbi5hZGRFdmVudExpc3RlbmVyKCBcIm1vdXNlZG93blwiICwgZnVuY3Rpb24oKSB7XG4gICAgZWxtcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH0pO1xuICBcbn1cblxuIl19