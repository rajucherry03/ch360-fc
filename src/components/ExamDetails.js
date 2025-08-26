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
  faPhone
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

  const getExamStatus = (examDate) => {
    const today = new Date();
    const examDateObj = new Date(examDate);
    
    if (examDateObj < today) {
      return { status: 'Completed', color: 'text-green-600', bg: 'bg-green-100', icon: faCheckCircle };
    } else if (examDateObj.toDateString() === today.toDateString()) {
      return { status: 'Today', color: 'text-orange-600', bg: 'bg-orange-100', icon: faClock };
    } else {
      return { status: 'Upcoming', color: 'text-blue-600', bg: 'bg-blue-100', icon: faCalendarAlt };
    }
  };

  const getDaysUntilExam = (examDate) => {
    const today = new Date();
    const examDateObj = new Date(examDate);
    const diffTime = examDateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-6xl mb-4 animate-bounce" />
          <div className="text-red-600 text-xl font-semibold">{error || "Exam not found."}</div>
          <Link 
            to="/exams"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  const examStatus = getExamStatus(exam.date);
  const daysUntilExam = getDaysUntilExam(exam.date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-4">
            <Link 
              to="/exams"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-all duration-200 border border-white/20"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-indigo-600" />
              <span className="text-gray-700 font-medium">Back to Exams</span>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <FontAwesomeIcon icon={faFileAlt} className="text-indigo-600 animate-pulse"/>
                {exam.courseName}
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faGraduationCap} className="text-indigo-400"/>
                {exam.examType} Examination
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${examStatus.bg} ${examStatus.color} flex items-center gap-2`}>
              <FontAwesomeIcon icon={examStatus.icon} />
              {examStatus.status}
            </div>
            {examStatus.status === 'Upcoming' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 text-gray-700 border border-white/20">
                <span className="text-sm font-medium">In {daysUntilExam} days</span>
              </div>
            )}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Overview */}
            <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faFileAlt} className="text-white" />
                </div>
                <h2 className="text-xl font-bold gradient-text">Exam Overview</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-800">{exam.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <FontAwesomeIcon icon={faClock} className="text-indigo-500 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold text-gray-800">{exam.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-500 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-800">{exam.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <FontAwesomeIcon icon={faClock} className="text-indigo-500 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-800">{exam.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <FontAwesomeIcon icon={faChartBar} className="text-indigo-500 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Total Marks</p>
                      <p className="font-semibold text-gray-800">{exam.totalMarks}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <FontAwesomeIcon icon={faUsers} className="text-indigo-500 w-5" />
                    <div>
                      <p className="text-sm text-gray-600">Enrolled Students</p>
                      <p className="font-semibold text-gray-800">{exam.students?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Details */}
            <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faBookOpen} className="text-white" />
                </div>
                <h2 className="text-xl font-bold gradient-text">Exam Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBookOpen} className="text-indigo-500" />
                    Syllabus Coverage
                  </h3>
                  <p className="text-gray-600 bg-white/50 p-3 rounded-lg">{exam.syllabus}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileAlt} className="text-indigo-500" />
                    Exam Pattern
                  </h3>
                  <p className="text-gray-600 bg-white/50 p-3 rounded-lg">{exam.examPattern}</p>
                </div>
                
                {exam.instructions && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faClipboardList} className="text-indigo-500" />
                      Instructions
                    </h3>
                    <p className="text-gray-600 bg-white/50 p-3 rounded-lg">{exam.instructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Enrolled Students */}
            <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserGraduate} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold gradient-text">Enrolled Students</h2>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 text-gray-700 border border-white/20">
                  <span className="text-sm font-medium">{exam.students?.length || 0} Students</span>
                </div>
              </div>
              
              <div className="grid gap-4">
                {exam.students?.map((student, index) => (
                  <div 
                    key={student.id} 
                    className="bg-white/50 rounded-lg p-4 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${student.name}&background=6366f1&color=fff&size=40`}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">{student.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <FontAwesomeIcon icon={faIdCard} className="text-indigo-400" />
                              {student.rollNo}
                            </span>
                            <span className="flex items-center gap-1">
                              <FontAwesomeIcon icon={faEnvelope} className="text-indigo-400" />
                              {student.email}
                            </span>
                            {student.phone && (
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faPhone} className="text-indigo-400" />
                                {student.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
                          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                          Present
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
                          <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                          Absent
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faClipboardList} className="text-white" />
                </div>
                <h2 className="text-xl font-bold gradient-text">Quick Actions</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105">
                  <FontAwesomeIcon icon={faEdit} />
                  Edit Exam
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105">
                  <FontAwesomeIcon icon={faChartBar} />
                  View Results
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                  <FontAwesomeIcon icon={faUsers} />
                  Manage Students
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105">
                  <FontAwesomeIcon icon={faTrash} />
                  Delete Exam
                </button>
              </div>
            </div>

            {/* Exam Statistics */}
            <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faChartBar} className="text-white" />
                </div>
                <h2 className="text-xl font-bold gradient-text">Statistics</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{exam.students?.length || 0}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Present</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <div className="text-sm text-gray-600">Absent</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faHome} className="text-white" />
                </div>
                <h2 className="text-xl font-bold gradient-text">Navigation</h2>
              </div>
              
              <div className="space-y-3">
                <Link 
                  to="/exams"
                  className="w-full flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faFileAlt} className="text-indigo-500" />
                  All Exams
                </Link>
                <Link 
                  to="/courses"
                  className="w-full flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faBookOpen} className="text-indigo-500" />
                  My Courses
                </Link>
                <Link 
                  to="/grades"
                  className="w-full flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faChartBar} className="text-indigo-500" />
                  Grades
                </Link>
                <Link 
                  to="/home"
                  className="w-full flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faHome} className="text-indigo-500" />
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
