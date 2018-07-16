var numberOfCard = 0;
var addCard = document.getElementById("idAddCard");
var arrayCard = [];

//dragElement(document.getElementById("card1"));

/*

addCard.addEventListener('click', function (e) {
  addingNewCard();
});*/


/**
 * Adding a card from the list of card
 */
function addingNewCard() {
  numberOfCard++;
  let card = new Card();
  arrayCard.push(card);
}



/**
 * Remove a card from the list of card
*  @param the card to delete
 * @return true is element removed, false instead
*/
function removeCard(card) {
  let index = arrayCard.indexOf(card);
  if(index != -1){
    arrayCard = arrayCard.slice(index,1);
    numberOfCard--;
    return true;
  } else {
    return false;
  }
}





var get = function (key) {
  return window.localStorage ? window.localStorage[key] : null;
}

var put = function (key, value) {
  if (window.localStorage) {
    window.localStorage[key] = value;
  }
}


/*------ Export card in a JSON file  -------*/
var exportCard = function(){
  var serializedArr = JSON.stringify( [arrayCard, numberOfCard] );
  console.log("Serialisation of card complete : " + serializedArr);
}






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
