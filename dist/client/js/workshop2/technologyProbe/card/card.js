'use strict';

//TODO faire une classe carte

function Card(startDurationParam, endDurationParam, startPositionParam, endPositionParam, cardInfo) {
  //Propriété de style
  var width = '6%';
  var height = '6%';
  var deleted = false;
  var iDiv = null;
  var startP = startPositionParam;
  var endP = endPositionParam;
  //Valeur pour jouer la carte
  var description = '';
  var speed = 1;
  var repetitionNumber = 1;
  //div used
  var divInfoCard = null;
  //let selectSpeed=null;
  var selectNbRepet = null;
  var selectSpeed = null;

  var imgSlow = null;

  var textSegment = null;
  var imgRepet = null;
  var divSegment = null;
  var startDuration = startDurationParam;
  var endDuration = endDurationParam;
  var left = void 0;

  //cette div est la principale, celle qui contient fragment + bardFragment
  iDiv = document.createElement('div');
  iDiv.id = 'idCard' + createUniqueId();
  iDiv.className = 'segmentWrapper';
  iDiv.style.left = startPositionParam + "px";

  //Div du segment bleu
  divSegment = document.createElement('div');
  divSegment.className = 'segment';

  //taille de la carte initiale
  width = iDiv.style.width = parseInt(endPositionParam, 10) - parseInt(startPositionParam, 10) + "px";
  divSegment.style.width = parseInt(endPositionParam, 10) - parseInt(startPositionParam, 10) + "px";

  initGUI();
  initStyle();
  initListener();
  playCard();

  //console.log(cardInfo.deleted);


  function updateInfo() {
    var cardObject = {
      width: width,
      startP: startP,
      endP: endP,
      description: description,
      speed: speed,
      deleted: deleted,
      repetitionNumber: repetitionNumber
    };
    return cardObject;
  }

  function initListener() {

    textSegment.addEventListener('long-press', function (e) {
      e.preventDefault();
      console.log("long press : " + description);
      //delete apparait
      var buttonDelete = document.createElement('button');
      buttonDelete.id = 'idBtnDelete';
      buttonDelete.style.position = "absolute";
      buttonDelete.type = "button";
      buttonDelete.innerHTML = "Delete";
      buttonDelete.style.width = "100px";

      divInfoCard.appendChild(buttonDelete);
      buttonDelete.addEventListener('touchend', function (e) {
        feedbackOnSliderVideo(false);
        iDiv.remove();
        deleted = true;
      });
      buttonDelete.addEventListener('mousedown', function (e) {
        feedbackOnSliderVideo(false);
        iDiv.remove();
        deleted = true;
      });
    });

    divSegment.addEventListener('long-press', function (e) {
      e.preventDefault();
      console.log("long press : " + description);
      //delete apparait
      var buttonDelete = document.createElement('button');
      buttonDelete.id = 'idBtnDelete';
      buttonDelete.style.position = "absolute";
      buttonDelete.type = "button";
      buttonDelete.innerHTML = "Delete";
      buttonDelete.style.width = "100px";

      divInfoCard.appendChild(buttonDelete);
      buttonDelete.addEventListener('touchend', function (e) {
        feedbackOnSliderVideo(false);
        iDiv.remove();
        deleted = true;
      });
    });

    selectSpeed.addEventListener("onchange", function () {
      console.log("change speed : " + selectSpeed.options[selectSpeed.selectedIndex].value);
    });

    divSegment.addEventListener("mousedown", function () {
      // console.log('iDiv.id : ');

      var nbRepet = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      var speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;

      repetitionNumber = nbRepet;
      speed = speedRate;

      segmentFeedback.startPostion = iDiv.style.left;
      segmentFeedback.width = width;
      feedbackOnSliderVideo(true);
      repetPartOfVideo(startDuration, endDuration, nbRepet, speedRate);
    }, false);
  }

  function initGUI() {
    textSegment = document.createElement('input');
    textSegment.className = 'textSegment';
    //UI button speed and slow
    imgRepet = document.createElement("img");
    imgRepet.className = 'imgRepet';
    imgSlow = document.createElement("img");
    imgSlow.className = 'imgSlow';

    selectSpeed = document.createElement("select");
    selectSpeed.className = 'selectSpeed';
    selectNbRepet = document.createElement("select");
    selectNbRepet.className = 'selectNbRepet';

    divInfoCard = document.createElement('div');
    divInfoCard.className = "infoCard";

    textSegment.addEventListener("keyup", function () {
      description = textSegment.value;
    });

    //Peupler les listes déroulantes
    for (var i = 0; i < 20; i += 1) {
      selectSpeed.add(new Option(i / 10 + ""));
    }
    selectSpeed.selectedIndex = 10;
    for (var _i = 0; _i < 20; _i++) {
      selectNbRepet.options.add(new Option(_i + ""));
    }
    selectNbRepet.selectedIndex = 1;

    /*
    selectNbRepet.addEventListener("onchange", function () {
      
      repetitionNumber = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      console.log("selected : " + repetitionNumber);
    });*/

    //Div contenant les info du dessus (taille de div invariable)
    divInfoCard.appendChild(imgSlow);
    divInfoCard.appendChild(selectSpeed);
    divInfoCard.appendChild(imgRepet);
    divInfoCard.appendChild(selectNbRepet);
    iDiv.appendChild(divSegment);
    iDiv.appendChild(textSegment);
    iDiv.appendChild(divInfoCard);

    //If the card have been deleted, the color is red, otherwise blue.
    if (cardInfo) {
      if (cardInfo.deleted) {
        divSegment.style.backgroundColor = "red";
      } else {
        divSegment.style.backgroundColor = "#213F8D";
      }
      textSegment.value = cardInfo.description;
      selectNbRepet.selectedIndex = cardInfo.repetitionNumber;
      selectSpeed.selectedIndex = cardInfo.speed * 10;
    }
  }

  function initStyle() {
    textSegment.style.left = divSegment.style.width;
    imgSlow.src = "/media/workshop2/card/slow.png";
    imgRepet.src = "/media/workshop2/card/repet.png";
  }

  function playCard() {
    video.currentTime = startDurationParam;
    segmentFeedback.width = iDiv.style.width;
    segmentFeedback.startPostion = iDiv.style.left;
    feedbackOnSliderVideo(true);
  }

  var cardObject = {
    width: width,
    startP: startP,
    endP: endP,
    description: description,
    speed: speed,
    repetitionNumber: repetitionNumber,
    iDiv: iDiv,
    updateInfo: updateInfo
  };

  return cardObject;
}

function createUniqueId() {
  var date = new Date();
  var components = [date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
  return components.join("");
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmQuanMiXSwibmFtZXMiOlsiQ2FyZCIsInN0YXJ0RHVyYXRpb25QYXJhbSIsImVuZER1cmF0aW9uUGFyYW0iLCJzdGFydFBvc2l0aW9uUGFyYW0iLCJlbmRQb3NpdGlvblBhcmFtIiwiY2FyZEluZm8iLCJ3aWR0aCIsImhlaWdodCIsImRlbGV0ZWQiLCJpRGl2Iiwic3RhcnRQIiwiZW5kUCIsImRlc2NyaXB0aW9uIiwic3BlZWQiLCJyZXBldGl0aW9uTnVtYmVyIiwiZGl2SW5mb0NhcmQiLCJzZWxlY3ROYlJlcGV0Iiwic2VsZWN0U3BlZWQiLCJpbWdTbG93IiwidGV4dFNlZ21lbnQiLCJpbWdSZXBldCIsImRpdlNlZ21lbnQiLCJzdGFydER1cmF0aW9uIiwiZW5kRHVyYXRpb24iLCJsZWZ0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJjcmVhdGVVbmlxdWVJZCIsImNsYXNzTmFtZSIsInN0eWxlIiwicGFyc2VJbnQiLCJpbml0R1VJIiwiaW5pdFN0eWxlIiwiaW5pdExpc3RlbmVyIiwicGxheUNhcmQiLCJ1cGRhdGVJbmZvIiwiY2FyZE9iamVjdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJjb25zb2xlIiwibG9nIiwiYnV0dG9uRGVsZXRlIiwicG9zaXRpb24iLCJ0eXBlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJmZWVkYmFja09uU2xpZGVyVmlkZW8iLCJyZW1vdmUiLCJvcHRpb25zIiwic2VsZWN0ZWRJbmRleCIsInZhbHVlIiwibmJSZXBldCIsInNwZWVkUmF0ZSIsInNlZ21lbnRGZWVkYmFjayIsInN0YXJ0UG9zdGlvbiIsInJlcGV0UGFydE9mVmlkZW8iLCJpIiwiYWRkIiwiT3B0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwic3JjIiwidmlkZW8iLCJjdXJyZW50VGltZSIsImRhdGUiLCJEYXRlIiwiY29tcG9uZW50cyIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImdldEhvdXJzIiwiZ2V0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LEtBQVosQ0FBa0JOLElBQWxCLEdBQXlCSCxXQUFXUyxLQUFYLENBQWlCeEIsS0FBMUM7QUFDQVksWUFBUTRDLEdBQVIsR0FBYyxnQ0FBZDtBQUNBMUMsYUFBUzBDLEdBQVQsR0FBZSxpQ0FBZjtBQUNEOztBQUtELFdBQVMzQixRQUFULEdBQW1CO0FBQ2pCNEIsVUFBTUMsV0FBTixHQUFvQi9ELGtCQUFwQjtBQUNBc0Qsb0JBQWdCakQsS0FBaEIsR0FBd0JHLEtBQUtxQixLQUFMLENBQVd4QixLQUFuQztBQUNBaUQsb0JBQWdCQyxZQUFoQixHQUErQi9DLEtBQUtxQixLQUFMLENBQVdOLElBQTFDO0FBQ0F3QiwwQkFBc0IsSUFBdEI7QUFDRDs7QUFNRCxNQUFJWCxhQUFhO0FBQ2YvQixXQUFRQSxLQURPO0FBRWZJLFlBQVNBLE1BRk07QUFHZkMsVUFBT0EsSUFIUTtBQUlmQyxpQkFBY0EsV0FKQztBQUtmQyxXQUFRQSxLQUxPO0FBTWZDLHNCQUFtQkEsZ0JBTko7QUFPZkwsVUFBS0EsSUFQVTtBQVFmMkIsZ0JBQWFBO0FBUkUsR0FBakI7O0FBZUEsU0FBT0MsVUFBUDtBQUNEOztBQUdDLFNBQVNULGNBQVQsR0FBeUI7QUFDdkIsTUFBSXFDLE9BQU8sSUFBSUMsSUFBSixFQUFYO0FBQ0EsTUFBSUMsYUFBYSxDQUNmRixLQUFLRyxRQUFMLEVBRGUsRUFFZkgsS0FBS0ksT0FBTCxFQUZlLEVBR2ZKLEtBQUtLLFFBQUwsRUFIZSxFQUlmTCxLQUFLTSxVQUFMLEVBSmUsRUFLZk4sS0FBS08sVUFBTCxFQUxlLEVBTWZQLEtBQUtRLGVBQUwsRUFOZSxDQUFqQjtBQVFBLFNBQU9OLFdBQVdPLElBQVgsQ0FBZ0IsRUFBaEIsQ0FBUDtBQUNEIiwiZmlsZSI6ImNhcmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL1RPRE8gZmFpcmUgdW5lIGNsYXNzZSBjYXJ0ZVxuXG5mdW5jdGlvbiBDYXJkIChzdGFydER1cmF0aW9uUGFyYW0sZW5kRHVyYXRpb25QYXJhbSxzdGFydFBvc2l0aW9uUGFyYW0sZW5kUG9zaXRpb25QYXJhbSwgY2FyZEluZm8pIHtcbiAgLy9Qcm9wcmnDqXTDqSBkZSBzdHlsZVxuICBsZXQgd2lkdGggPSAnNiUnO1xuICBsZXQgaGVpZ2h0ID0gJzYlJztcbiAgdmFyIGRlbGV0ZWQgPSBmYWxzZTtcbiAgdmFyIGlEaXYgPSBudWxsO1xuICB2YXIgc3RhcnRQID0gc3RhcnRQb3NpdGlvblBhcmFtO1xuICB2YXIgZW5kUCA9IGVuZFBvc2l0aW9uUGFyYW07XG4vL1ZhbGV1ciBwb3VyIGpvdWVyIGxhIGNhcnRlXG4gIGxldCBkZXNjcmlwdGlvbiA9ICcnO1xuICBsZXQgc3BlZWQgPSAxO1xuICBsZXQgcmVwZXRpdGlvbk51bWJlciA9IDE7XG4vL2RpdiB1c2VkXG4gIGxldCBkaXZJbmZvQ2FyZCA9IG51bGw7XG4gIC8vbGV0IHNlbGVjdFNwZWVkPW51bGw7XG4gIGxldCBzZWxlY3ROYlJlcGV0ID0gbnVsbDtcbiAgbGV0IHNlbGVjdFNwZWVkID0gbnVsbDtcbiAgXG4gIGxldCBpbWdTbG93ID0gbnVsbDtcbiAgXG4gIGxldCB0ZXh0U2VnbWVudCA9IG51bGw7XG4gIGxldCBpbWdSZXBldCA9IG51bGw7XG4gIGxldCBkaXZTZWdtZW50ID0gbnVsbDtcbiAgbGV0IHN0YXJ0RHVyYXRpb24gPSBzdGFydER1cmF0aW9uUGFyYW07XG4gIGxldCBlbmREdXJhdGlvbiA9IGVuZER1cmF0aW9uUGFyYW07XG4gIGxldCBsZWZ0IDtcbiAgXG4gIC8vY2V0dGUgZGl2IGVzdCBsYSBwcmluY2lwYWxlLCBjZWxsZSBxdWkgY29udGllbnQgZnJhZ21lbnQgKyBiYXJkRnJhZ21lbnRcbiAgaURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBpRGl2LmlkID0gJ2lkQ2FyZCcgKyBjcmVhdGVVbmlxdWVJZCgpO1xuICBpRGl2LmNsYXNzTmFtZSA9ICdzZWdtZW50V3JhcHBlcic7XG4gIGlEaXYuc3R5bGUubGVmdCA9IHN0YXJ0UG9zaXRpb25QYXJhbSArIFwicHhcIjtcbiAgXG4gIC8vRGl2IGR1IHNlZ21lbnQgYmxldVxuICBkaXZTZWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdlNlZ21lbnQuY2xhc3NOYW1lID0gJ3NlZ21lbnQnO1xuICBcbiAgLy90YWlsbGUgZGUgbGEgY2FydGUgaW5pdGlhbGVcbiAgd2lkdGggPSBpRGl2LnN0eWxlLndpZHRoID0gcGFyc2VJbnQoZW5kUG9zaXRpb25QYXJhbSwgMTApIC0gcGFyc2VJbnQoc3RhcnRQb3NpdGlvblBhcmFtLCAxMCkgKyBcInB4XCI7XG4gIGRpdlNlZ21lbnQuc3R5bGUud2lkdGggPSBwYXJzZUludChlbmRQb3NpdGlvblBhcmFtLCAxMCkgLSBwYXJzZUludChzdGFydFBvc2l0aW9uUGFyYW0sIDEwKSArIFwicHhcIjtcbiAgXG4gIFxuICBpbml0R1VJKCk7XG4gIGluaXRTdHlsZSgpO1xuICBpbml0TGlzdGVuZXIoKTtcbiAgcGxheUNhcmQoKTtcbiAgXG4gIFxuICAvL2NvbnNvbGUubG9nKGNhcmRJbmZvLmRlbGV0ZWQpO1xuICBcbiAgXG4gIGZ1bmN0aW9uIHVwZGF0ZUluZm8oKXtcbiAgICB2YXIgY2FyZE9iamVjdCA9IHtcbiAgICAgIHdpZHRoOiAgd2lkdGgsXG4gICAgICBzdGFydFAgOiBzdGFydFAsXG4gICAgICBlbmRQIDogZW5kUCxcbiAgICAgIGRlc2NyaXB0aW9uIDogZGVzY3JpcHRpb24sXG4gICAgICBzcGVlZCA6IHNwZWVkLFxuICAgICAgZGVsZXRlZDpkZWxldGVkLFxuICAgICAgcmVwZXRpdGlvbk51bWJlciA6IHJlcGV0aXRpb25OdW1iZXJcbiAgICB9O1xuICAgIHJldHVybiBjYXJkT2JqZWN0O1xuICB9XG4gIFxuICBcbiAgZnVuY3Rpb24gaW5pdExpc3RlbmVyKCkge1xuICAgIFxuICAgIHRleHRTZWdtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvbmctcHJlc3MnLCBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwibG9uZyBwcmVzcyA6IFwiICsgZGVzY3JpcHRpb24gKTtcbiAgICAgIC8vZGVsZXRlIGFwcGFyYWl0XG4gICAgICB2YXIgYnV0dG9uRGVsZXRlID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgYnV0dG9uRGVsZXRlLmlkID0gJ2lkQnRuRGVsZXRlJztcbiAgICAgIGJ1dHRvbkRlbGV0ZS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgIGJ1dHRvbkRlbGV0ZS50eXBlID0gXCJidXR0b25cIjtcbiAgICAgIGJ1dHRvbkRlbGV0ZS5pbm5lckhUTUwgPSBcIkRlbGV0ZVwiO1xuICAgICAgYnV0dG9uRGVsZXRlLnN0eWxlLndpZHRoID0gXCIxMDBweFwiO1xuICAgICAgXG4gICAgICBkaXZJbmZvQ2FyZC5hcHBlbmRDaGlsZChidXR0b25EZWxldGUpO1xuICAgICAgYnV0dG9uRGVsZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJyxmdW5jdGlvbihlKXtcbiAgICAgICAgZmVlZGJhY2tPblNsaWRlclZpZGVvKGZhbHNlKTtcbiAgICAgICAgaURpdi5yZW1vdmUoKTtcbiAgICAgICAgZGVsZXRlZCA9IHRydWVcbiAgICAgIH0pO1xuICAgICAgYnV0dG9uRGVsZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsZnVuY3Rpb24oZSl7XG4gICAgICAgIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG4gICAgICAgIGlEaXYucmVtb3ZlKCk7XG4gICAgICAgIGRlbGV0ZWQgPSB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgICBkaXZTZWdtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvbmctcHJlc3MnLCBmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwibG9uZyBwcmVzcyA6IFwiICsgZGVzY3JpcHRpb24gKTtcbiAgICAgIC8vZGVsZXRlIGFwcGFyYWl0XG4gICAgICB2YXIgYnV0dG9uRGVsZXRlID0gIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgYnV0dG9uRGVsZXRlLmlkID0gJ2lkQnRuRGVsZXRlJztcbiAgICAgIGJ1dHRvbkRlbGV0ZS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgIGJ1dHRvbkRlbGV0ZS50eXBlID0gXCJidXR0b25cIjtcbiAgICAgIGJ1dHRvbkRlbGV0ZS5pbm5lckhUTUwgPSBcIkRlbGV0ZVwiO1xuICAgICAgYnV0dG9uRGVsZXRlLnN0eWxlLndpZHRoID0gXCIxMDBweFwiO1xuICAgICAgXG4gICAgICBkaXZJbmZvQ2FyZC5hcHBlbmRDaGlsZChidXR0b25EZWxldGUpO1xuICAgICAgYnV0dG9uRGVsZXRlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJyxmdW5jdGlvbihlKXtcbiAgICAgICAgZmVlZGJhY2tPblNsaWRlclZpZGVvKGZhbHNlKTtcbiAgICAgICAgaURpdi5yZW1vdmUoKTtcbiAgICAgICAgZGVsZXRlZCA9IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgIHNlbGVjdFNwZWVkLmFkZEV2ZW50TGlzdGVuZXIoXCJvbmNoYW5nZVwiLCBmdW5jdGlvbigpe1xuICAgICAgY29uc29sZS5sb2coXCJjaGFuZ2Ugc3BlZWQgOiBcIiArICAgICBzZWxlY3RTcGVlZC5vcHRpb25zW3NlbGVjdFNwZWVkLnNlbGVjdGVkSW5kZXhdLnZhbHVlKTtcbiAgICAgIFxuICAgIH0pO1xuICAgIFxuICAgIGRpdlNlZ21lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnaURpdi5pZCA6ICcpO1xuICAgICAgXG4gICAgICBsZXQgbmJSZXBldCA9IHNlbGVjdE5iUmVwZXQub3B0aW9uc1tzZWxlY3ROYlJlcGV0LnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgbGV0IHNwZWVkUmF0ZSA9IHNlbGVjdFNwZWVkLm9wdGlvbnNbc2VsZWN0U3BlZWQuc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICBcbiAgICAgIHJlcGV0aXRpb25OdW1iZXIgPSBuYlJlcGV0O1xuICAgICAgc3BlZWQgPSBzcGVlZFJhdGU7XG4gICAgICBcbiAgICAgIHNlZ21lbnRGZWVkYmFjay5zdGFydFBvc3Rpb24gPSBpRGl2LnN0eWxlLmxlZnQgIDtcbiAgICAgIHNlZ21lbnRGZWVkYmFjay53aWR0aCA9IHdpZHRoO1xuICAgICAgZmVlZGJhY2tPblNsaWRlclZpZGVvKHRydWUpO1xuICAgICAgcmVwZXRQYXJ0T2ZWaWRlbyhzdGFydER1cmF0aW9uLCBlbmREdXJhdGlvbiwgbmJSZXBldCwgc3BlZWRSYXRlKTtcbiAgICB9LCBmYWxzZSk7XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGluaXRHVUkoKSB7XG4gICAgdGV4dFNlZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRleHRTZWdtZW50LmNsYXNzTmFtZSA9ICd0ZXh0U2VnbWVudCc7XG4gICAgLy9VSSBidXR0b24gc3BlZWQgYW5kIHNsb3dcbiAgICBpbWdSZXBldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgaW1nUmVwZXQuY2xhc3NOYW1lPSdpbWdSZXBldCc7XG4gICAgaW1nU2xvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgaW1nU2xvdy5jbGFzc05hbWU9J2ltZ1Nsb3cnO1xuICAgIFxuICAgIHNlbGVjdFNwZWVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcbiAgICBzZWxlY3RTcGVlZC5jbGFzc05hbWUgPSdzZWxlY3RTcGVlZCcgO1xuICAgIHNlbGVjdE5iUmVwZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xuICAgIHNlbGVjdE5iUmVwZXQuY2xhc3NOYW1lID0nc2VsZWN0TmJSZXBldCcgO1xuICAgIFxuICAgIGRpdkluZm9DYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2SW5mb0NhcmQuY2xhc3NOYW1lID0gXCJpbmZvQ2FyZFwiO1xuICAgIFxuICAgIHRleHRTZWdtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IHRleHRTZWdtZW50LnZhbHVlO1xuICAgIH0pO1xuICAgXG4gICAgLy9QZXVwbGVyIGxlcyBsaXN0ZXMgZMOpcm91bGFudGVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSArPSAxKSB7XG4gICAgICBzZWxlY3RTcGVlZC5hZGQobmV3IE9wdGlvbihpIC8gMTAgKyBcIlwiKSk7XG4gICAgfVxuICAgIHNlbGVjdFNwZWVkLnNlbGVjdGVkSW5kZXggPSAxMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDIwOyBpKyspIHtcbiAgICAgIHNlbGVjdE5iUmVwZXQub3B0aW9ucy5hZGQobmV3IE9wdGlvbihpICsgXCJcIikpO1xuICAgIH1cbiAgICBzZWxlY3ROYlJlcGV0LnNlbGVjdGVkSW5kZXggPSAxO1xuICAgIFxuICAgIC8qXG4gICAgc2VsZWN0TmJSZXBldC5hZGRFdmVudExpc3RlbmVyKFwib25jaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgXG4gICAgICByZXBldGl0aW9uTnVtYmVyID0gc2VsZWN0TmJSZXBldC5vcHRpb25zW3NlbGVjdE5iUmVwZXQuc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICBjb25zb2xlLmxvZyhcInNlbGVjdGVkIDogXCIgKyByZXBldGl0aW9uTnVtYmVyKTtcbiAgICB9KTsqL1xuICAgIFxuICAgIC8vRGl2IGNvbnRlbmFudCBsZXMgaW5mbyBkdSBkZXNzdXMgKHRhaWxsZSBkZSBkaXYgaW52YXJpYWJsZSlcbiAgICBkaXZJbmZvQ2FyZC5hcHBlbmRDaGlsZChpbWdTbG93KTtcbiAgICBkaXZJbmZvQ2FyZC5hcHBlbmRDaGlsZChzZWxlY3RTcGVlZCk7XG4gICAgZGl2SW5mb0NhcmQuYXBwZW5kQ2hpbGQoaW1nUmVwZXQpO1xuICAgIGRpdkluZm9DYXJkLmFwcGVuZENoaWxkKHNlbGVjdE5iUmVwZXQpO1xuICAgIGlEaXYuYXBwZW5kQ2hpbGQoZGl2U2VnbWVudCk7XG4gICAgaURpdi5hcHBlbmRDaGlsZCh0ZXh0U2VnbWVudCk7XG4gICAgaURpdi5hcHBlbmRDaGlsZChkaXZJbmZvQ2FyZCk7XG4gIFxuICAgIC8vSWYgdGhlIGNhcmQgaGF2ZSBiZWVuIGRlbGV0ZWQsIHRoZSBjb2xvciBpcyByZWQsIG90aGVyd2lzZSBibHVlLlxuICAgIGlmIChjYXJkSW5mbykge1xuICAgICAgaWYoY2FyZEluZm8uZGVsZXRlZCl7XG4gICAgICAgIGRpdlNlZ21lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZWRcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpdlNlZ21lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMjEzRjhEXCI7XG4gICAgICB9XG4gICAgICB0ZXh0U2VnbWVudC52YWx1ZSA9IGNhcmRJbmZvLmRlc2NyaXB0aW9uO1xuICAgICAgc2VsZWN0TmJSZXBldC5zZWxlY3RlZEluZGV4ID0gY2FyZEluZm8ucmVwZXRpdGlvbk51bWJlcjtcbiAgICAgIHNlbGVjdFNwZWVkLnNlbGVjdGVkSW5kZXggPSBjYXJkSW5mby5zcGVlZCoxMDtcbiAgICB9XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGluaXRTdHlsZSgpIHtcbiAgICB0ZXh0U2VnbWVudC5zdHlsZS5sZWZ0ID0gZGl2U2VnbWVudC5zdHlsZS53aWR0aDtcbiAgICBpbWdTbG93LnNyYyA9IFwiL21lZGlhL3dvcmtzaG9wMi9jYXJkL3Nsb3cucG5nXCI7XG4gICAgaW1nUmVwZXQuc3JjID0gXCIvbWVkaWEvd29ya3Nob3AyL2NhcmQvcmVwZXQucG5nXCI7XG4gIH1cbiAgXG4gIFxuICBcbiAgXG4gIGZ1bmN0aW9uIHBsYXlDYXJkKCl7XG4gICAgdmlkZW8uY3VycmVudFRpbWUgPSBzdGFydER1cmF0aW9uUGFyYW07XG4gICAgc2VnbWVudEZlZWRiYWNrLndpZHRoID0gaURpdi5zdHlsZS53aWR0aDtcbiAgICBzZWdtZW50RmVlZGJhY2suc3RhcnRQb3N0aW9uID0gaURpdi5zdHlsZS5sZWZ0O1xuICAgIGZlZWRiYWNrT25TbGlkZXJWaWRlbyh0cnVlKTtcbiAgfVxuICBcbiAgXG4gIFxuICBcbiAgXG4gIHZhciBjYXJkT2JqZWN0ID0ge1xuICAgIHdpZHRoOiAgd2lkdGgsXG4gICAgc3RhcnRQIDogc3RhcnRQLFxuICAgIGVuZFAgOiBlbmRQLFxuICAgIGRlc2NyaXB0aW9uIDogZGVzY3JpcHRpb24sXG4gICAgc3BlZWQgOiBzcGVlZCxcbiAgICByZXBldGl0aW9uTnVtYmVyIDogcmVwZXRpdGlvbk51bWJlcixcbiAgICBpRGl2OmlEaXYsXG4gICAgdXBkYXRlSW5mbyA6IHVwZGF0ZUluZm9cbiAgfTtcbiAgXG4gIFxuICBcbiAgXG4gIFxuICByZXR1cm4gY2FyZE9iamVjdDtcbn1cblxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaXF1ZUlkKCl7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBjb21wb25lbnRzID0gW1xuICAgICAgZGF0ZS5nZXRNb250aCgpLFxuICAgICAgZGF0ZS5nZXREYXRlKCksXG4gICAgICBkYXRlLmdldEhvdXJzKCksXG4gICAgICBkYXRlLmdldE1pbnV0ZXMoKSxcbiAgICAgIGRhdGUuZ2V0U2Vjb25kcygpLFxuICAgICAgZGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuICAgIF07XG4gICAgcmV0dXJuIGNvbXBvbmVudHMuam9pbihcIlwiKTtcbiAgfVxuXG5cbiAgXG4gICJdfQ==