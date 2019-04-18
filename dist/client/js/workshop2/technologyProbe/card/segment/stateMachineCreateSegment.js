"use strict";

//Graphical object
var video = document.getElementById("videoEAT");
var wrapperCommandAndRange = document.getElementById("wrapperCommandAndRangeid");
var knobMin = document.getElementById("range-slider_handle-min");
var rangeSliderTrack = document.getElementById("rangeSliderTrack");
var knobMax = document.getElementById("range-slider_handle-max");
var wrapperRangerSlider = document.getElementById("range-slider-wrapper");

//Option for the longpress and the speed of the video
var speedrate = 1;
var longPressDelay = "500";

var WIDTH_KNOB = 30;

//State for the creation of segment by Drag and drop
var StateDrag = {
  IDLE: 0,
  DOWN: 1,
  DRAG: 2,
  LONGPRESS: 3
};
var state = StateDrag.IDLE;

//Graphical object of feedback
var segmentFeedback = {
  width: "",
  startPostion: "",
  endPosition: "",
  startDurationVideo: "",
  endDurationVideo: "",
  displayed: false,
  divGraphicalObject: document.getElementById("segmentMinMax")
};

if (!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {

  //Mouse
  knobMin.addEventListener("mouseup", function (e) {
    knobMinUpCallback(e);
  }, {
    passive: true
  });
  knobMin.addEventListener("mousedown", function (e) {
    knobMinClick(e);
  }, {
    passive: true
  });
  knobMin.addEventListener("mousemove", function (e) {
    knobMinMove(e);
  }, {
    passive: true
  });
  rangeSliderTrack.addEventListener("mousedown", function (e) {
    ranglerSliderTrackClick(e);
  }, {
    passive: true
  });
  rangeSliderTrack.addEventListener("mouseUp", function (e) {
    rangeSliderTrackEndCallback(e);
  }, {
    passive: true
  });
  rangeSliderTrack.addEventListener("mousemove", function (e) {
    knobMinMove(e);
  }, {
    passive: true
  });

  wrapperRangerSlider.addEventListener("mousemove", function (e) {
    knobMinMove(e);
  }, true);

  wrapperRangerSlider.addEventListener("mouseup", function (e) {
    rangeSliderTrackEndCallback(e);
  }, true);
} else {
  //Touch
  knobMin.addEventListener("touchstart", function (e) {
    knobMinClick(e);
  }, {
    passive: true
  });
  knobMin.addEventListener("touchmove", function (e) {
    knobMinMove(e);
  }, {
    passive: true
  });
  knobMin.addEventListener("touchend", function (e) {
    knobMinUpCallback(e);
  }, {
    passive: true
  });
  rangeSliderTrack.addEventListener("touchstart", function (e) {
    ranglerSliderTrackClick(e);
  }, {
    passive: true
  });
  rangeSliderTrack.addEventListener("touchend", function (e) {
    rangeSliderTrackEndCallback(e);
  }, {
    passive: true
  });
  video.addEventListener("touchmove", function (e) {
    videoTouchMoveCallback(e);
  }, {
    passive: true
  });
}

/*window.addEventListener("mouseup", function(e){
  rangeSliderTrackEndCallback(e);
}, false);
window.addEventListener("mousemove", function(e){
  knobMinMove(e);
},true );*/

/*-----MOUSE LONG PRESS-------*/

knobMin.setAttribute("data-long-press-delay", longPressDelay);
knobMin.addEventListener('long-press', function (e) {
  // console.log('knobMin.addEventListener(longpress');
  pause();
  longpressCreateSegmentCallback(e);
});
rangeSliderTrack.addEventListener("long-press", function (e) {
  // console.log('rangeSliderTrack.addEventListener(longpress');

  pause();
  longpressCreateSegmentCallback(e);
}, false);

/*Callback function*/
var longpressCreateSegmentCallback = function longpressCreateSegmentCallback(e) {
  e.preventDefault();
  //console.log('state : ' + state +'', 'background: #222; color: #bada55');

  switch (state) {
    case StateDrag.DOWN:
      {
        state = StateDrag.LONGPRESS;
        //pause();
        startCreateSegment(e, video.currentTime);
        break;
      }

  }
  //event.preventDefault();
};

var videoTouchMoveCallback = function videoTouchMoveCallback(e) {
  switch (state) {
    case StateDrag.IDLE:
      {
        state = StateDrag.DRAG;
        break;
      }
  }
};

var ranglerSliderTrackClick = function ranglerSliderTrackClick(e) {
  //  console.log("ranglerSliderTrackClick state : " + state);
  // pause();
  switch (state) {
    case StateDrag.IDLE:
      {
        state = StateDrag.DOWN;
        clearAllTimer();
        updateKnobAndVideoWrapper(e);
        feedbackOnSliderVideo(false);
        break;
      }
  }
  //console.log("function - ranglerSliderTrackClick appel play l147 statemachine ");
  play();
};

var knobMinUpCallback = function knobMinUpCallback(e) {
  //console.log("***knobMinUpCallback *** "+ state);
  switch (state) {
    case StateDrag.IDLE:
      {
        state = StateDrag.IDLE;
        //console.log("function - knobMinUpCallback appel play ");
        //play();
        break;
      }
    case StateDrag.LONGPRESS:
      {
        state = StateDrag.IDLE;
        updateKnobAndVideoWrapper(e);
        stopCreateSegment(e, video.currentTime);
        //console.log("function - knobMinUpCallback appel pause l164 statemachine ");
        play();
        break;
      }
    case StateDrag.DRAG:
      {
        state = StateDrag.IDLE;
        updateKnobAndVideoWrapper(e);
        //console.log("function - knobMinUpCallback appel pause l165 statemachine ");
        pause();
        break;
      }
    case StateDrag.DOWN:
      {
        state = StateDrag.IDLE;
        updateKnobAndVideoWrapper(e);
        //console.log("function - knobMinUpCallback appel pause l172 statemachine ");
        pause();
        break;
      }
  }

  //event.preventDefault();
};

//Create Segment
function startCreateSegment(e, startSegment) {
  console.log("BBB " + knobMin.style.left);

  if (parseInt(knobMin.style.left, 10) < 0) {
    knobMax.style.left = WIDTH_KNOB / 2 + "px";
  } else {
    knobMax.style.left = knobMin.style.left;
  }
  //else if(parseInt(knobMin.style.left,10) > WIDTH_RANGE_SLIDER_TRACK - WIDTH_KNOB +1) {
  //
  //     }

  knobMax.style.position = "absolute";
  //state  StateDrag.LONGPRESS;
  knobMin.style.background = '#213F8D';
  knobMax.style.visibility = "visible";
  updateSegmentFeedback();
}

function stopCreateSegment(e, stopSegment) {
  var timerLifeSegment = window.setTimeout(function () {
    knobMax.style.visibility = "hidden";
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
    knobMin.style.background = '#ffffff';
    //createCard();
    window.clearTimeout(timerLifeSegment);
    //console.log("AAA : " + parseInt(knobMax.style.left,10));


    var startP = parseInt(knobMax.style.left, 10) + WIDTH_MID_KNOB_MIN / 2;
    var endP = parseInt(knobMin.style.left, 10) + WIDTH_KNOB;

    // cardManager.execute(new CreateNewCardCommand(startP, endP));
    if (startP < 0) {
      startP = 0;
    }

    Player.createNewCard(startP, endP);

    play();
  }, 700);
}

//Update the feedback of the creation of a segment after a long press
function updateSegmentFeedback() {

  if (parseInt(knobMin.style.left, 10) > parseInt(knobMax.style.left, 10)) {
    segmentFeedback.divGraphicalObject.style.marginLeft = knobMax.style.left;
    segmentFeedback.divGraphicalObject.style.width = Math.abs(parseInt(knobMin.style.left, 10) - parseInt(knobMax.style.left, 10)) + WIDTH_KNOB + "px";
  } else {
    segmentFeedback.divGraphicalObject.style.marginLeft = knobMin.style.left;
    segmentFeedback.divGraphicalObject.style.width = Math.abs(parseInt(knobMin.style.left, 10) - parseInt(knobMax.style.left, 10)) + "px";
  }
  segmentFeedback.divGraphicalObject.style.visibility = "visible";

  if (parseInt(segmentFeedback.divGraphicalObject.style.marginLeft, 10) < 0) {
    //the case if the knob is in the extremun of the loader.
    segmentFeedback.divGraphicalObject.style.marginLeft = " 0 px";
  }
}

/*

//start position on the slider and end position on the slider
function videoToSlider(startDurationVideo, endDurationVideo) {
  var startP = Math.round(((startDurationVideo * NUMBER_OF_TICK) / video.duration) - rangeSliderTrack.offsetLeft);
  var endP = Math.round(((endDurationVideo * NUMBER_OF_TICK) / video.duration) - rangeSliderTrack.offsetLeft);
  return {
    startPosition: startP,
    endPosition: endP
  };
}
*/

var knobMinMove = function knobMinMove(e) {
  switch (state) {
    case StateDrag.DOWN:
      {
        state = StateDrag.DRAG;
        //console.log(" draging etat down");
        updateKnobAndVideoWrapper(e);
        break;
      }
    case StateDrag.DRAG:
      {
        state = StateDrag.DRAG;
        updateKnobAndVideoWrapper(e);
        //console.log(" draging etat drag");
        break;
      }
    case StateDrag.LONGPRESS:
      {
        state = StateDrag.LONGPRESS;
        //console.log("state longpress with mouse move");
        updateKnobAndVideoWrapper(e);
        updateSegmentFeedback();
        break;
      }
  }
};

var knobMinClick = function knobMinClick(e) {
  //console.log("function - knobMinClick" );
  pause();
  //Update video position
  switch (state) {
    case StateDrag.IDLE:
      {
        state = StateDrag.DOWN;
        clearAllTimer();
        break;
      }
  }
  //e.preventDefault();
};

var rangeSliderTrackEndCallback = function rangeSliderTrackEndCallback(e) {
  //console.log("");
  //console.log("mouse up , etat : " + state);
  // console.log("rangeSliderTrackEndCallback : " + state);
  switch (state) {
    case StateDrag.DOWN:
      {
        state = StateDrag.IDLE;
        break;
      }
    case StateDrag.DRAG:
      {
        state = StateDrag.IDLE;
        updateKnobAndVideoWrapper(e);
        // console.log("function - rangeSliderTrackEndCallback l285 state machine");
        pause();
        break;
      }
    case StateDrag.LONGPRESS:
      {
        state = StateDrag.IDLE;
        updateKnobAndVideoWrapper(e);
        stopCreateSegment(e, video.currentTime);
        break;
      }
  }
  //event.preventDefault();
};

var knobMinMouseLeaveCallback = function knobMinMouseLeaveCallback(e) {
  switch (state) {
    case StateDrag.DOWN:
      {
        state = StateDrag.DRAG;
        break;
      }
    case StateDrag.DRAG:
      {
        state = StateDrag.DRAG;
        updateKnobAndVideoWrapper(e);
        break;
      }
    case StateDrag.LONGPRESS:
      {
        state = StateDrag.IDLE;
        updateKnobAndVideoWrapper(e);
        stopCreateSegment(e, video.currentTime);
        break;
      }

  }
  //event.preventDefault();
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRlTWFjaGluZUNyZWF0ZVNlZ21lbnQuanMiXSwibmFtZXMiOlsidmlkZW8iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwid3JhcHBlckNvbW1hbmRBbmRSYW5nZSIsImtub2JNaW4iLCJyYW5nZVNsaWRlclRyYWNrIiwia25vYk1heCIsIndyYXBwZXJSYW5nZXJTbGlkZXIiLCJzcGVlZHJhdGUiLCJsb25nUHJlc3NEZWxheSIsIldJRFRIX0tOT0IiLCJTdGF0ZURyYWciLCJJRExFIiwiRE9XTiIsIkRSQUciLCJMT05HUFJFU1MiLCJzdGF0ZSIsInNlZ21lbnRGZWVkYmFjayIsIndpZHRoIiwic3RhcnRQb3N0aW9uIiwiZW5kUG9zaXRpb24iLCJzdGFydER1cmF0aW9uVmlkZW8iLCJlbmREdXJhdGlvblZpZGVvIiwiZGlzcGxheWVkIiwiZGl2R3JhcGhpY2FsT2JqZWN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwibWF0Y2giLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImtub2JNaW5VcENhbGxiYWNrIiwicGFzc2l2ZSIsImtub2JNaW5DbGljayIsImtub2JNaW5Nb3ZlIiwicmFuZ2xlclNsaWRlclRyYWNrQ2xpY2siLCJyYW5nZVNsaWRlclRyYWNrRW5kQ2FsbGJhY2siLCJ2aWRlb1RvdWNoTW92ZUNhbGxiYWNrIiwic2V0QXR0cmlidXRlIiwicGF1c2UiLCJsb25ncHJlc3NDcmVhdGVTZWdtZW50Q2FsbGJhY2siLCJwcmV2ZW50RGVmYXVsdCIsInN0YXJ0Q3JlYXRlU2VnbWVudCIsImN1cnJlbnRUaW1lIiwiY2xlYXJBbGxUaW1lciIsInVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIiLCJmZWVkYmFja09uU2xpZGVyVmlkZW8iLCJwbGF5Iiwic3RvcENyZWF0ZVNlZ21lbnQiLCJzdGFydFNlZ21lbnQiLCJjb25zb2xlIiwibG9nIiwic3R5bGUiLCJsZWZ0IiwicGFyc2VJbnQiLCJwb3NpdGlvbiIsImJhY2tncm91bmQiLCJ2aXNpYmlsaXR5IiwidXBkYXRlU2VnbWVudEZlZWRiYWNrIiwic3RvcFNlZ21lbnQiLCJ0aW1lckxpZmVTZWdtZW50Iiwid2luZG93Iiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInN0YXJ0UCIsIldJRFRIX01JRF9LTk9CX01JTiIsImVuZFAiLCJQbGF5ZXIiLCJjcmVhdGVOZXdDYXJkIiwibWFyZ2luTGVmdCIsIk1hdGgiLCJhYnMiLCJrbm9iTWluTW91c2VMZWF2ZUNhbGxiYWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0EsSUFBSUEsUUFBUUMsU0FBU0MsY0FBVCxDQUF3QixVQUF4QixDQUFaO0FBQ0EsSUFBSUMseUJBQXlCRixTQUFTQyxjQUFULENBQXdCLDBCQUF4QixDQUE3QjtBQUNBLElBQUlFLFVBQVVILFNBQVNDLGNBQVQsQ0FBd0IseUJBQXhCLENBQWQ7QUFDQSxJQUFJRyxtQkFBbUJKLFNBQVNDLGNBQVQsQ0FBd0Isa0JBQXhCLENBQXZCO0FBQ0EsSUFBSUksVUFBVUwsU0FBU0MsY0FBVCxDQUF3Qix5QkFBeEIsQ0FBZDtBQUNBLElBQUlLLHNCQUFzQk4sU0FBU0MsY0FBVCxDQUF3QixzQkFBeEIsQ0FBMUI7O0FBR0E7QUFDQSxJQUFJTSxZQUFZLENBQWhCO0FBQ0EsSUFBSUMsaUJBQWlCLEtBQXJCOztBQUVBLElBQUlDLGFBQWEsRUFBakI7O0FBRUE7QUFDQSxJQUFJQyxZQUFZO0FBQ2RDLFFBQU0sQ0FEUTtBQUVkQyxRQUFNLENBRlE7QUFHZEMsUUFBTSxDQUhRO0FBSWRDLGFBQVc7QUFKRyxDQUFoQjtBQU1BLElBQUlDLFFBQVFMLFVBQVVDLElBQXRCOztBQUVBO0FBQ0EsSUFBSUssa0JBQWtCO0FBQ3BCQyxTQUFPLEVBRGE7QUFFcEJDLGdCQUFjLEVBRk07QUFHcEJDLGVBQWEsRUFITztBQUlwQkMsc0JBQW9CLEVBSkE7QUFLcEJDLG9CQUFrQixFQUxFO0FBTXBCQyxhQUFXLEtBTlM7QUFPcEJDLHNCQUFvQnZCLFNBQVNDLGNBQVQsQ0FBd0IsZUFBeEI7QUFQQSxDQUF0Qjs7QUFVQSxJ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cmVhdGVTZWdtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9HcmFwaGljYWwgb2JqZWN0XG52YXIgdmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpZGVvRUFUXCIpO1xudmFyIHdyYXBwZXJDb21tYW5kQW5kUmFuZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndyYXBwZXJDb21tYW5kQW5kUmFuZ2VpZFwiKTtcbnZhciBrbm9iTWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYW5nZS1zbGlkZXJfaGFuZGxlLW1pblwiKTtcbnZhciByYW5nZVNsaWRlclRyYWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYW5nZVNsaWRlclRyYWNrXCIpO1xudmFyIGtub2JNYXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmdlLXNsaWRlcl9oYW5kbGUtbWF4XCIpO1xudmFyIHdyYXBwZXJSYW5nZXJTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmdlLXNsaWRlci13cmFwcGVyXCIpO1xuXG5cbi8vT3B0aW9uIGZvciB0aGUgbG9uZ3ByZXNzIGFuZCB0aGUgc3BlZWQgb2YgdGhlIHZpZGVvXG52YXIgc3BlZWRyYXRlID0gMTtcbnZhciBsb25nUHJlc3NEZWxheSA9IFwiNTAwXCI7XG5cbnZhciBXSURUSF9LTk9CID0gMzA7XG5cbi8vU3RhdGUgZm9yIHRoZSBjcmVhdGlvbiBvZiBzZWdtZW50IGJ5IERyYWcgYW5kIGRyb3BcbmxldCBTdGF0ZURyYWcgPSB7XG4gIElETEU6IDAsXG4gIERPV046IDEsXG4gIERSQUc6IDIsXG4gIExPTkdQUkVTUzogM1xufTtcbnZhciBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuXG4vL0dyYXBoaWNhbCBvYmplY3Qgb2YgZmVlZGJhY2tcbnZhciBzZWdtZW50RmVlZGJhY2sgPSB7XG4gIHdpZHRoOiBcIlwiLFxuICBzdGFydFBvc3Rpb246IFwiXCIsXG4gIGVuZFBvc2l0aW9uOiBcIlwiLFxuICBzdGFydER1cmF0aW9uVmlkZW86IFwiXCIsXG4gIGVuZER1cmF0aW9uVmlkZW86IFwiXCIsXG4gIGRpc3BsYXllZDogZmFsc2UsXG4gIGRpdkdyYXBoaWNhbE9iamVjdDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWdtZW50TWluTWF4XCIpXG59O1xuXG5pZiAoIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWR8QmxhY2tCZXJyeXxpUGhvbmV8aVBhZHxpUG9kfE9wZXJhIE1pbml8SUVNb2JpbGUvaSkpIHtcbiAgXG4gIC8vTW91c2VcbiAga25vYk1pbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKSB7XG4gICAga25vYk1pblVwQ2FsbGJhY2soZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICBrbm9iTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgIGtub2JNaW5DbGljayhlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIGtub2JNaW4uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbihlKSB7XG4gICAga25vYk1pbk1vdmUoZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICByYW5nZVNsaWRlclRyYWNrLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgIHJhbmdsZXJTbGlkZXJUcmFja0NsaWNrKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgcmFuZ2VTbGlkZXJUcmFjay5hZGRFdmVudExpc3RlbmVyKFwibW91c2VVcFwiLCBmdW5jdGlvbihlKSB7XG4gICAgcmFuZ2VTbGlkZXJUcmFja0VuZENhbGxiYWNrKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgcmFuZ2VTbGlkZXJUcmFjay5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBrbm9iTWluTW92ZShlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIFxuICB3cmFwcGVyUmFuZ2VyU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZSkge1xuICAgIGtub2JNaW5Nb3ZlKGUpO1xuICB9LCB0cnVlKTtcbiAgXG4gIHdyYXBwZXJSYW5nZXJTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oZSkge1xuICAgIHJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayhlKTtcbiAgfSwgdHJ1ZSk7XG4gIFxufSBlbHNlIHtcbiAgLy9Ub3VjaFxuICBrbm9iTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBrbm9iTWluQ2xpY2soZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICBrbm9iTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgZnVuY3Rpb24oZSkge1xuICAgIGtub2JNaW5Nb3ZlKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAga25vYk1pbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgZnVuY3Rpb24oZSkge1xuICAgIGtub2JNaW5VcENhbGxiYWNrKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgcmFuZ2VTbGlkZXJUcmFjay5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBmdW5jdGlvbihlKSB7XG4gICAgcmFuZ2xlclNsaWRlclRyYWNrQ2xpY2soZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICByYW5nZVNsaWRlclRyYWNrLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBmdW5jdGlvbihlKSB7XG4gICAgcmFuZ2VTbGlkZXJUcmFja0VuZENhbGxiYWNrKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgdmlkZW9Ub3VjaE1vdmVDYWxsYmFjayhlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIFxuICBcbiAgXG59XG5cblxuLyp3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oZSl7XG4gIHJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayhlKTtcbn0sIGZhbHNlKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKGUpe1xuICBrbm9iTWluTW92ZShlKTtcbn0sdHJ1ZSApOyovXG5cblxuXG5cbi8qLS0tLS1NT1VTRSBMT05HIFBSRVNTLS0tLS0tLSovXG5cbmtub2JNaW4uc2V0QXR0cmlidXRlKFwiZGF0YS1sb25nLXByZXNzLWRlbGF5XCIsIGxvbmdQcmVzc0RlbGF5KTtcbmtub2JNaW4uYWRkRXZlbnRMaXN0ZW5lcignbG9uZy1wcmVzcycsIGZ1bmN0aW9uKGUpIHtcbiAgLy8gY29uc29sZS5sb2coJ2tub2JNaW4uYWRkRXZlbnRMaXN0ZW5lcihsb25ncHJlc3MnKTtcbiAgcGF1c2UoKTtcbiAgbG9uZ3ByZXNzQ3JlYXRlU2VnbWVudENhbGxiYWNrKGUpO1xufSk7XG5yYW5nZVNsaWRlclRyYWNrLmFkZEV2ZW50TGlzdGVuZXIoXCJsb25nLXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgLy8gY29uc29sZS5sb2coJ3JhbmdlU2xpZGVyVHJhY2suYWRkRXZlbnRMaXN0ZW5lcihsb25ncHJlc3MnKTtcbiAgXG4gIHBhdXNlKCk7XG4gIGxvbmdwcmVzc0NyZWF0ZVNlZ21lbnRDYWxsYmFjayhlKTtcbn0sIGZhbHNlKTtcblxuLypDYWxsYmFjayBmdW5jdGlvbiovXG52YXIgbG9uZ3ByZXNzQ3JlYXRlU2VnbWVudENhbGxiYWNrID0gZnVuY3Rpb24oZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIC8vY29uc29sZS5sb2coJ3N0YXRlIDogJyArIHN0YXRlICsnJywgJ2JhY2tncm91bmQ6ICMyMjI7IGNvbG9yOiAjYmFkYTU1Jyk7XG4gIFxuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuRE9XTjpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5MT05HUFJFU1M7XG4gICAgICAvL3BhdXNlKCk7XG4gICAgICBzdGFydENyZWF0ZVNlZ21lbnQoZSwgdmlkZW8uY3VycmVudFRpbWUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICB9XG4gIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn07XG5cbnZhciB2aWRlb1RvdWNoTW92ZUNhbGxiYWNrID0gZnVuY3Rpb24oZSkge1xuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuSURMRTpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5EUkFHO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59O1xuXG52YXIgcmFuZ2xlclNsaWRlclRyYWNrQ2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gIC8vICBjb25zb2xlLmxvZyhcInJhbmdsZXJTbGlkZXJUcmFja0NsaWNrIHN0YXRlIDogXCIgKyBzdGF0ZSk7XG4gIC8vIHBhdXNlKCk7XG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5JRExFOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRPV047XG4gICAgICBjbGVhckFsbFRpbWVyKCk7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgZmVlZGJhY2tPblNsaWRlclZpZGVvKGZhbHNlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gLSByYW5nbGVyU2xpZGVyVHJhY2tDbGljayBhcHBlbCBwbGF5IGwxNDcgc3RhdGVtYWNoaW5lIFwiKTtcbiAgcGxheSgpO1xufTtcblxudmFyIGtub2JNaW5VcENhbGxiYWNrID0gZnVuY3Rpb24oZSkge1xuICAvL2NvbnNvbGUubG9nKFwiKioqa25vYk1pblVwQ2FsbGJhY2sgKioqIFwiKyBzdGF0ZSk7XG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5JRExFOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gLSBrbm9iTWluVXBDYWxsYmFjayBhcHBlbCBwbGF5IFwiKTtcbiAgICAgIC8vcGxheSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkxPTkdQUkVTUzpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIHN0b3BDcmVhdGVTZWdtZW50KGUsIHZpZGVvLmN1cnJlbnRUaW1lKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJmdW5jdGlvbiAtIGtub2JNaW5VcENhbGxiYWNrIGFwcGVsIHBhdXNlIGwxNjQgc3RhdGVtYWNoaW5lIFwiKTtcbiAgICAgIHBsYXkoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFN0YXRlRHJhZy5EUkFHOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0ga25vYk1pblVwQ2FsbGJhY2sgYXBwZWwgcGF1c2UgbDE2NSBzdGF0ZW1hY2hpbmUgXCIpO1xuICAgICAgcGF1c2UoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFN0YXRlRHJhZy5ET1dOOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0ga25vYk1pblVwQ2FsbGJhY2sgYXBwZWwgcGF1c2UgbDE3MiBzdGF0ZW1hY2hpbmUgXCIpO1xuICAgICAgcGF1c2UoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBcbiAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufTtcblxuXG4vL0NyZWF0ZSBTZWdtZW50XG5mdW5jdGlvbiBzdGFydENyZWF0ZVNlZ21lbnQoZSwgc3RhcnRTZWdtZW50KSB7XG4gIGNvbnNvbGUubG9nKFwiQkJCIFwiICsga25vYk1pbi5zdHlsZS5sZWZ0KTtcbiAgXG4gIGlmKHBhcnNlSW50KGtub2JNaW4uc3R5bGUubGVmdCwxMCkgPCAwKXtcbiAgICBrbm9iTWF4LnN0eWxlLmxlZnQgPSBXSURUSF9LTk9CLzIgKyBcInB4XCI7XG4gIH0gZWxzZSB7XG4gICAga25vYk1heC5zdHlsZS5sZWZ0ID0ga25vYk1pbi5zdHlsZS5sZWZ0O1xuICB9XG4gIC8vZWxzZSBpZihwYXJzZUludChrbm9iTWluLnN0eWxlLmxlZnQsMTApID4gV0lEVEhfUkFOR0VfU0xJREVSX1RSQUNLIC0gV0lEVEhfS05PQiArMSkge1xuICAvL1xuICAvLyAgICAgfVxuIFxuICBrbm9iTWF4LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAvL3N0YXRlICBTdGF0ZURyYWcuTE9OR1BSRVNTO1xuICBrbm9iTWluLnN0eWxlLmJhY2tncm91bmQgPSAnIzIxM0Y4RCc7XG4gIGtub2JNYXguc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICB1cGRhdGVTZWdtZW50RmVlZGJhY2soKTtcbn1cblxuZnVuY3Rpb24gc3RvcENyZWF0ZVNlZ21lbnQoZSwgc3RvcFNlZ21lbnQpIHtcbiAgbGV0IHRpbWVyTGlmZVNlZ21lbnQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBrbm9iTWF4LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIHNlZ21lbnRGZWVkYmFjay5kaXZHcmFwaGljYWxPYmplY3Quc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAga25vYk1pbi5zdHlsZS5iYWNrZ3JvdW5kID0gJyNmZmZmZmYnO1xuICAgIC8vY3JlYXRlQ2FyZCgpO1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZXJMaWZlU2VnbWVudCk7XG4gICAgLy9jb25zb2xlLmxvZyhcIkFBQSA6IFwiICsgcGFyc2VJbnQoa25vYk1heC5zdHlsZS5sZWZ0LDEwKSk7XG4gICAgXG4gICAgXG4gICAgdmFyIHN0YXJ0UCA9IHBhcnNlSW50KGtub2JNYXguc3R5bGUubGVmdCwgMTApICsgV0lEVEhfTUlEX0tOT0JfTUlOIC8gMjtcbiAgICB2YXIgZW5kUCA9IHBhcnNlSW50KGtub2JNaW4uc3R5bGUubGVmdCwgMTApICsgV0lEVEhfS05PQjtcbiAgICBcbiAgIC8vIGNhcmRNYW5hZ2VyLmV4ZWN1dGUobmV3IENyZWF0ZU5ld0NhcmRDb21tYW5kKHN0YXJ0UCwgZW5kUCkpO1xuICAgIGlmKHN0YXJ0UCA8IDApe1xuICAgICAgc3RhcnRQID0gMDtcbiAgICB9XG5cbiAgICBQbGF5ZXIuY3JlYXRlTmV3Q2FyZChzdGFydFAsZW5kUCApO1xuICAgIFxuICAgIHBsYXkoKTtcbiAgfSwgNzAwKTtcbn1cblxuXG5cblxuLy9VcGRhdGUgdGhlIGZlZWRiYWNrIG9mIHRoZSBjcmVhdGlvbiBvZiBhIHNlZ21lbnQgYWZ0ZXIgYSBsb25nIHByZXNzXG5mdW5jdGlvbiB1cGRhdGVTZWdtZW50RmVlZGJhY2soKSB7XG4gIFxuICBcbiAgXG4gIGlmIChwYXJzZUludChrbm9iTWluLnN0eWxlLmxlZnQsIDEwKSA+IHBhcnNlSW50KGtub2JNYXguc3R5bGUubGVmdCwgMTApKSB7XG4gICAgc2VnbWVudEZlZWRiYWNrLmRpdkdyYXBoaWNhbE9iamVjdC5zdHlsZS5tYXJnaW5MZWZ0ID0ga25vYk1heC5zdHlsZS5sZWZ0ICAgO1xuICAgIHNlZ21lbnRGZWVkYmFjay5kaXZHcmFwaGljYWxPYmplY3Quc3R5bGUud2lkdGggPSBNYXRoLmFicygocGFyc2VJbnQoa25vYk1pbi5zdHlsZS5sZWZ0LCAxMCkgLSBwYXJzZUludChrbm9iTWF4LnN0eWxlLmxlZnQsIDEwKSAgICkpICsgV0lEVEhfS05PQiArIFwicHhcIjtcbiAgXG4gIH0gZWxzZSB7XG4gICAgc2VnbWVudEZlZWRiYWNrLmRpdkdyYXBoaWNhbE9iamVjdC5zdHlsZS5tYXJnaW5MZWZ0ID0ga25vYk1pbi5zdHlsZS5sZWZ0ICAgIDtcbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLndpZHRoID0gTWF0aC5hYnMoKHBhcnNlSW50KGtub2JNaW4uc3R5bGUubGVmdCwgMTApIC0gcGFyc2VJbnQoa25vYk1heC5zdHlsZS5sZWZ0LCAxMCkgICApKSAgKyBcInB4XCI7XG4gIFxuICB9XG4gIHNlZ21lbnRGZWVkYmFjay5kaXZHcmFwaGljYWxPYmplY3Quc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICBcbiAgXG4gIGlmKHBhcnNlSW50KHNlZ21lbnRGZWVkYmFjay5kaXZHcmFwaGljYWxPYmplY3Quc3R5bGUubWFyZ2luTGVmdCwgMTApIDwgMCApe1xuICAgIC8vdGhlIGNhc2UgaWYgdGhlIGtub2IgaXMgaW4gdGhlIGV4dHJlbXVuIG9mIHRoZSBsb2FkZXIuXG4gICAgc2VnbWVudEZlZWRiYWNrLmRpdkdyYXBoaWNhbE9iamVjdC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIgMCBweFwiIDtcbiAgfVxuICBcbn1cblxuXG4vKlxuXG4vL3N0YXJ0IHBvc2l0aW9uIG9uIHRoZSBzbGlkZXIgYW5kIGVuZCBwb3NpdGlvbiBvbiB0aGUgc2xpZGVyXG5mdW5jdGlvbiB2aWRlb1RvU2xpZGVyKHN0YXJ0RHVyYXRpb25WaWRlbywgZW5kRHVyYXRpb25WaWRlbykge1xuICB2YXIgc3RhcnRQID0gTWF0aC5yb3VuZCgoKHN0YXJ0RHVyYXRpb25WaWRlbyAqIE5VTUJFUl9PRl9USUNLKSAvIHZpZGVvLmR1cmF0aW9uKSAtIHJhbmdlU2xpZGVyVHJhY2sub2Zmc2V0TGVmdCk7XG4gIHZhciBlbmRQID0gTWF0aC5yb3VuZCgoKGVuZER1cmF0aW9uVmlkZW8gKiBOVU1CRVJfT0ZfVElDSykgLyB2aWRlby5kdXJhdGlvbikgLSByYW5nZVNsaWRlclRyYWNrLm9mZnNldExlZnQpO1xuICByZXR1cm4ge1xuICAgIHN0YXJ0UG9zaXRpb246IHN0YXJ0UCxcbiAgICBlbmRQb3NpdGlvbjogZW5kUFxuICB9O1xufVxuKi9cblxudmFyIGtub2JNaW5Nb3ZlID0gZnVuY3Rpb24oZSkge1xuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuRE9XTjpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5EUkFHO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIiBkcmFnaW5nIGV0YXQgZG93blwiKTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuRFJBRzpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5EUkFHO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCIgZHJhZ2luZyBldGF0IGRyYWdcIik7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuTE9OR1BSRVNTOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkxPTkdQUkVTUztcbiAgICAgIC8vY29uc29sZS5sb2coXCJzdGF0ZSBsb25ncHJlc3Mgd2l0aCBtb3VzZSBtb3ZlXCIpO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIHVwZGF0ZVNlZ21lbnRGZWVkYmFjaygpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59O1xuXG5cbnZhciBrbm9iTWluQ2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gIC8vY29uc29sZS5sb2coXCJmdW5jdGlvbiAtIGtub2JNaW5DbGlja1wiICk7XG4gIHBhdXNlKCk7XG4gIC8vVXBkYXRlIHZpZGVvIHBvc2l0aW9uXG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5JRExFOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRPV047XG4gICAgICBjbGVhckFsbFRpbWVyKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgLy9lLnByZXZlbnREZWZhdWx0KCk7XG59O1xuXG5cbnZhciByYW5nZVNsaWRlclRyYWNrRW5kQ2FsbGJhY2sgPSBmdW5jdGlvbihlKSB7XG4gIC8vY29uc29sZS5sb2coXCJcIik7XG4gIC8vY29uc29sZS5sb2coXCJtb3VzZSB1cCAsIGV0YXQgOiBcIiArIHN0YXRlKTtcbiAgLy8gY29uc29sZS5sb2coXCJyYW5nZVNsaWRlclRyYWNrRW5kQ2FsbGJhY2sgOiBcIiArIHN0YXRlKTtcbiAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgU3RhdGVEcmFnLkRPV046XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFN0YXRlRHJhZy5EUkFHOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJmdW5jdGlvbiAtIHJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayBsMjg1IHN0YXRlIG1hY2hpbmVcIik7XG4gICAgICBwYXVzZSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkxPTkdQUkVTUzpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIHN0b3BDcmVhdGVTZWdtZW50KGUsIHZpZGVvLmN1cnJlbnRUaW1lKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59O1xuXG52YXIga25vYk1pbk1vdXNlTGVhdmVDYWxsYmFjayA9IGZ1bmN0aW9uKGUpIHtcbiAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgU3RhdGVEcmFnLkRPV046XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuRFJBRztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFN0YXRlRHJhZy5EUkFHOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRSQUc7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkxPTkdQUkVTUzpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIHN0b3BDcmVhdGVTZWdtZW50KGUsIHZpZGVvLmN1cnJlbnRUaW1lKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBcbiAgfVxuICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59O1xuXG4iXX0=