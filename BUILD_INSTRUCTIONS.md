# Building Installer for Modern Windows Calculator

## Prerequisites

1. **Fix Electron Installation** (Current Issue):
   - The Electron installation is corrupted with file locks
   - To fix: Restart your computer, then run:
     ```
     npm cache clean --force
     rmdir /s /q node_modules\electron
     npm install
     ```

2. **Required Tools**:
   - Node.js 18+ and npm
   - Windows Build Tools (if not already installed)
   - At least 2GB free disk space

## Build Steps

### Option 1: Using npm scripts (Recommended)
```bash
# Install dependencies (if not already installed)
npm install

# Build the installer
npm run dist
```

### Option 2: Using electron-builder directly
```bash
# Build for Windows (64-bit)
npx electron-builder --win --x64

# Build for Windows (32-bit)  
npx electron-builder --win --ia32

# Build both architectures
npx electron-builder --win
```

## Output

The installer will be created in the `dist/` directory:
- `ModernCalc Setup x.x.x.exe` - NSIS installer
- `ModernCalc-x.x.x-win.zip` - Portable version

## Installer Features

The installer (NSIS) includes:
- Custom icon (build/calculator.ico)
- Desktop shortcut (optional)
- Start menu shortcut
- Uninstaller
- Per-user installation (not system-wide)
- Option to change installation directory

## Configuration

The build is configured in `package.json` under the `"build"` section:

- **appId**: `com.example.moderncalc`
- **productName**: `ModernCalc`
- **icon**: `build/calculator.ico`
- **target**: NSIS installer for x64 and ia32 architectures
- **NSIS options**: 
  - One-click: false (shows installation wizard)
  - Allow directory change: true
  - Create desktop shortcut: true
  - Create start menu shortcut: true

## Troubleshooting

### Common Issues

1. **"Electron not found" error**:
   ```
   npm install electron@26.6.10
   ```

2. **File lock errors (EBUSY)**:
   - Restart computer
   - Disable antivirus temporarily
   - Run Command Prompt as Administrator

3. **Build fails with signing errors**:
   - The build is configured with `"sign": false`
   - For production, obtain a code signing certificate and update `package.json`

4. **Missing icon file**:
   - Ensure `build/calculator.ico` exists
   - Convert a PNG to ICO if needed

### Testing the Installer

1. Run the generated `ModernCalc Setup x.x.x.exe`
2. Follow the installation wizard
3. Launch ModernCalc from Start Menu or Desktop
4. Test calculator functionality

## Manual Build Script

If the npm scripts fail, use `build-installer.bat` (provided in the project root).

## Notes

- The application uses Electron 26.6.10 for compatibility
- mathjs library is used for safe expression evaluation
- All source code is modularized for maintainability
- CSS includes light/dark/green theme support