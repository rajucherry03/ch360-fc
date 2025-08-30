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
  faTasks,
  faSun,
  faMoon
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../ThemeContext.jsx';
import { preloadOnHover } from '../utils/preload.js';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
      <div className="bg-primary text-white flex justify-between items-center px-6 py-4 md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border-theme shadow-sm">
        <div className="flex items-center">
          <h2 className="text-xl font-bold tracking-tight">CampusHub360</h2>
          <span className="text-sm font-medium text-white/80 ml-2">Faculty</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="text-white p-2.5 rounded-lg hover:bg-white/10 transition-all duration-200"
            aria-label="Toggle theme"
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-lg" />
          </button>
          <button 
            onClick={toggleMenu} 
            className="text-white p-2.5 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay Backdrop - Only visible on mobile when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`bg-primary text-white border-l border-border-theme flex flex-col ${
        // Mobile: Fixed overlay sidebar from right
        'fixed top-0 right-0 h-screen w-72 z-50 transform transition-transform duration-300 ease-in-out ' +
        (isOpen ? 'translate-x-0' : 'translate-x-full') +
        // Tablet/Desktop: Static sidebar from left
        ' md:relative md:translate-x-0 md:border-l-0 md:border-r md:right-auto md:left-0 md:w-64 lg:w-72'
      }`}> 
        {/* Elegant Desktop Header */}
        <div className="hidden md:flex py-4 px-4 justify-between items-center sticky top-0 bg-primary border-b border-border-theme z-10">
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white text-sm" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-white leading-tight">CampusHub360</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-xs text-white/70">Faculty Dashboard</span>
              </div>
            </div>
          </div>
          
          {/* Right Section with Theme Toggle */}
          <div className="flex items-center">
            <button 
              onClick={toggleTheme} 
              className="text-white p-1.5 rounded-md hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-sm" />
            </button>
          </div>
        </div>

                 {/* Navigation Links */}
         <nav className="flex-1 px-4 space-y-6 overflow-y-auto pb-6">
           {/* MAIN NAVIGATION Section */}
           <div className="pt-4">
             <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 px-2">
               MAIN NAVIGATION
             </h3>
            <div className="space-y-1">
              <NavLink 
                to="/home" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/Home.jsx'))}
                end
              >
                <FontAwesomeIcon icon={faHome} className="mr-3 text-base" /> Home
              </NavLink>
              
              <NavLink 
                to="/courses" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/Course.jsx'))}
                end
              >
                <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-3 text-base" /> Courses
              </NavLink>
              
              <NavLink 
                to="/students" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/StudentList.jsx'))}
                end
              >
                <FontAwesomeIcon icon={faUserGraduate} className="mr-3 text-base" /> Students
              </NavLink>
            </div>
          </div>

          {/* ACADEMIC Section */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 px-2">
              ACADEMIC
            </h3>
            <div className="space-y-1">
              <NavLink 
                to="/attendance" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/AttendanceList.jsx'))}
                end
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-3 text-base" /> Attendance
              </NavLink>
              
              <NavLink 
                to="/attendance/take" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/TakeAttendance.jsx'))}
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-3 text-base" /> Take Attendance
              </NavLink>
              
              <NavLink 
                to="/exams" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/Exam.jsx'))}
                end
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-base" /> Exams
              </NavLink>
              
              <NavLink 
                to="/grades" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/Grades.jsx'))}
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-base" /> Grades
              </NavLink>
            </div>
          </div>

          {/* WORKFLOW Section */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 px-2">
              WORKFLOW
            </h3>
            <div className="space-y-1">
              <NavLink 
                to="/approval" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/ApprovalWorkflow.jsx'))}
              >
                <FontAwesomeIcon icon={faTasks} className="mr-3 text-base" /> Approval Workflow
              </NavLink>
              
              <NavLink 
                to="/communication" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/Communication.jsx'))}
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-base" /> Communication
              </NavLink>
              
              <NavLink 
                to="/request" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/RequestPage.jsx'))}
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-base" /> Request
              </NavLink>
              
              <NavLink 
                to="/announcements" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/Announcements.jsx'))}
              >
                <FontAwesomeIcon icon={faBell} className="mr-3 text-base" /> Announcements
              </NavLink>
            </div>
          </div>

          {/* ACCOUNT Section */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 px-2">
              ACCOUNT
            </h3>
            <div className="space-y-1">
              <NavLink 
                to="/profile" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/ProfilePage.jsx'))}
              >
                <FontAwesomeIcon icon={faUser} className="mr-3 text-base" /> Profile
              </NavLink>
              
              <NavLink 
                to="/settings" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/Settings.jsx'))}
              >
                <FontAwesomeIcon icon={faCog} className="mr-3 text-base" /> Settings
              </NavLink>
              
              <NavLink 
                to="/logout" 
                onClick={closeMenu}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
                onMouseEnter={() => preloadOnHover(() => import('../components/Logout.jsx'))}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-base" /> Logout
              </NavLink>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
