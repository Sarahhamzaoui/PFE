import React from 'react';

const MyMissions = () => {
  const missions = [
    { id: 1, employeeId: 'EMP001', employeeFullName: 'lyna lyna ', date: '2026-03-10', status: 'Pending', action: 'View' },
    { id: 2, employeeId: 'EMP002', employeeFullName: 'Amir Sali', date: '2026-03-09', status: 'Approved', action: 'View' },
    { id: 3, employeeId: 'EMP001', employeeFullName: 'Fatma Zohra', date: '2026-03-08', status: 'Rejected', action: 'View' },
  ];

  return (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">15</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">80</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">8</div>
          <div className="stat-label">Urgent</div>
        </div>
        <div className="stat-card total">
          <div className="stat-number">128</div>
          <div className="stat-label">Total Missions</div>
        </div>
      </div>

      <div className="missions-table">
        <div className="table-header">
          <span>#</span>
          <span>Employee ID</span>
          <span> Employee Full Name</span>
          <span>Date Submitted</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {missions.map((mission, index) => (
          <div key={mission.id} className="table-row">
            <span>{index + 1}</span>
            <span>{mission.employeeId}</span>
            <span>{mission.employeeFullName}</span>
            <span>{mission.date}</span>
            <span className={`status ${mission.status.toLowerCase()}`}>
              {mission.status}
            </span>
            <span className="action-btn">View</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyMissions;
