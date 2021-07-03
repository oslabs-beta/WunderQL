//connect to mongoDB database using mongoose
const mongoose = require('mongoose');


//Define schema
const userSchema = new mongoose.Schema({
  username:  { type: String, required: true }, 
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  graphqlurl: { type: Date, default: Date.now },
  queryHistory: { type: Array, require: true }

});

//export model
module.exports = mongoose.model('User', userSchema);



