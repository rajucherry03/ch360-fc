import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coursesMeta, setCoursesMeta] = useState([]); // {id, name, year, section, semester}
  const [courseFilter, setCourseFilter] = useState("");
  const [courseIdFilter, setCourseIdFilter] = useState("");
  const [courseToStudentIds, setCourseToStudentIds] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for refreshing indicator

  // Instant render from cache, then refresh in background
  useEffect(() => {
    try {
      const cached = localStorage.getItem("studentsCache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setStudents(parsed);
          setLoading(false);
          // Start background refresh immediately
          setIsRefreshing(true);
        }
      }
    } catch (_) {}
  }, []);

  // Prefetch data on mount for faster subsequent loads
  useEffect(() => {
    const prefetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Check if we need to prefetch (only if no cache exists)
        const cached = localStorage.getItem("studentsCache");
        if (cached) return;

        // Start prefetching in background
        const cg = collectionGroup(db, "courseDetails");
        const qy = query(cg, where("instructor", "==", user.uid));
        const snap = await getDocs(qy);
        
        if (snap.docs.length > 0) {
          // Cache the course data for faster loading
          const courses = snap.docs.map(d => {
            const seg = d.ref.path.split("/");
            return {
              id: d.id,
              year: seg[1],
              section: seg[2],
              semester: seg[3],
              ...d.data(),
            };
          });
          
          localStorage.setItem("coursesCache", JSON.stringify(courses));
        }
      } catch (error) {
        // Silently fail prefetch - it's just for optimization
        console.log("Prefetch failed:", error);
      }
    };

    prefetchData();
  }, []);

  useEffect(() => {
    let unsubscribe;

    const fetchStudentsByFaculty = async () => {
      try {
        // If we already showed cached data, keep UI responsive
        if (students.length === 0) setLoading(true);
        setError(null);

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            setIsRefreshing(false);
            return;
          }

          // 1) Find all courses taught by this faculty - OPTIMIZED
          const foundCourses = [];
          try {
            const cg = collectionGroup(db, "courseDetails");
            const qy = query(cg, where("instructor", "==", user.uid));
            const snap = await getDocs(qy);
            snap.forEach((d) => {
              const seg = d.ref.path.split("/");
              foundCourses.push({
                id: d.id,
                year: seg[1],
                section: seg[2],
                semester: seg[3],
                ...d.data(),
              });
            });
          } catch (_) {
            // OPTIMIZED fallback - run queries in parallel instead of nested loops
            const years = ["I","II","III","IV"];
            const sections = ["A","B","C","D","E","F"];
            const semesters = ["sem1","sem2"];
            
            const parallelQueries = [];
            for (const y of years) {
              for (const sec of sections) {
                for (const sem of semesters) {
                  const col = collection(db, "courses", y, sec, sem, "courseDetails");
                  const qy2 = query(col, where("instructor", "==", user.uid));
                  parallelQueries.push(getDocs(qy2).then(s2 => 
                    s2.docs.map(d => ({ id: d.id, year: y, section: sec, semester: sem, ...d.data() }))
                  ));
                }
              }
            }
            
            const results = await Promise.all(parallelQueries);
            results.forEach(courses => foundCourses.push(...courses));
          }

          // Save minimal course meta for filters
          const meta = foundCourses.map((c) => ({ id: c.id, name: c.courseName, year: c.year, section: c.section, semester: c.semester }));
          setCoursesMeta(meta);

          // Build course->studentIds map
          const map = {};
          foundCourses.forEach((c) => {
            map[c.id] = new Set();
            (c.students || []).forEach((s) => {
              const sid = typeof s === 'string' ? s : (s?.id || s?.studentId || s);
              if (sid) map[c.id].add(sid);
            });
          });

          // 2) Group IDs by (year, section) and batch-fetch with documentId() IN queries (up to 10 per request)
          const yearSectionToIds = new Map();
          foundCourses.forEach((c) => {
            (c.students || []).forEach((s) => {
              const sid = typeof s === 'string' ? s : (s?.id || s?.studentId || s);
              if (!sid) return;
              const key = `${c.year}|${c.section}`;
              if (!yearSectionToIds.has(key)) yearSectionToIds.set(key, new Set());
              yearSectionToIds.get(key).add(sid);
            });
          });

          // OPTIMIZED: Run all student fetches in parallel
          const studentDetails = [];
          const parallelStudentQueries = [];

          // Batch by groups and chunks of 10 - but run all chunks in parallel
          for (const [key, idSet] of yearSectionToIds.entries()) {
            const [y, sec] = key.split('|');
            const ids = Array.from(idSet);
            for (let i = 0; i < ids.length; i += 10) {
              const chunk = ids.slice(i, i + 10);
              const col = collection(db, `students/${y}/${sec}`);
              
              parallelStudentQueries.push(
                getDocs(query(col, where(documentId(), 'in', chunk)))
                  .then(qs => qs.docs.map(d => ({ id: d.id, year: y, section: sec, ...d.data() })))
                  .catch(async (_) => {
                    // Fallback to per-doc fetch if 'in' not supported for this path
                    const fallbacks = await Promise.all(chunk.map((sid) => getDoc(doc(db, `students/${y}/${sec}/${sid}`))));
                    return fallbacks
                      .filter(snap => snap.exists())
                      .map(snap => ({ id: snap.id, year: y, section: sec, ...snap.data() }));
                  })
              );
            }
          }

          // Execute all student queries in parallel
          const studentResults = await Promise.all(parallelStudentQueries);
          studentResults.forEach(students => studentDetails.push(...students));

          // OPTIMIZED: Root-level fallback - also run in parallel
          const foundIds = new Set(studentDetails.map((s) => s.id));
          const missing = [];
          yearSectionToIds.forEach((set) => set.forEach((sid) => { if (!foundIds.has(sid)) missing.push(sid); }));
          
          if (missing.length > 0) {
            const rootQueries = [];
            for (let i = 0; i < missing.length; i += 10) {
              const chunk = missing.slice(i, i + 10);
              rootQueries.push(
                getDocs(query(collection(db, 'students'), where(documentId(), 'in', chunk)))
                  .then(qs => qs.docs.map(d => ({ id: d.id, ...d.data() })))
                  .catch(async (_) => {
                    // Final fallback: per-doc - also run in parallel
                    const snaps = await Promise.all(chunk.map((sid) => getDoc(doc(db, `students/${sid}`))));
                    return snaps
                      .filter(snap => snap.exists())
                      .map(snap => ({ id: snap.id, ...snap.data() }));
                  })
              );
            }
            
            const rootResults = await Promise.all(rootQueries);
            rootResults.forEach(students => studentDetails.push(...students));
          }

          if (studentDetails.length === 0) {
            setError("No students found for the courses taught by this faculty.");
          }
          setStudents(studentDetails);
          setCourseToStudentIds(Object.fromEntries(Object.entries(map).map(([k,v]) => [k, Array.from(v)])));
          try { localStorage.setItem("studentsCache", JSON.stringify(studentDetails)); } catch (_) {}
          setLoading(false);
          setIsRefreshing(false);
        });
      } catch (err) {
        console.error("Error initializing student fetching:", err);
        setError("Error initializing student fetching.");
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchStudentsByFaculty();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [students.length]);

  const filteredStudents = useMemo(() => {
    let base = students;
    // Apply course filters if present
    if (courseFilter) {
      const ids = new Set(courseToStudentIds[courseFilter] || []);
      base = base.filter((s) => ids.has(s.id));
    }
    if (courseIdFilter.trim()) {
      const ids = new Set(courseToStudentIds[courseIdFilter.trim()] || []);
      base = base.filter((s) => ids.has(s.id));
    }
    return base
    .filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [students, searchTerm, sortOption, courseFilter, courseIdFilter, courseToStudentIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="h-12 shimmer rounded-lg mb-4"></div>
            <div className="h-6 shimmer rounded w-1/3"></div>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
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
        <header className="mb-8 flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <FontAwesomeIcon icon={faUserGraduate} className="text-indigo-600 animate-pulse"/>
              Student Directory
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-indigo-400"/>
              All students across your courses
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg px-6 py-4 text-gray-700 border border-white/20 animate-fade-in">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-indigo-500"/>
              <span className="font-medium">Total Students:</span>
              <span className="font-bold text-indigo-600 text-xl">{filteredStudents.length}</span>
            </div>
            {isRefreshing && (
              <div className="flex items-center gap-2 mt-2 text-sm text-indigo-500">
                <FontAwesomeIcon icon={faClock} className="animate-spin"/>
                <span>Refreshing...</span>
              </div>
            )}
          </div>
        </header>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/20 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="relative w-full md:w-1/3">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"/>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-3 border border-indigo-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="p-3 border border-indigo-200 rounded-lg mt-3 md:mt-0 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="name">Sort by Name</option>
            </select>
            <div className="flex items-center gap-3 mt-3 md:mt-0">
              <FontAwesomeIcon icon={faFilter} className="text-indigo-500"/>
              <select
                className="p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="">All Courses</option>
                {coursesMeta.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.id} • {c.year}-{c.section} {c.semester?.toUpperCase()}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Filter by Course ID"
                className="p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                value={courseIdFilter}
                onChange={(e) => setCourseIdFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student, index) => (
            <div
              key={student.id}
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={student.profilePicture || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full mr-4 object-cover ring-4 ring-indigo-100 group-hover:ring-indigo-300 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xs" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300">
                    {student.name}
                  </h3>
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-indigo-400 text-sm"/>
                    {student.email}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {student.year && student.section && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200">
                        <FontAwesomeIcon icon={faGraduationCap} className="mr-1"/>
                        {student.year}-{student.section}
                      </span>
                    )}
                    {student.rollNo && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
                        <FontAwesomeIcon icon={faIdCard} className="mr-1"/>
                        Roll: {student.rollNo}
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/students/${student.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span>View Details</span>
                      <FontAwesomeIcon icon={faArrowRight} className="text-sm group-hover:translate-x-1 transition-transform duration-300"/>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <FontAwesomeIcon icon={faUsers} className="text-gray-300 text-6xl mb-4 animate-pulse-slow"/>
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No students found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
