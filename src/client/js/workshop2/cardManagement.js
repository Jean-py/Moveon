var numberOfCard = 0;
var addCard = document.getElementById("idAddCard");
var saveLogBtn = document.getElementById("btnSaveLog");
var textSaveLog = document.getElementById("textSaveLog");
var arrayCard = [];



saveLogBtn.addEventListener("touchend",function (e) {
  console.log("saving log");
  
  arrayCard.forEach(function (arrayItem) {
   // arrayItem.updateInfo();
    //arrayItem.
  });
  
 /* arrayCard.forEach(function(gameObject) {
    gameObject.updateInfo(1);
  });*/
  
  exportCard();
  textSaveLog.innerText = "Log saved!" ;
  
  
});
//dragElement(document.getElementById("card1"));

/*
addCard.addEventListener('click', function (e) {
  addingNewCard();
});*/




/**
 * Adding a card from the list of card
 */
function addingNewCard(startP,endP) {
  if(startP > endP){
    let transit = startP;
    startP = endP;
    endP = transit;
  }
  let result = sliderToVideo(startP,endP);
  numberOfCard++;
  var card = new Card(result.startDuration, result.endDuration,startP,endP);
  arrayCard.push( card);
  //console.log(card);
  
/*
  //var card =  Card.cardConstructor(result.startDuration, result.endDuration,startP,endP);
  arrayCard.push(card);
  
  let result2 = sliderToVideo(10,20);
  var card =  Card.cardConstructor(result2.startDuration,result2.endDuration,10,20);
  let result3 = sliderToVideo(15,25);
  var card =  Card.cardConstructor(result3.startDuration,result3.endDuration,15,25);*/
}

/*------ Export card in a JSON file  -------*/
//TODO
var exportCard = function(){
  var arrayItemUpdated = [];
  arrayCard.forEach(function (arrayItem) {
     //arrayItem.updateInfo();
    var item = arrayItem.updateInfo();
    arrayItemUpdated.push(item);
    console.log(item);
  });
  var serializedArr = JSON.stringify( [arrayItemUpdated, numberOfCard] );
  console.log("Serialisation of card complete : " + serializedArr);
  download(serializedArr, 'jsonW2log-'+createUniqueId()+'.txt', 'text/plain');
  
  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
};


/*------Drag card-------*/
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
function dragElement(elmnt) {
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
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
    pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    if(elmOffset === 0  ) {
      elmOffset = elmnt.offsetTop;
    }
    console.log(elmOffset);
    //elmnt.style.top = (  ) + "px";
    elmnt.style.left = ( -pos1 - 100) + "px";
    //elmnt.style.top = ( -pos1 - 100) + "px";
  }
  
  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
