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
      Player.mirror();
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
            if (item.next !== null) {
              item.isMoving = false;
              item.next.moveTo(item);
            }
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
//var item2 = new Item("torso", "#000000");


/*var item3 = new Item("social-facebook", "#5CD1FF");
var item4 = new Item("paypal", "#FFF15C");
var item5 = new Item("link", "#64F592");*/

//item2.innerHTML = "I";

menu.add(item1);
//menu.add(item2);

$(document).delay(50).queue(function (next) {
  menu.open();
  next();
  $(document).delay(1000).queue(function (next) {
    menu.close();
    next();
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbnVJbnN0cnVtZW50LmpzIl0sIm5hbWVzIjpbInRpbWVPdXQiLCJJdGVtIiwiaWNvbiIsImJhY2tncm91bmRDb2xvciIsIm5hbWUiLCIkZWxlbWVudCIsIiQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhZGRDbGFzcyIsImNzcyIsImkiLCJ1bmRlZmluZWQiLCJpbm5lckhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIlBsYXllciIsIm1pcnJvciIsInNldEF0dHJpYnV0ZSIsImFwcGVuZCIsInByZXYiLCJuZXh0IiwiaXNNb3ZpbmciLCJlbGVtZW50Iiwib24iLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwibW92ZVRvIiwiaXRlbSIsImFuaW1lIiwidGFyZ2V0cyIsImxlZnQiLCJ0b3AiLCJkdXJhdGlvbiIsImVsYXN0aWNpdHkiLCJ1cGRhdGVQb3NpdGlvbiIsIk1lbnUiLCJtZW51IiwidGV4dCIsInNpemUiLCJmaXJzdCIsImxhc3QiLCJoYXNNb3ZlZCIsInN0YXR1cyIsImNsaWNrIiwiZHJhZ2dhYmxlIiwic3RhcnQiLCJjbG9zZSIsImRyYWciLCJzdG9wIiwiYWZ0ZXIiLCJjdXJyZW50IiwiaXRlcmF0b3IiLCJoZWFkIiwic2VucyIsInBhcnNlSW50Iiwib3BlbiIsIml0ZW0xIiwiYWRkIiwiZGVsYXkiLCJxdWV1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSUEsT0FBSjs7SUFFTUMsSTtBQUNKLGdCQUFZQyxJQUFaLEVBQWtCQyxlQUFsQixFQUFrQ0MsSUFBbEMsRUFBd0M7QUFBQTs7QUFDdEMsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkMsRUFBRUMsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFGLENBQWhCO0FBQ0EsU0FBS04sSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0csUUFBTCxDQUFjSSxRQUFkLENBQXVCLE1BQXZCO0FBQ0Y7QUFDRTtBQUNBLFNBQUtKLFFBQUwsQ0FB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LEtBQUtxQixHQUFMLENBQVNELEtBQVQ7QUFDQTs7QUFFQW5ELEVBQUVDLFFBQUYsRUFBWW9ELEtBQVosQ0FBa0IsRUFBbEIsRUFBc0JDLEtBQXRCLENBQTRCLFVBQVN2QyxJQUFULEVBQWU7QUFDekNnQixPQUFLbUIsSUFBTDtBQUNBbkM7QUFDQWYsSUFBRUMsUUFBRixFQUFZb0QsS0FBWixDQUFrQixJQUFsQixFQUF3QkMsS0FBeEIsQ0FBOEIsVUFBU3ZDLElBQVQsRUFBZTtBQUMzQ2dCLFNBQUtVLEtBQUw7QUFDQTFCO0FBQ0QsR0FIRDtBQUlELENBUEQiLCJmaWxlIjoibWVudUluc3RydW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdGltZU91dDtcblxuY2xhc3MgSXRlbSB7XG4gIGNvbnN0cnVjdG9yKGljb24sIGJhY2tncm91bmRDb2xvcixuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLiRlbGVtZW50ID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICB0aGlzLmljb24gPSBpY29uO1xuICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoXCJpdGVtXCIpO1xuICAvLyAgdGhpcy4kZWxlbWVudC5pbm5lclRleHQgPSBcIml0ZW1cIjtcbiAgICAvL3RoaXMuJGVsZW1lbnQuaW5uZXJIVE1MPSBcIml0ZW1cIjtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyhcImJhY2tncm91bmQtY29sb3JcIiwgYmFja2dyb3VuZENvbG9yKTtcbiAgICB2YXIgaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpXCIpO1xuICAgIGlmKG5hbWUgIT09IHVuZGVmaW5lZClcbiAgICAgIGkuaW5uZXJIVE1MID0gbmFtZTtcbiAgICAkKGkpLmFkZENsYXNzKFwicHVibGljL21lZGlhL2xvZ28vbWlycm9yLnBuZ1wiKTtcbiAgXG4gICAgaS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBQbGF5ZXIubWlycm9yKCk7XG4gICAgfSk7XG4gIFxuICAgIGkuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwicHVibGljL21lZGlhL2xvZ28vbWlycm9yLWJsYWNrLnBuZ1wiKTtcbiAgICBcbiAgXG4gIFxuICAgIHRoaXMuJGVsZW1lbnQuYXBwZW5kKGkpO1xuICAgIHRoaXMucHJldiA9IG51bGw7XG4gICAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xuICAgIHRoaXMuJGVsZW1lbnQub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZU91dCk7XG4gICAgICB0aW1lT3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQubmV4dCAmJiBlbGVtZW50LmlzTW92aW5nKSB7XG4gICAgICAgICAgZWxlbWVudC5uZXh0Lm1vdmVUbyhlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfSwgMTApO1xuICAgIH0pO1xuICB9XG4gIFxuICBtb3ZlVG8oaXRlbSkge1xuICAgIGFuaW1lKHtcbiAgICAgIHRhcmdldHM6IHRoaXMuJGVsZW1lbnRbMF0sXG4gICAgICBsZWZ0OiBpdGVtLiRlbGVtZW50LmNzcyhcImxlZnRcIiksXG4gICAgICB0b3A6IGl0ZW0uJGVsZW1lbnQuY3NzKFwidG9wXCIpLFxuICAgICAgZHVyYXRpb246IDcwMCxcbiAgICAgIGVsYXN0aWNpdHk6IDUwMFxuICAgIH0pO1xuICAgIGlmICh0aGlzLm5leHQpIHtcbiAgICAgIHRoaXMubmV4dC5tb3ZlVG8oaXRlbSk7XG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVQb3NpdGlvbigpIHtcbiAgICBhbmltZSh7XG4gICAgICB0YXJnZXRzOiB0aGlzLiRlbGVtZW50WzBdLFxuICAgICAgbGVmdDogdGhpcy5wcmV2LiRlbGVtZW50LmNzcyhcImxlZnRcIiksXG4gICAgICB0b3A6IHRoaXMucHJldi4kZWxlbWVudC5jc3MoXCJ0b3BcIiksXG4gICAgICBkdXJhdGlvbjogODBcbiAgICB9KTtcbiAgICBcbiAgICBpZiAodGhpcy5uZXh0KSB7XG4gICAgICB0aGlzLm5leHQudXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgTWVudSB7XG4gIGNvbnN0cnVjdG9yKG1lbnUsIHRleHQpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJChtZW51KTtcbiAgICB0aGlzLnNpemUgPSAwO1xuICAgIHRoaXMuZmlyc3QgPSBudWxsO1xuICAgIHRoaXMubGFzdCA9IG51bGw7XG4gICAgdGhpcy50aW1lT3V0ID0gbnVsbDtcbiAgICB0aGlzLmhhc01vdmVkID0gZmFsc2U7XG4gICAgdGhpcy5zdGF0dXMgPSBcImNsb3NlZFwiO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gIH1cbiAgXG4gIGFkZChpdGVtKSB7XG4gICAgdmFyIG1lbnUgPSB0aGlzO1xuICAgIGlmICh0aGlzLmZpcnN0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuZmlyc3QgPSBpdGVtO1xuICAgICAgdGhpcy5sYXN0ID0gaXRlbTtcbiAgICAgIHRoaXMuZmlyc3QuJGVsZW1lbnQub24oXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAobWVudS5maXJzdC5pc01vdmluZykge1xuICAgICAgICAgIG1lbnUuZmlyc3QuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZW51LmNsaWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaXRlbS4kZWxlbWVudC5kcmFnZ2FibGUoXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtZW51LmNsb3NlKCk7XG4gICAgICAgICAgICBpdGVtLmlzTW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBkcmFnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChpdGVtLm5leHQpIHtcbiAgICAgICAgICAgICAgaXRlbS5uZXh0LnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZihpdGVtLm5leHQgIT09IG51bGwpe1xuICAgICAgICAgICAgICBpdGVtLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgIGl0ZW0ubmV4dC5tb3ZlVG8oaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxhc3QubmV4dCA9IGl0ZW07XG4gICAgICBpdGVtLnByZXYgPSB0aGlzLmxhc3Q7XG4gICAgICB0aGlzLmxhc3QgPSBpdGVtO1xuICAgIH1cbiAgICB0aGlzLiRlbGVtZW50LmFmdGVyKGl0ZW0uJGVsZW1lbnQpO1xuICB9XG4gIFxuICBvcGVuKCkge1xuICAgIHRoaXMuc3RhdHVzID0gXCJvcGVuXCI7XG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLmZpcnN0Lm5leHQ7XG4gICAgdmFyIGl0ZXJhdG9yID0gMTtcbiAgICB2YXIgaGVhZCA9IHRoaXMuZmlyc3Q7XG4gICAgdmFyIHNlbnMgPSBoZWFkLiRlbGVtZW50LmNzcyhcImxlZnRcIikgPCBoZWFkLiRlbGVtZW50LmNzcyhcInJpZ2h0XCIpID8gMSA6IC0xO1xuICAgIHdoaWxlIChjdXJyZW50ICE9IG51bGwpIHtcbiAgICAgIGFuaW1lKHtcbiAgICAgICAgdGFyZ2V0czogY3VycmVudC4kZWxlbWVudFswXSxcbiAgICAgICAgbGVmdDogcGFyc2VJbnQoaGVhZC4kZWxlbWVudC5jc3MoXCJsZWZ0XCIpLCAxMCkgKyAoc2VucyAqIChpdGVyYXRvciAqIDUwKSksXG4gICAgICAgIHRvcDogaGVhZC4kZWxlbWVudC5jc3MoXCJ0b3BcIiksXG4gICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgIH0pO1xuICAgICAgaXRlcmF0b3IrKztcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgfVxuICB9XG4gIFxuICBjbG9zZSgpIHtcbiAgICB0aGlzLnN0YXR1cyA9IFwiY2xvc2VkXCI7XG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLmZpcnN0Lm5leHQ7XG4gICAgdmFyIGhlYWQgPSB0aGlzLmZpcnN0O1xuICAgIHZhciBpdGVyYXRvciA9IDE7XG4gICAgd2hpbGUgKGN1cnJlbnQgIT0gbnVsbCkge1xuICAgICAgYW5pbWUoe1xuICAgICAgICB0YXJnZXRzOiBjdXJyZW50LiRlbGVtZW50WzBdLFxuICAgICAgICBsZWZ0OiBoZWFkLiRlbGVtZW50LmNzcyhcImxlZnRcIiksXG4gICAgICAgIHRvcDogaGVhZC4kZWxlbWVudC5jc3MoXCJ0b3BcIiksXG4gICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgIH0pO1xuICAgICAgaXRlcmF0b3IrKztcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHQ7XG4gICAgfVxuICB9XG4gIFxuICBjbGljaygpIHtcbiAgICBpZiAodGhpcy5zdGF0dXMgPT0gXCJjbG9zZWRcIikge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cbiAgXG59XG5cbnZhciBtZW51ID0gbmV3IE1lbnUoXCIjbWVudV9pbnN0cnVtZW50XCIpO1xudmFyIGl0ZW0xID0gbmV3IEl0ZW0oXCJsaXN0XCIsXCIjZmZmZmZmXCIsXCJJXCIpO1xuLy92YXIgaXRlbTIgPSBuZXcgSXRlbShcInRvcnNvXCIsIFwiIzAwMDAwMFwiKTtcblxuXG4vKnZhciBpdGVtMyA9IG5ldyBJdGVtKFwic29jaWFsLWZhY2Vib29rXCIsIFwiIzVDRDFGRlwiKTtcbnZhciBpdGVtNCA9IG5ldyBJdGVtKFwicGF5cGFsXCIsIFwiI0ZGRjE1Q1wiKTtcbnZhciBpdGVtNSA9IG5ldyBJdGVtKFwibGlua1wiLCBcIiM2NEY1OTJcIik7Ki9cblxuLy9pdGVtMi5pbm5lckhUTUwgPSBcIklcIjtcblxubWVudS5hZGQoaXRlbTEpO1xuLy9tZW51LmFkZChpdGVtMik7XG5cbiQoZG9jdW1lbnQpLmRlbGF5KDUwKS5xdWV1ZShmdW5jdGlvbihuZXh0KSB7XG4gIG1lbnUub3BlbigpO1xuICBuZXh0KCk7XG4gICQoZG9jdW1lbnQpLmRlbGF5KDEwMDApLnF1ZXVlKGZ1bmN0aW9uKG5leHQpIHtcbiAgICBtZW51LmNsb3NlKCk7XG4gICAgbmV4dCgpO1xuICB9KTtcbn0pOyJdfQ==