import React from "react";

function MainFormSection({
  attendees,
  setAttendees,
  salary,
  setSalary,
  duration,
  setDuration,
  currency,
  setCurrency,
}) {
  return (
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
  );
}

export default MainFormSection;
