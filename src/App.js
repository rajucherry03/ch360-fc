import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CourseManagement from './components/Course';
import CourseDetails from './components/CourseDetails';
import StudentList from './components/StudentList';
import StudentDetails from './components/StudentDetails';
import Attendance from './components/AttendanceList';
import StudentAttendance from './components/StudentAttendance';
import EditAttendance from './components/EditAttendance';
import ExamDetails from './components/ExamDetails';
import Exam from './components/Exam';
import Grades from './components/Grades';
import StudentGrades from './components/StudentGrades';
import CommunicationPage from './components/Communication';
import Announcements from './components/Announcements';
import ApprovalWorkflow from "./components/ApprovalWorkflow";
import RequestPage from "./components/RequestPage";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

const MainLayout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance/:id" element={<StudentAttendance />} />
          <Route path="/edit-attendance/:id" element={<EditAttendance />} />
          <Route path="/exams" element={<Exam />} />
          <Route path="/exams/:id" element={<ExamDetails />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/grades/:id" element={<StudentGrades />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/approval" element={<ApprovalWorkflow />} />
          <Route path='/request' element={<RequestPage />} />
          <Route path='/profile' element={<ProfilePage />} />


        </Routes>
      </div>
    </div>
  );
}

export default App;
