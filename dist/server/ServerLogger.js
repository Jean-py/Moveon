"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');

var ServerLogger = exports.ServerLogger = function ServerLogger() {
  _classCallCheck(this, ServerLogger);

  return {
    //Send a command to the client
    send: function send(command) {
      sendCommand(command);
    },
    //log a command in a file
    log: function log(command) {
      logCommand(command);
    }
  };
};

function sendCommand() {}

function logCommand(id_socket, command) {
  //log the command into a file
  console.log(command);

  if (fs.exists("./src/server/log_txt/log:" + id_socket) === true) {

    var stream = fs.createWriteStream("./src/server/log_txt/log:" + id_socket);
    stream.once('open', function (fd) {
      stream.write(command + "\n");
      stream.end();
    });
    //console.log('/public/images/flags/' + imgfile + ".png");
    console.log('fs exists');
  } else {
    fs.writeFile("./src/server/log_txt/log:" + id_socket, command, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
}

module.exports = ServerLogger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckxvZ2dlci5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJTZXJ2ZXJMb2dnZXIiLCJzZW5kIiwiY29tbWFuZCIsInNlbmRDb21tYW5kIiwibG9nIiwibG9nQ29tbWFuZCIsImlkX3NvY2tldCIsImNvbnNvbGUiLCJleGlzdHMiLCJzdHJlYW0iLCJjcmVhdGVXcml0ZVN0cmVhbSIsIm9uY2UiLCJmZCIsIndyaXRlIiwiZW5kIiwid3JpdGVGaWxlIiwiZXJyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBRUEsSUFBSUEsS0FBS0MsUUFBUSxJQUFSLENBQVQ7O0lBSWFDLFksV0FBQUEsWSxHQUNYLHdCQUFjO0FBQUE7O0FBQ1osU0FBTztBQUNMO0FBQ0FDLFVBQU0sY0FBU0MsT0FBVCxFQUFrQjtBQUN0QkMsa0JBQVlELE9BQVo7QUFDRCxLQUpJO0FBS0w7QUFDQUUsU0FBTSxhQUFTRixPQUFULEVBQWlCO0FBQ3JCRyxpQkFBV0gsT0FBWDtBQUNEO0FBUkksR0FBUDtBQVVELEM7O0FBS0gsU0FBU0MsV0FBVCxHQUFzQixDQUVyQjs7QUFFRCxTQUFTRSxVQUFULENBQW9CQyxTQUFwQixFQUE4QkosT0FBOUIsRUFBc0M7QUFDdEM7QUFDRUssVUFBUUgsR0FBUixDQUFZRixPQUFaOztBQUVBLE1BQUlKLEdBQUdVLE1BQUgsQ0FBVSw4QkFBNEJGLFNBQXRDLE1BQXFELElBQXpELEVBQStEOztBQUc3RCxRQUFJRyxTQUFTWCxHQUFHWSxpQkFBSCxDQUFxQiw4QkFBNEJKLFNBQWpELENBQWI7QUFDQUcsV0FBT0UsSUFBUCxDQUFZLE1BQVosRUFBb0IsVUFBU0MsRUFBVCxFQUFhO0FBQy9CSCxhQUFPSSxLQUFQLENBQWFYLFVBQVEsSUFBckI7QUFDQU8sYUFBT0ssR0FBUDtBQUNELEtBSEQ7QUFJQTtBQUNBUCxZQUFRSCxHQUFSLENBQVksV0FBWjtBQUdELEdBWkQsTUFZTztBQUNMTixPQUFHaUIsU0FBSCxDQUFhLDhCQUE0QlQsU0FBekMsRUFBb0RKLE9BQXBELEVBQTZELFVBQVNjLEdBQVQsRUFBYztBQUN6RSxVQUFJQSxHQUFKLEVBQVM7QUFDUFQsZ0JBQVFILEdBQVIsQ0FBWVksR0FBWjtBQUNEO0FBQ0YsS0FKRDtBQUtEO0FBR0Y7O0FBRURDLE9BQU9DLE9BQVAsR0FBaUJsQixZQUFqQiIsImZpbGUiOiJTZXJ2ZXJMb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcblxuXG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXJMb2dnZXJ7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvL1NlbmQgYSBjb21tYW5kIHRvIHRoZSBjbGllbnRcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgICAgICAgc2VuZENvbW1hbmQoY29tbWFuZCk7XG4gICAgICB9LFxuICAgICAgLy9sb2cgYSBjb21tYW5kIGluIGEgZmlsZVxuICAgICAgbG9nIDogZnVuY3Rpb24oY29tbWFuZCl7XG4gICAgICAgIGxvZ0NvbW1hbmQoY29tbWFuZCk7XG4gICAgICB9LFxuICAgIH1cbiAgfTtcbiAgXG4gIFxufVxuXG5mdW5jdGlvbiBzZW5kQ29tbWFuZCgpe1xuXG59XG5cbmZ1bmN0aW9uIGxvZ0NvbW1hbmQoaWRfc29ja2V0LGNvbW1hbmQpe1xuLy9sb2cgdGhlIGNvbW1hbmQgaW50byBhIGZpbGVcbiAgY29uc29sZS5sb2coY29tbWFuZCk7XG4gIFxuICBpZiAoZnMuZXhpc3RzKFwiLi9zcmMvc2VydmVyL2xvZ190eHQvbG9nOlwiK2lkX3NvY2tldCkgPT09IHRydWUpIHtcbiAgXG4gICBcbiAgICB2YXIgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oXCIuL3NyYy9zZXJ2ZXIvbG9nX3R4dC9sb2c6XCIraWRfc29ja2V0KTtcbiAgICBzdHJlYW0ub25jZSgnb3BlbicsIGZ1bmN0aW9uKGZkKSB7XG4gICAgICBzdHJlYW0ud3JpdGUoY29tbWFuZCtcIlxcblwiKTtcbiAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICB9KTtcbiAgICAvL2NvbnNvbGUubG9nKCcvcHVibGljL2ltYWdlcy9mbGFncy8nICsgaW1nZmlsZSArIFwiLnBuZ1wiKTtcbiAgICBjb25zb2xlLmxvZygnZnMgZXhpc3RzJyk7XG4gICAgXG4gICAgXG4gIH0gZWxzZSB7XG4gICAgZnMud3JpdGVGaWxlKFwiLi9zcmMvc2VydmVyL2xvZ190eHQvbG9nOlwiK2lkX3NvY2tldCwgY29tbWFuZCwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgXG4gXG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VydmVyTG9nZ2VyO1xuXG5cblxuXG4iXX0=