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
  console.log("--------------------------------");
  console.log("a la con");
  console.log("--------------------------------");

  //log the command into a file
  var file_path = "./src/server/log-SH/" + socket_name + "-W2SH";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckxvZ2dlci5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJybGwiLCJ1c2VyX25hbWUiLCJTZXJ2ZXJMb2dnZXIiLCJzZW5kIiwiY29tbWFuZCIsInNlbmRDb21tYW5kIiwibG9nIiwic29ja2V0X25hbWUiLCJsb2dDb21tYW5kIiwic2F2ZVNIIiwiU0giLCJzZXRVc2VybmFtZUxvZyIsInVzZXJuYW1lIiwiY29uc29sZSIsImZpbGVfcGF0aCIsImV4aXN0c1N5bmMiLCJzdHJlYW0iLCJjcmVhdGVXcml0ZVN0cmVhbSIsIm9uY2UiLCJmZCIsIndyaXRlIiwiZW5kIiwiZSIsImFkZEpTT050b0xvZyIsImNyZWF0ZUpTT05sb2ciLCJKU09OIiwic3RyaW5naWZ5IiwiZmlsZW5hbWUiLCJsaW5lczJudWtlIiwicmVhZCIsInRoZW4iLCJsaW5lcyIsInRvX3ZhbnF1aXNoIiwibGVuZ3RoIiwic3RhdCIsImVyciIsInN0YXRzIiwidHJ1bmNhdGUiLCJzaXplIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBRUEsSUFBSUEsS0FBS0MsUUFBUSxJQUFSLENBQVQ7QUFDQSxJQUFJQyxNQUFNRCxRQUFRLGlCQUFSLENBQVY7O0FBRUEsSUFBSUUsWUFBWSxJQUFoQjs7SUFHYUMsWSxXQUFBQSxZLEdBQ1gsd0JBQWM7QUFBQTs7QUFFWixTQUFPO0FBQ0w7QUFDQUMsVUFBTSxjQUFTQyxPQUFULEVBQWtCO0FBQ3RCQyxrQkFBWUQsT0FBWjtBQUNELEtBSkk7QUFLTDtBQUNBRSxTQUFNLGFBQVVDLFdBQVYsRUFBd0JILE9BQXhCLEVBQWdDO0FBQ3BDSSxpQkFBV0QsV0FBWCxFQUF1QkgsT0FBdkI7QUFDRCxLQVJJO0FBU0xLLFlBQVMsZ0JBQVVGLFdBQVYsRUFBd0JHLEVBQXhCLEVBQTJCO0FBQ2xDRCxjQUFPRixXQUFQLEVBQW1CRyxFQUFuQjtBQUNEO0FBWEksR0FBUDtBQWNELEM7O0FBSUgsU0FBU0wsV0FBVCxHQUFz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QWdCO0FBQ2hDLFlBQUlELEdBQUosRUFBUyxNQUFNQSxHQUFOO0FBQ1RyQyxXQUFHdUMsUUFBSCxDQUFZVixRQUFaLEVBQXNCUyxNQUFNRSxJQUFOLEdBQWFOLFdBQW5DLEVBQWdELFVBQUNHLEdBQUQsRUFBUztBQUN2RCxjQUFJQSxHQUFKLEVBQVMsTUFBTUEsR0FBTjtBQUNUdEIsa0JBQVFQLEdBQVIsQ0FBWSxpQkFBWjtBQUNBVSxpQkFBT0ksS0FBUCxDQUFhLEdBQWI7QUFDQUosaUJBQU9JLEtBQVAsQ0FBYUssS0FBS0MsU0FBTCxDQUFldEIsT0FBZixFQUF3QixJQUF4QixFQUE4QixDQUE5QixDQUFiO0FBQ0FZLGlCQUFPSSxLQUFQLENBQWEsSUFBYjtBQUNBSixpQkFBT0ksS0FBUCxDQUFhLEdBQWI7QUFDQUosaUJBQU9LLEdBQVA7QUFDRCxTQVJEO0FBU0QsT0FYRDtBQVlELEtBZEQ7QUFnQkQsR0FuQkQ7QUF5QkQ7O0FBR0RrQixPQUFPQyxPQUFQLEdBQWlCdEMsWUFBakIiLCJmaWxlIjoiU2VydmVyTG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcmxsID0gcmVxdWlyZSgncmVhZC1sYXN0LWxpbmVzJyk7XG5cbnZhciB1c2VyX25hbWUgPSBudWxsO1xuXG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJMb2dnZXJ7XG4gIGNvbnN0cnVjdG9yKCkge1xuICBcbiAgICByZXR1cm4ge1xuICAgICAgLy9TZW5kIGEgY29tbWFuZCB0byB0aGUgY2xpZW50XG4gICAgICBzZW5kOiBmdW5jdGlvbihjb21tYW5kKSB7XG4gICAgICAgIHNlbmRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgfSxcbiAgICAgIC8vbG9nIGEgY29tbWFuZCBpbiBhIGZpbGVcbiAgICAgIGxvZyA6IGZ1bmN0aW9uKCBzb2NrZXRfbmFtZSAsIGNvbW1hbmQpe1xuICAgICAgICBsb2dDb21tYW5kKHNvY2tldF9uYW1lLGNvbW1hbmQpO1xuICAgICAgfSxcbiAgICAgIHNhdmVTSCA6IGZ1bmN0aW9uKCBzb2NrZXRfbmFtZSAsIFNIKXtcbiAgICAgICAgc2F2ZVNIKHNvY2tldF9uYW1lLFNIKTtcbiAgICAgIH1cbiAgfTtcbiAgXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzZW5kQ29tbWFuZCgpe1xuXG59XG5cblxuZnVuY3Rpb24gc2V0VXNlcm5hbWVMb2codXNlcl9uYW1lKXtcbiAgdGhpcy51c2VybmFtZSA9IHVzZXJfbmFtZTtcbn1cblxuXG5mdW5jdGlvbiBzYXZlU0goc29ja2V0X25hbWUsIFNIKSB7XG4gIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gIGNvbnNvbGUubG9nKFwiYSBsYSBjb25cIik7XG4gIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gIFxuICAvL2xvZyB0aGUgY29tbWFuZCBpbnRvIGEgZmlsZVxuICB2YXIgZmlsZV9wYXRoID0gXCIuL3NyYy9zZXJ2ZXIvbG9nLVNIL1wiICsgc29ja2V0X25hbWUgKyBcIi1XMlNIXCI7XG4gIGNvbnNvbGUubG9nKFNIKTtcbiAgY29uc29sZS5sb2coZnMuZXhpc3RzU3luYyhmaWxlX3BhdGgpKTtcbiAgY29uc29sZS5sb2coZmlsZV9wYXRoKTtcbiAgXG4gICAgY29uc29sZS5sb2coJ3RoZSBmaWxlICcgKyBmaWxlX3BhdGggKyAnICBleGlzdHMnKTtcbiAgICBcbiAgICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZV9wYXRoLCB7ICdmbGFncyc6ICd3JyB9KTtcbiAgICBzdHJlYW0ub25jZSgnb3BlbicsIGZ1bmN0aW9uIChmZCkge1xuICAgICAgc3RyZWFtLndyaXRlKFNIKTtcbiAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICB9KTtcbiAgXG59XG5cblxuZnVuY3Rpb24gbG9nQ29tbWFuZChzb2NrZXRfbmFtZSxjb21tYW5kKXtcbi8vbG9nIHRoZSBjb21tYW5kIGludG8gYSBmaWxlXG4gIGxldCBmaWxlX3BhdGggPSBcIi4vc3JjL3NlcnZlci9sb2dfc2Vzc2lvbl9jbGllbnQvbG9nOlwiK3NvY2tldF9uYW1lO1xuICBjb25zb2xlLmxvZyhjb21tYW5kLmUpO1xuICBjb25zb2xlLmxvZyhjb21tYW5kKTtcbiAgY29uc29sZS5sb2coZnMuZXhpc3RzU3luYyhmaWxlX3BhdGgpICApO1xuICBjb25zb2xlLmxvZyhmaWxlX3BhdGgpO1xuICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlX3BhdGgpICkge1xuICAgICAgY29uc29sZS5sb2coJ3RoZSBmaWxlICcrZmlsZV9wYXRoKycgIGV4aXN0cycpO1xuICAgICAgLy9XZSBzdXByZXNzIHRoZSBsYXN0IGxpbmUgYmVjYXVzZSBpdCdzIHRoZSBjYXJhY3RlciBdXG4gICAgICBhZGRKU09OdG9Mb2coZmlsZV9wYXRoLCBjb21tYW5kKTtcbiAgICAvL2NvbnNvbGUubG9nKCcvcHVibGljL2ltYWdlcy9mbGFncy8nICsgaW1nZmlsZSArIFwiLnBuZ1wiKTtcbiAgfSBlbHNlIHtcbiAgICBjcmVhdGVKU09ObG9nKGZpbGVfcGF0aCwgY29tbWFuZCk7XG4gIH1cbn1cblxuXG4vKlxuXG5KU09OLnN0cmluZ2lmeShldnQsIGZ1bmN0aW9uKGssIHYpIHtcbiAgaWYgKHYgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgcmV0dXJuICdOb2RlJztcbiAgfVxuICBpZiAodiBpbnN0YW5jZW9mIFdpbmRvdykge1xuICAgIHJldHVybiAnV2luZG93JztcbiAgfVxuICByZXR1cm4gdjtcbn0sICcgJyk7XG4qL1xuXG5mdW5jdGlvbiBjcmVhdGVKU09ObG9nKGZpbGVfcGF0aCwgY29tbWFuZCkge1xuICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZV9wYXRoLHsnZmxhZ3MnOiAndyd9KTtcbiAgc3RyZWFtLm9uY2UoJ29wZW4nLCBmdW5jdGlvbihmZCkge1xuICAgIHN0cmVhbS53cml0ZSgnWycpO1xuICAgIHN0cmVhbS53cml0ZShKU09OLnN0cmluZ2lmeShjb21tYW5kLCBudWxsLCAyKSk7XG4gICAgc3RyZWFtLndyaXRlKCdcXG4nKTtcbiAgICBzdHJlYW0ud3JpdGUoJ10nKTtcbiAgICBzdHJlYW0uZW5kKCk7XG4gIH0pO1xuICBcbn1cblxuZnVuY3Rpb24gYWRkSlNPTnRvTG9nKGZpbGVfcGF0aCxjb21tYW5kKSB7XG4gIFxuICB2YXIgZmlsZW5hbWUgPSBmaWxlX3BhdGg7XG4gIHZhciBsaW5lczJudWtlID0gMTtcbiAgdmFyIHN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVfcGF0aCx7J2ZsYWdzJzogJ2EnfSk7XG4gIHN0cmVhbS5vbmNlKCdvcGVuJywgZnVuY3Rpb24oZmQpIHtcbiAgICAvL1dlIHN1cHJlc3MgdGhlIGxhc3QgbGluZSBiZWNhdXNlIGl0J3MgdGhlIGNhcmFjdGVyIF0sIHRoZW4gY29uY2F0ZW5hdGUgdGhlIGNvbW1hbmQgYW5kIGFkZCBdIGFnYWluLlxuICAgIC8vVGhlICBdIGlzIHVzZWQgdG8gY3JlYXRlIGEgcHJvcGVyIGpzb24gZmlsZSB0aGF0IGNhbiBiZSBwYXJzZWQgd2l0aG91dCBtb3JlIGFjdGlvbnNcbiAgICBybGwucmVhZChmaWxlbmFtZSwgbGluZXMybnVrZSkudGhlbigobGluZXMpID0+IHtcbiAgICAgIHZhciB0b192YW5xdWlzaCA9IGxpbmVzLmxlbmd0aDtcbiAgICAgIGZzLnN0YXQoZmlsZW5hbWUsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgZnMudHJ1bmNhdGUoZmlsZW5hbWUsIHN0YXRzLnNpemUgLSB0b192YW5xdWlzaCwgKGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRmlsZSB0cnVuY2F0ZWQhJyk7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKCcsJyk7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKEpTT04uc3RyaW5naWZ5KGNvbW1hbmQsIG51bGwsIDIpKTtcbiAgICAgICAgICBzdHJlYW0ud3JpdGUoXCJcXG5cIik7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKFwiXVwiKTtcbiAgICAgICAgICBzdHJlYW0uZW5kKCk7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgfSk7XG4gIFxuICBcbiBcbiAgXG4gIFxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VydmVyTG9nZ2VyO1xuXG5cblxuXG4iXX0=