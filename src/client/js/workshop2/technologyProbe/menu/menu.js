var menu = document.getElementById("containerMenu");
var bar1 = document.getElementById("bar1id");
var bar2 = document.getElementById("bar2id");
var bar3 = document.getElementById("bar3id");
var menuOption = document.getElementById("menuOptionId");
var sidebarMenu = document.getElementById("sidebarMenu");
var noteMessage = document.getElementById("noteMessage");
var idSession = document.getElementById("idSession");
var btnLoadFile = document.getElementById("btnLoadFile");
var inputFile = document.getElementById('logFileLoad');
var btnCleanAll = document.getElementById('btnCleanAll');
var btnLoadYtVideo = document.getElementById('loadYtVideo');
var btnSaveSegments = document.getElementById('btnSaveSegments');
var btnInvertVideo = document.getElementById('btnInvertVideo');
var btnLoadAVideo = document.getElementById('btnLoadAVideo');
var btnLoadSHFromServer = document.getElementById('btnLoadSHFromServer');

//var dataAnalyst = DataAnalyst;

var btnloadSH1 = document.getElementById('loadSHvideo1');
var btnloadSH2 = document.getElementById('loadSHvideo2');
var btnloadSHTuto = document.getElementById('loadSHvideoTutorial');
var btnloadVideo1 = document.getElementById('loadvideo1');
var btnloadVideo2 = document.getElementById('loadvideo2');
var btnAnalyzeData = document.getElementById('analyzeData');



var menuExtended = 0;

//menuOption.innerHTML = "Username : " + logger.getSocket_name_session();

idSession.value = logger.getSocket_name_session();

inputFile.addEventListener('change', updateImageDisplay);

btnLoadFile.addEventListener("mousedown", function (e) {
    //emulating a click on a file picking
    inputFile.click();
  }, {
  passive: true
});



function updateImageDisplay() {
  var curFiles = inputFile.files;
  console.log(curFiles);
  cardManager.execute(new LoadLogCommand(curFiles));
  var notification_feedback = "File imported !";
  notificationFeedback(notification_feedback)
}


menu.addEventListener("mousedown", handleMenu, {
  passive: true
});

if(btnLoadYtVideo !== null)
  btnLoadYtVideo.addEventListener("mousedown", callbackLoadYtVideo);

btnCleanAll.addEventListener("mousedown", callbackCleanSegmentHistory);

btnSaveSegments.addEventListener("mousedown", callbackSaveFile);

if(btnloadSH1 !== null)
  btnloadSH1.addEventListener("mousedown", loadSH1 );
if(btnLoadSHFromServer !== null)
  btnLoadSHFromServer.addEventListener("mousedown", LoadSHFromServer );

if(btnloadSH2 !== null)
  btnloadSH2.addEventListener("mousedown", loadSH2);
if(btnloadSHTuto !== null)
  btnloadSHTuto.addEventListener("mousedown", loadSHTuto);
if(btnloadVideo1 !== null)
  btnloadVideo1.addEventListener("mousedown", loadVideo1);
if(btnloadVideo2 !== null)
  btnloadVideo2.addEventListener("mousedown", loadVideo2);
if(btnAnalyzeData !== null)
  btnAnalyzeData.addEventListener("mousedown", analyzeData);

if(btnInvertVideo !== null)
  btnInvertVideo.addEventListener("mousedown", invertVideo) ;
if(btnLoadAVideo !== null)
  btnLoadAVideo.addEventListener("mousedown", loadVideo) ;


idSession.addEventListener("blur",setSessionName, {passive: true});
function setSessionName(){
   logger.changeUsernameSocket( idSession.value );
   var notification_feedback = "Sucess! Log file is : " + idSession.value;
    notificationFeedback(notification_feedback);
}

function callbackCleanSegmentHistory(){
  if ( confirm( " /!\\ Voulez-vous vraiment supprimer tous les segments?" ) ) {
    // Code à éxécuter si le l'utilisateur clique sur "OK"
    var notification_feedback = "Clean all success";
    notificationFeedback(notification_feedback);
    cardManager.execute(new CleanSegmentHistoryCommand());
    // Code à éxécuter si l'utilisateur clique sur "Annuler"
  } else {
    var notification_feedback = "Not confirmed!";
    notificationFeedback(notification_feedback);
  }
}

function callbackSaveFile(){
  console.log("saving log");
  /*arrayCard.forEach(function (arrayItem) {
    // arrayItem.updateInfo();
    //arrayItem.
  });*/
  cardManager.exportCard();
  var notification_feedback = "File saved : " + idSession.value;
  notificationFeedback(notification_feedback);
}

function callbackLoadYtVideo(){

}

function handleMenu(){
  menu.classList.toggle("change");
  //sidebarMenu.classList.toggle("appearMenuSidebar");
  if(menuExtended){
    menuExtended = 0;
    sidebarMenu.style.visibility = 'hidden';     // Show
  } else {
    sidebarMenu.style.visibility = 'visible';      // Hide
    menuExtended = 1;
  }
}

function notificationFeedback(notification_message){
  window.location = "#oNote4";
  noteMessage.innerHTML = notification_message;
  setTimeout(function() {window.location = "#oNote";}, 2500);
}

// Get the modal
var modal = document.getElementById('modalYT');
var modalVideo = document.getElementById('videoPickerOverview');
var modalLoadSH = document.getElementById('SHPickerOverview');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var spanSH = document.getElementsByClassName("close")[1];

// When the user clicks the button, open the modal
if(btnLoadYtVideo !== null){
  btnLoadYtVideo.onclick = function() {
    modal.style.display = "block";
  };
}


// When the user clicks on <span> (x), close the modal
span.addEventListener( "mousedown" , function() {
  modal.style.display = "none";
});
span.addEventListener( "mousedown" , function() {
  modalVideo.style.display = "none";
});
spanSH.addEventListener( "mousedown" , function() {
  modalLoadSH.style.display = "none";
  
});




/**
 * Span
 */
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modalVideo.style.display = "none";
  modalVideo.style.visibility = "hidden";
  modalLoadSH.style.display = "none";
  modalLoadSH.style.visibility = "hidden";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalVideo) {
    modalVideo.style.display = "none";
    modalVideo.style.visibility = "hidden";
  }
  if (event.target == modalLoadSH) {
    modalLoadSH.style.display = "none";
    modalLoadSH.style.visibility = "hidden";
  }
};




function loadSH1(){
  loadJSONSegmentHistory1() ;
}

function LoadSHFromServer(){
      modalLoadSH.style.display = "block";
      modalLoadSH.style.visibility = "";
      cardManager.loadSegmentHistoryFromServer();
}

function loadSH2(){
  loadJSONSegmentHistory2();

}
function loadSHTuto(){
  loadJSONSegmentHistoryTutorial();
}


function loadVideo1(){
  Player.setSource("./public/media/workshop2/videoW1.mp4");
}
function loadVideo2(){
  Player.setSource("./public/media/workshop2/videoW1-2.mp4");}

function analyzeData(){
  dataAnalyst.analyseData1();
}

function invertVideo(){
  Player.mirror();
}
function loadVideo() {
// When the user clicks the button load a Video in  the menu, open the modal
      modalVideo.style.display = "block";
      modalVideo.style.visibility = "";
      VideoPicker.chargeVideo();
}






