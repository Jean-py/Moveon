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
    },
    exportCard: function exportCard() {
      /*------ Create a set of card from a JSON file -------*/
      var arrayItemUpdated = [];
      var listSegment = document.getElementsByClassName('segment');
      //playCard(arrayItem.iDiv, arrayItem.startP);
      console.log(listSegment);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = listSegment[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          console.log(item.id);
          triggerMouseEvent(item, 'mousedown');
        }

        // var item = arrayItem.updateInfo();
        // triggerMouseEvent( a, "mousedown");
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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
    }

  };
};

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
  var result = Player.sliderToVideo(cardInfo.startP, cardInfo.endP);
  console.log(result);
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
  var file = new Blob([content], {
    type: contentType
  });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  a.remove();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIm51bWJlck9mQ2FyZCIsImFycmF5Q2FyZCIsImNvbW1hbmRzIiwiQ2FyZE1hbmFnZXIiLCJleGVjdXRlIiwiY29tbWFuZCIsImxvZ2dlciIsInNlbmRBbmRMb2dDb21tYW5kIiwicHVzaCIsInVuZG8iLCJwb3AiLCJleHBvcnRDYXJkIiwiYXJyYXlJdGVtVXBkYXRlZCIsImxpc3RTZWdtZW50IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiY29uc29sZSIsImxvZyIsIml0ZW0iLCJpZCIsInRyaWdnZXJNb3VzZUV2ZW50IiwiZm9yRWFjaCIsImFycmF5SXRlbSIsInVwZGF0ZUluZm8iLCJzZXJpYWxpemVkQXJyIiwiSlNPTiIsInN0cmluZ2lmeSIsImRvd25sb2FkIiwiY3JlYXRlVW5pcXVlSWQiLCJub2RlIiwiZXZlbnRUeXBlIiwiY2xpY2tFdmVudCIsImNyZWF0ZUV2ZW50IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsIndyYXBwZXJDb21tYW5kQW5kUmFuZ2UiLCJnZXRFbGVtZW50QnlJZCIsImNsZWFuU2VnbWVudEhpc3RvcnkiLCJjbGVhckFsbFRpbWVyIiwiZSIsImRlbGV0ZUNhcmRVSSIsImxvYWRKU09OIiwiZmlsZXMiLCJsZW5ndGgiLCJhbGVydCIsImZpbGUiLCJzdGFydCIsInN0b3AiLCJzaXplIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsInRlc3QiLCJvbmxvYWRlbmQiLCJldnQiLCJ0YXJnZXQiLCJyZWFkeVN0YXRlIiwiRE9ORSIsInJlc3VsdCIsIm15X0pTT05fb2JqZWN0IiwicGFyc2UiLCJrIiwiYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbiIsImJsb2IiLCJzbGljZSIsInJlYWRBc0JpbmFyeVN0cmluZyIsImNhcmRJbmZvIiwic3RhcnRQIiwiZW5kUCIsInRyYW5zaXQiLCJQbGF5ZXIiLCJzbGlkZXJUb1ZpZGVvIiwiZGVsZXRlZCIsInN0YXJ0RHVyYXRpb24iLCJlbmREdXJhdGlvbiIsImNhcmQiLCJDYXJkIiwiY2FyZE1hbmFnZXIiLCJDcmVhdGVOZXdDYXJkQ29tbWFuZCIsImNyZWF0ZU5ld0NhcmQiLCJhZGRpbmdOZXdDYXJkIiwiaW5zZXJ0QmVmb3JlIiwiaURpdiIsImZpcnN0Q2hpbGQiLCJkZWxldGVDYXJkIiwiZmVlZGJhY2tPblNsaWRlclZpZGVvIiwicmVtb3ZlIiwiY29udGVudCIsImZpbGVOYW1lIiwiY29udGVudFR5cGUiLCJhIiwiY3JlYXRlRWxlbWVudCIsIkJsb2IiLCJ0eXBlIiwiaHJlZiIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImNsaWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGVBQWUsQ0FBbkI7QUFDQSxJQUFJQyxZQUFZLEVBQWhCO0FBQ0E7QUFDQSxJQUFJQyxXQUFXLEVBQWY7O0FBR0EsSUFBSUMsY0FBYyxTQUFkQSxXQUFjLEdBQVc7QUFDM0I7QUFDQSxTQUFPO0FBQ0w7QUFDQUMsYUFBUyxpQkFBU0MsT0FBVCxFQUFrQjtBQUN6QjtBQUNBOzs7Ozs7Ozs7Ozs7QUFZREEsY0FBUUQsT0FBUjtBQUNDO0FBQ0FFLGFBQU9DLGlCQUFQLENBQXlCRixPQUF6QjtBQUNBO0FBQ0FILGVBQVNNLElBQVQsQ0FBY0gsT0FBZDtBQUNELEtBckJJO0FBc0JMO0FBQ0FJLFVBQU0sZ0JBQVc7QUFDZjtBQUNBLFVBQUlKLFVBQVVILFNBQVNRLEdBQVQsRUFBZDtBQUNBTCxjQUFRSSxJQUFSO0FBQ0QsS0EzQkk7QUE0QkxFLGdCQUFZLHNCQUFVO0FBQ3BCO0FBQ0UsVUFBSUMsbUJBQW1CLEVBQXZCO0FBQ0YsVUFBSUMsY0FBY0MsU0FBU0Msc0JBQVQsQ0FBZ0MsU0FBaEMsQ0FBbEI7QUFDQTtBQUNBQyxjQUFRQyxHQUFSLENBQVlKLFdBQVo7O0FBTG9CO0FBQUE7QUFBQTs7QUFBQTtBQU9wQiw2QkFBaUJBLFdBQWpCLDhIQUE4QjtBQUFBLGNBQXJCSyxJQUFxQjs7QUFDNUJGLGtCQUFRQyxHQUFSLENBQVlDLEtBQUtDLEVBQWpCO0FBQ0FDLDRCQUFrQkYsSUFBbEIsRUFBdUIsV0FBdkI7QUFDRDs7QUFFRjtBQUNBO0FBYnFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBY2xCakIsZ0JBQVVvQixPQUFWLENBQWtCLFVBQVNDLFNBQVQsRUFBb0I7QUFDcENOLGdCQUFRQyxHQUFSLENBQVlLLFNBQVo7QUFDQSxZQUFJSixPQUFPSSxVQUFVQyxVQUFWLEVBQVg7QUFDQVgseUJBQWlCSixJQUFqQixDQUFzQlUsSUFBdEI7QUFDQUYsZ0JBQVFDLEdBQVIsQ0FBWUMsSUFBWjtBQUNELE9BTEQ7QUFNQSxVQUFJTSxnQkFBZ0JDLEtBQUtDLFNBQUwsQ0FBZWQsZ0JBQWYsQ0FBcEI7QUFDQUksY0FBUUMsR0FBUixDQUFZLDZDQUE2Q08sYUFBekQ7QUFDQUcsZUFBU0gsYUFBVCxFQUF3QixlQUFlSSxnQkFBZixHQUFrQyxPQUExRCxFQUFtRSxZQUFuRTtBQUNIOztBQW5ESSxHQUFQO0FBc0RELENBeEREOztBQTBEQSxTQUFTUixpQkFBVCxDQUE0QlMsSUFBNUIsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQzNDLE1BQUlDLGFBQWFqQixTQUFTa0IsV0FBVCxDQUFzQixhQUF0QixDQUFqQjtBQUNBRCxhQUFXRSxTQUFYLENBQXNCSCxTQUF0QixFQUFpQyxJQUFqQyxFQUF1QyxJQUF2QztBQUNBRCxPQUFLSyxhQUFMLENBQW9CSCxVQUFwQjtBQUNEOztBQUVEO0FBQ0E7Ozs7QUFJQSxJQUFJSSx5QkFBeUJyQixTQUFTc0IsY0FBVCxDQUF3QiwwQkFBeEIsQ0FBN0I7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBLFNBQVNDLG1CQUFULEdBQThCO0FBQzVCckIsVUFBUUMsR0FBUixDQUFZLFNBQVo7QUFDQXFCO0FBQ0FyQyxZQUFVb0IsT0FBVixDQUFrQixVQUFTa0IsQ0FBVCxFQUFXO0FBQ3pCQyxpQkFBYUQsQ0FBYjtBQUNILEdBRkQ7QUFHRDs7QUFFRCxTQUFTRSxRQUFULEdBQW9CO0FBQ2xCLE1BQUlDLFFBQVE1QixTQUFTc0IsY0FBVCxDQUF3QixhQUF4QixFQUF1Q00sS0FBbkQ7QUFDQSxNQUFJLENBQUNBLE1BQU1DLE1BQVgsRUFBbUI7QUFDakJDLFVBQU0sdUJBQU47QUFDQTtBQUNEOztBQUVELE1BQUlDLE9BQU9ILE1BQU0sQ0FBTixDQUFYO0FBQ0EsTUFBSUksUUFBUyxDQUFiO0FBQ0EsTUFBSUMsT0FBT0YsS0FBS0csSUFBTCxHQUFZLENBQXZCOztBQUVBLE1BQUlDLFNBQVMsSUFBSUMsVUFBSixFQUFiO0FBQ0EsTUFBSUMsT0FBTyxDQUFYO0FBQ0E7QUFDQUYsU0FBT0csU0FBUCxHQUFtQixVQUFTQyxHQUFULEVBQWM7QUFDL0IsUUFBSUEsSUFBSUMsTUFBSixDQUFXQyxVQUFYLElBQXlCTCxXQUFXTSxJQUF4QyxFQUE4QztBQUFFO0FBQzlDLFVBQUlMLE9BQU9FLElBQUlDLE1BQUosQ0FBV0csTUFBdEI7QUFDQXpDLGNBQVFDLEdBQVIsQ0FBWSxjQUFaLEVBQTRCNkIsUUFBUSxDQUFwQyxFQUF1QyxLQUF2QyxFQUE4Q0MsT0FBTyxDQUFyRCxFQUNJLE1BREosRUFDWUYsS0FBS0csSUFEakIsRUFDdUIsWUFEdkI7QUFFQWhDLGNBQVFDLEdBQVIsQ0FBWWtDLElBQVo7QUFDQSxVQUFJTyxpQkFBaUJqQyxLQUFLa0MsS0FBTCxDQUFXUixJQUFYLENBQXJCOztBQUVBbkMsY0FBUUMsR0FBUixDQUFZeUMsY0FBWjs7QUFFQSxXQUFLLElBQUlFLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsZUFBZWYsTUFBbkMsRUFBMkNpQixHQUEzQyxFQUFnRDtBQUM5Q0MsK0JBQXVCSCxlQUFlRSxDQUFmLENBQXZCO0FBQ0Q7QUFDRjtBQUNGLEdBZEQ7QUFlQSxNQUFJRSxPQUFPakIsS0FBS2tCLEtBQUwsQ0FBV2pCLEtBQVgsRUFBa0JDLE9BQU8sQ0FBekIsQ0FBWDtBQUNBRSxTQUFPZSxrQkFBUCxDQUEwQkYsSUFBMUI7QUFDRDs7QUFFRDtBQUNBLFNBQVNELHNCQUFULENBQWdDSSxRQUFoQyxFQUEwQztBQUN4QyxNQUFJQSxTQUFTQyxNQUFULEdBQWtCRCxTQUFTRSxJQUEvQixFQUFxQztBQUNuQyxRQUFJQyxVQUFVSCxTQUFTQyxNQUF2QjtBQUNBRCxhQUFTQyxNQUFULEdBQWtCRCxTQUFTRSxJQUEzQjtBQUNBRixhQUFTRSxJQUFULEdBQWdCQyxPQUFoQjtBQUNEO0FBQ0QsTUFBSUgsU0FBU0MsTUFBVCxHQUFrQixDQUF0QixFQUF5QjtBQUN2QkQsYUFBU0MsTUFBVCxHQUFrQixDQUFsQjtBQUNEO0FBQ0QsTUFBSVQsU0FBU1ksT0FBT0MsYUFBUCxDQUFxQkwsU0FBU0MsTUFBOUIsRUFBc0NELFNBQVNFLElBQS9DLENBQWI7QUFDQW5ELFVBQVFDLEdBQVIsQ0FBWXdDLE1BQVo7QUFDQXpEO0FBQ0EsTUFBSSxDQUFDaUUsU0FBU00sT0FBZCxFQUF1QjtBQUNyQnZELFlBQVFDLEdBQVIsQ0FBWXdDLE9BQU9lLGFBQW5CLEVBQWtDZixPQUFPZ0IsV0FBekMsRUFBc0RSLFNBQVNDLE1BQS9ELEVBQXVFRCxTQUFTRSxJQUFoRixFQUFzRkYsUUFBdEY7QUFDQSxRQUFJUyxPQUFPQyxLQUFLbEIsT0FBT2UsYUFBWixFQUEyQmYsT0FBT2dCLFdBQWxDLEVBQStDUixTQUFTQyxNQUF4RCxFQUFnRUQsU0FBU0UsSUFBekUsRUFBK0VGLFFBQS9FLENBQVg7QUFDQVcsZ0JBQVl4RSxPQUFaLENBQW9CLElBQUl5RSxvQkFBSixDQUF5QkgsSUFBekIsQ0FBcEI7QUFDQTtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7QUFJQSxTQUFTSSxhQUFULENBQXVCWixNQUF2QixFQUErQkMsSUFBL0IsRUFBcUM7QUFDbkM7QUFDQSxNQUFJRCxTQUFTQyxJQUFiLEVBQW1CO0FBQ2pCLFFBQUlDLFVBQVVGLE1BQWQ7QUFDQUEsYUFBU0MsSUFBVDtBQUNBQSxXQUFPQyxPQUFQO0FBQ0Q7QUFDRCxNQUFJWCxTQUFTWSxPQUFPQyxhQUFQLENBQXFCSixNQUFyQixFQUE2QkMsSUFBN0IsQ0FBYjtBQUNBbkU7QUFDQWdCLFVBQVFDLEdBQVIsQ0FBWXdDLE1BQVo7O0FBRUEsTUFBSWlCLE9BQU8sSUFBSUMsSUFBSixDQUFTbEIsT0FBT2UsYUFBaEIsRUFBK0JmLE9BQU9nQixXQUF0QyxFQUFtRFAsTUFBbkQsRUFBMkRDLElBQTNELENBQVg7QUFDQVMsY0FBWXhFLE9BQVosQ0FBb0IsSUFBSXlFLG9CQUFKLENBQXlCSCxJQUF6QixDQUFwQjtBQUNBLFNBQU9BLElBQVA7QUFDRDs7QUFFRCxTQUFTSyxhQUFULEdBQXlCO0FBQ3ZCOUUsWUFBVU8sSUFBVixDQUFlLEtBQUtrRSxJQUFwQjtBQUNBNUQsV0FBU3NCLGNBQVQsQ0FBd0IsY0FBeEIsRUFBd0M0QyxZQUF4QyxDQUFxRCxLQUFLTixJQUFMLENBQVVPLElBQS9ELEVBQXFFbkUsU0FBU3NCLGNBQVQsQ0FBd0IsY0FBeEIsRUFBd0M4QyxVQUE3RztBQUNEOztBQUVELFNBQVNDLFVBQVQsR0FBc0I7QUFDcEI7QUFDQTs7Ozs7Ozs7O0FBU0E7QUFDQTs7Ozs7OztBQU9BN0M7QUFDQUUsZUFBYSxLQUFLa0MsSUFBbEI7QUFDQSxTQUFPLEtBQUtBLElBQVo7QUFDRDs7QUFFRCxTQUFTbEMsWUFBVCxDQUFzQmtDLElBQXRCLEVBQTRCO0FBQzFCVSx3QkFBc0IsS0FBdEI7QUFDQVYsT0FBS08sSUFBTCxDQUFVSSxNQUFWO0FBQ0FYLE9BQUtILE9BQUwsR0FBZSxJQUFmO0FBQ0Q7O0FBRUQsU0FBUzVDLFFBQVQsQ0FBa0IyRCxPQUFsQixFQUEyQkMsUUFBM0IsRUFBcUNDLFdBQXJDLEVBQWtEO0FBQ2hELE1BQUlDLElBQUkzRSxTQUFTNEUsYUFBVCxDQUF1QixHQUF2QixDQUFSO0FBQ0EsTUFBSTdDLE9BQU8sSUFBSThDLElBQUosQ0FBUyxDQUFDTCxPQUFELENBQVQsRUFBb0I7QUFDN0JNLFVBQU1KO0FBRHVCLEdBQXBCLENBQVg7QUFHQUMsSUFBRUksSUFBRixHQUFTQyxJQUFJQyxlQUFKLENBQW9CbEQsSUFBcEIsQ0FBVDtBQUNBNEMsSUFBRTlELFFBQUYsR0FBYTRELFFBQWI7QUFDQUUsSUFBRU8sS0FBRjtBQUNBUCxJQUFFSixNQUFGO0FBQ0QiLCJmaWxlIjoiY2FyZE1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbnVtYmVyT2ZDYXJkID0gMDtcbnZhciBhcnJheUNhcmQgPSBbXTtcbi8vdmFyIGFycmF5Q2FyZERlbGV0ZWQgPSBbXTtcbnZhciBjb21tYW5kcyA9IFtdO1xuXG5cbnZhciBDYXJkTWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICAvL0kgaW1wbGVtZW50ZWQgYSBjb21tYW5kIHBhdHRlcm4sIHNlZSA6IGh0dHBzOi8vd3d3LmRvZmFjdG9yeS5jb20vamF2YXNjcmlwdC9jb21tYW5kLWRlc2lnbi1wYXR0ZXJuXG4gIHJldHVybiB7XG4gICAgLy9leGVjdXRlIGEgY29tbWFuZFxuICAgIGV4ZWN1dGU6IGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgICAgIC8vaWYgdGhpcyBpcyBhIGRlbGV0ZSBjb21tYW5kIHRoZW4gY2FyZCBpcyBhbiBhcmd1bWVudCBvZiB0aGUgY29tbWFuZFxuICAgICAgLypzd2l0Y2ggKGNvbW1hbmQuZXhlY3V0ZS5uYW1lKXtcbiAgICAgICAgY2FzZSBcImRlbGV0ZUNhcmRcIiA6IHtcbiAgICAgICAgICBjb21tYW5kLmV4ZWN1dGUoY29tbWFuZC5jYXJkKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwiY3JlYXRlTmV3Q2FyZFwiIDpcbiAgICAgICAgICBjb21tYW5kLmV4ZWN1dGUoY29tbWFuZC5zdGFydFAsIGNvbW1hbmQuZW5kUCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29tbWFuZC5leGVjdXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9Ki9cbiAgICAgY29tbWFuZC5leGVjdXRlKCk7XG4gICAgICAvL1dlIHNlbmQgdGhlIGNvbW1hbmQgdG8gdGhlIHNlcnZlciAodGhlIHNlcnZlciBsb2cgaXQgaW50byBhIGZpbGUsIHNlZSAuL3NyYy9zZXJ2ZXIvU2VydmVyTG9nZ2VyKVxuICAgICAgbG9nZ2VyLnNlbmRBbmRMb2dDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgLy9hbmQgd2Ugc2F2ZSB0aGUgY29tbWFuZCBjcmVhdGVkXG4gICAgICBjb21tYW5kcy5wdXNoKGNvbW1hbmQpO1xuICAgIH0sXG4gICAgLy9VbmRvIGEgY29tbWFuZFxuICAgIHVuZG86IGZ1bmN0aW9uKCkge1xuICAgICAgLy9UT0RPXG4gICAgICB2YXIgY29tbWFuZCA9IGNvbW1hbmRzLnBvcCgpO1xuICAgICAgY29tbWFuZC51bmRvKCk7XG4gICAgfSxcbiAgICBleHBvcnRDYXJkOiBmdW5jdGlvbigpe1xuICAgICAgLyotLS0tLS0gQ3JlYXRlIGEgc2V0IG9mIGNhcmQgZnJvbSBhIEpTT04gZmlsZSAtLS0tLS0tKi9cbiAgICAgICAgdmFyIGFycmF5SXRlbVVwZGF0ZWQgPSBbXTtcbiAgICAgIHZhciBsaXN0U2VnbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlZ21lbnQnKTtcbiAgICAgIC8vcGxheUNhcmQoYXJyYXlJdGVtLmlEaXYsIGFycmF5SXRlbS5zdGFydFApO1xuICAgICAgY29uc29sZS5sb2cobGlzdFNlZ21lbnQpO1xuICBcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbGlzdFNlZ21lbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coaXRlbS5pZCk7XG4gICAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KGl0ZW0sJ21vdXNlZG93bicpO1xuICAgICAgfVxuICAgICBcbiAgICAgLy8gdmFyIGl0ZW0gPSBhcnJheUl0ZW0udXBkYXRlSW5mbygpO1xuICAgICAvLyB0cmlnZ2VyTW91c2VFdmVudCggYSwgXCJtb3VzZWRvd25cIik7XG4gICAgICAgIGFycmF5Q2FyZC5mb3JFYWNoKGZ1bmN0aW9uKGFycmF5SXRlbSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGFycmF5SXRlbSk7XG4gICAgICAgICAgdmFyIGl0ZW0gPSBhcnJheUl0ZW0udXBkYXRlSW5mbygpO1xuICAgICAgICAgIGFycmF5SXRlbVVwZGF0ZWQucHVzaChpdGVtKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBzZXJpYWxpemVkQXJyID0gSlNPTi5zdHJpbmdpZnkoYXJyYXlJdGVtVXBkYXRlZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiKioqKiogIFNlcmlhbGlzYXRpb24gb2YgY2FyZCBjb21wbGV0ZSA6IFwiICsgc2VyaWFsaXplZEFycik7XG4gICAgICAgIGRvd25sb2FkKHNlcmlhbGl6ZWRBcnIsICdqc29uVzJsb2ctJyArIGNyZWF0ZVVuaXF1ZUlkKCkgKyAnLmpzb24nLCAndGV4dC9wbGFpbicpO1xuICAgIH1cbiAgICBcbiAgfVxufTtcblxuZnVuY3Rpb24gdHJpZ2dlck1vdXNlRXZlbnQgKG5vZGUsIGV2ZW50VHlwZSkge1xuICB2YXIgY2xpY2tFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50ICgnTW91c2VFdmVudHMnKTtcbiAgY2xpY2tFdmVudC5pbml0RXZlbnQgKGV2ZW50VHlwZSwgdHJ1ZSwgdHJ1ZSk7XG4gIG5vZGUuZGlzcGF0Y2hFdmVudCAoY2xpY2tFdmVudCk7XG59XG5cbi8qKioqIEZ1bmN0aW9uYWwgY29yZSBvZiB0aGUgY2FyZCBtYW5hZ2VyIChjcmVhdGUgYSBjYXJ0LCBkZWxldGUgYSBjYXJkIGFuZCBzYXZlIGNhcmQpICoqKioqL1xuLyoqXG4gKiBUaGlzIGNsYXNzIG1hbmFnIGFsbCB0aGUgY2FyZHMgY3JlYXRlZC4gVGhpcyBpcyB0aGUgc2VnbWVudCBoaXN0b3J5LlxuICogQHR5cGUge0hUTUxFbGVtZW50IHwgbnVsbH1cbiAqL1xudmFyIHdyYXBwZXJDb21tYW5kQW5kUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXJDb21tYW5kQW5kUmFuZ2VpZFwiKTtcblxuLy9UT0RPIFNhdmUgYW5kIGxvYWQgYnV0dG9uLCBkbyBubyBkZWxldGVcbi8qc2F2ZUxvZ0J0bi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIixmdW5jdGlvbiAoZSkge1xuICBjb25zb2xlLmxvZyhcInNhdmluZyBsb2dcIik7XG4gIGFycmF5Q2FyZC5mb3JFYWNoKGZ1bmN0aW9uIChhcnJheUl0ZW0pIHtcbiAgIC8vIGFycmF5SXRlbS51cGRhdGVJbmZvKCk7XG4gICAgLy9hcnJheUl0ZW0uXG4gIH0pO1xuICBleHBvcnRDYXJkc0pTb24oKTtcbiAgdGV4dFNhdmVMb2cuaW5uZXJUZXh0ID0gXCJMb2cgc2F2ZWQhXCIgO1xufSk7XG5cbmxvYWRMb2dCdG4ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgbG9hZEpTT04obnVsbCk7XG59O1xuXG5sb2FkTG9nQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsZnVuY3Rpb24gKGUpIHtcbiAgLy9jb25zb2xlLmxvZyhcIkFBQUFBQVwiKTtcbiAgLy92YXIgbXlkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgLy9jb25zb2xlLmxvZyggbG9hZExvZ0J0bi52YWx1ZSk7XG59KTtcblxuXG5cbi8qXG5cblxuXG4vL2RyYWdFbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FyZDFcIikpO1xuXG5cbmFkZENhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICBjcmVhdGVOZXdDYXJkKCk7XG59KTsqL1xuXG5cbmZ1bmN0aW9uIGNsZWFuU2VnbWVudEhpc3RvcnkoKXtcbiAgY29uc29sZS5sb2coXCJURVNUSU5HXCIpO1xuICBjbGVhckFsbFRpbWVyKCk7XG4gIGFycmF5Q2FyZC5mb3JFYWNoKGZ1bmN0aW9uKGUpe1xuICAgICAgZGVsZXRlQ2FyZFVJKGUpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbG9hZEpTT04oKSB7XG4gIHZhciBmaWxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dGaWxlTG9hZCcpLmZpbGVzO1xuICBpZiAoIWZpbGVzLmxlbmd0aCkge1xuICAgIGFsZXJ0KCdQbGVhc2Ugc2VsZWN0IGEgZmlsZSEnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIHZhciBmaWxlID0gZmlsZXNbMF07XG4gIHZhciBzdGFydCA9ICAwO1xuICB2YXIgc3RvcCA9IGZpbGUuc2l6ZSAtIDE7XG4gIFxuICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgdmFyIHRlc3QgPSAwO1xuICAvLyBJZiB3ZSB1c2Ugb25sb2FkZW5kLCB3ZSBuZWVkIHRvIGNoZWNrIHRoZSByZWFkeVN0YXRlLlxuICByZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgaWYgKGV2dC50YXJnZXQucmVhZHlTdGF0ZSA9PSBGaWxlUmVhZGVyLkRPTkUpIHsgLy8gRE9ORSA9PSAyXG4gICAgICB2YXIgdGVzdCA9IGV2dC50YXJnZXQucmVzdWx0O1xuICAgICAgY29uc29sZS5sb2coJ1JlYWQgYnl0ZXM6ICcsIHN0YXJ0ICsgMSwgJyAtICcsIHN0b3AgKyAxLFxuICAgICAgICAgICcgb2YgJywgZmlsZS5zaXplLCAnIGJ5dGUgZmlsZScgKTtcbiAgICAgIGNvbnNvbGUubG9nKHRlc3QpO1xuICAgICAgdmFyIG15X0pTT05fb2JqZWN0ID0gSlNPTi5wYXJzZSh0ZXN0KTtcbiAgXG4gICAgICBjb25zb2xlLmxvZyhteV9KU09OX29iamVjdCk7XG4gIFxuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBteV9KU09OX29iamVjdC5sZW5ndGg7IGsrKykge1xuICAgICAgICBhZGRpbmdOZXdDYXJkc0Zyb21KU29uKG15X0pTT05fb2JqZWN0W2tdKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHZhciBibG9iID0gZmlsZS5zbGljZShzdGFydCwgc3RvcCArIDEpO1xuICByZWFkZXIucmVhZEFzQmluYXJ5U3RyaW5nKGJsb2IpO1xufVxuXG4vL0FkZCBhIGNhcmQgZnJvbSBhIGpzb24gZmlsZVxuZnVuY3Rpb24gYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbihjYXJkSW5mbykge1xuICBpZiAoY2FyZEluZm8uc3RhcnRQID4gY2FyZEluZm8uZW5kUCkge1xuICAgIGxldCB0cmFuc2l0ID0gY2FyZEluZm8uc3RhcnRQO1xuICAgIGNhcmRJbmZvLnN0YXJ0UCA9IGNhcmRJbmZvLmVuZFA7XG4gICAgY2FyZEluZm8uZW5kUCA9IHRyYW5zaXQ7XG4gIH1cbiAgaWYgKGNhcmRJbmZvLnN0YXJ0UCA8IDApIHtcbiAgICBjYXJkSW5mby5zdGFydFAgPSAwO1xuICB9XG4gIGxldCByZXN1bHQgPSBQbGF5ZXIuc2xpZGVyVG9WaWRlbyhjYXJkSW5mby5zdGFydFAsIGNhcmRJbmZvLmVuZFApO1xuICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICBudW1iZXJPZkNhcmQrKztcbiAgaWYgKCFjYXJkSW5mby5kZWxldGVkKSB7XG4gICAgY29uc29sZS5sb2cocmVzdWx0LnN0YXJ0RHVyYXRpb24sIHJlc3VsdC5lbmREdXJhdGlvbiwgY2FyZEluZm8uc3RhcnRQLCBjYXJkSW5mby5lbmRQLCBjYXJkSW5mbyk7XG4gICAgdmFyIGNhcmQgPSBDYXJkKHJlc3VsdC5zdGFydER1cmF0aW9uLCByZXN1bHQuZW5kRHVyYXRpb24sIGNhcmRJbmZvLnN0YXJ0UCwgY2FyZEluZm8uZW5kUCwgY2FyZEluZm8pO1xuICAgIGNhcmRNYW5hZ2VyLmV4ZWN1dGUobmV3IENyZWF0ZU5ld0NhcmRDb21tYW5kKGNhcmQpKTtcbiAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXZDYXJkQm9hcmQnKS5pbnNlcnRCZWZvcmUoY2FyZC5pRGl2LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2Q2FyZEJvYXJkJykuZmlyc3RDaGlsZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRpbmcgYSBjYXJkIGJ5IGRyYWcgYW5kIGRyb3AuIFRoZSBjYXJkIGlzIGFkZGVkIGluIHRoZSBsaXN0IG9mIGNhcmRzXG4gKiBSZXR1cm4gdGhlIGNhcmQgdGhhdCBoYXZlIGJlZW4gY3JlYXRlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVOZXdDYXJkKHN0YXJ0UCwgZW5kUCkge1xuICAvL2NvbnNvbGUubG9nKFwiVEVTVCAvIDogXCIgKyBzdGFydFAgKyBcIiBcIiArIGVuZFApO1xuICBpZiAoc3RhcnRQID4gZW5kUCkge1xuICAgIGxldCB0cmFuc2l0ID0gc3RhcnRQO1xuICAgIHN0YXJ0UCA9IGVuZFA7XG4gICAgZW5kUCA9IHRyYW5zaXQ7XG4gIH1cbiAgbGV0IHJlc3VsdCA9IFBsYXllci5zbGlkZXJUb1ZpZGVvKHN0YXJ0UCwgZW5kUCk7XG4gIG51bWJlck9mQ2FyZCsrO1xuICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICBcbiAgdmFyIGNhcmQgPSBuZXcgQ2FyZChyZXN1bHQuc3RhcnREdXJhdGlvbiwgcmVzdWx0LmVuZER1cmF0aW9uLCBzdGFydFAsIGVuZFApO1xuICBjYXJkTWFuYWdlci5leGVjdXRlKG5ldyBDcmVhdGVOZXdDYXJkQ29tbWFuZChjYXJkKSk7XG4gIHJldHVybiBjYXJkO1xufVxuXG5mdW5jdGlvbiBhZGRpbmdOZXdDYXJkKCkge1xuICBhcnJheUNhcmQucHVzaCh0aGlzLmNhcmQpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2Q2FyZEJvYXJkJykuaW5zZXJ0QmVmb3JlKHRoaXMuY2FyZC5pRGl2LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2Q2FyZEJvYXJkJykuZmlyc3RDaGlsZCk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUNhcmQoKSB7XG4gIC8vU3VwcHJpbWUgbGEgY2FydGUgZGUgbGEgbGlzdGUgZGUgY2FydGVcbiAgLypmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Q2FyZC5sZW5ndGggICA7IGkrKykge1xuICAgIGlmKGFycmF5Q2FyZFtpXSAgPT09IGNhcmQpe1xuICAgICAgdmFyIHN1cENhcmQgPSBhcnJheUNhcmQuc3BsaWNlKGksMSk7XG4gICAgICBhcnJheUNhcmREZWxldGVkLnB1c2goc3VwQ2FyZCk7XG4gICAgICBjb25zb2xlLmxvZyhcImRlbGV0ZWQgY2FyZCA6IFwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHN1cENhcmQpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9Ki9cbiAgLy9kZWxldGVDYXJkVUkoY2FyZCk7XG4gIC8qYXJyYXlDYXJkRGVsZXRlZC5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBjb25zb2xlLmxvZyggICBlbGVtZW50KTtcbiAgfSk7XG4gIGNvbnNvbGUubG9nKFwiKioqKioqKioqKioqKioqKioqKioqKioqXCIpO1xuICBhcnJheUNhcmQuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgY29uc29sZS5sb2coZWxlbWVudCk7XG4gIH0pOyovXG4gIGNsZWFyQWxsVGltZXIoKTtcbiAgZGVsZXRlQ2FyZFVJKHRoaXMuY2FyZCk7XG4gIHJldHVybiB0aGlzLmNhcmQ7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUNhcmRVSShjYXJkKSB7XG4gIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG4gIGNhcmQuaURpdi5yZW1vdmUoKTtcbiAgY2FyZC5kZWxldGVkID0gdHJ1ZVxufVxuXG5mdW5jdGlvbiBkb3dubG9hZChjb250ZW50LCBmaWxlTmFtZSwgY29udGVudFR5cGUpIHtcbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgdmFyIGZpbGUgPSBuZXcgQmxvYihbY29udGVudF0sIHtcbiAgICB0eXBlOiBjb250ZW50VHlwZVxuICB9KTtcbiAgYS5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcbiAgYS5kb3dubG9hZCA9IGZpbGVOYW1lO1xuICBhLmNsaWNrKCk7XG4gIGEucmVtb3ZlKCk7XG59XG5cblxuIl19