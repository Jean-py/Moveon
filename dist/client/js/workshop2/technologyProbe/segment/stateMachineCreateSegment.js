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
        console.log("ici");
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
    createNewCard(startP, endP);
    play();
  }, 700);
}

//Update the feedback of the creation of a segment after a long press
function updateSegmentFeedback() {

  if (parseInt(knobMin.style.left, 10) > parseInt(knobMax.style.left, 10)) {
    segmentFeedback.divGraphicalObject.style.marginLeft = knobMax.style.left;
  } else {
    segmentFeedback.divGraphicalObject.style.marginLeft = knobMin.style.left;
  }
  segmentFeedback.divGraphicalObject.style.visibility = "visible";
  segmentFeedback.divGraphicalObject.style.width = Math.abs(parseInt(knobMin.style.left, 10) - parseInt(knobMax.style.left, 10)) + WIDTH_KNOB + "px";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRlTWFjaGluZUNyZWF0ZVNlZ21lbnQuanMiXSwibmFtZXMiOlsidmlkZW8iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwid3JhcHBlckNvbW1hbmRBbmRSYW5nZSIsImtub2JNaW4iLCJyYW5nZVNsaWRlclRyYWNrIiwia25vYk1heCIsIndyYXBwZXJSYW5nZXJTbGlkZXIiLCJzcGVlZHJhdGUiLCJsb25nUHJlc3NEZWxheSIsIldJRFRIX0tOT0IiLCJTdGF0ZURyYWciLCJJRExFIiwiRE9XTiIsIkRSQUciLCJMT05HUFJFU1MiLCJzdGF0ZSIsInNlZ21lbnRGZWVkYmFjayIsIndpZHRoIiwic3RhcnRQb3N0aW9uIiwiZW5kUG9zaXRpb24iLCJzdGFydER1cmF0aW9uVmlkZW8iLCJlbmREdXJhdGlvblZpZGVvIiwiZGlzcGxheWVkIiwiZGl2R3JhcGhpY2FsT2JqZWN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwibWF0Y2giLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImtub2JNaW5VcENhbGxiYWNrIiwicGFzc2l2ZSIsImtub2JNaW5DbGljayIsImtub2JNaW5Nb3ZlIiwicmFuZ2xlclNsaWRlclRyYWNrQ2xpY2siLCJyYW5nZVNsaWRlclRyYWNrRW5kQ2FsbGJhY2siLCJ2aWRlb1RvdWNoTW92ZUNhbGxiYWNrIiwic2V0QXR0cmlidXRlIiwicGF1c2UiLCJsb25ncHJlc3NDcmVhdGVTZWdtZW50Q2FsbGJhY2siLCJwcmV2ZW50RGVmYXVsdCIsInN0YXJ0Q3JlYXRlU2VnbWVudCIsImN1cnJlbnRUaW1lIiwiY29uc29sZSIsImxvZyIsImNsZWFyQWxsVGltZXIiLCJ1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyIiwiZmVlZGJhY2tPblNsaWRlclZpZGVvIiwicGxheSIsInN0b3BDcmVhdGVTZWdtZW50Iiwic3RhcnRTZWdtZW50Iiwic3R5bGUiLCJsZWZ0IiwicGFyc2VJbnQiLCJwb3NpdGlvbiIsImJhY2tncm91bmQiLCJ2aXNpYmlsaXR5IiwidXBkYXRlU2VnbWVudEZlZWRiYWNrIiwic3RvcFNlZ21lbnQiLCJ0aW1lckxpZmVTZWdtZW50Iiwid2luZG93Iiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInN0YXJ0UCIsIldJRFRIX01JRF9LTk9CX01JTiIsImVuZFAiLCJjcmVhdGVOZXdDYXJkIiwibWFyZ2luTGVmdCIsIk1hdGgiLCJhYnMiLCJrbm9iTWluTW91c2VMZWF2ZUNhbGxiYWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0EsSUFBSUEsUUFBUUMsU0FBU0MsY0FBVCxDQUF3QixVQUF4QixDQUFaO0FBQ0EsSUFBSUMseUJBQXlCRixTQUFTQyxjQUFULENBQXdCLDBCQUF4QixDQUE3QjtBQUNBLElBQUlFLFVBQVVILFNBQVNDLGNBQVQsQ0FBd0IseUJBQXhCLENBQWQ7QUFDQSxJQUFJRyxtQkFBbUJKLFNBQVNDLGNBQVQsQ0FBd0Isa0JBQXhCLENBQXZCO0FBQ0EsSUFBSUksVUFBVUwsU0FBU0MsY0FBVCxDQUF3Qix5QkFBeEIsQ0FBZDtBQUNBLElBQUlLLHNCQUFzQk4sU0FBU0MsY0FBVCxDQUF3QixzQkFBeEIsQ0FBMUI7O0FBR0E7QUFDQSxJQUFJTSxZQUFZLENBQWhCO0FBQ0EsSUFBSUMsaUJBQWlCLEtBQXJCOztBQUVBLElBQUlDLGFBQWEsRUFBakI7O0FBRUE7QUFDQSxJQUFJQyxZQUFZO0FBQ2RDLFFBQU0sQ0FEUTtBQUVkQyxRQUFNLENBRlE7QUFHZEMsUUFBTSxDQUhRO0FBSWRDLGFBQVc7QUFKRyxDQUFoQjtBQU1BLElBQUlDLFFBQVFMLFVBQVVDLElBQXRCOztBQUVBO0FBQ0EsSUFBSUssa0JBQWtCO0FBQ3BCQyxTQUFPLEVBRGE7QUFFcEJDLGdCQUFjLEVBRk07QUFHcEJDLGVBQWEsRUFITztBQUlwQkMsc0JBQW9CLEVBSkE7QUFLcEJDLG9CQUFrQixFQUxFO0FBTXBCQyxhQUFXLEtBTlM7QUFPcEJDLHNCQUFvQnZCLFNBQVNDLGNBQVQsQ0FBd0IsZUFBeEI7QUFQQSxDQUF0Qjs7QUFVQSxJQUFJLENBQUN1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QVk7QUFDNUM7QUFDQTtBQUNBO0FBQ0EsVUFBUWIsS0FBUjtBQUNFLFNBQUtMLFVBQVVFLElBQWY7QUFDQTtBQUNFRyxnQkFBUUwsVUFBVUMsSUFBbEI7QUFDQTtBQUNEO0FBQ0QsU0FBS0QsVUFBVUcsSUFBZjtBQUNBO0FBQ0VFLGdCQUFRTCxVQUFVQyxJQUFsQjtBQUNBa0Msa0NBQTBCakIsQ0FBMUI7QUFDQTtBQUNBUztBQUNBO0FBQ0Q7QUFDRCxTQUFLM0IsVUFBVUksU0FBZjtBQUNBO0FBQ0VDLGdCQUFRTCxVQUFVQyxJQUFsQjtBQUNBa0Msa0NBQTBCakIsQ0FBMUI7QUFDQW9CLDBCQUFrQnBCLENBQWxCLEVBQXFCN0IsTUFBTTBDLFdBQTNCO0FBQ0E7QUFDRDs7QUFwQkg7QUF1QkE7QUFDRCxDQTVCRDs7QUE4QkEsSUFBSTRCLDRCQUE0QixTQUE1QkEseUJBQTRCLENBQVN6QyxDQUFULEVBQVk7QUFDMUMsVUFBUWIsS0FBUjtBQUNFLFNBQUtMLFVBQVVFLElBQWY7QUFDQTtBQUNFRyxnQkFBUUwsVUFBVUcsSUFBbEI7QUFDQTtBQUNEO0FBQ0QsU0FBS0gsVUFBVUcsSUFBZjtBQUNBO0FBQ0VFLGdCQUFRTCxVQUFVRyxJQUFsQjtBQUNBZ0Msa0NBQTBCakIsQ0FBMUI7QUFDQTtBQUNEO0FBQ0QsU0FBS2xCLFVBQVVJLFNBQWY7QUFDQTtBQUNFQyxnQkFBUUwsVUFBVUMsSUFBbEI7QUFDQWtDLGtDQUEwQmpCLENBQTFCO0FBQ0FvQiwwQkFBa0JwQixDQUFsQixFQUFxQjdCLE1BQU0wQyxXQUEzQjtBQUNBO0FBQ0Q7O0FBbEJIO0FBcUJBO0FBQ0QsQ0F2QkQiLCJmaWxlIjoic3RhdGVNYWNoaW5lQ3JlYXRlU2VnbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vR3JhcGhpY2FsIG9iamVjdFxudmFyIHZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb0VBVFwiKTtcbnZhciB3cmFwcGVyQ29tbWFuZEFuZFJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3cmFwcGVyQ29tbWFuZEFuZFJhbmdlaWRcIik7XG52YXIga25vYk1pbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZ2Utc2xpZGVyX2hhbmRsZS1taW5cIik7XG52YXIgcmFuZ2VTbGlkZXJUcmFjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZ2VTbGlkZXJUcmFja1wiKTtcbnZhciBrbm9iTWF4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYW5nZS1zbGlkZXJfaGFuZGxlLW1heFwiKTtcbnZhciB3cmFwcGVyUmFuZ2VyU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYW5nZS1zbGlkZXItd3JhcHBlclwiKTtcblxuXG4vL09wdGlvbiBmb3IgdGhlIGxvbmdwcmVzcyBhbmQgdGhlIHNwZWVkIG9mIHRoZSB2aWRlb1xudmFyIHNwZWVkcmF0ZSA9IDE7XG52YXIgbG9uZ1ByZXNzRGVsYXkgPSBcIjUwMFwiO1xuXG52YXIgV0lEVEhfS05PQiA9IDMwO1xuXG4vL1N0YXRlIGZvciB0aGUgY3JlYXRpb24gb2Ygc2VnbWVudCBieSBEcmFnIGFuZCBkcm9wXG5sZXQgU3RhdGVEcmFnID0ge1xuICBJRExFOiAwLFxuICBET1dOOiAxLFxuICBEUkFHOiAyLFxuICBMT05HUFJFU1M6IDNcbn07XG52YXIgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcblxuLy9HcmFwaGljYWwgb2JqZWN0IG9mIGZlZWRiYWNrXG52YXIgc2VnbWVudEZlZWRiYWNrID0ge1xuICB3aWR0aDogXCJcIixcbiAgc3RhcnRQb3N0aW9uOiBcIlwiLFxuICBlbmRQb3NpdGlvbjogXCJcIixcbiAgc3RhcnREdXJhdGlvblZpZGVvOiBcIlwiLFxuICBlbmREdXJhdGlvblZpZGVvOiBcIlwiLFxuICBkaXNwbGF5ZWQ6IGZhbHNlLFxuICBkaXZHcmFwaGljYWxPYmplY3Q6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VnbWVudE1pbk1heFwiKVxufTtcblxuaWYgKCFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkfEJsYWNrQmVycnl8aVBob25lfGlQYWR8aVBvZHxPcGVyYSBNaW5pfElFTW9iaWxlL2kpKSB7XG4gIFxuICAvL01vdXNlXG4gIGtub2JNaW4uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24oZSkge1xuICAgIGtub2JNaW5VcENhbGxiYWNrKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAga25vYk1pbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBrbm9iTWluQ2xpY2soZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICBrbm9iTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZSkge1xuICAgIGtub2JNaW5Nb3ZlKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgcmFuZ2VTbGlkZXJUcmFjay5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICByYW5nbGVyU2xpZGVyVHJhY2tDbGljayhlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIHJhbmdlU2xpZGVyVHJhY2suYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlVXBcIiwgZnVuY3Rpb24oZSkge1xuICAgIHJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayhlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIHJhbmdlU2xpZGVyVHJhY2suYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbihlKSB7XG4gICAga25vYk1pbk1vdmUoZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICBcbiAgd3JhcHBlclJhbmdlclNsaWRlci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBrbm9iTWluTW92ZShlKTtcbiAgfSwgdHJ1ZSk7XG4gIFxuICB3cmFwcGVyUmFuZ2VyU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICByYW5nZVNsaWRlclRyYWNrRW5kQ2FsbGJhY2soZSk7XG4gIH0sIHRydWUpO1xuICBcbn0gZWxzZSB7XG4gIC8vVG91Y2hcbiAga25vYk1pbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBmdW5jdGlvbihlKSB7XG4gICAga25vYk1pbkNsaWNrKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAga25vYk1pbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBrbm9iTWluTW92ZShlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIGtub2JNaW4uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBrbm9iTWluVXBDYWxsYmFjayhlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIHJhbmdlU2xpZGVyVHJhY2suYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgZnVuY3Rpb24oZSkge1xuICAgIHJhbmdsZXJTbGlkZXJUcmFja0NsaWNrKGUpO1xuICB9LCB7XG4gICAgcGFzc2l2ZTogdHJ1ZVxuICB9KTtcbiAgcmFuZ2VTbGlkZXJUcmFjay5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgZnVuY3Rpb24oZSkge1xuICAgIHJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayhlKTtcbiAgfSwge1xuICAgIHBhc3NpdmU6IHRydWVcbiAgfSk7XG4gIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgZnVuY3Rpb24oZSkge1xuICAgIHZpZGVvVG91Y2hNb3ZlQ2FsbGJhY2soZSk7XG4gIH0sIHtcbiAgICBwYXNzaXZlOiB0cnVlXG4gIH0pO1xuICBcbn1cblxuXG4vKndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKXtcbiAgcmFuZ2VTbGlkZXJUcmFja0VuZENhbGxiYWNrKGUpO1xufSwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZSl7XG4gIGtub2JNaW5Nb3ZlKGUpO1xufSx0cnVlICk7Ki9cblxuXG5cblxuLyotLS0tLU1PVVNFIExPTkcgUFJFU1MtLS0tLS0tKi9cblxua25vYk1pbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWxvbmctcHJlc3MtZGVsYXlcIiwgbG9uZ1ByZXNzRGVsYXkpO1xua25vYk1pbi5hZGRFdmVudExpc3RlbmVyKCdsb25nLXByZXNzJywgZnVuY3Rpb24oZSkge1xuICAvLyBjb25zb2xlLmxvZygna25vYk1pbi5hZGRFdmVudExpc3RlbmVyKGxvbmdwcmVzcycpO1xuICBwYXVzZSgpO1xuICBsb25ncHJlc3NDcmVhdGVTZWdtZW50Q2FsbGJhY2soZSk7XG59KTtcbnJhbmdlU2xpZGVyVHJhY2suYWRkRXZlbnRMaXN0ZW5lcihcImxvbmctcHJlc3NcIiwgZnVuY3Rpb24oZSkge1xuICAvLyBjb25zb2xlLmxvZygncmFuZ2VTbGlkZXJUcmFjay5hZGRFdmVudExpc3RlbmVyKGxvbmdwcmVzcycpO1xuICBcbiAgcGF1c2UoKTtcbiAgbG9uZ3ByZXNzQ3JlYXRlU2VnbWVudENhbGxiYWNrKGUpO1xufSwgZmFsc2UpO1xuXG4vKkNhbGxiYWNrIGZ1bmN0aW9uKi9cbnZhciBsb25ncHJlc3NDcmVhdGVTZWdtZW50Q2FsbGJhY2sgPSBmdW5jdGlvbihlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgLy9jb25zb2xlLmxvZygnc3RhdGUgOiAnICsgc3RhdGUgKycnLCAnYmFja2dyb3VuZDogIzIyMjsgY29sb3I6ICNiYWRhNTUnKTtcbiAgXG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5ET1dOOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkxPTkdQUkVTUztcbiAgICAgIC8vcGF1c2UoKTtcbiAgICAgIHN0YXJ0Q3JlYXRlU2VnbWVudChlLCB2aWRlby5jdXJyZW50VGltZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgXG4gIH1cbiAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufTtcblxudmFyIHZpZGVvVG91Y2hNb3ZlQ2FsbGJhY2sgPSBmdW5jdGlvbihlKSB7XG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5JRExFOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRSQUc7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn07XG5cbnZhciByYW5nbGVyU2xpZGVyVHJhY2tDbGljayA9IGZ1bmN0aW9uKGUpIHtcbiAgLy8gIGNvbnNvbGUubG9nKFwicmFuZ2xlclNsaWRlclRyYWNrQ2xpY2sgc3RhdGUgOiBcIiArIHN0YXRlKTtcbiAgLy8gcGF1c2UoKTtcbiAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgU3RhdGVEcmFnLklETEU6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuRE9XTjtcbiAgICAgIGNvbnNvbGUubG9nKFwiaWNpXCIpO1xuICAgICAgY2xlYXJBbGxUaW1lcigpO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIGZlZWRiYWNrT25TbGlkZXJWaWRlbyhmYWxzZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgLy9jb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0gcmFuZ2xlclNsaWRlclRyYWNrQ2xpY2sgYXBwZWwgcGxheSBsMTQ3IHN0YXRlbWFjaGluZSBcIik7XG4gIHBsYXkoKTtcbn07XG5cbnZhciBrbm9iTWluVXBDYWxsYmFjayA9IGZ1bmN0aW9uKGUpIHtcbiAgLy9jb25zb2xlLmxvZyhcIioqKmtub2JNaW5VcENhbGxiYWNrICoqKiBcIisgc3RhdGUpO1xuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuSURMRTpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgLy9jb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0ga25vYk1pblVwQ2FsbGJhY2sgYXBwZWwgcGxheSBcIik7XG4gICAgICAvL3BsYXkoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFN0YXRlRHJhZy5MT05HUFJFU1M6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICBzdG9wQ3JlYXRlU2VnbWVudChlLCB2aWRlby5jdXJyZW50VGltZSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gLSBrbm9iTWluVXBDYWxsYmFjayBhcHBlbCBwYXVzZSBsMTY0IHN0YXRlbWFjaGluZSBcIik7XG4gICAgICBwbGF5KCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuRFJBRzpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJmdW5jdGlvbiAtIGtub2JNaW5VcENhbGxiYWNrIGFwcGVsIHBhdXNlIGwxNjUgc3RhdGVtYWNoaW5lIFwiKTtcbiAgICAgIHBhdXNlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuRE9XTjpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCJmdW5jdGlvbiAtIGtub2JNaW5VcENhbGxiYWNrIGFwcGVsIHBhdXNlIGwxNzIgc3RhdGVtYWNoaW5lIFwiKTtcbiAgICAgIHBhdXNlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgXG4gIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn07XG5cblxuLy9DcmVhdGUgU2VnbWVudFxuZnVuY3Rpb24gc3RhcnRDcmVhdGVTZWdtZW50KGUsIHN0YXJ0U2VnbWVudCkge1xuICBjb25zb2xlLmxvZyhcIkJCQiBcIiArIGtub2JNaW4uc3R5bGUubGVmdCk7XG4gIFxuICBpZihwYXJzZUludChrbm9iTWluLnN0eWxlLmxlZnQsMTApIDwgMCl7XG4gICAga25vYk1heC5zdHlsZS5sZWZ0ID0gV0lEVEhfS05PQi8yICsgXCJweFwiO1xuICB9IGVsc2Uge1xuICAgIGtub2JNYXguc3R5bGUubGVmdCA9IGtub2JNaW4uc3R5bGUubGVmdDtcbiAgfVxuICAvL2Vsc2UgaWYocGFyc2VJbnQoa25vYk1pbi5zdHlsZS5sZWZ0LDEwKSA+IFdJRFRIX1JBTkdFX1NMSURFUl9UUkFDSyAtIFdJRFRIX0tOT0IgKzEpIHtcbiAgLy9cbiAgLy8gICAgIH1cbiBcbiAga25vYk1heC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgLy9zdGF0ZSAgU3RhdGVEcmFnLkxPTkdQUkVTUztcbiAga25vYk1pbi5zdHlsZS5iYWNrZ3JvdW5kID0gJyMyMTNGOEQnO1xuICBrbm9iTWF4LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgdXBkYXRlU2VnbWVudEZlZWRiYWNrKCk7XG59XG5cbmZ1bmN0aW9uIHN0b3BDcmVhdGVTZWdtZW50KGUsIHN0b3BTZWdtZW50KSB7XG4gIGxldCB0aW1lckxpZmVTZWdtZW50ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAga25vYk1heC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIGtub2JNaW4uc3R5bGUuYmFja2dyb3VuZCA9ICcjZmZmZmZmJztcbiAgICAvL2NyZWF0ZUNhcmQoKTtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVyTGlmZVNlZ21lbnQpO1xuICAgIC8vY29uc29sZS5sb2coXCJBQUEgOiBcIiArIHBhcnNlSW50KGtub2JNYXguc3R5bGUubGVmdCwxMCkpO1xuICAgIFxuICAgIFxuICAgIHZhciBzdGFydFAgPSBwYXJzZUludChrbm9iTWF4LnN0eWxlLmxlZnQsIDEwKSArIFdJRFRIX01JRF9LTk9CX01JTiAvIDI7XG4gICAgdmFyIGVuZFAgPSBwYXJzZUludChrbm9iTWluLnN0eWxlLmxlZnQsIDEwKSArIFdJRFRIX0tOT0I7XG4gICAgXG4gICAvLyBjYXJkTWFuYWdlci5leGVjdXRlKG5ldyBDcmVhdGVOZXdDYXJkQ29tbWFuZChzdGFydFAsIGVuZFApKTtcbiAgICBpZihzdGFydFAgPCAwKXtcbiAgICAgIHN0YXJ0UCA9IDA7XG4gICAgfVxuICAgIGNyZWF0ZU5ld0NhcmQoc3RhcnRQLGVuZFAgKTtcbiAgICBwbGF5KCk7XG4gIH0sIDcwMCk7XG59XG5cblxuXG5cbi8vVXBkYXRlIHRoZSBmZWVkYmFjayBvZiB0aGUgY3JlYXRpb24gb2YgYSBzZWdtZW50IGFmdGVyIGEgbG9uZyBwcmVzc1xuZnVuY3Rpb24gdXBkYXRlU2VnbWVudEZlZWRiYWNrKCkge1xuICBcbiAgXG4gIFxuICBpZiAocGFyc2VJbnQoa25vYk1pbi5zdHlsZS5sZWZ0LCAxMCkgPiBwYXJzZUludChrbm9iTWF4LnN0eWxlLmxlZnQsIDEwKSkge1xuICAgIHNlZ21lbnRGZWVkYmFjay5kaXZHcmFwaGljYWxPYmplY3Quc3R5bGUubWFyZ2luTGVmdCA9IGtub2JNYXguc3R5bGUubGVmdCAgIDtcbiAgfSBlbHNlIHtcbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLm1hcmdpbkxlZnQgPSBrbm9iTWluLnN0eWxlLmxlZnQgICAgO1xuICB9XG4gIHNlZ21lbnRGZWVkYmFjay5kaXZHcmFwaGljYWxPYmplY3Quc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLndpZHRoID0gTWF0aC5hYnMoKHBhcnNlSW50KGtub2JNaW4uc3R5bGUubGVmdCwgMTApIC0gcGFyc2VJbnQoa25vYk1heC5zdHlsZS5sZWZ0LCAxMCkgICApKSArIFdJRFRIX0tOT0IgKyBcInB4XCI7XG4gIFxuICBcbiAgaWYocGFyc2VJbnQoc2VnbWVudEZlZWRiYWNrLmRpdkdyYXBoaWNhbE9iamVjdC5zdHlsZS5tYXJnaW5MZWZ0LCAxMCkgPCAwICl7XG4gICAgLy90aGUgY2FzZSBpZiB0aGUga25vYiBpcyBpbiB0aGUgZXh0cmVtdW4gb2YgdGhlIGxvYWRlci5cbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLm1hcmdpbkxlZnQgPSBcIiAwIHB4XCIgO1xuICB9XG4gIFxufVxuXG5cbi8qXG5cbi8vc3RhcnQgcG9zaXRpb24gb24gdGhlIHNsaWRlciBhbmQgZW5kIHBvc2l0aW9uIG9uIHRoZSBzbGlkZXJcbmZ1bmN0aW9uIHZpZGVvVG9TbGlkZXIoc3RhcnREdXJhdGlvblZpZGVvLCBlbmREdXJhdGlvblZpZGVvKSB7XG4gIHZhciBzdGFydFAgPSBNYXRoLnJvdW5kKCgoc3RhcnREdXJhdGlvblZpZGVvICogTlVNQkVSX09GX1RJQ0spIC8gdmlkZW8uZHVyYXRpb24pIC0gcmFuZ2VTbGlkZXJUcmFjay5vZmZzZXRMZWZ0KTtcbiAgdmFyIGVuZFAgPSBNYXRoLnJvdW5kKCgoZW5kRHVyYXRpb25WaWRlbyAqIE5VTUJFUl9PRl9USUNLKSAvIHZpZGVvLmR1cmF0aW9uKSAtIHJhbmdlU2xpZGVyVHJhY2sub2Zmc2V0TGVmdCk7XG4gIHJldHVybiB7XG4gICAgc3RhcnRQb3NpdGlvbjogc3RhcnRQLFxuICAgIGVuZFBvc2l0aW9uOiBlbmRQXG4gIH07XG59XG4qL1xuXG52YXIga25vYk1pbk1vdmUgPSBmdW5jdGlvbihlKSB7XG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5ET1dOOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRSQUc7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiIGRyYWdpbmcgZXRhdCBkb3duXCIpO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFN0YXRlRHJhZy5EUkFHOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRSQUc7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIiBkcmFnaW5nIGV0YXQgZHJhZ1wiKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFN0YXRlRHJhZy5MT05HUFJFU1M6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuTE9OR1BSRVNTO1xuICAgICAgLy9jb25zb2xlLmxvZyhcInN0YXRlIGxvbmdwcmVzcyB3aXRoIG1vdXNlIG1vdmVcIik7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgdXBkYXRlU2VnbWVudEZlZWRiYWNrKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn07XG5cblxudmFyIGtub2JNaW5DbGljayA9IGZ1bmN0aW9uKGUpIHtcbiAgLy9jb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0ga25vYk1pbkNsaWNrXCIgKTtcbiAgcGF1c2UoKTtcbiAgLy9VcGRhdGUgdmlkZW8gcG9zaXRpb25cbiAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgU3RhdGVEcmFnLklETEU6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuRE9XTjtcbiAgICAgIGNsZWFyQWxsVGltZXIoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICAvL2UucHJldmVudERlZmF1bHQoKTtcbn07XG5cblxudmFyIHJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayA9IGZ1bmN0aW9uKGUpIHtcbiAgLy9jb25zb2xlLmxvZyhcIlwiKTtcbiAgLy9jb25zb2xlLmxvZyhcIm1vdXNlIHVwICwgZXRhdCA6IFwiICsgc3RhdGUpO1xuICAvLyBjb25zb2xlLmxvZyhcInJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayA6IFwiICsgc3RhdGUpO1xuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuRE9XTjpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkRSQUc6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0gcmFuZ2VTbGlkZXJUcmFja0VuZENhbGxiYWNrIGwyODUgc3RhdGUgbWFjaGluZVwiKTtcbiAgICAgIHBhdXNlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuTE9OR1BSRVNTOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgc3RvcENyZWF0ZVNlZ21lbnQoZSwgdmlkZW8uY3VycmVudFRpbWUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICB9XG4gIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn07XG5cbnZhciBrbm9iTWluTW91c2VMZWF2ZUNhbGxiYWNrID0gZnVuY3Rpb24oZSkge1xuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuRE9XTjpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5EUkFHO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkRSQUc6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuRFJBRztcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuTE9OR1BSRVNTOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgc3RvcENyZWF0ZVNlZ21lbnQoZSwgdmlkZW8uY3VycmVudFRpbWUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIFxuICB9XG4gIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn07XG5cbiJdfQ==