import React from "react";

function SettingsSection({
  salaryPreset,
  setSalaryPreset,
  meetingType,
  setMeetingType,
  setDuration,
}) {
  return (
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
  );
}

export default SettingsSection;
