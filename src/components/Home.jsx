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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-6 px-6">
        {/* Header */}
        <header className="mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-primary flex items-center gap-3">
              <FontAwesomeIcon icon={faHome} className="text-[var(--color-primary)]"/>
              Faculty Dashboard
            </h1>
            <p className="text-secondary text-sm flex items-center gap-2 mt-1">
              <FontAwesomeIcon icon={faUser} className="text-[var(--color-secondary)]"/>
              Manage your classes, communicate with students, and more
            </p>
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
            <div key={idx} className="bg-surface rounded-lg border border-theme p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface text-[var(--color-primary)] flex items-center justify-center">
                  <FontAwesomeIcon icon={kpi.icon} className="text-sm" />
                </div>
                <div>
                  <div className="text-xs text-secondary">{kpi.label}</div>
                  <div className="text-base font-semibold text-primary">{kpi.value}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Two-column layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-surface rounded-lg border border-theme p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-[var(--color-secondary)]">
                <FontAwesomeIcon icon={faChartLine} className="text-sm" />
              </div>
              <h2 className="text-sm font-semibold text-primary">Recent Activity</h2>
            </div>
            <ul className="divide-y">
              <li className="py-3 flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-[var(--color-secondary)] text-sm" />
                <p className="text-sm text-primary">Submitted grades for Math 101</p>
              </li>
              <li className="py-3 flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-[var(--color-secondary)] text-sm" />
                <p className="text-sm text-primary">Updated course materials for Science 102</p>
              </li>
            </ul>
          </div>
          <div className="bg-surface rounded-lg border border-theme p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-[var(--color-accent)]">
                <FontAwesomeIcon icon={faBell} className="text-sm" />
              </div>
              <h2 className="text-sm font-semibold text-primary">Notifications</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-background rounded-md">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-[var(--color-accent)] text-sm" />
                <p className="text-sm text-primary">New message from Admin</p>
              </li>
              <li className="flex items-center gap-3 p-3 bg-background rounded-md">
                <FontAwesomeIcon icon={faClock} className="text-[var(--color-accent)] text-sm" />
                <p className="text-sm text-primary">Assignment submission deadline</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-semibold mb-4 text-primary flex items-center gap-2">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-[var(--color-accent)]"/>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/courses" className="group bg-surface rounded-lg border border-theme p-4 flex items-center">
              <div className="w-10 h-10 bg-surface text-[var(--color-primary)] rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-primary">Courses</h3>
                <p className="text-xs text-secondary">Manage your courses and materials</p>
              </div>
            </Link>
            <Link to="/attendance" className="group bg-surface rounded-lg border border-theme p-4 flex items-center">
              <div className="w-10 h-10 bg-surface text-[var(--color-secondary)] rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faClipboardList} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-primary">Attendance</h3>
                <p className="text-xs text-secondary">Track and manage student attendance</p>
              </div>
            </Link>
            <Link to="/grades" className="group bg-surface rounded-lg border border-theme p-4 flex items-center">
              <div className="w-10 h-10 bg-surface text-[var(--color-primary)] rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUserGraduate} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-primary">Grades</h3>
                <p className="text-xs text-secondary">Record and view student grades</p>
              </div>
            </Link>
            <Link to="/communication" className="group bg-surface rounded-lg border border-theme p-4 flex items-center">
              <div className="w-10 h-10 bg-surface text-[var(--color-secondary)] rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faComments} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-primary">Communication</h3>
                <p className="text-xs text-secondary">Communicate with students and faculty</p>
              </div>
            </Link>
            <Link to="/events" className="group bg-surface rounded-lg border border-theme p-4 flex items-center">
              <div className="w-10 h-10 bg-surface text-[var(--color-primary)] rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-primary">Events</h3>
                <p className="text-xs text-secondary">View and manage upcoming events</p>
              </div>
            </Link>
            <Link to="/students" className="group bg-surface rounded-lg border border-theme p-4 flex items-center">
              <div className="w-10 h-10 bg-surface text-[var(--color-secondary)] rounded-md flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faUsers} className="text-base" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-primary">Students</h3>
                <p className="text-xs text-secondary">View and manage student information</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
