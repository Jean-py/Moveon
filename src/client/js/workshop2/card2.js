
var Card = (function() {
  
  //Propriété de style
  let width = '6%' ;
  let height = '6%';
  let elmOffset = 0;
  
  let className = null ;
  var iDiv = null;
  let startP = 0;  var endP = 0;


//Valeur pour jouer la carte
  let description = '';
  
  
  let speed = 1;
  let repetitionNumber = 1;

//clique ou non
  let expended = false;

//div used
  let divInfoCard =null;
  //let selectSpeed=null;
  let selectNbRepet=null;
  let selectSpeed = null ;
  
  let imgSlow=null;
  
  let card=null;
  let boxObject=null;
  let imgRepet=null;
  let divSegment=null;
  
  
  let id;
  
  
  // PUBLIC OBJECT
  var objectCard = {  };
  
  objectCard['constructor'] = function(startDurationParam,endDurationParam,startPositionParam,endPositionParam) {
    
    let startDuration = startDurationParam;
    let endDuration = endDurationParam;
    //div pour le segment carte entier
    
    //cette div est la principale, celle qui contien t fragment + bardFragment
    iDiv = document.createElement('div');
    iDiv.id = 'idCard'+  createUniqueId();
    id = iDiv.id;
    
    divSegment = document.createElement( 'div' );
    divSegment.className ='segment';
    divSegment.style.height = 15+"px";
    iDiv.className = 'resizableSegment';
    
    document.getElementById('divCardBoard').insertBefore(iDiv, document.getElementById('divCardBoard').firstChild);
    
    
    iDiv.style.left = startPositionParam + "px";
    //taille de la carte initiale
    width = iDiv.style.width = parseInt(endPositionParam,10) - parseInt(startPositionParam,10)+"px";
    divSegment.style.width = parseInt(endPositionParam,10) - parseInt(startPositionParam,10)+"px";
    divSegment.style.top = 0+"px";
    
    //joue le segment qui vient de se creer
    video.currentTime = startDurationParam;
    
    initGUICard(iDiv,startPositionParam,endPositionParam);
    initListenerCard(divSegment,startDuration,endDuration, );
    
    var card = { description, width,height,iDiv,id, selectSpeed, selectNbRepet };
    
    return card;
  };
  
  
  
  
  function initGUICard(iDiv){
    
    boxObject = document.getElementById(iDiv.id);
    card = document.createElement('input');
    //UI button speed and slow
    imgRepet = document.createElement("img");
    imgSlow = document.createElement("img");
    
    selectSpeed = document.createElement("select");
    selectNbRepet = document.createElement("select");
    
    divInfoCard = document.createElement( 'div' );
    divInfoCard.className = "infoCard";
    
    
    
    card.addEventListener("keyup", function(){
      description = card.value;
    });
    
    for (let i = 0; i < 20; i+=1) {
      selectSpeed.add( new Option( i/10 +"" ));
    }
    selectSpeed.selectedIndex = 10;
    for (let i = 0; i < 20; i++) {
      selectNbRepet.options.add( new Option(i+"") );
    }
    selectNbRepet.selectedIndex = 1;
    
    /*
    selectNbRepet.addEventListener("onchange", function () {
      
      repetitionNumber = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      console.log("selected : " + repetitionNumber);
    });*/
    
    //Div contenant les info du dessus (taille de div invariable
    
    
    divInfoCard.appendChild( imgSlow);
    divInfoCard.appendChild( selectSpeed);
    divInfoCard.appendChild( imgRepet);
    divInfoCard.appendChild( selectNbRepet);
    boxObject.appendChild( card);
    boxObject.appendChild(divSegment);
    boxObject.appendChild( divInfoCard);
    
    applyStyle();
    
  }

//lance le segment lors d'un click sur la carte, a l'endroit, nb de repet et vitesse
  function initListenerCard(iDiv,startD,endD){
    
    card.addEventListener("mousedown", function (e) {
      console.log("repetitionNumber : "  + repetitionNumber);
      
      let nbRepet = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      
      repetitionNumber = nbRepet;
      speed = speedRate;
      repetPartOfVideo(startD, endD, nbRepet, speedRate);
      
      
    },false);
    
    iDiv.addEventListener("mousedown", function () {
      
      console.log ('iDiv.id : '+ this.id);
      
      console.log("repetitionNumber : "  + repetitionNumber);
      let nbRepet = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      
      /*console.log("selectNbRepet.options[selectNbRepet.selectedIndex].value : " + selectNbRepet.options[selectNbRepet.selectedIndex].value);
      console.log("selectNbRepet.options[selectNbRepet.selectedIndex].value : " + selectNbRepet.options[selectNbRepet.selectedIndex].value);
      */
      
      repetitionNumber = nbRepet;
      speed = speedRate;
      
      repetPartOfVideo(startD, endD, nbRepet, speedRate);
      
    },false);
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
  
  
  function applyStyle(){
    
    card.style.marginBottom = 6+"px";
    card.style.background = "transparent";
    card.style.border = 'none';
    card.style.borderRadius= 10+"px";
    card.type = "text";
    //card.style.width= (parseInt(iDiv.style.width) - 2) +"px";
    card.style.width = 200 +"px";
    card.style.fontWeight = 'bold';
    card.style.marginLeft = 7 +"px";
    card.style.color = "#ffffff";
    card.style.whiteSpace = 'normal';
    card.style.zIndex = "10";
    card.style.left = "2px";
    card.style.top = "0px";
    
    divSegment.style.zIndex = "1";
    divSegment.style.left = "0";
    divSegment.style.top = "0";
    
    boxObject.style.marginRight = 3+"px";
    boxObject.style.marginBottom = 50+"px";
    
    imgSlow.src = "/media/workshop2/card/slow.png";
    imgSlow.style.width = 20+"px";
    imgSlow.style.height = 20+"px";
    //imgSlow.style.margin = 10+"px";
    
    
    imgRepet.src = "/media/workshop2/card/repet.png";
    imgRepet.style.width = 15+"px";
    imgRepet.style.height = 15+"px";
    
    
    selectSpeed.style.margin = 10+"px";
    selectSpeed.style.marginRight = 20 +"px";
    selectSpeed.style.marginLeft = 5 +"px";
    
    
    
    selectNbRepet.style.margin = 10+"px";
    selectNbRepet.style.marginRight = 20 +"px";
    selectNbRepet.style.marginLeft = 5 +"px";
    
    
    divInfoCard.style.width = 150+"px";
    divInfoCard.style.height = 10+"px";
    divInfoCard.style.position = "absolute";
    
  }
  
  /*
  objectCard['playCard'] =  function(startD,endD){
    console.log("dodo");
    
      console.log("repetitionNumber : "  + repetitionNumber);
      let nbRepet = selectNbRepet.options[selectNbRepet.selectedIndex].value;
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      repetitionNumber = nbRepet;
      speed = speedRate;
      repetPartOfVideo(startD, endD, nbRepet, speedRate);
    
  };*/
  
  
  return objectCard;
  
})();
