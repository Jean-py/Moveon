

var DataAnalyst = function() {
  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    //execute a command
    visualiseAllSegmentsInOne: function () {
      console.log("visualiseAllSegmentsInOne");
      visualiseAllSegmentsInOne();
    },
  }
};

//Fonction permettant de visualiser tous les segments sur la barre de progression

var visualiseAllSegmentsInOne = function () {
  
  var listSegment = document.getElementsByClassName('segmentWrapper');
  //playCard(arrayItem.iDiv, arrayItem.startP);
  var elemSegment = null;
  
  for (var i = 0; i < listSegment.length; i++) {
    elemSegment = listSegment[i]
    console.log(listSegment[i]);
    //Graphical object of feedback
    var sgfeed = {
      width: "",
      startPostion: "",
      endPosition: "",
      startDurationVideo: "",
      endDurationVideo: "",
      displayed: true,
      divGraphicalObject:  document.createElement('div')
    
    };
    
    //Get speed and repet
    var selectSpeed = elemSegment.childNodes[1].childNodes[1];
    var selectRepet = elemSegment.childNodes[1].childNodes[3];
    var valueSelectSpeed = selectSpeed.options[selectSpeed.selectedIndex].value;
    var valueSelectRepet = selectRepet.options[selectRepet.selectedIndex].value;
    console.log(valueSelectSpeed,valueSelectRepet);
  
  
  
  
    sgfeed.divGraphicalObject.className = 'range-slider_track';
  
    
   
    sgfeed.divGraphicalObject.style.backgroundColor = getColor(valueSelectSpeed, valueSelectRepet);
    //sgfeed.divGraphicalObject.style.position  = "absolute";
    
    //segmentFeedback.divGraphicalObject.style.marginLeft = segmentFeedback.startPostion;
    //minus 2 because we need to get 2 frame before the segment
    sgfeed.divGraphicalObject.style.marginLeft = elemSegment.style.left; //  segmentFeedback.startPostion;
    sgfeed.divGraphicalObject.style.visibility = "visible";
    sgfeed.divGraphicalObject.style.width = elemSegment.style.width;
  
    
    
    
    document.getElementById('range-slider-wrapper').appendChild(sgfeed.divGraphicalObject);
    
    
  }
};

function  getColor(speed, repet) {
      var trans = '0.2'; // 50% transparency
      
      //trans += repet * speed;
      var color = 'rgba(35,65,139';
    
   
    color += trans + ')'; // add the transparency
    return color;
}

function getRandomColor() {
  var trans = '0.1'; // 50% transparency
  var color = 'rgba(';
  for (var i = 0; i < 3; i++) {
    color += Math.floor(Math.random() * 255) + ',';
  }
  color += trans + ')'; // add the transparency
  return color;
}

console.log("*** DataAnalysis Script loaded ***");
