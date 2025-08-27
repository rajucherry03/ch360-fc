import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChalkboardTeacher, 
  faClipboardList, 
  faUserGraduate, 
  faCalendarAlt, 
  faComments, 
  faFolderOpen, 
  faUser, 
  faBell,
  faHome,
  faUsers,
  faChartLine,
  faClock,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-6">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 flex items-center gap-3">
              <FontAwesomeIcon icon={faHome} className="text-blue-600"/>
              Faculty Dashboard
            </h1>
            <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
              <FontAwesomeIcon icon={faUser} className="text-blue-600"/>
              Manage your classes, communicate with students, and more
            </p>
          </div>
          <div className="flex items-center gap-3">
            <img src="/avatar.jpg" alt="Profile" className="w-12 h-12 rounded-full border" />
            <div className="text-sm">
              <div className="font-medium text-gray-900">Dr. Jane Doe</div>
              <div className="text-gray-500">Faculty</div>
            </div>
          </div>
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {icon: faChalkboardTeacher, label: 'Current Classes', value: '5'},
            {icon: faUsers, label: 'Students', value: '120'},
            {icon: faClock, label: 'Next Class', value: 'Math 101'},
            {icon: faCalendarAlt, label: 'Upcoming Events', value: '3'}
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={kpi.icon} className="text-sm" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">{kpi.label}</div>
                  <div className="text-base font-semibold text-gray-900">{kpi.value}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Two-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FontAwesomeIcon icon={faChartLine} className="text-sm" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <ul className="divide-y">
              <li className="py-3 flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-sm" />
                <p className="text-sm text-gray-700">Submitted grades for Math 101</p>
              </li>
              <li className="py-3 flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-sm" />
                <p className="text-sm text-gray-700">Updated course materials for Science 102</p>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                <FontAwesomeIcon icon={faBell} className="text-sm" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 text-sm" />
                <p className="text-sm text-gray-700">New message from Admin</p>
              </li>
              <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                <FontAwesomeIcon icon={faClock} className="text-red-500 text-sm" />
                <p className="text-sm text-gray-700">Assignment submission deadline</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-orange-500"/>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/courses" className="group bg-white rounded-lg border p-4 flex items-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Courses</h3>
                <p className="text-xs text-gray-500">Manage your courses and materials</p>
              </div>
            </Link>
            <Link to="/attendance" className="group bg-white rounded-lg border p-4 flex items-center">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faClipboardList} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Attendance</h3>
                <p className="text-xs text-gray-500">Track and manage student attendance</p>
              </div>
            </Link>
            <Link to="/grades" className="group bg-white rounded-lg border p-4 flex items-center">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUserGraduate} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Grades</h3>
                <p className="text-xs text-gray-500">Record and view student grades</p>
              </div>
            </Link>
            <Link to="/communication" className="group bg-white rounded-lg border p-4 flex items-center">
              <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faComments} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Communication</h3>
                <p className="text-xs text-gray-500">Communicate with students and faculty</p>
              </div>
            </Link>
            <Link to="/events" className="group bg-white rounded-lg border p-4 flex items-center">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Events</h3>
                <p className="text-xs text-gray-500">View and manage upcoming events</p>
              </div>
            </Link>
            <Link to="/students" className="group bg-white rounded-lg border p-4 flex items-center">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUsers} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Students</h3>
                <p className="text-xs text-gray-500">View and manage student information</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
