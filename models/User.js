//connect to mongoDB database using mongoose
const mongoose = require('mongoose');


//Define schema
const userSchema = new mongoose.Schema({
  // username: { type: String, required: true },
  // password: { type: String, required: true },
  graphqlURI: { type: String, required: true },
  query: { type: String},
  responseTime: { type: Number},
  // projects: { type: ProjectSchema}
});


//export model
module.exports = mongoose.model('User', userSchema);



