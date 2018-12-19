var CommandPlay = function (execute,undo) {
  this.execute = execute;
  this.undo = null;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

var CommandPause = function (execute,undo) {
  this.execute = execute;
  this.undo = null;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

var CommandMuteButton = function (execute,undo) {
  this.execute = execute;
  this.undo = null;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

//TODO Should I add the div of the card clicked?
var CommandRepetPartOfVideo = function (execute,undo, start,end, numberOfRepetition,speedRate) {
  this.execute = execute
  this.undo = null;
  this.start = start;
  this.end = end;
  this.numberOfRepetition = numberOfRepetition;
  this.speedRate = speedRate;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

var CommandUpdateKnobAndVideoComputer = function (execute,undo,e) {
  this.execute = execute;
  this.undo = null;
  this.e = e;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

