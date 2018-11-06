"use strict";

(function () {
  var list_commande = [];

  var commandeManager = {

    // request information
    addingNewCard: function addingNewCard(startP, endP) {
      return "The information are " + startP + " end " + endP + " .";
    },

    // purchase the car
    buyVehicle: function buyVehicle(model, id) {
      return "You have successfully purchased Item " + id + ", a " + model;
    },

    // arrange a viewing
    arrangeViewing: function arrangeViewing(model, id) {
      return "You have successfully booked a viewing of " + model + " ( " + id + " ) ";
    },

    /* The function that acts as a common point for function calls */
    execute: function execute(name) {
      return commandeManager[name] && commandeManager[name].apply(commandeManager, [].slice.call(arguments, 1));
    }

  };
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbW1hbmRlTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJsaXN0X2NvbW1hbmRlIiwiY29tbWFuZGVNYW5hZ2VyIiwiYWRkaW5nTmV3Q2FyZCIsInN0YXJ0UCIsImVuZFAiLCJidXlWZWhpY2xlIiwibW9kZWwiLCJpZCIsImFycmFuZ2VWaWV3aW5nIiwiZXhlY3V0ZSIsIm5hbWUiLCJhcHBseSIsInNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyJdLCJtYXBwaW5ncyI6Ijs7QUFDQSxDQUFDLFlBQVU7QUFDVCxNQUFJQSxnQkFBZ0IsRUFBcEI7O0FBR0EsTUFBSUMsa0JBQWtCOztBQUdwQjtBQUNBQyxtQkFBZSx1QkFBU0MsTUFBVCxFQUFnQkMsSUFBaEIsRUFBcUI7QUFDbEMsYUFBTyx5QkFBeUJELE1BQXpCLEdBQWtDLE9BQWxDLEdBQTRDQyxJQUE1QyxHQUFtRCxJQUExRDtBQUNELEtBTm1COztBQVFwQjtBQUNBQyxnQkFBWSxvQkFBVUMsS0FBVixFQUFpQkMsRUFBakIsRUFBcUI7QUFDL0IsYUFBTywwQ0FBMENBLEVBQTFDLEdBQStDLE1BQS9DLEdBQXdERCxLQUEvRDtBQUNELEtBWG1COztBQWFwQjtBQUNBRSxvQkFBZ0Isd0JBQVVGLEtBQVYsRUFBaUJDLEVBQWpCLEVBQXFCO0FBQ25DLGFBQU8sK0NBQStDRCxLQUEvQyxHQUF1RCxLQUF2RCxHQUErREMsRUFBL0QsR0FBb0UsS0FBM0U7QUFDRCxLQWhCbUI7O0FBa0JwQjtBQUNBRSxhQUFVLGlCQUFXQyxJQUFYLEVBQWtCO0FBQzFCLGFBQU9ULGdCQUFnQlMsSUFBaEIsS0FBeUJULGdCQUFnQlMsSUFBaEIsRUFBc0JDLEtBQXRCLENBQTZCVixlQUE3QixFQUE4QyxHQUFHVyxLQUFILENBQVNDLElBQVQsQ0FBY0MsU0FBZCxFQUF5QixDQUF6QixDQUE5QyxDQUFoQztBQUNEOztBQXJCbUIsR0FBdEI7QUF3QkQsQ0E1QkQiLCJmaWxlIjoiQ29tbWFuZGVNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4oZnVuY3Rpb24oKXtcbiAgdmFyIGxpc3RfY29tbWFuZGUgPSBbXTtcbiAgXG4gIFxuICB2YXIgY29tbWFuZGVNYW5hZ2VyID0ge1xuICAgIFxuICAgIFxuICAgIC8vIHJlcXVlc3QgaW5mb3JtYXRpb25cbiAgICBhZGRpbmdOZXdDYXJkOiBmdW5jdGlvbihzdGFydFAsZW5kUCl7XG4gICAgICByZXR1cm4gXCJUaGUgaW5mb3JtYXRpb24gYXJlIFwiICsgc3RhcnRQICsgXCIgZW5kIFwiICsgZW5kUCArIFwiIC5cIjtcbiAgICB9LFxuICAgIFxuICAgIC8vIHB1cmNoYXNlIHRoZSBjYXJcbiAgICBidXlWZWhpY2xlOiBmdW5jdGlvbiggbW9kZWwsIGlkICl7XG4gICAgICByZXR1cm4gXCJZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgcHVyY2hhc2VkIEl0ZW0gXCIgKyBpZCArIFwiLCBhIFwiICsgbW9kZWw7XG4gICAgfSxcbiAgICBcbiAgICAvLyBhcnJhbmdlIGEgdmlld2luZ1xuICAgIGFycmFuZ2VWaWV3aW5nOiBmdW5jdGlvbiggbW9kZWwsIGlkICl7XG4gICAgICByZXR1cm4gXCJZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgYm9va2VkIGEgdmlld2luZyBvZiBcIiArIG1vZGVsICsgXCIgKCBcIiArIGlkICsgXCIgKSBcIjtcbiAgICB9LFxuICAgIFxuICAgIC8qIFRoZSBmdW5jdGlvbiB0aGF0IGFjdHMgYXMgYSBjb21tb24gcG9pbnQgZm9yIGZ1bmN0aW9uIGNhbGxzICovXG4gICAgZXhlY3V0ZSA6IGZ1bmN0aW9uICggbmFtZSApIHtcbiAgICAgIHJldHVybiBjb21tYW5kZU1hbmFnZXJbbmFtZV0gJiYgY29tbWFuZGVNYW5hZ2VyW25hbWVdLmFwcGx5KCBjb21tYW5kZU1hbmFnZXIsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSApO1xuICAgIH1cbiAgICBcbiAgfTtcbn0pKCk7Il19