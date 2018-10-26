'use strict';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmQuanMiXSwibmFtZXMiOlsiQ2FyZCIsInN0YXJ0RHVyYXRpb25QYXJhbSIsImVuZER1cmF0aW9uUGFyYW0iLCJzdGFydFBvc2l0aW9uUGFyYW0iLCJlbmRQb3NpdGlvblBhcmFtIiwiY2FyZEluZm8iLCJ3aWR0aCIsImhlaWdodCIsImRlbGV0ZWQiLCJpRGl2Iiwic3RhcnRQIiwiZW5kUCIsImRlc2NyaXB0aW9uIiwic3BlZWQiLCJyZXBldGl0aW9uTnVtYmVyIiwiZGl2SW5mb0NhcmQiLCJzZWxlY3ROYlJlcGV0Iiwic2VsZWN0U3BlZWQiLCJpbWdTbG93IiwidGV4dFNlZ21lbnQiLCJpbWdSZXBldCIsImRpdlNlZ21lbnQiLCJzdGFydER1cmF0aW9uIiwiZW5kRHVyYXRpb24iLCJsZWZ0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJjcmVhdGVVbmlxdWVJZCIsImNsYXNzTmFtZSIsInN0eWxlIiwicGFyc2VJbnQiLCJpbml0R1VJIiwiaW5pdFN0eWxlIiwiaW5pdExpc3RlbmVyIiwicGxheUNhcmQiLCJ1cGRhdGVJbmZvIiwiY2FyZE9iamVjdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJjb25zb2xlIiwibG9nIiwiYnV0dG9uRGVsZXRlIiwicG9zaXRpb24iLCJ0eXBlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJmZWVkYmFja09uU2xpZGVyVmlkZW8iLCJyZW1vdmUiLCJvcHRpb25zIiwic2VsZWN0ZWRJbmRleCIsInZhbHVlIiwibmJSZXBldCIsInNwZWVkUmF0ZSIsInNlZ21lbnRGZWVkYmFjayIsInN0YXJ0UG9zdGlvbiIsInJlcGV0UGFydE9mVmlkZW8iLCJpIiwiYWRkIiwiT3B0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwic3JjIiwidmlkZW8iLCJjdXJyZW50VGltZSIsImRhdGUiLCJEYXRlIiwiY29tcG9uZW50cyIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsImdldEhvdXJzIiwiZ2V0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WixDQUFrQk4sSUFBbEIsR0FBeUJILFdBQVdTLEtBQVgsQ0FBaUJ4QixLQUExQztBQUNBWSxZQUFRNEMsR0FBUixHQUFjLGdDQUFkO0FBQ0ExQyxhQUFTMEMsR0FBVCxHQUFlLGlDQUFmO0FBQ0Q7O0FBS0QsV0FBUzNCLFFBQVQsR0FBbUI7QUFDakI0QixVQUFNQyxXQUFOLEdBQW9CL0Qsa0JBQXBCO0FBQ0FzRCxvQkFBZ0JqRCxLQUFoQixHQUF3QkcsS0FBS3FCLEtBQUwsQ0FBV3hCLEtBQW5DO0FBQ0FpRCxvQkFBZ0JDLFlBQWhCLEdBQStCL0MsS0FBS3FCLEtBQUwsQ0FBV04sSUFBMUM7QUFDQXdCLDBCQUFzQixJQUF0QjtBQUNEOztBQU1ELE1BQUlYLGFBQWE7QUFDZi9CLFdBQVFBLEtBRE87QUFFZkksWUFBU0EsTUFGTTtBQUdmQyxVQUFPQSxJQUhRO0FBSWZDLGlCQUFjQSxXQUpDO0FBS2ZDLFdBQVFBLEtBTE87QUFNZkMsc0JBQW1CQSxnQkFOSjtBQU9mTCxVQUFLQSxJQVBVO0FBUWYyQixnQkFBYUE7QUFSRSxHQUFqQjs7QUFlQSxTQUFPQyxVQUFQO0FBQ0Q7O0FBR0MsU0FBU1QsY0FBVCxHQUF5QjtBQUN2QixNQUFJcUMsT0FBTyxJQUFJQyxJQUFKLEVBQVg7QUFDQSxNQUFJQyxhQUFhLENBQ2ZGLEtBQUtHLFFBQUwsRUFEZSxFQUVmSCxLQUFLSSxPQUFMLEVBRmUsRUFHZkosS0FBS0ssUUFBTCxFQUhlLEVBSWZMLEtBQUtNLFVBQUwsRUFKZSxFQUtmTixLQUFLTyxVQUFMLEVBTGUsRUFNZlAsS0FBS1EsZUFBTCxFQU5lLENBQWpCO0FBUUEsU0FBT04sV0FBV08sSUFBWCxDQUFnQixFQUFoQixDQUFQO0FBQ0QiLCJmaWxlIjoiY2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIENhcmQgKHN0YXJ0RHVyYXRpb25QYXJhbSxlbmREdXJhdGlvblBhcmFtLHN0YXJ0UG9zaXRpb25QYXJhbSxlbmRQb3NpdGlvblBhcmFtLCBjYXJkSW5mbykge1xuICBcbiAgLy9Qcm9wcmnDqXTDqSBkZSBzdHlsZVxuICBsZXQgd2lkdGggPSAnNiUnO1xuICBcbiAgbGV0IGhlaWdodCA9ICc2JSc7XG4gIHZhciBkZWxldGVkID0gZmFsc2U7XG4gIHZhciBpRGl2ID0gbnVsbDtcbiAgdmFyIHN0YXJ0UCA9IHN0YXJ0UG9zaXRpb25QYXJhbTtcbiAgdmFyIGVuZFAgPSBlbmRQb3NpdGlvblBhcmFtO1xuLy9WYWxldXIgcG91ciBqb3VlciBsYSBjYXJ0ZVxuICBsZXQgZGVzY3JpcHRpb24gPSAnJztcbiAgbGV0IHNwZWVkID0gMTtcbiAgbGV0IHJlcGV0aXRpb25OdW1iZXIgPSAxO1xuLy9kaXYgdXNlZFxuICBsZXQgZGl2SW5mb0NhcmQgPSBudWxsO1xuICAvL2xldCBzZWxlY3RTcGVlZD1udWxsO1xuICBsZXQgc2VsZWN0TmJSZXBldCA9IG51bGw7XG4gIGxldCBzZWxlY3RTcGVlZCA9IG51bGw7XG4gIFxuICBsZXQgaW1nU2xvdyA9IG51bGw7XG4gIFxuICBsZXQgdGV4dFNlZ21lbnQgPSBudWxsO1xuICBsZXQgaW1nUmVwZXQgPSBudWxsO1xuICBsZXQgZGl2U2VnbWVudCA9IG51bGw7XG4gIGxldCBzdGFydER1cmF0aW9uID0gc3RhcnREdXJhdGlvblBhcmFtO1xuICBsZXQgZW5kRHVyYXRpb24gPSBlbmREdXJhdGlvblBhcmFtO1xuICBsZXQgbGVmdCA7XG4gIFxuICAvL2NldHRlIGRpdiBlc3QgbGEgcHJpbmNpcGFsZSwgY2VsbGUgcXVpIGNvbnRpZW50IGZyYWdtZW50ICsgYmFyZEZyYWdtZW50XG4gIGlEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgaURpdi5pZCA9ICdpZENhcmQnICsgY3JlYXRlVW5pcXVlSWQoKTtcbiAgaURpdi5jbGFzc05hbWUgPSAnc2VnbWVudFdyYXBwZXInO1xuICBpRGl2LnN0eWxlLmxlZnQgPSBzdGFydFBvc2l0aW9uUGFyYW0gKyBcInB4XCI7XG4gIFxuICAvL0RpdiBkdSBzZWdtZW50IGJsZXVcbiAgZGl2U2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXZTZWdtZW50LmNsYXNzTmFtZSA9ICdzZWdtZW50JztcbiAgXG4gIC8vdGFpbGxlIGRlIGxhIGNhcnRlIGluaXRpYWxlXG4gIHdpZHRoID0gaURpdi5zdHlsZS53aWR0aCA9IHBhcnNlSW50KGVuZFBvc2l0aW9uUGFyYW0sIDEwKSAtIHBhcnNlSW50KHN0YXJ0UG9zaXRpb25QYXJhbSwgMTApICsgXCJweFwiO1xuICBkaXZTZWdtZW50LnN0eWxlLndpZHRoID0gcGFyc2VJbnQoZW5kUG9zaXRpb25QYXJhbSwgMTApIC0gcGFyc2VJbnQoc3RhcnRQb3NpdGlvblBhcmFtLCAxMCkgKyBcInB4XCI7XG4gIFxuICBcbiAgaW5pdEdVSSgpO1xuICBpbml0U3R5bGUoKTtcbiAgaW5pdExpc3RlbmVyKCk7XG4gIHBsYXlDYXJkKCk7XG4gIFxuICBcbiAgLy9jb25zb2xlLmxvZyhjYXJkSW5mby5kZWxldGVkKTtcbiAgXG4gIFxuICBmdW5jdGlvbiB1cGRhdGVJbmZvKCl7XG4gICAgdmFyIGNhcmRPYmplY3QgPSB7XG4gICAgICB3aWR0aDogIHdpZHRoLFxuICAgICAgc3RhcnRQIDogc3RhcnRQLFxuICAgICAgZW5kUCA6IGVuZFAsXG4gICAgICBkZXNjcmlwdGlvbiA6IGRlc2NyaXB0aW9uLFxuICAgICAgc3BlZWQgOiBzcGVlZCxcbiAgICAgIGRlbGV0ZWQ6ZGVsZXRlZCxcbiAgICAgIHJlcGV0aXRpb25OdW1iZXIgOiByZXBldGl0aW9uTnVtYmVyXG4gICAgfTtcbiAgICByZXR1cm4gY2FyZE9iamVjdDtcbiAgfVxuICBcbiAgXG4gIGZ1bmN0aW9uIGluaXRMaXN0ZW5lcigpIHtcbiAgICBcbiAgICB0ZXh0U2VnbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb25nLXByZXNzJywgZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zb2xlLmxvZyhcImxvbmcgcHJlc3MgOiBcIiArIGRlc2NyaXB0aW9uICk7XG4gICAgICAvL2RlbGV0ZSBhcHBhcmFpdFxuICAgICAgdmFyIGJ1dHRvbkRlbGV0ZSA9ICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ1dHRvbkRlbGV0ZS5pZCA9ICdpZEJ0bkRlbGV0ZSc7XG4gICAgICBidXR0b25EZWxldGUuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICBidXR0b25EZWxldGUudHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICBidXR0b25EZWxldGUuaW5uZXJIVE1MID0gXCJEZWxldGVcIjtcbiAgICAgIGJ1dHRvbkRlbGV0ZS5zdHlsZS53aWR0aCA9IFwiMTAwcHhcIjtcbiAgICAgIFxuICAgICAgZGl2SW5mb0NhcmQuYXBwZW5kQ2hpbGQoYnV0dG9uRGVsZXRlKTtcbiAgICAgIGJ1dHRvbkRlbGV0ZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsZnVuY3Rpb24oZSl7XG4gICAgICAgIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG4gICAgICAgIGlEaXYucmVtb3ZlKCk7XG4gICAgICAgIGRlbGV0ZWQgPSB0cnVlXG4gICAgICB9KTtcbiAgICAgIGJ1dHRvbkRlbGV0ZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLGZ1bmN0aW9uKGUpe1xuICAgICAgICBmZWVkYmFja09uU2xpZGVyVmlkZW8oZmFsc2UpO1xuICAgICAgICBpRGl2LnJlbW92ZSgpO1xuICAgICAgICBkZWxldGVkID0gdHJ1ZVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gICAgZGl2U2VnbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb25nLXByZXNzJywgZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zb2xlLmxvZyhcImxvbmcgcHJlc3MgOiBcIiArIGRlc2NyaXB0aW9uICk7XG4gICAgICAvL2RlbGV0ZSBhcHBhcmFpdFxuICAgICAgdmFyIGJ1dHRvbkRlbGV0ZSA9ICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGJ1dHRvbkRlbGV0ZS5pZCA9ICdpZEJ0bkRlbGV0ZSc7XG4gICAgICBidXR0b25EZWxldGUuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICBidXR0b25EZWxldGUudHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICBidXR0b25EZWxldGUuaW5uZXJIVE1MID0gXCJEZWxldGVcIjtcbiAgICAgIGJ1dHRvbkRlbGV0ZS5zdHlsZS53aWR0aCA9IFwiMTAwcHhcIjtcbiAgICAgIFxuICAgICAgZGl2SW5mb0NhcmQuYXBwZW5kQ2hpbGQoYnV0dG9uRGVsZXRlKTtcbiAgICAgIGJ1dHRvbkRlbGV0ZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsZnVuY3Rpb24oZSl7XG4gICAgICAgIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG4gICAgICAgIGlEaXYucmVtb3ZlKCk7XG4gICAgICAgIGRlbGV0ZWQgPSB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgICBzZWxlY3RTcGVlZC5hZGRFdmVudExpc3RlbmVyKFwib25jaGFuZ2VcIiwgZnVuY3Rpb24oKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiY2hhbmdlIHNwZWVkIDogXCIgKyAgICAgc2VsZWN0U3BlZWQub3B0aW9uc1tzZWxlY3RTcGVlZC5zZWxlY3RlZEluZGV4XS52YWx1ZSk7XG4gICAgICBcbiAgICB9KTtcbiAgICBcbiAgICBkaXZTZWdtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2lEaXYuaWQgOiAnKTtcbiAgICAgIFxuICAgICAgbGV0IG5iUmVwZXQgPSBzZWxlY3ROYlJlcGV0Lm9wdGlvbnNbc2VsZWN0TmJSZXBldC5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgIGxldCBzcGVlZFJhdGUgPSBzZWxlY3RTcGVlZC5vcHRpb25zW3NlbGVjdFNwZWVkLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgXG4gICAgICByZXBldGl0aW9uTnVtYmVyID0gbmJSZXBldDtcbiAgICAgIHNwZWVkID0gc3BlZWRSYXRlO1xuICAgICAgXG4gICAgICBzZWdtZW50RmVlZGJhY2suc3RhcnRQb3N0aW9uID0gaURpdi5zdHlsZS5sZWZ0ICA7XG4gICAgICBzZWdtZW50RmVlZGJhY2sud2lkdGggPSB3aWR0aDtcbiAgICAgIGZlZWRiYWNrT25TbGlkZXJWaWRlbyh0cnVlKTtcbiAgICAgIHJlcGV0UGFydE9mVmlkZW8oc3RhcnREdXJhdGlvbiwgZW5kRHVyYXRpb24sIG5iUmVwZXQsIHNwZWVkUmF0ZSk7XG4gICAgfSwgZmFsc2UpO1xuICB9XG4gIFxuICBmdW5jdGlvbiBpbml0R1VJKCkge1xuICAgIHRleHRTZWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0ZXh0U2VnbWVudC5jbGFzc05hbWUgPSAndGV4dFNlZ21lbnQnO1xuICAgIC8vVUkgYnV0dG9uIHNwZWVkIGFuZCBzbG93XG4gICAgaW1nUmVwZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgIGltZ1JlcGV0LmNsYXNzTmFtZT0naW1nUmVwZXQnO1xuICAgIGltZ1Nsb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgIGltZ1Nsb3cuY2xhc3NOYW1lPSdpbWdTbG93JztcbiAgICBcbiAgICBzZWxlY3RTcGVlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XG4gICAgc2VsZWN0U3BlZWQuY2xhc3NOYW1lID0nc2VsZWN0U3BlZWQnIDtcbiAgICBzZWxlY3ROYlJlcGV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcbiAgICBzZWxlY3ROYlJlcGV0LmNsYXNzTmFtZSA9J3NlbGVjdE5iUmVwZXQnIDtcbiAgICBcbiAgICBkaXZJbmZvQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdkluZm9DYXJkLmNsYXNzTmFtZSA9IFwiaW5mb0NhcmRcIjtcbiAgICBcbiAgICBcbiAgICB0ZXh0U2VnbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgZGVzY3JpcHRpb24gPSB0ZXh0U2VnbWVudC52YWx1ZTtcbiAgICB9KTtcbiAgIFxuICAgIC8vUGV1cGxlciBsZXMgbGlzdGVzIGTDqXJvdWxhbnRlc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkgKz0gMSkge1xuICAgICAgc2VsZWN0U3BlZWQuYWRkKG5ldyBPcHRpb24oaSAvIDEwICsgXCJcIikpO1xuICAgIH1cbiAgICBzZWxlY3RTcGVlZC5zZWxlY3RlZEluZGV4ID0gMTA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gICAgICBzZWxlY3ROYlJlcGV0Lm9wdGlvbnMuYWRkKG5ldyBPcHRpb24oaSArIFwiXCIpKTtcbiAgICB9XG4gICAgc2VsZWN0TmJSZXBldC5zZWxlY3RlZEluZGV4ID0gMTtcbiAgICBcbiAgICAvKlxuICAgIHNlbGVjdE5iUmVwZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9uY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIFxuICAgICAgcmVwZXRpdGlvbk51bWJlciA9IHNlbGVjdE5iUmVwZXQub3B0aW9uc1tzZWxlY3ROYlJlcGV0LnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgY29uc29sZS5sb2coXCJzZWxlY3RlZCA6IFwiICsgcmVwZXRpdGlvbk51bWJlcik7XG4gICAgfSk7Ki9cbiAgICBcbiAgICAvL0RpdiBjb250ZW5hbnQgbGVzIGluZm8gZHUgZGVzc3VzICh0YWlsbGUgZGUgZGl2IGludmFyaWFibGUpXG4gICAgZGl2SW5mb0NhcmQuYXBwZW5kQ2hpbGQoaW1nU2xvdyk7XG4gICAgZGl2SW5mb0NhcmQuYXBwZW5kQ2hpbGQoc2VsZWN0U3BlZWQpO1xuICAgIGRpdkluZm9DYXJkLmFwcGVuZENoaWxkKGltZ1JlcGV0KTtcbiAgICBkaXZJbmZvQ2FyZC5hcHBlbmRDaGlsZChzZWxlY3ROYlJlcGV0KTtcbiAgICBpRGl2LmFwcGVuZENoaWxkKGRpdlNlZ21lbnQpO1xuICAgIGlEaXYuYXBwZW5kQ2hpbGQodGV4dFNlZ21lbnQpO1xuICAgIGlEaXYuYXBwZW5kQ2hpbGQoZGl2SW5mb0NhcmQpO1xuICBcbiAgICAvL0lmIHRoZSBjYXJkIGhhdmUgYmVlbiBkZWxldGVkLCB0aGUgY29sb3IgaXMgcmVkLCBvdGhlcndpc2UgYmx1ZS5cbiAgICBpZiAoY2FyZEluZm8pIHtcbiAgICAgIGlmKGNhcmRJbmZvLmRlbGV0ZWQpe1xuICAgICAgICBkaXZTZWdtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmVkXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXZTZWdtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzIxM0Y4RFwiO1xuICAgICAgfVxuICAgICAgdGV4dFNlZ21lbnQudmFsdWUgPSBjYXJkSW5mby5kZXNjcmlwdGlvbjtcbiAgICAgIHNlbGVjdE5iUmVwZXQuc2VsZWN0ZWRJbmRleCA9IGNhcmRJbmZvLnJlcGV0aXRpb25OdW1iZXI7XG4gICAgICBzZWxlY3RTcGVlZC5zZWxlY3RlZEluZGV4ID0gY2FyZEluZm8uc3BlZWQqMTA7XG4gICAgfVxuICB9XG4gIFxuICBmdW5jdGlvbiBpbml0U3R5bGUoKSB7XG4gICAgdGV4dFNlZ21lbnQuc3R5bGUubGVmdCA9IGRpdlNlZ21lbnQuc3R5bGUud2lkdGg7XG4gICAgaW1nU2xvdy5zcmMgPSBcIi9tZWRpYS93b3Jrc2hvcDIvY2FyZC9zbG93LnBuZ1wiO1xuICAgIGltZ1JlcGV0LnNyYyA9IFwiL21lZGlhL3dvcmtzaG9wMi9jYXJkL3JlcGV0LnBuZ1wiO1xuICB9XG4gIFxuICBcbiAgXG4gIFxuICBmdW5jdGlvbiBwbGF5Q2FyZCgpe1xuICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gc3RhcnREdXJhdGlvblBhcmFtO1xuICAgIHNlZ21lbnRGZWVkYmFjay53aWR0aCA9IGlEaXYuc3R5bGUud2lkdGg7XG4gICAgc2VnbWVudEZlZWRiYWNrLnN0YXJ0UG9zdGlvbiA9IGlEaXYuc3R5bGUubGVmdDtcbiAgICBmZWVkYmFja09uU2xpZGVyVmlkZW8odHJ1ZSk7XG4gIH1cbiAgXG4gIFxuICBcbiAgXG4gIFxuICB2YXIgY2FyZE9iamVjdCA9IHtcbiAgICB3aWR0aDogIHdpZHRoLFxuICAgIHN0YXJ0UCA6IHN0YXJ0UCxcbiAgICBlbmRQIDogZW5kUCxcbiAgICBkZXNjcmlwdGlvbiA6IGRlc2NyaXB0aW9uLFxuICAgIHNwZWVkIDogc3BlZWQsXG4gICAgcmVwZXRpdGlvbk51bWJlciA6IHJlcGV0aXRpb25OdW1iZXIsXG4gICAgaURpdjppRGl2LFxuICAgIHVwZGF0ZUluZm8gOiB1cGRhdGVJbmZvXG4gIH07XG4gIFxuICBcbiAgXG4gIFxuICBcbiAgcmV0dXJuIGNhcmRPYmplY3Q7XG59XG5cblxuICBmdW5jdGlvbiBjcmVhdGVVbmlxdWVJZCgpe1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICB2YXIgY29tcG9uZW50cyA9IFtcbiAgICAgIGRhdGUuZ2V0TW9udGgoKSxcbiAgICAgIGRhdGUuZ2V0RGF0ZSgpLFxuICAgICAgZGF0ZS5nZXRIb3VycygpLFxuICAgICAgZGF0ZS5nZXRNaW51dGVzKCksXG4gICAgICBkYXRlLmdldFNlY29uZHMoKSxcbiAgICAgIGRhdGUuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICBdO1xuICAgIHJldHVybiBjb21wb25lbnRzLmpvaW4oXCJcIik7XG4gIH1cblxuXG4gIFxuICAiXX0=