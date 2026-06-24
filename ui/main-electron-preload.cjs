const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronApp', {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
});
