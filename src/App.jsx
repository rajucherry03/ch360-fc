import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Announcements from './components/Announcements.jsx';
import Dashboard from './components/Dashboard.jsx';
import StudentList from './components/StudentList.jsx';
import Attendance from './components/AttendanceList.jsx';
import Exam from './components/Exam.jsx';
import Grades from './components/Grades.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import CommunicationPage from './components/Communication.jsx';
import Settings from './components/Settings.jsx';
import Logout from './components/Logout.jsx';
import CourseManagement from './components/Course.jsx';
import RequestPage from './components/RequestPage.jsx';
import Events from './components/Events.jsx';
import Resources from './components/Resources.jsx';
import Help from './components/Help.jsx';
import CourseDetails from './components/CourseDetails.jsx';
import StudentDetails from './components/StudentDetails.jsx';
import ApprovalWorkflow from "./components/ApprovalWorkflow.jsx";
import TakeAttendance from './components/TakeAttendance.jsx';
import Login from './components/Login.jsx';
import FacultyCourseApproal from './components/FacultyCourseApproval.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './auth.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import CoordinatorDashboard from './components/CoordinatorApproval.jsx';
import MentorApproval from './components/MentorApproval.jsx';


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
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="flex-1 overflow-auto bg-white md:ml-72 compact-ui">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
