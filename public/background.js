// Placeholder background script for future Slack integration and extension logic
console.log("Meeting Cost Calculator background script loaded");

// Listen for messages from the popup
if (typeof browser !== "undefined") {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GREET") {
      console.log("Received from popup:", message.payload);
      sendResponse({ reply: "Hello from background script!" });
    }
  });
} else if (typeof chrome !== "undefined") {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GREET") {
      console.log("Received from popup:", message.payload);
      sendResponse({ reply: "Hello from background script!" });
    }
    return true;
  });
}
