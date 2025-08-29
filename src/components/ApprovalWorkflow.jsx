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
    if (count === 0) return { status: 'All Clear', color: 'text-secondary', bg: 'bg-secondary/10', icon: faCheckCircle };
    if (count <= 7) return { status: 'Medium Priority', color: 'text-accent', bg: 'bg-accent/10', icon: faExclamationTriangle };
    return { status: 'High Priority', color: 'text-accent', bg: 'bg-accent/10', icon: faExclamationTriangle };
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-accent text-6xl mb-4 animate-bounce" />
          <div className="text-primary text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border-theme">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-accent/10 text-accent rounded-md flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-sm" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary">Approval Workflow</h1>
                <p className="text-secondary text-xs">Welcome back, {username || 'Faculty'}</p>
              </div>
            </div>
        <button
          onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-md hover:bg-accent/90 text-sm"
        >
              <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Approval Statistics Overview */}
        <div className="bg-surface rounded-md border border-border-theme p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-accent/10 text-accent rounded-md flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-sm" />
            </div>
            <h2 className="text-sm font-semibold text-primary">Approval Statistics Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-background rounded-md p-3 text-center border border-border-theme">
              <div className="text-lg font-semibold text-accent">{approvalStats.totalApprovals}</div>
              <div className="text-xs text-secondary">Total Approvals</div>
            </div>
            <div className="bg-background rounded-md p-3 text-center border border-border-theme">
              <div className="text-lg font-semibold text-accent">{approvalStats.pendingCourses}</div>
              <div className="text-xs text-secondary">Pending Courses</div>
            </div>
            <div className="bg-background rounded-md p-3 text-center border border-border-theme">
              <div className="text-lg font-semibold text-accent">{approvalStats.pendingCoordinators}</div>
              <div className="text-xs text-secondary">Pending Coordinators</div>
            </div>
            <div className="bg-background rounded-md p-3 text-center border border-border-theme">
              <div className="text-lg font-semibold text-accent">{approvalStats.pendingMentors}</div>
              <div className="text-xs text-secondary">Pending Mentors</div>
            </div>
          </div>
        </div>

        {/* Main Approval Cards */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 mb-8">
          {/* Courses Approval Card */}
          <Link
            to="/courses-approval"
            className="bg-surface border border-border-theme rounded-md p-4 hover:shadow transition cursor-pointer"
            style={{ animationDelay: '0ms' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faBookOpen} className="text-white text-sm" />
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
                <FontAwesomeIcon icon={faArrowRight} className="text-accent group-hover:translate-x-1 transition-transform duration-300"/>
              </div>
            </div>
            
            <h3 className="text-base font-semibold text-primary mb-2">
              Course Approvals
            </h3>
            
            <p className="text-secondary mb-4">
              Review and approve course proposals, curriculum changes, and course materials.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-accent"/>
                  Pending Reviews
                </span>
                <span className="font-semibold text-primary">{approvalStats.pendingCourses}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-accent"/>
                  Completed This Month
                </span>
                <span className="font-semibold text-primary">{Math.floor(approvalStats.totalApprovals * 0.4)}</span>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 w-full justify-center px-3 py-2 bg-accent text-white rounded-md text-sm hover:bg-accent/90">
              <FontAwesomeIcon icon={faEye} />
              Manage Courses
            </div>
          </Link>

          {/* Coordinators Approval Card */}
          <Link
            to="/coordinators-approval"
            className="bg-surface border border-border-theme rounded-md p-4 hover:shadow transition cursor-pointer"
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-white text-sm" />
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
                <FontAwesomeIcon icon={faArrowRight} className="text-accent group-hover:translate-x-1 transition-transform duration-300"/>
              </div>
            </div>
            
            <h3 className="text-base font-semibold text-primary mb-2">
              Coordinator Approvals
            </h3>
            
            <p className="text-secondary mb-4">
              Manage coordinator assignments, review applications, and oversee academic sections.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-accent"/>
                  Pending Reviews
                </span>
                <span className="font-semibold text-primary">{approvalStats.pendingCoordinators}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-accent"/>
                  Active Coordinators
                </span>
                <span className="font-semibold text-primary">{Math.floor(approvalStats.totalApprovals * 0.3)}</span>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 w-full justify-center px-3 py-2 bg-secondary text-white rounded-md text-sm hover:bg-secondary/90">
              <FontAwesomeIcon icon={faEye} />
              Manage Coordinators
            </div>
          </Link>

          {/* Mentors Approval Card */}
          <Link
            to="/mentors-approval"
            className="bg-surface border border-border-theme rounded-md p-4 hover:shadow transition cursor-pointer"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUserGraduate} className="text-white text-sm" />
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
                <FontAwesomeIcon icon={faArrowRight} className="text-accent group-hover:translate-x-1 transition-transform duration-300"/>
              </div>
            </div>
            
            <h3 className="text-base font-semibold text-primary mb-2">
              Mentor Approvals
            </h3>
            
            <p className="text-secondary mb-4">
              Review mentor applications, manage mentorship programs, and track student-mentor relationships.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-accent"/>
                  Pending Reviews
                </span>
                <span className="font-semibold text-primary">{approvalStats.pendingMentors}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-accent"/>
                  Active Mentors
                </span>
                <span className="font-semibold text-primary">{Math.floor(approvalStats.totalApprovals * 0.3)}</span>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 w-full justify-center px-3 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90">
              <FontAwesomeIcon icon={faEye} />
              Manage Mentors
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface border border-border-theme rounded-md p-4 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClipboardList} className="text-white text-xs" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-surface border border-border-theme rounded-md p-4 text-center hover:shadow transition">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faBell} className="text-white text-sm" />
              </div>
              <h3 className="text-sm font-medium text-primary">Notifications</h3>
              <p className="text-secondary text-sm">View pending approvals</p>
            </button>
            
            <button className="bg-surface border border-border-theme rounded-md p-4 text-center hover:shadow transition">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faDownload} className="text-white text-sm" />
              </div>
              <h3 className="text-sm font-medium text-primary">Export Reports</h3>
              <p className="text-secondary text-sm">Download approval reports</p>
            </button>
            
            <Link 
              to="/home" 
              className="bg-surface border border-border-theme rounded-md p-4 text-center hover:shadow transition"
            >
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faHome} className="text-white text-sm" />
              </div>
              <h3 className="text-sm font-medium text-primary">Main Dashboard</h3>
              <p className="text-secondary text-sm">Return to dashboard</p>
            </Link>
            
            <button className="bg-surface border border-border-theme rounded-md p-4 text-center hover:shadow transition">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faChartBar} className="text-white text-sm" />
              </div>
              <h3 className="text-sm font-medium text-primary">Analytics</h3>
              <p className="text-secondary text-sm">View approval analytics</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface border border-border-theme rounded-md p-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-white text-xs" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Recent Approval Activities</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-surface rounded-md border animate-fade-in">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xs" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-primary text-sm">Course "Data Structures" approved</h4>
                <p className="text-xs text-secondary">Course coordinator: Dr. Smith</p>
              </div>
              <div className="text-xs text-secondary">
                2 hours ago
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-surface rounded-md border animate-fade-in">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUserCheck} className="text-white text-xs" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-primary text-sm">New coordinator assigned</h4>
                <p className="text-xs text-secondary">Section A - Computer Science</p>
              </div>
              <div className="text-xs text-secondary">
                1 day ago
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-surface rounded-md border animate-fade-in">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUserGraduate} className="text-white text-xs" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-primary text-sm">Mentor application received</h4>
                <p className="text-xs text-secondary">Student: John Doe - CS101</p>
              </div>
              <div className="text-xs text-secondary">
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
