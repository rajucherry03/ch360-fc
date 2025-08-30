import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faUsers, 
  faUserTie, 
  faChalkboardTeacher, 
  faExclamationTriangle,
  faArrowRight,
  faHome,
  faClipboardList,
  faFileAlt,
  faCheckCircle,
  faClock,
  faCalendarAlt,
  faEdit,
  faDownload,
  faUpload,
  faEye,
  faStar,
  faTrophy,
  faMedal,
  faUserGraduate,
  faUserFriends,
  faUserCheck,
  faUserTimes,
  faBell,
  faChartBar,
  faBookOpen,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const ApprovalWorkflow = ({ username }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalStats, setApprovalStats] = useState({
    pendingCourses: 0,
    pendingCoordinators: 0,
    pendingMentors: 0,
    totalApprovals: 0
  });

  useEffect(() => {
    const fetchApprovalStats = async () => {
      try {
        setLoading(true);
        setError(null);

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
          }

          // Simulate fetching approval statistics
          // In a real app, you would fetch this from Firebase
          setApprovalStats({
            pendingCourses: 5,
            pendingCoordinators: 3,
            pendingMentors: 8,
            totalApprovals: 156
          });

          setLoading(false);
        });
      } catch (err) {
        console.error("Error fetching approval stats:", err.message);
        setError(err.message || "Error fetching approval statistics.");
        setLoading(false);
      }
    };

    fetchApprovalStats();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getApprovalStatus = (count) => {
    if (count === 0) return { status: 'All Clear', color: 'text-secondary', bg: 'bg-secondary/10', icon: faCheckCircle };
    if (count <= 7) return { status: 'Medium Priority', color: 'text-accent', bg: 'bg-accent/10', icon: faExclamationTriangle };
    return { status: 'High Priority', color: 'text-accent', bg: 'bg-accent/10', icon: faExclamationTriangle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-fade-in border border-gray-200 dark:border-gray-700" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-4 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 dark:text-red-400 text-6xl mb-4 animate-bounce" />
          <div className="text-gray-950 dark:text-white text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Professional Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-950 dark:text-white flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-white text-lg"/>
                </div>
                Approval Workflow
              </h1>
              <p className="text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-800 dark:text-gray-200"/>
                Manage course, coordinator, and mentor approvals efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-800 dark:text-gray-200">Pending Approvals</p>
                <p className="text-lg font-semibold text-gray-950 dark:text-white">{approvalStats.pendingCourses + approvalStats.pendingCoordinators + approvalStats.pendingMentors}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Approval Statistics Overview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Approval Statistics Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600">
              <div className="text-2xl font-bold text-gray-950 dark:text-white">{approvalStats.totalApprovals}</div>
              <div className="text-sm text-gray-800 dark:text-gray-200">Total Approvals</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-700">
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{approvalStats.pendingCourses}</div>
              <div className="text-sm text-gray-800 dark:text-gray-200">Pending Courses</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-200 dark:border-green-700">
              <div className="text-2xl font-bold text-green-800 dark:text-green-300">{approvalStats.pendingCoordinators}</div>
              <div className="text-sm text-gray-800 dark:text-gray-200">Pending Coordinators</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center border border-purple-200 dark:border-purple-700">
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">{approvalStats.pendingMentors}</div>
              <div className="text-sm text-gray-800 dark:text-gray-200">Pending Mentors</div>
            </div>
          </div>
        </div>

        {/* Main Approval Cards */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 mb-8">
          {/* Courses Approval Card */}
          <Link
            to="/courses-approval"
            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:-translate-y-1"
            style={{ animationDelay: '0ms' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBookOpen} className="text-lg" />
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getApprovalStatus(approvalStats.pendingCourses);
                  return (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700 flex items-center gap-1">
                      <FontAwesomeIcon icon={status.icon} />
                      {approvalStats.pendingCourses}
                    </span>
                  );
                })()}
                <FontAwesomeIcon icon={faArrowRight} className="text-gray-800 dark:text-gray-200 text-sm group-hover:text-primary transition-colors"/>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3 group-hover:text-secondary transition-colors">
                Course Approvals
              </h3>
              
              <p className="text-gray-800 dark:text-gray-200 mb-4 text-sm leading-relaxed">
                Review and approve course proposals, curriculum changes, and course materials.
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-primary"/>
                    Pending Reviews
                  </span>
                  <span className="font-bold text-gray-950 dark:text-white">{approvalStats.pendingCourses}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary"/>
                    Completed This Month
                  </span>
                  <span className="font-bold text-gray-950 dark:text-white">{Math.floor(approvalStats.totalApprovals * 0.4)}</span>
                </div>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-primary hover:bg-secondary text-white rounded-xl text-sm transition-all duration-300 hover:shadow-md font-semibold">
              <FontAwesomeIcon icon={faEye} />
              Manage Courses
            </div>
          </Link>

          {/* Coordinators Approval Card */}
          <Link
            to="/coordinators-approval"
            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:-translate-y-1"
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faUsers} className="text-lg" />
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getApprovalStatus(approvalStats.pendingCoordinators);
                  return (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700 flex items-center gap-1">
                      <FontAwesomeIcon icon={status.icon} />
                      {approvalStats.pendingCoordinators}
                    </span>
                  );
                })()}
                <FontAwesomeIcon icon={faArrowRight} className="text-gray-800 dark:text-gray-200 text-sm group-hover:text-primary transition-colors"/>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3 group-hover:text-secondary transition-colors">
                Coordinator Approvals
              </h3>
              
              <p className="text-gray-800 dark:text-gray-200 mb-4 text-sm leading-relaxed">
                Manage coordinator assignments, review applications, and oversee academic sections.
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-primary"/>
                    Pending Reviews
                  </span>
                  <span className="font-bold text-gray-950 dark:text-white">{approvalStats.pendingCoordinators}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary"/>
                    Active Coordinators
                  </span>
                  <span className="font-bold text-gray-950 dark:text-white">{Math.floor(approvalStats.totalApprovals * 0.3)}</span>
                </div>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm transition-all duration-300 hover:shadow-md font-semibold">
              <FontAwesomeIcon icon={faEye} />
              Manage Coordinators
            </div>
          </Link>

          {/* Mentors Approval Card */}
          <Link
            to="/mentors-approval"
            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:-translate-y-1"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faUserGraduate} className="text-lg" />
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getApprovalStatus(approvalStats.pendingMentors);
                  return (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700 flex items-center gap-1">
                      <FontAwesomeIcon icon={status.icon} />
                      {approvalStats.pendingMentors}
                    </span>
                  );
                })()}
                <FontAwesomeIcon icon={faArrowRight} className="text-gray-800 dark:text-gray-200 text-sm group-hover:text-primary transition-colors"/>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3 group-hover:text-secondary transition-colors">
                Mentor Approvals
              </h3>
              
              <p className="text-gray-800 dark:text-gray-200 mb-4 text-sm leading-relaxed">
                Review mentor applications, manage mentorship programs, and track student-mentor relationships.
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-primary"/>
                    Pending Reviews
                  </span>
                  <span className="font-bold text-gray-950 dark:text-white">{approvalStats.pendingMentors}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary"/>
                    Active Mentors
                  </span>
                  <span className="font-bold text-gray-950 dark:text-white">{Math.floor(approvalStats.totalApprovals * 0.3)}</span>
                </div>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm transition-all duration-300 hover:shadow-md font-semibold">
              <FontAwesomeIcon icon={faEye} />
              Manage Mentors
            </div>
          </Link>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faClipboardList} className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <button className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faBell} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Notifications</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">View pending approvals</p>
            </button>
            
            <button className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faDownload} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Export Reports</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">Download approval reports</p>
            </button>
            
            <Link 
              to="/home" 
              className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faHome} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Main Dashboard</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">Return to dashboard</p>
            </Link>
            
            <button className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faChartBar} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Analytics</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">View approval analytics</p>
            </button>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Recent Approval Activities</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 animate-fade-in hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-950 dark:text-white text-sm">Course "Data Structures" approved</h4>
                <p className="text-xs text-gray-800 dark:text-gray-200">Course coordinator: Dr. Smith</p>
              </div>
              <div className="text-xs text-gray-800 dark:text-gray-200">
                2 hours ago
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 animate-fade-in hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUserCheck} className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-950 dark:text-white text-sm">New coordinator assigned</h4>
                <p className="text-xs text-gray-800 dark:text-gray-200">Section A - Computer Science</p>
              </div>
              <div className="text-xs text-gray-800 dark:text-gray-200">
                1 day ago
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 animate-fade-in hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUserGraduate} className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-950 dark:text-white text-sm">Mentor application received</h4>
                <p className="text-xs text-gray-800 dark:text-gray-200">Student: John Doe - CS101</p>
              </div>
              <div className="text-xs text-gray-800 dark:text-gray-200">
                3 days ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflow;
