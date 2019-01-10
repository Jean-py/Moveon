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

btnLoadYtVideo.addEventListener("mousedown", callbackLoadYtVideo);

btnCleanAll.addEventListener("mousedown", callbackCleanSegmentHistory);


idSession.addEventListener("blur",setSessionName, {passive: true});
function setSessionName(){
   logger.changeUsernameSocket( idSession.value );
   var notification_feedback = "Sucess! Log file is : " + idSession.value;
    notificationFeedback(notification_feedback);
}

function callbackCleanSegmentHistory(){
  cardManager.execute(new CleanSegmentHistoryCommand());
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
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btnLoadYtVideo.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
