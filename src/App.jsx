import React, { useState } from "react";
import ExportShareSection from "./components/ExportShareSection.jsx";
import MeetingHistorySection from "./components/MeetingHistorySection.jsx";
import TemplatesSection from "./components/TemplatesSection.jsx";
import SettingsSection from "./components/SettingsSection.jsx";
import MainFormSection from "./components/MainFormSection.jsx";
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
} from "./services/slackService.js";
import { savePref, getPref } from "./utils/storage.js";

// ...define your state, handlers, and logic here...

function App() {
  // Reporting helpers
  function getAggregatedReport(period = "month") {
    const now = new Date();
    let filtered = [];
    if (period === "week") {
      const weekAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7
      );
      filtered = meetingHistory.filter((m) => new Date(m.date) >= weekAgo);
    } else {
      const monthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      filtered = meetingHistory.filter((m) => new Date(m.date) >= monthAgo);
    }
    const totalCost = filtered.reduce((sum, m) => sum + m.totalCost, 0);
    const totalMeetings = filtered.length;
    const totalAttendees = filtered.reduce((sum, m) => sum + m.attendees, 0);
    return { totalCost, totalMeetings, totalAttendees, filtered };
  }

  function exportReportCSV(period = "month") {
    const { filtered } = getAggregatedReport(period);
    const header = ["Date", "Type", "Attendees", "Duration", "Salary", "Cost"];
    const rows = filtered.map((m) => [
      m.date,
      m.meetingType || "Custom",
      m.attendees,
      m.duration,
      `${m.currency}${m.salary}`,
      `${m.currency}${m.totalCost.toFixed(2)}`,
    ]);
    const csv =
      header.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-report-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  // Meeting history state
  const [meetingHistory, setMeetingHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("meetingHistory")) || [];
    } catch {
      return [];
    }
  });

  // Persist meeting history
  React.useEffect(() => {
    localStorage.setItem("meetingHistory", JSON.stringify(meetingHistory));
  }, [meetingHistory]);

  // Save current meeting to history
  function handleSaveMeeting() {
    const newMeeting = {
      date: new Date().toLocaleString(),
      attendees,
      salary,
      duration,
      currency,
      meetingType,
      salaryPreset,
      totalCost,
    };
    setMeetingHistory([newMeeting, ...meetingHistory]);
    setToastMsg("✅ Meeting saved to history!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  // Clear meeting history
  function handleClearHistory() {
    setMeetingHistory([]);
    setToastMsg("🗑️ Meeting history cleared.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }
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
      <SettingsSection
        salaryPreset={salaryPreset}
        setSalaryPreset={setSalaryPreset}
        meetingType={meetingType}
        setMeetingType={setMeetingType}
        setDuration={setDuration}
      />
      <TemplatesSection
        templates={templates}
        templateName={templateName}
        setTemplateName={setTemplateName}
        handleSaveTemplate={handleSaveTemplate}
        handleLoadTemplate={handleLoadTemplate}
        handleDeleteTemplate={handleDeleteTemplate}
        selectedTemplate={selectedTemplate}
      />
      <MainFormSection
        attendees={attendees}
        setAttendees={setAttendees}
        salary={salary}
        setSalary={setSalary}
        duration={duration}
        setDuration={setDuration}
        currency={currency}
        setCurrency={setCurrency}
      />
      <div style={{ margin: "24px 0 0", textAlign: "center" }}>
        <MeetingHistorySection
          meetingHistory={meetingHistory}
          handleClearHistory={handleClearHistory}
          getAggregatedReport={getAggregatedReport}
          exportReportCSV={exportReportCSV}
        />
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
        <button
          type="button"
          onClick={handleSaveMeeting}
          style={{
            marginTop: 12,
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: "#0072c6",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 16,
            boxShadow: "0 1px 4px rgba(74,21,75,0.08)",
            transition: "background 0.2s",
          }}
          aria-label="Save meeting to history"
        >
          Save Meeting to History
        </button>
        <div>
          <ExportShareSection
            attendees={attendees}
            salary={salary}
            duration={duration}
            currency={currency}
            meetingType={meetingType}
            salaryPreset={salaryPreset}
            totalCost={totalCost}
          />
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
