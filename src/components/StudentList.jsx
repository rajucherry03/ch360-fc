import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  collectionGroup,
  documentId 
} from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faFilter, 
  faSearch, 
  faExclamationTriangle, 
  faUserGraduate, 
  faChalkboardTeacher,
  faClock,
  faCheckCircle,
  faEnvelope,
  faGraduationCap,
  faIdCard,
  faArrowRight,
  faSync,
  faRocket,
  faArrowLeft,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

// Ultra-fast cache management
const CACHE_KEY = "studentsCache_v2";
const CACHE_TIMESTAMP_KEY = "studentsCacheTimestamp";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [loading, setLoading] = useState(false); // Start with false for instant display
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadTime, setLoadTime] = useState(0);
  const [facultyData, setFacultyData] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  
  const navigate = useNavigate();

  // Performance tracking
  const startTime = useRef(Date.now());
  const dataFetched = useRef(false);

  // Instant cache retrieval - runs synchronously
  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < CACHE_DURATION) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (error) {
      console.log("Cache read failed:", error);
    }
    return null;
  }, []);

  // Simple and direct data fetching
  const fetchDataUltraFast = useCallback(async (user) => {
    if (!user || dataFetched.current) {
      console.log("❌ Data already fetched, skipping");
      return;
    }

    console.log("🚀 Starting simple data fetch for user:", user.uid);
    const startTime = Date.now();
    setLoading(true);
    setError(null);
    dataFetched.current = true;

    try {
      // Step 1: Get faculty data to get authUid
      console.log("🔍 Step 1: Getting faculty data...");
      let facultyData = null;
      const facultyRef = doc(db, 'faculty', 'CSE_DS', 'members', user.uid);
      const facultySnap = await getDoc(facultyRef);
      
      if (facultySnap.exists()) {
        facultyData = facultySnap.data();
        setFacultyData(facultyData);
        console.log("✅ Faculty found:", facultyData.name, "authUid:", facultyData.authUid);
      } else {
        console.log("❌ Faculty not found, using user.uid as instructor");
        facultyData = { authUid: user.uid, name: user.email, department: 'Unknown' };
        setFacultyData(facultyData);
      }

      const instructorId = facultyData.authUid;
      console.log("🎯 Looking for courses where instructor =", instructorId);

      // Step 2: Find all courses where instructor matches
      console.log("🔍 Step 2: Finding instructor courses...");
      const instructorCourseList = [];
      
      // Use collectionGroup to search all courseDetails
      const courseDetailsQuery = collectionGroup(db, 'courseDetails');
      const courseDetailsSnap = await getDocs(courseDetailsQuery);
      
      console.log(`📚 Found ${courseDetailsSnap.docs.length} total courses`);
      
      for (const courseDoc of courseDetailsSnap.docs) {
        const courseData = courseDoc.data();
        const courseId = courseDoc.id;
        
        console.log(`🔍 Course: ${courseData.courseName}, Instructor: ${courseData.instructor}`);
        
        if (courseData.instructor === instructorId) {
          console.log(`✅ Match found! Course: ${courseData.courseName}`);
          instructorCourseList.push({
            id: courseId,
            courseName: courseData.courseName,
            courseCode: courseData.courseCode,
            instructor: courseData.instructor,
            studentsBySection: courseData.studentsBySection,
            students: courseData.students || [],
            year: courseData.displayYear?.split('_')[0] || 'III',
            section: courseData.displaySection || 'All',
            semester: courseData.displaySemester || '5',
            credits: courseData.credits || 3
          });
        }
      }

      setInstructorCourses(instructorCourseList);
      console.log(`👨‍🏫 Found ${instructorCourseList.length} instructor courses`);

      // Step 3: Get all students from instructor courses
      console.log("🔍 Step 3: Getting students from instructor courses...");
      const allStudentIds = new Set();
      const courseStudentMap = new Map();

      instructorCourseList.forEach(course => {
        console.log(`📚 Processing course: ${course.courseName}`);
        
        // Get students from studentsBySection
        if (course.studentsBySection && typeof course.studentsBySection === 'object') {
          Object.entries(course.studentsBySection).forEach(([section, studentIds]) => {
            if (Array.isArray(studentIds)) {
              console.log(`   Section ${section}: ${studentIds.length} students`);
              studentIds.forEach(studentId => {
                allStudentIds.add(studentId);
                if (!courseStudentMap.has(studentId)) {
                  courseStudentMap.set(studentId, []);
                }
                courseStudentMap.get(studentId).push({
                  courseName: course.courseName,
                  courseCode: course.courseCode,
                  section: section,
                  semester: course.semester,
                  year: course.year
                });
              });
            }
          });
        }
        
        // Also check direct students array
        if (course.students && Array.isArray(course.students)) {
          console.log(`   Direct students: ${course.students.length} students`);
          course.students.forEach(studentId => {
            allStudentIds.add(studentId);
            if (!courseStudentMap.has(studentId)) {
              courseStudentMap.set(studentId, []);
            }
            courseStudentMap.get(studentId).push({
              courseName: course.courseName,
              courseCode: course.courseCode,
              section: course.section,
              semester: course.semester,
              year: course.year
            });
          });
        }
      });

      const uniqueStudentIds = Array.from(allStudentIds);
      console.log(`📚 Found ${uniqueStudentIds.length} unique students from instructor courses`);
      console.log("🔍 uniqueStudentIds type:", typeof uniqueStudentIds);
      console.log("🔍 uniqueStudentIds is Array:", Array.isArray(uniqueStudentIds));
      console.log("🔍 Sample student IDs:", uniqueStudentIds.slice(0, 5));

      // Convert back to Set for efficient lookup
      const uniqueStudentIdsSet = new Set(uniqueStudentIds);
      console.log("🔍 uniqueStudentIdsSet is Set:", uniqueStudentIdsSet instanceof Set);
      console.log("🔍 uniqueStudentIdsSet size:", uniqueStudentIdsSet.size);

      // Step 4: Fetch student details
      console.log("🔍 Step 4: Fetching student details...");
      const fetchedStudents = [];
      
      // Try common student paths
      const studentPaths = [
        ['students', 'CSEDS', 'III-A'],
        ['students', 'CSEDS', 'III-B'],
        ['students', 'CSEDS', 'III-C'],
        ['students', 'CSE_DS', 'III_A'],
        ['students', 'CSE_DS', 'III_B'],
        ['students', 'CSE_DS', 'III_C'],
      ];

      for (const pathSegments of studentPaths) {
        try {
          const studentsRef = collection(db, ...pathSegments);
          const studentsSnap = await getDocs(studentsRef);
          console.log(`📚 Found ${studentsSnap.docs.length} students in ${pathSegments.join('/')}`);
          fetchedStudents.push(...studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          console.log(`❌ Failed to fetch from ${pathSegments.join('/')}`);
        }
      }

      // Step 5: Filter and map students
      const instructorStudents = fetchedStudents
        .filter(student => {
          // Ensure uniqueStudentIds is a Set and student.id exists
          if (!uniqueStudentIdsSet || !(uniqueStudentIdsSet instanceof Set)) {
            console.log("❌ uniqueStudentIdsSet is not a valid Set:", uniqueStudentIdsSet);
            return false;
          }
          if (!student || !student.id) {
            console.log("❌ Student or student.id is missing:", student);
            return false;
          }
          return uniqueStudentIdsSet.has(student.id);
        })
        .map(student => ({
          ...student,
          enrolledCourses: courseStudentMap.get(student.id) || [],
          totalCourses: (courseStudentMap.get(student.id) || []).length
        }));

      console.log(`✅ Found ${instructorStudents.length} instructor students`);

      // If no instructor students found, show all students as fallback
      if (instructorStudents.length === 0) {
        console.log("⚠️ No instructor students found, showing all students");
        const allStudents = fetchedStudents.map(student => ({
          ...student,
          enrolledCourses: [],
          totalCourses: 0
        }));
        setStudents(allStudents);
      } else {
        setStudents(instructorStudents);
      }

      const loadTime = Date.now() - startTime;
      setLoadTime(loadTime);
      console.log(`🚀 Data loaded in ${loadTime}ms`);

    } catch (error) {
      console.error("Data fetch failed:", error);
      setError("Failed to load data. Please try again.");
      dataFetched.current = false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Instant display from cache, then background refresh
  useEffect(() => {
    const cachedData = getCachedData();
    if (cachedData) {
      setStudents(cachedData);
      setLoading(false);
      // Start background refresh
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
  }, [getCachedData]);

  // Background data fetching
  useEffect(() => {
    let unsubscribe;
    
    const initializeData = async () => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setError("No user is logged in.");
          setLoading(false);
          setIsRefreshing(false);
          return;
        }

        // If we have cached data, refresh in background
        if (students.length > 0) {
          fetchDataUltraFast(user);
        } else {
          // No cache, fetch immediately
          await fetchDataUltraFast(user);
        }
      });
    };

    initializeData();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchDataUltraFast, students.length]);

  // Optimized filtering and sorting
  const filteredStudents = useMemo(() => {
    let base = students;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      base = base.filter(student =>
        (student.name || '').toLowerCase().includes(term) ||
        (student.email || '').toLowerCase().includes(term) ||
        (student.rollNo || '').toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    return base.sort((a, b) => {
      if (sortOption === "name") {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
  }, [students, searchTerm, sortOption]);

  // Force refresh function
  const handleRefresh = useCallback(async () => {
    console.log("🔄 Manual refresh triggered");
    setIsRefreshing(true);
    dataFetched.current = false; // Reset the flag to allow fresh data fetch
    
    // Clear cache
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      console.log("🗑️ Cache cleared");
    } catch (error) {
      console.log("Cache clear failed:", error);
    }
    
    const user = auth.currentUser;
    if (user) {
      console.log("🔄 Starting fresh data fetch for user:", user.uid);
      await fetchDataUltraFast(user);
    } else {
      console.log("❌ No user found for refresh");
      setIsRefreshing(false);
    }
  }, [fetchDataUltraFast]);

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <div className="h-16 bg-gray-200 rounded-2xl mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-xl w-1/3 animate-pulse"></div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in border border-gray-100" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mr-6 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="flex gap-3 mb-6">
                  <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && students.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-blue-600 text-6xl mb-6 animate-bounce" />
          <div className="text-gray-800 text-xl font-semibold mb-6">{error}</div>
          <button
            onClick={handleRefresh}
            className="btn-campus-primary inline-flex items-center gap-3 px-8 py-4 rounded-xl shadow-lg transition-all duration-300 text-lg font-medium"
          >
            <FontAwesomeIcon icon={faSync} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="page-container">
        
        {/* Instructor Summary Section */}
        {facultyData && (
          <div className="compact-card mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{facultyData.name}</h2>
                  <p className="text-sm text-gray-600">{facultyData.designation} • {facultyData.department}</p>
                  {instructorCourses.length > 0 ? (
                    <p className="text-xs text-gray-500">Teaching {instructorCourses.length} course{instructorCourses.length !== 1 ? 's' : ''}</p>
                  ) : (
                    <p className="text-xs text-orange-600">No instructor courses found for this semester</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{instructorCourses.length}</div>
                <div className="text-xs text-gray-500">Active Courses</div>
              </div>
            </div>
          </div>
        )}

        {/* Instructor Course Details Section */}
        {instructorCourses.length > 0 ? (
          <div className="compact-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-blue-600 text-xl" />
                <h2 className="text-lg font-semibold text-gray-900">Your Teaching Courses</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {instructorCourses.length} course{instructorCourses.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={() => setShowCourseDetails(!showCourseDetails)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
              >
                {showCourseDetails ? 'Hide Details' : 'Show Details'}
                <FontAwesomeIcon icon={showCourseDetails ? faArrowLeft : faArrowRight} className="text-xs" />
              </button>
            </div>
            
            {showCourseDetails && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {instructorCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 hover:shadow-md transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{course.courseName}</h3>
                        <p className="text-xs text-gray-600 mb-2">{course.courseCode}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <FontAwesomeIcon icon={faGraduationCap} className="text-blue-600" />
                          <span>{course.year} Year - {course.section} Section</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {course.credits || 3} Credits
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FontAwesomeIcon icon={faUsers} className="text-blue-600" />
                        <span>
                          {course.students && Array.isArray(course.students) 
                            ? course.students.length 
                            : (course.studentsBySection && typeof course.studentsBySection === 'object' 
                              ? Object.values(course.studentsBySection).flat().length 
                              : 0)} students
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
                        <span>{course.displayDepartment || 'Computer Science & Engineering (Data Science)'}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/courses/${course.year}/${course.section}/${course.semester}/${course.courseId}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-md transition-colors duration-200"
                      >
                        View Course
                      </button>
                      <button
                        onClick={() => navigate(`/attendance/${course.courseId}`)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-md transition-colors duration-200"
                      >
                        Attendance
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="compact-card mb-6">
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Instructor Courses Found</h3>
              <p className="text-gray-600 mb-4">
                You are not currently assigned as an instructor for any courses this semester.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                <p className="mb-2"><strong>Debug Information:</strong></p>
                <p>• Faculty AuthUid: {facultyData?.authUid || 'Not found'}</p>
                <p>• Department: {facultyData?.department || 'Not found'}</p>
                <p>• Instructor Courses Found: {instructorCourses.length}</p>
                <p>• Found {students.length} total students in fallback</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              {instructorCourses.length > 0 ? 'Your Students' : 'All Students'}
            </h1>
            <span className="text-xs text-gray-500">{loadTime > 0 ? `Loaded in ${loadTime}ms` : 'Loading...'}</span>
            {isRefreshing && (
              <span className="flex items-center gap-1 text-xs text-blue-600">
                <FontAwesomeIcon icon={faSync} className="animate-spin" />
                Refreshing
              </span>
            )}
            {instructorCourses.length === 0 && (
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                Fallback Data
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xl font-semibold text-gray-900">{filteredStudents.length}</div>
              <div className="text-xs text-gray-500">
                {instructorCourses.length > 0 ? 'Students in Your Courses' : 'Total Students'}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-campus-primary inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSync} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>



        <div className="compact-card mb-6">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search students by name, email, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-gray-50"
                />
              </div>
            </div>
            <div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-gray-50"
              >
                <option value="name">Sort by Name</option>
                <option value="rollNo">Sort by Roll No</option>
              </select>
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student, index) => (
            <div
              key={student.id}
              className="group bg-white rounded-lg border p-4 hover:shadow-md animate-fade-in cursor-pointer transition-all"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/students/${student.year || 'II'}/${student.section || 'A'}/${student.id}`)}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faUserGraduate} className="text-sm" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{student.name || 'Unknown'}</h3>
                  <p className="text-xs text-gray-600">{student.rollNo || 'N/A'}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mb-1"></div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {student.totalCourses || 0} course{student.totalCourses !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-sm" />
                  <span className="truncate">{student.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faIdCard} className="text-blue-600 text-sm" />
                  <span>{student.rollNo || 'No Roll No'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-blue-600 text-sm" />
                  <span>{student.year || 'N/A'}-{student.section || 'N/A'}</span>
                </div>
              </div>

              {/* Enrolled Courses Section */}
              {student.enrolledCourses && student.enrolledCourses.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="text-blue-600 text-xs" />
                    <span className="text-xs font-medium text-gray-700">Enrolled in Your Courses:</span>
                  </div>
                  <div className="space-y-1">
                    {student.enrolledCourses.slice(0, 2).map((course, courseIndex) => (
                      <div key={courseIndex} className="bg-blue-50 rounded px-2 py-1">
                        <div className="text-xs font-medium text-blue-800">{course.courseName}</div>
                        <div className="text-xs text-blue-600">
                          {course.courseCode} • {course.section} • {course.semester} sem
                        </div>
                      </div>
                    ))}
                    {student.enrolledCourses.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{student.enrolledCourses.length - 2} more course{student.enrolledCourses.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-4">
                <span className="status-active inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                  Active
                </span>
                <span className="status-completed inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                  {student.year || 'N/A'}-{student.section || 'N/A'}
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); navigate(`/students/${student.year || 'II'}/${student.section || 'A'}/${student.id}`); }}
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium transition-all text-sm"
                >
                  View Details
                  <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </section>

                      {filteredStudents.length === 0 && !loading && (
                <div className="text-center py-16">
                  <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
                    <FontAwesomeIcon icon={faUsers} className="text-gray-400 text-6xl mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-700 mb-3">No students found</h3>
                    <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria.</p>
                  </div>
                </div>
              )}
      </div>
    </div>
  );
};

export default StudentList;

