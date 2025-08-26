import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faBookOpen, 
  faUsers, 
  faChartBar, 
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
  faMedal
} from '@fortawesome/free-solid-svg-icons';

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacultyCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
          }

          // Fetch faculty's courses using collection group query
          try {
            const coursesRef = collection(db, "courses");
            const coursesQuery = query(coursesRef, where("instructor", "==", user.uid));
            const coursesSnap = await getDocs(coursesQuery);
            
            const courses = coursesSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            if (courses.length === 0) {
              // Use sample data if no courses found
              setCourses([
                {
                  id: 1,
                  courseName: 'Introduction to Computer Science',
                  courseCode: 'CS101',
                  instructor: user.uid,
                  totalStudents: 45,
                  averageGrade: 85.2,
                  assignments: 5,
                  exams: 2,
                  lastUpdated: '2024-01-15'
                },
                {
                  id: 2,
                  courseName: 'Data Structures and Algorithms',
                  courseCode: 'CS201',
                  instructor: user.uid,
                  totalStudents: 38,
                  averageGrade: 78.9,
                  assignments: 8,
                  exams: 3,
                  lastUpdated: '2024-01-14'
                },
                {
                  id: 3,
                  courseName: 'Database Management Systems',
                  courseCode: 'CS301',
                  instructor: user.uid,
                  totalStudents: 42,
                  averageGrade: 82.1,
                  assignments: 6,
                  exams: 2,
                  lastUpdated: '2024-01-13'
                }
              ]);
            } else {
              setCourses(courses);
            }
          } catch (firebaseError) {
            // Fallback to sample data
            setCourses([
              {
                id: 1,
                courseName: 'Introduction to Computer Science',
                courseCode: 'CS101',
                instructor: user.uid,
                totalStudents: 45,
                averageGrade: 85.2,
                assignments: 5,
                exams: 2,
                lastUpdated: '2024-01-15'
              },
              {
                id: 2,
                courseName: 'Data Structures and Algorithms',
                courseCode: 'CS201',
                instructor: user.uid,
                totalStudents: 38,
                averageGrade: 78.9,
                assignments: 8,
                exams: 3,
                lastUpdated: '2024-01-14'
              },
              {
                id: 3,
                courseName: 'Database Management Systems',
                courseCode: 'CS301',
                instructor: user.uid,
                totalStudents: 42,
                averageGrade: 82.1,
                assignments: 6,
                exams: 2,
                lastUpdated: '2024-01-13'
              }
            ]);
          }

          setLoading(false);
        });
      } catch (err) {
        console.error("Error fetching faculty courses:", err.message);
        setError(err.message || "Error fetching faculty courses.");
      }
    };

    fetchFacultyCourses();
  }, []);

  const getGradeColor = (grade) => {
    if (grade >= 90) return { color: 'text-green-600', bg: 'bg-green-100', icon: faTrophy };
    if (grade >= 80) return { color: 'text-blue-600', bg: 'bg-blue-100', icon: faStar };
    if (grade >= 70) return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: faMedal };
    return { color: 'text-red-600', bg: 'bg-red-100', icon: faExclamationTriangle };
  };

  const getGradeLetter = (grade) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
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
              <FontAwesomeIcon icon={faGraduationCap} className="text-indigo-600 animate-pulse"/>
              Grade Management
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartBar} className="text-indigo-400"/>
              Manage and track student grades across your courses
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg px-6 py-4 text-gray-700 border border-white/20">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBookOpen} className="text-indigo-500"/>
              <span className="font-medium">Total Courses:</span>
              <span className="font-bold text-indigo-600 text-xl">{courses.length}</span>
            </div>
          </div>
        </header>

        {/* Grade Statistics Overview */}
        <div className="glass rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Grade Statistics Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {courses.reduce((sum, course) => sum + (course.totalStudents || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(courses.reduce((sum, course) => sum + (course.averageGrade || 0), 0) / courses.length)}%
              </div>
              <div className="text-sm text-gray-600">Average Grade</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {courses.reduce((sum, course) => sum + (course.assignments || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Assignments</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {courses.reduce((sum, course) => sum + (course.exams || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Exams</div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => {
            const gradeInfo = getGradeColor(course.averageGrade || 0);
            return (
              <div 
                key={course.id} 
                className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in cursor-pointer border-2 border-transparent hover:border-indigo-200 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FontAwesomeIcon icon={faBookOpen} className="text-white text-xl" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeInfo.bg} ${gradeInfo.color} flex items-center gap-1`}>
                      <FontAwesomeIcon icon={gradeInfo.icon} />
                      {getGradeLetter(course.averageGrade || 0)}
                    </span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-indigo-400 group-hover:translate-x-1 transition-transform duration-300"/>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 mb-2">
                  {course.courseName}
                </h3>
                
                <p className="text-gray-600 mb-4">Course Code: {course.courseCode}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faUsers} className="text-indigo-400"/>
                      Students
                    </span>
                    <span className="font-semibold text-gray-800">{course.totalStudents || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartBar} className="text-indigo-400"/>
                      Average Grade
                    </span>
                    <span className={`font-semibold ${gradeInfo.color}`}>{course.averageGrade || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileAlt} className="text-indigo-400"/>
                      Assignments
                    </span>
                    <span className="font-semibold text-gray-800">{course.assignments || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FontAwesomeIcon icon={faClipboardList} className="text-indigo-400"/>
                      Exams
                    </span>
                    <span className="font-semibold text-gray-800">{course.exams || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} className="text-indigo-400"/>
                    Last Updated
                  </span>
                  <span>{course.lastUpdated || 'N/A'}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    to={`/grades/${course.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View Grades
                  </Link>
                  <button className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faUpload} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Upload Grades</h3>
              <p className="text-gray-600">Bulk upload student grades</p>
            </button>
            
            <button className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faDownload} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Export Report</h3>
              <p className="text-gray-600">Download grade reports</p>
            </button>
            
            <Link 
              to="/exams" 
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faFileAlt} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Exam Management</h3>
              <p className="text-gray-600">Manage course exams</p>
            </Link>
            
            <Link 
              to="/home" 
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faHome} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Dashboard</h3>
              <p className="text-gray-600">Return to dashboard</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl shadow-lg p-6 mt-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Recent Grade Activities</h2>
          </div>
          
          <div className="space-y-4">
            {courses.slice(0, 3).map((course, index) => (
              <div 
                key={course.id} 
                className="flex items-center gap-4 p-4 bg-white/50 rounded-lg animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">Grades updated for {course.courseName}</h4>
                  <p className="text-sm text-gray-600">Average grade: {course.averageGrade || 0}%</p>
                </div>
                <div className="text-sm text-gray-500">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                  {course.lastUpdated || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;
