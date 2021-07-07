const { fetch } = require('cross-fetch');
const { performance } = require('perf_hooks');
const path = require("path");
const { User } = require('../models/User');


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

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Function that checks response time of query
async function checkResponseTime(arg) {
  let time1 = performance.now()
  await fetch('https://api.spacex.land/graphql/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        ${arg}
      `,
    }),
  });
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
    
    // Sending endpoint back to frontend 
    event.sender.send(channels.GET_ENDPOINT, graphqlId);
  } catch (err) {
    console.log(err)
    return err;
  }  
})

// Async await --- wait for function to finish before ipcMain sends back response
// Sending a response back to the renderer process (React)
ipcMain.on(channels.GET_RESPONSE_TIME, async (event, arg) => {
  // Checking response time 
  let responseTime = await checkResponseTime(arg);
  console.log(responseTime);
  
  // Inserting query string into database 
  try {
    const insertQuery = {
      text: 'INSERT INTO queries(query_string, url_id) VALUES ($1, $2) RETURNING _id',
      values: [arg, 5],
    };
    const queryResult = await db.query(insertQuery);
    const queryId = queryResult.rows[0]._id;
    
    // Inserting response time into database 
    const insertResponseTime = {
      text: 'INSERT INTO response_times(response_time, query_id) VALUES ($1, $2)',
      values: [responseTime, queryId]
    };
    await db.query(insertResponseTime);

    // Sending responseTime back to frontend 
    event.sender.send(channels.GET_RESPONSE_TIME, responseTime);
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
              
  