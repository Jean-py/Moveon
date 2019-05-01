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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRlTWFjaGluZUNyZWF0ZVNlZ21lbnQuanMiXSwibmFtZXMiOlsidmlkZW8iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwid3JhcHBlckNvbW1hbmRBbmRSYW5nZSIsImtub2JNaW4iLCJyYW5nZVNsaWRlclRyYWNrIiwia25vYk1heCIsIndyYXBwZXJSYW5nZXJTbGlkZXIiLCJzcGVlZHJhdGUiLCJsb25nUHJlc3NEZWxheSIsIldJRFRIX0tOT0IiLCJTdGF0ZURyYWciLCJJRExFIiwiRE9XTiIsIkRSQUciLCJMT05HUFJFU1MiLCJzdGF0ZSIsInNlZ21lbnRGZWVkYmFjayIsIndpZHRoIiwic3RhcnRQb3N0aW9uIiwiZW5kUG9zaXRpb24iLCJzdGFydER1cmF0aW9uVmlkZW8iLCJlbmREdXJhdGlvblZpZGVvIiwiZGlzcGxheWVkIiwiZGl2R3JhcGhpY2FsT2JqZWN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwibWF0Y2giLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImtub2JNaW5VcENhbGxiYWNrIiwicGFzc2l2ZSIsImtub2JNaW5DbGljayIsImtub2JNaW5Nb3ZlIiwicmFuZ2xlclNsaWRlclRyYWNrQ2xpY2siLCJyYW5nZVNsaWRlclRyYWNrRW5kQ2FsbGJhY2siLCJ2aWRlb1RvdWNoTW92ZUNhbGxiYWNrIiwic2V0QXR0cmlidXRlIiwicGF1c2UiLCJsb25ncHJlc3NDcmVhdGVTZWdtZW50Q2FsbGJhY2siLCJwcmV2ZW50RGVmYXVsdCIsInN0YXJ0Q3JlYXRlU2VnbWVudCIsImN1cnJlbnRUaW1lIiwiY2xlYXJBbGxUaW1lciIsInVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIiLCJmZWVkYmFja09uU2xpZGVyVmlkZW8iLCJwbGF5Iiwic3RvcENyZWF0ZVNlZ21lbnQiLCJzdGFydFNlZ21lbnQiLCJwYXJzZUludCIsInN0eWxlIiwibGVmdCIsInBvc2l0aW9uIiwiYmFja2dyb3VuZCIsInZpc2liaWxpdHkiLCJ1cGRhdGVTZWdtZW50RmVlZGJhY2siLCJzdG9wU2VnbWVudCIsInRpbWVyTGlmZVNlZ21lbnQiLCJ3aW5kb3ciLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0Iiwic3RhcnRQIiwiV0lEVEhfTUlEX0tOT0JfTUlOIiwiZW5kUCIsIlBsYXllciIsImNyZWF0ZU5ld0NhcmQiLCJtYXJnaW5MZWZ0IiwiTWF0aCIsImFicyIsImtub2JNaW5Nb3VzZUxlYXZlQ2FsbGJhY2siXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQSxJQUFJQSxRQUFRQyxTQUFTQyxjQUFULENBQXdCLFVBQXhCLENBQVo7QUFDQSxJQUFJQyx5QkFBeUJGLFNBQVNDLGNBQVQsQ0FBd0IsMEJBQXhCLENBQTdCO0FBQ0EsSUFBSUUsVUFBVUgsU0FBU0MsY0FBVCxDQUF3Qix5QkFBeEIsQ0FBZDtBQUNBLElBQUlHLG1CQUFtQkosU0FBU0MsY0FBVCxDQUF3QixrQkFBeEIsQ0FBdkI7QUFDQSxJQUFJSSxVQUFVTCxTQUFTQyxjQUFULENBQXdCLHlCQUF4QixDQUFkO0FBQ0EsSUFBSUssc0JBQXNCTixTQUFTQyxjQUFULENBQXdCLHNCQUF4QixDQUExQjs7QUFHQTtBQUNBLElBQUlNLFlBQVksQ0FBaEI7QUFDQSxJQUFJQyxpQkFBaUIsS0FBckI7O0FBRUEsSUFBSUMsYUFBYSxFQUFqQjs7QUFFQTtBQUNBLElBQUlDLFlBQVk7QUFDZEMsUUFBTSxDQURRO0FBRWRDLFFBQU0sQ0FGUTtBQUdkQyxRQUFNLENBSFE7QUFJZEMsYUFBVztBQUpHLENBQWhCO0FBTUEsSUFBSUMsUUFBUUwsVUFBVUMsSUFBdEI7O0FBRUE7QUFDQSxJQUFJSyxrQkFBa0I7QUFDcEJDLFNBQU8sRUFEYTtBQUVwQkMsZ0JBQWMsRUFGTTtBQUdwQkMsZUFBYSxFQUhPO0FBSXBCQyxzQkFBb0IsRUFKQTtBQUtwQkMsb0JBQWtCLEVBTEU7QUFNcEJDLGFBQVcsS0FOUztBQU9wQkMsc0JBQW9CdkIsU0FBU0MsY0FBVCxDQUF3QixlQUF4QjtBQVBBLENBQXRCOztBQVVBLElBQUksQ0FBQ3VCLFVBQVVD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QkFBUUwsVUFBVUUsSUFBbEI7QUFDQThCO0FBQ0E7QUFDRDtBQU5IO0FBUUE7QUFDRCxDQWJEOztBQWdCQSxJQUFJUiw4QkFBOEIsU0FBOUJBLDJCQUE4QixDQUFTTixDQUFULEVBQVk7QUFDNUM7QUFDQTtBQUNBO0FBQ0EsVUFBUWIsS0FBUjtBQUNFLFNBQUtMLFVBQVVFLElBQWY7QUFDQTtBQUNFRyxnQkFBUUwsVUFBVUMsSUFBbEI7QUFDQTtBQUNEO0FBQ0QsU0FBS0QsVUFBVUcsSUFBZjtBQUNBO0FBQ0VFLGdCQUFRTCxVQUFVQyxJQUFsQjtBQUNBZ0Msa0NBQTBCZixDQUExQjtBQUNBO0FBQ0FTO0FBQ0E7QUFDRDtBQUNELFNBQUszQixVQUFVSSxTQUFmO0FBQ0E7QUFDRUMsZ0JBQVFMLFVBQVVDLElBQWxCO0FBQ0FnQyxrQ0FBMEJmLENBQTFCO0FBQ0FrQiwwQkFBa0JsQixDQUFsQixFQUFxQjdCLE1BQU0wQyxXQUEzQjtBQUNBO0FBQ0Q7QUFwQkg7QUFzQkE7QUFDRCxDQTNCRDs7QUE2QkEsSUFBSTJCLDRCQUE0QixTQUE1QkEseUJBQTRCLENBQVN4QyxDQUFULEVBQVk7QUFDMUMsVUFBUWIsS0FBUjtBQUNFLFNBQUtMLFVBQVVFLElBQWY7QUFDQTtBQUNFRyxnQkFBUUwsVUFBVUcsSUFBbEI7QUFDQTtBQUNEO0FBQ0QsU0FBS0gsVUFBVUcsSUFBZjtBQUNBO0FBQ0VFLGdCQUFRTCxVQUFVRyxJQUFsQjtBQUNBOEIsa0NBQTBCZixDQUExQjtBQUNBO0FBQ0Q7QUFDRCxTQUFLbEIsVUFBVUksU0FBZjtBQUNBO0FBQ0VDLGdCQUFRTCxVQUFVQyxJQUFsQjtBQUNBZ0Msa0NBQTBCZixDQUExQjtBQUNBa0IsMEJBQWtCbEIsQ0FBbEIsRUFBcUI3QixNQUFNMEMsV0FBM0I7QUFDQTtBQUNEOztBQWxCSDtBQXFCQTtBQUNELENBdkJEIiwiZmlsZSI6InN0YXRlTWFjaGluZUNyZWF0ZVNlZ21lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL0dyYXBoaWNhbCBvYmplY3RcbnZhciB2aWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmlkZW9FQVRcIik7XG52YXIgd3JhcHBlckNvbW1hbmRBbmRSYW5nZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid3JhcHBlckNvbW1hbmRBbmRSYW5nZWlkXCIpO1xudmFyIGtub2JNaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmdlLXNsaWRlcl9oYW5kbGUtbWluXCIpO1xudmFyIHJhbmdlU2xpZGVyVHJhY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhbmdlU2xpZGVyVHJhY2tcIik7XG52YXIga25vYk1heCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZ2Utc2xpZGVyX2hhbmRsZS1tYXhcIik7XG52YXIgd3JhcHBlclJhbmdlclNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZ2Utc2xpZGVyLXdyYXBwZXJcIik7XG5cblxuLy9PcHRpb24gZm9yIHRoZSBsb25ncHJlc3MgYW5kIHRoZSBzcGVlZCBvZiB0aGUgdmlkZW9cbnZhciBzcGVlZHJhdGUgPSAxO1xudmFyIGxvbmdQcmVzc0RlbGF5ID0gXCI1MDBcIjtcblxudmFyIFdJRFRIX0tOT0IgPSAzMDtcblxuLy9TdGF0ZSBmb3IgdGhlIGNyZWF0aW9uIG9mIHNlZ21lbnQgYnkgRHJhZyBhbmQgZHJvcFxubGV0IFN0YXRlRHJhZyA9IHtcbiAgSURMRTogMCxcbiAgRE9XTjogMSxcbiAgRFJBRzogMixcbiAgTE9OR1BSRVNTOiAzXG59O1xudmFyIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG5cbi8vR3JhcGhpY2FsIG9iamVjdCBvZiBmZWVkYmFja1xudmFyIHNlZ21lbnRGZWVkYmFjayA9IHtcbiAgd2lkdGg6IFwiXCIsXG4gIHN0YXJ0UG9zdGlvbjogXCJcIixcbiAgZW5kUG9zaXRpb246IFwiXCIsXG4gIHN0YXJ0RHVyYXRpb25WaWRlbzogXCJcIixcbiAgZW5kRHVyYXRpb25WaWRlbzogXCJcIixcbiAgZGlzcGxheWVkOiBmYWxzZSxcbiAgZGl2R3JhcGhpY2FsT2JqZWN0OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlZ21lbnRNaW5NYXhcIilcbn07XG5cbmlmICghbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZHxCbGFja0JlcnJ5fGlQaG9uZXxpUGFkfGlQb2R8T3BlcmEgTWluaXxJRU1vYmlsZS9pKSkge1xuICBcbiAgLy9Nb3VzZVxuICBrbm9iTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBrbm9iTWluVXBDYWxsYmFjayhlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIGtub2JNaW4uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG4gICAga25vYk1pbkNsaWNrKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAga25vYk1pbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBrbm9iTWluTW92ZShlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIHJhbmdlU2xpZGVyVHJhY2suYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG4gICAgcmFuZ2xlclNsaWRlclRyYWNrQ2xpY2soZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICByYW5nZVNsaWRlclRyYWNrLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZVVwXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICByYW5nZVNsaWRlclRyYWNrRW5kQ2FsbGJhY2soZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICByYW5nZVNsaWRlclRyYWNrLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZSkge1xuICAgIGtub2JNaW5Nb3ZlKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgXG4gIHdyYXBwZXJSYW5nZXJTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbihlKSB7XG4gICAga25vYk1pbk1vdmUoZSk7XG4gIH0sIHRydWUpO1xuICBcbiAgd3JhcHBlclJhbmdlclNsaWRlci5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKSB7XG4gICAgcmFuZ2VTbGlkZXJUcmFja0VuZENhbGxiYWNrKGUpO1xuICB9LCB0cnVlKTtcbiAgXG59IGVsc2Uge1xuICAvL1RvdWNoXG4gIGtub2JNaW4uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgZnVuY3Rpb24oZSkge1xuICAgIGtub2JNaW5DbGljayhlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIGtub2JNaW4uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBmdW5jdGlvbihlKSB7XG4gICAga25vYk1pbk1vdmUoZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICBrbm9iTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBmdW5jdGlvbihlKSB7XG4gICAga25vYk1pblVwQ2FsbGJhY2soZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICByYW5nZVNsaWRlclRyYWNrLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uKGUpIHtcbiAgICByYW5nbGVyU2xpZGVyVHJhY2tDbGljayhlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIHJhbmdlU2xpZGVyVHJhY2suYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICByYW5nZVNsaWRlclRyYWNrRW5kQ2FsbGJhY2soZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICB2aWRlby5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICB2aWRlb1RvdWNoTW92ZUNhbGxiYWNrKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgXG4gIFxuICBcbn1cblxuXG4vKndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKXtcbiAgcmFuZ2VTbGlkZXJUcmFja0VuZENhbGxiYWNrKGUpO1xufSwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZSl7XG4gIGtub2JNaW5Nb3ZlKGUpO1xufSx0cnVlICk7Ki9cblxuXG5cblxuLyotLS0tLU1PVVNFIExPTkcgUFJFU1MtLS0tLS0tKi9cblxua25vYk1pbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWxvbmctcHJlc3MtZGVsYXlcIiwgbG9uZ1ByZXNzRGVsYXkpO1xua25vYk1pbi5hZGRFdmVudExpc3RlbmVyKCdsb25nLXByZXNzJywgZnVuY3Rpb24oZSkge1xuICAvLyBjb25zb2xlLmxvZygna25vYk1pbi5hZGRFdmVudExpc3RlbmVyKGxvbmdwcmVzcycpO1xuICBwYXVzZSgpO1xuICBsb25ncHJlc3NDcmVhdGVTZWdtZW50Q2FsbGJhY2soZSk7XG59KTtcbnJhbmdlU2xpZGVyVHJhY2suYWRkRXZlbnRMaXN0ZW5lcihcImxvbmctcHJlc3NcIiwgZnVuY3Rpb24oZSkge1xuICAvLyBjb25zb2xlLmxvZygncmFuZ2VTbGlkZXJUcmFjay5hZGRFdmVudExpc3RlbmVyKGxvbmdwcmVzcycpO1xuICBcbiAgcGF1c2UoKTtcbiAgbG9uZ3ByZXNzQ3JlYXRlU2VnbWVudENhbGxiYWNrKGUpO1xufSwgZmFsc2UpO1xuXG4vKkNhbGxiYWNrIGZ1bmN0aW9uKi9cbnZhciBsb25ncHJlc3NDcmVhdGVTZWdtZW50Q2FsbGJhY2sgPSBmdW5jdGlvbihlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgLy9jb25zb2xlLmxvZygnc3RhdGUgOiAnICsgc3RhdGUgKycnLCAnYmFja2dyb3VuZDogIzIyMjsgY29sb3I6ICNiYWRhNTUnKTtcbiAgXG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5ET1dOOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkxPTkdQUkVTUztcbiAgICAgIC8vcGF1c2UoKTtcbiAgICAgIHN0YXJ0Q3JlYXRlU2VnbWVudChlLCB2aWRlby5jdXJyZW50VGltZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgXG4gIH1cbiAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufTtcblxudmFyIHZpZGVvVG91Y2hNb3ZlQ2FsbGJhY2sgPSBmdW5jdGlvbihlKSB7XG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5JRExFOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRSQUc7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn07XG5cbnZhciByYW5nbGVyU2xpZGVyVHJhY2tDbGljayA9IGZ1bmN0aW9uKGUpIHtcbiAgLy8gIGNvbnNvbGUubG9nKFwicmFuZ2xlclNsaWRlclRyYWNrQ2xpY2sgc3RhdGUgOiBcIiArIHN0YXRlKTtcbiAgLy8gcGF1c2UoKTtcbiAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgU3RhdGVEcmFnLklETEU6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuRE9XTjtcbiAgICAgIGNsZWFyQWxsVGltZXIoKTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICBmZWVkYmFja09uU2xpZGVyVmlkZW8oZmFsc2UpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIC8vY29uc29sZS5sb2coXCJmdW5jdGlvbiAtIHJhbmdsZXJTbGlkZXJUcmFja0NsaWNrIGFwcGVsIHBsYXkgbDE0NyBzdGF0ZW1hY2hpbmUgXCIpO1xuICBwbGF5KCk7XG59O1xuXG52YXIga25vYk1pblVwQ2FsbGJhY2sgPSBmdW5jdGlvbihlKSB7XG4gIC8vY29uc29sZS5sb2coXCIqKiprbm9iTWluVXBDYWxsYmFjayAqKiogXCIrIHN0YXRlKTtcbiAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgU3RhdGVEcmFnLklETEU6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJmdW5jdGlvbiAtIGtub2JNaW5VcENhbGxiYWNrIGFwcGVsIHBsYXkgXCIpO1xuICAgICAgLy9wbGF5KCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuTE9OR1BSRVNTOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgc3RvcENyZWF0ZVNlZ21lbnQoZSwgdmlkZW8uY3VycmVudFRpbWUpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0ga25vYk1pblVwQ2FsbGJhY2sgYXBwZWwgcGF1c2UgbDE2NCBzdGF0ZW1hY2hpbmUgXCIpO1xuICAgICAgcGxheSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkRSQUc6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gLSBrbm9iTWluVXBDYWxsYmFjayBhcHBlbCBwYXVzZSBsMTY1IHN0YXRlbWFjaGluZSBcIik7XG4gICAgICBwYXVzZSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkRPV046XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gLSBrbm9iTWluVXBDYWxsYmFjayBhcHBlbCBwYXVzZSBsMTcyIHN0YXRlbWFjaGluZSBcIik7XG4gICAgICBwYXVzZSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIFxuICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59O1xuXG5cbi8vQ3JlYXRlIFNlZ21lbnRcbmZ1bmN0aW9uIHN0YXJ0Q3JlYXRlU2VnbWVudChlLCBzdGFydFNlZ21lbnQpIHtcbiAgaWYocGFyc2VJbnQoa25vYk1pbi5zdHlsZS5sZWZ0LDEwKSA8IDApe1xuICAgIGtub2JNYXguc3R5bGUubGVmdCA9IFdJRFRIX0tOT0IvMiArIFwicHhcIjtcbiAgfSBlbHNlIHtcbiAgICBrbm9iTWF4LnN0eWxlLmxlZnQgPSBrbm9iTWluLnN0eWxlLmxlZnQ7XG4gIH1cbiAgLy9lbHNlIGlmKHBhcnNlSW50KGtub2JNaW4uc3R5bGUubGVmdCwxMCkgPiBXSURUSF9SQU5HRV9TTElERVJfVFJBQ0sgLSBXSURUSF9LTk9CICsxKSB7XG4gIC8vXG4gIC8vICAgICB9XG4gXG4gIGtub2JNYXguc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gIC8vc3RhdGUgIFN0YXRlRHJhZy5MT05HUFJFU1M7XG4gIGtub2JNaW4uc3R5bGUuYmFja2dyb3VuZCA9ICcjMjEzRjhEJztcbiAga25vYk1heC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gIHVwZGF0ZVNlZ21lbnRGZWVkYmFjaygpO1xufVxuXG5mdW5jdGlvbiBzdG9wQ3JlYXRlU2VnbWVudChlLCBzdG9wU2VnbWVudCkge1xuICBsZXQgdGltZXJMaWZlU2VnbWVudCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIGtub2JNYXguc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgc2VnbWVudEZlZWRiYWNrLmRpdkdyYXBoaWNhbE9iamVjdC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICBrbm9iTWluLnN0eWxlLmJhY2tncm91bmQgPSAnI2ZmZmZmZic7XG4gICAgLy9jcmVhdGVDYXJkKCk7XG4gICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lckxpZmVTZWdtZW50KTtcbiAgICAvL2NvbnNvbGUubG9nKFwiQUFBIDogXCIgKyBwYXJzZUludChrbm9iTWF4LnN0eWxlLmxlZnQsMTApKTtcbiAgICBcbiAgICBcbiAgICB2YXIgc3RhcnRQID0gcGFyc2VJbnQoa25vYk1heC5zdHlsZS5sZWZ0LCAxMCkgKyBXSURUSF9NSURfS05PQl9NSU4gLyAyO1xuICAgIHZhciBlbmRQID0gcGFyc2VJbnQoa25vYk1pbi5zdHlsZS5sZWZ0LCAxMCkgKyBXSURUSF9LTk9CO1xuICAgIFxuICAgLy8gY2FyZE1hbmFnZXIuZXhlY3V0ZShuZXcgQ3JlYXRlTmV3Q2FyZENvbW1hbmQoc3RhcnRQLCBlbmRQKSk7XG4gICAgaWYoc3RhcnRQIDwgMCl7XG4gICAgICBzdGFydFAgPSAwO1xuICAgIH1cblxuICAgIFBsYXllci5jcmVhdGVOZXdDYXJkKHN0YXJ0UCxlbmRQICk7XG4gICAgXG4gICAgcGxheSgpO1xuICB9LCA3MDApO1xufVxuXG5cblxuXG4vL1VwZGF0ZSB0aGUgZmVlZGJhY2sgb2YgdGhlIGNyZWF0aW9uIG9mIGEgc2VnbWVudCBhZnRlciBhIGxvbmcgcHJlc3NcbmZ1bmN0aW9uIHVwZGF0ZVNlZ21lbnRGZWVkYmFjaygpIHtcbiAgXG4gIFxuICBcbiAgaWYgKHBhcnNlSW50KGtub2JNaW4uc3R5bGUubGVmdCwgMTApID4gcGFyc2VJbnQoa25vYk1heC5zdHlsZS5sZWZ0LCAxMCkpIHtcbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLm1hcmdpbkxlZnQgPSBrbm9iTWF4LnN0eWxlLmxlZnQgICA7XG4gICAgc2VnbWVudEZlZWRiYWNrLmRpdkdyYXBoaWNhbE9iamVjdC5zdHlsZS53aWR0aCA9IE1hdGguYWJzKChwYXJzZUludChrbm9iTWluLnN0eWxlLmxlZnQsIDEwKSAtIHBhcnNlSW50KGtub2JNYXguc3R5bGUubGVmdCwgMTApICAgKSkgKyBXSURUSF9LTk9CICsgXCJweFwiO1xuICBcbiAgfSBlbHNlIHtcbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLm1hcmdpbkxlZnQgPSBrbm9iTWluLnN0eWxlLmxlZnQgICAgO1xuICAgIHNlZ21lbnRGZWVkYmFjay5kaXZHcmFwaGljYWxPYmplY3Quc3R5bGUud2lkdGggPSBNYXRoLmFicygocGFyc2VJbnQoa25vYk1pbi5zdHlsZS5sZWZ0LCAxMCkgLSBwYXJzZUludChrbm9iTWF4LnN0eWxlLmxlZnQsIDEwKSAgICkpICArIFwicHhcIjtcbiAgXG4gIH1cbiAgc2VnbWVudEZlZWRiYWNrLmRpdkdyYXBoaWNhbE9iamVjdC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gIFxuICBcbiAgaWYocGFyc2VJbnQoc2VnbWVudEZlZWRiYWNrLmRpdkdyYXBoaWNhbE9iamVjdC5zdHlsZS5tYXJnaW5MZWZ0LCAxMCkgPCAwICl7XG4gICAgLy90aGUgY2FzZSBpZiB0aGUga25vYiBpcyBpbiB0aGUgZXh0cmVtdW4gb2YgdGhlIGxvYWRlci5cbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLm1hcmdpbkxlZnQgPSBcIiAwIHB4XCIgO1xuICB9XG4gIFxufVxuXG5cbi8qXG5cbi8vc3RhcnQgcG9zaXRpb24gb24gdGhlIHNsaWRlciBhbmQgZW5kIHBvc2l0aW9uIG9uIHRoZSBzbGlkZXJcbmZ1bmN0aW9uIHZpZGVvVG9TbGlkZXIoc3RhcnREdXJhdGlvblZpZGVvLCBlbmREdXJhdGlvblZpZGVvKSB7XG4gIHZhciBzdGFydFAgPSBNYXRoLnJvdW5kKCgoc3RhcnREdXJhdGlvblZpZGVvICogTlVNQkVSX09GX1RJQ0spIC8gdmlkZW8uZHVyYXRpb24pIC0gcmFuZ2VTbGlkZXJUcmFjay5vZmZzZXRMZWZ0KTtcbiAgdmFyIGVuZFAgPSBNYXRoLnJvdW5kKCgoZW5kRHVyYXRpb25WaWRlbyAqIE5VTUJFUl9PRl9USUNLKSAvIHZpZGVvLmR1cmF0aW9uKSAtIHJhbmdlU2xpZGVyVHJhY2sub2Zmc2V0TGVmdCk7XG4gIHJldHVybiB7XG4gICAgc3RhcnRQb3NpdGlvbjogc3RhcnRQLFxuICAgIGVuZFBvc2l0aW9uOiBlbmRQXG4gIH07XG59XG4qL1xuXG52YXIga25vYk1pbk1vdmUgPSBmdW5jdGlvbihlKSB7XG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5ET1dOOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRSQUc7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiIGRyYWdpbmcgZXRhdCBkb3duXCIpO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFN0YXRlRHJhZy5EUkFHOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRSQUc7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIiBkcmFnaW5nIGV0YXQgZHJhZ1wiKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFN0YXRlRHJhZy5MT05HUFJFU1M6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuTE9OR1BSRVNTO1xuICAgICAgLy9jb25zb2xlLmxvZyhcInN0YXRlIGxvbmdwcmVzcyB3aXRoIG1vdXNlIG1vdmVcIik7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgdXBkYXRlU2VnbWVudEZlZWRiYWNrKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn07XG5cblxudmFyIGtub2JNaW5DbGljayA9IGZ1bmN0aW9uKGUpIHtcbiAgLy9jb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0ga25vYk1pbkNsaWNrXCIgKTtcbiAgcGF1c2UoKTtcbiAgLy9VcGRhdGUgdmlkZW8gcG9zaXRpb25cbiAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgU3RhdGVEcmFnLklETEU6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuRE9XTjtcbiAgICAgIGNsZWFyQWxsVGltZXIoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICAvL2UucHJldmVudERlZmF1bHQoKTtcbn07XG5cblxudmFyIHJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayA9IGZ1bmN0aW9uKGUpIHtcbiAgLy9jb25zb2xlLmxvZyhcIlwiKTtcbiAgLy9jb25zb2xlLmxvZyhcIm1vdXNlIHVwICwgZXRhdCA6IFwiICsgc3RhdGUpO1xuICAvLyBjb25zb2xlLmxvZyhcInJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayA6IFwiICsgc3RhdGUpO1xuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuRE9XTjpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkRSQUc6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0gcmFuZ2VTbGlkZXJUcmFja0VuZENhbGxiYWNrIGwyODUgc3RhdGUgbWFjaGluZVwiKTtcbiAgICAgIHBhdXNlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuTE9OR1BSRVNTOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgc3RvcENyZWF0ZVNlZ21lbnQoZSwgdmlkZW8uY3VycmVudFRpbWUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn07XG5cbnZhciBrbm9iTWluTW91c2VMZWF2ZUNhbGxiYWNrID0gZnVuY3Rpb24oZSkge1xuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuRE9XTjpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5EUkFHO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkRSQUc6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuRFJBRztcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuTE9OR1BSRVNTOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgc3RvcENyZWF0ZVNlZ21lbnQoZSwgdmlkZW8uY3VycmVudFRpbWUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICB9XG4gIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn07XG5cbiJdfQ==