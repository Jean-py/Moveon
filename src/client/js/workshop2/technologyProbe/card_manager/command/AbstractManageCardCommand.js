
//This function create a new object command (following the template given in Command).
//This function contains the function to execute, the undo function, and the parameters
var CreateNewCardCommand = function (card) {
  return new CommandCreateCard(addingNewCard, deleteCard, card);
};

var DeleteCardCommand = function (card) {
  return new CommandDeleteCard(deleteCard, null, card );
};


var SaveLogCommand = function () {
  return new CommandSaveLog(addingNewCardsFromJSon, null );
};

var LoadLogCommand = function (log) {
  return new CommandLoadLog(loadJSON,  null , log );
};

var CleanSegmentHistoryCommand = function () {
  return new CommandCleanSegmentHistory(cleanSegmentHistory,  null  );
};