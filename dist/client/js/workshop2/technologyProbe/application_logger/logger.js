"use strict";

// log helper

var socket = null;
var port = 8000;
var socket_name_session = "dev";

var Logger = function Logger() {
  return {
    //Connect to the server
    connect: function connect() {
      connectToServer();
    },
    //Change the user's name (of the socket)
    changeUsernameSocket: function changeUsernameSocket(username) {
      send_username(username);
    },
    //Send a command to the server and the server logs it
    sendAndLogCommand: function sendAndLogCommand(command) {
      log_command(command);
    },
    saveSH: function saveSH(SH) {
      _saveSH(SH);
    },
    getSocket_name_session: function getSocket_name_session() {
      return _getSocket_name_session();
    }

  };
};

function _getSocket_name_session() {
  return socket_name_session;
}

function connectToServer() {
  console.log("testing connect to server...");
  var addr = document.URL;
  //Split the https://xxxx:port#oNote  to xxxx:port
  addr = addr.split('/')[2];
  console.log("connect to : " + addr);
  socket = io.connect(addr);
  console.log("changing username socket to dev");
  logger.changeUsernameSocket("dev");
};

function send_username(username) {
  if (socket != null) {
    //console.log("username val : " + username);
    socket_name_session = username;
    socket.emit("socket_username", { username: username });
  }
};

//TODO faire une deep recopies des objets passé en parametre!
function log_command(commandParam) {
  console.log("executing : ");
  console.log(commandParam);
  if (socket != null) {
    var objCopy = null;

    //We have to log an event, if so, it's a circular reference and need to be treated as well
    if (commandParam.e !== undefined) {
      //console.log("OK --- " ) ;
      //console.log(commandParam.e.pageX) ;

      var mouse_event = { mouseEvent: { pageX: commandParam.e.pageX, pageY: commandParam.e.pageY } };

      //const o2 = { y: commandParam.e.pageY};
      objCopy = Object.assign({}, commandParam);
      objCopy = Object.assign(commandParam, mouse_event);
      objCopy.e = undefined;
    } else {
      objCopy = Object.assign({}, commandParam);
    }

    //console.log("*** LOGGER : log_command ***" );
    if (socket_name_session !== null) {
      send_username(socket_name_session);
    }
    objCopy.execute = objCopy.execute.name;
    if (objCopy.undo != null) {
      objCopy.undo = objCopy.undo.name;
    }

    socket.emit("log_command", objCopy);
    return true;
  }
  return false;
};

function _saveSH(SH) {
  if (socket != null) {

    if (socket_name_session !== null) {
      send_username(socket_name_session);
    }
    socket.emit("saveSH", SH);
    return true;
  }
  return false;
};

//Stringify an object, if the object contain a function,
// /!\ it convert the body of the function into text
var stringify = function stringify(obj, prop) {
  var placeholder = '____PLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') {
      fns.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift();
  });
  return json + ';';
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci5qcyJdLCJuYW1lcyI6WyJzb2NrZXQiLCJwb3J0Iiwic29ja2V0X25hbWVfc2Vzc2lvbiIsIkxvZ2dlciIsImNvbm5lY3QiLCJjb25uZWN0VG9TZXJ2ZXIiLCJjaGFuZ2VVc2VybmFtZVNvY2tldCIsInVzZXJuYW1lIiwic2VuZF91c2VybmFtZSIsInNlbmRBbmRMb2dDb21tYW5kIiwiY29tbWFuZCIsImxvZ19jb21tYW5kIiwic2F2ZVNIIiwiU0giLCJnZXRTb2NrZXRfbmFtZV9zZXNzaW9uIiwiY29uc29sZSIsImxvZyIsImFkZHIiLCJkb2N1bWVudCIsIlVSTCIsInNwbGl0IiwiaW8iLCJsb2dnZXIiLCJlbWl0IiwiY29tbWFuZFBhcmFtIiwib2JqQ29weSIsImUiLCJ1bmRlZmluZWQiLCJtb3VzZV9ldmVudCIsIm1vdXNlRXZlbnQiLCJwYWdlWCIsInBhZ2VZIiwiT2JqZWN0IiwiYXNzaWduIiwiZXhlY3V0ZSIsIm5hbWUiLCJ1bmRvIiwic3RyaW5naWZ5Iiwib2JqIiwicHJvcCIsInBsYWNlaG9sZGVyIiwiZm5zIiwianNvbiIsIkpTT04iLCJrZXkiLCJ2YWx1ZSIsInB1c2giLCJyZXBsYWNlIiwiUmVnRXhwIiwiXyIsInNoaWZ0Il0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUVBLElBQUlBLFNBQVMsSUFBYjtBQUNBLElBQUlDLE9BQU8sSUFBWDtBQUNBLElBQUlDLHNCQUFzQixLQUExQjs7QUFFQSxJQUFJQyxTQUFTLFNBQVRBLE1BQVMsR0FBVztBQUN0QixTQUFPO0FBQ0w7QUFDQUMsYUFBUyxtQkFBVTtBQUNqQkM7QUFDRCxLQUpJO0FBS0w7QUFDQUMsMEJBQXNCLDhCQUFTQyxRQUFULEVBQW1CO0FBQ3ZDQyxvQkFBY0QsUUFBZDtBQUNELEtBUkk7QUFTTDtBQUNBRSx1QkFBbUIsMkJBQVNDLE9BQVQsRUFBa0I7QUFDbkNDLGtCQUFZRCxPQUFaO0FBQ0QsS0FaSTtBQWFMRSxZQUFRLGdCQUFTQyxFQUFULEVBQWE7QUFDbkJELGNBQU9D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QixFQUFpQztBQUMvQkosVUFBSUssSUFBSixDQUFTRCxLQUFUO0FBQ0EsYUFBT0wsV0FBUDtBQUNEO0FBQ0QsV0FBT0ssS0FBUDtBQUNELEdBTlUsRUFNUixDQU5RLENBQVg7QUFPQUgsU0FBT0EsS0FBS0ssT0FBTCxDQUFhLElBQUlDLE1BQUosQ0FBVyxNQUFNUixXQUFOLEdBQW9CLEdBQS9CLEVBQW9DLEdBQXBDLENBQWIsRUFBdUQsVUFBU1MsQ0FBVCxFQUFZO0FBQ3hFLFdBQU9SLElBQUlTLEtBQUosRUFBUDtBQUNELEdBRk0sQ0FBUDtBQUdBLFNBQVFSLE9BQU8sR0FBZjtBQUNELENBZEQiLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbG9nIGhlbHBlclxuXG52YXIgc29ja2V0ID0gbnVsbDtcbnZhciBwb3J0ID0gODAwMDtcbnZhciBzb2NrZXRfbmFtZV9zZXNzaW9uID0gXCJkZXZcIjtcblxudmFyIExvZ2dlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIC8vQ29ubmVjdCB0byB0aGUgc2VydmVyXG4gICAgY29ubmVjdDogZnVuY3Rpb24oKXtcbiAgICAgIGNvbm5lY3RUb1NlcnZlcigpO1xuICAgIH0sXG4gICAgLy9DaGFuZ2UgdGhlIHVzZXIncyBuYW1lIChvZiB0aGUgc29ja2V0KVxuICAgIGNoYW5nZVVzZXJuYW1lU29ja2V0OiBmdW5jdGlvbih1c2VybmFtZSkge1xuICAgICAgc2VuZF91c2VybmFtZSh1c2VybmFtZSk7XG4gICAgfSxcbiAgICAvL1NlbmQgYSBjb21tYW5kIHRvIHRoZSBzZXJ2ZXIgYW5kIHRoZSBzZXJ2ZXIgbG9ncyBpdFxuICAgIHNlbmRBbmRMb2dDb21tYW5kOiBmdW5jdGlvbihjb21tYW5kKSB7XG4gICAgICBsb2dfY29tbWFuZChjb21tYW5kKTtcbiAgICB9LFxuICAgIHNhdmVTSDogZnVuY3Rpb24oU0gpIHtcbiAgICAgIHNhdmVTSChTSCk7XG4gICAgfSxcbiAgICBnZXRTb2NrZXRfbmFtZV9zZXNzaW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZ2V0U29ja2V0X25hbWVfc2Vzc2lvbigpO1xuICAgIH1cbiAgICBcbiAgICBcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0U29ja2V0X25hbWVfc2Vzc2lvbigpe1xuICByZXR1cm4gc29ja2V0X25hbWVfc2Vzc2lvbjtcbn1cblxuXG5cblxuXG5cblxuZnVuY3Rpb24gY29ubmVjdFRvU2VydmVyKCkge1xuICBjb25zb2xlLmxvZyhcInRlc3RpbmcgY29ubmVjdCB0byBzZXJ2ZXIuLi5cIik7XG4gIHZhciBhZGRyID0gZG9jdW1lbnQuVVJMO1xuICAvL1NwbGl0IHRoZSBodHRwczovL3h4eHg6cG9ydCNvTm90ZSAgdG8geHh4eDpwb3J0XG4gIGFkZHIgPSBhZGRyLnNwbGl0KCcvJylbMl07XG4gIGNvbnNvbGUubG9nKFwiY29ubmVjdCB0byA6IFwiICsgYWRkcik7XG4gIHNvY2tldCA9IGlvLmNvbm5lY3QoYWRkcik7XG4gIGNvbnNvbGUubG9nKFwiY2hhbmdpbmcgdXNlcm5hbWUgc29ja2V0IHRvIGRldlwiKTtcbiAgbG9nZ2VyLmNoYW5nZVVzZXJuYW1lU29ja2V0KFwiZGV2XCIpO1xufTtcblxuXG5cbmZ1bmN0aW9uIHNlbmRfdXNlcm5hbWUodXNlcm5hbWUpIHtcbiAgaWYoc29ja2V0ICE9IG51bGwpe1xuICAgIC8vY29uc29sZS5sb2coXCJ1c2VybmFtZSB2YWwgOiBcIiArIHVzZXJuYW1lKTtcbiAgICBzb2NrZXRfbmFtZV9zZXNzaW9uID0gdXNlcm5hbWU7XG4gICAgc29ja2V0LmVtaXQoXCJzb2NrZXRfdXNlcm5hbWVcIiwge3VzZXJuYW1lIDogdXNlcm5hbWV9KVxuICB9XG59O1xuXG4vL1RPRE8gZmFpcmUgdW5lIGRlZXAgcmVjb3BpZXMgZGVzIG9iamV0cyBwYXNzw6kgZW4gcGFyYW1ldHJlIVxuZnVuY3Rpb24gbG9nX2NvbW1hbmQoY29tbWFuZFBhcmFtKXtcbiAgY29uc29sZS5sb2coXCJleGVjdXRpbmcgOiBcIik7XG4gIGNvbnNvbGUubG9nKGNvbW1hbmRQYXJhbSk7XG4gIGlmKHNvY2tldCAhPSBudWxsKXtcbiAgICB2YXIgb2JqQ29weSA9IG51bGw7XG4gICAgXG4gICAgLy9XZSBoYXZlIHRvIGxvZyBhbiBldmVudCwgaWYgc28sIGl0J3MgYSBjaXJjdWxhciByZWZlcmVuY2UgYW5kIG5lZWQgdG8gYmUgdHJlYXRlZCBhcyB3ZWxsXG4gICAgaWYgKGNvbW1hbmRQYXJhbS5lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJPSyAtLS0gXCIgKSA7XG4gICAgICAvL2NvbnNvbGUubG9nKGNvbW1hbmRQYXJhbS5lLnBhZ2VYKSA7XG4gICAgICBcbiAgICAgIGNvbnN0IG1vdXNlX2V2ZW50ID0ge21vdXNlRXZlbnQgOiB7cGFnZVg6IGNvbW1hbmRQYXJhbS5lLnBhZ2VYLCBwYWdlWTogY29tbWFuZFBhcmFtLmUucGFnZVl9fTtcbiAgICAgIFxuICAgICAgLy9jb25zdCBvMiA9IHsgeTogY29tbWFuZFBhcmFtLmUucGFnZVl9O1xuICAgICAgIG9iakNvcHkgPSBPYmplY3QuYXNzaWduKHt9LCBjb21tYW5kUGFyYW0pO1xuICAgICAgIG9iakNvcHkgPSBPYmplY3QuYXNzaWduKGNvbW1hbmRQYXJhbSwgbW91c2VfZXZlbnQpO1xuICAgICAgIG9iakNvcHkuZSA9IHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgIG9iakNvcHkgPSBPYmplY3QuYXNzaWduKHt9LCBjb21tYW5kUGFyYW0pO1xuICAgIH1cbiAgXG4gICAgXG4gICAgXG4gICAgLy9jb25zb2xlLmxvZyhcIioqKiBMT0dHRVIgOiBsb2dfY29tbWFuZCAqKipcIiApO1xuICAgIGlmKHNvY2tldF9uYW1lX3Nlc3Npb24gIT09IG51bGwgKXtcbiAgICAgIHNlbmRfdXNlcm5hbWUoc29ja2V0X25hbWVfc2Vzc2lvbik7XG4gICAgfVxuICAgIG9iakNvcHkuZXhlY3V0ZSA9IG9iakNvcHkuZXhlY3V0ZS5uYW1lO1xuICAgIGlmKG9iakNvcHkudW5kbyAhPSBudWxsKXtcbiAgICAgIG9iakNvcHkudW5kbyA9IG9iakNvcHkudW5kby5uYW1lO1xuICAgIH1cblxuICAgIHNvY2tldC5lbWl0KFwibG9nX2NvbW1hbmRcIiwgb2JqQ29weSk7XG4gICAgcmV0dXJuIHRydWU7XG4gICAgXG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG5cbmZ1bmN0aW9uIHNhdmVTSChTSCl7XG4gIGlmKHNvY2tldCAhPSBudWxsKXtcblxuICAgIGlmKHNvY2tldF9uYW1lX3Nlc3Npb24gIT09IG51bGwgKXtcbiAgICAgIHNlbmRfdXNlcm5hbWUoc29ja2V0X25hbWVfc2Vzc2lvbik7XG4gICAgfVxuICAgIHNvY2tldC5lbWl0KFwic2F2ZVNIXCIsIFNIKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgICBcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cblxuXG4vL1N0cmluZ2lmeSBhbiBvYmplY3QsIGlmIHRoZSBvYmplY3QgY29udGFpbiBhIGZ1bmN0aW9uLFxuLy8gLyFcXCBpdCBjb252ZXJ0IHRoZSBib2R5IG9mIHRoZSBmdW5jdGlvbiBpbnRvIHRleHRcbnZhciBzdHJpbmdpZnkgPSBmdW5jdGlvbihvYmosIHByb3ApIHtcbiAgdmFyIHBsYWNlaG9sZGVyID0gJ19fX19QTEFDRUhPTERFUl9fX18nO1xuICB2YXIgZm5zID0gW107XG4gIHZhciBqc29uID0gSlNPTi5zdHJpbmdpZnkob2JqLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZm5zLnB1c2godmFsdWUpO1xuICAgICAgcmV0dXJuIHBsYWNlaG9sZGVyO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH0sIDIpO1xuICBqc29uID0ganNvbi5yZXBsYWNlKG5ldyBSZWdFeHAoJ1wiJyArIHBsYWNlaG9sZGVyICsgJ1wiJywgJ2cnKSwgZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBmbnMuc2hpZnQoKTtcbiAgfSk7XG4gIHJldHVybiAganNvbiArICc7Jztcbn07XG5cblxuIl19