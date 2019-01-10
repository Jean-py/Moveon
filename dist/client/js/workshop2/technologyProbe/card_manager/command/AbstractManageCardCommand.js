"use strict";

//This function create a new object command (following the template given in Command).
//This function contains the function to execute, the undo function, and the parameters
var CreateNewCardCommand = function CreateNewCardCommand(card) {
  return new CommandCreateCard(addingNewCard, deleteCard, card);
};

var DeleteCardCommand = function DeleteCardCommand(card) {
  return new CommandDeleteCard(deleteCard, addingNewCard, card);
};

var SaveLogCommand = function SaveLogCommand() {
  return new CommandSaveLog(addingNewCardsFromJSon, null);
};

var LoadLogCommand = function LoadLogCommand(log) {
  return new CommandLoadLog(loadJSON, null, log);
};

var CleanSegmentHistoryCommand = function CleanSegmentHistoryCommand() {
  return new CommandCleanSegmentHistory(cleanSegmentHistory, null);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFic3RyYWN0TWFuYWdlQ2FyZENvbW1hbmQuanMiXSwibmFtZXMiOlsiQ3JlYXRlTmV3Q2FyZENvbW1hbmQiLCJjYXJkIiwiQ29tbWFuZENyZWF0ZUNhcmQiLCJhZGRpbmdOZXdDYXJkIiwiZGVsZXRlQ2FyZCIsIkRlbGV0ZUNhcmRDb21tYW5kIiwiQ29tbWFuZERlbGV0ZUNhcmQiLCJTYXZlTG9nQ29tbWFuZCIsIkNvbW1hbmRTYXZlTG9nIiwiYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbiIsIkxvYWRMb2dDb21tYW5kIiwibG9nIiwiQ29tbWFuZExvYWRMb2ciLCJsb2FkSlNPTiIsIkNsZWFuU2VnbWVudEhpc3RvcnlDb21tYW5kIiwiQ29tbWFuZENsZWFuU2VnbWVudEhpc3RvcnkiLCJjbGVhblNlZ21lbnRIaXN0b3J5Il0sIm1hcHBpbmdzIjoiOztBQUNBO0FBQ0E7QUFDQSxJQUFJQSx1QkFBdUIsU0FBdkJBLG9CQUF1QixDQUFVQyxJQUFWLEVBQWdCO0FBQ3pDLFNBQU8sSUFBSUMsaUJBQUosQ0FBc0JDLGFBQXRCLEVBQXFDQyxVQUFyQyxFQUFpREgsSUFBakQsQ0FBUDtBQUNELENBRkQ7O0FBSUEsSUFBSUksb0JBQW9CLFNBQXBCQSxpQkFBb0IsQ0FBVUosSUFBVixFQUFnQjtBQUN0QyxTQUFPLElBQUlLLGlCQUFKLENBQXNCRixVQUF0QixFQUFrQ0QsYUFBbEMsRUFBaURGLElBQWpELENBQVA7QUFDRCxDQUZEOztBQUtBLElBQUlNLGlCQUFpQixTQUFqQkEsY0FBaUIsR0FBWTtBQUMvQixTQUFPLElBQUlDLGNBQUosQ0FBbUJDLHNCQUFuQixFQUEyQyxJQUEzQyxDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxJQUFJQyxpQkFBaUIsU0FBakJBLGNBQWlCLENBQVVDLEdBQVYsRUFBZTtBQUNsQyxTQUFPLElBQUlDLGNBQUosQ0FBbUJDLFFBQW5CLEVBQThCLElBQTlCLEVBQXFDRixHQUFyQyxDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxJQUFJRyw2QkFBNkIsU0FBN0JBLDBCQUE2QixHQUFZO0FBQzNDLFNBQU8sSUFBSUMsMEJBQUosQ0FBK0JDLG1CQUEvQixFQUFxRCxJQUFyRCxDQUFQO0FBQ0QsQ0FGRCIsImZpbGUiOiJBYnN0cmFjdE1hbmFnZUNhcmRDb21tYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vL1RoaXMgZnVuY3Rpb24gY3JlYXRlIGEgbmV3IG9iamVjdCBjb21tYW5kIChmb2xsb3dpbmcgdGhlIHRlbXBsYXRlIGdpdmVuIGluIENvbW1hbmQpLlxuLy9UaGlzIGZ1bmN0aW9uIGNvbnRhaW5zIHRoZSBmdW5jdGlvbiB0byBleGVjdXRlLCB0aGUgdW5kbyBmdW5jdGlvbiwgYW5kIHRoZSBwYXJhbWV0ZXJzXG52YXIgQ3JlYXRlTmV3Q2FyZENvbW1hbmQgPSBmdW5jdGlvbiAoY2FyZCkge1xuICByZXR1cm4gbmV3IENvbW1hbmRDcmVhdGVDYXJkKGFkZGluZ05ld0NhcmQsIGRlbGV0ZUNhcmQsIGNhcmQpO1xufTtcblxudmFyIERlbGV0ZUNhcmRDb21tYW5kID0gZnVuY3Rpb24gKGNhcmQpIHtcbiAgcmV0dXJuIG5ldyBDb21tYW5kRGVsZXRlQ2FyZChkZWxldGVDYXJkLCBhZGRpbmdOZXdDYXJkLCBjYXJkICk7XG59O1xuXG5cbnZhciBTYXZlTG9nQ29tbWFuZCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG5ldyBDb21tYW5kU2F2ZUxvZyhhZGRpbmdOZXdDYXJkc0Zyb21KU29uLCBudWxsICk7XG59O1xuXG52YXIgTG9hZExvZ0NvbW1hbmQgPSBmdW5jdGlvbiAobG9nKSB7XG4gIHJldHVybiBuZXcgQ29tbWFuZExvYWRMb2cobG9hZEpTT04sICBudWxsICwgbG9nICk7XG59O1xuXG52YXIgQ2xlYW5TZWdtZW50SGlzdG9yeUNvbW1hbmQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgQ29tbWFuZENsZWFuU2VnbWVudEhpc3RvcnkoY2xlYW5TZWdtZW50SGlzdG9yeSwgIG51bGwgICk7XG59OyJdfQ==