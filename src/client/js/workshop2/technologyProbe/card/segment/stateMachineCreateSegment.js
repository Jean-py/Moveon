
var knobMin = document.getElementById("range-slider_handle-min");
var rangeSliderTrack = document.getElementById("rangeSliderTrack");
var knobMax = document.getElementById("range-slider_handle-max");

//Option for the longpress and the speed of the video_current
var speedrate = 1;
var longPressDelay = "500";

var WIDTH_KNOB = 30;

//State for the creation of segment by Drag and drop
let StateDrag = {
  IDLE: 0,
  DOWN: 1,
  DRAG: 2,
  LONGPRESS: 3,
  STARTED: 4,
  
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
  if(knobMin != null){
    //Mouse
    knobMin.addEventListener("mousedown", function(e) {
      console.log("mousedown knob");
      switch (state) {
        case StateDrag.STARTED:{
          stopCreateSegment();
          break;
        }
        case StateDrag.IDLE : {
          knobMinClick(e);
          break;
        }
      }
      
    }, {
      passive: true
    });
  
    segmentFeedback.divGraphicalObject.addEventListener("mousedown", function(e) {
      switch (state) {
        case StateDrag.STARTED:{
          stopCreateSegment();
          break;
        }
      }
  
    }, {
      passive: true
    });
  
      //Mouse
      knobMin.addEventListener("touchend", function(e) {
        console.log("touchstart knob")
  
        switch (state) {
          case StateDrag.STARTED:{
            stopCreateSegment();
            break;
          }
          case StateDrag.IDLE : {
            knobMinClick(e);
            break;
          }
        }
      
      }, {
        passive: true
      });
  
  
    
      segmentFeedback.divGraphicalObject.addEventListener("touchstart", function(e) {
        switch (state) {
          case StateDrag.STARTED:{
            stopCreateSegment();
            break;
          }
        }
      
      }, {
        passive: true
      });
    
    
    
    } else {
  
  }/* else {
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
var longpressCreateSegmentCallback = function(e) {
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

var videoTouchMoveCallback = function(e) {
  switch (state) {
    case StateDrag.IDLE:
    {
      state = StateDrag.DRAG;
      break;
    }
  }
};

var ranglerSliderTrackClick = function(e) {
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

var knobMinUpCallback = function(e) {
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
  knobMin.style.setProperty('background','--fourth-color');
  updateSegmentFeedback();
  
  
}

function stopCreateSegment() {
  console.log("stop create segment");
  video_current.ready(function () {
    this.off('timeupdate', updateSegmentFeedback);
  });
  
  positionStop = knobMin.style.left;
  state = StateDrag.IDLE;
  let timerLifeSegment = window.setTimeout(function() {
    knobMax.style.visibility = "hidden";
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
    knobMin.style.setProperty("background","var(--secondary-color)");
    window.clearTimeout(timerLifeSegment);
    
    
     timePositionStop = video_current.currentTime();
    
    //TODO regarder aussi le fait d'enlever le listener change sur le knobmin?
    //TODO voir ici la creation de carte pour la mettre au bon endroit, checker aussi startP et endP
    player.createNewCard(timePositionStart,timePositionStop, positionStart,positionStop,segmentFeedback.divGraphicalObject.style.width  );
    play();
  }, 700);
}




//Update the feedback of the creation of a segment after a long press
function updateSegmentFeedback() {
  segmentFeedback.divGraphicalObject.style.marginLeft = knobMax.style.left ;
  if(parseFloat(knobMin.style.left,10)  > parseFloat(knobMax.style.left,10) ){
    segmentFeedback.divGraphicalObject.style.width = parseFloat(knobMin.style.left,10) - parseFloat(knobMax.style.left,10)  +"%";
  } else {
    segmentFeedback.divGraphicalObject.style.marginLeft = knobMin.style.left ;
    segmentFeedback.divGraphicalObject.style.width = parseFloat(knobMax.style.left,10) - parseFloat(knobMin.style.left,10) +"%";
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

var knobMinMove = function(e) {
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

var knobMinClick = function(e) {
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


var rangeSliderTrackEndCallback = function(e) {
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

var knobMinMouseLeaveCallback = function(e) {
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

