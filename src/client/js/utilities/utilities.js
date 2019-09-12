
//Card manager to create and delete card
var cardManager = new CardManager();


// log helper
var logger = new Logger();
logger.connect();



function kill(type){
  window.document.body.addEventListener(type, function(e){
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);
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

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


function pad(n) {
  return n < 10 ? `0${n.toString(10)}` : n.toString(10);
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];

