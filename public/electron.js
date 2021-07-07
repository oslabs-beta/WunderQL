const { fetch } = require('cross-fetch');
const { performance } = require('perf_hooks');
const path = require("path");
const url = require('url');

const { app, BrowserWindow, Menu, ipcMain } = require("electron");
// const { getCurrentWindow } = require("electron");
const { channels } = require('../src/shared/constants');
const isDev = require("electron-is-dev");
const User = require('../models/User');
const connectDB = require('../config/db');

// Connnect to mongo database
// connectDB();

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
      // preload: path.join(__dirname, 'preload.js')
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
  let time2 = performance.now();
  return time2 - time1;
};

// WHAT IS THIS?
// Receiving the data in the main process
ipcMain.on(channels.GET_DATA, (event, arg) => {
  // Sending a response back to the renderer process (React)
  console.log('Data is within main process')
  event.sender.send(channels.GET_DATA, arg);
});

// Listening on channel 'get_endpoint' to receive endpoint from frontend
ipcMain.on(channels.GET_ENDPOINT, async (event, graphqlEndpoint) => {
  console.log('im in the endpoint listener function in electron.js')
  await User.create( { graphqlURI : graphqlEndpoint }, (err, result) => {
      console.log('im inside the user creation');
      if (err) console.log(err);
      console.log(result);
    });
    // retrieve history data from DB
    const data = [];
    event.sender.send(channels.GET_HISTORY, data);
})


// Async await --- wait for function to finish before ipcMain sends back response
// Sending a response back to the renderer process (React)
ipcMain.on(channels.GET_RESPONSE_TIME, async (event, arg) => {
  let responseTime = await checkResponseTime(arg);
  await User.updateOne({_id: '60e4f89ed85c813fa67d17eb'}, {"query" : arg}, (err, result) => {
    if (err){
      console.log(err)
      return err;
    }
    console.log('Query was successfully added!');
    event.sender.send(channels.GET_RESPONSE_TIME, responseTime);
  });
});

//----------------------------------------
// Example queries for https://api.spacex.land/graphql/
// query {
//   launchesPast(limit: 10) {
//     mission_name
//     launch_date_local
//     launch_site {
//       site_name_long
//     }
//   }
// }
// 
// client.query({
//   query: gql`
//     query {
//       launchesPast(limit: 10) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }
//   `
// }).then(result => console.log(result))
//----------------------------------------
