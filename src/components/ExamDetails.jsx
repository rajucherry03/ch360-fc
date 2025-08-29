import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faMapMarkerAlt, 
  faFileAlt, 
  faUsers, 
  faGraduationCap, 
  faBookOpen, 
  faExclamationTriangle,
  faArrowLeft,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
  faChartBar,
  faHome,
  faClipboardList,
  faUserGraduate,
  faIdCard,
  faEnvelope,
  faPhone,
  faPlay,
  faStop,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const examData = [
  {
    id: 1,
    courseName: 'Introduction to Computer Science',
    examType: 'Mid-term',
    date: '2024-08-15',
    time: '10:00 AM',
    location: 'Room 101',
    syllabus: 'Chapters 1-5',
    examPattern: 'Multiple Choice, Short Answer',
    duration: '2 hours',
    totalMarks: '50',
    instructions: 'Please bring your student ID and calculator. No electronic devices allowed.',
    students: [
      { id: 1, name: 'Alice Johnson', rollNo: 'CS001', email: 'alice@example.com', phone: '+1234567890' },
      { id: 2, name: 'Bob Smith', rollNo: 'CS002', email: 'bob@example.com', phone: '+1234567891' },
    ],
  },
  {
    id: 2,
    courseName: 'Data Structures and Algorithms',
    examType: 'Final',
    date: '2024-09-20',
    time: '2:00 PM',
    location: 'Room 205',
    syllabus: 'Chapters 6-10',
    examPattern: 'Programming, Theory',
    duration: '3 hours',
    totalMarks: '100',
    instructions: 'Programming section requires laptop. Theory section is closed book.',
    students: [
      { id: 3, name: 'Charlie Brown', rollNo: 'CS003', email: 'charlie@example.com', phone: '+1234567892' },
      { id: 4, name: 'Diana Prince', rollNo: 'CS004', email: 'diana@example.com', phone: '+1234567893' },
    ],
  },
];

const ExamDetails = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
          }

          // Try to fetch from Firebase first
          try {
            const examRef = doc(db, "exams", id);
            const examSnap = await getDoc(examRef);
            
            if (examSnap.exists()) {
              setExam({ id: examSnap.id, ...examSnap.data() });
            } else {
              // Fallback to sample data
              const foundExam = examData.find(exam => exam.id === parseInt(id));
              if (foundExam) {
                setExam(foundExam);
              } else {
                setError("Exam not found.");
              }
            }
          } catch (firebaseError) {
            // Fallback to sample data if Firebase fails
            const foundExam = examData.find(exam => exam.id === parseInt(id));
            if (foundExam) {
              setExam(foundExam);
            } else {
              setError("Exam not found.");
            }
          }
        });
      } catch (err) {
        console.error("Error fetching exam details:", err.message);
        setError(err.message || "Error fetching exam details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [id]);

  const getStatusColor = (status) => {
    if (status === 'Completed') return { status: 'Completed', color: 'text-secondary', bg: 'bg-secondary/10', icon: faCheckCircle };
    if (status === 'Ongoing') return { status: 'Ongoing', color: 'text-accent', bg: 'bg-accent/10', icon: faClock };
    if (status === 'Upcoming') return { status: 'Upcoming', color: 'text-accent', bg: 'bg-accent/10', icon: faCalendarAlt };
    return { status: 'Draft', color: 'text-secondary', bg: 'bg-secondary/10', icon: faEdit };
  };

  const handleLogout = () => {
    auth.signOut();
    window.location.href = '/login';
  };

  const handleStartExam = () => {
    alert('Start Exam functionality not yet implemented.');
  };

  const handleEndExam = () => {
    alert('End Exam functionality not yet implemented.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="h-12 shimmer rounded-lg mb-4"></div>
            <div className="h-6 shimmer rounded w-1/3"></div>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
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
          <div className="text-primary text-xl font-semibold">{error || "Exam not found."}</div>
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
                <FontAwesomeIcon icon={faFileAlt} className="text-sm" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary">Exam Details</h1>
                <p className="text-secondary text-xs">Welcome back, {username || 'Faculty'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-primary inline-flex items-center gap-2 px-3 py-2 text-sm"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Exam Information */}
        <div className="bg-surface border border-border-theme rounded-md p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-accent/10 text-accent rounded-md flex items-center justify-center">
              <FontAwesomeIcon icon={faFileAlt} className="text-sm" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Exam Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Exam Name</label>
                <p className="text-primary">{exam?.courseName || 'Loading...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Course</label>
                <p className="text-primary">{exam?.examType || 'Loading...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Duration</label>
                <p className="text-primary">{exam?.duration || 'Loading...'} minutes</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Total Marks</label>
                <p className="text-primary">{exam?.totalMarks || 'Loading...'} marks</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Date & Time</label>
                <p className="text-primary">{exam?.date || 'Loading...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Venue</label>
                <p className="text-primary">{exam?.location || 'Loading...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam?.examType).bg} ${getStatusColor(exam?.examType).color}`}>
                  {exam?.examType || 'Loading...'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Enrolled Students</label>
                <p className="text-primary">{exam?.students?.length || 0} students</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <button
            onClick={() => handleStartExam()}
            className="bg-surface border border-border-theme rounded-md p-6 hover:shadow transition cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faPlay} className="text-white text-sm" />
              </div>
              <h3 className="text-lg font-semibold text-primary">Start Exam</h3>
            </div>
            <p className="text-secondary mb-4">
              Begin the examination session for all enrolled students.
            </p>
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90">
              <FontAwesomeIcon icon={faPlay} />
              Start Exam
            </div>
          </button>

          <button
            onClick={() => handleEndExam()}
            className="bg-surface border border-border-theme rounded-md p-6 hover:shadow transition cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faStop} className="text-white text-sm" />
              </div>
              <h3 className="text-lg font-semibold text-primary">End Exam</h3>
            </div>
            <p className="text-secondary mb-4">
              End the examination session and collect all submissions.
            </p>
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              <FontAwesomeIcon icon={faStop} />
              End Exam
            </div>
          </button>
        </div>

        {/* Exam Statistics */}
        <div className="bg-surface border border-border-theme rounded-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-accent/10 text-accent rounded-md flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-sm" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Exam Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-background rounded-md p-4 text-center border border-border-theme">
              <div className="text-2xl font-bold text-accent">{exam?.students?.length || 0}</div>
              <div className="text-sm text-secondary">Enrolled Students</div>
            </div>
            <div className="bg-background rounded-md p-4 text-center border border-border-theme">
              <div className="text-2xl font-bold text-secondary">85%</div>
              <div className="text-sm text-secondary">Attendance Rate</div>
            </div>
            <div className="bg-background rounded-md p-4 text-center border border-border-theme">
              <div className="text-2xl font-bold text-primary">78%</div>
              <div className="text-sm text-secondary">Average Score</div>
            </div>
            <div className="bg-background rounded-md p-4 text-center border border-border-theme">
              <div className="text-2xl font-bold text-accent">12</div>
              <div className="text-sm text-secondary">Questions</div>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-surface border border-border-theme rounded-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-accent/10 text-accent rounded-md flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-sm" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Enrolled Students</h2>
          </div>
          
          {exam?.students && exam.students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-theme">
                <thead className="bg-background">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border-theme">
                  {exam.students.map((student, index) => (
                    <tr key={student.id} className={index % 2 === 0 ? 'bg-surface' : 'bg-background'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        {student.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                        {student.name || student.studentName || `Student ${student.id}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                        {student.rollNo || student.rollNumber || student.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary`}>
                          {student.status || 'Enrolled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                        {student.score || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faUsers} className="text-secondary text-4xl mb-4" />
              <p className="text-secondary">No students enrolled in this exam yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
