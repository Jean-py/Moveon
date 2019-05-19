"use strict";

var knobMin = document.getElementById("range-slider_handle-min");
var rangeSliderTrack = document.getElementById("rangeSliderTrack");
var knobMax = document.getElementById("range-slider_handle-max");

//Option for the longpress and the speed of the video_current
var speedrate = 1;
var longPressDelay = "500";

var WIDTH_KNOB = 30;

//State for the creation of segment by Drag and drop
var StateDrag = {
  IDLE: 0,
  DOWN: 1,
  DRAG: 2,
  LONGPRESS: 3,
  STARTED: 4

};
var state = StateDrag.IDLE;

var timePositionStart = 0;
var timePositionStop = 0;
var positionStart = 0;
var positionStop = 0;

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

//if (!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
if (knobMin != null) {
  //Mouse
  knobMin.addEventListener("mousedown", function (e) {
    console.log("mousedown knob");
    switch (state) {
      case StateDrag.STARTED:
        {
          stopCreateSegment();
          break;
        }
      case StateDrag.IDLE:
        {
          knobMinClick(e);
          break;
        }
    }
  }, {
    passive: true
  });

  segmentFeedback.divGraphicalObject.addEventListener("mousedown", function (e) {
    switch (state) {
      case StateDrag.STARTED:
        {
          stopCreateSegment();
          break;
        }
    }
  }, {
    passive: true
  });

  //Mouse
  knobMin.addEventListener("touchend", function (e) {
    console.log("touchstart knob");

    switch (state) {
      case StateDrag.STARTED:
        {
          stopCreateSegment();
          break;
        }
      case StateDrag.IDLE:
        {
          knobMinClick(e);
          break;
        }
    }
  }, {
    passive: true
  });

  segmentFeedback.divGraphicalObject.addEventListener("touchstart", function (e) {
    switch (state) {
      case StateDrag.STARTED:
        {
          stopCreateSegment();
          break;
        }
    }
  }, {
    passive: true
  });
} else {} /* else {
          if(knobMin != null) {
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
              /!*-----MOUSE LONG PRESS-------*!/
           knobMin.setAttribute("data-long-press-delay", longPressDelay);
           knobMin.addEventListener('long-press', function(e) {
             // console.log('knobMin.addEventListener(longpress');
             pause();
             longpressCreateSegmentCallback(e);
           });
          }
           if(rangeSliderTrack != null){
           
           
           rangeSliderTrack.addEventListener("touchstart", function(e) {
             ranglerSliderTrackClick(e);
           }, {
             passive: true
           });
           rangeSliderTrack.addEventListener("touchend", function(e) {
             rangeSliderTrackEndCallback(e);
           }, {
             passive: true
           });
                rangeSliderTrack.addEventListener("long-press", function(e) {
               // console.log('rangeSliderTrack.addEventListener(longpress');
               pause();
               longpressCreateSegmentCallback(e);
             }, false);
          }
          if(video_current !=null){
              video_current.addEventListener("touchmove", function(e) {
             videoTouchMoveCallback(e);
           }, {
             passive: true
           });
          }
          if(video_current != null){
              video_current.addEventListener("touchmove", function(e) {
             videoTouchMoveCallback(e);
           }, {
             passive: true
           });
          }
          }*/
//}


/*window.addEventListener("mouseup", function(e){
  rangeSliderTrackEndCallback(e);
}, false);
window.addEventListener("mousemove", function(e){
  knobMinMove(e);
},true );*/

/*Callback function*/
var longpressCreateSegmentCallback = function longpressCreateSegmentCallback(e) {
  e.preventDefault();
  switch (state) {
    case StateDrag.DOWN:
      {
        state = StateDrag.LONGPRESS;
        startCreateSegment();
        break;
      }
  }
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
        stopCreateSegment(e, video_current.currentTime);
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
function startCreateSegment() {

  knobMax.style.position = "absolute";
  knobMax.style.left = knobMin.style.left;
  knobMax.style.visibility = "visible";
  segmentFeedback.divGraphicalObject.style.visibility = "visible";

  //state  StateDrag.LONGPRESS;
  knobMin.style.setProperty('background', '--fourth-color');
  updateSegmentFeedback();
}

function stopCreateSegment() {
  console.log("stop create segment");
  video_current.ready(function () {
    this.off('timeupdate', updateSegmentFeedback);
  });

  positionStop = knobMin.style.left;
  state = StateDrag.IDLE;
  var timerLifeSegment = window.setTimeout(function () {
    knobMax.style.visibility = "hidden";
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
    knobMin.style.setProperty("background", "var(--secondary-color)");
    window.clearTimeout(timerLifeSegment);

    timePositionStop = video_current.currentTime();

    //TODO regarder aussi le fait d'enlever le listener change sur le knobmin?
    //TODO voir ici la creation de carte pour la mettre au bon endroit, checker aussi startP et endP
    player.createNewCard(timePositionStart, timePositionStop, positionStart, positionStop, segmentFeedback.divGraphicalObject.style.width);
    play();
  }, 700);
}

//Update the feedback of the creation of a segment after a long press
function updateSegmentFeedback() {
  segmentFeedback.divGraphicalObject.style.marginLeft = knobMax.style.left;
  if (parseFloat(knobMin.style.left, 10) > parseFloat(knobMax.style.left, 10)) {
    segmentFeedback.divGraphicalObject.style.width = parseFloat(knobMin.style.left, 10) - parseFloat(knobMax.style.left, 10) + "%";
  } else {
    segmentFeedback.divGraphicalObject.style.marginLeft = knobMin.style.left;
    segmentFeedback.divGraphicalObject.style.width = parseFloat(knobMax.style.left, 10) - parseFloat(knobMin.style.left, 10) + "%";
  }
}

/*

//start position on the slider and end position on the slider
function videoToSlider(startDurationVideo, endDurationVideo) {
  var startP = Math.round(((startDurationVideo * NUMBER_OF_TICK) / video_current.duration) - rangeSliderTrack.offsetLeft);
  var endP = Math.round(((endDurationVideo * NUMBER_OF_TICK) / video_current.duration) - rangeSliderTrack.offsetLeft);
  return {
    startPosition: startP,
    endPosition: endP
  };
}
*/

var knobMinMove = function knobMinMove(e) {
  console.log("knobMinMove");
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
  state = StateDrag.STARTED;
  knobMin.style.left;
  startCreateSegment();
  //updateKnobAndVideoWrapper(e);
  //console.log("function - knobMinUpCallback appel pause l165 statemachine ");
  pause();
  timePositionStart = video_current.currentTime();
  positionStart = knobMin.style.left;
  video_current.ready(function () {
    this.on('timeupdate', updateSegmentFeedback);
  });
  clearAllTimer();
};

/*
var knobMinClick = function(e) {
  //console.log("function - knobMinClick" );
  pause();
  //Update video_current position
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
*/

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
        stopCreateSegment();
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
        stopCreateSegment();
        break;
      }

  }
  //event.preventDefault();
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRlTWFjaGluZUNyZWF0ZVNlZ21lbnQuanMiXSwibmFtZXMiOlsia25vYk1pbiIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyYW5nZVNsaWRlclRyYWNrIiwia25vYk1heCIsInNwZWVkcmF0ZSIsImxvbmdQcmVzc0RlbGF5IiwiV0lEVEhfS05PQiIsIlN0YXRlRHJhZyIsIklETEUiLCJET1dOIiwiRFJBRyIsIkxPTkdQUkVTUyIsIlNUQVJURUQiLCJzdGF0ZSIsInRpbWVQb3NpdGlvblN0YXJ0IiwidGltZVBvc2l0aW9uU3RvcCIsInBvc2l0aW9uU3RhcnQiLCJwb3NpdGlvblN0b3AiLCJzZWdtZW50RmVlZGJhY2siLCJ3aWR0aCIsInN0YXJ0UG9zdGlvbiIsImVuZFBvc2l0aW9uIiwic3RhcnREdXJhdGlvblZpZGVvIiwiZW5kRHVyYXRpb25WaWRlbyIsImRpc3BsYXllZCIsImRpdkdyYXBoaWNhbE9iamVjdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiY29uc29sZSIsImxvZyIsInN0b3BDcmVhdGVTZWdtZW50Iiwia25vYk1pbkNsaWNrIiwicGFzc2l2ZSIsImxvbmdwcmVzc0NyZWF0ZVNlZ21lbnRDYWxsYmFjayIsInByZXZlbnREZWZhdWx0Iiwic3RhcnRDcmVhdGVTZWdtZW50IiwidmlkZW9Ub3VjaE1vdmVDYWxsYmFjayIsInJhbmdsZXJTbGlkZXJUcmFja0NsaWNrIiwiY2xlYXJBbGxUaW1lciIsInVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIiLCJmZWVkYmFja09uU2xpZGVyVmlkZW8iLCJwbGF5Iiwia25vYk1pblVwQ2FsbGJhY2siLCJ2aWRlb19jdXJyZW50IiwiY3VycmVudFRpbWUiLCJwYXVzZSIsInN0eWxlIiwicG9zaXRpb24iLCJsZWZ0IiwidmlzaWJpbGl0eSIsInNldFByb3BlcnR5IiwidXBkYXRlU2VnbWVudEZlZWRiYWNrIiwicmVhZHkiLCJvZmYiLCJ0aW1lckxpZmVTZWdtZW50Iiwid2luZG93Iiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInBsYXllciIsImNyZWF0ZU5ld0NhcmQiLCJtYXJnaW5MZWZ0IiwicGFyc2VGbG9hdCIsImtub2JNaW5Nb3ZlIiwib24iLCJyYW5nZVNsaWRlclRyYWNrRW5kQ2FsbGJhY2siLCJrbm9iTWluTW91c2VMZWF2ZUNhbGxiYWNrIl0sIm1hcHBpbmdzIjoiOztBQUNBLElBQUlBLFVBQVVDLFNBQVNDLGNBQVQsQ0FBd0IseUJBQXhCLENBQWQ7QUFDQSxJQUFJQyxtQkFBbUJGLFNBQVNDLGNBQVQsQ0FBd0Isa0JBQXhCLENBQXZCO0FBQ0EsSUFBSUUsVUFBVUgsU0FBU0MsY0FBVCxDQUF3Qix5QkFBeEIsQ0FBZDs7QUFFQTtBQUNBLElBQUlHLFlBQVksQ0FBaEI7QUFDQSxJQUFJQyxpQkFBaUIsS0FBckI7O0FBRUEsSUFBSUMsYUFBYSxFQUFqQjs7QUFFQTtBQUNBLElBQUlDLFlBQVk7QUFDZEMsUUFBTSxDQURRO0FBRWRDLFFBQU0sQ0FGUTtBQUdkQyxRQUFNLENBSFE7QUFJZEMsYUFBVyxDQUpHO0FBS2RDLFdBQVM7O0FBTEssQ0FBaEI7QUFRQSxJQUFJQyxRQUFRTixVQUFVQyxJQUF0Qjs7QUFFQSxJQUFJTSxvQkFBb0IsQ0FBeEI7QUFDQSxJQUFJQyxtQkFBbUIsQ0FBdkI7QUFDQSxJQUFJQyxnQkFBZ0IsQ0FBcEI7QUFDQSxJQUFJQyxlQUFlLENBQW5COztBQUdBO0FBQ0EsSUFBSUMsa0JBQWtCO0FBQ3BCQyxTQUFPLEVBRGE7QUFFcEJDLGdCQUFjLEVBRk07QUFHcEJDLGVBQWEsRUFITztBQUlwQkMsc0JBQW9CLEVBSkE7QUFLcEJDLG9CQUFrQixFQUxFO0FBTXBCQyxhQUFXLEtBTlM7QUFPcEJDLHNCQUFvQnpCLFNBQVNDLGNBQVQsQ0FBd0IsZUFBeEI7QUFQQSxDQUF0Qjs7QUFXQTtBQUNFLElBQUdGLFdBQVcsSUFBZCxFQUFtQjtBQUNqQjtBQUNBQSxVQUFRMkIsZ0JBQVIsQ0FBeUIsV0FBekIsRUFBc0MsVUFBU0MsQ0FBVCxFQUFZO0FBQ2hEQyxZQUFRQyxH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QUFVSSxTQUFmO0FBQ0E7QUFDRUUsZ0JBQVFOLFVBQVVDLElBQWxCO0FBQ0ErQixrQ0FBMEJaLENBQTFCO0FBQ0FHO0FBQ0E7QUFDRDtBQXBCSDtBQXNCQTtBQUNELENBM0JEOztBQTZCQSxJQUFJbUMsNEJBQTRCLFNBQTVCQSx5QkFBNEIsQ0FBU3RDLENBQVQsRUFBWTtBQUMxQyxVQUFRZCxLQUFSO0FBQ0UsU0FBS04sVUFBVUUsSUFBZjtBQUNBO0FBQ0VJLGdCQUFRTixVQUFVRyxJQUFsQjtBQUNBO0FBQ0Q7QUFDRCxTQUFLSCxVQUFVRyxJQUFmO0FBQ0E7QUFDRUcsZ0JBQVFOLFVBQVVHLElBQWxCO0FBQ0E2QixrQ0FBMEJaLENBQTFCO0FBQ0E7QUFDRDtBQUNELFNBQUtwQixVQUFVSSxTQUFmO0FBQ0E7QUFDRUUsZ0JBQVFOLFVBQVVDLElBQWxCO0FBQ0ErQixrQ0FBMEJaLENBQTFCO0FBQ0FHO0FBQ0E7QUFDRDs7QUFsQkg7QUFxQkE7QUFDRCxDQXZCRCIsImZpbGUiOiJzdGF0ZU1hY2hpbmVDcmVhdGVTZWdtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG52YXIga25vYk1pbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZ2Utc2xpZGVyX2hhbmRsZS1taW5cIik7XG52YXIgcmFuZ2VTbGlkZXJUcmFjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmFuZ2VTbGlkZXJUcmFja1wiKTtcbnZhciBrbm9iTWF4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYW5nZS1zbGlkZXJfaGFuZGxlLW1heFwiKTtcblxuLy9PcHRpb24gZm9yIHRoZSBsb25ncHJlc3MgYW5kIHRoZSBzcGVlZCBvZiB0aGUgdmlkZW9fY3VycmVudFxudmFyIHNwZWVkcmF0ZSA9IDE7XG52YXIgbG9uZ1ByZXNzRGVsYXkgPSBcIjUwMFwiO1xuXG52YXIgV0lEVEhfS05PQiA9IDMwO1xuXG4vL1N0YXRlIGZvciB0aGUgY3JlYXRpb24gb2Ygc2VnbWVudCBieSBEcmFnIGFuZCBkcm9wXG5sZXQgU3RhdGVEcmFnID0ge1xuICBJRExFOiAwLFxuICBET1dOOiAxLFxuICBEUkFHOiAyLFxuICBMT05HUFJFU1M6IDMsXG4gIFNUQVJURUQ6IDQsXG4gIFxufTtcbnZhciBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuXG52YXIgdGltZVBvc2l0aW9uU3RhcnQgPSAwO1xudmFyIHRpbWVQb3NpdGlvblN0b3AgPSAwO1xudmFyIHBvc2l0aW9uU3RhcnQgPSAwO1xudmFyIHBvc2l0aW9uU3RvcCA9IDA7XG5cblxuLy9HcmFwaGljYWwgb2JqZWN0IG9mIGZlZWRiYWNrXG52YXIgc2VnbWVudEZlZWRiYWNrID0ge1xuICB3aWR0aDogXCJcIixcbiAgc3RhcnRQb3N0aW9uOiBcIlwiLFxuICBlbmRQb3NpdGlvbjogXCJcIixcbiAgc3RhcnREdXJhdGlvblZpZGVvOiBcIlwiLFxuICBlbmREdXJhdGlvblZpZGVvOiBcIlwiLFxuICBkaXNwbGF5ZWQ6IGZhbHNlLFxuICBkaXZHcmFwaGljYWxPYmplY3Q6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VnbWVudE1pbk1heFwiKVxufTtcblxuXG4vL2lmICghbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZHxCbGFja0JlcnJ5fGlQaG9uZXxpUGFkfGlQb2R8T3BlcmEgTWluaXxJRU1vYmlsZS9pKSkge1xuICBpZihrbm9iTWluICE9IG51bGwpe1xuICAgIC8vTW91c2VcbiAgICBrbm9iTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgY29uc29sZS5sb2coXCJtb3VzZWRvd24ga25vYlwiKTtcbiAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgY2FzZSBTdGF0ZURyYWcuU1RBUlRFRDp7XG4gICAgICAgICAgc3RvcENyZWF0ZVNlZ21lbnQoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFN0YXRlRHJhZy5JRExFIDoge1xuICAgICAgICAgIGtub2JNaW5DbGljayhlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgfSwge1xuICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgIH0pO1xuICBcbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oZSkge1xuICAgICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgICBjYXNlIFN0YXRlRHJhZy5TVEFSVEVEOntcbiAgICAgICAgICBzdG9wQ3JlYXRlU2VnbWVudCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gIFxuICAgIH0sIHtcbiAgICAgIHBhc3NpdmU6IHRydWVcbiAgICB9KTtcbiAgXG4gICAgICAvL01vdXNlXG4gICAgICBrbm9iTWluLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidG91Y2hzdGFydCBrbm9iXCIpXG4gIFxuICAgICAgICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgICAgICAgY2FzZSBTdGF0ZURyYWcuU1RBUlRFRDp7XG4gICAgICAgICAgICBzdG9wQ3JlYXRlU2VnbWVudCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhc2UgU3RhdGVEcmFnLklETEUgOiB7XG4gICAgICAgICAgICBrbm9iTWluQ2xpY2soZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgfSwge1xuICAgICAgICBwYXNzaXZlOiB0cnVlXG4gICAgICB9KTtcbiAgXG4gIFxuICAgIFxuICAgICAgc2VnbWVudEZlZWRiYWNrLmRpdkdyYXBoaWNhbE9iamVjdC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICBjYXNlIFN0YXRlRHJhZy5TVEFSVEVEOntcbiAgICAgICAgICAgIHN0b3BDcmVhdGVTZWdtZW50KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgfSwge1xuICAgICAgICBwYXNzaXZlOiB0cnVlXG4gICAgICB9KTtcbiAgICBcbiAgICBcbiAgICBcbiAgICB9IGVsc2Uge1xuICBcbiAgfS8qIGVsc2Uge1xuICBpZihrbm9iTWluICE9IG51bGwpIHtcbiAgXG4gICAgLy9Ub3VjaFxuICAgIGtub2JNaW4uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGtub2JNaW5DbGljayhlKTtcbiAgICB9LCB7XG4gICAgICBwYXNzaXZlOiB0cnVlXG4gICAgfSk7XG4gICAga25vYk1pbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBrbm9iTWluTW92ZShlKTtcbiAgICB9LCB7XG4gICAgICBwYXNzaXZlOiB0cnVlXG4gICAgfSk7XG4gICAga25vYk1pbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGtub2JNaW5VcENhbGxiYWNrKGUpO1xuICAgIH0sIHtcbiAgICAgIHBhc3NpdmU6IHRydWVcbiAgICB9KTtcbiAgXG4gICAgLyEqLS0tLS1NT1VTRSBMT05HIFBSRVNTLS0tLS0tLSohL1xuICAgIGtub2JNaW4uc2V0QXR0cmlidXRlKFwiZGF0YS1sb25nLXByZXNzLWRlbGF5XCIsIGxvbmdQcmVzc0RlbGF5KTtcbiAgICBrbm9iTWluLmFkZEV2ZW50TGlzdGVuZXIoJ2xvbmctcHJlc3MnLCBmdW5jdGlvbihlKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygna25vYk1pbi5hZGRFdmVudExpc3RlbmVyKGxvbmdwcmVzcycpO1xuICAgICAgcGF1c2UoKTtcbiAgICAgIGxvbmdwcmVzc0NyZWF0ZVNlZ21lbnRDYWxsYmFjayhlKTtcbiAgICB9KTtcbiAgfVxuICAgIGlmKHJhbmdlU2xpZGVyVHJhY2sgIT0gbnVsbCl7XG4gICAgXG4gICAgXG4gICAgcmFuZ2VTbGlkZXJUcmFjay5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBmdW5jdGlvbihlKSB7XG4gICAgICByYW5nbGVyU2xpZGVyVHJhY2tDbGljayhlKTtcbiAgICB9LCB7XG4gICAgICBwYXNzaXZlOiB0cnVlXG4gICAgfSk7XG4gICAgcmFuZ2VTbGlkZXJUcmFjay5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgcmFuZ2VTbGlkZXJUcmFja0VuZENhbGxiYWNrKGUpO1xuICAgIH0sIHtcbiAgICAgIHBhc3NpdmU6IHRydWVcbiAgICB9KTtcbiAgXG4gICAgICByYW5nZVNsaWRlclRyYWNrLmFkZEV2ZW50TGlzdGVuZXIoXCJsb25nLXByZXNzXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3JhbmdlU2xpZGVyVHJhY2suYWRkRXZlbnRMaXN0ZW5lcihsb25ncHJlc3MnKTtcbiAgICAgICAgcGF1c2UoKTtcbiAgICAgICAgbG9uZ3ByZXNzQ3JlYXRlU2VnbWVudENhbGxiYWNrKGUpO1xuICAgICAgfSwgZmFsc2UpO1xuICB9XG4gIGlmKHZpZGVvX2N1cnJlbnQgIT1udWxsKXtcbiAgXG4gICAgdmlkZW9fY3VycmVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZpZGVvVG91Y2hNb3ZlQ2FsbGJhY2soZSk7XG4gICAgfSwge1xuICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgIH0pO1xuICB9XG4gIGlmKHZpZGVvX2N1cnJlbnQgIT0gbnVsbCl7XG4gIFxuICAgIHZpZGVvX2N1cnJlbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBmdW5jdGlvbihlKSB7XG4gICAgICB2aWRlb1RvdWNoTW92ZUNhbGxiYWNrKGUpO1xuICAgIH0sIHtcbiAgICAgIHBhc3NpdmU6IHRydWVcbiAgICB9KTtcbiAgfVxufSovXG4vL31cblxuXG4vKndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKXtcbiAgcmFuZ2VTbGlkZXJUcmFja0VuZENhbGxiYWNrKGUpO1xufSwgZmFsc2UpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZSl7XG4gIGtub2JNaW5Nb3ZlKGUpO1xufSx0cnVlICk7Ki9cblxuXG5cblxuXG4vKkNhbGxiYWNrIGZ1bmN0aW9uKi9cbnZhciBsb25ncHJlc3NDcmVhdGVTZWdtZW50Q2FsbGJhY2sgPSBmdW5jdGlvbihlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgU3RhdGVEcmFnLkRPV046XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuTE9OR1BSRVNTO1xuICAgICAgc3RhcnRDcmVhdGVTZWdtZW50KCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbn07XG5cbnZhciB2aWRlb1RvdWNoTW92ZUNhbGxiYWNrID0gZnVuY3Rpb24oZSkge1xuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuSURMRTpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5EUkFHO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59O1xuXG52YXIgcmFuZ2xlclNsaWRlclRyYWNrQ2xpY2sgPSBmdW5jdGlvbihlKSB7XG4gIC8vICBjb25zb2xlLmxvZyhcInJhbmdsZXJTbGlkZXJUcmFja0NsaWNrIHN0YXRlIDogXCIgKyBzdGF0ZSk7XG4gIC8vIHBhdXNlKCk7XG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5JRExFOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRPV047XG4gICAgICBjbGVhckFsbFRpbWVyKCk7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgZmVlZGJhY2tPblNsaWRlclZpZGVvKGZhbHNlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gLSByYW5nbGVyU2xpZGVyVHJhY2tDbGljayBhcHBlbCBwbGF5IGwxNDcgc3RhdGVtYWNoaW5lIFwiKTtcbiAgcGxheSgpO1xufTtcblxudmFyIGtub2JNaW5VcENhbGxiYWNrID0gZnVuY3Rpb24oZSkge1xuICAvL2NvbnNvbGUubG9nKFwiKioqa25vYk1pblVwQ2FsbGJhY2sgKioqIFwiKyBzdGF0ZSk7XG4gIHN3aXRjaCAoc3RhdGUpIHtcbiAgICBjYXNlIFN0YXRlRHJhZy5JRExFOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gLSBrbm9iTWluVXBDYWxsYmFjayBhcHBlbCBwbGF5IFwiKTtcbiAgICAgIC8vcGxheSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkxPTkdQUkVTUzpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIHN0b3BDcmVhdGVTZWdtZW50KGUsIHZpZGVvX2N1cnJlbnQuY3VycmVudFRpbWUpO1xuICAgICAgLy9jb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0ga25vYk1pblVwQ2FsbGJhY2sgYXBwZWwgcGF1c2UgbDE2NCBzdGF0ZW1hY2hpbmUgXCIpO1xuICAgICAgcGxheSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkRSQUc6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gLSBrbm9iTWluVXBDYWxsYmFjayBhcHBlbCBwYXVzZSBsMTY1IHN0YXRlbWFjaGluZSBcIik7XG4gICAgICBwYXVzZSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkRPV046XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gLSBrbm9iTWluVXBDYWxsYmFjayBhcHBlbCBwYXVzZSBsMTcyIHN0YXRlbWFjaGluZSBcIik7XG4gICAgICBwYXVzZSgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIFxuICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59O1xuXG5cbi8vQ3JlYXRlIFNlZ21lbnRcbmZ1bmN0aW9uIHN0YXJ0Q3JlYXRlU2VnbWVudCgpIHtcbiAgXG4gIGtub2JNYXguc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gIGtub2JNYXguc3R5bGUubGVmdCA9IGtub2JNaW4uc3R5bGUubGVmdDtcbiAga25vYk1heC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gIHNlZ21lbnRGZWVkYmFjay5kaXZHcmFwaGljYWxPYmplY3Quc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICBcbiAgLy9zdGF0ZSAgU3RhdGVEcmFnLkxPTkdQUkVTUztcbiAga25vYk1pbi5zdHlsZS5zZXRQcm9wZXJ0eSgnYmFja2dyb3VuZCcsJy0tZm91cnRoLWNvbG9yJyk7XG4gIHVwZGF0ZVNlZ21lbnRGZWVkYmFjaygpO1xuICBcbiAgXG59XG5cbmZ1bmN0aW9uIHN0b3BDcmVhdGVTZWdtZW50KCkge1xuICBjb25zb2xlLmxvZyhcInN0b3AgY3JlYXRlIHNlZ21lbnRcIik7XG4gIHZpZGVvX2N1cnJlbnQucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub2ZmKCd0aW1ldXBkYXRlJywgdXBkYXRlU2VnbWVudEZlZWRiYWNrKTtcbiAgfSk7XG4gIFxuICBwb3NpdGlvblN0b3AgPSBrbm9iTWluLnN0eWxlLmxlZnQ7XG4gIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gIGxldCB0aW1lckxpZmVTZWdtZW50ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAga25vYk1heC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIGtub2JNaW4uc3R5bGUuc2V0UHJvcGVydHkoXCJiYWNrZ3JvdW5kXCIsXCJ2YXIoLS1zZWNvbmRhcnktY29sb3IpXCIpO1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZXJMaWZlU2VnbWVudCk7XG4gICAgXG4gICAgXG4gICAgIHRpbWVQb3NpdGlvblN0b3AgPSB2aWRlb19jdXJyZW50LmN1cnJlbnRUaW1lKCk7XG4gICAgXG4gICAgLy9UT0RPIHJlZ2FyZGVyIGF1c3NpIGxlIGZhaXQgZCdlbmxldmVyIGxlIGxpc3RlbmVyIGNoYW5nZSBzdXIgbGUga25vYm1pbj9cbiAgICAvL1RPRE8gdm9pciBpY2kgbGEgY3JlYXRpb24gZGUgY2FydGUgcG91ciBsYSBtZXR0cmUgYXUgYm9uIGVuZHJvaXQsIGNoZWNrZXIgYXVzc2kgc3RhcnRQIGV0IGVuZFBcbiAgICBwbGF5ZXIuY3JlYXRlTmV3Q2FyZCh0aW1lUG9zaXRpb25TdGFydCx0aW1lUG9zaXRpb25TdG9wLCBwb3NpdGlvblN0YXJ0LHBvc2l0aW9uU3RvcCxzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLndpZHRoICApO1xuICAgIHBsYXkoKTtcbiAgfSwgNzAwKTtcbn1cblxuXG5cblxuLy9VcGRhdGUgdGhlIGZlZWRiYWNrIG9mIHRoZSBjcmVhdGlvbiBvZiBhIHNlZ21lbnQgYWZ0ZXIgYSBsb25nIHByZXNzXG5mdW5jdGlvbiB1cGRhdGVTZWdtZW50RmVlZGJhY2soKSB7XG4gIHNlZ21lbnRGZWVkYmFjay5kaXZHcmFwaGljYWxPYmplY3Quc3R5bGUubWFyZ2luTGVmdCA9IGtub2JNYXguc3R5bGUubGVmdCA7XG4gIGlmKHBhcnNlRmxvYXQoa25vYk1pbi5zdHlsZS5sZWZ0LDEwKSAgPiBwYXJzZUZsb2F0KGtub2JNYXguc3R5bGUubGVmdCwxMCkgKXtcbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLndpZHRoID0gcGFyc2VGbG9hdChrbm9iTWluLnN0eWxlLmxlZnQsMTApIC0gcGFyc2VGbG9hdChrbm9iTWF4LnN0eWxlLmxlZnQsMTApICArXCIlXCI7XG4gIH0gZWxzZSB7XG4gICAgc2VnbWVudEZlZWRiYWNrLmRpdkdyYXBoaWNhbE9iamVjdC5zdHlsZS5tYXJnaW5MZWZ0ID0ga25vYk1pbi5zdHlsZS5sZWZ0IDtcbiAgICBzZWdtZW50RmVlZGJhY2suZGl2R3JhcGhpY2FsT2JqZWN0LnN0eWxlLndpZHRoID0gcGFyc2VGbG9hdChrbm9iTWF4LnN0eWxlLmxlZnQsMTApIC0gcGFyc2VGbG9hdChrbm9iTWluLnN0eWxlLmxlZnQsMTApICtcIiVcIjtcbiAgfVxufVxuXG5cbi8qXG5cbi8vc3RhcnQgcG9zaXRpb24gb24gdGhlIHNsaWRlciBhbmQgZW5kIHBvc2l0aW9uIG9uIHRoZSBzbGlkZXJcbmZ1bmN0aW9uIHZpZGVvVG9TbGlkZXIoc3RhcnREdXJhdGlvblZpZGVvLCBlbmREdXJhdGlvblZpZGVvKSB7XG4gIHZhciBzdGFydFAgPSBNYXRoLnJvdW5kKCgoc3RhcnREdXJhdGlvblZpZGVvICogTlVNQkVSX09GX1RJQ0spIC8gdmlkZW9fY3VycmVudC5kdXJhdGlvbikgLSByYW5nZVNsaWRlclRyYWNrLm9mZnNldExlZnQpO1xuICB2YXIgZW5kUCA9IE1hdGgucm91bmQoKChlbmREdXJhdGlvblZpZGVvICogTlVNQkVSX09GX1RJQ0spIC8gdmlkZW9fY3VycmVudC5kdXJhdGlvbikgLSByYW5nZVNsaWRlclRyYWNrLm9mZnNldExlZnQpO1xuICByZXR1cm4ge1xuICAgIHN0YXJ0UG9zaXRpb246IHN0YXJ0UCxcbiAgICBlbmRQb3NpdGlvbjogZW5kUFxuICB9O1xufVxuKi9cblxudmFyIGtub2JNaW5Nb3ZlID0gZnVuY3Rpb24oZSkge1xuICBjb25zb2xlLmxvZyhcImtub2JNaW5Nb3ZlXCIpO1xuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuRE9XTjpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5EUkFHO1xuICAgICAgLy9jb25zb2xlLmxvZyhcIiBkcmFnaW5nIGV0YXQgZG93blwiKTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuRFJBRzpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5EUkFHO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIC8vY29uc29sZS5sb2coXCIgZHJhZ2luZyBldGF0IGRyYWdcIik7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuTE9OR1BSRVNTOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkxPTkdQUkVTUztcbiAgICAgIC8vY29uc29sZS5sb2coXCJzdGF0ZSBsb25ncHJlc3Mgd2l0aCBtb3VzZSBtb3ZlXCIpO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIHVwZGF0ZVNlZ21lbnRGZWVkYmFjaygpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59O1xuXG52YXIga25vYk1pbkNsaWNrID0gZnVuY3Rpb24oZSkge1xuICAvL2NvbnNvbGUubG9nKFwiZnVuY3Rpb24gLSBrbm9iTWluQ2xpY2tcIiApO1xuICBzdGF0ZSA9IFN0YXRlRHJhZy5TVEFSVEVEO1xuICBrbm9iTWluLnN0eWxlLmxlZnQ7XG4gIHN0YXJ0Q3JlYXRlU2VnbWVudCgpO1xuICAvL3VwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gIC8vY29uc29sZS5sb2coXCJmdW5jdGlvbiAtIGtub2JNaW5VcENhbGxiYWNrIGFwcGVsIHBhdXNlIGwxNjUgc3RhdGVtYWNoaW5lIFwiKTtcbiAgcGF1c2UoKTtcbiAgdGltZVBvc2l0aW9uU3RhcnQgPSB2aWRlb19jdXJyZW50LmN1cnJlbnRUaW1lKCk7XG4gIHBvc2l0aW9uU3RhcnQgPSBrbm9iTWluLnN0eWxlLmxlZnQ7XG4gIHZpZGVvX2N1cnJlbnQucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub24oJ3RpbWV1cGRhdGUnLCB1cGRhdGVTZWdtZW50RmVlZGJhY2spO1xuICB9KTtcbiAgY2xlYXJBbGxUaW1lcigpO1xuXG59O1xuXG4vKlxudmFyIGtub2JNaW5DbGljayA9IGZ1bmN0aW9uKGUpIHtcbiAgLy9jb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0ga25vYk1pbkNsaWNrXCIgKTtcbiAgcGF1c2UoKTtcbiAgLy9VcGRhdGUgdmlkZW9fY3VycmVudCBwb3NpdGlvblxuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuSURMRTpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5ET1dOO1xuICAgICAgY2xlYXJBbGxUaW1lcigpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIC8vZS5wcmV2ZW50RGVmYXVsdCgpO1xufTtcbiovXG5cblxudmFyIHJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayA9IGZ1bmN0aW9uKGUpIHtcbiAgLy9jb25zb2xlLmxvZyhcIlwiKTtcbiAgLy9jb25zb2xlLmxvZyhcIm1vdXNlIHVwICwgZXRhdCA6IFwiICsgc3RhdGUpO1xuICAvLyBjb25zb2xlLmxvZyhcInJhbmdlU2xpZGVyVHJhY2tFbmRDYWxsYmFjayA6IFwiICsgc3RhdGUpO1xuICBzd2l0Y2ggKHN0YXRlKSB7XG4gICAgY2FzZSBTdGF0ZURyYWcuRE9XTjpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkRSQUc6XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuSURMRTtcbiAgICAgIHVwZGF0ZUtub2JBbmRWaWRlb1dyYXBwZXIoZSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImZ1bmN0aW9uIC0gcmFuZ2VTbGlkZXJUcmFja0VuZENhbGxiYWNrIGwyODUgc3RhdGUgbWFjaGluZVwiKTtcbiAgICAgIHBhdXNlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBTdGF0ZURyYWcuTE9OR1BSRVNTOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLklETEU7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgc3RvcENyZWF0ZVNlZ21lbnQoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59O1xuXG52YXIga25vYk1pbk1vdXNlTGVhdmVDYWxsYmFjayA9IGZ1bmN0aW9uKGUpIHtcbiAgc3dpdGNoIChzdGF0ZSkge1xuICAgIGNhc2UgU3RhdGVEcmFnLkRPV046XG4gICAge1xuICAgICAgc3RhdGUgPSBTdGF0ZURyYWcuRFJBRztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFN0YXRlRHJhZy5EUkFHOlxuICAgIHtcbiAgICAgIHN0YXRlID0gU3RhdGVEcmFnLkRSQUc7XG4gICAgICB1cGRhdGVLbm9iQW5kVmlkZW9XcmFwcGVyKGUpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgU3RhdGVEcmFnLkxPTkdQUkVTUzpcbiAgICB7XG4gICAgICBzdGF0ZSA9IFN0YXRlRHJhZy5JRExFO1xuICAgICAgdXBkYXRlS25vYkFuZFZpZGVvV3JhcHBlcihlKTtcbiAgICAgIHN0b3BDcmVhdGVTZWdtZW50KCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgXG4gIH1cbiAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufTtcblxuIl19