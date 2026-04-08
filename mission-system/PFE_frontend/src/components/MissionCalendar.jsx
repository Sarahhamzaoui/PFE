import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Button, TextField, InputAdornment } from '@mui/material';

export default function MissionCalendar({ onChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openCalendar, setOpenCalendar] = useState(null);

  const formatDisplay = (date) => date ? date.format('DD/MM/YYYY') : '';
  
  // MySQL format YYYY-MM-DD
  const formatDB = (date) => date ? date.format('YYYY-MM-DD') : '';

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    setOpenCalendar(null);
    // pass both dates up to parent
    onChange?.({ startDate: formatDB(newValue), endDate: formatDB(endDate) });
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    setOpenCalendar(null);
    // pass both dates up to parent
    onChange?.({ startDate: formatDB(startDate), endDate: formatDB(newValue) });
  };

  const toggleCalendar = (type) => {
    setOpenCalendar(prev => prev === type ? null : type);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* START DATE */}
      <div className="form-group">
        <label>Start Date</label>
        <div className="date-input-wrapper">
          <TextField
            fullWidth
            value={formatDisplay(startDate)}
            placeholder="Click calendar icon to select"
            className="form-input date-display"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={() => toggleCalendar('start')} className="calendar-toggle" size="small">
                    📆
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          {openCalendar === 'start' && (
            <div className="calendar-container">
              <DateCalendar value={startDate} onChange={handleStartDateChange} />
            </div>
          )}
        </div>
      </div>

      {/* END DATE */}
      <div className="form-group">
        <label>End Date</label>
        <div className="date-input-wrapper">
          <TextField
            fullWidth
            value={formatDisplay(endDate)}
            placeholder="Click calendar icon to select"
            className="form-input date-display"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={() => toggleCalendar('end')} className="calendar-toggle" size="small">
                    📆
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          {openCalendar === 'end' && (
            <div className="calendar-container">
              <DateCalendar value={endDate} onChange={handleEndDateChange} minDate={startDate || undefined} />
            </div>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
}