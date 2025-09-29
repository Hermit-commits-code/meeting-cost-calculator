import { useState } from "react";
import "./App.css";

function App() {
  const [attendees, setAttendees] = useState(3);
  const [salary, setSalary] = useState(80000);
  const [duration, setDuration] = useState(60);
  const [currency, setCurrency] = useState("$");

  // Calculate cost per minute per attendee
  const costPerMinute = salary / 2080 / 60; // 2080 work hours/year
  const totalCost = attendees * costPerMinute * duration;

  return (
    <div
      style={{
        minWidth: 280,
        maxWidth: 400,
        margin: "0 auto",
        padding: 24,
        fontFamily: "Inter, Arial, sans-serif",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        color: "#222",
      }}
      role="main"
      aria-label="Meeting Cost Calculator"
    >
      <h2
        style={{ fontWeight: 600, fontSize: 22, marginBottom: 16 }}
        id="meeting-cost-title"
      >
        Meeting Cost Calculator
      </h2>
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
          style={{
            fontWeight: 700,
            fontSize: 32,
            marginTop: 8,
            color: "#2a7d46",
          }}
        >
          {currency}
          {totalCost.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default App;
