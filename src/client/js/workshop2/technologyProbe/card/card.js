var cardFunctionalCore = new CardFunctionalCore();

function Card (startDurationParam,endDurationParam,startPositionParam,endPositionParam, cardInfo) {
  var description = '';
  
  //Propriété de style
  let width = '6%';
  let height = '6%';
  var deleted = false;
  var iDiv = null;
  var startP = startPositionParam;
  var endP = endPositionParam;
//Valeur pour jouer la carte
  var speed = 1;
  var repetitionNumber = 1;
//div used
  let divInfoCard = null;
  //let selectSpeed=null;
  let selectNbRepet = null;
  let selectSpeed = null;
  
  let imgSlow = null;
  
  var textSegment = null;
  let imgRepet = null;
  let divSegment = null;
  let startDuration = startDurationParam;
  let endDuration = endDurationParam;
  let left ;
  
  var buttonDelete = null;
  var cardObject;
  
  //cette div est la principale, celle qui contient fragment + bardFragment
  iDiv = document.createElement('div');
  iDiv.id = 'idCard' + createUniqueId();
  iDiv.className = 'segmentWrapper';
  iDiv.style.left = startPositionParam + "px";
  
  
  //Color picker
  var arrowDown = document.createElement('input');
  arrowDown.type = 'jscolor';
  arrowDown.className = 'jscolor';
  arrowDown.value = '#8DFFFF';
  jscolor.installByClassName("jscolor");
  
  
  
  /* arrowDown.border = 'none';
   arrowDown.outline = 'none';
   arrowDown.style.backgroundColor = 'black';
   arrowDown.style.webkitAppearance = 'listitem';
   arrowDown.value = "#41568d";*/
  
     //arrowDown.value = "FF9900";
  //arrowDown.mode = 'HS';
  //arrowDown.position = 'right' ;
 /* arrowDown.value ="#102b9f";
  arrowDown.style.outline="none";*/
  
  //Div du segment bleu
  divSegment = document.createElement('div');
  divSegment.className = 'segment';
  
  //taille de la carte initiale
  width = iDiv.style.width = parseInt(endPositionParam, 10) - parseInt(startPositionParam, 10) + "px";
  divSegment.style.width = parseInt(endPositionParam, 10) - parseInt(startPositionParam, 10) + "px";
  
  initGUI();
  initStyle();
  initListener();
  playCard(iDiv, startDurationParam);
  
  
  function watchColorPicker(event) {
    divSegment.style.backgroundColor = event.target.value;
    console.log("color");
  }
  //console.log(cardInfo.deleted);
  function updateInfo(){
//    console.log(description,speed,repetitionNumber);
    cardObject.width = width;
    cardObject.startP = startP;
    cardObject.endP = endP;
    cardObject.description = description;
    cardObject.speed = speed;
    cardObject.deleted = deleted;
    cardObject.repetitionNumber = repetitionNumber;
    cardObject.iDiv = iDiv;
    cardObject.id = iDiv.id;
    return cardObject;
  }
  
  
  function initListener() {
    textSegment.addEventListener('long-press', function(e){
      createBtnDelete(e);
    });
    divSegment.addEventListener('long-press', function(e){
      createBtnDelete(e);
    });
    selectSpeed.addEventListener("blur", function(e){
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      speed = speedRate;
      cardFunctionalCore.execute(new CardSpeedCommand(cardObject,speedRate));
    });
    selectNbRepet.addEventListener("blur", function(e){
      repetitionNumber = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      console.log("nbrepet in card :" +  repetitionNumber);
      cardFunctionalCore.execute(new CardNbRepetCommand(cardObject, repetitionNumber));
    });
    divSegment.addEventListener("mousedown", function (e) {
      repetitionNumber = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      speed = speedRate;
      segmentFeedback.startPostion = iDiv.style.left  ;
      segmentFeedback.width = width;
      description = textSegment.value;
      feedbackOnSliderVideo(true);
      videoFunctionalCoreManager.execute(new RepetPartOfVideoCommand(startDuration, endDuration, repetitionNumber, speedRate));
    }, false);
    //TODO widget color picker
    arrowDown.addEventListener("change", watchColorPicker, false);
  }
  function initGUI() {
    textSegment = document.createElement('input');
    textSegment.className = 'textSegment';
    //UI button speed and slow
    imgRepet = document.createElement("img");
    imgRepet.className='imgRepet';
    imgSlow = document.createElement("img");
  
    imgSlow.className='imgSlow';
    selectSpeed = document.createElement("select");
    selectSpeed.className ='selectSpeed' ;
    selectNbRepet = document.createElement("select");
  
    selectNbRepet.className ='selectNbRepet' ;
    divInfoCard = document.createElement('div');
  
    divInfoCard.className = "infoCard";
    
    /*textSegment.addEventListener("focus", function () {
      cardFunctionalCore.execute(new ModifyCardDescriptionCommand(cardObject,textSegment.value));
    });*/
    textSegment.addEventListener("blur", function () {
      description = textSegment.value;
      cardFunctionalCore.execute(new ModifyCardDescriptionCommand(cardObject,textSegment.value));
    });
    
    for (let i = 0; i < 20; i += 1) {
      selectSpeed.add(new Option(i / 10 + ""));
    }
    selectSpeed.selectedIndex = 10;
    for (let i = 0; i < 20; i++) {
      selectNbRepet.options.add(new Option(i + ""));
    }
  
    selectNbRepet.selectedIndex = 1;
  
    //Div contenant les info du dessus (taille de div invariable)
    divInfoCard.appendChild(imgSlow);
    divInfoCard.appendChild(selectSpeed);
    divInfoCard.appendChild(imgRepet);
    divInfoCard.appendChild(selectNbRepet);
    divInfoCard.appendChild(textSegment);
    //divInfoCard.appendChild(arrowDown);
    iDiv.appendChild(divSegment);
    iDiv.appendChild(divInfoCard);
  
  
    //If the card have been deleted, the color is red, otherwise blue.
    if (cardInfo) {
      if(cardInfo.deleted){
        divSegment.style.backgroundColor = "red";
      } else {
        divSegment.style.backgroundColor = "#213F8D";
      }
      textSegment.value = cardInfo.description;
      selectNbRepet.selectedIndex = cardInfo.repetitionNumber;
      selectSpeed.selectedIndex = cardInfo.speed*10;
    }
    
  }
  
  
  
  function initStyle() {
    textSegment.style.left = divSegment.style.width;
    imgSlow.src = "/media/workshop2/card/slow.png";
    imgRepet.src = "/media/workshop2/card/repet.png";
  }
  
  
  
  function createBtnDelete(e){
    e.preventDefault();
    //delete apparait
    var buttonDelete =  document.createElement('button');
    buttonDelete.id = 'idBtnDelete';
    buttonDelete.style.position = "absolute";
    buttonDelete.type = "button";
    buttonDelete.innerHTML = "Delete";
    buttonDelete.style.width = "100px";
    divInfoCard.appendChild(buttonDelete);
    buttonDelete.addEventListener('mouseup',function(e){
      //TODO
      cardManager.execute(new DeleteCardCommand(cardObject));
      //deleteCard(cardObject);
    });
    
    buttonDelete.addEventListener('touchend',function(e){
      cardManager.execute(new DeleteCardCommand(cardObject));
      //deleteCard();
    });
  }
  
  cardObject = {
    width:  width,
    startP : startP,
    endP : endP,
    description : this.description,
    speed :  this.speed,
    repetitionNumber :  this.repetitionNumber,
    iDiv:iDiv,
    id:iDiv.id,
    updateInfo : updateInfo
  };
  
  
  return cardObject;
}



