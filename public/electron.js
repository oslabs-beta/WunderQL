const { fetch } = require('cross-fetch');
const { ApolloClient, InMemoryCache, gql, ApolloProvider, HttpLink } = require('@apollo/client');
const path = require("path");
const url = require('url');
const { app, BrowserWindow, ipcMain } = require("electron");
const { channels } = require('../src/shared/constants');
const isDev = require("electron-is-dev");
const User = require('../models/User');
const connectDB = require('../config/db')
const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql', fetch }),
  cache: new InMemoryCache(),
});
const {performance} = require('perf_hooks');
// const client = new ApolloClient({
//   uri: 'https://api.spacex.land/graphql/',
//   cache: new InMemoryCache(),
// });

// Connnect to mongo database
connectDB();

let win;
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
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
    // win.webContents.openDevTools({ detach: false });
  }
  // else {
  //   require(path.join(__dirname, 'server/server'));
  // };

  win.loadURL(isDev ? 'http://localhost:3000' : url.format({
    pathname: path.join(__dirname, 'build/index.html'),
    protocol: 'file:',
    slashes: true,
}));
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
  await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        ${arg}
      `,
      // variables: {
      //   now: new Date().toISOString(),
      // },
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

// Async await --- wait for function to finish before ipcMain sends back response
ipcMain.on(channels.GET_RESPONSE, async (event, arg) => {
// Sending a response back to the renderer process (React)
let responseTime = await checkResponseTime(arg);
event.sender.send(channels.GET_RESPONSE, responseTime);
});

//----------------------------------------
// Receiving the query in the main process + sending back JSON response
// ipcMain.on(channels.GET_RESPONSE, (event, arg) => {
//   // Sending a response back to the renderer process (React)
//   console.log('Query is within main process')
//   let t0 = performance.now();
//   client.query({
//     query: gql`
//       ${arg}
//     `,
//   });
//   let time2 = performance.now();
//   event.sender.send(channels.GET_RESPONSE, time2-t0);
// // }).then(result => event.sender.send(channels.GET_RESPONSE, JSON.stringify(result)));

//   // event.sender.send(channels.GET_RESPONSE, arg + ' This was sent to main process on electron.js, and sent back to Test-Query');
// });
//----------------------------------------


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


//----------------------------------------
// traversy example code 
//https://github.com/bradtraversy/electron-course-files/blob/master/buglogger/main.js
//----------------------------------------


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.