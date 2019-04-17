var CommandModifyCardDescription = function (execute,undo, card,text) {
    this.execute = execute;
    this.undo = null;
    this.text = text;
    this.card = card;
    console.log("DDD");
    console.log(text);
    this.timestamp = timestamp();
    this.id = createUniqueId();
};

var CommandPlayCard = function (execute,undo,card) {
  this.execute = execute;
  this.undo = null;
  this.card = card;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

var CommandModifCardNbRepet = function (execute,undo,card,repetitionNumber) {
  this.execute = execute;
  this.undo = null;
  this.card = card;
  this.nbRepet = repetitionNumber;
  console.log(repetitionNumber);
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

var CommandModifCardSpeed = function (execute,undo,card, speed) {
  this.execute = execute;
  this.undo = null;
  this.card = card;
  this.speed = speed;
  console.log("CCC");
  console.log(speed);
  this.timestamp = timestamp();
  this.id = createUniqueId();
};
