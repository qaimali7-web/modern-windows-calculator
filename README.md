Modern Windows Calculator

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run the app:

```bash
npm start
```

Notes

- This is an Electron-based scaffold providing a modern UI, theming, history, and scientific functions.
- History is persisted to `localStorage` in the renderer process.

## Keyboard Shortcuts

The calculator supports comprehensive keyboard input:

### Basic Operations
- **Numbers (0-9)**: Direct input
- **Operators**: `+`, `-`, `*`, `/`, `%`, `(`, `)`
- **Decimal point**: `.`
- **Equals**: `Enter` or `=`
- **Backspace**: `Backspace` or `Delete`
- **Clear**: `Escape` or `C`

### Scientific Functions
- **Sine**: `Ctrl + S`
- **Cosine**: `Ctrl + C`
- **Tangent**: `Ctrl + T`
- **Natural Log**: `Ctrl + L`
- **Power**: `^` (use as `x^y`)

### Modes
- Switch between Standard and Scientific modes using the dropdown in the title bar
- Toggle between Light and Dark themes using the theme button (🌓)

Packaging for Windows

This project uses `electron-builder` to create installers and portable packages.

To prepare the build environment:

```bash
npm install
```

Then run:

```bash
npm run dist
```

The installer and distributables will appear in the `dist/` folder, including an NSIS-based setup executable.

You can customize the build configuration in `package.json` under the `build` key or by creating an `electron-builder.yml`.

Older instructions using `electron-packager`:

```bash
npm install --save-dev electron-packager
npx electron-packager . ModernCalc --platform=win32 --arch=x64 --out=dist --overwrite
```

Security

- The app uses `contextIsolation` and a minimal `preload.js`.
- The expression evaluator sanitizes characters before using `Function()`.

What's next

- Polish styles and add more themes/accents.
- Add unit tests and CI packaging.
