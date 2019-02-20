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
  var file_path = "./src/server/log_session_client/" + socket_name + "W2SH";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckxvZ2dlci5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJybGwiLCJ1c2VyX25hbWUiLCJTZXJ2ZXJMb2dnZXIiLCJzZW5kIiwiY29tbWFuZCIsInNlbmRDb21tYW5kIiwibG9nIiwic29ja2V0X25hbWUiLCJsb2dDb21tYW5kIiwic2F2ZVNIIiwiU0giLCJzZXRVc2VybmFtZUxvZyIsInVzZXJuYW1lIiwiY29uc29sZSIsImZpbGVfcGF0aCIsImV4aXN0c1N5bmMiLCJzdHJlYW0iLCJjcmVhdGVXcml0ZVN0cmVhbSIsIm9uY2UiLCJmZCIsIndyaXRlIiwiZW5kIiwiZSIsImFkZEpTT050b0xvZyIsImNyZWF0ZUpTT05sb2ciLCJKU09OIiwic3RyaW5naWZ5IiwiZmlsZW5hbWUiLCJsaW5lczJudWtlIiwicmVhZCIsInRoZW4iLCJsaW5lcyIsInRvX3ZhbnF1aXNoIiwibGVuZ3RoIiwic3RhdCIsImVyciIsInN0YXRzIiwidHJ1bmNhdGUiLCJzaXplIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBRUEsSUFBSUEsS0FBS0MsUUFBUSxJQUFSLENBQVQ7QUFDQSxJQUFJQyxNQUFNRCxRQUFRLGlCQUFSLENBQVY7O0FBRUEsSUFBSUUsWUFBWSxJQUFoQjs7SUFHYUMsWSxXQUFBQSxZLEdBQ1gsd0JBQWM7QUFBQTs7QUFFWixTQUFPO0FBQ0w7QUFDQUMsVUFBTSxjQUFTQyxPQUFULEVBQWtCO0FBQ3RCQyxrQkFBWUQsT0FBWjtBQUNELEtBSkk7QUFLTDtBQUNBRSxTQUFNLGFBQVVDLFdBQVYsRUFBd0JILE9BQXhCLEVBQWdDO0FBQ3BDSSxpQkFBV0QsV0FBWCxFQUF1QkgsT0FBdkI7QUFDRCxLQVJJO0FBU0xLLFlBQVMsZ0JBQVVGLFdBQVYsRUFBd0JHLEVBQXhCLEVBQTJCO0FBQ2xDRCxjQUFPRixXQUFQLEVBQW1CRyxFQUFuQjtBQUNEO0FBWEksR0FBUDtBQWNELEM7O0FBSUgsU0FBU0wsV0FBVCxHQUFz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RUFBZ0I7QUFDaEMsWUFBSUQsR0FBSixFQUFTLE1BQU1BLEdBQU47QUFDVHJDLFdBQUd1QyxRQUFILENBQVlWLFFBQVosRUFBc0JTLE1BQU1FLElBQU4sR0FBYU4sV0FBbkMsRUFBZ0QsVUFBQ0csR0FBRCxFQUFTO0FBQ3ZELGNBQUlBLEdBQUosRUFBUyxNQUFNQSxHQUFOO0FBQ1R0QixrQkFBUVAsR0FBUixDQUFZLGlCQUFaO0FBQ0FVLGlCQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixpQkFBT0ksS0FBUCxDQUFhSyxLQUFLQyxTQUFMLENBQWV0QixPQUFmLEVBQXdCLElBQXhCLEVBQThCLENBQTlCLENBQWI7QUFDQVksaUJBQU9JLEtBQVAsQ0FBYSxJQUFiO0FBQ0FKLGlCQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixpQkFBT0ssR0FBUDtBQUNELFNBUkQ7QUFTRCxPQVhEO0FBWUQsS0FkRDtBQWdCRCxHQW5CRDtBQXlCRDs7QUFHRGtCLE9BQU9DLE9BQVAsR0FBaUJ0QyxZQUFqQiIsImZpbGUiOiJTZXJ2ZXJMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBybGwgPSByZXF1aXJlKCdyZWFkLWxhc3QtbGluZXMnKTtcblxudmFyIHVzZXJfbmFtZSA9IG51bGw7XG5cblxuZXhwb3J0IGNsYXNzIFNlcnZlckxvZ2dlcntcbiAgY29uc3RydWN0b3IoKSB7XG4gIFxuICAgIHJldHVybiB7XG4gICAgICAvL1NlbmQgYSBjb21tYW5kIHRvIHRoZSBjbGllbnRcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgICAgICAgc2VuZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICB9LFxuICAgICAgLy9sb2cgYSBjb21tYW5kIGluIGEgZmlsZVxuICAgICAgbG9nIDogZnVuY3Rpb24oIHNvY2tldF9uYW1lICwgY29tbWFuZCl7XG4gICAgICAgIGxvZ0NvbW1hbmQoc29ja2V0X25hbWUsY29tbWFuZCk7XG4gICAgICB9LFxuICAgICAgc2F2ZVNIIDogZnVuY3Rpb24oIHNvY2tldF9uYW1lICwgU0gpe1xuICAgICAgICBzYXZlU0goc29ja2V0X25hbWUsU0gpO1xuICAgICAgfVxuICB9O1xuICBcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHNlbmRDb21tYW5kKCl7XG5cbn1cblxuXG5mdW5jdGlvbiBzZXRVc2VybmFtZUxvZyh1c2VyX25hbWUpe1xuICB0aGlzLnVzZXJuYW1lID0gdXNlcl9uYW1lO1xufVxuXG5cbmZ1bmN0aW9uIHNhdmVTSChzb2NrZXRfbmFtZSwgU0gpIHtcbiAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgY29uc29sZS5sb2coXCJhIGxhIGNvblwiKTtcbiAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgXG4gIC8vbG9nIHRoZSBjb21tYW5kIGludG8gYSBmaWxlXG4gIHZhciBmaWxlX3BhdGggPSBcIi4vc3JjL3NlcnZlci9sb2dfc2Vzc2lvbl9jbGllbnQvXCIgKyBzb2NrZXRfbmFtZSArIFwiVzJTSFwiO1xuICBjb25zb2xlLmxvZyhTSCk7XG4gIGNvbnNvbGUubG9nKGZzLmV4aXN0c1N5bmMoZmlsZV9wYXRoKSk7XG4gIGNvbnNvbGUubG9nKGZpbGVfcGF0aCk7XG4gIFxuICAgIGNvbnNvbGUubG9nKCd0aGUgZmlsZSAnICsgZmlsZV9wYXRoICsgJyAgZXhpc3RzJyk7XG4gICAgXG4gICAgdmFyIHN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVfcGF0aCwgeyAnZmxhZ3MnOiAndycgfSk7XG4gICAgc3RyZWFtLm9uY2UoJ29wZW4nLCBmdW5jdGlvbiAoZmQpIHtcbiAgICAgIFxuICAgICAgc3RyZWFtLndyaXRlKFNIKTtcbiAgICAgIFxuICAgICAgc3RyZWFtLmVuZCgpO1xuICAgICAgXG4gICAgfSk7XG4gIFxufVxuXG5cbmZ1bmN0aW9uIGxvZ0NvbW1hbmQoc29ja2V0X25hbWUsY29tbWFuZCl7XG4vL2xvZyB0aGUgY29tbWFuZCBpbnRvIGEgZmlsZVxuICBsZXQgZmlsZV9wYXRoID0gXCIuL3NyYy9zZXJ2ZXIvbG9nX3Nlc3Npb25fY2xpZW50L2xvZzpcIitzb2NrZXRfbmFtZTtcbiAgY29uc29sZS5sb2coY29tbWFuZC5lKTtcbiAgY29uc29sZS5sb2coY29tbWFuZCk7XG4gIGNvbnNvbGUubG9nKGZzLmV4aXN0c1N5bmMoZmlsZV9wYXRoKSAgKTtcbiAgY29uc29sZS5sb2coZmlsZV9wYXRoKTtcbiAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZV9wYXRoKSApIHtcbiAgICAgIGNvbnNvbGUubG9nKCd0aGUgZmlsZSAnK2ZpbGVfcGF0aCsnICBleGlzdHMnKTtcbiAgICAgIC8vV2Ugc3VwcmVzcyB0aGUgbGFzdCBsaW5lIGJlY2F1c2UgaXQncyB0aGUgY2FyYWN0ZXIgXVxuICAgICAgYWRkSlNPTnRvTG9nKGZpbGVfcGF0aCwgY29tbWFuZCk7XG4gICAgLy9jb25zb2xlLmxvZygnL3B1YmxpYy9pbWFnZXMvZmxhZ3MvJyArIGltZ2ZpbGUgKyBcIi5wbmdcIik7XG4gIH0gZWxzZSB7XG4gICAgY3JlYXRlSlNPTmxvZyhmaWxlX3BhdGgsIGNvbW1hbmQpO1xuICB9XG59XG5cblxuLypcblxuSlNPTi5zdHJpbmdpZnkoZXZ0LCBmdW5jdGlvbihrLCB2KSB7XG4gIGlmICh2IGluc3RhbmNlb2YgTm9kZSkge1xuICAgIHJldHVybiAnTm9kZSc7XG4gIH1cbiAgaWYgKHYgaW5zdGFuY2VvZiBXaW5kb3cpIHtcbiAgICByZXR1cm4gJ1dpbmRvdyc7XG4gIH1cbiAgcmV0dXJuIHY7XG59LCAnICcpO1xuKi9cblxuZnVuY3Rpb24gY3JlYXRlSlNPTmxvZyhmaWxlX3BhdGgsIGNvbW1hbmQpIHtcbiAgdmFyIHN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVfcGF0aCx7J2ZsYWdzJzogJ3cnfSk7XG4gIHN0cmVhbS5vbmNlKCdvcGVuJywgZnVuY3Rpb24oZmQpIHtcbiAgICBzdHJlYW0ud3JpdGUoJ1snKTtcbiAgICBzdHJlYW0ud3JpdGUoSlNPTi5zdHJpbmdpZnkoY29tbWFuZCwgbnVsbCwgMikpO1xuICAgIHN0cmVhbS53cml0ZSgnXFxuJyk7XG4gICAgc3RyZWFtLndyaXRlKCddJyk7XG4gICAgc3RyZWFtLmVuZCgpO1xuICB9KTtcbiAgXG59XG5cbmZ1bmN0aW9uIGFkZEpTT050b0xvZyhmaWxlX3BhdGgsY29tbWFuZCkge1xuICBcbiAgdmFyIGZpbGVuYW1lID0gZmlsZV9wYXRoO1xuICB2YXIgbGluZXMybnVrZSA9IDE7XG4gIHZhciBzdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShmaWxlX3BhdGgseydmbGFncyc6ICdhJ30pO1xuICBzdHJlYW0ub25jZSgnb3BlbicsIGZ1bmN0aW9uKGZkKSB7XG4gICAgLy9XZSBzdXByZXNzIHRoZSBsYXN0IGxpbmUgYmVjYXVzZSBpdCdzIHRoZSBjYXJhY3RlciBdLCB0aGVuIGNvbmNhdGVuYXRlIHRoZSBjb21tYW5kIGFuZCBhZGQgXSBhZ2Fpbi5cbiAgICAvL1RoZSAgXSBpcyB1c2VkIHRvIGNyZWF0ZSBhIHByb3BlciBqc29uIGZpbGUgdGhhdCBjYW4gYmUgcGFyc2VkIHdpdGhvdXQgbW9yZSBhY3Rpb25zXG4gICAgcmxsLnJlYWQoZmlsZW5hbWUsIGxpbmVzMm51a2UpLnRoZW4oKGxpbmVzKSA9PiB7XG4gICAgICB2YXIgdG9fdmFucXVpc2ggPSBsaW5lcy5sZW5ndGg7XG4gICAgICBmcy5zdGF0KGZpbGVuYW1lLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGZzLnRydW5jYXRlKGZpbGVuYW1lLCBzdGF0cy5zaXplIC0gdG9fdmFucXVpc2gsIChlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0ZpbGUgdHJ1bmNhdGVkIScpO1xuICAgICAgICAgIHN0cmVhbS53cml0ZSgnLCcpO1xuICAgICAgICAgIHN0cmVhbS53cml0ZShKU09OLnN0cmluZ2lmeShjb21tYW5kLCBudWxsLCAyKSk7XG4gICAgICAgICAgc3RyZWFtLndyaXRlKFwiXFxuXCIpO1xuICAgICAgICAgIHN0cmVhbS53cml0ZShcIl1cIik7XG4gICAgICAgICAgc3RyZWFtLmVuZCgpO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gIH0pO1xuICBcbiAgXG4gXG4gIFxuICBcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZlckxvZ2dlcjtcblxuXG5cblxuIl19