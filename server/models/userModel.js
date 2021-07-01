//connect to mongoDB database using mongoose
const mongoose = require('mongoose');

// v-- REPLACE THE EMPTY STRING WITH YOUR LOCAL/MLAB/ELEPHANTSQL URI
// const myURI = 'mongodb+srv://wunderql:flrp@cluster0.xrmkm.mongodb.net/wunderql?retryWrites=true&w=majority';

// UNCOMMENT THE LINE BELOW IF USING MONGO
// const URI = process.env.MONGO_URI || myURI;



//Define schema
const userSchema = new mongoose.Schema({
  username:  { type: String, required: true }, 
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  graphqlurl: { type: Date, default: Date.now },
  queryHistory: { type: Array, require: true }

});

//create model
const userModel = mongoose.model('User', userSchema);

//export model
module.exports = userModel;



