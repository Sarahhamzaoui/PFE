import React, { useState } from "react";
import "../Styles/MyMissions.css";



const allMissions = [
  { id: "MSN001", name: "Hamzaoui Sarah",  destination: "Paris",   date: "2026-02-20", status: "Active",   payment: "Approved" },
  { id: "MSN002", name: "Zeraouti Lyna",   destination: "Spain",   date: "2026-01-05", status: "Pending",  payment: "Pending"  },
  { id: "MSN003", name: "Roumane Lydia",   destination: "Italy",   date: "2025-12-04", status: "Rejected", payment: "Rejected" },
  { id: "MSN004", name: "Amir Sali",       destination: "Germany", date: "2026-03-01", status: "Active",   payment: "Approved" },
  { id: "MSN005", name: "Fatima Zohra",    destination: "Dubai",   date: "2026-03-10", status: "Pending",  payment: "Pending"  },
  { id: "MSN006", name: "Karim Benali",    destination: "London",  date: "2026-03-15", status: "Active",   payment: "Approved" },
  { id: "MSN007", name: "Nadia Oukaci",    destination: "Paris",   date: "2026-03-18", status: "Pending",  payment: "Pending"  },
];

const TABS = ["All missions", "Pending", "Active", "Rejected"];

export default function MyMissions({setActivePage}) {
  const [activeTab, setActiveTab] = useState("All missions");
  const [search, setSearch] = useState("");

  const newCount      = allMissions.filter(m => m.status === "Pending").length;
  const activeCount   = allMissions.filter(m => m.status === "Active").length;
  const rejectedCount = allMissions.filter(m => m.status === "Rejected").length;
  const totalCount    = allMissions.length;

  const filtered = allMissions.filter(m => {
    const matchTab    = activeTab === "All missions" || m.status === activeTab;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.destination.toLowerCase().includes(search.toLowerCase()) ||
                        m.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="mm-page">

      {/* Header */}
      <div className="mm-header">
        <h1 className="mm-title">My Missions</h1>
        <button className="mm-btn-primary" onClick={() => setActivePage("create-mission-page")}>+ New Mission</button>
      </div>

      {/* Summary cards */}
      <div className="mm-summary-grid">
        <div className="mm-summary-card mm-summary-card--blue">
          <p className="mm-summary__label">New missions</p>
          <p className="mm-summary__value">{newCount}</p>
          <p className="mm-summary__sub">↑ Than last week</p>
        </div>
        <div className="mm-summary-card mm-summary-card--green">
          <p className="mm-summary__label">Active</p>
          <p className="mm-summary__value">{activeCount}</p>
          <p className="mm-summary__sub">↑ Than last week</p>
        </div>
        <div className="mm-summary-card mm-summary-card--red">
          <p className="mm-summary__label">Rejected</p>
          <p className="mm-summary__value">{rejectedCount}</p>
          <p className="mm-summary__sub">↓ Than last week</p>
        </div>
        <div className="mm-summary-card mm-summary-card--amber">
          <p className="mm-summary__label">Total</p>
          <p className="mm-summary__value">{totalCount}</p>
          <p className="mm-summary__sub">All time</p>
        </div>
      </div>

      {/* Table card */}
      <div className="mm-table-card">

        {/* Tabs */}
        <div className="mm-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`mm-tab ${activeTab === tab ? "mm-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mm-toolbar">
          <div className="mm-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aab0c0" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="mm-search"
              placeholder="Search missions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="mm-count">{filtered.length} missions</span>
          <button className="mm-btn-outline">⬇ Export</button>
        </div>

        {/* Table */}
        <table className="mm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mission ID</th>
              <th>Employee</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id}>
                <td className="mm-table__num">{i + 1}</td>
                <td className="mm-table__id">{m.id}</td>
                <td className="mm-table__name">{m.name}</td>
                <td>{m.destination}</td>
                <td>{m.date}</td>
                <td>
                  <span className={`mm-badge mm-badge--${m.status.toLowerCase()}`}>
                    {m.status}
                  </span>
                </td>
                <td>
                  <button className="mm-action-btn">View ›</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="mm-empty">No missions found.</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}