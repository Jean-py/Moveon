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
let StateDrag = {
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
  knobMin.addEventListener("mouseup", function(e) {
    knobMinUpCallback(e);
  }, {
    passive: true
  });
  knobMin.addEventListener("mousedown", function(e) {
    knobMinClick(e);
  }, {
    passive: true
  });
  knobMin.addEventListener("mousemove", function(e) {
    knobMinMove(e);
  }, {
    passive: true
  });
  rangeSliderTrack.addEventListener("mousedown", function(e) {
    ranglerSliderTrackClick(e);
  }, {
    passive: true
  });
  rangeSliderTrack.addEventListener("mouseUp", function(e) {
    rangeSliderTrackEndCallback(e);
  }, {
    passive: true
  });
  rangeSliderTrack.addEventListener("mousemove", function(e) {
    knobMinMove(e);
  }, {
    passive: true
  });
  
  wrapperRangerSlider.addEventListener("mousemove", function(e) {
    knobMinMove(e);
  }, true);
  
  wrapperRangerSlider.addEventListener("mouseup", function(e) {
    rangeSliderTrackEndCallback(e);
  }, true);
  
} else {
  //Touch
  knobMin.addEventListener("touchstart", function(e) {
    knobMinClick(e);
  }, {
    passive: true
  });
  knobMin.addEventListener("touchmove", function(e) {
    knobMinMove(e);
  }, {
    passive: true
  });
  knobMin.addEventListener("touchend", function(e) {
    knobMinUpCallback(e);
  }, {
    passive: true
  });
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
  video.addEventListener("touchmove", function(e) {
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
knobMin.addEventListener('long-press', function(e) {
  // console.log('knobMin.addEventListener(longpress');
  pause();
  longpressCreateSegmentCallback(e);
});
rangeSliderTrack.addEventListener("long-press", function(e) {
  // console.log('rangeSliderTrack.addEventListener(longpress');
  
  pause();
  longpressCreateSegmentCallback(e);
}, false);

/*Callback function*/
var longpressCreateSegmentCallback = function(e) {
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
  
  if(parseInt(knobMin.style.left,10) < 0){
    knobMax.style.left = WIDTH_KNOB/2 + "px";
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
  let timerLifeSegment = window.setTimeout(function() {
    knobMax.style.visibility = "hidden";
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
    knobMin.style.background = '#ffffff';
    //createCard();
    window.clearTimeout(timerLifeSegment);
    //console.log("AAA : " + parseInt(knobMax.style.left,10));
    
    
    var startP = parseInt(knobMax.style.left, 10) + WIDTH_MID_KNOB_MIN / 2;
    var endP = parseInt(knobMin.style.left, 10) + WIDTH_KNOB;
    
   // cardManager.execute(new CreateNewCardCommand(startP, endP));
    if(startP < 0){
      startP = 0;
    }

    Player.createNewCard(startP,endP );
    
    play();
  }, 700);
}




//Update the feedback of the creation of a segment after a long press
function updateSegmentFeedback() {
  
  
  
  if (parseInt(knobMin.style.left, 10) > parseInt(knobMax.style.left, 10)) {
    segmentFeedback.divGraphicalObject.style.marginLeft = knobMax.style.left   ;
    segmentFeedback.divGraphicalObject.style.width = Math.abs((parseInt(knobMin.style.left, 10) - parseInt(knobMax.style.left, 10)   )) + WIDTH_KNOB + "px";
  
  } else {
    segmentFeedback.divGraphicalObject.style.marginLeft = knobMin.style.left    ;
    segmentFeedback.divGraphicalObject.style.width = Math.abs((parseInt(knobMin.style.left, 10) - parseInt(knobMax.style.left, 10)   ))  + "px";
  
  }
  segmentFeedback.divGraphicalObject.style.visibility = "visible";
  
  
  if(parseInt(segmentFeedback.divGraphicalObject.style.marginLeft, 10) < 0 ){
    //the case if the knob is in the extremun of the loader.
    segmentFeedback.divGraphicalObject.style.marginLeft = " 0 px" ;
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

var knobMinMove = function(e) {
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
      stopCreateSegment(e, video.currentTime);
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
      stopCreateSegment(e, video.currentTime);
      break;
    }
    
  }
  //event.preventDefault();
};

