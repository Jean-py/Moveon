var cardFunctionalCore = new CardFunctionalCore();

function Card (startDurationParam,endDurationParam,startPositionParam,endPositionParam, cardInfo) {
  var description = '';
  var enablingDragAndDrop = false;
  
  var listCardConnected = [];
  
  console.log("startDurationParam,endDurationParam", startDurationParam,endDurationParam);
  
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
  let selectSpeed = null;
  
  let imgSlow = null;
  
  
  
  var textSegment = null;
  
  var divWrapperTextStartSegment = null;
  var textStartSegment = null;
  var arrowStartSegment = null;
  var divWrapperTextEndSegment = null;
  var textEndSegment = null;
  var btnDelete = null;
  var btnMinus = null;
  var divWrapperBtn = null;
  
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
  iDiv.style.left = startPositionParam ;
  
  
 
  initGUI();
  initListener();
  playCard(iDiv, startDurationParam);
  //console.log(cardInfo.deleted);
  function updateInfo(){
    cardObject.width = width;
    cardObject.startP = startP;
    cardObject.endP = endP;
    cardObject.startDuration = startDuration;
    cardObject.endDuration = endDuration;
    
    cardObject.description = description;
    cardObject.speed = speed;
    cardObject.deleted = deleted;
    cardObject.iDiv = iDiv;
    cardObject.id = iDiv.id;
    return cardObject;
  }
  
  function displayDivInfoCard() {
    if ($(divInfoCard).hasClass('hidden')) {
      btnMinus.innerHTML = '-';
      $(divInfoCard).removeClass('hidden');
      setTimeout(function () {
        $(divInfoCard).removeClass('visuallyhidden');
        divInfoCard.style.display = 'block';
        iDiv.style.height = "auto";
      }, 20);
    } else {
      btnMinus.innerHTML = '+';
      $(divInfoCard).addClass('visuallyhidden');
      $(divInfoCard).one('transitionend', function(e) {
        $(divInfoCard).addClass('hidden');
        divInfoCard.style.display = 'none';
        iDiv.style.height =" 20px";
        
      });
    }
    
  }
  function removeTheCard() {
    if ( confirm( " /!\\ Voulez-vous vraiment supprimer ce segment?" ) ) {
      // Code à éxécuter si le l'utilisateur clique sur "OK"
      //I have a circular error here, that break the log system... I can't find it
      //So I do not log this command for now
      this.deleted = true;
      cardManager.execute(new DeleteCardCommand(cardObject));
      //cardManager.execute(new DeleteCardCommand(cardObject));
    }
  }
  
  
  function initListener() {
    
    textSegment.addEventListener("blur", function () {
      description = textSegment.value;
      cardFunctionalCore.execute(new ModifyCardDescriptionCommand(cardObject,textSegment.value));
    });
  
    for (let i = 0; i < 20; i += 1) {
      selectSpeed.add(new Option(i / 10 + ""));
    }
    selectSpeed.selectedIndex = 10;
    
    
    //delete apparait
    btnDelete.addEventListener('mousedown',function(){
      removeTheCard();
    });
  
    btnDelete.addEventListener('touchend',function(){
      removeTheCard()
    });
    
    btnMinus.addEventListener('mousedown',function(){
      displayDivInfoCard();
    });
    btnMinus.addEventListener('touchend',function(){
      displayDivInfoCard();
    });
   
    selectSpeed.addEventListener("mousedown", function(){
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      speed = speedRate;
      cardFunctionalCore.execute(new CardSpeedCommand(cardObject,speedRate));
    });
 
   
    divSegment.addEventListener("mousedown", function () {
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      speed = speedRate;
      description = textSegment.value;
      videoFunctionalCoreManager.execute(new RepetPartOfVideoCommand(startDuration,endDuration ,  100, speedRate));
      
      
      enableDragAndDrop(enablingDragAndDrop);
      
      
    }, false);
    //TODO widget color picker
    //arrowDown.addEventListener("change", watchColorPicker, false);
  }
  
  
  function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
  
  function enableDragAndDrop(enabling) {
    if(enabling){
      $( function() {
        $( ".segmentWrapper" ).draggable({
          axis: "y",
          snapTolerance: 20,
          snapMode:"inner",
          activeClass: "ui-state-highlight",
          containment : '#wrapperCommandAndRangeCardBoard',
          snap : true
      
      
        });
      } );
  
      $( ".segmentWrapper" ).droppable({
        classes: {
          "ui-droppable": "highlight"
        },
        snap : true,
    
        drop: function( event, ui ) {
          console.log("dropped");
      
          var draggableDiv = document.getElementById(ui.draggable.attr("id"));
          var droppableDiv = document.getElementById($(this).attr("id"));
      
          console.log(draggableDiv,droppableDiv);
          //TODO faire la fonction de drag avec une liste de carte connecté ou une liste chainé de cartes?
          $(this).css("background-color","var(--main-color)");
      
          cardManager.combineSegment(draggableDiv,droppableDiv);
        }
      });
  
      $( ".segmentWrapper" ).draggable({drag: function( event, ui ) {
        
            cardManager.decombineSegment();}
        }
      );
    }
    
  }
  
  function initGUI() {
    /*
      Div for the segment
    */
    divSegment = document.createElement('div');
    divSegment.className = 'segment';
  
    //taille de la carte initiale
    divSegment.style.width = parseInt(endPositionParam, 10) - parseInt(startPositionParam, 10) + "%";
    width = divSegment.style.width;
    
    //The little text area to display start position in the video
    divWrapperTextStartSegment = document.createElement('div');
    divWrapperTextStartSegment.className = 'divWrapperTextStartSegment';
    
    textStartSegment = document.createElement('input');
    textStartSegment.className = 'textStartSegment';
    textStartSegment.value = Math.floor(startDurationParam / 60)+':'+Math.floor(startDurationParam % 60);
    
  
   /* arrowStartSegment  = document.createElement('p');
    arrowStartSegment.className = 'span';
    arrowStartSegment.classList.add('arrowStartSegment');
        divWrapperTextStartSegment.appendChild(arrowStartSegment);
    */
    
    divWrapperTextStartSegment.appendChild(textStartSegment);
    //divSegment.appendChild(divWrapperTextStartSegment);
    
    /*
    Info Card wrapper (text + img + speed)
    */
    textSegment = document.createElement('input');
    textSegment.className = 'textSegment';
    //UI button speed and slow
    imgRepet = document.createElement("img");
    imgRepet.className='imgRepet';
    imgSlow = document.createElement("img");
  
    imgSlow.className='imgSlow';
    selectSpeed = document.createElement("select");
    selectSpeed.className ='selectSpeed' ;
    
    divInfoCard = document.createElement('div');
    divInfoCard.className = "infoCard";
  
    divInfoCard = document.createElement('div');
    divInfoCard.className = "infoCard";
  
    
    /*
    Wrapper that contain the btutton (minus) - and x (delete)
     */
    divWrapperBtn  = document.createElement('div');
    divWrapperBtn.className = 'divWrapperBtn';
    
    btnDelete  = document.createElement('p');
    btnDelete.className = 'span';
    btnDelete.classList.add('btnDeleteCard');
    btnDelete.innerHTML = "x";
  
    btnMinus  = document.createElement('p');
    btnMinus.className = 'span';
    btnMinus.classList.add('btnMinusCard');
    btnMinus.innerHTML = "-";
    divWrapperBtn.appendChild(btnMinus);
    divWrapperBtn.appendChild(btnDelete);
    
  
  //Creation des étapes pour facilement changer la taille des segments
  
    textStartSegment = document.createElement('input');
    textStartSegment.className = '';
    textEndSegment = document.createElement('input');
    textEndSegment.className = '';
    //divInfoCard.appendChild(textStartSegment);
    //divInfoCard.appendChild(textEndSegment);
  
  
    //Div contenant les info du dessus (taille de div invariable)
    divInfoCard.appendChild(imgSlow);
    divInfoCard.appendChild(selectSpeed);
    //divInfoCard.appendChild(imgRepet);
    divInfoCard.appendChild(textSegment);
    iDiv.appendChild(divWrapperTextStartSegment);
    //divInfoCard.appendChild(arrowDown);
    iDiv.appendChild(divSegment);
    
    iDiv.appendChild(divWrapperBtn);
  
    iDiv.appendChild(divInfoCard);
    
    //If the card have been deleted, the color is red, otherwise fourth-color (define in style.css).
    if (cardInfo) {
      if(cardInfo.deleted){
        divSegment.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--unsucess-color');
      } else {
        divSegment.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--fourth-color');
      }
      textSegment.value = cardInfo.description;
      selectSpeed.selectedIndex = cardInfo.speed*10;
    }
  }
  
  cardObject = {
    width:  width,
    startP : startP,
    endP : endP,
    startDuration : startDuration,
    endDuration : endDuration,
    deleted:deleted,
    description : this.description,
    speed :  this.speed,
    iDiv:iDiv,
    id:iDiv.id,
    updateInfo : updateInfo
  };
  
  

  
  return cardObject;
}

/* Permet de drag la video et le SH en entier
$( function() {
  $( ".wrapperCommandAndRange" ).draggable({
    axis: "y",
    drop: function( event, ui ) {
      console.log("drag");
    }
  });
} );*/

/*
$( ".wrapperCommandAndRange" ).droppable({
  drop: function( event, ui ) {
    $( this )
      .addClass( "ui-state-highlight" )
      .find( "p" )
      .html( "Dropped!" );
    console.log("dropped");
  }
});*/







//Color picker
/* var arrowDown = document.createElement('input');
 arrowDown.type = 'jscolor';
 arrowDown.className = 'jscolor';
 arrowDown.value = '#8DFFFF';
 //jscolor.installByClassName("jscolor");
 
 
  arrowDown.border = 'none';
  arrowDown.outline = 'none';
  arrowDown.style.backgroundColor = 'black';
  arrowDown.style.webkitAppearance = 'listitem';
  arrowDown.value = "#41568d";*/

//arrowDown.value = "FF9900";
//arrowDown.mode = 'HS';
//arrowDown.position = 'right' ;
/* arrowDown.value ="#102b9f";
 arrowDown.style.outline="none";*/
/*
function watchColorPicker(event) {
  divSegment.style.backgroundColor = event.target.value;
  
}
*/
