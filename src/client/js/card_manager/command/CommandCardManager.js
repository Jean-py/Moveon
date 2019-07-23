/***
 *
 * @param execute : the function to execute
 * @param undo : the undo function
 * @param card : the param card, which is a card object.
 * @constructor
 */

var CommandCreateCard = function (execute, undo,card) {
    this.execute = execute;
    this.undo = undo;
    this.card = card;
    this.timestamp = timestamp();
    this.id = createUniqueId();
};

/***
 *
 * @param execute : the function to execute
 * @param undo : the undo function
 * @param card : the param card, which is a card object.
 * @constructor
 */
var CommandDeleteCard = function (execute, undo, card) {
  this.execute = execute;
  this.undo = undo;
  this.card = card;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

/***
 *
 * @param execute
 * @param undo
 * @param log : the file obtained after picked it by the file picker in menu.js
 * @constructor
 */
var CommandLoadLog = function (execute,undo, log) {
  this.execute = execute;
  this.undo = undo;
  this.log = log;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

var CommandSaveLog = function (execute,undo) {
  this.execute = execute;
  this.undo = undo;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};


var CommandCleanSegmentHistory = function (execute,undo) {
  this.execute = execute;
  this.undo = undo;
  this.timestamp = timestamp();
  this.id = createUniqueId();
};

  
