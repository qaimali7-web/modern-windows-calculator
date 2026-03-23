const { contextBridge } = require('electron');
const { evaluateExpression } = require('./src/calculator');

contextBridge.exposeInMainWorld('electronAPI', {
  evaluateExpression: (expr) => evaluateExpression(expr)
});
