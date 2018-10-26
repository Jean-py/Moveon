//TODO faire une classe carte

function Card (startDurationParam,endDurationParam,startPositionParam,endPositionParam, cardInfo) {
  //Propriété de style
  let width = '6%';
  let height = '6%';
  var deleted = false;
  var iDiv = null;
  var startP = startPositionParam;
  var endP = endPositionParam;
//Valeur pour jouer la carte
  let description = '';
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
  playCard();
  
  
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
      e.preventDefault();
      console.log("long press : " + description );
      //delete apparait
      var buttonDelete =  document.createElement('button');
      buttonDelete.id = 'idBtnDelete';
      buttonDelete.style.position = "absolute";
      buttonDelete.type = "button";
      buttonDelete.innerHTML = "Delete";
      buttonDelete.style.width = "100px";
      
      divInfoCard.appendChild(buttonDelete);
      buttonDelete.addEventListener('touchend',function(e){
        feedbackOnSliderVideo(false);
        iDiv.remove();
        deleted = true
      });
      buttonDelete.addEventListener('mousedown',function(e){
        feedbackOnSliderVideo(false);
        iDiv.remove();
        deleted = true
      });
    });
    
    divSegment.addEventListener('long-press', function(e){
      e.preventDefault();
      console.log("long press : " + description );
      //delete apparait
      var buttonDelete =  document.createElement('button');
      buttonDelete.id = 'idBtnDelete';
      buttonDelete.style.position = "absolute";
      buttonDelete.type = "button";
      buttonDelete.innerHTML = "Delete";
      buttonDelete.style.width = "100px";
      
      divInfoCard.appendChild(buttonDelete);
      buttonDelete.addEventListener('touchend',function(e){
        feedbackOnSliderVideo(false);
        iDiv.remove();
        deleted = true
      });
    });
    
    selectSpeed.addEventListener("onchange", function(){
      console.log("change speed : " +     selectSpeed.options[selectSpeed.selectedIndex].value);
      
    });
    
    divSegment.addEventListener("mousedown", function () {
      // console.log('iDiv.id : ');
      
      let nbRepet = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      
      repetitionNumber = nbRepet;
      speed = speedRate;
      
      segmentFeedback.startPostion = iDiv.style.left  ;
      segmentFeedback.width = width;
      feedbackOnSliderVideo(true);
      repetPartOfVideo(startDuration, endDuration, nbRepet, speedRate);
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
    
    textSegment.addEventListener("keyup", function () {
      description = textSegment.value;
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
    iDiv.appendChild(divSegment);
    iDiv.appendChild(textSegment);
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
  
  
  
  
  function playCard(){
    video.currentTime = startDurationParam;
    segmentFeedback.width = iDiv.style.width;
    segmentFeedback.startPostion = iDiv.style.left;
    feedbackOnSliderVideo(true);
  }
  
  
  
  
  
  var cardObject = {
    width:  width,
    startP : startP,
    endP : endP,
    description : description,
    speed : speed,
    repetitionNumber : repetitionNumber,
    iDiv:iDiv,
    updateInfo : updateInfo
  };
  
  
  
  
  
  return cardObject;
}


  function createUniqueId(){
    var date = new Date();
    var components = [
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];
    return components.join("");
  }


  
  