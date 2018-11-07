
var PlayPauseCommand = function () {
  return new CommandPlayPause(playPausecallback, null);
};

var MuteButtonCommand = function () {
  return new CommandMuteButton(muteButtonCallback, null);
};
