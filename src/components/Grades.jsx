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
      <div className="min-h-screen bg-background p-6">
        <div className="page-container">
          <div className="mb-8 animate-fade-in">
            <div className="h-12 shimmer rounded-lg mb-4"></div>
            <div className="h-6 shimmer rounded w-1/3"></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface border border-theme rounded-md p-4 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 shimmer rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 shimmer rounded w-2/3 mb-2"></div>
                    <div className="h-3 shimmer rounded w-1/3"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-5 w-14 shimmer rounded"></div>
                  <div className="h-5 w-20 shimmer rounded"></div>
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
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-[var(--color-accent)] text-6xl mb-4 animate-bounce" />
          <div className="text-primary text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="page-container">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
              <FontAwesomeIcon icon={faGraduationCap} className="text-[var(--color-primary)]"/>
              Grade Management
            </h1>
            <p className="text-xs text-secondary mt-1 flex items-center gap-1">
              <FontAwesomeIcon icon={faChartBar} className="text-[var(--color-primary)]"/>
              Manage and track student grades across your courses
            </p>
          </div>
          <div className="compact-card py-2 px-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBookOpen} className="text-[var(--color-primary)]"/>
              <span className="text-sm text-primary">Total Courses:</span>
              <span className="text-base font-semibold text-primary">{courses.length}</span>
            </div>
          </div>
        </header>

        {/* Grade Statistics Overview */}
        <div className="compact-card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-surface text-[var(--color-primary)] flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-sm" />
            </div>
            <h2 className="text-sm font-semibold text-primary">Grade Statistics Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-background rounded-md p-3 text-center">
              <div className="text-lg font-semibold text-[var(--color-primary)]">
                {courses.reduce((sum, course) => sum + (course.totalStudents || 0), 0)}
              </div>
              <div className="text-xs text-secondary">Total Students</div>
            </div>
            <div className="bg-background rounded-md p-3 text-center border border-theme">
              <div className="text-lg font-semibold text-[var(--color-secondary)]">
                {Math.round(courses.reduce((sum, course) => sum + (course.averageGrade || 0), 0) / courses.length)}%
              </div>
              <div className="text-xs text-secondary">Average Grade</div>
            </div>
            <div className="bg-background rounded-md p-3 text-center border border-theme">
              <div className="text-lg font-semibold text-[var(--color-primary)]">
                {courses.reduce((sum, course) => sum + (course.assignments || 0), 0)}
              </div>
              <div className="text-xs text-secondary">Total Assignments</div>
            </div>
            <div className="bg-background rounded-md p-3 text-center border border-theme">
              <div className="text-lg font-semibold text-[var(--color-accent)]">
                {courses.reduce((sum, course) => sum + (course.exams || 0), 0)}
              </div>
              <div className="text-xs text-secondary">Total Exams</div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => {
            const gradeInfo = getGradeColor(course.averageGrade || 0);
            return (
              <div 
                key={course.id} 
                className="group bg-surface rounded-lg border border-theme p-4 hover:shadow-sm animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-md bg-surface text-[var(--color-primary)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-surface text-primary border border-theme flex items-center gap-1`}>
                      <FontAwesomeIcon icon={gradeInfo.icon} />
                      {getGradeLetter(course.averageGrade || 0)}
                    </span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[var(--color-secondary)] text-sm"/>
                  </div>
                </div>
                
                <h3 className="text-base font-semibold text-primary mb-1">
                  {course.courseName}
                </h3>
                
                <p className="text-secondary text-sm mb-3">Course Code: {course.courseCode}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary flex items-center gap-2">
                      <FontAwesomeIcon icon={faUsers} className="text-[var(--color-primary)]"/>
                      Students
                    </span>
                    <span className="font-semibold text-primary">{course.totalStudents || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartBar} className="text-[var(--color-primary)]"/>
                      Average Grade
                    </span>
                    <span className={`font-semibold text-[var(--color-secondary)]`}>{course.averageGrade || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileAlt} className="text-[var(--color-primary)]"/>
                      Assignments
                    </span>
                    <span className="font-semibold text-primary">{course.assignments || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary flex items-center gap-2">
                      <FontAwesomeIcon icon={faClipboardList} className="text-[var(--color-primary)]"/>
                      Exams
                    </span>
                    <span className="font-semibold text-primary">{course.exams || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-secondary mb-3">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} className="text-[var(--color-primary)]"/>
                    Last Updated
                  </span>
                  <span>{course.lastUpdated || 'N/A'}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    to={`/grades/${course.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--color-secondary)] text-white rounded-md hover:bg-[var(--color-secondary)]/90 text-sm"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View Grades
                  </Link>
                  <button className="px-3 py-2 bg-[var(--color-accent)] text-white rounded-md hover:bg-[var(--color-accent)]/90 text-sm">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="compact-card mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-surface text-[var(--color-accent)] flex items-center justify-center">
              <FontAwesomeIcon icon={faClipboardList} className="text-sm" />
            </div>
            <h2 className="text-sm font-semibold text-primary">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button className="group compact-card text-center">
              <div className="w-10 h-10 bg-surface text-[var(--color-primary)] rounded-md flex items-center justify-center mx-auto mb-2">
                <FontAwesomeIcon icon={faUpload} className="text-sm" />
              </div>
              <h3 className="text-sm font-semibold text-primary">Upload Grades</h3>
              <p className="text-xs text-secondary">Bulk upload student grades</p>
            </button>
            
            <button className="group compact-card text-center">
              <div className="w-10 h-10 bg-surface text-[var(--color-secondary)] rounded-md flex items-center justify-center mx-auto mb-2">
                <FontAwesomeIcon icon={faDownload} className="text-sm" />
              </div>
              <h3 className="text-sm font-semibold text-primary">Export Report</h3>
              <p className="text-xs text-secondary">Download grade reports</p>
            </button>
            
            <Link 
              to="/exams" 
              className="group compact-card text-center"
            >
              <div className="w-10 h-10 bg-surface text-[var(--color-accent)] rounded-md flex items-center justify-center mx-auto mb-2">
                <FontAwesomeIcon icon={faFileAlt} className="text-sm" />
              </div>
              <h3 className="text-sm font-semibold text-primary">Exam Management</h3>
              <p className="text-xs text-secondary">Manage course exams</p>
            </Link>
            
            <Link 
              to="/home" 
              className="group compact-card text-center"
            >
              <div className="w-10 h-10 bg-surface text-[var(--color-primary)] rounded-md flex items-center justify-center mx-auto mb-2">
                <FontAwesomeIcon icon={faHome} className="text-sm" />
              </div>
              <h3 className="text-sm font-semibold text-primary">Dashboard</h3>
              <p className="text-xs text-secondary">Return to dashboard</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="compact-card mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-surface text-[var(--color-primary)] flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-sm" />
            </div>
            <h2 className="text-sm font-semibold text-primary">Recent Grade Activities</h2>
          </div>
          
          <div className="space-y-4">
            {courses.slice(0, 3).map((course, index) => (
              <div 
                key={course.id} 
                className="flex items-center gap-3 p-3 bg-background rounded-md animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-8 h-8 bg-surface text-[var(--color-secondary)] rounded-md flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-primary">Grades updated for {course.courseName}</h4>
                  <p className="text-xs text-secondary">Average grade: {course.averageGrade || 0}%</p>
                </div>
                <div className="text-xs text-secondary">
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
