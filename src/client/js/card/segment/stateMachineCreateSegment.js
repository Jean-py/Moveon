
var knobMin = document.getElementById("range-slider_handle-min");
var rangeSliderTrack = document.getElementById("rangeSliderTrack");
var knobMax = document.getElementById("range-slider_handle-max");
/*

var the_body = document.body;

the_body.addEventListener('mousedown',function(){
  cancelCreateSegment();
  console.log("aaa")
});
*/


//Option for the longpress and the speed of the video_current
var speedrate = 1;
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
    }


var btnCancelSegment = null;
btnCancelSegment  = document.createElement('p');
btnCancelSegment.className = 'span';
btnCancelSegment.innerHTML = "x";
btnCancelSegment.addEventListener('mousedown',function(e){
  cancelCreateSegment(e);
});



//Create Segment
function startCreateSegment() {
  
  knobMax.style.position = "absolute";
  knobMax.style.left = knobMin.style.left;
  knobMax.style.visibility = "visible";
  segmentFeedback.divGraphicalObject.style.visibility = "visible";
  knobMin.appendChild(btnCancelSegment);
  
  //state  StateDrag.LONGPRESS;
  knobMin.style.setProperty('background','--fourth-color');
  updateSegmentFeedback(true,knobMin.style.left,knobMax.style.left);
}



function stopCreateSegment() {
  knobMin.removeChild(btnCancelSegment);
  video_current.ready(function () {
    this.off('timeupdate' , showSegmentFeedback);
  });
  
  positionStop = knobMin.style.left;
  state = StateDrag.IDLE;
    knobMax.style.visibility = "hidden";
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
    knobMin.style.setProperty("background","var(--secondary-color)");
    
    
     timePositionStop = video_current.currentTime();
     console.log("timePositionStart,timePositionStop, positionStart,positionStop,segmentFeedback.divGraphicalObject.style.width :  " + timePositionStart,timePositionStop, positionStart,positionStop,segmentFeedback.divGraphicalObject.style.width);
     player.createNewCard(timePositionStart,timePositionStop, positionStart,positionStop,segmentFeedback.divGraphicalObject.style.width  );
     play();
  
}

function cancelCreateSegment(event) {
  event.stopPropagation();
  event.cancelBubble = true;
  if (event.stopPropagation){
    event.stopPropagation();
  }
  else if(window.event){
    window.event.cancelBubble=true;
  }
  knobMin.removeChild(btnCancelSegment);
  state = StateDrag.IDLE;
  positionStop = knobMin.style.left;
  video_current.ready(function () {
    this.off('timeupdate' , showSegmentFeedback);
  });
  
  
    knobMax.style.visibility = "hidden";
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
    knobMin.style.setProperty("background","var(--secondary-color)");
    timePositionStop = video_current.currentTime();
    play();
  
  
}
/*
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
      updateSegmentFeedback(true, knobMin.style.left,knobMax.style.left);
      break;
    }
  }
};*/

var knobMinClick = function(e) {
  //console.log("function - knobMinClick" );
  state = StateDrag.STARTED;
  //knobMin.style.left;
  startCreateSegment();
  //updateKnobAndVideoWrapper(e);
  //console.log("function - knobMinUpCallback appel pause l165 statemachine ");
  pause();
  timePositionStart = video_current.currentTime();
  positionStart = knobMin.style.left;
  video_current.ready(function () {
    this.on('timeupdate', showSegmentFeedback);
  });
  clearAllTimer();
};

function showSegmentFeedback() {
  updateSegmentFeedback(true,knobMin.style.left,knobMax.style.left)
}

//TODO work on feedback
function addFeedback(start, end) {
    segmentFeedback.divGraphicalObject.style.visibility = "visible";
    segmentFeedback.divGraphicalObject.style.marginLeft = end ;
    if(parseFloat(start,10)  >= parseFloat(end,10) ){
      segmentFeedback.divGraphicalObject.style.width = parseFloat(startP,10) - parseFloat(endP,10)  +"%";
    } else {
      segmentFeedback.divGraphicalObject.style.marginLeft = startP ;
      segmentFeedback.divGraphicalObject.style.width = parseFloat(endP,10) - parseFloat(startP,10) +"%";
      
    }
}




