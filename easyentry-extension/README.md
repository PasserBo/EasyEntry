# EasyEntry Chrome Extension

A Chrome extension that simplifies job application processes in Japan by auto-filling forms with your pre-configured profile data.

## Features

- **Firebase Authentication**: Secure login using your EasyEntry web app account
- **Preset Management**: Select from your pre-configured application presets
- **Smart Form Filling**: Automatically fills out job application forms on supported websites
- **Rikunabi Support**: Optimized for Rikunabi job application forms
- **Generic Form Support**: Fallback support for other job application websites

## Installation

### Development Setup

1. **Build the Extension**:
   ```bash
   npm run build
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Usage

1. **Login**: Click the extension icon and login with your EasyEntry account
2. **Select Preset**: Choose which preset (combination of profile items) you want to use
3. **Navigate**: Go to a supported job application website (e.g., Rikunabi)
4. **Auto-fill**: Click "Auto-fill this Page" to populate the form with your data
5. **Review**: Always review and adjust the filled information before submitting

## Supported Websites

- **Rikunabi** (`rikunabi.com`, `point.recruit.co.jp`) - Full support for personal info, education, work experience, and self-promotion sections
- **Generic Forms** - Basic support for email and name fields on other websites

## Prerequisites

- You must have an account and profile data set up in the EasyEntry web application
- You must have created at least one preset in the web app

## Development

### Project Structure

```
easyentry-extension/
├── public/
│   ├── manifest.json         # Chrome extension configuration
│   └── content-script.js     # Script that runs on job websites
├── src/
│   ├── App.tsx              # Main popup component
│   ├── PresetSelector.tsx   # Preset selection and form filling logic
│   ├── firebaseConfig.ts    # Firebase configuration
│   ├── types.ts             # TypeScript type definitions
│   └── App.css              # Extension styling
└── dist/                    # Built extension (after npm run build)
```

### Key Files

- **manifest.json**: Defines extension permissions and target websites
- **content-script.js**: Handles form detection and filling on target websites
- **PresetSelector.tsx**: Main logic for fetching user data and communicating with content script

### Adding Support for New Websites

1. Add the website domain to `manifest.json` in the `content_scripts.matches` array
2. Update `content-script.js` to include site-specific form filling logic
3. Test thoroughly on the target website

## Security

- All data is securely stored in Firebase Firestore
- No sensitive data is stored locally in the extension
- Firebase authentication ensures only authorized users can access their data

## Troubleshooting

### Extension Not Working
- Ensure you're logged in to your EasyEntry account
- Check that you have created presets in the web app
- Verify you're on a supported website

### Form Not Filling
- Check browser console for any error messages
- Ensure the website structure hasn't changed
- Try refreshing the page and using the extension again

### Permission Issues
- Make sure all required permissions are granted when installing the extension
- Check that the manifest.json includes the target website domains

## Building for Production

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# The built extension will be in the /dist folder
```

## Contributing

When adding support for new job application websites:

1. Study the website's form structure
2. Add appropriate CSS selectors to the content script
3. Test thoroughly with real application forms
4. Update the supported websites list in this README
