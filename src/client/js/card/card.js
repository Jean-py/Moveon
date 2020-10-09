var cardFunctionalCore = new CardFunctionalCore();


/**
 *
 * @param startDurationParam Offset on the right (float, example 203.474388 )  -> correspond to the start time of the segment in the video
 * @param endDurationParam Offset on the end right  (float, example 507.911839 ) -> correspond to the stop time of the segment in the video
 * @param startPositionParam  Position in percentage (13.29% 33.96%)
 * @param endPositionParam Position in percentage (13.29% 33.96%)
 * @param cardInfo
 * @return {{width: string, startP: *, endP: *, startDuration: *, endDuration: *, deleted: boolean, description: *, speed: *, iDiv: HTMLDivElement, id: string, updateInfo: function(): *}|*}
 * @constructor
 */
function Card (startDurationParam,endDurationParam,startPositionParam,endPositionParam, cardInfo) {
  var description = '';
  var enablingDragAndDrop = true;
  
  var listCardConnected = [];
  /*
  console.log("startDurationParam,endDurationParam", startDurationParam,endDurationParam);
  console.log("startPositionParam,endPositionParam", startPositionParam,endPositionParam);
  */
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
  let selectRepet = null;
  
  
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
  
    for (let i = 1; i < 20; i += 1) {
      selectSpeed.add(new Option(i / 10 + ""));
    }
    selectSpeed.selectedIndex = 9;
  
    for (let i = 1; i < 20; i += 1) {
      selectRepet.add(new Option(i / 10 + ""));
    }
    selectRepet.selectedIndex = 9;
  
  
  
    //delete apparait
    btnDelete.addEventListener('mousedown',function(){
      removeTheCard();
    });
  
    btnDelete.addEventListener('touchend',function(){
      removeTheCard()
    });
    
    if(btnMinus != null){
  
      btnMinus.addEventListener('mousedown',function(){
        displayDivInfoCard();
      });
      btnMinus.addEventListener('touchend',function(){
        displayDivInfoCard();
      });
      
    }
    
    selectSpeed.addEventListener("mousedown", function(){
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
      speed = speedRate;
      modifyCardSpeed(cardObject, speedRate);
      
      //cardFunctionalCore.execute(new CardSpeedCommand(cardObject,speedRate));
    });
 
   
    divSegment.addEventListener("mousedown", function () {
      let speedRate = selectSpeed.options[selectSpeed.selectedIndex].value;
    
      speed = parseFloat(speedRate);
      description = textSegment.value;
      videoFunctionalCoreManager.execute(new RepetPartOfVideoCommand(startDuration,endDuration ,  100, speed));
      enableDragAndDrop(enablingDragAndDrop);
      showSegmentFeedback(false,null,null);
      updateSegmentFeedback(false);
      //addFeedback(startPositionParam, endPositionParam);
  
    }, false);
    //TODO widget color picker
    //arrowDown.addEventListener("change", watchColorPicker, false);
  }
  
  function enableDragAndDrop(enabling) {
    if(enabling){
      $( function() {
        $( ".segmentWrapper" ).draggable({
          axis: "y",
          snapTolerance: 0,
          snapMode:"inner",
          activeClass: "ui-state-highlight",
          containment : '#wrapperCommandAndRangeCardBoard',
          snap : true
      
      
        });
      } );
  
     /* $( ".segmentWrapper" ).droppable({
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
      );*/
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
    



    if(Math.floor(startDurationParam % 60) < 10 ){
      textStartSegment.value = Math.floor(startDurationParam / 60)+':0'+Math.floor(startDurationParam % 60);
    } else {
      textStartSegment.value = Math.floor(startDurationParam / 60)+':'+Math.floor(startDurationParam % 60);
    }

    
    textStartSegment.readOnly = true;
  
    

// Restrict input to digits and '.' by using a regular expression filter.
   /* setInputFilter(textStartSegment, function(value) {
      return /(([0-9])|([0-1][0-9])|([2][0-3])):(([0-9])|([0-5][0-9]))/.test(value);
    });*/
   /* ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
      textStartSegment.addEventListener(event, function () {
        console.log('in textStartSegment listener');
        
         let spliting = this.value.split(":");
        let minute = parseInt(spliting[0],10)
        let seconde =  parseInt(spliting[1],10);
        
        let total = minute*60+seconde;
       // console.log('AAAAA: ' + this.value);
        
        cardObject.startP = total;
        video_current.currentTime(total);
        cardObject.endP = endPositionParam;
        cardObject.startDuration = video_current.currentTime();
        cardObject.endDuration = endDurationParam;
        let positionParam = document.getElementById("range-slider_handle-min").style.left;
       
        
        console.log("BLOBLO");
        console.log(total,positionParam );
        
        var percentageEnd = endPositionParam;
        
       
        
        
        console.log("XXXXX : " + parseFloat(positionParam) , parseFloat(percentageEnd)  );
        console.log("YYYYY : " + typeof  parseFloat(positionParam) ,typeof parseFloat(percentageEnd)  );
        
        
        let max = Math.max(   parseFloat(positionParam) , parseFloat(percentageEnd) );
        let min = Math.min(   parseFloat(positionParam) , parseFloat(percentageEnd) );
        console.log("ZZZZZZ : " , max , min) ;
        
        
        
        divSegment.style.left = (max-min) + "%";
        updateInfo();
        //initGUI();
      });
    });
   */
    
  
   /* arrowStartSegment  = document.createElement('p');
    arrowStartSegment.className = 'span';
    arrowStartSegment.classList.add('arrowStartSegment');
        divWrapperTextStartSegment.appendChild(arrowStartSegment);
    */
    
   // divWrapperTextStartSegment.appendChild(textStartSegment);
    //divSegment.appendChild(divWrapperTextStartSegment);
    
    /*
    Info Card wrapper (text + img + speed)
    */
    textSegment = document.createElement('input');
    textSegment.className = 'textSegment';
    textSegment.placeholder = "Give me a name";
    //UI button speed and slow
    imgRepet = document.createElement("img");
    imgRepet.className='imgRepet';
    imgSlow = document.createElement("img");
  
    imgSlow.className='imgSlow';
    selectSpeed = document.createElement("select");
    selectSpeed.className ='selectSpeed' ;
  
    selectRepet = document.createElement("select");
    selectRepet.className ='selectSpeed' ;
    
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
    divInfoCard.appendChild(imgRepet);
    divInfoCard.appendChild(selectRepet);
  
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
  
  
  function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
      textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        }
      });
    });
  }

  
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
