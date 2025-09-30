// src/slackService.js
// Handles Slack OAuth, token exchange, and sharing logic

export const SLACK_CLIENT_ID = "9599374319411.9591125131255";
export const SLACK_REDIRECT_URI =
  "https://cubistic-glossingly-reynalda.ngrok-free.dev/oauth/callback";

export function getExtensionApi() {
  return window.browser?.runtime?.sendMessage
    ? window.browser
    : window.chrome?.runtime?.sendMessage
    ? window.chrome
    : null;
}

export function requestSlackOAuthCode() {
  const extApi = getExtensionApi();
  if (extApi && extApi.runtime && extApi.runtime.sendMessage) {
    return extApi.runtime.sendMessage({ type: "GET_SLACK_OAUTH_CODE" });
  }
  return Promise.resolve(null);
}

export function exchangeSlackToken(code) {
  return fetch(
    "https://cubistic-glossingly-reynalda.ngrok-free.dev/api/exchange-token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ code }),
    }
  )
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        return { error: `Relay error: ${res.status} ${text}` };
      }
      return res.json();
    })
    .catch((err) => {
      return { error: `Network error: ${err.message}` };
    });
}

export function postToSlack(sessionToken, channel, text) {
  return fetch(
    "https://cubistic-glossingly-reynalda.ngrok-free.dev/api/slack",
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ sessionToken, channel, text }),
    }
  )
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        return { error: `Relay error: ${res.status} ${text}` };
      }
      return res.json();
    })
    .catch((err) => {
      return { error: `Network error: ${err.message}` };
    });
}

export function getSlackAuthUrl() {
  return `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=chat:write,channels:read,groups:read,im:read,mpim:read&redirect_uri=${encodeURIComponent(
    SLACK_REDIRECT_URI
  )}`;
}
