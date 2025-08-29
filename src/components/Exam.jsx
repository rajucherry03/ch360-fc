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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <div className="h-16 bg-gray-200 rounded-2xl mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-xl w-1/3 animate-pulse"></div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl shadow-xl p-8 animate-fade-in border border-theme" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-6 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
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
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="bg-surface rounded-2xl shadow-xl p-12 text-center border border-theme">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-[var(--color-primary)] text-6xl mb-6 animate-bounce" />
          <div className="text-primary text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="page-container">
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} className="text-[var(--color-primary)]"/>
              Exam Management
            </h1>
            <p className="text-xs text-secondary hidden sm:block">Create, manage, and track your course examinations</p>
          </div>
          <div className="compact-card py-2 px-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} className="text-[var(--color-primary)] text-sm"/>
              <span className="text-sm text-primary">Total Exams:</span>
              <span className="text-base font-semibold text-primary">{exams.length}</span>
            </div>
          </div>
        </div>

        {/* Create Exam Button */}
        <div className="bg-surface border border-theme rounded-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faPlus} className="text-white text-sm" />
              </div>
              <h2 className="text-lg font-semibold text-primary">Create New Exam</h2>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-md text-sm hover:bg-[var(--color-secondary)]/90"
            >
              <FontAwesomeIcon icon={faPlus} />
              {showCreateForm ? 'Cancel' : 'Create Exam'}
            </button>
          </div>

          {/* Create Exam Form */}
          {showCreateForm && (
            <div className="mt-4 p-4 bg-background border border-theme rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Course</label>
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
                    className="w-full px-3 py-2 border border-theme rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] bg-background text-primary"
                  >
                    <option value="">Select Course</option>
                    {facultyCourses.map(course => (
                      <option key={course.id} value={course.id}>{course.courseName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Exam Type</label>
                  <select
                    value={newExam.examType}
                    onChange={(e) => setNewExam({...newExam, examType: e.target.value})}
                    className="w-full px-3 py-2 border border-theme rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] bg-background text-primary"
                  >
                    <option value="Mid-term">Mid-term</option>
                    <option value="Final">Final</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Date</label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                    className="w-full px-3 py-2 border border-theme rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] bg-background text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Time</label>
                  <input
                    type="time"
                    value={newExam.time}
                    onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                    className="w-full px-3 py-2 border border-theme rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] bg-background text-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Location</label>
                  <input
                    type="text"
                    value={newExam.location}
                    onChange={(e) => setNewExam({...newExam, location: e.target.value})}
                    placeholder="Room 101"
                    className="w-full px-3 py-2 border border-theme rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] bg-background text-primary placeholder:text-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Duration</label>
                  <input
                    type="text"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                    placeholder="2 hours"
                    className="w-full px-3 py-2 border border-theme rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] bg-background text-primary placeholder:text-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Total Marks</label>
                  <input
                    type="number"
                    value={newExam.totalMarks}
                    onChange={(e) => setNewExam({...newExam, totalMarks: e.target.value})}
                    placeholder="50"
                    className="w-full px-3 py-2 border border-theme rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] bg-background text-primary placeholder:text-secondary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-2">Syllabus</label>
                  <input
                    type="text"
                    value={newExam.syllabus}
                    onChange={(e) => setNewExam({...newExam, syllabus: e.target.value})}
                    placeholder="Chapters 1-5"
                    className="w-full px-3 py-2 border border-theme rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] bg-background text-primary placeholder:text-secondary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-2">Exam Pattern</label>
                  <input
                    type="text"
                    value={newExam.examPattern}
                    onChange={(e) => setNewExam({...newExam, examPattern: e.target.value})}
                    placeholder="Multiple Choice, Short Answer"
                    className="w-full px-3 py-2 border border-theme rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] bg-background text-primary placeholder:text-secondary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-2">Instructions</label>
                  <textarea
                    value={newExam.instructions}
                    onChange={(e) => setNewExam({...newExam, instructions: e.target.value})}
                    placeholder="Exam instructions for students..."
                    rows="3"
                    className="w-full px-3 py-2 border border-theme rounded-md text-sm focus:ring-2 focus:ring-[var(--color-secondary)] bg-background text-primary placeholder:text-secondary"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-theme text-primary rounded-md text-sm hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExam}
                  className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-md text-sm hover:bg-[var(--color-secondary)]/90"
                >
                  Create Exam
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Exams Grid */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam, index) => {
            const examStatus = getStatusColor(exam.status);
            return (
              <div 
                key={exam.id} 
                className="bg-surface border border-theme rounded-md p-4 hover:shadow cursor-pointer transition"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faFileAlt} className="text-white text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface text-primary border border-theme`}>
                      {examStatus.status}
                    </span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[var(--color-secondary)]"/>
                  </div>
                </div>
                
                <h3 className="text-base font-semibold text-primary mb-2">
                  {exam.courseName}
                </h3>
                
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-secondary text-sm">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-[var(--color-primary)]"/>
                    <span className="text-sm">{exam.examType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary text-sm">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-[var(--color-primary)]"/>
                    <span className="text-sm">{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary text-sm">
                    <FontAwesomeIcon icon={faClock} className="text-[var(--color-primary)]"/>
                    <span className="text-sm">{exam.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary text-sm">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[var(--color-primary)]"/>
                    <span className="text-sm">{exam.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-secondary mb-3">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="text-[var(--color-primary)]"/>
                    <span>{exam.students?.length || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartBar} className="text-[var(--color-primary)]"/>
                    <span>{exam.totalMarks || 'N/A'} Marks</span>
                  </div>
                </div>
                
                <Link 
                  to={`/exams/${exam.id}`}
                  className="inline-flex items-center gap-2 w-full justify-center px-3 py-2 bg-[var(--color-secondary)] text-white rounded-md text-sm hover:bg-[var(--color-secondary)]/90"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                    View Details
                  </Link>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-surface border border-theme rounded-md p-4 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[var(--color-accent)] rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClipboardList} className="text-white text-xs" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/grades" 
              className="bg-background border border-theme rounded-md p-4 text-center hover:shadow transition"
            >
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faChartBar} className="text-white text-sm" />
              </div>
              <h3 className="text-sm font-medium text-primary">Grade Management</h3>
              <p className="text-secondary text-sm">Manage student grades</p>
            </Link>
            
            <Link 
              to="/courses" 
              className="bg-background border border-theme rounded-md p-4 text-center hover:shadow transition"
            >
              <div className="w-8 h-8 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faBookOpen} className="text-white text-sm" />
              </div>
              <h3 className="text-sm font-medium text-primary">My Courses</h3>
              <p className="text-secondary text-sm">View your courses</p>
            </Link>
            
            <Link 
              to="/home" 
              className="bg-background border border-theme rounded-md p-4 text-center hover:shadow transition"
            >
              <div className="w-8 h-8 bg-[var(--color-accent)] rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faHome} className="text-white text-sm" />
              </div>
              <h3 className="text-sm font-medium text-primary">Dashboard</h3>
              <p className="text-secondary text-sm">Return to dashboard</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;

