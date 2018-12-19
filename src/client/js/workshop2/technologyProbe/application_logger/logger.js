// log helper

var socket = null;
var port = 8000;
var socket_name_session = "dev";

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
    getSocket_name_session: function () {
      console.log("test : " + socket_name_session);
      return getSocket_name_session();
    },
  }
};

function getSocket_name_session(){
  return socket_name_session;
}







function connectToServer() {
  console.log("testing connect to server...");
  var addr = document.URL;
  //Split the https://xxxx:port#oNote  to xxxx:port
  addr = addr.split('/')[2];
  console.log("connect to : " + addr);
  socket = io.connect(addr);
  console.log("changing username socket to dev");
  logger.changeUsernameSocket("dev");
};



function send_username(username) {
  if(socket != null){
    //console.log("username val : " + username);
    socket_name_session = username;
    socket.emit("socket_username", {username : username})
  }
};

//TODO faire une deep recopies des objets passé en parametre!
function log_command(commandParam){
  console.log("executing : ");
  console.log(commandParam);
  if(socket != null){
    var objCopy = null;
    
    //We have to log an event, if so, it's a circular reference and need to be treated as well
    if (commandParam.e !== undefined) {
      //console.log("OK --- " ) ;
      //console.log(commandParam.e.pageX) ;
      
      const mouse_event = {mouseEvent : {pageX: commandParam.e.pageX, pageY: commandParam.e.pageY}};
      
      //const o2 = { y: commandParam.e.pageY};
       objCopy = Object.assign({}, commandParam);
       objCopy = Object.assign(commandParam, mouse_event);
       objCopy.e = undefined;
    } else {
       objCopy = Object.assign({}, commandParam);
    }
  
    
    
    //console.log("*** LOGGER : log_command ***" );
    if(socket_name_session !== null ){
      send_username(socket_name_session);
    }
    objCopy.execute = objCopy.execute.name;
    if(objCopy.undo != null){
      objCopy.undo = objCopy.undo.name;
    }

    socket.emit("log_command", objCopy);
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


