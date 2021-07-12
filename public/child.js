const axios = require("axios");
// const argv = require('minimist')(process.argv.slice(2));
const argv = require('minimist')(process.argv);

(async () => {
  
  console.log('hello')
  axios.interceptors.request.use(function (config) {
    config.metadata = { startTime: new Date()}
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(function (response) {
    response.config.metadata.endTime = new Date()
    response.duration = response.config.metadata.endTime - response.config.metadata.startTime
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

  // console.log('argv', argv);
  // console.log('argv.url', argv.url);
  
  axios.post(argv.url, {
    query: `query {
      tickets {
        content
        author {
          name
        }
      }
    }`,})
  // axios.get(argv.url)
  .then((response) => {
    console.log(JSON.stringify(response.data))
    process.stdout.write(response.duration.toString());
    process.exitCode = 0;
  })
  .catch((error) => {
    process.exitCode = 1;
  })
  // axios.get(argv.url)
  // .then((response) => {
  //   process.stdout.write(response.duration.toString());
  //   process.exitCode = 0;
  // })
  // .catch((error) => {
  //   process.exitCode = 1;
  // })
})();


























// const axios = require("axios");
// const argv = require('minimist')(process.argv.slice(2));
// // minimist is slicing the arguments vector and removing the first two elements 
// // As a concept, ARGV is a convention in programming that goes back (at least) to the C language. It refers to the “argument vector,” which is basically a variable that contains the arguments passed to a program through the command line.
// // allows us to easily access the parametesr 
// console.log('hi')
// (async () => {
  
//   console.log('hello')
//   // Usingaxios to intercept requests 
//   axios.interceptors.request.use(function (config) {
//     // we're interested in the start time of each request before the response has been received
//     config.metadata = { startTime: new Date()}
//     return config;
//   }, function (error) {
//     return Promise.reject(error);
//   });

//   // Using axios to intercept responses
//   axios.interceptors.response.use(function (response) {
//     response.config.metadata.endTime = new Date()
//     // calculating duration of the request 
//     response.duration = response.config.metadata.endTime - response.config.metadata.startTime
//     return response;
//   }, function (error) {
//     return Promise.reject(error);
//   });

//   // Send request  
//   await axios({
//     url: argv.url,
//     method: 'post',
//     data: {
//       query: `
//       query {
//         tickets {
//           content
//           author {
//             name
//           }
//         }
//       }
//       `
//     }
//   // }).then((result) => {
//   //   console.log(result.data)
//   }).then((response) => {
//     process.stdout.write(response.duration.toString());
//     console.log('success in child.js!');
//     console.log('response duration: ', response.duration);
//     process.exitCode = 0;
//   })
//   .catch((error) => {
//     // Need to add the process exit code to 1, b/c by default it's 0. That's the default exit code meaning 
//     // that the process was successful 
//     console.log('Im in the error in child.js!')
//     console.log(error)
//     process.exitCode = 1;
//   })
// })();