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
  var file_path = "./src/server/log-SH/" + socket_name + Math.random() * 10 + "-W2SH";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckxvZ2dlci5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJybGwiLCJ1c2VyX25hbWUiLCJTZXJ2ZXJMb2dnZXIiLCJzZW5kIiwiY29tbWFuZCIsInNlbmRDb21tYW5kIiwibG9nIiwic29ja2V0X25hbWUiLCJsb2dDb21tYW5kIiwic2F2ZVNIIiwiU0giLCJzZXRVc2VybmFtZUxvZyIsInVzZXJuYW1lIiwiZmlsZV9wYXRoIiwiTWF0aCIsInJhbmRvbSIsImNvbnNvbGUiLCJleGlzdHNTeW5jIiwic3RyZWFtIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvbmNlIiwiZmQiLCJ3cml0ZSIsImVuZCIsImUiLCJhZGRKU09OdG9Mb2ciLCJjcmVhdGVKU09ObG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsImZpbGVuYW1lIiwibGluZXMybnVrZSIsInJlYWQiLCJ0aGVuIiwibGluZXMiLCJ0b192YW5xdWlzaCIsImxlbmd0aCIsInN0YXQiLCJlcnIiLCJzdGF0cyIsInRydW5jYXRlIiwic2l6ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBLElBQUlBLEtBQUtDLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUMsTUFBTUQsUUFBUSxpQkFBUixDQUFWOztBQUVBLElBQUlFLFlBQVksSUFBaEI7O0lBR2FDLFksV0FBQUEsWSxHQUNYLHdCQUFjO0FBQUE7O0FBRVosU0FBTztBQUNMO0FBQ0FDLFVBQU0sY0FBU0MsT0FBVCxFQUFrQjtBQUN0QkMsa0JBQVlELE9BQVo7QUFDRCxLQUpJO0FBS0w7QUFDQUUsU0FBTSxhQUFVQyxXQUFWLEVBQXdCSCxPQUF4QixFQUFnQztBQUNwQ0ksaUJBQVdELFdBQVgsRUFBdUJILE9BQXZCO0FBQ0QsS0FSSTtBQVNMSyxZQUFTLGdCQUFVRixXQUFWLEVBQXdCRyxFQUF4QixFQUEyQjtBQUNsQ0QsY0FBT0YsV0FBUCxFQUFtQkcsRUFBbkI7QUFDRDtBQVhJLEdBQVA7QUFjRCxDOztBQUlI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QUFDVHZDLFdBQUd5QyxRQUFILENBQVlWLFFBQVosRUFBc0JTLE1BQU1FLElBQU4sR0FBYU4sV0FBbkMsRUFBZ0QsVUFBQ0csR0FBRCxFQUFTO0FBQ3ZELGNBQUlBLEdBQUosRUFBUyxNQUFNQSxHQUFOO0FBQ1RyQixrQkFBUVYsR0FBUixDQUFZLGlCQUFaO0FBQ0FZLGlCQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixpQkFBT0ksS0FBUCxDQUFhSyxLQUFLQyxTQUFMLENBQWV4QixPQUFmLEVBQXdCLElBQXhCLEVBQThCLENBQTlCLENBQWI7QUFDQWMsaUJBQU9JLEtBQVAsQ0FBYSxJQUFiO0FBQ0FKLGlCQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixpQkFBT0ssR0FBUDtBQUNELFNBUkQ7QUFTRCxPQVhEO0FBWUQsS0FkRDtBQWdCRCxHQW5CRDtBQXlCRDs7QUFHRGtCLE9BQU9DLE9BQVAsR0FBaUJ4QyxZQUFqQiIsImZpbGUiOiJTZXJ2ZXJMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBybGwgPSByZXF1aXJlKCdyZWFkLWxhc3QtbGluZXMnKTtcblxudmFyIHVzZXJfbmFtZSA9IG51bGw7XG5cblxuZXhwb3J0IGNsYXNzIFNlcnZlckxvZ2dlcntcbiAgY29uc3RydWN0b3IoKSB7XG4gIFxuICAgIHJldHVybiB7XG4gICAgICAvL1NlbmQgYSBjb21tYW5kIHRvIHRoZSBjbGllbnRcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgICAgICAgc2VuZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICB9LFxuICAgICAgLy9sb2cgYSBjb21tYW5kIGluIGEgZmlsZVxuICAgICAgbG9nIDogZnVuY3Rpb24oIHNvY2tldF9uYW1lICwgY29tbWFuZCl7XG4gICAgICAgIGxvZ0NvbW1hbmQoc29ja2V0X25hbWUsY29tbWFuZCk7XG4gICAgICB9LFxuICAgICAgc2F2ZVNIIDogZnVuY3Rpb24oIHNvY2tldF9uYW1lICwgU0gpe1xuICAgICAgICBzYXZlU0goc29ja2V0X25hbWUsU0gpO1xuICAgICAgfVxuICB9O1xuICBcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHNlbmRDb21tYW5kKCl7XG5cbn1cblxuXG5mdW5jdGlvbiBzZXRVc2VybmFtZUxvZyh1c2VyX25hbWUpe1xuICB0aGlzLnVzZXJuYW1lID0gdXNlcl9uYW1lO1xufVxuXG5cbmZ1bmN0aW9uIHNhdmVTSChzb2NrZXRfbmFtZSwgU0gpIHtcbiAgXG4gIC8vbG9nIHRoZSBjb21tYW5kIGludG8gYSBmaWxlXG4gIHZhciBmaWxlX3BhdGggPSBcIi4vc3JjL3NlcnZlci9sb2ctU0gvXCIgKyBzb2NrZXRfbmFtZSArIE1hdGgucmFuZG9tKCkqMTArICBcIi1XMlNIXCI7XG4gIGNvbnNvbGUubG9nKFNIKTtcbiAgY29uc29sZS5sb2coZnMuZXhpc3RzU3luYyhmaWxlX3BhdGgpKTtcbiAgY29uc29sZS5sb2coZmlsZV9wYXRoKTtcbiAgXG4gICAgY29uc29sZS5sb2coJ3RoZSBmaWxlICcgKyBmaWxlX3BhdGggKyAnICBleGlzdHMnKTtcbiAgICBcbiAgICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZV9wYXRoLCB7ICdmbGFncyc6ICd3JyB9KTtcbiAgICBzdHJlYW0ub25jZSgnb3BlbicsIGZ1bmN0aW9uIChmZCkge1xuICAgICAgc3RyZWFtLndyaXRlKFNIKTtcbiAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICB9KTtcbiAgXG59XG5cblxuZnVuY3Rpb24gbG9nQ29tbWFuZChzb2NrZXRfbmFtZSxjb21tYW5kKXtcbi8vbG9nIHRoZSBjb21tYW5kIGludG8gYSBmaWxlXG4gIGxldCBmaWxlX3BhdGggPSBcIi4vc3JjL3NlcnZlci9sb2dfc2Vzc2lvbl9jbGllbnQvbG9nOlwiK3NvY2tldF9uYW1lO1xuICBjb25zb2xlLmxvZyhjb21tYW5kLmUpO1xuICBjb25zb2xlLmxvZyhjb21tYW5kKTtcbiAgY29uc29sZS5sb2coZnMuZXhpc3RzU3luYyhmaWxlX3BhdGgpICApO1xuICBjb25zb2xlLmxvZyhmaWxlX3BhdGgpO1xuICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlX3BhdGgpICkge1xuICAgICAgY29uc29sZS5sb2coJ3RoZSBmaWxlICcrZmlsZV9wYXRoKycgIGV4aXN0cycpO1xuICAgICAgLy9XZSBzdXByZXNzIHRoZSBsYXN0IGxpbmUgYmVjYXVzZSBpdCdzIHRoZSBjYXJhY3RlciBdXG4gICAgICBhZGRKU09OdG9Mb2coZmlsZV9wYXRoLCBjb21tYW5kKTtcbiAgICAvL2NvbnNvbGUubG9nKCcvcHVibGljL2ltYWdlcy9mbGFncy8nICsgaW1nZmlsZSArIFwiLnBuZ1wiKTtcbiAgfSBlbHNlIHtcbiAgICBjcmVhdGVKU09ObG9nKGZpbGVfcGF0aCwgY29tbWFuZCk7XG4gIH1cbn1cblxuXG4vKlxuXG5KU09OLnN0cmluZ2lmeShldnQsIGZ1bmN0aW9uKGssIHYpIHtcbiAgaWYgKHYgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgcmV0dXJuICdOb2RlJztcbiAgfVxuICBpZiAodiBpbnN0YW5jZW9mIFdpbmRvdykge1xuICAgIHJldHVybiAnV2luZG93JztcbiAgfVxuICByZXR1cm4gdjtcbn0sICcgJyk7XG4qL1xuXG5mdW5jdGlvbiBjcmVhdGVKU09ObG9nKGZpbGVfcGF0aCwgY29tbWFuZCkge1xuICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZV9wYXRoLHsnZmxhZ3MnOiAndyd9KTtcbiAgc3RyZWFtLm9uY2UoJ29wZW4nLCBmdW5jdGlvbihmZCkge1xuICAgIHN0cmVhbS53cml0ZSgnWycpO1xuICAgIHN0cmVhbS53cml0ZShKU09OLnN0cmluZ2lmeShjb21tYW5kLCBudWxsLCAyKSk7XG4gICAgc3RyZWFtLndyaXRlKCdcXG4nKTtcbiAgICBzdHJlYW0ud3JpdGUoJ10nKTtcbiAgICBzdHJlYW0uZW5kKCk7XG4gIH0pO1xuICBcbn1cblxuZnVuY3Rpb24gYWRkSlNPTnRvTG9nKGZpbGVfcGF0aCxjb21tYW5kKSB7XG4gIFxuICB2YXIgZmlsZW5hbWUgPSBmaWxlX3BhdGg7XG4gIHZhciBsaW5lczJudWtlID0gMTtcbiAgdmFyIHN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVfcGF0aCx7J2ZsYWdzJzogJ2EnfSk7XG4gIHN0cmVhbS5vbmNlKCdvcGVuJywgZnVuY3Rpb24oZmQpIHtcbiAgICAvL1dlIHN1cHJlc3MgdGhlIGxhc3QgbGluZSBiZWNhdXNlIGl0J3MgdGhlIGNhcmFjdGVyIF0sIHRoZW4gY29uY2F0ZW5hdGUgdGhlIGNvbW1hbmQgYW5kIGFkZCBdIGFnYWluLlxuICAgIC8vVGhlICBdIGlzIHVzZWQgdG8gY3JlYXRlIGEgcHJvcGVyIGpzb24gZmlsZSB0aGF0IGNhbiBiZSBwYXJzZWQgd2l0aG91dCBtb3JlIGFjdGlvbnNcbiAgICBybGwucmVhZChmaWxlbmFtZSwgbGluZXMybnVrZSkudGhlbigobGluZXMpID0+IHtcbiAgICAgIHZhciB0b192YW5xdWlzaCA9IGxpbmVzLmxlbmd0aDtcbiAgICAgIGZzLnN0YXQoZmlsZW5hbWUsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgZnMudHJ1bmNhdGUoZmlsZW5hbWUsIHN0YXRzLnNpemUgLSB0b192YW5xdWlzaCwgKGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRmlsZSB0cnVuY2F0ZWQhJyk7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKCcsJyk7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKEpTT04uc3RyaW5naWZ5KGNvbW1hbmQsIG51bGwsIDIpKTtcbiAgICAgICAgICBzdHJlYW0ud3JpdGUoXCJcXG5cIik7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKFwiXVwiKTtcbiAgICAgICAgICBzdHJlYW0uZW5kKCk7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgfSk7XG4gIFxuICBcbiBcbiAgXG4gIFxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VydmVyTG9nZ2VyO1xuXG5cblxuXG4iXX0=