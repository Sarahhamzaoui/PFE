import React, { useState } from 'react';
import './createMissionPage.css'; 
import EmployeeSelection from '../../components/EmployeeSelection';
import MissionDetailsForm from '../../components/MissionDetailsForm';
import AttachmentsDropzone from '../../components/AttachmentsDropzone';

const BASE_URL = "http://localhost/mission-system/PFE_backend/api";

function CreateMissionPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [attachedFiles, setAttachedFiles] = useState([]); // track files from dropzone

  const handleSubmit = async (data) => {
    if (!data.missionTitle || !data.destination || !data.startDate || !data.endDate) {
      alert("Please fill in all required fields.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    // build FormData instead of JSON so files can be included
    const formData = new FormData();
    formData.append('title',         data.missionTitle);
    formData.append('destination',   data.destination);
    formData.append('start_date',    data.startDate);
    formData.append('end_date',      data.endDate);
    formData.append('objectives',    data.missionDescription || '');
    formData.append('is_urgent',     data.missionurgent ? 1 : 0);
    formData.append('assigned_to',   selectedEmployee?.user_id ?? '');
    formData.append('created_by',    user?.user_id);
    formData.append('accommodation', data.accommodation || '');
    formData.append('transport',     data.transport     || '');
    formData.append('needs_driver',  data.needsDriver   ? 1 : 0);

    // append each file under the key attachments[]
    attachedFiles.forEach(file => formData.append('attachments[]', file));

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/missions/missions.php`, {
        method: "POST",
        // no Content-Type header — browser sets multipart/form-data automatically
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage("Mission submitted successfully! ✓");
        setTimeout(() => {
          setSuccessMessage("");
          setSelectedEmployee(null);
          setAttachedFiles([]);
          setResetKey(prev => prev + 1);
        }, 3000);
      } else {
        alert(result.message || "Failed to create mission.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedEmployee(null);
    setAttachedFiles([]);
    setResetKey(prev => prev + 1);
    setSuccessMessage("");
  };

  return (
    <div className="form-container">
      <div className="header">
        <h1>Create Mission</h1>
      </div>

      <EmployeeSelection
        key={"emp-" + resetKey}
        onEmployeeSelect={setSelectedEmployee}
      />

      <MissionDetailsForm
        key={resetKey}
        selectedEmployee={selectedEmployee}
        onFormDataChange={handleSubmit}
      />

      {/* wire onFilesChange so parent tracks the selected files */}
      <AttachmentsDropzone
        key={"drop-" + resetKey}
        onFilesChange={setAttachedFiles}
      />

      {successMessage && (
        <div className="success-banner">{successMessage}</div>
      )}

      <div className="btn-group">
        <button type="button" className="btn btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-submit" form='mission-form' disabled={loading}>
          {loading ? "Submitting..." : "Submit Mission"}
        </button>
      </div>
    </div>
  );
}

export default CreateMissionPage;