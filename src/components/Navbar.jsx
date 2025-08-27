import React, { useState } from 'react';
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="bg-gray-900 text-white flex justify-between items-center px-4 py-3 md:hidden">
        <h2 className="text-lg font-semibold">CampusHub360 Faculty</h2>
        <button onClick={toggleMenu} className="text-white hover:text-gray-300">
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-xl" />
        </button>
      </div>
      <aside className={`fixed top-0 left-0 h-screen w-72 bg-gray-900 text-white z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0 flex flex-col border-r border-gray-700`}> 
        <div className="py-6 px-4 flex justify-between items-center sticky top-0 bg-gray-900 border-b border-gray-700 z-10">
          <h2 className="text-xl font-semibold">CampusHub360 Faculty</h2>
          <button onClick={toggleMenu} className="md:hidden text-white hover:text-gray-300">
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6">
          <NavLink to="/home" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faHome} className="mr-3 text-sm" /> Home
          </NavLink>
          <NavLink to="/courses" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-3 text-sm" /> Courses
          </NavLink>
          <NavLink to="/students" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faUserGraduate} className="mr-3 text-sm" /> Students
          </NavLink>
          <NavLink to="/attendance" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faClipboardList} className="mr-3 text-sm" /> Attendance
          </NavLink>
          <NavLink to="/attendance/take" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faClipboardList} className="mr-3 text-sm" /> Take Attendance
          </NavLink>
          <NavLink to="/exams" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-sm" /> Exams
          </NavLink>
          <NavLink to="/grades" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-sm" /> Grades
          </NavLink>

          <NavLink to="/approval" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faTasks} className="mr-3 text-sm" /> Approval Workflow
          </NavLink>
          <NavLink to="/communication" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-sm" /> Communication
          </NavLink>
          <NavLink to="/request" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-sm" /> Request
          </NavLink>
          <NavLink to="/announcements" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faBell} className="mr-3 text-sm" /> Announcements
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faUser} className="mr-3 text-sm" /> Profile
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faCog} className="mr-3 text-sm" /> Settings
          </NavLink>
          <NavLink to="/logout" className={({isActive}) => `block py-3 px-4 rounded-lg flex items-center border-l-4 transition-all duration-300 text-sm ${isActive ? 'bg-gray-800 text-white border-blue-500 pl-3' : 'border-transparent hover:bg-gray-700 text-gray-300'}`}>
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-sm" /> Logout
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
