
//This function create a new object command (following the template given in Command).
//This function contains the function to execute, the undo function, and the parameters
var CreateNewCardCommand = function (startP, endP) {
  return new CommandCreateCard(createNewCard, deleteCard, startP, endP);
};

var DeleteCardCommand = function (card) {
  return new CommandDeleteCard(deleteCard, addingNewCard, card );
};