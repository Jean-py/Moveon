var video = document.getElementById("videoEAT");
var wrapperCommandAndRange = document.getElementById("wrapperCommandAndRangeid");
var speedrate = 1;

//Graphical object of feedback
var segmentFeedback = {
  width: "",
  startPostion:"",
  endPosition : "",
  startDurationVideo:"",
  endDurationVideo:"",
  displayed:false,
  divGraphicalObject: document.getElementById("segmentMinMax")
};

// Sliders
var knobMin = document.getElementById("range-slider_handle-min");
var rangeSliderTrack = document.getElementById("rangeSliderTrack");
var knobMax = document.getElementById("range-slider_handle-max");
var wrapperRangerSlider = document.getElementById("range-slider-wrapper");

//Drag and drop bouton knob min
let StateDrag = {
  IDLE : 0, DOWN:1, DRAG:2, LONGPRESS:3
};
var state = StateDrag.IDLE;

var longPressDelay = "500";


//Mouse
//TODO je peux pas faire ça sinon ça declenche toujours, trouver un autre moyen, peut etre mouse leave ou qqch avec une autre fonction a créer
/*knobMin.addEventListener("mouseleave", function(e) {
  knobMinMouseLeaveCallback(e);
},false);*//*
knobMin.addEventListener("mouseup", function(e) {
  knobMinUpCallback(e);
}, {passive: true});
knobMin.addEventListener("mousedown", function(e) {
  knobMinClick(e);
}, {passive: true});
knobMin.addEventListener("mousemove", function(e){
  knobMinMove(e);
}, {passive: true} );
rangeSliderTrack.addEventListener("mousedown", function(e){
  ranglerSliderTrackClick(e);
} ,{passive: true});
rangeSliderTrack.addEventListener("mouseUp", function(e){
  rangeSliderTrackEndCallback(e);
},  {passive: true});
rangeSliderTrack.addEventListener("mousemove", function(e){
  knobMinMove(e);
}, {passive: true} );

wrapperRangerSlider.addEventListener("mousemove", function(e){
  knobMinMove(e);
},true );

wrapperRangerSlider.addEventListener("mouseup", function(e){
  rangeSliderTrackEndCallback(e);
}, true);
*/
/*window.addEventListener("mouseup", function(e){
  rangeSliderTrackEndCallback(e);
}, false);
window.addEventListener("mousemove", function(e){
  knobMinMove(e);
},true );*/

//Touch
knobMin.addEventListener("touchstart", function(e) {
  knobMinClick(e);
}, {passive: true});
knobMin.addEventListener("touchmove", function(e){
  knobMinMove(e);
},{passive: true} );
knobMin.addEventListener("touchend", function(e) {
  knobMinUpCallback(e);
},{passive: true});
rangeSliderTrack.addEventListener("touchstart", function(e){
  ranglerSliderTrackClick(e);
},{passive: true});
rangeSliderTrack.addEventListener("touchend", function(e){
  rangeSliderTrackEndCallback(e);
}, {passive: true});
video.addEventListener("touchmove", function(e) {
  videoTouchMoveCallback(e);
},{passive: true});






/*-----MOUSE LONG PRESS-------*/

knobMin.setAttribute("data-long-press-delay",longPressDelay);
knobMin.addEventListener('long-press', function(e) {
  console.log('knobMin.addEventListener(longpress');
    pause();
    longpressCreateSegmentCallback(e);
});
rangeSliderTrack.addEventListener("long-press", function(e){
  console.log('rangeSliderTrack.addEventListener(longpress');
  
  pause();
  longpressCreateSegmentCallback(e);
}, false);

/*Callback function*/
var longpressCreateSegmentCallback = function (e) {
  e.preventDefault();
  console.log('state : ' + state +'', 'background: #222; color: #bada55');
  
  switch (state){
    case StateDrag.DOWN: {
      state = StateDrag.LONGPRESS;
      //pause();
      startCreateSegment(e,video.currentTime);
      break;
    }
    
  }
  //event.preventDefault();
};

var videoTouchMoveCallback = function (e) {
  switch (state) {
    case StateDrag.IDLE: {
      state = StateDrag.DRAG;
      break;
    }
  }
};

var ranglerSliderTrackClick = function(e){
//  console.log("ranglerSliderTrackClick state : " + state);
 // pause();
  switch (state){
    case StateDrag.IDLE: {
      state = StateDrag.DOWN;
      updateKnobAndVideoWrapper(e);
      feedbackOnSliderVideo(false);
      break;
    }
  }
  console.log("function - ranglerSliderTrackClick appel play l147 statemachine ");
  play();
};

var knobMinUpCallback = function(e){
  console.log("***knobMinUpCallback *** "+ state);
  switch (state) {
    case StateDrag.IDLE: {
      state = StateDrag.IDLE;
      console.log("function - knobMinUpCallback appel play ");
      //play();
      break;
    }
    case StateDrag.LONGPRESS: {
      state = StateDrag.IDLE;
      updateKnobAndVideoWrapper(e);
      stopCreateSegment(e, video.currentTime);
      console.log("function - knobMinUpCallback appel pause l164 statemachine ");
      play();
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.IDLE;
      updateKnobAndVideoWrapper(e);
      console.log("function - knobMinUpCallback appel pause l165 statemachine ");
      pause();
      break;
    }
    case StateDrag.DOWN: {
      state = StateDrag.IDLE;
      updateKnobAndVideoWrapper(e);
      console.log("function - knobMinUpCallback appel pause l172 statemachine ");
      pause();
      break;
    }
  }
 
  //event.preventDefault();
};


//Create Segment
function startCreateSegment(e,startSegment){
  
  knobMax.style.left = knobMin.style.left ;
  knobMax.style.position = "absolute";
  //state  StateDrag.LONGPRESS;
  knobMin.style.background = '#213F8D';
  knobMax.style.visibility = "visible";
  updateSegmentFeedback();
}

function stopCreateSegment(e,stopSegment){
  let timerLifeSegment=window.setTimeout(function () {
    knobMax.style.visibility = "hidden";
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
    knobMin.style.background = '#ffffff';
    //createCard();
    window.clearTimeout(timerLifeSegment);
    //console.log("AAA : " + parseInt(knobMax.style.left,10));
    addingNewCard(parseInt(knobMax.style.left,10)+ WIDTH_MID_KNOB_MIN/2   , parseInt(knobMin.style.left,10)+ WIDTH_MID_KNOB_MIN/2 );
    play();
  },700);
}




//Update the feedback of the creation of a segment after a long press
function updateSegmentFeedback(){
  if(parseInt(knobMin.style.left, 10) >  parseInt(knobMax.style.left, 10)){
    segmentFeedback.divGraphicalObject.style.marginLeft = knobMax.style.left;
  } else {
    segmentFeedback.divGraphicalObject.style.marginLeft = knobMin.style.left;
  }
  segmentFeedback.divGraphicalObject.style.visibility = "visible";
  segmentFeedback.divGraphicalObject.style.width = Math.abs((parseInt(knobMin.style.left, 10) -  parseInt(knobMax.style.left, 10))) +"px";
}

//start position on the slider and end position on the slider
function sliderToVideo(startP,endP){
  var startDuration =  Math.round(((startP * video.duration)/NUMBER_OF_TICK));
  var endDuration   = Math.round(((endP * video.duration)/NUMBER_OF_TICK));
  return {
    startDuration: startDuration,
    endDuration: endDuration
  };
}

//start position on the slider and end position on the slider
function videoToSlider(startDurationVideo,endDurationVideo){
  
  var startP =  Math.round(((startDurationVideo * NUMBER_OF_TICK)/video.duration) - rangeSliderTrack.offsetLeft);
  var endP   = Math.round(((endDurationVideo * NUMBER_OF_TICK )/video.duration) - rangeSliderTrack.offsetLeft);
  return {
    startPosition: startP,
    endPosition: endP
  };
}

var knobMinMove = function(e){
  switch (state){
    case StateDrag.DOWN: {
      state = StateDrag.DRAG;
      //console.log(" draging etat down");
      updateKnobAndVideoWrapper(e);
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.DRAG;
      updateKnobAndVideoWrapper(e);
      //console.log(" draging etat drag");
      break;
    }
    case StateDrag.LONGPRESS:{
      state = StateDrag.LONGPRESS;
      //console.log("state longpress with mouse move");
      updateKnobAndVideoWrapper(e);
      updateSegmentFeedback();
      break;
    }
  }
  video.playbackRate = 1;
  //event.preventDefault();
};


var knobMinClick = function (e){
  console.log("function - knobMinClick" );
  pause();
  //Update video position
  switch (state){
    case StateDrag.IDLE: {
      state = StateDrag.DOWN;
      clearAllTimer();
      break;
    }
  }
  //e.preventDefault();
};


var rangeSliderTrackEndCallback = function(e){
  //console.log("touchend");
  //console.log("mouse up , etat : " + state);
 // console.log("rangeSliderTrackEndCallback : " + state);
  switch (state) {
    case StateDrag.DOWN: {
      state = StateDrag.IDLE;
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.IDLE;
      updateKnobAndVideoWrapper(e);
      console.log("function - rangeSliderTrackEndCallback l285 state machine");
      pause();
      break;
    }
    case StateDrag.LONGPRESS:{
      state = StateDrag.IDLE;
      updateKnobAndVideoWrapper(e);
      stopCreateSegment(e,video.currentTime);
      break;
    }
    
  }
  //event.preventDefault();
};

var knobMinMouseLeaveCallback = function(e){
  //console.log("touchend");
  //console.log("mouse up , etat : " + state);
 // console.log("knobMinMouseLeaveCallback : " + state);
  switch (state) {
    case StateDrag.DOWN: {
      state = StateDrag.DRAG;
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.DRAG;
      updateKnobAndVideoWrapper(e);
      break;
    }
    case StateDrag.LONGPRESS:{
      state = StateDrag.IDLE;
      updateKnobAndVideoWrapper(e);
      stopCreateSegment(e,video.currentTime);
      break;
    }
    
  }
  //event.preventDefault();
};



/*
function feedbackOnSliderVideo(onOff){
  //segmentFeedback.width = iDiv.style.width;
  //segmentFeedback.startPostion = iDiv.style.left;
  //segmentFeedback.width = parseInt(width);
  //segmentFeedback.startPostion= parseInt(startP);
  segmentFeedback.endPosition = parseInt(segmentFeedback.startPostion) + parseInt(segmentFeedback.width);
  var sliderToV = sliderToVideo( segmentFeedback.startPostion, segmentFeedback.endPosition);
  segmentFeedback.startDurationVideo = sliderToV.startDuration;
  segmentFeedback.endDurationVideo = sliderToV.endDuration;
  segmentFeedback.displayed = onOff;
  if(onOff){
    //segmentFeedback.divGraphicalObject.style.marginLeft = segmentFeedback.startPostion;
    segmentFeedback.divGraphicalObject.style.marginLeft = parseInt(segmentFeedback.startPostion) - 5 +"px";//  segmentFeedback.startPostion;
    segmentFeedback.divGraphicalObject.style.visibility = "visible";
    segmentFeedback.divGraphicalObject.style.width =  segmentFeedback.width;
  } else {
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
  }
};
*/




