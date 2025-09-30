# Meeting Cost Calculator Firefox Extension

This project is a professional Firefox browser extension built with React and Vite. It calculates the cost of meetings in real time and is designed for superior UX/UI, privacy, and Slack integration via a secure production relay endpoint.

## Features

Extension folder structure for Firefox
Firefox extension manifest (manifest.json)
Placeholder icons (icon48.png, icon128.png)
Vite build configured to output to public directory for extension compatibility
Messaging enabled between React popup and background script (testable via popup button)
Minimalistic, sleek meeting cost calculator popup UI with real-time calculation and currency selection
Accessibility improvements (ARIA labels, input associations, contrast)
Responsive design for mobile and small screens
Subtle animations and micro-interactions for input focus and cost updates
Popup UI fully tested in Firefox extension context; all features verified (inputs, calculation, accessibility, responsiveness, animations)
Dark/light mode toggle for popup UI; theme adapts inputs, text, and cost display
Customization options: salary range presets, meeting type presets, currency selection, and persistent user preferences
Save teams/templates: users can save current meeting settings as named templates and load them instantly from a dropdown
Export/share results: users can export meeting cost data as CSV (with header row, detailed data, and timestamp) or PDF from the popup UI. PDF export uses jsPDF for professional formatting and branding.
Share meeting cost directly to Slack channels using a secure relay endpoint (supports Vercel, Railway, or local ngrok relay)
Automated Slack OAuth flow: users can connect their Slack account, authorize the extension, and have tokens managed automatically for secure sharing
Share meeting cost directly via email (CSV download and mailto integration)
Supports local development with ngrok for relay testing
Enhanced error handling and feedback: extension UI provides specific, actionable error messages and color-coded notifications for Slack sharing issues

## Getting Started

1. Run `npm install` to install dependencies.
2. Run `npm run build` to build the extension files into the `public` directory.
3. Set up your relay endpoint:

- For production, deploy to Vercel or Railway and set your Slack app redirect URI accordingly.
- For local development, run your relay server and expose it with ngrok. Use the ngrok HTTPS URL as your redirect URI in Slack and your extension.

4. Load the extension in Firefox via `about:debugging` > "This Firefox" > "Load Temporary Add-on" and select `manifest.json` from the `public` folder.

## Roadmap

See `roadmap.md` for detailed development steps and mini-roadmaps.

## License

MIT
