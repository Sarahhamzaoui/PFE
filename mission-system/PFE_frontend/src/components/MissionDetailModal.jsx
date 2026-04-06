import React, { useState } from 'react';

import '../pages/manager/ManagerPage.css';
function MissionDetailModal({ mission, onClose, role, onUpdateDecision }) {

  // Local note state — manager can edit before saving
  const [editNote, setEditNote] = useState(mission?.note || '');

  // Nothing to render if no mission is passed
  if (!mission) return null;

  // File attachment badge
  const AttachPill = ({ file }) => (
    <div className="attach-pill">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      {file}
    </div>
  );

  return (
    <div className="overlay">
      <div className="detail-modal">

        {/* ── Header ── */}
        <div className="modal-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
          <div>
            <div className="modal-title" style={{ fontSize: '16px', fontWeight: '500', lineHeight: '1.4' }}>
              {mission.title}
            </div>
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '3px' }}>
              Submitted by {mission.secretary} · {mission.dateLabel}
            </div>
          </div>

          {/* Priority badge + close button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {mission.priority && (
              <span className={`priority ${mission.priority}`}>{mission.priLabel}</span>
            )}
            <button
              className="close-btn"
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#888' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mission metadata ── */}
        <div className="modal-fields">
          <div><div className="field-label">Department</div><div className="field-val">{mission.dept}</div></div>
          <div><div className="field-label">Deadline</div><div className="field-val">{mission.deadline}</div></div>
          <div><div className="field-label">Assigned to</div><div className="field-val">{mission.assignedTo}</div></div>
          <div><div className="field-label">Location</div><div className="field-val">{mission.location}</div></div>
        </div>

        {/* ── Description ── */}
        <div className="modal-desc">{mission.desc}</div>

        {/* ── Attachments ── */}
        {mission.attachments?.length > 0 && (
          <div className="card-attachments" style={{ marginBottom: '16px' }}>
            {mission.attachments.map((f, i) => <AttachPill key={i} file={f} />)}
          </div>
        )}

        {/* ── Current decision badge (shown to everyone) ── */}
        {mission.decision && (
          <div style={{ marginBottom: '16px' }}>
            <div className="field-label" style={{ marginBottom: '6px' }}>Decision</div>
            <span className={`decision-badge ${mission.decision === 'approved' ? 'app' : 'rej'}`}>
              {mission.decision}
            </span>
          </div>
        )}

        {/* ── Rejection note (shown to everyone if present) ── */}
        {mission.note && (
          <div className="modal-rej-note">
            <div className="modal-rej-label">Rejection reason</div>
            {mission.note}
          </div>
        )}

        {/* ── MANAGER ONLY — edit note + change decision ── */}
        {role === 'manager' && (
          <>
            {/* Editable note */}
            <div className="note-area">
              <div className="note-label">Edit note</div>
              <textarea
                value={editNote}
                onChange={e => setEditNote(e.target.value)}
                placeholder="Add or edit a note..."
              />
            </div>

            {/* Change decision buttons */}
            <div className="edit-label">Change decision</div>
            <div className="edit-actions">
              <button
                className="btn-reject"
                onClick={() => onUpdateDecision('rejected', editNote)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Set as rejected
              </button>
              <button
                className="btn-approve"
                onClick={() => onUpdateDecision('approved', editNote)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Set as approved
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default MissionDetailModal;
