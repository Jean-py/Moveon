var CommandCreateCard = function (execute, undo, startP, endP) {
    this.execute = execute;
    this.undo = undo;
    this.startP = startP;
    this.endP = endP;
    this.timestamp = timestamp();
    this.id = createUniqueId();
};

var CommandDeleteCard = function (execute, undo, card) {
  this.execute = execute;
  this.undo = undo;
  this.card = card;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};
  
  
