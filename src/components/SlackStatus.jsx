// src/components/SlackStatus.jsx
import React from "react";

export default function SlackStatus({ status }) {
  if (status === "Slack connected!") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#2a7d46",
          fontWeight: 500,
          fontSize: 15,
          marginBottom: 2,
        }}
      >
        <span style={{ fontSize: 18 }}>✔️</span> Slack connected
      </div>
    );
  }
  return null;
}
