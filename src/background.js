// background.js: Capture OAuth code from redirect and store for popup (Firefox)
let slackOAuthCode = null;

// Listen for tab updates to detect OAuth redirect
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes("/oauth/callback?code=")) {
    const url = new URL(changeInfo.url);
    const code = url.searchParams.get("code");
    if (code) {
      slackOAuthCode = code;
    }
  }
});

// Listen for popup requests for OAuth code
browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "GET_SLACK_OAUTH_CODE") {
    const code = slackOAuthCode;
    slackOAuthCode = null; // Clear after sending
    return Promise.resolve({ code });
  }
});
