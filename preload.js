const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // placeholder in case we want to expose native features later
  ping: () => 'pong'
});
