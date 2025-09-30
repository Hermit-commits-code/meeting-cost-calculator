// src/utils/storage.js
// Utility for safe localStorage access

export function savePref(key, value) {
  try {
    if (key === "slackAccessToken") return; // Prevent saving raw access token
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function getPref(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
