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
    }
  };
};

function sendCommand() {}

function setUsernameLog(user_name) {
  this.username = user_name;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckxvZ2dlci5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJybGwiLCJ1c2VyX25hbWUiLCJTZXJ2ZXJMb2dnZXIiLCJzZW5kIiwiY29tbWFuZCIsInNlbmRDb21tYW5kIiwibG9nIiwic29ja2V0X25hbWUiLCJsb2dDb21tYW5kIiwic2V0VXNlcm5hbWVMb2ciLCJ1c2VybmFtZSIsImZpbGVfcGF0aCIsImNvbnNvbGUiLCJlIiwiZXhpc3RzU3luYyIsImFkZEpTT050b0xvZyIsImNyZWF0ZUpTT05sb2ciLCJzdHJlYW0iLCJjcmVhdGVXcml0ZVN0cmVhbSIsIm9uY2UiLCJmZCIsIndyaXRlIiwiSlNPTiIsInN0cmluZ2lmeSIsImVuZCIsImZpbGVuYW1lIiwibGluZXMybnVrZSIsInJlYWQiLCJ0aGVuIiwibGluZXMiLCJ0b192YW5xdWlzaCIsImxlbmd0aCIsInN0YXQiLCJlcnIiLCJzdGF0cyIsInRydW5jYXRlIiwic2l6ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBLElBQUlBLEtBQUtDLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUMsTUFBTUQsUUFBUSxpQkFBUixDQUFWOztBQUVBLElBQUlFLFlBQVksSUFBaEI7O0lBR2FDLFksV0FBQUEsWSxHQUNYLHdCQUFjO0FBQUE7O0FBRVosU0FBTztBQUNMO0FBQ0FDLFVBQU0sY0FBU0MsT0FBVCxFQUFrQjtBQUN0QkMsa0JBQVlELE9BQVo7QUFDRCxLQUpJO0FBS0w7QUFDQUUsU0FBTSxhQUFVQyxXQUFWLEVBQXdCSCxPQUF4QixFQUFnQztBQUNwQ0ksaUJBQVdELFdBQVgsRUFBdUJILE9BQXZCO0FBQ0Q7QUFSSSxHQUFQO0FBVUQsQzs7QUFLSCxTQUFTQyxXQUFULEdBQXNCLENBRXJCOztBQUdELFNBQVNJLGNBQVQsQ0FBd0JSLFNBQXhCLEVBQWtDO0FBQ2hDLE9BQUtTLFFBQUwsR0FBZ0JULFNBQWhCO0FBQ0Q7O0FBR0QsU0FBU08sVUFBVCxDQUFvQkQsV0FBcEIsRUFBZ0NILE9BQWhDLEVBQXdDO0FBQ3hDO0FBQ0UsTUFBSU8sWUFBWSx5Q0FBdUNKLFdBQXZEO0FBQ0FLLFVBQVFOLEdBQVIsQ0FBWUYsUUFBUVMsQ0FBcEI7QUFDQUQsVUFBUU4sR0FBUixDQUFZRixPQUFaO0FBQ0FRLFVBQVFOLEdBQVIsQ0FBWVIsR0FBR2dCLFVBQUgsQ0FBY0gsU0FBZCxDQUFaO0FBQ0FDLFVBQVFOLEdBQVIsQ0FBWUssU0FBWjtBQUNBLE1BQUliLEdBQUdnQixVQUFILENBQWNILFNBQWQsQ0FBSixFQUErQjtBQUMzQkMsWUFBUU4sR0FBUixDQUFZLGNBQVlLLFNBQVosR0FBc0IsVUFBbEM7QUFDQTtBQUNBSSxpQkFBYUosU0FBYixFQUF3QlAsT0FBeEI7QUFDRjtBQUNELEdBTEQsTUFLTztBQUNMWSxrQkFBY0wsU0FBZCxFQUF5QlAsT0FBekI7QUFDRDtBQUNGOztBQUdEOzs7Ozs7Ozs7Ozs7O0FBYUEsU0FBU1ksYUFBVCxDQUF1QkwsU0FBdkIsRUFBa0NQLE9BQWxDLEVBQTJDO0FBQ3pDLE1BQUlhLFNBQVNuQixHQUFHb0IsaUJBQUgsQ0FBcUJQLFNBQXJCLEVBQStCLEVBQUMsU0FBUyxHQUFWLEVBQS9CLENBQWI7QUFDQU0sU0FBT0UsSUFBUCxDQUFZLE1BQVosRUFBb0IsVUFBU0MsRUFBVCxFQUFhO0FBQy9CSCxXQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixXQUFPSSxLQUFQLENBQWFDLEtBQUtDLFNBQUwsQ0FBZW5CLE9BQWYsRUFBd0IsSUFBeEIsRUFBOEIsQ0FBOUIsQ0FBYjtBQUNBYSxXQUFPSSxLQUFQLENBQWEsSUFBYjtBQUNBSixXQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixXQUFPTyxHQUFQO0FBQ0QsR0FORDtBQVFEOztBQUVELFNBQVNULFlBQVQsQ0FBc0JKLFNBQXRCLEVBQWdDUCxPQUFoQyxFQUF5Qzs7QUFFdkMsTUFBSXFCLFdBQVdkLFNBQWY7QUFDQSxNQUFJZSxhQUFhLENBQWpCO0FBQ0EsTUFBSVQsU0FBU25CLEdBQUdvQixpQkFBSCxDQUFxQlAsU0FBckIsRUFBK0IsRUFBQyxTQUFTLEdBQVYsRUFBL0IsQ0FBYjtBQUNBTSxTQUFPRSxJQUFQLENBQVksTUFBWixFQUFvQixVQUFTQyxFQUFULEVBQWE7QUFDL0I7QUFDQTtBQUNBcEIsUUFBSTJCLElBQUosQ0FBU0YsUUFBVCxFQUFtQkMsVUFBbkIsRUFBK0JFLElBQS9CLENBQW9DLFVBQUNDLEtBQUQsRUFBVztBQUM3QyxVQUFJQyxjQUFjRCxNQUFNRSxNQUF4QjtBQUNBakMsU0FBR2tDLElBQUgsQ0FBUVAsUUFBUixFQUFrQixVQUFDUSxHQUFELEVBQU1DLEtBQU4sRUFBZ0I7QUFDaEMsWUFBSUQsR0FBSixFQUFTLE1BQU1BLEdBQU47QUFDVG5DLFdBQUdxQyxRQUFILENBQVlWLFFBQVosRUFBc0JTLE1BQU1FLElBQU4sR0FBYU4sV0FBbkMsRUFBZ0QsVUFBQ0csR0FBRCxFQUFTO0FBQ3ZELGNBQUlBLEdBQUosRUFBUyxNQUFNQSxHQUFOO0FBQ1RyQixrQkFBUU4sR0FBUixDQUFZLGlCQUFaO0FBQ0FXLGlCQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixpQkFBT0ksS0FBUCxDQUFhQyxLQUFLQyxTQUFMLENBQWVuQixPQUFmLEVBQXdCLElBQXhCLEVBQThCLENBQTlCLENBQWI7QUFDQWEsaUJBQU9JLEtBQVAsQ0FBYSxJQUFiO0FBQ0FKLGlCQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixpQkFBT08sR0FBUDtBQUNELFNBUkQ7QUFTRCxPQVhEO0FBWUQsS0FkRDtBQWdCRCxHQW5CRDtBQXlCRDs7QUFHRGEsT0FBT0MsT0FBUCxHQUFpQnBDLFlBQWpCIiwiZmlsZSI6IlNlcnZlckxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHJsbCA9IHJlcXVpcmUoJ3JlYWQtbGFzdC1saW5lcycpO1xuXG52YXIgdXNlcl9uYW1lID0gbnVsbDtcblxuXG5leHBvcnQgY2xhc3MgU2VydmVyTG9nZ2Vye1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vU2VuZCBhIGNvbW1hbmQgdG8gdGhlIGNsaWVudFxuICAgICAgc2VuZDogZnVuY3Rpb24oY29tbWFuZCkge1xuICAgICAgICBzZW5kQ29tbWFuZChjb21tYW5kKTtcbiAgICAgIH0sXG4gICAgICAvL2xvZyBhIGNvbW1hbmQgaW4gYSBmaWxlXG4gICAgICBsb2cgOiBmdW5jdGlvbiggc29ja2V0X25hbWUgLCBjb21tYW5kKXtcbiAgICAgICAgbG9nQ29tbWFuZChzb2NrZXRfbmFtZSxjb21tYW5kKTtcbiAgICAgIH0sXG4gICAgfVxuICB9O1xuICBcbn1cblxuXG5mdW5jdGlvbiBzZW5kQ29tbWFuZCgpe1xuXG59XG5cblxuZnVuY3Rpb24gc2V0VXNlcm5hbWVMb2codXNlcl9uYW1lKXtcbiAgdGhpcy51c2VybmFtZSA9IHVzZXJfbmFtZTtcbn1cblxuXG5mdW5jdGlvbiBsb2dDb21tYW5kKHNvY2tldF9uYW1lLGNvbW1hbmQpe1xuLy9sb2cgdGhlIGNvbW1hbmQgaW50byBhIGZpbGVcbiAgbGV0IGZpbGVfcGF0aCA9IFwiLi9zcmMvc2VydmVyL2xvZ19zZXNzaW9uX2NsaWVudC9sb2c6XCIrc29ja2V0X25hbWU7XG4gIGNvbnNvbGUubG9nKGNvbW1hbmQuZSk7XG4gIGNvbnNvbGUubG9nKGNvbW1hbmQpO1xuICBjb25zb2xlLmxvZyhmcy5leGlzdHNTeW5jKGZpbGVfcGF0aCkgICk7XG4gIGNvbnNvbGUubG9nKGZpbGVfcGF0aCk7XG4gIGlmIChmcy5leGlzdHNTeW5jKGZpbGVfcGF0aCkgKSB7XG4gICAgICBjb25zb2xlLmxvZygndGhlIGZpbGUgJytmaWxlX3BhdGgrJyAgZXhpc3RzJyk7XG4gICAgICAvL1dlIHN1cHJlc3MgdGhlIGxhc3QgbGluZSBiZWNhdXNlIGl0J3MgdGhlIGNhcmFjdGVyIF1cbiAgICAgIGFkZEpTT050b0xvZyhmaWxlX3BhdGgsIGNvbW1hbmQpO1xuICAgIC8vY29uc29sZS5sb2coJy9wdWJsaWMvaW1hZ2VzL2ZsYWdzLycgKyBpbWdmaWxlICsgXCIucG5nXCIpO1xuICB9IGVsc2Uge1xuICAgIGNyZWF0ZUpTT05sb2coZmlsZV9wYXRoLCBjb21tYW5kKTtcbiAgfVxufVxuXG5cbi8qXG5cbkpTT04uc3RyaW5naWZ5KGV2dCwgZnVuY3Rpb24oaywgdikge1xuICBpZiAodiBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICByZXR1cm4gJ05vZGUnO1xuICB9XG4gIGlmICh2IGluc3RhbmNlb2YgV2luZG93KSB7XG4gICAgcmV0dXJuICdXaW5kb3cnO1xuICB9XG4gIHJldHVybiB2O1xufSwgJyAnKTtcbiovXG5cbmZ1bmN0aW9uIGNyZWF0ZUpTT05sb2coZmlsZV9wYXRoLCBjb21tYW5kKSB7XG4gIHZhciBzdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShmaWxlX3BhdGgseydmbGFncyc6ICd3J30pO1xuICBzdHJlYW0ub25jZSgnb3BlbicsIGZ1bmN0aW9uKGZkKSB7XG4gICAgc3RyZWFtLndyaXRlKCdbJyk7XG4gICAgc3RyZWFtLndyaXRlKEpTT04uc3RyaW5naWZ5KGNvbW1hbmQsIG51bGwsIDIpKTtcbiAgICBzdHJlYW0ud3JpdGUoJ1xcbicpO1xuICAgIHN0cmVhbS53cml0ZSgnXScpO1xuICAgIHN0cmVhbS5lbmQoKTtcbiAgfSk7XG4gIFxufVxuXG5mdW5jdGlvbiBhZGRKU09OdG9Mb2coZmlsZV9wYXRoLGNvbW1hbmQpIHtcbiAgXG4gIHZhciBmaWxlbmFtZSA9IGZpbGVfcGF0aDtcbiAgdmFyIGxpbmVzMm51a2UgPSAxO1xuICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZV9wYXRoLHsnZmxhZ3MnOiAnYSd9KTtcbiAgc3RyZWFtLm9uY2UoJ29wZW4nLCBmdW5jdGlvbihmZCkge1xuICAgIC8vV2Ugc3VwcmVzcyB0aGUgbGFzdCBsaW5lIGJlY2F1c2UgaXQncyB0aGUgY2FyYWN0ZXIgXSwgdGhlbiBjb25jYXRlbmF0ZSB0aGUgY29tbWFuZCBhbmQgYWRkIF0gYWdhaW4uXG4gICAgLy9UaGUgIF0gaXMgdXNlZCB0byBjcmVhdGUgYSBwcm9wZXIganNvbiBmaWxlIHRoYXQgY2FuIGJlIHBhcnNlZCB3aXRob3V0IG1vcmUgYWN0aW9uc1xuICAgIHJsbC5yZWFkKGZpbGVuYW1lLCBsaW5lczJudWtlKS50aGVuKChsaW5lcykgPT4ge1xuICAgICAgdmFyIHRvX3ZhbnF1aXNoID0gbGluZXMubGVuZ3RoO1xuICAgICAgZnMuc3RhdChmaWxlbmFtZSwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBmcy50cnVuY2F0ZShmaWxlbmFtZSwgc3RhdHMuc2l6ZSAtIHRvX3ZhbnF1aXNoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdGaWxlIHRydW5jYXRlZCEnKTtcbiAgICAgICAgICBzdHJlYW0ud3JpdGUoJywnKTtcbiAgICAgICAgICBzdHJlYW0ud3JpdGUoSlNPTi5zdHJpbmdpZnkoY29tbWFuZCwgbnVsbCwgMikpO1xuICAgICAgICAgIHN0cmVhbS53cml0ZShcIlxcblwiKTtcbiAgICAgICAgICBzdHJlYW0ud3JpdGUoXCJdXCIpO1xuICAgICAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICB9KTtcbiAgXG4gIFxuIFxuICBcbiAgXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2ZXJMb2dnZXI7XG5cblxuXG5cbiJdfQ==