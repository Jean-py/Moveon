"use strict";

var fs = require('fs');
var rll = require('read-last-lines');

var user_name = null;


export class ServerLogger{
  constructor() {
  
    return {
      //Send a command to the client
      send: function(command) {
        sendCommand(command);
      },
      //log a command in a file
      log : function( socket_name , command){
        logCommand(socket_name,command);
      },
      saveSH : function( socket_name , SH){
        saveSH(socket_name,SH);
      }
  };
  
  }
}


function sendCommand(){

}


function setUsernameLog(user_name){
  this.username = user_name;
}


function saveSH(socket_name, SH) {
  console.log("--------------------------------");
  console.log("a la con");
  console.log("--------------------------------");
  
  //log the command into a file
  var file_path = "./src/server/logSH/" + socket_name + "-W2SH";
  console.log(SH);
  console.log(fs.existsSync(file_path));
  console.log(file_path);
  
    console.log('the file ' + file_path + '  exists');
    
    var stream = fs.createWriteStream(file_path, { 'flags': 'w' });
    stream.once('open', function (fd) {
      
      stream.write(SH);
      
      stream.end();
      
    });
  
}


function logCommand(socket_name,command){
//log the command into a file
  let file_path = "./src/server/log_session_client/log:"+socket_name;
  console.log(command.e);
  console.log(command);
  console.log(fs.existsSync(file_path)  );
  console.log(file_path);
  if (fs.existsSync(file_path) ) {
      console.log('the file '+file_path+'  exists');
      //We supress the last line because it's the caracter ]
      addJSONtoLog(file_path, command);
    //console.log('/public/images/flags/' + imgfile + ".png");
  } else {
    createJSONlog(file_path, command);
  }
}


/*

JSON.stringify(evt, function(k, v) {
  if (v instanceof Node) {
    return 'Node';
  }
  if (v instanceof Window) {
    return 'Window';
  }
  return v;
}, ' ');
*/

function createJSONlog(file_path, command) {
  var stream = fs.createWriteStream(file_path,{'flags': 'w'});
  stream.once('open', function(fd) {
    stream.write('[');
    stream.write(JSON.stringify(command, null, 2));
    stream.write('\n');
    stream.write(']');
    stream.end();
  });
  
}

function addJSONtoLog(file_path,command) {
  
  var filename = file_path;
  var lines2nuke = 1;
  var stream = fs.createWriteStream(file_path,{'flags': 'a'});
  stream.once('open', function(fd) {
    //We supress the last line because it's the caracter ], then concatenate the command and add ] again.
    //The  ] is used to create a proper json file that can be parsed without more actions
    rll.read(filename, lines2nuke).then((lines) => {
      var to_vanquish = lines.length;
      fs.stat(filename, (err, stats) => {
        if (err) throw err;
        fs.truncate(filename, stats.size - to_vanquish, (err) => {
          if (err) throw err;
          console.log('File truncated!');
          stream.write(',');
          stream.write(JSON.stringify(command, null, 2));
          stream.write("\n");
          stream.write("]");
          stream.end();
        })
      });
    });
    
  });
  
  
 
  
  
}


module.exports = ServerLogger;




