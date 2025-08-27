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

  // Ultra-optimized data fetching with parallel execution
  const fetchDataUltraFast = useCallback(async (user) => {
    if (!user || dataFetched.current) return;
    
    dataFetched.current = true;
    const fetchStart = Date.now();
    
    try {
      // Step 1: Try collectionGroup query first (fastest if index exists)
      let foundCourses = [];
      try {
        const cg = collectionGroup(db, "courseDetails");
        const qy = query(cg, where("instructor", "==", user.uid));
        const snap = await getDocs(qy);
        
        foundCourses = snap.docs.map(d => {
          const seg = d.ref.path.split("/");
          return {
            id: d.id,
            year: seg[1],
            section: seg[2],
            semester: seg[3],
            ...d.data(),
          };
        });
      } catch (error) {
        // Step 2: Ultra-parallel fallback - all queries at once
        const years = ["I","II","III","IV"];
        const sections = ["A","B","C","D","E","F"];
        const semesters = ["sem1","sem2"];
        
        const allQueries = [];
        for (const y of years) {
          for (const sec of sections) {
            for (const sem of semesters) {
              const col = collection(db, "courses", y, sec, sem, "courseDetails");
              const qy = query(col, where("instructor", "==", user.uid));
              allQueries.push(
                getDocs(qy).then(snap => 
                  snap.docs.map(d => ({ 
                    id: d.id, 
                    year: y, 
                    section: sec, 
                    semester: sem, 
                    ...d.data() 
                  }))
                ).catch(() => []) // Ignore errors for speed
              );
            }
          }
        }
        
        const results = await Promise.all(allQueries);
        results.forEach(courses => foundCourses.push(...courses));
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
        
        (course.students || []).forEach(student => {
          const sid = typeof student === 'string' ? student : (student?.id || student?.studentId || student);
          if (sid) {
            const key = `${course.year}|${course.section}`;
            if (!studentIdGroups.has(key)) {
              studentIdGroups.set(key, new Set());
            }
            studentIdGroups.get(key).add(sid);
          }
        });
      });

      setCoursesMeta(courseMeta);

      // Step 4: Ultra-parallel student fetching with batching
      const allStudentQueries = [];
      const courseToStudentMap = {};

      // Build course to student mapping
      foundCourses.forEach(course => {
        courseToStudentMap[course.id] = [];
        (course.students || []).forEach(student => {
          const sid = typeof student === 'string' ? student : (student?.id || student?.studentId || student);
          if (sid) courseToStudentMap[course.id].push(sid);
        });
      });

      setCourseToStudentIds(courseToStudentMap);

      // Fetch students in parallel batches
      for (const [key, idSet] of studentIdGroups.entries()) {
        const [year, section] = key.split('|');
        const ids = Array.from(idSet);
        
        // Batch in chunks of 10 for optimal performance
        for (let i = 0; i < ids.length; i += 10) {
          const chunk = ids.slice(i, i + 10);
          const col = collection(db, `students/${year}/${section}`);
          
          allStudentQueries.push(
            getDocs(query(col, where(documentId(), 'in', chunk)))
              .then(snap => snap.docs.map(d => ({ 
                id: d.id, 
                year, 
                section, 
                ...d.data() 
              })))
              .catch(async () => {
                // Fallback: individual fetches in parallel
                const individualQueries = chunk.map(sid => 
                  getDoc(doc(db, `students/${year}/${section}/${sid}`))
                    .then(snap => snap.exists() ? { id: snap.id, year, section, ...snap.data() } : null)
                    .catch(() => null)
                );
                const results = await Promise.all(individualQueries);
                return results.filter(Boolean);
              })
          );
        }
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

