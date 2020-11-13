var transparencyRange = document.getElementById("transparencyRange");
var speedcheckboxes00 = document.getElementById("speedcheckboxes-0-0");
var speedcheckboxes01 = document.getElementById("speedcheckboxes-0-1");

var repetitioncheckboxes00 = document.getElementById("Repetitioncheckboxes-0-0");
var repetitioncheckboxes01 = document.getElementById("Repetitioncheckboxes-0-1");

var positionanalysis0 = document.getElementById("position-analysis-0");
var positionanalysis1 = document.getElementById("position-analysis-1");


var HEIGHT = "20px";

var DataAnalyst = function() {
  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    analyseData1: function () {
      console.log("visualiseAllSegmentsInOne");
      analyseData1();
    },
  }
};


positionanalysis0.addEventListener('click', updatePosition);
positionanalysis1.addEventListener('click', updatePosition);
transparencyRange.addEventListener('input', updateTransparency);
repetitioncheckboxes00.addEventListener('change', updateHeight);
repetitioncheckboxes01.addEventListener('change', updateHeight);
speedcheckboxes00.addEventListener('change', updateHeight);
speedcheckboxes01.addEventListener('change', updateHeight);



function updateTransparency() {
  var listSegment = document.getElementsByClassName('data_visualisation');
  //playCard(arrayItem.iDiv, arrayItem.startP);
  var elemSegment = null;
  
  for (var i = 0; i < listSegment.length; i++) {
    elemSegment = listSegment[i];
  
// initial background-color looks like 'rgba(255, 123, 0, 0.5)'
    var initialBackgroundColor = elemSegment.style.backgroundColor;
    var bgColorSeparated = initialBackgroundColor.split(',');
// last element contains opacity and closing bracket
// so I have to replace it with new opacity value:
    
    bgColorSeparated[3] = transparencyRange.value + ')';
    var newColor = bgColorSeparated.join(',');
    newColor = newColor.split(')');
    newColor = newColor.join(' ');
    
    newColor = newColor+ ')';
    elemSegment.style.backgroundColor =  newColor ;
  }
}



function updatePosition() {
  var listSegment = document.getElementsByClassName('data_visualisation');
  //playCard(arrayItem.iDiv, arrayItem.startP);
  var elemSegment = null;
  var positionAbsolute = positionanalysis1.checked;
  
  
  console.log("positionAbsolute :", positionanalysis1.checked);
  for (var i = 0; i < listSegment.length; i++) {
    elemSegment = listSegment[i];
    if(positionAbsolute){
      elemSegment.style.position = "absolute";
    }else {
      elemSegment.style.position = "relative";
    }
  }
}


function updateHeight(speed, repet ){
  var listSegment = document.getElementsByClassName('data_visualisation');
  //playCard(arrayItem.iDiv, arrayItem.startP);
  var elemSegment = null;
  
  for (var i = 0; i < listSegment.length; i++) {
    elemSegment = listSegment[i];
    var height = 20;//(1 + speed * repet);
    
    
    if(repetitioncheckboxes00.checked){
      height = 10  * elemSegment.getAttribute("repetition") ;
      //divGraphicalObject.style.height = (10  * valueSelectRepet * valueSelectSpeed  ) + "px";
      
    }
    if(speedcheckboxes00.checked){
      height *=    (2 - elemSegment.getAttribute("speed"));
    }
    elemSegment.style.height = (height ) + "px";
    
  }
  
 


}




//Fonction permettant de visualiser tous les segments sur la barre de progression
var analyseData1 = function () {
  
  var listSegment = document.getElementsByClassName('segmentWrapper');
  //playCard(arrayItem.iDiv, arrayItem.startP);
  var elemSegment = null;
  
  for (var i = 0; i < listSegment.length; i++) {
    elemSegment = listSegment[i];
    //Get speed and repet
    var selectSpeed = elemSegment.childNodes[1].childNodes[1];
    var selectRepet = elemSegment.childNodes[1].childNodes[3];
    var valueSelectSpeed = selectSpeed.options[selectSpeed.selectedIndex].value;
    var valueSelectRepet = selectRepet.options[selectRepet.selectedIndex].value;
//    for(var j = 0; j < valueSelectRepet; j++) {
    
    
      var divGraphicalObject =  document.createElement('div');
      divGraphicalObject.setAttribute("repetition", valueSelectRepet);
      divGraphicalObject.setAttribute("speed", valueSelectSpeed);
      divGraphicalObject.className = 'range-slider_track';
      divGraphicalObject.className = 'data_visualisation';
      divGraphicalObject.style.height = HEIGHT;
      var height = (1 + selectSpeed *selectRepet);
      //divGraphicalObject.style.height = (10  * valueSelectRepet ) + "px";
      
    //divGraphicalObject.style.backgroundColor = getRandomColor(valueSelectSpeed, valueSelectRepet);
     divGraphicalObject.style.backgroundColor = getColor(valueSelectSpeed, valueSelectRepet, 1);
    
      //minus 2 because we need to get 2 frame before the segment
      divGraphicalObject.style.marginLeft = elemSegment.style.left; //  segmentFeedback.startPostion;
      divGraphicalObject.style.visibility = "visible";
      divGraphicalObject.style.width = elemSegment.style.width;
      document.getElementById('range-slider-wrapper').appendChild(divGraphicalObject);
  
  //  }
  }
};


function  getColor(speed, repet, trans) {
      var trans = trans; // 50% transparency
  //'241,238,246' , '116,169,207'
      var colorArray = ['#E3F2FD','#90CAF9','#42A5F5','#1E88E5','#1565C0', '#0D47A1'];
  
      let hexColor  = hexToRgb(colorArray[Math.round(5-(((speed*10)) / 2) )]);
  var color = 'rgba(' + hexColor.r+','+hexColor.g+','+hexColor.b+',';
      color += trans + ')'; // add the transparency
      //console.log(1- Math.round(((speed*10)-1) / 2) );
      console.log(color);
  
  return color;
}


function  getColor3(speed, repet, trans) {
  var trans = trans; // 50% transparency
  //'241,238,246' , '116,169,207'
  var colorArray = ['45, 182, 255','32, 131, 184','19, 76, 107','12,51,76'];
  var color = 'rgba(' + colorArray[Math.round(5-(((speed*10)) / 2) )] +',';
  color += trans + ')'; // add the transparency
  //console.log(1- Math.round(((speed*10)-1) / 2) );
  console.log(color);
  
  return color;
}



function  getColor2(speed, repet) {
  var trans = '0.3'; // 50% transparency
  var trans = '1'; // 50% transparency
  //trans += repet * speed;
  
  
  var color = 'rgba('+ (255 -speed * 100)+',' +(speed * 100) +',255'+',' ;
  var color = 'rgba( 35 , 64,255,' ;
  var rainbow = new Rainbow();
  var rgb =  hexToRgb(rainbow.colorAt(255 - (speed)*255));
  color = 'rgba( '+ rgb.r +',' + rgb.g +',' + rgb.b +',';
  color += trans + ')'; // add the transparency
  console.log(color );
  return color;
}

function getRandomColor() {
  var trans = '0.2'; // 50% transparency
  var color = 'rgba(';
  for (var i = 0; i < 3; i++) {
    color += Math.floor(Math.random() * 255) + ',';
  }
  color += trans + ')'; // add the transparency
  return color;
}


function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}






/* Draggable element */
// Make the DIV element draggable:
dragElement(document.getElementById("AnalysisMenuDraggable"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById("AnalysisMenuHeader")) {
    // if present, the header is where you move the DIV from:
    document.getElementById("AnalysisMenuHeader").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }
  
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }
  
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  
  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

console.log("*** DataAnalysis Script loaded ***");
