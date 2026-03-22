// Dashboard page — shows overview cards, recent missions table, and missions by destination
import React from "react";

// Fake data — replace with real API data later
const missions = [
  { id: 1, name: "Hamzaoui Sarah",  destination: "Paris",   start: "2026-02-20", status: "Active"   },
  { id: 2, name: "Zeraouti Lyna",   destination: "Spain",   start: "2026-01-05", status: "Pending"  },
  { id: 3, name: "Roumane Lydia",   destination: "Italy",   start: "2025-12-04", status: "Rejected" },
  { id: 4, name: "Amir Sali",       destination: "Germany", start: "2026-03-01", status: "Active"   },
  { id: 5, name: "Fatima Zohra",    destination: "Dubai",   start: "2026-03-10", status: "Pending"  },
];

const destinations = [
  { city: "Paris",   count: 8,  color: "#378ADD" },
  { city: "Spain",   count: 5,  color: "#1D9E75" },
  { city: "Italy",   count: 4,  color: "#BA7517" },
  { city: "Dubai",   count: 3,  color: "#D85A30" },
  { city: "Other",   count: 4,  color: "#888780" },
];

// Returns the correct badge style based on mission status
const getBadgeStyle = (status) => {
  if (status === "Active")   return { background: "#EAF3DE", color: "#3B6D11" };
  if (status === "Pending")  return { background: "#FAEEDA", color: "#854F0B" };
  if (status === "Rejected") return { background: "#FCEBEB", color: "#A32D2D" };
};

function Dashboard() {

  // Count missions by status
  const total    = missions.length;
  const active   = missions.filter(m => m.status === "Active").length;
  const pending  = missions.filter(m => m.status === "Pending").length;
  const rejected = missions.filter(m => m.status === "Rejected").length;

  const maxCount = Math.max(...destinations.map(d => d.count));

  return (
    <div style={{ padding: "1.5rem", background: "var(--color-background-tertiary)", minHeight: "100vh" }}>

      {/* Overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: "12px", marginBottom: "1.5rem" }}>
        
        <div style={cardStyle}>
          <p style={labelStyle}>Total missions</p>
          <p style={{ ...valueStyle, color: "#185FA5" }}>{total}</p>
          <p style={{ ...subStyle, color: "#378ADD" }}>All time</p>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Active</p>
          <p style={{ ...valueStyle, color: "#3B6D11" }}>{active}</p>
          <p style={{ ...subStyle, color: "#639922" }}>Currently ongoing</p>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Pending</p>
          <p style={{ ...valueStyle, color: "#854F0B" }}>{pending}</p>
          <p style={{ ...subStyle, color: "#BA7517" }}>Awaiting approval</p>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Rejected</p>
          <p style={{ ...valueStyle, color: "#A32D2D" }}>{rejected}</p>
          <p style={{ ...subStyle, color: "#E24B4A" }}>Not approved</p>
        </div>

      </div>

      {/* Bottom section: table + bar chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        {/* Recent missions table */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>Recent missions</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Destination</th>
                <th style={thStyle}>Start date</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m) => (
                <tr key={m.id}>
                  <td style={tdStyle}>{m.name}</td>
                  <td style={tdStyle}>{m.destination}</td>
                  <td style={tdStyle}>{m.start}</td>
                  <td style={tdStyle}>
                    <span style={{ ...badgeStyle, ...getBadgeStyle(m.status) }}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Missions by destination bar chart */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>Missions by destination</p>
          {destinations.map((d) => (
            <div key={d.city} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", width: "50px", textAlign: "right" }}>
                {d.city}
              </span>
              <div style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: "4px", height: "10px" }}>
                <div style={{
                  width: `${(d.count / maxCount) * 100}%`,
                  background: d.color,
                  height: "10px",
                  borderRadius: "4px"
                }}/>
              </div>
              <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", width: "20px" }}>
                {d.count}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// Shared styles
const cardStyle = {
  background: "var(--color-background-primary)",
  borderRadius: "var(--border-radius-lg)",
  border: "0.5px solid var(--color-border-tertiary)",
  padding: "1rem 1.25rem",
};

const labelStyle = {
  fontSize: "13px",
  color: "var(--color-text-secondary)",
  margin: "0 0 6px",
};

const valueStyle = {
  fontSize: "28px",
  fontWeight: "500",
  margin: "0",
};

const subStyle = {
  fontSize: "12px",
  margin: "4px 0 0",
};

const sectionStyle = {
  background: "var(--color-background-primary)",
  borderRadius: "var(--border-radius-lg)",
  border: "0.5px solid var(--color-border-tertiary)",
  padding: "1rem 1.25rem",
};

const sectionTitleStyle = {
  fontSize: "15px",
  fontWeight: "500",
  margin: "0 0 1rem",
  color: "var(--color-text-primary)",
};

const thStyle = {
  textAlign: "left",
  color: "var(--color-text-secondary)",
  fontWeight: "400",
  padding: "0 0 8px",
  borderBottom: "0.5px solid var(--color-border-tertiary)",
};

const tdStyle = {
  padding: "10px 0",
  borderBottom: "0.5px solid var(--color-border-tertiary)",
  color: "var(--color-text-primary)",
};

const badgeStyle = {
  fontSize: "11px",
  padding: "3px 8px",
  borderRadius: "20px",
  fontWeight: "500",
};

export default Dashboard;