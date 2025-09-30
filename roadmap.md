# Meeting Cost Calculator Firefox Extension Roadmap

This roadmap outlines every step required to build, polish, and launch a professional Mozilla Firefox extension using React. Follow each phase in order for best results.

## Mini-Roadmaps

Mini-roadmaps provide focused, step-by-step guidance for specific features or phases. Refer to these as you reach each major milestone.

1. Design wireframe/mockup [x]
2. Build initial component structure [x]
3. Style for accessibility and responsiveness [x]
4. Add animations/micro-interactions [x]
5. Test in extension context [x]

6. Register Slack app and obtain credentials
7. Implement OAuth flow
8. Add UI for Slack sharing
9. Test message sending to channels
10. Document integration steps

11. Audit code for data collection
12. Write privacy policy
13. Add privacy info to UI
14. Open-source repo setup
15. Review for compliance

16. List customization options (currency, salary, templates)
17. Design settings UI
18. Implement state management
19. Persist user preferences
20. Test edge cases

21. Prepare screenshots and demo GIFs
22. Write launch copy and tagline
23. Schedule launch date
24. Engage early supporters
25. Monitor feedback and respond

26. Research and select a robust PDF library (e.g., jsPDF, pdf-lib)

# Next-Phase Slack Integration Roadmap

After initial Slack integration is working, implement the following improvements:

1. Switch to production relay endpoint
   - Update extension fetch URL to use Vercel relay endpoint for Slack API calls.
2. Automate OAuth flow for users
   - Implement UI and backend logic for users to authenticate with Slack and obtain tokens automatically.
3. Enhance error handling and feedback
   - Improve extension and relay error messages, add user-friendly notifications for Slack sharing.
4. Secure token management
   - Ensure tokens are never exposed in client-side code; store and manage tokens securely via relay.
5. Improve Slack sharing UI
   - Add channel picker, better status messages, and polish the Slack integration section of the extension.
6. Document integration and setup
   - Write clear documentation for Slack integration setup, usage, and troubleshooting.
7. Test with multiple scenarios
   - Test Slack integration with different channels, users, and message formats to ensure reliability.
8. Implement PDF export with proper formatting
9. Test PDF output in extension context
10. Polish UI/UX and document feature

## 1. Project Initialization

- [x] Scaffold React app (Vite)
- [x] Set up extension folder structure
- [x] Add Firefox extension manifest (manifest.json)
- [x] Add placeholder icons and assets
- [x] Configure build to output extension files

## 2. Core Extension Setup

- [x] Enable messaging between React popup and background script

* [x] Add background script (if needed)
* [x] Test extension loading in Firefox (about:debugging)

## 3. UI/UX Foundation

- [x] Design minimalist, modern popup UI

* [x] Ensure accessibility and responsiveness
* [x] Add dark/light mode toggle
* [x] Polish with animations and micro-interactions

## 4. Meeting Cost Calculator Features

- [x] Customization: currency, salary ranges, meeting types
- [x] Save frequent teams/templates
- [x] Export/share results (PDF, CSV, Slack)
- [ ] (Future) Meeting history: track multiple meetings, attendees, durations, and costs
- [ ] (Future) Weekly/monthly report: aggregate meetings, participants, and total costs for export

## 5. Privacy & Transparency

- [ ] No tracking or analytics
- [ ] Clear privacy policy in README
- [ ] Open-source code (GitHub repo)
- [ ] Explain data handling in extension UI

## 6. Slack Integration

- [ ] (Future) Fetch participant names from Slack channel/meeting context (with user consent)
- [ ] (Future) Include participant names in exported PDF/CSV
- [ ] (Future) Add privacy controls for name sharing
- [ ] Tips for efficient meetings
- [ ] Multi-language support
- [ ] Integration with calendar APIs (future)

## 7. Team Management & Salary Assignment

- [ ] (Future) Admin/boss can assign salaries to team members
- [ ] (Future) Auto-fill salaries when adding participants to meetings
- [ ] (Future) Secure, private team management UI for editing salaries
- [ ] (Future) Integrate with meeting history and reporting

- [ ] (Future) Fetch participant names from Slack channel/meeting context (with user consent)
- [ ] (Future) Include participant names in exported PDF/CSV
- [ ] (Future) Add privacy controls for name sharing
- [ ] Tips for efficient meetings
- [ ] Multi-language support
- [ ] Integration with calendar APIs (future)

## 8. Testing & QA

- [ ] Manual testing in Firefox
- [ ] Automated tests (unit, integration)
- [ ] Accessibility audit
- [ ] Peer review/code review

## 9. Documentation & Assets

- [ ] Write detailed README.md
- [ ] Add screenshots and demo GIFs
- [ ] Document all features and usage
- [ ] Prepare Product Hunt launch assets

## 10. Packaging & Publishing

- [ ] Build and package extension (zip)
- [ ] Submit to Mozilla Add-ons (AMO)
- [ ] Publish GitHub repo
- [ ] Launch on Product Hunt

## 11. Post-Launch & Growth

- [ ] Collect user feedback
- [ ] Iterate and improve features
- [ ] Monitor for bugs and issues
- [ ] Promote on social media and communities

---

**Follow this roadmap step-by-step for a professional, feature-rich, and acquisition-ready Firefox extension.**
