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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckxvZ2dlci5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJybGwiLCJ1c2VyX25hbWUiLCJTZXJ2ZXJMb2dnZXIiLCJzZW5kIiwiY29tbWFuZCIsInNlbmRDb21tYW5kIiwibG9nIiwic29ja2V0X25hbWUiLCJsb2dDb21tYW5kIiwic2F2ZVNIIiwiU0giLCJzZXRVc2VybmFtZUxvZyIsInVzZXJuYW1lIiwiYWRkWmVybyIsImkiLCJkIiwiRGF0ZSIsImgiLCJnZXRIb3VycyIsIm0iLCJnZXRNaW51dGVzIiwicyIsImdldFNlY29uZHMiLCJtb250aCIsImdldE1vbnRoIiwiZGF5IiwiZ2V0RGF5IiwiZGF0ZSIsImZpbGVfcGF0aCIsImNvbnNvbGUiLCJleGlzdHNTeW5jIiwic3RyZWFtIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvbmNlIiwiZmQiLCJ3cml0ZSIsImVuZCIsInBhdGhPZkZpbGVzIiwiYXBwZW5kRmlsZSIsImVyciIsImUiLCJhZGRKU09OdG9Mb2ciLCJjcmVhdGVKU09ObG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsImZpbGVuYW1lIiwibGluZXMybnVrZSIsInJlYWQiLCJ0aGVuIiwibGluZXMiLCJ0b192YW5xdWlzaCIsImxlbmd0aCIsInN0YXQiLCJzdGF0cyIsInRydW5jYXRlIiwic2l6ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBLElBQUlBLEtBQUtDLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUMsTUFBTUQsUUFBUSxpQkFBUixDQUFWOztBQUVBLElBQUlFLFlBQVksSUFBaEI7O0lBR2FDLFksV0FBQUEsWSxHQUNYLHdCQUFjO0FBQUE7O0FBRVosU0FBTztBQUNMO0FBQ0FDLFVBQU0sY0FBU0MsT0FBVCxFQUFrQjtBQUN0QkMsa0JBQVlELE9BQVo7QUFDRCxLQUpJO0FBS0w7QUFDQUUsU0FBTSxhQUFVQyxXQUFWLEVBQXdCSCxPQUF4QixFQUFnQztBQUNwQ0ksaUJBQVdELFdB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O0FBQ1RWLGtCQUFRdkIsR0FBUixDQUFZLGlCQUFaO0FBQ0F5QixpQkFBT0ksS0FBUCxDQUFhLEdBQWI7QUFDQUosaUJBQU9JLEtBQVAsQ0FBYVEsS0FBS0MsU0FBTCxDQUFleEMsT0FBZixFQUF3QixJQUF4QixFQUE4QixDQUE5QixDQUFiO0FBQ0EyQixpQkFBT0ksS0FBUCxDQUFhLElBQWI7QUFDQUosaUJBQU9JLEtBQVAsQ0FBYSxHQUFiO0FBQ0FKLGlCQUFPSyxHQUFQO0FBQ0QsU0FSRDtBQVNELE9BWEQ7QUFZRCxLQWREO0FBZ0JELEdBbkJEO0FBeUJEOztBQUdEb0IsT0FBT0MsT0FBUCxHQUFpQnZELFlBQWpCIiwiZmlsZSI6IlNlcnZlckxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHJsbCA9IHJlcXVpcmUoJ3JlYWQtbGFzdC1saW5lcycpO1xuXG52YXIgdXNlcl9uYW1lID0gbnVsbDtcblxuXG5leHBvcnQgY2xhc3MgU2VydmVyTG9nZ2Vye1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vU2VuZCBhIGNvbW1hbmQgdG8gdGhlIGNsaWVudFxuICAgICAgc2VuZDogZnVuY3Rpb24oY29tbWFuZCkge1xuICAgICAgICBzZW5kQ29tbWFuZChjb21tYW5kKTtcbiAgICAgIH0sXG4gICAgICAvL2xvZyBhIGNvbW1hbmQgaW4gYSBmaWxlXG4gICAgICBsb2cgOiBmdW5jdGlvbiggc29ja2V0X25hbWUgLCBjb21tYW5kKXtcbiAgICAgICAgbG9nQ29tbWFuZChzb2NrZXRfbmFtZSxjb21tYW5kKTtcbiAgICAgIH0sXG4gICAgICBzYXZlU0ggOiBmdW5jdGlvbiggc29ja2V0X25hbWUgLCBTSCl7XG4gICAgICAgIHNhdmVTSChzb2NrZXRfbmFtZSxTSCk7XG4gICAgICB9XG4gIH07XG4gIFxuICB9XG59XG5cblxuZnVuY3Rpb24gc2VuZENvbW1hbmQoKXtcblxufVxuXG5cbmZ1bmN0aW9uIHNldFVzZXJuYW1lTG9nKHVzZXJfbmFtZSl7XG4gIHRoaXMudXNlcm5hbWUgPSB1c2VyX25hbWU7XG59XG5cblxuZnVuY3Rpb24gc2F2ZVNIKHNvY2tldF9uYW1lLCBTSCkge1xuICAvL0Zvcm1hdCB0aGUgZGF0ZVxuICBmdW5jdGlvbiBhZGRaZXJvKGkpIHtcbiAgICBpZiAoaSA8IDEwKSB7XG4gICAgICBpID0gXCIwXCIgKyBpO1xuICAgIH1cbiAgICByZXR1cm4gaTtcbiAgfVxuICBcbiAgXG4gIFxuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciBoID0gYWRkWmVybyhkLmdldEhvdXJzKCkpO1xuICB2YXIgbSA9IGFkZFplcm8oZC5nZXRNaW51dGVzKCkpO1xuICB2YXIgcyA9IGFkZFplcm8oZC5nZXRTZWNvbmRzKCkpO1xuICB2YXIgbW9udGggPSAgYWRkWmVybyhkLmdldE1vbnRoKCkpO1xuICB2YXIgZGF5ID0gIGFkZFplcm8oZC5nZXREYXkoKSk7XG4gIFxuICB2YXIgZGF0ZSA9ICBkYXkrXCIvXCIrbW9udGgrXCJfXCIrIGggKyBcIjpcIiArIG0gKyBcIjpcIiArIHM7XG4gIFxuICB2YXIgZmlsZV9wYXRoID0gXCIuL3NyYy9zZXJ2ZXIvbG9nLVNIL1wiICsgc29ja2V0X25hbWUgKyctJyArZDtcbiAgY29uc29sZS5sb2coU0gpO1xuICBjb25zb2xlLmxvZyhmcy5leGlzdHNTeW5jKGZpbGVfcGF0aCkpO1xuICBjb25zb2xlLmxvZyhmaWxlX3BhdGgpO1xuICBjb25zb2xlLmxvZygndGhlIGZpbGUgJyArIGZpbGVfcGF0aCArICcgIGV4aXN0cycpO1xuICBcbiAgICBcbiAgICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZV9wYXRoLCB7ICdmbGFncyc6ICd3JyB9KTtcbiAgICBzdHJlYW0ub25jZSgnb3BlbicsIGZ1bmN0aW9uIChmZCkge1xuICAgICAgc3RyZWFtLndyaXRlKFNIKTtcbiAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICB9KTtcbiAgXG4gICAgICAvKlxuICAgIFVwZGF0ZSBhIGZpbGUgdGhhdCBrZWVwIHRyYWNrIG9mIHRoZSBwYXRoIG9mIGFsbCB0aGUgc2VnbWVudCBoaXN0b3J5LlxuICAgIFRoaXMgZmlsZSBpcyB1c2VkIGluIHRoZSBjbGllbnQgc2lkZSB0b1xuICAgICovXG4gICAgICB2YXIgcGF0aE9mRmlsZXMgPSBcIi4vc3JjL3NlcnZlci9sb2ctU0gvU0hfYWxsX3BhdGgudHh0XCI7XG4gIFxuICBcbiAgZnMuYXBwZW5kRmlsZShwYXRoT2ZGaWxlcywgZmlsZV9wYXRoK1wiXFxuXCIsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgY29uc29sZS5sb2coJ1NhdmVkIScpO1xuICB9KTtcbiAgXG4gIFxufVxuXG5cbmZ1bmN0aW9uIGxvZ0NvbW1hbmQoc29ja2V0X25hbWUsY29tbWFuZCl7XG4vL2xvZyB0aGUgY29tbWFuZCBpbnRvIGEgZmlsZVxuICBsZXQgZmlsZV9wYXRoID0gXCIuL3NyYy9zZXJ2ZXIvbG9nX3Nlc3Npb25fY2xpZW50L2xvZzpcIitzb2NrZXRfbmFtZTtcbiAgY29uc29sZS5sb2coY29tbWFuZC5lKTtcbiAgY29uc29sZS5sb2coY29tbWFuZCk7XG4gIGNvbnNvbGUubG9nKGZzLmV4aXN0c1N5bmMoZmlsZV9wYXRoKSAgKTtcbiAgY29uc29sZS5sb2coZmlsZV9wYXRoKTtcbiAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZV9wYXRoKSApIHtcbiAgICAgIGNvbnNvbGUubG9nKCd0aGUgZmlsZSAnK2ZpbGVfcGF0aCsnICBleGlzdHMnKTtcbiAgICAgIC8vV2Ugc3VwcmVzcyB0aGUgbGFzdCBsaW5lIGJlY2F1c2UgaXQncyB0aGUgY2FyYWN0ZXIgXVxuICAgICAgYWRkSlNPTnRvTG9nKGZpbGVfcGF0aCwgY29tbWFuZCk7XG4gICAgLy9jb25zb2xlLmxvZygnL3B1YmxpYy9pbWFnZXMvZmxhZ3MvJyArIGltZ2ZpbGUgKyBcIi5wbmdcIik7XG4gIH0gZWxzZSB7XG4gICAgY3JlYXRlSlNPTmxvZyhmaWxlX3BhdGgsIGNvbW1hbmQpO1xuICB9XG59XG5cblxuLypcblxuSlNPTi5zdHJpbmdpZnkoZXZ0LCBmdW5jdGlvbihrLCB2KSB7XG4gIGlmICh2IGluc3RhbmNlb2YgTm9kZSkge1xuICAgIHJldHVybiAnTm9kZSc7XG4gIH1cbiAgaWYgKHYgaW5zdGFuY2VvZiBXaW5kb3cpIHtcbiAgICByZXR1cm4gJ1dpbmRvdyc7XG4gIH1cbiAgcmV0dXJuIHY7XG59LCAnICcpO1xuKi9cblxuZnVuY3Rpb24gY3JlYXRlSlNPTmxvZyhmaWxlX3BhdGgsIGNvbW1hbmQpIHtcbiAgdmFyIHN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVfcGF0aCx7J2ZsYWdzJzogJ3cnfSk7XG4gIHN0cmVhbS5vbmNlKCdvcGVuJywgZnVuY3Rpb24oZmQpIHtcbiAgICBzdHJlYW0ud3JpdGUoJ1snKTtcbiAgICBzdHJlYW0ud3JpdGUoSlNPTi5zdHJpbmdpZnkoY29tbWFuZCwgbnVsbCwgMikpO1xuICAgIHN0cmVhbS53cml0ZSgnXFxuJyk7XG4gICAgc3RyZWFtLndyaXRlKCddJyk7XG4gICAgc3RyZWFtLmVuZCgpO1xuICB9KTtcbiAgXG59XG5cbmZ1bmN0aW9uIGFkZEpTT050b0xvZyhmaWxlX3BhdGgsY29tbWFuZCkge1xuICBcbiAgdmFyIGZpbGVuYW1lID0gZmlsZV9wYXRoO1xuICB2YXIgbGluZXMybnVrZSA9IDE7XG4gIHZhciBzdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShmaWxlX3BhdGgseydmbGFncyc6ICdhJ30pO1xuICBzdHJlYW0ub25jZSgnb3BlbicsIGZ1bmN0aW9uKGZkKSB7XG4gICAgLy9XZSBzdXByZXNzIHRoZSBsYXN0IGxpbmUgYmVjYXVzZSBpdCdzIHRoZSBjYXJhY3RlciBdLCB0aGVuIGNvbmNhdGVuYXRlIHRoZSBjb21tYW5kIGFuZCBhZGQgXSBhZ2Fpbi5cbiAgICAvL1RoZSAgXSBpcyB1c2VkIHRvIGNyZWF0ZSBhIHByb3BlciBqc29uIGZpbGUgdGhhdCBjYW4gYmUgcGFyc2VkIHdpdGhvdXQgbW9yZSBhY3Rpb25zXG4gICAgcmxsLnJlYWQoZmlsZW5hbWUsIGxpbmVzMm51a2UpLnRoZW4oKGxpbmVzKSA9PiB7XG4gICAgICB2YXIgdG9fdmFucXVpc2ggPSBsaW5lcy5sZW5ndGg7XG4gICAgICBmcy5zdGF0KGZpbGVuYW1lLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGZzLnRydW5jYXRlKGZpbGVuYW1lLCBzdGF0cy5zaXplIC0gdG9fdmFucXVpc2gsIChlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0ZpbGUgdHJ1bmNhdGVkIScpO1xuICAgICAgICAgIHN0cmVhbS53cml0ZSgnLCcpO1xuICAgICAgICAgIHN0cmVhbS53cml0ZShKU09OLnN0cmluZ2lmeShjb21tYW5kLCBudWxsLCAyKSk7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKFwiXFxuXCIpO1xuICAgICAgICAgIHN0cmVhbS53cml0ZShcIl1cIik7XG4gICAgICAgICAgc3RyZWFtLmVuZCgpO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gIH0pO1xuICBcbiAgXG4gXG4gIFxuICBcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZlckxvZ2dlcjtcblxuXG5cblxuIl19