import React, { useState } from "react";
import ExportShareSection from "./components/ExportShareSection.jsx";
import SlackIntegrationSection from "./components/SlackIntegrationSection.jsx";
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
  const [theme, setTheme] = useState(() => getPref("theme") || "light");
  const [attendees, setAttendees] = useState(
    () => Number(getPref("attendees")) || 1
  );
  const [salary, setSalary] = useState(
    () => Number(getPref("salary")) || 50000
  );
  const [duration, setDuration] = useState(
    () => Number(getPref("duration")) || 60
  );
  const [currency, setCurrency] = useState(() => getPref("currency") || "$");
  const [meetingType, setMeetingType] = useState(
    () => getPref("meetingType") || ""
  );
  const [salaryPreset, setSalaryPreset] = useState(
    () => getPref("salaryPreset") || ""
  );
  // Persist user preferences on change
  React.useEffect(() => {
    savePref("theme", theme);
  }, [theme]);
  React.useEffect(() => {
    savePref("attendees", attendees);
  }, [attendees]);
  React.useEffect(() => {
    savePref("salary", salary);
  }, [salary]);
  React.useEffect(() => {
    savePref("duration", duration);
  }, [duration]);
  React.useEffect(() => {
    savePref("currency", currency);
  }, [currency]);
  React.useEffect(() => {
    savePref("meetingType", meetingType);
  }, [meetingType]);
  React.useEffect(() => {
    savePref("salaryPreset", salaryPreset);
  }, [salaryPreset]);
  const [slackAccessToken, setSlackAccessToken] = useState(""); // Now stores session token
  const [slackChannel, setSlackChannel] = useState("");
  const [slackStatus, setSlackStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  // Team templates state
  const [templates, setTemplates] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("meetingTemplates")) || [];
    } catch {
      return [];
    }
  });
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  // Save templates to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("meetingTemplates", JSON.stringify(templates));
  }, [templates]);

  // Save current settings as a template
  function handleSaveTemplate() {
    if (!templateName.trim()) {
      setToastMsg("❌ Please enter a template name.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }
    const newTemplate = {
      name: templateName.trim(),
      settings: {
        attendees,
        salary,
        duration,
        currency,
        meetingType,
        salaryPreset,
      },
    };
    // Prevent duplicate names
    if (templates.some((t) => t.name === newTemplate.name)) {
      setToastMsg("❌ Template name already exists.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }
    setTemplates([...templates, newTemplate]);
    setTemplateName("");
    setToastMsg("✅ Template saved!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  // Load selected template
  function handleLoadTemplate(name) {
    const template = templates.find((t) => t.name === name);
    if (template) {
      setAttendees(template.settings.attendees);
      setSalary(template.settings.salary);
      setDuration(template.settings.duration);
      setCurrency(template.settings.currency);
      setMeetingType(template.settings.meetingType);
      setSalaryPreset(template.settings.salaryPreset);
      setSelectedTemplate(name);
      setToastMsg(`✅ Loaded template: ${name}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }

  // Delete template
  function handleDeleteTemplate(name) {
    setTemplates(templates.filter((t) => t.name !== name));
    setToastMsg(`🗑️ Deleted template: ${name}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    if (selectedTemplate === name) setSelectedTemplate("");
  }

  // savePref and getPref now imported from utils/storage.js

  function handleTheme(nextTheme) {
    setTheme(nextTheme);
    savePref("theme", nextTheme);
  }

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

          {/* Meeting Presets Quick-Select */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => {
                setMeetingType("Standup");
                setDuration(15);
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "none",
                background: "#e5e1ea",
                color: "#4a154b",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: 15,
              }}
              aria-label="Preset Standup"
            >
              Standup (15m)
            </button>
            <button
              type="button"
              onClick={() => {
                setMeetingType("Planning");
                setDuration(60);
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "none",
                background: "#e5e1ea",
                color: "#4a154b",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: 15,
              }}
              aria-label="Preset Planning"
            >
              Planning (60m)
            </button>
            <button
              type="button"
              onClick={() => {
                setMeetingType("Review");
                setDuration(30);
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "none",
                background: "#e5e1ea",
                color: "#4a154b",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: 15,
              }}
              aria-label="Preset Review"
            >
              Review (30m)
            </button>
            <button
              type="button"
              onClick={() => {
                setMeetingType("Workshop");
                setDuration(120);
              }}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "none",
                background: "#e5e1ea",
                color: "#4a154b",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: 15,
              }}
              aria-label="Preset Workshop"
            >
              Workshop (120m)
            </button>
          </div>
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
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
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
            onClick={handleSaveTemplate}
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
          {templates.length > 0 && (
            <>
              <label htmlFor="template-select">Load Template</label>
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => handleLoadTemplate(e.target.value)}
                style={{
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #bbb",
                  fontSize: 16,
                }}
                aria-label="Template selection"
              >
                <option value="">Select a template...</option>
                {templates.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  marginTop: 8,
                }}
              >
                {templates.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => handleDeleteTemplate(t.name)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: "none",
                      background: "#d6336c",
                      color: "#fff",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    aria-label={`Delete template ${t.name}`}
                  >
                    Delete {t.name}
                  </button>
                ))}
              </div>
            </>
          )}
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
          <ExportShareSection
            attendees={attendees}
            salary={salary}
            duration={duration}
            currency={currency}
            meetingType={meetingType}
            salaryPreset={salaryPreset}
            totalCost={totalCost}
          />
          {/* Professional Slack Integration Section (modularized) */}
          <SlackIntegrationSection
            slackAccessToken={slackAccessToken}
            slackChannel={slackChannel}
            slackStatus={slackStatus}
            connectToSlack={connectToSlack}
            setSlackChannel={setSlackChannel}
            postToSlack={postToSlack}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
