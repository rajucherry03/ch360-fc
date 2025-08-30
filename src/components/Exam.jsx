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

  const getStatusColor = (status) => {
    if (status === 'upcoming') return { status: 'upcoming', color: 'text-accent', bg: 'bg-accent/10' };
    if (status === 'ongoing') return { status: 'ongoing', color: 'text-secondary', bg: 'bg-secondary/10' };
    if (status === 'completed') return { status: 'completed', color: 'text-secondary', bg: 'bg-secondary/10' };
    return { status: 'draft', color: 'text-secondary', bg: 'bg-secondary/10' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/3 animate-pulse"></div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 animate-fade-in border border-gray-200 dark:border-gray-700" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-6 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 dark:text-red-400 text-6xl mb-6 animate-bounce" />
          <div className="text-gray-950 dark:text-white text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Exam Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-950 dark:text-white flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faFileAlt} className="text-white text-lg"/>
                </div>
                Exam Management
              </h1>
              <p className="text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faBookOpen} className="text-gray-800 dark:text-gray-200"/>
                Create, manage, and track your course examinations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-800 dark:text-gray-200">Total Exams</p>
                <p className="text-lg font-semibold text-gray-950 dark:text-white">{exams.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Exam Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faPlus} className="text-white text-sm" />
              </div>
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">Create New Exam</h2>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-300 hover:shadow-md inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              {showCreateForm ? 'Cancel' : 'Create Exam'}
            </button>
          </div>

          {/* Create Exam Form */}
          {showCreateForm && (
            <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Course</label>
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
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white"
                  >
                    <option value="">Select Course</option>
                    {facultyCourses.map(course => (
                      <option key={course.id} value={course.id}>{course.courseName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Exam Type</label>
                  <select
                    value={newExam.examType}
                    onChange={(e) => setNewExam({...newExam, examType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white"
                  >
                    <option value="Mid-term">Mid-term</option>
                    <option value="Final">Final</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Date</label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Time</label>
                  <input
                    type="time"
                    value={newExam.time}
                    onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Location</label>
                  <input
                    type="text"
                    value={newExam.location}
                    onChange={(e) => setNewExam({...newExam, location: e.target.value})}
                    placeholder="Room 101"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Duration</label>
                  <input
                    type="text"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                    placeholder="2 hours"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Total Marks</label>
                  <input
                    type="number"
                    value={newExam.totalMarks}
                    onChange={(e) => setNewExam({...newExam, totalMarks: e.target.value})}
                    placeholder="50"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Syllabus</label>
                  <input
                    type="text"
                    value={newExam.syllabus}
                    onChange={(e) => setNewExam({...newExam, syllabus: e.target.value})}
                    placeholder="Chapters 1-5"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Exam Pattern</label>
                  <input
                    type="text"
                    value={newExam.examPattern}
                    onChange={(e) => setNewExam({...newExam, examPattern: e.target.value})}
                    placeholder="Multiple Choice, Short Answer"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Instructions</label>
                  <textarea
                    value={newExam.instructions}
                    onChange={(e) => setNewExam({...newExam, instructions: e.target.value})}
                    placeholder="Exam instructions for students..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExam}
                  className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl text-sm transition-all duration-300 hover:shadow-md"
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
            const examStatus = getStatusColor(exam.status);
            return (
              <div 
                key={exam.id} 
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FontAwesomeIcon icon={faFileAlt} className="text-lg" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                      {examStatus.status}
                    </span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-gray-800 dark:text-gray-200 text-sm group-hover:text-primary transition-colors"/>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3 group-hover:text-secondary transition-colors">
                    {exam.courseName}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-primary"/>
                      <span>{exam.examType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-primary"/>
                      <span>{exam.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                      <FontAwesomeIcon icon={faClock} className="text-primary"/>
                      <span>{exam.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary"/>
                      <span>{exam.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-800 dark:text-gray-200 mb-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUsers} className="text-primary"/>
                      <span>{exam.students?.length || 0} Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartBar} className="text-primary"/>
                      <span>{exam.totalMarks || 'N/A'} Marks</span>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to={`/exams/${exam.id}`}
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-primary hover:bg-secondary text-white rounded-xl text-sm transition-all duration-300 hover:shadow-md"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                  View Details
                </Link>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faClipboardList} className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              to="/grades" 
              className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faChartBar} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Grade Management</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">Manage student grades</p>
            </Link>
            
            <Link 
              to="/courses" 
              className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faBookOpen} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">My Courses</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">View your courses</p>
            </Link>
            
            <Link 
              to="/home" 
              className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faHome} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Dashboard</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">Return to dashboard</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;

