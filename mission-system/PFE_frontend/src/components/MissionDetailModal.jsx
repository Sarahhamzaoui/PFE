import React, { useState } from "react";
import "../pages/manager/ManagerPage.css";
import "../Styles/MissionDetailModal.css";

function MissionDetailModal({ mission, onClose, role, onUpdateDecision }) {
  // local note state — manager can edit before saving
  const [editNote, setEditNote] = useState(mission?.note || "");

  // nothing to render if no mission is passed
  if (!mission) return null;

  // file attachment badge
  const AttachPill = ({ file }) => (
  <a href={file.url} target="_blank" rel="noreferrer" className="attach-pill" style={{ textDecoration: 'none' }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
    {file.name}
  </a>
);


  return (
    <div className="overlay">
      <div className="detail-modal">

        {/* ── Header ── */}
        <div className="modal-header">
          <div className="modal-header__left">
            <div className="modal-title">
              {mission.title}

              {/*
                urgent badge — always visible inside the modal for all statuses.
                this lets the secretary/manager see the mission was flagged urgent
                even after it has been approved or rejected.
                in the table it only appears while status is still pending.
              */}
              {mission.is_urgent == 1 && (
                <span className="modal-urgent-badge"> Urgent</span>
              )}
            </div>

            {/* submission meta line */}
            <div className="modal-meta">
              Submitted by {mission.secretary} · {mission.dateLabel}
            </div>
          </div>

          {/* optional priority badge + close button */}
          <div className="modal-header__right">
            {mission.priority && (
              <span className={`priority ${mission.priority}`}>
                {mission.priLabel}
              </span>
            )}
            <button className="close-btn" onClick={onClose}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="18"
                height="18"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mission metadata grid ── */}
        <div className="modal-fields">
          <div>
            <div className="field-label">Department</div>
            <div className="field-val">{mission.dept}</div>
          </div>
          <div>
            <div className="field-label">Deadline</div>
            <div className="field-val">{mission.deadline}</div>
          </div>
          <div>
            <div className="field-label">Assigned to</div>
            <div className="field-val">{mission.assignedTo}</div>
          </div>
          <div>
            <div className="field-label">Location</div>
            <div className="field-val">{mission.location}</div>
          </div>
        </div>

        {/* ── Travel preferences — shown only when at least one value is set ── */}
        {(mission.accommodation || mission.transport || mission.needs_driver) && (
          <div className="modal-fields modal-fields--travel">
            {mission.accommodation && (
              <div>
                <div className="field-label">Accommodation</div>
                <div className="field-val field-val--capitalize">
                  {mission.accommodation}
                </div>
              </div>
            )}
            {mission.transport && (
              <div>
                <div className="field-label">Transport</div>
                <div className="field-val field-val--capitalize">
                  {mission.transport === "company"
                    ? "Company Car"
                    : mission.transport === "personal"
                      ? "Personal Car"
                      : mission.transport}
                </div>
              </div>
            )}
            <div>
              <div className="field-label">Driver needed</div>
              <div className="field-val">
                {mission.needs_driver == 1 ? "Yes" : "No"}
              </div>
            </div>
          </div>
        )}

        {/* ── Objectives / description ── */}
        <div className="modal-desc">{mission.desc}</div>

        {/* ── File attachments (if any) ── */}
        {mission.attachments?.length > 0 && (
          <div className="card-attachments modal-attachments">
            {mission.attachments.map((f, i) => (
              <AttachPill key={i} file={f} />
            ))}
          </div>
        )}

        {/* ── Current decision badge — shown to all roles ── */}
        {mission.decision && (
          <div className="modal-decision">
            <div className="field-label">Decision</div>
            <span
              className={`decision-badge ${
                mission.decision === "approved" ? "app" : "rej"
              }`}
            >
              {mission.decision}
            </span>
          </div>
        )}

        {/* ── Manager note — shown to all roles if present ── */}
        {mission.note && (
          <div className="modal-rej-note">
            <div className="modal-rej-label">Manager note</div>
            {mission.note}
          </div>
        )}

        {/* ── MANAGER ONLY — editable note + change decision buttons ── */}
        {role === "manager" && (
          <>
            {/* editable note textarea */}
            <div className="note-area">
              <div className="note-label">Edit note</div>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="Add or edit a note..."
              />
            </div>

            {/* approve / reject action buttons */}
            <div className="edit-label">Change decision</div>
            <div className="edit-actions">
              <button
                className="btn-reject"
                onClick={() => onUpdateDecision("rejected", editNote)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Set as rejected
              </button>
              <button
                className="btn-approve"
                onClick={() => onUpdateDecision("approved", editNote)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                  <polyline points="20 6 9 17 4 12" />
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
