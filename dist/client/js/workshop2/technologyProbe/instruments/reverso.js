"use strict";

//TODO

magnify("videoEAT", 3);
console.log("test reverso");

function magnify(imgID, zoom) {
  var img, glass, w, h, bw;
  img = document.getElementById(imgID);

  /* Create magnifier glass: */
  glass = document.createElement("DIV");
  glass.setAttribute("class", "img-magnifier-glass");

  /* Insert magnifier glass: */
  img.parentElement.insertBefore(glass, img);

  /* Set background properties for the magnifier glass: */
  glass.style.backgroundImage = "url('" + img.src + "')";
  glass.style.backgroundRepeat = "no-repeat";
  glass.style.backgroundSize = img.width * zoom + "px " + img.height * zoom + "px";
  bw = 3;
  w = glass.offsetWidth / 2;
  h = glass.offsetHeight / 2;

  /* Execute a function when someone moves the magnifier glass over the image: */
  glass.addEventListener("mousemove", moveMagnifier);
  img.addEventListener("mousemove", moveMagnifier);

  /*and also for touch screens:*/
  glass.addEventListener("touchmove", moveMagnifier);
  img.addEventListener("touchmove", moveMagnifier);
  function moveMagnifier(e) {
    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e);
    x = pos.x;
    y = pos.y;
    /* Prevent the magnifier glass from being positioned outside the image: */
    if (x > img.width - w / zoom) {
      x = img.width - w / zoom;
    }
    if (x < w / zoom) {
      x = w / zoom;
    }
    if (y > img.height - h / zoom) {
      y = img.height - h / zoom;
    }
    if (y < h / zoom) {
      y = h / zoom;
    }
    /* Set the position of the magnifier glass: */
    glass.style.left = x - w + "px";
    glass.style.top = y - h + "px";
    /* Display what the magnifier glass "sees": */
    glass.style.backgroundPosition = "-" + (x * zoom - w + bw) + "px -" + (y * zoom - h + bw) + "px";
  }

  function getCursorPos(e) {
    var a,
        x = 0,
        y = 0;
    e = e || window.event;
    /* Get the x and y positions of the image: */
    a = img.getBoundingClientRect();
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /* Consider any page scrolling: */
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJldmVyc28uanMiXSwibmFtZXMiOlsibWFnbmlmeSIsImNvbnNvbGUiLCJsb2ciLCJpbWdJRCIsInpvb20iLCJpbWciLCJnbGFzcyIsInciLCJoIiwiYnciLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsInBhcmVudEVsZW1lbnQiLCJpbnNlcnRCZWZvcmUiLCJzdHlsZSIsImJhY2tncm91bmRJbWFnZSIsInNyYyIsImJhY2tncm91bmRSZXBlYXQiLCJiYWNrZ3JvdW5kU2l6ZSIsIndpZHRoIiwiaGVpZ2h0Iiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJhZGRFdmVudExpc3RlbmVyIiwibW92ZU1hZ25pZmllciIsImUiLCJwb3MiLCJ4IiwieSIsInByZXZlbnREZWZhdWx0IiwiZ2V0Q3Vyc29yUG9zIiwibGVmdCIsInRvcCIsImJhY2tncm91bmRQb3NpdGlvbiIsImEiLCJ3aW5kb3ciLCJldmVudCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInBhZ2VYIiwicGFnZVkiLCJwYWdlWE9mZnNldCIsInBhZ2VZT2Zmc2V0Il0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUVBQSxRQUFRLFVBQVIsRUFBb0IsQ0FBcEI7QUFDQUMsUUFBUUMsR0FBUixDQUFZLGNBQVo7O0FBRUEsU0FBU0YsT0FBVCxDQUFpQkcsS0FBakIsRUFBd0JDLElBQXhCLEVBQThCO0FBQzVCLE1BQUlDLEdBQUosRUFBU0MsS0FBVCxFQUFnQkMsQ0FBaEIsRUFBbUJDLENBQW5CLEVBQXNCQyxFQUF0QjtBQUNBSixRQUFNSyxTQUFTQyxjQUFULENBQXdCUixLQUF4QixDQUFOOztBQUVBO0FBQ0FHLFVBQVFJLFNBQVNFLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUjtBQUNBTixRQUFNTyxZQUFOLENBQW1CLE9BQW5CLEVBQTRCLHFCQUE1Qjs7QUFFQTtBQUNBUixNQUFJUyxhQUFKLENBQWtCQyxZQUFsQixDQUErQlQsS0FBL0IsRUFBc0NELEdBQXRDOztBQUVBO0FBQ0FDLFFBQU1VLEtBQU4sQ0FBWUMsZUFBWixHQUE4QixVQUFVWixJQUFJYSxHQUFkLEdBQW9CLElBQWxEO0FBQ0FaLFFBQU1VLEtBQU4sQ0FBWUcsZ0JBQVosR0FBK0IsV0FBL0I7QUFDQWIsUUFBTVUsS0FBTixDQUFZSSxjQUFaLEdBQThCZixJQUFJZ0IsS0FBSixHQUFZakIsSUFBYixHQUFxQixLQUFyQixHQUE4QkMsSUFBSWlCLE1BQUosR0FBYWxCLElBQTNDLEdBQW1ELElBQWhGO0FBQ0FLLE9BQUssQ0FBTDtBQUNBRixNQUFJRCxNQUFNaUIsV0FBTixHQUFvQixDQUF4QjtBQUNBZixNQUFJRixNQUFNa0IsWUFBTixHQUFxQixDQUF6Qjs7QUFFQTtBQUNBbEIsUUFBTW1CLGdCQUFOLENBQXVCLFdBQXZCLEVBQW9DQyxhQUFwQztBQUNBckIsTUFBSW9CLGdCQUFKLENBQXFCLFdBQXJCLEVBQWtDQyxhQUFsQzs7QUFFQTtBQUNBcEIsUUFBTW1CLGdCQUFOLENBQXVCLFdBQXZCLEVBQW9DQyxhQUFwQztBQUNBckIsTUFBSW9CLGdCQUFKLENBQXFCLFdBQXJCLEVBQWtDQyxhQUFsQztBQUNBLFdBQVNBLGFBQVQsQ0FBdUJDLENBQXZCLEVBQTBCO0FBQ3hCLFFBQUlDLEdBQUosRUFBU0MsQ0FBVCxFQUFZQyxDQUFaO0FBQ0E7QUFDQUgsTUFBRUksY0FBRjtBQUNBO0FBQ0FILFVBQU1JLGFBQWFMLENBQWIsQ0FBTjtBQUNBRSxRQUFJRCxJQUFJQyxDQUFSO0FBQ0FDLFFBQUlGLElBQUlFLENBQVI7QUFDQTtBQUNBLFFBQUlELElBQUl4QixJQUFJZ0IsS0FBSixHQUFhZCxJQUFJSCxJQUF6QixFQUFnQztBQUFDeUIsVUFBSXhCLElBQUlnQixLQUFKLEdBQWFkLElBQUlILElBQXJCO0FBQTRCO0FBQzdELFFBQUl5QixJQUFJdEIsSUFBSUgsSUFBWixFQUFrQjtBQUFDeUIsVUFBSXRCLElBQUlILElBQVI7QUFBYztBQUNqQyxRQUFJMEIsSUFBSXpCLElBQUlpQixNQUFKLEdBQWNkLElBQUlKLElBQTFCLEVBQWlDO0FBQUMwQixVQUFJekIsSUFBSWlCLE1BQUosR0FBY2QsSUFBSUosSUFBdEI7QUFBNkI7QUFDL0QsUUFBSTBCLElBQUl0QixJQUFJSixJQUFaLEVBQWtCO0FBQUMwQixVQUFJdEIsSUFBSUosSUFBUjtBQUFjO0FBQ2pDO0FBQ0FFLFVBQU1VLEtBQU4sQ0FBWWlCLElBQVosR0FBb0JKLElBQUl0QixDQUFMLEdBQVUsSUFBN0I7QUFDQUQsVUFBTVUsS0FBTixDQUFZa0IsR0FBWixHQUFtQkosSUFBSXRCLENBQUwsR0FBVSxJQUE1QjtBQUNBO0FBQ0FGLFVBQU1VLEtBQU4sQ0FBWW1CLGtCQUFaLEdBQWlDLE9BQVFOLElBQUl6QixJQUFMLEdBQWFHLENBQWIsR0FBaUJFLEVBQXhCLElBQThCLE1BQTlCLElBQXlDcUIsSUFBSTFCLElBQUwsR0FBYUksQ0FBYixHQUFpQkMsRUFBekQsSUFBK0QsSUFBaEc7QUFDRDs7QUFFRCxXQUFTdUIsWUFBVCxDQUFzQkwsQ0FBdEIsRUFBeUI7QUFDdkIsUUFBSVMsQ0FBSjtBQUFBLFFBQU9QLElBQUksQ0FBWDtBQUFBLFFBQWNDLElBQUksQ0FBbEI7QUFDQUgsUUFBSUEsS0FBS1UsT0FBT0MsS0FBaEI7QUFDQTtBQUNBRixRQUFJL0IsSUFBSWtDLHFCQUFKLEVBQUo7QUFDQTtBQUNBVixRQUFJRixFQUFFYSxLQUFGLEdBQVVKLEVBQUVILElBQWhCO0FBQ0FILFFBQUlILEVBQUVjLEtBQUYsR0FBVUwsRUFBRUYsR0FBaEI7QUFDQTtBQUNBTCxRQUFJQSxJQUFJUSxPQUFPSyxXQUFmO0FBQ0FaLFFBQUlBLElBQUlPLE9BQU9NLFdBQWY7QUFDQSxXQUFPLEVBQUNkLEdBQUlBLENBQUwsRUFBUUMsR0FBSUEsQ0FBWixFQUFQO0FBQ0Q7QUFDRiIsImZpbGUiOiJyZXZlcnNvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9UT0RPXG5cbm1hZ25pZnkoXCJ2aWRlb0VBVFwiLCAzKTtcbmNvbnNvbGUubG9nKFwidGVzdCByZXZlcnNvXCIpO1xuXG5mdW5jdGlvbiBtYWduaWZ5KGltZ0lELCB6b29tKSB7XG4gIHZhciBpbWcsIGdsYXNzLCB3LCBoLCBidztcbiAgaW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW1nSUQpO1xuICBcbiAgLyogQ3JlYXRlIG1hZ25pZmllciBnbGFzczogKi9cbiAgZ2xhc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICBnbGFzcy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImltZy1tYWduaWZpZXItZ2xhc3NcIik7XG4gIFxuICAvKiBJbnNlcnQgbWFnbmlmaWVyIGdsYXNzOiAqL1xuICBpbWcucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZ2xhc3MsIGltZyk7XG4gIFxuICAvKiBTZXQgYmFja2dyb3VuZCBwcm9wZXJ0aWVzIGZvciB0aGUgbWFnbmlmaWVyIGdsYXNzOiAqL1xuICBnbGFzcy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnXCIgKyBpbWcuc3JjICsgXCInKVwiO1xuICBnbGFzcy5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gXCJuby1yZXBlYXRcIjtcbiAgZ2xhc3Muc3R5bGUuYmFja2dyb3VuZFNpemUgPSAoaW1nLndpZHRoICogem9vbSkgKyBcInB4IFwiICsgKGltZy5oZWlnaHQgKiB6b29tKSArIFwicHhcIjtcbiAgYncgPSAzO1xuICB3ID0gZ2xhc3Mub2Zmc2V0V2lkdGggLyAyO1xuICBoID0gZ2xhc3Mub2Zmc2V0SGVpZ2h0IC8gMjtcbiAgXG4gIC8qIEV4ZWN1dGUgYSBmdW5jdGlvbiB3aGVuIHNvbWVvbmUgbW92ZXMgdGhlIG1hZ25pZmllciBnbGFzcyBvdmVyIHRoZSBpbWFnZTogKi9cbiAgZ2xhc3MuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3ZlTWFnbmlmaWVyKTtcbiAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW92ZU1hZ25pZmllcik7XG4gIFxuICAvKmFuZCBhbHNvIGZvciB0b3VjaCBzY3JlZW5zOiovXG4gIGdsYXNzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgbW92ZU1hZ25pZmllcik7XG4gIGltZy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIG1vdmVNYWduaWZpZXIpO1xuICBmdW5jdGlvbiBtb3ZlTWFnbmlmaWVyKGUpIHtcbiAgICB2YXIgcG9zLCB4LCB5O1xuICAgIC8qIFByZXZlbnQgYW55IG90aGVyIGFjdGlvbnMgdGhhdCBtYXkgb2NjdXIgd2hlbiBtb3Zpbmcgb3ZlciB0aGUgaW1hZ2UgKi9cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgLyogR2V0IHRoZSBjdXJzb3IncyB4IGFuZCB5IHBvc2l0aW9uczogKi9cbiAgICBwb3MgPSBnZXRDdXJzb3JQb3MoZSk7XG4gICAgeCA9IHBvcy54O1xuICAgIHkgPSBwb3MueTtcbiAgICAvKiBQcmV2ZW50IHRoZSBtYWduaWZpZXIgZ2xhc3MgZnJvbSBiZWluZyBwb3NpdGlvbmVkIG91dHNpZGUgdGhlIGltYWdlOiAqL1xuICAgIGlmICh4ID4gaW1nLndpZHRoIC0gKHcgLyB6b29tKSkge3ggPSBpbWcud2lkdGggLSAodyAvIHpvb20pO31cbiAgICBpZiAoeCA8IHcgLyB6b29tKSB7eCA9IHcgLyB6b29tO31cbiAgICBpZiAoeSA+IGltZy5oZWlnaHQgLSAoaCAvIHpvb20pKSB7eSA9IGltZy5oZWlnaHQgLSAoaCAvIHpvb20pO31cbiAgICBpZiAoeSA8IGggLyB6b29tKSB7eSA9IGggLyB6b29tO31cbiAgICAvKiBTZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBtYWduaWZpZXIgZ2xhc3M6ICovXG4gICAgZ2xhc3Muc3R5bGUubGVmdCA9ICh4IC0gdykgKyBcInB4XCI7XG4gICAgZ2xhc3Muc3R5bGUudG9wID0gKHkgLSBoKSArIFwicHhcIjtcbiAgICAvKiBEaXNwbGF5IHdoYXQgdGhlIG1hZ25pZmllciBnbGFzcyBcInNlZXNcIjogKi9cbiAgICBnbGFzcy5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBcIi1cIiArICgoeCAqIHpvb20pIC0gdyArIGJ3KSArIFwicHggLVwiICsgKCh5ICogem9vbSkgLSBoICsgYncpICsgXCJweFwiO1xuICB9XG4gIFxuICBmdW5jdGlvbiBnZXRDdXJzb3JQb3MoZSkge1xuICAgIHZhciBhLCB4ID0gMCwgeSA9IDA7XG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgIC8qIEdldCB0aGUgeCBhbmQgeSBwb3NpdGlvbnMgb2YgdGhlIGltYWdlOiAqL1xuICAgIGEgPSBpbWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgLyogQ2FsY3VsYXRlIHRoZSBjdXJzb3IncyB4IGFuZCB5IGNvb3JkaW5hdGVzLCByZWxhdGl2ZSB0byB0aGUgaW1hZ2U6ICovXG4gICAgeCA9IGUucGFnZVggLSBhLmxlZnQ7XG4gICAgeSA9IGUucGFnZVkgLSBhLnRvcDtcbiAgICAvKiBDb25zaWRlciBhbnkgcGFnZSBzY3JvbGxpbmc6ICovXG4gICAgeCA9IHggLSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgeSA9IHkgLSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgcmV0dXJuIHt4IDogeCwgeSA6IHl9O1xuICB9XG59Il19