// src/components/Toast.jsx
import React from "react";

export default function Toast({ show, msg }) {
  if (!show) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        background: msg.startsWith("❌") ? "#ffe6ea" : "#e6fff2",
        color: msg.startsWith("❌") ? "#d6336c" : "#2a7d46",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "10px 18px",
        fontWeight: 500,
        fontSize: 15,
        zIndex: 100,
        minWidth: 180,
        textAlign: "center",
        transition: "opacity 0.3s",
      }}
      role="alert"
    >
      {msg}
    </div>
  );
}
