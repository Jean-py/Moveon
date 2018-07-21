
//Script permettant d'appeler mes differents scripts
//TODO ne marche pas pour l'instant

var cardManagement = require('/src/client/js/workshop2/cardManagement.js');
var longpress = require('/src/client/js/workshop2/long-press.min.js');
var videoCommand = require('/src/client/js/workshop2/videoCommand.js');

if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)){
  
  var stateMachineDragAndDropSliderTablet = require('/src/client/js/workshop2/stateMachineDragAndDropSliderTablet.js');
} else {
  var stateMachineDragAndDropSlider = require('/src/client/js/workshop2/stateMachineDragAndDropSlider.js');
}

