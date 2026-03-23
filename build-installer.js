const electronInstaller = require('electron-winstaller');

async function createInstaller() {
  try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: './dist/ModernCalc-win32-x64',
      outputDirectory: './dist/installer',
      authors: 'Your Company',
      exe: 'ModernCalc.exe',
      name: 'ModernCalc',
      title: 'ModernCalc Setup',
      description: 'A modern Windows-style calculator with themes and scientific modes',
      version: '0.1.0',
      setupIcon: './build/calculator.ico',
      setupExe: 'ModernCalc-Setup.exe',
      noMsi: true,
      loadingGif: undefined,
      certificateFile: undefined,
      certificatePassword: undefined,
      signWithParams: undefined,
      deleteAppDataOnUninstall: false,
      remoteReleases: undefined,
      remoteToken: undefined,
      usePackageJson: false
    });
    console.log('Installer created successfully!');
  } catch (e) {
    console.log(`Error creating installer: ${e.message}`);
  }
}

createInstaller();