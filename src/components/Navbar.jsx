import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faHome, 
  faChalkboardTeacher, 
  faUserGraduate, 
  faClipboardList, 
  faCalendarAlt, 
  faFileAlt, 
  faCog, 
  faSignOutAlt, 
  faUser, 
  faEnvelope, 
  faBell,
  faTasks
} from '@fortawesome/free-solid-svg-icons';
import { preloadOnHover } from '../utils/preload.js';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside or on a link
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header - Only visible on mobile */}
      <div className="bg-gray-900 text-white flex justify-between items-center px-4 py-3 md:hidden fixed top-0 left-0 right-0 z-50 border-b border-gray-700">
        <h2 className="text-lg font-semibold">CampusHub360 Faculty</h2>
        <button 
          onClick={toggleMenu} 
          className="text-white hover:text-gray-300 p-2 rounded-md hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-xl" />
        </button>
      </div>

      {/* Mobile Overlay Backdrop - Only visible on mobile when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`bg-gray-900 text-white border-r border-gray-700 flex flex-col ${
        // Mobile: Fixed overlay sidebar
        'fixed top-0 left-0 h-screen w-80 z-50 transform transition-transform duration-300 ease-in-out ' +
        (isOpen ? 'translate-x-0' : '-translate-x-full') +
        // Tablet/Desktop: Static sidebar
        ' md:relative md:translate-x-0 md:w-72 lg:w-80'
      }`}> 
        {/* Header */}
        <div className="py-6 px-4 flex justify-between items-center sticky top-0 bg-gray-900 border-b border-gray-700 z-10">
          <h2 className="text-xl font-semibold">CampusHub360 Faculty</h2>
          {/* Close button only on mobile */}
          <button 
            onClick={closeMenu} 
            className="md:hidden text-white hover:text-gray-300 p-2 rounded-md hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6">
          <NavLink 
            to="/home" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/Home.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2 text-base" /> Home
          </NavLink>
          
          <NavLink 
            to="/courses" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/Course.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2 text-base" /> Courses
          </NavLink>
          
          <NavLink 
            to="/students" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/StudentList.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faUserGraduate} className="mr-2 text-base" /> Students
          </NavLink>
          
          <NavLink 
            to="/attendance" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/AttendanceList.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-base" /> Attendance
          </NavLink>
          
          <NavLink 
            to="/attendance/take" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/TakeAttendance.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-base" /> Take Attendance
          </NavLink>
          
          <NavLink 
            to="/exams" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/Exam.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-base" /> Exams
          </NavLink>
          
          <NavLink 
            to="/grades" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/Grades.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-base" /> Grades
          </NavLink>

          <NavLink 
            to="/approval" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/ApprovalWorkflow.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faTasks} className="mr-2 text-base" /> Approval Workflow
          </NavLink>
          
          <NavLink 
            to="/communication" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/Communication.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-base" /> Communication
          </NavLink>
          
          <NavLink 
            to="/request" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/RequestPage.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-base" /> Request
          </NavLink>
          
          <NavLink 
            to="/announcements" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/Announcements.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faBell} className="mr-2 text-base" /> Announcements
          </NavLink>
          
          <NavLink 
            to="/profile" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/ProfilePage.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faUser} className="mr-2 text-base" /> Profile
          </NavLink>
          
          <NavLink 
            to="/settings" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/Settings.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faCog} className="mr-2 text-base" /> Settings
          </NavLink>
          
          <NavLink 
            to="/logout" 
            onClick={closeMenu}
            {...preloadOnHover(() => import('../components/Logout.jsx'))}
            className={({isActive}) => `block py-2.5 px-3 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${
              isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-base" /> Logout
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
