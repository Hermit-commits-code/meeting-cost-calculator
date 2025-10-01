import React from "react";

function MeetingHistorySection({
  meetingHistory,
  handleClearHistory,
  getAggregatedReport,
  exportReportCSV,
}) {
  if (!meetingHistory.length) return null;
  return (
    <div style={{ marginTop: 24, textAlign: "left" }}>
      <h4 style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>
        Meeting History
      </h4>
      <button
        type="button"
        onClick={handleClearHistory}
        style={{
          marginBottom: 10,
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          background: "#d6336c",
          color: "#fff",
          fontWeight: 500,
          cursor: "pointer",
          fontSize: 15,
        }}
        aria-label="Clear meeting history"
      >
        Clear History
      </button>
      <div
        style={{
          maxHeight: 180,
          overflowY: "auto",
          border: "1px solid #eee",
          borderRadius: 8,
          padding: 8,
          background: "#faf9fc",
        }}
      >
        {meetingHistory.map((m, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: "1px solid #e5e1ea",
            }}
          >
            <div style={{ fontWeight: 500, color: "#4a154b" }}>{m.date}</div>
            <div style={{ fontSize: 15 }}>
              <strong>Type:</strong> {m.meetingType || "Custom"} |{" "}
              <strong>Attendees:</strong> {m.attendees} |{" "}
              <strong>Duration:</strong> {m.duration} min
            </div>
            <div style={{ fontSize: 15 }}>
              <strong>Cost:</strong> {m.currency}
              {m.totalCost.toFixed(2)} | <strong>Salary:</strong> {m.currency}
              {m.salary}
            </div>
          </div>
        ))}
      </div>
      {/* Reporting Section */}
      <div
        style={{
          marginTop: 18,
          padding: 10,
          background: "#f8f7fa",
          borderRadius: 8,
          border: "1px solid #e5e1ea",
        }}
      >
        <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
          Meeting Reports
        </h4>
        {["week", "month"].map((period) => {
          const report = getAggregatedReport(period);
          return (
            <div key={period} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 15 }}>
                <strong>{period === "week" ? "Weekly" : "Monthly"}:</strong>{" "}
                {report.totalMeetings} meetings, {report.totalAttendees}{" "}
                attendees, <strong>Total Cost:</strong>{" "}
                {report.filtered.length > 0
                  ? `${report.filtered[0].currency}${report.totalCost.toFixed(
                      2
                    )}`
                  : "$0.00"}
              </div>
              <button
                type="button"
                onClick={() => exportReportCSV(period)}
                style={{
                  marginTop: 4,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: "#0072c6",
                  color: "#fff",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: 15,
                }}
                aria-label={`Export ${period} report as CSV`}
              >
                Export {period === "week" ? "Weekly" : "Monthly"} Report (CSV)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MeetingHistorySection;
