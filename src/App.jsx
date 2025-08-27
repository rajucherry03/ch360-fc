import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navbar from './components/Navbar.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './auth.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { initPerformanceMonitoring } from './utils/performance.js';
import { preloadCriticalComponents } from './utils/preload.js';

// Lazy load components for better performance
const Home = lazy(() => import('./components/Home.jsx'));
const Announcements = lazy(() => import('./components/Announcements.jsx'));
const Dashboard = lazy(() => import('./components/Dashboard.jsx'));
const StudentList = lazy(() => import('./components/StudentList.jsx'));
const Attendance = lazy(() => import('./components/AttendanceList.jsx'));
const Exam = lazy(() => import('./components/Exam.jsx'));
const Grades = lazy(() => import('./components/Grades.jsx'));
const ProfilePage = lazy(() => import('./components/ProfilePage.jsx'));
const CommunicationPage = lazy(() => import('./components/Communication.jsx'));
const Settings = lazy(() => import('./components/Settings.jsx'));
const Logout = lazy(() => import('./components/Logout.jsx'));
const CourseManagement = lazy(() => import('./components/Course.jsx'));
const RequestPage = lazy(() => import('./components/RequestPage.jsx'));
const Events = lazy(() => import('./components/Events.jsx'));
const Resources = lazy(() => import('./components/Resources.jsx'));
const Help = lazy(() => import('./components/Help.jsx'));
const CourseDetails = lazy(() => import('./components/CourseDetails.jsx'));
const StudentDetails = lazy(() => import('./components/StudentDetails.jsx'));
const ApprovalWorkflow = lazy(() => import('./components/ApprovalWorkflow.jsx'));
const TakeAttendance = lazy(() => import('./components/TakeAttendance.jsx'));
const Login = lazy(() => import('./components/Login.jsx'));
const FacultyCourseApproal = lazy(() => import('./components/FacultyCourseApproval.jsx'));
const CoordinatorDashboard = lazy(() => import('./components/CoordinatorApproval.jsx'));
const MentorApproval = lazy(() => import('./components/MentorApproval.jsx'));

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Subtle loading component for route transitions
const RouteLoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
      <span className="text-sm text-gray-500">Loading...</span>
    </div>
  </div>
);

// Full screen loading for initial app load
const FullScreenLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600">Loading CampusHub360...</p>
    </div>
  </div>
);

function App() {
  // Initialize performance monitoring and preload critical components
  React.useEffect(() => {
    initPerformanceMonitoring();
    preloadCriticalComponents();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ToastContainer />
          <Suspense fallback={<FullScreenLoadingSpinner />}>
            <MainLayout />
          </Suspense>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

const MainLayout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/courses/:year/:section/:semester/courseDetails/:id" element={<CourseDetails />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:year/:section/:id" element={<StudentDetails />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/attendance/take" element={<TakeAttendance />} />
            <Route path="/attendance/:year/:section/:semester/:courseId" element={<TakeAttendance />} />
            <Route path="/exams" element={<Exam />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/communication" element={<CommunicationPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/help" element={<Help />} />
            <Route path="/request" element={<RequestPage />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
            <Route
              path="/approval"
              element={
                <ApprovalWorkflow />
              }
            />
            <Route
              path="/courses-approval"
              element={
                <FacultyCourseApproal />
              }
            />
            <Route
              path="/coordinators-approval"
              element={
                <CoordinatorDashboard />
              }
            />
            <Route
              path="/mentors-approval"
              element={
                <MentorApproval />
              }
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-white">
      <Navbar />
      <div className="flex-1 overflow-auto bg-white compact-ui pt-16 md:pt-0">
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default App;
