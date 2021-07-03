//require mongoose to connect to MongoDB database
const mongoose = require('mongoose');
//require dotenv a module that loads environment variables from a .env file into process.env. 
const dotenv = require("dotenv").config();

//get database username and password from .env file
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

//database connection  
const myURI = `mongodb+srv://${username}:${password}@cluster0.xrmkm.mongodb.net/wunderql?retryWrites=true&w=majority`

//declaring function that will connect to database when invoked and exporting it to be used in electron.js(main.js)
const connectDB = async () => {
  try {
   const conn = await mongoose.connect(myURI, 
   { 
     useNewUrlParser: true,
     useCreateIndex: true,
     useUnifiedTopology: true,
   }
  )
  console.log('MongoDB Connected');

  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}


module.exports = connectDB;



// mongoose.connect(myURI, {useNewUrlParser: true, useUnifiedTopology: true});

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
// });