const { fetch } = require('cross-fetch');
const { performance } = require('perf_hooks');
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const childProc = require('child_process');
//SQL database connection
const db = require("../models/User");

//-------Electron Setup--------------------------------------------------------
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 700,
    icon: `${__dirname}/assets/icon.png`,
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      // defaults to true; allows separation btw main and renderer
      // right now only works if false
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      /* eng-disable PRELOAD_JS_CHECK */
      disableBlinkFeatures: "Auxclick"
    },
  });

  win.setResizable(true);

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Quit app when closed; closes all children windows too
  win.on('closed', function(){
    app.quit();
  });
  
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }

}

// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'Raubern',
    submenu:[
      {
        label:'Add Item',
        click(){
          // createAddWindow();
        }
      },
      {
        label:'Clear Items',
      },
      {
        label: 'Refresh',
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: 'is',
    submenu:[
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: 'dumdum',
    submenu:[
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// This method will be called when Electron has finished initialization and is ready to create browser windows.
app.whenReady().then(createWindow);
// app.on('ready', createWindow)


// Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//-------------------------------------------------------------------------------

//! #1 loginToMain - User logins 
//ipcMain.on(channels.GET_USER_AUTH, async (event, arg) => {
  ipcMain.on("loginToMain", async (event, arg) => {
  //Get Users Name and Password from Login Form
  try {
    let userId
    const validateUserQuery = {
      text : 'SELECT * FROM users WHERE username = $1 AND password = $2',
      values: [arg.username, arg.password],
    }

    //Check to see if valid username and password combination exists
    const validUsers = await db.query(validateUserQuery)
    if(validUsers.rows.length){
      userId=validUsers.rows[0]._id;
      event.sender.send("fromMain", true)
    } 

  const getUrlsQuery = {
    text: 'SELECT _id, url, nickname FROM graphqlurls WHERE user_id = $1',
    values: [userId]
  }
  const queryResult = await db.query(getUrlsQuery);
  const results = queryResult.rows;
  event.sender.send("UrlsfromMain", results)

  } catch (err) {
    console.log(err)
    return err;
  }  
});


// Function that conducts load test on endpoint
const loadTest = async (CHILD_PROCESSES, URL, QUERY) => {
  let times = []; // array of response times of all child processes
  let children = []; // array of all child processes created

  for (let i = 0; i < CHILD_PROCESSES; i++) {
    // Spawn the child process
    let childProcess = childProc.spawn("node", [`${__dirname}/child.js`, `--url=${URL}`, `--query=${QUERY}`])
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
      child.on("exit", function (code) {
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
    console.log("success!");  
    // Update load test response variables
    successOrFailure = 'success';
    averageResponseTime = avg;
  } else {
    console.log("failures!");
    // Update load test response variables
    successOrFailure = 'failure';
    averageResponseTime = 0;
  }

  // Return whether load test was success/failure, and the average response time
  return {
    successOrFailure,
    averageResponseTime
  }
};

// Function that checks response time of query
async function checkResponseTime(query, uri_ID) {
  let time1 = performance.now()
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
  })
  return performance.now() - time1;
};

//! #2 urlToMain - User selects a URL
ipcMain.on("urlToMain", async (event, arg) => {
  try {
    //check if the url exists 
    const checkIfUrlExists = {
      text: 'SELECT * FROM graphqlurls WHERE url = $1 AND user_id = $2',
      values: [arg.graphqlEndpoint, arg.userId],
    };
    const existingUrlResult = await db.query(checkIfUrlExists);
    const existingUrlId = existingUrlResult.rows;
    
    let urlId;

    if (!existingUrlId.length) {
      const insertUrl = {
        text: 'INSERT INTO graphqlurls(url, nickname, user_id) VALUES ($1, $2, $3) RETURNING _id',
        values: [arg.url, arg.nickname, arg.userId],
      };
      const queryResult = await db.query(insertUrl);
      urlId = queryResult.rows[0]._id;
    } else {
      urlId = existingUrlId[0]._id;
    }
    
    // Send id  back to frontend 
    event.sender.send("idFromMain", urlId)

   //get all queries for specific url (we have id from above)
    const getQueriesQuery = {
      text: 'SELECT _id, query_string, query_name FROM queries WHERE url_id = $1',
      values: [urlId]
    }
    const queryResult = await db.query(getQueriesQuery);
    const allQueries = queryResult.rows;

    event.sender.send("queriesfromMain", allQueries)

    //get dashboard summary for specific url - total queries, total tests, total load tests. If possible # of queries per day.

    const query = {
      text: `SELECT gu.url, COUNT(q._id) as number_of_queries, COUNT(rt._id) as number_of_tests, COUNT(lrt._id) as number_of_load_tests
      FROM graphqlurls gu 
      INNER JOIN queries q ON q.url_id = gu._id AND gu._id = $1
      INNER JOIN response_times rt ON rt.query_id = q._id
      INNER JOIN load_test_response_times lrt ON lrt.query_id = q._id
      GROUP BY gu.url
      `,
      values: [arg.urlId]
    }
  
    const dashboardQueryResult = await db.query(query);
    const results = dashboardQueryResult.rows[0];
    event.sender.send("totalsFromMain", results);

  } catch (err) {
    console.log(err)
    return err;
  }  
})

// Function that checks if query exists in db
const checkIfQueryExist = async (queryString, urlId) => {
  const checkIfQueryExist = {
    text: 'select _id FROM queries WHERE query_string = $1 AND url_id = $2',
    values: [queryString, urlId]
  };
  const existingQueryResult = await db.query(checkIfQueryExist);
  const existingQueryID = existingQueryResult.rows;
  
  let queryId;

  if (!existingQueryID.length) {
    const insertQuery = {
      text: 'INSERT INTO queries(query_string, url_id) VALUES ($1, $2) RETURNING _id',
      values: [queryString, urlId],
    };
    const queryResult = await db.query(insertQuery);
    queryId = queryResult.rows[0]._id;
  } else {
    queryId = existingQueryID[0]._id;
  }
  return queryId;
}

//! #3 queryTestToMain - User selects a query to test
ipcMain.on("queryTestToMain", async (event, arg) => {
  try {
  let responseTime = await checkResponseTime(arg.query, arg.uri);
  const queryId = checkIfQueryExist(arg.query, arg.uriID);
  
  // Insert response time with query_id into database 
  const insertResponseTime = {
    text: 'INSERT INTO response_times(response_time, query_id, date) VALUES ($1, $2, $3)',
    values: [responseTime, queryId, new Date()]
  };
  await db.query(insertResponseTime);
  
  const getResponseTimes = {
    text: 'SELECT * FROM response_times WHERE query_id = $1;',
    values: [queryId]
  };
  const responseTimesQueryResults = await db.query(getResponseTimes);
  const responseTimes = responseTimesQueryResults.rows;

  //Send back array of response times for that query
  event.sender.send("responseTimesFromMain", responseTimes);

  } catch (err) {
    console.log(err)
    return err;
  }  
});

//! #4 loadTestQueryToMain - User selects a query to load test 
ipcMain.on("loadTestQueryToMain", async (event, arg) => {
  try {
    // Conduct load test
    const loadTestResults = await loadTest(
      arg.numOfChildProccesses,
      arg.uri,
      arg.query,
    )
    // Send average response time + success/failure back to frontend 
    event.sender.send("loadTestResultsFromMain", loadTestResults)

    const queryId = checkIfQueryExist(arg.query, arg.uriID);

    //save load test results in db associating it to a specific query
    const insertLoadTestResults = {
      //create new row in load test response time table (date, number_of_child_processes, average_response_time, result, query_id)
        text: 'INSERT INTO load_test_response_times (date, number_of_child_processes, average_response_time, result, query_id) VALUES($1, $2, $3, $4, $5)',
        values: [new Date(), arg.numberOfChildProcesses, loadTestResults.averageResponseTime, loadTestResults.successOrFailure, queryId]
      }
    await db.query(insertLoadTestResults);
  
    //do we want to send history or 1 data point?: 'Select date, number_of_child_processes, average_response_time, result FROM load_test_response_times WHERE query_string = $1',

  } catch (err) {
    console.log(err)
    return err;
  }  
});
  

  //----------------------------------------
// Example queries for https://api.spacex.land/graphql/
// query {
//     launchesPast(limit: 10) {
//         mission_name
//         launch_date_local
//         launch_site {
//             site_name_long
//           }
//         }
//       }
      
      // client.query({
        //   query: gql`
            // query {
            //     launchesPast(limit: 10) {
            //         mission_name
            //         launch_date_local
            //         launch_site {
            //             site_name_long
            //           }
            //         }
            //       }
              //   `
              // }).then(result => console.log(result))
              //----------------------------------------