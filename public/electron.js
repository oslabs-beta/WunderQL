const path = require("path");
const url = require('url');

const { app, BrowserWindow, Menu, ipcMain, screen } = require("electron");
const { channels } = require('../src/shared/constants');
const isDev = require("electron-is-dev");
const User = require('../models/User');
const connectDB = require('../config/db')


// Connnect to mongo database
connectDB();

let win;

// const screenElectron = screen;
// const display = screenElectron.getPrimaryDisplay();
// const dimensions = display.workAreaSize;

// let win;
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1100,
    height: 700,
  //   width: parseInt(dimensions.width * 0.8),
  //   height: parseInt(dimensions.height * 0.8),
    // minWidth: parseInt(dimensions.width * 0.8),
    // minHeight: parseInt(dimensions.height * 0.8),
    minWidth: 1100,
    minHeight: 700,
    // maxWidth: dimensions.width,
    // maxHeight: dimensions.height,
    icon: `${__dirname}/assets/icon.png`,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
});

  // Quit app when closed; closes all children windows too
  win.on('closed', function(){
    app.quit();
  });
  
   // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
  
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
    })
  );
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
          createAddWindow();
        }
      },
      {
        label:'Clear Items',
        click(){
          // doesnt need a second argument cause we're just clearing; not sending any data
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator:process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
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
        label:'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label:'Clear Items',
        click(){
          // doesnt need a second argument cause we're just clearing; not sending any data
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator:process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
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
        label:'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label:'Clear Items',
        click(){
          // doesnt need a second argument cause we're just clearing; not sending any data
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator:process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
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


// Receiving the data in the main process
ipcMain.on(channels.GET_DATA, (event, arg) => {
  // Sending a response back to the renderer process (React)
  console.log('Data is within main process')
  event.sender.send(channels.GET_DATA, arg);
});

// Receiving the data in the main process
ipcMain.on(channels.GET_RESPONSE, (event, arg) => {
  // Sending a response back to the renderer process (React)
  console.log('Query is within main process')
  event.sender.send(channels.GET_RESPONSE, arg + ' This was sent to main process on electron.js, and sent back to Test-Query');
});


// import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';

// const client = new ApolloClient({
//   uri: 'https://api.spacex.land/graphql/',
//   cache: new InMemoryCache(),
// });

// query {
//   launchesPast(limit: 10) {
//     mission_name
//     launch_date_local
//     launch_site {
//       site_name_long
//     }
//   }
// }
// https://api.spacex.land/graphql/

// client.query({
//   query: gql`
// query {
//   launchesPast(limit: 10) {
//     mission_name
//     launch_date_local
//     launch_site {
//       site_name_long
//     }
//   }
// }


//----------------------------------------
// traversy example code 
//https://github.com/bradtraversy/electron-course-files/blob/master/buglogger/main.js
//----------------------------------------


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.