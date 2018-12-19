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


var menuExtended = 0;


//menuOption.innerHTML = "Username : " + logger.getSocket_name_session();

console.log(logger.getSocket_name_session());
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
}


menu.addEventListener("mousedown", handleMenu, {
  passive: true
});

btnCleanAll.addEventListener("mousedown", callbackCleanSegmentHistory);


idSession.addEventListener("blur",setSessionName, {passive: true});
function setSessionName(){
    window.location = "#oNote4";
    noteMessage.innerHTML = " Sucess! Log file is : " + idSession.value;
   logger.changeUsernameSocket( idSession.value );
    setTimeout(function() {window.location = "#oNote";console.log(" aaa")}, 2500);
    //clearTimeout(mytimeout);
}

function callbackCleanSegmentHistory(){
  cardManager.execute(new CleanSegmentHistoryCommand());
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
