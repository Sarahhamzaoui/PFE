import React, { useState } from 'react';

// Mock employee data — replace with real API call later
export const MOCK_EMPLOYEES = [  
  { 
    id: 1, 
    employeeId: "EMP001", 
    name: "Lyna Lyna", 
    email: "lynalyna@gmail.com", 
    phoneNumber:'2030',
    department: "HR",
    initials: "LL"
  },
  { 
    id: 2, 
    employeeId: "EMP002", 
    name: "Amir Sali", 
    email: "amir.sali@gmail.com", 
        phoneNumber:'4060',

    department: "IT", 
    initials: "AS"
  },
  { 
    id: 3, 
    employeeId: "EMP003", 
    name: "Fatima Zohra", 
    email: "fatima.zohra@gmail.com", 
        phoneNumber:'45678998765',

    department: "Finance", 
    initials: "FZ"
  }
];

// Receives onEmployeeSelect callback to pass the selected employee to the parent
function EmployeeSelection({ onEmployeeSelect }) {

  const [searchQuery, setSearchQuery] = useState('');       // current search input value
  const [selectedEmployee, setSelectedEmployee] = useState(null); // currently selected employee
  const [showSuggestions, setShowSuggestions] = useState(false);  // controls dropdown visibility

  // Filter employees by name or ID based on the search input
  const filteredEmployees = MOCK_EMPLOYEES.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Updates search input and shows/hides the dropdown
  // Clears selection if the input is emptied
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(query.length > 0);
    if (!query) {
      setSelectedEmployee(null);
      onEmployeeSelect?.(null);
    }
  };

  // Confirms an employee selection from the dropdown
  // Fills the input with their ID and name, hides the dropdown
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setSearchQuery(`${employee.employeeId} - ${employee.name}`);
    setShowSuggestions(false);
    onEmployeeSelect?.(employee); // notify parent component
  };

  // Resets everything back to empty state
  const clearSelection = () => {
    setSelectedEmployee(null);
    setSearchQuery('');
    setShowSuggestions(false);
    onEmployeeSelect?.(null); // notify parent that selection was cleared
  };

  return (
    <>
      <div className="section-title">Employee Selection</div>
      <div className="employee-selection">

        {/* Search input — triggers filtering on every keystroke */}
        <input
          type="text"
          className="search-input"
          placeholder="Search name or employee ID"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {/* Dropdown list — only shows when there are matching results */}
        {showSuggestions && filteredEmployees.length > 0 && (
          <div className="suggestions-dropdown">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="suggestion-item"
                onClick={() => handleEmployeeSelect(employee)}
              >
                <div className="avatar-suggestion">{employee.initials}</div>
                <div>
                  <div className="suggestion-name">{employee.name}</div>
                  <div className="suggestion-id">{employee.employeeId}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* shown when search has input but no employee matches */}
        {showSuggestions && filteredEmployees.length === 0 && (
          <div className="no-results">No employees found</div>
        )}

        {/* Employee card — shown after a selection is confirmed */}
        {selectedEmployee && (
          <div className="employee-card selected">
            <div className="avatar">{selectedEmployee.initials}</div>
            <div className="employee-details">
              <div className="employee-info">
                <h3>{selectedEmployee.name}</h3>
                <p>{selectedEmployee.email}</p>
                <span className="department">{selectedEmployee.department}</span>
              </div>
              {/* Clear button resets the selection */}
              <button className="clear-btn" type="button" onClick={clearSelection}>
                × Change
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status message — shown when user typed something but made no selection */}
      {!selectedEmployee && searchQuery && (
        <div className="employee-status no-selection">
          No employee selected
        </div>
      )}
    </>
  );
}

export default EmployeeSelection;