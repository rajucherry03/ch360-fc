import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, collectionGroup, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore";
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
  faArrowLeft
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
  const [coursesMeta, setCoursesMeta] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [courseIdFilter, setCourseIdFilter] = useState("");
  const [courseToStudentIds, setCourseToStudentIds] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadTime, setLoadTime] = useState(0);
  
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

  // DYNAMIC UNIVERSAL FETCH - Works with any Firestore structure
  const fetchDataUltraFast = useCallback(async (user) => {
    if (!user || dataFetched.current) return;
    
    dataFetched.current = true;
    const fetchStart = Date.now();
    
    try {
      console.log("🚀 Dynamic course fetch starting for user:", user.uid);
      
      // Step 1: Fetch faculty data to get course IDs
      let facultyData = null;
      try {
        // Try multiple faculty paths dynamically
        const facultyPathVariations = [
          ['faculty', facultyData?.departmentKey || 'CSE_DS', 'members', user.uid],
          ['faculty', 'CSE_DS', 'members', user.uid],
          ['faculty', 'CSEDS', 'members', user.uid],
          ['faculty', 'CSE', 'members', user.uid],
          ['faculty', user.uid],
          ['users', 'faculty', user.uid],
        ];

        for (const pathSegments of facultyPathVariations) {
          try {
            const facultyRef = doc(db, ...pathSegments);
            const facultySnap = await getDoc(facultyRef);
            if (facultySnap.exists()) {
              facultyData = facultySnap.data();
              console.log("✅ Faculty data fetched:", facultyData.name);
              break;
            }
          } catch (error) {
            // Continue to next variation
          }
        }
      } catch (error) {
        console.log("❌ Could not fetch faculty data:", error);
      }

      // Step 2: Get course IDs from faculty data
      const allCourseIds = [];
      
      if (facultyData?.courses && Array.isArray(facultyData.courses)) {
        allCourseIds.push(...facultyData.courses);
      }
      
      if (facultyData?.teaching) {
        Object.keys(facultyData.teaching).forEach(section => {
          if (Array.isArray(facultyData.teaching[section])) {
            allCourseIds.push(...facultyData.teaching[section]);
          }
        });
      }
      
      const uniqueCourseIds = [...new Set(allCourseIds)];
      console.log("📚 Course IDs from faculty data:", uniqueCourseIds);

      // Step 3: Dynamic course fetching
      let foundCourses = [];

      if (uniqueCourseIds.length > 0) {
        console.log("🚀 Dynamic course fetch using course IDs:", uniqueCourseIds);
        
        // Dynamic course fetching function
        const fetchCourseDynamically = async (courseId) => {
                  // Strategy 1: Try collectionGroup query first (universal)
        try {
          const cg = collectionGroup(db, "courseDetails");
          const q = query(cg, where(documentId(), "==", courseId));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const courseData = snap.docs[0].data();
            console.log("✅ Found course via collectionGroup:", courseData.courseName);
            return {
              id: courseId,
              year: courseData.displayYear || "III",
              section: courseData.displaySection || "A",
              semester: courseData.displaySemester || "5",
              courseName: courseData.courseName || `Course ${courseId}`,
              courseCode: courseData.courseCode || courseId,
              instructorName: facultyData?.name,
              instructor: courseData.instructor,
              department: courseData.displayDepartment || "Computer Science & Engineering (Data Science)",
              credits: courseData.credits || 3,
              description: courseData.description || `Course ${courseId} - ${facultyData?.name}`,
              studentsBySection: courseData.studentsBySection || {},
              masterCoursePath: courseData.masterCoursePath,
              semesterKey: courseData.semesterKey || "III_5",
              students: courseData.students || []
            };
          }
        } catch (error) {
          console.log("❌ CollectionGroup failed for course:", courseId);
        }

                  // Strategy 2: Try multiple path variations dynamically
        const pathVariations = [
          // Dynamic department-based paths
          ['courses', facultyData?.departmentKey || 'CSE_DS', 'year_sem', 'III_5', 'courseDetails', courseId],
          ['courses', facultyData?.departmentKey || 'CSE_DS', 'year_sem', 'III_6', 'courseDetails', courseId],
          ['courses', facultyData?.departmentKey || 'CSE_DS', 'year_sem', 'III_7', 'courseDetails', courseId],
          ['courses', facultyData?.departmentKey || 'CSE_DS', 'year_sem', 'III_8', 'courseDetails', courseId],
          // Generic department variations
          ['courses', 'CSE_DS', 'year_sem', 'III_5', 'courseDetails', courseId],
          ['courses', 'CSEDS', 'year_sem', 'III_5', 'courseDetails', courseId],
          ['courses', 'CSE', 'year_sem', 'III_5', 'courseDetails', courseId],
          // Direct course structure
          ['courses', courseId],
          ['courseDetails', courseId],
        ];

          

          for (const pathSegments of pathVariations) {
            try {
              const coursePath = doc(db, ...pathSegments);
              const courseSnap = await getDoc(coursePath);
              if (courseSnap.exists()) {
                const courseData = courseSnap.data();
                console.log("✅ Found course via path variation:", pathSegments.join('/'));
                return {
                  id: courseId,
                  year: courseData.displayYear || "III",
                  section: courseData.displaySection || "A",
                  semester: courseData.displaySemester || "5",
                  courseName: courseData.courseName || `Course ${courseId}`,
                  courseCode: courseData.courseCode || courseId,
                  instructorName: facultyData?.name,
                  instructor: courseData.instructor,
                  department: courseData.displayDepartment || "Computer Science & Engineering (Data Science)",
                  credits: courseData.credits || 3,
                  description: courseData.description || `Course ${courseId} - ${facultyData?.name}`,
                  studentsBySection: courseData.studentsBySection || {},
                  masterCoursePath: courseData.masterCoursePath,
                  semesterKey: courseData.semesterKey || "III_5",
                  students: courseData.students || []
                };
              }
            } catch (error) {
              // Continue to next variation
            }
          }

          console.log("❌ No course found for ID:", courseId);
          return null;
        };

        // Fetch all courses dynamically
        const coursePromises = uniqueCourseIds.map(courseId => fetchCourseDynamically(courseId));
        const results = await Promise.all(coursePromises);
        foundCourses = results.filter(course => course !== null);
        console.log("✅ Dynamic fetch found:", foundCourses.length, "courses");
      }

      // Step 3: Extract all student IDs and group by year/section
      const studentIdGroups = new Map();
      const courseMeta = [];
      
      foundCourses.forEach(course => {
        courseMeta.push({
          id: course.id,
          name: course.courseName,
          year: course.year,
          section: course.section,
          semester: course.semester
        });
        
        // Handle different student data structures
        if (course.studentsBySection && typeof course.studentsBySection === 'object') {
          console.log("📚 Found studentsBySection structure for course:", course.courseName);
          Object.keys(course.studentsBySection).forEach(sectionKey => {
            if (Array.isArray(course.studentsBySection[sectionKey])) {
              course.studentsBySection[sectionKey].forEach(studentId => {
                const key = `${course.year}|${sectionKey}`;
                if (!studentIdGroups.has(key)) {
                  studentIdGroups.set(key, new Set());
                }
                studentIdGroups.get(key).add(studentId);
              });
            }
          });
        } else if (course.students && Array.isArray(course.students)) {
          console.log("📚 Found students array structure for course:", course.courseName);
          course.students.forEach(student => {
            const sid = typeof student === 'string' ? student : (student?.id || student?.studentId || student);
            if (sid) {
              const key = `${course.year}|${course.section}`;
              if (!studentIdGroups.has(key)) {
                studentIdGroups.set(key, new Set());
              }
              studentIdGroups.get(key).add(sid);
            }
          });
        }
      });

      setCoursesMeta(courseMeta);

      // Step 4: Dynamic student fetching
      const allStudentQueries = [];
      const courseToStudentMap = {};

      // Build course to student mapping
      foundCourses.forEach(course => {
        courseToStudentMap[course.id] = [];
        
        if (course.studentsBySection && typeof course.studentsBySection === 'object') {
          Object.keys(course.studentsBySection).forEach(sectionKey => {
            if (Array.isArray(course.studentsBySection[sectionKey])) {
              course.studentsBySection[sectionKey].forEach(studentId => {
                courseToStudentMap[course.id].push(studentId);
              });
            }
          });
        } else if (course.students && Array.isArray(course.students)) {
          course.students.forEach(student => {
            const sid = typeof student === 'string' ? student : (student?.id || student?.studentId || student);
            if (sid) courseToStudentMap[course.id].push(sid);
          });
        }
      });

      setCourseToStudentIds(courseToStudentMap);

      // Dynamic student fetching with multiple path variations
      for (const [key, idSet] of studentIdGroups.entries()) {
        const [year, section] = key.split('|');
        const ids = Array.from(idSet);
        
        console.log(`📚 Fetching ${ids.length} students for ${year}-${section}`);
        
        // Dynamic student detail fetching
        const studentPromises = ids.map(async (studentId) => {
          const studentPathVariations = [
            // Dynamic department-based paths
            ['students', facultyData?.departmentKey || 'CSEDS', `${year}-${section}`, studentId],
            ['students', facultyData?.departmentKey || 'CSE_DS', `${year}_${section}`, studentId],
            // Generic department variations
            ['students', 'CSEDS', `${year}-${section}`, studentId],
            ['students', 'CSE_DS', `${year}_${section}`, studentId],
            ['students', 'CSE', `${year}-${section}`, studentId],
            // Common section variations
            ['students', 'CSEDS', 'III-A', studentId],
            ['students', 'CSE_DS', 'III_A', studentId],
            ['students', 'CSE', 'III-A', studentId],
            ['students', 'CSEDS', 'III-B', studentId],
            ['students', 'CSE_DS', 'III_B', studentId],
            ['students', 'CSEDS', 'III-C', studentId],
            ['students', 'CSE_DS', 'III_C', studentId],
            // Direct student structure
            ['students', studentId],
            ['studentDetails', studentId],
          ];

          for (const pathSegments of studentPathVariations) {
            try {
              const studentPath = doc(db, ...pathSegments);
              const studentSnap = await getDoc(studentPath);
              if (studentSnap.exists()) {
                return { 
                  id: studentId, 
                  year, 
                  section,
                  ...studentSnap.data() 
                };
              }
            } catch (error) {
              // Continue to next variation
            }
          }

          // Fallback student data
          return { 
            id: studentId, 
            name: `Student ${studentId}`, 
            rollNo: studentId,
            year,
            section
          };
        });

        allStudentQueries.push(Promise.all(studentPromises));
      }

      // Step 5: Execute all queries simultaneously
      const studentResults = await Promise.all(allStudentQueries);
      const allStudents = [];
      studentResults.forEach(students => allStudents.push(...students));

      // Step 6: Remove duplicates and set state
      const uniqueStudents = allStudents.filter((student, index, self) => 
        index === self.findIndex(s => s.id === student.id)
      );

      setStudents(uniqueStudents);
      
      // Step 7: Cache the results
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(uniqueStudents));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } catch (error) {
        console.log("Cache write failed:", error);
      }

      const loadTime = Date.now() - fetchStart;
      setLoadTime(loadTime);
      console.log(`🚀 Data loaded in ${loadTime}ms`);
      
    } catch (error) {
      console.error("Ultra-fast fetch failed:", error);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
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
    
    // Apply course filters
    if (courseFilter) {
      const ids = new Set(courseToStudentIds[courseFilter] || []);
      base = base.filter(s => ids.has(s.id));
    }
    
    if (courseIdFilter.trim()) {
      const ids = new Set(courseToStudentIds[courseIdFilter.trim()] || []);
      base = base.filter(s => ids.has(s.id));
    }
    
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
  }, [students, searchTerm, sortOption, courseFilter, courseIdFilter, courseToStudentIds]);

  // Force refresh function
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    dataFetched.current = false;
    
    // Clear cache
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    } catch (error) {
      console.log("Cache clear failed:", error);
    }
    
    const user = auth.currentUser;
    if (user) {
      await fetchDataUltraFast(user);
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
            <span className="text-xs text-gray-500">{loadTime > 0 ? `Loaded in ${loadTime}ms` : 'Loading...'}</span>
            {isRefreshing && (
              <span className="flex items-center gap-1 text-xs text-blue-600">
                <FontAwesomeIcon icon={faSync} className="animate-spin" />
                Refreshing
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xl font-semibold text-gray-900">{filteredStudents.length}</div>
              <div className="text-xs text-gray-500">Total Students</div>
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
          <div className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
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
            <div>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-gray-50"
              >
                <option value="">All Courses</option>
                {coursesMeta.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.year}-{course.section})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student, index) => (
            <div
              key={student.id}
              className="group bg-white rounded-lg border p-4 hover:shadow-sm animate-fade-in cursor-pointer transition-all"
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
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
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

