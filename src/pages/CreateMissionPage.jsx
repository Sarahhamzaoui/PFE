import React, { useState } from 'react';
import '../Styles/createMission.css'; 
import EmployeeSelection from '../components/EmployeeSelection';
import MissionDetailsForm from '../components/MissionDetailsForm';
import AttachmentsDropzone from '../components/AttachmentsDropzone';
import MissionCalendar from '../components/MissionCalendar';

function CreateMissionPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('SUBMIT FORM:', selectedEmployee, 'Mission Data: ', {
      employeeId: selectedEmployee?.employeeId,
      employeeName: selectedEmployee?.name,
      department: selectedEmployee?.department
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="header">
      
        <h1>Create Mission</h1>
      </div>

      <EmployeeSelection onEmployeeSelect={setSelectedEmployee} />
      <MissionDetailsForm selectedEmployee={selectedEmployee} />
      <AttachmentsDropzone />
      
      
    </form>
  );
}

export default CreateMissionPage;