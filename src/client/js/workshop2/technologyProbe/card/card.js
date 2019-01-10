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
  let speed = 1;
  let repetitionNumber = 1;
//div used
  let divInfoCard = null;
  //let selectSpeed=null;
  let selectNbRepet = null;
  let selectSpeed = null;
  
  let imgSlow = null;
  
  let textSegment = null;
  let imgRepet = null;
  let divSegment = null;
  let startDuration = startDurationParam;
  let endDuration = endDurationParam;
  let left ;
  
  var buttonDelete = null;
  
  //cette div est la principale, celle qui contient fragment + bardFragment
  iDiv = document.createElement('div');
  iDiv.id = 'idCard' + createUniqueId();
  iDiv.className = 'segmentWrapper';
  iDiv.style.left = startPositionParam + "px";
  
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
  
  //console.log(cardInfo.deleted);
  function updateInfo(){
    var cardObject = {
      width:  width,
      startP : startP,
      endP : endP,
      description : description,
      speed : speed,
      deleted:deleted,
      repetitionNumber : repetitionNumber
    };
    return cardObject;
  }
  
  
  function initListener() {
    textSegment.addEventListener('long-press', function(e){
      createBtnDelete(e);
    });
    divSegment.addEventListener('long-press', function(e){
      createBtnDelete(e);
    });
   
    
    /*selectSpeed.addEventListener("focus", function(){
      cardFunctionalCore.execute(new LogCardSpeedCommand(cardObject));
    });*/
    selectSpeed.addEventListener("blur", function(){
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      cardFunctionalCore.execute(new CardSpeedCommand(cardObject,speedRate));
    });
    
    /*selectNbRepet.addEventListener("focus", function(){
      cardFunctionalCore.execute(new LogCardNbRepetCommand(cardObject));
    });*/
    selectNbRepet.addEventListener("blur", function(){
      let nbRepet = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      console.log("nbrepet in card :" +  nbRepet);
      cardFunctionalCore.execute(new CardNbRepetCommand(cardObject, nbRepet));
    });
    
    
    
    divSegment.addEventListener("mousedown", function () {
      console.log('Click on a card !! ');
      let nbRepet = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
  
      //modifyCardSpeed(cardObject);
      //modifyCardNbRepet(cardObject);
      segmentFeedback.startPostion = iDiv.style.left  ;
      segmentFeedback.width = width;
      feedbackOnSliderVideo(true);
  
      //console.log("play back rate : " , startDuration, endDuration, nbRepet, speedRate);
      videoFunctionalCoreManager.execute(new RepetPartOfVideoCommand(startDuration, endDuration, nbRepet, speedRate));
      //repetPartOfVideo(startDuration, endDuration, nbRepet, speedRate);
    }, false);
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
      cardFunctionalCore.execute(new ModifyCardDescriptionCommand(cardObject,textSegment.value));
    });
    
      //Peupler les listes déroulantes
    for (let i = 0; i < 20; i += 1) {
      selectSpeed.add(new Option(i / 10 + ""));
    }
    selectSpeed.selectedIndex = 10;
    for (let i = 0; i < 20; i++) {
      selectNbRepet.options.add(new Option(i + ""));
    }
    selectNbRepet.selectedIndex = 1;
    
    /*
    selectNbRepet.addEventListener("onchange", function () {
      
      repetitionNumber = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      console.log("selected : " + repetitionNumber);
    });*/
    
    //Div contenant les info du dessus (taille de div invariable)
    divInfoCard.appendChild(imgSlow);
    divInfoCard.appendChild(selectSpeed);
    divInfoCard.appendChild(imgRepet);
    divInfoCard.appendChild(selectNbRepet);
    divInfoCard.appendChild(textSegment);
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
  
  var cardObject = {
    width:  width,
    startP : startP,
    endP : endP,
    description : description,
    speed : speed,
    repetitionNumber : repetitionNumber,
    iDiv:iDiv,
    id:iDiv.id,
    updateInfo : updateInfo
  };
  
  
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
  
  
  
  
  return cardObject;
}



