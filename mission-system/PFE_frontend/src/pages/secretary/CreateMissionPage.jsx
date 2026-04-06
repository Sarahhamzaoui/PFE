import React, { useState } from 'react';
import './createMissionPage.css'; 
import EmployeeSelection from '../../components/EmployeeSelection';
import MissionDetailsForm from '../../components/MissionDetailsForm';
import AttachmentsDropzone from '../../components/AttachmentsDropzone';
import MissionCalendar from '../../components/MissionCalendar';

function CreateMissionPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSubmit = (data) => {
    console.log('SUBMIT FORM:' , data);
  };
  const handleCancel = () => {
    setSelectedEmployee(null);
  };

  return (
    <div  className="form-container">
      <div className="header">
      
        <h1>Create Mission</h1>
      </div>

      <EmployeeSelection onEmployeeSelect={setSelectedEmployee} />

      <MissionDetailsForm 
      selectedEmployee={selectedEmployee}
      onFormDataChange={handleSubmit}
       />
      <AttachmentsDropzone />

       {/* BUTTONS */}
      <div className="btn-group">
        <button type="button" className="btn btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-submit" form='mission-form'>  {/*the form="mission-form" to triggers the form in MissionDetailsForm */}
          Submit Mission
        </button>
      </div>
      
      
    </div>
  );
}

export default CreateMissionPage;