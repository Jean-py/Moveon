"use strict";

var fs = require('fs');



export class ServerLogger{
  constructor() {
    return {
      //Send a command to the client
      send: function(command) {
        sendCommand(command);
      },
      //log a command in a file
      log : function(command){
        logCommand(command);
      },
    }
  };
  
  
}

function sendCommand(){

}

function logCommand(id_socket,command){
//log the command into a file
  console.log(command);
  
  if (fs.exists("./src/server/log_txt/log:"+id_socket) === true) {
  
   
    var stream = fs.createWriteStream("./src/server/log_txt/log:"+id_socket);
    stream.once('open', function(fd) {
      stream.write(command+"\n");
      stream.end();
    });
    //console.log('/public/images/flags/' + imgfile + ".png");
    console.log('fs exists');
    
    
  } else {
    fs.writeFile("./src/server/log_txt/log:"+id_socket, command, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
  
 
}

module.exports = ServerLogger;




