// background.js: Capture OAuth code from redirect and store for popup (cross-browser)
let slackOAuthCode = null;

function handleTabUpdate(tabId, changeInfo, tab) {
  if (changeInfo.url && changeInfo.url.includes("/oauth/callback?code=")) {
    const url = new URL(changeInfo.url);
    const code = url.searchParams.get("code");
    if (code) {
      slackOAuthCode = code;
    }
  }
}

if (typeof browser !== "undefined") {
  browser.tabs.onUpdated.addListener(handleTabUpdate);
  browser.runtime.onMessage.addListener((msg, sender) => {
    if (msg.type === "GET_SLACK_OAUTH_CODE") {
      const code = slackOAuthCode;
      slackOAuthCode = null; // Clear after sending
      return Promise.resolve({ code });
    }
  });
} else if (typeof chrome !== "undefined") {
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_SLACK_OAUTH_CODE") {
      const code = slackOAuthCode;
      slackOAuthCode = null;
      sendResponse({ code });
    }
    return true;
  });
}
