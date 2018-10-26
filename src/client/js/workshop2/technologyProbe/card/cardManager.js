var numberOfCard = 0;
var arrayCard = [];

/**
 * This class manag all the cards created. This is the segment history.
 * @type {HTMLElement | null}
 */
var wrapperCommandAndRange = document.getElementById("wrapperCommandAndRangeid");

//TODO Save and load button, do no delete
/*saveLogBtn.addEventListener("touchend",function (e) {
  console.log("saving log");
  arrayCard.forEach(function (arrayItem) {
   // arrayItem.updateInfo();
    //arrayItem.
  });
  exportCardsJSon();
  textSaveLog.innerText = "Log saved!" ;
});

loadLogBtn.onclick = function () {
  loadJSON(null);
};

loadLogBtn.addEventListener("mouseup",function (e) {
  //console.log("AAAAAA");
  //var mydata = JSON.parse(data);
  //console.log( loadLogBtn.value);
});



function loadJSON(callback) {
  var request = new XMLHttpRequest();
  request.open("GET", "/public/logW2Json/ipad1.json", false);
  request.send(null);
  //console.log("request : "+ request.responseText);
  var my_JSON_object = JSON.parse(request.responseText);
  
  console.log(my_JSON_object);
  
  for( let k = 0 ; k <  my_JSON_object.length ; k ++){
    addingNewCardsFromJSon(my_JSON_object[k]);
  }
}/*



//dragElement(document.getElementById("card1"));

/*
addCard.addEventListener('click', function (e) {
  addingNewCard();
});*/

//Add a card from a json file
function addingNewCardsFromJSon(cardInfo){
  if(cardInfo.startP > cardInfo.endP){
    let transit = cardInfo.startP;
    cardInfo.startP = cardInfo.endP;
    cardInfo.endP = transit;
  }
  if(cardInfo.startP < 0 ){
    cardInfo.startP = 0;
  }
  let result = sliderToVideo(cardInfo.startP,cardInfo.endP);
  console.log(result);
  numberOfCard++;
  if(!cardInfo.deleted){
    var card =  Card(result.startDuration, result.endDuration,cardInfo.startP,cardInfo.endP,cardInfo);
    arrayCard.push( card);
    document.getElementById('divCardBoard').insertBefore(card.iDiv, document.getElementById('divCardBoard').firstChild);
  }
 
}

/**
 * Adding a card by drag and drop. The card is added in the list of cards
 */
function addingNewCard(startP,endP) {
  if(startP > endP){
    let transit = startP;
    startP = endP;
    endP = transit;
  }
  let result = sliderToVideo(startP,endP);
  numberOfCard++;
  //console.log("wrapperCommandAndRange : " + window.getComputedStyle(wrapperCommandAndRange).);
  var card = new Card(result.startDuration, result.endDuration,startP,endP);
  arrayCard.push( card);
  document.getElementById('divCardBoard').insertBefore(card.iDiv, document.getElementById('divCardBoard').firstChild);
  
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

