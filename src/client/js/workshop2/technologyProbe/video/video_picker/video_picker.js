

var alreadyCharged = false;
var modalVideo = document.getElementById('videoPickerOverview');


var VideoPicker = function() {
  
  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    chargeVideo: function(){
     chargeVideo();
    },
    
    
  }
};

var VideoPicker = new VideoPicker();




var chargeVideo = function (){
  //We charge all the video only one time
  if(!alreadyCharged){
    console.log("charging the video");
    var xhr= new XMLHttpRequest();
    xhr.open('GET', 'src/client/js/workshop2/technologyProbe/video/video_picker/videoPreview_view.html', true);
    xhr.onreadystatechange= function() {
      if (this.readyState!==4) return;
      if (this.status!==200) return; // or whatever error handling you want
      document.getElementById('videoPickerOverviewModal').innerHTML= this.responseText;
  
  
      var elms = document.getElementById('videoPickerOverviewModal').getElementsByTagName("video");
      var video = document.getElementById('videovjscontrol');
      var span = document.getElementsByClassName("close")[0];
  
      span.addEventListener( "mousedown" , function() {
        modalVideo.style.display = "none";
      });
      for (var i = 0; i < elms.length; i++) {
          elms[i].addEventListener("mousedown", function (){
            //console.log(this.getElementsByTagName("source")[0].src);
            video.src = this.getElementsByTagName("source")[0].src;
            var notification_feedback = "Video successfully loaded!";
            notificationFeedback(notification_feedback);
            //modalVideo.style.display = "none";
            //modalVideo.style.visibility = "hidden";
        });
      }
    };
    xhr.send();
    alreadyCharged = true;
  }
 
};



