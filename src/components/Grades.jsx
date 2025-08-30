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
    if (grade >= 90) return { color: 'text-secondary', bg: 'bg-secondary/10', icon: faTrophy };
    if (grade >= 80) return { color: 'text-accent', bg: 'bg-accent/10', icon: faStar };
    if (grade >= 70) return { color: 'text-accent', bg: 'bg-accent/10', icon: faMedal };
    return { color: 'text-accent', bg: 'bg-accent/10', icon: faExclamationTriangle };
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-3 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 dark:text-red-400 text-6xl mb-4 animate-bounce" />
          <div className="text-gray-950 dark:text-white text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Grades Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-950 dark:text-white flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-white text-lg"/>
                </div>
                Grade Management
              </h1>
              <p className="text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faChartBar} className="text-gray-800 dark:text-gray-200"/>
                Manage and track student grades across your courses
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-800 dark:text-gray-200">Total Courses</p>
                <p className="text-lg font-semibold text-gray-950 dark:text-white">{courses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Statistics Overview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Grade Statistics Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600">
              <div className="text-2xl font-bold text-gray-950 dark:text-white">
                {courses.reduce((sum, course) => sum + (course.totalStudents || 0), 0)}
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200">Total Students</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-200 dark:border-green-700">
              <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                {Math.round(courses.reduce((sum, course) => sum + (course.averageGrade || 0), 0) / courses.length)}%
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200">Average Grade</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-700">
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                {courses.reduce((sum, course) => sum + (course.assignments || 0), 0)}
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200">Total Assignments</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center border border-purple-200 dark:border-purple-700">
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                {courses.reduce((sum, course) => sum + (course.exams || 0), 0)}
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200">Total Exams</div>
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
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FontAwesomeIcon icon={faBookOpen} className="text-lg" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700 flex items-center gap-1">
                      <FontAwesomeIcon icon={gradeInfo.icon} />
                      {getGradeLetter(course.averageGrade || 0)}
                    </span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-gray-800 dark:text-gray-200 text-sm group-hover:text-primary transition-colors"/>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3 group-hover:text-secondary transition-colors">
                    {course.courseName}
                  </h3>
                  
                  <p className="text-gray-800 dark:text-gray-200 text-sm mb-4">Course Code: {course.courseCode}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUsers} className="text-primary"/>
                        Students
                      </span>
                      <span className="font-bold text-gray-950 dark:text-white">{course.totalStudents || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <FontAwesomeIcon icon={faChartBar} className="text-primary"/>
                        Average Grade
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">{course.averageGrade || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileAlt} className="text-primary"/>
                        Assignments
                      </span>
                      <span className="font-bold text-gray-950 dark:text-white">{course.assignments || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <FontAwesomeIcon icon={faClipboardList} className="text-primary"/>
                        Exams
                      </span>
                      <span className="font-bold text-gray-950 dark:text-white">{course.exams || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-800 dark:text-gray-200 mb-4">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faClock} className="text-primary"/>
                      Last Updated
                    </span>
                    <span>{course.lastUpdated || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link 
                    to={`/grades/${course.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-primary hover:bg-secondary text-white rounded-xl transition-all duration-300 hover:shadow-md text-sm font-semibold"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View Grades
                  </Link>
                  <button className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-600">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <button className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faUpload} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Upload Grades</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">Bulk upload student grades</p>
            </button>
            
            <button className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faDownload} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Export Report</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">Download grade reports</p>
            </button>
            
            <Link 
              to="/exams" 
              className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faFileAlt} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Exam Management</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">Manage course exams</p>
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

        {/* Recent Activity Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Recent Grade Activities</h2>
          </div>
          
          <div className="space-y-4">
            {courses.slice(0, 3).map((course, index) => (
              <div 
                key={course.id} 
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl animate-fade-in hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-white text-sm" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-950 dark:text-white">Grades updated for {course.courseName}</h4>
                  <p className="text-xs text-gray-800 dark:text-gray-200">Average grade: {course.averageGrade || 0}%</p>
                </div>
                <div className="text-xs text-gray-800 dark:text-gray-200">
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
