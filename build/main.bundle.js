#!/usr/bin/env node
'use strict';

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('moveon:server');
var config = require('../src/config/default');
var http = require('http');
var babel = require('babel-core/register');

/**
 * Get port from environment and store in Express.
 */
var port = config.portServer;
//var port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2Jpbi93d3ciXSwibmFtZXMiOlsiYXBwIiwicmVxdWlyZSIsImRlYnVnIiwiY29uZmlnIiwiaHR0cCIsImJhYmVsIiwicG9ydCIsInBvcnRTZXJ2ZXIiLCJzZXQiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJsaXN0ZW4iLCJvbiIsIm9uRXJyb3IiLCJvbkxpc3RlbmluZyIsIm5vcm1hbGl6ZVBvcnQiLCJ2YWwiLCJwYXJzZUludCIsImlzTmFOIiwiZXJyb3IiLCJzeXNjYWxsIiwiYmluZCIsImNvZGUiLCJjb25zb2xlIiwicHJvY2VzcyIsImV4aXQiLCJhZGRyIiwiYWRkcmVzcyJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUlBLElBQUlBLE1BQU1DLFFBQVEsUUFBUixDQUFWO0FBQ0EsSUFBSUMsUUFBUUQsUUFBUSxPQUFSLEVBQWlCLGVBQWpCLENBQVo7QUFDQSxJQUFJRSxTQUFTRixRQUFRLHVCQUFSLENBQWI7QUFDQSxJQUFJRyxPQUFPSCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlJLFFBQVFKLFFBQVEscUJBQVIsQ0FBWjs7QUFFQTs7O0FBR0EsSUFBSUssT0FBT0gsT0FBT0ksVUFBbEI7QUFDQTtBQUNBUCxJQUFJUSxHQUFKLENBQVEsTUFBUixFQUFnQkYsSUFBaEI7O0FBRUE7Ozs7QUFJQSxJQUFJRyxTQUFTTCxLQUFLTSxZQUFMLENBQWtCVixHQUFsQixDQUFiOztBQUVBOzs7O0FBSUFTLE9BQU9FLE1BQVAsQ0FBY0wsSUFBZDtBQUNBRyxPQUFPRyxFQUFQLENBQVUsT0FBVixFQUFtQkMsT0FBbkI7QUFDQUosT0FBT0csRUFBUCxDQUFVLFdBQVYsRUFBdUJFLFdBQXZCOztBQUVBOzs7O0FBSUEsU0FBU0MsYUFBVCxDQUF1QkMsR0FBdkIsRUFBNEI7QUFDMUIsTUFBSVYsT0FBT1csU0FBU0QsR0FBVCxFQUFjLEVBQWQsQ0FBWDs7QUFFQSxNQUFJRSxNQUFNWixJQUFOLENBQUosRUFBaUI7QUFDZjtBQUNBLFdBQU9VLEdBQVA7QUFDRDs7QUFFRCxNQUFJVixRQUFRLENBQVosRUFBZTtBQUNiO0FBQ0EsV0FBT0EsSUFBUDtBQUNEOztBQUVELFNBQU8sS0FBUDtBQUNEOztBQUVEOzs7O0FBSUEsU0FBU08sT0FBVCxDQUFpQk0sS0FBakIsRUFBd0I7QUFDdEIsTUFBSUEsTUFBTUMsT0FBTixLQUFrQixRQUF0QixFQUFnQztBQUM5QixVQUFNRCxLQUFOO0FBQ0Q7O0FBRUQsTUFBSUUsT0FBTyxPQUFPZixJQUFQLEtBQWdCLFFBQWhCLEdBQ1AsVUFBVUEsSUFESCxHQUVQLFVBQVVBLElBRmQ7O0FBSUE7QUFDQSxVQUFRYSxNQUFNRyxJQUFkO0FBQ0UsU0FBSyxRQUFMO0FBQ0VDLGNBQVFKLEtBQVIsQ0FBY0UsT0FBTywrQkFBckI7QUFDQUcsY0FBUUMsSUFBUixDQUFhLENBQWI7QUFDQTtBQUNGLFNBQUssWUFBTDtBQUNFRixjQUFRSixLQUFSLENBQWNFLE9BQU8sb0JBQXJCO0FBQ0FHLGNBQVFDLElBQVIsQ0FBYSxDQUFiO0FBQ0E7QUFDRjtBQUNFLFlBQU1OLEtBQU47QUFWSjtBQVlEOztBQUVEOzs7QUFHQSxTQUFTTCxXQUFULEdBQXVCO0FBQ3JCLE1BQUlZLE9BQU9qQixPQUFPa0IsT0FBUCxFQUFYO0FBQ0EsTUFBSU4sT0FBTyxPQUFPSyxJQUFQLEtBQWdCLFFBQWhCLEdBQ1AsVUFBVUEsSUFESCxHQUVQLFVBQVVBLEtBQUtwQixJQUZuQjtBQUdBSixRQUFNLGtCQUFrQm1CLElBQXhCO0FBQ0QiLCJmaWxlIjoid3d3Iiwic291cmNlc0NvbnRlbnQiOlsiXG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgYXBwID0gcmVxdWlyZSgnLi4vYXBwJyk7XG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdtb3Zlb246c2VydmVyJyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vc3JjL2NvbmZpZy9kZWZhdWx0Jyk7XG52YXIgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcbnZhciBiYWJlbCA9IHJlcXVpcmUoJ2JhYmVsLWNvcmUvcmVnaXN0ZXInKTtcblxuLyoqXG4gKiBHZXQgcG9ydCBmcm9tIGVudmlyb25tZW50IGFuZCBzdG9yZSBpbiBFeHByZXNzLlxuICovXG52YXIgcG9ydCA9IGNvbmZpZy5wb3J0U2VydmVyO1xuLy92YXIgcG9ydCA9IG5vcm1hbGl6ZVBvcnQocHJvY2Vzcy5lbnYuUE9SVCB8fCAnODA4MCcpO1xuYXBwLnNldCgncG9ydCcsIHBvcnQpO1xuXG4vKipcbiAqIENyZWF0ZSBIVFRQIHNlcnZlci5cbiAqL1xuXG52YXIgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoYXBwKTtcblxuLyoqXG4gKiBMaXN0ZW4gb24gcHJvdmlkZWQgcG9ydCwgb24gYWxsIG5ldHdvcmsgaW50ZXJmYWNlcy5cbiAqL1xuXG5zZXJ2ZXIubGlzdGVuKHBvcnQpO1xuc2VydmVyLm9uKCdlcnJvcicsIG9uRXJyb3IpO1xuc2VydmVyLm9uKCdsaXN0ZW5pbmcnLCBvbkxpc3RlbmluZyk7XG5cbi8qKlxuICogTm9ybWFsaXplIGEgcG9ydCBpbnRvIGEgbnVtYmVyLCBzdHJpbmcsIG9yIGZhbHNlLlxuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVBvcnQodmFsKSB7XG4gIHZhciBwb3J0ID0gcGFyc2VJbnQodmFsLCAxMCk7XG5cbiAgaWYgKGlzTmFOKHBvcnQpKSB7XG4gICAgLy8gbmFtZWQgcGlwZVxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBpZiAocG9ydCA+PSAwKSB7XG4gICAgLy8gcG9ydCBudW1iZXJcbiAgICByZXR1cm4gcG9ydDtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJlcnJvclwiIGV2ZW50LlxuICovXG5cbmZ1bmN0aW9uIG9uRXJyb3IoZXJyb3IpIHtcbiAgaWYgKGVycm9yLnN5c2NhbGwgIT09ICdsaXN0ZW4nKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cblxuICB2YXIgYmluZCA9IHR5cGVvZiBwb3J0ID09PSAnc3RyaW5nJ1xuICAgID8gJ1BpcGUgJyArIHBvcnRcbiAgICA6ICdQb3J0ICcgKyBwb3J0O1xuXG4gIC8vIGhhbmRsZSBzcGVjaWZpYyBsaXN0ZW4gZXJyb3JzIHdpdGggZnJpZW5kbHkgbWVzc2FnZXNcbiAgc3dpdGNoIChlcnJvci5jb2RlKSB7XG4gICAgY2FzZSAnRUFDQ0VTJzpcbiAgICAgIGNvbnNvbGUuZXJyb3IoYmluZCArICcgcmVxdWlyZXMgZWxldmF0ZWQgcHJpdmlsZWdlcycpO1xuICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnRUFERFJJTlVTRSc6XG4gICAgICBjb25zb2xlLmVycm9yKGJpbmQgKyAnIGlzIGFscmVhZHkgaW4gdXNlJyk7XG4gICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLyoqXG4gKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJsaXN0ZW5pbmdcIiBldmVudC5cbiAqL1xuZnVuY3Rpb24gb25MaXN0ZW5pbmcoKSB7XG4gIHZhciBhZGRyID0gc2VydmVyLmFkZHJlc3MoKTtcbiAgdmFyIGJpbmQgPSB0eXBlb2YgYWRkciA9PT0gJ3N0cmluZydcbiAgICA/ICdwaXBlICcgKyBhZGRyXG4gICAgOiAncG9ydCAnICsgYWRkci5wb3J0O1xuICBkZWJ1ZygnTGlzdGVuaW5nIG9uICcgKyBiaW5kKTtcbn1cbiJdfQ==
