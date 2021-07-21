const { performance } = require('perf_hooks');
const { fetch } = require('cross-fetch');
const childProc = require('child_process');
const db = require('../models/User');

// Function that checks response time of query
async function checkResponseTime(query, uri_ID) {
  const time1 = performance.now();
  await fetch(uri_ID, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        ${query}
      `,
    }),
  });
  return performance.now() - time1;
}

// Function that conducts load test on endpoint
const loadTest = async (CHILD_PROCESSES, URL, QUERY) => {

  const times = []; // array of response times of all child processes
  const children = []; // array of all child processes created

  for (let i = 0; i < CHILD_PROCESSES; i++) {
    // Spawn the child process
    const childProcess = childProc.spawn('node', [`${__dirname}/child.js`, `--url=${URL}`, `--query=${QUERY}`]);
    children.push(childProcess);
  }
  // Map child processes into promises that resolve to true or false 
  // Response times will be pushed to times array each time child process logs the response time
  let responses = children.map(function wait(child) {
    return new Promise(function c(res) {
      child.stdout.on('data', (data) => {
        console.log(`child stdout: ${data}`);
        times.push(parseInt(data));
      });
      child.on('exit', function (code) {
        if (code === 0) {
          res(true);
        } else {
          res(false);
        }
      });
    });
  });
  
  // Wait until all promises have been resolved
  responses = await Promise.all(responses);

  // Check if all promises were resolved successfully 
  let successOrFailure;
  let averageResponseTime;
  if (responses.filter(Boolean).length === responses.length) {
    // Calculate average of all response times
    const sum = times.reduce((a, b) => a + b, 0);
    const avg = (sum / times.length) || 0;
    console.log(`average: ${avg}`);
    console.log('success!');  
    // Update load test response variables
    successOrFailure = 'success';
    averageResponseTime = avg;
  } else {
    console.log('failures!');
    // Update load test response variables
    successOrFailure = 'failure';
    averageResponseTime = 0;
  }

  // Return whether load test was success/failure, and the average response time
  return {
    successOrFailure,
    averageResponseTime
  };
};

// Function that checks if query exists in db
async function checkIfQueryExist(queryString, urlId, queryName)  {

  const checkIfQueryExist = {
    text: 'select _id FROM queries WHERE query_string = $1 AND url_id = $2',
    values: [queryString, urlId]
  };
  // console.log('queryString: ', queryString);
  // console.log('urlId: ', urlId);

  const existingQueryResult = await db.query(checkIfQueryExist);
  const existingQueryID = await existingQueryResult.rows;
  // console.log('existingQueryResult in checkIfQueryExist: ', existingQueryResult)
  // console.log('existingQueryID in checkIfQueryExist: ', existingQueryID)

  let queryId;

  if (existingQueryID.length === 0) {
    const insertQuery = {
      text: 'INSERT INTO queries(query_string, url_id, query_name) VALUES ($1, $2, $3) RETURNING _id',
      values: [queryString, urlId, queryName],
    };
    const queryResult = await db.query(insertQuery);
    queryId = queryResult.rows[0]._id;
  } else {
    queryId = existingQueryID[0]._id;
  }
  console.log('queryId that is returned from checkIfQueryExist' );
  return queryId;
}

module.exports = {
  checkResponseTime,
  loadTest,
  checkIfQueryExist
};