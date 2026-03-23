// Debug Electron module structure
const electron = require('electron');
console.log('Electron module type:', typeof electron);
console.log('Is array?', Array.isArray(electron));
console.log('Length:', electron.length);
console.log('Keys:', Object.keys(electron).slice(0, 20));

// Try to find app property
for (let key in electron) {
  if (key === 'app' || key === 'BrowserWindow') {
    console.log(`Found ${key}:`, electron[key]);
  }
}

// Try common patterns
console.log('\nTrying alternative access patterns:');
console.log('electron.app:', electron.app);
console.log('electron.default.app:', electron.default?.app);
console.log('electron.remote?.app:', electron.remote?.app);

// Check if it's ES module
if (electron.__esModule) {
  console.log('It\'s an ES module');
  console.log('Default export:', electron.default);
}