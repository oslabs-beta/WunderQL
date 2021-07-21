const { Pool } = require('pg');

// const PG_URI = process.env.URI;
const PG_URI = 'postgres://vxomtddv:XG7jUmeBbs-gAMu1mI6Bc1jkjQ57eU7m@batyr.db.elephantsql.com/vxomtddv';

// OLD postgres://rdkcxpwo:pI26-hSpDUGFQcUjN6Z5yUFQ0-cAVuCe@batyr.db.elephantsql.com/rdkcxpwo
// NEW postgres://gwaljhkk:vSwCR3EcsirzCXYoppxs0e8-GAor-8_W@batyr.db.elephantsql.com/gwaljhkk
// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  }
};




// //connect to mongoDB database using mongoose
// const mongoose = require('mongoose');

// const querySchema = new mongoose.Schema({
//   name: { type: String },
//   history:  [
//     {
//       created: {type: Date, default: Date.now()},
//       responseTime: Number,
//     }
//   ]
// })

// const projectSchema = new mongoose.Schema({
//   name: { type: String },
//   graphqlURI: { type: String },
//   queries: { type: { querySchema } },
  
// })

// const testUserSchemaSimplified = new mongoose.Schema({
//   // username: { type: String, required: true },
//   // password: { type: String, required: true },
//   projects: { type: { projectSchema } }
// });


// //Define schema
// const userSchema = new mongoose.Schema({
//   // username: { type: String, required: true },
//   // password: { type: String, required: true },
//   graphqlURI: { type: String, required: true },
//   query: { type: String},
//   responseTime: { type: Number},
// });

// //export model
// module.exports = {
//   User: mongoose.model('User', userSchema),
//   testUserSimplified: mongoose.model('TestUser', testUserSchemaSimplified )
// };


// ELECTRON.JS MONGO CODE






// await User.create( { graphqlURI : graphqlEndpoint }, (err, result) => {
//   console.log('im inside the user creation');
//   if (err) console.log(err);
//   console.log(result);
// });