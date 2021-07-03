//create a new server
const express = require('express'); 
//declare app to denote the Express application
const app = express(); 
// add path library to get correct file locations. 
const path = require('path'); 
const PORT = 5000;
//cookieParser for authentication
const cookieParser = require('cookie-parser');
const cors = require('cors')

app.use(cors());
//connect to mongoDB database using mongoose


//Parse URL-encoded bodies, will extract data from the <form> element and add them to the body property in the request object.
app.use(express.urlencoded({ extended: true })); 

//parse incoming requests with JSON payloads. 
app.use(express.json()); 
app.use(cookieParser()); 

app.use(express.static(path.resolve(__dirname, '../build')));


app.get('/test', (req, res) => {
  console.log('im in the get req')
  res.send('wsergwsreg')
});


//add catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});


//add global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: {
      err: 'An error occurred',
    },
  };

  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);

  return res
    .status(errorObj.status)
    .send(JSON.stringify(errorObj.message));
});


  //bind and listen for connections on the specified host and port.
  app.listen(PORT, function() {
    console.log(`Listening on ${PORT}`)
  })
// const startServer = async () => {

// };

// startServer();
