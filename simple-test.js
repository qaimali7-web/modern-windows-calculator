// Simple test to check Electron loading
try {
  console.log('Testing Electron require...');
  const electron = require('electron');
  console.log('Electron module loaded:', Object.keys(electron));
  console.log('app:', electron.app);
  console.log('BrowserWindow:', electron.BrowserWindow);
} catch (err) {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
}