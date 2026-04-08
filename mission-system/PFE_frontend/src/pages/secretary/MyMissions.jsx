import React, { useState } from "react";
import "./MyMissions.css";
import MissionDetailModal from "../../components/MissionDetailModal";

const allMissions = [
  { id: 1, name: "Hamzaoui Sarah",  destination: "Paris",   start: "2026-02-20", status: "Active",
    title: "Mission to Paris", secretary: "Hamzaoui Sarah", dateLabel: "Feb 20, 2026",
    priority: "med", priLabel: "Medium priority", dept: "Finance",
    deadline: "Mar 1, 2026", assignedTo: "Finance team", location: "Paris",
    desc: "Finance-related mission to Paris.", attachments: [], decision: "approved", note: "" },

  { id: 2, name: "Zeraouti Lyna",   destination: "Spain",   start: "2026-01-05", status: "Pending",
    title: "Mission to Spain", secretary: "Zeraouti Lyna", dateLabel: "Jan 5, 2026",
    priority: "low", priLabel: "Low priority", dept: "HR",
    deadline: "Jan 20, 2026", assignedTo: "HR team", location: "Spain",
    desc: "HR-related mission to Spain.", attachments: [], decision: null, note: "" },

  { id: 3, name: "Roumane Lydia",   destination: "Italy",   start: "2025-12-04", status: "Urgent",
    title: "Mission to Italy", secretary: "Roumane Lydia", dateLabel: "Dec 4, 2025",
    priority: "high", priLabel: "High priority", dept: "Operations",
    deadline: "Dec 15, 2025", assignedTo: "Operations team", location: "Italy",
    desc: "Urgent operations mission to Italy.", attachments: [], decision: null, note: "" },

  { id: 4, name: "Amir Sali",       destination: "Germany", start: "2026-03-01", status: "Active",
    title: "Mission to Germany", secretary: "Amir Sali", dateLabel: "Mar 1, 2026",
    priority: "med", priLabel: "Medium priority", dept: "IT",
    deadline: "Mar 15, 2026", assignedTo: "IT team", location: "Germany",
    desc: "IT infrastructure mission to Germany.", attachments: [], decision: "approved", note: "" },

  { id: 5, name: "Fatima Zohra",    destination: "Dubai",   start: "2026-03-10", status: "Pending",
    title: "Mission to Dubai", secretary: "Fatima Zohra", dateLabel: "Mar 10, 2026",
    priority: "med", priLabel: "Medium priority", dept: "Sales",
    deadline: "Mar 25, 2026", assignedTo: "Sales team", location: "Dubai",
    desc: "Sales outreach mission to Dubai.", attachments: [], decision: null, note: "" },
];

const TABS = ["All missions", "Pending", "Active", "Urgent"];

export default function MyMissions({ setActivePage }) {
  const [activeTab, setActiveTab] = useState("All missions");
  const [search, setSearch] = useState("");

  // Tracks which mission is open in the detail modal (null = closed)
  const [selectedMission, setSelectedMission] = useState(null);

  const pending  = allMissions.filter(m => m.status === "Pending").length;
  const approved = allMissions.filter(m => m.status === "Active").length;
  const urgent   = allMissions.filter(m => m.status === "Urgent").length;
  const total    = allMissions.length;

  const filtered = allMissions.filter(m => {
    const matchTab    = activeTab === "All missions" || m.status === activeTab;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.destination.toLowerCase().includes(search.toLowerCase()) ||
                        String(m.id).toLowerCase().includes(search.toLowerCase());
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
      <div className="db-cards-grid">
        <div className="db-card db-card--blue">
          <div className="db-card__top">
            <span className="db-card__label">Total Missions</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{total}</p>
          <p className="db-card__sub">All time</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Approved</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{approved}</p>
          <p className="db-card__sub db-card__sub--green">↑ Currently ongoing</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Pending</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{pending}</p>
          <p className="db-card__sub db-card__sub--amber">↑ Awaiting approval</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Urgent</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{urgent}</p>
          <p className="db-card__sub db-card__sub--red">↑ Needs attention</p>
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
                <td>{m.start}</td>
                <td>
                  <span className={`mm-badge mm-badge--${m.status.toLowerCase()}`}>
                    {m.status}
                  </span>
                </td>
                <td>
                  {/* Opens the read-only detail modal for this mission */}
                  <button className="mm-action-btn" onClick={() => setSelectedMission(m)}>View ›</button>
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

      {/* Mission detail modal — read-only for employees */}
      {selectedMission && (
        <MissionDetailModal
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
          role="employee"
        />
      )}

    </div>
  );
}
