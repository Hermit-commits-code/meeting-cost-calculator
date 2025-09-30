import React from "react";

function generateMeetingCSV({
  attendees,
  salary,
  duration,
  currency,
  meetingType,
  salaryPreset,
  totalCost,
}) {
  const header = [
    "Attendees",
    "Avg. Salary (annual)",
    "Duration (minutes)",
    "Meeting Type",
    "Salary Preset",
    "Estimated Cost",
    "Exported At",
  ];
  const row = [
    attendees,
    `${currency}${salary}`,
    duration,
    meetingType || "Custom",
    salaryPreset || "Custom",
    `${currency}${totalCost.toFixed(2)}`,
    new Date().toLocaleString(),
  ];
  return header.join(",") + "\n" + row.join(",");
}

export default function ExportShareSection({
  attendees,
  salary,
  duration,
  currency,
  meetingType,
  salaryPreset,
  totalCost,
}) {
  // Helper to download CSV
  function handleExportCSV() {
    const csv = generateMeetingCSV({
      attendees,
      salary,
      duration,
      currency,
      meetingType,
      salaryPreset,
      totalCost,
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meeting-cost.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Helper to export PDF
  function handleExportPDF() {
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Meeting Cost Report", 20, 20);
      doc.setFontSize(12);
      doc.text(`Attendees: ${attendees}`, 20, 35);
      doc.text(`Avg. Salary: ${currency}${salary}`, 20, 45);
      doc.text(`Duration: ${duration} min`, 20, 55);
      doc.text(`Meeting Type: ${meetingType || "Custom"}`, 20, 65);
      doc.text(`Salary Preset: ${salaryPreset || "Custom"}`, 20, 75);
      doc.text(`Estimated Cost: ${currency}${totalCost.toFixed(2)}`, 20, 85);
      doc.text(`Exported At: ${new Date().toLocaleString()}`, 20, 95);
      doc.save("meeting-cost.pdf");
    });
  }

  // Helper to share via email (attach CSV)
  function handleShareEmail() {
    const csv = generateMeetingCSV({
      attendees,
      salary,
      duration,
      currency,
      meetingType,
      salaryPreset,
      totalCost,
    });
    // Try to use mailto with body, fallback to download
    const subject = encodeURIComponent("Meeting Cost Report");
    const body = encodeURIComponent(
      "Please find the meeting cost details below (CSV attached if supported):\n\n" +
        csv.replace(/,/g, "\t").replace(/\n/g, "\n")
    );
    // Try to attach CSV (not all clients support mailto attachments)
    window.open(`mailto:?subject=${subject}&body=${body}`);
    // Also trigger CSV download for convenience
    handleExportCSV();
  }

  return (
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
        onClick={handleExportCSV}
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
        onClick={handleExportPDF}
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
      <button
        type="button"
        onClick={handleShareEmail}
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: "none",
          background: "#34a853",
          color: "#fff",
          fontWeight: 500,
          cursor: "pointer",
          fontSize: 16,
        }}
        aria-label="Share via Email"
      >
        Share via Email
      </button>
    </div>
  );
}
