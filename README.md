# Meeting Cost Calculator Firefox Extension

This project is a professional Firefox browser extension built with React and Vite. It calculates the cost of meetings in real time and is designed for superior UX/UI, privacy, and Slack integration via a secure production relay endpoint.

## Features

- Extension folder structure for Firefox
- Firefox extension manifest (manifest.json)
- Placeholder icons (icon48.png, icon128.png)
- Vite build configured to output to public directory for extension compatibility
- Messaging enabled between React popup and background script (testable via popup button)
- Minimalistic, sleek meeting cost calculator popup UI with real-time calculation and currency selection
- Accessibility improvements (ARIA labels, input associations, contrast)
- Responsive design for mobile and small screens
- Subtle animations and micro-interactions for input focus and cost updates
- Popup UI fully tested in Firefox extension context; all features verified (inputs, calculation, accessibility, responsiveness, animations)
- Dark/light mode toggle for popup UI; theme adapts inputs, text, and cost display
- Customization options: salary range presets, meeting type presets, currency selection, and persistent user preferences
- Save teams/templates: users can save current meeting settings as named templates and load them instantly from a dropdown
- Export/share results: users can export meeting cost data as CSV or PDF from the popup UI
  Export/share results: users can export meeting cost data as CSV or PDF from the popup UI. (MVP complete; advanced PDF export planned in future mini-roadmap)
  Share meeting cost directly to Slack channels using a secure production relay endpoint
  Automated Slack OAuth flow: users can connect their Slack account, authorize the extension, and have tokens managed automatically for secure sharing
  Enhanced error handling and feedback: extension UI provides specific, actionable error messages and color-coded notifications for Slack sharing issues

## Getting Started

1. Run `npm install` to install dependencies.
2. Run `npm run build` to build the extension files into the `public` directory.
3. Load the extension in Firefox via `about:debugging` > "This Firefox" > "Load Temporary Add-on" and select `manifest.json` from the `public` folder.

## Roadmap

See `roadmap.md` for detailed development steps and mini-roadmaps.

## License

MIT
