'use strict';

var alreadyCharged = false;
var modalVideo = document.getElementById('videoPickerOverview');

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
      var video = document.getElementById('videovjscontrol');
      var span = document.getElementsByClassName("close")[0];

      span.addEventListener("mousedown", function () {
        modalVideo.style.display = "none";
      });
      for (var i = 0; i < elms.length; i++) {
        elms[i].addEventListener("mousedown", function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZGVvX3BpY2tlci5qcyJdLCJuYW1lcyI6WyJhbHJlYWR5Q2hhcmdlZCIsIm1vZGFsVmlkZW8iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiVmlkZW9QaWNrZXIiLCJjaGFyZ2VWaWRlbyIsImNvbnNvbGUiLCJsb2ciLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwiaW5uZXJIVE1MIiwicmVzcG9uc2VUZXh0IiwiZWxtcyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwidmlkZW8iLCJzcGFuIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdHlsZSIsImRpc3BsYXkiLCJpIiwibGVuZ3RoIiwic3JjIiwibm90aWZpY2F0aW9uX2ZlZWRiYWNrIiwibm90aWZpY2F0aW9uRmVlZGJhY2siLCJzZW5kIl0sIm1hcHBpbmdzIjoiOztBQUVBLElBQUlBLGlCQUFpQixLQUFyQjtBQUNBLElBQUlDLGFBQWFDLFNBQVNDLGNBQVQsQ0FBd0IscUJBQXhCLENBQWpCOztBQUdBLElBQUlDLGNBQWMsU0FBZEEsV0FBYyxHQUFXOztBQUUzQjtBQUNBLFNBQU87QUFDTEMsaUJBQWEsdUJBQVU7QUFDdEJBO0FBQ0E7O0FBSEksR0FBUDtBQU9ELENBVkQ7O0FBWUEsSUFBSUQsY0FBYyxJQUFJQSxXQUFKLEVBQWxCOztBQUtBLElBQUlDLGVBQWMsU0FBZEEsWUFBYyxHQUFXO0FBQzNCO0FBQ0EsTUFBRyxDQUFDTCxjQUFKLEVBQW1CO0FBQ2pCTSxZQUFRQyxHQUFSLENBQVksb0JBQVo7QUFDQSxRQUFJQyxNQUFLLElBQUlDLGNBQUosRUFBVDtBQUNBRCxRQUFJRSxJQUFKLENBQVMsS0FBVCxFQUFnQixtRkFBaEIsRUFBcUcsSUFBckc7QUFDQUYsUUFBSUcsa0JBQUosR0FBd0IsWUFBVztBQUNqQyxVQUFJLEtBQUtDLFVBQUwsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDekIsVUFBSSxLQUFLQyxNQUFMLEtBQWMsR0FBbEIsRUFBdUIsT0FGVSxDQUVGO0FBQy9CWCxlQUFTQyxjQUFULENBQXdCLDBCQUF4QixFQUFvRFcsU0FBcEQsR0FBK0QsS0FBS0MsWUFBcEU7O0FBR0EsVUFBSUMsT0FBT2QsU0FBU0MsY0FBVCxDQUF3QiwwQkFBeEIsRUFBb0RjLG9CQUFwRCxDQUF5RSxPQUF6RSxDQUFYO0FBQ0EsVUFBSUMsUUFBUWhCLFNBQVNDLGNBQVQsQ0FBd0IsaUJBQXhCLENBQVo7QUFDQSxVQUFJZ0IsT0FBT2pCLFNBQVNrQixzQkFBVCxDQUFnQyxPQUFoQyxFQUF5QyxDQUF6QyxDQUFYOztBQUVBRCxXQUFLRSxnQkFBTCxDQUF1QixXQUF2QixFQUFxQyxZQUFXO0FBQzlDcEIsbUJBQVdxQixLQUFYLENBQWlCQyxPQUFqQixHQUEyQixNQUEzQjtBQUNELE9BRkQ7QUFHQSxXQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSVIsS0FBS1MsTUFBekIsRUFBaUNELEdBQWpDLEVBQXNDO0FBQ2xDUixhQUFLUSxDQUFMLEVBQVFILGdCQUFSLENBQXlCLFdBQXpCLEVBQXNDLFlBQVc7QUFDL0M7QUFDQUgsZ0JBQU1RLEdBQU4sR0FBWSxLQUFLVCxvQkFBTCxDQUEwQixRQUExQixFQUFvQyxDQUFwQyxFQUF1Q1MsR0FBbkQ7QUFDQSxjQUFJQyx3QkFBd0IsNEJBQTVCO0FBQ0FDLCtCQUFxQkQscUJBQXJCO0FBQ0E7QUFDQTtBQUNILFNBUEM7QUFRSDtBQUNGLEtBdkJEO0FBd0JBbkIsUUFBSXFCLElBQUo7QUFDQTdCLHFCQUFpQixJQUFqQjtBQUNEO0FBRUYsQ0FsQ0QiLCJmaWxlIjoidmlkZW9fcGlja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbnZhciBhbHJlYWR5Q2hhcmdlZCA9IGZhbHNlO1xudmFyIG1vZGFsVmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW9QaWNrZXJPdmVydmlldycpO1xuXG5cbnZhciBWaWRlb1BpY2tlciA9IGZ1bmN0aW9uKCkge1xuICBcbiAgLy9JIGltcGxlbWVudGVkIGEgY29tbWFuZCBwYXR0ZXJuLCBzZWUgOiBodHRwczovL3d3dy5kb2ZhY3RvcnkuY29tL2phdmFzY3JpcHQvY29tbWFuZC1kZXNpZ24tcGF0dGVyblxuICByZXR1cm4ge1xuICAgIGNoYXJnZVZpZGVvOiBmdW5jdGlvbigpe1xuICAgICBjaGFyZ2VWaWRlbygpO1xuICAgIH0sXG4gICAgXG4gICAgXG4gIH1cbn07XG5cbnZhciBWaWRlb1BpY2tlciA9IG5ldyBWaWRlb1BpY2tlcigpO1xuXG5cblxuXG52YXIgY2hhcmdlVmlkZW8gPSBmdW5jdGlvbiAoKXtcbiAgLy9XZSBjaGFyZ2UgYWxsIHRoZSB2aWRlbyBvbmx5IG9uZSB0aW1lXG4gIGlmKCFhbHJlYWR5Q2hhcmdlZCl7XG4gICAgY29uc29sZS5sb2coXCJjaGFyZ2luZyB0aGUgdmlkZW9cIik7XG4gICAgdmFyIHhocj0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0dFVCcsICdzcmMvY2xpZW50L2pzL3dvcmtzaG9wMi90ZWNobm9sb2d5UHJvYmUvdmlkZW8vdmlkZW9fcGlja2VyL3ZpZGVvUHJldmlld192aWV3Lmh0bWwnLCB0cnVlKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUhPT00KSByZXR1cm47XG4gICAgICBpZiAodGhpcy5zdGF0dXMhPT0yMDApIHJldHVybjsgLy8gb3Igd2hhdGV2ZXIgZXJyb3IgaGFuZGxpbmcgeW91IHdhbnRcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlb1BpY2tlck92ZXJ2aWV3TW9kYWwnKS5pbm5lckhUTUw9IHRoaXMucmVzcG9uc2VUZXh0O1xuICBcbiAgXG4gICAgICB2YXIgZWxtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlb1BpY2tlck92ZXJ2aWV3TW9kYWwnKS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInZpZGVvXCIpO1xuICAgICAgdmFyIHZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvdmpzY29udHJvbCcpO1xuICAgICAgdmFyIHNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2xvc2VcIilbMF07XG4gIFxuICAgICAgc3Bhbi5hZGRFdmVudExpc3RlbmVyKCBcIm1vdXNlZG93blwiICwgZnVuY3Rpb24oKSB7XG4gICAgICAgIG1vZGFsVmlkZW8uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgfSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlbG1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzb3VyY2VcIilbMF0uc3JjKTtcbiAgICAgICAgICAgIHZpZGVvLnNyYyA9IHRoaXMuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzb3VyY2VcIilbMF0uc3JjO1xuICAgICAgICAgICAgdmFyIG5vdGlmaWNhdGlvbl9mZWVkYmFjayA9IFwiVmlkZW8gc3VjY2Vzc2Z1bGx5IGxvYWRlZCFcIjtcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbkZlZWRiYWNrKG5vdGlmaWNhdGlvbl9mZWVkYmFjayk7XG4gICAgICAgICAgICAvL21vZGFsVmlkZW8uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgLy9tb2RhbFZpZGVvLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHhoci5zZW5kKCk7XG4gICAgYWxyZWFkeUNoYXJnZWQgPSB0cnVlO1xuICB9XG4gXG59O1xuXG5cblxuIl19