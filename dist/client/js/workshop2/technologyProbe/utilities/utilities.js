'use strict';

// log helper
var logger = new Logger();
logger.connect();

function kill(type) {
  window.document.body.addEventListener(type, function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);
}

function createUniqueId() {
  var date = new Date();
  var components = [date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
  return components.join("");
}

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllcy5qcyJdLCJuYW1lcyI6WyJsb2dnZXIiLCJMb2dnZXIiLCJjb25uZWN0Iiwia2lsbCIsInR5cGUiLCJ3aW5kb3ciLCJkb2N1bWVudCIsImJvZHkiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiY3JlYXRlVW5pcXVlSWQiLCJkYXRlIiwiRGF0ZSIsImNvbXBvbmVudHMiLCJnZXRNb250aCIsImdldERhdGUiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwiZ2V0TWlsbGlzZWNvbmRzIiwiam9pbiIsInRpbWVzdGFtcCIsImQiLCJ0aW1lIiwicGFkIiwibW9udGhzIiwibiIsInRvU3RyaW5nIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0EsSUFBSUEsU0FBUyxJQUFJQyxNQUFKLEVBQWI7QUFDQUQsT0FBT0UsT0FBUDs7QUFFQSxTQUFTQyxJQUFULENBQWNDLElBQWQsRUFBbUI7QUFDakJDLFNBQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCQyxnQkFBckIsQ0FBc0NKLElBQXRDLEVBQTRDLFVBQVNLLENBQVQsRUFBVztBQUNyREEsTUFBRUMsY0FBRjtBQUNBRCxNQUFFRSxlQUFGO0FBQ0EsV0FBTyxLQUFQO0FBQ0QsR0FKRCxFQUlHLElBSkg7QUFLRDs7QUFHRCxTQUFTQyxjQUFULEdBQXlCO0FBQ3ZCLE1BQUlDLE9BQU8sSUFBSUMsSUFBSixFQUFYO0FBQ0EsTUFBSUMsYUFBYSxDQUNmRixLQUFLRyxRQUFMLEVBRGUsRUFFZkgsS0FBS0ksT0FBTCxFQUZlLEVBR2ZKLEtBQUtLLFFBQUwsRUFIZSxFQUlmTCxLQUFLTSxVQUFMLEVBSmUsRUFLZk4sS0FBS08sVUFBTCxFQUxlLEVBTWZQLEtBQUtRLGVBQUwsRUFOZSxDQUFqQjtBQVFBLFNBQU9OLFdBQVdPLElBQVgsQ0FBZ0IsRUFBaEIsQ0FBUDtBQUNEOztBQUVELFNBQVNDLFNBQVQsR0FBcUI7QUFDbkIsTUFBSUMsSUFBSSxJQUFJVixJQUFKLEVBQVI7QUFDQSxNQUFJVyxPQUFPLENBQUNDLElBQUlGLEVBQUVOLFFBQUYsRUFBSixDQUFELEVBQ1RRLElBQUlGLEVBQUVMLFVBQUYsRUFBSixDQURTLEVBRVRPLElBQUlGLEVBQUVKLFVBQUYsRUFBSixDQUZTLEVBRVlFLElBRlosQ0FFaUIsR0FGakIsQ0FBWDtBQUdBLFNBQU8sQ0FBQ0UsRUFBRVAsT0FBRixFQUFELEVBQWNVLE9BQU9ILEVBQUVSLFFBQUYsRUFBUCxDQUFkLEVBQW9DUyxJQUFwQyxFQUEwQ0gsSUFBMUMsQ0FBK0MsR0FBL0MsQ0FBUDtBQUNEOztBQUdELFNBQVNJLEdBQVQsQ0FBYUUsQ0FBYixFQUFnQjtBQUNkLFNBQU9BLElBQUksRUFBSixTQUFhQSxFQUFFQyxRQUFGLENBQVcsRUFBWCxDQUFiLEdBQWdDRCxFQUFFQyxRQUFGLENBQVcsRUFBWCxDQUF2QztBQUNEOztBQUVELElBQU1GLFNBQVMsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsRUFBc0IsS0FBdEIsRUFBNkIsS0FBN0IsRUFBb0MsS0FBcEMsRUFBMkMsS0FBM0MsRUFBa0QsS0FBbEQsRUFBeUQsS0FBekQsRUFDYixLQURhLEVBQ04sS0FETSxFQUNDLEtBREQsQ0FBZiIsImZpbGUiOiJ1dGlsaXRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsb2cgaGVscGVyXG52YXIgbG9nZ2VyID0gbmV3IExvZ2dlcigpO1xubG9nZ2VyLmNvbm5lY3QoKTtcblxuZnVuY3Rpb24ga2lsbCh0eXBlKXtcbiAgd2luZG93LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sIHRydWUpO1xufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZVVuaXF1ZUlkKCl7XG4gIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgdmFyIGNvbXBvbmVudHMgPSBbXG4gICAgZGF0ZS5nZXRNb250aCgpLFxuICAgIGRhdGUuZ2V0RGF0ZSgpLFxuICAgIGRhdGUuZ2V0SG91cnMoKSxcbiAgICBkYXRlLmdldE1pbnV0ZXMoKSxcbiAgICBkYXRlLmdldFNlY29uZHMoKSxcbiAgICBkYXRlLmdldE1pbGxpc2Vjb25kcygpXG4gIF07XG4gIHJldHVybiBjb21wb25lbnRzLmpvaW4oXCJcIik7XG59XG5cbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gYDAke24udG9TdHJpbmcoMTApfWAgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuY29uc3QgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICdPY3QnLCAnTm92JywgJ0RlYyddOyJdfQ==