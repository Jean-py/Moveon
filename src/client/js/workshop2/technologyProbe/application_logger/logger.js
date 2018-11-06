// log helper

var socket = null;
var port = 8000;


var Logger = function() {
  return {
    //Connect to the server
    connect: function(){
      connectToServer();
    },
    //Change the user's name (of the socket)
    changeUsernameSocket: function(username) {
      send_username(username);
    },
    //Send a command to the server and the server logs it
    sendAndLogCommand: function(command) {
      log_command(command);
    },
  }
};









function connectToServer() {
   socket = io.connect('http://localhost:'+port);
};



function send_username(username) {
  if(socket != null){
    console.log("username val : " + username);
    socket.emit('change_username', {username : username})
  }
};

function log_command(commandParam){
  if(socket != null){
    let objCopy = Object.assign({}, commandParam);
    console.log("*** LOGGER : log_command ***" );
    //
    objCopy.execute = objCopy.execute.name;
    objCopy.undo = objCopy.undo.name;
    socket.emit('log_command', objCopy);
    return true;
    
  }
  return false;
};




//Stringify an object, if the object contain a function,
// /!\ it convert the body of the function into text
var stringify = function(obj, prop) {
  var placeholder = '____PLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify(obj, function(key, value) {
    if (typeof value === 'function') {
      fns.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
    return fns.shift();
  });
  return  json + ';';
};


