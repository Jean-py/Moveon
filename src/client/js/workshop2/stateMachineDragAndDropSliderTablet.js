var video = document.getElementById("videoEAT");
var speedrate = 1;


//Object graphique de feedback
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
var dividCommandeVideo = document.getElementById("idCommandeVideo");
var knobMax = document.getElementById("range-slider_handle-max");
var cardBoard = document.getElementById("divCardBoard");





//Drag and drop bouton knob min
let StateDrag = {
  IDLE : 0, DOWN:1, DRAG:2, LONGPRESS:3
};
var state = StateDrag.IDLE;




/*-----MOUSE DOWN-------*/
rangeSliderTrack.addEventListener("touchstart", function(e){
  pause();
  switch (state){
    case StateDrag.IDLE: {
      state = StateDrag.DOWN;
      console.log("on touch start ranger track");
      updateKnobAndVideo(e);
      pause();
      clearAllTimer();
      feedbackOnSliderVideo(false);
      break;
    }
  }
  event.preventDefault();
}, false);
knobMin.addEventListener("touchstart", function(e) {
  pause();
  //Update video position
  switch (state){
    case StateDrag.IDLE: {
      state = StateDrag.DOWN;
      clearAllTimer();
      break;
    }
  }
  
  event.preventDefault();
});
/*rangeSliderTrack.addEventListener("mousedown", function(e) {
  //Update video position
  updateKnobAndVideo(e);
  pause();
  return false;
});*/

/*-----MOUSE LEAVE-------*/
/*dividCommandeVideo.addEventListener("touchend", function(e) {
  switch (state) {
    case StateDrag.DOWN: {
      state = StateDrag.IDLE;
      play();
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.IDLE;
      play();
      break;
    }
    case StateDrag.LONGPRESS: {
      state = StateDrag.IDLE;
      stopCreateSegment();
      play();
      break;
    }
  
  
  }
  //console.log("mouse leave");
  
}, false);*/

/*-----MOUSE MOVE-------*/
/*
rangeSliderTrack.addEventListener("touchmove", function(e){
  pause();
  
  switch (state){
    case StateDrag.DOWN: {
      state = StateDrag.DRAG;
      //console.log(" draging etat down");
      updateKnobAndVideo(e);
      clearAllTimer();
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.DRAG;
      updateKnobAndVideo(e);
      clearAllTimer();
     
      //console.log(" draging etat drag");
      break;
    }
    case StateDrag.LONGPRESS:{
      state = StateDrag.LONGPRESS;
      updateKnobAndVideo(e);
      updateSegment();
      clearAllTimer();
      
      break;
    }
  }
  event.preventDefault();
}, false);

*/

video.addEventListener("touchmove", function() {
  switch (state) {
    case StateDrag.IDLE: {
      state = StateDrag.DRAG;
      break;
    }
  }
});

knobMin.addEventListener("touchmove", function(e){
  pause();
  switch (state){
    case StateDrag.DOWN: {
      
      state = StateDrag.DRAG;
      clearAllTimer();
      //console.log(" draging etat down");
      updateKnobAndVideo(e);
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.DRAG;
      updateKnobAndVideo(e);
     // clearAllTimer();
      //console.log(" draging etat drag");
      break;
    }
    case StateDrag.LONGPRESS:{
      state = StateDrag.LONGPRESS;
      //console.log("state longpress with mouse move");
      updateKnobAndVideo(e);
      updateSegment();
      //clearAllTimer();
      break;
    }
  }
  event.preventDefault();
  
},false );
/*
dividCommandeVideo.addEventListener("touchmove", function(e){
  pause();
  
  switch (state){
    case StateDrag.DOWN: {
      state = StateDrag.DRAG;
      console.log(" draging etat down");
      updateKnobAndVideo(e);
      break;
    }
    case StateDrag.DRAG: {
      pause();
      state = StateDrag.DRAG;
      updateKnobAndVideo(e);
     // clearAllTimer();
      //console.log(" draging etat drag");
      break;
    }
    /!*case StateDrag.LONGPRESS: {
      pause();
      state = StateDrag.DRAG;
      updateKnobAndVideo(e);
      //console.log(" draging etat drag");
      break;
    }*!/
    
  }
  event.preventDefault();
}, false);*/

/*-----MOUSE UP-------*/
/*dividCommandeVideo.addEventListener("touchend", function(e){
  switch (state) {
    case StateDrag.DOWN: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
     //play();
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
      //play();
      break;
    }
    
  }
  event.preventDefault();
  //console.log("end drag");
  
}, false);*/
rangeSliderTrack.addEventListener("touchend", function(e){
  //console.log("touchend");
  //console.log("mouse up , etat : " + state);
  
  switch (state) {
    case StateDrag.DOWN: {
      state = StateDrag.IDLE;
      //play();
  
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.IDLE;
      //play();
  
      updateKnobAndVideo(e);
      break;
    }
    case StateDrag.LONGPRESS:{
      state = StateDrag.IDLE;
      //play();
      
      updateKnobAndVideo(e);
      stopCreateSegment(e,video.currentTime);
      break;
    }
    
  }
  event.preventDefault();
}, false);


video.addEventListener("touchend", function() {
  switch (state) {
    case StateDrag.IDLE: {
      if (video.paused) {
        play();
      } else {
        pause();
      }
      state =StateDrag.IDLE;
  
      break;
    }
  
    case StateDrag.DRAG: {
      state =StateDrag.IDLE;
      break;
    }
  }
});

knobMin.addEventListener("touchend", function(e) {
  switch (state) {
    case StateDrag.LONGPRESS: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
      stopCreateSegment(e, video.currentTime);
      //play();
  
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
      //play();
  
      break;
    }
    case StateDrag.DOWN: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
      //play();
  
      //  stopCreateSegment(e, video.currentTime);
      
      break;
    }
    
  }
  event.preventDefault();
},false);


/*-----MOUSE LONG PRESS-------*/
knobMin.addEventListener('long-press', function(e) {
  // stop the event from bubbling up
   e.preventDefault();
  switch (state){
    case StateDrag.DOWN: {
      state = StateDrag.LONGPRESS;
      pause();
      startCreateSegment(e,video.currentTime);
      break;
    }
  }
});

rangeSliderTrack.addEventListener("long-press", function(e){
  e.preventDefault();
  switch (state){
    case StateDrag.DOWN: {
      state = StateDrag.LONGPRESS;
      pause();
      startCreateSegment(e,video.currentTime);
      break;
    }
  }
  event.preventDefault();
}, false);

/*-----MOUSE DOWN-------*/
/*knobMin.addEventListener("mouseup", function(e){
  switch (state){
    case StateDrag.IDLE: {
      state = StateDrag.DOWN;
      break;
    }
    
  }
}, false);*/

/*----Create Segment ------*/
function startCreateSegment(e,startSegment){
  knobMax.style.left = knobMin.style.left ;
  knobMax.style.position = "absolute";
  //state = StateDrag.LONGPRESS;
  knobMin.style.background = '#213F8D';
  knobMax.style.visibility = "visible";
  updateSegment();
}

function stopCreateSegment(e,stopSegment){
  
  let timerLifeSegment=window.setTimeout(function () {
    knobMax.style.visibility = "hidden";
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
    knobMin.style.background = '#ffffff';
    //createCard();
    window.clearTimeout(timerLifeSegment);
    addingNewCard(parseInt(knobMax.style.left,10), parseInt(knobMin.style.left,10));
    
  },700);
}



function feedbackOnSliderVideo(onOff){
 //segmentFeedback.width = parseInt(width);
 // segmentFeedback.startPostion= parseInt(startP);
  segmentFeedback.endPosition = parseInt(segmentFeedback.startPostion) + parseInt(segmentFeedback.width);
  var sliderToV = sliderToVideo( segmentFeedback.startPostion, segmentFeedback.endPosition);
  segmentFeedback.startDurationVideo = sliderToV.startDuration;
  segmentFeedback.endDurationVideo = sliderToV.endDuration;
  segmentFeedback.displayed = onOff;
  
  
  if(onOff){
    segmentFeedback.divGraphicalObject.style.marginLeft = segmentFeedback.startPostion;
    segmentFeedback.divGraphicalObject.style.visibility = "visible";
    segmentFeedback.divGraphicalObject.style.width =  segmentFeedback.width;
  } else {
    segmentFeedback.divGraphicalObject.style.visibility = "hidden";
    knobMax.style.visibility = "hidden";
  }
}




function updateSegment(){
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
  
  var startDuration =  Math.round(((startP * video.duration)/NUMBER_OF_TICK)- rangeSliderTrack.offsetLeft);
  var endDuration   = Math.round(((endP * video.duration)/NUMBER_OF_TICK)- rangeSliderTrack.offsetLeft);
  return {
    startDuration: startDuration,
    endDuration: endDuration
  };
}

//start position on the slider and end position on the slider
function videoToSlider(startDurationVideo,endDurationVideo){
  
  var startP =  Math.round(((startDurationVideo * NUMBER_OF_TICK)/video.duration)- rangeSliderTrack.offsetLeft);
  var endP   = Math.round(((endDurationVideo * NUMBER_OF_TICK )/video.duration)- rangeSliderTrack.offsetLeft);
  return {
    startPosition: startP,
    endPosition: endP
  };
}

