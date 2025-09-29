# Meeting Cost Calculator Firefox Extension

This project is a professional Firefox browser extension built with React and Vite. It calculates the cost of meetings in real time and is designed for superior UX/UI, privacy, and future Slack integration.


## Features

- Extension folder structure for Firefox
- Firefox extension manifest (manifest.json)
- Placeholder icons (icon48.png, icon128.png)
- Vite build configured to output to public directory for extension compatibility
- Messaging enabled between React popup and background script (testable via popup button)

## Getting Started

1. Run `npm install` to install dependencies.
2. Run `npm run build` to build the extension files into the `public` directory.
3. Load the extension in Firefox via `about:debugging` > "This Firefox" > "Load Temporary Add-on" and select `manifest.json` from the `public` folder.

## Roadmap

See `roadmap.md` for detailed development steps and mini-roadmaps.

## License

MIT
