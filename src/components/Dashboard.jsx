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
    <div className="min-h-screen bg-background p-6">
      {/* Tab Navigation */}
      <div className="bg-surface border-b border-border-theme">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {['Dashboard','Profile Management','Recruitment','Teaching & Academic','Performance','Leave & Attendance','Payroll & Finance'].map((tab, i) => (
              <button key={i} className={`py-3 px-2 border-b-2 ${i===0 ? 'border-accent text-primary font-semibold' : 'border-transparent text-secondary hover:text-primary'}`}>{tab}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-surface border border-border-theme rounded-md p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary">Welcome back, {username || 'Faculty'}!</h2>
              <p className="text-secondary">Here's what's happening with your courses today.</p>
            </div>
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
            <div key={idx} className="bg-surface border border-border-theme rounded-xl p-6 hover:shadow-md transition">
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="font-semibold text-primary">{c.label}</div>
            </div>
          ))}
        </section>

        {/* Two-column: Activities + Chart */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-surface border border-border-theme rounded-xl p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Recent Activities</h2>
            <ul>
              <li className="py-2 border-b border-border-theme">
                <h3 className="text-sm font-semibold text-primary">Math 101 - Assignment Graded</h3>
                <p className="text-secondary text-sm">Assignment 1 has been graded and returned to students.</p>
              </li>
              <li className="py-2 border-b border-border-theme">
                <h3 className="text-sm font-semibold text-primary">Science 102 - New Assignment</h3>
                <p className="text-secondary text-sm">Assignment 2 has been posted and is due on April 15, 2024.</p>
              </li>
              <li className="py-2">
                <h3 className="text-sm font-semibold text-primary">History 201 - Exam Scheduled</h3>
                <p className="text-secondary text-sm">Midterm Exam is scheduled for May 5, 2024.</p>
              </li>
            </ul>
          </div>

          <div className="bg-surface border border-border-theme rounded-xl p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Course Performance</h2>
            <Bar data={coursePerformanceData} options={options} />
          </div>
        </section>

        {/* Timetable */}
        <section className="bg-surface border border-border-theme rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Daily Class Timetable</h2>
          <ul>
            {timetable.map((classItem, index) => (
              <li key={index} className="py-2 border-b border-border-theme flex justify-between items-center">
                <div className="text-secondary text-sm">{classItem.time}</div>
                <div className="text-primary font-semibold text-sm">{classItem.course}</div>
                <FontAwesomeIcon icon={faClock} className="text-accent" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FacultyDashboard;
