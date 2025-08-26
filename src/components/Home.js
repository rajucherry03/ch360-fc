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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto py-6 px-4 md:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <FontAwesomeIcon icon={faHome} className="text-indigo-600 animate-pulse"/>
              Faculty Dashboard
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-indigo-400"/>
              Manage your classes, communicate with students, and more
            </p>
          </div>
          <div className="relative">
            <img src="/avatar.jpg" alt="Profile" className="w-16 h-16 rounded-full ring-4 ring-indigo-100 hover:ring-indigo-300 transition-all duration-300" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xs" />
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl shadow-lg p-6 text-center hover-lift animate-fade-in stagger-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-bold gradient-text">Current Classes</h3>
            <p className="text-gray-600">You have <span className="font-semibold text-indigo-600">5 classes</span> this semester</p>
          </div>
          <div className="glass rounded-xl shadow-lg p-6 text-center hover-lift animate-fade-in stagger-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-bold gradient-text">Upcoming Events</h3>
            <p className="text-gray-600">Next event: <span className="font-semibold text-purple-600">Faculty Meeting</span></p>
            <p className="text-gray-600">Date: <span className="font-semibold text-indigo-600">March 15, 2024</span></p>
          </div>
          <div className="glass rounded-xl shadow-lg p-6 text-center hover-lift animate-fade-in stagger-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faFolderOpen} className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-bold gradient-text">Quick Links</h3>
            <div className="flex flex-col items-center space-y-2">
              <Link to="/courses" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Courses</Link>
              <Link to="/attendance" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Attendance</Link>
              <Link to="/grades" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Grades</Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in stagger-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faBell} className="text-white" />
              </div>
              <h2 className="text-xl font-bold gradient-text">Notifications</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />
                <p className="text-gray-700">New message from Admin</p>
              </li>
              <li className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faClock} className="text-red-500" />
                <p className="text-gray-700">Assignment submission deadline</p>
              </li>
            </ul>
          </div>
          <div className="glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in stagger-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="text-white" />
              </div>
              <h2 className="text-xl font-bold gradient-text">Recent Activity</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                <p className="text-gray-700">Submitted grades for Math 101</p>
              </li>
              <li className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                <p className="text-gray-700">Updated course materials for Science 102</p>
              </li>
            </ul>
          </div>
          <div className="glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in stagger-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} className="text-white" />
              </div>
              <h2 className="text-xl font-bold gradient-text">Upcoming Deadlines</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                <p className="text-gray-700">Grade submission for History 201</p>
              </li>
              <li className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                <p className="text-gray-700">Project review for Art 101</p>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-indigo-600"/>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/courses" className="group glass rounded-xl shadow-lg p-6 flex items-center hover-lift animate-fade-in stagger-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">Courses</h3>
                <p className="text-gray-600">Manage your courses and materials</p>
              </div>
            </Link>
            <Link to="/attendance" className="group glass rounded-xl shadow-lg p-6 flex items-center hover-lift animate-fade-in stagger-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faClipboardList} className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">Attendance</h3>
                <p className="text-gray-600">Track and manage student attendance</p>
              </div>
            </Link>
            <Link to="/grades" className="group glass rounded-xl shadow-lg p-6 flex items-center hover-lift animate-fade-in stagger-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faUserGraduate} className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">Grades</h3>
                <p className="text-gray-600">Record and view student grades</p>
              </div>
            </Link>
            <Link to="/communication" className="group glass rounded-xl shadow-lg p-6 flex items-center hover-lift animate-fade-in stagger-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faComments} className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">Communication</h3>
                <p className="text-gray-600">Communicate with students and faculty</p>
              </div>
            </Link>
            <Link to="/events" className="group glass rounded-xl shadow-lg p-6 flex items-center hover-lift animate-fade-in stagger-5">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">Events</h3>
                <p className="text-gray-600">View and manage upcoming events</p>
              </div>
            </Link>
            <Link to="/students" className="group glass rounded-xl shadow-lg p-6 flex items-center hover-lift animate-fade-in stagger-5">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faUsers} className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">Students</h3>
                <p className="text-gray-600">View and manage student information</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
