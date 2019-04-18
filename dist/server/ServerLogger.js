"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var rll = require('read-last-lines');

var user_name = null;

var ServerLogger = exports.ServerLogger = function ServerLogger() {
  _classCallCheck(this, ServerLogger);

  return {
    //Send a command to the client
    send: function send(command) {
      sendCommand(command);
    },
    //log a command in a file
    log: function log(socket_name, command) {
      logCommand(socket_name, command);
    },
    saveSH: function saveSH(socket_name, SH) {
      _saveSH(socket_name, SH);
    }
  };
};

function sendCommand() {}

function setUsernameLog(user_name) {
  this.username = user_name;
}

function _saveSH(socket_name, SH) {

  //log the command into a file

  var randomN = Math.floor(Math.random() * 100) + 1;

  var file_path = "./src/server/log-SH/" + socket_name + '-' + randomN + "-SH";
  console.log(SH);
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
  var pathOfFiles = "/src/server/log-SH/SH_all_path.txt";

  fs.appendFile(pathOfFiles, file_path + "\n", function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}

function logCommand(socket_name, command) {
  //log the command into a file
  var file_path = "./src/server/log_session_client/log:" + socket_name;
  console.log(command.e);
  console.log(command);
  console.log(fs.existsSync(file_path));
  console.log(file_path);
  if (fs.existsSync(file_path)) {
    console.log('the file ' + file_path + '  exists');
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
  var stream = fs.createWriteStream(file_path, { 'flags': 'w' });
  stream.once('open', function (fd) {
    stream.write('[');
    stream.write(JSON.stringify(command, null, 2));
    stream.write('\n');
    stream.write(']');
    stream.end();
  });
}

function addJSONtoLog(file_path, command) {

  var filename = file_path;
  var lines2nuke = 1;
  var stream = fs.createWriteStream(file_path, { 'flags': 'a' });
  stream.once('open', function (fd) {
    //We supress the last line because it's the caracter ], then concatenate the command and add ] again.
    //The  ] is used to create a proper json file that can be parsed without more actions
    rll.read(filename, lines2nuke).then(function (lines) {
      var to_vanquish = lines.length;
      fs.stat(filename, function (err, stats) {
        if (err) throw err;
        fs.truncate(filename, stats.size - to_vanquish, function (err) {
          if (err) throw err;
          console.log('File truncated!');
          stream.write(',');
          stream.write(JSON.stringify(command, null, 2));
          stream.write("\n");
          stream.write("]");
          stream.end();
        });
      });
    });
  });
}

module.exports = ServerLogger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckxvZ2dlci5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJybGwiLCJ1c2VyX25hbWUiLCJTZXJ2ZXJMb2dnZXIiLCJzZW5kIiwiY29tbWFuZCIsInNlbmRDb21tYW5kIiwibG9nIiwic29ja2V0X25hbWUiLCJsb2dDb21tYW5kIiwic2F2ZVNIIiwiU0giLCJzZXRVc2VybmFtZUxvZyIsInVzZXJuYW1lIiwicmFuZG9tTiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImZpbGVfcGF0aCIsImNvbnNvbGUiLCJleGlzdHNTeW5jIiwic3RyZWFtIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvbmNlIiwiZmQiLCJ3cml0ZSIsImVuZCIsInBhdGhPZkZpbGVzIiwiYXBwZW5kRmlsZSIsImVyciIsImUiLCJhZGRKU09OdG9Mb2ciLCJjcmVhdGVKU09ObG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsImZpbGVuYW1lIiwibGluZXMybnVrZSIsInJlYWQiLCJ0aGVuIiwibGluZXMiLCJ0b192YW5xdWlzaCIsImxlbmd0aCIsInN0YXQiLCJzdGF0cyIsInRydW5jYXRlIiwic2l6ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBLElBQUlBLEtBQUtDLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUMsTUFBTUQsUUFBUSxpQkFBUixDQUFWOztBQUVBLElBQUlFLFlBQVksSUFBaEI7O0lBR2FDLFksV0FBQUEsWSxHQUNYLHdCQUFjO0FBQUE7O0FBRVosU0FBTztBQUNMO0FBQ0FDLFVBQU0sY0FBU0MsT0FBVCxFQUFrQjtBQUN0QkMsa0JBQVlELE9BQVo7QUFDRCxLQUpJO0FBS0w7QUFDQUUsU0FBTSxhQUFVQyxXQUFWLEVBQXdCSCxPQUF4QixFQUFnQztBQUNwQ0ksaUJBQVdELFdBQVgsRUFBdUJILE9BQXZCO0FBQ0QsS0FSSTtBQVNMSyxZQUFTLGdCQUFVRixXQUFWLEVBQXdCRyxFQUF4QixFQUEyQjtBQUNsQ0QsY0FBT0Ys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LFNBQVMsR0FBVixFQUEvQixDQUFiO0FBQ0FHLFNBQU9FLElBQVAsQ0FBWSxNQUFaLEVBQW9CLFVBQVNDLEVBQVQsRUFBYTtBQUMvQjtBQUNBO0FBQ0F2QixRQUFJb0MsSUFBSixDQUFTRixRQUFULEVBQW1CQyxVQUFuQixFQUErQkUsSUFBL0IsQ0FBb0MsVUFBQ0MsS0FBRCxFQUFXO0FBQzdDLFVBQUlDLGNBQWNELE1BQU1FLE1BQXhCO0FBQ0ExQyxTQUFHMkMsSUFBSCxDQUFRUCxRQUFSLEVBQWtCLFVBQUNOLEdBQUQsRUFBTWMsS0FBTixFQUFnQjtBQUNoQyxZQUFJZCxHQUFKLEVBQVMsTUFBTUEsR0FBTjtBQUNUOUIsV0FBRzZDLFFBQUgsQ0FBWVQsUUFBWixFQUFzQlEsTUFBTUUsSUFBTixHQUFhTCxXQUFuQyxFQUFnRCxVQUFDWCxHQUFELEVBQVM7QUFDdkQsY0FBSUEsR0FBSixFQUFTLE1BQU1BLEdBQU47QUFDVFYsa0JBQVFaLEdBQVIsQ0FBWSxpQkFBWjtBQUNBYyxpQkFBT0ksS0FBUCxDQUFhLEdBQWI7QUFDQUosaUJBQU9JLEtBQVAsQ0FBYVEsS0FBS0MsU0FBTCxDQUFlN0IsT0FBZixFQUF3QixJQUF4QixFQUE4QixDQUE5QixDQUFiO0FBQ0FnQixpQkFBT0ksS0FBUCxDQUFhLElBQWI7QUFDQUosaUJBQU9JLEtBQVAsQ0FBYSxHQUFiO0FBQ0FKLGlCQUFPSyxHQUFQO0FBQ0QsU0FSRDtBQVNELE9BWEQ7QUFZRCxLQWREO0FBZ0JELEdBbkJEO0FBeUJEOztBQUdEb0IsT0FBT0MsT0FBUCxHQUFpQjVDLFlBQWpCIiwiZmlsZSI6IlNlcnZlckxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHJsbCA9IHJlcXVpcmUoJ3JlYWQtbGFzdC1saW5lcycpO1xuXG52YXIgdXNlcl9uYW1lID0gbnVsbDtcblxuXG5leHBvcnQgY2xhc3MgU2VydmVyTG9nZ2Vye1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vU2VuZCBhIGNvbW1hbmQgdG8gdGhlIGNsaWVudFxuICAgICAgc2VuZDogZnVuY3Rpb24oY29tbWFuZCkge1xuICAgICAgICBzZW5kQ29tbWFuZChjb21tYW5kKTtcbiAgICAgIH0sXG4gICAgICAvL2xvZyBhIGNvbW1hbmQgaW4gYSBmaWxlXG4gICAgICBsb2cgOiBmdW5jdGlvbiggc29ja2V0X25hbWUgLCBjb21tYW5kKXtcbiAgICAgICAgbG9nQ29tbWFuZChzb2NrZXRfbmFtZSxjb21tYW5kKTtcbiAgICAgIH0sXG4gICAgICBzYXZlU0ggOiBmdW5jdGlvbiggc29ja2V0X25hbWUgLCBTSCl7XG4gICAgICAgIHNhdmVTSChzb2NrZXRfbmFtZSxTSCk7XG4gICAgICB9XG4gIH07XG4gIFxuICB9XG59XG5cblxuZnVuY3Rpb24gc2VuZENvbW1hbmQoKXtcblxufVxuXG5cbmZ1bmN0aW9uIHNldFVzZXJuYW1lTG9nKHVzZXJfbmFtZSl7XG4gIHRoaXMudXNlcm5hbWUgPSB1c2VyX25hbWU7XG59XG5cblxuZnVuY3Rpb24gc2F2ZVNIKHNvY2tldF9uYW1lLCBTSCkge1xuICBcblxuICBcbiAgXG4gIFxuICBcbiAgLy9sb2cgdGhlIGNvbW1hbmQgaW50byBhIGZpbGVcbiAgXG4gIHZhciByYW5kb21OID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKSArIDE7XG4gIFxuICB2YXIgZmlsZV9wYXRoID0gXCIuL3NyYy9zZXJ2ZXIvbG9nLVNIL1wiICsgc29ja2V0X25hbWUgKyctJyArIHJhbmRvbU4gKyAgXCItU0hcIjtcbiAgY29uc29sZS5sb2coU0gpO1xuICBjb25zb2xlLmxvZyhmcy5leGlzdHNTeW5jKGZpbGVfcGF0aCkpO1xuICBjb25zb2xlLmxvZyhmaWxlX3BhdGgpO1xuICBjb25zb2xlLmxvZygndGhlIGZpbGUgJyArIGZpbGVfcGF0aCArICcgIGV4aXN0cycpO1xuICBcbiAgICBcbiAgICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZV9wYXRoLCB7ICdmbGFncyc6ICd3JyB9KTtcbiAgICBzdHJlYW0ub25jZSgnb3BlbicsIGZ1bmN0aW9uIChmZCkge1xuICAgICAgc3RyZWFtLndyaXRlKFNIKTtcbiAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICB9KTtcbiAgXG4gICAgICAvKlxuICAgIFVwZGF0ZSBhIGZpbGUgdGhhdCBrZWVwIHRyYWNrIG9mIHRoZSBwYXRoIG9mIGFsbCB0aGUgc2VnbWVudCBoaXN0b3J5LlxuICAgIFRoaXMgZmlsZSBpcyB1c2VkIGluIHRoZSBjbGllbnQgc2lkZSB0b1xuICAgICovXG4gICAgICB2YXIgcGF0aE9mRmlsZXMgPSBcIi4vc3JjL3NlcnZlci9sb2ctU0gvcGF0aE9mRmlsZS50eHRcIjtcbiAgXG4gIFxuICBmcy5hcHBlbmRGaWxlKHBhdGhPZkZpbGVzLCBmaWxlX3BhdGgrXCJcXG5cIiwgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICBjb25zb2xlLmxvZygnU2F2ZWQhJyk7XG4gIH0pO1xuICBcbiAgXG59XG5cblxuZnVuY3Rpb24gbG9nQ29tbWFuZChzb2NrZXRfbmFtZSxjb21tYW5kKXtcbi8vbG9nIHRoZSBjb21tYW5kIGludG8gYSBmaWxlXG4gIGxldCBmaWxlX3BhdGggPSBcIi4vc3JjL3NlcnZlci9sb2dfc2Vzc2lvbl9jbGllbnQvbG9nOlwiK3NvY2tldF9uYW1lO1xuICBjb25zb2xlLmxvZyhjb21tYW5kLmUpO1xuICBjb25zb2xlLmxvZyhjb21tYW5kKTtcbiAgY29uc29sZS5sb2coZnMuZXhpc3RzU3luYyhmaWxlX3BhdGgpICApO1xuICBjb25zb2xlLmxvZyhmaWxlX3BhdGgpO1xuICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlX3BhdGgpICkge1xuICAgICAgY29uc29sZS5sb2coJ3RoZSBmaWxlICcrZmlsZV9wYXRoKycgIGV4aXN0cycpO1xuICAgICAgLy9XZSBzdXByZXNzIHRoZSBsYXN0IGxpbmUgYmVjYXVzZSBpdCdzIHRoZSBjYXJhY3RlciBdXG4gICAgICBhZGRKU09OdG9Mb2coZmlsZV9wYXRoLCBjb21tYW5kKTtcbiAgICAvL2NvbnNvbGUubG9nKCcvcHVibGljL2ltYWdlcy9mbGFncy8nICsgaW1nZmlsZSArIFwiLnBuZ1wiKTtcbiAgfSBlbHNlIHtcbiAgICBjcmVhdGVKU09ObG9nKGZpbGVfcGF0aCwgY29tbWFuZCk7XG4gIH1cbn1cblxuXG4vKlxuXG5KU09OLnN0cmluZ2lmeShldnQsIGZ1bmN0aW9uKGssIHYpIHtcbiAgaWYgKHYgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgcmV0dXJuICdOb2RlJztcbiAgfVxuICBpZiAodiBpbnN0YW5jZW9mIFdpbmRvdykge1xuICAgIHJldHVybiAnV2luZG93JztcbiAgfVxuICByZXR1cm4gdjtcbn0sICcgJyk7XG4qL1xuXG5mdW5jdGlvbiBjcmVhdGVKU09ObG9nKGZpbGVfcGF0aCwgY29tbWFuZCkge1xuICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZV9wYXRoLHsnZmxhZ3MnOiAndyd9KTtcbiAgc3RyZWFtLm9uY2UoJ29wZW4nLCBmdW5jdGlvbihmZCkge1xuICAgIHN0cmVhbS53cml0ZSgnWycpO1xuICAgIHN0cmVhbS53cml0ZShKU09OLnN0cmluZ2lmeShjb21tYW5kLCBudWxsLCAyKSk7XG4gICAgc3RyZWFtLndyaXRlKCdcXG4nKTtcbiAgICBzdHJlYW0ud3JpdGUoJ10nKTtcbiAgICBzdHJlYW0uZW5kKCk7XG4gIH0pO1xuICBcbn1cblxuZnVuY3Rpb24gYWRkSlNPTnRvTG9nKGZpbGVfcGF0aCxjb21tYW5kKSB7XG4gIFxuICB2YXIgZmlsZW5hbWUgPSBmaWxlX3BhdGg7XG4gIHZhciBsaW5lczJudWtlID0gMTtcbiAgdmFyIHN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVfcGF0aCx7J2ZsYWdzJzogJ2EnfSk7XG4gIHN0cmVhbS5vbmNlKCdvcGVuJywgZnVuY3Rpb24oZmQpIHtcbiAgICAvL1dlIHN1cHJlc3MgdGhlIGxhc3QgbGluZSBiZWNhdXNlIGl0J3MgdGhlIGNhcmFjdGVyIF0sIHRoZW4gY29uY2F0ZW5hdGUgdGhlIGNvbW1hbmQgYW5kIGFkZCBdIGFnYWluLlxuICAgIC8vVGhlICBdIGlzIHVzZWQgdG8gY3JlYXRlIGEgcHJvcGVyIGpzb24gZmlsZSB0aGF0IGNhbiBiZSBwYXJzZWQgd2l0aG91dCBtb3JlIGFjdGlvbnNcbiAgICBybGwucmVhZChmaWxlbmFtZSwgbGluZXMybnVrZSkudGhlbigobGluZXMpID0+IHtcbiAgICAgIHZhciB0b192YW5xdWlzaCA9IGxpbmVzLmxlbmd0aDtcbiAgICAgIGZzLnN0YXQoZmlsZW5hbWUsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgZnMudHJ1bmNhdGUoZmlsZW5hbWUsIHN0YXRzLnNpemUgLSB0b192YW5xdWlzaCwgKGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRmlsZSB0cnVuY2F0ZWQhJyk7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKCcsJyk7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKEpTT04uc3RyaW5naWZ5KGNvbW1hbmQsIG51bGwsIDIpKTtcbiAgICAgICAgICBzdHJlYW0ud3JpdGUoXCJcXG5cIik7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKFwiXVwiKTtcbiAgICAgICAgICBzdHJlYW0uZW5kKCk7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgfSk7XG4gIFxuICBcbiBcbiAgXG4gIFxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VydmVyTG9nZ2VyO1xuXG5cblxuXG4iXX0=