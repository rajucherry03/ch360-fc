import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faClock, faCalendarAlt, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

const AttendanceList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const today = new Date().toISOString().split('T')[0];

  const classSchedules = [
    { id: 1, name: 'Math 101', time: '10:00 AM - 11:00 AM', date: today },
    { id: 2, name: 'Science 102', time: '11:00 AM - 12:00 PM', date: today },
    { id: 3, name: 'History 201', time: '01:00 PM - 02:00 PM', date: today },
    { id: 4, name: 'Art 101', time: '02:00 PM - 03:00 PM', date: '2024-01-15' },
    { id: 5, name: 'Physical Education 101', time: '03:00 PM - 04:00 PM', date: '2024-01-16' },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const filteredSchedules = classSchedules.filter(
    (schedule) => schedule.date === selectedDate.toISOString().split('T')[0]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Today's Class Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {classSchedules.filter(schedule => schedule.date === today).map((schedule) => (
            <div key={schedule.id} className="border p-4 rounded shadow-sm flex justify-between items-center bg-white hover:bg-gray-100 transition duration-300">
              <div>
                <div className="text-gray-800 font-bold flex items-center">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" /> {schedule.name}
                </div>
                <div className="text-gray-600 flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-2" /> {schedule.time}
                </div>
              </div>
              <Link to={`/attendance/${schedule.id}`} className="text-blue-500 hover:underline">
                <FontAwesomeIcon icon={faEdit} className="mr-1" /> View Details
              </Link>
            </div>
          ))}
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Edit Attendance</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy/MM/dd"
            className="w-full p-2 border rounded bg-white"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="border p-4 rounded shadow-sm flex justify-between items-center bg-white hover:bg-gray-100 transition duration-300">
              <div>
                <div className="text-gray-800 font-bold flex items-center">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" /> {schedule.name}
                </div>
                <div className="text-gray-600 flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-2" /> {schedule.time}
                </div>
              </div>
              <Link to={`/edit-attendance/${schedule.id}`} className="text-blue-500 hover:underline">
                <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit Attendance
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
