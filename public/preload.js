const {
  contextBridge,
  ipcRenderer,
} = require("electron");
const { channels } = require('../src/shared/constants');
// window.ipcRenderer = require('electron').ipcRenderer;

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// contextBridge.exposeInMainWorld(

  
contextBridge.exposeInMainWorld(
  'electron', 
  {
  // sendURL: () => ipcRenderer.send(channels.GET_ENDPOINT, 'https://api.spacex.land/graphql/'),
  sendQuery: (channel, data) => ipcRenderer.on('toMain', data),
  receiveResponse: (channel, arg) => ipcRenderer.on('fromMain', arg)
  }
)


      // EXAMPLE
      // send: (channel, data) => {
      //     // whitelist channels
      //     let validChannels = ["toMain"];
      //     if (validChannels.includes(channel)) {
      //         ipcRenderer.send(channel, data);
      //     }
      // },
      // // EXAMPLE
      // receive: (channel, func) => {
      //     let validChannels = ["fromMain"];
      //     if (validChannels.includes(channel)) {
      //         // Deliberately strip event as it includes `sender` 
      //         ipcRenderer.on(channel, (event, ...args) => func(...args));
      //     }
      // },

      // "api", {
      // sendQueryToElectron: (channel, data) => {
      //   let validChannels = ['send-query'];
      //   if (validChannels.includes(channel)) {
      //     ipcRenderer.send(channel, data)
      //   }
      // },
      // receiveResponseFromElectron: (channel, func) => {
      //   let validChannels = ['receive-runtime'];
      //   if (validChannels.includes(channel)) {
      //     ipcRenderer.on(channel, (data) => {
      //       console.log('sending data from electron to renderer')
      //     })
      //   }
//       // },
//       // event.sender.send(channels.GET_RESPONSE, arg + ' This was sent to main process on electron.js, and sent back to Test-Query');
//   }
// );