/* eslint-disable no-restricted-globals */
  
const { contextBridge, ipcRenderer } = require("electron");
// const fs = require("fs");
// const i18nextBackend = require("i18next-electron-fs-backend");
// const Store = require("secure-electron-store").default;
// const ContextMenu = require("secure-electron-context-menu").default;
// const SecureElectronLicenseKeys = require("secure-electron-license-keys");

// Create the electron store to be made available in the renderer process
// const store = new Store();

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "api", {
    // i18nextElectronBackend: i18nextBackend.preloadBindings(ipcRenderer),
    // store: store.preloadBindings(ipcRenderer, fs),
    // contextMenu: ContextMenu.preloadBindings(ipcRenderer),
    // licenseKeys: SecureElectronLicenseKeys.preloadBindings(ipcRenderer),

    send: (channel, data) => {
      // whitelist channels
      console.log('this is in send within preload.js')
      let validChannels = ["toMain", "EndpointToMain", "QueryDetailstoMain"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      console.log('im in receive in preload.js')
      let validChannels = ["fromMain"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => { 
          func(...args);
        });
      }
    },
    receiveArray: (channel, arg) => {
      let validChannels = ["ResponseTimesFromMain"];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, arg));
      }
    },
});