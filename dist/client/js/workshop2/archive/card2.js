'use strict';

var Card = function () {

  //Propriété de style
  var width = '6%';
  var height = '6%';
  var elmOffset = 0;

  var className = null;
  var iDiv = null;
  var startP = 0;var endP = 0;

  //Valeur pour jouer la carte
  var description = '';

  var speed = 1;
  var repetitionNumber = 1;

  //clique ou non
  var expended = false;

  //div used
  var divInfoCard = null;
  //let selectSpeed=null;
  var selectNbRepet = null;
  var selectSpeed = null;

  var imgSlow = null;

  var card = null;
  var boxObject = null;
  var imgRepet = null;
  var divSegment = null;

  var id = void 0;

  // PUBLIC OBJECT
  var objectCard = {};

  objectCard['constructor'] = function (startDurationParam, endDurationParam, startPositionParam, endPositionParam) {

    var startDuration = startDurationParam;
    var endDuration = endDurationParam;
    //div pour le segment carte entier

    //cette div est la principale, celle qui contien t fragment + bardFragment
    iDiv = document.createElement('div');
    iDiv.id = 'idCard' + createUniqueId();
    id = iDiv.id;

    divSegment = document.createElement('div');
    divSegment.className = 'segment';
    divSegment.style.height = 15 + "px";
    iDiv.className = 'resizableSegment';

    document.getElementById('divCardBoard').insertBefore(iDiv, document.getElementById('divCardBoard').firstChild);

    iDiv.style.left = startPositionParam + "px";
    //taille de la carte initiale
    width = iDiv.style.width = parseInt(endPositionParam, 10) - parseInt(startPositionParam, 10) + "px";
    divSegment.style.width = parseInt(endPositionParam, 10) - parseInt(startPositionParam, 10) + "px";
    divSegment.style.top = 0 + "px";

    //joue le segment qui vient de se creer
    video.currentTime = startDurationParam;

    initGUICard(iDiv, startPositionParam, endPositionParam);
    initListenerCard(divSegment, startDuration, endDuration);

    var card = { description: description, width: width, height: height, iDiv: iDiv, id: id, selectSpeed: selectSpeed, selectNbRepet: selectNbRepet };

    return card;
  };

  function initGUICard(iDiv) {

    boxObject = document.getElementById(iDiv.id);
    card = document.createElement('input');
    //UI button speed and slow
    imgRepet = document.createElement("img");
    imgSlow = document.createElement("img");

    selectSpeed = document.createElement("select");
    selectNbRepet = document.createElement("select");

    divInfoCard = document.createElement('div');
    divInfoCard.className = "infoCard";

    card.addEventListener("keyup", function () {
      description = card.value;
    });

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

    //Div contenant les info du dessus (taille de div invariable


    divInfoCard.appendChild(imgSlow);
    divInfoCard.appendChild(selectSpeed);
    divInfoCard.appendChild(imgRepet);
    divInfoCard.appendChild(selectNbRepet);
    boxObject.appendChild(card);
    boxObject.appendChild(divSegment);
    boxObject.appendChild(divInfoCard);

    applyStyle();
  }

  //lance le segment lors d'un click sur la carte, a l'endroit, nb de repet et vitesse
  function initListenerCard(iDiv, startD, endD) {

    card.addEventListener("mousedown", , false);

    iDiv.addEventListener("mousedown", function () {

      console.log('iDiv.id : ' + this.id);

      console.log("repetitionNumber : " + repetitionNumber);
      var nbRepet = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      var speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;

      /*console.log("selectNbRepet.options[selectNbRepet.selectedIndex].value : " + selectNbRepet.options[selectNbRepet.selectedIndex].value);
      console.log("selectNbRepet.options[selectNbRepet.selectedIndex].value : " + selectNbRepet.options[selectNbRepet.selectedIndex].value);
      */

      repetitionNumber = nbRepet;
      speed = speedRate;

      repetPartOfVideo(startD, endD, nbRepet, speedRate);
    }, false);
  }

  function createUniqueId() {
    var date = new Date();
    var components = [date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
    return components.join("");
  }

  function applyStyle() {

    card.style.marginBottom = 6 + "px";
    card.style.background = "transparent";
    card.style.border = 'none';
    card.style.borderRadius = 10 + "px";
    card.type = "text";
    //card.style.width= (parseInt(iDiv.style.width) - 2) +"px";
    card.style.width = 200 + "px";
    card.style.fontWeight = 'bold';
    card.style.marginLeft = 7 + "px";
    card.style.color = "#ffffff";
    card.style.whiteSpace = 'normal';
    card.style.zIndex = "10";
    card.style.left = "2px";
    card.style.top = "0px";

    divSegment.style.zIndex = "1";
    divSegment.style.left = "0";
    divSegment.style.top = "0";

    boxObject.style.marginRight = 3 + "px";
    boxObject.style.marginBottom = 50 + "px";

    imgSlow.src = "/media/workshop2/card/slow.png";
    imgSlow.style.width = 20 + "px";
    imgSlow.style.height = 20 + "px";
    //imgSlow.style.margin = 10+"px";


    imgRepet.src = "/media/workshop2/card/repet.png";
    imgRepet.style.width = 15 + "px";
    imgRepet.style.height = 15 + "px";

    selectSpeed.style.margin = 10 + "px";
    selectSpeed.style.marginRight = 20 + "px";
    selectSpeed.style.marginLeft = 5 + "px";
    selectSpeed.style.background = "white";

    selectNbRepet.style.margin = 10 + "px";
    selectNbRepet.style.marginRight = 20 + "px";
    selectNbRepet.style.marginLeft = 5 + "px";
    selectNbRepet.style.color = "white";

    divInfoCard.style.width = 150 + "px";
    divInfoCard.style.height = 10 + "px";
    divInfoCard.style.position = "absolute";
  }

  /*
  objectCard['playCard'] =  function(startD,endD){
    console.log("dodo");
    
      console.log("repetitionNumber : "  + repetitionNumber);
      let nbRepet = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      repetitionNumber = nbRepet;
      speed = speedRate;
      repetPartOfVideo(startD, endD, nbRepet, speedRate);
    
  };*/

  return objectCard;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmQyLmpzIl0sIm5hbWVzIjpbIkNhcmQiLCJ3aWR0aCIsImhlaWdodCIsImVsbU9mZnNldCIsImNsYXNzTmFtZSIsImlEaXYiLCJzdGFydFAiLCJlbmRQIiwiZGVzY3JpcHRpb24iLCJzcGVlZCIsInJlcGV0aXRpb25OdW1iZXIiLCJleHBlbmRlZCIsImRpdkluZm9DYXJkIiwic2VsZWN0TmJSZXBldCIsInNlbGVjdFNwZWVkIiwiaW1nU2xvdyIsImNhcmQiLCJib3hPYmplY3QiLCJpbWdSZXBldCIsImRpdlNlZ21lbnQiLCJpZCIsIm9iamVjdENhcmQiLCJzdGFydER1cmF0aW9uUGFyYW0iLCJlbmREdXJhdGlvblBhcmFtIiwic3RhcnRQb3NpdGlvblBhcmFtIiwiZW5kUG9zaXRpb25QYXJhbSIsInN0YXJ0RHVyYXRpb24iLCJlbmREdXJhdGlvbiIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNyZWF0ZVVuaXF1ZUlkIiwic3R5bGUiLCJnZXRFbGVtZW50QnlJZCIsImluc2VydEJlZm9yZSIsImZpcnN0Q2hpbGQiLCJsZWZ0IiwicGFyc2VJbnQiLCJ0b3AiLCJ2aWRlbyIsImN1cnJlbnRUaW1lIiwiaW5pdEdVSUNhcmQiLCJpbml0TGlzdGVuZXJDYXJkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInZhbHVlIiwiaSIsImFkZCIsIk9wdGlvbiIsInNlbGVjdGVkSW5kZXgiLCJvcHRpb25zIiwiYXBwZW5kQ2hpbGQiLCJhcHBseVN0eWxlIiwic3RhcnREIiwiZW5kRCIsImUiLCJjb25zb2xlIiwibG9nIiwibmJSZXBldCIsInNwZWVkUmF0ZSIsInJlcGV0UGFydE9mVmlkZW8iLCJkYXRlIiwiRGF0ZSIsImNvbXBvbmVudHMiLCJnZXRNb250aCIsImdldERhdGUiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwiZ2V0TWlsbGlzZWNvbmRzIiwiam9pbiIsIm1hcmdpbkJvdHRvbSIsImJhY2tncm91bmQiLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJ0eXBlIiwiZm9udFdlaWdodCIsIm1hcmdpbkxlZnQiLCJjb2xvciIsIndoaXRlU3BhY2UiLCJ6SW5kZXgiLCJtYXJnaW5SaWdodCIsInNyYyIsIm1hcmdpbiIsInBvc2l0aW9uIl0sIm1hcHBpbmdzIjoiOztBQUNBLElBQUlBLE9BQVEsWUFBVzs7QUFFckI7QUFDQSxNQUFJQyxRQUFRLElBQVo7QUFDQSxNQUFJQyxTQUFTLElBQWI7QUFDQSxNQUFJQyxZQUFZLENBQWhCOztBQUVBLE1BQUlDLFlBQVksSUFBaEI7QUFDQSxNQUFJQyxPQUFPLElBQVg7QUFDQSxNQUFJQyxTQUFTLENBQWIsQ0FBaUIsSUFBSUMsT0FBTyxDQUFYOztBQUduQjtBQUNFLE1BQUlDLGNBQWMsRUFBbEI7O0FBR0EsTUFBSUMsUUFBUSxDQUFaO0FBQ0EsTUFBSUMsbUJBQW1CLENBQXZCOztBQUVGO0FBQ0UsTUFBSUMsV0FBVyxLQUFmOztBQUVGO0FBQ0UsTUFBSUMsY0FBYSxJQUFqQjtBQUNBO0FBQ0EsTUFBSUMsZ0JBQWMsSUFBbEI7QUFDQSxNQUFJQyxjQUFjLElBQWxCOztBQUVBLE1BQUlDLFVBQVEsSUFBWjs7QUFFQSxNQUFJQyxPQUFLLElBQVQ7QUFDQSxNQUFJQyxZQUFVLElBQWQ7QUFDQSxNQUFJQyxXQUFTLElBQWI7QUFDQSxNQUFJQyxhQUFXLElBQWY7O0FBR0EsTUFBSUMsV0FBSjs7QUFHQTtBQUNBLE1BQUlDLGFBQWEsRUFBakI7O0FBRUFBLGFBQVcsYUFBWCxJQUE0QixVQUFTQyxrQkFBVCxFQUE0QkMsZ0JBQTVCLEVBQTZDQyxrQkFBN0MsRUFBZ0VDLGdCQUFoRSxFQUFrRjs7QUFFNUcsUUFBSUMsZ0JBQWdCSixrQkFBcEI7QUFDQSxRQUFJSyxjQUFjSixnQkFBbEI7QUFDQTs7QUFFQTtBQUNBbEIsV0FBT3VCLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUDtBQUNBeEIsU0FBS2UsRUFBTCxHQUFVLFdBQVdVLGdCQUFyQjtBQUNBVixTQUFLZixLQUFLZSxFQUFWOztBQUVBRCxpQkFBYVMsU0FB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VyxnQkFBWW1CLEtBQVosQ0FBa0I3QixNQUFsQixHQUEyQixLQUFHLElBQTlCO0FBQ0FVLGdCQUFZbUIsS0FBWixDQUFrQm1ELFFBQWxCLEdBQTZCLFVBQTdCO0FBRUQ7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7QUFjQSxTQUFPN0QsVUFBUDtBQUVELENBOVBVLEVBQVgiLCJmaWxlIjoiY2FyZDIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBDYXJkID0gKGZ1bmN0aW9uKCkge1xuICBcbiAgLy9Qcm9wcmnDqXTDqSBkZSBzdHlsZVxuICBsZXQgd2lkdGggPSAnNiUnIDtcbiAgbGV0IGhlaWdodCA9ICc2JSc7XG4gIGxldCBlbG1PZmZzZXQgPSAwO1xuICBcbiAgbGV0IGNsYXNzTmFtZSA9IG51bGwgO1xuICB2YXIgaURpdiA9IG51bGw7XG4gIGxldCBzdGFydFAgPSAwOyAgdmFyIGVuZFAgPSAwO1xuXG5cbi8vVmFsZXVyIHBvdXIgam91ZXIgbGEgY2FydGVcbiAgbGV0IGRlc2NyaXB0aW9uID0gJyc7XG4gIFxuICBcbiAgbGV0IHNwZWVkID0gMTtcbiAgbGV0IHJlcGV0aXRpb25OdW1iZXIgPSAxO1xuXG4vL2NsaXF1ZSBvdSBub25cbiAgbGV0IGV4cGVuZGVkID0gZmFsc2U7XG5cbi8vZGl2IHVzZWRcbiAgbGV0IGRpdkluZm9DYXJkID1udWxsO1xuICAvL2xldCBzZWxlY3RTcGVlZD1udWxsO1xuICBsZXQgc2VsZWN0TmJSZXBldD1udWxsO1xuICBsZXQgc2VsZWN0U3BlZWQgPSBudWxsIDtcbiAgXG4gIGxldCBpbWdTbG93PW51bGw7XG4gIFxuICBsZXQgY2FyZD1udWxsO1xuICBsZXQgYm94T2JqZWN0PW51bGw7XG4gIGxldCBpbWdSZXBldD1udWxsO1xuICBsZXQgZGl2U2VnbWVudD1udWxsO1xuICBcbiAgXG4gIGxldCBpZDtcbiAgXG4gIFxuICAvLyBQVUJMSUMgT0JKRUNUXG4gIHZhciBvYmplY3RDYXJkID0geyAgfTtcbiAgXG4gIG9iamVjdENhcmRbJ2NvbnN0cnVjdG9yJ10gPSBmdW5jdGlvbihzdGFydER1cmF0aW9uUGFyYW0sZW5kRHVyYXRpb25QYXJhbSxzdGFydFBvc2l0aW9uUGFyYW0sZW5kUG9zaXRpb25QYXJhbSkge1xuICAgIFxuICAgIGxldCBzdGFydER1cmF0aW9uID0gc3RhcnREdXJhdGlvblBhcmFtO1xuICAgIGxldCBlbmREdXJhdGlvbiA9IGVuZER1cmF0aW9uUGFyYW07XG4gICAgLy9kaXYgcG91ciBsZSBzZWdtZW50IGNhcnRlIGVudGllclxuICAgIFxuICAgIC8vY2V0dGUgZGl2IGVzdCBsYSBwcmluY2lwYWxlLCBjZWxsZSBxdWkgY29udGllbiB0IGZyYWdtZW50ICsgYmFyZEZyYWdtZW50XG4gICAgaURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGlEaXYuaWQgPSAnaWRDYXJkJysgIGNyZWF0ZVVuaXF1ZUlkKCk7XG4gICAgaWQgPSBpRGl2LmlkO1xuICAgIFxuICAgIGRpdlNlZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgIGRpdlNlZ21lbnQuY2xhc3NOYW1lID0nc2VnbWVudCc7XG4gICAgZGl2U2VnbWVudC5zdHlsZS5oZWlnaHQgPSAxNStcInB4XCI7XG4gICAgaURpdi5jbGFzc05hbWUgPSAncmVzaXphYmxlU2VnbWVudCc7XG4gICAgXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RpdkNhcmRCb2FyZCcpLmluc2VydEJlZm9yZShpRGl2LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGl2Q2FyZEJvYXJkJykuZmlyc3RDaGlsZCk7XG4gICAgXG4gICAgXG4gICAgaURpdi5zdHlsZS5sZWZ0ID0gc3RhcnRQb3NpdGlvblBhcmFtICsgXCJweFwiO1xuICAgIC8vdGFpbGxlIGRlIGxhIGNhcnRlIGluaXRpYWxlXG4gICAgd2lkdGggPSBpRGl2LnN0eWxlLndpZHRoID0gcGFyc2VJbnQoZW5kUG9zaXRpb25QYXJhbSwxMCkgLSBwYXJzZUludChzdGFydFBvc2l0aW9uUGFyYW0sMTApK1wicHhcIjtcbiAgICBkaXZTZWdtZW50LnN0eWxlLndpZHRoID0gcGFyc2VJbnQoZW5kUG9zaXRpb25QYXJhbSwxMCkgLSBwYXJzZUludChzdGFydFBvc2l0aW9uUGFyYW0sMTApK1wicHhcIjtcbiAgICBkaXZTZWdtZW50LnN0eWxlLnRvcCA9IDArXCJweFwiO1xuICAgIFxuICAgIC8vam91ZSBsZSBzZWdtZW50IHF1aSB2aWVudCBkZSBzZSBjcmVlclxuICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gc3RhcnREdXJhdGlvblBhcmFtO1xuICAgIFxuICAgIGluaXRHVUlDYXJkKGlEaXYsc3RhcnRQb3NpdGlvblBhcmFtLGVuZFBvc2l0aW9uUGFyYW0pO1xuICAgIGluaXRMaXN0ZW5lckNhcmQoZGl2U2VnbWVudCxzdGFydER1cmF0aW9uLGVuZER1cmF0aW9uLCApO1xuICAgIFxuICAgIHZhciBjYXJkID0geyBkZXNjcmlwdGlvbiwgd2lkdGgsaGVpZ2h0LGlEaXYsaWQsIHNlbGVjdFNwZWVkLCBzZWxlY3ROYlJlcGV0IH07XG4gICAgXG4gICAgcmV0dXJuIGNhcmQ7XG4gIH07XG4gIFxuICBcbiAgXG4gIFxuICBmdW5jdGlvbiBpbml0R1VJQ2FyZChpRGl2KXtcbiAgICBcbiAgICBib3hPYmplY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpRGl2LmlkKTtcbiAgICBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAvL1VJIGJ1dHRvbiBzcGVlZCBhbmQgc2xvd1xuICAgIGltZ1JlcGV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICBpbWdTbG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICBcbiAgICBzZWxlY3RTcGVlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XG4gICAgc2VsZWN0TmJSZXBldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XG4gICAgXG4gICAgZGl2SW5mb0NhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgIGRpdkluZm9DYXJkLmNsYXNzTmFtZSA9IFwiaW5mb0NhcmRcIjtcbiAgICBcbiAgICBcbiAgICBcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbigpe1xuICAgICAgZGVzY3JpcHRpb24gPSBjYXJkLnZhbHVlO1xuICAgIH0pO1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrPTEpIHtcbiAgICAgIHNlbGVjdFNwZWVkLmFkZCggbmV3IE9wdGlvbiggaS8xMCArXCJcIiApKTtcbiAgICB9XG4gICAgc2VsZWN0U3BlZWQuc2VsZWN0ZWRJbmRleCA9IDEwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xuICAgICAgc2VsZWN0TmJSZXBldC5vcHRpb25zLmFkZCggbmV3IE9wdGlvbihpK1wiXCIpICk7XG4gICAgfVxuICAgIHNlbGVjdE5iUmVwZXQuc2VsZWN0ZWRJbmRleCA9IDE7XG4gICAgXG4gICAgLypcbiAgICBzZWxlY3ROYlJlcGV0LmFkZEV2ZW50TGlzdGVuZXIoXCJvbmNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBcbiAgICAgIHJlcGV0aXRpb25OdW1iZXIgPSBzZWxlY3ROYlJlcGV0Lm9wdGlvbnNbc2VsZWN0TmJSZXBldC5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0ZWQgOiBcIiArIHJlcGV0aXRpb25OdW1iZXIpO1xuICAgIH0pOyovXG4gICAgXG4gICAgLy9EaXYgY29udGVuYW50IGxlcyBpbmZvIGR1IGRlc3N1cyAodGFpbGxlIGRlIGRpdiBpbnZhcmlhYmxlXG4gICAgXG4gICAgXG4gICAgZGl2SW5mb0NhcmQuYXBwZW5kQ2hpbGQoIGltZ1Nsb3cpO1xuICAgIGRpdkluZm9DYXJkLmFwcGVuZENoaWxkKCBzZWxlY3RTcGVlZCk7XG4gICAgZGl2SW5mb0NhcmQuYXBwZW5kQ2hpbGQoIGltZ1JlcGV0KTtcbiAgICBkaXZJbmZvQ2FyZC5hcHBlbmRDaGlsZCggc2VsZWN0TmJSZXBldCk7XG4gICAgYm94T2JqZWN0LmFwcGVuZENoaWxkKCBjYXJkKTtcbiAgICBib3hPYmplY3QuYXBwZW5kQ2hpbGQoZGl2U2VnbWVudCk7XG4gICAgYm94T2JqZWN0LmFwcGVuZENoaWxkKCBkaXZJbmZvQ2FyZCk7XG4gICAgXG4gICAgYXBwbHlTdHlsZSgpO1xuICAgIFxuICB9XG5cbi8vbGFuY2UgbGUgc2VnbWVudCBsb3JzIGQndW4gY2xpY2sgc3VyIGxhIGNhcnRlLCBhIGwnZW5kcm9pdCwgbmIgZGUgcmVwZXQgZXQgdml0ZXNzZVxuICBmdW5jdGlvbiBpbml0TGlzdGVuZXJDYXJkKGlEaXYsc3RhcnRELGVuZEQpe1xuICAgIFxuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc29sZS5sb2coXCJyZXBldGl0aW9uTnVtYmVyIDogXCIgICsgcmVwZXRpdGlvbk51bWJlcik7XG4gICAgICBcbiAgICAgIGxldCBuYlJlcGV0ID0gc2VsZWN0TmJSZXBldC5vcHRpb25zW3NlbGVjdE5iUmVwZXQuc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICBsZXQgc3BlZWRSYXRlID0gc2VsZWN0U3BlZWQub3B0aW9uc1tzZWxlY3RTcGVlZC5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgIFxuICAgICAgcmVwZXRpdGlvbk51bWJlciA9IG5iUmVwZXQ7XG4gICAgICBzcGVlZCA9IHNwZWVkUmF0ZTtcbiAgICAgIHJlcGV0UGFydE9mVmlkZW8oc3RhcnRELCBlbmRELCBuYlJlcGV0LCBzcGVlZFJhdGUpO1xuICAgICAgXG4gICAgICBcbiAgICB9LGZhbHNlKTtcbiAgICBcbiAgICBpRGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgXG4gICAgICBjb25zb2xlLmxvZyAoJ2lEaXYuaWQgOiAnKyB0aGlzLmlkKTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coXCJyZXBldGl0aW9uTnVtYmVyIDogXCIgICsgcmVwZXRpdGlvbk51bWJlcik7XG4gICAgICBsZXQgbmJSZXBldCA9IHNlbGVjdE5iUmVwZXQub3B0aW9uc1tzZWxlY3ROYlJlcGV0LnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgbGV0IHNwZWVkUmF0ZSA9IHNlbGVjdFNwZWVkLm9wdGlvbnNbc2VsZWN0U3BlZWQuc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICBcbiAgICAgIC8qY29uc29sZS5sb2coXCJzZWxlY3ROYlJlcGV0Lm9wdGlvbnNbc2VsZWN0TmJSZXBldC5zZWxlY3RlZEluZGV4XS52YWx1ZSA6IFwiICsgc2VsZWN0TmJSZXBldC5vcHRpb25zW3NlbGVjdE5iUmVwZXQuc2VsZWN0ZWRJbmRleF0udmFsdWUpO1xuICAgICAgY29uc29sZS5sb2coXCJzZWxlY3ROYlJlcGV0Lm9wdGlvbnNbc2VsZWN0TmJSZXBldC5zZWxlY3RlZEluZGV4XS52YWx1ZSA6IFwiICsgc2VsZWN0TmJSZXBldC5vcHRpb25zW3NlbGVjdE5iUmVwZXQuc2VsZWN0ZWRJbmRleF0udmFsdWUpO1xuICAgICAgKi9cbiAgICAgIFxuICAgICAgcmVwZXRpdGlvbk51bWJlciA9IG5iUmVwZXQ7XG4gICAgICBzcGVlZCA9IHNwZWVkUmF0ZTtcbiAgICAgIFxuICAgICAgcmVwZXRQYXJ0T2ZWaWRlbyhzdGFydEQsIGVuZEQsIG5iUmVwZXQsIHNwZWVkUmF0ZSk7XG4gICAgICBcbiAgICB9LGZhbHNlKTtcbiAgfVxuICBcbiAgXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaXF1ZUlkKCl7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBjb21wb25lbnRzID0gW1xuICAgICAgZGF0ZS5nZXRNb250aCgpLFxuICAgICAgZGF0ZS5nZXREYXRlKCksXG4gICAgICBkYXRlLmdldEhvdXJzKCksXG4gICAgICBkYXRlLmdldE1pbnV0ZXMoKSxcbiAgICAgIGRhdGUuZ2V0U2Vjb25kcygpLFxuICAgICAgZGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuICAgIF07XG4gICAgcmV0dXJuIGNvbXBvbmVudHMuam9pbihcIlwiKTtcbiAgfVxuICBcbiAgXG4gIGZ1bmN0aW9uIGFwcGx5U3R5bGUoKXtcbiAgICBcbiAgICBjYXJkLnN0eWxlLm1hcmdpbkJvdHRvbSA9IDYrXCJweFwiO1xuICAgIGNhcmQuc3R5bGUuYmFja2dyb3VuZCA9IFwidHJhbnNwYXJlbnRcIjtcbiAgICBjYXJkLnN0eWxlLmJvcmRlciA9ICdub25lJztcbiAgICBjYXJkLnN0eWxlLmJvcmRlclJhZGl1cz0gMTArXCJweFwiO1xuICAgIGNhcmQudHlwZSA9IFwidGV4dFwiO1xuICAgIC8vY2FyZC5zdHlsZS53aWR0aD0gKHBhcnNlSW50KGlEaXYuc3R5bGUud2lkdGgpIC0gMikgK1wicHhcIjtcbiAgICBjYXJkLnN0eWxlLndpZHRoID0gMjAwICtcInB4XCI7XG4gICAgY2FyZC5zdHlsZS5mb250V2VpZ2h0ID0gJ2JvbGQnO1xuICAgIGNhcmQuc3R5bGUubWFyZ2luTGVmdCA9IDcgK1wicHhcIjtcbiAgICBjYXJkLnN0eWxlLmNvbG9yID0gXCIjZmZmZmZmXCI7XG4gICAgY2FyZC5zdHlsZS53aGl0ZVNwYWNlID0gJ25vcm1hbCc7XG4gICAgY2FyZC5zdHlsZS56SW5kZXggPSBcIjEwXCI7XG4gICAgY2FyZC5zdHlsZS5sZWZ0ID0gXCIycHhcIjtcbiAgICBjYXJkLnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgXG4gICAgZGl2U2VnbWVudC5zdHlsZS56SW5kZXggPSBcIjFcIjtcbiAgICBkaXZTZWdtZW50LnN0eWxlLmxlZnQgPSBcIjBcIjtcbiAgICBkaXZTZWdtZW50LnN0eWxlLnRvcCA9IFwiMFwiO1xuICAgIFxuICAgIGJveE9iamVjdC5zdHlsZS5tYXJnaW5SaWdodCA9IDMrXCJweFwiO1xuICAgIGJveE9iamVjdC5zdHlsZS5tYXJnaW5Cb3R0b20gPSA1MCtcInB4XCI7XG4gICAgXG4gICAgaW1nU2xvdy5zcmMgPSBcIi9tZWRpYS93b3Jrc2hvcDIvY2FyZC9zbG93LnBuZ1wiO1xuICAgIGltZ1Nsb3cuc3R5bGUud2lkdGggPSAyMCtcInB4XCI7XG4gICAgaW1nU2xvdy5zdHlsZS5oZWlnaHQgPSAyMCtcInB4XCI7XG4gICAgLy9pbWdTbG93LnN0eWxlLm1hcmdpbiA9IDEwK1wicHhcIjtcbiAgICBcbiAgICBcbiAgICBpbWdSZXBldC5zcmMgPSBcIi9tZWRpYS93b3Jrc2hvcDIvY2FyZC9yZXBldC5wbmdcIjtcbiAgICBpbWdSZXBldC5zdHlsZS53aWR0aCA9IDE1K1wicHhcIjtcbiAgICBpbWdSZXBldC5zdHlsZS5oZWlnaHQgPSAxNStcInB4XCI7XG4gICAgXG4gICAgXG4gICAgc2VsZWN0U3BlZWQuc3R5bGUubWFyZ2luID0gMTArXCJweFwiO1xuICAgIHNlbGVjdFNwZWVkLnN0eWxlLm1hcmdpblJpZ2h0ID0gMjAgK1wicHhcIjtcbiAgICBzZWxlY3RTcGVlZC5zdHlsZS5tYXJnaW5MZWZ0ID0gNSArXCJweFwiO1xuICAgIHNlbGVjdFNwZWVkLnN0eWxlLmJhY2tncm91bmQgPSBcIndoaXRlXCI7XG4gICAgXG4gICAgXG4gICAgXG4gICAgc2VsZWN0TmJSZXBldC5zdHlsZS5tYXJnaW4gPSAxMCtcInB4XCI7XG4gICAgc2VsZWN0TmJSZXBldC5zdHlsZS5tYXJnaW5SaWdodCA9IDIwICtcInB4XCI7XG4gICAgc2VsZWN0TmJSZXBldC5zdHlsZS5tYXJnaW5MZWZ0ID0gNSArXCJweFwiO1xuICAgIHNlbGVjdE5iUmVwZXQuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgXG4gICAgXG4gICAgXG4gICAgZGl2SW5mb0NhcmQuc3R5bGUud2lkdGggPSAxNTArXCJweFwiO1xuICAgIGRpdkluZm9DYXJkLnN0eWxlLmhlaWdodCA9IDEwK1wicHhcIjtcbiAgICBkaXZJbmZvQ2FyZC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBcbiAgfVxuICBcbiAgLypcbiAgb2JqZWN0Q2FyZFsncGxheUNhcmQnXSA9ICBmdW5jdGlvbihzdGFydEQsZW5kRCl7XG4gICAgY29uc29sZS5sb2coXCJkb2RvXCIpO1xuICAgIFxuICAgICAgY29uc29sZS5sb2coXCJyZXBldGl0aW9uTnVtYmVyIDogXCIgICsgcmVwZXRpdGlvbk51bWJlcik7XG4gICAgICBsZXQgbmJSZXBldCA9IHNlbGVjdE5iUmVwZXQub3B0aW9uc1tzZWxlY3ROYlJlcGV0LnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgbGV0IHNwZWVkUmF0ZSA9IHNlbGVjdFNwZWVkLm9wdGlvbnNbc2VsZWN0U3BlZWQuc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICByZXBldGl0aW9uTnVtYmVyID0gbmJSZXBldDtcbiAgICAgIHNwZWVkID0gc3BlZWRSYXRlO1xuICAgICAgcmVwZXRQYXJ0T2ZWaWRlbyhzdGFydEQsIGVuZEQsIG5iUmVwZXQsIHNwZWVkUmF0ZSk7XG4gICAgXG4gIH07Ki9cbiAgXG4gIFxuICByZXR1cm4gb2JqZWN0Q2FyZDtcbiAgXG59KSgpO1xuIl19