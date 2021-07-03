const path = require("path");
const url = require('url');

const { app, BrowserWindow, ipcMain } = require("electron");
const { channels } = require('../src/shared/constants');
const isDev = require("electron-is-dev");

// let win;
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
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

const products = {
  notebook: {
    name: 'notebook',
    price: '2500',
    color: 'gray',
  },
  headphone: {
    name: 'headphone',
    price: '700',
    color: 'black',
  },
};


// Receiving the data in the main process
ipcMain.on(channels.GET_DATA, (event, arg) => {
  // const { product } = arg;
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.