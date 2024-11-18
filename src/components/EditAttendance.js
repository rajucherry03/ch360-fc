import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faClock, faShieldAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const mockAttendanceData = [
  {
    id: 1,
    courseName: 'Introduction to Computer Science',
    year: 2023,
    semester: 'Spring',
    students: [
      { id: 1, name: 'Alice Johnson', status: 'Present' },
      { id: 2, name: 'Bob Smith', status: 'Absent' },
      { id: 3, name: 'Charlie Brown', status: 'Late' },
      { id: 4, name: 'David Wilson', status: 'Permission' },
    ],
  },
  // Add more class data here
];

const EditAttendance = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [classDetails, setClassDetails] = useState(null);

  useEffect(() => {
    const classData = mockAttendanceData.find(classData => classData.id === parseInt(id));
    if (classData) {
      setClassDetails(classData);
      setAttendance(classData.students);
    }
  }, [id]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prevAttendance =>
      prevAttendance.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleSubmit = () => {
    console.log('Updated Attendance:', attendance);
    // Here you can add the logic to save the attendance data
  };

  if (!classDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-light p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Edit Attendance for {classDetails.courseName} ({classDetails.year}, Semester {classDetails.semester})
        </h2>
        <div className="mb-4">
          <label className="text-lg font-bold text-gray-800">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
            className="ml-2 border rounded-lg p-2"
          />
        </div>
        <table className="w-full bg-white shadow-md rounded my-6">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm"><FontAwesomeIcon icon={faUser} /> Student</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm"><FontAwesomeIcon icon={faCheck} /> Present</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm"><FontAwesomeIcon icon={faTimes} /> Absent</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm"><FontAwesomeIcon icon={faClock} /> Late</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm"><FontAwesomeIcon icon={faShieldAlt} /> Permission</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(student => (
              <tr key={student.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4">
                  <input
                    type="radio"
                    name={`status-${student.id}`}
                    checked={student.status === 'Present'}
                    onChange={() => handleStatusChange(student.id, 'Present')}
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="radio"
                    name={`status-${student.id}`}
                    checked={student.status === 'Absent'}
                    onChange={() => handleStatusChange(student.id, 'Absent')}
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="radio"
                    name={`status-${student.id}`}
                    checked={student.status === 'Late'}
                    onChange={() => handleStatusChange(student.id, 'Late')}
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="radio"
                    name={`status-${student.id}`}
                    checked={student.status === 'Permission'}
                    onChange={() => handleStatusChange(student.id, 'Permission')}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Update Attendance
        </button>
      </div>
    </div>
  );
};

export default EditAttendance;
