import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faMapMarkerAlt, 
  faBookOpen, 
  faUsers, 
  faPlus, 
  faExclamationTriangle,
  faArrowRight,
  faFileAlt,
  faGraduationCap,
  faChartBar,
  faHome,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { auth, db } from "../firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Exam = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyCourses, setFacultyCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExam, setNewExam] = useState({
    courseId: '',
    courseName: '',
    examType: 'Mid-term',
    date: '',
    time: '',
    location: '',
    syllabus: '',
    examPattern: '',
    duration: '',
    totalMarks: '',
    instructions: ''
  });

  useEffect(() => {
    const fetchFacultyExams = async () => {
      try {
        setLoading(true);
        setError(null);

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
          }

          // Fetch faculty's courses
          const coursesRef = collection(db, "courses");
          const coursesQuery = query(coursesRef, where("instructor", "==", user.uid));
          const coursesSnap = await getDocs(coursesQuery);
          
          const courses = coursesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setFacultyCourses(courses);

          // Fetch exams for faculty's courses
          const examsRef = collection(db, "exams");
          const examsQuery = query(examsRef, where("facultyId", "==", user.uid));
          const examsSnap = await getDocs(examsQuery);
          
          const examData = examsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          if (examData.length === 0) {
            // Use sample data if no exams found
            setExams([
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
                students: [
                  { id: 1, name: 'Alice Johnson' },
                  { id: 2, name: 'Bob Smith' },
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
                students: [
                  { id: 3, name: 'Charlie Brown' },
                  { id: 4, name: 'Diana Prince' },
                ],
              }
            ]);
          } else {
            setExams(examData);
          }
        });
      } catch (err) {
        console.error("Error fetching exams:", err.message);
        setError(err.message || "Error fetching exams.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyExams();
  }, []);

  const handleCreateExam = async () => {
    try {
      const examData = {
        ...newExam,
        facultyId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        status: 'scheduled'
      };

      await addDoc(collection(db, "exams"), examData);
      setShowCreateForm(false);
      setNewExam({
        courseId: '',
        courseName: '',
        examType: 'Mid-term',
        date: '',
        time: '',
        location: '',
        syllabus: '',
        examPattern: '',
        duration: '',
        totalMarks: '',
        instructions: ''
      });
      
      // Refresh exams list
      window.location.reload();
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Error creating exam. Please try again.");
    }
  };

  const getExamStatus = (examDate) => {
    const today = new Date();
    const examDateObj = new Date(examDate);
    
    if (examDateObj < today) {
      return { status: 'completed', color: 'text-green-600', bg: 'bg-green-100' };
    } else if (examDateObj.toDateString() === today.toDateString()) {
      return { status: 'today', color: 'text-orange-600', bg: 'bg-orange-100' };
    } else {
      return { status: 'upcoming', color: 'text-blue-600', bg: 'bg-blue-100' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="h-12 shimmer rounded-lg mb-4"></div>
            <div className="h-6 shimmer rounded w-1/3"></div>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <FontAwesomeIcon icon={faFileAlt} className="text-indigo-600 animate-pulse"/>
              Exam Management
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faBookOpen} className="text-indigo-400"/>
              Create, manage, and track your course examinations
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg px-6 py-4 text-gray-700 border border-white/20">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} className="text-indigo-500"/>
              <span className="font-medium">Total Exams:</span>
              <span className="font-bold text-indigo-600 text-xl">{exams.length}</span>
            </div>
          </div>
        </header>

        {/* Create Exam Button */}
        <div className="glass rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faPlus} className="text-white" />
              </div>
              <h2 className="text-xl font-bold gradient-text">Create New Exam</h2>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faPlus} />
              {showCreateForm ? 'Cancel' : 'Create Exam'}
            </button>
          </div>

          {/* Create Exam Form */}
          {showCreateForm && (
            <div className="mt-6 p-6 bg-white/50 rounded-lg border border-indigo-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <select
                    value={newExam.courseId}
                    onChange={(e) => {
                      const course = facultyCourses.find(c => c.id === e.target.value);
                      setNewExam({
                        ...newExam,
                        courseId: e.target.value,
                        courseName: course ? course.courseName : ''
                      });
                    }}
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">Select Course</option>
                    {facultyCourses.map(course => (
                      <option key={course.id} value={course.id}>{course.courseName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                  <select
                    value={newExam.examType}
                    onChange={(e) => setNewExam({...newExam, examType: e.target.value})}
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    <option value="Mid-term">Mid-term</option>
                    <option value="Final">Final</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newExam.time}
                    onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newExam.location}
                    onChange={(e) => setNewExam({...newExam, location: e.target.value})}
                    placeholder="Room 101"
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                    placeholder="2 hours"
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
                  <input
                    type="number"
                    value={newExam.totalMarks}
                    onChange={(e) => setNewExam({...newExam, totalMarks: e.target.value})}
                    placeholder="50"
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Syllabus</label>
                  <input
                    type="text"
                    value={newExam.syllabus}
                    onChange={(e) => setNewExam({...newExam, syllabus: e.target.value})}
                    placeholder="Chapters 1-5"
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Pattern</label>
                  <input
                    type="text"
                    value={newExam.examPattern}
                    onChange={(e) => setNewExam({...newExam, examPattern: e.target.value})}
                    placeholder="Multiple Choice, Short Answer"
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                  <textarea
                    value={newExam.instructions}
                    onChange={(e) => setNewExam({...newExam, instructions: e.target.value})}
                    placeholder="Exam instructions for students..."
                    rows="3"
                    className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExam}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  Create Exam
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Exams Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam, index) => {
            const examStatus = getExamStatus(exam.date);
            return (
              <div 
                key={exam.id} 
                className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in cursor-pointer border-2 border-transparent hover:border-indigo-200 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FontAwesomeIcon icon={faFileAlt} className="text-white text-xl" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${examStatus.bg} ${examStatus.color}`}>
                      {examStatus.status}
                    </span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-indigo-400 group-hover:translate-x-1 transition-transform duration-300"/>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 mb-2">
                  {exam.courseName}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-indigo-400"/>
                    <span className="text-sm">{exam.examType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-400"/>
                    <span className="text-sm">{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon icon={faClock} className="text-indigo-400"/>
                    <span className="text-sm">{exam.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-400"/>
                    <span className="text-sm">{exam.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="text-indigo-400"/>
                    <span>{exam.students?.length || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartBar} className="text-indigo-400"/>
                    <span>{exam.totalMarks || 'N/A'} Marks</span>
                  </div>
                </div>
                
                <Link 
                  to={`/exams/${exam.id}`}
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform duration-300"/>
                  View Details
                </Link>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl shadow-lg p-6 mt-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClipboardList} className="text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/grades" 
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faChartBar} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Grade Management</h3>
              <p className="text-gray-600">Manage student grades</p>
            </Link>
            
            <Link 
              to="/courses" 
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBookOpen} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">My Courses</h3>
              <p className="text-gray-600">View your courses</p>
            </Link>
            
            <Link 
              to="/home" 
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faHome} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Dashboard</h3>
              <p className="text-gray-600">Return to dashboard</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
