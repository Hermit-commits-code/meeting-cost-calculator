# Release Notes: v1.0.0

## Highlights
- Production-ready Firefox extension for meeting cost calculation
- Secure Slack integration via session token relay
- Automated Slack OAuth flow with persistent session management
- Modularized codebase with professional UI/UX
- Enhanced error handling and user feedback
- Support for cloud relays (Vercel, Railway) and local development with ngrok

## Setup Changes
- Update your Slack app's redirect URI to match your relay endpoint (cloud or ngrok)
- Update `.env` and extension code to use the correct relay URLs

## Usage
- Build the extension with `npm run build`
- Load in Firefox via `about:debugging` > "This Firefox" > "Load Temporary Add-on"
- Connect to Slack, authorize, and share meeting costs directly to channels

## Notable Improvements
- No raw Slack access tokens stored in the extension
- Session tokens managed securely via relay
- UI provides actionable error messages and notifications
- README updated for cloud and local relay instructions

## Tag
- v1.0.0

---
For questions or issues, open an issue on GitHub or contact the maintainer.
