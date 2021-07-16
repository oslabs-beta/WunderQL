const { fetch } = require('cross-fetch');
const { performance } = require('perf_hooks');
const path = require("path");
const { User } = require('../models/User');

const { net } = require('electron')
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
// const { getCurrentWindow } = require("electron");
const { channels } = require('../src/shared/constants');
const isDev = require("electron-is-dev");
// const User = require('../models/User');
//SQL database connection
const db = require("../models/User");
// Connnect to mongo database

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
      nodeIntegration: true,
      // defaults to true; allows separation btw main and renderer
      // right now only works if false
      contextIsolation: false,
      enableRemoteModule: true,
    }
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);
// app.on('ready', createWindow)


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
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



ipcMain.on(channels.GET_USER_AUTH, async (event, arg) => {

  //Get Users Name and Password from Login Form
  try {
    const validateUserQuery = {
      text : 'SELECT * FROM users WHERE username = $1 AND password = $2',
      values: [arg.username, arg.password],
    }

    //Check to see if valid username and password combination exists
    const validUsers = await db.query(validateUserQuery)
    if(validUsers.rows[0]){
      console.log("true", validUsers)
    } else {
      console.log("false", validUsers)
    }

  } catch (err) {
    console.log(err)
    return err;
  }  
})

// https://github.com
// http://localhost:3000/oauth-callback
//   // const request = net.request('http://localhost:3000/oauth-callback')
//   request.on('response', (response) => {
//     console.log(response)
//     // console.log(`STATUS: ${response.statusCode}`)
//     // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
//     // response.on('data', (chunk) => {
//     //   console.log(`BODY: ${chunk}`)
//     // })
//     // response.on('end', () => {
//     //   console.log('No more data in response.')
//     // })
//   })
//   request.end()
// })

// Function that checks response time of query
// https://api.spacex.land/graphql/
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

  // Listening on channel 'get_endpoint' to receive endpoint from frontend
ipcMain.on(channels.GET_ENDPOINT, async (event, graphqlEndpoint) => {
  try {
    const insertEndpoint = {
      text: 'INSERT INTO graphqlurls(url) VALUES ($1) RETURNING _id',
      values: [graphqlEndpoint],
    };
    const queryResult = await db.query(insertEndpoint);
    const graphqlId = queryResult.rows[0]._id;
    
    // Send id  back to frontend 
    event.sender.send(channels.GET_ENDPOINT, graphqlId);
  } catch (err) {
    console.log(err)
    return err;
  }  
})

// Async await --- wait for function to finish before ipcMain sends back response
// Sending a response back to the renderer process (React)
ipcMain.on(channels.GET_RESPONSE_TIME, async (event, arg) => {

  // Insert query string and url_id into the database 
  try {
      // Checking response time 
    const { query, uriID } = arg;
    const findURI = {
      text: 'SELECT url FROM graphqlurls WHERE _id = $1',
      values: [uriID]
    }; 
    const uriQueryResult = await db.query(findURI);
    const uri = uriQueryResult.rows[0].url;
    console.log('uri from electronjs: ', uri);
    
    let responseTime = await checkResponseTime(query, uri);
    

    //--------------------
    const checkIfQueryExist = {
      text: 'select _id FROM queries WHERE query_string = $1',
      values: [query]
    };
    const existingQueryResult = await db.query(checkIfQueryExist);
    const existingQueryID = existingQueryResult.rows;
    console.log('existingQueryID', existingQueryID);
    
    let queryId;

    if (!existingQueryID.length) {
      const insertQuery = {
        text: 'INSERT INTO queries(query_string, url_id) VALUES ($1, $2) RETURNING _id',
        values: [query, uriID],
      };
      const queryResult = await db.query(insertQuery);
      console.log('queryResult', queryResult)
      queryId = queryResult.rows[0]._id;
      console.log('queryId in if condition', queryId)
    } else {
      queryId = existingQueryID[0]._id;
      console.log('queryId in else condition', queryId)
    }
    // Insert response time and query_id into database 
    // Associate response time with query_id
    // const insertResponseTime = {
    //   text: 'INSERT INTO response_times(response_time, query_id) VALUES ($1, $2)',
    //   values: [responseTime, queryId]
    // };
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
    console.log('responseTimes', responseTimes);

    // Send responseTime back to frontend 
    // Pass back array of response times that match a certain query ID
    event.sender.send(channels.GET_RESPONSE_TIME, responseTimes);
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
              
  