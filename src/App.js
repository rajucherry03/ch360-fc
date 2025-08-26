import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Announcements from './components/Announcements';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import Attendance from './components/AttendanceList';
import Exam from './components/Exam';
import Grades from './components/Grades';
import ProfilePage from './components/ProfilePage';
import CommunicationPage from './components/Communication';
import Settings from './components/Settings';
import Logout from './components/Logout';
import CourseManagement from './components/Course';
import RequestPage from './components/RequestPage';
import Events from './components/Events';
import Resources from './components/Resources';
import Help from './components/Help';
import CourseDetails from './components/CourseDetails';
import StudentDetails from './components/StudentDetails';
import ApprovalWorkflow from "./components/ApprovalWorkflow";
import Login from './components/Login';
import FacultyCourseApproal from './components/FacultyCourseApproval'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './auth';
import ProtectedRoute from './ProtectedRoute';
import CoordinatorDashboard from './components/CoordinatorApproval';
import MentorApproval from './components/MentorApproval';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <MainLayout />
      </Router>
    </AuthProvider>
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
            <Route path="/course/:year/:section/:semester/:id" element={<CourseDetails />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/:id" element={<StudentDetails />} />
            <Route path="/attendance" element={<Attendance />} />
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
    <div className="flex h-screen">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex-1 overflow-auto bg-gray-50 md:ml-72">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
