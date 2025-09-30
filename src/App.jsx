import React, { useState } from "react";
import "./App.css";
import Toast from "./components/Toast.jsx";
import SlackStatus from "./components/SlackStatus.jsx";
import {
  SLACK_CLIENT_ID,
  SLACK_REDIRECT_URI,
  requestSlackOAuthCode,
  exchangeSlackToken,
  postToSlack as slackPostToSlack,
} from "./slackService.js";
import { savePref, getPref } from "./utils/storage.js";

// ...define your state, handlers, and logic here...

function App() {
  // State declarations (move to top)
  const [theme, setTheme] = useState("light");
  const [attendees, setAttendees] = useState(1);
  const [salary, setSalary] = useState(50000);
  const [duration, setDuration] = useState(60);
  const [currency, setCurrency] = useState("$");
  const [meetingType, setMeetingType] = useState("");
  const [salaryPreset, setSalaryPreset] = useState("");
  const [slackAccessToken, setSlackAccessToken] = useState(""); // Now stores session token
  const [slackChannel, setSlackChannel] = useState("");
  const [slackStatus, setSlackStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // savePref and getPref now imported from utils/storage.js

  // Theme handler
  function handleTheme(nextTheme) {
    setTheme(nextTheme);
    savePref("theme", nextTheme);
  }

  // Slack connect handler
  function connectToSlack() {
    window.open(
      `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=chat:write,channels:read,groups:read,im:read,mpim:read,users:read&redirect_uri=${encodeURIComponent(
        SLACK_REDIRECT_URI
      )}`,
      "_blank"
    );
  }

  // Detect OAuth code in URL and exchange for token
  React.useEffect(() => {
    // Helper: reload popup if redirected from OAuth callback
    if (window.location.search.includes("code=")) {
      console.log(
        "[MeetingCalc] Detected OAuth code in URL, reloading popup for fresh state."
      );
      window.location.href = window.location.origin + window.location.pathname;
      return;
    }

    // Request OAuth code from background script
    requestSlackOAuthCode().then((response) => {
      console.log("[MeetingCalc] Background script response:", response);
      const code = response && response.code;
      if (code) {
        setSlackStatus("Authorizing with Slack...");
        setToastMsg("🔄 Authorizing with Slack...");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
        exchangeSlackToken(code)
          .then((data) => {
            console.log("[MeetingCalc] Exchange token response:", data);
            if (data.session_token) {
              setSlackAccessToken(data.session_token);
              savePref("slackSessionToken", data.session_token);
              setSlackStatus("Slack connected!");
              setToastMsg("✅ Slack connected!");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
              console.log(
                "[MeetingCalc] Slack connected! Session token:",
                data.session_token
              );
            } else {
              setSlackStatus(
                "Error: " + (data.error || "Could not retrieve session token")
              );
              setToastMsg(
                "❌ " + (data.error || "Could not retrieve session token")
              );
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3500);
              console.error(
                "[MeetingCalc] Slack connection error:",
                data.error || "Could not retrieve session token"
              );
            }
          })
          .catch(() => {
            setSlackStatus("Error: Network or permission issue");
            setToastMsg("❌ Network or permission issue");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3500);
            console.error("[MeetingCalc] Network or permission issue.");
          });
      }
    });

    // On popup open, show persistent Slack connection status
    const sessionToken = getPref("slackSessionToken");
    if (sessionToken) {
      setSlackStatus("Slack connected!");
      if (!slackAccessToken) {
        setToastMsg("✅ Slack connected!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        console.log(
          "[MeetingCalc] Slack connected! Session token:",
          sessionToken
        );
      }
      setSlackAccessToken(sessionToken);
    }
  }, [slackAccessToken]);

  function postToSlack() {
    if (!slackAccessToken || !slackChannel) return;
    setSlackStatus("Sending...");
    setToastMsg("Sending to Slack...");
    setShowToast(true);
    slackPostToSlack(
      slackAccessToken,
      slackChannel,
      `Meeting Cost: ${currency}${totalCost.toFixed(
        2
      )}\nAttendees: ${attendees}\nAvg. Salary: ${currency}${salary}\nDuration: ${duration} min`
    )
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

  const costPerMinute = salary / 2080 / 60;
  const totalCost = attendees * costPerMinute * duration;

  return (
    <div
      className={theme === "dark" ? "popup-dark" : "popup-light"}
      style={{
        minWidth: 280,
        maxWidth: 400,
        minHeight: 340,
        margin: "0 auto",
        padding: 24,
        fontFamily: "Inter, Arial, sans-serif",
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        position: "relative",
      }}
      role="main"
      aria-label="Meeting Cost Calculator"
    >
      <Toast show={showToast} msg={toastMsg} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2
            style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}
            id="meeting-cost-title"
          >
            Meeting Cost Calculator
          </h2>
          <SlackStatus status={slackStatus} />
        </div>
        <button
          type="button"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          onClick={() => handleTheme(theme === "dark" ? "light" : "dark")}
          style={{
            background: theme === "dark" ? "#222" : "#eee",
            color: theme === "dark" ? "#fff" : "#222",
            border: "none",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: 14,
            marginLeft: 8,
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
      {/* Settings Section */}
      <details style={{ marginBottom: 16 }}>
        <summary style={{ fontWeight: 500, fontSize: 16, cursor: "pointer" }}>
          Customization Settings
        </summary>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 10,
          }}
        >
          <label htmlFor="salary-preset-select">Salary Preset</label>
          <select
            id="salary-preset-select"
            value={salaryPreset}
            onChange={(e) => setSalaryPreset(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #bbb",
              fontSize: 16,
            }}
            aria-label="Salary preset selection"
          >
            <option value="">Custom</option>
            <option value="Engineer">Engineer ($80,000)</option>
            <option value="Manager">Manager ($120,000)</option>
            <option value="Executive">Executive ($200,000)</option>
          </select>
          <label htmlFor="meeting-type-select">Meeting Type</label>
          <select
            id="meeting-type-select"
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value)}
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #bbb",
              fontSize: 16,
            }}
            aria-label="Meeting type selection"
          >
            <option value="">Custom</option>
            <option value="Standup">Standup (15 min)</option>
            <option value="Planning">Planning (60 min)</option>
            <option value="Review">Review (30 min)</option>
            <option value="Workshop">Workshop (120 min)</option>
          </select>
        </div>
      </details>
      {/* Teams/Templates Section */}
      <details style={{ marginBottom: 16 }}>
        <summary style={{ fontWeight: 500, fontSize: 16, cursor: "pointer" }}>
          Teams & Templates
        </summary>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 10,
          }}
        >
          <label htmlFor="template-name-input">Template Name</label>
          <input
            id="template-name-input"
            type="text"
            value={""}
            onChange={() => {}}
            placeholder="e.g. Design Team, Sprint Planning"
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #bbb",
              fontSize: 16,
            }}
            aria-label="Template name input"
          />
          <button
            type="button"
            onClick={() => {}}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: "#2a7d46",
              color: "#fff",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: 16,
            }}
            aria-label="Save template"
          >
            Save Template
          </button>
        </div>
      </details>
      {/* Main Form Section */}
      <form
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
        aria-labelledby="meeting-cost-title"
      >
        <label htmlFor="attendees-input">Attendees</label>
        <input
          id="attendees-input"
          type="number"
          min={1}
          value={attendees}
          onChange={(e) => setAttendees(Number(e.target.value))}
          className="input-animated"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #bbb",
            marginTop: 4,
            fontSize: 16,
          }}
          aria-label="Number of attendees"
        />
        <label htmlFor="salary-input">Avg. Salary (annual)</label>
        <input
          id="salary-input"
          type="number"
          min={10000}
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="input-animated"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #bbb",
            marginTop: 4,
            fontSize: 16,
          }}
          aria-label="Average annual salary"
        />
        <label htmlFor="duration-input">Duration (minutes)</label>
        <input
          id="duration-input"
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="input-animated"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #bbb",
            marginTop: 4,
            fontSize: 16,
          }}
          aria-label="Meeting duration in minutes"
        />
        <label htmlFor="currency-select">Currency</label>
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input-animated"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #bbb",
            marginTop: 4,
            fontSize: 16,
          }}
          aria-label="Currency selection"
        >
          <option value="$">$</option>
          <option value="€">€</option>
          <option value="£">£</option>
          <option value="₹">₹</option>
        </select>
      </form>
      <div style={{ margin: "24px 0 0", textAlign: "center" }}>
        <span style={{ fontSize: 16, color: "#888" }}>
          Estimated Meeting Cost
        </span>
        <div
          className="cost-animated"
          style={{
            fontWeight: 700,
            fontSize: 32,
            marginTop: 8,
            color: "#2a7d46",
            transition: "color 0.3s, font-size 0.3s",
          }}
        >
          {currency}
          {totalCost.toFixed(2)}
        </div>
        <div>
          {/* Export/Share Section */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={() => {
                const data = [
                  ["Attendees", attendees],
                  ["Avg. Salary", `${currency}${salary}`],
                  ["Duration (min)", duration],
                  ["Meeting Type", meetingType || "Custom"],
                  ["Salary Preset", salaryPreset || "Custom"],
                  ["Estimated Cost", `${currency}${totalCost.toFixed(2)}`],
                ];
                const csv = data.map((row) => row.join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "meeting-cost.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background: "#0072c6",
                color: "#fff",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: 16,
              }}
              aria-label="Export as CSV"
            >
              Export as CSV
            </button>
            <button
              type="button"
              onClick={() => {
                const doc = `Meeting Cost Report\n\nAttendees: ${attendees}\nAvg. Salary: ${currency}${salary}\nDuration: ${duration} min\nMeeting Type: ${
                  meetingType || "Custom"
                }\nSalary Preset: ${
                  salaryPreset || "Custom"
                }\nEstimated Cost: ${currency}${totalCost.toFixed(2)}`;
                const blob = new Blob([doc], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "meeting-cost.pdf";
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background: "#d6336c",
                color: "#fff",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: 16,
              }}
              aria-label="Export as PDF"
            >
              Export as PDF
            </button>
          </div>
          {/* Professional Slack Integration Section */}
          <div
            style={{
              marginTop: 32,
              padding: 18,
              background: "#f8f7fa",
              borderRadius: 12,
              boxShadow: "0 1px 6px rgba(74,21,75,0.08)",
              border: "1px solid #e5e1ea",
              maxWidth: 340,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <h3
              style={{
                fontWeight: 600,
                fontSize: 18,
                color: "#4a154b",
                marginBottom: 10,
                letterSpacing: "-0.5px",
              }}
            >
              Slack Integration
            </h3>
            <hr
              style={{
                border: "none",
                borderTop: "1px solid #e5e1ea",
                margin: "8px 0 16px 0",
              }}
            />
            {!slackAccessToken ? (
              <button
                type="button"
                onClick={connectToSlack}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#4a154b",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 16,
                  marginBottom: 12,
                  boxShadow: "0 1px 4px rgba(74,21,75,0.08)",
                  transition: "background 0.2s",
                }}
                aria-label="Connect to Slack"
              >
                Connect to Slack
              </button>
            ) : (
              <>
                <div
                  style={{
                    fontWeight: 500,
                    color: "#2a7d46",
                    marginBottom: 8,
                    fontSize: 15,
                    textAlign: "center",
                  }}
                >
                  ✔️ Slack Connected
                </div>
                <label
                  htmlFor="slack-channel-input"
                  style={{ fontWeight: 500, fontSize: 15, color: "#4a154b" }}
                >
                  Slack Channel
                </label>
                <input
                  id="slack-channel-input"
                  type="text"
                  value={slackChannel}
                  onChange={(e) => setSlackChannel(e.target.value)}
                  placeholder="#general"
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #bbb",
                    fontSize: 16,
                    marginBottom: 12,
                    marginTop: 4,
                  }}
                  aria-label="Slack channel input"
                />
                <button
                  type="button"
                  onClick={postToSlack}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    background:
                      slackAccessToken && slackChannel ? "#4a154b" : "#bbb",
                    color: "#fff",
                    fontWeight: 600,
                    cursor:
                      slackAccessToken && slackChannel
                        ? "pointer"
                        : "not-allowed",
                    fontSize: 16,
                    opacity: slackAccessToken && slackChannel ? 1 : 0.7,
                    marginTop: 4,
                    boxShadow: "0 1px 4px rgba(74,21,75,0.08)",
                    transition: "background 0.2s",
                  }}
                  aria-label="Share to Slack"
                  disabled={!slackAccessToken || !slackChannel}
                >
                  Share to Slack
                </button>
                {slackStatus && (
                  <div
                    style={{
                      marginTop: 12,
                      color: slackStatus.includes("Error")
                        ? "#d6336c"
                        : "#2a7d46",
                      fontWeight: 500,
                      fontSize: 15,
                      textAlign: "center",
                      background: slackStatus.includes("Error")
                        ? "#ffe6ea"
                        : "#e6fff2",
                      borderRadius: 6,
                      padding: "8px 12px",
                      boxShadow: "0 1px 4px rgba(74,21,75,0.06)",
                      marginBottom: 4,
                    }}
                    role="status"
                  >
                    {slackStatus}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
