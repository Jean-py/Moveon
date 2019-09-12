var mongoose = require('mongoose');


var DecompositionSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  video:{
    type : String
  },
  date:{type: String},
  
  project : {
    type : String,
    unique: true,
  },
  
  data : [{
    width: {
      type :String
    } ,
    startP: {
      type :String
    } ,
    description: {
      type :String
    } ,
    endP: {
      type :String
    } ,speed: {
      type :Number
    } ,
    repetitionNumber: {
      type :Number
    } ,
    iDiv: {
      type : String
    } ,
    id: {
      type : String
    },deleted: {
      type : Boolean
    }
  }],
  
  
  
});






//Will be acceded by the logger solely
var Decomposition = mongoose.model('Decomposition', DecompositionSchema);
module.exports = Decomposition;


//{"width":"64px","startP":388.5,"endP":452,"description":"","speed":"1","repetitionNumber":"1","iDiv":{},"id":"idCard324104654301","deleted":false