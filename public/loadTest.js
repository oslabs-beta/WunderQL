// const childProc = require("child_process");
// const CHILD_PROCESSES = 1;
// const URL = 'http://localhost:4000/graphql';
(async (CHILD_PROCESSES, URL) => {
  let times = [];
  let children = [];

  for (let i = 0; i < CHILD_PROCESSES; i++) {
    // let childProcess = childProc.spawn("node", ["child.js", `--url=${URL}`])
    let test = require('child_process').fork(__dirname + '/child.js', [`--url=${URL}`]); //change the path depending on where the file is.
    console.log(test)
    children.push(test);
  }

  // console.log(children)
  let responses = children.map(function wait(child) {
    return new Promise(function c(res) {
      child.on('data', (data) => {
        console.log(`child stdout: ${data}`);
        times.push(parseInt(data));
      });
      child.on("exit", function (code) {
        if (code === 0) {
          res(true);
        } else {
          res(false);
        }
      });
    });
  });

  responses = await Promise.all(responses);

  if (responses.filter(Boolean).length === responses.length) {
    const sum = times.reduce((a, b) => a + b, 0);
    const avg = (sum / times.length) || 0;
    console.log(`average: ${avg}`);
    console.log("success!");
  } else {
    console.log("failures!");
  }
})();




// (async () => {
//   let times = [];
//   let children = [];

//   for (let i = 0; i < CHILD_PROCESSES; i++) {
//     let childProcess = childProc.spawn("node", ["child.js", `--url=${URL}`])
//     children.push(childProcess);
//   }

//   let responses = children.map(function wait(child) {
//     return new Promise(function c(res) {
//       child.stdout.on('data', (data) => {
//         console.log(`child stdout: ${data}`);
//         times.push(parseInt(data));
//       });
//       child.on("exit", function (code) {
//         if (code === 0) {
//           res(true);
//         } else {
//           res(false);
//         }
//       });
//     });
//   });

//   responses = await Promise.all(responses);

//   if (responses.filter(Boolean).length === responses.length) {
//     const sum = times.reduce((a, b) => a + b, 0);
//     const avg = (sum / times.length) || 0;
//     console.log(`average: ${avg}`);
//     console.log("success!");
//   } else {
//     console.log("failures!");
//   }
// })();






















// // const childProc = require("child_process");
// // // const CHILD_PROCESSES = 29;
// // // const URL = 'http://localhost:4000/graphql';

// // // "Using multiple processes is the best way to scale a Node.js application"
// // // Node.js is designed to be built as a distributed system(s?) and application with many (nodes?)
// // // It's important to remember that child processes are designed to not be created manually,
// // // be only returned from the spawn method
// // //
// // const loadTest = async (CHILD_PROCESSES, URL) => {
// //   // array that will contain data from the child processes 
// //   let times = [];
// //   let children = [];

// //   for (let i = 0; i < CHILD_PROCESSES; i++) {
// //     // Spawn new child processes, and returns a new child process that is created
// //     // Arguments = [environment we want to use ], [[optional child file], [the url]
// //     let childProcess = childProc.spawn("node", ["child.js", `--url=${URL}`])
// //     children.push(childProcess);
// //   }


// // // We want to run hundreds of processes, wait for them to be finished and then check how many
// // // of them successful and how many of them are failures, and check average time of the requyests 
// // // and getting the response from the server

// // // Each child process, at the end of the process, is wrting the duration of the request in child.js

// //   // responses = array of all child processes that were created 
// //   // we're using the map function to change the child processes into promises 
// //   // each time the child will print somethign to the standard output, we will just parse that data, and push it into times
// //   let responses = children.map(function wait(child) {
// //     return new Promise(function c(res) {
// //       child.stdout.on('data', (data) => {
// //         console.log(`child stdout: ${data}`);
// //         times.push(parseInt(data)); 
// //       });
// //       // each time, the child will finish/exit
// //       child.on("exit", function (code) {
// //         // then we'll just resolve the promise, either with true or false 
// //         if (code === 0) {
// //           // If the exitCode is 0, we'll resolve the promise with true 
// //           res(true);
// //         } else {
// //           // If the exitCode is 0, we'll resolve the promise with false 
// //           res(false);
// //         }
// //       });
// //     });
// //   });

// //   // Use Promise.all to wait until all promises have been resolved 
// //   responses = await Promise.all(responses);

// //   // check if all promises were resolved successfully by filtering the booleans
// //   // of the array and then check the length. Then we;ll be able to verify if all booleans 
// //   // in the array are successfully 
// //   if (responses.filter(Boolean).length === responses.length) {
// //     const sum = times.reduce((a, b) => a + b, 0);
// //     const avg = (sum / times.length) || 0;
// //     console.log(`average: ${avg}`);
// //     console.log("success!");
// //   } else {
// //     console.log("failures!");
// //   }
// // };

// // module.exports = { loadTest }


// // // the loop is actually creating each child process and that process is executing the HTTP call in its own node event-loop ala Parallel


