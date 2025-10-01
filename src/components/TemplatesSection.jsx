import React from "react";

function TemplatesSection({
  templates,
  templateName,
  setTemplateName,
  handleSaveTemplate,
  handleLoadTemplate,
  handleDeleteTemplate,
  selectedTemplate,
}) {
  return (
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
          <div style={{ marginTop: 12 }}>
            <h5 style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
              Saved Templates
            </h5>
            {templates.map((t) => (
              <div
                key={t.name}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => handleLoadTemplate(t.name)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "none",
                    background:
                      selectedTemplate === t.name ? "#0072c6" : "#e5e1ea",
                    color: selectedTemplate === t.name ? "#fff" : "#4a154b",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                  aria-label={`Load template ${t.name}`}
                >
                  {t.name}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTemplate(t.name)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "none",
                    background: "#d6336c",
                    color: "#fff",
                    fontWeight: 500,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                  aria-label={`Delete template ${t.name}`}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

export default TemplatesSection;
