"use strict";

var fs = require('fs');
var rll = require('read-last-lines');
let express = require('express');
let router = express.Router();
var Decomposition = require('../server/data_base/models/decompositions');

//TODO faire la callback pour le post du SH?
//router.post('/', function (req, res, next) {});





class ServerLogger{
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
      saveSHMongoDB : function( socket_name , SH){
        //saveSH(socket_name,SH);
        //We now save the SH in MongoDB
        saveSHMongoDB(socket_name,SH)
        
      }
      
    };
  }
}


function sendCommand(){

}


function saveSHMongoDB(socket_name, SH) {
  
  console.log("in saveSHMongoDB");
  //Format the date
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  
  
  
  var d = new Date();
  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds());
  var month =  addZero(d.getMonth());
  var day =  addZero(d.getDay());
  
  var date =  day+"/"+month+"_"+ h + ":" + m + ":" + s;
  
  //TODO
  // Enregistrer le SH avec les bonnes informations dans MongoDB
  const saved_decomposition = new Decomposition({
    username: socket_name,
    video: 'frame',
    date : date,
    project: 'only_project',
    data : SH
  });
  
  
  
  
  var mongoose = require('mongoose');
  var session = require('express-session');
  var MongoStore = require('connect-mongo')(session);
  
  mongoose.connect('mongodb://localhost/segmentHistory',  { useNewUrlParser: true });
  const dbComposition = mongoose.connection;
//handle mongo error
  dbComposition.on('error', console.error.bind(console, 'connection error:'));
  dbComposition.once('open', function () {
    // we're connected!
    console.log("Saving decomposition in mongodb....");
    saved_decomposition.save(function (err, user) {
      if (err) {return console.error(err);}
      //console.log("saved to the collection. : " + user.username );
      console.log("decomposition : "  );
      console.log(saved_decomposition);
    });
  });
}


function saveSH(socket_name, SH) {
  //Format the date
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  
  
  
  var d = new Date();
  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds());
  var month =  addZero(d.getMonth());
  var day =  addZero(d.getDay());
  
  var date =  day+"/"+month+"_"+ h + ":" + m + ":" + s;
  
  var file_path = "./src/server/log-SH/" + socket_name +'-' +d;

  console.log(fs.existsSync(file_path));
  console.log(file_path);
  console.log('the file ' + file_path + '  exists');
  
  
  var stream = fs.createWriteStream(file_path, { 'flags': 'w' });
  stream.once('open', function (fd) {
    stream.write(SH);
    stream.end();
  });
  
  /*
Update a file that keep track of the path of all the segment history.
This file is used in the client side to
*/
/*  var pathOfFiles = "./src/server/log-SH/SH_all_path.txt";
  
  
  fs.appendFile(pathOfFiles, file_path+"\n", function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  */
  
}


function logCommand(socket_name,command){
//log the command into a file
  let file_path = "./src/server/log_session_client/log:"+socket_name;
  /*console.log(command.e);
  console.log(command);
  console.log(fs.existsSync(file_path)  );
  console.log(file_path);*/
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
          //console.log('File truncated!');
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
