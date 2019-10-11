
var PlayCommand = function () {
  return new CommandPlay(play, null);
};


var PauseCommand = function () {
  return new CommandPause(pause, null);
};

var MuteButtonCommand = function () {
  return new CommandMuteButton(muteButtonCallback, null);
};

var RepetPartOfVideoCommand = function (start,end, numberOfRepetition,speedRate) {
  return new CommandRepetPartOfVideo(repetPartOfVideo, null, start,end, numberOfRepetition, speedRate);
};
