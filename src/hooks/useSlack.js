import { useState, useEffect } from "react";
import { savePref, getPref } from "../utils/storage";
import {
  requestSlackOAuthCode,
  exchangeSlackToken,
  postToSlack as slackPostToSlack,
} from "../services/slackService";

export function useSlack() {
  const [slackAccessToken, setSlackAccessToken] = useState("");
  const [slackChannel, setSlackChannel] = useState("");
  const [slackStatus, setSlackStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (window.location.search.includes("code=")) {
      window.location.href = window.location.origin + window.location.pathname;
      return;
    }
    requestSlackOAuthCode().then((response) => {
      const code = response && response.code;
      if (code) {
        setSlackStatus("Authorizing with Slack...");
        setToastMsg("🔄 Authorizing with Slack...");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
        exchangeSlackToken(code)
          .then((data) => {
            if (data.session_token) {
              setSlackAccessToken(data.session_token);
              savePref("slackSessionToken", data.session_token);
              setSlackStatus("Slack connected!");
              setToastMsg("✅ Slack connected!");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            } else {
              setSlackStatus(
                "Error: " + (data.error || "Could not retrieve session token")
              );
              setToastMsg(
                "❌ " + (data.error || "Could not retrieve session token")
              );
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3500);
            }
          })
          .catch(() => {
            setSlackStatus("Error: Network or permission issue");
            setToastMsg("❌ Network or permission issue");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3500);
          });
      }
    });
    const sessionToken = getPref("slackSessionToken");
    if (sessionToken) {
      setSlackStatus("Slack connected!");
      setSlackAccessToken(sessionToken);
    }
  }, []);

  function postToSlack(message) {
    if (!slackAccessToken || !slackChannel) return;
    setSlackStatus("Sending...");
    setToastMsg("Sending to Slack...");
    setShowToast(true);
    slackPostToSlack(slackAccessToken, slackChannel, message)
      .then((data) => {
        if (data.ok) {
          setSlackStatus("Shared to Slack!");
          setToastMsg("✅ Shared to Slack!");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        } else {
          let errorMsg = "";
          switch (data.error) {
            case "invalid_auth":
              errorMsg =
                "Invalid Slack authentication. Please reconnect your account.";
              break;
            case "token_revoked":
              errorMsg =
                "Your Slack session was revoked. Please re-authorize the extension.";
              break;
            case "channel_not_found":
              errorMsg =
                "Channel not found. Please check the channel name (e.g., #general).";
              break;
            case "not_in_channel":
              errorMsg =
                "Bot is not a member of the channel. Invite the bot to the channel and try again.";
              break;
            case "missing_required_fields":
              errorMsg =
                "Missing required fields. Please check your Slack session and channel.";
              break;
            default:
              errorMsg = data.error
                ? `Slack error: ${data.error}`
                : "Unknown error occurred.";
          }
          setSlackStatus(`Error: ${errorMsg}`);
          setToastMsg(`❌ ${errorMsg}`);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3500);
        }
      })
      .catch(() => {
        setSlackStatus(
          "Error: Network or permission issue. Please check your connection and try again."
        );
        setToastMsg(
          "❌ Network or permission issue. Please check your connection and try again."
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
      });
  }

  return {
    slackAccessToken,
    slackChannel,
    setSlackChannel,
    slackStatus,
    showToast,
    toastMsg,
    postToSlack,
  };
}
