// const { fetch } = require('cross-fetch');
// const { performance } = require('perf_hooks');
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const { checkResponseTime, loadTest, checkIfQueryExist } = require('./utils');
const db = require("../models/User");
require('electron-reload')(__dirname, {
  electron: path.join('__dirname', '../', 'node_modules', '.bin', 'electron')
})
console.log(path.join('__dirname', '../', 'node_modules', '.bin', 'electron'))
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
    let userId;
    const validateUserQuery = {
      text : 'SELECT * FROM users WHERE username = $1 AND password = $2',
      values: [arg.username, arg.password],
    }

    //Check to see if valid username and password combination exists
    const validUsers = await db.query(validateUserQuery)
    if(validUsers.rows.length){
      userId=validUsers.rows[0]._id;
      event.sender.send("fromMain", true)
      // Gets sent to App.js
      event.sender.send("userIdfromMain", userId);
    } 
    // should the following go inside the above conditional?
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

//! #2 urlToMain - User selects a URL
ipcMain.on("urlToMain", async (event, arg) => {
  try {
  
    //* * ///////////////////////////////////////////////////////////////////////////////////////////////
    //* * Check if URL Exists and Insert it not
    //check if the url exists 
    const checkIfUrlExists = {
      text: 'SELECT * FROM graphqlurls WHERE url = $1 AND user_id = $2',
      values: [arg.url, arg.userID],
    };
    const existingUrlResult = await db.query(checkIfUrlExists);
    const existingUrlId = existingUrlResult.rows;
    let urlId;
    if (!existingUrlId.length) {
      const insertUrl = {
        text: 'INSERT INTO graphqlurls(url, nickname, user_id) VALUES ($1, $2, $3) RETURNING _id',
        values: [arg.url, arg.nickname, arg.userID],
      };
      const queryResult = await db.query(insertUrl);
      urlId = queryResult.rows[0]._id;
    } else {
      urlId = existingUrlId[0]._id;
    }
    // Send id  back to Home.jsx 
    event.sender.send("idFromMain", urlId)
    //* * ///////////////////////////////////////////////////////////////////////////////////////////////

   //get all queries for specific url (we have id from above)
    const getQueriesQuery = {
      text: 'SELECT _id, query_string, query_name FROM queries WHERE url_id = $1',
      values: [urlId]
    }
    const queryResult = await db.query(getQueriesQuery);
    const allQueries = queryResult.rows;
    console.log('allQueries', allQueries)
    event.sender.send("queriesFromMain", allQueries)


    // //* * /////////////////////////////////////////////////////////////////
    // //get total amount of calls from database, where the count is received in Home.jsx 
    // const getTotalAmountOfCalls = {
    //   text: 'SELECT COUNT(response_time) FROM response_times',
    // }
    // const result = await db.query(getTotalAmountOfCalls);
    // const totalResult = result.rows;
    // console.log('totalResult in electron.js: ', totalResult)
    // event.sender.send("totalCallsFromMain", totalResult)
    // //get dashboard summary for specific url - total queries, total tests, total load tests. If possible # of queries per day.
    // //* * /////////////////////////////////////////////////////////////////

    
    const query = {
      text: `SELECT gu.url, COUNT(q._id) as number_of_queries, COUNT(rt._id) as number_of_tests, COUNT(lrt._id) as number_of_load_tests
      FROM graphqlurls gu
      INNER JOIN queries q ON q.url_id = gu._id AND gu._id = $1
      INNER JOIN response_times rt ON rt.query_id = q._id
      INNER JOIN load_test_response_times lrt ON lrt.query_id = q._id
      GROUP BY gu.url
      `,
      values: [urlId]
    }
    const dashboardQueryResult = await db.query(query);
    const results = dashboardQueryResult.rows[0];
    event.sender.send("totalsFromMain", results);

  } catch (err) {
    console.log(err)
    return err;
  }  
})

//! #3 queryTestToMain - User selects a query to test
ipcMain.on("queryTestToMain", async (event, arg) => {
  try {
    let responseTime = await checkResponseTime(arg.query, arg.url);
    const queryId = await checkIfQueryExist(arg.query, arg.urlID, arg.name);
  

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Insert response time with query_id into database 
  const insertResponseTime = {
    text: 'INSERT INTO response_times(response_time, query_id, date) VALUES ($1, $2, $3)',
    values: [responseTime, queryId, new Date()]
  };
  await db.query(insertResponseTime);
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  const getResponseTimes = {
    text: 'SELECT * FROM response_times WHERE query_id = $1;',
    values: [queryId]
  };
  const responseTimesQueryResults = await db.query(getResponseTimes);
  const responseTimes = responseTimesQueryResults.rows;
  //Send back array of response times for that query
  event.sender.send("responseTimesFromMain", responseTimes);


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Once new query is in database, send updated state to Test-Query so the new query name is reflected in the dropdown
  const getQueriesQuery = {
    text: 'SELECT _id, query_string, query_name FROM queries WHERE url_id = $1',
    values: [arg.urlID]
  }
  const queryResult = await db.query(getQueriesQuery);
  const allQueries = queryResult.rows;
  event.sender.send("queriesFromMain", allQueries)
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////


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
      arg.url,
      arg.query,
    )

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //save load test results in db associating it to a specific query
    const queryId = await checkIfQueryExist(arg.query, arg.urlID, arg.loadTestQueryName);
    const insertLoadTestResults = {
      //create new row in load test response time table (date, number_of_child_processes, average_response_time, result, query_id)
        text: 'INSERT INTO load_test_response_times (date, number_of_child_processes, average_response_time, result, query_id) VALUES($1, $2, $3, $4, $5)',
        values: [new Date(), arg.numOfChildProccesses, loadTestResults.averageResponseTime, loadTestResults.successOrFailure, queryId]
      }
    await db.query(insertLoadTestResults);
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Once the load test result is inserted, we need the application to receive the new list of updated queries
    const getQueriesQuery = {
      text: 'SELECT _id, query_string, query_name FROM queries WHERE url_id = $1',
      values: [arg.urlID]
    }
    const queryResult = await db.query(getQueriesQuery);
    const allQueries = queryResult.rows;
    event.sender.send("queriesFromMain", allQueries)


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Get allLoadTestResults from database and send all load test results to LoadTest.jsx
    const selectAllLoadTestResults = {
        text: 'SELECT number_of_child_processes, average_response_time, result FROM load_test_response_times WHERE query_id = $1',
        values: [queryId]
      }
    const result = await db.query(selectAllLoadTestResults);
    const allLoadTestResults = result.rows;
    event.sender.send("loadTestResultsFromMain", allLoadTestResults);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////


  } catch (err) {
    console.log(err)
    return err;
  }  
});