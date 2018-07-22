function Card (startDurationParam,endDurationParam,startPositionParam,endPositionParam) {
  
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
  
  let card = null;
  let boxObject = null;
  let imgRepet = null;
  let divSegment = null;
  let id;
  let startDuration = startDurationParam;
  let endDuration = endDurationParam;
  let left ;
  //div pour le segment carte entier
  
  //cette div est la principale, celle qui contien t fragment + bardFragment
  iDiv = document.createElement('div');
  iDiv.id = 'idCard' + createUniqueId();
  
  divSegment = document.createElement('div');
  divSegment.className = 'segment';
  divSegment.style.height = 15 + "px";
  left  = divSegment.style.left;
  iDiv.className = 'resizableSegment';
  
  document.getElementById('divCardBoard').insertBefore(iDiv, document.getElementById('divCardBoard').firstChild);
  
  
  iDiv.style.left = startPositionParam + "px";
  //taille de la carte initiale
  width = iDiv.style.width = parseInt(endPositionParam, 10) - parseInt(startPositionParam, 10) + "px";
  divSegment.style.width = parseInt(endPositionParam, 10) - parseInt(startPositionParam, 10) + "px";
  divSegment.style.top = 0 + "px";
  
  //joue le segment qui vient de se creer
  video.currentTime = startDurationParam;
  
  segmentFeedback.width = iDiv.style.width;
  segmentFeedback.startPostion = iDiv.style.left;
  feedbackOnSliderVideo( true);
  
  
  initGUI();
  initStyle();
  initListener();
  
  
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
  
  
  function initGUI() {
    boxObject = document.getElementById(iDiv.id);
    card = document.createElement('input');
    //UI button speed and slow
    imgRepet = document.createElement("img");
    imgSlow = document.createElement("img");
    
    selectSpeed = document.createElement("select");
    selectNbRepet = document.createElement("select");
    
    divInfoCard = document.createElement('div');
    divInfoCard.className = "infoCard";
    
    
    card.addEventListener("keyup", function () {
      description = card.value;
    });
    
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
    
    //Div contenant les info du dessus (taille de div invariable
  
    divInfoCard.appendChild(imgSlow);
    divInfoCard.appendChild(selectSpeed);
    divInfoCard.appendChild(imgRepet);
    divInfoCard.appendChild(selectNbRepet);
    boxObject.appendChild(divSegment);
    boxObject.appendChild(card);
  
    boxObject.appendChild(divInfoCard);
  
  }
  
  function initStyle() {
    card.style.marginBottom = 6 + "px";
    card.style.background = "transparent";
    card.style.border = '1px';
    card.style.borderColor= 'white';
    card.style.borderRadius = 10 + "px";
    card.type = "text";
    card.style.borderStyle= "solid";
  
    card.style.position = "relative";
    card.style.width = 200 + "px";
    card.style.fontWeight = 'bold';
    card.style.marginLeft = 7 + "px";
    card.style.color = "#ffffff";
    card.style.whiteSpace = 'normal';
    card.style.zIndex = "1";
    card.style.top = "0px";
    card.style.left = divSegment.style.width;
    //card.style.resize = 'horizontal';
    
    divSegment.style.zIndex = "10";
    divSegment.style.left = "0";
    divSegment.style.top = "0";
    
    boxObject.style.marginRight = 3 + "px";
    boxObject.style.marginBottom = 50 + "px";
    
    imgSlow.src = "/media/workshop2/card/slow.png";
    imgSlow.style.width = 20 + "px";
    imgSlow.style.height = 20 + "px";
    //imgSlow.style.margin = 10+"px";
    
    imgRepet.src = "/media/workshop2/card/repet.png";
    imgRepet.style.width = 15 + "px";
    imgRepet.style.height = 15 + "px";
    
    selectSpeed.style.margin = 10 + "px";
    selectSpeed.style.marginRight = 20 + "px";
    selectSpeed.style.marginLeft = 5 + "px";
    selectSpeed.style.color = 'white';
  
  
    selectNbRepet.style.margin = 10 + "px";
    selectNbRepet.style.marginRight = 20 + "px";
    selectNbRepet.style.marginLeft = 5 + "px";
    selectNbRepet.style.color = 'white';
    
    divInfoCard.style.width = 150 + "px";
    divInfoCard.style.height = 10 + "px";
    divInfoCard.style.position = "absolute";
  }
  
  function initListener() {
  
    card.addEventListener('long-press', function(e){
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
  
  
  