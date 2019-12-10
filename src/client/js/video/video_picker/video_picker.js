

var alreadyCharged = false;


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
    xhr.open('GET', 'src/client/js/video/video_picker/videoPreview_view.html', true);
    xhr.onreadystatechange= function() {
      if (this.readyState!==4) return;
      if (this.status!==200) return; // or whatever error handling you want
      document.getElementById('videoPickerOverviewModal').innerHTML= this.responseText;
      var elms = document.getElementById('videoPickerOverviewModal').getElementsByTagName("video");
      var span = document.getElementsByClassName("close")[0];
      
      var btnloadv = document.getElementById("btnloadv");
      var btncancel = document.getElementById("btncancel");
      
      
      
      span.addEventListener( "mousedown" , function() {
        modalVideo.style.display = "none";
      });
      for (var i = 0; i < elms.length; i++) {
          elms[i].addEventListener("mousedown", function (){
            //console.log(this.getElementsByTagName("source")[0].src);
            console.log(video_current);
           // video_current.src = this.getElementsByTagName("source")[0].src;
  
            var elem = document.getElementById('videojs_youtube_api');
            if(elem != null){
              elem.parentNode.removeChild(elem);
            }
            video_current.src([{type: "video/mp4", src:this.getElementsByTagName("source")[0].src}]);
            
            
            var notification_feedback = "Video successfully loaded!";
            notificationFeedback(notification_feedback);
            //modalVideo.style.display = "none";
            //modalVideo.style.visibility = "hidden";
        });
      }
  
      var url_yt_chooser =  document.getElementById("yt_chooser");
      btnloadv.addEventListener("mousedown",setVideo, {passive: true});
      btncancel.addEventListener("mousedown",cancelLoad, {passive: true});
      
  
    };
    xhr.send();
    alreadyCharged = true;
  }
 
};



function setVideo(){
  video_current.src({type: 'video/youtube', src: document.getElementById("yt_chooser").value});
  
  modalVideo.style.display = "none";
  //video_current.src({type: 'video/youtube', src:'https://www.youtube.com/watch?v=voiS7cxsD0U&t=0s&ab_channel=Squiders' });

}function cancelLoad(){
  modalVideo.style.display = "none";
}

/*var vjsButtonComponent = videojs.getComponent('Button');
videojs.registerComponent('DownloadButton', videojs.extend(vjsButtonComponent, {
  constructor: function () {
    vjsButtonComponent.apply(this, arguments);
  },
  handleClick: function () {
    document.location = video_current.src; //< there are many variants here so it is up to you how to get video url
  },
  buildCSSClass: function () {
    return 'vjs-control vjs-download-button';
  },
  createControlTextEl: function (button) {
    return $(button).html($('<span class="glyphicon glyphicon-download"></span>').attr('title', 'Download'));
  }
}));*/

/*

videojs(
  'videojs_html5_api',
  {fluid: true},
  function () {
    this.getChild('controlBar').addChild('DownloadButton', {});
  }
);*/
