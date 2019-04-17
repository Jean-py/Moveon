"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var timeOut;

var Item = function () {
  function Item(icon, backgroundColor, name) {
    _classCallCheck(this, Item);

    this.name = name;
    this.$element = $(document.createElement("div"));
    this.icon = icon;
    this.$element.addClass("item");
    //  this.$element.innerText = "item";
    //this.$element.innerHTML= "item";
    this.$element.css("background-color", backgroundColor);
    var i = document.createElement("i");
    if (name !== undefined) i.innerHTML = name;
    $(i).addClass("public/media/logo/mirror.png");

    i.addEventListener("mousedown", function (e) {
      console.log("hola");
      document.getElementsByClassName(".myplayer").style.transform = "rotateY(180deg)";
    });

    i.setAttribute("src", "public/media/logo/mirror-black.png");

    this.$element.append(i);
    this.prev = null;
    this.next = null;
    this.isMoving = false;
    var element = this;
    this.$element.on("mousemove", function () {
      clearTimeout(timeOut);
      timeOut = setTimeout(function () {
        if (element.next && element.isMoving) {
          element.next.moveTo(element);
        }
      }, 10);
    });
  }

  _createClass(Item, [{
    key: "moveTo",
    value: function moveTo(item) {
      anime({
        targets: this.$element[0],
        left: item.$element.css("left"),
        top: item.$element.css("top"),
        duration: 700,
        elasticity: 500
      });
      if (this.next) {
        this.next.moveTo(item);
      }
    }
  }, {
    key: "updatePosition",
    value: function updatePosition() {
      anime({
        targets: this.$element[0],
        left: this.prev.$element.css("left"),
        top: this.prev.$element.css("top"),
        duration: 80
      });

      if (this.next) {
        this.next.updatePosition();
      }
    }
  }]);

  return Item;
}();

var Menu = function () {
  function Menu(menu, text) {
    _classCallCheck(this, Menu);

    this.$element = $(menu);
    this.size = 0;
    this.first = null;
    this.last = null;
    this.timeOut = null;
    this.hasMoved = false;
    this.status = "closed";
    this.text = text;
  }

  _createClass(Menu, [{
    key: "add",
    value: function add(item) {
      var menu = this;
      if (this.first == null) {
        this.first = item;
        this.last = item;
        this.first.$element.on("mouseup", function () {
          if (menu.first.isMoving) {
            menu.first.isMoving = false;
          } else {
            menu.click();
          }
        });
        item.$element.draggable({
          start: function start() {
            menu.close();
            item.isMoving = true;
          }
        }, {
          drag: function drag() {
            if (item.next) {
              item.next.updatePosition();
            }
          }
        }, {
          stop: function stop() {
            item.isMoving = false;
            item.next.moveTo(item);
          }
        });
      } else {
        this.last.next = item;
        item.prev = this.last;
        this.last = item;
      }
      this.$element.after(item.$element);
    }
  }, {
    key: "open",
    value: function open() {
      this.status = "open";
      var current = this.first.next;
      var iterator = 1;
      var head = this.first;
      var sens = head.$element.css("left") < head.$element.css("right") ? 1 : -1;
      while (current != null) {
        anime({
          targets: current.$element[0],
          left: parseInt(head.$element.css("left"), 10) + sens * (iterator * 50),
          top: head.$element.css("top"),
          duration: 500
        });
        iterator++;
        current = current.next;
      }
    }
  }, {
    key: "close",
    value: function close() {
      this.status = "closed";
      var current = this.first.next;
      var head = this.first;
      var iterator = 1;
      while (current != null) {
        anime({
          targets: current.$element[0],
          left: head.$element.css("left"),
          top: head.$element.css("top"),
          duration: 500
        });
        iterator++;
        current = current.next;
      }
    }
  }, {
    key: "click",
    value: function click() {
      if (this.status == "closed") {
        this.open();
      } else {
        this.close();
      }
    }
  }]);

  return Menu;
}();

var menu = new Menu("#menu_instrument");
var item1 = new Item("list", "#ffffff", "I");
var item2 = new Item("torso", "#FF5C5C");

/*var item3 = new Item("social-facebook", "#5CD1FF");
var item4 = new Item("paypal", "#FFF15C");
var item5 = new Item("link", "#64F592");*/

//item2.innerHTML = "I";

menu.add(item1);
menu.add(item2);

$(document).delay(50).queue(function (next) {
  menu.open();
  next();
  $(document).delay(1000).queue(function (next) {
    menu.close();
    next();
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbnVJbnN0cnVtZW50LmpzIl0sIm5hbWVzIjpbInRpbWVPdXQiLCJJdGVtIiwiaWNvbiIsImJhY2tncm91bmRDb2xvciIsIm5hbWUiLCIkZWxlbWVudCIsIiQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhZGRDbGFzcyIsImNzcyIsImkiLCJ1bmRlZmluZWQiLCJpbm5lckhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwic3R5bGUiLCJ0cmFuc2Zvcm0iLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmQiLCJwcmV2IiwibmV4dCIsImlzTW92aW5nIiwiZWxlbWVudCIsIm9uIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsIm1vdmVUbyIsIml0ZW0iLCJhbmltZSIsInRhcmdldHMiLCJsZWZ0IiwidG9wIiwiZHVyYXRpb24iLCJlbGFzdGljaXR5IiwidXBkYXRlUG9zaXRpb24iLCJNZW51IiwibWVudSIsInRleHQiLCJzaXplIiwiZmlyc3QiLCJsYXN0IiwiaGFzTW92ZWQiLCJzdGF0dXMiLCJjbGljayIsImRyYWdnYWJsZSIsInN0YXJ0IiwiY2xvc2UiLCJkcmFnIiwic3RvcCIsImFmdGVyIiwiY3VycmVudCIsIml0ZXJhdG9yIiwiaGVhZCIsInNlbnMiLCJwYXJzZUludCIsIm9wZW4iLCJpdGVtMSIsIml0ZW0yIiwiYWRkIiwiZGVsYXkiLCJxdWV1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSUEsT0FBSjs7SUFFTUMsSTtBQUNKLGdCQUFZQyxJQUFaLEVBQWtCQyxlQUFsQixFQUFrQ0MsSUFBbEMsRUFBd0M7QUFBQTs7QUFDdEMsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkMsRUFBRUMsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFGLENBQWhCO0FBQ0EsU0FBS04sSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0csUUFBTCxD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QUlxQixRQUFRLElBQUkzRCxJQUFKLENBQVMsTUFBVCxFQUFnQixTQUFoQixFQUEwQixHQUExQixDQUFaO0FBQ0EsSUFBSTRELFFBQVEsSUFBSTVELElBQUosQ0FBUyxPQUFULEVBQWtCLFNBQWxCLENBQVo7O0FBR0E7Ozs7QUFJQTs7QUFFQXVDLEtBQUtzQixHQUFMLENBQVNGLEtBQVQ7QUFDQXBCLEtBQUtzQixHQUFMLENBQVNELEtBQVQ7O0FBRUF2RCxFQUFFQyxRQUFGLEVBQVl3RCxLQUFaLENBQWtCLEVBQWxCLEVBQXNCQyxLQUF0QixDQUE0QixVQUFTeEMsSUFBVCxFQUFlO0FBQ3pDZ0IsT0FBS21CLElBQUw7QUFDQW5DO0FBQ0FsQixJQUFFQyxRQUFGLEVBQVl3RCxLQUFaLENBQWtCLElBQWxCLEVBQXdCQyxLQUF4QixDQUE4QixVQUFTeEMsSUFBVCxFQUFlO0FBQzNDZ0IsU0FBS1UsS0FBTDtBQUNBMUI7QUFDRCxHQUhEO0FBSUQsQ0FQRCIsImZpbGUiOiJtZW51SW5zdHJ1bWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB0aW1lT3V0O1xuXG5jbGFzcyBJdGVtIHtcbiAgY29uc3RydWN0b3IoaWNvbiwgYmFja2dyb3VuZENvbG9yLG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICAgIHRoaXMuaWNvbiA9IGljb247XG4gICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcyhcIml0ZW1cIik7XG4gIC8vICB0aGlzLiRlbGVtZW50LmlubmVyVGV4dCA9IFwiaXRlbVwiO1xuICAgIC8vdGhpcy4kZWxlbWVudC5pbm5lckhUTUw9IFwiaXRlbVwiO1xuICAgIHRoaXMuJGVsZW1lbnQuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLCBiYWNrZ3JvdW5kQ29sb3IpO1xuICAgIHZhciBpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlcIik7XG4gICAgaWYobmFtZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgaS5pbm5lckhUTUwgPSBuYW1lO1xuICAgICQoaSkuYWRkQ2xhc3MoXCJwdWJsaWMvbWVkaWEvbG9nby9taXJyb3IucG5nXCIpO1xuICBcbiAgICBpLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiaG9sYVwiKVxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIi5teXBsYXllclwiKS5zdHlsZS50cmFuc2Zvcm0gPSBcInJvdGF0ZVkoMTgwZGVnKVwiO1xuICAgIH0pO1xuICBcbiAgICBpLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcInB1YmxpYy9tZWRpYS9sb2dvL21pcnJvci1ibGFjay5wbmdcIik7XG4gICAgXG4gIFxuICBcbiAgICB0aGlzLiRlbGVtZW50LmFwcGVuZChpKTtcbiAgICB0aGlzLnByZXYgPSBudWxsO1xuICAgIHRoaXMubmV4dCA9IG51bGw7XG4gICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgIHZhciBlbGVtZW50ID0gdGhpcztcbiAgICB0aGlzLiRlbGVtZW50Lm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVPdXQpO1xuICAgICAgdGltZU91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChlbGVtZW50Lm5leHQgJiYgZWxlbWVudC5pc01vdmluZykge1xuICAgICAgICAgIGVsZW1lbnQubmV4dC5tb3ZlVG8oZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgbW92ZVRvKGl0ZW0pIHtcbiAgICBhbmltZSh7XG4gICAgICB0YXJnZXRzOiB0aGlzLiRlbGVtZW50WzBdLFxuICAgICAgbGVmdDogaXRlbS4kZWxlbWVudC5jc3MoXCJsZWZ0XCIpLFxuICAgICAgdG9wOiBpdGVtLiRlbGVtZW50LmNzcyhcInRvcFwiKSxcbiAgICAgIGR1cmF0aW9uOiA3MDAsXG4gICAgICBlbGFzdGljaXR5OiA1MDBcbiAgICB9KTtcbiAgICBpZiAodGhpcy5uZXh0KSB7XG4gICAgICB0aGlzLm5leHQubW92ZVRvKGl0ZW0pO1xuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlUG9zaXRpb24oKSB7XG4gICAgYW5pbWUoe1xuICAgICAgdGFyZ2V0czogdGhpcy4kZWxlbWVudFswXSxcbiAgICAgIGxlZnQ6IHRoaXMucHJldi4kZWxlbWVudC5jc3MoXCJsZWZ0XCIpLFxuICAgICAgdG9wOiB0aGlzLnByZXYuJGVsZW1lbnQuY3NzKFwidG9wXCIpLFxuICAgICAgZHVyYXRpb246IDgwXG4gICAgfSk7XG4gICAgXG4gICAgaWYgKHRoaXMubmV4dCkge1xuICAgICAgdGhpcy5uZXh0LnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIE1lbnUge1xuICBjb25zdHJ1Y3RvcihtZW51LCB0ZXh0KSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICQobWVudSk7XG4gICAgdGhpcy5zaXplID0gMDtcbiAgICB0aGlzLmZpcnN0ID0gbnVsbDtcbiAgICB0aGlzLmxhc3QgPSBudWxsO1xuICAgIHRoaXMudGltZU91dCA9IG51bGw7XG4gICAgdGhpcy5oYXNNb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdHVzID0gXCJjbG9zZWRcIjtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICB9XG4gIFxuICBhZGQoaXRlbSkge1xuICAgIHZhciBtZW51ID0gdGhpcztcbiAgICBpZiAodGhpcy5maXJzdCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmZpcnN0ID0gaXRlbTtcbiAgICAgIHRoaXMubGFzdCA9IGl0ZW07XG4gICAgICB0aGlzLmZpcnN0LiRlbGVtZW50Lm9uKFwibW91c2V1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG1lbnUuZmlyc3QuaXNNb3ZpbmcpIHtcbiAgICAgICAgICBtZW51LmZpcnN0LmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVudS5jbGljaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGl0ZW0uJGVsZW1lbnQuZHJhZ2dhYmxlKFxuICAgICAgICB7XG4gICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbWVudS5jbG9zZSgpO1xuICAgICAgICAgICAgaXRlbS5pc01vdmluZyA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZHJhZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5uZXh0KSB7XG4gICAgICAgICAgICAgIGl0ZW0ubmV4dC51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaXRlbS5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgaXRlbS5uZXh0Lm1vdmVUbyhpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGFzdC5uZXh0ID0gaXRlbTtcbiAgICAgIGl0ZW0ucHJldiA9IHRoaXMubGFzdDtcbiAgICAgIHRoaXMubGFzdCA9IGl0ZW07XG4gICAgfVxuICAgIHRoaXMuJGVsZW1lbnQuYWZ0ZXIoaXRlbS4kZWxlbWVudCk7XG4gIH1cbiAgXG4gIG9wZW4oKSB7XG4gICAgdGhpcy5zdGF0dXMgPSBcIm9wZW5cIjtcbiAgICB2YXIgY3VycmVudCA9IHRoaXMuZmlyc3QubmV4dDtcbiAgICB2YXIgaXRlcmF0b3IgPSAxO1xuICAgIHZhciBoZWFkID0gdGhpcy5maXJzdDtcbiAgICB2YXIgc2VucyA9IGhlYWQuJGVsZW1lbnQuY3NzKFwibGVmdFwiKSA8IGhlYWQuJGVsZW1lbnQuY3NzKFwicmlnaHRcIikgPyAxIDogLTE7XG4gICAgd2hpbGUgKGN1cnJlbnQgIT0gbnVsbCkge1xuICAgICAgYW5pbWUoe1xuICAgICAgICB0YXJnZXRzOiBjdXJyZW50LiRlbGVtZW50WzBdLFxuICAgICAgICBsZWZ0OiBwYXJzZUludChoZWFkLiRlbGVtZW50LmNzcyhcImxlZnRcIiksIDEwKSArIChzZW5zICogKGl0ZXJhdG9yICogNTApKSxcbiAgICAgICAgdG9wOiBoZWFkLiRlbGVtZW50LmNzcyhcInRvcFwiKSxcbiAgICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgfSk7XG4gICAgICBpdGVyYXRvcisrO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICB9XG4gIH1cbiAgXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuc3RhdHVzID0gXCJjbG9zZWRcIjtcbiAgICB2YXIgY3VycmVudCA9IHRoaXMuZmlyc3QubmV4dDtcbiAgICB2YXIgaGVhZCA9IHRoaXMuZmlyc3Q7XG4gICAgdmFyIGl0ZXJhdG9yID0gMTtcbiAgICB3aGlsZSAoY3VycmVudCAhPSBudWxsKSB7XG4gICAgICBhbmltZSh7XG4gICAgICAgIHRhcmdldHM6IGN1cnJlbnQuJGVsZW1lbnRbMF0sXG4gICAgICAgIGxlZnQ6IGhlYWQuJGVsZW1lbnQuY3NzKFwibGVmdFwiKSxcbiAgICAgICAgdG9wOiBoZWFkLiRlbGVtZW50LmNzcyhcInRvcFwiKSxcbiAgICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgfSk7XG4gICAgICBpdGVyYXRvcisrO1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICB9XG4gIH1cbiAgXG4gIGNsaWNrKCkge1xuICAgIGlmICh0aGlzLnN0YXR1cyA9PSBcImNsb3NlZFwiKSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuICBcbn1cblxudmFyIG1lbnUgPSBuZXcgTWVudShcIiNtZW51X2luc3RydW1lbnRcIik7XG52YXIgaXRlbTEgPSBuZXcgSXRlbShcImxpc3RcIixcIiNmZmZmZmZcIixcIklcIik7XG52YXIgaXRlbTIgPSBuZXcgSXRlbShcInRvcnNvXCIsIFwiI0ZGNUM1Q1wiKTtcblxuXG4vKnZhciBpdGVtMyA9IG5ldyBJdGVtKFwic29jaWFsLWZhY2Vib29rXCIsIFwiIzVDRDFGRlwiKTtcbnZhciBpdGVtNCA9IG5ldyBJdGVtKFwicGF5cGFsXCIsIFwiI0ZGRjE1Q1wiKTtcbnZhciBpdGVtNSA9IG5ldyBJdGVtKFwibGlua1wiLCBcIiM2NEY1OTJcIik7Ki9cblxuLy9pdGVtMi5pbm5lckhUTUwgPSBcIklcIjtcblxubWVudS5hZGQoaXRlbTEpO1xubWVudS5hZGQoaXRlbTIpO1xuXG4kKGRvY3VtZW50KS5kZWxheSg1MCkucXVldWUoZnVuY3Rpb24obmV4dCkge1xuICBtZW51Lm9wZW4oKTtcbiAgbmV4dCgpO1xuICAkKGRvY3VtZW50KS5kZWxheSgxMDAwKS5xdWV1ZShmdW5jdGlvbihuZXh0KSB7XG4gICAgbWVudS5jbG9zZSgpO1xuICAgIG5leHQoKTtcbiAgfSk7XG59KTsiXX0=