import React, { useState } from 'react';
import './App.css';
import { DatePicker, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';


function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        <AddTask />
        <Dates />
      </div>
    </LocalizationProvider>
  );
}

const Dates = () => {
  const currDate = new Date();
  const pastDate = new Date(currDate.getFullYear() - 1, 0, 1);
  const futureDate = new Date(currDate.getFullYear() + 1, 0, 1);
  const datesArray = [];

  // Loop through each date between pastDate and futureDate
  for (let date = pastDate; date <= futureDate; date.setDate(date.getDate() + 1)) {
    datesArray.push(new Date(date));
  }

  return (
    <>
      {datesArray.map((date, index) => (
        <DateItem key={index} date={date} />
      ))}
      
    </>
  );
};

const DateItem = ({ date }) => {
  const [tasks, setTasks] = useState({});

  const saveTask = (selectedDate, selectedTime, task) => {
    const dateString = selectedDate.toDateString();
    const updatedTasks = { ...tasks };
    if (!updatedTasks[dateString]) {
      updatedTasks[dateString] = {};
    }
    updatedTasks[dateString][selectedTime] = task;
    setTasks(updatedTasks);
  };

  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    const time = hour < 10 ? '0' + hour + ':00' : hour + ':00';
    timeSlots.push(time);
  }

  return (
    <div className="date-container">
      <div className="date">
        <div>{date.toDateString()}</div>
        {tasks[date.toDateString()] && (
          <ul>
            {Object.entries(tasks[date.toDateString()]).map(([time, task]) => (
              <li key={time}>
                <strong>{time}:</strong> {task}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const AddTask = ({ onSaveTask}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [selectedTime, setSelectedTime] = useState('');
  const [task, setTask] = useState('');
  
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveTask = () => {
    onSaveTask(selectedDate.toDate(), selectedTime, task);
    handleCloseModal();
  };

  return (
    <>
      <button onClick={handleShowModal} className="add-task-button">
        Add Task
      </button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Add Task</h2>
            <label>Date:</label>
            <MobileDatePicker defaultValue={dayjs(new Date())} />
        <label>Time:</label>
        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
          <option value="">Select Time</option>
          {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
            <option key={hour} value={`${hour < 10 ? '0' : ''}${hour}:00`}>{`${hour < 10 ? '0' : ''}${hour}:00`}</option>
          ))}
        </select>
        <label>Task:</label>
        <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />
        <label>Color:</label>
        <button onClick={handleSaveTask}>Save Task</button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
