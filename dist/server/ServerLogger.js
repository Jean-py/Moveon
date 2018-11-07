"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var rll = require('read-last-lines');

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

function logCommand(socket_name, command) {
  //log the command into a file
  var file_path = "./src/server/log_txt/log:" + socket_name;
  console.log(command);
  console.log("AAAAAAAA");
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
    //We supress the last line because it's the caracter ]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckxvZ2dlci5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJybGwiLCJTZXJ2ZXJMb2dnZXIiLCJzZW5kIiwiY29tbWFuZCIsInNlbmRDb21tYW5kIiwibG9nIiwic29ja2V0X25hbWUiLCJsb2dDb21tYW5kIiwiZmlsZV9wYXRoIiwiY29uc29sZSIsImV4aXN0c1N5bmMiLCJhZGRKU09OdG9Mb2ciLCJjcmVhdGVKU09ObG9nIiwic3RyZWFtIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvbmNlIiwiZmQiLCJ3cml0ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbmQiLCJmaWxlbmFtZSIsImxpbmVzMm51a2UiLCJyZWFkIiwidGhlbiIsImxpbmVzIiwidG9fdmFucXVpc2giLCJsZW5ndGgiLCJzdGF0IiwiZXJyIiwic3RhdHMiLCJ0cnVuY2F0ZSIsInNpemUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFFQSxJQUFJQSxLQUFLQyxRQUFRLElBQVIsQ0FBVDtBQUNBLElBQUlDLE1BQU1ELFFBQVEsaUJBQVIsQ0FBVjs7SUFJYUUsWSxXQUFBQSxZLEdBQ1gsd0JBQWM7QUFBQTs7QUFDWixTQUFPO0FBQ0w7QUFDQUMsVUFBTSxjQUFTQyxPQUFULEVBQWtCO0FBQ3RCQyxrQkFBWUQsT0FBWjtBQUNELEtBSkk7QUFLTDtBQUNBRSxTQUFNLGFBQVVDLFdBQVYsRUFBd0JILE9BQXhCLEVBQWdDO0FBQ3BDSSxpQkFBV0QsV0FBWCxFQUF1QkgsT0FBdkI7QUFDRDtBQVJJLEdBQVA7QUFVRCxDOztBQUtILFNBQVNDLFdBQVQsR0FBc0IsQ0FFckI7O0FBRUQsU0FBU0csVUFBVCxDQUFvQkQsV0FBcEIsRUFBZ0NILE9BQWhDLEVBQXdDO0FBQ3hDO0FBQ0UsTUFBSUssWUFBWSw4QkFBNEJGLFdBQTVDO0FBQ0FHLFVBQVFKLEdBQVIsQ0FBWUYsT0FBWjtBQUNBTSxVQUFRSixHQUFSLENBQVksVUFBWjtBQUNBSSxVQUFRSixHQUFSLENBQVlQLEdBQUdZLFVBQUgsQ0FBY0YsU0FBZCxDQUFaO0FBQ0FDLFVBQVFKLEdBQVIsQ0FBWUcsU0FBWjs7QUFJQSxNQUFJVixHQUFHWSxVQUFILENBQWNGLFNBQWQsQ0FBSixFQUErQjtBQUMzQkMsWUFBUUosR0FBUixDQUFZLGNBQVlHLFNBQVosR0FBc0IsVUFBbEM7QUFDQTtBQUNBRyxpQkFBYUgsU0FBYixFQUF3QkwsT0FBeEI7QUFDRjtBQUNELEdBTEQsTUFLTztBQUNMUyxrQkFBY0osU0FBZCxFQUF5QkwsT0FBekI7QUFFRDtBQUdGOztBQUVELFNBQVNTLGFBQVQsQ0FBdUJKLFNBQXZCLEVBQWtDTCxPQUFsQyxFQUEyQztBQUN6QyxNQUFJVSxTQUFTZixHQUFHZ0IsaUJBQUgsQ0FBcUJOLFNBQXJCLEVBQStCLEVBQUMsU0FBUyxHQUFWLEVBQS9CLENBQWI7QUFDQUssU0FBT0UsSUFBUCxDQUFZLE1BQVosRUFBb0IsVUFBU0MsRUFBVCxFQUFhO0FBQy9CSCxXQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixXQUFPSSxLQUFQLENBQWFDLEtBQUtDLFNBQUwsQ0FBZWhCLE9BQWYsRUFBd0IsSUFBeEIsRUFBOEIsQ0FBOUIsQ0FBYjtBQUNBVSxXQUFPSSxLQUFQLENBQWEsSUFBYjtBQUNBSixXQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixXQUFPTyxHQUFQO0FBQ0QsR0FORDtBQVFEOztBQUVELFNBQVNULFlBQVQsQ0FBc0JILFNBQXRCLEVBQWdDTCxPQUFoQyxFQUF5Qzs7QUFFdkMsTUFBSWtCLFdBQVdiLFNBQWY7QUFDQSxNQUFJYyxhQUFhLENBQWpCO0FBQ0EsTUFBSVQsU0FBU2YsR0FBR2dCLGlCQUFILENBQXFCTixTQUFyQixFQUErQixFQUFDLFNBQVMsR0FBVixFQUEvQixDQUFiO0FBQ0FLLFNBQU9FLElBQVAsQ0FBWSxNQUFaLEVBQW9CLFVBQVNDLEVBQVQsRUFBYTtBQUMvQjtBQUNBaEIsUUFBSXVCLElBQUosQ0FBU0YsUUFBVCxFQUFtQkMsVUFBbkIsRUFBK0JFLElBQS9CLENBQW9DLFVBQUNDLEtBQUQsRUFBVztBQUM3QyxVQUFJQyxjQUFjRCxNQUFNRSxNQUF4QjtBQUNBN0IsU0FBRzhCLElBQUgsQ0FBUVAsUUFBUixFQUFrQixVQUFDUSxHQUFELEVBQU1DLEtBQU4sRUFBZ0I7QUFDaEMsWUFBSUQsR0FBSixFQUFTLE1BQU1BLEdBQU47QUFDVC9CLFdBQUdpQyxRQUFILENBQVlWLFFBQVosRUFBc0JTLE1BQU1FLElBQU4sR0FBYU4sV0FBbkMsRUFBZ0QsVUFBQ0csR0FBRCxFQUFTO0FBQ3ZELGNBQUlBLEdBQUosRUFBUyxNQUFNQSxHQUFOO0FBQ1RwQixrQkFBUUosR0FBUixDQUFZLGlCQUFaO0FBQ0FRLGlCQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixpQkFBT0ksS0FBUCxDQUFhQyxLQUFLQyxTQUFMLENBQWVoQixPQUFmLEVBQXdCLElBQXhCLEVBQThCLENBQTlCLENBQWI7QUFDQVUsaUJBQU9JLEtBQVAsQ0FBYSxJQUFiO0FBQ0FKLGlCQUFPSSxLQUFQLENBQWEsR0FBYjtBQUNBSixpQkFBT08sR0FBUDtBQUNELFNBUkQ7QUFTRCxPQVhEO0FBWUQsS0FkRDtBQWdCRCxHQWxCRDtBQXdCRDs7QUFHRGEsT0FBT0MsT0FBUCxHQUFpQmpDLFlBQWpCIiwiZmlsZSI6IlNlcnZlckxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHJsbCA9IHJlcXVpcmUoJ3JlYWQtbGFzdC1saW5lcycpO1xuXG5cblxuZXhwb3J0IGNsYXNzIFNlcnZlckxvZ2dlcntcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vU2VuZCBhIGNvbW1hbmQgdG8gdGhlIGNsaWVudFxuICAgICAgc2VuZDogZnVuY3Rpb24oY29tbWFuZCkge1xuICAgICAgICBzZW5kQ29tbWFuZChjb21tYW5kKTtcbiAgICAgIH0sXG4gICAgICAvL2xvZyBhIGNvbW1hbmQgaW4gYSBmaWxlXG4gICAgICBsb2cgOiBmdW5jdGlvbiggc29ja2V0X25hbWUgLCBjb21tYW5kKXtcbiAgICAgICAgbG9nQ29tbWFuZChzb2NrZXRfbmFtZSxjb21tYW5kKTtcbiAgICAgIH0sXG4gICAgfVxuICB9O1xuICBcbiAgXG59XG5cbmZ1bmN0aW9uIHNlbmRDb21tYW5kKCl7XG5cbn1cblxuZnVuY3Rpb24gbG9nQ29tbWFuZChzb2NrZXRfbmFtZSxjb21tYW5kKXtcbi8vbG9nIHRoZSBjb21tYW5kIGludG8gYSBmaWxlXG4gIGxldCBmaWxlX3BhdGggPSBcIi4vc3JjL3NlcnZlci9sb2dfdHh0L2xvZzpcIitzb2NrZXRfbmFtZTtcbiAgY29uc29sZS5sb2coY29tbWFuZCk7XG4gIGNvbnNvbGUubG9nKFwiQUFBQUFBQUFcIik7XG4gIGNvbnNvbGUubG9nKGZzLmV4aXN0c1N5bmMoZmlsZV9wYXRoKSAgKTtcbiAgY29uc29sZS5sb2coZmlsZV9wYXRoKTtcbiAgXG4gIFxuICBcbiAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZV9wYXRoKSApIHtcbiAgICAgIGNvbnNvbGUubG9nKCd0aGUgZmlsZSAnK2ZpbGVfcGF0aCsnICBleGlzdHMnKTtcbiAgICAgIC8vV2Ugc3VwcmVzcyB0aGUgbGFzdCBsaW5lIGJlY2F1c2UgaXQncyB0aGUgY2FyYWN0ZXIgXVxuICAgICAgYWRkSlNPTnRvTG9nKGZpbGVfcGF0aCwgY29tbWFuZCk7XG4gICAgLy9jb25zb2xlLmxvZygnL3B1YmxpYy9pbWFnZXMvZmxhZ3MvJyArIGltZ2ZpbGUgKyBcIi5wbmdcIik7XG4gIH0gZWxzZSB7XG4gICAgY3JlYXRlSlNPTmxvZyhmaWxlX3BhdGgsIGNvbW1hbmQpO1xuICAgXG4gIH1cbiAgXG4gXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUpTT05sb2coZmlsZV9wYXRoLCBjb21tYW5kKSB7XG4gIHZhciBzdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShmaWxlX3BhdGgseydmbGFncyc6ICd3J30pO1xuICBzdHJlYW0ub25jZSgnb3BlbicsIGZ1bmN0aW9uKGZkKSB7XG4gICAgc3RyZWFtLndyaXRlKCdbJyk7XG4gICAgc3RyZWFtLndyaXRlKEpTT04uc3RyaW5naWZ5KGNvbW1hbmQsIG51bGwsIDIpKTtcbiAgICBzdHJlYW0ud3JpdGUoJ1xcbicpO1xuICAgIHN0cmVhbS53cml0ZSgnXScpO1xuICAgIHN0cmVhbS5lbmQoKTtcbiAgfSk7XG4gIFxufVxuXG5mdW5jdGlvbiBhZGRKU09OdG9Mb2coZmlsZV9wYXRoLGNvbW1hbmQpIHtcbiAgXG4gIHZhciBmaWxlbmFtZSA9IGZpbGVfcGF0aDtcbiAgdmFyIGxpbmVzMm51a2UgPSAxO1xuICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZV9wYXRoLHsnZmxhZ3MnOiAnYSd9KTtcbiAgc3RyZWFtLm9uY2UoJ29wZW4nLCBmdW5jdGlvbihmZCkge1xuICAgIC8vV2Ugc3VwcmVzcyB0aGUgbGFzdCBsaW5lIGJlY2F1c2UgaXQncyB0aGUgY2FyYWN0ZXIgXVxuICAgIHJsbC5yZWFkKGZpbGVuYW1lLCBsaW5lczJudWtlKS50aGVuKChsaW5lcykgPT4ge1xuICAgICAgdmFyIHRvX3ZhbnF1aXNoID0gbGluZXMubGVuZ3RoO1xuICAgICAgZnMuc3RhdChmaWxlbmFtZSwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBmcy50cnVuY2F0ZShmaWxlbmFtZSwgc3RhdHMuc2l6ZSAtIHRvX3ZhbnF1aXNoLCAoZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdGaWxlIHRydW5jYXRlZCEnKTtcbiAgICAgICAgICBzdHJlYW0ud3JpdGUoJywnKTtcbiAgICAgICAgICBzdHJlYW0ud3JpdGUoSlNPTi5zdHJpbmdpZnkoY29tbWFuZCwgbnVsbCwgMikpO1xuICAgICAgICAgIHN0cmVhbS53cml0ZShcIlxcblwiKTtcbiAgICAgICAgICBzdHJlYW0ud3JpdGUoXCJdXCIpO1xuICAgICAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICB9KTtcbiAgXG4gIFxuIFxuICBcbiAgXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2ZXJMb2dnZXI7XG5cblxuXG5cbiJdfQ==