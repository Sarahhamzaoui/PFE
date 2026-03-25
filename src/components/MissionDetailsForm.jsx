import React, { useState, useEffect } from 'react';
import MissionCalendar from './MissionCalendar';
import '../Styles/MissionDeatilsForm.css';

function MissionDetailsForm({ selectedEmployee, onFormDataChange }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    phoneNumber:'',
    employeeDepartment: '',
    destination: '',
    missionTitle: '',
    missionDescription: '',
    startDate: '',
    endDate: '',
    accommodation: '',
    transport: '',
    needsDriver: false
  });

  const [accommodation, setAccommodation] = useState('');
  const [transport, setTransport] = useState('');
  const [needsDriver, setNeedsDriver] = useState(false);

  // auto fill 
  useEffect(() => {
    if (selectedEmployee) {
      setFormData(prev => ({
        ...prev,
        employeeId: selectedEmployee.employeeId,
        employeeName: selectedEmployee.name,
        employeeDepartment: selectedEmployee.department,
        phoneNumber:selectedEmployee.phoneNumber
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        employeeId: '',
        employeeName: '',
        employeeDepartment: '',
        phoneNumber:''
      }));
    }
  }, [selectedEmployee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    onFormDataChange?.(formData);
  };

  const HandleCancel = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      phoneNumber:'',
      employeeDepartment: '',
      destination: '',
      missionTitle: '',
      missionDescription: '',
      startDate: '',
      endDate: '',
      accommodation: '',
      transport: '',
      needsDriver: false
    });
    setAccommodation('');
    setTransport('');
    setNeedsDriver(false);
  };

  return (
    <>
      <div className="section-title">Mission Details</div>

      {/* EMPLOYEE INFO */}
      <div className="employee-info-section">
        <div className="section-subtitle">Assigned Employee</div>
        <div className="form-row">
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              className="form-input readonly"
              value={formData.employeeId}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              name="employeeName"
              className="form-input readonly"
              value={formData.employeeName}
              readOnly
            />
          </div>

          <div className='form-goup'>
            <label> Phone Number</label>
            <input
            type='tel'
            name='phoneNumber'
            className='form-input readonly'
            value={formData.phoneNumber}
            readOnly
            /> 
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="employeeDepartment"
              className="form-input readonly"
              value={formData.employeeDepartment}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* MISSION INFO */}
      <div className="mission-info-section">
        <div className="section-subtitle">Mission Information</div>
        <div className="form-row">
          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              className="form-input"
              placeholder="Enter Destination"
              value={formData.destination}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Mission Title</label>
            <input
              type="text"
              name="missionTitle"
              className="form-input"
              placeholder="Enter Mission Title"
              value={formData.missionTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Mission Description</label>
            <textarea
              name="missionDescription"
              className="form-textarea"
              placeholder="Enter mission description..."
              value={formData.missionDescription}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group full-width">
            <MissionCalendar />
          </div>
        </div>
      </div>

      {/* ACCOMMODATION & TRANSPORT */}
      <div className="accommodation-transport-section">
        <div className="section-subtitle">Accommodation & Transport</div>
        <div className="form-row">

          {/* ACCOMMODATION */}
          <div className="form-group">
            <label>Accommodation</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="accommodation"
                  value="hotel"
                  checked={accommodation === 'hotel'}
                  onChange={(e) => setAccommodation(e.target.value)}
                />
                Hotel
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="accommodation"
                  value="residence"
                  checked={accommodation === 'residence'}
                  onChange={(e) => setAccommodation(e.target.value)}
                />
                Residence
              </label>
            </div>
          </div>

          {/* TRANSPORT */}
          <div className="form-group">
            <label>Transport</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="transport"
                  value="company"
                  checked={transport === 'company'}
                  onChange={(e) => { setTransport(e.target.value); setNeedsDriver(false); }}
                />
                Company Car
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="transport"
                  value="personal"
                  checked={transport === 'personal'}
                  onChange={(e) => { setTransport(e.target.value); setNeedsDriver(false); }}
                />
                Personal Car
              </label>
            </div>

            {transport === 'company' && (
              <div className="checkbox-group" style={{ marginTop: '8px' }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={needsDriver}
                    onChange={(e) => setNeedsDriver(e.target.checked)}
                  />
                  Needs a Driver
                </label>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* BUTTONS */}
      <div className='btn-group'>
        <button type='button' className='btn btn-cancel' onClick={HandleCancel}>
          Cancel
        </button>
        <button type='submit' className='btn btn-submit'>
          Submit Missions
        </button>
      </div>
    </>
  );
}

export default MissionDetailsForm;