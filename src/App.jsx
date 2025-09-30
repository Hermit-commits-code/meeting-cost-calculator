import { useState } from "react";
import "./App.css";

// ...define your state, handlers, and logic here...

function App() {
  const [theme, setTheme] = useState("light");

  function handleTheme(nextTheme) {
    setTheme(nextTheme);
    savePref("theme", nextTheme);
  }
  const [attendees, setAttendees] = useState(1);
  const [salary, setSalary] = useState(50000);
  const [duration, setDuration] = useState(60);
  const [currency, setCurrency] = useState("$");
  const [meetingType, setMeetingType] = useState("");
  const [salaryPreset, setSalaryPreset] = useState("");
  const [slackAccessToken, setSlackAccessToken] = useState("");
  const [slackChannel, setSlackChannel] = useState("");
  const [slackStatus, setSlackStatus] = useState("");

  function savePref(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function postToSlack() {
    if (!slackAccessToken || !slackChannel) return;
    setSlackStatus("Sending...");
    fetch(
      //"https://slack-oauth-relay-8bm11eodj-joseph-chus-projects.vercel.app/api/slack",
      "http://localhost:3000/api/slack",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          accessToken: slackAccessToken,
          channel: slackChannel,
          text: `Meeting Cost: ${currency}${totalCost.toFixed(
            2
          )}\nAttendees: ${attendees}\nAvg. Salary: ${currency}${salary}\nDuration: ${duration} min`,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSlackStatus("Shared to Slack!");
        } else {
          setSlackStatus("Error: " + (data.error || "Unknown error"));
        }
      })
      .catch(() => setSlackStatus("Error: Network or permission issue"));
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
      }}
      role="main"
      aria-label="Meeting Cost Calculator"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <h2
          style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}
          id="meeting-cost-title"
        >
          Meeting Cost Calculator
        </h2>
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
          {/* Slack Integration Section */}
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "#f6f6f6",
              borderRadius: 8,
            }}
          >
            <label htmlFor="slack-token-input">Slack Access Token</label>
            <input
              id="slack-token-input"
              type="text"
              value={slackAccessToken}
              onChange={(e) => {
                setSlackAccessToken(e.target.value);
                savePref("slackAccessToken", e.target.value);
              }}
              placeholder="Paste your Slack access token here"
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #bbb",
                fontSize: 16,
                marginBottom: 8,
              }}
              aria-label="Slack access token input"
            />
            <label htmlFor="slack-channel-input">
              Slack Channel (e.g. #general)
            </label>
            <input
              id="slack-channel-input"
              type="text"
              value={slackChannel}
              onChange={(e) => setSlackChannel(e.target.value)}
              placeholder="#general"
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #bbb",
                fontSize: 16,
                marginBottom: 8,
              }}
              aria-label="Slack channel input"
            />
            <button
              type="button"
              onClick={postToSlack}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "none",
                background:
                  slackAccessToken && slackChannel ? "#4a154b" : "#bbb",
                color: "#fff",
                fontWeight: 500,
                cursor:
                  slackAccessToken && slackChannel ? "pointer" : "not-allowed",
                fontSize: 16,
                opacity: slackAccessToken && slackChannel ? 1 : 0.7,
                marginTop: 8,
              }}
              aria-label="Share to Slack"
              disabled={!slackAccessToken || !slackChannel}
            >
              Share to Slack
            </button>
            {slackStatus && (
              <div
                style={{
                  marginTop: 8,
                  color: slackStatus.includes("Error") ? "#d6336c" : "#2a7d46",
                }}
              >
                {slackStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
