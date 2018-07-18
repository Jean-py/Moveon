var video = document.getElementById("videoEAT");
var speedrate = 1;



// Sliders
var knobMin = document.getElementById("range-slider_handle-min");
var rangeSliderTrack = document.getElementById("rangeSliderTrack");
var dividCommandeVideo = document.getElementById("idCommandeVideo");
var knobMax = document.getElementById("range-slider_handle-max");
var segmentMinMax = document.getElementById("segmentMinMax");
var cardBoard = document.getElementById("divCardBoard");



//Drag and drop bouton knob min
let StateDrag = {
  IDLE : 0, DOWN:1, DRAG:2, LONGPRESS:3
};
var state = StateDrag.IDLE;




/*-----MOUSE DOWN-------*/
rangeSliderTrack.addEventListener("mousedown", function(e){
  switch (state){
    case StateDrag.IDLE: {
      state = StateDrag.DOWN;
      updateKnobAndVideo(e);
      pause();
      clearAllTimer();
      break;
    }
  }
}, false);
knobMin.addEventListener("mousedown", function(e) {
  //Update video position
  switch (state){
    case StateDrag.IDLE: {
      state = StateDrag.DOWN;
      clearAllTimer();
      break;
    }
  }
  pause();
  return false;
});
/*rangeSliderTrack.addEventListener("mousedown", function(e) {
  //Update video position
  updateKnobAndVideo(e);
  pause();
  return false;
});*/

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
    case StateDrag.LONGPRESS: {
      state = StateDrag.IDLE;
      stopCreateSegment();
      play();
      break;
    }
  
  
  }
  //console.log("mouse leave");
  
}, false);

/*-----MOUSE MOVE-------*/
rangeSliderTrack.addEventListener("mousemove", function(e){
  switch (state){
    case StateDrag.DOWN: {
      pause();
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
}, false);


knobMin.addEventListener("mousemove", function(e){
  switch (state){
    case StateDrag.DOWN: {
      pause();
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
  
},false );
dividCommandeVideo.addEventListener("mousemove", function(e){
  switch (state){
    case StateDrag.DOWN: {
      pause();
      state = StateDrag.DRAG;
      //console.log(" draging etat down");
      updateKnobAndVideo(e);
     // clearAllTimer();
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
    /*case StateDrag.LONGPRESS: {
      pause();
      state = StateDrag.DRAG;
      updateKnobAndVideo(e);
      //console.log(" draging etat drag");
      break;
    }*/
    
  }
}, false);

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
  //console.log("mouse up , etat : " + state);
  
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
  
}, false);

knobMin.addEventListener("mouseup", function(e) {
  switch (state) {
    case StateDrag.LONGPRESS: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
      stopCreateSegment(e, video.currentTime);
      break;
    }
    case StateDrag.DRAG: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
      break;
    }
    case StateDrag.DOWN: {
      state = StateDrag.IDLE;
      updateKnobAndVideo(e);
    //  stopCreateSegment(e, video.currentTime);
      
      break;
    }
    
  }
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
  //state = StateDrag.LONGPRESS;
  knobMin.style.background = '#213F8D';
  knobMax.style.visibility = "visible";
  //segmentMinMax.style.right = knobMin.style.left;
  updateSegment();
}

function stopCreateSegment(e,stopSegment){
  
  let timerLifeSegment=window.setTimeout(function () {
    knobMax.style.visibility = "hidden";
    segmentMinMax.style.visibility = "hidden";
    knobMin.style.background = '#ffffff';
    //createCard();
    window.clearTimeout(timerLifeSegment);
    addingNewCard(parseInt(knobMax.style.left,10), parseInt(knobMin.style.left,10));
    
  },700);
}




function updateSegment(){
  segmentMinMax.style.marginLeft = knobMax.style.left;
  //segmentMinMax.style.marginLeft = knobMax.style.left;
  segmentMinMax.style.visibility = "visible";
  segmentMinMax.style.width =  (parseInt(knobMin.style.left, 10) -  parseInt(knobMax.style.left, 10)) +"px";
}