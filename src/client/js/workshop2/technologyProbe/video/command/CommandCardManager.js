var CommandPlayPause = function (execute, undo) {
    this.execute = execute;
    this.undo = undo;
    this.timestamp = timestamp();
    this.id = createUniqueId();
};

var CommandMuteButton = function (execute, undo) {
  this.execute = execute;
  this.undo = undo;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};
