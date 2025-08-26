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
  faSignOutAlt
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
    if (count === 0) return { status: 'All Clear', color: 'text-green-600', bg: 'bg-green-100', icon: faCheckCircle };
    if (count <= 3) return { status: 'Low Priority', color: 'text-blue-600', bg: 'bg-blue-100', icon: faClock };
    if (count <= 7) return { status: 'Medium Priority', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: faExclamationTriangle };
    return { status: 'High Priority', color: 'text-red-600', bg: 'bg-red-100', icon: faExclamationTriangle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="h-12 shimmer rounded-lg mb-4"></div>
            <div className="h-6 shimmer rounded w-1/3"></div>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-xl shadow-lg p-6 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center">
                  <div className="w-16 h-16 shimmer rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 shimmer rounded w-3/4 mb-2"></div>
                    <div className="h-3 shimmer rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-5 w-16 shimmer rounded-full"></div>
                  <div className="h-5 w-16 shimmer rounded-full"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-6xl mb-4 animate-bounce" />
          <div className="text-red-600 text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Approval Workflow
                </h1>
                <p className="text-gray-600 text-sm">Welcome back, {username || 'Faculty'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Approval Statistics Overview */}
        <div className="glass rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Approval Statistics Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{approvalStats.totalApprovals}</div>
              <div className="text-sm text-gray-600">Total Approvals</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{approvalStats.pendingCourses}</div>
              <div className="text-sm text-gray-600">Pending Courses</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{approvalStats.pendingCoordinators}</div>
              <div className="text-sm text-gray-600">Pending Coordinators</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{approvalStats.pendingMentors}</div>
              <div className="text-sm text-gray-600">Pending Mentors</div>
            </div>
          </div>
        </div>

        {/* Main Approval Cards */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 mb-8">
          {/* Courses Approval Card */}
          <Link
            to="/courses-approval"
            className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in cursor-pointer border-2 border-transparent hover:border-indigo-200 transition-all duration-300"
            style={{ animationDelay: '0ms' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBookOpen} className="text-white text-xl" />
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getApprovalStatus(approvalStats.pendingCourses);
                  return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} flex items-center gap-1`}>
                      <FontAwesomeIcon icon={status.icon} />
                      {approvalStats.pendingCourses}
                    </span>
                  );
                })()}
                <FontAwesomeIcon icon={faArrowRight} className="text-indigo-400 group-hover:translate-x-1 transition-transform duration-300"/>
              </div>
            </div>
            
            <h3 className="text-xl font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 mb-2">
              Course Approvals
            </h3>
            
            <p className="text-gray-600 mb-4">
              Review and approve course proposals, curriculum changes, and course materials.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-indigo-400"/>
                  Pending Reviews
                </span>
                <span className="font-semibold text-gray-800">{approvalStats.pendingCourses}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-indigo-400"/>
                  Completed
                </span>
                <span className="font-semibold text-gray-800">{Math.floor(approvalStats.totalApprovals * 0.4)}</span>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105">
              <FontAwesomeIcon icon={faEye} />
              Manage Courses
            </div>
          </Link>

          {/* Coordinators Approval Card */}
          <Link
            to="/coordinators-approval"
            className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in cursor-pointer border-2 border-transparent hover:border-indigo-200 transition-all duration-300"
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faUserTie} className="text-white text-xl" />
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getApprovalStatus(approvalStats.pendingCoordinators);
                  return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} flex items-center gap-1`}>
                      <FontAwesomeIcon icon={status.icon} />
                      {approvalStats.pendingCoordinators}
                    </span>
                  );
                })()}
                <FontAwesomeIcon icon={faArrowRight} className="text-indigo-400 group-hover:translate-x-1 transition-transform duration-300"/>
              </div>
            </div>
            
            <h3 className="text-xl font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 mb-2">
              Coordinator Approvals
            </h3>
            
            <p className="text-gray-600 mb-4">
              Manage coordinator assignments, review applications, and oversee academic sections.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-indigo-400"/>
                  Pending Reviews
                </span>
                <span className="font-semibold text-gray-800">{approvalStats.pendingCoordinators}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-indigo-400"/>
                  Active Coordinators
                </span>
                <span className="font-semibold text-gray-800">{Math.floor(approvalStats.totalApprovals * 0.3)}</span>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105">
              <FontAwesomeIcon icon={faEye} />
              Manage Coordinators
            </div>
          </Link>

          {/* Mentors Approval Card */}
          <Link
            to="/mentors-approval"
            className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in cursor-pointer border-2 border-transparent hover:border-indigo-200 transition-all duration-300"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faUserFriends} className="text-white text-xl" />
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getApprovalStatus(approvalStats.pendingMentors);
                  return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} flex items-center gap-1`}>
                      <FontAwesomeIcon icon={status.icon} />
                      {approvalStats.pendingMentors}
                    </span>
                  );
                })()}
                <FontAwesomeIcon icon={faArrowRight} className="text-indigo-400 group-hover:translate-x-1 transition-transform duration-300"/>
              </div>
            </div>
            
            <h3 className="text-xl font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 mb-2">
              Mentor Approvals
            </h3>
            
            <p className="text-gray-600 mb-4">
              Review mentor applications, manage mentorship programs, and track student-mentor relationships.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-indigo-400"/>
                  Pending Reviews
                </span>
                <span className="font-semibold text-gray-800">{approvalStats.pendingMentors}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-indigo-400"/>
                  Active Mentors
                </span>
                <span className="font-semibold text-gray-800">{Math.floor(approvalStats.totalApprovals * 0.3)}</span>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              <FontAwesomeIcon icon={faEye} />
              Manage Mentors
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClipboardList} className="text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBell} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Notifications</h3>
              <p className="text-gray-600">View pending approvals</p>
            </button>
            
            <button className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faDownload} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Export Reports</h3>
              <p className="text-gray-600">Download approval reports</p>
            </button>
            
            <Link 
              to="/home" 
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faHome} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Main Dashboard</h3>
              <p className="text-gray-600">Return to dashboard</p>
            </Link>
            
            <button className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faChartBar} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Analytics</h3>
              <p className="text-gray-600">View approval analytics</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Recent Approval Activities</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg animate-fade-in">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Course "Data Structures" approved</h4>
                <p className="text-sm text-gray-600">Course coordinator: Dr. Smith</p>
              </div>
              <div className="text-sm text-gray-500">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                2 hours ago
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg animate-fade-in">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUserCheck} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">New coordinator assigned</h4>
                <p className="text-sm text-gray-600">Section A - Computer Science</p>
              </div>
              <div className="text-sm text-gray-500">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                1 day ago
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/50 rounded-lg animate-fade-in">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUserGraduate} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Mentor application received</h4>
                <p className="text-sm text-gray-600">Student: John Doe - CS101</p>
              </div>
              <div className="text-sm text-gray-500">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                2 days ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflow;
