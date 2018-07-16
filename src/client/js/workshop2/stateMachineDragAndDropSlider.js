var video = document.getElementById("videoEAT");
var speedrate = 1;

// Sliders
var knobMin = document.getElementById("range-slider_handle-min");
var rangeSliderTrack = document.getElementById("rangeSliderTrack");
var dividCommandeVideo = document.getElementById("idCommandeVideo");
var knobMax = document.getElementById("range-slider_handle-max");

//Drag and drop bouton knob min
var StateDrag = {
  IDLE : 0, DOWN:1, DRAG:2, LONGPRESS:3
};
var state = StateDrag.IDLE;

/*-----MOUSE DOWN-------*/
rangeSliderTrack.addEventListener("mousedown", function(e){
  switch (state){
    case StateDrag.IDLE: {
      state = StateDrag.DOWN;
      break;
    }
  }
}, false);


knobMin.addEventListener("mousedown", function(e) {
  //Update video position
  switch (state){
    case StateDrag.IDLE: {
      state = StateDrag.DOWN;
      break;
    }
  }
  pause();
  return false;
});


rangeSliderTrack.addEventListener("mousedown", function(e) {
  //Update video position
  updateKnobAndVideo(e);
  pause();
  return false;
});





/*-----MOUSE LEAVE-------*/

dividCommandeVideo.addEventListener("mouseleave", function(e) {
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
  }
  //console.log("mouse leave");
  
}, false);


/*-----MOUSE MOVE-------*/
rangeSliderTrack.addEventListener("mousemove",listenerMouseMove(), false);
knobMin.addEventListener("mousemove", listenerMouseMove(),false );
dividCommandeVideo.addEventListener("mousemove", function(e){
  switch (state){
    case StateDrag.DOWN: {
      pause();
      state = StateDrag.DRAG;
      //console.log(" draging etat down");
      updateKnobAndVideo(e);
      break;
    }
    case StateDrag.DRAG: {
      pause();
      state = StateDrag.DRAG;
      updateKnobAndVideo(e);
      //console.log(" draging etat drag");
      break;
    }
  }
}, false);

function listenerMouseMove(e){
    switch (state){
      case StateDrag.DOWN: {
        pause();
        state = StateDrag.DRAG;
        //console.log(" draging etat down");
        updateKnobAndVideo(e);
        break;
      }
      case StateDrag.DRAG: {
        state = StateDrag.DRAG;
        updateKnobAndVideo(e);
        //console.log(" draging etat drag");
        break;
      }
      case StateDrag.LONGPRESS:{
        state = StateDrag.DRAG;
        updateKnobAndVideo(e);
        break;
      }
    }
  }


/*-----MOUSE UP-------*/

dividCommandeVideo.addEventListener("mouseup", function(e){
  switch (state) {
    case StateDrag.DOWN: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
      play();
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
      play();
      break;
    }
    
  }
  //console.log("end drag");
  
}, false);
rangeSliderTrack.addEventListener("mouseup", function(e){
  switch (state) {
    case StateDrag.DOWN: {
      state = StateDrag.IDLE;
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
      break;
    }
    case StateDrag.LONGPRESS:{
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
      stopCreateSegment(e,video.currentTime);
      break;
    }
    
  }
  console.log("end drag");
  
}, false);


/*-----MOUSE LONG PRESS-------*/

knobMin.addEventListener('long-press', function(e) {
  // stop the event from bubbling up
  // e.preventDefault();
  
  switch (state){
    case StateDrag.DOWN: {
      state = StateDrag.LONGPRESS;
      pause();
      startCreateSegment(e,video.currentTime);
      break;
    }
  }
  console.log("long press knob min ");
});


/*-----MOUSE DOWN-------*/
knobMin.addEventListener("mouseup", function(e){
  switch (state){
    case StateDrag.IDLE: {
      state = StateDrag.DOWN;
      break;
    }
    
  }
}, false);





/*----Create Segment ------*/

function startCreateSegment(e,startSegment){
  knobMax.style.visibility = "visible";
  knobMin.style.left
  console.log("xxx :  " + knobMin.style.left);
  knobMax.style.left = (knobMin.style.left) + "px" ;
  
  //updateKnobMax(e);
  
  console.log("hello toi")

}

function stopCreateSegment(e,stopSegment){
  knobMax.style.visibility = "hidden";

}