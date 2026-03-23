// Test Electron app module
try {
  const { app } = require('electron');
  console.log('Electron app module loaded successfully');
  console.log('app type:', typeof app);
  console.log('app.whenReady type:', typeof app.whenReady);
  
  if (app && app.whenReady) {
    console.log('✓ app.whenReady is available');
  } else {
    console.log('✗ app.whenReady is not available');
    console.log('Available app properties:', Object.keys(app || {}));
  }
} catch (err) {
  console.error('Error loading Electron:', err.message);
  console.error('Full error:', err);
}