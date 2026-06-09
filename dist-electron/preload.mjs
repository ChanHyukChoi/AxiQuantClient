"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  system: {
    getMemoryUsageMb: () => electron.ipcRenderer.invoke("system:getMemoryUsageMb")
  },
  window: {
    minimize: () => electron.ipcRenderer.send("window:minimize"),
    maximize: () => electron.ipcRenderer.send("window:maximize"),
    close: () => electron.ipcRenderer.send("window:close"),
    isMaximized: () => electron.ipcRenderer.invoke("window:isMaximized"),
    onMaximizedChange: (callback) => {
      const handler = (_event, maximized) => {
        callback(maximized);
      };
      electron.ipcRenderer.on("window:maximized-changed", handler);
      return () => {
        electron.ipcRenderer.removeListener("window:maximized-changed", handler);
      };
    }
  }
});
