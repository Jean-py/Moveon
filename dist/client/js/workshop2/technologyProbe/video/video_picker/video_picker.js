'use strict';

var alreadyCharged = false;

var VideoPicker = function VideoPicker() {
  //I implemented a command pattern, see : https://www.dofactory.com/javascript/command-design-pattern
  return {
    chargeVideo: function chargeVideo() {
      _chargeVideo();
    }
  };
};

var VideoPicker = new VideoPicker();

var _chargeVideo = function _chargeVideo() {
  //We charge all the video only one time
  if (!alreadyCharged) {
    console.log("charging the video");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'src/client/js/workshop2/technologyProbe/video/video_picker/videoPreview_view.html', true);
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;
      if (this.status !== 200) return; // or whatever error handling you want
      document.getElementById('videoPickerOverviewModal').innerHTML = this.responseText;

      var elms = document.getElementById('videoPickerOverviewModal').getElementsByTagName("video");
      var span = document.getElementsByClassName("close")[0];

      span.addEventListener("mousedown", function () {
        modalVideo.style.display = "none";
      });
      for (var i = 0; i < elms.length; i++) {
        elms[i].addEventListener("mousedown", function () {
          //console.log(this.getElementsByTagName("source")[0].src);
          console.log(video_current);
          // video_current.src = this.getElementsByTagName("source")[0].src;

          var elem = document.getElementById('videojs_youtube_api');
          if (elem != null) {
            elem.parentNode.removeChild(elem);
          }
          video_current.src([{ type: "video/mp4", src: this.getElementsByTagName("source")[0].src }]);

          var notification_feedback = "Video successfully loaded!";
          notificationFeedback(notification_feedback);
          //modalVideo.style.display = "none";
          //modalVideo.style.visibility = "hidden";
        });
      }

      var url_yt_chooser = document.getElementById("yt_chooser");
      url_yt_chooser.addEventListener("blur", setVideo, { passive: true });
    };
    xhr.send();
    alreadyCharged = true;
  }
};

function setVideo() {
  video_current.src({ type: 'video/youtube', src: document.getElementById("yt_chooser").value });
  //video_current.src({type: 'video/youtube', src:'https://www.youtube.com/watch?v=voiS7cxsD0U&t=0s&ab_channel=Squiders' });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZGVvX3BpY2tlci5qcyJdLCJuYW1lcyI6WyJhbHJlYWR5Q2hhcmdlZCIsIlZpZGVvUGlja2VyIiwiY2hhcmdlVmlkZW8iLCJjb25zb2xlIiwibG9nIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsInN0YXR1cyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJpbm5lckhUTUwiLCJyZXNwb25zZVRleHQiLCJlbG1zIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJzcGFuIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJtb2RhbFZpZGVvIiwic3R5bGUiLCJkaXNwbGF5IiwiaSIsImxlbmd0aCIsInZpZGVvX2N1cnJlbnQiLCJlbGVtIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwic3JjIiwidHlwZSIsIm5vdGlmaWNhdGlvbl9mZWVkYmFjayIsIm5vdGlmaWNhdGlvbkZlZWRiYWNrIiwidXJsX3l0X2Nob29zZXIiLCJzZXRWaWRlbyIsInBhc3NpdmUiLCJzZW5kIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBSUEsaUJBQWlCLEtBQXJCOztBQUdBLElBQUlDLGNBQWMsU0FBZEEsV0FBYyxHQUFXO0FBQzNCO0FBQ0EsU0FBTztBQUNMQyxpQkFBYSx1QkFBVTtBQUN0QkE7QUFDQTtBQUhJLEdBQVA7QUFLRCxDQVBEOztBQVVBLElBQUlELGNBQWMsSUFBSUEsV0FBSixFQUFsQjs7QUFHQSxJQUFJQyxlQUFjLFNBQWRBLFlBQWMsR0FBVztBQUMzQjtBQUNBLE1BQUcsQ0FBQ0YsY0FBSixFQUFtQjtBQUNqQkcsWUFBUUMsR0FBUixDQUFZLG9CQUFaO0FBQ0EsUUFBSUMsTUFBSyxJQUFJQyxjQUFKLEVBQVQ7QUFDQUQsUUFBSUUsSUFBSixDQUFTLEtBQVQsRUFBZ0IsbUZBQWhCLEVBQXFHLElBQXJHO0FBQ0FGLFFBQUlHLGtCQUFKLEdBQXdCLFlBQVc7QUFDakMsVUFBSSxLQUFLQyxVQUFMLEtBQWtCLENBQXRCLEVBQXlCO0FBQ3pCLFVBQUksS0FBS0MsTUFBTCxLQUFjLEdBQWxCLEVBQXVCLE9BRlUsQ0FFRjtBQUMvQkMsZUFBU0MsY0FBVCxDQUF3QiwwQkFBeEIsRUFBb0RDLFNBQXBELEdBQStELEtBQUtDLFlBQXBFOztBQUdBLFVBQUlDLE9BQU9KLFNBQVNDLGNBQVQsQ0FBd0IsMEJBQXhCLEVBQW9ESSxvQkFBcEQsQ0FBeUUsT0FBekUsQ0FBWDtBQUNBLFVBQUlDLE9BQU9OLFNBQVNPLHNCQUFULENBQWdDLE9BQWhDLEVBQXlDLENBQXpDLENBQVg7O0FBRUFELFdBQUtFLGdCQUFMLENBQXVCLFdBQXZCLEVBQXFDLFlBQVc7QUFDOUNDLG1CQUFXQyxLQUFYLENBQWlCQyxPQUFqQixHQUEyQixNQUEzQjtBQUNELE9BRkQ7QUFHQSxXQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSVIsS0FBS1MsTUFBekIsRUFBaUNELEdBQWpDLEVBQXNDO0FBQ2xDUixhQUFLUSxDQUFMLEVBQVFKLGdCQUFSLENBQXlCLFdBQXpCLEVBQXNDLFlBQVc7QUFDL0M7QUFDQWhCLGtCQUFRQyxHQUFSLENBQVlxQixhQUFaO0FBQ0Q7O0FBRUMsY0FBSUMsT0FBT2YsU0FBU0MsY0FBVCxDQUF3QixxQkFBeEIsQ0FBWDtBQUNBLGNBQUdjLFFBQVEsSUFBWCxFQUFnQjtBQUNkQSxpQkFBS0MsVUFBTCxDQUFnQkMsV0FBaEIsQ0FBNEJGLElBQTVCO0FBQ0Q7QUFDREQsd0JBQWNJLEdBQWQsQ0FBa0IsQ0FBQyxFQUFDQyxNQUFNLFdBQVAsRUFBb0JELEtBQUksS0FBS2Isb0JBQUwsQ0FBMEIsUUFBMUIsRUFBb0MsQ0FBcEMsRUFBdUNhLEdBQS9ELEVBQUQsQ0FBbEI7O0FBR0EsY0FBSUUsd0JBQXdCLDRCQUE1QjtBQUNBQywrQkFBcUJELHFCQUFyQjtBQUNBO0FBQ0E7QUFDSCxTQWhCQztBQWlCSDs7QUFFRCxVQUFJRSxpQkFBa0J0QixTQUFTQyxjQUFULENBQXdCLFlBQXhCLENBQXRCO0FBQ0FxQixxQkFBZWQsZ0JBQWYsQ0FBZ0MsTUFBaEMsRUFBdUNlLFFBQXZDLEVBQWlELEVBQUNDLFNBQVMsSUFBVixFQUFqRDtBQUVELEtBbkNEO0FBb0NBOUIsUUFBSStCLElBQUo7QUFDQXBDLHFCQUFpQixJQUFqQjtBQUNEO0FBRUYsQ0E5Q0Q7O0FBa0RBLFNBQVNrQyxRQUFULEdBQW1CO0FBQ2pCVCxnQkFBY0ksR0FBZCxDQUFrQixFQUFDQyxNQUFNLGVBQVAsRUFBd0JELEtBQUtsQixTQUFTQyxjQUFULENBQXdCLFlBQXhCLEVBQXNDeUIsS0FBbkUsRUFBbEI7QUFDQTtBQUVEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBIiwiZmlsZSI6InZpZGVvX3BpY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG52YXIgYWxyZWFkeUNoYXJnZWQgPSBmYWxzZTtcblxuXG52YXIgVmlkZW9QaWNrZXIgPSBmdW5jdGlvbigpIHtcbiAgLy9JIGltcGxlbWVudGVkIGEgY29tbWFuZCBwYXR0ZXJuLCBzZWUgOiBodHRwczovL3d3dy5kb2ZhY3RvcnkuY29tL2phdmFzY3JpcHQvY29tbWFuZC1kZXNpZ24tcGF0dGVyblxuICByZXR1cm4ge1xuICAgIGNoYXJnZVZpZGVvOiBmdW5jdGlvbigpe1xuICAgICBjaGFyZ2VWaWRlbygpO1xuICAgIH0sXG4gIH1cbn07XG5cblxudmFyIFZpZGVvUGlja2VyID0gbmV3IFZpZGVvUGlja2VyKCk7XG5cblxudmFyIGNoYXJnZVZpZGVvID0gZnVuY3Rpb24gKCl7XG4gIC8vV2UgY2hhcmdlIGFsbCB0aGUgdmlkZW8gb25seSBvbmUgdGltZVxuICBpZighYWxyZWFkeUNoYXJnZWQpe1xuICAgIGNvbnNvbGUubG9nKFwiY2hhcmdpbmcgdGhlIHZpZGVvXCIpO1xuICAgIHZhciB4aHI9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdHRVQnLCAnc3JjL2NsaWVudC9qcy93b3Jrc2hvcDIvdGVjaG5vbG9neVByb2JlL3ZpZGVvL3ZpZGVvX3BpY2tlci92aWRlb1ByZXZpZXdfdmlldy5odG1sJywgdHJ1ZSk7XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZT0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5yZWFkeVN0YXRlIT09NCkgcmV0dXJuO1xuICAgICAgaWYgKHRoaXMuc3RhdHVzIT09MjAwKSByZXR1cm47IC8vIG9yIHdoYXRldmVyIGVycm9yIGhhbmRsaW5nIHlvdSB3YW50XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW9QaWNrZXJPdmVydmlld01vZGFsJykuaW5uZXJIVE1MPSB0aGlzLnJlc3BvbnNlVGV4dDtcbiAgXG4gIFxuICAgICAgdmFyIGVsbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW9QaWNrZXJPdmVydmlld01vZGFsJykuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ2aWRlb1wiKTtcbiAgICAgIHZhciBzcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNsb3NlXCIpWzBdO1xuICBcbiAgICAgIHNwYW4uYWRkRXZlbnRMaXN0ZW5lciggXCJtb3VzZWRvd25cIiAsIGZ1bmN0aW9uKCkge1xuICAgICAgICBtb2RhbFZpZGVvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIH0pO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbG1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZWxtc1tpXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic291cmNlXCIpWzBdLnNyYyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2aWRlb19jdXJyZW50KTtcbiAgICAgICAgICAgLy8gdmlkZW9fY3VycmVudC5zcmMgPSB0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic291cmNlXCIpWzBdLnNyYztcbiAgXG4gICAgICAgICAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlb2pzX3lvdXR1YmVfYXBpJyk7XG4gICAgICAgICAgICBpZihlbGVtICE9IG51bGwpe1xuICAgICAgICAgICAgICBlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aWRlb19jdXJyZW50LnNyYyhbe3R5cGU6IFwidmlkZW8vbXA0XCIsIHNyYzp0aGlzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic291cmNlXCIpWzBdLnNyY31dKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbm90aWZpY2F0aW9uX2ZlZWRiYWNrID0gXCJWaWRlbyBzdWNjZXNzZnVsbHkgbG9hZGVkIVwiO1xuICAgICAgICAgICAgbm90aWZpY2F0aW9uRmVlZGJhY2sobm90aWZpY2F0aW9uX2ZlZWRiYWNrKTtcbiAgICAgICAgICAgIC8vbW9kYWxWaWRlby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAvL21vZGFsVmlkZW8uc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICBcbiAgICAgIHZhciB1cmxfeXRfY2hvb3NlciA9ICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInl0X2Nob29zZXJcIik7XG4gICAgICB1cmxfeXRfY2hvb3Nlci5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLHNldFZpZGVvLCB7cGFzc2l2ZTogdHJ1ZX0pO1xuICBcbiAgICB9O1xuICAgIHhoci5zZW5kKCk7XG4gICAgYWxyZWFkeUNoYXJnZWQgPSB0cnVlO1xuICB9XG4gXG59O1xuXG5cblxuZnVuY3Rpb24gc2V0VmlkZW8oKXtcbiAgdmlkZW9fY3VycmVudC5zcmMoe3R5cGU6ICd2aWRlby95b3V0dWJlJywgc3JjOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInl0X2Nob29zZXJcIikudmFsdWV9KTtcbiAgLy92aWRlb19jdXJyZW50LnNyYyh7dHlwZTogJ3ZpZGVvL3lvdXR1YmUnLCBzcmM6J2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9dm9pUzdjeHNEMFUmdD0wcyZhYl9jaGFubmVsPVNxdWlkZXJzJyB9KTtcblxufVxuXG4vKnZhciB2anNCdXR0b25Db21wb25lbnQgPSB2aWRlb2pzLmdldENvbXBvbmVudCgnQnV0dG9uJyk7XG52aWRlb2pzLnJlZ2lzdGVyQ29tcG9uZW50KCdEb3dubG9hZEJ1dHRvbicsIHZpZGVvanMuZXh0ZW5kKHZqc0J1dHRvbkNvbXBvbmVudCwge1xuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKCkge1xuICAgIHZqc0J1dHRvbkNvbXBvbmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9LFxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmxvY2F0aW9uID0gdmlkZW9fY3VycmVudC5zcmM7IC8vPCB0aGVyZSBhcmUgbWFueSB2YXJpYW50cyBoZXJlIHNvIGl0IGlzIHVwIHRvIHlvdSBob3cgdG8gZ2V0IHZpZGVvIHVybFxuICB9LFxuICBidWlsZENTU0NsYXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICd2anMtY29udHJvbCB2anMtZG93bmxvYWQtYnV0dG9uJztcbiAgfSxcbiAgY3JlYXRlQ29udHJvbFRleHRFbDogZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgIHJldHVybiAkKGJ1dHRvbikuaHRtbCgkKCc8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZG93bmxvYWRcIj48L3NwYW4+JykuYXR0cigndGl0bGUnLCAnRG93bmxvYWQnKSk7XG4gIH1cbn0pKTsqL1xuXG4vKlxuXG52aWRlb2pzKFxuICAndmlkZW9qc19odG1sNV9hcGknLFxuICB7Zmx1aWQ6IHRydWV9LFxuICBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5nZXRDaGlsZCgnY29udHJvbEJhcicpLmFkZENoaWxkKCdEb3dubG9hZEJ1dHRvbicsIHt9KTtcbiAgfVxuKTsqL1xuIl19