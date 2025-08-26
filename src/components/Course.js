import React, { useEffect, useState } from "react";
import { collection, collectionGroup, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase"; // Firebase configuration
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChalkboardTeacher, 
  faBookOpen, 
  faUsers, 
  faCalendarAlt, 
  faClock, 
  faExclamationTriangle,
  faGraduationCap,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const FacultyCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

          // Fast: collection group query across all courseDetails
          const foundCourses = [];
          try {
            const cg = collectionGroup(db, "courseDetails");
            const qy = query(cg, where("instructor", "==", user.uid));
            const snap = await getDocs(qy);
            snap.forEach((docSnap) => {
              const segments = docSnap.ref.path.split("/");
              const year = segments[1];
              const section = segments[2];
              const semester = segments[3];
              foundCourses.push({ id: docSnap.id, year, section, semester, ...docSnap.data() });
            });
          } catch (e) {
            // Fallback without index: fire all queries in parallel across a constrained set (I–IV, A–F, sem1/sem2)
            const years = ["I","II","III","IV"];
            const sections = ["A","B","C","D","E","F"];
            const semesters = ["sem1","sem2"];
            const tasks = [];
            years.forEach((y) => {
              sections.forEach((sec) => {
                semesters.forEach((sem) => {
                  const col = collection(db, "courses", y, sec, sem, "courseDetails");
                  tasks.push(getDocs(query(col, where("instructor", "==", user.uid))));
                });
              });
            });
            const results = await Promise.all(tasks);
            results.forEach((snap2) => {
              snap2.forEach((d) => {
                const seg = d.ref.path.split("/");
                foundCourses.push({ id: d.id, year: seg[1], section: seg[2], semester: seg[3], ...d.data() });
              });
            });
          }

          if (foundCourses.length === 0) {
            setError("No courses assigned to this faculty.");
            setCourses([]);
          } else {
            setCourses(foundCourses);
            setError(null);
          }

          setLoading(false);
        });
      } catch (err) {
        setError("Error fetching faculty courses.");
        setLoading(false);
      }
    };

    fetchFacultyCourses();
  }, []);

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

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="text-center">
          <FontAwesomeIcon icon={faBookOpen} className="text-gray-300 text-6xl mb-4 animate-pulse-slow" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No courses available</h3>
          <p className="text-gray-400">No courses have been assigned to this faculty yet.</p>
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
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-indigo-600 animate-pulse"/>
              My Courses
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faBookOpen} className="text-indigo-400"/>
              Here is the list of courses you are teaching
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

        <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/courses/${course.year}/${course.section}/${course.semester}/courseDetails/${course.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={faBookOpen} className="text-white text-xl" />
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faArrowRight} className="text-indigo-400 group-hover:translate-x-1 transition-transform duration-300"/>
                </div>
              </div>
              
              <h3 className="text-xl font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 mb-2">
                {course.courseName || course.id}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {course.description || "Course description not available"}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200">
                  <FontAwesomeIcon icon={faGraduationCap} className="mr-1"/>
                  {course.year}-{course.section}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1"/>
                  {course.semester?.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-indigo-400"/>
                  <span>{course.students?.length || 0} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-indigo-400"/>
                  <span>{course.credits || 3} Credits</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default FacultyCourseList;
