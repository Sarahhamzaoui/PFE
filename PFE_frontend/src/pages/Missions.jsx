import { useState } from "react";
import "../Styles/Mission.css";


function Mission() {

  
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const firstName = "User";

  const missions = [
    {
      id: 3,
      name: "Hamzaoui Sarah",
      title: "Business Trip",
      destination: "Paris",
      start: "2026-02-20",
      end: "2026-02-25",
      status: "Active"
    },
    {
      id: 2,
      name: "Zeraouti Lyna",
      title: "Business Trip",
      destination: "Spain",
      start: "2026-01-05",
      end: "2026-01-15",
      status: "Pending"
   },
    {
      id: 1,
      name: "Roumane Lydia",
      title: "Business Trip",
      destination: "Italy",
      start: "2025-12-04",
      end: "2025-12-13",
      status: "Urgent"
    }
  ];

  const filtered = missions.filter(m => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.destination.toLowerCase().includes(search.toLowerCase());
    const matchDate = dateFilter === "" || m.start === dateFilter;
    return matchSearch && matchDate;
  });

  const openMission = (id) => {
    window.location.href = "/mission/" + id;
  };

  return (

    <div className="layout">                      {/* ← ADDED layout class */}


      {/* MAIN */}
      

        <div className="topbar">

          <img src="/logo.jpg"
           width="150" alt="logo" />

          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search missions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="user-info">
            Welcome, {firstName}
          </div>

        </div>

        {/* TABLE */}
        <div className="container">

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Title</th>
                <th>Destination</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => {

                let statusClass = "badge";
                if (m.status === "Active")   statusClass += " active-status";
                if (m.status === "Pending")  statusClass += " pending";
                if (m.status === "Urgent") statusClass += " Urgent";

                return (
                  <tr key={m.id} onClick={() => openMission(m.id)}>
                    <td>{m.id}</td>
                    <td>{m.name}</td>
                    <td>{m.title}</td>
                    <td>{m.destination}</td>
                    <td>{m.start}</td>
                    <td><span className={statusClass}>{m.status}</span></td>
                    <td>{m.end}</td>
                    <td>
                      <span className="action edit">✏</span>
                      <span className="action delete">🗑</span>
                    </td>
                  </tr>
                );

              })}
            </tbody>
          </table>

        </div>

        {/* NOTIFICATION */}
        <div className="Notification">
          <p>Send notification here:</p>
          <button className="Notification-btn">Notification</button>
        </div>

      </div>

   

  );

}

export default Mission;