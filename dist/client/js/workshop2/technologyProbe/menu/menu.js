"use strict";

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
  notificationFeedback(notification_feedback);
}

menu.addEventListener("mousedown", handleMenu, {
  passive: true
});

if (btnLoadYtVideo !== null) btnLoadYtVideo.addEventListener("mousedown", callbackLoadYtVideo);

btnCleanAll.addEventListener("mousedown", callbackCleanSegmentHistory);

btnSaveSegments.addEventListener("mousedown", callbackSaveFile);

if (btnloadSH1 !== null) btnloadSH1.addEventListener("mousedown", loadSH1);
if (btnLoadSHFromServer !== null) btnLoadSHFromServer.addEventListener("mousedown", LoadSHFromServer);

if (btnloadSH2 !== null) btnloadSH2.addEventListener("mousedown", loadSH2);
if (btnloadSHTuto !== null) btnloadSHTuto.addEventListener("mousedown", loadSHTuto);
if (btnAnalyzeData !== null) btnAnalyzeData.addEventListener("mousedown", analyzeData);

if (btnInvertVideo !== null) btnInvertVideo.addEventListener("mousedown", invertVideo);
if (btnLoadAVideo !== null) btnLoadAVideo.addEventListener("mousedown", loadVideo);

idSession.addEventListener("blur", setSessionName, { passive: true });
function setSessionName() {
  logger.changeUsernameSocket(idSession.value);
  var notification_feedback = "Sucess! Log file is : " + idSession.value;
  notificationFeedback(notification_feedback);
}

function callbackCleanSegmentHistory() {
  if (confirm(" /!\\ Voulez-vous vraiment supprimer tous les segments?")) {
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

function callbackSaveFile() {
  console.log("saving log");
  /*arrayCard.forEach(function (arrayItem) {
    // arrayItem.updateInfo();
    //arrayItem.
  });*/
  cardManager.exportCard();
  var notification_feedback = "File saved : " + idSession.value;
  notificationFeedback(notification_feedback);
}

function callbackLoadYtVideo() {}

function handleMenu() {
  menu.classList.toggle("change");
  //sidebarMenu.classList.toggle("appearMenuSidebar");
  if (menuExtended) {
    menuExtended = 0;
    sidebarMenu.style.visibility = 'hidden'; // Show
  } else {
    sidebarMenu.style.visibility = 'visible'; // Hide
    menuExtended = 1;
  }
}

function notificationFeedback(notification_message) {
  window.location = "#oNote4";
  noteMessage.innerHTML = notification_message;
  setTimeout(function () {
    window.location = "#oNote";
  }, 2500);
}

// Get the modal
var modal = document.getElementById('modalYT');
var modalVideo = document.getElementById('videoPickerOverview');
var modalLoadSH = document.getElementById('SHPickerOverview');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var spanSH = document.getElementsByClassName("close")[1];

// When the user clicks the button, open the modal
if (btnLoadYtVideo !== null) {
  btnLoadYtVideo.onclick = function () {
    modal.style.display = "block";
  };
}

// When the user clicks on <span> (x), close the modal
span.addEventListener("mousedown", function () {
  modal.style.display = "none";
});
span.addEventListener("mousedown", function () {
  modalVideo.style.display = "none";
});
spanSH.addEventListener("mousedown", function () {
  modalLoadSH.style.display = "none";
});

/**
 * Span
 */
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modalVideo.style.display = "none";
  modalVideo.style.visibility = "hidden";
  modalLoadSH.style.display = "none";
  modalLoadSH.style.visibility = "hidden";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modalVideo) {
    modalVideo.style.display = "none";
    modalVideo.style.visibility = "hidden";
  }
  if (event.target == modalLoadSH) {
    modalLoadSH.style.display = "none";
    modalLoadSH.style.visibility = "hidden";
  }
};

function loadSH1() {
  loadJSONSegmentHistory1();
}

function LoadSHFromServer() {
  modalLoadSH.style.display = "block";
  modalLoadSH.style.visibility = "";
  cardManager.loadSegmentHistoryFromServer();
}

function loadSH2() {
  loadJSONSegmentHistory2();
}
function loadSHTuto() {
  loadJSONSegmentHistoryTutorial();
}

function analyzeData() {
  dataAnalyst.analyseData1();
}

function invertVideo() {
  Player.mirror();
}
function loadVideo() {
  // When the user clicks the button load a Video in  the menu, open the modal
  modalVideo.style.display = "block";
  modalVideo.style.visibility = "";
  VideoPicker.chargeVideo();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZGVvQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJtZW51IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImJhcjEiLCJiYXIyIiwiYmFyMyIsIm1lbnVPcHRpb24iLCJzaWRlYmFyTWVudSIsIm5vdGVNZXNzYWdlIiwiaWRTZXNzaW9uIiwiYnRuTG9hZEZpbGUiLCJpbnB1dEZpbGUiLCJidG5DbGVhbkFsbCIsImJ0bkxvYWRZdFZpZGVvIiwiYnRuU2F2ZVNlZ21lbnRzIiwiYnRuSW52ZXJ0VmlkZW8iLCJidG5Mb2FkQVZpZGVvIiwiYnRuTG9hZFNIRnJvbVNlcnZlciIsImJ0bmxvYWRTSDEiLCJidG5sb2FkU0gyIiwiYnRubG9hZFNIVHV0byIsImJ0bkFuYWx5emVEYXRhIiwibWVudUV4dGVuZGVkIiwidmFsdWUiLCJsb2dnZXIiLCJnZXRTb2NrZXRfbmFtZV9zZXNzaW9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsInVwZGF0ZUltYWdlRGlzcGxheSIsImUiLCJjbGljayIsInBhc3NpdmUiLCJjdXJGaWxlcyIsImZpbGVzIiwiY29uc29sZSIsImxvZyIsImNhcmRNYW5hZ2VyIiwiZXhlY3V0ZSIsIkxvYWRMb2dDb21tYW5kIiwibm90aWZpY2F0aW9uX2ZlZWRiYWNrIiwibm90aWZpY2F0aW9uRmVlZGJhY2siLCJoYW5kbGVNZW51IiwiY2FsbGJhY2tMb2FkWXRWaWRlbyIsImNhbGxiYWNrQ2xlYW5TZWdtZW50SGlzdG9yeSIsImNhbGxiYWNrU2F2ZUZpbGUiLCJsb2FkU0gxIiwiTG9hZFNIRnJvbVNlcnZlciIsImxvYWRTSDIiLCJsb2FkU0hUdXRvIiwiYW5hbHl6ZURhdGEiLCJpbnZlcnRWaWRlbyIsImxvYWRWaWRlbyIsInNldFNlc3Npb25OYW1lIiwiY2hhbmdlVXNlcm5hbWVTb2NrZXQiLCJjb25maXJtIiwiQ2xlYW5TZWdtZW50SGlzdG9yeUNvbW1hbmQiLCJleHBvcnRDYXJkIiwiY2xhc3NMaXN0IiwidG9nZ2xlIiwic3R5bGUiLCJ2aXNpYmlsaXR5Iiwibm90aWZpY2F0aW9uX21lc3NhZ2UiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImlubmVySFRNTCIsInNldFRpbWVvdXQiLCJtb2RhbCIsIm1vZGFsVmlkZW8iLCJtb2RhbExvYWRTSCIsInNwYW4iLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwic3BhblNIIiwib25jbGljayIsImRpc3BsYXkiLCJldmVudCIsInRhcmdldCIsImxvYWRKU09OU2VnbWVudEhpc3RvcnkxIiwibG9hZFNlZ21lbnRIaXN0b3J5RnJvbVNlcnZlciIsImxvYWRKU09OU2VnbWVudEhpc3RvcnkyIiwibG9hZEpTT05TZWdtZW50SGlzdG9yeVR1dG9yaWFsIiwiZGF0YUFuYWx5c3QiLCJhbmFseXNlRGF0YTEiLCJQbGF5ZXIiLCJtaXJyb3IiLCJWaWRlb1BpY2tlciIsImNoYXJnZVZpZGVvIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLE9BQU9DLFNBQVNDLGNBQVQsQ0FBd0IsZUFBeEIsQ0FBWDtBQUNBLElBQUlDLE9BQU9GLFNBQVNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBWDtBQUNBLElBQUlFLE9BQU9ILFNBQVNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBWDtBQUNBLElBQUlHLE9BQU9KLFNBQVNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBWDtBQUNBLElBQUlJLGFBQWFMLFNBQVNDLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBakI7QUFDQSxJQUFJSyxjQUFjTixTQUFTQyxjQUFULENBQXdCLGFBQXhCLENBQWxCO0FBQ0EsSUFBSU0sY0FBY1AsU0FBU0MsY0FBVCxDQUF3QixhQUF4QixDQUFsQjtBQUNBLElBQUlPLFlBQVlSLFNBQVNDLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBaEI7QUFDQSxJQUFJUSxjQUFjVCxTQUFTQyxjQUFULENBQXdCLGFBQXhCLENBQWxCO0FBQ0EsSUFBSVMsWUFBWVYsU0FBU0MsY0FBVCxDQUF3QixhQUF4QixDQUFoQjtBQUNBLElBQUlVLGNBQWNYLFNBQVNDLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBbEI7QUFDQSxJ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RUFBZ0I7QUFDL0IsTUFBSUEsTUFBTUMsTUFBTixJQUFnQlIsVUFBcEIsRUFBZ0M7QUFDOUJBLGVBQVdSLEtBQVgsQ0FBaUJjLE9BQWpCLEdBQTJCLE1BQTNCO0FBQ0FOLGVBQVdSLEtBQVgsQ0FBaUJDLFVBQWpCLEdBQThCLFFBQTlCO0FBQ0Q7QUFDRCxNQUFJYyxNQUFNQyxNQUFOLElBQWdCUCxXQUFwQixFQUFpQztBQUMvQkEsZ0JBQVlULEtBQVosQ0FBa0JjLE9BQWxCLEdBQTRCLE1BQTVCO0FBQ0FMLGdCQUFZVCxLQUFaLENBQWtCQyxVQUFsQixHQUErQixRQUEvQjtBQUNEO0FBQ0YsQ0FURDs7QUFjQSxTQUFTZixPQUFULEdBQWtCO0FBQ2hCK0I7QUFDRDs7QUFFRCxTQUFTOUIsZ0JBQVQsR0FBMkI7QUFDckJzQixjQUFZVCxLQUFaLENBQWtCYyxPQUFsQixHQUE0QixPQUE1QjtBQUNBTCxjQUFZVCxLQUFaLENBQWtCQyxVQUFsQixHQUErQixFQUEvQjtBQUNBeEIsY0FBWXlDLDRCQUFaO0FBQ0w7O0FBRUQsU0FBUzlCLE9BQVQsR0FBa0I7QUFDaEIrQjtBQUVEO0FBQ0QsU0FBUzlCLFVBQVQsR0FBcUI7QUFDbkIrQjtBQUNEOztBQUdELFNBQVM5QixXQUFULEdBQXNCO0FBQ3BCK0IsY0FBWUMsWUFBWjtBQUNEOztBQUVELFNBQVMvQixXQUFULEdBQXNCO0FBQ3BCZ0MsU0FBT0MsTUFBUDtBQUNEO0FBQ0QsU0FBU2hDLFNBQVQsR0FBcUI7QUFDckI7QUFDTWdCLGFBQVdSLEtBQVgsQ0FBaUJjLE9BQWpCLEdBQTJCLE9BQTNCO0FBQ0FOLGFBQVdSLEtBQVgsQ0FBaUJDLFVBQWpCLEdBQThCLEVBQTlCO0FBQ0F3QixjQUFZQyxXQUFaO0FBQ0wiLCJmaWxlIjoidmlkZW9Db250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lck1lbnVcIik7XG52YXIgYmFyMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFyMWlkXCIpO1xudmFyIGJhcjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhcjJpZFwiKTtcbnZhciBiYXIzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYXIzaWRcIik7XG52YXIgbWVudU9wdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVudU9wdGlvbklkXCIpO1xudmFyIHNpZGViYXJNZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaWRlYmFyTWVudVwiKTtcbnZhciBub3RlTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm90ZU1lc3NhZ2VcIik7XG52YXIgaWRTZXNzaW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZFNlc3Npb25cIik7XG52YXIgYnRuTG9hZEZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bkxvYWRGaWxlXCIpO1xudmFyIGlucHV0RmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dGaWxlTG9hZCcpO1xudmFyIGJ0bkNsZWFuQWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bkNsZWFuQWxsJyk7XG52YXIgYnRuTG9hZFl0VmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZFl0VmlkZW8nKTtcbnZhciBidG5TYXZlU2VnbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuU2F2ZVNlZ21lbnRzJyk7XG52YXIgYnRuSW52ZXJ0VmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuSW52ZXJ0VmlkZW8nKTtcbnZhciBidG5Mb2FkQVZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bkxvYWRBVmlkZW8nKTtcbnZhciBidG5Mb2FkU0hGcm9tU2VydmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bkxvYWRTSEZyb21TZXJ2ZXInKTtcblxuLy92YXIgZGF0YUFuYWx5c3QgPSBEYXRhQW5hbHlzdDtcblxudmFyIGJ0bmxvYWRTSDEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZFNIdmlkZW8xJyk7XG52YXIgYnRubG9hZFNIMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkU0h2aWRlbzInKTtcbnZhciBidG5sb2FkU0hUdXRvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRTSHZpZGVvVHV0b3JpYWwnKTtcbnZhciBidG5BbmFseXplRGF0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbmFseXplRGF0YScpO1xuXG5cblxudmFyIG1lbnVFeHRlbmRlZCA9IDA7XG5cbi8vbWVudU9wdGlvbi5pbm5lckhUTUwgPSBcIlVzZXJuYW1lIDogXCIgKyBsb2dnZXIuZ2V0U29ja2V0X25hbWVfc2Vzc2lvbigpO1xuXG5pZFNlc3Npb24udmFsdWUgPSBsb2dnZXIuZ2V0U29ja2V0X25hbWVfc2Vzc2lvbigpO1xuXG5pbnB1dEZpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlSW1hZ2VEaXNwbGF5KTtcblxuYnRuTG9hZEZpbGUuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbiAoZSkge1xuICAgIC8vZW11bGF0aW5nIGEgY2xpY2sgb24gYSBmaWxlIHBpY2tpbmdcbiAgICBpbnB1dEZpbGUuY2xpY2soKTtcbiAgfSwge1xuICBwYXNzaXZlOiB0cnVlXG59KTtcblxuXG5cbmZ1bmN0aW9uIHVwZGF0ZUltYWdlRGlzcGxheSgpIHtcbiAgdmFyIGN1ckZpbGVzID0gaW5wdXRGaWxlLmZpbGVzO1xuICBjb25zb2xlLmxvZyhjdXJGaWxlcyk7XG4gIGNhcmRNYW5hZ2VyLmV4ZWN1dGUobmV3IExvYWRMb2dDb21tYW5kKGN1ckZpbGVzKSk7XG4gIHZhciBub3RpZmljYXRpb25fZmVlZGJhY2sgPSBcIkZpbGUgaW1wb3J0ZWQgIVwiO1xuICBub3RpZmljYXRpb25GZWVkYmFjayhub3RpZmljYXRpb25fZmVlZGJhY2spXG59XG5cblxubWVudS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGhhbmRsZU1lbnUsIHtcbiAgcGFzc2l2ZTogdHJ1ZVxufSk7XG5cbmlmKGJ0bkxvYWRZdFZpZGVvICE9PSBudWxsKVxuICBidG5Mb2FkWXRWaWRlby5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNhbGxiYWNrTG9hZFl0VmlkZW8pO1xuXG5idG5DbGVhbkFsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNhbGxiYWNrQ2xlYW5TZWdtZW50SGlzdG9yeSk7XG5cbmJ0blNhdmVTZWdtZW50cy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNhbGxiYWNrU2F2ZUZpbGUpO1xuXG5pZihidG5sb2FkU0gxICE9PSBudWxsKVxuICBidG5sb2FkU0gxLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbG9hZFNIMSApO1xuaWYoYnRuTG9hZFNIRnJvbVNlcnZlciAhPT0gbnVsbClcbiAgYnRuTG9hZFNIRnJvbVNlcnZlci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIExvYWRTSEZyb21TZXJ2ZXIgKTtcblxuaWYoYnRubG9hZFNIMiAhPT0gbnVsbClcbiAgYnRubG9hZFNIMi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGxvYWRTSDIpO1xuaWYoYnRubG9hZFNIVHV0byAhPT0gbnVsbClcbiAgYnRubG9hZFNIVHV0by5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGxvYWRTSFR1dG8pO1xuaWYoYnRuQW5hbHl6ZURhdGEgIT09IG51bGwpXG4gIGJ0bkFuYWx5emVEYXRhLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgYW5hbHl6ZURhdGEpO1xuXG5pZihidG5JbnZlcnRWaWRlbyAhPT0gbnVsbClcbiAgYnRuSW52ZXJ0VmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBpbnZlcnRWaWRlbykgO1xuaWYoYnRuTG9hZEFWaWRlbyAhPT0gbnVsbClcbiAgYnRuTG9hZEFWaWRlby5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGxvYWRWaWRlbykgO1xuXG5cbmlkU2Vzc2lvbi5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLHNldFNlc3Npb25OYW1lLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuZnVuY3Rpb24gc2V0U2Vzc2lvbk5hbWUoKXtcbiAgIGxvZ2dlci5jaGFuZ2VVc2VybmFtZVNvY2tldCggaWRTZXNzaW9uLnZhbHVlICk7XG4gICB2YXIgbm90aWZpY2F0aW9uX2ZlZWRiYWNrID0gXCJTdWNlc3MhIExvZyBmaWxlIGlzIDogXCIgKyBpZFNlc3Npb24udmFsdWU7XG4gICAgbm90aWZpY2F0aW9uRmVlZGJhY2sobm90aWZpY2F0aW9uX2ZlZWRiYWNrKTtcbn1cblxuZnVuY3Rpb24gY2FsbGJhY2tDbGVhblNlZ21lbnRIaXN0b3J5KCl7XG4gIGlmICggY29uZmlybSggXCIgLyFcXFxcIFZvdWxlei12b3VzIHZyYWltZW50IHN1cHByaW1lciB0b3VzIGxlcyBzZWdtZW50cz9cIiApICkge1xuICAgIC8vIENvZGUgw6Agw6l4w6ljdXRlciBzaSBsZSBsJ3V0aWxpc2F0ZXVyIGNsaXF1ZSBzdXIgXCJPS1wiXG4gICAgdmFyIG5vdGlmaWNhdGlvbl9mZWVkYmFjayA9IFwiQ2xlYW4gYWxsIHN1Y2Nlc3NcIjtcbiAgICBub3RpZmljYXRpb25GZWVkYmFjayhub3RpZmljYXRpb25fZmVlZGJhY2spO1xuICAgIGNhcmRNYW5hZ2VyLmV4ZWN1dGUobmV3IENsZWFuU2VnbWVudEhpc3RvcnlDb21tYW5kKCkpO1xuICAgIC8vIENvZGUgw6Agw6l4w6ljdXRlciBzaSBsJ3V0aWxpc2F0ZXVyIGNsaXF1ZSBzdXIgXCJBbm51bGVyXCJcbiAgfSBlbHNlIHtcbiAgICB2YXIgbm90aWZpY2F0aW9uX2ZlZWRiYWNrID0gXCJOb3QgY29uZmlybWVkIVwiO1xuICAgIG5vdGlmaWNhdGlvbkZlZWRiYWNrKG5vdGlmaWNhdGlvbl9mZWVkYmFjayk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsbGJhY2tTYXZlRmlsZSgpe1xuICBjb25zb2xlLmxvZyhcInNhdmluZyBsb2dcIik7XG4gIC8qYXJyYXlDYXJkLmZvckVhY2goZnVuY3Rpb24gKGFycmF5SXRlbSkge1xuICAgIC8vIGFycmF5SXRlbS51cGRhdGVJbmZvKCk7XG4gICAgLy9hcnJheUl0ZW0uXG4gIH0pOyovXG4gIGNhcmRNYW5hZ2VyLmV4cG9ydENhcmQoKTtcbiAgdmFyIG5vdGlmaWNhdGlvbl9mZWVkYmFjayA9IFwiRmlsZSBzYXZlZCA6IFwiICsgaWRTZXNzaW9uLnZhbHVlO1xuICBub3RpZmljYXRpb25GZWVkYmFjayhub3RpZmljYXRpb25fZmVlZGJhY2spO1xufVxuXG5mdW5jdGlvbiBjYWxsYmFja0xvYWRZdFZpZGVvKCl7XG5cbn1cblxuZnVuY3Rpb24gaGFuZGxlTWVudSgpe1xuICBtZW51LmNsYXNzTGlzdC50b2dnbGUoXCJjaGFuZ2VcIik7XG4gIC8vc2lkZWJhck1lbnUuY2xhc3NMaXN0LnRvZ2dsZShcImFwcGVhck1lbnVTaWRlYmFyXCIpO1xuICBpZihtZW51RXh0ZW5kZWQpe1xuICAgIG1lbnVFeHRlbmRlZCA9IDA7XG4gICAgc2lkZWJhck1lbnUuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nOyAgICAgLy8gU2hvd1xuICB9IGVsc2Uge1xuICAgIHNpZGViYXJNZW51LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7ICAgICAgLy8gSGlkZVxuICAgIG1lbnVFeHRlbmRlZCA9IDE7XG4gIH1cbn1cblxuZnVuY3Rpb24gbm90aWZpY2F0aW9uRmVlZGJhY2sobm90aWZpY2F0aW9uX21lc3NhZ2Upe1xuICB3aW5kb3cubG9jYXRpb24gPSBcIiNvTm90ZTRcIjtcbiAgbm90ZU1lc3NhZ2UuaW5uZXJIVE1MID0gbm90aWZpY2F0aW9uX21lc3NhZ2U7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7d2luZG93LmxvY2F0aW9uID0gXCIjb05vdGVcIjt9LCAyNTAwKTtcbn1cblxuLy8gR2V0IHRoZSBtb2RhbFxudmFyIG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsWVQnKTtcbnZhciBtb2RhbFZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvUGlja2VyT3ZlcnZpZXcnKTtcbnZhciBtb2RhbExvYWRTSCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTSFBpY2tlck92ZXJ2aWV3Jyk7XG5cbi8vIEdldCB0aGUgPHNwYW4+IGVsZW1lbnQgdGhhdCBjbG9zZXMgdGhlIG1vZGFsXG52YXIgc3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjbG9zZVwiKVswXTtcbnZhciBzcGFuU0ggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2xvc2VcIilbMV07XG5cbi8vIFdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSBidXR0b24sIG9wZW4gdGhlIG1vZGFsXG5pZihidG5Mb2FkWXRWaWRlbyAhPT0gbnVsbCl7XG4gIGJ0bkxvYWRZdFZpZGVvLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICB9O1xufVxuXG5cbi8vIFdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIDxzcGFuPiAoeCksIGNsb3NlIHRoZSBtb2RhbFxuc3Bhbi5hZGRFdmVudExpc3RlbmVyKCBcIm1vdXNlZG93blwiICwgZnVuY3Rpb24oKSB7XG4gIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn0pO1xuc3Bhbi5hZGRFdmVudExpc3RlbmVyKCBcIm1vdXNlZG93blwiICwgZnVuY3Rpb24oKSB7XG4gIG1vZGFsVmlkZW8uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufSk7XG5zcGFuU0guYWRkRXZlbnRMaXN0ZW5lciggXCJtb3VzZWRvd25cIiAsIGZ1bmN0aW9uKCkge1xuICBtb2RhbExvYWRTSC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIFxufSk7XG5cblxuXG5cbi8qKlxuICogU3BhblxuICovXG4vLyBXaGVuIHRoZSB1c2VyIGNsaWNrcyBvbiA8c3Bhbj4gKHgpLCBjbG9zZSB0aGUgbW9kYWxcbnNwYW4ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICBtb2RhbFZpZGVvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgbW9kYWxWaWRlby5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgbW9kYWxMb2FkU0guc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBtb2RhbExvYWRTSC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbn07XG5cbi8vIFdoZW4gdGhlIHVzZXIgY2xpY2tzIGFueXdoZXJlIG91dHNpZGUgb2YgdGhlIG1vZGFsLCBjbG9zZSBpdFxud2luZG93Lm9uY2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xuICBpZiAoZXZlbnQudGFyZ2V0ID09IG1vZGFsVmlkZW8pIHtcbiAgICBtb2RhbFZpZGVvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBtb2RhbFZpZGVvLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICB9XG4gIGlmIChldmVudC50YXJnZXQgPT0gbW9kYWxMb2FkU0gpIHtcbiAgICBtb2RhbExvYWRTSC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgbW9kYWxMb2FkU0guc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gIH1cbn07XG5cblxuXG5cbmZ1bmN0aW9uIGxvYWRTSDEoKXtcbiAgbG9hZEpTT05TZWdtZW50SGlzdG9yeTEoKSA7XG59XG5cbmZ1bmN0aW9uIExvYWRTSEZyb21TZXJ2ZXIoKXtcbiAgICAgIG1vZGFsTG9hZFNILnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICBtb2RhbExvYWRTSC5zdHlsZS52aXNpYmlsaXR5ID0gXCJcIjtcbiAgICAgIGNhcmRNYW5hZ2VyLmxvYWRTZWdtZW50SGlzdG9yeUZyb21TZXJ2ZXIoKTtcbn1cblxuZnVuY3Rpb24gbG9hZFNIMigpe1xuICBsb2FkSlNPTlNlZ21lbnRIaXN0b3J5MigpO1xuXG59XG5mdW5jdGlvbiBsb2FkU0hUdXRvKCl7XG4gIGxvYWRKU09OU2VnbWVudEhpc3RvcnlUdXRvcmlhbCgpO1xufVxuXG5cbmZ1bmN0aW9uIGFuYWx5emVEYXRhKCl7XG4gIGRhdGFBbmFseXN0LmFuYWx5c2VEYXRhMSgpO1xufVxuXG5mdW5jdGlvbiBpbnZlcnRWaWRlbygpe1xuICBQbGF5ZXIubWlycm9yKCk7XG59XG5mdW5jdGlvbiBsb2FkVmlkZW8oKSB7XG4vLyBXaGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgYnV0dG9uIGxvYWQgYSBWaWRlbyBpbiAgdGhlIG1lbnUsIG9wZW4gdGhlIG1vZGFsXG4gICAgICBtb2RhbFZpZGVvLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICBtb2RhbFZpZGVvLnN0eWxlLnZpc2liaWxpdHkgPSBcIlwiO1xuICAgICAgVmlkZW9QaWNrZXIuY2hhcmdlVmlkZW8oKTtcbn1cblxuXG5cblxuXG5cblxuXG4iXX0=