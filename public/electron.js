const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const { checkResponseTime, loadTest, checkIfQueryExist } = require('./utils');
const db = require('../models/User');
const url = require('url');


function createWindow() {

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
      preload: path.join(__dirname, 'preload.js'),
      disableBlinkFeatures: 'Auxclick'
    },
  });

  win.setResizable(true);

  const indexPath = url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, '../dist', 'index.html'),
    slashes: true,
  });

  win.loadURL(indexPath);


  win.on('closed', function(){
    app.quit();
  });
  
  
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

}

const mainMenuTemplate =  [
 
  {
    label: 'Raubern',
    submenu:[
      {
        label:'Add Item',
        click(){

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

];


app.on('ready', createWindow);



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});




ipcMain.on('signUpToMain', async (event, arg) => {

  let doesUserExist = false;
  console.log('from electron.js function signUpToMain', arg);
  try {

    const doesUserExistsQuery = {
      text : 'SELECT * FROM users WHERE username = $1 OR email = $2',
      values: [arg.username, arg.email],
    };


    const usersExist = await db.query(doesUserExistsQuery);
    if(usersExist.rows.length){
      doesUserExist= true;
      console.log(`doesUserExist: ${doesUserExist} Need to implement a notifcation to say User or Email already exists`);
    } else {
      const createNewUserQuery = {
        text: 'INSERT INTO users(username, password, email, name) VALUES ($1, $2, $3, $4) RETURNING _id',
        values: [arg.username, arg.password, arg.email, arg.fullName]
      };

      const newUserID = await db.query(createNewUserQuery);
      doesUserExist = true;
      event.sender.send('fromMainSignup', doesUserExist);
      console.log('newUserID from electron.js', newUserID.rows[0]._id);
      event.sender.send('userIdFromMain', newUserID.rows[0]._id);
    }


  } catch (err) {
    console.log(err);
    return err;
  }  
});


//! #1 loginToMain - User logins 
ipcMain.on('loginToMain', async (event, arg) => {

  try {
    let userId;
    const validateUserQuery = {
      text : 'SELECT * FROM users WHERE username = $1 AND password = $2',
      values: [arg.username, arg.password],
    };


    const validUsers = await db.query(validateUserQuery);

    if(validUsers.rows.length){
      userId=validUsers.rows[0]._id;
      event.sender.send('userLoggedInFromMain', true);
      event.sender.send('userIdFromMain', userId);
    } 

    console.log(userId);
 
    const getUrlsQuery = {
      text: 'SELECT _id, url, nickname FROM graphqlurls WHERE user_id = $1',
      values: [userId]
    };
    const queryResult = await db.query(getUrlsQuery);
    const results = queryResult.rows;
    event.sender.send('urlsFromMain', results);

  } catch (err) {
    console.log(err);
    return err;
  }  
});

//! #2 urlToMain - User selects a URL
ipcMain.on('urlToMain', async (event, arg) => {
  try {

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

    event.sender.send('idFromMain', urlId);

    const getQueriesQuery = {
      text: 'SELECT _id, query_string, query_name FROM queries WHERE url_id = $1',
      values: [urlId]
    };
    const queryResult = await db.query(getQueriesQuery);
    const allQueries = queryResult.rows;
    console.log('allQueries', allQueries);
    event.sender.send('queriesFromMain', allQueries);


  } catch (err) {
    console.log(err);
    return err;
  }
  
});

//! #3 queryTestToMain - User selects a query to test
ipcMain.on('queryTestToMain', async (event, arg) => {
  try {
    const responseTime = await checkResponseTime(arg.query, arg.url);
    const queryId = await checkIfQueryExist(arg.query, arg.urlID, arg.name);
  
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

    event.sender.send('responseTimesFromMain', responseTimes);

    const getQueriesQuery = {
      text: 'SELECT _id, query_string, query_name FROM queries WHERE url_id = $1',
      values: [arg.urlID]
    };
    const queryResult = await db.query(getQueriesQuery);
    const allQueries = queryResult.rows;
    event.sender.send('queriesFromMain', allQueries);



  } catch (err) {
    console.log(err);
    return err;
  }  
});

//! #4 loadTestQueryToMain - User selects a query to load test 
ipcMain.on('loadTestQueryToMain', async (event, arg) => {
  try {

    const loadTestResults = await loadTest(
      arg.numOfChildProccesses,
      arg.url,
      arg.query,
    );


    const queryId = await checkIfQueryExist(arg.query, arg.urlID, arg.loadTestQueryName);
    const insertLoadTestResults = {
      text: 'INSERT INTO load_test_response_times (date, number_of_child_processes, average_response_time, result, query_id) VALUES($1, $2, $3, $4, $5)',
      values: [new Date(), arg.numOfChildProccesses, loadTestResults.averageResponseTime, loadTestResults.successOrFailure, queryId]
    };
    await db.query(insertLoadTestResults);

    const getQueriesQuery = {
      text: 'SELECT _id, query_string, query_name FROM queries WHERE url_id = $1',
      values: [arg.urlID]
    };
    const queryResult = await db.query(getQueriesQuery);
    const allQueries = queryResult.rows;
    event.sender.send('queriesFromMain', allQueries);


    const selectAllLoadTestResults = {
      text: 'SELECT * FROM load_test_response_times WHERE query_id = $1',
      values: [queryId]
    };
    const result = await db.query(selectAllLoadTestResults);
    const allLoadTestResults = result.rows;
    event.sender.send('loadTestResultsFromMain', allLoadTestResults);



  } catch (err) {
    console.log(err);
    return err;
  }  
});

//! #5 dashboardToMain - User goes to dashboard
ipcMain.on('dashboardToMain', async (event, arg) => {
  console.log('in dashboardTomain', arg);

  const uniqueQueries = {
    text: `SELECT COUNT(q._id)
      FROM graphqlurls gu
      INNER JOIN queries q ON q.url_id = gu._id AND gu._id = $1`,
    values: [arg]
  };
  const numberOfTests = {
    text: `SELECT COUNT(rt._id)
      FROM graphqlurls gu
      INNER JOIN queries q ON q.url_id = gu._id AND gu._id = $1
      INNER JOIN response_times rt ON rt.query_id = q._id`,
    values: [arg]
  };
  const numberOfLoadTests = {
    text: `SELECT COUNT(lrt._id)
      FROM graphqlurls gu
      INNER JOIN queries q ON q.url_id = gu._id AND gu._id = $1
      INNER JOIN load_test_response_times lrt ON lrt.query_id = q._id`,
    values: [arg]
  };
  const numberOfLoadTestSuccesses = {
    text: `SELECT COUNT(lrt._id)
      FROM graphqlurls gu
      INNER JOIN queries q ON q.url_id = gu._id AND gu._id = $1
      INNER JOIN load_test_response_times lrt ON lrt.query_id = q._id AND lrt.result = 'success'`,
    values: [arg]
  };
  const numberOfLoadTestFailures = {
    text: `SELECT COUNT(lrt._id)
      FROM graphqlurls gu
      INNER JOIN queries q ON q.url_id = gu._id AND gu._id = $1
      INNER JOIN load_test_response_times lrt ON lrt.query_id = q._id AND lrt.result = 'failure'`,
    values: [arg]
  };
  const allQueries = {
    text: `SELECT rt.*
      FROM graphqlurls gu
      INNER JOIN queries q ON q.url_id = gu._id AND gu._id = $1
      INNER JOIN response_times rt ON rt.query_id = q._id`,
    values: [arg]
  };
  const allLoadTests = {
    text: `SELECT lrt.*
      FROM graphqlurls gu
      INNER JOIN queries q ON q.url_id = gu._id AND gu._id = $1
      INNER JOIN load_test_response_times lrt ON lrt.query_id = q._id`,
    values: [arg]
  };``

  const result1 = await db.query(uniqueQueries);
  const result2 = await db.query(numberOfTests);
  const result3 = await db.query(numberOfLoadTests);
  const result4 = await db.query(numberOfLoadTestSuccesses);
  const result5 = await db.query(numberOfLoadTestFailures);
  const result6 = await db.query(allQueries);
  const result7 = await db.query(allLoadTests);
  const number_of_queries = result1.rows[0].count;
  const number_of_tests = result2.rows[0].count;
  const number_of_load_tests = result3.rows[0].count;
  const number_of_load_test_successes = result4.rows[0].count;
  const number_of_load_test_failures = result5.rows[0].count;
  const all_queries = result6.rows;
  const all_load_tests = result7.rows;


  const allQueriesRan = {};
  all_queries.forEach((query, index) => {
    const date = new Date(query.date).toDateString();
    allQueriesRan[date] = (allQueriesRan[date] || 0) + 1;
  });

  const allLoadTestsRan = {};
  all_load_tests.forEach((query, index) => {
    const date = new Date(query.date).toDateString();
    allLoadTestsRan[date] = (allLoadTestsRan[date] || 0) + 1;
  });

  const queriesAndLoadsPerDay = [];
  Object.keys(allQueriesRan).forEach(el => {
    queriesAndLoadsPerDay.push({
      date: el, 
      query_tests: allQueriesRan[el], 
      query_load_tests: allLoadTestsRan[el]
    });
  });

  const results = {
    number_of_queries: number_of_queries,
    number_of_tests: number_of_tests,
    number_of_load_tests: number_of_load_tests,
    number_of_load_test_successes: number_of_load_test_successes,
    number_of_load_test_failures: number_of_load_test_failures,
    all_queries_and_load_tests: queriesAndLoadsPerDay
  };
  event.sender.send('totalsFromMain', results);
});
