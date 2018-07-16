var height = 200;
var width = 100;
var elmOffset = 0;
var id = -1 ;
var className = null ;
var state = null ;


//Créer une carte et lui attribue un identifiant unique
function Card(className, state) {
  this.className = className;
  this.state = state;
  
  var iDiv = document.createElement('div');
  iDiv.id = 'idCard'+  createUniqueId();
  iDiv.className = 'draggable';
  document.getElementById('divCardBoard').appendChild(iDiv);
  dragElement(document.getElementById(iDiv.id));
  
  this.id = iDiv.id;
  
  console.log("add new card")
}




function createUniqueId(){
  var date = new Date();
  var components = [
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ];
  return components.join("");
}


