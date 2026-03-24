// src/components/MissionCalendar.jsx - NO ICONS NEEDED
import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { Button, TextField, InputAdornment } from '@mui/material';

export default function MissionCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const formattedDate = selectedDate 
    ? selectedDate.format('DD/MM/YYYY') 
    : '';

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setCalendarOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="form-group">
        <label>Start Date</label>
        
        <div className="date-input-wrapper">
          <TextField
            fullWidth
            value={formattedDate}
            placeholder="Click calendar icon to select"
            className="form-input date-display"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="calendar-toggle"
                    size="small"
                  >
                    📅
                  </Button>
                </InputAdornment>
              ),
            }}
          />

          {calendarOpen && (
            <div className="calendar-container">
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
}
