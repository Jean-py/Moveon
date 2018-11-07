"use strict";

var CommandCreateCard = function CommandCreateCard(execute, undo, startP, endP) {
  this.execute = execute;
  this.undo = undo;
  this.startP = startP;
  this.endP = endP;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

var CommandDeleteCard = function CommandDeleteCard(execute, undo, card) {
  this.execute = execute;
  this.undo = undo;
  this.card = card;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbW1hbmQuanMiXSwibmFtZXMiOlsiQ29tbWFuZENyZWF0ZUNhcmQiLCJleGVjdXRlIiwidW5kbyIsInN0YXJ0UCIsImVuZFAiLCJ0aW1lc3RhbXAiLCJpZCIsImNyZWF0ZVVuaXF1ZUlkIiwiQ29tbWFuZERlbGV0ZUNhcmQiLCJjYXJkIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQVVDLE9BQVYsRUFBbUJDLElBQW5CLEVBQXlCQyxNQUF6QixFQUFpQ0MsSUFBakMsRUFBdUM7QUFDM0QsT0FBS0gsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsT0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsT0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsT0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsT0FBS0MsU0FBTCxHQUFpQkEsV0FBakI7QUFDQSxPQUFLQyxFQUFMLEdBQVVDLGdCQUFWO0FBQ0gsQ0FQRDs7QUFTQSxJQUFJQyxvQkFBb0IsU0FBcEJBLGlCQUFvQixDQUFVUCxPQUFWLEVBQW1CQyxJQUFuQixFQUF5Qk8sSUFBekIsRUFBK0I7QUFDckQsT0FBS1IsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsT0FBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsT0FBS08sSUFBTCxHQUFZQSxJQUFaO0FBQ0EsT0FBS0osU0FBTCxHQUFpQkEsV0FBakI7QUFDQSxPQUFLQyxFQUFMLEdBQVVDLGdCQUFWO0FBQ0QsQ0FORCIsImZpbGUiOiJDb21tYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIENvbW1hbmRDcmVhdGVDYXJkID0gZnVuY3Rpb24gKGV4ZWN1dGUsIHVuZG8sIHN0YXJ0UCwgZW5kUCkge1xuICAgIHRoaXMuZXhlY3V0ZSA9IGV4ZWN1dGU7XG4gICAgdGhpcy51bmRvID0gdW5kbztcbiAgICB0aGlzLnN0YXJ0UCA9IHN0YXJ0UDtcbiAgICB0aGlzLmVuZFAgPSBlbmRQO1xuICAgIHRoaXMudGltZXN0YW1wID0gdGltZXN0YW1wKCk7XG4gICAgdGhpcy5pZCA9IGNyZWF0ZVVuaXF1ZUlkKCk7XG59O1xuXG52YXIgQ29tbWFuZERlbGV0ZUNhcmQgPSBmdW5jdGlvbiAoZXhlY3V0ZSwgdW5kbywgY2FyZCkge1xuICB0aGlzLmV4ZWN1dGUgPSBleGVjdXRlO1xuICB0aGlzLnVuZG8gPSB1bmRvO1xuICB0aGlzLmNhcmQgPSBjYXJkO1xuICB0aGlzLnRpbWVzdGFtcCA9IHRpbWVzdGFtcCgpO1xuICB0aGlzLmlkID0gY3JlYXRlVW5pcXVlSWQoKTtcbn07XG4gIFxuICBcbiJdfQ==