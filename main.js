const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log('Main process starting...');
console.log('Electron app object:', typeof app);
console.log('BrowserWindow:', typeof BrowserWindow);

if (!app) {
  console.error('ERROR: app is undefined!');
  process.exit(1);
}

if (!app.whenReady) {
  console.error('ERROR: app.whenReady is not available');
  console.error('Available app properties:', Object.keys(app));
  process.exit(1);
}

function createWindow() {
  console.log('Creating browser window...');
  const win = new BrowserWindow({
    width: 420,
    height: 720,
    minWidth: 360,
    minHeight: 520,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.once('ready-to-show', () => {
    console.log('Window ready to show');
    win.show();
  });
}

app.whenReady().then(() => {
  console.log('App is ready');
  createWindow();

  app.on('activate', function () {
    console.log('App activated');
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  console.log('All windows closed');
  if (process.platform !== 'darwin') app.quit();
});

console.log('Main process setup complete');
