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
  var month = addZero(d.getMonth());
  var day = addZero(d.getDay());

  var date = day + "/" + month + "_" + h + ":" + m + ":" + s;

  var file_path = "./src/server/log-SH/" + socket_name + '-' + d;
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
  var pathOfFiles = "./src/server/log-SH/SH_all_path.txt";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckxvZ2dlci5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJybGwiLCJ1c2VyX25hbWUiLCJTZXJ2ZXJMb2dnZXIiLCJzZW5kIiwiY29tbWFuZCIsInNlbmRDb21tYW5kIiwibG9nIiwic29ja2V0X25hbWUiLCJsb2dDb21tYW5kIiwic2F2ZVNIIiwiU0giLCJzZXRVc2VybmFtZUxvZyIsInVzZXJuYW1lIiwiYWRkWmVybyIsImkiLCJkIiwiRGF0ZSIsImgiLCJnZXRIb3VycyIsIm0iLCJnZXRNaW51dGVzIiwicyIsImdldFNlY29uZHMiLCJtb250aCIsImdldE1vbnRoIiwiZGF5IiwiZ2V0RGF5IiwiZGF0ZSIsImZpbGVfcGF0aCIsImNvbnNvbGUiLCJleGlzdHNTeW5jIiwic3RyZWFtIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvbmNlIiwiZmQiLCJ3cml0ZSIsImVuZCIsInBhdGhPZkZpbGVzIiwiYXBwZW5kRmlsZSIsImVyciIsImUiLCJhZGRKU09OdG9Mb2ciLCJjcmVhdGVKU09ObG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsImZpbGVuYW1lIiwibGluZXMybnVrZSIsInJlYWQiLCJ0aGVuIiwibGluZXMiLCJ0b192YW5xdWlzaCIsImxlbmd0aCIsInN0YXQiLCJzdGF0cyIsInRydW5jYXRlIiwic2l6ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBLElBQUlBLEtBQUtDLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUMsTUFBTUQsUUFBUSxpQkFBUixDQUFWOztBQUVBLElBQUlFLFlBQVksSUFBaEI7O0lBR2FDLFksV0FBQUEsWSxHQUNYLHdCQUFjO0FBQUE7O0FBRVosU0FBTztBQUNMO0FBQ0FDLFVBQU0sY0FBU0MsT0FBVCxFQUFrQjtBQUN0QkMsa0JBQVlELE9BQVo7QUFDRCxLQUpJO0FBS0w7QUFDQUUsU0FBTSxhQUFVQyxXQUFWLEVBQXdCSCxPQUF4QixFQUFnQztBQUNwQ0ksaUJBQVdELFdB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VFYsa0JBQVF2QixHQUFSLENBQVksaUJBQVo7QUFDQXlCLGlCQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixpQkFBT0ksS0FBUCxDQUFhUSxLQUFLQyxTQUFMLENBQWV4QyxPQUFmLEVBQXdCLElBQXhCLEVBQThCLENBQTlCLENBQWI7QUFDQTJCLGlCQUFPSSxLQUFQLENBQWEsSUFBYjtBQUNBSixpQkFBT0ksS0FBUCxDQUFhLEdBQWI7QUFDQUosaUJBQU9LLEdBQVA7QUFDRCxTQVJEO0FBU0QsT0FYRDtBQVlELEtBZEQ7QUFnQkQsR0FuQkQ7QUF5QkQ7O0FBR0RvQixPQUFPQyxPQUFQLEdBQWlCdkQsWUFBakIiLCJmaWxlIjoiU2VydmVyTG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcmxsID0gcmVxdWlyZSgncmVhZC1sYXN0LWxpbmVzJyk7XG5cbnZhciB1c2VyX25hbWUgPSBudWxsO1xuXG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJMb2dnZXJ7XG4gIGNvbnN0cnVjdG9yKCkge1xuICBcbiAgICByZXR1cm4ge1xuICAgICAgLy9TZW5kIGEgY29tbWFuZCB0byB0aGUgY2xpZW50XG4gICAgICBzZW5kOiBmdW5jdGlvbihjb21tYW5kKSB7XG4gICAgICAgIHNlbmRDb21tYW5kKGNvbW1hbmQpO1xuICAgICAgfSxcbiAgICAgIC8vbG9nIGEgY29tbWFuZCBpbiBhIGZpbGVcbiAgICAgIGxvZyA6IGZ1bmN0aW9uKCBzb2NrZXRfbmFtZSAsIGNvbW1hbmQpe1xuICAgICAgICBsb2dDb21tYW5kKHNvY2tldF9uYW1lLGNvbW1hbmQpO1xuICAgICAgfSxcbiAgICAgIHNhdmVTSCA6IGZ1bmN0aW9uKCBzb2NrZXRfbmFtZSAsIFNIKXtcbiAgICAgICAgc2F2ZVNIKHNvY2tldF9uYW1lLFNIKTtcbiAgICAgIH1cbiAgfTtcbiAgXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzZW5kQ29tbWFuZCgpe1xuXG59XG5cblxuZnVuY3Rpb24gc2V0VXNlcm5hbWVMb2codXNlcl9uYW1lKXtcbiAgdGhpcy51c2VybmFtZSA9IHVzZXJfbmFtZTtcbn1cblxuXG5mdW5jdGlvbiBzYXZlU0goc29ja2V0X25hbWUsIFNIKSB7XG4gIFxuICBcbiAgXG4gIGZ1bmN0aW9uIGFkZFplcm8oaSkge1xuICAgIGlmIChpIDwgMTApIHtcbiAgICAgIGkgPSBcIjBcIiArIGk7XG4gICAgfVxuICAgIHJldHVybiBpO1xuICB9XG4gIFxuICBcbiAgXG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIGggPSBhZGRaZXJvKGQuZ2V0SG91cnMoKSk7XG4gIHZhciBtID0gYWRkWmVybyhkLmdldE1pbnV0ZXMoKSk7XG4gIHZhciBzID0gYWRkWmVybyhkLmdldFNlY29uZHMoKSk7XG4gIHZhciBtb250aCA9ICBhZGRaZXJvKGQuZ2V0TW9udGgoKSk7XG4gIHZhciBkYXkgPSAgYWRkWmVybyhkLmdldERheSgpKTtcbiAgXG4gIHZhciBkYXRlID0gIGRheStcIi9cIittb250aCtcIl9cIisgaCArIFwiOlwiICsgbSArIFwiOlwiICsgcztcbiAgXG4gIHZhciBmaWxlX3BhdGggPSBcIi4vc3JjL3NlcnZlci9sb2ctU0gvXCIgKyBzb2NrZXRfbmFtZSArJy0nICtkO1xuICBjb25zb2xlLmxvZyhTSCk7XG4gIGNvbnNvbGUubG9nKGZzLmV4aXN0c1N5bmMoZmlsZV9wYXRoKSk7XG4gIGNvbnNvbGUubG9nKGZpbGVfcGF0aCk7XG4gIGNvbnNvbGUubG9nKCd0aGUgZmlsZSAnICsgZmlsZV9wYXRoICsgJyAgZXhpc3RzJyk7XG4gIFxuICAgIFxuICAgIHZhciBzdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShmaWxlX3BhdGgsIHsgJ2ZsYWdzJzogJ3cnIH0pO1xuICAgIHN0cmVhbS5vbmNlKCdvcGVuJywgZnVuY3Rpb24gKGZkKSB7XG4gICAgICBzdHJlYW0ud3JpdGUoU0gpO1xuICAgICAgc3RyZWFtLmVuZCgpO1xuICAgIH0pO1xuICBcbiAgICAgIC8qXG4gICAgVXBkYXRlIGEgZmlsZSB0aGF0IGtlZXAgdHJhY2sgb2YgdGhlIHBhdGggb2YgYWxsIHRoZSBzZWdtZW50IGhpc3RvcnkuXG4gICAgVGhpcyBmaWxlIGlzIHVzZWQgaW4gdGhlIGNsaWVudCBzaWRlIHRvXG4gICAgKi9cbiAgICAgIHZhciBwYXRoT2ZGaWxlcyA9IFwiLi9zcmMvc2VydmVyL2xvZy1TSC9TSF9hbGxfcGF0aC50eHRcIjtcbiAgXG4gIFxuICBmcy5hcHBlbmRGaWxlKHBhdGhPZkZpbGVzLCBmaWxlX3BhdGgrXCJcXG5cIiwgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICBjb25zb2xlLmxvZygnU2F2ZWQhJyk7XG4gIH0pO1xuICBcbiAgXG59XG5cblxuZnVuY3Rpb24gbG9nQ29tbWFuZChzb2NrZXRfbmFtZSxjb21tYW5kKXtcbi8vbG9nIHRoZSBjb21tYW5kIGludG8gYSBmaWxlXG4gIGxldCBmaWxlX3BhdGggPSBcIi4vc3JjL3NlcnZlci9sb2dfc2Vzc2lvbl9jbGllbnQvbG9nOlwiK3NvY2tldF9uYW1lO1xuICBjb25zb2xlLmxvZyhjb21tYW5kLmUpO1xuICBjb25zb2xlLmxvZyhjb21tYW5kKTtcbiAgY29uc29sZS5sb2coZnMuZXhpc3RzU3luYyhmaWxlX3BhdGgpICApO1xuICBjb25zb2xlLmxvZyhmaWxlX3BhdGgpO1xuICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlX3BhdGgpICkge1xuICAgICAgY29uc29sZS5sb2coJ3RoZSBmaWxlICcrZmlsZV9wYXRoKycgIGV4aXN0cycpO1xuICAgICAgLy9XZSBzdXByZXNzIHRoZSBsYXN0IGxpbmUgYmVjYXVzZSBpdCdzIHRoZSBjYXJhY3RlciBdXG4gICAgICBhZGRKU09OdG9Mb2coZmlsZV9wYXRoLCBjb21tYW5kKTtcbiAgICAvL2NvbnNvbGUubG9nKCcvcHVibGljL2ltYWdlcy9mbGFncy8nICsgaW1nZmlsZSArIFwiLnBuZ1wiKTtcbiAgfSBlbHNlIHtcbiAgICBjcmVhdGVKU09ObG9nKGZpbGVfcGF0aCwgY29tbWFuZCk7XG4gIH1cbn1cblxuXG4vKlxuXG5KU09OLnN0cmluZ2lmeShldnQsIGZ1bmN0aW9uKGssIHYpIHtcbiAgaWYgKHYgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgcmV0dXJuICdOb2RlJztcbiAgfVxuICBpZiAodiBpbnN0YW5jZW9mIFdpbmRvdykge1xuICAgIHJldHVybiAnV2luZG93JztcbiAgfVxuICByZXR1cm4gdjtcbn0sICcgJyk7XG4qL1xuXG5mdW5jdGlvbiBjcmVhdGVKU09ObG9nKGZpbGVfcGF0aCwgY29tbWFuZCkge1xuICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZV9wYXRoLHsnZmxhZ3MnOiAndyd9KTtcbiAgc3RyZWFtLm9uY2UoJ29wZW4nLCBmdW5jdGlvbihmZCkge1xuICAgIHN0cmVhbS53cml0ZSgnWycpO1xuICAgIHN0cmVhbS53cml0ZShKU09OLnN0cmluZ2lmeShjb21tYW5kLCBudWxsLCAyKSk7XG4gICAgc3RyZWFtLndyaXRlKCdcXG4nKTtcbiAgICBzdHJlYW0ud3JpdGUoJ10nKTtcbiAgICBzdHJlYW0uZW5kKCk7XG4gIH0pO1xuICBcbn1cblxuZnVuY3Rpb24gYWRkSlNPTnRvTG9nKGZpbGVfcGF0aCxjb21tYW5kKSB7XG4gIFxuICB2YXIgZmlsZW5hbWUgPSBmaWxlX3BhdGg7XG4gIHZhciBsaW5lczJudWtlID0gMTtcbiAgdmFyIHN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVfcGF0aCx7J2ZsYWdzJzogJ2EnfSk7XG4gIHN0cmVhbS5vbmNlKCdvcGVuJywgZnVuY3Rpb24oZmQpIHtcbiAgICAvL1dlIHN1cHJlc3MgdGhlIGxhc3QgbGluZSBiZWNhdXNlIGl0J3MgdGhlIGNhcmFjdGVyIF0sIHRoZW4gY29uY2F0ZW5hdGUgdGhlIGNvbW1hbmQgYW5kIGFkZCBdIGFnYWluLlxuICAgIC8vVGhlICBdIGlzIHVzZWQgdG8gY3JlYXRlIGEgcHJvcGVyIGpzb24gZmlsZSB0aGF0IGNhbiBiZSBwYXJzZWQgd2l0aG91dCBtb3JlIGFjdGlvbnNcbiAgICBybGwucmVhZChmaWxlbmFtZSwgbGluZXMybnVrZSkudGhlbigobGluZXMpID0+IHtcbiAgICAgIHZhciB0b192YW5xdWlzaCA9IGxpbmVzLmxlbmd0aDtcbiAgICAgIGZzLnN0YXQoZmlsZW5hbWUsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgZnMudHJ1bmNhdGUoZmlsZW5hbWUsIHN0YXRzLnNpemUgLSB0b192YW5xdWlzaCwgKGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRmlsZSB0cnVuY2F0ZWQhJyk7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKCcsJyk7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKEpTT04uc3RyaW5naWZ5KGNvbW1hbmQsIG51bGwsIDIpKTtcbiAgICAgICAgICBzdHJlYW0ud3JpdGUoXCJcXG5cIik7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKFwiXVwiKTtcbiAgICAgICAgICBzdHJlYW0uZW5kKCk7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgfSk7XG4gIFxuICBcbiBcbiAgXG4gIFxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VydmVyTG9nZ2VyO1xuXG5cblxuXG4iXX0=