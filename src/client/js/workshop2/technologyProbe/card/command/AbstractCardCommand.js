


var ModifyCardDescriptionCommand = function (card,text) {
  return new CommandModifyCardDescription(modifyCardDescription , null, card,text);
};

var PlayCardCommand = function (card) {
  return new CommandPlayCard(playCard, null, card);
};




var CardNbRepetCommand = function (card,repetitionNumber) {
  return new CommandModifCardNbRepet(modifyCardNbRepet, null, card , repetitionNumber);
};

var CardSpeedCommand = function (card,speed) {
  return new CommandModifCardSpeed(modifyCardSpeed, null, card, speed );
};
