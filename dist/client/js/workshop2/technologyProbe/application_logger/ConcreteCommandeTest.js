'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//test par jp
var ConcreteCommandTest = function ConcreteCommandTest(func) {
  _classCallCheck(this, ConcreteCommandTest);

  /* console.log("AAA : " + thefunction);
   this.thefunction = thefunction; */
  var obj = new Object();
  obj.name = func;

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  obj.args = args;
  obj.timestamp = getTimeStamp();
  var jsonString = JSON.stringify(obj);
  console.log("jsonString " + jsonString);
  sendCommandeToServer(jsonString);
  //listCommande.push(obj);
};

function getTimeStamp() {
  var now = new Date();
  return now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear() + " " + now.getHours() + ':' + (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) + ':' + (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
}

var socket = null;

function sendCommandeToServer() {}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbmNyZXRlQ29tbWFuZGVUZXN0LmpzIl0sIm5hbWVzIjpbIkNvbmNyZXRlQ29tbWFuZFRlc3QiLCJmdW5jIiwib2JqIiwiT2JqZWN0IiwibmFtZSIsImFyZ3MiLCJ0aW1lc3RhbXAiLCJnZXRUaW1lU3RhbXAiLCJqc29uU3RyaW5nIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnNvbGUiLCJsb2ciLCJzZW5kQ29tbWFuZGVUb1NlcnZlciIsIm5vdyIsIkRhdGUiLCJnZXRNb250aCIsImdldERhdGUiLCJnZXRGdWxsWWVhciIsImdldEhvdXJzIiwiZ2V0TWludXRlcyIsImdldFNlY29uZHMiLCJzb2NrZXQiXSwibWFwcGluZ3MiOiI7Ozs7QUFHQTtJQUNNQSxtQixHQUdKLDZCQUFZQyxJQUFaLEVBQTZCO0FBQUE7O0FBRTNCOztBQUVBLE1BQUlDLE1BQU0sSUFBSUMsTUFBSixFQUFWO0FBQ0FELE1BQUlFLElBQUosR0FBV0gsSUFBWDs7QUFMMkIsb0NBQVBJLElBQU87QUFBUEEsUUFBTztBQUFBOztBQU0zQkgsTUFBSUcsSUFBSixHQUFXQSxJQUFYO0FBQ0FILE1BQUlJLFNBQUosR0FBZ0JDLGNBQWhCO0FBQ0EsTUFBSUMsYUFBWUMsS0FBS0MsU0FBTCxDQUFlUixHQUFmLENBQWhCO0FBQ0FTLFVBQVFDLEdBQVIsQ0FBWSxnQkFBZ0JKLFVBQTVCO0FBQ0FLLHVCQUFxQkwsVUFBckI7QUFDQTtBQUNELEM7O0FBT0gsU0FBU0QsWUFBVCxHQUF3QjtBQUN0QixNQUFJTyxNQUFNLElBQUlDLElBQUosRUFBVjtBQUNBLFNBQVNELElBQUlFLFFBQUosS0FBaUIsQ0FBbEIsR0FBdUIsR0FBdkIsR0FDTEYsSUFBSUcsT0FBSixFQURLLEdBQ1ksR0FEWixHQUVOSCxJQUFJSSxXQUFKLEVBRk0sR0FFYyxHQUZkLEdBR05KLElBQUlLLFFBQUosRUFITSxHQUdXLEdBSFgsSUFJSkwsSUFBSU0sVUFBSixLQUFtQixFQUFwQixHQUNJLE1BQU1OLElBQUlNLFVBQUosRUFEVixHQUVJTixJQUFJTSxVQUFKLEVBTkMsSUFNb0IsR0FOcEIsSUFPSk4sSUFBSU8sVUFBSixLQUFtQixFQUFwQixHQUNJLE1BQU1QLElBQUlPLFVBQUosRUFEVixHQUVJUCxJQUFJTyxVQUFKLEVBVEMsQ0FBUjtBQVVEOztBQUdELElBQUlDLFNBQVMsSUFBYjs7QUFFQSxTQUFTVCxvQkFBVCxHQUErQixDQUc5QiIsImZpbGUiOiJDb25jcmV0ZUNvbW1hbmRlVGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5cbi8vdGVzdCBwYXIganBcbmNsYXNzIENvbmNyZXRlQ29tbWFuZFRlc3QgIHtcbiAgXG4gIFxuICBjb25zdHJ1Y3RvcihmdW5jICwgLi4uYXJncyApIHtcbiAgXG4gICAgLyogY29uc29sZS5sb2coXCJBQUEgOiBcIiArIHRoZWZ1bmN0aW9uKTtcbiAgICAgdGhpcy50aGVmdW5jdGlvbiA9IHRoZWZ1bmN0aW9uOyAqL1xuICAgIHZhciBvYmogPSBuZXcgT2JqZWN0KCk7XG4gICAgb2JqLm5hbWUgPSBmdW5jO1xuICAgIG9iai5hcmdzID0gYXJncztcbiAgICBvYmoudGltZXN0YW1wID0gZ2V0VGltZVN0YW1wKCk7XG4gICAgdmFyIGpzb25TdHJpbmc9IEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgY29uc29sZS5sb2coXCJqc29uU3RyaW5nIFwiICsganNvblN0cmluZyk7XG4gICAgc2VuZENvbW1hbmRlVG9TZXJ2ZXIoanNvblN0cmluZyk7XG4gICAgLy9saXN0Q29tbWFuZGUucHVzaChvYmopO1xuICB9XG59XG5cblxuXG5cblxuZnVuY3Rpb24gZ2V0VGltZVN0YW1wKCkge1xuICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgcmV0dXJuICgobm93LmdldE1vbnRoKCkgKyAxKSArICcvJyArXG4gICAgKG5vdy5nZXREYXRlKCkpICsgJy8nICtcbiAgICBub3cuZ2V0RnVsbFllYXIoKSArIFwiIFwiICtcbiAgICBub3cuZ2V0SG91cnMoKSArICc6JyArXG4gICAgKChub3cuZ2V0TWludXRlcygpIDwgMTApXG4gICAgICA/IChcIjBcIiArIG5vdy5nZXRNaW51dGVzKCkpXG4gICAgICA6IChub3cuZ2V0TWludXRlcygpKSkgKyAnOicgK1xuICAgICgobm93LmdldFNlY29uZHMoKSA8IDEwKVxuICAgICAgPyAoXCIwXCIgKyBub3cuZ2V0U2Vjb25kcygpKVxuICAgICAgOiAobm93LmdldFNlY29uZHMoKSkpKTtcbn1cblxuXG52YXIgc29ja2V0ID0gbnVsbDtcblxuZnVuY3Rpb24gc2VuZENvbW1hbmRlVG9TZXJ2ZXIoKXtcblxuXG59Il19