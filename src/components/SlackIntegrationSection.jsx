import React from "react";

function SlackIntegrationSection({
  slackAccessToken,
  slackChannel,
  slackStatus,
  connectToSlack,
  setSlackChannel,
  postToSlack,
}) {
  return (
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
              background: slackAccessToken && slackChannel ? "#4a154b" : "#bbb",
              color: "#fff",
              fontWeight: 600,
              cursor:
                slackAccessToken && slackChannel ? "pointer" : "not-allowed",
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
                color: slackStatus.includes("Error") ? "#d6336c" : "#2a7d46",
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
  );
}

export default SlackIntegrationSection;
