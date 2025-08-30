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
  faExclamationTriangle,
  faArrowRight,
  faCalendar,
  faBookOpen,
  faGraduationCap,
  faChartBar,
  faFileAlt,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Professional Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-950 dark:text-white flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faHome} className="text-white text-lg"/>
                </div>
              Faculty Dashboard
            </h1>
              <p className="text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-800 dark:text-gray-200"/>
                Welcome back! Manage your classes, track student progress, and stay organized
            </p>
          </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-800 dark:text-gray-200">Today's Date</p>
                <p className="text-lg font-semibold text-gray-950 dark:text-white">March 15, 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards with Modern Design */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: faChalkboardTeacher, 
              label: 'Active Courses', 
              value: '5',
              trend: '+2 this semester',
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: faUsers, 
              label: 'Total Students', 
              value: '120',
              trend: '+15 new enrollments',
              color: 'from-green-500 to-green-600'
            },
            {
              icon: faClock, 
              label: 'Next Class', 
              value: 'Math 101',
              trend: 'In 2 hours',
              color: 'from-orange-500 to-orange-600'
            },
            {
              icon: faCalendarAlt, 
              label: 'Upcoming Events', 
              value: '3',
              trend: 'This week',
              color: 'from-purple-500 to-purple-600'
            }
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <FontAwesomeIcon icon={kpi.icon} className="text-white text-lg" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-800 dark:text-gray-200 font-medium">{kpi.trend}</div>
                </div>
                </div>
                <div>
                <div className="text-2xl font-bold text-gray-950 dark:text-white mb-1">{kpi.value}</div>
                <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">{kpi.label}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Main Content Grid with Card-Based Layout */}
        <section className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
          {/* Recent Activity Card */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faChartLine} className="text-white text-sm" />
                </div>
                <h2 className="text-xl font-bold text-gray-950 dark:text-white">Recent Activity</h2>
              </div>
              <Link to="/activity" className="text-sm text-gray-800 dark:text-gray-200 hover:text-primary transition-colors">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { icon: faCheckCircle, text: 'Submitted grades for Math 101 - Calculus', time: '2 hours ago', status: 'completed' },
                { icon: faBookOpen, text: 'Updated course materials for Science 102', time: '4 hours ago', status: 'completed' },
                { icon: faClipboardList, text: 'Took attendance for Computer Science 201', time: '6 hours ago', status: 'completed' },
                { icon: faComments, text: 'Responded to student inquiry about assignment', time: '1 day ago', status: 'completed' }
              ].map((activity, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={activity.icon} className="text-green-600 dark:text-green-400 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-950 dark:text-white">{activity.text}</p>
                      <p className="text-xs text-gray-800 dark:text-gray-200">{activity.time}</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Card */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faBell} className="text-white text-sm" />
                </div>
                <h2 className="text-xl font-bold text-gray-950 dark:text-white">Notifications</h2>
              </div>
              <div className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </div>
              </div>
            <div className="space-y-4">
              {[
                { icon: faExclamationTriangle, text: 'New message from Admin regarding curriculum updates', time: '30 min ago', priority: 'high' },
                { icon: faClock, text: 'Assignment submission deadline approaching for Math 101', time: '2 hours ago', priority: 'medium' },
                { icon: faCalendar, text: 'Faculty meeting scheduled for tomorrow at 10 AM', time: '1 day ago', priority: 'medium' },
                { icon: faGraduationCap, text: 'New student enrollment request requires approval', time: '2 days ago', priority: 'low' }
              ].map((notification, idx) => (
                <div key={idx} className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:shadow-md ${
                  notification.priority === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                  notification.priority === 'medium' ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                  'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={notification.icon} className={`text-sm mt-1 ${
                      notification.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                      notification.priority === 'medium' ? 'text-orange-600 dark:text-orange-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-950 dark:text-white mb-1">{notification.text}</p>
                      <p className="text-xs text-gray-800 dark:text-gray-200">{notification.time}</p>
            </div>
          </div>
              </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions Section Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white text-sm"/>
              </div>
            Quick Actions
          </h2>
            <p className="text-sm text-gray-800 dark:text-gray-200">Access your most frequently used features</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                to: "/courses",
                icon: faChalkboardTeacher,
                title: "Course Management",
                description: "Manage your courses, materials, and curriculum",
                color: "from-blue-500 to-blue-600"
              },
              {
                to: "/attendance",
                icon: faClipboardList,
                title: "Attendance Tracking",
                description: "Track and manage student attendance records",
                color: "from-green-500 to-green-600"
              },
              {
                to: "/grades",
                icon: faUserGraduate,
                title: "Grade Management",
                description: "Record and analyze student performance",
                color: "from-purple-500 to-purple-600"
              },
              {
                to: "/communication",
                icon: faComments,
                title: "Communication Hub",
                description: "Connect with students and faculty members",
                color: "from-orange-500 to-orange-600"
              },
              {
                to: "/events",
                icon: faCalendarAlt,
                title: "Event Calendar",
                description: "View and manage upcoming academic events",
                color: "from-red-500 to-red-600"
              },
              {
                to: "/students",
                icon: faUsers,
                title: "Student Directory",
                description: "Access comprehensive student information",
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((action, idx) => (
              <Link 
                key={idx} 
                to={action.to} 
                className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon icon={action.icon} className="text-white text-lg" />
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors" />
              </div>
              <div>
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2 group-hover:text-secondary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {action.description}
                  </p>
              </div>
            </Link>
            ))}
          </div>
        </div>

        {/* Additional Information Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Academic Statistics Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faChartBar} className="text-white text-sm" />
              </div>
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">Academic Stats</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Average Grade', value: '85.2%', trend: '+2.1%' },
                { label: 'Attendance Rate', value: '92.5%', trend: '+1.8%' },
                { label: 'Course Completion', value: '78.9%', trend: '+3.2%' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-800 dark:text-gray-200">{stat.label}</span>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">{stat.trend}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-950 dark:text-white mt-1">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-white text-sm" />
              </div>
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">Recent Messages</h2>
              </div>
            <div className="space-y-4">
              {[
                { sender: 'Dr. Smith', subject: 'Faculty Meeting Agenda', time: '1 hour ago', unread: true },
                { sender: 'Student Council', subject: 'Event Planning Discussion', time: '3 hours ago', unread: false },
                { sender: 'Admin Office', subject: 'Curriculum Update Notice', time: '1 day ago', unread: false }
              ].map((message, idx) => (
                <div key={idx} className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 ${message.unread ? 'border-l-4 border-l-blue-500' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-gray-950 dark:text-white">{message.sender}</span>
                    <span className="text-xs text-gray-800 dark:text-gray-200">{message.time}</span>
              </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{message.subject}</p>
                  {message.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
              </div>
              ))}
              </div>
              </div>

          {/* Upcoming Deadlines Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faFileAlt} className="text-white text-sm" />
              </div>
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">Upcoming Deadlines</h2>
              </div>
            <div className="space-y-4">
              {[
                { task: 'Grade Submission', course: 'Math 101', deadline: 'Tomorrow', priority: 'high' },
                { task: 'Course Material Update', course: 'Science 102', deadline: '3 days', priority: 'medium' },
                { task: 'Attendance Report', course: 'CS 201', deadline: '1 week', priority: 'low' }
              ].map((deadline, idx) => (
                <div key={idx} className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border-l-4 transition-all duration-300 ${
                  deadline.priority === 'high' ? 'border-l-red-500' :
                  deadline.priority === 'medium' ? 'border-l-orange-500' :
                  'border-l-green-500'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-gray-950 dark:text-white">{deadline.task}</span>
                    <span className={`text-xs font-medium ${
                      deadline.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                      deadline.priority === 'medium' ? 'text-orange-600 dark:text-orange-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>{deadline.deadline}</span>
              </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{deadline.course}</p>
              </div>
              ))}
              </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
