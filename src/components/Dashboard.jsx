import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faClock } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FacultyDashboard = () => {
  const coursePerformanceData = {
    labels: ['Math 101', 'Science 102', 'History 201'],
    datasets: [
      {
        label: 'Student Performance',
        data: [85, 78, 92],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Course Performance Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const timetable = [
    { time: '09:00 AM - 10:00 AM', course: 'Math 101' },
    { time: '10:00 AM - 11:00 AM', course: 'Science 102' },
    { time: '11:00 AM - 12:00 PM', course: 'History 201' },
    { time: '01:00 PM - 02:00 PM', course: 'Art 101' },
    { time: '02:00 PM - 03:00 PM', course: 'Physical Education 101' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc] p-6">
      {/* Tabs */}
      <div className="mb-4 border-b bg-white rounded-xl px-4">
        <div className="flex gap-6 text-sm overflow-x-auto">
          {['Dashboard','Profile Management','Recruitment','Teaching & Academic','Performance','Leave & Attendance','Payroll & Finance'].map((tab, i) => (
            <button key={i} className={`py-3 px-2 border-b-2 ${i===0 ? 'border-indigo-600 text-gray-900 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-xl p-8 text-white mb-6" style={{background:'linear-gradient(90deg, #3b82f6 0%, #7c3aed 100%)'}}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">Welcome to Faculty Management</h2>
            <p className="text-sm opacity-90">Manage your academic workforce efficiently</p>
          </div>
          <div className="text-6xl opacity-40">👥</div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {label:'Add Faculty', icon:'➕'},
          {label:'Process Payroll', icon:'💵'},
          {label:'View Reports', icon:'📄'},
          {label:'Leave Requests', icon:'📅'}
        ].map((c, idx)=> (
          <div key={idx} className="bg-white rounded-xl border p-6 hover:shadow-md transition">
            <div className="text-3xl mb-3">{c.icon}</div>
            <div className="font-semibold">{c.label}</div>
          </div>
        ))}
      </section>

      {/* Two-column: Activities + Chart */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ul>
            <li className="py-2 border-b">
              <h3 className="text-sm font-semibold">Math 101 - Assignment Graded</h3>
              <p className="text-gray-600 text-sm">Assignment 1 has been graded and returned to students.</p>
            </li>
            <li className="py-2 border-b">
              <h3 className="text-sm font-semibold">Science 102 - New Assignment</h3>
              <p className="text-gray-600 text-sm">Assignment 2 has been posted and is due on April 15, 2024.</p>
            </li>
            <li className="py-2">
              <h3 className="text-sm font-semibold">History 201 - Exam Scheduled</h3>
              <p className="text-gray-600 text-sm">Midterm Exam is scheduled for May 5, 2024.</p>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Course Performance</h2>
          <Bar data={coursePerformanceData} options={options} />
        </div>
      </section>

      {/* Timetable */}
      <section className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Class Timetable</h2>
        <ul>
          {timetable.map((classItem, index) => (
            <li key={index} className="py-2 border-b flex justify-between items-center">
              <div className="text-gray-600 text-sm">{classItem.time}</div>
              <div className="text-gray-800 font-semibold text-sm">{classItem.course}</div>
              <FontAwesomeIcon icon={faClock} className="text-indigo-600" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default FacultyDashboard;
