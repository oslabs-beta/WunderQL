const { fetch } = require('cross-fetch');
const { performance } = require('perf_hooks');
const path = require("path");
const url = require('url');
const { app, BrowserWindow, ipcMain } = require("electron");
const { channels } = require('../src/shared/constants');
const isDev = require("electron-is-dev");
const User = require('../models/User');
const connectDB = require('../config/db')

// Connnect to mongo database
connectDB();

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);


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
    event.sender.send(channels.GET_ENDPOINT, graphqlEndpoint);

})


// Async await --- wait for function to finish before ipcMain sends back response
// Sending a response back to the renderer process (React)
ipcMain.on(channels.GET_RESPONSE, async (event, arg) => {
let responseTime = await checkResponseTime(arg);
await User.updateOne({_id: '60e4f89ed85c813fa67d17eb'}, {"query" : arg}, (err, result) => {
  if (err){
    console.log(err)
    return err;
  }
  console.log('Query was successfully added!');
  event.sender.send(channels.GET_RESPONSE, responseTime);
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
